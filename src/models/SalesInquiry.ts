import mongoose, { Schema, models, model } from "mongoose";

export interface ISalesInquiry {
  _id: mongoose.Types.ObjectId;
  email: string;
  description: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const SalesInquirySchema = new Schema<ISalesInquiry>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    source: { type: String, default: "enterprise-pricing", trim: true },
  },
  { timestamps: true }
);

export const SalesInquiry =
  models.SalesInquiry || model<ISalesInquiry>("SalesInquiry", SalesInquirySchema);
