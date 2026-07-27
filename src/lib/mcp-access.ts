import { connectDB } from "@/lib/db";
import { hasActiveSubscription } from "@/lib/entitlements";
import { getDailyPassStatus } from "@/lib/daily-pass";
import { getFreeTrialStatus } from "@/lib/free-trial";
import { getUserUsage } from "@/lib/usage";
import { Purchase } from "@/models/Purchase";
import { User } from "@/models/User";

export type AccountUsageMode = "pro" | "daily" | "expired_daily" | "none";

export type McpAccessContext = {
  mode: AccountUsageMode;
  canPurchaseTopUp: boolean;
  canUseMcp: boolean;
  showUsageCard: boolean;
  hasMcpUrl: boolean;
  totalRunsRemaining: number;
  bonusRunsRemaining: number;
};

async function hasEverPurchased(userId: string): Promise<boolean> {
  const purchase = await Purchase.findOne({ userId }).select("_id");
  return !!purchase;
}

/** Unified MCP + top-up access for account UI and API gates. */
export async function getMcpAccessContext(userId: string): Promise<McpAccessContext> {
  await connectDB();

  const [user, subscribed, dailyStatus, trialStatus, usage, purchased] = await Promise.all([
    User.findById(userId).select("mcpUrl dailyPassStartedAt"),
    hasActiveSubscription(userId),
    getDailyPassStatus(userId),
    getFreeTrialStatus(userId),
    getUserUsage(userId),
    hasEverPurchased(userId),
  ]);

  const hasMcpUrl = !!user?.mcpUrl;
  const totalRunsRemaining = usage?.totalRunsRemaining ?? 0;
  const bonusRunsRemaining = usage?.bonusRunsRemaining ?? 0;

  let mode: AccountUsageMode = "none";
  if (subscribed) {
    mode = "pro";
  } else if (dailyStatus.active || trialStatus.active) {
    mode = "daily";
  } else if ((dailyStatus.startedAt || trialStatus.used) && hasMcpUrl) {
    mode = "expired_daily";
  }

  const canPurchaseTopUp =
    hasMcpUrl &&
    (subscribed ||
      !!user?.dailyPassStartedAt ||
      trialStatus.used ||
      purchased);

  const showUsageCard = mode !== "none";
  const canUseMcp =
    hasMcpUrl &&
    (subscribed ||
      dailyStatus.active ||
      trialStatus.active ||
      totalRunsRemaining > 0);

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
