import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const WIP_BLOCKED = [
  "/plugins",
  "/pricing",
  "/install",
  "/premium",
  "/app/upload",
  "/app/create",
];

function isWipMode(): boolean {
  return process.env.NEXT_PUBLIC_SITE_MODE !== "LIVE";
}

export function middleware(request: NextRequest) {
  if (!isWipMode()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const blocked = WIP_BLOCKED.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!blocked) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.hash = "coming-soon";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/plugins/:path*",
    "/pricing",
    "/install/:path*",
    "/premium/:path*",
    "/app/upload",
    "/app/create",
  ],
};
