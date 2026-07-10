type WaitlistRow = {
  email: string;
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

/** Append a waitlist signup to Google Sheets via a deployed Apps Script web app. */
export async function appendWaitlistEmailToSheet({
  email,
  source = "landing",
}: WaitlistRow): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  const url = sanitizeWebhookUrl(webhookUrl);
  const payload = JSON.stringify({
    email,
    source,
    submittedAt: new Date().toISOString(),
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
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
    throw new Error(data.error || "Google Sheets webhook rejected the signup.");
  }

  if (!response.ok && data?.ok !== true) {
    throw new Error(`Google Sheets webhook failed (${response.status}).`);
  }
}
