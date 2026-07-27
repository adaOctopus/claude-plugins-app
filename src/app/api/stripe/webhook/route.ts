import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { getStripe, getInvoiceSubscriptionId, getSubscriptionPeriodEnd } from "@/lib/stripe";
import { Plugin } from "@/models/Plugin";
import { Subscription } from "@/models/Subscription";
import { Purchase } from "@/models/Purchase";
import {
  CreatorEarning,
  calculateEarnings,
} from "@/models/CreatorEarning";
import { sendPurchaseConfirmationEmail } from "@/lib/email";
import { resolveUserFromCheckoutSession } from "@/lib/checkout-user";
import { provisionCoolplugzForUser, provisionDailyPassForUser } from "@/lib/provision-coolplugz";
import {
  grantBonusRuns,
  initializeUsageForSubscription,
  recordDailyPassPurchase,
  resetIncludedRunsForPeriod,
} from "@/lib/usage";
import { syncUsageToCoolplugz } from "@/lib/sync-usage-to-coolplugz";
import {
  recordCheckoutPartnerRedemption,
  recordInvoicePartnerRedemption,
  resolvePromoFromCheckoutSession,
} from "@/lib/partner-promos";
import { PartnerPromo } from "@/models/PartnerPromo";
import { getSubscriptionPeriodStart } from "@/lib/stripe";

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
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
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
  if (session.metadata?.type === "credit_pack") {
    await handleCreditPackCheckout(session);
    return;
  }

  if (session.metadata?.type === "daily_pass") {
    await handleDailyPassCheckout(session);
    return;
  }

  const plan = session.metadata?.plan as "monthly" | "annual" | "addon" | undefined;
  const tier = (session.metadata?.tier as "pro" | "premium" | undefined) ?? "pro";
  const pluginId = session.metadata?.pluginId;

  const user = await resolveUserFromCheckoutSession(session);
  if (!user) return;

  const userId = user._id.toString();
  const amount = (session.amount_total || 0) / 100;
  const partnerPromo = await resolvePromoFromCheckoutSession(session);

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
      await upsertSubscription(userId, sub, plan, tier, flagship?._id, partnerPromo);

      const periodStart = getSubscriptionPeriodStart(sub);
      const periodEnd = getSubscriptionPeriodEnd(sub);
      if (periodStart != null && periodEnd != null) {
        await initializeUsageForSubscription(
          userId,
          new Date(periodStart * 1000),
          new Date(periodEnd * 1000)
        );
        try {
          await syncUsageToCoolplugz(userId);
        } catch (error) {
          console.error("Usage sync after subscription checkout failed:", error);
        }
      }

      try {
        await provisionCoolplugzForUser(userId);
      } catch (error) {
        console.error("MCP provision after webhook checkout failed:", error);
      }
    }

    if (partnerPromo) {
      try {
        await recordCheckoutPartnerRedemption(
          session,
          partnerPromo,
          userId,
          user.email,
          tier,
          plan
        );
      } catch (error) {
        console.error("Partner promo redemption record failed:", error);
      }
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

async function handleCreditPackCheckout(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const runs = Number(session.metadata?.runs ?? 0);
  const amountUsd = Number(session.metadata?.amountUsd ?? (session.amount_total || 0) / 100);

  if (!userId || !runs || !session.id) {
    console.error("Credit pack checkout missing metadata:", session.id);
    return;
  }

  await grantBonusRuns(userId, runs, session.id, amountUsd);

  try {
    await syncUsageToCoolplugz(userId);
  } catch (error) {
    console.error("Usage sync after credit purchase failed:", error);
  }
}

async function handleDailyPassCheckout(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const amountUsd = Number(
    session.metadata?.amountUsd ??
      session.metadata?.amountEur ??
      (session.amount_total || 0) / 100
  );

  if (!userId || !session.id) {
    console.error("One Run checkout missing metadata:", session.id);
    return;
  }

  const existing = await recordDailyPassPurchase(userId, session.id, amountUsd);
  if (existing) {
    return;
  }

  try {
    await provisionDailyPassForUser(userId);
  } catch (error) {
    console.error("One Run MCP provision failed:", error);
  }

  try {
    await syncUsageToCoolplugz(userId);
  } catch (error) {
    console.error("Usage sync after One Run purchase failed:", error);
  }
}

async function upsertSubscription(
  userId: string,
  stripeSub: Stripe.Subscription,
  plan: "monthly" | "annual",
  tier: "pro" | "premium" = "pro",
  flagshipId?: { toString(): string },
  partnerPromo?: { _id: { toString(): string }; code: string; partnerName: string } | null
) {
  const includedIds = flagshipId ? [flagshipId] : [];
  const periodEnd =
    getSubscriptionPeriodEnd(stripeSub) ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: stripeSub.id },
    {
      userId,
      stripeSubscriptionId: stripeSub.id,
      plan,
      tier,
      status: stripeSub.status as "active" | "canceled" | "past_due" | "trialing" | "incomplete",
      currentPeriodEnd: new Date(periodEnd * 1000),
      includedPluginIds: includedIds,
      ...(partnerPromo
        ? {
            partnerPromoId: partnerPromo._id,
            partnerPromoCode: partnerPromo.code,
            partnerName: partnerPromo.partnerName,
          }
        : {}),
    },
    { upsert: true, returnDocument: "after" }
  );
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (invoice.billing_reason === "subscription_create") {
    return;
  }

  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return;

  const sub = await Subscription.findOne({ stripeSubscriptionId: subscriptionId });
  if (!sub) return;

  const stripe = getStripe();
  const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
  const periodStart = getSubscriptionPeriodStart(stripeSub);
  const periodEnd = getSubscriptionPeriodEnd(stripeSub);

  if (periodStart != null && periodEnd != null) {
    await resetIncludedRunsForPeriod(
      sub.userId.toString(),
      new Date(periodStart * 1000),
      new Date(periodEnd * 1000)
    );
    try {
      await syncUsageToCoolplugz(sub.userId.toString());
    } catch (error) {
      console.error("Usage sync after renewal failed:", error);
    }
  }

  if (!sub.partnerPromoId) return;

  const promo = await PartnerPromo.findById(sub.partnerPromoId);
  if (!promo) return;

  try {
    await recordInvoicePartnerRedemption(invoice, promo, sub.tier, sub.plan);
  } catch (error) {
    console.error("Partner promo renewal record failed:", error);
  }
}

async function syncSubscription(stripeSub: Stripe.Subscription) {
  const periodEnd = getSubscriptionPeriodEnd(stripeSub) ?? Math.floor(Date.now() / 1000);

  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: stripeSub.id },
    {
      status: stripeSub.status as "active" | "canceled" | "past_due" | "trialing" | "incomplete",
      currentPeriodEnd: new Date(periodEnd * 1000),
    }
  );
}
