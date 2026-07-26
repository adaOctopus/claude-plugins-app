import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertAdminRequest } from "@/lib/admin-auth";
import { consumeRunByEmail } from "@/lib/usage";

const schema = z.object({
  email: z.string().email(),
});

/**
 * MCP server calls this when a task run starts — decrements the website usage ledger.
 * Auth: Bearer COOLPLUGZ_ADMIN_SECRET (same secret as MCP admin API).
 */
export async function POST(request: NextRequest) {
  if (!assertAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email } = schema.parse(body);
    const result = await consumeRunByEmail(email);

    if (!result.ok) {
      const status = result.reason === "no_runs_remaining" ? 402 : 404;
      return NextResponse.json(
        {
          success: false,
          error: result.reason,
          message:
            result.reason === "no_runs_remaining"
              ? "No runs remaining. User must top up or wait for period reset."
              : "No usage record for this email.",
        },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      usage: result.summary,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("Usage consume error:", error);
    return NextResponse.json({ error: "Failed to consume run" }, { status: 500 });
  }
}
