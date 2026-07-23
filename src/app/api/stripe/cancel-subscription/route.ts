import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getStripe, getSubscriptionPeriodEnd } from "@/lib/stripe";
import { isStripeModeMismatchError, toUserFacingStripeError } from "@/lib/user-facing-errors";
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
      cancel_at: "min_period_end",
    });

    const periodEndUnix =
      stripeSub.cancel_at ??
      getSubscriptionPeriodEnd(stripeSub) ??
      Math.floor(subscription.currentPeriodEnd.getTime() / 1000);
    const periodEnd = new Date(periodEndUnix * 1000);

    subscription.currentPeriodEnd = periodEnd;
    await subscription.save();

    return NextResponse.json({
      success: true,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: periodEnd.toISOString(),
    });
  } catch (error) {
    const message = toUserFacingStripeError(error, "cancel-subscription");
    const status = isStripeModeMismatchError(error) ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
