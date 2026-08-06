import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getOrCreateStripeCustomer, getStripe, syncStripeCustomerId } from "@/lib/stripe";
import { toUserFacingStripeError } from "@/lib/user-facing-errors";
import { User } from "@/models/User";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const customerId = await getOrCreateStripeCustomer(
      user.email,
      user._id.toString(),
      user.stripeCustomerId
    );
    await syncStripeCustomerId(user, customerId);

    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/app`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: toUserFacingStripeError(error, "portal") },
      { status: 500 }
    );
  }
}
