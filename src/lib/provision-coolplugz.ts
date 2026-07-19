import { createHash } from "crypto";
import { connectDB } from "@/lib/db";
import { Subscription } from "@/models/Subscription";
import { User } from "@/models/User";
import {
  assertCanStartFreeTrial,
  FREE_TRIAL_MS,
  getFreeTrialStatus,
  hasActiveFreeTrial,
} from "@/lib/free-trial";
import { hasActiveSubscription } from "@/lib/entitlements";

export type ProvisionCoolplugzInput = {
  email: string;
  tier: "pro" | "premium" | "trial";
  label?: string;
  /** Hours the MCP URL stays valid — used for card-free trial (server-side TTL). */
  ttlHours?: number;
};

export type ProvisionCoolplugzResult = {
  mcpUrl: string;
  provisioned: boolean;
  /** Server-authoritative expiry (trials). ISO string in API responses. */
  expiresAt?: Date | null;
};

export type ProvisionCoolplugzApiResult = {
  mcpUrl: string;
  expiresAt: Date | null;
};

function getCoolplugzApiConfig() {
  const baseUrl = process.env.COOLPLUGZ_API_URL?.replace(/\/$/, "");
  const adminSecret = process.env.COOLPLUGZ_ADMIN_SECRET;
  const useDummy =
    process.env.COOLPLUGZ_PROVISION_DUMMY === "true" || !baseUrl;
  return { baseUrl, adminSecret, useDummy };
}

/** Stable dummy URL for local dev until the CoolPlugz server is live. */
function createDummyMcpUrl(input: ProvisionCoolplugzInput): string {
  const base =
    process.env.COOLPLUGZ_DUMMY_MCP_BASE?.replace(/\/$/, "") ??
    "https://api.coolplugz.com/mcp";
  const slug = createHash("sha256")
    .update(
      `${input.email.toLowerCase().trim()}:${input.tier}:${input.ttlHours ?? "permanent"}`
    )
    .digest("hex")
    .slice(0, 16);
  const segment = input.tier === "trial" ? "trial" : input.tier;
  return `${base}/${segment}/${slug}`;
}

function createDummyProvisionResult(
  input: ProvisionCoolplugzInput
): ProvisionCoolplugzApiResult {
  const expiresAt =
    input.ttlHours != null
      ? new Date(Date.now() + input.ttlHours * 60 * 60 * 1000)
      : null;
  return { mcpUrl: createDummyMcpUrl(input), expiresAt };
}

function buildProvisionPayload(input: ProvisionCoolplugzInput) {
  return {
    email: input.email.toLowerCase().trim(),
    tier: input.tier,
    ...(input.label ? { label: input.label } : {}),
    ...(input.ttlHours != null ? { ttlHours: input.ttlHours } : {}),
  };
}

function parseExpiresAt(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Call the external CoolPlugz server to mint a unique MCP URL. */
export async function callCoolplugzProvisionApi(
  input: ProvisionCoolplugzInput
): Promise<ProvisionCoolplugzApiResult> {
  const { baseUrl, adminSecret, useDummy } = getCoolplugzApiConfig();
  const payload = buildProvisionPayload(input);

  if (useDummy) {
    if (process.env.NODE_ENV === "production" && process.env.COOLPLUGZ_PROVISION_DUMMY !== "true") {
      throw new Error("CoolPlugz provisioning is not configured (COOLPLUGZ_API_URL)");
    }
    console.warn("[CoolPlugz] Dummy provision — payload:", payload);
    return createDummyProvisionResult(input);
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (adminSecret) {
    headers.Authorization = `Bearer ${adminSecret}`;
  }

  const res = await fetch(`${baseUrl}/api/provision-coolplugz`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as {
    mcpUrl?: string;
    url?: string;
    expiresAt?: string;
    error?: string;
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      data.error || data.message || `CoolPlugz provision failed (${res.status})`
    );
  }

  const mcpUrl = data.mcpUrl || data.url;
  if (!mcpUrl) {
    throw new Error("CoolPlugz provision response missing mcpUrl");
  }

  return {
    mcpUrl,
    expiresAt: parseExpiresAt(data.expiresAt),
  };
}

/** Provision (or return existing) MCP URL for a user with an active paid subscription. */
export async function provisionCoolplugzForUser(
  userId: string,
  label?: string
): Promise<ProvisionCoolplugzResult | null> {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) return null;

  if (user.mcpUrl) {
    return { mcpUrl: user.mcpUrl, provisioned: false };
  }

  const subscription = await Subscription.findOne({
    userId,
    status: { $in: ["active", "trialing"] },
    currentPeriodEnd: { $gt: new Date() },
  });

  if (!subscription) {
    return null;
  }

  const { mcpUrl } = await callCoolplugzProvisionApi({
    email: user.email,
    tier: subscription.tier,
    label,
  });

  user.mcpUrl = mcpUrl;
  await user.save();

  return { mcpUrl, provisioned: true, expiresAt: null };
}

/** Card-free 7-day trial — unique MCP URL from CoolPlugz server (TTL managed there). */
export async function provisionFreeTrialForUser(
  userId: string,
  label?: string
): Promise<ProvisionCoolplugzResult> {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  await assertCanStartFreeTrial(userId);

  const trialStatus = await getFreeTrialStatus(userId);
  if (trialStatus.active && user.mcpUrl) {
    return {
      mcpUrl: user.mcpUrl,
      provisioned: false,
      expiresAt: trialStatus.endsAt,
    };
  }

  const ttlHours = FREE_TRIAL_MS / (60 * 60 * 1000);
  const { mcpUrl, expiresAt } = await callCoolplugzProvisionApi({
    email: user.email,
    tier: "trial",
    label,
    ttlHours,
  });

  const now = new Date();
  user.mcpUrl = mcpUrl;
  user.freeTrialStartedAt = now;
  user.freeTrialEndsAt = expiresAt ?? new Date(now.getTime() + FREE_TRIAL_MS);
  await user.save();

  return { mcpUrl, provisioned: true, expiresAt: user.freeTrialEndsAt };
}

/** True when user is on card-free trial (not Stripe). */
export async function isUserOnFreeTrial(userId: string) {
  if (await hasActiveSubscription(userId)) return false;
  return hasActiveFreeTrial(userId);
}

export async function getUserMcpUrl(userId: string): Promise<string | null> {
  await connectDB();
  const user = await User.findById(userId).select("mcpUrl freeTrialEndsAt");
  if (!user?.mcpUrl) return null;

  const subscribed = await hasActiveSubscription(userId);
  if (subscribed) return user.mcpUrl;

  if (user.freeTrialEndsAt && user.freeTrialEndsAt.getTime() > Date.now()) {
    return user.mcpUrl;
  }

  return null;
}
