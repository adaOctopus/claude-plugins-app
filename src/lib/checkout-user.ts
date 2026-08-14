import type Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { User, type IUser } from "@/models/User";

/** Find or create a buyer from a completed Stripe Checkout session. */
export async function resolveUserFromCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<IUser | null> {
  await connectDB();
  const stripe = getStripe();

  if (session.metadata?.userId) {
    const existing = await User.findById(session.metadata.userId);
    if (existing) return existing;
  }

  let email =
    session.customer_details?.email?.toLowerCase() ||
    session.customer_email?.toLowerCase();

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;

  if (!email && customerId) {
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted && customer.email) {
      email = customer.email.toLowerCase();
    }
  }

  if (!email) return null;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, role: "buyer" });
  }

  if (customerId && user.stripeCustomerId !== customerId) {
    user.stripeCustomerId = customerId;
    await user.save();
  }

  return user;
}
