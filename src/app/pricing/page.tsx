"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { PricingCards } from "@/components/pricing/PricingCards";
import type { PaidPlan } from "@/lib/pricing-plans";

function PricingContent() {
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("plan") || "monthly";
  const [loading, setLoading] = useState<string | null>(null);

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
    <div className="mx-auto max-w-6xl px-4 py-32 md:px-8">
      <h1 className="font-serif text-4xl text-charcoal md:text-5xl">
        Choose your plan
      </h1>
      <p className="mt-4 max-w-2xl text-charcoal-muted">
        Try free for one day with Jira or Slack and the in-Claude dashboard — no
        GitHub, no coding. Or subscribe for the full Context Engineer plugin.
      </p>

      <div className="mt-12">
        <PricingCards
          activePlan={defaultPlan}
          onCheckout={checkout}
          loadingPlan={loading}
        />
      </div>

      <p className="mt-8 text-center text-sm text-charcoal-muted">
        Need to sign in first?{" "}
        <Link href="/login" className="underline">
          Log in with magic link
        </Link>
      </p>
    </div>
  );
}

/** Pricing page — free trial plus Stripe checkout for monthly/annual plans. */
export default function PricingPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}
