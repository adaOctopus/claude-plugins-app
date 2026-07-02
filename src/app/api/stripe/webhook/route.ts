import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { Plugin } from "@/models/Plugin";
import { Subscription } from "@/models/Subscription";
import { Purchase } from "@/models/Purchase";
import {
  CreatorEarning,
  calculateEarnings,
} from "@/models/CreatorEarning";
import { sendPurchaseConfirmationEmail } from "@/lib/email";
import { resolveUserFromCheckoutSession } from "@/lib/checkout-user";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscription(subscription);
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const plan = session.metadata?.plan as "monthly" | "annual" | "addon" | undefined;
  const pluginId = session.metadata?.pluginId;

  const user = await resolveUserFromCheckoutSession(session);
  if (!user) return;

  const userId = user._id.toString();
  const amount = (session.amount_total || 0) / 100;

  if (plan === "monthly" || plan === "annual") {
    const flagship = await Plugin.findOne({ isFlagship: true, status: "published" });

    await Purchase.create({
      userId,
      pluginId: flagship?._id,
      stripeSessionId: session.id,
      amount,
      type: "subscription",
    });

    if (session.subscription && typeof session.subscription === "string") {
      const stripe = getStripe();
      const sub = await stripe.subscriptions.retrieve(session.subscription);
      await upsertSubscription(userId, sub, plan, flagship?._id);
    }

    await sendPurchaseConfirmationEmail(
      user.email,
      flagship?.title || "Context Engineer"
    );
  } else if (plan === "addon" && pluginId) {
    await Purchase.create({
      userId,
      pluginId,
      stripeSessionId: session.id,
      amount,
      type: "addon",
    });

    const plugin = await Plugin.findById(pluginId);
    if (plugin?.creatorId) {
      const { platformFee, netAmount } = calculateEarnings(amount);
      await CreatorEarning.create({
        creatorId: plugin.creatorId,
        pluginId: plugin._id,
        buyerId: userId,
        grossAmount: amount,
        platformFee,
        netAmount,
        status: "pending_manual_payout",
        stripeSessionId: session.id,
      });
    }

    const existingSub = await Subscription.findOne({
      userId,
      status: { $in: ["active", "trialing"] },
    });
    if (existingSub && !existingSub.addonPluginIds.includes(pluginId)) {
      existingSub.addonPluginIds.push(pluginId as unknown as typeof existingSub.addonPluginIds[0]);
      await existingSub.save();
    }
  }
}

async function upsertSubscription(
  userId: string,
  stripeSub: Stripe.Subscription,
  plan: "monthly" | "annual",
  flagshipId?: { toString(): string }
) {
  const includedIds = flagshipId ? [flagshipId] : [];
  const periodEnd =
    "current_period_end" in stripeSub && typeof stripeSub.current_period_end === "number"
      ? stripeSub.current_period_end
      : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: stripeSub.id },
    {
      userId,
      stripeSubscriptionId: stripeSub.id,
      plan,
      status: stripeSub.status as "active" | "canceled" | "past_due" | "trialing" | "incomplete",
      currentPeriodEnd: new Date(periodEnd * 1000),
      includedPluginIds: includedIds,
    },
    { upsert: true, new: true }
  );
}

async function syncSubscription(stripeSub: Stripe.Subscription) {
  const periodEnd =
    "current_period_end" in stripeSub && typeof stripeSub.current_period_end === "number"
      ? stripeSub.current_period_end
      : Math.floor(Date.now() / 1000);

  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: stripeSub.id },
    {
      status: stripeSub.status as "active" | "canceled" | "past_due" | "trialing" | "incomplete",
      currentPeriodEnd: new Date(periodEnd * 1000),
    }
  );
}
