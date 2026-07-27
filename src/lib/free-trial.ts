import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hasActiveSubscription } from "@/lib/entitlements";
import { hasMcpUsageAccess } from "@/lib/mcp-access";

/** Legacy constant — existing free-trial rows in Mongo only. */
export const FREE_TRIAL_MS = 7 * 24 * 60 * 60 * 1000;

export type FreeTrialStatus = {
  active: boolean;
  used: boolean;
  endsAt: Date | null;
  startedAt: Date | null;
};

export async function getFreeTrialStatus(userId: string): Promise<FreeTrialStatus> {
  await connectDB();
  const user = await User.findById(userId).select("freeTrialStartedAt freeTrialEndsAt");
  if (!user?.freeTrialStartedAt || !user.freeTrialEndsAt) {
    return { active: false, used: false, endsAt: null, startedAt: null };
  }

  const endsAt = user.freeTrialEndsAt;
  const active = endsAt.getTime() > Date.now();

  return {
    active,
    used: true,
    endsAt,
    startedAt: user.freeTrialStartedAt,
  };
}

export async function hasActiveFreeTrial(userId: string) {
  const status = await getFreeTrialStatus(userId);
  return status.active;
}

export async function hasUsedFreeTrial(userId: string) {
  const status = await getFreeTrialStatus(userId);
  return status.used;
}

/** Paid subscription, active trial, or pay-as-you-go runs remaining. */
export async function canAccessMcp(userId: string) {
  return hasMcpUsageAccess(userId);
}

export async function assertCanStartFreeTrial(userId: string) {
  if (await hasActiveSubscription(userId)) {
    throw new Error("You already have an active Pro subscription.");
  }

  const status = await getFreeTrialStatus(userId);
  if (status.used && !status.active) {
    throw new Error("Your free 7-day trial has already been used. Upgrade to Pro to continue.");
  }

  if (status.active) {
    return;
  }
}
