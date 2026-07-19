import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveSalesInquiry } from "@/lib/sales-inquiry";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  description: z
    .string()
    .trim()
    .min(10, "Tell us a bit more about what your team needs (at least 10 characters).")
    .max(2000, "Description is too long."),
  source: z.string().trim().max(120).optional(),
});

/** Save enterprise sales inquiry to MongoDB (+ optional Google Sheets SALES tab sync). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, description, source } = schema.parse(body);

    await saveSalesInquiry({ email, description, source });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid submission." },
        { status: 400 }
      );
    }

    console.error("Sales inquiry failed:", error);

    const message =
      error instanceof Error ? error.message : "Could not send your message. Try again in a moment.";

    const isConfigError =
      message.includes("GOOGLE_SHEETS_WEBHOOK_URL") ||
      message.includes("Access Denied") ||
      message.includes("/exec");

    return NextResponse.json(
      {
        error: isConfigError
          ? "Contact form is temporarily unavailable. Please try again soon."
          : message,
      },
      { status: 500 }
    );
  }
}
