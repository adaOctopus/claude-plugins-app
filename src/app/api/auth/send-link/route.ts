import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createMagicLink } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email(),
  redirect: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, redirect } = schema.parse(body);
    const { token } = await createMagicLink(email);
    const result = await sendMagicLinkEmail(email, token, redirect);
    return NextResponse.json({
      success: true,
      ...(result.dev && result.verifyUrl ? { devLink: result.verifyUrl } : {}),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("Magic link error:", error);
    const isDbError =
      error instanceof Error &&
      (/mongo|atlas|connect/i.test(error.message) ||
        error.name === "MongooseServerSelectionError");
    const message = isDbError
      ? "Database unavailable. In MongoDB Atlas, allow your IP (or 0.0.0.0/0 for dev)."
      : "Failed to send link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
