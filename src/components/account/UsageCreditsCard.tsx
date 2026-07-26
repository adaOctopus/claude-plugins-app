"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopUpCreditsDialog } from "@/components/account/TopUpCreditsDialog";
import type { UsageSummary } from "@/lib/usage";
import { USAGE_LIMITS } from "@/lib/usage-limits";

type UsageCreditsCardProps = {
  initialUsage: UsageSummary | null;
  canTopUp: boolean;
};

function formatPeriodEnd(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" });
}

/** Shows remaining runs, period reset, and top-up entry point on Manage Account. */
export function UsageCreditsCard({ initialUsage, canTopUp }: UsageCreditsCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [usage, setUsage] = useState(initialUsage);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const refreshUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/usage", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { usage?: UsageSummary | null };
      setUsage(data.usage ?? null);
    } catch {
      // keep existing usage display
    }
  }, []);

  useEffect(() => {
    const credits = searchParams.get("credits");
    if (credits === "success") {
      setNotice("Credits added — your bonus runs are ready.");
      void refreshUsage();
      router.replace("/app");
    } else if (credits === "cancel") {
      setNotice("Top-up cancelled.");
      router.replace("/app");
    }
  }, [router, searchParams, refreshUsage]);

  if (!usage) {
    return null;
  }

  const usedPercent =
    usage.includedRunsLimit > 0
      ? Math.min(100, Math.round((usage.includedRunsUsed / usage.includedRunsLimit) * 100))
      : 0;
  const periodEndLabel = formatPeriodEnd(usage.periodEnd);

  return (
    <>
      <Card className="mt-8 border-[#7DD3C0]/35 bg-[#E8FAF6]/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Usage & credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notice ? (
            <p className="rounded-xl border border-[#7DD3C0]/40 bg-white/80 px-3 py-2 text-sm text-[#0D9488]">
              {notice}
            </p>
          ) : null}

          <div>
            <p className="text-2xl font-semibold text-charcoal">
              {usage.totalRunsRemaining}{" "}
              <span className="text-base font-normal text-charcoal-muted">
                run{usage.totalRunsRemaining === 1 ? "" : "s"} remaining
              </span>
            </p>
            <p className="mt-1 text-sm text-charcoal-muted">
              {usage.includedRunsRemaining} of {usage.includedRunsLimit} included
              {usage.bonusRunsRemaining > 0
                ? ` + ${usage.bonusRunsRemaining} bonus`
                : ""}
            </p>
          </div>

          <div>
            <div className="mb-1.5 flex justify-between text-xs text-charcoal-muted">
              <span>Included runs this period</span>
              <span>
                {usage.includedRunsUsed}/{usage.includedRunsLimit}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/80">
              <div
                className="h-full rounded-full bg-[#0D9488] transition-all"
                style={{ width: `${usedPercent}%` }}
              />
            </div>
            {periodEndLabel ? (
              <p className="mt-2 text-xs text-charcoal-muted">
                Included runs reset on {periodEndLabel}
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-border/80 bg-white/70 p-4">
            <p className="text-sm font-medium text-charcoal">
              {canTopUp ? "Need more runs?" : "Runs used up?"}
            </p>
            <p className="mt-1 text-xs text-charcoal-muted">
              {canTopUp
                ? "Top up anytime after your included runs are used."
                : "On Pro, top up anytime after your included runs are used."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {USAGE_LIMITS.creditPacks.map((pack) => (
                <span
                  key={pack.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#7DD3C0]/50 bg-[#E8FAF6] px-3 py-1.5 text-xs font-medium text-[#0D9488]"
                >
                  <span className="text-charcoal">${pack.priceUsd}</span>
                  <span className="text-charcoal-muted">→</span>
                  <span>{pack.runs} runs</span>
                </span>
              ))}
              <span className="inline-flex items-center rounded-full border border-border bg-cream-warm/80 px-3 py-1.5 text-xs text-charcoal-muted">
                ≤ ${USAGE_LIMITS.maxCostPerRunUsd}/run
              </span>
            </div>
            {canTopUp ? (
              <Button
                type="button"
                size="sm"
                className="mt-4 w-full sm:w-auto"
                onClick={() => setTopUpOpen(true)}
              >
                Top up credits
              </Button>
            ) : (
              <p className="mt-3 text-xs text-charcoal-muted">
                Top-ups unlock with a Pro subscription.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <TopUpCreditsDialog open={topUpOpen} onOpenChange={setTopUpOpen} />
    </>
  );
}
