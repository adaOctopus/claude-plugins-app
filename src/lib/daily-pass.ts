import { connectDB } from "@/lib/db";
import { USAGE_LIMITS } from "@/lib/usage-limits";
import { hasActiveSubscription } from "@/lib/entitlements";
import { User } from "@/models/User";

export const DAILY_PASS_MS = USAGE_LIMITS.dailyPassHours * 60 * 60 * 1000;

export type DailyPassStatus = {
  active: boolean;
  expiresAt: Date | null;
  startedAt: Date | null;
};

export async function getDailyPassStatus(userId: string): Promise<DailyPassStatus> {
  await connectDB();
  const user = await User.findById(userId).select("dailyPassStartedAt dailyPassExpiresAt");
  if (!user?.dailyPassStartedAt || !user.dailyPassExpiresAt) {
    return { active: false, expiresAt: null, startedAt: null };
  }

  const expiresAt = user.dailyPassExpiresAt;
  const active = expiresAt.getTime() > Date.now();

  return {
    active,
    expiresAt,
    startedAt: user.dailyPassStartedAt,
  };
}

export async function hasActiveDailyPass(userId: string) {
  const status = await getDailyPassStatus(userId);
  return status.active;
}

export async function assertCanPurchaseDailyPass(userId: string) {
  if (await hasActiveSubscription(userId)) {
    throw new Error("You already have an active Pro subscription.");
  }

  if (await hasActiveDailyPass(userId)) {
    throw new Error("Your One Run is still active. Wait until it expires to buy another.");
  }
}
