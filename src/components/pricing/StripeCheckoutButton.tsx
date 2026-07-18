"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { startStripeCheckout, startTierCheckout } from "@/lib/start-checkout";
import { comingSoonHref, isWipSite } from "@/lib/site-mode";
import type { BillingPeriod, PaidTier } from "@/lib/pricing-plans";
import { getPaidPlanKey } from "@/lib/pricing-plans";
import type { CheckoutPlan } from "@/lib/stripe";
import { cn } from "@/lib/utils";
import { useOptionalPromoCode } from "@/components/pricing/PromoCodeProvider";

type StripeCheckoutButtonProps = {
  /** Legacy direct checkout key (e.g. pro_annual, monthly). */
  plan?: CheckoutPlan;
  tier?: PaidTier;
  billing?: BillingPeriod;
  pluginId?: string;
  trialPeriodDays?: number;
  children: ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
  loadingLabel?: string;
};

/** Sends the user straight to Stripe Checkout — no sign-in step. */
export function StripeCheckoutButton({
  plan,
  tier = "pro",
  billing = "annual",
  pluginId,
  trialPeriodDays,
  children,
  className,
  size = "default",
  variant = "default",
  loadingLabel = "Redirecting...",
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const promo = useOptionalPromoCode();

  async function handleClick() {
    if (isWipSite()) {
      window.location.href = comingSoonHref;
      return;
    }

    setLoading(true);
    try {
      const checkoutOptions = {
        trialPeriodDays,
        promoCode: promo?.promoCode ?? null,
      };
      if (plan) {
        await startStripeCheckout(plan, pluginId, checkoutOptions);
      } else {
        await startTierCheckout(tier, billing, pluginId, checkoutOptions);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={cn(className)}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? loadingLabel : children}
    </Button>
  );
}
