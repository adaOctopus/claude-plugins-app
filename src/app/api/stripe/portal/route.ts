import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { User } from "@/models/User";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.id);
    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: "No billing account" }, { status: 400 });
    }

    const stripe = getStripe();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/app`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json({ error: "Portal failed" }, { status: 500 });
  }
}
