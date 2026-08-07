# Love My Tour — Complete Site Pages Inventory

This is a full breakdown of every page/view on the site, how it's structured (this is a single-page app using hash-based routing — there are no separate `.html` files per page), and how visitors reach each one.

---

## 1. Quick Summary

| Metric | Count |
|---|---|
| **Main pages (top-level views)** | **8** |
| **Navbar links (visible in header)** | **4** |
| **Footer-only pages** (not in navbar) | **2** (Careers, Contact) |
| **Destination categories** (Andaman, Goa, Dubai, etc.) | **52** |
| **Individual tour packages** across all categories | **82** |
| **Continents** (in the Continents mega-menu) | **7** |
| **Safari Adventures marquee — unique countries** | **17** |
| **Modal / popup overlays** | **1** (Enquiry Now form) |

> **Note on architecture:** This site is built as a single `index.html` with JavaScript-driven hash routing (`script.js` → `handleRoute()`). There is only one real HTML file — all "pages" below are `<div class="page-view">` sections that show/hide based on the URL hash (e.g. `#about`, `#package/kenya-safari`). This is why the dist folder has one `index.html`, not many.

---

## 2. Main Pages (8 total)

These are the top-level `page-view` sections defined in `index.html` and switched by `handleRoute()` in `script.js`.

| # | Page | URL Hash | In Navbar? | Purpose |
|---|------|----------|:---:|---------|
| 1 | **Home** | `#home` (also default `#`, `#packages`, `#portfolio`, `#pricing`) | ✅ Yes | Hero banner, homepage package grid, Safari Adventures carousel, stats, testimonials |
| 2 | **About Us** | `#about` | ✅ Yes | Company story, Hyderabad & Bahrain office branches, stats counter |
| 3 | **Services** | `#services` | ✅ Yes | List of services offered (flights, visas, custom tours, etc.) |
| 4 | **Contact** | `#contact` | ❌ Footer only | Contact form, office addresses, phone/email, WhatsApp links |
| 5 | **Careers** | `#careers` (+ `#careers/apply` sub-route) | ❌ Footer only | Job openings, perks, hiring process, application form |
| 6 | **Continents (7 Continents Explorer)** | `#continents` (+ `#continents/<name>` sub-routes) | ✅ Yes (dropdown "Continents") | Browse all 7 continents and their destination categories |
| 7 | **Category / Country Listing** | `#category/<id>` or `#country/<id>` | — (reached via links) | Package cards for one destination category (e.g. all Kashmir packages) |
| 8 | **Package Detail** | `#package/<id>` | — (reached via cards) | Full details for a single tour package — itinerary, price, inclusions, WhatsApp enquiry |

---

## 3. Navbar Links (4 visible items)

Exactly what a visitor sees in the header nav bar (`#mainNavLinks`):

| Order | Label | Links To | Notes |
|---|---|---|---|
| 1 | **Home** | `#home` | Default active page |
| 2 | **Continents** | `#continents` | Desktop: mega-dropdown with all 7 continents + quick links to Asia, Africa, Europe, Australia, South America, North America, Antarctica. Mobile: simple link. |
| 3 | **About us** | `#about` | |
| 4 | **Services** | `#services` | |
| — | **Enquire now** (button, not a page) | Opens the Enquiry Modal | This is a CTA button styled like a nav item, not a page link |

**Not in the navbar** (only reachable via footer links or in-page buttons):
- Contact (`#contact`) — footer "Quick Links"
- Careers (`#careers`) — footer "Quick Links" (with a green "Hiring" tag)

---

## 4. Continents Mega-Menu (7 Continents)

Reached by hovering/clicking "Continents" in the navbar:

| Continent | Hash |
|---|---|
| 🌏 Asia | `#continents/asia` |
| 🦁 Africa | `#continents/africa` |
| 🏰 Europe | `#continents/europe` |
| 🦘 Australia | `#continents/australia` |
| 🌎 South America | `#continents/south-america` |
| 🗽 North America | `#continents/north-america` |
| 🐧 Antarctica | `#continents/antarctica` |

Each continent section on the `#continents` page lists its destination categories/countries as cards.

---

## 5. Footer Links — Full List

**Quick Links column:**
| Label | Hash |
|---|---|
| Home Flight Booking | `#home` |
| About Us | `#about` |
| Our Services | `#services` |
| Pricing Plans | `#pricing` (→ resolves to Home) |
| Careers (Hiring tag) | `#careers` |
| Contact Agency | `#contact` |

**Top Destinations column:**
| Label | Hash |
|---|---|
| Andaman & Nicobar | `#category/andaman` |
| Bali Packages | `#category/bali` |
| Dubai Packages | `#category/dubai` |
| Jammu & Kashmir | `#category/kashmir` |
| Maldives Islands | `#category/maldives` |

**Contact Agency column:** office addresses (Hyderabad + Bahrain), phone numbers, email — no page links, just info + WhatsApp/social icons.

---

## 6. Destination Categories & Packages (52 categories / 82 packages)

Every category below is reachable at `#category/<id>` and contains one or more individual tour packages (reachable at `#package/<package-id>`).

| Category | Packages |
|---|:---:|
| Andaman | 4 |
| Kerala | 3 |
| Goa | 2 |
| Himachal | 2 |
| Jammu-Kashmir | 2 |
| **Safari (7 Continents Expeditions)** | **18** |
| **Heritage (Cultural & Heritage Wonders)** | **6** |
| Ladakh | 1 |
| Malaysia | 1 |
| Singapore | 1 |
| Thailand | 1 |
| Sri Lanka | 1 |
| Dubai | 1 |
| Hong Kong | 1 |
| Europe | 1 |
| Bali | 1 |
| Mauritius | 1 |
| Maldives | 1 |
| South Africa | 1 |
| Turkey | 1 |
| Vietnam | 1 |
| Japan | 1 |
| Egypt | 1 |
| Seychelles | 1 |
| Kenya | 1 |
| Tanzania | 1 |
| Rwanda | 1 |
| Uganda | 1 |
| Zimbabwe | 1 |
| Madagascar | 1 |
| Spain | 1 |
| Switzerland | 1 |
| France | 1 |
| Italy | 1 |
| United Kingdom | 1 |
| Greece | 1 |
| Iceland | 1 |
| Norway | 1 |
| Sydney | 1 |
| Melbourne | 1 |
| Australia | 1 |
| New Zealand | 1 |
| Fiji | 1 |
| Brazil | 1 |
| Peru | 1 |
| Argentina | 1 |
| Colombia | 1 |
| United States (USA) | 1 |
| Canada | 1 |
| Mexico | 1 |
| Antarctic Peninsula | 1 |
| South Shetland Islands | 1 |
| **TOTAL** | **82 packages across 52 categories** |

### Safari section detail (18 packages, 17 unique countries)
The homepage's "Global Wild Safaris" marquee carousel covers 17 countries, each with its own dedicated package page: Kenya, Tanzania, South Africa, Botswana, Namibia, Uganda, Zimbabwe, Zambia, Madagascar, Rwanda, Norway, Costa Rica, Brazil, Sri Lanka, Alaska, Australia, Antarctica. (18th package is the "South Africa — Sabi Sands" alternate photo card, same package as Kruger.)

---

## 7. Modals / Overlays (1 total)

| Overlay | ID | Trigger |
|---|---|---|
| **Enquiry Now Modal** | `#enquiryModal` | "Enquire now" nav button, and various "Enquire" CTAs across the site |

---

## 8. Contact & Booking Channels (not pages, but worth listing)

- **WhatsApp direct links** — floating button, package enquiry buttons, chatbot widget, careers apply → all route to `+91 97037 00576`
- **Hyderabad Office** — phone, email (`info@lovemytour.com`)
- **Bahrain Office** — phone (`+973 33545506`), email (`info@lovemytour.com`)

---

## 9. File Structure Reference

| File | Role |
|---|---|
| `index.html` | The entire site — all 8 pages live here as hidden/shown `<div>` sections |
| `script.js` | Routing (`handleRoute`), package rendering, WhatsApp links, forms |
| `packagesData.js` | All 52 categories / 82 packages / 7 continents data |
| `styles.css` | All styling for every page |
| `dist/` | Production build — what you upload to Netlify |

---

*Generated from the current codebase state. If pages/packages are added or removed later, re-generate this file rather than editing counts by hand.*
