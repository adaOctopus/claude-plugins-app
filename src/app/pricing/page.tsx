"use client";

import Link from "next/link";
import { Suspense, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BillingToggle } from "@/components/pricing/BillingToggle";
import { PricingCards } from "@/components/pricing/PricingCards";
import { PromoCodeInput } from "@/components/pricing/PromoCodeInput";
import { PromoCodeProvider, usePromoCode } from "@/components/pricing/PromoCodeProvider";
import {
  getPaidPlanKey,
  type BillingPeriod,
  type PaidTier,
} from "@/lib/pricing-plans";
import { startTierCheckout } from "@/lib/start-checkout";
import { comingSoonHref, isWipSite } from "@/lib/site-mode";
import { LoginLink } from "@/components/auth/LoginLink";
import { brandWordmarkFont } from "@/lib/brand-font";
import { cn } from "@/lib/utils";

function resolveBilling(planParam: string | null): BillingPeriod {
  return planParam === "monthly" || planParam === "annual" ? planParam : "annual";
}

function PricingContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const [billing, setBilling] = useState<BillingPeriod>(() => resolveBilling(planParam));
  const [loading, setLoading] = useState<string | null>(null);
  const { promoCode } = usePromoCode();

  const checkout = useCallback(
    async (tier: PaidTier, period: BillingPeriod) => {
      if (isWipSite()) {
        window.location.href = comingSoonHref;
        return;
      }

      const key = getPaidPlanKey(tier, period);
      setLoading(key);
      try {
        await startTierCheckout(tier, period, undefined, { promoCode });
      } catch (error) {
        alert(error instanceof Error ? error.message : "Checkout failed");
        setLoading(null);
      }
    },
    [promoCode]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-32 text-center md:px-8">
      <h1 className="font-serif text-4xl text-charcoal md:text-6xl">Pricing</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-charcoal-muted md:text-base">
        Start with a <span className="font-medium text-charcoal">card-free 7-day trial </span>.{" "}
        <br /> After that, continue with Pro or Enterprise to become really{" "}
        <span
          className={cn(
            brandWordmarkFont.className,
            "brand-wordmark inline-block align-baseline text-[1.5em] leading-none text-charcoal"
          )}
        >
          Cool
        </span>
        .
      </p>

      <div className="mt-8 flex justify-center">
        <BillingToggle value={billing} onChange={setBilling} />
      </div>

      <div className="mt-12">
        <PricingCards billing={billing} onCheckout={checkout} loadingPlan={loading} />
      </div>

      <PromoCodeInput />

      <p className="mt-10 text-sm text-charcoal-muted">
        Already a customer? <LoginLink className="text-charcoal underline" redirect="/app" />
      </p>

      <div className="mx-auto mt-12 max-w-2xl border-t border-border pt-8 text-sm text-charcoal-muted">
        <p className="font-medium text-charcoal">Not ready to buy?</p>
        <p className="mt-2">
          Read how developers use Claude for client work —{" "}
          <Link href="/guides/best-claude-plugins-for-developers" className="text-charcoal underline">
            best Claude plugins
          </Link>
          ,{" "}
          <Link href="/guides/make-money-with-claude-as-a-developer" className="text-charcoal underline">
            make money with Claude
          </Link>
          , and{" "}
          <Link href="/guides/claude-code-after-tutorial" className="text-charcoal underline">
            post-tutorial setup
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

/** Pricing page — card-free 7-day trial + Stripe Checkout for Pro + Enterprise contact. */
export default function PricingPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center">Loading...</div>}>
      <PromoCodeProvider>
        <PricingContent />
      </PromoCodeProvider>
    </Suspense>
  );
}
