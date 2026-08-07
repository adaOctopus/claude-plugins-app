import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getStripe, getSubscriptionPeriodEnd } from "@/lib/stripe";
import { isStripeModeMismatchError, toUserFacingStripeError } from "@/lib/user-facing-errors";
import { CancellationFeedback } from "@/models/CancellationFeedback";
import { Subscription } from "@/models/Subscription";

const bodySchema = z.object({
  cancellationFeedback: z.string().trim().min(1, "Please tell us why you're canceling").max(2000),
});

/** Cancel the signed-in user's active Stripe subscription at period end. */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cancellationFeedback } = bodySchema.parse(body);

    await connectDB();
    const subscription = await Subscription.findOne({
      userId: session.id,
      status: { $in: ["active", "trialing"] },
      currentPeriodEnd: { $gt: new Date() },
    });

    if (!subscription) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 });
    }

    await CancellationFeedback.create({
      userId: session.id,
      email: session.email,
      cancellationFeedback,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
    });

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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid feedback" },
        { status: 400 }
      );
    }

    const message = toUserFacingStripeError(error, "cancel-subscription");
    const status = isStripeModeMismatchError(error) ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
