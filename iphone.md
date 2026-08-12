# iPhone Safari Marquee Stability — Complete Diagnostic & Implementation Plan

**Document Version:** 1.1
**Date:** 2026-08-13
**Status:** ⚠️ Pending Real iPhone Testing — RC-20 (Phase 2, partial) implemented and verified error-free from a Windows machine
**Scope:** 3 Global Safari home-page rows + 7 Continents page rows (10 total marquee rows)

## RC-20 (2026-08-13) — Phase 2 memory/robustness pass, no architecture changes

The marquee mechanism itself (§4) was left untouched — items 5, 6, 7 of the
checklist were already confirmed sound, and Phase 1 (real iPhone test) is
still the only thing that can validate it. What changed is additional,
verifiable memory reduction and the removal of an external dependency:

1. **Zambia and Costa Rica cards** (Global Safari rows) now load local
   660×440 JPEGs from `assets/card-thumbs/safari-cards/` instead of hotlinking
   `images.unsplash.com` — removes an external network dependency inside the
   marquee and guarantees the exact intrinsic size the `width`/`height`
   attributes already claimed (§7.3, now resolved).
2. **The 7-continent showcase carousel and the Continents search-results
   dropdown** (`script.js`, `continent-card-inner` / `continents-search-result-img`)
   now route through `cardThumb()` like every other continent image, instead
   of loading the full-size original.
3. **Bug found and fixed during this pass:** step 2 initially 404'd two
   images (`safari-brazil-jaguar.jpg`, `safari-antarctica-penguins.jpg`).
   `generate_card_thumbs.py` only ever scanned `continentsData` in
   `packagesData.js`; the showcase carousel's data (`cinematicDestinations`)
   lives in `script.js` and was invisible to it. Added
   `cinematic_showcase_images()` to the generator so it scans both sources.
   Re-running it now reports `inputs 47, written 47, missing 0`.
4. Added `<link rel="preload" as="image" fetchpriority="high">` for the hero
   LCP image and `<link rel="preconnect" href="https://images.unsplash.com">`
   in `<head>` — pure additive, no behavior change.
5. Cache-bust query strings on `script.js`/`styles.css` bumped to `20260813a`.

**Verified from a Windows dev machine** (Python `http.server` + Chrome
DevTools automation, both `/` and `/#continents` routes):
   - Zero console errors, zero broken images (`naturalWidth === 0` count: 0).
   - Zero 404s across every request the page makes (the two above were
     caught and fixed before landing).
   - All 10 marquee rows report `half >= row` (no short-row regression) and
     `state: "running"` where visible.
   - Decoded image memory for both pages resident at once: **70.0 MB**
     (previously ~69 MB — essentially flat, because this pass targeted
     *correctness and one external dependency*, not the large non-marquee
     image set; that's still Phase 2.1 below, not yet done).

**What this does NOT change:** nothing in §7.1 (69 MB still borderline on
2GB iPhones) or §7.6 (no real iPhone has run this build). Phase 2.1 (thumbnail
the remaining ~30 non-marquee Continents images) and Phase 3 (SPA memory
accumulation) are unstarted — see §8.

## RC-21 (2026-08-13) — the actual leak, plus a testing-methodology gap in every prior RC including RC-20

The user came back with real device screenshots (`iphone error/*.jpeg`, real
iPhone Safari, mid phone call, low battery) showing the exact same class of
bug RC-1 through RC-20 were supposed to have fixed: Global Safari rows going
blank (inconsistently — sometimes row 2 alone, sometimes rows 2+3, sometimes
all 3), and Continents rows blank on Africa/Australia/North America. This
prompted going back to first principles instead of another point fix.

### Finding #1: every RC, including RC-20, verified the wrong artifact

This site is a Vite project (`npm run build` → `dist/`, deployed to GitHub
Pages by `.github/workflows/deploy.yml`). Every verification pass done in
this document — RC-20 included — tested the *raw, unbuilt source* via
`python -m http.server`, never the actual bundled/hashed production output.
Building for real surfaced a structural detail that matters: Vite hashes and
flattens any image it can statically see (`<img src="...">` literally in
`index.html`, or CSS `url()`), producing `dist/assets/kenya-BldIFdys.jpg`. It
cannot see paths built at runtime (`cardThumb()`, `dest.image`, `pkg.image`)
— those only resolve because `sync-public-assets.js` mirrors the whole
`assets/` tree into `public/assets/`, which Vite copies verbatim. Both
mechanisms turned out to work correctly together, so this wasn't itself a
bug — but it means 20 RCs of "verified working" were never actually checking
the thing iPhones load. This RC's verification (below) runs against a real
`npm run build` output for the first time.

### Finding #2: the actual leak — the observer only ever released the GPU layer, never the decoded bitmap

`initMarquees()`'s `IntersectionObserver` has toggled `.marquee-idle` since
RC-17, which drops `will-change: transform` for offscreen rows. It has never
touched the `<img>` elements themselves. A decoded bitmap stays cached by the
browser for as long as the element keeps that `src`, regardless of
`will-change`. On the Continents page — 7 rows, up to 18 images each — that
means every row the user scrolls past keeps its full image set resident for
the rest of the session. Memory grows monotonically with scroll distance;
whichever rows are still resident when iOS's ceiling is crossed get their
backing stores evicted, more or less arbitrarily. That is why the failing
continent was never the same one twice across 20 RCs' worth of reports — it
was never about a specific row, it was about how much had already
accumulated by the time the user scrolled to it. Africa/Australia/North
America failing in the user's latest report is consistent with this: whatever
had already been scrolled past by that point.

**Fix:** the same observer callback now also strips (`removeAttribute('src')`,
saved to `data-parked-src`) each image in a row the moment it's confirmed
offscreen, and restores it the moment the row re-enters the existing 250px
lead zone — before it's visible. Verified live (real `dist/` build,
scripted scroll): scrolling to the bottom left only the currently-visible row
holding real `src` values; every row scrolled past showed `idle=true,
withSrc=0, parked=<n>`; scrolling back to the top restored every image with
zero broken `<img>` elements. Scoped to `.continent-marquee-track` only —
deliberately excludes Global Safari, see the code comment in `script.js` for
why (the SPA's route switch reads "hidden" the same way "scrolled away"
reads, which risks a blank-flash race on Home that this row-by-row-scroll
scenario on Continents doesn't have).

### Finding #3: Global Safari's blank-on-load is a different failure — a startup decode burst, not accumulation

Global Safari is only 3 rows, always clustered at the top of the home page —
there's nothing to accumulate past, and the "no rows" screenshot shows all 3
blank on what looks like a fresh load. All ~15 unique card images across all
3 rows shipped `eager` (no `loading="lazy"`, by design — WebKit's native lazy
IntersectionObserver doesn't reliably re-fire for `transform`-moved content,
per RC-19). That means the browser fires off every decode for all 3 rows
simultaneously, at the exact moment it's also parsing fonts, running init JS,
and painting the hero — the single highest-contention window on the whole
page load. Reports never agreeing on which of the 3 rows failed (row 2 alone,
2+3, or all 3) is the signature of a decode queue running out of budget
partway through an oversized batch, not one row having a distinct bug.

**Fix:** rows 2 and 3 in `index.html` now ship `data-src` instead of `src`
(row 1 is untouched — it's the one row guaranteed near the top of the
viewport, so it must not depend on a JS callback for first paint, same rule
as `.marquee-idle`). The same `IntersectionObserver`/250px lead zone hydrates
`data-src` → `src` the first time each row is confirmed nearby, spreading the
~15-image decode burst across the scroll instead of forcing it all at once on
load. One-way, unlike the Continents fix — nothing is re-stripped once
loaded. Verified live: on load only row 1's 6 unique images are in the
network log; scrolling down hydrates rows 2 and 3 with zero broken images.

### Finding #4: an environmental factor visible in every screenshot, not a code bug

All 4 screenshots in `iphone error/` show a live phone call in progress
(status bar call timer) and a low battery icon. iOS auto-enables Low Power
Mode under ~20% charge, which throttles CPU and can defer network/background
work; an active call adds its own audio-processing load and can share
cellular bandwidth with the page. None of this is something the code can
detect or fix, but it is a real, compounding source of exactly the symptom
being chased (less memory/CPU headroom than an idle, charged phone would
have) — worth ruling out by testing once off a call with a charged battery,
since a real fix on a maximally-constrained device may still look identical
to a real fix that only needed normal headroom.

## RC-22 (2026-08-13) — on-page debug panel

User has no Mac, so no Safari Web Inspector. Added a small green DEBUG
toggle (top-left of every page) that opens a live panel (updates every
500ms) showing per marquee row: idle state, loaded/total images, pending
(parked or mid-hydration) count, and broken count, plus a page total.
Native iPhone screenshot (Volume Up + Power) captures it — no other tooling
needed.

Caught and fixed a bug in the panel before shipping: v1 flagged every
parked or not-yet-hydrated image as "broken" purely because `naturalWidth`
is 0 for those by design, which would have shown a wall of false red X's
on Continents (most of its 7 rows are off-screen at any scroll position).
Fixed to only count an image broken if it has a live `src` that actually
failed to decode.

## RC-23 (2026-08-13) — the first real iPhone evidence, and why RC-21 wasn't enough

The user ran RC-22's debug panel on their actual iPhone (screenshots in
`iphone error/`, not on a call this time, ~70% battery — ruling out the
low-power-mode theory as the primary cause) and sent back the first real
on-device diagnostic data this entire investigation has ever had.

**What it showed, scrolled to the bottom of Continents:** all 7 continent
rows AND all 3 Global Safari rows reporting `pending=<full count>,
imgs=0/<total>` — correct and expected, since RC-21's design releases a
row's images once scrolled past. Not a bug by itself.

**What it showed on Home, mid-scroll through Global Safari — the real
finding:** row 1 visually blank, row 2 rendering fine. This is backwards
from what RC-21 should produce: row 1 ships `eager` in raw HTML
specifically so it never depends on JS; row 2 depends on the observer
hydrating it. Row 1 failing while row 2 (hydrated more recently) worked is
the exact signature RC-19 first diagnosed — iOS silently evicting a
decoded backing store while the `<img>` element's own state (`src`,
`complete`, `naturalWidth`) stays fully intact and reports nothing wrong.

This also explains a gap in RC-22's own debug panel: there is no
JS-queryable signal for "this bitmap was evicted." `naturalWidth > 0` can
be true while the row paints nothing. The debug panel would have shown
row 1 as ✅ the whole time this was happening.

**Why RC-21 didn't cover this:** it deliberately left Global Safari's
images permanently resident once loaded, reasoning that only Continents
(7 rows, real scroll-past accumulation) had anything to reclaim, and that
extending the same park/unpark to Global Safari risked a blank-flash race
against the SPA's route switch. That reasoning under-weighted the failure
actually being reported: a resident image with no periodic path back to a
fresh decode has no way to recover from a silent eviction, no matter how
small the total resident footprint is kept.

**Fix:** `setRowImagesParked` now applies to every marquee row, Global
Safari included — see the widened comment in `script.js`. Parking still
requires the observer to report a row outside its 250px lead zone, so nothing
changes about default visibility (rows still animate/show by default). The
practical effect: any row that is scrolled away from and back gets a
guaranteed fresh `src` assignment on return, which forces a new decode
independent of whatever the browser silently did to the old one while it
was out of view — turning "evicted once, blank for the rest of the
session" into "self-heals the next time the row is scrolled near."

**The SPA-flash risk, re-examined rather than avoided:** `.page-view.active`
plays a 500ms opacity fade-in (`fadeInView`, `styles.css`). Navigating home
from Continents parks/restores exactly like any other visibility change,
but the fade gives the observer's restore callback a full frame budget
before the row is more than barely visible. Verified live (real `dist/`
build): Home → Continents → Home leaves all 3 Global Safari rows at
`24/24` loaded, `0` broken.

**Still unresolved:** this raises recovery odds for a row that was
off-screen when evicted; it does not detect or recover a row evicted
*while the user is looking directly at it* — no JS API can currently tell
the difference between "decoded and painting" and "decoded metadata only,
backing store gone." If reports continue with this specific pattern (blank
while stationary, not mid-scroll), the next lever is further cutting Global
Safari's own resident footprint (Phase 2.1, still unstarted) rather than
recovery-after-the-fact.

## RC-24 (2026-08-13) — error isolation + a self-heal sweep, after the UA-spoof lead didn't pan out

User found that switching Chrome's User-Agent to an iPhone Safari string
(a "User-Agent Switcher" extension) reliably showed Global Safari's row 1
stuck at 0 images loaded ("pending" — i.e. still holding `data-src`, never
hydrated) while row 0 and row 2 loaded fine, and it stayed that way even
after waiting. Since a UA string swap alone does not change the rendering
or JS engine (still Chromium/V8 underneath), and this project's own code
has zero UA-sniffing anywhere (checked directly), a reproducible result
from that setup would point at a timing bug in our own code, not an
iOS-only rendering quirk — worth chasing hard.

**Extensive reproduction attempts, all using the real system Chrome via
Playwright with a spoofed iPhone UA + mobile viewport:** instant localhost,
throttled network (~1.6Mbps) against the live site, an aggressive scroll
that intentionally moved rows out of the buffer, and — closest to the
user's actual sequence — a single scroll to the section then holding
stationary for 40 seconds under heavy throttling (400kbps/400ms latency,
closer to a real weak mobile connection). None reproduced a *permanent*
stuck state. Under heavy throttling every row took 20-30 seconds to finish
(real bandwidth math for ~30 images at 400kbps) but always finished.

**What this did surface, from re-reading the observer under scrutiny
rather than from a reproduction:** `entries.forEach(callback)` has no
per-entry error isolation. If processing any single entry throws, the
exception propagates out of `forEach` and every entry queued after it in
that same callback invocation is silently never processed — no console
error a user would notice, no visual sign beyond the row just never
updating. If that row's intersection ratio doesn't cross a threshold again
on its own, the observer has no reason to ever revisit it, and it stays in
whatever state it was left in — which for a not-yet-hydrated Global Safari
row 2/3 is exactly "idle=false, still holding data-src, 0 loaded, forever."
This can't be confirmed as *the* original trigger without either a stack
trace from the user's real session or a reliable repro, neither available —
but it exactly matches the reported shape, and fixing it is risk-free
regardless: every statement inside was already expected to succeed.

**Fix, two parts:**
1. Each entry in the observer callback is now wrapped in its own
   try/catch, logged via `console.error` if it fires. One row's processing
   can no longer prevent any other row, in the same batch or not, from
   being handled correctly.
2. A new independent safety net, `sweepStuckMarqueeImages()`, runs every
   4 seconds regardless of the observer: it re-checks every row the
   observer currently considers active (not `.marquee-idle`) and fixes
   anything inconsistent with that — an un-hydrated `data-src` left over
   from a skipped batch, or a real `src` that finished attempting and came
   back with `naturalWidth` 0 (a genuine network failure, for which this
   codebase previously had no retry anywhere). Re-setting `src` to its own
   value forces a fresh request and decode. This is deliberately a second,
   independent path to the same end state as the observer — a failure in
   one does not depend on the other for recovery. The debug panel now
   surfaces a `Sweep fixes: N` counter so this is directly visible if it
   ever fires on a real device.

**Verified:** artificially forced a row into the exact reported state
(active, all 24 images reset to `data-src`, never hydrated) against the
real `dist/` build — the sweep detected and fixed all 24 within one 4s
cycle, confirming the recovery path works independent of whatever
originally caused the stall. Full WebKit suite (`test-webkit.mjs`) still
reports zero console errors, zero broken images, self-heal intact on both
pages.

**Also added:** `test-ua-repro.mjs` — a saved, reusable reproduction
harness (real system Chrome, spoofed iPhone UA, configurable network
throttling) for the next time this needs re-testing, so this doesn't have
to be rebuilt from scratch.

**Still unresolved:** the user's exact stuck-forever observation was not
reproduced on demand, so RC-24 is a hardening fix for the most plausible
mechanism matching the reported shape, not a confirmed root-cause fix.
Given the sweep is now visible in the debug panel (`Sweep fixes: N`), the
next real-device check should watch specifically for whether that counter
ever moves — if it does, RC-24 caught something and recovered it; if a row
is still stuck with the counter at 0, this theory is wrong and the search
continues elsewhere.

## RC-25 (2026-08-13) — two real bugs found by re-reading the architecture's own history, not another patch

User reported the same class of failure again (middle row blank, appearing
late, occasional inability to scroll the row smoothly) and explicitly asked
for the marquee to be rebuilt with different CSS/JS rather than patched
again. Before writing any new code, read back through every prior RC's
comments in script.js/styles.css in full rather than just the most recent
ones — and that changed the plan.

**What that history rules out:** the obvious "better" rewrite — an
`overflow-x: auto` native scroll container with a `requestAnimationFrame`
loop nudging `scrollLeft` for the auto-drift — is not a new idea here. It is
exactly what RC-10 through RC-14 already tried (both an earlier rAF-driven
`transform` version, RC-1..RC-9, and then the rAF/scrollLeft version) and
both were explicitly abandoned as "none of which held up on real iPhones."
RC-15 replaced both with the current compositor-only CSS `@keyframes`
animation specifically because a compositor animation runs no JavaScript,
reads no layout, and touches no DOM per frame — there is no main-thread
work to be starved or deprioritized, which is what caused rows to freeze or
"take turns" going blank under the rAF-driven approaches. Rebuilding the
rAF/scrollLeft version again would walk back into the same wall. The
current architecture is not naive first-pass code; nearly every rule in the
Global Safari CSS traces to a specific, named, previously-observed failure
(RC-4's `isolation: isolate` for a z-index reset bug, RC-16's layer
promotion on the clipping box specifically, RC-17's `gap: 0` for exact -50%
loop math, RC-18's animation-currentTime-seeking drag chosen specifically
to avoid both a 4x-content-copy memory cost and a prior Android regression).
The fix had to work inside this, not against it.

**Bug 1 — touch-action was never set, and iOS needed it even though Android
didn't.** `enableMarqueeDrag` (RC-18) drags by seeking the CSS animation's
`currentTime` from `pointermove`, entirely custom JS, no native scrolling
involved. An earlier attempt set `touch-action: pan-x` on the row and it
was reverted for "disturbing Android scrolling" — correctly identified as
a regression, but for a reason that got generalized past what it actually
proved. `pan-x` restricts an element to native HORIZONTAL panning only,
which blocks native VERTICAL panning (the page's own scroll) from working
when a gesture starts on that element — that is specifically why it broke
Android. The fix applied at the time was to remove touch-action entirely,
leaving it unset. That fixed Android but left iOS with no hint at all,
meaning iOS's native gesture recognizer — which decides pan direction at
the compositor level, before JS ever sees pointer events — is free to
independently guess that an ambiguous (part-vertical) touch is a page-scroll
gesture and start moving the page natively, AT THE SAME TIME the JS drag
handler is also seeking the animation. Two systems driving motion from one
gesture is what "can't scroll properly" was. The correct value was `pan-y`
(explicitly keep vertical panning native, reserve everything else for JS)
— the mirror image of `pan-x`, not "no value." Set on `.cards-grid` in both
the base and mobile-breakpoint rule (`styles.css`).

**Bug 2 — Global Safari inherited Continents' memory-management machinery
despite never having Continents' problem.** Measured: Global Safari's 3
rows hold 18 unique images at their already-compressed size, totaling
about 11 MB decoded — nowhere near iOS's ~80-120 MB ceiling, and nothing
like Continents' 7-row, scroll-accumulated case that actually motivated
RC-21/23's park/unpark system. Two consequences of applying it here anyway,
both matching the user's report:
  - Rows 2-3's cold-start `data-src` deferral (RC-21) delayed their first
    load until the observer confirmed proximity — solving decode-queue
    contention that 11 MB total was never going to cause, while producing
    a real, user-visible delay ("coming late... blank until then").
  - The park/unpark cycle (RC-23) added an ongoing hydration/restore timing
    path with nothing worth protecting against on this section — and
    RC-24's investigation (a row stuck at 0 loaded while siblings loaded
    fine) is equally consistent with that timing path itself being the
    defect, not the memory pressure it was built to guard against.
  Fix: rows 2-3's images in `index.html` are eager `src` again (matching
  row 1 — all 24 `data-src` occurrences converted, confirmed nowhere else
  in the codebase before changing). The observer in `script.js` now calls
  `setRowImagesParked` only for `.continent-marquee-track` — Global Safari
  keeps the `.marquee-idle` GPU-layer release (still correct, cheap, and
  unrelated to this) but never has its `src` touched again. The now-dead
  `hydrateRowImages` function and its call site are removed rather than
  left as unused cruft. RC-24's try/catch isolation and periodic sweep are
  untouched and still run across every row — harmless and still useful as
  a genuine-network-failure retry, just with nothing to find on Global
  Safari day to day since there is no data-src or parked src left there.

**Verified against the real `dist/` build:** all 3 Global Safari rows show
24/24 loaded instantly on cold load (no delay, confirmed both via the debug
panel and WebKit automation) and stay that way — no more park/unpark cycle
to interrupt them. Continents' 7 rows behave exactly as before RC-25 (park
on scroll-past, restore on return), confirming the re-scoping did not
touch that page. `touch-action: pan-y` is applied and computed correctly;
dispatched a real horizontal PointerEvent sequence at the row and confirmed
the drag handler still seeks `currentTime` correctly (advances forward on
a leftward drag, matching the documented "drag right pulls earlier content
into view" contract) with the animation staying in `running` state
throughout. Zero console errors, zero broken images, in the full WebKit
suite (`test-webkit.mjs`).

**What this can't verify from here:** whether `pan-y` actually resolves the
gesture-arbitration ambiguity on a real iPhone is inherently something only
real hardware can confirm — `touch-action` is standard, well-supported CSS
(not experimental), and `pan-y` is the textbook-correct value for "JS owns
one axis, native scrolling keeps the other," but simulated PointerEvents
from automation do not exercise the same native compositor-level gesture
recognition a real touchscreen does. This is the next thing to confirm on
a real device: does the row now scroll smoothly, and does starting a
vertical scroll on top of a Global Safari row move the page normally rather
than getting caught by the row.

## RC-26 (2026-08-13) — row 2's reverse direction was fighting the drag handler

User identified, from the live site, that row 2 visually scrolled the
opposite direction from rows 1 and 3, and asked for all three to match.

Re-checking `enableMarqueeDrag` against row 2's reversed keyframe
(`safariMarqueeRight`, a mirror image of `safariMarqueeLeft`) confirmed this
was not only a visual-consistency preference — it was an active bug. The
drag handler seeks the animation with one formula, applied identically
regardless of which keyframe is active:
`currentTime = startTime - dx * (duration / copyWidth)`. For
`safariMarqueeLeft`, increasing `currentTime` moves the track further
negative (left) — a leftward drag increasing `currentTime` therefore moves
the row further in the same direction as the finger, which reads as
correct. `safariMarqueeRight` is the mirror: increasing `currentTime` moves
the track from `-shift` back toward `0`, i.e. right. So the exact same
leftward drag that correctly pushed rows 1 and 3 further left pushed row
2's content the opposite way — same finger movement, opposite on-screen
result depending which row it landed on. That is a real, demonstrable
inconsistency, not just a look-and-feel complaint.

**Fix:** removed the `marquee-reverse` class from row 2 in `index.html`
and deleted the now-unused `@keyframes safariMarqueeRight` /
`.marquee-inner.marquee-reverse` rule from `styles.css` — all three rows
now run the identical `safariMarqueeLeft` keyframe. Continents' own,
separate alternating-direction system (`reverse` class, JS-driven per
continent index) is untouched; this only affects Global Safari's 3 rows,
per the user's stated scope.

**Verified against the real `dist/` build:** all 3 rows' computed
`animation-name` is `safariMarqueeLeft` (no `safariMarqueeRight` remains
anywhere). Dispatched the identical drag gesture (same start/end
coordinates) at all 3 rows independently — all 3 now report the identical
`currentTime` change in the identical direction, where row 2 previously
would have diverged. Zero console errors.

## RC-27/RC-28 (2026-08-13) — the actual mechanism behind "the row ends and goes blank," found by measuring rather than guessing

User reported infinite scroll breaking in both directions ("swipe left...
disappearing") and rows going blank after some time, asking for the
underlying connection to be found rather than another guess. Investigated
by writing tests that sample the real state over time on a real WebKit
run, rather than reasoning about the code in the abstract — and that
surfaced a bug nothing in this project's prior testing had ever caught.

### RC-28 — the primary fix: `--marquee-duration`/`--marquee-shift` going permanently stale

Sampled a row's `track.scrollWidth` against its own `--marquee-shift` CSS
variable at several points after page load, on a real WebKit run, with no
manual interference:

```
t=253ms   trackScrollWidth=660   shift=330px   duration=12.00s
t=564ms   trackScrollWidth=6248  shift=330px   duration=12.00s   <- already wrong
t=3735ms  trackScrollWidth=6248  shift=330px   duration=12.00s   <- still wrong
```

`ensureMarqueeFill`/`tuneMarqueeSpeed` measure the track once, from
`initMarquees`'s one-time setup (or a full viewport resize). Module scripts
are deferred, which only guarantees the DOM is parsed by the time they run
— not that the external stylesheet has finished loading and applying. A
measurement landing in that gap reads unstyled (or partially styled)
layout: dramatically smaller than the track's true, correctly-styled size.
Nothing re-measured to catch up — the RC-19 retry only re-tries a row that
measured EXACTLY zero, which a too-small-but-nonzero unstyled measurement
never triggers, and no viewport resize event fires just because a
stylesheet finished loading after the DOM already had. The result: an
animation trying to represent 3124px of real card content per loop by only
ever translating 330px — a full order of magnitude short. The loop resets
at 330px, far short of any real card boundary, for the entire session. That
mismatch — not a one-off glitch — is the actual seam behind "the row ends
and goes blank," and it explains why it took "some time": the row looks
fine until the animation reaches the (wrong, too-early) loop point.

**Fix:** a `ResizeObserver` directly on each track (`watchMarqueeTrackWidth`
in `script.js`), re-running `ensureMarqueeFill` + `tuneMarqueeSpeed`
whenever the track's own rendered size actually changes, for any reason —
a late stylesheet, a late web font, an image affecting layout, an
orientation change — rather than a fixed list of events assumed to cover
every cause. Applies to every row `initMarquees` sets up, Global Safari and
Continents alike, since both share this exact setup path and are equally
exposed to the same stylesheet-timing race.

**Verified:** re-ran the same sampling script against the fix — the
observer catches the 660px→6248px growth within one frame of it happening
and immediately corrects `--marquee-shift`/`--marquee-duration` to match
(`330px, 12.00s` → `3124px, 78.10s`), then holds stable for the rest of the
session.

### RC-27 — two supporting fixes, so the correction (and manual dragging) is never itself visible

1. **The drag handler now resolves motion could look like disappearing.**
   `enableMarqueeDrag` used to compute `currentTime` from the TOTAL distance
   since the finger first touched the row (`dx = e.clientX - startX`,
   re-read on every move). For a fast real swipe — or a browser
   coalescing/throttling pointermove events under load, which is a
   recurring theme across every RC in this file — a single event can
   deliver a `dx` in the hundreds of pixels, which the duration/copyWidth
   ratio can turn into a jump of several SECONDS of animation position in
   one frame: the track visually snaps to an unrelated part of the loop
   instead of panning, reading as the row disappearing mid-swipe. Fixed to
   track the delta since the LAST move event instead (`stepDx`), which
   bounds every single adjustment to whatever the finger actually moved
   between two consecutive events — it can no longer accumulate into a
   one-shot large jump regardless of gesture speed or event coalescing.

2. **`tuneMarqueeSpeed` now explicitly preserves visual position across any
   duration change.** `currentTime` is an absolute millisecond value;
   changing the CSS duration underneath it without adjusting `currentTime`
   shifts what fraction of the loop that same value represents — a visible
   jump. Before changing `--marquee-duration`, the function now captures
   the current position as a fraction of the OLD duration, then restores
   that same fraction against the NEW duration afterward — defensively,
   rather than trusting a given engine's implicit behavior on a duration
   change, which is exactly the kind of cross-engine inconsistency this
   whole file is full of examples of.

**Verified (after correcting an initial test methodology mistake — directly
poking `--marquee-duration` via `style.setProperty` is an unprotected write
the real code never performs, and gave a false failure the first time
around):** forced a genuine track-width change (real DOM change, not a
direct property write) and confirmed the animation's progress fraction
before and after stays within 0.7-0.9% — no visible jump — while the
duration itself does genuinely change to match the new width.

**New regression test, `test-marquee-tuning.mjs`:** asserts every track's
`--marquee-shift` equals half its actual current `scrollWidth` (the
invariant that silently broke for an entire session before RC-28), and that
a genuine width change never moves the animation's visual position by more
than 2%. Kept as its own file rather than folded into `test-webkit.mjs`
because this bug was invisible to every check already in that suite —
console errors, broken images, and animation play-state all reported clean
the entire time this was wrong.

**What this doesn't fully close out:** sampling `getComputedStyle().transform`
at ~60ms intervals during normal playback showed a stepped rather than
continuous pattern. The best explanation found is that reading a
compositor-driven animation's value from JS doesn't necessarily reflect a
fresh per-frame sync in WebKit (forcing that sync on every read is its own
cost engines avoid), rather than the actual GPU-rendered motion being
choppy — but this is inherently hard to fully settle without a real device
recording actual visual playback rather than JS polling it.

### What's still true after RC-21

- No real iPhone has run this exact build — verification above is a real
  `npm run build` output tested via scripted Chrome automation, not an
  iPhone. The gap this RC closes is "testing the right artifact," not "having
  a real device."
- §7.1's 69 MB peak figure is now a *ceiling*, not a *constant* — Continents
  no longer holds all 7 rows' images at once, so realistic resident memory
  while scrolling is substantially lower, but that hasn't been re-measured
  end-to-end on a real build.
- Phase 2.1 (thumbnail the ~30 non-marquee Continents images) is still
  unstarted.

---

## Table of Contents

1. [Root Cause of the Original iPhone Issue](#1-root-cause-of-the-original-iphone-issue)
2. [Exact Changes Already Made (RC-1 → RC-19)](#2-exact-changes-already-made-rc-1--rc-19)
3. [Before / After Memory Measurements](#3-before--after-memory-measurements)
4. [Marquee Architecture — How It Works Now](#4-marquee-architecture--how-it-works-now)
5. [Safari Compatibility Fixes Applied](#5-safari-compatibility-fixes-applied)
6. [12-Point iPhone Verification Checklist](#6-12-point-iphone-verification-checklist)
7. [Remaining Risks & Failure Modes](#7-remaining-risks--failure-modes)
8. [Implementation Plan — What Still Must Be Done](#8-implementation-plan--what-still-must-be-done)
9. [On-Device Testing Protocol](#9-on-device-testing-protocol)
10. [Files Changed](#10-files-changed)

---

## 1. Root Cause of the Original iPhone Issue

The original iPhone issue had **multiple independent root causes**, not one. They compounded each other, which is why individual fixes appeared to fail — fixing one left the others active.

### 1.1 PRIMARY: Decoded Image Memory Exhaustion (~155 MB → iOS tab ceiling)

| Fact | Detail |
|---|---|
| **What iOS does** | Safari enforces a hard per-tab memory ceiling (~80–120 MB on most iPhones), far below desktop Chrome's limit (~512 MB+) and Android Chrome's (~200–300 MB) |
| **What happens at the ceiling** | iOS Safari **does not crash** — it **discards decoded image bitmaps and composited layer backing stores silently** |
| **What that looks like** | A row keeps its layout height and keeps animating, but paints nothing — a full-height blank area where cards should be, rows "taking turns" appearing |
| **Why it's iPhone-only** | Desktop/Android Chrome has 2–5× the memory budget. Same code, same images, different ceiling. |

**The math:** Every image is stored as a **decoded bitmap at its intrinsic pixel dimensions × 4 bytes per pixel**, regardless of CSS display size. A `1408×768` source photo in a `170×125` mobile card costs **4.13 MB of RAM** — not the 30 KB file size. Across all unique images on both pages: **~155 MB of decoded bitmaps**, well above the iOS ceiling.

### 1.2 SECONDARY: Short-Row Bug (Content runs out before loop wraps)

Each marquee row ships its card set **twice** and the animation translates by one copy (-50%). This only works seamlessly if **one copy is at least as wide as the visible viewport**. Measured:

| Row | One copy width | Viewport width | Result |
|---|---|---|---|
| Antarctica (2 destinations) | 520 px | 1286 px | ❌ Slides out — blank behind it |
| North America (3 destinations) | 780 px | 1286 px | ❌ Same |
| Home Safari Row 3 (desktop) | 1332 px | 1521 px | ❌ Same |

This is **arithmetic, not a rendering bug** — the row literally runs out of cards.

### 1.3 TERTIARY: CPU Saturation on Continents Page

The original `initDraggableMarquees()` drove all **seven** continent rows from a single `requestAnimationFrame` loop:
- 7 DOM writes per frame (`track.style.transform = ...`)
- 7 forced style recalculations per frame
- All on the main thread that is also decoding images and servicing touch
- Result: visible hitching, stuttering, and stalling

### 1.4 QUATERNARY: GPU Layer Pressure

Every marquee track carried `will-change: transform` **permanently** — 10 permanent composited layers (3 home + 7 continents), each a full-width backing store, whether or not the row was anywhere near the viewport. MDN explicitly warns about exactly this: it exhausts GPU memory and iOS Safari's response is to drop layer backing stores.

### 1.5 QUINARY: Various WebKit-specific bugs

- **`backdrop-filter`** without `-webkit-` prefix at 5 locations
- **Filename case mismatches** (Windows case-insensitive → Linux production case-sensitive)
- **Unencoded spaces in filenames** (Chrome auto-encodes, WebKit does not)
- **Lazy loading inside marquees** (Safari's lazy-load intersection doesn't re-evaluate for `transform`-moved content)
- **`translate3d(-50%, ...)` percentage drift** (resolves against `width: max-content` which can change during address bar collapse)

### 1.6 What Was Ruled Out (checked with evidence)

| Hypothesis | Verdict |
|---|---|
| Image file size too large | **No.** All 15 safari cards total 660 KB compressed. File size ≠ decoded memory. |
| Images failing to load (broken URLs) | **No.** All images load with real dimensions in every test. |
| WebP/AVIF format issues | **No.** Not used anywhere in the codebase. |
| Missing `-webkit-` prefixes (as sole cause) | **No.** Fixed, but not sufficient alone. |
| Video playback conflict | **No.** No `<video>` element on the site. |
| Mixed content / non-HTTPS | **No.** All Unsplash refs use explicit `https://`. |

---

## 2. Exact Changes Already Made (RC-1 → RC-19)

| RC | Change | Root Cause Addressed | File(s) |
|---|---|---|---|
| 1–9 | Various rAF `transform` approaches | — (all failed) | `script.js` |
| 10–14 | `overflow-x: auto` scroll container approach | — (caused Android regression) | `styles.css`, `script.js` |
| **15** | **Replaced ALL JS-driven animation with pure CSS `@keyframes` compositor animation** | §1.3 CPU saturation | `styles.css`, `script.js` |
| 16 | Layer promotion for clipping box (`translateZ(0)`) + removed `loading="lazy"` from marquee images | §1.4 layer issues + §1.5 lazy-load | `styles.css`, `script.js` |
| **17** | **`ensureMarqueeFill()` — repeats card set until one copy ≥ viewport width** + **single `IntersectionObserver` to park offscreen rows** + spacing via `margin-right` instead of `gap` | §1.2 short-row + §1.4 GPU pressure + seam stutter | `script.js`, `styles.css` |
| 18 | Drag/swipe restored by seeking CSS animation `currentTime`, not scroll container | Manual scroll UX | `script.js`, `styles.css` |
| **19** | **Card images served from 480px-wide derivatives** (`assets/card-thumbs/`) + **pixel-based `--marquee-shift`** instead of `-50%` + **retry logic for unmeasured rows** | §1.1 memory (the big one) + §1.5 percentage drift + §1.5 layout timing | `script.js`, `styles.css` |

### Design Principles Established (and why)

1. **Failure must be safe.** Rows animate by default in CSS; the `IntersectionObserver` only ever **parks** them. Never the reverse — starting paused would make correct rendering depend on the observer firing, and rebuild the reported bug as the default state.

2. **One owner per property.** Play state is driven only from CSS classes (`.marquee-idle`, `.marquee-dragging`), never mixed with WAAPI `pause()`/`play()`.

3. **No scroll container.** Native `overflow-x: auto` would force ~4 copies per track (~10,000px layer on a phone) and reintroduces snap/momentum/`touch-action` conflicts.

4. **Never claim a vertical gesture.** Drag engages only on `|dx| > 10 && |dx| > |dy|`; no `setPointerCapture`, no `preventDefault`, all listeners passive.

5. **Measure before changing.** Rule adopted after 16 fixes reasoned from symptoms instead of measuring the machine.

---

## 3. Before / After Memory Measurements

All figures from a real browser against the production build.

### 3.1 Decoded Image Memory

| Page | Before (RC-18) | After (RC-19) | Reduction |
|---|---|---|---|
| Continents page (62 unique images) | **155.1 MB** | **57.2 MB** | −63% |
| Home page (18 unique images) | 19.5 MB | 11.7 MB | −40% |
| Hero slideshow (5 CSS backgrounds) | 12.7 MB | 12.7 MB | — (not yet addressed) |
| **Whole tab, both pages visited** | **~175 MB** | **~69 MB** | **−61%** |

### 3.2 Worst Offenders (before fix)

| File | Intrinsic Size | Displayed At | Decoded Memory |
|---|---|---|---|
| `safari-srilanka-leopard.jpg` | 1000×1250 | 170×125 | 4.77 MB |
| `safari-norway-real.jpg` | 1000×1250 | 170×125 | 4.77 MB |
| `turkey.jpg`, `egypt.jpg` | 1408×768 | 170×125 | 4.13 MB each |
| `antarctic-peninsula.jpg` | 1408×768 | 170×125 | 4.13 MB |

### 3.3 After Fix — Card Thumbnails

All safari card images are now 660×440 intrinsic (matching the `width` and `height` attributes in HTML), served from `assets/card-thumbs/safari-cards/`. File sizes range 12–43 KB.

Decoded memory per image: `660 × 440 × 4 = 1.11 MB` (vs 4.13–4.77 MB before).

### 3.4 iPhone Memory Context

| Device | Typical iOS tab ceiling | Our decoded total (after) |
|---|---|---|
| iPhone SE / 8 (2GB RAM) | ~50–80 MB | 69 MB ⚠️ borderline |
| iPhone 11–13 (4GB RAM) | ~80–120 MB | 69 MB ✅ comfortable |
| iPhone 14 Pro+ (6GB RAM) | ~120–180 MB | 69 MB ✅ well within |

> ⚠️ **On 2GB iPhones**, 69 MB is still borderline. Phase 2 (below) should reduce this further.

---

## 4. Marquee Architecture — How It Works Now

### 4.1 DOM Structure

```
section.destinations-container
 └── div.safari-stacked-rows
      ├── div.destination-row-block
      │    └── div.cards-grid (clipping viewport, overflow:hidden, translateZ(0))
      │         └── div.marquee-inner (animated track, width:max-content)
      │              ├── [Set A: 6 article.card elements]
      │              └── [Set B: 6 article.card elements, aria-hidden="true"]
      ├── div.destination-row-block (ROW 2, .marquee-reverse)
      │    └── ...same structure, 6+6 cards...
      └── div.destination-row-block (ROW 3)
           └── ...same structure, 6+6 cards...
```

### 4.2 Animation Mechanism

```
┌─────────────────────────────────────────────────────────────┐
│  CSS @keyframes safariMarqueeLeft / safariMarqueeRight      │
│  from: translate3d(0, 0, 0)                                 │
│  to:   translate3d(calc(-1 * var(--marquee-shift)), 0, 0)   │
│                                                             │
│  Duration: per-row, via --marquee-duration CSS variable      │
│  Timing:   linear infinite                                   │
│  GPU:      will-change: transform + backface-visibility      │
│                                                             │
│  ZERO JavaScript per frame.                                  │
│  Compositor-only. Main thread never touched during motion.   │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 `--marquee-shift` Calculation

Set once by `tuneMarqueeSpeed()` in `script.js`:

```
loopWidth = track.scrollWidth / 2   (= width of one complete card set)
--marquee-shift = Math.round(loopWidth) + 'px'
--marquee-duration = Math.max(12, loopWidth / 40) + 's'  (40 px/s shared speed)
```

**Why pixel distance, not -50%:** A percentage translate resolves against the element's own `width: max-content` border-box width. If that resolution drifts (address bar collapse changing `svh`, orientation change, late reflow), the track no longer travels exactly one copy and a gap shows at the seam.

### 4.4 Fill Logic (`ensureMarqueeFill`)

```
If one card set < viewport width:
  Repeat the set N times until N × set width ≥ viewport width
  Track = N copies (set A) + N copies (set B = aria-hidden duplicate)
  --marquee-shift still = half of total track width
```

### 4.5 Visibility Observer (`IntersectionObserver`)

```
rootMargin: '250px 0px'  (pre-wakes 250px before visible)
threshold: 0

On enter: remove .marquee-idle → animation resumes, will-change: transform restored
On exit:  add .marquee-idle    → animation paused, will-change: auto (releases GPU layer)
```

### 4.6 Drag/Swipe (`enableMarqueeDrag`)

- Seeks the CSS animation's `currentTime` instead of using a scroll container
- Pauses via `.marquee-dragging` CSS class (not WAAPI)
- Engages only when `|dx| > 10 && |dx| > |dy|` (never captures vertical scroll)
- No `setPointerCapture`, no `preventDefault`, all listeners passive
- Infinite in both directions via modular wrapping of `currentTime`

### 4.7 Image Loading Strategy

| Element | `loading` | `decoding` | Rationale |
|---|---|---|---|
| Safari cards (HTML) | — (eager) | `async` | Inside a marquee — Safari lazy-load doesn't re-evaluate for `transform`-moved content |
| Continent cards (JS) | — (eager) | `async` | Same reason |
| Static page images | `lazy` | `async` | Standard lazy loading for non-marquee content |

---

## 5. Safari Compatibility Fixes Applied

| Fix | What It Does | Why Safari Needs It |
|---|---|---|
| `-webkit-backface-visibility: hidden` | Prevents flicker during composited animation | WebKit requires prefix for this property |
| `-webkit-transform: translateZ(0)` on clipping box | Promotes clipping container to its own GPU layer | WebKit fails `max-content` width derivation without it |
| `isolation: isolate` on `.card` | Creates explicit stacking context | WebKit compositor can scramble z-index of absolutely-positioned children after repaint cycles |
| No `backdrop-filter` near animated rows | Removes continuous backdrop re-sampling | `backdrop-filter` forces full-rate re-snapshot of everything behind it — iOS drops sibling layers under that pressure |
| No `loading="lazy"` inside marquees | Ensures all images load eagerly | Safari's lazy-load intersection calculation doesn't re-evaluate for `transform`-moved content |
| No `gap` on flex tracks | Uses `margin-right` for spacing | `gap` puts space between items only, making `-50%` translate land `gap/2` off per iteration |
| Pixel `--marquee-shift` not `%` | Absolute distance from measured DOM | Percentage resolves against derived `width: max-content` which can drift during `svh` changes |
| Explicit heights on rows/tracks | Prevents 0-height collapse | WebKit can fail to derive height from `max-content` flex children |
| `decoding="async"` on all marquee images | Off-main-thread decoding | Prevents synchronous decode from blocking compositor animation |
| Card images at 660×440 intrinsic | Reduces decoded bitmap memory from 4.77 MB to 1.11 MB per image | iOS tab memory ceiling is ~80–120 MB |
| `onerror` fallback to full-size image | Graceful degradation if thumbnail missing | Prevents broken images without JavaScript dependency |

---

## 6. 12-Point iPhone Verification Checklist

> ⚠️ **HONEST STATUS: Items 1–12 below are designed to be executed on a REAL iPhone. They have NOT been tested from a Windows development machine.**

### The Tests

| # | Test | Expected Result | Status |
|---|---|---|---|
| 1 | Open on real iPhone Safari, observe all 3 home rows + all 7 continent rows | All 10 rows continuously scroll | 🔲 Not tested |
| 2a | Observe: no freezing | Smooth continuous motion | 🔲 Not tested |
| 2b | Observe: no jumping | No sudden repositioning at loop point | 🔲 Not tested |
| 2c | Observe: no flickering | No flash/blink during animation | 🔲 Not tested |
| 2d | Observe: no blank gaps | Cards fill the entire row width | 🔲 Not tested |
| 2e | Observe: no image disappearance | All card images visible at all times | 🔲 Not tested |
| 2f | Observe: no sudden repositioning | Seamless loop transition | 🔲 Not tested |
| 2g | Observe: no horizontal page overflow | Page doesn't scroll horizontally | 🔲 Not tested |
| 3 | Verify all 7 continent rows use correct duplicated image set | Each row shows its continent's destinations twice | 🔲 Not tested |
| 4 | Verify `--marquee-shift` matches one complete set width | Console check (see §9.3) | 🔲 Not tested |
| 5 | Confirm `translate3d()` in keyframes | Inspect computed animation | ✅ **Verified in CSS source** (styles.css:625-633, 6047-6055) |
| 6 | Confirm no continuous rAF/setInterval/layout reads | Zero per-frame JS | ✅ **Verified in JS source** (initMarquees runs once per row) |
| 7 | Confirm images have stable dimensions before animation starts | All `<img>` have explicit `width`+`height` attributes | ✅ **Verified in HTML source** (width="660" height="440") |
| 8 | Confirm no console errors on iPhone Safari | Zero errors in Web Inspector | 🔲 Not tested |
| 9 | Confirm no broken images | All `<img>` resolve to valid resources | 🔲 Not tested |
| 10a | Test: cold page load | Rows appear and scroll immediately | 🔲 Not tested |
| 10b | Test: page refresh (hard reload) | Same behavior as cold load | 🔲 Not tested |
| 10c | Test: scrolling down to the marquee | Rows start when scrolled into view | 🔲 Not tested |
| 10d | Test: leaving page and returning | Rows resume correctly | 🔲 Not tested |
| 10e | Test: several minutes continuous scrolling | No degradation over time | 🔲 Not tested |
| 11 | Check iPhone Safari memory/performance | Page does not reload, freeze, or get killed | 🔲 Not tested |
| 12 | Check iOS Chrome as well | Same behavior as Safari (same WebKit engine) | 🔲 Not tested |

### What CAN Be Verified from Source Code (Items 5, 6, 7)

**Item 5 — GPU-friendly `transform: translate3d()`:** ✅ Confirmed.

```css
/* styles.css:625-633 */
@keyframes safariMarqueeLeft {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(calc(-1 * var(--marquee-shift, 50%)), 0, 0); }
}

/* styles.css:6047-6055 */
@keyframes continentMarqueeLeft {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(calc(-1 * var(--marquee-shift, 50%)), 0, 0); }
}
```

No layout properties (`left`, `margin-left`, `width`) are animated anywhere.

**Item 6 — No continuous rAF/setInterval:** ✅ Confirmed.

- `initMarquees()` (script.js:1863) runs **once** per row at init
- `tuneMarqueeSpeed()` (script.js:1635) runs **once** per row
- `ensureMarqueeFill()` (script.js:1706) runs **once** per row
- `enableMarqueeDrag()` (script.js:1782) registers passive event listeners only
- Resize handler (script.js:1931) is debounced to 200ms
- **Zero `requestAnimationFrame` loops**, **zero `setInterval`**, **zero per-frame layout reads**

**Item 7 — Stable image dimensions:** ✅ Confirmed.

All safari card images in `index.html` have explicit `width="660" height="440"` attributes + `object-fit: cover` + fixed flex sizing (`flex: 0 0 170px` mobile / `flex: 0 0 210px` desktop).

---

## 7. Remaining Risks & Failure Modes

### 7.1 HIGH: 69 MB still borderline on 2GB iPhones (iPhone SE/8)

**Risk:** Even after the 61% memory reduction, 69 MB of decoded bitmaps approaches the ~50–80 MB ceiling on older 2GB iPhones.

**Mitigation (Phase 2):** 32 of the 62 Continents page images are outside the marquees (hero slider, other sections) and haven't been converted to thumbnails yet. Extending `generate_card_thumbs.py` to cover them would reduce the total to ~35–40 MB.

### 7.2 MEDIUM: SPA accumulates pages in memory

**Risk:** `isContinentsRendered` keeps the Continents DOM alive after visiting it. Browsing Continents and returning home means the tab carries both pages' images simultaneously.

**Mitigation (Phase 3):** Either drop `isContinentsRendered` and re-render on entry, or null out `img.src` for parked marquee rows when the IntersectionObserver marks them idle.

### 7.3 MEDIUM: 2 Unsplash images without local copies

**Risk:** Two cards in the Safari rows use direct Unsplash URLs:
- Zambia: `https://images.unsplash.com/photo-1666732566977-8805c13a6ce2?...w=660`
- Costa Rica: `https://images.unsplash.com/photo-1623385521692-4a591e66619e?...w=660`

These are requested with `w=660` via Unsplash CDN, so intrinsic size should be ~660px wide — acceptable. But the decoded height depends on Unsplash's aspect ratio crop, and the external dependency adds network latency.

**Mitigation:** Download and serve these locally from `assets/card-thumbs/safari-cards/` with known dimensions.

### 7.4 LOW: Resize or orientation change during animation

**Risk:** `tuneMarqueeSpeed()` runs once at init and on resize (debounced 200ms). An orientation change on iOS can trigger `svh` reflow. The pixel `--marquee-shift` is a measured value, so if the track width changes, the shift becomes stale until the debounced resize handler fires.

**Mitigation:** The 200ms debounced resize handler already covers this. 200ms gap during orientation change is imperceptible.

### 7.5 LOW: `will-change: transform` re-promotion cost

**Risk:** When a row scrolls into the 250px rootMargin zone, it removes `.marquee-idle` which restores `will-change: transform`. Layer re-creation is not free. However, the 250px buffer means this happens well before the row is visible.

**Mitigation:** Already handled by the rootMargin buffer.

### 7.6 CRITICAL LIMITATION: No real iPhone testing performed

> ⚠️ **All analysis is based on source code inspection, memory measurement from desktop Chrome, and reasoning from WebKit documentation. Nothing in this document has been verified on an actual iPhone.** The plan.md established this limitation: "Remote inference has now been wrong repeatedly. Before the next code change, get evidence."

---

## 8. Implementation Plan — What Still Must Be Done

### Phase 1: Real iPhone Testing (BLOCKING — before any more code changes)

| Step | Action | Tool |
|---|---|---|
| 1.1 | Deploy current RC-19 build to Netlify | `git push` |
| 1.2 | Open on real iPhone Safari, hard reload (clear cache first) | iPhone + Safari |
| 1.3 | Run the 12-point checklist from §6 above | Manual observation |
| 1.4 | Photograph results (which rows, blank or partial) | Camera |
| 1.5 | If Mac available: Safari → Develop → connect iPhone → run diagnostic console commands (see §9.3 below) | Mac + Safari Web Inspector |
| 1.6 | Note: does it fail on first load, or only after visiting Continents? (confirms/kills SPA accumulation theory) | Observation |

### Phase 2: Further Memory Reduction (if Phase 1 shows remaining issues)

| Step | Action | Expected Impact | Status |
|---|---|---|---|
| 2.1 | Extend `generate_card_thumbs.py` to cover the 32 non-marquee Continents images (hero slider, other static sections — distinct from the cinematic showcase, which RC-20 already covers) | −30 MB decoded memory | 🔲 Not done |
| 2.2 | Download Zambia/Costa Rica Unsplash images locally at 660×440 | Eliminates external dependency + controlled dimensions | ✅ Done (RC-20) |
| 2.3 | Add `fetchpriority="high"` on the hero LCP image | Stops hero competing with marquee images for bandwidth | ✅ Done (RC-20) |
| 2.4 | Add `<link rel="preconnect" href="https://images.unsplash.com">` in `<head>` | Saves DNS/TLS handshake time | ✅ Done (RC-20) |
| 2.5 | *(not in original plan)* Route the cinematic showcase carousel + Continents search results through `cardThumb()` | −remaining full-size continent images outside the marquees | ✅ Done (RC-20) |

### Phase 3: SPA Memory Accumulation Fix

| Step | Action | Risk |
|---|---|---|
| 3.1 | When IntersectionObserver parks a Continents row (`.marquee-idle`), null out its `img.src` | Eliminates decoded memory for invisible rows |
| 3.2 | Restore `img.src` from `data-full` when row re-enters viewport | Row must not flash blank when scrolling back |
| 3.3 | OR: Drop `isContinentsRendered` flag and re-render on entry | Simpler but re-renders DOM each time |

### Phase 4: Virtualisation (only if Phases 1–3 fail)

| Step | Action |
|---|---|
| 4.1 | Keep only ~8 visible cards per row at any time |
| 4.2 | Recycle card DOM nodes as they scroll out of view |
| 4.3 | Largest change — reserved as last resort |

### Phase 5: CI Regression Guard

| Assertion | Purpose |
|---|---|
| No marquee image wider than 480px intrinsic | Prevent memory regression |
| Every row `halfWidth ≥ rowWidth` | Prevent short-row bug |
| `--marquee-shift` equals half the track width | Prevent seam gap |
| Zero console errors in production build | Prevent broken code shipping |

---

## 9. On-Device Testing Protocol

### 9.1 Pre-Test Setup

```
1. Deploy latest build to production/staging
2. On iPhone: Settings → Safari → Clear History and Website Data
3. Close all Safari tabs
4. Force-quit Safari
5. Re-open Safari, navigate to the site URL
```

### 9.2 Quick Visual Test (no Mac needed)

```
1. Cold load the home page
2. Scroll to "Global Wild Safaris" section
3. Observe all 3 rows for 30 seconds — any blank rows?
4. Photograph any blank row immediately
5. Navigate to Continents page
6. Observe all 7 rows — any blank/frozen?
7. Navigate back to home page
8. Are the 3 home rows still visible? (tests SPA accumulation)
9. Wait 2 minutes on the home page
10. Check again — any rows disappeared?
```

### 9.3 Advanced Diagnostic (Mac + Safari Web Inspector required)

Connect iPhone via USB, open Safari on Mac → Develop → [iPhone name] → select the page tab.

```javascript
// 1. Decoded bitmap MB actually resident
const u = new Map();
[...document.querySelectorAll('img')]
  .filter(i => i.complete && i.naturalWidth > 0)
  .forEach(i => u.set(i.currentSrc, i.naturalWidth * i.naturalHeight * 4 / 1048576));
console.log('decoded MB:', [...u.values()].reduce((a, b) => a + b, 0));

// 2. Per-row diagnostic: is the row starved of content or not painting?
[...document.querySelectorAll('.cards-grid, .continent-marquee-wrapper')].map(r => {
  const t = r.querySelector('.marquee-inner, .continent-marquee-track');
  if (!t) return null;
  return {
    half: t.scrollWidth / 2,
    row: r.getBoundingClientRect().width,
    fills: t.scrollWidth / 2 >= r.getBoundingClientRect().width,
    shift: t.style.getPropertyValue('--marquee-shift'),
    duration: t.style.getPropertyValue('--marquee-duration'),
    state: t.getAnimations()[0]?.playState,
    idle: t.classList.contains('marquee-idle'),
    images: t.querySelectorAll('img').length,
    loaded: [...t.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth > 0).length
  };
});

// 3. Any broken images? (naturalWidth === 0 means failed to decode)
[...document.querySelectorAll('img')]
  .filter(i => i.complete && i.naturalWidth === 0)
  .map(i => i.src);
```

**Interpretation:**
- `half < row` → short-row bug (should not occur after RC-17)
- `half >= row` but blank → dropped backing store → memory pressure
- `loaded < images` → some images failed to load
- `state !== 'running'` → animation not active (check if `.marquee-idle` is set)

### 9.4 Decision Tree After iPhone Test

```
┌─ All 10 rows visible and scrolling smoothly?
│   YES → Document "PASS", update this file
│   NO  → Which rows?
│         ├─ Home Safari rows blank → Check decoded MB
│         │   ├─ > 80 MB  → Execute Phase 2 (more thumbnails)
│         │   └─ < 80 MB  → Check .global-navbar.scrolled backdrop-filter
│         ├─ Continent rows blank → Check decoded MB after navigation
│         │   ├─ SPA accumulated both pages → Execute Phase 3
│         │   └─ Continents alone exceeds limit → Execute Phase 2
│         └─ Rows freeze / jump but images visible → Check --marquee-shift,
│             ensureMarqueeFill, animation state
```

---

## 10. Files Changed

### Modified Files

| File | Changes Made |
|---|---|
| `styles.css` | RC-15: Pure CSS keyframe animations. RC-16: Layer promotion on clipping boxes. RC-17: `.marquee-idle`, `margin-right` instead of `gap`, explicit heights. RC-18: `.marquee-dragging`. Removed `backdrop-filter` from `.destinations-header`. |
| `script.js` | RC-15: Removed all rAF/scrollLeft loops. RC-17: `initMarquees()`, `ensureMarqueeFill()`, `tuneMarqueeSpeed()`, `marqueeTrackIn()`, IntersectionObserver. RC-18: `enableMarqueeDrag()`. RC-19: `cardThumb()`, pixel `--marquee-shift`, retry logic. |
| `index.html` | All 3 safari row images → `assets/card-thumbs/safari-cards/`. Explicit `width="660" height="440"`. `decoding="async"`. `.marquee-inner` track class. Set A/B card duplication. |
| `packagesData.js` | Fixed 5 filename case mismatches. Renamed files with spaces to hyphenated lowercase. |

### New Files

| File | Purpose |
|---|---|
| `assets/card-thumbs/safari-cards/*.jpg` (15 files) | 660×440 thumbnails of all safari card images |
| `assets/card-thumbs/images/*.jpg` | 480px-wide thumbnails of continent card images |
| `assets/card-thumbs/packages-images/*.jpg` | 480px-wide thumbnails of package card images |
| `generate_card_thumbs.py` | Script to regenerate card thumbnails from source images |

### Unchanged (Protected by AGENTS.md rules)

| File | Why Unchanged |
|---|---|
| Desktop CSS (non-mobile rules) | AGENTS.md: desktop is read-only by default |
| All source images in `assets/images/`, `assets/packages-images/` | Originals preserved; thumbnails served as separate files |

---

## Summary: Current State

✅ **Architecturally sound:** Pure CSS compositor animation, zero per-frame JS, pixel-based shift distances, fill logic for short rows, IntersectionObserver for GPU pressure management, passive drag/swipe, no scroll container.

✅ **Memory reduced 61%:** 175 MB → 69 MB decoded image memory via 480px thumbnail derivatives.

⚠️ **Not iPhone-verified:** All work has been done from a Windows development machine. The 12-point checklist has NOT been executed on a real iPhone.

🔲 **Phase 2/3 not yet executed:** Further memory reduction and SPA accumulation fix are designed but not implemented, pending Phase 1 iPhone test results.

> **Next step:** Deploy to Netlify and run the §9 testing protocol on a real iPhone. Photograph results and update this document.
