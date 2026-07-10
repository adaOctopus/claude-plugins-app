import { connectDB } from "@/lib/db";
import { appendWaitlistEmailToSheet } from "@/lib/google-sheets-waitlist";
import { WaitlistSignup } from "@/models/WaitlistSignup";

type SaveWaitlistInput = {
  email: string;
  source?: string;
};

/** Persist waitlist signup to MongoDB, then optionally mirror to Google Sheets. */
export async function saveWaitlistSignup({
  email,
  source = "landing",
}: SaveWaitlistInput): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!process.env.MONGODB_URI) {
    await appendWaitlistEmailToSheet({ email: normalizedEmail, source });
    return;
  }

  await connectDB();

  try {
    await WaitlistSignup.create({ email: normalizedEmail, source });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      // Already on the list — treat as success.
    } else {
      throw error;
    }
  }

  if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    try {
      await appendWaitlistEmailToSheet({ email: normalizedEmail, source });
    } catch (error) {
      console.error("Waitlist Google Sheets sync failed:", error);
    }
  }
}
