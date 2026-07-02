import type { PaidPlan } from "@/lib/pricing-plans";
import type { CheckoutPlan } from "@/lib/stripe";

export async function startStripeCheckout(
  plan: CheckoutPlan,
  pluginId?: string
): Promise<void> {
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

export type { PaidPlan };
