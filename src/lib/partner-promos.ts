import type Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { getStripe, getInvoiceSubscriptionId } from "@/lib/stripe";
import { PartnerPromo, type IPartnerPromo } from "@/models/PartnerPromo";
import { PartnerPromoRedemption } from "@/models/PartnerPromoRedemption";

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

export function calculatePartnerShare(netAmount: number, revenueSharePercent: number): number {
  return Math.round(netAmount * (revenueSharePercent / 100) * 100) / 100;
}

export async function findActivePartnerPromo(code: string): Promise<IPartnerPromo | null> {
  await connectDB();
  const normalized = normalizePromoCode(code);
  if (!normalized) return null;

  return PartnerPromo.findOne({ code: normalized, active: true });
}

export type CreatePartnerPromoInput = {
  code: string;
  partnerName: string;
  partnerEmail?: string;
  discountPercent?: number;
  revenueSharePercent?: number;
  notes?: string;
};

/** Create Stripe coupon + promotion code and persist partner promo in Mongo. */
export async function createPartnerPromo(input: CreatePartnerPromoInput): Promise<IPartnerPromo> {
  await connectDB();
  const stripe = getStripe();

  const code = normalizePromoCode(input.code);
  if (!code) {
    throw new Error("Promo code is required");
  }

  const existing = await PartnerPromo.findOne({ code });
  if (existing) {
    throw new Error(`Promo code ${code} already exists`);
  }

  const discountPercent = input.discountPercent ?? 25;
  const revenueSharePercent = input.revenueSharePercent ?? 25;

  const coupon = await stripe.coupons.create({
    percent_off: discountPercent,
    duration: "forever",
    name: `Partner: ${input.partnerName} (${code})`,
    metadata: {
      partnerName: input.partnerName,
      promoCode: code,
    },
  });

  let promotionCode: Stripe.PromotionCode;
  try {
    promotionCode = await stripe.promotionCodes.create({
      promotion: {
        type: "coupon",
        coupon: coupon.id,
      },
      code,
      active: true,
      metadata: {
        partnerName: input.partnerName,
      },
    });
  } catch (error) {
    await stripe.coupons.del(coupon.id).catch(() => undefined);
    throw error;
  }

  return PartnerPromo.create({
    code,
    partnerName: input.partnerName.trim(),
    partnerEmail: input.partnerEmail?.trim().toLowerCase(),
    discountPercent,
    revenueSharePercent,
    stripeCouponId: coupon.id,
    stripePromotionCodeId: promotionCode.id,
    active: true,
    notes: input.notes?.trim(),
  });
}

export async function setPartnerPromoActive(code: string, active: boolean) {
  await connectDB();
  const stripe = getStripe();
  const promo = await PartnerPromo.findOne({ code: normalizePromoCode(code) });
  if (!promo) {
    throw new Error("Promo not found");
  }

  await stripe.promotionCodes.update(promo.stripePromotionCodeId, { active });
  promo.active = active;
  await promo.save();
  return promo;
}

export async function listPartnerPromosWithStats() {
  await connectDB();
  const promos = await PartnerPromo.find().sort({ createdAt: -1 }).lean();

  const stats = await PartnerPromoRedemption.aggregate<{
    _id: unknown;
    redemptionCount: number;
    totalNetRevenue: number;
    totalPartnerShare: number;
  }>([
    {
      $group: {
        _id: "$partnerPromoId",
        redemptionCount: { $sum: 1 },
        totalNetRevenue: { $sum: "$netAmount" },
        totalPartnerShare: { $sum: "$partnerShareAmount" },
      },
    },
  ]);

  const statsByPromo = new Map(stats.map((row) => [String(row._id), row]));

  return promos.map((promo) => {
    const row = statsByPromo.get(String(promo._id));
    return {
      ...promo,
      stats: {
        redemptionCount: row?.redemptionCount ?? 0,
        totalNetRevenue: row?.totalNetRevenue ?? 0,
        totalPartnerShare: row?.totalPartnerShare ?? 0,
      },
    };
  });
}

type RecordRedemptionInput = {
  promo: IPartnerPromo;
  userId?: string;
  userEmail?: string;
  stripeSessionId?: string;
  stripeInvoiceId?: string;
  stripeSubscriptionId?: string;
  eventType: "initial" | "renewal";
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  tier?: "pro" | "premium";
  plan?: "monthly" | "annual";
  currency?: string;
};

export async function recordPartnerPromoRedemption(input: RecordRedemptionInput) {
  await connectDB();

  if (input.stripeInvoiceId) {
    const existing = await PartnerPromoRedemption.findOne({
      stripeInvoiceId: input.stripeInvoiceId,
    });
    if (existing) return existing;
  }

  if (input.eventType === "initial" && input.stripeSessionId) {
    const existing = await PartnerPromoRedemption.findOne({
      stripeSessionId: input.stripeSessionId,
      eventType: "initial",
    });
    if (existing) return existing;
  }

  const partnerShareAmount = calculatePartnerShare(
    input.netAmount,
    input.promo.revenueSharePercent
  );

  return PartnerPromoRedemption.create({
    partnerPromoId: input.promo._id,
    code: input.promo.code,
    partnerName: input.promo.partnerName,
    userId: input.userId,
    userEmail: input.userEmail,
    stripeSessionId: input.stripeSessionId,
    stripeInvoiceId: input.stripeInvoiceId,
    stripeSubscriptionId: input.stripeSubscriptionId,
    eventType: input.eventType,
    grossAmount: input.grossAmount,
    discountAmount: input.discountAmount,
    netAmount: input.netAmount,
    discountPercent: input.promo.discountPercent,
    revenueSharePercent: input.promo.revenueSharePercent,
    partnerShareAmount,
    tier: input.tier,
    plan: input.plan,
    currency: input.currency ?? "usd",
  });
}

/** Resolve promo from checkout session metadata or Stripe promotion code id. */
export async function resolvePromoFromCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<IPartnerPromo | null> {
  await connectDB();

  const metadataCode = session.metadata?.promoCode;
  if (metadataCode) {
    const promo = await findActivePartnerPromo(metadataCode);
    if (promo) return promo;
  }

  const promoId = session.metadata?.partnerPromoId;
  if (promoId) {
    const promo = await PartnerPromo.findOne({ _id: promoId, active: true });
    if (promo) return promo;
  }

  return null;
}

export async function recordCheckoutPartnerRedemption(
  session: Stripe.Checkout.Session,
  promo: IPartnerPromo,
  userId: string,
  userEmail: string,
  tier: "pro" | "premium",
  plan: "monthly" | "annual"
) {
  const grossCents = session.amount_subtotal ?? session.amount_total ?? 0;
  const netCents = session.amount_total ?? 0;
  const discountCents = session.total_details?.amount_discount ?? grossCents - netCents;

  return recordPartnerPromoRedemption({
    promo,
    userId,
    userEmail,
    stripeSessionId: session.id,
    stripeSubscriptionId:
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
    eventType: "initial",
    grossAmount: grossCents / 100,
    discountAmount: Math.max(0, discountCents) / 100,
    netAmount: netCents / 100,
    tier,
    plan,
    currency: session.currency ?? "usd",
  });
}

export async function recordInvoicePartnerRedemption(
  invoice: Stripe.Invoice,
  promo: IPartnerPromo,
  tier?: "pro" | "premium",
  plan?: "monthly" | "annual"
) {
  const grossCents = invoice.subtotal ?? invoice.amount_paid ?? 0;
  const netCents = invoice.amount_paid ?? 0;
  const discountCents = invoice.total_discount_amounts?.reduce((sum, d) => sum + d.amount, 0) ?? 0;

  return recordPartnerPromoRedemption({
    promo,
    userEmail: invoice.customer_email ?? undefined,
    stripeInvoiceId: invoice.id,
    stripeSubscriptionId: getInvoiceSubscriptionId(invoice) ?? undefined,
    eventType: "renewal",
    grossAmount: grossCents / 100,
    discountAmount: discountCents / 100,
    netAmount: netCents / 100,
    tier,
    plan,
    currency: invoice.currency ?? "usd",
  });
}
