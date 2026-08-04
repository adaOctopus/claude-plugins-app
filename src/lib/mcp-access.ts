import { connectDB } from "@/lib/db";
import { hasActiveSubscription } from "@/lib/entitlements";
import { getDailyPassStatus } from "@/lib/daily-pass";
import { getFreeTrialStatus } from "@/lib/free-trial";
import { User } from "@/models/User";

export type AccountUsageMode = "pro" | "trial" | "expired_trial" | "legacy_daily" | "none";

export type McpAccessContext = {
  mode: AccountUsageMode;
  canUseMcp: boolean;
  hasMcpUrl: boolean;
};

/** Unified MCP access for account UI and API gates — trial or Pro only (legacy daily pass supported). */
export async function getMcpAccessContext(userId: string): Promise<McpAccessContext> {
  await connectDB();

  const [user, subscribed, dailyStatus, trialStatus] = await Promise.all([
    User.findById(userId).select("mcpUrl"),
    hasActiveSubscription(userId),
    getDailyPassStatus(userId),
    getFreeTrialStatus(userId),
  ]);

  const hasMcpUrl = !!user?.mcpUrl;

  let mode: AccountUsageMode = "none";
  if (subscribed) {
    mode = "pro";
  } else if (trialStatus.active) {
    mode = "trial";
  } else if (dailyStatus.active) {
    mode = "legacy_daily";
  } else if (trialStatus.used && hasMcpUrl) {
    mode = "expired_trial";
  } else if (dailyStatus.startedAt && hasMcpUrl) {
    mode = "legacy_daily";
  }

  const canUseMcp =
    hasMcpUrl &&
    (subscribed || trialStatus.active || dailyStatus.active);

  return {
    mode,
    canUseMcp,
    hasMcpUrl,
  };
}

/** @deprecated Credit top-ups removed */
export async function canPurchaseTopUp(_userId: string): Promise<boolean> {
  return false;
}

export async function hasMcpUsageAccess(userId: string): Promise<boolean> {
  const ctx = await getMcpAccessContext(userId);
  return ctx.canUseMcp;
}
