# Google Sheets lead logging — setup

One-time setup, done entirely on [sheets.google.com](https://sheets.google.com) and
[script.google.com](https://script.google.com) under your own Google account
(`charansaikondilla@gmail.com`). This can't be done from the code editor —
Google requires you to deploy Apps Script through its own web UI.

## 1. Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**.
2. Rename it (top-left, click "Untitled spreadsheet") to something like
   **"Love My Tour — Website Leads"**.
3. Leave it empty — the script creates its own tabs and headers automatically
   the first time someone submits a form.

## 2. Paste in the script

1. In that Sheet, go to **Extensions → Apps Script**. A new tab opens with a
   blank code editor and a default `Code.gs` containing a placeholder
   `myFunction`.
2. Select **all** the existing placeholder code and delete it.
3. Open `google-apps-script/Code.gs` from this repo, copy its entire
   contents, and paste it into the Apps Script editor.
4. Click the disk/save icon (or Ctrl+S). Give the project a name when
   prompted, e.g. **"LoveMyTour Form Handler"**.

## 3. Deploy as a web app

1. Top-right, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description**: `Form handler v1`
   - **Execute as**: `Me (charansaikondilla@gmail.com)`
   - **Who has access**: `Anyone`
4. Click **Deploy**.
5. Google will show an authorization prompt ("Google hasn't verified this
   app"). This is expected — it's your own script, only you are authorizing
   it to write to your own Sheet and send email as you. Click
   **Advanced → Go to LoveMyTour Form Handler (unsafe) → Allow**.
6. After deploying, copy the **Web app URL** shown (it ends in `/exec`). This
   is the only value you need to bring back to the code.

## 4. Connect the website to it

1. Open `script.js` in this repo and find this line near the top:
   ```js
   const SHEETS_WEBAPP_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
2. Replace the placeholder string with the URL you copied in step 3.6, e.g.:
   ```js
   const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
3. Bump the `?v=` cache-busting query string on `script.js`/`styles.css` in
   `index.html` (same pattern used elsewhere in this project) so browsers —
   especially phones — actually fetch the updated file instead of an old
   cached copy.
4. Commit, push, and let the site redeploy.

## 5. Test it

1. Open the `/exec` URL from step 3.6 directly in a browser tab. You should
   see a small JSON reply like `{"status":"ok","message":"Love My Tour form
   handler is live."}`. If you see an error page instead, the deployment
   step needs redoing (check "Execute as" / "Who has access" above).
2. On the live site, click any "Enquire now" / "Book Now" button, fill in
   the modal, and submit. WhatsApp should open exactly as before.
3. Go back to the Google Sheet — a tab named **"Enquire & Book Now"** should
   now exist with a header row and your test submission below it.
4. Check the inbox for `charansaikondilla@gmail.com` — an email titled
   "New Enquiry / Booking — ..." should have arrived within a few seconds.
5. Repeat with the Contact page form — check for the **"Contact Page"** tab
   and a second notification email.

## 6. Careers page admin (add / edit / delete job listings)

The Careers page reads its job listings from a **"Careers"** tab that lives
in its **own, separate Google Sheet** — deliberately not the same
spreadsheet as your Enquire/Contact leads, so job-listing content stays
independent of customer lead data. There's also a separate admin page
(hosted by this same Apps Script deployment — no second URL to manage) for
adding, editing, and deleting listings without touching the raw Sheet grid.

### 6a. Create the separate Careers spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Blank
   spreadsheet** (a second, new one — don't reuse your Leads spreadsheet
   from step 1).
2. Rename it to something like **"Love My Tour — Careers"**.
3. Leave it empty — the script creates the Careers tab and its headers
   automatically the first time it's needed.
4. Copy its **Spreadsheet ID** from the browser address bar:
   `https://docs.google.com/spreadsheets/d/`**`THIS_LONG_ID_STRING`**`/edit`
   — copy just that long ID string, not the whole URL.

### 6b. Wire up Code.gs and the admin page

1. In `Code.gs` (the same Apps Script project bound to your Leads
   spreadsheet — Careers does **not** need its own Apps Script project),
   find this line and paste in the ID from step 6a:
   ```js
   var CAREERS_SPREADSHEET_ID = 'PASTE_YOUR_CAREERS_SPREADSHEET_ID_HERE';
   ```
2. Back in the Apps Script editor, click the **+** next to "Files" → **HTML**.
3. Name the new file exactly **`AdminPage`** (Apps Script adds the `.html`
   extension itself — don't type it).
4. Delete the placeholder content it inserts, then copy the entire contents
   of `google-apps-script/AdminPage.html` from this repo and paste it in.
5. In that same file, find this line near the bottom and replace the
   placeholder with the **same** web app URL you used in step 4 of the
   lead-logging setup above:
   ```js
   var WEB_APP_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
6. Back in `Code.gs`, find this line and change it to your own secret:
   ```js
   var ADMIN_PASSCODE = 'change-this-passcode';
   ```
   This passcode is a basic shared-secret check, not full account-based
   security — anyone with both the admin URL *and* this passcode can edit
   listings. Keep both private. If that's ever not enough, this would need
   proper Google account-based access control, which is a bigger change.
7. Save (Ctrl+S), then redeploy a **new version** exactly as described in
   "Updating the script later" below (this step is required — the new
   spreadsheet ID, new HTML file, and edited passcode don't take effect
   until you do).
8. The **first time** anything touches the Careers spreadsheet after this
   change, Google will likely show a fresh authorization prompt (in
   addition to the one you already approved during initial setup) — this
   is expected, not an error. `SpreadsheetApp.openById()` (needed to reach
   a *different* spreadsheet than the one this script is bound to) requires
   a broader Sheets permission than the narrower "just my bound
   spreadsheet" access the script started with. Click through it the same
   way as before: **Advanced → Go to [project name] (unsafe) → Allow**.
9. Your admin page is at `<your web app URL>?action=admin` — e.g.
   `https://script.google.com/macros/s/AKfycb.../exec?action=admin`.
   Bookmark it somewhere private (not linked from the site itself).

**Test it:**
1. Open the admin URL, enter your passcode, click Unlock.
2. Click **+ Add New Listing**, fill in Job Title and Description at
   minimum (everything else is optional), click **Save Listing**.
3. It should appear immediately in the admin page's own list, showing an
   "Added [today's date]" line.
4. Open the *Careers* spreadsheet from step 6a directly — confirm the
   "Careers" tab now exists there with your new row, and that it's a
   completely separate file from your Leads spreadsheet.
5. Open the live site's Careers page (`#careers`) — your new listing should
   appear among the job cards. If the site still shows the original 6
   static listings instead, see "What this does and doesn't do" below.
6. Back in the admin page, click **Edit** on that listing, change something,
   save — confirm it updates on the live Careers page, and that the card
   now shows both an "Added ..." and an "Updated ..." line with the
   "Updated" timestamp being the more recent one.
7. Click **Delete**, confirm — it should disappear from both the admin page
   and, on next visit, the live Careers page.
8. Set a listing's Status to **Inactive** instead of deleting it — it stays
   in the admin list (so you can reactivate it later) but disappears from
   the live site, same as a delete would from a visitor's point of view.

## Updating the script later

Editing `Code.gs` in this repo and pushing it does **not** update the live
web app by itself — Apps Script only runs whatever was live at your last
deployment. After changing the script:

1. In the Apps Script editor, paste in the updated code and save.
2. **Deploy → Manage deployments** → click the pencil/edit icon on the
   existing deployment → **Version: New version** → **Deploy**.
3. The web app URL stays the same, so nothing needs to change in `script.js`.

Forgetting this step is the #1 cause of "I changed the script but nothing
happened" — the old version keeps running until you explicitly deploy a new
one.

## What this does and doesn't do

- Every "Enquire now" / "Book Now" click sitewide and every Contact page
  submission still opens WhatsApp exactly as it always has — that is
  untouched and unconditional.
- In the background, the same data is also POSTed to the Apps Script web
  app, which appends a row to the matching Sheet tab and emails you. This
  happens best-effort: if it fails for any reason (network issue, quota,
  deployment not finished yet), the visitor never sees an error and the
  WhatsApp flow is completely unaffected — nothing on the site can break
  because of this.
- Until step 4 above is completed (the real URL pasted into `script.js`),
  the Sheets logging is a safe no-op — the site behaves exactly as it did
  before this feature existed.
- The Careers page fetches the Careers tab — in its own separate
  spreadsheet, set up in section 6 above — fresh every time someone opens
  `#careers`. There's no caching, so an edit made via the admin page (or
  directly in that spreadsheet) shows up the next time anyone opens that
  page. The original 6 job listings stay in `index.html` as a fallback: if
  the fetch fails, `CAREERS_SPREADSHEET_ID` isn't set up yet, or the
  Careers tab has no Active rows, the page quietly keeps showing those
  static 6 instead — it can never end up blank. Once you've added at least
  one Active listing through the admin page, the static 6 stop appearing
  (replaced by whatever's in that spreadsheet).
- Every Careers row also carries a Created At (set once, on creation) and
  an Updated At (refreshed on every edit) timestamp, both shown on each
  listing's card in the admin page — a simple audit trail of when each
  job listing was added or last changed. These two columns are set by the
  script itself; nothing needs to be typed into them by hand, and editing
  them directly in the spreadsheet isn't necessary or recommended.
