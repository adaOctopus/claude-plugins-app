import { NextResponse } from "next/server";

/** Free trial provisioning removed — Starter requires payment first. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Free trial is no longer available. Buy Starter ($5) or a Pro subscription from the pricing page.",
    },
    { status: 410 }
  );
}
