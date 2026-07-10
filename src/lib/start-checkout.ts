import type { BillingPeriod, PaidTier } from "@/lib/pricing-plans";
import { getPaidPlanKey } from "@/lib/pricing-plans";
import type { CheckoutPlan } from "@/lib/stripe";
import { isWipSite, comingSoonHref } from "@/lib/site-mode";

export async function startStripeCheckout(
  plan: CheckoutPlan,
  pluginId?: string
): Promise<void> {
  if (isWipSite()) {
    window.location.href = comingSoonHref;
    return;
  }

  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, pluginId }),
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
  pluginId?: string
): Promise<void> {
  return startStripeCheckout(getPaidPlanKey(tier, billing), pluginId);
}

export type { BillingPeriod, PaidTier };
