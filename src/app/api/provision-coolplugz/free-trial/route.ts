import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { provisionFreeTrialForUser } from "@/lib/provision-coolplugz";
import { toUserFacingProvisionError } from "@/lib/user-facing-errors";

/** Provision MCP URL for a signed-in user's 7-day free trial. */
export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await provisionFreeTrialForUser(session.id);

    return NextResponse.json({
      mcpUrl: result.mcpUrl,
      provisioned: result.provisioned,
      access: "trial",
      ...(result.expiresAt ? { expiresAt: result.expiresAt.toISOString() } : {}),
    });
  } catch (error) {
    console.error("Free trial provision error:", error);
    const rawMessage =
      error instanceof Error ? error.message : "Could not start free trial";
    const status = /already been used|active pro subscription/i.test(rawMessage) ? 403 : 502;
    return NextResponse.json(
      { error: toUserFacingProvisionError(rawMessage) },
      { status }
    );
  }
}
