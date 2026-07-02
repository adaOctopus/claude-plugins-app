"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingCards } from "@/components/pricing/PricingCards";
import type { BillingPeriod, PaidPlan } from "@/lib/pricing-plans";
import { startStripeCheckout } from "@/lib/start-checkout";

function PricingContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const initialBilling: BillingPeriod =
    planParam === "monthly" || planParam === "annual" ? planParam : "annual";

  const [billing, setBilling] = useState<BillingPeriod>(initialBilling);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (planParam === "monthly" || planParam === "annual") {
      setBilling(planParam);
    }
  }, [planParam]);

  async function checkout(plan: PaidPlan) {
    setLoading(plan);
    try {
      await startStripeCheckout(plan);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed");
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-32 text-center md:px-8">
      <h1 className="font-serif text-4xl text-charcoal md:text-6xl">Pricing</h1>

      <div className="mt-8 flex justify-center">
        <BillingToggle value={billing} onChange={setBilling} />
      </div>

      <div className="mt-12">
        <PricingCards billing={billing} onCheckout={checkout} loadingPlan={loading} />
      </div>
    </div>
  );
}

/** Pricing page — Stripe Checkout for Pro, no sign-in required. */
export default function PricingPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}
