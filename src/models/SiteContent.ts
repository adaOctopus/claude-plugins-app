import mongoose, { Schema, models, model } from "mongoose";

export interface ISiteContent {
  _id: mongoose.Types.ObjectId;
  key: string;
  value: Record<string, unknown>;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const SiteContent =
  models.SiteContent ||
  model<ISiteContent>("SiteContent", SiteContentSchema);
