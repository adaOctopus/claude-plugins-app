import mongoose, { Schema, models, model } from "mongoose";
import { connectDB } from "@/lib/db";

interface IReferralRateLimit {
  key: string;
  count: number;
  windowStart: Date;
}

const ReferralRateLimitSchema = new Schema<IReferralRateLimit>(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 1 },
    windowStart: { type: Date, required: true },
  },
  { timestamps: false }
);

const ReferralRateLimit =
  models.ReferralRateLimit ||
  model<IReferralRateLimit>("ReferralRateLimit", ReferralRateLimitSchema);

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export function getReferralClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `referral:${ip}`;
}

/** Returns true when the client exceeded referral generate/stats limits. */
export async function isReferralRateLimited(key: string): Promise<boolean> {
  await connectDB();
  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);

  const existing = await ReferralRateLimit.findOne({ key });
  if (!existing || existing.windowStart < windowStart) {
    await ReferralRateLimit.findOneAndUpdate(
      { key },
      { count: 1, windowStart: now },
      { upsert: true, new: true }
    );
    return false;
  }

  if (existing.count >= MAX_PER_WINDOW) {
    return true;
  }

  existing.count += 1;
  await existing.save();
  return false;
}
