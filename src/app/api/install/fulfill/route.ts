import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  fulfillCheckoutSession,
  getFlagshipInstallSlug,
} from "@/lib/fulfill-checkout";

const schema = z.object({
  session_id: z.string().min(1),
});

/** Complete Stripe Checkout — session cookie + redirect target for install guide. */
export async function POST(request: NextRequest) {
  try {
    const { session_id } = schema.parse(await request.json());
    const user = await fulfillCheckoutSession(session_id);
    if (!user) {
      return NextResponse.json({ error: "Invalid or incomplete checkout" }, { status: 400 });
    }

    const slug = await getFlagshipInstallSlug();
    return NextResponse.json({
      redirect: `/install/${slug}`,
      email: user.email,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }
    console.error("Fulfill checkout error:", error);
    return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
  }
}
