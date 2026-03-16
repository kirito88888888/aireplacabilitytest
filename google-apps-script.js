/**
 * AI Replaceability Quiz — Google Sheets Response Logger
 * ========================================================
 * SETUP INSTRUCTIONS (one-time, ~5 minutes):
 *
 * 1. Create a new Google Sheet at https://sheets.google.com
 *    Name it anything you like, e.g. "Quiz Responses".
 *
 * 2. Open Extensions → Apps Script in that sheet.
 *
 * 3. Delete the placeholder code in the editor and paste
 *    the entire contents of THIS file.
 *
 * 4. Click "Save" (floppy disk icon).
 *
 * 5. Click "Deploy" → "New deployment".
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Then click "Deploy" and copy the Web app URL.
 *
 * 6. In index.html, replace the placeholder value:
 *      const GOOGLE_SHEETS_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
 *    with your actual URL, e.g.:
 *      const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/ABC.../exec';
 *
 * That's it. Every completed quiz will now append a row to your sheet.
 * ========================================================
 */

var SHEET_NAME = 'Responses'; // Change if you want a specific tab name

function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    var data  = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name      || '(anonymous)',
      data.score     || 0,
      data.result    || '',
      data.q1        || '',
      data.q2        || '',
      data.q3        || '',
      data.q4        || '',
      data.q5        || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Verify the deployment is live
function doGet(e) {
  return ContentService
    .createTextOutput('AI Replaceability Quiz — Response Logger is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Write header row if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Name',
      'Score (%)',
      'Result',
      'Q1: How much of your day involves repetitive tasks?',
      'Q2: Has AI already done something you used to get paid for?',
      'Q3: How often do you use AI tools in your work?',
      'Q4: Could someone follow a script to do your job?',
      'Q5: What\'s your biggest advantage over AI at work?'
    ]);

    // Bold the header row
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}
