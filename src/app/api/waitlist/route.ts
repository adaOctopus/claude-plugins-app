import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveWaitlistSignup } from "@/lib/waitlist";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  source: z.string().trim().max(120).optional(),
});

/** Save waitlist email to MongoDB (+ optional Google Sheets sync). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = schema.parse(body);

    await saveWaitlistSignup({ email, source });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid email." },
        { status: 400 }
      );
    }

    console.error("Waitlist signup failed:", error);

    const message =
      error instanceof Error ? error.message : "Could not save your email. Try again in a moment.";

    const isConfigError =
      message.includes("GOOGLE_SHEETS_WEBHOOK_URL") ||
      message.includes("Access Denied") ||
      message.includes("/exec");

    return NextResponse.json(
      {
        error: isConfigError
          ? "Waitlist is temporarily unavailable. Please try again soon."
          : message,
      },
      { status: 500 }
    );
  }
}
