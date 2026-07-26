import mongoose, { Schema, models, model } from "mongoose";

export interface IUserUsage {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  includedRunsUsed: number;
  includedRunsLimit: number;
  bonusRunsRemaining: number;
  periodStart: Date;
  periodEnd: Date;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserUsageSchema = new Schema<IUserUsage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    includedRunsUsed: { type: Number, default: 0, min: 0 },
    includedRunsLimit: { type: Number, required: true, min: 0 },
    bonusRunsRemaining: { type: Number, default: 0, min: 0 },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    lastSyncedAt: Date,
  },
  { timestamps: true }
);

export const UserUsage =
  models.UserUsage || model<IUserUsage>("UserUsage", UserUsageSchema);
