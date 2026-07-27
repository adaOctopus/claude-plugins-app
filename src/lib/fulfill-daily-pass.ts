import { connectDB } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { provisionDailyPassForUser } from "@/lib/provision-coolplugz";
import { recordDailyPassPurchase } from "@/lib/usage";
import { syncUsageToCoolplugz } from "@/lib/sync-usage-to-coolplugz";
import { resolveUserFromCheckoutSession } from "@/lib/checkout-user";

/** After Stripe One Run checkout — idempotent fulfill (webhook may also run). */
export async function fulfillDailyPassSession(
  sessionId: string
): Promise<{ ok: boolean; userId?: string }> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.status !== "complete" || session.metadata?.type !== "daily_pass") {
    return { ok: false };
  }

  const user = await resolveUserFromCheckoutSession(session);
  if (!user) return { ok: false };

  const userId = user._id.toString();
  const amountUsd = Number(
    session.metadata?.amountUsd ??
      session.metadata?.amountEur ??
      (session.amount_total || 0) / 100
  );

  await connectDB();
  const existing = await recordDailyPassPurchase(userId, session.id, amountUsd);
  if (!existing) {
    try {
      await provisionDailyPassForUser(userId);
    } catch (error) {
      console.error("One Run fulfill provision failed:", error);
    }
  }

  try {
    await syncUsageToCoolplugz(userId);
  } catch (error) {
    console.error("One Run fulfill sync failed:", error);
  }

  return { ok: true, userId };
}
