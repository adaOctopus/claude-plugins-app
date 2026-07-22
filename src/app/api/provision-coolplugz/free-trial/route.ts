import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { isWipSite } from "@/lib/site-mode";
import { provisionFreeTrialForUser } from "@/lib/provision-coolplugz";
import { toUserFacingProvisionError } from "@/lib/user-facing-errors";

const schema = z.object({
  label: z.string().max(120).optional(),
});

/** Mint a card-free 7-day trial MCP URL via the CoolPlugz server. */
export async function POST(request: NextRequest) {
  try {
    if (isWipSite()) {
      return NextResponse.json(
        { error: "Free trial is not open yet. Join the waitlist on the homepage." },
        { status: 403 }
      );
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = schema.parse(await request.json().catch(() => ({})));
    const result = await provisionFreeTrialForUser(session.id, body.label);

    return NextResponse.json({
      mcpUrl: result.mcpUrl,
      provisioned: result.provisioned,
      access: "free-trial",
      ...(result.expiresAt ? { expiresAt: result.expiresAt.toISOString() } : {}),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Free trial provision error:", error);
    const rawMessage =
      error instanceof Error ? error.message : "Could not start free trial";
    const message = toUserFacingProvisionError(rawMessage);
    const status = rawMessage.includes("already") ? 409 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
