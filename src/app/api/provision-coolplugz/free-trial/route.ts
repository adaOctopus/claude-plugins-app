import { NextResponse } from "next/server";

/** Free trial provisioning removed — Daily Pass requires payment first. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Free trial is no longer available. Buy a Daily Pass (€5) or Pro subscription from the pricing page.",
    },
    { status: 410 }
  );
}
