/**
 * LOVE MY TOUR — WEBSITE LEAD HANDLER + CAREERS ADMIN
 * Google Apps Script Web App
 *
 * Handles:
 * 1. Enquire / Book Now form (and Get Quote Now, routed the same way)
 * 2. Contact Page form
 * 3. Careers page job listings — read (public) + admin add/edit/delete
 *    (passcode-protected), so the Careers page can be managed entirely
 *    from this Sheet or from the separate admin page at
 *    <this web app URL>?action=admin — no code or redeploy needed to
 *    add, edit, or delete a job listing.
 *
 * Automatically:
 * - Creates missing sheets
 * - Creates headers
 * - Saves submissions
 * - Sends email notifications
 * - Provides GET health check
 * - Provides test function
 *
 * IMPORTANT:
 * After changing this code:
 * Deploy → Manage deployments → Edit → New version → Deploy
 */

// ============================================================
// CONFIGURATION
// ============================================================

var NOTIFY_EMAIL = 'charansaikondilla@gmail.com';

var SHEET_CONFIG = {
  enquire: {
    tabName: 'Enquire & Book Now',
    headers: [
      'Timestamp',
      'Source',
      'Name',
      'Phone',
      'Email',
      'Destination / Package',
      'Message',
      'Page URL'
    ]
  },

  contact: {
    tabName: 'Contact Page',
    headers: [
      'Timestamp',
      'Source',
      'Name',
      'Phone',
      'Destination',
      'Message',
      'Page URL'
    ]
  }
};

// Careers — the single source of truth for the website's Careers page.
// Lives in its OWN, separate Google Sheet (not this file's bound
// spreadsheet, which only holds the lead tabs above).
var CAREERS_SPREADSHEET_ID = '1HfcqOyFuAFJLKH3DlsGEArub_p2qY0EDGVgHdPZmK38';

// Columns: ID | Title | Badge | Location | Type | Experience | Salary |
// Description | Skills | Status | Created At | Updated At
// - ID is a UUID generated on create by this script — never type one in
//   by hand, and never edit an existing ID.
// - Skills is one cell, pipe-separated: Skill one|Skill two|Skill three
// - Status is "Active" or "Inactive" — Inactive rows are hidden from the
//   live site (a soft hide) without deleting the row.
// - Created At / Updated At are set automatically — Created At is written
//   once and never changes; Updated At refreshes on every edit.
var CAREERS_TAB_NAME = 'Careers';
var CAREERS_HEADERS = ['ID', 'Title', 'Badge', 'Location', 'Type', 'Experience', 'Salary', 'Description', 'Skills', 'Status', 'Created At', 'Updated At'];

// Admin passcode — lives in the "Settings" tab of the SAME Careers
// spreadsheet above, not hardcoded here, so it can be changed at any time
// by editing a cell in Sheets, with NO code change and no redeploy. See
// getAdminPasscode_() below, which reads it fresh on every single request.
// DEFAULT_ADMIN_PASSCODE is only ever used to seed that tab's first row the
// very first time it's created, and as a fallback if that row is ever
// deleted or emptied by mistake — change your real passcode in the Sheet,
// not by editing this line.
var SETTINGS_TAB_NAME = 'Settings';
var SETTINGS_HEADERS = ['Key', 'Value'];
var DEFAULT_ADMIN_PASSCODE = 'Lovemytravel';


// ============================================================
// GET — HEALTH CHECK / PUBLIC CAREERS LIST / ADMIN PAGE
// ============================================================

function doGet(e) {

  var action = e && e.parameter ? e.parameter.action : '';

  if (action === 'careers') {

    return jsonResponse({
      status: 'success',
      listings: getCareersList(true)
    });

  }

  if (action === 'admin') {

    return HtmlService.createHtmlOutputFromFile('AdminPage')
      .setTitle('Love My Tour — Careers Admin')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');

  }

  return jsonResponse({
    status: 'ok',
    message: 'Love My Tour form handler is live.',
    timestamp: new Date().toISOString()
  });

}


// ============================================================
// POST — WEBSITE FORM RECEIVER + CAREERS ADMIN ACTIONS
// ============================================================

function doPost(e) {

  try {

    // --------------------------------------------------------
    // Validate request
    // --------------------------------------------------------

    if (!e || !e.postData || !e.postData.contents) {

      return jsonResponse({
        status: 'error',
        message: 'No POST data received.'
      });

    }


    // --------------------------------------------------------
    // Parse JSON
    // --------------------------------------------------------

    var data;

    try {

      data = JSON.parse(e.postData.contents);

    } catch (parseError) {

      Logger.log('JSON parse error: ' + parseError);

      return jsonResponse({
        status: 'error',
        message: 'Invalid JSON received.'
      });

    }


    var formType = String(data.formType || '').trim().toLowerCase();


    // --------------------------------------------------------
    // Careers admin actions — passcode-protected. Handled before the
    // enquire/contact routing below since these formTypes are not in
    // SHEET_CONFIG.
    // --------------------------------------------------------

    if (
      formType === 'careers_list' ||
      formType === 'careers_create' ||
      formType === 'careers_update' ||
      formType === 'careers_delete'
    ) {

      if (String(data.passcode || '') !== getAdminPasscode_()) {

        return jsonResponse({
          status: 'error',
          message: 'Incorrect passcode.'
        });

      }

      try {

        if (formType === 'careers_list') {

          return jsonResponse({
            status: 'success',
            listings: getCareersList(false)
          });

        }

        var result;

        if (formType === 'careers_create') {

          result = createCareerListing(data);

        } else if (formType === 'careers_update') {

          result = updateCareerListing(data);

        } else {

          result = deleteCareerListing(data);

        }

        return jsonResponse({
          status: 'success',
          id: result.id,
          listings: getCareersList(false)
        });

      } catch (careersError) {

        Logger.log('Careers admin action failed: ' + careersError);

        return jsonResponse({
          status: 'error',
          message: String(careersError)
        });

      }

    }


    // --------------------------------------------------------
    // Validate form type (enquire / contact)
    // --------------------------------------------------------

    if (!SHEET_CONFIG[formType]) {

      return jsonResponse({
        status: 'error',
        message: 'Invalid formType. Expected "enquire" or "contact".'
      });

    }


    var config = SHEET_CONFIG[formType];

    var timestamp = new Date();


    // --------------------------------------------------------
    // Save submission
    // --------------------------------------------------------

    appendRow(
      config,
      formType,
      data,
      timestamp
    );


    // --------------------------------------------------------
    // Send notification email
    // --------------------------------------------------------

    try {

      sendNotificationEmail(
        formType,
        data,
        timestamp
      );

    } catch (mailError) {

      // Do NOT lose the lead if email fails.

      Logger.log(
        'Email notification failed: ' +
        mailError
      );

    }


    // --------------------------------------------------------
    // Success
    // --------------------------------------------------------

    return jsonResponse({

      status: 'success',

      message: 'Form submitted successfully.',

      formType: formType,

      timestamp: timestamp.toISOString()

    });


  } catch (error) {

    Logger.log(
      'doPost ERROR: ' +
      error +
      '\nStack: ' +
      (error.stack || '')
    );

    return jsonResponse({

      status: 'error',

      message: 'Server error while processing the form.'

    });

  }

}


// ============================================================
// SAVE LEAD TO GOOGLE SHEETS
// ============================================================

function appendRow(config, formType, data, timestamp) {

  // ----------------------------------------------------------
  // Prevent simultaneous submissions from conflicting
  // ----------------------------------------------------------

  var lock = LockService.getScriptLock();

  lock.waitLock(10000);


  try {

    // --------------------------------------------------------
    // Get spreadsheet
    // --------------------------------------------------------

    var spreadsheet =
      SpreadsheetApp.getActiveSpreadsheet();


    if (!spreadsheet) {

      throw new Error(
        'No active spreadsheet found. ' +
        'Make sure this Apps Script project is bound to the Google Sheet.'
      );

    }


    // --------------------------------------------------------
    // Find or create sheet
    // --------------------------------------------------------

    var sheet =
      spreadsheet.getSheetByName(
        config.tabName
      );


    if (!sheet) {

      sheet =
        spreadsheet.insertSheet(
          config.tabName
        );

    }


    // --------------------------------------------------------
    // Create headers if sheet is empty
    // --------------------------------------------------------

    if (sheet.getLastRow() === 0) {

      sheet
        .getRange(
          1,
          1,
          1,
          config.headers.length
        )
        .setValues([
          config.headers
        ]);


      // Header formatting

      var headerRange =
        sheet.getRange(
          1,
          1,
          1,
          config.headers.length
        );


      headerRange.setFontWeight('bold');

      headerRange.setBackground('#0891b2');

      headerRange.setFontColor('#ffffff');

      headerRange.setHorizontalAlignment(
        'center'
      );

      sheet.setFrozenRows(1);

    }


    // --------------------------------------------------------
    // Build row
    // --------------------------------------------------------

    var row;


    if (formType === 'enquire') {

      row = [

        timestamp,

        cleanValue(data.source),

        cleanValue(data.name),

        cleanValue(data.phone),

        cleanValue(data.email),

        cleanValue(data.package),

        cleanValue(data.message),

        cleanValue(data.pageUrl)

      ];

    } else {

      row = [

        timestamp,

        cleanValue(data.source),

        cleanValue(data.name),

        cleanValue(data.phone),

        cleanValue(data.destination),

        cleanValue(data.message),

        cleanValue(data.pageUrl)

      ];

    }


    // --------------------------------------------------------
    // Append row
    // --------------------------------------------------------

    sheet.appendRow(row);


    // --------------------------------------------------------
    // Formatting
    // --------------------------------------------------------

    try {

      sheet
        .getRange(
          2,
          1,
          sheet.getLastRow() - 1,
          config.headers.length
        )
        .setVerticalAlignment('top');

      sheet
        .getRange(
          2,
          1,
          sheet.getLastRow() - 1,
          1
        )
        .setNumberFormat(
          'dd-mm-yyyy hh:mm:ss'
        );


    } catch (formatError) {

      Logger.log(
        'Formatting warning: ' +
        formatError
      );

    }


  } finally {

    lock.releaseLock();

  }

}


// ============================================================
// CAREERS — SHEET HELPERS
// ============================================================

function getCareersSheet_() {

  // Careers lives in its own separate spreadsheet, not this project's
  // bound one (which only holds the lead tabs) — see CAREERS_SPREADSHEET_ID
  // above. openById requires the account running this script to have
  // edit access to that file, which it does since it's the same Google
  // account that created both spreadsheets.
  var spreadsheet = SpreadsheetApp.openById(CAREERS_SPREADSHEET_ID);

  var sheet = spreadsheet.getSheetByName(CAREERS_TAB_NAME);

  if (!sheet) {

    sheet = spreadsheet.insertSheet(CAREERS_TAB_NAME);

  }

  if (sheet.getLastRow() === 0) {

    sheet.getRange(1, 1, 1, CAREERS_HEADERS.length).setValues([CAREERS_HEADERS]);

    var headerRange = sheet.getRange(1, 1, 1, CAREERS_HEADERS.length);

    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0891b2');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');

    sheet.setFrozenRows(1);

  }

  return sheet;

}


// ============================================================
// SETTINGS — ADMIN PASSCODE STORED IN THE SHEET, NOT IN CODE
// ============================================================
//
// Lives as a "Settings" tab in the same Careers spreadsheet as the
// Careers tab above (same openById(CAREERS_SPREADSHEET_ID) — no new
// spreadsheet, no new permission). A simple Key | Value table so it can
// grow to hold more than just the passcode later if ever needed.

function getSettingsSheet_() {

  var spreadsheet = SpreadsheetApp.openById(CAREERS_SPREADSHEET_ID);

  var sheet = spreadsheet.getSheetByName(SETTINGS_TAB_NAME);

  if (!sheet) {

    sheet = spreadsheet.insertSheet(SETTINGS_TAB_NAME);

  }

  if (sheet.getLastRow() === 0) {

    sheet.getRange(1, 1, 1, SETTINGS_HEADERS.length).setValues([SETTINGS_HEADERS]);

    var headerRange = sheet.getRange(1, 1, 1, SETTINGS_HEADERS.length);

    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0891b2');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');

    sheet.setFrozenRows(1);

    // Seed the passcode row so there's something to find and edit
    // immediately — this only ever happens once, the first time this tab
    // is created.
    sheet.appendRow(['Passcode', DEFAULT_ADMIN_PASSCODE]);

  }

  return sheet;

}


// Reads the CURRENT passcode fresh from the Settings tab on every call —
// no caching anywhere, so a passcode changed directly in the Sheet takes
// effect on the very next request, with no code change and no redeploy.
function getAdminPasscode_() {

  var sheet = getSettingsSheet_();

  var lastRow = sheet.getLastRow();

  if (lastRow < 2) return DEFAULT_ADMIN_PASSCODE;

  var rows = sheet.getRange(2, 1, lastRow - 1, 2).getValues();

  for (var i = 0; i < rows.length; i++) {

    if (cleanValue(rows[i][0]) === 'Passcode') {

      var value = cleanValue(rows[i][1]);

      return value || DEFAULT_ADMIN_PASSCODE;

    }

  }

  // No "Passcode" row found (e.g. it was deleted by mistake) — fall back
  // rather than lock the admin out entirely.
  return DEFAULT_ADMIN_PASSCODE;

}


// activeOnly=true is used by the public ?action=careers endpoint the
// website fetches; activeOnly=false is used by the passcode-gated admin
// actions, which need to see Inactive listings too.
function getCareersList(activeOnly) {

  var sheet = getCareersSheet_();

  var lastRow = sheet.getLastRow();

  if (lastRow < 2) {

    return [];

  }

  var values = sheet.getRange(2, 1, lastRow - 1, CAREERS_HEADERS.length).getValues();

  var list = [];

  for (var i = 0; i < values.length; i++) {

    var row = values[i];

    var id = cleanValue(row[0]);

    if (!id) continue; // skip any blank row

    var status = cleanValue(row[9]) || 'Active';

    if (activeOnly && status !== 'Active') continue;

    var skillsRaw = cleanValue(row[8]);

    var skills = skillsRaw
      ? skillsRaw.split('|').map(function (s) { return s.trim(); }).filter(function (s) { return s; })
      : [];

    list.push({
      id: id,
      title: cleanValue(row[1]),
      badge: cleanValue(row[2]),
      location: cleanValue(row[3]),
      type: cleanValue(row[4]),
      experience: cleanValue(row[5]),
      salary: cleanValue(row[6]),
      description: cleanValue(row[7]),
      skills: skills,
      status: status,
      createdAt: row[10] ? new Date(row[10]).toISOString() : '',
      updatedAt: row[11] ? new Date(row[11]).toISOString() : ''
    });

  }

  return list;

}


function findCareerRow_(sheet, id) {

  var lastRow = sheet.getLastRow();

  if (lastRow < 2) return -1;

  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

  for (var i = 0; i < ids.length; i++) {

    if (cleanValue(ids[i][0]) === id) {

      return i + 2; // sheet row number: +1 for 0-index, +1 for header row

    }

  }

  return -1;

}


// createdAt/updatedAt are Date objects, set by the caller — never trust
// the client to supply these correctly, so they never come from `data`.
function careerRowFromData_(id, data, createdAt, updatedAt) {

  return [
    id,
    cleanValue(data.title),
    cleanValue(data.badge),
    cleanValue(data.location),
    cleanValue(data.type),
    cleanValue(data.experience),
    cleanValue(data.salary),
    cleanValue(data.description),
    cleanValue(data.skills),
    cleanValue(data.status) || 'Active',
    createdAt,
    updatedAt
  ];

}


function createCareerListing(data) {

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {

    var sheet = getCareersSheet_();

    var id = Utilities.getUuid();

    var now = new Date();

    sheet.appendRow(careerRowFromData_(id, data, now, now));

    return { id: id };

  } finally {

    lock.releaseLock();

  }

}


function updateCareerListing(data) {

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {

    var sheet = getCareersSheet_();

    var id = cleanValue(data.id);

    var rowNum = findCareerRow_(sheet, id);

    if (rowNum === -1) {

      throw new Error('Listing not found: ' + id);

    }

    // Carry the original Created At forward unchanged — read from the
    // sheet itself, not from the incoming request, so it can't be lost
    // or spoofed by a client bug.
    var existingCreatedAt = sheet.getRange(rowNum, 11, 1, 1).getValue();

    var updatedAt = new Date();

    sheet.getRange(rowNum, 1, 1, CAREERS_HEADERS.length)
      .setValues([careerRowFromData_(id, data, existingCreatedAt, updatedAt)]);

    return { id: id };

  } finally {

    lock.releaseLock();

  }

}


function deleteCareerListing(data) {

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {

    var sheet = getCareersSheet_();

    var id = cleanValue(data.id);

    var rowNum = findCareerRow_(sheet, id);

    if (rowNum === -1) {

      throw new Error('Listing not found: ' + id);

    }

    sheet.deleteRow(rowNum);

    return { id: id };

  } finally {

    lock.releaseLock();

  }

}


// ============================================================
// EMAIL NOTIFICATION
// ============================================================

function sendNotificationEmail(
  formType,
  data,
  timestamp
) {

  var formLabel =
    formType === 'enquire'
      ? 'Enquiry / Booking'
      : 'Contact Message';


  var customerName =
    cleanValue(data.name) ||
    'Unknown';


  var subject =
    'New ' +
    formLabel +
    ' — ' +
    customerName +
    ' (Love My Tour)';


  var lines = [];


  lines.push(
    'New ' +
    formLabel +
    ' received on the Love My Tour website.'
  );

  lines.push('');

  lines.push(
    'Time: ' +
    timestamp
  );

  lines.push(
    'Form Type: ' +
    formType
  );

  lines.push(
    'Source: ' +
    (cleanValue(data.source) || 'N/A')
  );

  lines.push(
    'Name: ' +
    (cleanValue(data.name) || 'N/A')
  );

  lines.push(
    'Phone: ' +
    (cleanValue(data.phone) || 'N/A')
  );


  if (cleanValue(data.email)) {

    lines.push(
      'Email: ' +
      cleanValue(data.email)
    );

  }


  if (cleanValue(data.package)) {

    lines.push(
      'Destination / Package: ' +
      cleanValue(data.package)
    );

  }


  if (cleanValue(data.destination)) {

    lines.push(
      'Destination: ' +
      cleanValue(data.destination)
    );

  }


  if (cleanValue(data.message)) {

    lines.push(
      'Message: ' +
      cleanValue(data.message)
    );

  }


  lines.push(
    'Page URL: ' +
    (cleanValue(data.pageUrl) || 'N/A')
  );


  lines.push('');

  lines.push(
    '----------------------------------------'
  );

  lines.push(
    'Love My Tour — Website Lead System'
  );


  MailApp.sendEmail({

    to: NOTIFY_EMAIL,

    subject: subject,

    body: lines.join('\n')

  });

}


// ============================================================
// TEST EMAIL
// ============================================================

function testEmail() {

  var testData = {

    name: 'Test Customer',

    phone: '+91 9999999999',

    email: 'test@example.com',

    package: 'Test Destination',

    message:
      'This is a test enquiry from the Love My Tour website lead handler.',

    source: 'TEST',

    pageUrl:
      'https://lovemytour.com/'

  };


  sendNotificationEmail(

    'enquire',

    testData,

    new Date()

  );


  Logger.log(
    'TEST EMAIL SENT TO: ' +
    NOTIFY_EMAIL
  );

}


// ============================================================
// TEST FULL SYSTEM
// ============================================================

function testFullSystem() {

  var testData = {

    formType: 'enquire',

    source: 'TEST',

    name: 'Love My Tour Test',

    phone: '+91 9999999999',

    email: 'test@example.com',

    package: 'Test Package',

    message:
      'FULL SYSTEM TEST — please ignore this lead.',

    pageUrl:
      'https://lovemytour.com/test'

  };


  var config =
    SHEET_CONFIG.enquire;


  var timestamp =
    new Date();


  // Save test row

  appendRow(

    config,

    'enquire',

    testData,

    timestamp

  );


  // Send test email

  sendNotificationEmail(

    'enquire',

    testData,

    timestamp

  );


  Logger.log(
    'FULL SYSTEM TEST COMPLETED.'
  );

}


// ============================================================
// CREATE ALL SHEETS + HEADERS
// ============================================================

function setupSheets() {

  var spreadsheet =
    SpreadsheetApp.getActiveSpreadsheet();


  if (!spreadsheet) {

    throw new Error(
      'No active spreadsheet found.'
    );

  }


  Object.keys(SHEET_CONFIG).forEach(
    function(formType) {

      var config =
        SHEET_CONFIG[formType];


      var sheet =
        spreadsheet.getSheetByName(
          config.tabName
        );


      // Create sheet if missing

      if (!sheet) {

        sheet =
          spreadsheet.insertSheet(
            config.tabName
          );

      }


      // Create headers if empty

      if (sheet.getLastRow() === 0) {

        sheet
          .getRange(
            1,
            1,
            1,
            config.headers.length
          )
          .setValues([
            config.headers
          ]);


        var headerRange =
          sheet.getRange(
            1,
            1,
            1,
            config.headers.length
          );


        headerRange.setFontWeight(
          'bold'
        );

        headerRange.setBackground(
          '#0891b2'
        );

        headerRange.setFontColor(
          '#ffffff'
        );

        headerRange.setHorizontalAlignment(
          'center'
        );

        sheet.setFrozenRows(1);

      }


      try {

        sheet.autoResizeColumns(
          1,
          config.headers.length
        );

      } catch (resizeError) {

        Logger.log(
          'Resize warning: ' +
          resizeError
        );

      }

    }
  );

  // Also make sure the Careers tab exists with its headers, and the
  // Settings tab exists with its passcode row seeded.
  getCareersSheet_();
  getSettingsSheet_();


  Logger.log(
    'All Love My Tour sheets and headers are ready.'
  );

}


// ============================================================
// UTILITY — CLEAN INPUT
// ============================================================

function cleanValue(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return '';

  }


  return String(value)
    .trim()
    .substring(0, 5000);

}


// ============================================================
// JSON RESPONSE
// ============================================================

function jsonResponse(obj) {

  return ContentService

    .createTextOutput(
      JSON.stringify(obj)
    )

    .setMimeType(
      ContentService.MimeType.JSON
    );

}
