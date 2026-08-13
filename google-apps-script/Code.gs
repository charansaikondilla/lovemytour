/**
 * Love My Tour — Website Lead Handler (Google Apps Script)
 *
 * Receives POST requests from the website's shared "Enquire Now / Book Now"
 * modal and the Contact Page form, logs each submission to its own tab in
 * this Sheet (creating the tab and its header row automatically the first
 * time it's needed), and emails a notification for every submission.
 *
 * SETUP: see SETUP.md in this same folder for the one-time deployment steps.
 * After changing anything in this file, you must create a NEW deployment
 * version (Deploy → Manage deployments → Edit → New version) — saving the
 * file alone does not update the live web app.
 */

// Every notification email goes here.
var NOTIFY_EMAIL = 'charansaikondilla@gmail.com';

// One tab per form. Headers are written automatically the first time each
// tab is created — nothing to set up by hand in the Sheet itself.
var SHEET_CONFIG = {
  enquire: {
    tabName: 'Enquire & Book Now',
    headers: ['Timestamp', 'Source', 'Name', 'Phone', 'Email', 'Destination / Package', 'Message', 'Page URL']
  },
  contact: {
    tabName: 'Contact Page',
    headers: ['Timestamp', 'Source', 'Name', 'Phone', 'Destination', 'Message', 'Page URL']
  }
};

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: 'error', message: 'No data received' });
    }

    var data = JSON.parse(e.postData.contents);
    var formType = data.formType;
    var config = SHEET_CONFIG[formType];

    if (!config) {
      return jsonResponse({ status: 'error', message: 'Unknown formType: ' + formType });
    }

    var timestamp = new Date();
    appendRow(config, formType, data, timestamp);

    try {
      sendNotificationEmail(formType, data, timestamp);
    } catch (mailErr) {
      // A Gmail quota/permission hiccup must never take the sheet write
      // down with it — the row is already saved by this point.
      Logger.log('Email notification failed: ' + mailErr);
    }

    return jsonResponse({ status: 'success' });
  } catch (err) {
    Logger.log('doPost failed: ' + err);
    return jsonResponse({ status: 'error', message: String(err) });
  }
}

// Lets you sanity-check the deployment by opening the web app URL directly
// in a browser — see SETUP.md step 9.
function doGet(e) {
  return jsonResponse({ status: 'ok', message: 'Love My Tour form handler is live.' });
}

function appendRow(config, formType, data, timestamp) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(config.tabName);

  if (!sheet) {
    sheet = ss.insertSheet(config.tabName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(config.headers);
    var headerRange = sheet.getRange(1, 1, 1, config.headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0891b2');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  var row = formType === 'enquire'
    ? [timestamp, data.source || '', data.name || '', data.phone || '', data.email || '', data.package || '', data.message || '', data.pageUrl || '']
    : [timestamp, data.source || '', data.name || '', data.phone || '', data.destination || '', data.message || '', data.pageUrl || ''];

  sheet.appendRow(row);

  try {
    sheet.autoResizeColumns(1, config.headers.length);
  } catch (resizeErr) {
    // Cosmetic only — never let a column-width failure affect the saved row.
  }
}

function sendNotificationEmail(formType, data, timestamp) {
  var formLabel = formType === 'enquire' ? 'Enquiry / Booking' : 'Contact Message';
  var subject = 'New ' + formLabel + ' — ' + (data.name || 'Unknown') + ' (Love My Tour)';

  var lines = [];
  lines.push('New ' + formLabel + ' received on the Love My Tour website.');
  lines.push('');
  lines.push('Time: ' + timestamp);
  lines.push('Source: ' + (data.source || 'N/A'));
  lines.push('Name: ' + (data.name || 'N/A'));
  lines.push('Phone: ' + (data.phone || 'N/A'));
  if (data.email) lines.push('Email: ' + data.email);
  if (data.package) lines.push('Destination / Package: ' + data.package);
  if (data.destination) lines.push('Destination: ' + data.destination);
  if (data.message) lines.push('Message: ' + data.message);
  lines.push('Page: ' + (data.pageUrl || 'N/A'));

  MailApp.sendEmail(NOTIFY_EMAIL, subject, lines.join('\n'));
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
