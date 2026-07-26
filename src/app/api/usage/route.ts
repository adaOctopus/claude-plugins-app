import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserUsage } from "@/lib/usage";
import { USAGE_LIMITS } from "@/lib/usage-limits";

/** Returns run quota summary for the logged-in user. */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const usage = await getUserUsage(session.id);

  return NextResponse.json({
    usage,
    creditPacks: USAGE_LIMITS.creditPacks,
    maxCostPerRunUsd: USAGE_LIMITS.maxCostPerRunUsd,
  });
}
