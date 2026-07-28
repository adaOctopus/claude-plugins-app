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

/** Unix timestamp for subscription period start — basil stores this on items. */
export function getSubscriptionPeriodStart(sub: Stripe.Subscription): number | null {
  const legacy = sub as Stripe.Subscription & { current_period_start?: number };
  if (typeof legacy.current_period_start === "number") {
    return legacy.current_period_start;
  }

  const items = sub.items?.data ?? [];
  if (items.length === 0) return null;

  return Math.min(...items.map((item) => item.current_period_start));
}

/** Unix timestamp for subscription period end — basil stores this on items, not the subscription root. */
export function getSubscriptionPeriodEnd(sub: Stripe.Subscription): number | null {
  const legacy = sub as Stripe.Subscription & { current_period_end?: number };
  if (typeof legacy.current_period_end === "number") {
    return legacy.current_period_end;
  }

  const items = sub.items?.data ?? [];
  if (items.length === 0) return null;

  return Math.max(...items.map((item) => item.current_period_end));
}

/** Subscription ID from Invoice — supports Stripe API before/after basil (parent.subscription_details). */
export function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const parentSubscription = invoice.parent?.subscription_details?.subscription;
  if (typeof parentSubscription === "string") return parentSubscription;
  if (parentSubscription && typeof parentSubscription === "object" && "id" in parentSubscription) {
    return parentSubscription.id;
  }

  const legacy = (invoice as Stripe.Invoice & {
    subscription?: string | Stripe.Subscription | null;
  }).subscription;

  if (typeof legacy === "string") return legacy;
  if (legacy && typeof legacy === "object" && "id" in legacy) return legacy.id;

  return null;
}

/** Vercel env names (primary) with legacy fallbacks for local `.env.local`. */
export function getCheckoutPriceId(plan: keyof typeof PRICING_AMOUNTS_MAP): string | undefined {
  switch (plan) {
    case "pro_monthly":
      return (
        process.env.STRIPE_PRO_MONTHLY ??
        process.env.STRIPE_PRICE_PRO_MONTHLY ??
        process.env.STRIPE_PRICE_MONTHLY
      );
    case "pro_annual":
      return (
        process.env.STRIPE_PRICE_PRO_ANNUAL ??
        process.env.STRIPE_PRO_ANNUAL ??
        process.env.STRIPE_PRICE_ANNUAL
      );
    case "premium_monthly":
      return (
        process.env.STRIPE_PREMIUM_MONTHLY ?? process.env.STRIPE_PRICE_PREMIUM_MONTHLY
      );
    case "premium_annual":
      return (
        process.env.STRIPE_PREMIUM_ANNUAL ?? process.env.STRIPE_PRICE_PREMIUM_ANNUAL
      );
    case "addon":
      return process.env.STRIPE_PRICE_ADDON ?? process.env.STRIPE_ADDON;
    default:
      return undefined;
  }
}

/** One-time Starter Stripe price ID — env `COOLPLUGZ_DAILY`. */
export function getDailyPassPriceId(): string | undefined {
  return (
    process.env.COOLPLUGZ_DAILY ??
    process.env.STRIPE_COOLPLUGZ_DAILY ??
    process.env.STRIPE_PRICE_COOLPLUGZ_DAILY ??
    process.env.STRIPE_DAILY_PASS
  );
}

/** One-time credit pack Stripe price IDs. */
export function getCreditPackPriceId(packId: "pack_5" | "pack_10"): string | undefined {
  switch (packId) {
    case "pack_5":
      return process.env.STRIPE_CREDIT_PACK_5 ?? process.env.STRIPE_PRICE_CREDIT_PACK_5;
    case "pack_10":
      return process.env.STRIPE_CREDIT_PACK_10 ?? process.env.STRIPE_PRICE_CREDIT_PACK_10;
    default:
      return undefined;
  }
}

const PRICING_AMOUNTS_MAP = {
  pro_monthly: PRICING_AMOUNTS.pro.monthly,
  pro_annual: PRICING_AMOUNTS.pro.annual,
  premium_monthly: PRICING_AMOUNTS.premium.monthly,
  premium_annual: PRICING_AMOUNTS.premium.annual,
  addon: 2.5,
} as const;

export const PRICING = {
  pro_monthly: {
    amount: PRICING_AMOUNTS.pro.monthly,
    get priceId() {
      return getCheckoutPriceId("pro_monthly");
    },
  },
  pro_annual: {
    amount: PRICING_AMOUNTS.pro.annual,
    get priceId() {
      return getCheckoutPriceId("pro_annual");
    },
  },
  premium_monthly: {
    amount: PRICING_AMOUNTS.premium.monthly,
    get priceId() {
      return getCheckoutPriceId("premium_monthly");
    },
  },
  premium_annual: {
    amount: PRICING_AMOUNTS.premium.annual,
    get priceId() {
      return getCheckoutPriceId("premium_annual");
    },
  },
  addon: {
    amount: 2.5,
    get priceId() {
      return getCheckoutPriceId("addon");
    },
  },
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
