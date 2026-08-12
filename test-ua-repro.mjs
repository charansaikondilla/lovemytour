// Reproduction attempt for a user report: switching Chrome's User-Agent to
// an iPhone Safari string (via a UA-switcher extension) showed Global
// Safari's row 1 permanently stuck with 0 images loaded while its siblings
// loaded fine. This is still Chromium underneath — a UA string swap alone
// does not change the rendering/JS engine — so if this reproduces the bug,
// the cause is in OUR OWN code's timing, not an iOS-only rendering quirk.
//
// Uses the system's installed Chrome (chromium.launch({ executablePath })
// below) rather than downloading Playwright's own Chromium build, since
// this machine was nearly out of disk space. Adjust CHROME_PATH if Chrome
// is installed somewhere else, or delete the executablePath line entirely
// to fall back to `npx playwright install chromium` (needs ~200MB free).
//
// Findings from running this (see iphone.md RC-24): could not reproduce a
// PERMANENT stuck state under any network condition tried (instant
// localhost, throttled, heavily throttled + held stationary for 40s) —
// slow connections just took longer, always eventually finishing. That
// doesn't clear the report; it means whatever caused it needs a condition
// this script hasn't hit yet, or is intermittent (e.g. the entries.forEach
// error-isolation gap fixed alongside this script, RC-24 in script.js,
// which cannot be reliably triggered on demand from outside the browser).
import { chromium } from '@playwright/test';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = process.argv[2] || 'https://charansaikondilla.github.io/lovemytour';
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

async function run() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH });
  const context = await browser.newContext({
    userAgent: IPHONE_UA,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (err) => consoleErrors.push('PAGEERROR: ' + String(err)));

  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 400,
    downloadThroughput: (400 * 1024) / 8, // ~400kbps — weak/congested mobile
    uploadThroughput: (200 * 1024) / 8,
  });

  console.log(`== Chromium ${await browser.version()} spoofed as iPhone Safari UA, 390x844, slow network (400kbps/400ms latency) ==`);
  console.log(`Target: ${BASE}`);

  await page.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded' });
  console.log(`UA reported by page:`, await page.evaluate(() => navigator.userAgent));

  const rowStatus = () => page.evaluate(() => {
    const rows = [...document.querySelectorAll('.cards-grid')];
    return rows.map((row, i) => {
      const track = row.querySelector('.marquee-inner');
      if (!track) return `row${i}: NO TRACK`;
      const imgs = [...track.querySelectorAll('img')];
      const loaded = imgs.filter((im) => im.complete && im.naturalWidth > 0).length;
      const withDataSrc = imgs.filter((im) => im.hasAttribute('data-src')).length;
      const withSrc = imgs.filter((im) => im.hasAttribute('src')).length;
      const parked = imgs.filter((im) => im.dataset.parkedSrc).length;
      const idle = track.classList.contains('marquee-idle');
      const rect = row.getBoundingClientRect();
      // Sample the first still-unloaded image's own state directly.
      const stuck = imgs.find((im) => im.hasAttribute('src') && !(im.complete && im.naturalWidth > 0));
      const stuckInfo = stuck ? `src=${stuck.getAttribute('src')} complete=${stuck.complete} naturalWidth=${stuck.naturalWidth}` : 'none';
      return `row${i}: idle=${idle} loaded=${loaded}/${imgs.length} withSrc=${withSrc} withDataSrc=${withDataSrc} parked=${parked} top=${Math.round(rect.top)} | stuckSample: ${stuckInfo}`;
    });
  });

  // Match the user's actual sequence: one scroll to bring the section up,
  // then hold — no more scrolling — and watch.
  await page.mouse.wheel(0, 750);
  await page.waitForTimeout(1000);

  console.log(`\n--- right after single scroll to section, holding still from here ---`);
  console.log((await rowStatus()).join('\n'));

  for (let t = 1; t <= 40; t++) {
    await page.waitForTimeout(1000);
    if (t % 2 === 0 || t <= 5) {
      console.log(`\n--- t=${t}s (stationary) ---`);
      console.log((await rowStatus()).join('\n'));
    }
  }

  console.log('\n=== NETWORK: in-flight / pending requests for row images ===');
  console.log(await page.evaluate(() => {
    if (!window.performance || !performance.getEntriesByType) return 'no perf API';
    return performance.getEntriesByType('resource')
      .filter(r => /safari-cards/.test(r.name))
      .map(r => `${r.name.split('/').pop()}: duration=${Math.round(r.duration)}ms transferSize=${r.transferSize} responseEnd=${Math.round(r.responseEnd)}`)
      .join('\n');
  }));

  console.log('\n=== CONSOLE ERRORS ===');
  console.log(consoleErrors.length ? consoleErrors.join('\n') : '(none)');

  await browser.close();
}

run().catch((err) => { console.error('FAILED:', err); process.exit(1); });
