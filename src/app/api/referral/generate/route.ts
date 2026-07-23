import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  buildReferralShareUrl,
  createDevReferralPromo,
  getReferralDiscountPercent,
  getReferralRevenueSharePercent,
} from "@/lib/partner-promos";
import { getReferralClientKey, isReferralRateLimited } from "@/lib/referral-rate-limit";

const schema = z.object({
  email: z.string().email(),
});

/** Self-serve dev referral — generate or return existing promo code for an email. */
export async function POST(request: NextRequest) {
  try {
    const rateKey = getReferralClientKey(request);
    if (await isReferralRateLimited(rateKey)) {
      return NextResponse.json(
        { error: "Too many requests. Try again in an hour." },
        { status: 429 }
      );
    }

    const body = schema.parse(await request.json());
    const session = await getSession();

    const { promo, stats, created } = await createDevReferralPromo(
      body.email,
      session?.id
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.coolplugz.com";

    return NextResponse.json({
      code: promo.code,
      shareUrl: buildReferralShareUrl(promo.code, appUrl),
      discountPercent: promo.discountPercent,
      revenueSharePercent: promo.revenueSharePercent,
      created,
      stats,
      programDefaults: {
        discountPercent: getReferralDiscountPercent(),
        revenueSharePercent: getReferralRevenueSharePercent(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }
    console.error("Referral generate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not generate referral link" },
      { status: 500 }
    );
  }
}
