import mongoose, { Schema, models, model } from "mongoose";

export type PartnerRedemptionEvent = "initial" | "renewal";

export interface IPartnerPromoRedemption {
  _id: mongoose.Types.ObjectId;
  partnerPromoId: mongoose.Types.ObjectId;
  code: string;
  partnerName: string;
  userId?: mongoose.Types.ObjectId;
  userEmail?: string;
  stripeSessionId?: string;
  stripeInvoiceId?: string;
  stripeSubscriptionId?: string;
  eventType: PartnerRedemptionEvent;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  discountPercent: number;
  revenueSharePercent: number;
  partnerShareAmount: number;
  tier?: "pro" | "premium";
  plan?: "monthly" | "annual";
  currency: string;
  createdAt: Date;
}

const PartnerPromoRedemptionSchema = new Schema<IPartnerPromoRedemption>(
  {
    partnerPromoId: { type: Schema.Types.ObjectId, ref: "PartnerPromo", required: true },
    code: { type: String, required: true, uppercase: true },
    partnerName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userEmail: String,
    stripeSessionId: String,
    stripeInvoiceId: { type: String, sparse: true, unique: true },
    stripeSubscriptionId: String,
    eventType: { type: String, enum: ["initial", "renewal"], required: true },
    grossAmount: { type: Number, required: true },
    discountAmount: { type: Number, required: true, default: 0 },
    netAmount: { type: Number, required: true },
    discountPercent: { type: Number, required: true },
    revenueSharePercent: { type: Number, required: true },
    partnerShareAmount: { type: Number, required: true },
    tier: { type: String, enum: ["pro", "premium"] },
    plan: { type: String, enum: ["monthly", "annual"] },
    currency: { type: String, default: "usd" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PartnerPromoRedemptionSchema.index({ partnerPromoId: 1, createdAt: -1 });
PartnerPromoRedemptionSchema.index({ code: 1, createdAt: -1 });

export const PartnerPromoRedemption =
  models.PartnerPromoRedemption ||
  model<IPartnerPromoRedemption>("PartnerPromoRedemption", PartnerPromoRedemptionSchema);
