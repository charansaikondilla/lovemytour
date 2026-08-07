# iPhone / Safari Image Loading — Diagnosis & Fix Plan

**Symptom reported:** Images load fine on Android Chrome and desktop, but error/fail to load on iPhone (Safari) and other iOS browsers (Chrome-iOS, Firefox-iOS, etc. — all iOS browsers are required by Apple to use WebKit under the hood, so "Safari-only" bugs actually hit *every* browser on iPhone).

**Goal:** Fix root causes without touching anything Android/Chrome depends on. Every fix below is a correction to broken/fragile code, not a platform-specific branch — so nothing here can "break Android," it can only stop being fragile everywhere.

---

## Root causes found, ranked by confidence

### 1. Filename case mismatches — highest-impact, must fix
`packagesData.js` (the data powering the **Continents** page marquee) references image files with the wrong capitalization. The actual files on disk are lowercase; the code asks for capitalized versions:

| Referenced in code (`continentsData`) | Actual file on disk |
|---|---|
| `assets/packages-images/Thailand.png` (line 2635) | `thailand.png` |
| `assets/packages-images/Bali.png` (line 2642) | `bali.png` |
| `assets/packages-images/Maldives.png` (line 2645) | `maldives.png` |
| `assets/packages-images/Mauritius.png` (line 2663) | `mauritius.png` |
| `assets/packages-images/Seychelles.png` (line 2664) | `seychelles.png` |

**Why this reads as "iPhone-only":** Windows (your dev machine) and most local dev servers are case-*insensitive*, so this never shows up while you're building. Production static hosts (Netlify, S3, etc.) are case-*sensitive* Linux filesystems — a mismatched-case request 404s there for every visitor, on every device. If it currently looks Android-only, the most likely explanation is that Android/Chrome test devices still have these images **browser-cached from an earlier, correctly-cased deploy**, masking the bug. It will break identically on Android the moment that cache clears. Fix it as a universal bug, not an iOS one.

*(These same destinations — Thailand, Bali, Maldives, etc. — are referenced correctly in lowercase elsewhere in `packagesData.js`, e.g. lines 531, 738, 778, 819, 1048. Only the `continentsData` block used by the Continents-page marquee has the wrong case.)*

**Fix:** Change the 5 references in `continentsData` to lowercase to match the real files. (Renaming the files instead is riskier — other code may already reference the lowercase names correctly.)

---

### 2. Unencoded spaces in filenames — most likely genuinely Safari-specific bug
`packagesData.js` references:
- `assets/images/Antarctic Peninsula.png` (lines 2529, 2540)
- `assets/images/South Shetland Islands.png` (lines 2564, 2575)

These are injected into `<img src="${dest.image}">` via a JS template string at render time (`script.js:1458`). A literal, unencoded space in a URL is technically invalid — Chrome's URL parser (used identically on desktop and Android, since Android Chrome is also Blink) is very forgiving and silently auto-encodes it. WebKit (Safari/iOS) has historically been stricter about this in some contexts, especially for URLs built dynamically in JS rather than typed directly in HTML — this is a plausible source of images that work in Chrome everywhere but intermittently fail only in Safari.

**Fix:** URL-encode spaces as `%20` in the data file (`Antarctic%20Peninsula.png`), or better — rename the actual files to remove spaces (`antarctic-peninsula.png`) and update the 4 references. Renaming is the more robust fix since it removes the entire class of bug rather than papering over one instance.

---

### 3. Missing `-webkit-` prefix on `backdrop-filter` over image overlays
`backdrop-filter` is used without its required `-webkit-backdrop-filter` fallback in 5 places, all of which sit on top of image content (badges/captions overlaying photos):

- `styles.css:837` — `.package-category-badge`
- `styles.css:850` — `.package-duration-badge`
- `styles.css:1985` — mobile-only overlay rule
- `styles.css:2970` — `.detail-badge`
- `styles.css:4707` — `.gallery-caption-badge`

Safari requires the `-webkit-` prefix for `backdrop-filter` even in fairly recent versions; without it, the blur/glass effect on these badges silently fails on iOS. The photo underneath still loads — but a badge sitting on a photo with no blur backing can look broken/unstyled, which reads to a user as "the image is broken" even though only the overlay is affected. Every other `backdrop-filter` use in the codebase already has the `-webkit-` prefix — these 5 are the only gaps.

**Fix:** Add `-webkit-backdrop-filter` alongside `backdrop-filter` at all 5 locations (this is purely additive — no risk to any browser that already works).

---

### 4. iOS Safari's stricter per-tab memory limits vs. a large simultaneous image count
The Continents page marquee duplicates its destination list for a seamless infinite-scroll loop (`script.js:1450-1452`, `fullList = [...destList, ...destList]`). Across 7 continents this puts **88 `<img>` tags** in the DOM at once. iOS Safari enforces much tighter per-tab memory ceilings than desktop/Android Chrome on comparable hardware, and under memory pressure it will silently discard decoded image data, showing grey boxes or broken-image icons — especially compounded by the case-mismatch 404s above, which pile on decode failures at the same time.

**Fix (not urgent on its own, but compounds with #1):** Once the case-mismatch and encoding issues are fixed, re-test on a real iPhone. If image dropout is still visible under scroll, the next step is trimming the duplicate-set size or lazy-mounting the second copy only once the first is fully in view, rather than duplicating all 88 images eagerly.

---

### 5. Inconsistent `loading="lazy"` / `decoding="async"` pairing
Static `<img>` tags across `index.html` consistently pair `loading="lazy" decoding="async"` (53 occurrences). The Continents-marquee image tag generated in `script.js:1458` only has `loading="lazy"` — missing `decoding="async"`. Not a hard failure on its own, but it means these 88 images decode synchronously on the main thread instead of off it, which is a real (if secondary) contributor to jank and the memory/performance picture on lower-memory iPhones.

**Fix:** Add `decoding="async"` to the marquee image template to match the rest of the site.

---

## Ruled out (checked, no evidence found)

- **WebP/AVIF without fallback** — not used anywhere in the codebase. Not the cause.
- **`<video>` hero without `playsinline`** — there is no `<video>` element in the current site; the hero is a CSS `background-image` slideshow. The `"background video"` folder only holds pre-rendered `.jpg` frames, no actual video file. Not the cause.
- **Mixed content / non-HTTPS external images** — all `images.unsplash.com` references use explicit `https://`. Not the cause.

---

## Fix plan, in order

| # | Fix | File(s) | Risk to Android | Effort |
|---|---|---|---|---|
| 1 | Lowercase the 5 mismatched image paths in `continentsData` | `packagesData.js` | None — pure bug fix | 5 min |
| 2 | Rename `Antarctic Peninsula.png` / `South Shetland Islands.png` to hyphenated lowercase, update 4 references | `assets/images/`, `packagesData.js` | None | 10 min |
| 3 | Add `-webkit-backdrop-filter` at the 5 flagged rules | `styles.css` | None — purely additive | 10 min |
| 4 | Add `decoding="async"` to the marquee `<img>` template | `script.js` | None | 2 min |
| 5 | Re-test on a real iPhone; if image dropout persists, revisit marquee duplication strategy | `script.js` | None if implemented carefully | follow-up |

## Faster image loading (local + online), independent of the bug fix

- **`fetchpriority="high"`** on the hero's first/LCP image so it's not competing with the other 87 marquee images for bandwidth.
- **`<link rel="preconnect" href="https://images.unsplash.com">`** in `<head>` — shaves the DNS/TLS handshake off every external Unsplash image, which currently pays that cost cold on first use.
- **Compress local PNGs** — several package images (`Thailand.png`, `Bali.png`, etc.) are PNG where a compressed JPEG or WebP-with-fallback would be significantly smaller for photographic content; PNG is best reserved for graphics/logos with transparency.
- **Cap marquee eagerness** — since all 88 images currently request `loading="lazy"` but sit inside a horizontally-scrolling track, confirm lazy-loading is actually deferring the off-screen duplicate set rather than the browser treating a wide flex track as "all visible."

---

## How to verify the fix actually works on iPhone

Since I can't drive an iPhone directly, once the code changes are made:
1. Open the live/staging URL on an actual iPhone in Safari (not just Chrome-iOS, which shares WebKit but confirm both if available).
2. Hard-reload (not from cache) — hold the reload icon → "Reload Without Content Blockers," or clear Safari's site data first, so you're not seeing a stale cached failure.
3. Visit the Continents page specifically and scroll through Asia and Antarctica/Africa rows — those are exactly the destinations with the bugs above.
4. Re-check Android Chrome afterward to confirm nothing regressed (it shouldn't — none of these fixes are platform-conditional).

---

**Next step:** I can apply fixes #1–#4 right now — they're small, safe, and directly address what was found. Let me know and I'll make the changes.
