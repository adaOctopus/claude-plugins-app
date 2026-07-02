"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingCards } from "@/components/pricing/PricingCards";
import type { BillingPeriod, PaidPlan } from "@/lib/pricing-plans";

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
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        window.location.href = `/login?redirect=/pricing?plan=${plan}`;
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch {
      alert("Checkout failed");
    } finally {
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

      <p className="mt-8 text-sm text-charcoal-muted">
        Need to sign in first?{" "}
        <Link href="/login" className="underline">
          Log in with magic link
        </Link>
      </p>
    </div>
  );
}

/** Pricing page — free trial plus Stripe checkout for Pro (monthly or annual). */
export default function PricingPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}
