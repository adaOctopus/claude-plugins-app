import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "buyer" | "creator" | "admin";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  stripeCustomerId?: string;
  /** Unique CoolPlugz MCP URL — provisioned after payment or daily pass. */
  mcpUrl?: string;
  /** Paid daily pass — 24h MCP access window. */
  dailyPassStartedAt?: Date;
  dailyPassExpiresAt?: Date;
  /** Legacy free trial — existing rows only; no new trials. */
  freeTrialStartedAt?: Date;
  freeTrialEndsAt?: Date;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: String,
    stripeCustomerId: String,
    mcpUrl: String,
    dailyPassStartedAt: Date,
    dailyPassExpiresAt: Date,
    freeTrialStartedAt: Date,
    freeTrialEndsAt: Date,
    role: {
      type: String,
      enum: ["buyer", "creator", "admin"],
      default: "buyer",
    },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
