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

function normalizeApiBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (!trimmed) {
    throw new Error("COOLPLUGZ_API_URL is empty");
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function getCoolplugzApiConfig() {
  const rawBase = process.env.COOLPLUGZ_API_URL?.trim();
  const baseUrl = rawBase ? normalizeApiBaseUrl(rawBase) : undefined;
  const adminSecret = process.env.COOLPLUGZ_ADMIN_SECRET;
  const useDummy =
    process.env.COOLPLUGZ_PROVISION_DUMMY === "true" || !baseUrl;
  return { baseUrl, adminSecret, useDummy };
}

/** External MCP server provision endpoint (api.coolplugz.com uses /admin/keys). */
function buildProvisionRequestUrl(baseUrl: string): string {
  const configured = process.env.COOLPLUGZ_PROVISION_PATH?.trim();
  if (configured) {
    if (configured.startsWith("http://") || configured.startsWith("https://")) {
      return configured.replace(/\/$/, "");
    }
    const path = configured.startsWith("/") ? configured : `/${configured}`;
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}/admin/keys`;
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function buildMcpUrlFromKey(key: string, baseUrl: string): string | null {
  const template = process.env.COOLPLUGZ_MCP_URL_TEMPLATE?.trim();
  if (template) {
    return template.replace("{key}", encodeURIComponent(key));
  }

  try {
    const api = new URL(baseUrl);
    return `${api.origin}/mcp/${encodeURIComponent(key)}`;
  } catch {
    return null;
  }
}

function extractMcpUrlFromResponse(
  data: Record<string, unknown>,
  apiBaseUrl: string
): string | null {
  const direct = [data.mcpUrl, data.url, data.mcp_url].find(
    (value) => typeof value === "string" && isHttpUrl(value)
  );
  if (typeof direct === "string") {
    return direct;
  }

  const key =
    typeof data.key === "string"
      ? data.key
      : typeof data.apiKey === "string"
        ? data.apiKey
        : null;

  if (!key) {
    return null;
  }

  if (isHttpUrl(key)) {
    return key;
  }

  return buildMcpUrlFromKey(key, apiBaseUrl);
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

  const provisionUrl = buildProvisionRequestUrl(baseUrl!);
  let res: Response;

  try {
    res = await fetch(provisionUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("[CoolPlugz] Provision fetch failed:", provisionUrl, error);
    throw new Error("CoolPlugz provision request failed");
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown> & {
    error?: string;
    message?: string;
    expiresAt?: string;
  };

  if (!res.ok) {
    console.error("[CoolPlugz] Provision API error:", res.status, data);
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : typeof data.message === "string"
          ? data.message
          : `CoolPlugz provision failed (${res.status})`
    );
  }

  const mcpUrl = extractMcpUrlFromResponse(data, baseUrl!);
  if (!mcpUrl) {
    console.error("[CoolPlugz] Provision response missing MCP URL:", data);
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

  const { initializeUsageForTrial } = await import("@/lib/usage");
  const { syncUsageToCoolplugz } = await import("@/lib/sync-usage-to-coolplugz");
  await initializeUsageForTrial(userId, user.freeTrialEndsAt);
  try {
    await syncUsageToCoolplugz(userId);
  } catch (error) {
    console.error("Usage sync after trial provision failed:", error);
  }

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
