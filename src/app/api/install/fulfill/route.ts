import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fulfillCheckoutSession } from "@/lib/fulfill-checkout";
import { UNIQUE_MCP_URL_PATH } from "@/lib/mcp-setup-paths";
import { getUserMcpUrl } from "@/lib/provision-coolplugz";

const schema = z.object({
  session_id: z.string().min(1),
});

/** Complete Stripe Checkout — session cookie + redirect to unique MCP URL page. */
export async function POST(request: NextRequest) {
  try {
    const { session_id } = schema.parse(await request.json());
    const user = await fulfillCheckoutSession(session_id);
    if (!user) {
      return NextResponse.json({ error: "Invalid or incomplete checkout" }, { status: 400 });
    }

    const mcpUrl = await getUserMcpUrl(user._id.toString());
    return NextResponse.json({
      redirect: UNIQUE_MCP_URL_PATH,
      email: user.email,
      mcpUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }
    console.error("Fulfill checkout error:", error);
    return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
  }
}
