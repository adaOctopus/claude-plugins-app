import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLink } from "@/lib/auth";

function safeRedirect(path: string | null, appUrl: string) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return `${appUrl}/install`;
  }
  return `${appUrl}${path}`;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const redirect = request.nextUrl.searchParams.get("redirect");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${appUrl}/install?error=missing_token`);
  }

  const user = await verifyMagicLink(token);
  if (!user) {
    return NextResponse.redirect(`${appUrl}/install?error=invalid_token`);
  }

  return NextResponse.redirect(safeRedirect(redirect, appUrl));
}
