import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getStripe, PRICING, getOrCreateStripeCustomer, type CheckoutPlan } from "@/lib/stripe";
import { User } from "@/models/User";

const schema = z.object({
  plan: z.enum(["monthly", "annual", "addon"]),
  pluginId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan, pluginId } = schema.parse(body);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stripe = getStripe();
    const customerId = await getOrCreateStripeCustomer(
      user.email,
      user._id.toString(),
      user.stripeCustomerId
    );

    if (!user.stripeCustomerId) {
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const priceId = PRICING[plan as CheckoutPlan]?.priceId;
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured. Set STRIPE_PRICE_* env vars." },
        { status: 500 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/install?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      metadata: {
        userId: user._id.toString(),
        plan,
        pluginId: pluginId || "",
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
