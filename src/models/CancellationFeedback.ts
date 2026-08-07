import mongoose, { Schema, models, model } from "mongoose";

export interface ICancellationFeedback {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  email: string;
  cancellationFeedback: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CancellationFeedbackSchema = new Schema<ICancellationFeedback>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    cancellationFeedback: { type: String, required: true, trim: true },
    stripeSubscriptionId: { type: String, trim: true },
  },
  { timestamps: true }
);

export const CancellationFeedback =
  models.CancellationFeedback ||
  model<ICancellationFeedback>("CancellationFeedback", CancellationFeedbackSchema);
