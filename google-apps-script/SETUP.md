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
in its **own, separate Google Sheet** (spreadsheet ID
`1HfcqOyFuAFJLKH3DlsGEArub_p2qY0EDGVgHdPZmK38`, already wired into
`Code.gs`) — deliberately not the same spreadsheet as your Enquire/Contact
leads, so job-listing content stays independent of customer lead data.
There's also a separate admin page (hosted by this same Apps Script
deployment — no second URL to manage) for adding, editing, and deleting
listings without touching the raw Sheet grid.

**The admin passcode lives in that same spreadsheet**, in a tab called
**"Settings"** — not in the code — so you can change it any time by editing
a cell, with no code change and no redeploy. It's created automatically,
seeded with the default passcode **`Lovemytravel`**, the first time the
admin page (or anything else Careers-related) runs after this setup.

### 6a. Paste in Code.gs

1. In the Apps Script project bound to your Leads spreadsheet (Careers does
   **not** need its own separate Apps Script project), select **all**
   existing code in `Code.gs` and delete it.
2. Copy the entire contents of `google-apps-script/Code.gs` from this repo
   and paste it in. The Careers spreadsheet ID and the default passcode are
   already filled in — nothing to edit in this file for this step.
3. Save (Ctrl+S).

### 6b. Add the admin page file — **this is the step that gets missed**

If you skip or mistype this step, the admin link will show
`Exception: No HTML file named AdminPage was found` instead of the
passcode screen. Follow it exactly:

1. In the Apps Script editor's left sidebar, next to "Files", click **+** →
   **HTML**.
2. A box asks for a filename. Type exactly `AdminPage` (no `.html` at the
   end — Apps Script adds that itself) and press Enter.
3. A new file opens with placeholder content (`<!DOCTYPE html>...`). Select
   **all** of it and delete it.
4. Copy the entire contents of `google-apps-script/AdminPage.html` from
   this repo and paste it in.
5. In that pasted content, find this line near the bottom and replace the
   placeholder with your Careers web app URL (the one ending in `/exec` —
   the same one you use for `?action=careers`):
   ```js
   var WEB_APP_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
6. Save (Ctrl+S).
7. **Redeploy now** — a new file doesn't take effect until you do (see
   "Updating the script later" below): **Deploy → Manage deployments** →
   pencil icon → **Version: New version** → **Deploy**.
8. **Checkpoint — do this immediately, before anything else:** open
   `<your web app URL>?action=admin` in a browser tab right now. You should
   see a box labeled "Enter Passcode" with an Unlock button. If you instead
   see a page saying `Exception: No HTML file named AdminPage was found`,
   the file wasn't actually named `AdminPage` (check for a typo or stray
   `.html`) or the redeploy in step 7 didn't happen — fix that and check
   this URL again before moving on.

### 6c. Unlock it and change the passcode

1. On that passcode screen, type `Lovemytravel` (the seeded default) and
   click **Unlock**. You should land on the admin listings screen.
2. To set your **own** passcode instead: open the Careers spreadsheet
   (`docs.google.com/spreadsheets/d/1HfcqOyFuAFJLKH3DlsGEArub_p2qY0EDGVgHdPZmK38`)
   → find the **"Settings"** tab along the bottom → there's one row,
   `Passcode | Lovemytravel` → click the **Value** cell (next to
   "Passcode") and type your new passcode over it → press Enter.
3. That's it — no code change, no redeploy. The very next time anyone
   (including you) tries to unlock the admin page, the *new* value is what
   gets checked. The old passcode stops working immediately.

**Test it:**
1. Open the admin URL, enter the passcode (`Lovemytravel`, or whatever
   you've since changed it to in the Settings tab), click Unlock.
2. Click **+ Add New Listing**, fill in a Job Title (everything else is
   optional — leave blank to skip), click **Save Listing**.
3. It should appear immediately in the admin page's own list, showing an
   "Added [today's date]" line.
4. Open the Careers spreadsheet directly — confirm the "Careers" tab now
   has your new row.
5. Open the live site's Careers page (`#careers`) — your new listing should
   appear, and the "N Positions Open" heading should match the real count.
6. Back in the admin page, click **Edit** on that listing, change
   something, save — confirm it updates on the live Careers page, and the
   card now shows both "Added ..." and "Updated ..." lines.
7. Click **Delete**, confirm — it should disappear from both the admin page
   and, on next visit, the live Careers page.
8. Set a listing's Status to **Inactive** instead of deleting it — it stays
   in the admin list (so you can reactivate it later) but disappears from
   the live site, same as a delete would from a visitor's point of view.
9. **Passcode test:** in the Settings tab, change the Value cell to
   something new, save. Immediately try unlocking the admin page with the
   *old* passcode — it should now be rejected. Unlock with the new one —
   it should work. No redeploy needed for either.

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
- The admin passcode is read fresh from the Settings tab on every single
  admin action — there is no caching layer anywhere in this path. Changing
  the Value cell next to "Passcode" takes effect immediately, with no code
  change and no redeploy. This is a basic shared-secret check, not full
  account-based security — anyone with both the admin URL *and* the current
  passcode can edit listings, so keep the admin URL out of anything public
  and treat the passcode the way you'd treat a shared Wi-Fi password.
