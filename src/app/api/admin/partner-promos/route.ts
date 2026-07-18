import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertAdminRequest } from "@/lib/admin-auth";
import {
  createPartnerPromo,
  listPartnerPromosWithStats,
  normalizePromoCode,
  setPartnerPromoActive,
} from "@/lib/partner-promos";

const createSchema = z.object({
  code: z.string().min(2).max(40),
  partnerName: z.string().min(1).max(120),
  partnerEmail: z.string().email().optional(),
  discountPercent: z.number().min(1).max(100).optional(),
  revenueSharePercent: z.number().min(0).max(100).optional(),
  notes: z.string().max(500).optional(),
});

const patchSchema = z.object({
  code: z.string().min(2).max(40),
  active: z.boolean(),
});

/** List partner promos + revenue-share stats (admin). */
export async function GET(request: NextRequest) {
  if (!assertAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const promos = await listPartnerPromosWithStats();
    return NextResponse.json({ promos });
  } catch (error) {
    console.error("List partner promos error:", error);
    return NextResponse.json({ error: "Could not list promos" }, { status: 500 });
  }
}

/** Create a new influencer promo — Stripe coupon + Mongo tracking (admin). */
export async function POST(request: NextRequest) {
  if (!assertAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = createSchema.parse(await request.json());
    const promo = await createPartnerPromo(body);

    return NextResponse.json({
      promo: {
        id: promo._id.toString(),
        code: promo.code,
        partnerName: promo.partnerName,
        partnerEmail: promo.partnerEmail,
        discountPercent: promo.discountPercent,
        revenueSharePercent: promo.revenueSharePercent,
        stripeCouponId: promo.stripeCouponId,
        stripePromotionCodeId: promo.stripePromotionCodeId,
        active: promo.active,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Create partner promo error:", error);
    const message = error instanceof Error ? error.message : "Could not create promo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Activate or deactivate a partner promo (admin). */
export async function PATCH(request: NextRequest) {
  if (!assertAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, active } = patchSchema.parse(await request.json());
    const promo = await setPartnerPromoActive(normalizePromoCode(code), active);
    return NextResponse.json({
      promo: {
        code: promo.code,
        active: promo.active,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Update partner promo error:", error);
    const message = error instanceof Error ? error.message : "Could not update promo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
