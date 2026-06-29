import mongoose, { Schema, models, model } from "mongoose";

export interface IMagicLinkToken {
  _id: mongoose.Types.ObjectId;
  email: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

const MagicLinkTokenSchema = new Schema<IMagicLinkToken>(
  {
    email: { type: String, required: true, lowercase: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    usedAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

MagicLinkTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const MagicLinkToken =
  models.MagicLinkToken ||
  model<IMagicLinkToken>("MagicLinkToken", MagicLinkTokenSchema);
