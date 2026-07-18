import mongoose, { Schema, models, model } from "mongoose";

export type SubscriptionPlan = "monthly" | "annual";
export type SubscriptionTier = "pro" | "premium";
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete";

export interface ISubscription {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  stripeSubscriptionId: string;
  plan: SubscriptionPlan;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  includedPluginIds: mongoose.Types.ObjectId[];
  addonPluginIds: mongoose.Types.ObjectId[];
  partnerPromoId?: mongoose.Types.ObjectId;
  partnerPromoCode?: string;
  partnerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    plan: { type: String, enum: ["monthly", "annual"], required: true },
    tier: { type: String, enum: ["pro", "premium"], default: "pro" },
    status: {
      type: String,
      enum: ["active", "canceled", "past_due", "trialing", "incomplete"],
      default: "active",
    },
    currentPeriodEnd: { type: Date, required: true },
    includedPluginIds: [{ type: Schema.Types.ObjectId, ref: "Plugin" }],
    addonPluginIds: [{ type: Schema.Types.ObjectId, ref: "Plugin" }],
    partnerPromoId: { type: Schema.Types.ObjectId, ref: "PartnerPromo" },
    partnerPromoCode: String,
    partnerName: String,
  },
  { timestamps: true }
);

export const Subscription =
  models.Subscription ||
  model<ISubscription>("Subscription", SubscriptionSchema);
