import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { provisionCoolplugzForUser } from "@/lib/provision-coolplugz";

const schema = z.object({
  label: z.string().max(120).optional(),
});

/** Mint or return the buyer's unique CoolPlugz MCP URL after payment. */
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
        { error: "No active subscription found for this account" },
        { status: 403 }
      );
    }

    return NextResponse.json({ mcpUrl: result.mcpUrl, provisioned: result.provisioned });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Provision CoolPlugz error:", error);
    const message =
      error instanceof Error ? error.message : "Could not provision MCP URL";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
