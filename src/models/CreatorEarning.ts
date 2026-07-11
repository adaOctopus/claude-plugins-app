import mongoose, { Schema, models, model } from "mongoose";

export type EarningStatus = "pending_manual_payout" | "paid";

export interface ICreatorEarning {
  _id: mongoose.Types.ObjectId;
  creatorId: mongoose.Types.ObjectId;
  pluginId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  status: EarningStatus;
  stripeSessionId?: string;
  createdAt: Date;
}

const CreatorEarningSchema = new Schema<ICreatorEarning>(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pluginId: { type: Schema.Types.ObjectId, ref: "Plugin", required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    grossAmount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: ["pending_manual_payout", "paid"],
      default: "pending_manual_payout",
    },
    stripeSessionId: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const CreatorEarning =
  models.CreatorEarning ||
  model<ICreatorEarning>("CreatorEarning", CreatorEarningSchema);

export const PLATFORM_FEE_RATE = 0.01;

export function calculateEarnings(grossAmount: number) {
  const platformFee = Math.round(grossAmount * PLATFORM_FEE_RATE * 100) / 100;
  const netAmount = Math.round((grossAmount - platformFee) * 100) / 100;
  return { platformFee, netAmount };
}
