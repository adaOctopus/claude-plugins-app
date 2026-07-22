import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { provisionCoolplugzForUser } from "@/lib/provision-coolplugz";
import { toUserFacingProvisionError } from "@/lib/user-facing-errors";

const schema = z.object({
  label: z.string().max(120).optional(),
});

/** Mint unique MCP URL for a signed-in paid subscriber via api.coolplugz.com. */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = schema.parse(await request.json().catch(() => ({})));
    const result = await provisionCoolplugzForUser(session.id, body.label);

    if (!result) {
      return NextResponse.json(
        { error: "No active subscription found. Subscribe at /pricing first." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      mcpUrl: result.mcpUrl,
      provisioned: result.provisioned,
      access: "pro",
      ...(result.expiresAt ? { expiresAt: result.expiresAt.toISOString() } : {}),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Provision error:", error);
    const rawMessage =
      error instanceof Error ? error.message : "Could not generate MCP URL";
    return NextResponse.json(
      { error: toUserFacingProvisionError(rawMessage) },
      { status: 502 }
    );
  }
}
