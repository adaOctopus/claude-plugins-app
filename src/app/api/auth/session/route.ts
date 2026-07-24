import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/** Lightweight session check for client UI (navbar) after cookie changes. */
export async function GET() {
  const session = await getSession();
  return NextResponse.json({
    authenticated: !!session,
  });
}
