import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createMagicLink } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);
    const { token } = await createMagicLink(email);
    await sendMagicLinkEmail(email, token);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("Magic link error:", error);
    return NextResponse.json({ error: "Failed to send link" }, { status: 500 });
  }
}
