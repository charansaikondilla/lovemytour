# iPhone / Safari Marquee Bug — Evidence, Root Causes, and Plan

**Status:** RC-19 deployed. Root cause identified by measurement (not inference) for the
first time. Awaiting on-device confirmation.

**The bug, in the reporter's words:** the three "Global Wild Safaris" rows on the home
page go blank on iPhone — often the middle one, sometimes taking turns — and the rows
"end", showing empty space instead of looping. The Continents page rows hitch and stall.
Android and desktop are fine.

---

## 0. Why three days of fixes did not work

Every attempt from RC-1 to RC-16 shared one flaw: **it reasoned about the symptom instead
of measuring the machine.** The symptom (a row at correct height, painting nothing) looks
exactly like a compositing bug, so fifteen consecutive fixes targeted compositing —
layer promotion, `will-change`, `backface-visibility`, repaint nudges, visibility gating,
rAF vs. CSS, transform vs. `scrollLeft`.

The actual dominant cause is **memory**, and it was never once measured. The single most
useful command in this whole investigation took thirty seconds:

```js
// decoded bitmap bytes actually resident in the tab
const u = new Map();
[...document.querySelectorAll('img')]
  .filter(i => i.complete && i.naturalWidth > 0)
  .forEach(i => u.set(i.currentSrc, i.naturalWidth * i.naturalHeight * 4 / 1048576));
[...u.values()].reduce((a, b) => a + b, 0);   // -> 155.1 MB
```

**Rule going forward: measure before changing anything.** Section 5 is the standing
protocol.

---

## 1. What was actually measured

All figures from a real browser against the production build, not estimates.

### 1.1 Decoded image memory — the dominant cause

A browser stores every image as a decoded bitmap at its **intrinsic** size, at **4 bytes
per pixel**, regardless of how small it is drawn. A 1408×768 photo in a 190×230 card
costs 4.13 MB of RAM, not the 261 KB of its file.

| Page | Unique images | Decoded, before | Decoded, after | Cut |
|---|---|---|---|---|
| Continents | 62 | **155.1 MB** | **57.2 MB** | −63% |
| Home | 18 | 19.5 MB | 11.7 MB | −40% |
| Hero slideshow (CSS backgrounds) | 5 | 12.7 MB | 12.7 MB | — |
| **Whole tab, both pages visited** | | **~175 MB** | **~69 MB** | **−61%** |

The worst offenders were displayed at 238×278 while stored at 1000×1250 and 1408×768:

| File | Intrinsic | Displayed | Decoded |
|---|---|---|---|
| `safari-srilanka-leopard.jpg` | 1000×1250 | 238×278 | 4.77 MB |
| `safari-norway-real.jpg` | 1000×1250 | 238×278 | 4.77 MB |
| `turkey.jpg`, `egypt.jpg` | 1408×768 | 238×278 | 4.13 MB each |
| `antarctic-peninsula.jpg` | 1408×768 | 238×278 | 4.13 MB |

Across the whole asset tree: **233 MB decoded if every image were resident at once**,
from only 78 files totalling a few MB on disk. File size was never the problem, and that
is exactly why compressing files (an earlier fix) did not help — compression shrinks
transfer, not decoded memory. Only **pixel dimensions** shrink decoded memory.

### 1.2 Why this hits iPhone and not Android

- iOS Safari enforces a hard per-tab memory ceiling, far below desktop Chrome's, and
  substantially below Android Chrome's on comparable hardware.
- When it approaches that ceiling it does not crash — it **discards decoded image data
  and composited layer backing stores**. A row whose backing store was dropped *keeps its
  layout height and keeps animating, but paints nothing.*
- That is a precise description of the screenshots: full-height blank rows, correct
  spacing, no missing layout. And it explains "rows take turns" — WebKit evicts whichever
  layer it chooses, then re-decodes when you scroll back.
- **This is a single-page app.** `isContinentsRendered` keeps the Continents DOM alive
  after you visit it, so its images stay resident. Browsing Continents and returning home
  meant the tab carried ~175 MB while the home rows were trying to animate. This is very
  likely why the home rows failed *after browsing* rather than on first load.

### 1.3 The short-row bug — a second, independent cause

Each row ships its card set **twice** and the keyframes translate by one copy. That is
only seamless if **one copy is at least as wide as the visible row**. Measured, it was not:

| Row | One copy | Row width | Result |
|---|---|---|---|
| Antarctica | 520 px | 1286 px | slides out — **nothing behind it** |
| North America | 780 px | 1286 px | same |
| Global Safari (desktop) | 1332 px | 1521 px | same |

The row literally runs out of cards and shows empty space. **Card count alone decides
it** — which is why the two continents with the fewest destinations (North America 3,
Antarctica 2) were the ones repeatedly reported, and why it looked like "images not
loading" when it was arithmetic. This is the "the countries are ending" report.

### 1.4 CPU saturation on Continents

`initDraggableMarquees` drove all **seven** continent rows from `requestAnimationFrame`,
writing `track.style.transform` every frame: 7 DOM writes + 7 style recalculations per
frame, on the same main thread decoding images and servicing touch. That is the
Continents hitching.

### 1.5 GPU layer pressure

Every track carried `will-change: transform` permanently — 10 permanent composited layers
(3 home + 7 Continents), each a full-width backing store, whether or not the row was
anywhere near the screen. MDN warns about exactly this. It compounds 1.1.

### 1.6 Ruled out, with evidence

| Hypothesis | Verdict |
|---|---|
| Storage / file size | **No.** All 15 safari cards total 660 KB. |
| Images failing to load | **No.** Every row reports all images loaded with real dimensions. |
| Filename case / spaces | **No.** Already fixed; verified serving `antarctic-peninsula.jpg`. |
| Layer/texture size limit | **No.** The never-broken `.domestic-marquee-track` is 2540×320 — *larger* than each safari row at 2136×125. |
| Missing `-webkit-` prefixes | **No.** All present. |
| `prefers-reduced-motion` | **No.** Deliberately ungated; documented trap on Windows. |

---

## 2. What is now in place (RC-15 → RC-19)

| # | Change | Targets |
|---|---|---|
| 1 | Card images served from 480 px-wide derivatives (`assets/card-thumbs/`), originals untouched, `onerror` falls back | §1.1 — the big one |
| 2 | `ensureMarqueeFill()` repeats the set until one copy ≥ row width | §1.3 |
| 3 | All marquees on one compositor CSS animation; **zero** per-frame JS | §1.4 |
| 4 | One `IntersectionObserver` parks far-offscreen rows, clearing `will-change` | §1.5 |
| 5 | Spacing via `margin-right`, not `gap` — `gap` left a `gap/2` jump every loop | seam stutter |
| 6 | Keyframes translate an **absolute pixel** distance (`--marquee-shift`), not `-50%` | §3.1 |
| 7 | Drag/swipe restored by **seeking the animation**, not a scroll container | manual scroll |
| 8 | `backdrop-filter` removed from `.destinations-header` | GPU cost |
| 9 | Measurement retried when a row is not yet laid out | §3.2 |

### Design rules adopted, and why

- **Failure must be safe.** Rows animate *by default*; the observer only ever *parks*
  them. The reverse (start paused, mark visible) makes correct rendering depend on the
  observer firing — and the old code carried a warning that a row gated that way "would
  freeze permanently — indistinguishable from 'the row disappeared'". That would have
  rebuilt the reported bug as the default state.
- **One owner per property.** Play state is driven only from CSS classes, never mixed
  with WAAPI `pause()`/`play()`.
- **No scroll container.** Native `overflow-x` would force ~4 copies per track (a
  ~10,000 px layer on a phone) and reintroduces snap/momentum/`touch-action` conflicts —
  the source of the Android page-scroll regression.
- **Never claim a vertical gesture.** Drag engages only on `|dx| > 10 && |dx| > |dy|`;
  no `setPointerCapture`, no `preventDefault`, all listeners passive.

---

## 3. iPhone-specific notes worth keeping

### 3.1 Percentage transforms on `width: max-content`
`translate3d(-50%, …)` resolves against the element's own border-box width — a width the
engine *derives* here. If that resolution falls out of step with laid-out content during
a relayout (address bar collapsing changes `svh`, orientation change, late reflow), the
track no longer travels exactly one copy and a strip of empty track shows at the seam.
**Use a pixel distance measured from the DOM.**

### 3.2 Layout timing
The Global Safari section is `position: absolute; top: 85svh`, so it can be laid out late,
and iOS relayouts when the address bar collapses. Any measurement taken at init can
legitimately return 0 — **never mark a row "done" on a failed measurement.**

### 3.3 `svh`, not `vh`
Already correct. Plain `vh` changes as browser chrome collapses and makes the section jump
mid-scroll.

### 3.4 All iOS browsers are WebKit
Chrome-iOS and Firefox-iOS included. A "Safari bug" is an **every-iPhone-browser** bug.

### 3.5 `backdrop-filter`
Must re-sample its backdrop whenever anything beneath changes. Above three continuously
animating rows it pins the compositor to a full-rate re-snapshot. Avoid near animation.

### 3.6 Lazy loading inside a marquee
Safari's lazy-load intersection logic does not reliably re-evaluate for content arriving
via `transform`. A card can stay permanently unloaded. **Do not use `loading="lazy"`
inside a marquee.**

---

## 4. Remaining work, in priority order

**Phase 1 — confirm or refute the memory theory (blocking).**
Run §5 on the actual iPhone. If rows still blank at ~69 MB, memory is not the whole story
and the next suspect is `.global-navbar.scrolled` (`position: fixed`, `z-index: 10000`,
`backdrop-filter: blur(20px)`, re-sampling continuously while scrolling — which fits the
"mainly scrolling" report). Removing it is a visible design change and needs sign-off.

**Phase 2 — cut the remaining 57 MB on Continents.**
32 of the 62 images are outside the marquees (hero slider, other sections) and untouched.
Extend `generate_card_thumbs.py` to cover them.

**Phase 3 — stop the SPA accumulating pages.**
Even at 69 MB the tab holds every page ever visited. Options: drop `isContinentsRendered`
and re-render on entry; or null out `img.src` for rows parked by the observer.

**Phase 4 — only if 1–3 fail: virtualise the rows.**
Keep ~8 cards per row and recycle content on wrap. Largest change, reserved for last.

**Phase 5 — regression guard.**
Assert in CI: no marquee image wider than 480 px; every row `halfWidth ≥ rowWidth`;
`--marquee-shift` equals half the track width.

---

## 5. On-device diagnostic protocol

Remote inference has now been wrong repeatedly. Before the next code change, get evidence.

1. **Hard-reload.** Hold reload → *Reload Without Content Blockers*, or clear Safari site
   data. Stale CSS/JS produced two false "still broken" reports during this work.
2. **Reproduce deliberately.** Note: does it fail on first load, or only after visiting
   Continents and coming back? That single answer confirms or kills the SPA-accumulation
   theory (§1.2).
3. **Photograph the failure**, noting *which* row and whether the space is blank or
   occupied by a partial card.
4. **On-device HUD:** append `?safaridebug` to the URL. It shows each row's height,
   position, last tick, and any caught error. A stalled row prints `*** STALLED ***`.
   A photo of this is worth more than any further guessing.
5. **If a Mac is available** — the highest-value step. Safari → Develop → connect the
   iPhone, then in the console on the failing page:
   ```js
   // decoded bitmap MB actually resident
   const u = new Map();
   [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth > 0)
     .forEach(i => u.set(i.currentSrc, i.naturalWidth * i.naturalHeight * 4 / 1048576));
   console.log('decoded MB', [...u.values()].reduce((a, b) => a + b, 0));

   // is the failing row starved of content, or just not painting?
   [...document.querySelectorAll('.cards-grid')].map(r => {
     const t = r.querySelector('.marquee-inner');
     return { half: t.scrollWidth / 2, row: r.getBoundingClientRect().width,
              shift: t.style.getPropertyValue('--marquee-shift'),
              state: t.getAnimations()[0]?.playState };
   });
   ```
   `half < row` ⇒ short-row bug. `half ≥ row` but blank ⇒ dropped backing store ⇒ memory.

---

## 6. Verification standard

Every change is verified against the **production build** in a real browser before
shipping, and the deployed asset hash is confirmed to match the local build. Current
state, both pages: **0 JS errors, 0 broken images**, home 3/3 and Continents 7/7 rows
running with correct alternating directions, every row `fills = true`, `--marquee-shift`
equal to half-track-width on all 10 rows, drag verified by synthesised `PointerEvent`s
(vertical ignored, horizontal seeks, wraps infinitely both ways, swipe suppresses the
click, tap still opens the card).

**Two environment limits to know:** the automation tab is backgrounded
(`document.hidden === true`), so animation clocks do not advance and
`IntersectionObserver` never fires there. Both were confirmed with control experiments —
they are limits of the harness, not of the code. **Nothing here is verified on a real
iPhone**, which is why §5 exists.
