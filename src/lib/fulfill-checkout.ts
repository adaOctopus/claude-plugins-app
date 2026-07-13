import type Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { createSession } from "@/lib/auth";
import { resolveUserFromCheckoutSession } from "@/lib/checkout-user";
import { provisionCoolplugzForUser } from "@/lib/provision-coolplugz";
import { Plugin } from "@/models/Plugin";
import { Subscription, type SubscriptionTier } from "@/models/Subscription";
import type { IUser } from "@/models/User";

async function upsertSubscriptionFromStripe(
  userId: string,
  stripeSub: Stripe.Subscription,
  plan: "monthly" | "annual",
  tier: SubscriptionTier = "pro"
) {
  await connectDB();
  const flagship = await Plugin.findOne({ isFlagship: true, status: "published" });
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
      tier,
      status: stripeSub.status as "active" | "canceled" | "past_due" | "trialing" | "incomplete",
      currentPeriodEnd: new Date(periodEnd * 1000),
      includedPluginIds: flagship ? [flagship._id] : [],
    },
    { upsert: true, new: true }
  );
}

/** After Stripe Checkout — create session + ensure subscription is recorded. */
export async function fulfillCheckoutSession(sessionId: string): Promise<IUser | null> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  if (session.status !== "complete") return null;

  const user = await resolveUserFromCheckoutSession(session);
  if (!user) return null;

  const plan = session.metadata?.plan as "monthly" | "annual" | undefined;
  const tier = (session.metadata?.tier as SubscriptionTier | undefined) ?? "pro";

  if (
    (plan === "monthly" || plan === "annual") &&
    session.subscription &&
    typeof session.subscription !== "string"
  ) {
    await upsertSubscriptionFromStripe(
      user._id.toString(),
      session.subscription,
      plan,
      tier
    );

    try {
      await provisionCoolplugzForUser(user._id.toString());
    } catch (error) {
      console.error("MCP provision after checkout failed:", error);
    }
  }

  await createSession(user);
  return user;
}
