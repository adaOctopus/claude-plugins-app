// coolplugz waitlist — paste ALL of this into Code.gs, Save, then:
// 1. Select "doGet" in the toolbar dropdown → Run → authorize Google
// 2. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone
// 3. Copy the /exec URL into Vercel GOOGLE_SHEETS_WEBHOOK_URL

function doGet() {
  ensureHeaders_();
  return jsonResponse({ ok: true, message: "coolplugz waitlist ready" });
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    ensureHeaders_();
    var payload = parsePayload_(e);
    var email = String(payload.email || "").trim().toLowerCase();
    var source = String(payload.source || "landing");
    var submittedAt = payload.submittedAt || new Date().toISOString();

    if (!email || email.indexOf("@") === -1) {
      return jsonResponse({ ok: false, error: "Invalid email" });
    }

    sheet.appendRow([submittedAt, email, source]);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function ensureHeaders_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["submittedAt", "email", "source"]);
  }
}

function parsePayload_(e) {
  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  if (e && e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload);
  }
  return {};
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  );
}
