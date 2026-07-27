import { connectDB } from "@/lib/db";
import { hasActiveSubscription } from "@/lib/entitlements";
import { getFreeTrialStatus } from "@/lib/free-trial";
import { getUserUsage } from "@/lib/usage";
import { User } from "@/models/User";

export type AccountUsageMode = "pro" | "trial" | "expired_trial" | "none";

export type McpAccessContext = {
  mode: AccountUsageMode;
  canPurchaseTopUp: boolean;
  canUseMcp: boolean;
  showUsageCard: boolean;
  hasMcpUrl: boolean;
  totalRunsRemaining: number;
  bonusRunsRemaining: number;
};

/** Unified MCP + top-up access for account UI and API gates. */
export async function getMcpAccessContext(userId: string): Promise<McpAccessContext> {
  await connectDB();

  const [user, subscribed, trialStatus, usage] = await Promise.all([
    User.findById(userId).select("mcpUrl"),
    hasActiveSubscription(userId),
    getFreeTrialStatus(userId),
    getUserUsage(userId),
  ]);

  const hasMcpUrl = !!user?.mcpUrl;
  const totalRunsRemaining = usage?.totalRunsRemaining ?? 0;
  const bonusRunsRemaining = usage?.bonusRunsRemaining ?? 0;

  let mode: AccountUsageMode = "none";
  if (subscribed) {
    mode = "pro";
  } else if (trialStatus.active) {
    mode = "trial";
  } else if (trialStatus.used && hasMcpUrl) {
    mode = "expired_trial";
  }

  const canPurchaseTopUp = hasMcpUrl && trialStatus.used;
  const showUsageCard = mode !== "none";
  const canUseMcp =
    hasMcpUrl &&
    (subscribed || trialStatus.active || totalRunsRemaining > 0);

  return {
    mode,
    canPurchaseTopUp,
    canUseMcp,
    showUsageCard,
    hasMcpUrl,
    totalRunsRemaining,
    bonusRunsRemaining,
  };
}

export async function canPurchaseTopUp(userId: string): Promise<boolean> {
  const ctx = await getMcpAccessContext(userId);
  return ctx.canPurchaseTopUp;
}

export async function hasMcpUsageAccess(userId: string): Promise<boolean> {
  const ctx = await getMcpAccessContext(userId);
  return ctx.canUseMcp;
}
