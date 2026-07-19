type WaitlistRow = {
  email: string;
  source?: string;
};

type SalesInquiryRow = {
  email: string;
  description: string;
  source?: string;
};

const EXEC_URL_PATTERN = /script\.google\.com\/macros\/s\/[^/]+\/exec/i;

function sanitizeWebhookUrl(raw: string): string {
  const url = raw.trim();

  if (url.includes("/macros/edit")) {
    throw new Error(
      "GOOGLE_SHEETS_WEBHOOK_URL is the script editor link. Redeploy the Apps Script as a Web app and use the URL ending in /exec."
    );
  }

  if (url.includes("docs.google.com/spreadsheets")) {
    throw new Error(
      "GOOGLE_SHEETS_WEBHOOK_URL must be the Apps Script Web app URL (.../macros/s/.../exec), not the Google Sheet link."
    );
  }

  if (!EXEC_URL_PATTERN.test(url)) {
    throw new Error(
      "GOOGLE_SHEETS_WEBHOOK_URL must look like https://script.google.com/macros/s/XXXX/exec"
    );
  }

  return url;
}

function isHtmlErrorResponse(text: string): boolean {
  const sample = text.slice(0, 200).toLowerCase();
  return sample.includes("<!doctype html") || sample.includes("<html");
}

async function postToGoogleSheets(payload: Record<string, unknown>): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  const url = sanitizeWebhookUrl(webhookUrl);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
    cache: "no-store",
  });

  const text = await response.text().catch(() => "");

  if (isHtmlErrorResponse(text)) {
    throw new Error(
      "Google Sheets web app returned Access Denied. Redeploy Apps Script with Execute as: Me and Who has access: Anyone, then use the /exec URL."
    );
  }

  let data: { ok?: boolean; error?: string } | null = null;
  try {
    data = JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    if (!response.ok) {
      throw new Error(`Google Sheets webhook failed (${response.status}).`);
    }
  }

  if (data && data.ok === false) {
    throw new Error(data.error || "Google Sheets webhook rejected the submission.");
  }

  if (!response.ok && data?.ok !== true) {
    throw new Error(`Google Sheets webhook failed (${response.status}).`);
  }
}

/** Append a waitlist signup to Google Sheets via a deployed Apps Script web app. */
export async function appendWaitlistEmailToSheet({
  email,
  source = "landing",
}: WaitlistRow): Promise<void> {
  await postToGoogleSheets({
    type: "waitlist",
    email,
    source,
    submittedAt: new Date().toISOString(),
  });
}

/** Append an enterprise sales inquiry to the SALES tab in the same Google Sheet. */
export async function appendSalesInquiryToSheet({
  email,
  description,
  source = "enterprise-pricing",
}: SalesInquiryRow): Promise<void> {
  await postToGoogleSheets({
    type: "sales",
    email,
    description,
    source,
    submittedAt: new Date().toISOString(),
  });
}
