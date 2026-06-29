import Stripe from "stripe";

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
  monthly: { amount: 19, priceId: process.env.STRIPE_PRICE_MONTHLY },
  annual: { amount: 149, priceId: process.env.STRIPE_PRICE_ANNUAL },
  addon: { amount: 2.5, priceId: process.env.STRIPE_PRICE_ADDON },
} as const;

export type CheckoutPlan = "monthly" | "annual" | "addon";

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
