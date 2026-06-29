import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLink } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${appUrl}/login?error=missing_token`);
  }

  const user = await verifyMagicLink(token);
  if (!user) {
    return NextResponse.redirect(`${appUrl}/login?error=invalid_token`);
  }

  return NextResponse.redirect(`${appUrl}/app`);
}
