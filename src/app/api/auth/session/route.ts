import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/entitlements";

/** Lightweight session check for client UI (navbar, checkout buttons). */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, hasActiveSubscription: false });
  }

  let subscribed = false;
  try {
    subscribed = await hasActiveSubscription(session.id);
  } catch {
    subscribed = false;
  }

  return NextResponse.json({
    authenticated: true,
    hasActiveSubscription: subscribed,
  });
}
