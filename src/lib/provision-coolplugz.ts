import { connectDB } from "@/lib/db";
import { Subscription, type SubscriptionTier } from "@/models/Subscription";
import { User } from "@/models/User";

export type ProvisionCoolplugzInput = {
  email: string;
  tier: SubscriptionTier;
  label?: string;
};

export type ProvisionCoolplugzResult = {
  mcpUrl: string;
  provisioned: boolean;
};

function getCoolplugzApiConfig() {
  const baseUrl = process.env.COOLPLUGZ_API_URL?.replace(/\/$/, "");
  const adminSecret = process.env.COOLPLUGZ_ADMIN_SECRET;
  return { baseUrl, adminSecret };
}

/** Call the external CoolPlugz admin API to mint a unique MCP URL. */
export async function callCoolplugzProvisionApi(
  input: ProvisionCoolplugzInput
): Promise<string> {
  const { baseUrl, adminSecret } = getCoolplugzApiConfig();
  if (!baseUrl || !adminSecret) {
    throw new Error(
      "CoolPlugz provisioning is not configured (COOLPLUGZ_API_URL, COOLPLUGZ_ADMIN_SECRET)"
    );
  }

  const res = await fetch(`${baseUrl}/admin/provision`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminSecret}`,
    },
    body: JSON.stringify({
      email: input.email.toLowerCase().trim(),
      tier: input.tier,
      ...(input.label ? { label: input.label } : {}),
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    mcpUrl?: string;
    url?: string;
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

  return mcpUrl;
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

  const mcpUrl = await callCoolplugzProvisionApi({
    email: user.email,
    tier: subscription.tier,
    label,
  });

  user.mcpUrl = mcpUrl;
  await user.save();

  return { mcpUrl, provisioned: true };
}

export async function getUserMcpUrl(userId: string): Promise<string | null> {
  await connectDB();
  const user = await User.findById(userId).select("mcpUrl");
  return user?.mcpUrl ?? null;
}
