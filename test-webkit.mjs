// Real-Safari-engine diagnostic pass, run locally via Playwright WebKit.
//
// WHY THIS EXISTS: every prior verification in this project's history,
// including every RC-20 through RC-23 pass, tested against Chromium
// (desktop Chrome automation) or nothing at all. Chromium's V8 and
// Chromium's rendering pipeline are not WebKit's JavaScriptCore and not
// WebKit's rendering pipeline — a bug that is WebKit-specific (a missing
// -webkit- prefix, a JS engine quirk, a layout difference) has never once
// been caught by any of this project's automated testing, because nothing
// in the toolchain used WebKit until now.
//
// WHAT THIS DOES NOT DO: Playwright's WebKit runs as a desktop process with
// desktop-class memory limits. It will not reproduce iOS Safari's per-tab
// memory ceiling or its backing-store eviction under pressure — that is an
// iOS/mobile-OS behavior, not a WebKit engine behavior. RC-23's core bug
// (a decoded bitmap silently evicted while the <img> element's own state
// reports nothing wrong) cannot be reproduced or disproven by this script.
// This catches a different, complementary class of bug: anything that is
// wrong in WebKit specifically, regardless of memory pressure.
import { webkit, devices } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:8794';
const iPhone = devices['iPhone 13'];

const results = { consoleErrors: [], pageErrors: [], failedRequests: [], findings: [] };

async function run() {
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...iPhone });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') results.consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => results.pageErrors.push(String(err)));
  page.on('requestfailed', (req) => {
    results.failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) results.failedRequests.push(`${res.status()} ${res.url()}`);
  });

  console.log(`== WebKit ${await browser.version()} | device: iPhone 13 (${iPhone.viewport.width}x${iPhone.viewport.height}, dpr=${iPhone.deviceScaleFactor}) ==`);

  // ---- HOME PAGE ----
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Dismiss the auto-popup enquiry modal if present, same as a real visitor would.
  const closeBtn = page.locator('.enquiry-modal-close, [aria-label="Close"], .modal-close').first();
  if (await closeBtn.isVisible().catch(() => false)) await closeBtn.click().catch(() => {});

  await page.screenshot({ path: 'webkit-shots/01-home-hero.png' });

  // Scroll to Global Safari section
  await page.evaluate(() => {
    const el = document.querySelector('#stacked-safari-expeditions');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'webkit-shots/02-global-safari.png' });

  const safariStatus = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.cards-grid')];
    return rows.map((row, i) => {
      const track = row.querySelector('.marquee-inner');
      if (!track) return `row${i}: NO TRACK`;
      const imgs = [...track.querySelectorAll('img')];
      const loaded = imgs.filter((im) => im.complete && im.naturalWidth > 0).length;
      const broken = imgs.filter((im) => im.getAttribute('src') && im.complete && im.naturalWidth === 0).length;
      const anim = track.getAnimations()[0];
      return `row${i}: loaded=${loaded}/${imgs.length} broken=${broken} animState=${anim ? anim.playState : 'NONE'}`;
    });
  });
  results.findings.push({ section: 'Global Safari (initial)', status: safariStatus });

  // Scroll far past, then back — the RC-23 self-heal scenario.
  await page.evaluate(() => window.scrollBy(0, 4000));
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const el = document.querySelector('#stacked-safari-expeditions');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1200);
  const safariAfterRoundTrip = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.cards-grid')];
    return rows.map((row, i) => {
      const track = row.querySelector('.marquee-inner');
      const imgs = [...track.querySelectorAll('img')];
      const loaded = imgs.filter((im) => im.complete && im.naturalWidth > 0).length;
      return `row${i}: ${loaded}/${imgs.length}`;
    });
  });
  results.findings.push({ section: 'Global Safari (after scroll-away-and-back)', status: safariAfterRoundTrip });
  await page.screenshot({ path: 'webkit-shots/03-global-safari-after-roundtrip.png' });

  // ---- CONTINENTS PAGE ----
  await page.goto(`${BASE}/index.html#continents`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'webkit-shots/04-continents-top.png' });

  // Scroll through all 7 rows sequentially, checking each is visible in turn.
  for (let i = 0; i < 7; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: 'webkit-shots/05-continents-midscroll.png' });

  const continentStatus = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.continent-marquee-wrapper')];
    return rows.map((row, i) => {
      const track = row.querySelector('.continent-marquee-track');
      if (!track) return `row${i}: NO TRACK`;
      const imgs = [...track.querySelectorAll('img')];
      const loaded = imgs.filter((im) => im.complete && im.naturalWidth > 0).length;
      const broken = imgs.filter((im) => im.getAttribute('src') && im.complete && im.naturalWidth === 0).length;
      const idle = track.classList.contains('marquee-idle');
      return `row${i}: idle=${idle} loaded=${loaded}/${imgs.length} broken=${broken}`;
    });
  });
  results.findings.push({ section: 'Continents (mid-scroll)', status: continentStatus });

  // Scroll to bottom, then back to top — full round trip.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'webkit-shots/06-continents-back-to-top.png' });

  const continentAfterRoundTrip = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.continent-marquee-wrapper')];
    return rows.map((row, i) => {
      const track = row.querySelector('.continent-marquee-track');
      const imgs = [...track.querySelectorAll('img')];
      const loaded = imgs.filter((im) => im.complete && im.naturalWidth > 0).length;
      return `row${i}: ${loaded}/${imgs.length}`;
    });
  });
  results.findings.push({ section: 'Continents (back at top after full round trip)', status: continentAfterRoundTrip });

  // Check for any -webkit- prefix gaps: animations actually running?
  const animCheck = await page.evaluate(() => {
    const tracks = [...document.querySelectorAll('.marquee-inner, .continent-marquee-track')];
    return tracks.filter((t) => !t.classList.contains('marquee-idle')).map((t) => {
      const anim = t.getAnimations()[0];
      return anim ? anim.playState : 'NO ANIMATION OBJECT';
    });
  });
  results.findings.push({ section: 'Active row animation states (WebKit Web Animations API)', status: animCheck });

  await browser.close();

  console.log('\n=== CONSOLE ERRORS ===');
  console.log(results.consoleErrors.length ? results.consoleErrors.join('\n') : '(none)');
  console.log('\n=== PAGE ERRORS (uncaught exceptions) ===');
  console.log(results.pageErrors.length ? results.pageErrors.join('\n') : '(none)');
  console.log('\n=== FAILED / 4xx+ REQUESTS ===');
  console.log(results.failedRequests.length ? results.failedRequests.join('\n') : '(none)');
  console.log('\n=== FINDINGS ===');
  results.findings.forEach((f) => {
    console.log(`\n-- ${f.section} --`);
    console.log(Array.isArray(f.status) ? f.status.join('\n') : f.status);
  });
}

run().catch((err) => {
  console.error('SCRIPT FAILED:', err);
  process.exit(1);
});
