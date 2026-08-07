// Temporary verification harness (deleted before hand-off).
// Loads every package detail page and reports JS errors + layout problems.
const { spawn } = require('child_process');
const http = require('http');
const os = require('os');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.argv[2] || 'http://localhost:5199';
const W = Number(process.argv[3] || 1440);
const H = Number(process.argv[4] || 900);
const IDS = JSON.parse(process.argv[5]);
const PORT = 9338;

const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, `--window-size=${W},${H}`,
  '--user-data-dir=' + os.tmpdir() + '/cdp-sweep', 'about:blank'], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (p) => new Promise((resolve, reject) => {
  http.get({ host: '127.0.0.1', port: PORT, path: p }, (res) => {
    let d = ''; res.on('data', (c) => (d += c));
    res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
  }).on('error', reject);
});

(async () => {
  let t = null;
  for (let i = 0; i < 40 && !t; i++) {
    try { t = (await getJSON('/json/list')).find((x) => x.type === 'page'); } catch (e) { /* boot */ }
    if (!t) await sleep(250);
  }
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = new Map();
  let errors = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    if (m.method === 'Runtime.exceptionThrown') {
      errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    }
  });
  const send = (method, params = {}) => new Promise((res) => {
    const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
  await send('Page.navigate', { url: BASE + '/#home' });
  await sleep(2500);

  let bad = 0;
  for (const pid of IDS) {
    errors = [];
    await send('Runtime.evaluate', { expression: `window.location.hash = '#package/${pid}'` });
    await sleep(900);
    const r = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const page = document.querySelector('.fb-page');
        const de = document.documentElement;
        return JSON.stringify({
          rendered: !!page,
          title: (document.querySelector('.fb-title') || {}).textContent || '',
          facts: document.querySelectorAll('.fb-fact').length,
          highlights: document.querySelectorAll('.fb-hl').length,
          days: document.querySelectorAll('.fb-day').length,
          incLeft: document.querySelectorAll('.fb-inc-row, .fb-exc-line').length,
          heroImgOk: (() => { const i = document.querySelector('.fb-hero-img'); return i ? (i.complete && i.naturalWidth > 0) : false; })(),
          overflowX: de.scrollWidth > de.clientWidth + 1,
        });
      })()`,
    });
    const d = JSON.parse(r.result.value);
    const problems = [];
    if (!d.rendered) problems.push('NOT-RENDERED');
    if (d.facts !== 3) problems.push('facts=' + d.facts);
    if (!d.highlights) problems.push('no-highlights');
    if (!d.days) problems.push('no-itinerary');
    if (d.incLeft) problems.push('INCLUDED-STILL-PRESENT');
    if (!d.heroImgOk) problems.push('HERO-IMG-BROKEN');
    if (d.overflowX) problems.push('H-OVERFLOW');
    if (errors.length) problems.push('JS:' + errors[0].slice(0, 70));
    if (problems.length) { bad++; console.log('✗', pid, '->', problems.join(', ')); }
  }
  console.log(bad === 0 ? `ALL ${IDS.length} PAGES OK` : `${bad}/${IDS.length} PAGES WITH PROBLEMS`);
  ws.close(); chrome.kill(); process.exit(0);
})().catch((e) => { console.error('FAILED:', e.message); chrome.kill(); process.exit(1); });
