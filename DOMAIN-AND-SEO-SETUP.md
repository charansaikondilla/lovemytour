# Connecting www.lovemytour.com + what the SEO/GEO changes actually do

## Part 1 — Connecting the domain (BigRock + GitHub Pages)

The site is live on **GitHub Pages**. A file called `CNAME` (containing
`www.lovemytour.com`) is already in this repo at `public/CNAME`, so every
build automatically includes it — that half is done and needs nothing
further from you.

Two things are left, both outside this codebase — one at BigRock, one on
GitHub:

### 1a. DNS records at BigRock

Log into BigRock → **DNS Management** for `lovemytour.com` → add these
records (delete any conflicting existing A/CNAME records for the same
names first — you can't have two records of the same type on the same
name):

| Type  | Host / Name | Points to                | Purpose |
|-------|-------------|---------------------------|---------|
| CNAME | `www`       | `charansaikondilla.github.io` | Makes `www.lovemytour.com` load the site |
| A     | `@`         | `185.199.108.153`          | Bare `lovemytour.com` (no www) |
| A     | `@`         | `185.199.109.153`          | ↑ same |
| A     | `@`         | `185.199.110.153`          | ↑ same |
| A     | `@`         | `185.199.111.153`          | ↑ same |
| AAAA  | `@`         | `2606:50c0:8000::153`      | IPv6 equivalent |
| AAAA  | `@`         | `2606:50c0:8001::153`      | ↑ same |
| AAAA  | `@`         | `2606:50c0:8002::153`      | ↑ same |
| AAAA  | `@`         | `2606:50c0:8003::153`      | ↑ same |

`@` means "the bare domain itself" in most DNS panels (some call it "root"
or leave the host field empty) — that's what makes `lovemytour.com`
(without `www`) work too, not just `www.lovemytour.com`. The 4 A records
and 4 AAAA records are GitHub Pages' own fixed addresses — the same for
every GitHub Pages site, not specific to this repo.

### 1b. GitHub repo settings

1. Go to `github.com/charansaikondilla/lovemytour` → **Settings** → **Pages**
   (left sidebar).
2. Under "Custom domain", type `www.lovemytour.com` → **Save**.
3. DNS takes anywhere from a few minutes to ~24 hours to propagate. Once it
   has, GitHub automatically issues a free SSL certificate — a checkbox
   labeled **"Enforce HTTPS"** becomes available on that same settings
   page. Tick it once it appears.
4. **How to check propagation without guessing**: use
   [dnschecker.org](https://dnschecker.org), enter `www.lovemytour.com`,
   select "CNAME" — once most locations show `charansaikondilla.github.io`,
   it's propagated. Until then the domain may work in some places/networks
   and not others, which is normal, not an error.

Once both sides are done, `https://www.lovemytour.com/` and
`https://lovemytour.com/` both load the live site directly — no `/lovemytour/`
subpath, since a connected custom domain always serves from its own root.

## Part 2 — What the favicon change did

`assets/favicon.jpeg` (691×613, not square) is now cropped to a centered
square and rendered at the actual sizes browsers use
(`assets/favicons/favicon-16x16.png`, `favicon-32x32.png`,
`apple-touch-icon.png` for iOS, plus 192×192/512×512 for Android "Add to
Home Screen"), replacing the old favicon links that pointed at the full
logo file. Verified in a real browser after building: the favicon loads
with a 200 response and the correct image type, zero console errors, zero
failed requests.

## Part 3 — What the SEO/GEO changes did, and an honest limitation

Added: a canonical URL tag, `robots.txt` (allows all crawlers, including AI
ones like GPTBot/PerplexityBot — nothing is blocked), `sitemap.xml`, Open
Graph + Twitter Card tags (controls how a shared link previews on
WhatsApp/Facebook/Twitter/etc.), and one `TravelAgency` structured-data
(JSON-LD) block with the real business name, address, phone numbers, and
hours already used elsewhere on the site — this is what lets Google (and
increasingly, AI answer engines) understand *what* the business is,
directly, instead of having to guess from page text.

**This used to have a hard limitation — it no longer does.** The site was
originally a hash-routed single-page app (`#continents`, `#about`,
`#services`, ...), and a hash fragment is never sent to the server, so
Google could only ever see one URL (`https://www.lovemytour.com/`) no
matter which section was on screen. Every section collapsed into the same
search result and none could rank on its own.

That's fixed. The site now uses **real address-bar URLs** — see
`routes.js`, which is the single source of truth shared by the client-side
router and the build:

| URL | What it is |
|-----|-----------|
| `/about-us/`, `/services/`, `/contact/`, `/careers/` | main sections |
| `/popular/`, `/popular/<category>/` | popular destinations + the 6 filters |
| `/continents/`, `/continents/<continent>/` | continents index + all 7 |
| `/<destination>-tour-packages/` | every destination (87 of them) |
| `/packages/<package-id>/` | every individual package (117 of them) |

GitHub Pages serves static files only and has no server-side rewriting, so
`generate-routes.mjs` runs after `vite build` and writes a real
`index.html` at every one of those ~225 URLs, each carrying the full live
app plus its own `<title>`, `<meta description>` and `<link rel=canonical>`.
Every URL therefore returns a genuine HTTP 200 with real content — no
redirect stub, no hash, nothing for a crawler to skip. `sitemap.xml` is
generated from the same manifest, so it can't drift out of sync.

Old inbound links still work: `script.js` translates legacy hashes
(`#about`, `#category/thailand`, `#package/xyz`, ...) to their real path on
arrival, and `public/*.html` holds redirect stubs for the pre-Vite URLs
Google still has indexed (`Aboutus.html`, `bali-inner-1.html`, ...).

## Part 4 — Getting Google to actually notice faster

Adding the tags above doesn't by itself make Google crawl sooner — that
needs one manual step only you can do (it requires proving you own the
domain):

1. Go to [Google Search Console](https://search.google.com/search-console),
   add `www.lovemytour.com` as a property (or add it as a "Domain"
   property covering both `www` and non-`www` at once, using a DNS TXT
   record BigRock lets you add — Search Console shows you the exact value
   during setup).
2. Once verified, go to **Sitemaps** in the left sidebar, submit
   `https://www.lovemytour.com/sitemap.xml`.
3. Use **URL Inspection** on `https://www.lovemytour.com/` → **Request
   Indexing** to nudge Google to crawl it right away instead of waiting for
   its normal schedule.

This is the single biggest lever for "Google can see our page" beyond what
code changes alone can do.
