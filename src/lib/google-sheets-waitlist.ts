type WaitlistRow = {
  email: string;
  source?: string;
};

/** Append a waitlist signup to Google Sheets via Apps Script web app URL. */
export async function appendWaitlistEmail({
  email,
  source = "landing",
}: WaitlistRow): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error(
      "Waitlist is not configured. Set GOOGLE_SHEETS_WEBHOOK_URL in your environment."
    );
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      source,
      submittedAt: new Date().toISOString(),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Google Sheets webhook failed (${response.status})`);
  }
}
