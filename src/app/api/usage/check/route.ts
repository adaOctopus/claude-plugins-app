import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertAdminRequest } from "@/lib/admin-auth";
import { getUsageCheckByEmail } from "@/lib/usage";

const schema = z.object({
  email: z.string().email(),
});

/**
 * MCP server read-only balance check — does not decrement runs.
 * Auth: Bearer COOLPLUGZ_ADMIN_SECRET (same as POST /api/usage/consume).
 */
export async function POST(request: NextRequest) {
  if (!assertAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email } = schema.parse(body);
    const result = await getUsageCheckByEmail(email);

    if (!result.ok) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      usage: { totalRunsRemaining: result.totalRunsRemaining },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("Usage check error:", error);
    return NextResponse.json({ error: "Failed to check usage" }, { status: 500 });
  }
}
