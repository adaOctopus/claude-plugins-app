import type { BillingPeriod, PaidTier } from "@/lib/pricing-plans";
import { getPaidPlanKey } from "@/lib/pricing-plans";
import type { CheckoutPlan } from "@/lib/stripe";
import { isWipSite, comingSoonHref } from "@/lib/site-mode";

export async function startStripeCheckout(
  plan: CheckoutPlan,
  pluginId?: string,
  options?: { trialPeriodDays?: number; promoCode?: string | null }
): Promise<void> {
  if (isWipSite()) {
    window.location.href = comingSoonHref;
    return;
  }

  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plan,
      pluginId,
      trialPeriodDays: options?.trialPeriodDays,
      ...(options?.promoCode ? { promoCode: options.promoCode } : {}),
    }),
  });

  const data = (await res.json()) as { url?: string; error?: string };

  if (data.url) {
    window.location.href = data.url;
    return;
  }

  throw new Error(data.error || "Checkout failed");
}

export async function startTierCheckout(
  tier: PaidTier,
  billing: BillingPeriod,
  pluginId?: string,
  options?: { trialPeriodDays?: number; promoCode?: string | null }
): Promise<void> {
  return startStripeCheckout(getPaidPlanKey(tier, billing), pluginId, options);
}

export type { BillingPeriod, PaidTier };
