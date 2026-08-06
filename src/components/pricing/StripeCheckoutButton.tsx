"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
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
  /** When true, skip Stripe and link to account (from server-rendered pages). */
  alreadySubscribed?: boolean;
};

function isAddonCheckout(plan?: CheckoutPlan) {
  return plan === "addon";
}

/** Sends the user to Stripe Checkout — blocked when already on Pro. */
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
  alreadySubscribed = false,
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(alreadySubscribed);
  const promo = useOptionalPromoCode();
  const isAddon = isAddonCheckout(plan);

  useEffect(() => {
    if (alreadySubscribed || isAddon) return;

    let cancelled = false;

    async function loadSubscriptionStatus() {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as { hasActiveSubscription?: boolean };
        if (!cancelled) setSubscribed(!!data.hasActiveSubscription);
      } catch {
        // keep checkout available if status check fails
      }
    }

    void loadSubscriptionStatus();
    return () => {
      cancelled = true;
    };
  }, [alreadySubscribed, isAddon]);

  if (subscribed && !isAddon) {
    return (
      <Button size={size} variant={variant} className={cn(className)} asChild>
        <Link href="/app">You&apos;re on Pro — Manage account</Link>
      </Button>
    );
  }

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
