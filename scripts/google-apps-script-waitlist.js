// coolplugz waitlist + sales — paste ALL of this into Code.gs, Save, then:
// 1. Select "doGet" in the toolbar dropdown → Run → authorize Google
// 2. Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone
// 3. Copy the /exec URL into Vercel GOOGLE_SHEETS_WEBHOOK_URL
//
// Waitlist rows go to the active sheet tab.
// Enterprise inquiries (type: "sales") go to a tab named SALES (created automatically if missing).

var SALES_SHEET_NAME = "SALES";

function doGet() {
  ensureWaitlistHeaders_();
  ensureSalesHeaders_();
  return jsonResponse({ ok: true, message: "coolplugz waitlist + sales ready" });
}

function doPost(e) {
  try {
    var payload = parsePayload_(e);
    var type = String(payload.type || "waitlist");

    if (type === "sales") {
      return handleSales_(payload);
    }

    return handleWaitlist_(payload);
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function handleWaitlist_(payload) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  ensureWaitlistHeaders_();
  var email = String(payload.email || "").trim().toLowerCase();
  var source = String(payload.source || "landing");
  var submittedAt = payload.submittedAt || new Date().toISOString();

  if (!email || email.indexOf("@") === -1) {
    return jsonResponse({ ok: false, error: "Invalid email" });
  }

  sheet.appendRow([submittedAt, email, source]);
  return jsonResponse({ ok: true });
}

function handleSales_(payload) {
  var sheet = getOrCreateSheet_(SALES_SHEET_NAME);
  ensureSalesHeaders_();
  var email = String(payload.email || "").trim().toLowerCase();
  var description = String(payload.description || "").trim();
  var source = String(payload.source || "enterprise-pricing");
  var submittedAt = payload.submittedAt || new Date().toISOString();

  if (!email || email.indexOf("@") === -1) {
    return jsonResponse({ ok: false, error: "Invalid email" });
  }

  if (!description) {
    return jsonResponse({ ok: false, error: "Description required" });
  }

  sheet.appendRow([submittedAt, email, description, source]);
  return jsonResponse({ ok: true });
}

function getOrCreateSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function ensureWaitlistHeaders_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["submittedAt", "email", "source"]);
  }
}

function ensureSalesHeaders_() {
  var sheet = getOrCreateSheet_(SALES_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["submittedAt", "email", "description", "source"]);
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
