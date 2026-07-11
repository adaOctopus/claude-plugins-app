import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { Subscription } from "@/models/Subscription";

/** Cancel the signed-in user's active Stripe subscription at period end. */
export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const subscription = await Subscription.findOne({
      userId: session.id,
      status: { $in: ["active", "trialing"] },
      currentPeriodEnd: { $gt: new Date() },
    });

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 });
    }

    const stripe = getStripe();
    const stripeSub = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    const periodEnd =
      "current_period_end" in stripeSub && typeof stripeSub.current_period_end === "number"
        ? new Date(stripeSub.current_period_end * 1000)
        : subscription.currentPeriodEnd;

    return NextResponse.json({
      success: true,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: periodEnd.toISOString(),
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json({ error: "Could not cancel subscription" }, { status: 500 });
  }
}
