import { NextRequest, NextResponse } from "next/server";
import { findActivePartnerPromo, normalizePromoCode } from "@/lib/partner-promos";

/** Validate a partner promo code before checkout. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code?.trim()) {
    return NextResponse.json({ valid: false, error: "Code required" }, { status: 400 });
  }

  try {
    const promo = await findActivePartnerPromo(normalizePromoCode(code));
    if (!promo) {
      return NextResponse.json({ valid: false, error: "Invalid or expired promo code" });
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      partnerName: promo.partnerName,
      discountPercent: promo.discountPercent,
    });
  } catch (error) {
    console.error("Validate promo error:", error);
    return NextResponse.json({ valid: false, error: "Could not validate code" }, { status: 500 });
  }
}
