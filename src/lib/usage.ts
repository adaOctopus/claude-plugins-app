import { connectDB } from "@/lib/db";
import { USAGE_LIMITS } from "@/lib/usage-limits";
import { Purchase } from "@/models/Purchase";
import { UserUsage } from "@/models/UserUsage";

export type UsageSummary = {
  includedRunsLimit: number;
  includedRunsUsed: number;
  includedRunsRemaining: number;
  bonusRunsRemaining: number;
  totalRunsRemaining: number;
  periodStart: string | null;
  periodEnd: string | null;
  maxCostPerRunUsd: number;
};

function computeRemaining(
  includedRunsLimit: number,
  includedRunsUsed: number,
  bonusRunsRemaining: number
) {
  const includedRunsRemaining = Math.max(0, includedRunsLimit - includedRunsUsed);
  return {
    includedRunsRemaining,
    totalRunsRemaining: includedRunsRemaining + bonusRunsRemaining,
  };
}

export function toUsageSummary(usage: {
  includedRunsLimit: number;
  includedRunsUsed: number;
  bonusRunsRemaining: number;
  periodStart: Date;
  periodEnd: Date;
}): UsageSummary {
  const { includedRunsRemaining, totalRunsRemaining } = computeRemaining(
    usage.includedRunsLimit,
    usage.includedRunsUsed,
    usage.bonusRunsRemaining
  );

  return {
    includedRunsLimit: usage.includedRunsLimit,
    includedRunsUsed: usage.includedRunsUsed,
    includedRunsRemaining,
    bonusRunsRemaining: usage.bonusRunsRemaining,
    totalRunsRemaining,
    periodStart: usage.periodStart.toISOString(),
    periodEnd: usage.periodEnd.toISOString(),
    maxCostPerRunUsd: USAGE_LIMITS.maxCostPerRunUsd,
  };
}

/** Fetch usage ledger for a user, or null if never initialized. */
export async function getUserUsage(userId: string): Promise<UsageSummary | null> {
  await connectDB();
  const usage = await UserUsage.findOne({ userId });
  if (!usage) return null;
  return toUsageSummary(usage);
}

/** Create or refresh included-run quota for a billing period (Pro subscription). */
export async function initializeUsageForSubscription(
  userId: string,
  periodStart: Date,
  periodEnd: Date,
  includedRunsLimit: number = USAGE_LIMITS.proIncludedRunsPerMonth
) {
  await connectDB();

  const usage = await UserUsage.findOneAndUpdate(
    { userId },
    {
      userId,
      includedRunsUsed: 0,
      includedRunsLimit,
      periodStart,
      periodEnd,
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  return usage;
}

/** Card-free trial — smaller included quota for the trial window. */
export async function initializeUsageForTrial(userId: string, periodEnd: Date) {
  const now = new Date();
  return initializeUsageForSubscription(
    userId,
    now,
    periodEnd,
    USAGE_LIMITS.trialIncludedRuns
  );
}

/** Reset included runs at subscription renewal — bonus balance is preserved. */
export async function resetIncludedRunsForPeriod(
  userId: string,
  periodStart: Date,
  periodEnd: Date,
  includedRunsLimit: number = USAGE_LIMITS.proIncludedRunsPerMonth
) {
  await connectDB();

  const usage = await UserUsage.findOneAndUpdate(
    { userId },
    {
      includedRunsUsed: 0,
      includedRunsLimit,
      periodStart,
      periodEnd,
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  return usage;
}

/**
 * Grant bonus runs from a credit pack purchase.
 * Idempotent via stripeSessionId — replays do not double-grant.
 */
export async function grantBonusRuns(
  userId: string,
  runs: number,
  stripeSessionId: string,
  amountUsd: number
) {
  await connectDB();

  const existing = await Purchase.findOne({ stripeSessionId, type: "one_time" });
  if (existing) {
    const usage = await UserUsage.findOne({ userId });
    return usage;
  }

  const usage =
    (await UserUsage.findOne({ userId })) ??
    (await initializeUsageForSubscription(
      userId,
      new Date(),
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ));

  usage.bonusRunsRemaining += runs;
  await usage.save();

  await Purchase.create({
    userId,
    stripeSessionId,
    amount: amountUsd,
    type: "one_time",
  });

  return usage;
}

export type ConsumeRunResult =
  | { ok: true; summary: UsageSummary }
  | { ok: false; reason: "no_usage" | "no_runs_remaining" };

/**
 * Consumption order: included runs first, then bonus runs.
 * Called by MCP server via POST /api/usage/consume when a task run starts.
 */
export async function consumeRun(userId: string): Promise<ConsumeRunResult> {
  await connectDB();
  const usage = await UserUsage.findOne({ userId });
  if (!usage) {
    return { ok: false, reason: "no_usage" };
  }

  const { totalRunsRemaining } = computeRemaining(
    usage.includedRunsLimit,
    usage.includedRunsUsed,
    usage.bonusRunsRemaining
  );
  if (totalRunsRemaining <= 0) {
    return { ok: false, reason: "no_runs_remaining" };
  }

  if (usage.includedRunsUsed < usage.includedRunsLimit) {
    usage.includedRunsUsed += 1;
  } else {
    usage.bonusRunsRemaining = Math.max(0, usage.bonusRunsRemaining - 1);
  }

  await usage.save();
  return { ok: true, summary: toUsageSummary(usage) };
}

/** Resolve user by email and consume one run (MCP server entry point). */
export async function consumeRunByEmail(email: string): Promise<ConsumeRunResult> {
  await connectDB();
  const { User } = await import("@/models/User");
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    return { ok: false, reason: "no_usage" };
  }
  return consumeRun(user._id.toString());
}

export async function markUsageSynced(userId: string) {
  await connectDB();
  await UserUsage.updateOne({ userId }, { lastSyncedAt: new Date() });
}
