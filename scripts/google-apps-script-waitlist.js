/**
 * Google Apps Script — paste into Extensions → Apps Script on your waitlist Sheet.
 *
 * 1. Create a Google Sheet (e.g. "coolplugz waitlist")
 * 2. Row 1 headers: submittedAt | email | source
 * 3. Paste this file, Save, Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the web app URL into GOOGLE_SHEETS_WEBHOOK_URL
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);
    var email = String(payload.email || "").trim().toLowerCase();
    var source = String(payload.source || "landing");
    var submittedAt = payload.submittedAt || new Date().toISOString();

    if (!email || email.indexOf("@") === -1) {
      return jsonResponse({ ok: false, error: "Invalid email" }, 400);
    }

    sheet.appendRow([submittedAt, email, source]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function jsonResponse(body, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  );

  // Apps Script web apps don't expose status codes; body carries success/failure.
  return output;
}
