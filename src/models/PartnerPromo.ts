import mongoose, { Schema, models, model } from "mongoose";

export interface IPartnerPromo {
  _id: mongoose.Types.ObjectId;
  /** Uppercase partner-facing code, e.g. ALEX25 */
  code: string;
  partnerName: string;
  partnerEmail?: string;
  /** Customer discount, e.g. 25 = 25% off */
  discountPercent: number;
  /** Your payout to partner as % of net amount paid (after discount) */
  revenueSharePercent: number;
  stripeCouponId: string;
  stripePromotionCodeId: string;
  active: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerPromoSchema = new Schema<IPartnerPromo>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    partnerName: { type: String, required: true, trim: true },
    partnerEmail: { type: String, lowercase: true, trim: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100, default: 25 },
    revenueSharePercent: { type: Number, required: true, min: 0, max: 100, default: 25 },
    stripeCouponId: { type: String, required: true },
    stripePromotionCodeId: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    notes: String,
  },
  { timestamps: true }
);

export const PartnerPromo =
  models.PartnerPromo || model<IPartnerPromo>("PartnerPromo", PartnerPromoSchema);
