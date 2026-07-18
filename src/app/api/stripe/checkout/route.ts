import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { isWipSite } from "@/lib/site-mode";
import {
  getCheckoutPriceId,
  getStripe,
  getOrCreateStripeCustomer,
  normalizeCheckoutPlan,
  parseSubscriptionFromCheckout,
  type CheckoutPlan,
} from "@/lib/stripe";
import { User } from "@/models/User";
import { UNIQUE_MCP_URL_PATH } from "@/lib/mcp-setup-paths";

const schema = z.object({
  plan: z.enum([
    "pro_monthly",
    "pro_annual",
    "premium_monthly",
    "premium_annual",
    "monthly",
    "annual",
    "addon",
  ]),
  pluginId: z.string().optional(),
  trialPeriodDays: z.number().int().min(1).max(30).optional(),
});

const PRICE_ENV_HINTS: Record<string, string> = {
  pro_monthly: "STRIPE_PRO_MONTHLY",
  pro_annual: "STRIPE_PRICE_PRO_ANNUAL",
  premium_monthly: "STRIPE_PREMIUM_MONTHLY",
  premium_annual: "STRIPE_PREMIUM_ANNUAL",
  addon: "STRIPE_PRICE_ADDON",
};

function checkoutErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return "Invalid plan selected";
  }
  if (error instanceof Stripe.errors.StripeError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Checkout failed";
}

/** Create Stripe Checkout — no sign-in required; Stripe collects email. */
export async function POST(request: NextRequest) {
  try {
    if (isWipSite()) {
      return NextResponse.json(
        { error: "Checkout is not open yet. Join the waitlist on the homepage." },
        { status: 403 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { plan, pluginId, trialPeriodDays } = schema.parse(body);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const checkoutKey = normalizeCheckoutPlan(plan as CheckoutPlan);

    const priceId = getCheckoutPriceId(checkoutKey);
    if (!priceId) {
      const hint = PRICE_ENV_HINTS[checkoutKey] ?? "STRIPE_PRICE_*";
      return NextResponse.json(
        {
          error: `Stripe price not configured for ${checkoutKey}. Set ${hint} in Vercel env vars (live price IDs from Stripe Dashboard → Products), then redeploy.`,
        },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    const session = await getSession();
    const { tier, billing } = parseSubscriptionFromCheckout(plan as CheckoutPlan);

    let customerId: string | undefined;
    let userId = "";

    if (session) {
      try {
        await connectDB();
        const user = await User.findById(session.id);
        if (user) {
          userId = user._id.toString();
          customerId = await getOrCreateStripeCustomer(
            user.email,
            userId,
            user.stripeCustomerId
          );
          if (!user.stripeCustomerId) {
            user.stripeCustomerId = customerId;
            await user.save();
          }
        }
      } catch (dbError) {
        console.warn("Checkout continuing without linked customer — DB unavailable:", dbError);
      }
    }

    const cancelUrl =
      plan === "addon" && pluginId
        ? `${appUrl}/plugins`
        : `${appUrl}/pricing?canceled=true`;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}${UNIQUE_MCP_URL_PATH}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        plan: billing,
        tier,
        checkoutKey,
        pluginId: pluginId || "",
        trialPeriodDays: trialPeriodDays ? String(trialPeriodDays) : "",
      },
      ...(trialPeriodDays
        ? { subscription_data: { trial_period_days: trialPeriodDays } }
        : {}),
      ...(customerId
        ? { customer: customerId }
        : { customer_creation: "always" }),
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: checkoutErrorMessage(error) }, { status: 500 });
  }
}
