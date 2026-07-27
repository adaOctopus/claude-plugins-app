import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { assertCanPurchaseDailyPass } from "@/lib/daily-pass";
import { isWipSite } from "@/lib/site-mode";
import { USAGE_LIMITS } from "@/lib/usage-limits";
import { getDailyPassPriceId, getOrCreateStripeCustomer, getStripe } from "@/lib/stripe";
import { User } from "@/models/User";

function checkoutErrorMessage(error: unknown): string {
  if (error instanceof Stripe.errors.StripeError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Checkout failed";
}

/** Create Stripe Checkout for a one-time Daily Pass (€5, 1 run, 24h). */
export async function POST(_request: NextRequest) {
  try {
    if (isWipSite()) {
      return NextResponse.json(
        { error: "Checkout is not open yet. Join the waitlist on the homepage." },
        { status: 403 }
      );
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    await assertCanPurchaseDailyPass(session.id);

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const priceId = getDailyPassPriceId();
    if (!priceId) {
      return NextResponse.json(
        { error: "Daily Pass price is not configured. Set COOLPLUGZ_DAILY." },
        { status: 500 }
      );
    }

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const customerId = await getOrCreateStripeCustomer(
      user.email,
      user._id.toString(),
      user.stripeCustomerId
    );

    if (!user.stripeCustomerId) {
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/premium/unique-mcp-url?daily=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?daily=cancel`,
      metadata: {
        type: "daily_pass",
        userId: user._id.toString(),
        amountEur: String(USAGE_LIMITS.dailyPassPriceEur),
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Daily pass checkout error:", error);
    const message = checkoutErrorMessage(error);
    const status = message.includes("already") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
