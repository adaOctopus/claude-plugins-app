import Stripe from "stripe";
import type { BillingPeriod, PaidTier } from "@/lib/pricing-plans";
import { PRICING_AMOUNTS } from "@/lib/pricing-plans";

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
}

export const PRICING = {
  pro_monthly: { amount: PRICING_AMOUNTS.pro.monthly, priceId: process.env.STRIPE_PRICE_MONTHLY },
  pro_annual: { amount: PRICING_AMOUNTS.pro.annual, priceId: process.env.STRIPE_PRICE_ANNUAL },
  premium_monthly: {
    amount: PRICING_AMOUNTS.premium.monthly,
    priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
  },
  premium_annual: {
    amount: PRICING_AMOUNTS.premium.annual,
    priceId: process.env.STRIPE_PRICE_PREMIUM_ANNUAL,
  },
  addon: { amount: 2.5, priceId: process.env.STRIPE_PRICE_ADDON },
} as const;

/** @deprecated Use pro_monthly / pro_annual — kept for backward-compatible callers. */
export type LegacyCheckoutPlan = "monthly" | "annual";

export type CheckoutPlan = keyof typeof PRICING | LegacyCheckoutPlan;

export type SubscriptionTier = PaidTier;

export function normalizeCheckoutPlan(plan: CheckoutPlan): keyof typeof PRICING {
  if (plan === "monthly") return "pro_monthly";
  if (plan === "annual") return "pro_annual";
  return plan;
}

export function parseSubscriptionFromCheckout(plan: CheckoutPlan): {
  tier: SubscriptionTier;
  billing: BillingPeriod;
} {
  const key = normalizeCheckoutPlan(plan);
  if (key === "addon") {
    return { tier: "pro", billing: "monthly" };
  }
  const [tier, billing] = key.split("_") as [SubscriptionTier, BillingPeriod];
  return { tier, billing };
}

export async function getOrCreateStripeCustomer(
  email: string,
  userId: string,
  existingCustomerId?: string
) {
  const stripe = getStripe();

  if (existingCustomerId) {
    return existingCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  return customer.id;
}
