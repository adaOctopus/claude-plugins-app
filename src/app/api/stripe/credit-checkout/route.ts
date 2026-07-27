import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { isWipSite } from "@/lib/site-mode";
import { getCreditPack, type CreditPackId } from "@/lib/usage-limits";
import { getCreditPackPriceId, getOrCreateStripeCustomer, getStripe } from "@/lib/stripe";
import { User } from "@/models/User";
import { canPurchaseTopUp } from "@/lib/mcp-access";

const schema = z.object({
  packId: z.enum(["pack_5", "pack_10"]),
});

function checkoutErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return "Invalid credit pack selected";
  }
  if (error instanceof Stripe.errors.StripeError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Checkout failed";
}

/** Create Stripe Checkout for a one-time credit top-up (trial or Pro users with MCP). */
export async function POST(request: NextRequest) {
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

    const allowed = await canPurchaseTopUp(session.id);
    if (!allowed) {
      return NextResponse.json(
        { error: "Start your free trial first to unlock run top-ups." },
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
    const { packId } = schema.parse(body) as { packId: CreditPackId };
    const pack = getCreditPack(packId);
    if (!pack) {
      return NextResponse.json({ error: "Unknown credit pack" }, { status: 400 });
    }

    const priceId = getCreditPackPriceId(packId);
    if (!priceId) {
      return NextResponse.json(
        {
          error: `Credit pack price is not configured. Set STRIPE_CREDIT_PACK_${packId === "pack_5" ? "5" : "10"}.`,
        },
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
      success_url: `${appUrl}/app?credits=success`,
      cancel_url: `${appUrl}/app?credits=cancel`,
      metadata: {
        type: "credit_pack",
        packId: pack.id,
        runs: String(pack.runs),
        userId: user._id.toString(),
        amountUsd: String(pack.priceUsd),
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Credit checkout error:", error);
    return NextResponse.json({ error: checkoutErrorMessage(error) }, { status: 500 });
  }
}
