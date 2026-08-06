import type Stripe from "stripe";
import mongoose from "mongoose";
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
  source?: IPartnerPromo["source"];
  userId?: string;
};

export function getReferralDiscountPercent(): number {
  const raw = process.env.REFERRAL_DISCOUNT_PERCENT;
  const parsed = raw ? Number(raw) : 15;
  return Number.isFinite(parsed) ? parsed : 15;
}

export function getReferralRevenueSharePercent(): number {
  const raw = process.env.REFERRAL_REVENUE_SHARE_PERCENT;
  const parsed = raw ? Number(raw) : 15;
  return Number.isFinite(parsed) ? parsed : 15;
}

function sanitizeEmailLocalPart(email: string): string {
  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
  return cleaned || "DEV";
}

export function buildDevReferralCode(email: string): string {
  const part = sanitizeEmailLocalPart(email);
  const seq = String(Date.now() % 10000).padStart(4, "0");
  return normalizePromoCode(`COOLPLUGZ${part}${seq}`);
}

function partnerDisplayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "developer";
  return local.replace(/[._-]+/g, " ").trim() || "Developer";
}

/** Stripe coupon names are capped at 40 characters. */
export function stripeCouponDisplayName(partnerName: string, code: string): string {
  const normalizedCode = normalizePromoCode(code);
  const full = `Partner: ${partnerName.trim()} (${normalizedCode})`;
  if (full.length <= 40) return full;

  const prefix = "Partner: ";
  const suffix = ` (${normalizedCode})`;
  const nameRoom = 40 - prefix.length - suffix.length;
  const shortName =
    nameRoom > 0 ? partnerName.trim().slice(0, nameRoom) : partnerName.trim().slice(0, 1);

  return `${prefix}${shortName}${suffix}`.slice(0, 40);
}

export type PartnerPromoStats = {
  redemptionCount: number;
  totalNetRevenue: number;
  totalPartnerShare: number;
};

export async function getPartnerPromoStats(promoId: string): Promise<PartnerPromoStats> {
  await connectDB();
  const promoObjectId = new mongoose.Types.ObjectId(promoId);
  const rows = await PartnerPromoRedemption.aggregate<{
    redemptionCount: number;
    totalNetRevenue: number;
    totalPartnerShare: number;
  }>([
    { $match: { partnerPromoId: promoObjectId } },
    {
      $group: {
        _id: null,
        redemptionCount: { $sum: 1 },
        totalNetRevenue: { $sum: "$netAmount" },
        totalPartnerShare: { $sum: "$partnerShareAmount" },
      },
    },
  ]);

  const row = rows[0];
  return {
    redemptionCount: row?.redemptionCount ?? 0,
    totalNetRevenue: row?.totalNetRevenue ?? 0,
    totalPartnerShare: row?.totalPartnerShare ?? 0,
  };
}

export async function findDevReferralByEmail(email: string): Promise<IPartnerPromo | null> {
  await connectDB();
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  return PartnerPromo.findOne({
    partnerEmail: normalized,
    source: "dev_referral",
    active: true,
  });
}

export function buildReferralShareUrl(code: string, appUrl?: string): string {
  const base = (appUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://www.coolplugz.com").replace(
    /\/$/,
    ""
  );
  return `${base}/?promo=${encodeURIComponent(code)}#pricing`;
}

/** Self-serve dev referral — one active code per email, 15% friend discount / 15% share by default. */
export async function createDevReferralPromo(
  email: string,
  userId?: string
): Promise<{ promo: IPartnerPromo; stats: PartnerPromoStats; created: boolean }> {
  await connectDB();

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    throw new Error("Enter a valid email address");
  }

  const existing = await findDevReferralByEmail(normalizedEmail);
  if (existing) {
    const stats = await getPartnerPromoStats(existing._id.toString());
    return { promo: existing, stats, created: false };
  }

  const discountPercent = getReferralDiscountPercent();
  const revenueSharePercent = getReferralRevenueSharePercent();
  const partnerName = partnerDisplayNameFromEmail(normalizedEmail);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = buildDevReferralCode(normalizedEmail);
    try {
      const promo = await createPartnerPromo({
        code,
        partnerName,
        partnerEmail: normalizedEmail,
        discountPercent,
        revenueSharePercent,
        source: "dev_referral",
        userId,
        notes: "Self-serve dev referral",
      });
      const stats = await getPartnerPromoStats(promo._id.toString());
      return { promo, stats, created: true };
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists") && attempt < 4) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Could not generate a unique referral code. Try again.");
}

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
    name: stripeCouponDisplayName(input.partnerName, code),
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
    source: input.source ?? "admin",
    ...(input.userId ? { userId: input.userId } : {}),
    notes: input.notes?.trim(),
  });
}

export function isSelfReferralPromo(
  promo: IPartnerPromo,
  customerEmail: string | undefined | null
): boolean {
  if (!promo.partnerEmail || !customerEmail) return false;
  return promo.partnerEmail.trim().toLowerCase() === customerEmail.trim().toLowerCase();
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
