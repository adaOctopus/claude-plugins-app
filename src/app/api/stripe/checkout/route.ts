import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { isWipSite } from "@/lib/site-mode";
import {
  getStripe,
  PRICING,
  getOrCreateStripeCustomer,
  normalizeCheckoutPlan,
  parseSubscriptionFromCheckout,
  type CheckoutPlan,
} from "@/lib/stripe";
import { User } from "@/models/User";

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
});

/** Create Stripe Checkout — no sign-in required; Stripe collects email. */
export async function POST(request: NextRequest) {
  try {
    if (isWipSite()) {
      return NextResponse.json(
        { error: "Checkout is not open yet. Join the waitlist on the homepage." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { plan, pluginId } = schema.parse(body);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const checkoutKey = normalizeCheckoutPlan(plan as CheckoutPlan);

    const priceId = PRICING[checkoutKey]?.priceId;
    if (!priceId) {
      return NextResponse.json(
        {
          error: `Stripe price not configured for ${checkoutKey}. Set STRIPE_PRICE_* env vars.`,
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
    }

    const cancelUrl =
      plan === "addon" && pluginId
        ? `${appUrl}/plugins`
        : `${appUrl}/pricing?canceled=true`;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/install?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        plan: billing,
        tier,
        checkoutKey,
        pluginId: pluginId || "",
      },
      ...(customerId ? { customer: customerId } : {}),
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
