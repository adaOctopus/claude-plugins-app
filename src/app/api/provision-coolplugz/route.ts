// app/api/provision-coolplugz/route.ts
// Call this AFTER payment is confirmed (e.g. from your Stripe/payment webhook or success page).
// Returns the unique MCP URL for the buyer to paste into Claude.

import { NextRequest, NextResponse } from "next/server";

const COOLPLUGZ_API = process.env.COOLPLUGZ_API_URL!; // e.g. https://api.coolplugz.com
const ADMIN_SECRET = process.env.COOLPLUGZ_ADMIN_SECRET!;

export async function POST(req: NextRequest) {
  const { email, tier, label } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const res = await fetch(`${COOLPLUGZ_API}/admin/keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_SECRET}`,
    },
    body: JSON.stringify({
      email,
      tier: tier || "pro",
      label: label || null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: "Failed to provision plugin access", detail: err },
      { status: 500 }
    );
  }

  const data = await res.json();

  // data = { key, tier, userId, mcpUrl, label }
  return NextResponse.json({
    mcpUrl: data.mcpUrl,
    tier: data.tier,
  });
}
