import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "buyer" | "creator" | "admin";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  stripeCustomerId?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: String,
    stripeCustomerId: String,
    role: {
      type: String,
      enum: ["buyer", "creator", "admin"],
      default: "buyer",
    },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
