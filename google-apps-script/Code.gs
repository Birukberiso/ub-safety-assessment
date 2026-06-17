/**
 * United Beverages Safety Assessment — Google Apps Script
 * =========================================================
 * Deploy this as a Web App:
 *   - Execute as: Me
 *   - Who has access: Anyone   ← CRITICAL: must be "Anyone", not "Anyone with Google account"
 *
 * After deploying, copy the Web App URL into src/data.js → SHEETS_URL
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getActiveSheet();

    // Accept both form-encoded (e.parameter.payload) and raw JSON body
    var data;
    try {
      data = JSON.parse(e.parameter.payload);
    } catch (ex) {
      data = JSON.parse(e.postData.contents);
    }

    // Add header row on first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Name", "Score (%)", "Result",
        "Correct", "Wrong", "Time Taken",
        "PPE", "Traffic", "Alcohol & Drugs",
        "Chemicals", "Machine Safety",
        "Permit to Work", "Emergency"
      ]);
      sheet.getRange(1, 1, 1, 14)
        .setBackground("#0D4A0D")
        .setFontColor("#ffffff")
        .setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // Append result row
    sheet.appendRow([
      data.timestamp, data.name,
      data.score,     data.result,
      data.correct,   data.wrong,
      data.timeTaken, data.sec0,
      data.sec1,      data.sec2,
      data.sec3,      data.sec4,
      data.sec5,      data.sec6
    ]);

    // Auto-colour the Result cell green/red
    var lastRow = sheet.getLastRow();
    var resultCell = sheet.getRange(lastRow, 4);
    if (data.result === "PASSED") {
      resultCell.setBackground("#D4EDDA").setFontColor("#1B6B3A").setFontWeight("bold");
    } else {
      resultCell.setBackground("#FADBD8").setFontColor("#7B1414").setFontWeight("bold");
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET request — used to verify the script is live
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "alive", app: "UB Safety Assessment" }))
    .setMimeType(ContentService.MimeType.JSON);
}
