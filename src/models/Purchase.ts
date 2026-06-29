import mongoose, { Schema, models, model } from "mongoose";

export type PurchaseType = "subscription" | "addon" | "one_time";

export interface IPurchase {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  pluginId?: mongoose.Types.ObjectId;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  type: PurchaseType;
  createdAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pluginId: { type: Schema.Types.ObjectId, ref: "Plugin" },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    amount: { type: Number, required: true },
    currency: { type: String, default: "eur" },
    type: {
      type: String,
      enum: ["subscription", "addon", "one_time"],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Purchase =
  models.Purchase || model<IPurchase>("Purchase", PurchaseSchema);
