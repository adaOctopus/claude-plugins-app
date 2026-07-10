import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { appendWaitlistEmail } from "@/lib/google-sheets-waitlist";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  source: z.string().trim().max(120).optional(),
});

/** Save waitlist email to Google Sheets (via Apps Script webhook). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = schema.parse(body);

    await appendWaitlistEmail({ email, source });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid email." },
        { status: 400 }
      );
    }

    console.error("Waitlist signup failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not save your email. Try again in a moment.",
      },
      { status: 500 }
    );
  }
}
