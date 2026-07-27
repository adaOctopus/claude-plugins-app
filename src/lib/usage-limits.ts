/** Run quotas, credit packs, and server budget caps — single source of truth. */
export const USAGE_LIMITS = {
  maxCostPerRunUsd: 2,
  dailyMaxCostPerRunUsd: 3,
  proIncludedRunsPerMonth: 10,
  dailyIncludedRuns: 1,
  dailyPassHours: 24,
  dailyPassPriceUsd: 5,
  /** Legacy — existing free-trial rows only; no new trials. */
  trialIncludedRuns: 3,
  creditPacks: [
    { id: "pack_5", runs: 5, priceUsd: 10 },
    { id: "pack_10", runs: 10, priceUsd: 20 },
  ],
} as const;

export type CreditPackId = (typeof USAGE_LIMITS.creditPacks)[number]["id"];

export function getCreditPack(packId: CreditPackId) {
  return USAGE_LIMITS.creditPacks.find((pack) => pack.id === packId) ?? null;
}

export function formatRunsRemaining(total: number): string {
  return `${total} run${total === 1 ? "" : "s"} remaining`;
}
