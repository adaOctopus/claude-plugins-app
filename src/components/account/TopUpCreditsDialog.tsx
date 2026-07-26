"use client";

import { useEffect, useState } from "react";
import { Coins, Loader2, X, Zap } from "lucide-react";
import { USAGE_LIMITS, type CreditPackId } from "@/lib/usage-limits";

type TopUpCreditsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Modal to buy one-time run credit packs via Stripe Checkout. */
export function TopUpCreditsDialog({ open, onOpenChange }: TopUpCreditsDialogProps) {
  const [loadingPackId, setLoadingPackId] = useState<CreditPackId | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setLoadingPackId(null);
      setError(null);
    }
  }, [open]);

  async function handleBuy(packId: CreditPackId) {
    setLoadingPackId(packId);
    setError(null);

    try {
      const res = await fetch("/api/stripe/credit-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (err) {
      setLoadingPackId(null);
      setError(err instanceof Error ? err.message : "Could not start checkout");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="top-up-credits-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent-sage via-cream to-white shadow-[0_16px_48px_rgba(45,41,38,0.18)]">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-1.5 text-charcoal-muted transition-colors hover:bg-white/60 hover:text-charcoal"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 py-8 md:px-8 md:py-10">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white/80">
            <Coins className="h-5 w-5 text-charcoal" aria-hidden />
          </div>
          <h2
            id="top-up-credits-title"
            className="mt-4 text-center font-serif text-xl text-charcoal md:text-2xl"
          >
            Top up credits
          </h2>
          <p className="mt-2 text-center text-sm text-charcoal-muted">
            Each run uses up to ${USAGE_LIMITS.maxCostPerRunUsd} of server budget. Bonus runs never
            expire — included runs reset each billing month.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {USAGE_LIMITS.creditPacks.map((pack) => (
              <button
                key={pack.id}
                type="button"
                onClick={() => void handleBuy(pack.id)}
                disabled={loadingPackId !== null}
                className="rounded-2xl border border-border bg-white/90 p-5 text-left shadow-sm transition-colors hover:border-charcoal/25 hover:bg-white disabled:opacity-60"
              >
                <div className="flex items-center gap-2 text-charcoal">
                  <Zap className="h-4 w-4 text-[#0D9488]" aria-hidden />
                  <span className="font-medium">{pack.runs} runs</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-charcoal">${pack.priceUsd}</p>
                <p className="mt-1 text-xs text-charcoal-muted">
                  ${(pack.priceUsd / pack.runs).toFixed(0)} per run
                </p>
                {loadingPackId === pack.id ? (
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-charcoal-muted">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    Redirecting…
                  </span>
                ) : (
                  <span className="mt-3 inline-block text-xs font-medium text-[#0D9488]">
                    Buy now →
                  </span>
                )}
              </button>
            ))}
          </div>

          {error ? <p className="mt-4 text-center text-sm text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
