"use client";

import { Suspense, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingCards } from "@/components/pricing/PricingCards";
import {
  getPaidPlanKey,
  type BillingPeriod,
  type PaidTier,
} from "@/lib/pricing-plans";
import { startTierCheckout } from "@/lib/start-checkout";
import { comingSoonHref, isWipSite } from "@/lib/site-mode";
import { LoginLink } from "@/components/auth/LoginLink";

function resolveBilling(planParam: string | null): BillingPeriod {
  return planParam === "monthly" || planParam === "annual" ? planParam : "annual";
}

function PricingContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const [billing, setBilling] = useState<BillingPeriod>(() => resolveBilling(planParam));
  const [loading, setLoading] = useState<string | null>(null);

  const checkout = useCallback(async (tier: PaidTier, period: BillingPeriod) => {
    if (isWipSite()) {
      window.location.href = comingSoonHref;
      return;
    }

    const key = getPaidPlanKey(tier, period);
    setLoading(key);
    try {
      await startTierCheckout(tier, period);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed");
      setLoading(null);
    }
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-32 text-center md:px-8">
      <h1 className="font-serif text-4xl text-charcoal md:text-6xl">Pricing</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-charcoal-muted md:text-base">
          Start with a <span className="font-medium text-charcoal">card-free 1-day trial</span> — we
          mint a unique MCP URL on our server (expires after 24 hours). Pro and Premium are paid via
          Stripe when you&apos;re ready to keep access.
        </p>

      <div className="mt-8 flex justify-center">
        <BillingToggle value={billing} onChange={setBilling} />
      </div>

      <div className="mt-12">
        <PricingCards billing={billing} onCheckout={checkout} loadingPlan={loading} />
      </div>

      <p className="mt-10 text-sm text-charcoal-muted">
        Already a customer? <LoginLink className="text-charcoal underline" redirect="/app" />
      </p>
    </div>
  );
}

/** Pricing page — card-free 1-day trial + Stripe Checkout for Pro & Premium. */
export default function PricingPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}
