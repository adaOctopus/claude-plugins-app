import { NextRequest, NextResponse } from "next/server";
import {
  buildReferralShareUrl,
  findDevReferralByEmail,
  getPartnerPromoStats,
} from "@/lib/partner-promos";
import { getReferralClientKey, isReferralRateLimited } from "@/lib/referral-rate-limit";

/** Lookup referral stats for a dev email that already has a code. */
export async function GET(request: NextRequest) {
  try {
    const rateKey = `${getReferralClientKey(request)}:stats`;
    if (await isReferralRateLimited(rateKey)) {
      return NextResponse.json(
        { error: "Too many requests. Try again in an hour." },
        { status: 429 }
      );
    }

    const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    const promo = await findDevReferralByEmail(email);
    if (!promo) {
      return NextResponse.json({ error: "No referral code found for this email" }, { status: 404 });
    }

    const stats = await getPartnerPromoStats(promo._id.toString());
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.coolplugz.com";

    return NextResponse.json({
      code: promo.code,
      shareUrl: buildReferralShareUrl(promo.code, appUrl),
      discountPercent: promo.discountPercent,
      revenueSharePercent: promo.revenueSharePercent,
      stats,
    });
  } catch (error) {
    console.error("Referral stats error:", error);
    return NextResponse.json({ error: "Could not load referral stats" }, { status: 500 });
  }
}
