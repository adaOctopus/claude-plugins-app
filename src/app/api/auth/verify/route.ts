import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyMagicLink } from "@/lib/auth";

function safeRedirectPath(path: string | null | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/app";
  }
  return path;
}

const verifySchema = z.object({
  token: z.string().min(1),
  email: z.string().email().optional(),
  redirect: z.string().optional(),
});

/** Legacy GET links redirect to the verify page without consuming the token. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const redirect = request.nextUrl.searchParams.get("redirect");
  const email = request.nextUrl.searchParams.get("email");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${appUrl}/login?error=missing_token`);
  }

  const params = new URLSearchParams({ token });
  if (email) params.set("email", email);
  if (redirect) params.set("redirect", redirect);

  return NextResponse.redirect(`${appUrl}/login/verify?${params.toString()}`);
}

/** POST verifies the token and sets the session cookie (safe from email link prefetch). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email, redirect } = verifySchema.parse(body);
    const user = await verifyMagicLink(token, email);

    if (!user) {
      return NextResponse.json({ error: "invalid_token" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      redirect: safeRedirectPath(redirect),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
    console.error("Magic link verify error:", error);
    return NextResponse.json({ error: "verify_failed" }, { status: 500 });
  }
}
