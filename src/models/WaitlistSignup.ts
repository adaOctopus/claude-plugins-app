import mongoose, { Schema, models, model } from "mongoose";

export interface IWaitlistSignup {
  _id: mongoose.Types.ObjectId;
  email: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistSignupSchema = new Schema<IWaitlistSignup>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    source: { type: String, default: "landing", trim: true },
  },
  { timestamps: true }
);

export const WaitlistSignup =
  models.WaitlistSignup || model<IWaitlistSignup>("WaitlistSignup", WaitlistSignupSchema);
