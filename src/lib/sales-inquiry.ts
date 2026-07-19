import { connectDB } from "@/lib/db";
import { appendSalesInquiryToSheet } from "@/lib/google-sheets-waitlist";
import { SalesInquiry } from "@/models/SalesInquiry";

type SaveSalesInquiryInput = {
  email: string;
  description: string;
  source?: string;
};

/** Persist enterprise sales inquiry to MongoDB, then optionally mirror to Google Sheets (SALES tab). */
export async function saveSalesInquiry({
  email,
  description,
  source = "enterprise-pricing",
}: SaveSalesInquiryInput): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedDescription = description.trim();

  if (!process.env.MONGODB_URI) {
    await appendSalesInquiryToSheet({
      email: normalizedEmail,
      description: trimmedDescription,
      source,
    });
    return;
  }

  await connectDB();
  await SalesInquiry.create({
    email: normalizedEmail,
    description: trimmedDescription,
    source,
  });

  if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    try {
      await appendSalesInquiryToSheet({
        email: normalizedEmail,
        description: trimmedDescription,
        source,
      });
    } catch (error) {
      console.error("Sales inquiry Google Sheets sync failed:", error);
    }
  }
}
