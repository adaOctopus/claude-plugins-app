import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  getStripe,
  PRICING,
  getOrCreateStripeCustomer,
  type CheckoutPlan,
} from "@/lib/stripe";
import { User } from "@/models/User";

const schema = z.object({
  plan: z.enum(["monthly", "annual", "addon"]),
  pluginId: z.string().optional(),
});

/** Create Stripe Checkout — no sign-in required; Stripe collects email. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, pluginId } = schema.parse(body);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const priceId = PRICING[plan as CheckoutPlan]?.priceId;
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured. Set STRIPE_PRICE_* env vars." },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    const session = await getSession();

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
        plan,
        pluginId: pluginId || "",
      },
      ...(customerId
        ? { customer: customerId }
        : { customer_creation: "always" }),
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
