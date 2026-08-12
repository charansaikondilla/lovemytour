// Regression test for RC-27/RC-28: the marquee's --marquee-duration and
// --marquee-shift custom properties must always match the track's actual
// rendered scrollWidth, and any correction to them must never visibly
// reposition the row.
//
// Why this exists as its own test rather than folded into test-webkit.mjs:
// this bug was invisible to every other check in this project, including
// the general WebKit suite — console errors, broken images, and animation
// play-state all reported clean while this was silently wrong the entire
// session. It was found by explicitly comparing the CSS custom properties
// against the DOM's actual measured width, which nothing else in this
// project's testing does. If this file's assertions ever start failing
// again, re-read RC-28 in iphone.md before changing ensureMarqueeFill,
// tuneMarqueeSpeed, or watchMarqueeTrackWidth in script.js.
import { webkit, devices } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:8798';
const iPhone = devices['iPhone 13'];
let failures = 0;

function check(label, cond, detail) {
  console.log(`${cond ? 'PASS' : 'FAIL'}: ${label}${detail ? ' — ' + detail : ''}`);
  if (!cond) failures++;
}

async function run() {
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...iPhone });
  const page = await context.newPage();
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200); // give watchMarqueeTrackWidth's ResizeObserver time to settle

  // 1. Every row's --marquee-shift must equal exactly half its track's
  // current scrollWidth (rounded) — the single invariant that broke
  // silently for the whole session before RC-28.
  const mismatch = await page.evaluate(() => {
    const tracks = [...document.querySelectorAll('.marquee-inner, .continent-marquee-track')];
    return tracks.map((t, i) => {
      const expected = Math.round(t.scrollWidth / 2);
      const actual = parseFloat(getComputedStyle(t).getPropertyValue('--marquee-shift')) || 0;
      return { i, expected, actual, off: Math.abs(expected - actual) };
    }).filter((r) => r.off > 2); // 2px tolerance for rounding
  });
  check('every track\'s --marquee-shift matches half its real scrollWidth', mismatch.length === 0,
    mismatch.length ? JSON.stringify(mismatch) : undefined);

  // 2. Force a genuine width change (not a direct style poke — see
  // test-rc27-clean.mjs history for why that gives a false result) and
  // confirm the visual position doesn't jump when tuneMarqueeSpeed
  // recalculates.
  const before = await page.evaluate(() => {
    const track = document.querySelector('.cards-grid-row-1 .marquee-inner');
    const anim = track.getAnimations()[0];
    anim.currentTime = 4000;
    const duration = Number(anim.effect.getTiming().duration);
    const fraction = ((4000 % duration) + duration) % duration / duration;
    track.querySelectorAll('.card:not([aria-hidden])').forEach((c) => { c.style.marginLeft = '20px'; });
    return { duration, fraction };
  });
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => {
    const track = document.querySelector('.cards-grid-row-1 .marquee-inner');
    const anim = track.getAnimations()[0];
    const duration = Number(anim.effect.getTiming().duration);
    const currentTime = Number(anim.currentTime);
    const fraction = ((currentTime % duration) + duration) % duration / duration;
    return { duration, fraction };
  });
  const drift = Math.abs(before.fraction - after.fraction);
  check('duration actually changed (test is exercising the real code path)', before.duration !== after.duration,
    `${before.duration}ms -> ${after.duration}ms`);
  check('visual progress preserved across that change (<2% drift)', drift < 0.02,
    `${(drift * 100).toFixed(2)}% drift`);

  await browser.close();
  if (failures > 0) {
    console.log(`\n${failures} check(s) failed.`);
    process.exit(1);
  }
  console.log('\nAll checks passed.');
}
run().catch((e) => { console.error('SCRIPT FAILED:', e); process.exit(1); });
