import { destinationsData, continentsData, getPackageById, POPULAR_CATEGORIES, DESTINATION_CATEGORIES } from './packagesData.js';

/* ============================================================================
   WHATSAPP ENQUIRY DELIVERY
   Every website form (hero "Get Quote Now", the "Book Now" enquiry modal and
   the contact-page form) hands its filled-in data straight to WhatsApp as one
   formatted message, so nothing typed on the site is ever lost.
   ========================================================================== */
const WHATSAPP_NUMBER = '919703700576';

/** Reads a field by id and returns its trimmed value ('' if the field is gone). */
function fieldValue(id) {
  const el = document.getElementById(id);
  return el && typeof el.value === 'string' ? el.value.trim() : '';
}

/**
 * Escapes a value for safe insertion into innerHTML. Used specifically for
 * Careers listing data (see renderCareersFromSheet), which — unlike the
 * rest of this file's data (packagesData.js, only editable via a code
 * change) — comes from a Google Sheet reachable through the passcode-
 * protected admin page, so it's treated as untrusted input rather than
 * developer-controlled content.
 */
function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value === null || value === undefined ? '' : String(value);
  return div.innerHTML;
}

/**
 * Builds a structured WhatsApp message and opens the chat.
 * `fields` is an array of [label, value] pairs; empty values are skipped so an
 * optional field left blank never shows up as a dangling label.
 * WhatsApp renders *text* as bold and _text_ as italic.
 */
function sendEnquiryToWhatsApp(heading, fields) {
  const lines = [`*${heading}*`, ''];

  fields.forEach(([label, value]) => {
    const val = (value || '').toString().trim();
    if (val) lines.push(`*${label}:* ${val}`);
  });

  lines.push('', '_Sent from the Love My Tour website_');

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;

  // A synthesised anchor click, not window.open(): it runs inside the submit
  // gesture so no popup blocker stops it, and it avoids the window.open trap
  // where passing 'noopener' makes Chrome return null even on success (which
  // would make a "popup blocked" fallback fire and navigate this tab away).
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/* ============================================================================
   GOOGLE SHEETS LEAD LOGGING
   Fire-and-forget copy of the same enquiry/contact data into a Google Sheet
   (via a Google Apps Script web app — see google-apps-script/Code.gs and
   google-apps-script/SETUP.md), with an email notification sent from the
   script. This is entirely ADDITIVE to the WhatsApp flow above: it never
   calls preventDefault, never blocks or delays the WhatsApp redirect, and
   never surfaces a success/failure state to the visitor, so a problem here
   can never break the one channel that already works.
   ========================================================================== */
// Paste the deployed Apps Script "Web app URL" here (ends in /exec) — see
// google-apps-script/SETUP.md step 7. Left as a placeholder, sendToGoogleSheets
// is a safe no-op below, so the site behaves exactly as before until this is set.
const SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyWCwbzX8-49ocuLPNONLapZNivb6fU5vUewliuKh2YULerkOE7_5CZCgUo-ltU0Qv9/exec';

// Careers listings use their own separate Apps Script web app deployment
// (see google-apps-script/SETUP.md section 6), so this is intentionally a
// different URL from SHEETS_WEBAPP_URL above. Verified live: responds
// correctly to a plain fetch() GET for both the health check and
// ?action=careers, with no CORS issues.
const CAREERS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwUNSav4CQaJMg-H2NohOmxW6c8E2zLzAlpKHgTYaaU8-XFBMSJBQPJJyShoD3U7dMI/exec';

/**
 * Best-effort POST of `data` to the Apps Script web app. `formType` selects
 * which sheet tab the row is written to server-side ('enquire' or 'contact').
 *
 * Content-Type is deliberately 'text/plain', not 'application/json': Apps
 * Script web apps only implement doGet/doPost, not doOptions, so a JSON
 * Content-Type would make the browser send a CORS preflight OPTIONS request
 * first, which Apps Script has no handler for and would fail. text/plain
 * keeps this a CORS "simple request" (no preflight), and the JSON body is
 * still parsed correctly server-side via JSON.parse(e.postData.contents).
 *
 * mode: 'no-cors' is required because Apps Script never returns an
 * Access-Control-Allow-Origin header — without it the browser would block
 * the response outright. The trade-off is an opaque response we can't read,
 * which is fine: this function never reports success/failure to the caller.
 */
function sendToGoogleSheets(formType, data) {
  if (!SHEETS_WEBAPP_URL || SHEETS_WEBAPP_URL.indexOf('PASTE_YOUR_') === 0) return;
  try {
    fetch(SHEETS_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        formType,
        ...data,
        pageUrl: window.location.href
      })
    }).catch(() => { });
  } catch (err) {
    // Never let a logging failure surface anywhere near the user.
  }
}

/**
 * Labels which on-page trigger opened the shared enquiry modal, purely from
 * context already available on the clicked element — no new form field.
 * Every .open-enquiry-btn sitewide funnels into the same #enquiryForm, so
 * this is the only way to tell them apart in the Sheet's Source column.
 */
function classifyEnquirySource(trigger) {
  if (trigger.closest('.nav-cta')) return 'Navbar — Enquire Now';
  if (trigger.closest('.mobile-hero-book-btn')) return 'Hero — Book Now';
  if (trigger.closest('.plan-btn')) {
    return 'Pricing Section — ' + (trigger.getAttribute('data-package') || 'Plan');
  }
  if (trigger.closest('.cyan-book-btn')) return 'Package Detail Page — Book Now';
  return 'Website — General Enquiry';
}

/** Small non-blocking confirmation — replaces the old blocking alert() calls. */
let enquiryToastTimer = null;
function showEnquiryToast(message) {
  let toast = document.getElementById('enquiryToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'enquiryToast';
    toast.className = 'enquiry-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  // Restart the animation cleanly on repeat submissions
  toast.classList.remove('visible');
  void toast.offsetWidth;
  toast.classList.add('visible');
  clearTimeout(enquiryToastTimer);
  enquiryToastTimer = setTimeout(() => toast.classList.remove('visible'), 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. HERO BACKGROUND PHOTO SLIDESHOW (same crossfade animation as the 7 Continents hero)
  function initHomeHeroSlider() {
    const slides = document.querySelectorAll('.home-hero-slide');
    if (!slides || slides.length < 2) return;

    // NOTE: do NOT gate the slideshow on prefers-reduced-motion. Windows reports
    // "reduce" whenever Settings > Accessibility > Visual effects > Animation
    // effects is off, which is common, and bailing here left the hero stuck on a
    // single frozen image. Reduced motion is handled in styles.css instead, where
    // it drops the zoom/pan (the part that actually causes motion discomfort) and
    // keeps the cross-fade, which is opacity only.

    // Slide 1 ships with its background inline. Slides 2-6 only get their image
    // once .slides-ready is set (see styles.css), which happens after the page has
    // finished loading — fast first paint and no upfront image cost on mobile.
    const slider = document.querySelector('.home-hero-bg-slider');
    const locationBox = document.getElementById('homeHeroLocation');
    const locationText = locationBox && locationBox.querySelector('.home-hero-location-text');
    let currentSlide = 0;

    // Swap the caption at the midpoint of the 0.7s crossfade so the name changes
    // with the picture rather than ahead of it.
    let captionTimer = null;

    // Hero message rotator: panel 1 (the 7 Continents copy) is on screen first,
    // panel 2 (Book Your Next Adventure + Book Now) takes over on the next photo
    // 3s later, and from there they keep alternating — so the text always changes
    // together with the image behind it.
    const heroPanels = document.querySelectorAll('#heroRotator .hero-rotator-panel');
    let currentPanel = 0;

    function advanceHeroText() {
      if (heroPanels.length < 2) return;
      heroPanels[currentPanel].classList.remove('active');
      heroPanels[currentPanel].setAttribute('aria-hidden', 'true');
      currentPanel = (currentPanel + 1) % heroPanels.length;
      heroPanels[currentPanel].classList.add('active');
      heroPanels[currentPanel].removeAttribute('aria-hidden');
    }

    function setLocation(slide) {
      if (!locationBox || !locationText) return;
      const name = slide.dataset.location;
      if (!name) return;
      clearTimeout(captionTimer);
      locationBox.classList.add('swapping');
      captionTimer = setTimeout(() => {
        locationText.textContent = name;
        locationBox.classList.remove('swapping');
      }, 250);
    }

    function startSlideshow() {
      if (slider) slider.classList.add('slides-ready');

      // Reading the computed style resolves whatever URL the CSS actually used
      // (Vite rewrites these to hashed filenames in the build), so the images can
      // be warmed from JS without hard-coding any path.
      const warm = [];
      slides.forEach((slide) => {
        const bg = window.getComputedStyle(slide).backgroundImage;
        const match = /url\(["']?(.*?)["']?\)/.exec(bg || '');
        if (match && match[1]) {
          const img = new Image();
          img.src = match[1];
          warm.push(img);
        }
      });

      let started = false;

      // 3s per slide, overlapped by the 0.7s crossfade. The Ken Burns zoom in
      // styles.css runs continuously and only pauses off screen, so whichever
      // image is showing is always still drifting.
      function begin() {
        if (started) return;
        started = true;
        setInterval(() => {
          slides[currentSlide].classList.remove('active');
          currentSlide = (currentSlide + 1) % slides.length;
          slides[currentSlide].classList.add('active');
          setLocation(slides[currentSlide]);
          advanceHeroText();
        }, 3000);
      }

      // Hold the fast rotation until the second image has decoded, so a slow
      // connection can never flash an empty frame. Capped so it always starts.
      const second = warm[1];
      if (second && !second.complete) {
        second.addEventListener('load', begin, { once: true });
        second.addEventListener('error', begin, { once: true });
      } else {
        begin();
      }
      setTimeout(begin, 1500);
    }

    if (document.readyState === 'complete') {
      startSlideshow();
    } else {
      window.addEventListener('load', startSlideshow, { once: true });
    }
  }
  initHomeHeroSlider();

  // 1.2 (removed) Legacy scroll-driven canvas/cloud hero effects - the hero now uses a
  //     plain crossfade photo slideshow, so no scroll-linked background work is needed.

  // 1.3 SAFARI CAROUSEL — RC-15 FIX: there is deliberately no JavaScript here
  //     any more. The three Global Safari rows are animated entirely by a CSS
  //     @keyframes transform on .marquee-inner (see styles.css, "RC-15 FIX"),
  //     which runs on the compositor: no per-frame JS, no per-frame layout
  //     reads, no scroll position to conflict with. Every JS-driven version
  //     of this (rAF writing `transform`, then rAF writing `scrollLeft`)
  //     failed on real iPhones in a way that could not be reproduced or
  //     debugged remotely, so the mechanism itself was removed rather than
  //     patched again. The cards stay clickable via the delegated
  //     `.view-package-trigger` handler further down this file.
  //
  //     RC-17: still no per-frame JavaScript. initMarquees() below runs once
  //     to measure each row's duration and register it with the shared
  //     IntersectionObserver that releases a row's GPU layer while it is far
  //     offscreen. The rows animate by default in CSS, so if this call (or
  //     the observer) never runs, the rows still scroll — it is an
  //     optimisation, never a prerequisite for them rendering.
  initMarquees();

  // 1.4 HERO COUNTRY SEARCH — type a country, jump straight to its package page.
  // Builds its index straight from packagesData.js so every category added
  // there (and every continent it's tagged under) shows up automatically.
  function initCountrySearch() {
    const box = document.getElementById('countrySearchBox');
    const form = document.getElementById('countrySearchForm');
    const input = document.getElementById('countrySearchInput');
    const resultsList = document.getElementById('countrySearchResults');
    if (!box || !form || !input || !resultsList) return;

    // continent lookup so each result can show "Asia", "Africa", etc. as a subtitle
    const continentByDestId = {};
    Object.values(continentsData).forEach(cont => {
      (cont.destinations || []).forEach(dest => {
        continentByDestId[dest.id] = cont.name;
      });
    });

    const FLAGS = {
      thailand: '🇹🇭', singapore: '🇸🇬', malaysia: '🇲🇾', vietnam: '🇻🇳', japan: '🇯🇵',
      srilanka: '🇱🇰', dubai: '🇦🇪', bali: '🇮🇩', andaman: '🇮🇳', kerala: '🇮🇳',
      maldives: '🇲🇻', turkey: '🇹🇷', egypt: '🇪🇬', 'south-africa': '🇿🇦', kenya: '🇰🇪',
      tanzania: '🇹🇿', rwanda: '🇷🇼', uganda: '🇺🇬', zimbabwe: '🇿🇼', mauritius: '🇲🇺',
      seychelles: '🇸🇨', madagascar: '🇲🇬', spain: '🇪🇸', switzerland: '🇨🇭', france: '🇫🇷',
      italy: '🇮🇹', uk: '🇬🇧', greece: '🇬🇷', iceland: '🇮🇸', norway: '🇳🇴',
      sydney: '🇦🇺', melbourne: '🇦🇺', 'australia-country': '🇦🇺', 'new-zealand': '🇳🇿',
      fiji: '🇫🇯', brazil: '🇧🇷', peru: '🇵🇪', argentina: '🇦🇷', colombia: '🇨🇴',
      usa: '🇺🇸', canada: '🇨🇦', mexico: '🇲🇽', 'antarctic-peninsula': '🇦🇶',
      'south-shetland': '🇦🇶', himachal: '🇮🇳', kashmir: '🇮🇳', ladakh: '🇮🇳',
      'hong-kong': '🇭🇰', goa: '🇮🇳', 'north-america': '🌎', safari: '🦁', heritage: '🏛️'
    };

    // Build the searchable index from packagesData.js categories.
    // Route: '#category/<id>'
    const index = Object.keys(destinationsData)
      .filter(id => id !== 'safari' && id !== 'heritage') // multi-country umbrellas, not real single countries
      .map(id => {
        const cat = destinationsData[id];
        const cleanName = (cat.title || id).replace(/\s+Packages$/i, '');
        return {
          id,
          route: 'category',
          name: cleanName,
          sub: continentByDestId[id] || '',
          flag: FLAGS[id] || '🌍'
        };
      });

    // A handful of countries only exist as an individual Safari package, not
    // as their own top-level category (Botswana, Namibia, Zambia, Costa Rica,
    // India, Alaska, Antarctica) — without this, searching those countries
    // returned nothing. Route: '#package/<id>'.
    const SAFARI_ONLY_COUNTRIES = [
      { id: 'africa-botswana-safari', name: 'Botswana', flag: '🇧🇼' },
      { id: 'africa-namibia-safari', name: 'Namibia', flag: '🇳🇦' },
      { id: 'africa-zambia-safari', name: 'Zambia', flag: '🇿🇲' },
      { id: 'centralamerica-costarica-safari', name: 'Costa Rica', flag: '🇨🇷' },
      { id: 'asia-india-tiger-safari', name: 'India', flag: '🇮🇳' },
      { id: 'northamerica-alaska-grizzly-safari', name: 'Alaska', flag: '🇺🇸' },
      { id: 'antarctica-penguin-polar-safari', name: 'Antarctica', flag: '🇦🇶' },
    ];
    SAFARI_ONLY_COUNTRIES.forEach(entry => {
      index.push({
        id: entry.id,
        route: 'package',
        name: entry.name,
        sub: 'Safari Adventure',
        flag: entry.flag
      });
    });

    let activeIndex = -1;

    function closeResults() {
      resultsList.hidden = true;
      resultsList.innerHTML = '';
      input.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
    }

    function goToCountry(entry) {
      closeResults();
      input.value = '';
      window.location.hash = `#${entry.route}/${entry.id}`;
    }

    function renderResults(matches, query) {
      resultsList.innerHTML = '';

      if (!matches.length) {
        const li = document.createElement('li');
        li.className = 'country-search-no-match';
        li.textContent = `No destination found for "${query}" — try another spelling or browse Continents.`;
        resultsList.appendChild(li);
        resultsList.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        return;
      }

      matches.slice(0, 8).forEach((entry, i) => {
        const li = document.createElement('li');
        li.className = 'country-search-result-item' + (i === activeIndex ? ' active' : '');
        li.setAttribute('role', 'option');
        li.innerHTML = `<span class="country-search-result-flag">${entry.flag}</span>
          <span class="country-search-result-text"><span>${entry.name}</span>${entry.sub ? `<span class="result-sub">${entry.sub}</span>` : ''}</span>`;
        li.addEventListener('mousedown', (e) => {
          e.preventDefault();
          goToCountry(entry);
        });
        resultsList.appendChild(li);
      });

      resultsList.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    function getMatches(query) {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return index.filter(entry => entry.name.toLowerCase().includes(q));
    }

    input.addEventListener('input', () => {
      activeIndex = -1;
      const matches = getMatches(input.value);
      if (!input.value.trim()) { closeResults(); return; }
      renderResults(matches, input.value.trim());
    });

    input.addEventListener('keydown', (e) => {
      const items = resultsList.querySelectorAll('.country-search-result-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        items.forEach((it, i) => it.classList.toggle('active', i === activeIndex));
        items[activeIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        items.forEach((it, i) => it.classList.toggle('active', i === activeIndex));
        items[activeIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Escape') {
        closeResults();
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const matches = getMatches(input.value);

      // Enter with a highlighted suggestion picks that one; otherwise the
      // closest/first text match; if there's genuinely nothing, do nothing
      // (no error, no dead navigation) and keep the "no match" message shown.
      if (activeIndex >= 0 && matches[activeIndex]) {
        goToCountry(matches[activeIndex]);
      } else if (matches.length) {
        goToCountry(matches[0]);
      } else {
        renderResults([], input.value.trim());
      }
    });

    document.addEventListener('click', (e) => {
      if (!box.contains(e.target)) closeResults();
    });
  }
  initCountrySearch();


  // Delegated click handler for view-package-trigger cards
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.view-package-trigger');
    if (trigger) {
      const packageId = trigger.getAttribute('data-package-id');
      if (packageId) {
        e.preventDefault();
        window.location.hash = `#package/${packageId}`;
      }
    }
  });

  // 1.5 NAVBAR TRANSPARENT TO SCROLLED TRANSITION
  const globalNavbar = document.querySelector('.global-navbar');

  function handleNavbarScroll() {
    if (!globalNavbar) return;
    // Navbar activates (.scrolled state) after initial scroll on mobile/desktop
    const threshold = window.innerWidth <= 900 ? (window.innerHeight * 0.6) : 20;
    if (window.scrollY > threshold) {
      globalNavbar.classList.add('scrolled');
    } else {
      globalNavbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Mobile Hamburger Drawer Toggle Handler
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mainNavLinks = document.getElementById('mainNavLinks');

  if (mobileToggleBtn && mainNavLinks) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mainNavLinks.classList.toggle('active');
      mainNavLinks.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!mainNavLinks.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        mainNavLinks.classList.remove('active');
        mainNavLinks.classList.remove('mobile-open');
      }
    });
  }

  // 2. ROUTER & PAGE SWITCHING MECHANISM
  const pageViews = {
    home: document.getElementById('home-view'),
    about: document.getElementById('about-view'),
    services: document.getElementById('services-view'),
    contact: document.getElementById('contact-view'),
    careers: document.getElementById('careers-view'),
    category: document.getElementById('category-view'),
    packageDetail: document.getElementById('package-detail-view'),
    continents: document.getElementById('continents-view'),
    popular: document.getElementById('popular-view')
  };

  const navLinks = document.querySelectorAll('.nav-links .nav-item');

  function handleRoute() {
    const hash = window.location.hash || '#home';

    // Hide all views first
    Object.values(pageViews).forEach(view => {
      if (view) view.classList.remove('active');
    });

    // Reset navbar active highlights
    navLinks.forEach(link => link.classList.remove('active'));

    // Jump to the top instantly — the new view fades in from there (see .page-view.active).
    // A smooth scroll here would fight the fade and flash the middle of the new page.
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (hash === '#home' || hash === '' || hash.startsWith('#packages') || hash.startsWith('#portfolio') || hash.startsWith('#pricing')) {
      if (pageViews.home) pageViews.home.classList.add('active');
      const homeLink = document.querySelector('.nav-link-home');
      if (homeLink) homeLink.classList.add('active');
      renderHomepagePackages('all');
    }
    else if (hash === '#about') {
      if (pageViews.about) pageViews.about.classList.add('active');
      const aboutLink = document.querySelector('.nav-link-about');
      if (aboutLink) aboutLink.classList.add('active');
    }
    else if (hash === '#services') {
      if (pageViews.services) pageViews.services.classList.add('active');
      const servicesLink = document.querySelector('.nav-link-services');
      if (servicesLink) servicesLink.classList.add('active');
    }
    else if (hash === '#contact') {
      if (pageViews.contact) pageViews.contact.classList.add('active');
      const contactLink = document.querySelector('.nav-link-contact');
      if (contactLink) contactLink.classList.add('active');
    }
    // Careers is reached from the footer, so there is no navbar link to highlight.
    // #careers/apply jumps straight to the application form.
    else if (hash === '#careers' || hash.startsWith('#careers/')) {
      if (pageViews.careers) pageViews.careers.classList.add('active');
      renderCareersFromSheet();

      if (hash === '#careers/apply') {
        setTimeout(() => {
          const form = document.getElementById('careersApplyForm');
          if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
    else if (hash === '#continents' || hash.startsWith('#continents/')) {
      if (pageViews.continents) pageViews.continents.classList.add('active');
      const continentsLink = document.querySelector('.nav-link-packages');
      if (continentsLink) continentsLink.classList.add('active');
      renderContinentsView();

      if (hash.includes('/')) {
        const targetId = hash.replace('#continents/', '').trim();
        setTimeout(() => {
          const el = document.getElementById(`continent-${targetId}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
    else if (hash === '#popular' || hash.startsWith('#popular/')) {
      if (pageViews.popular) pageViews.popular.classList.add('active');
      const popularLink = document.querySelector('.nav-link-popular');
      if (popularLink) popularLink.classList.add('active');
      const catKey = hash.includes('/') ? hash.replace('#popular/', '').trim() : '';
      renderPopularView(catKey);
    }
    else if (hash.startsWith('#category/') || hash.startsWith('#country/')) {
      const targetId = hash.replace('#category/', '').replace('#country/', '').trim();
      if (pageViews.packageDetail) pageViews.packageDetail.classList.add('active');
      renderPackageDetailView(targetId);
    }
    else if (hash.startsWith('#package/')) {
      const packageId = hash.replace('#package/', '').trim();
      if (pageViews.packageDetail) pageViews.packageDetail.classList.add('active');
      renderPackageDetailView(packageId);
    }
    else {
      if (pageViews.home) pageViews.home.classList.add('active');
    }

    // Close mobile drawer on route change
    const mainNavLinks = document.getElementById('mainNavLinks');
    if (mainNavLinks) mainNavLinks.classList.remove('mobile-open');
  }

  // Declared here (before the initial handleRoute() call below) because a
  // direct load on a #continents URL invokes renderContinentsView() before
  // script execution would otherwise reach this flag's original position —
  // a `let` declared later throws (temporal dead zone) if a hoisted function
  // reads it that early.
  let isContinentsRendered = false;

  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // initial trigger

  // 3. HOMEPAGE DYNAMIC PACKAGES RENDERER
  function renderHomepagePackages(filterTag = 'all') {
    const grid = document.getElementById('homepagePackagesGrid');
    if (!grid) return;

    let allPackagesList = [];
    for (const catKey in destinationsData) {
      destinationsData[catKey].packages.forEach(pkg => {
        allPackagesList.push({
          ...pkg,
          categoryName: destinationsData[catKey].title,
          categoryType: destinationsData[catKey].category.toLowerCase()
        });
      });
    }

    let filtered = allPackagesList;
    if (filterTag === 'domestic') {
      filtered = allPackagesList.filter(p => p.categoryType === 'domestic');
    } else if (filterTag === 'international') {
      filtered = allPackagesList.filter(p => p.categoryType === 'international');
    } else if (filterTag === 'special') {
      filtered = allPackagesList.filter(p => p.categoryType === 'special');
    }

    grid.innerHTML = filtered.map(pkg => `
      <article class="package-card" data-category="${pkg.categoryType}">
        <div class="package-image-box">
          <img src="${pkg.image}" alt="${pkg.title}" class="package-img" onerror="this.onerror=null; this.src='assets/packages-images/Andaman.jpg';" />
          <span class="package-category-badge">${pkg.tag || pkg.categoryType}</span>
          <span class="package-duration-badge">${pkg.duration}</span>
        </div>
        <div class="package-body">
          <span class="package-location">${pkg.categoryName}</span>
          <h3 class="package-title">${pkg.title}</h3>
          <div class="package-features">
            ${(pkg.highlights || []).slice(0, 3).map(h => `<span class="feature-pill">${h}</span>`).join('')}
          </div>
          <div class="package-footer">

            <a href="#package/${pkg.id}" class="book-btn">View Details</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Filter tabs event listeners
  const filterBtns = document.querySelectorAll('.filter-tabs .tab-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderHomepagePackages(filter);
    });
  });

  // 4. CATEGORY VIEW RENDERER (ALL PACKAGES & CATEGORIES HANDLER)
  function renderCategoryView(categoryId) {
    const headerContainer = document.getElementById('categoryHeaderContainer');
    const packagesGrid = document.getElementById('categoryPackagesGrid');
    if (!headerContainer || !packagesGrid) return;

    let title = "Holiday Packages";
    let categoryTag = "All Packages";
    let description = "Explore our complete collection of domestic, international, and luxury special tour packages.";
    let packagesList = [];

    if (categoryId === 'all' || categoryId === '' || categoryId === 'packages') {
      title = "All Tour Packages";
      categoryTag = "All Destinations";
      description = "Browse all 31+ curated domestic, international, and luxury special packages from Love My Tour.";
      for (const key in destinationsData) {
        const cat = destinationsData[key];
        (cat.packages || []).forEach(pkg => {
          packagesList.push({
            ...pkg,
            catTitle: cat.title
          });
        });
      }
    }
    else if (categoryId === 'domestic') {
      title = "Domestic Tour Packages";
      categoryTag = "India Destinations";
      description = "Explore breathtaking Indian destinations from Kerala backwaters and Goa beaches to Kashmir snow valleys and Leh-Ladakh mountain passes.";
      for (const key in destinationsData) {
        const cat = destinationsData[key];
        if (cat.category === 'Domestic') {
          (cat.packages || []).forEach(pkg => {
            packagesList.push({ ...pkg, catTitle: cat.title });
          });
        }
      }
    }
    else if (categoryId === 'international') {
      title = "International Tour Packages";
      categoryTag = "Outbound Vacations";
      description = "Fly overseas to Dubai, Singapore, Malaysia, Thailand, Sri Lanka, Hong Kong, Europe, Vietnam, and Japan with custom itineraries.";
      for (const key in destinationsData) {
        const cat = destinationsData[key];
        if (cat.category === 'International') {
          (cat.packages || []).forEach(pkg => {
            packagesList.push({ ...pkg, catTitle: cat.title });
          });
        }
      }
    }
    else if (categoryId === 'special') {
      title = "Special & Luxury Packages";
      categoryTag = "VIP & Honeymoon Specials";
      description = "Experience pure paradise with overwater villas in Maldives, private pool villas in Bali, Kruger safaris, Mauritius cruises, Egypt pyramids & Seychelles beaches.";
      for (const key in destinationsData) {
        const cat = destinationsData[key];
        if (cat.category === 'Special') {
          (cat.packages || []).forEach(pkg => {
            packagesList.push({ ...pkg, catTitle: cat.title });
          });
        }
      }
    }
    else if (destinationsData[categoryId]) {
      const catData = destinationsData[categoryId];
      title = catData.title;
      categoryTag = `${catData.category} Destination`;
      description = catData.description;
      packagesList = (catData.packages || []).map(pkg => ({ ...pkg, catTitle: catData.title }));
    }
    else {
      headerContainer.innerHTML = `
        <div class="page-hero-banner">
          <h1 class="page-title">Destination Not Found</h1>
          <p class="page-subtitle">Please select a valid tour destination package from our navigation dropdown menu.</p>
          <a href="#category/all" class="nav-cta" style="display:inline-block; margin-top:16px;">View All Packages</a>
        </div>
      `;
      packagesGrid.innerHTML = '';
      return;
    }

    headerContainer.innerHTML = `
      <div class="page-hero-banner">
        <span class="page-tag">${categoryTag}</span>
        <h1 class="page-title">${title}</h1>
        <p class="page-subtitle">${description}</p>
      </div>
    `;

    packagesGrid.innerHTML = packagesList.map(pkg => `
      <article class="package-card">
        <div class="package-image-box">
          <img src="${pkg.image}" alt="${pkg.title}" class="package-img" onerror="this.onerror=null; this.src='assets/packages-images/Andaman.jpg';" />
          <span class="package-category-badge">${pkg.tag || 'Popular'}</span>
          <span class="package-duration-badge">${pkg.duration}</span>
        </div>
        <div class="package-body">
          <span class="package-location">${pkg.catTitle || title}</span>
          <h3 class="package-title">${pkg.title}</h3>
          <div class="package-features">
            ${(pkg.highlights || []).slice(0, 3).map(h => `<span class="feature-pill">✦ ${h}</span>`).join('')}
          </div>
          <div class="package-footer">

            <a href="#package/${pkg.id}" class="book-btn">View Details</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  // 5. RICH EDITORIAL COUNTRY DESTINATION DETAIL VIEW (DIRECT WHATSAPP LINK 919703700576)
  function renderPackageDetailView(packageId) {
    const container = document.getElementById('packageDetailContainer');
    if (!container) return;

    const pkg = getPackageById(packageId);

    // The full-bleed layout removes the wrapper's page padding. The not-found
    // notice still wants that padding, so the class is cleared first.
    container.classList.remove('is-fullbleed');

    if (!pkg) {
      container.innerHTML = `
        <div class="page-hero-banner">
          <h1 class="page-title">Destination Page Not Found</h1>
          <p class="page-subtitle">We couldn't find the requested country destination. Please select a valid destination from our catalog.</p>
          <a href="#continents" class="nav-cta" style="display:inline-block; margin-top:20px;">Explore Continents</a>
        </div>
      `;
      return;
    }

    // Every package now uses the full-bleed editorial layout.
    container.classList.add('is-fullbleed');
    renderFullbleedDetail(pkg, container);
  }

  // ==========================================================================
  // FULL-BLEED EDITORIAL DETAIL PAGE
  // Edge-to-edge bands, full-screen opening image, no pricing anywhere.
  // All copy comes verbatim from packagesData.js — nothing is reworded here.
  // ==========================================================================
  function renderFullbleedDetail(pkg, container) {
    const cat = pkg.categoryObj || {};
    const categoryTitle = cat.title || pkg.title;
    const whatsappUrl = `https://wa.me/919703700576?text=Hi,%20I%20am%20asking%20about%20${encodeURIComponent(pkg.title)}%20package`;

    // Hero art direction override. The image assigned to this package in
    // packagesData.js (safari-southamerica-brazil.jpg) is actually a photo of
    // Burg Eltz castle in Germany — wrong continent and wrong subject for a
    // Pantanal jaguar expedition. Overriding here keeps packagesData.js and
    // every other page untouched. See the note in the handover.
    const HERO_IMAGE_OVERRIDES = {
      'southamerica-brazil-pantanal-safari': 'assets/images/brazil.jpg',
    };

    const esc = (v) => String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    const WA_ICON = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.02c-.24.68-1.2 1.26-1.97 1.42-.53.11-1.21.2-3.51-.75-2.95-1.22-4.84-4.2-4.99-4.4-.14-.2-1.19-1.58-1.19-3.02s.75-2.14 1.02-2.43c.27-.29.59-.36.78-.36l.56.01c.18.01.42-.07.66.5.24.59.83 2.03.9 2.18.07.15.12.32.02.51-.09.2-.14.32-.28.49l-.42.49c-.14.14-.28.3-.12.58.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.27.14.43.12.59-.07.16-.2.68-.79.86-1.07.18-.27.36-.22.61-.13.24.09 1.55.73 1.82.86.27.14.45.2.51.31.07.11.07.63-.17 1.31z"/></svg>`;

    const highlights = Array.isArray(pkg.highlights) ? pkg.highlights : [];
    const itinerary = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];
    const heroImg = esc(HERO_IMAGE_OVERRIDES[pkg.id] || pkg.image);

    // "Day 2" -> "02" for the itinerary numerals, falling back to the index
    const dayNum = (d, i) => {
      const m = String(d.day || '').match(/\d+/);
      return String(m ? m[0] : i + 1).padStart(2, '0');
    };

    container.innerHTML = `
      <article class="fb-page">

        <!-- ── FULL-SCREEN OPENING FRAME ────────────────────────────────── -->
        <header class="fb-hero">
          <div class="fb-hero-media">
            <img src="${heroImg}" alt="${esc(pkg.title)}" class="fb-hero-img" />
          </div>
          <div class="fb-hero-top"></div>
          <div class="fb-hero-scrim"></div>

          <button type="button" class="fb-back" data-fb-back aria-label="Go back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div class="fb-hero-inner">
            <span class="fb-hero-eyebrow">${esc(categoryTitle)}</span>
            <h1 class="fb-title">${esc(pkg.title)}</h1>
            <ul class="fb-meta">
              <li>${esc(pkg.duration)}</li>
              <li>${esc(pkg.tag)}</li>
              <li class="fb-meta-star">${esc(pkg.rating)} Love My Tour Rating &middot; ${esc(pkg.reviewsCount)} reviews</li>
            </ul>

            <a href="${whatsappUrl}" target="_blank" rel="noopener" class="fb-hero-cta">
              ${WA_ICON}
              <span>Enquire on WhatsApp</span>
            </a>
          </div>

          <span class="fb-scroll" aria-hidden="true"><i></i></span>
        </header>

        <!-- ── TRIP FACTS — full-width rail, no prose ──────────────────── -->
        <section class="fb-sec fb-overview">
          <dl class="fb-facts">
            <div class="fb-fact"><dt>Duration</dt><dd>${esc(pkg.duration)}</dd></div>
            <div class="fb-fact"><dt>Experience</dt><dd>${esc(pkg.tag)}</dd></div>
            <div class="fb-fact"><dt>Love My Tour Rating</dt><dd>${esc(pkg.rating)} &middot; ${esc(pkg.reviewsCount)} reviews</dd></div>
          </dl>
        </section>

        ${highlights.length ? `
        <!-- ── HIGHLIGHTS — edge-to-edge, hairline separated ────────────── -->
        <section class="fb-sec fb-highlights">
          <div class="fb-gut">
            <h2 class="fb-h2">Highlights</h2>
          </div>
          <div class="fb-hl-row" data-count="${highlights.length}">
            ${highlights.map((h, i) => `
              <div class="fb-hl">
                <span class="fb-hl-num">${String(i + 1).padStart(2, '0')}</span>
                <span class="fb-hl-text">${esc(h)}</span>
              </div>`).join('')}
          </div>
        </section>` : ''}

        ${itinerary.length ? `
        <!-- ── ITINERARY — full-bleed, photograph behind ────────────────── -->
        <section class="fb-sec fb-itin" style="background-image:url('${heroImg}')">
          <div class="fb-itin-veil"></div>
          <div class="fb-gut fb-itin-inner">
            <h2 class="fb-h2 fb-h2-light">Itinerary</h2>
            <ol class="fb-days">
              ${itinerary.map((d, i) => `
                <li class="fb-day">
                  <span class="fb-day-n">${dayNum(d, i)}</span>
                  <div class="fb-day-main">
                    <h3 class="fb-day-title">${esc(d.title || '')}</h3>
                    ${d.desc ? `<p class="fb-day-desc">${esc(d.desc)}</p>` : ''}
                  </div>
                </li>`).join('')}
            </ol>
          </div>
        </section>` : ''}

        <!-- ── ENQUIRY ──────────────────────────────────────────────────── -->
        <section class="fb-sec fb-cta">
          <div class="fb-gut fb-cta-inner">
            <h2 class="fb-cta-title">Plan this trip</h2>
            <a href="${whatsappUrl}" target="_blank" rel="noopener" class="fb-cta-btn">
              ${WA_ICON}
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </section>

        <!-- Always-reachable WhatsApp: floating pill on desktop, full-width bar
             on mobile. Sits bottom-LEFT on desktop so it never covers the
             site's chat launcher in the bottom-right corner. -->
        <a href="${whatsappUrl}" target="_blank" rel="noopener" class="fb-float">
          ${WA_ICON}
          <span>Enquire on WhatsApp</span>
        </a>
      </article>
    `;

    // Reveal the floating WhatsApp pill only once the hero has scrolled past,
    // so it never sits on top of the button already inside the hero.
    const floatBtn = container.querySelector('.fb-float');
    const heroEl = container.querySelector('.fb-hero');
    if (renderFullbleedDetail._onScroll) {
      window.removeEventListener('scroll', renderFullbleedDetail._onScroll);
      renderFullbleedDetail._onScroll = null;
    }
    if (floatBtn && heroEl) {
      const onScroll = () => {
        floatBtn.classList.toggle('is-visible', window.scrollY > heroEl.offsetHeight - 140);
      };
      renderFullbleedDetail._onScroll = onScroll;
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Back arrow: step back through history when there is somewhere to go,
    // otherwise fall back to the destinations index so it is never a dead end.
    const backBtn = container.querySelector('[data-fb-back]');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.hash = '#continents';
        }
      });
    }
  }

  // Live guest counter helper function for Booking Widget
  function setupLiveGuestCounter() {
    let guestCount = 2;

    const guestMinusBtn = document.getElementById('guestMinusBtn');
    const guestPlusBtn = document.getElementById('guestPlusBtn');
    const guestCountVal = document.getElementById('guestCountVal');

    function updateCount() {
      if (guestCountVal) guestCountVal.textContent = `${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'}`;
    }

    if (guestMinusBtn) {
      guestMinusBtn.addEventListener('click', () => {
        if (guestCount > 1) {
          guestCount--;
          updateCount();
        }
      });
    }

    if (guestPlusBtn) {
      guestPlusBtn.addEventListener('click', () => {
        if (guestCount < 10) {
          guestCount++;
          updateCount();
        }
      });
    }
  }

  // 6. ENQUIRY MODAL & TRIGGER POPUP LOGIC
  const enquiryModal = document.getElementById('enquiryModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const enquiryPackageInput = document.getElementById('enquiry-package');
  // Set alongside enquiryPackageInput whenever a trigger opens the modal, so
  // the submit handler below can log which on-page button this enquiry came
  // from (see classifyEnquirySource) without adding a visible form field.
  let currentEnquirySource = 'Website — General Enquiry';

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.open-enquiry-btn');
    if (trigger) {
      const pkgName = trigger.getAttribute('data-package') || trigger.getAttribute('data-destination') || 'General Holiday Package';
      if (enquiryPackageInput) enquiryPackageInput.value = pkgName;
      currentEnquirySource = classifyEnquirySource(trigger);
      if (enquiryModal) enquiryModal.classList.add('active');
    }

    const cardTrigger = e.target.closest('.view-package-trigger');
    if (cardTrigger) {
      const pkgId = cardTrigger.getAttribute('data-package-id');
      if (pkgId) {
        window.location.hash = `#package/${pkgId}`;
      }
    }

    const cinCard = e.target.closest('.cinematic-card');
    if (cinCard && !e.target.closest('.open-enquiry-btn')) {
      const destId = cinCard.getAttribute('data-id');
      if (destId) {
        window.location.hash = `#package/${destId}`;
      }
    }
  });

  // Tracks whether the visitor has already opened or dismissed the modal on
  // their own, so the 5-second auto-popup below never fights a choice they
  // already made.
  let enquiryModalTouched = false;

  if (closeModalBtn && enquiryModal) {
    closeModalBtn.addEventListener('click', () => {
      enquiryModalTouched = true;
      enquiryModal.classList.remove('active');
    });

    enquiryModal.addEventListener('click', (e) => {
      if (e.target === enquiryModal) {
        enquiryModalTouched = true;
        enquiryModal.classList.remove('active');
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.open-enquiry-btn')) enquiryModalTouched = true;
  });

  // 6.0 AUTO-OPEN — pops the booking enquiry modal 5 seconds after the site
  // loads, once per browser session, unless the visitor already opened or
  // closed it themselves in that time.
  if (enquiryModal && !sessionStorage.getItem('enquiryAutoShown')) {
    setTimeout(() => {
      if (!enquiryModalTouched) {
        enquiryModal.classList.add('active');
      }
      sessionStorage.setItem('enquiryAutoShown', '1');
    }, 5000);
  }

  // 6.1 "BOOK NOW" ENQUIRY MODAL → WHATSAPP
  //     Every .open-enquiry-btn on the site (hero Book Now, navbar Enquire now,
  //     plan cards, package pages) funnels into this one form, so the details
  //     typed here are delivered to WhatsApp as a structured booking enquiry.
  //     Native `required` validation runs first — the handler only fires once
  //     Name and Phone are filled in.
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = fieldValue('enquiry-name');
      const phone = fieldValue('enquiry-phone');
      const email = fieldValue('enquiry-email');
      const pkg = fieldValue('enquiry-package');
      const message = fieldValue('enquiry-message');

      sendEnquiryToWhatsApp('NEW BOOKING ENQUIRY — Love My Tour', [
        ['Name', name],
        ['Phone', phone],
        ['Email', email],
        ['Destination / Package', pkg],
        ['Travel Dates / Requirements', message]
      ]);

      // Best-effort copy into Google Sheets — see the GOOGLE SHEETS LEAD
      // LOGGING block near the top of this file. Never blocks or affects
      // the WhatsApp flow above.
      sendToGoogleSheets('enquire', {
        source: currentEnquirySource,
        name,
        phone,
        email,
        package: pkg,
        message
      });

      showEnquiryToast('Opening WhatsApp with your booking details… just press send.');
      if (enquiryModal) enquiryModal.classList.remove('active');
      enquiryForm.reset();
    });
  }

  // 6.2 HERO "GET QUOTE NOW" → WHATSAPP
  //     All four fields carry `required`, so the browser blocks the submit until
  //     they are filled; this only runs on a valid form.
  const heroQuoteForm = document.getElementById('heroQuoteForm');
  if (heroQuoteForm) {
    heroQuoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = fieldValue('quote-name');
      const phone = fieldValue('quote-phone');
      const email = fieldValue('quote-email');
      const destination = fieldValue('quote-destination');

      sendEnquiryToWhatsApp('NEW QUOTE REQUEST — Love My Tour', [
        ['Name', name],
        ['Phone', phone],
        ['Email', email],
        ['Destination', destination]
      ]);

      // Best-effort copy into Google Sheets — routed into the same
      // "Enquire & Book Now" tab as the modal above (the deployed Apps
      // Script only recognises formType 'enquire'/'contact'; this form's
      // fields fit that tab's columns exactly), with its own Source label
      // so it's still clearly distinguishable in the sheet.
      sendToGoogleSheets('enquire', {
        source: 'Hero — Get Quote Now',
        name,
        phone,
        email,
        package: destination,
        message: ''
      });

      showEnquiryToast('Opening WhatsApp with your quote request… just press send.');
      heroQuoteForm.reset();
    });
  }

  // 6.3 CONTACT PAGE FORM → WHATSAPP (was a dead alert() that discarded the data)
  const contactPageForm = document.getElementById('contactPageForm');
  if (contactPageForm) {
    contactPageForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = fieldValue('contact-name');
      const phone = fieldValue('contact-phone');
      const destination = fieldValue('contact-destination');
      const message = fieldValue('contact-msg');

      sendEnquiryToWhatsApp('NEW CONTACT ENQUIRY — Love My Tour', [
        ['Name', name],
        ['Phone', phone],
        ['Preferred Destination', destination],
        ['Message / Travel Details', message]
      ]);

      // Best-effort copy into Google Sheets — same pattern as the enquiry
      // modal above; never blocks or affects the WhatsApp flow.
      sendToGoogleSheets('contact', {
        source: 'Contact Page',
        name,
        phone,
        destination,
        message
      });

      showEnquiryToast('Opening WhatsApp with your message… just press send.');
      contactPageForm.reset();
    });
  }

  // 6.4 CAREERS PAGE — LIVE LISTINGS FROM GOOGLE SHEETS
  //     Fetches the Careers tab (via CAREERS_WEBAPP_URL — its own separate
  //     Apps Script deployment from the one used for lead logging above,
  //     ?action=careers) and, on success, replaces the static fallback
  //     cards below with it — so editing that Sheet, or the separate admin
  //     page at <careers web app URL>?action=admin, is reflected here with
  //     no code change or redeploy. Called every time the #careers route
  //     is entered (see handleRoute), so an edit shows up next time a
  //     visitor opens the page.
  //
  //     "No error" behaviour: if the URL is still a placeholder, the
  //     fetch fails, or the Sheet has no Active listings yet, this does
  //     nothing at all — the 6 static <article class="career-job-card">
  //     cards and the static #career-role <option>s already in the HTML
  //     are the fallback, and stay exactly as they are. The page can
  //     never end up blank or broken because of this.
  function renderCareersFromSheet() {
    if (!CAREERS_WEBAPP_URL || CAREERS_WEBAPP_URL.indexOf('PASTE_YOUR_') === 0) return;

    const jobsList = document.getElementById('careersJobsList');
    if (!jobsList) return;

    fetch(CAREERS_WEBAPP_URL + '?action=careers')
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.status !== 'success' || !Array.isArray(data.listings) || !data.listings.length) return;

        jobsList.innerHTML = data.listings.map((job) => {
          const badgeClass = job.badge && /urgent/i.test(job.badge) ? ' career-job-badge-hot' : '';
          const badgeHtml = job.badge ? `<span class="career-job-badge${badgeClass}">${escapeHtml(job.badge)}</span>` : '';
          const metaHtml = [job.location, job.type, job.experience, job.salary]
            .filter(Boolean)
            .map((part) => `<span>${escapeHtml(part)}</span>`)
            .join('');
          // Every field below except Title is optional in the admin page —
          // description/skills/meta only render if actually filled in, so
          // a skipped field never leaves a blank paragraph or empty list.
          const descHtml = job.description ? `<p class="career-job-desc">${escapeHtml(job.description)}</p>` : '';
          const skillsHtml = (job.skills || []).map((skill) => `<li>${escapeHtml(skill)}</li>`).join('');
          const skillsListHtml = skillsHtml ? `<ul class="career-job-skills">${skillsHtml}</ul>` : '';

          return `
            <article class="career-job-card">
              <div class="career-job-main">
                <div class="career-job-top">
                  <h3 class="career-job-title">${escapeHtml(job.title)}</h3>
                  ${badgeHtml}
                </div>
                <div class="career-job-meta">${metaHtml}</div>
                ${descHtml}
                ${skillsListHtml}
              </div>
              <div class="career-job-action">
                <button type="button" class="career-apply-btn" data-role="${escapeHtml(job.title)}">Apply Now</button>
              </div>
            </article>
          `;
        }).join('');

        const roleSelect = document.getElementById('career-role');
        if (roleSelect) {
          const optionsHtml = data.listings
            .map((job) => `<option value="${escapeHtml(job.title)}">${escapeHtml(job.title)}</option>`)
            .join('');
          roleSelect.innerHTML = optionsHtml + '<option value="Other / General Application">Other / General Application</option>';
        }

        const openCountEl = document.getElementById('careersOpenCount');
        if (openCountEl) {
          const n = data.listings.length;
          openCountEl.textContent = n + (n === 1 ? ' Position Open' : ' Positions Open');
        }
      })
      .catch(() => {
        // Network hiccup or Apps Script unavailable — the static fallback
        // cards (and the static "6 Positions Open" heading) already in
        // the HTML stay exactly as they are.
      });
  }

  // 6.5 CAREERS PAGE — "Apply Now" on a job card preselects that role in the
  //     application form and scrolls down to it.
  const careerRoleSelect = document.getElementById('career-role');

  document.addEventListener('click', (e) => {
    const applyBtn = e.target.closest('.career-apply-btn');
    if (!applyBtn) return;

    const role = (applyBtn.getAttribute('data-role') || '').trim();

    if (careerRoleSelect && role) {
      // Fall back to the general option if a card's role is ever renamed and no
      // longer matches an <option>, so the select is never left blank.
      const match = Array.from(careerRoleSelect.options)
        .find(opt => opt.value.trim() === role);
      careerRoleSelect.value = match ? match.value : 'Other / General Application';
    }

    const formWrap = document.getElementById('careersApplyForm');
    if (formWrap) {
      formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      formWrap.classList.add('highlight');
      setTimeout(() => formWrap.classList.remove('highlight'), 1600);
    }

    const nameField = document.getElementById('career-name');
    if (nameField) setTimeout(() => nameField.focus({ preventScroll: true }), 600);
  });

  // 6.6 CAREERS APPLICATION FORM → WHATSAPP
  const careersForm = document.getElementById('careersForm');
  if (careersForm) {
    careersForm.addEventListener('submit', (e) => {
      e.preventDefault();

      sendEnquiryToWhatsApp('NEW JOB APPLICATION — Love My Tour', [
        ['Position', fieldValue('career-role')],
        ['Name', fieldValue('career-name')],
        ['Phone', fieldValue('career-phone')],
        ['Email', fieldValue('career-email')],
        ['Experience', fieldValue('career-experience')],
        ['Current City', fieldValue('career-location')],
        ['Resume Link', fieldValue('career-resume')],
        ['About the candidate', fieldValue('career-note')]
      ]);

      showEnquiryToast('Opening WhatsApp with your application… press send, then attach your CV.');
      careersForm.reset();
    });
  }

  // 7. MOBILE HAMBURGER & DROPDOWN TOGGLE LOGIC
  const mainNavLinksElement = document.getElementById('mainNavLinks');

  const megaColTitles = document.querySelectorAll('.mega-column-title');
  megaColTitles.forEach(title => {
    title.addEventListener('click', (e) => {
      if (window.innerWidth <= 990) {
        const col = title.closest('.mega-column');
        if (col) {
          const linksList = col.querySelector('.mega-links-list');
          if (linksList && linksList.children.length > 0) {
            e.preventDefault();
            col.classList.toggle('open');
          }
        }
      }
    });
  });

  if (mainNavLinksElement) {
    mainNavLinksElement.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.closest('a') || e.target.classList.contains('open-enquiry-btn')) {
        mainNavLinksElement.classList.remove('mobile-open');
      }
    });
  }

  // 8. FLIGHT SEARCH INTERACTIVITY
  const radioLabels = document.querySelectorAll('.radio-label');
  radioLabels.forEach(label => {
    label.addEventListener('click', () => {
      radioLabels.forEach(l => l.classList.remove('active'));
      label.classList.add('active');
      const radioInput = label.querySelector('input[type="radio"]');
      if (radioInput) radioInput.checked = true;
    });
  });

  const swapBtn = document.querySelector('.swap-divider');
  const takeoffInput = document.getElementById('takeoff-airport');
  const arrivalInput = document.getElementById('arrival-airport');

  if (swapBtn && takeoffInput && arrivalInput) {
    swapBtn.style.cursor = 'pointer';
    swapBtn.addEventListener('click', () => {
      const temp = takeoffInput.value;
      takeoffInput.value = arrivalInput.value;
      arrivalInput.value = temp;
    });
  }

  // 9. ULTRA-PREMIUM 7 CONTINENTS SHOWCASE — CONTINUOUS AUTOPLAY
  function initCinematicPortfolio() {
    const stage = document.getElementById('cinematicStage');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('carouselPrevBtn');
    const nextBtn = document.getElementById('carouselNextBtn');
    const carouselOuter = document.querySelector('.cinematic-carousel-outer');

    if (!stage) return;

    // 7 CONTINENT SHOWCASE DATA
    const cinematicDestinations = [
      {
        id: "asia",
        name: "ASIA",
        title: "Asia",
        badge: "🌏 12 Tourist Spots",
        desc: "Thailand, Japan, Singapore, Dubai, Bali, Vietnam, Sri Lanka, Maldives & India",
        image: "assets/packages-images/heritage-vietnam-halong.jpg"
      },
      {
        id: "europe",
        name: "EUROPE",
        title: "Europe",
        badge: "🏰 8 Tourist Spots",
        desc: "Switzerland, France, Italy, United Kingdom, Greece, Spain, Norway & Iceland",
        image: "assets/packages-images/safari-norway-real.jpg"
      },
      {
        id: "africa",
        name: "AFRICA",
        title: "Africa",
        badge: "🦁 6 Tourist Spots",
        desc: "Egypt Pyramids, South Africa Safari, Mauritius, Seychelles, Kenya & Madagascar",
        image: "assets/packages-images/safari-africa-mara.jpg"
      },
      {
        id: "north-america",
        name: "NORTH AMERICA",
        title: "North America",
        badge: "🗽 4 Tourist Spots",
        desc: "United States (New York & Grand Canyon), Canada (Banff) & Mexico",
        image: "assets/packages-images/safari-alaska-grizzly.jpg"
      },
      {
        id: "south-america",
        name: "SOUTH AMERICA",
        title: "South America",
        badge: "🏔️ 4 Tourist Spots",
        desc: "Brazil (Amazon & Rio), Peru (Machu Picchu), Argentina Glaciers & Colombia",
        image: "assets/packages-images/safari-brazil-jaguar.jpg"
      },
      {
        id: "antarctica",
        name: "ANTARCTICA",
        title: "Antarctica",
        badge: "🧊 Polar Expedition",
        desc: "Drake Passage, Deception Island Penguins & Paradise Harbor Glaciers",
        image: "assets/packages-images/safari-antarctica-penguins.jpg"
      },
      {
        id: "australia",
        name: "AUSTRALIA & OCEANIA",
        title: "Australia & Oceania",
        badge: "🦘 3 Tourist Spots",
        desc: "Australia (Sydney Opera House & Reef), New Zealand Milford Sound & Fiji",
        image: "assets/packages-images/safari-australia-croc.jpg"
      }
    ];

    let filteredItems = [...cinematicDestinations];
    let currentIndex = 0;
    let isAnimating = false;
    let legacyTimer = null;

    // DESKTOP 3D COVERFLOW SLOTS (Expanded Non-Overlapping Spacing Matching Image 2)
    const DESKTOP_SLOTS = [
      { tx: -820, tz: 100, rotY: 40, scale: 1.05, opacity: 0, z: 1 },
      { tx: -640, tz: 60, rotY: 28, scale: 1.15, opacity: 1, z: 10 },
      { tx: -385, tz: -30, rotY: 16, scale: 0.95, opacity: 1, z: 7 },
      { tx: -145, tz: -80, rotY: 6, scale: 0.82, opacity: 1, z: 5 },
      { tx: 145, tz: -80, rotY: -6, scale: 0.82, opacity: 1, z: 5 },
      { tx: 385, tz: -30, rotY: -16, scale: 0.95, opacity: 1, z: 7 },
      { tx: 640, tz: 60, rotY: -28, scale: 1.15, opacity: 1, z: 10 },
      { tx: 820, tz: 100, rotY: -40, scale: 1.05, opacity: 0, z: 1 },
    ];
    const DESKTOP_POS_MAP = [-4, -3, -2, -1, 1, 2, 3, 4];

    // MOBILE 3D CENTER-MAJOR SLOTS (Matching Reference Image 2)
    const MOBILE_SLOTS = [
      { tx: -250, tz: -60, rotY: 24, scale: 0.72, opacity: 0, z: 1 },
      { tx: -145, tz: -20, rotY: 14, scale: 0.84, opacity: 0.85, z: 6 },
      { tx: 0, tz: 40, rotY: 0, scale: 1.06, opacity: 1, z: 10 },
      { tx: 145, tz: -20, rotY: -14, scale: 0.84, opacity: 0.85, z: 6 },
      { tx: 250, tz: -60, rotY: -24, scale: 0.72, opacity: 0, z: 1 },
    ];
    const MOBILE_POS_MAP = [-2, -1, 0, 1, 2];

    function getActiveSlots() {
      if (window.innerWidth <= 990) {
        return { slots: MOBILE_SLOTS, posMap: MOBILE_POS_MAP };
      }
      return { slots: DESKTOP_SLOTS, posMap: DESKTOP_POS_MAP };
    }

    function renderStage(popIn = false) {
      const total = filteredItems.length;
      if (total === 0) {
        stage.innerHTML = '';
        return;
      }

      const activePackages = [];
      const activeIds = new Set();
      const { slots: currentSlots, posMap: currentPosMap } = getActiveSlots();

      for (let slot = 0; slot < currentSlots.length; slot++) {
        const pos = currentPosMap[slot];
        const idx = ((currentIndex + pos) % total + total) % total;
        const dest = filteredItems[idx];
        const slotCfg = currentSlots[slot];

        if (dest && dest.id) {
          activeIds.add(dest.id);
          activePackages.push({ slot, pos, dest, slotCfg });
        }
      }

      const existingCards = Array.from(stage.querySelectorAll('.cinematic-card'));
      const existingMap = new Map();
      existingCards.forEach(card => {
        const cardId = card.getAttribute('data-id');
        if (cardId) existingMap.set(cardId, card);
      });

      activePackages.forEach(({ slot, pos, dest, slotCfg }) => {
        let card = existingMap.get(dest.id);

        if (!card) {
          card = document.createElement('article');
          card.className = 'cinematic-card continent-showcase-card';
          card.setAttribute('data-id', dest.id);

          card.innerHTML = `
            <div class="continent-card-inner" style="background-image: url('${cardThumb(dest.image)}');">
              <div class="continent-card-gradient"></div>
              <div class="continent-card-info">
                <div class="continent-card-header-row">
                  <h3 class="continent-card-name">${dest.title}</h3>
                  <span class="continent-card-pin">📍</span>
                </div>
                <div class="continent-card-duration">${dest.badge}</div>
                <div class="continent-card-footer-row">
                  <div class="continent-card-rating">
                    <span class="star-rating" title="Love My Tour Rating">4.8 ★</span>
                    <span class="reviews-count">(250 reviews)</span>
                  </div>
                  <button type="button" class="cyan-book-btn open-enquiry-btn">Book Now</button>
                </div>
              </div>
            </div>
          `;

          card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (dest && dest.id) {
              window.location.hash = `#continents/${dest.id}`;
            }
          });

          stage.appendChild(card);

          if (popIn) {
            card.style.transition = 'none';
            card.style.transform = `translate(-50%, -50%) translate3d(${slotCfg.tx}px, 0, -300px) rotateY(${slotCfg.rotY * 1.5}deg) scale(0.4)`;
            card.style.opacity = '0';
            card.style.zIndex = slotCfg.z;
            card.style.pointerEvents = slotCfg.opacity === 0 ? 'none' : 'auto';

            const delay = slot * 55;
            setTimeout(() => {
              card.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease';
              card.style.transform = `translate(-50%, -50%) translate3d(${slotCfg.tx}px, 0, ${slotCfg.tz}px) rotateY(${slotCfg.rotY}deg) scale(${slotCfg.scale})`;
              card.style.opacity = slotCfg.opacity;
            }, delay);
          } else {
            card.style.transition = 'none';
            card.style.transform = `translate(-50%, -50%) translate3d(${slotCfg.tx}px, 0, ${slotCfg.tz}px) rotateY(${slotCfg.rotY}deg) scale(${slotCfg.scale})`;
            card.style.opacity = slotCfg.opacity;
            card.style.zIndex = slotCfg.z;
            card.style.pointerEvents = slotCfg.opacity === 0 ? 'none' : 'auto';
            void card.offsetWidth;
            card.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease';
          }
        } else {
          card.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease';
          card.style.transform = `translate(-50%, -50%) translate3d(${slotCfg.tx}px, 0, ${slotCfg.tz}px) rotateY(${slotCfg.rotY}deg) scale(${slotCfg.scale})`;
          card.style.opacity = slotCfg.opacity;
          card.style.zIndex = slotCfg.z;
          card.style.pointerEvents = slotCfg.opacity === 0 ? 'none' : 'auto';
        }

        card.setAttribute('data-pos', pos);
      });

      existingCards.forEach(card => {
        const cardId = card.getAttribute('data-id');
        if (cardId && !activeIds.has(cardId)) {
          card.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease';
          const currTransform = card.style.transform;
          const txMatch = currTransform.match(/translate3d\(([-\d.]+)px/);
          const currentTx = txMatch ? parseFloat(txMatch[1]) : 0;
          card.style.transform = `translate(-50%, -50%) translate3d(${currentTx}px, 0, -300px) scale(0.35)`;
          card.style.opacity = 0;
          setTimeout(() => { card.remove(); }, 400);
        }
      });

      renderDots();
    }

    function navigate(dir) {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex = ((currentIndex + dir) % filteredItems.length + filteredItems.length) % filteredItems.length;
      renderStage(false);
      setTimeout(() => { isAnimating = false; }, 200);
    }

    function renderDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      filteredItems.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = `carousel-dot${i === currentIndex ? ' active' : ''}`;
        dot.addEventListener('click', () => {
          if (!isAnimating) { currentIndex = i; renderStage(false); }
        });
        dotsContainer.appendChild(dot);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

    if (carouselOuter) {
      carouselOuter.addEventListener('mouseover', () => stopFallbackAutoPlay());
      carouselOuter.addEventListener('mouseout', () => startFallbackAutoPlay());
    }

    function startFallbackAutoPlay() {
      stopFallbackAutoPlay();
      legacyTimer = setInterval(() => navigate(1), 3000);
    }

    function stopFallbackAutoPlay() {
      if (legacyTimer) { clearInterval(legacyTimer); legacyTimer = null; }
    }

    window.addEventListener('resize', () => renderStage(false));
    renderStage(true);
    startFallbackAutoPlay();
  }

  initCinematicPortfolio();

  // ==========================================================================
  // 9. DYNAMIC 7 CONTINENTS VIEW & AUTO-SCROLLING MARQUEE RENDERER
  // ==========================================================================
  function renderContinentsView() {
    const container = document.getElementById('continentsBodyContainer');
    if (!container) return;

    // Only skip render if already populated
    if (container.children.length > 0) return;

    container.innerHTML = '';

    const continentKeys = ['asia', 'africa', 'europe', 'australia', 'south-america', 'north-america', 'antarctica'];

    continentKeys.forEach((cKey, idx) => {
      const cData = continentsData[cKey];
      if (!cData) return;

      const block = document.createElement('div');
      block.className = 'continent-section-block';
      block.id = `continent-${cKey}`;

      const headerHTML = `
        <div class="continent-section-header">
          <div class="continent-title-group">
            <h2><span>${cData.name}</span></h2>
            <p>${cData.tagline}</p>
          </div>
        </div>
      `;

      const destList = cData.destinations || [];

      // Asia gets a static, fully-listed category grid instead of the
      // auto-scrolling marquee every other continent uses — no motion, no
      // horizontal scroll container, every destination on screen at once,
      // filterable by the same category taxonomy as the navbar's Popular
      // Destinations menu (see POPULAR_CATEGORIES / DESTINATION_CATEGORIES
      // in packagesData.js).
      if (cKey === 'asia') {
        const pillsHTML = POPULAR_CATEGORIES.map(cat => `
          <button type="button" class="asia-cat-pill" data-cat="${cat.key}">
            <span>${cat.icon}</span> ${cat.label}
          </button>
        `).join('');

        const gridHTML = destList.map(dest => {
          const cats = (DESTINATION_CATEGORIES[dest.id] || []).join(' ');
          return `
            <a href="#category/${dest.id}" class="country-photo-card asia-category-card" data-cats="${cats}">
              <img src="${cardThumb(dest.image)}" data-full="${dest.image}" alt="${dest.name}" class="country-photo-img" width="240" height="280" decoding="async" loading="lazy" onerror="if(this.dataset.full&&this.src.indexOf('card-thumbs')>-1){this.src=this.dataset.full;}" />
              <div class="country-photo-gradient"></div>
              <span class="country-card-tag">${dest.tag}</span>
              <div class="country-photo-info">
                <h3 class="country-photo-name">${dest.name}</h3>
                <p class="country-photo-desc">${dest.desc}</p>
              </div>
            </a>
          `;
        }).join('');

        const asiaHTML = `
          <div class="asia-categories-heading">ASIA CATEGORIES</div>
          <div class="asia-categories-bar" id="asiaCategoriesBar">
            <button type="button" class="asia-cat-pill active" data-cat="all"><span>🌏</span> All</button>
            ${pillsHTML}
          </div>
          <div class="asia-categories-grid destination-grid" id="asiaCategoriesGrid">
            ${gridHTML}
          </div>
        `;

        block.innerHTML = headerHTML + asiaHTML;
        container.appendChild(block);
        return;
      }

      let cardsHTML = '';
      // Duplicate for seamless infinite auto-scroll loop.
      // RC-16 FIX (North America): these images deliberately do NOT use
      // loading="lazy". Inside a marquee the track is moved with a CSS/JS
      // transform, and Safari's lazy-load intersection calculation does not
      // reliably re-evaluate for content that arrives via a transform rather
      // than via real scrolling — so a card could stay permanently unloaded
      // and render blank. That shows up worst on the continents with the
      // fewest destinations (North America has 3, Antarctica 2), where each
      // unloaded card is a large fraction of the row.
      const fullList = [...destList, ...destList];

      fullList.forEach((dest, i) => {
        const isHidden = i >= destList.length;
        cardsHTML += `
          <a href="#category/${dest.id}" class="country-photo-card"${isHidden ? ' aria-hidden="true"' : ''}>
            <img src="${cardThumb(dest.image)}" data-full="${dest.image}" alt="${dest.name}" class="country-photo-img" width="240" height="280" decoding="async" onerror="if(this.dataset.full&&this.src.indexOf('card-thumbs')>-1){this.src=this.dataset.full;}" />
            <div class="country-photo-gradient"></div>
            <span class="country-card-tag">${dest.tag}</span>
            <div class="country-photo-info">
              <h3 class="country-photo-name">${dest.name}</h3>
              <p class="country-photo-desc">${dest.desc}</p>
            </div>
          </a>
        `;
      });

      const directionClass = idx % 2 === 1 ? 'continent-marquee-track reverse' : 'continent-marquee-track';
      const marqueeHTML = `
        <div class="continent-marquee-wrapper">
          <div class="${directionClass}">
            ${cardsHTML}
          </div>
        </div>
      `;

      block.innerHTML = headerHTML + marqueeHTML;
      container.appendChild(block);
    });

    isContinentsRendered = true;
    initContinentsHeroSlider();
    // RC-17: the Continents rows are now animated by the same compositor CSS
    // animation as every other marquee on the site (see
    // .continent-marquee-track in styles.css). This call only measures each
    // row to set its per-row duration and registers it with the shared
    // visibility observer — it runs no per-frame code.
    initMarquees();
    initContinentsSearch();
    initAsiaCategoryFilter();
  }

  // Category pill filter for the static Asia grid (see renderContinentsView).
  // Pure show/hide on the already-rendered cards — no re-render, no scroll
  // container, so there is nothing for a swipe/drag handler to fight with.
  function initAsiaCategoryFilter() {
    const bar = document.getElementById('asiaCategoriesBar');
    const grid = document.getElementById('asiaCategoriesGrid');
    if (!bar || !grid || bar._wired) return;
    bar._wired = true;

    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.asia-cat-pill');
      if (!btn) return;

      bar.querySelectorAll('.asia-cat-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-cat');
      grid.querySelectorAll('.asia-category-card').forEach(card => {
        const cats = (card.getAttribute('data-cats') || '').split(' ');
        const show = cat === 'all' || cats.includes(cat);
        card.style.display = show ? '' : 'none';
      });
    });
  }

  // Navbar "Popular Destinations" page — flattens every continent's
  // destinations once, then filters that flat list by category. Route is
  // #popular (all destinations, every category) or #popular/<key> (one
  // category); the pill bar itself just links to those hashes, so switching
  // categories is a normal route change handled by handleRoute().
  function renderPopularView(catKey) {
    const bar = document.getElementById('popularCategoryBar');
    const grid = document.getElementById('popularCategoryGrid');
    const titleEl = document.getElementById('popularPageTitle');
    const subEl = document.getElementById('popularPageSubtitle');
    if (!bar || !grid) return;

    const activeCat = POPULAR_CATEGORIES.find(c => c.key === catKey);

    if (titleEl) titleEl.textContent = activeCat ? `${activeCat.label} Destinations` : 'Popular Categories';
    if (subEl) {
      subEl.textContent = activeCat
        ? `Our best-loved ${activeCat.label.toLowerCase()} destinations, hand-picked across every continent.`
        : 'Browse our best-loved destinations, grouped by the kind of trip you want.';
    }

    if (!bar._built) {
      bar._built = true;
      let pillsHTML = `<a href="#popular" class="asia-cat-pill" data-cat="all"><span>⭐</span> All</a>`;
      POPULAR_CATEGORIES.forEach(cat => {
        pillsHTML += `<a href="#popular/${cat.key}" class="asia-cat-pill" data-cat="${cat.key}"><span>${cat.icon}</span> ${cat.label}</a>`;
      });
      bar.innerHTML = pillsHTML;
    }
    bar.querySelectorAll('.asia-cat-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-cat') === (activeCat ? activeCat.key : 'all'));
    });

    if (!renderPopularView._allDestinations) {
      const list = [];
      Object.values(continentsData).forEach(cData => {
        (cData.destinations || []).forEach(dest => list.push(dest));
      });
      renderPopularView._allDestinations = list;
    }

    const matches = renderPopularView._allDestinations.filter(dest => {
      if (!activeCat) return true;
      return (DESTINATION_CATEGORIES[dest.id] || []).includes(activeCat.key);
    });

    grid.innerHTML = matches.map(dest => `
      <a href="#category/${dest.id}" class="country-photo-card">
        <img src="${cardThumb(dest.image)}" data-full="${dest.image}" alt="${dest.name}" class="country-photo-img" width="240" height="280" decoding="async" loading="lazy" onerror="if(this.dataset.full&&this.src.indexOf('card-thumbs')>-1){this.src=this.dataset.full;}" />
        <div class="country-photo-gradient"></div>
        <span class="country-card-tag">${dest.tag}</span>
        <div class="country-photo-info">
          <h3 class="country-photo-name">${dest.name}</h3>
          <p class="country-photo-desc">${dest.desc}</p>
        </div>
      </a>
    `).join('') || `<p class="popular-empty-msg">No destinations found for this category yet.</p>`;
  }

  // Live search for the Continents page. Results drop down below the search
  // box (like a normal site-search autocomplete) instead of filtering the
  // marquee rows in place — clicking a result jumps straight to that
  // country's page via the same #category/<id> route the cards use.
  function initContinentsSearch() {
    const input = document.getElementById('continentsSearchInput');
    const wrap = document.getElementById('continentsSearchWrap');
    const resultsBox = document.getElementById('continentsSearchResults');
    if (!input || !wrap || !resultsBox || input._wired) return;
    input._wired = true;

    // Flatten continentsData once into a single searchable list.
    const allDestinations = [];
    Object.values(continentsData).forEach((cData) => {
      (cData.destinations || []).forEach((dest) => {
        allDestinations.push({
          id: dest.id,
          name: dest.name,
          tag: dest.tag,
          desc: dest.desc || '',
          image: dest.image,
          continentName: cData.name,
          searchText: `${dest.name} ${dest.desc || ''} ${cData.name}`.toLowerCase()
        });
      });
    });

    function closeResults() {
      resultsBox.hidden = true;
      resultsBox.innerHTML = '';
    }

    function renderResults(query) {
      if (!query) {
        closeResults();
        return;
      }

      const matches = allDestinations.filter((d) => d.searchText.includes(query)).slice(0, 8);

      if (matches.length === 0) {
        resultsBox.innerHTML = `<p class="continents-search-empty-msg">No destination found for "${query}" — try another spelling.</p>`;
        resultsBox.hidden = false;
        return;
      }

      resultsBox.innerHTML = matches.map((d) => `
        <a href="#category/${d.id}" class="continents-search-result">
          <img src="${cardThumb(d.image)}" alt="" class="continents-search-result-img" decoding="async" onerror="this.onerror=null;this.src='${d.image}';" />
          <span class="continents-search-result-text">
            <span class="continents-search-result-name">${d.name}</span>
            <span class="continents-search-result-meta">${d.continentName} &middot; ${d.tag}</span>
          </span>
        </a>
      `).join('');
      resultsBox.hidden = false;
    }

    input.addEventListener('input', () => {
      renderResults(input.value.trim().toLowerCase());
    });

    input.addEventListener('focus', () => {
      if (input.value.trim()) renderResults(input.value.trim().toLowerCase());
    });

    resultsBox.addEventListener('click', (e) => {
      if (e.target.closest('.continents-search-result')) {
        input.value = '';
        closeResults();
      }
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) closeResults();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        input.value = '';
        closeResults();
        input.blur();
      }
    });
  }

  // ==========================================================================
  // MARQUEE CONTROLLER — RC-17
  //
  // This replaces initDraggableMarquees, a 256-line requestAnimationFrame
  // engine that drove the Continents rows by writing `track.style.transform`
  // every frame. With seven continent rows live at once that is seven DOM
  // writes and seven style recalculations per frame, on the same main thread
  // that is decoding card images and servicing touch — which is why the
  // Continents rows hitch and stall on a phone.
  //
  // All motion is now a compositor-driven CSS @keyframes animation declared
  // in styles.css, identical in mechanism to .domestic-marquee-track — the
  // one marquee on this site never reported broken on the reporter's iPhone.
  // Nothing below runs per frame. There are exactly two jobs left:
  //
  //   1. Measure each row once to set its own animation duration, so rows
  //      with different card counts still drift at the same visual speed.
  //   2. Keep a row's GPU layer alive ONLY while it is near the viewport.
  //
  // Job 2 is the important one. Every marquee track used to carry
  // `will-change: transform` permanently, which pins a permanent composited
  // layer per row — 3 on the home page, 7 on Continents — whether or not the
  // row is anywhere near the screen. That is precisely the case MDN warns
  // about, and iOS Safari's response to GPU memory pressure is to drop layer
  // backing stores: the row stays laid out at full height and its animation
  // keeps running, but it paints as nothing. A blank row of the correct
  // height is exactly what was reported, and exactly what the screenshots
  // show.
  //
  // TRADE-OFF, stated plainly: drag-to-scroll is gone from the Continents
  // rows, as it already was from Global Safari in RC-15. Continuous reliable
  // motion was the requirement; the drag implementation is also what caused
  // an earlier scroll bug (pointer capture hijacking page scroll, 7fb77bd).
  // ==========================================================================

  // One shared drift speed, in CSS pixels per second, for every marquee.
  // Continents rows vary wildly in length (Asia has many destinations,
  // Antarctica has two), so a single fixed duration would make short rows
  // crawl and long rows race. Deriving each row's duration from its own
  // width keeps them all visually consistent.
  // NOTE ON PLACEMENT: initMarquees() is called from section 1.3 far above,
  // which executes long before this point in the IIFE body. Everything here
  // is therefore a hoisted `function` declaration, and all mutable state
  // lives on initMarquees itself rather than in module-level `const`/`let`.
  // Module-level bindings would be in the temporal dead zone at that first
  // call (an outright ReferenceError), and switching them to `var` would be
  // worse-but-silent: the initialiser would run later and reset state the
  // first call had already built, leaving a second orphaned observer.

  // RC-31 FIX, extracted RC-32 — the single reliable way to measure a
  // marquee track's real one-copy width. track.scrollWidth (and
  // track.getBoundingClientRect().width) is a WebKit sizing quirk on a
  // `width: max-content` flex item once its CSS animation +
  // will-change:transform layer is live — verified via a live WebKit trace
  // with iPhone emulation: individual cards measured correctly (190px each,
  // ~208px apart, ~1240px of real content across 6 cards on North America's
  // row) while track.scrollWidth simultaneously reported 4278px for that
  // same track, more than 3x too large. Summing each card's own
  // getBoundingClientRect().width directly (same approach
  // ensureMarqueeFill's own `measure()` already used reliably) bypasses the
  // broken track-level measurement entirely instead of trying to correct it.
  //
  // RC-32: this was originally inlined only inside tuneMarqueeSpeed (which
  // drives the auto-scroll distance), but enableMarqueeDrag had its own
  // separate track.scrollWidth/2 for copyWidth (drag sensitivity) that was
  // never updated — same inflated number, so a real finger swipe only
  // produced roughly a third of the visual movement it should have,
  // reported as "very hard to swipe" on both Android and iPhone. Extracting
  // one shared measurement both functions call guarantees they can never
  // silently disagree again, rather than fixing the two call sites with
  // separately-maintained copies of the same formula.
  function measureMarqueeLoopWidth(track) {
    const kids = Array.from(track.children);
    const halfLen = Math.floor(kids.length / 2) || kids.length;
    return kids.slice(0, halfLen).reduce((sum, el) => {
      const style = getComputedStyle(el);
      return sum + el.getBoundingClientRect().width + (parseFloat(style.marginRight) || 0);
    }, 0);
  }

  // The markup for every marquee contains the card set TWICE, and the
  // keyframes translate by exactly -50% — one full copy. So one loop covers
  // half the track's real content width.
  function tuneMarqueeSpeed(track) {
    // The shared drift speed lives INSIDE this function on purpose. As a
    // module-level `const` it would be in the temporal dead zone at the
    // section-1.3 call; as a `tuneMarqueeSpeed.pxPerSecond = 40` statement it
    // would still be `undefined` at that call, because that assignment runs
    // ~1400 lines later in the IIFE body. Either way the arithmetic yields
    // NaN and we write "NaNs" into --marquee-duration, which makes the whole
    // `animation` shorthand invalid at computed-value time — animation-name
    // resolves to none and every row silently stops dead. A local const
    // cannot be sequenced wrong.
    const pxPerSecond = 40;
    // See measureMarqueeLoopWidth's comment above for why this can't just
    // read track.scrollWidth.
    const loopWidth = measureMarqueeLoopWidth(track);
    if (loopWidth <= 0) return;
    const seconds = Math.max(12, loopWidth / pxPerSecond);
    // Belt-and-braces: never write a non-finite value into the custom
    // property, for the invalid-at-computed-value-time reason above.
    if (!Number.isFinite(seconds)) return;

    // RC-27 FIX: this function re-runs any time a relayout is suspected
    // (the resize handler below, called for the exact reasons the RC-19
    // comment two lines down already names — address bar collapse,
    // orientation change, a late reflow) — and on a phone, that can happen
    // in the middle of an already-running animation, not just at page load.
    // `currentTime` is an absolute millisecond value; changing the CSS
    // duration underneath it without also adjusting `currentTime` shifts
    // what fraction of the loop that same absolute value now represents,
    // which is a visible jump to a different point in the track — on a
    // route that can fire from ordinary scrolling with no user interaction
    // at all. Capture the CURRENT position as a fraction of the OLD
    // duration before changing anything, then restore that same fraction
    // against the NEW duration afterward, so a speed retune can never move
    // the row's visual position, regardless of what any given engine would
    // have done left to its own devices.
    const anim = track.getAnimations()[0];
    const oldDuration = anim ? Number(anim.effect.getTiming().duration) || 0 : 0;
    const oldCurrentTime = anim ? Number(anim.currentTime) || 0 : 0;
    const progress = oldDuration > 0
      ? (((oldCurrentTime % oldDuration) + oldDuration) % oldDuration) / oldDuration
      : null;

    track.style.setProperty('--marquee-duration', seconds.toFixed(2) + 's');

    // RC-19 FIX: drive the keyframes with an absolute pixel distance rather
    // than -50%. A percentage translate resolves against the element's own
    // border-box width, and this element is `width: max-content` inside a
    // flex parent — a width the engine derives rather than is given. If that
    // resolution is ever even slightly out of step with the laid-out content
    // (a relayout mid-animation: address bar collapsing and changing svh,
    // an orientation change, a late reflow), the track stops travelling
    // exactly one copy per iteration. It then no longer lines up at the loop
    // point, and a strip of empty track shows at the seam — precisely the
    // "the countries end / there is blank space" report. A pixel distance
    // measured from the DOM cannot drift from the content it describes.
    // The CSS keeps `50%` as the var() fallback, so the animation is still
    // correct if this never runs.
    track.style.setProperty('--marquee-shift', Math.round(loopWidth) + 'px');

    if (progress !== null) {
      const liveAnim = track.getAnimations()[0];
      if (liveAnim) liveAnim.currentTime = progress * seconds * 1000;
    }
  }

  function marqueeTrackIn(row) {
    return row.querySelector('.marquee-inner, .continent-marquee-track');
  }

  // RC-28 FIX — the actual mechanism behind "the row ends and goes blank"
  // after some time. ensureMarqueeFill/tuneMarqueeSpeed only ever ran once,
  // from initMarquees' one-time setup below (or a full viewport resize).
  // Measured on a real WebKit run: a row's track can measure 660px right
  // after that one-time setup, then grow to 6248px roughly 300ms later —
  // module scripts are deferred, but that only guarantees the DOM is
  // parsed by the time they run, not that the external stylesheet has
  // finished loading AND applying. A getBoundingClientRect() read that
  // lands in that gap measures unstyled (or partially styled) layout,
  // dramatically smaller than the track's true, correctly-styled size.
  // Nothing ever re-measured to catch up: the RC-19 retry a few lines below
  // only re-tries a row that measured EXACTLY zero, which a too-small-but-
  // nonzero unstyled measurement never triggers, and no viewport resize
  // event fires just because a stylesheet finished loading after the DOM
  // did. The result: --marquee-shift stayed frozen at 330px — one tenth of
  // the track's real 3124px half-width — for the rest of the session. An
  // animation trying to represent 3124px of cards by only ever translating
  // 330px loops back far short of a real card boundary, which is the
  // visible seam behind "the row ends / there is blank space".
  //
  // A ResizeObserver on the track itself is the fix, rather than trying to
  // guess a longer delay before the one-time measurement: it reacts to the
  // track's ACTUAL rendered size changing for ANY reason — a late
  // stylesheet, a late web font, an image affecting layout, an orientation
  // change — instead of a fixed set of events assumed to cover every cause.
  // tuneMarqueeSpeed already preserves the animation's visual position
  // across a re-tune (RC-27), so a correction triggered here is never
  // itself a visible jump. Applies to every row initMarquees sets up —
  // Global Safari and Continents both share this same setup path and are
  // equally exposed to the same stylesheet-timing race.
  function watchMarqueeTrackWidth(row, track) {
    if (track.__marqueeResizeObserver || typeof ResizeObserver === 'undefined') return;
    let lastWidth = track.scrollWidth;
    const ro = new ResizeObserver(() => {
      const width = track.scrollWidth;
      if (width === lastWidth) return;
      lastWidth = width;
      // Same order as the one-time setup: fill first, it changes the
      // track's width, which is what tuneMarqueeSpeed then measures.
      ensureMarqueeFill(row, track);
      tuneMarqueeSpeed(track);
    });
    ro.observe(track);
    track.__marqueeResizeObserver = ro;
  }

  // RC-19: point a card at its width-capped derivative (see
  // generate_card_thumbs.py). A browser keeps a decoded bitmap at the file's
  // INTRINSIC size — 4 bytes per pixel — no matter how small the card is on
  // screen. These cards render at ~190x230 on a phone while the sources are
  // 1000x1250 and 1408x768, which measured 155 MB of decoded image data on
  // the Continents page. iOS Safari's ceiling is far below that, and it
  // reacts by discarding decoded images and layer backing stores, leaving a
  // row that still occupies its height and still animates but paints nothing.
  // The 480px-wide derivatives cut that 123.6 MB -> 25.8 MB (79%).
  function cardThumb(path) {
    if (!path || !path.startsWith('assets/') || path.startsWith('assets/card-thumbs/')) return path;
    return 'assets/card-thumbs/' + path.slice('assets/'.length);
  }

  // RC-17 FIX — the "short row" bug, and the real reason North America and
  // Antarctica were the continents that kept misbehaving.
  //
  // Every marquee ships its card set exactly TWICE and the keyframes
  // translate -50%, i.e. by one copy. That is only seamless if one copy is at
  // least as wide as the visible row. For most continents it is. It is not
  // for the short ones: measured at desktop width, Antarctica's whole track
  // was 1040px inside a 1286px wrapper — one copy is 520px, well under half
  // the viewport — and North America's copy was 780px. As such a row
  // animates, it slides its content out and there is simply nothing behind
  // it, so the row shows blank space and then snaps. Card count is exactly
  // what decides it, which is why the two continents with the fewest
  // destinations (North America 3, Antarctica 2) were the ones reported, and
  // why this looked like "images not loading" rather than a layout fault.
  //
  // Fix: repeat the set enough times that ONE half is at least as wide as the
  // wrapper, then mirror that half. The track stays exactly two identical
  // halves, so -50% remains exactly one copy and the loop stays seamless.
  function ensureMarqueeFill(row, track) {
    const wrapperWidth = row.getBoundingClientRect().width;
    if (!wrapperWidth) return;

    // Capture the pristine one-copy "unit" the first time only — at that
    // point the DOM still holds precisely the two copies the markup shipped.
    if (!track.__marqueeUnit) {
      const kids = Array.from(track.children);
      if (kids.length < 2) return;
      track.__marqueeUnit = kids.slice(0, Math.floor(kids.length / 2))
        .map((node) => node.cloneNode(true));
    }
    const unit = track.__marqueeUnit;
    if (!unit.length) return;

    const measure = (nodes) => nodes.reduce((sum, el) => {
      const style = getComputedStyle(el);
      return sum + el.getBoundingClientRect().width + (parseFloat(style.marginRight) || 0);
    }, 0);

    // Measure the unit as currently laid out, so this stays correct across
    // the mobile breakpoint where card widths change.
    const live = Array.from(track.children).slice(0, unit.length);
    const unitWidth = measure(live);
    if (unitWidth <= 0) return;

    const repeats = Math.max(1, Math.ceil(wrapperWidth / unitWidth));
    if (track.__marqueeRepeats === repeats) return;
    track.__marqueeRepeats = repeats;

    const frag = document.createDocumentFragment();
    for (let copy = 0; copy < repeats * 2; copy++) {
      unit.forEach((node) => {
        const clone = node.cloneNode(true);
        // Only the first half is the "real" content for assistive tech; the
        // mirrored half is decorative duplication.
        if (copy >= repeats) clone.setAttribute('aria-hidden', 'true');
        else clone.removeAttribute('aria-hidden');
        frag.appendChild(clone);
      });
    }
    track.replaceChildren(frag);
  }

  // RC-18: manual swipe/drag, restored — without a scroll container.
  //
  // RC-17 removed dragging and that was wrong: swiping a row is expected
  // behaviour on both phones, and losing it was reported immediately.
  //
  // The obvious way back is `overflow-x: auto` on the row. That is what
  // RC-10..RC-14 did and it is deliberately NOT what this does, for two
  // measured reasons:
  //   - It needs the auto-drift transform and the scroll offset to coexist.
  //     Because the drift can shift a full copy on top of whatever the user
  //     scrolled to, the track has to carry ~4 copies instead of 2 to
  //     guarantee content under the viewport at every combination. For the
  //     Asia row that is a ~10,000px-wide composited layer on a phone — the
  //     exact GPU pressure that makes iOS drop a row's backing store.
  //   - A real scroll container is what dragged in scroll-snap, momentum and
  //     touch-action conflicts, which is where the Android page-scroll
  //     regression came from.
  //
  // Instead the CSS animation stays the ONE source of motion, and a drag just
  // seeks it: moving the finger by dx sets the animation's currentTime to the
  // moment where the track sits dx further along. The loop stays infinite for
  // free, because the animation's own iteration is what wraps — the user can
  // drag forever in either direction and never reach an end. Card count and
  // layer width are completely unchanged.
  //
  // Two rules keep this from repeating the earlier Android bug (7fb77bd,
  // "pointer capture was hijacking scroll"):
  //   1. setPointerCapture is never called.
  //   2. preventDefault is never called, and every listener is passive — so
  //      the browser's own vertical page scrolling is untouched. A drag only
  //      engages once horizontal intent is unambiguous (|dx| > 10 AND
  //      |dx| > |dy|); a vertical swipe is simply never claimed.
  function enableMarqueeDrag(row, track) {
    let pointerDown = false;
    let engaged = false;
    let startX = 0;
    let startY = 0;
    // RC-27 FIX: this used to be "lastX", tracking the pointer's position at
    // pointerdown, and every pointermove re-derived currentTime from the
    // TOTAL distance travelled since then (dx = e.clientX - startX). That
    // makes the size of a single jump proportional to how far the whole
    // gesture has gone, not how far this one move event moved — a long, fast
    // real-finger swipe (or a browser coalescing/throttling pointermove
    // under load, which is exactly the condition already suspected
    // elsewhere in this file) can deliver a `dx` in the hundreds of pixels
    // in one event, which the duration/copyWidth ratio can turn into a jump
    // of several SECONDS of animation position in a single frame — the
    // track visually snaps to a completely different part of the loop
    // instead of panning, which reads as the row "disappearing" mid-swipe.
    // Tracking the position as of the LAST move event instead and only ever
    // applying the delta since then bounds every single adjustment to
    // whatever the finger actually moved between two consecutive events,
    // however large or small that gap was — it can never accumulate into a
    // one-shot large jump regardless of gesture speed or event coalescing.
    let lastX = 0;

    const currentAnimation = () => track.getAnimations()[0] || null;

    row.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const anim = currentAnimation();
      if (!anim) return;
      pointerDown = true;
      engaged = false;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
    }, { passive: true });

    row.addEventListener('pointermove', (e) => {
      if (!pointerDown) return;
      const anim = currentAnimation();
      if (!anim) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (!engaged) {
        // Vertical (or still ambiguous) — do not claim this gesture. The page
        // keeps scrolling exactly as the browser intends.
        if (Math.abs(dx) <= 10 || Math.abs(dx) <= Math.abs(dy)) return;
        engaged = true;
        // Pause via a CLASS, not animation.pause(). Mixing WAAPI play/pause
        // with the CSS animation-play-state that .marquee-idle also sets
        // leaves the two fighting for ownership of the same animation;
        // driving both from CSS keeps a single authority. Seeking
        // currentTime works whether or not it is paused.
        row.classList.add('marquee-dragging');
      }

      const duration = Number(anim.effect.getTiming().duration) || 0;
      // RC-32 FIX: one full iteration moves the track by exactly one copy —
      // but track.scrollWidth/2 (the old measurement here) is the same
      // unreliable WebKit read measureMarqueeLoopWidth's comment above
      // documents, inflated ~3x+ on these tracks. That made a real finger
      // swipe move the row roughly a third as far as the finger actually
      // travelled — reported as "very hard to swipe" on both Android and
      // iPhone. Using the same reliable measurement tuneMarqueeSpeed uses
      // for --marquee-shift restores accurate 1:1 finger tracking, and
      // guarantees this can never again silently disagree with the value
      // that actually drives the CSS animation.
      const copyWidth = measureMarqueeLoopWidth(track);
      if (!duration || !copyWidth) return;

      // RC-27: step is the delta since the LAST move event only — see the
      // comment on `lastX` above for why this replaces a total-since-start
      // delta.
      const stepDx = e.clientX - lastX;
      lastX = e.clientX;
      const startTime = Number(anim.currentTime) || 0;

      // Dragging right (stepDx > 0) should pull earlier content into view,
      // which means running the animation backwards.
      let t = startTime - stepDx * (duration / copyWidth);
      // Wrap into [0, duration) so dragging never hits an end in either
      // direction — this is what keeps the manual scroll infinite too.
      t = ((t % duration) + duration) % duration;
      anim.currentTime = t;
    }, { passive: true });

    const endDrag = () => {
      if (!pointerDown) return;
      pointerDown = false;
      // A drag ends with a click on whatever card was under the finger, which
      // would navigate to that package the moment the user let go — every
      // swipe would open a page. Swallow exactly one click, and only when a
      // drag actually engaged, so ordinary taps still open the card. Capture
      // phase, because the card handlers are delegated on document.
      if (engaged) {
        window.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        }, { capture: true, once: true });
      }
      engaged = false;
      // Motion resumes from wherever the user left it — no snap-back.
      row.classList.remove('marquee-dragging');
    };

    ['pointerup', 'pointercancel', 'pointerleave'].forEach((evt) => {
      row.addEventListener(evt, endDrag, { passive: true });
    });
  }

  // RC-21 FIX, widened by RC-23, re-scoped by RC-25 — the actual leak behind
  // a continent going blank partway through a scroll session, and why it
  // was never the same continent twice.
  //
  // The observer below has always toggled .marquee-idle, which releases the
  // GPU compositing layer (will-change) for an offscreen row. It has never
  // released the DECODED BITMAP behind each <img> — that stays cached by the
  // browser for as long as the element keeps that `src`, regardless of
  // whether the row is on screen. On the Continents page that means every
  // row the user scrolls past keeps its full image set resident for the rest
  // of the session: reach the 6th or 7th row and you are carrying the
  // decoded weight of every row before it, on top of that row's own. Memory
  // grows monotonically with scroll distance until iOS's ceiling is crossed,
  // at which point it silently evicts backing stores from whichever rows it
  // picks. That is why the failing continent was never consistent between
  // reports — it was never really about that specific row, it was about how
  // much had already piled up by the time the user scrolled to it.
  //
  // RC-21 scoped this to Continents only. RC-23 widened it to Global Safari
  // too, on real-device evidence that its row 1 — eager, never parked — was
  // the row reported blank, which is the signature of iOS evicting a decoded
  // backing store independent of any park/unpark state. RC-25 narrows this
  // back to Continents only, for a different reason than RC-21's original
  // one: Global Safari is 3 rows holding 18 unique images at their
  // compressed size — about 11 MB decoded, measured, nowhere near iOS's
  // ~80-120 MB ceiling. Continents is 7 rows that can hold noticeably more
  // depending on how far a user has scrolled. Extending the same stripping
  // machinery to a section that was never close to the ceiling that
  // motivated it added a hydration/restore timing path with nothing to
  // actually protect against — and real-device reports (rows stuck at 0
  // loaded, RC-24's investigation) are consistent with that timing path
  // itself being the problem, not memory pressure. Fewer moving parts on a
  // section with real headroom beats a defense against a failure mode that
  // section's own numbers don't support. Global Safari's images now load
  // once and stay — the RC-24 sweep still runs across every row regardless
  // (see below it) as a cheap, independent safety net for genuine network
  // failures, but has nothing to do here day to day since there is no
  // data-src or parked src left on these rows to find.
  //
  // Layout is unaffected: .country-photo-img / .card-bg are sized via CSS
  // (width/height: 100% of a fixed-size card, not the image's own intrinsic
  // size), so removing `src` cannot collapse any row.
  function setRowImagesParked(track, parked) {
    track.querySelectorAll('img').forEach((img) => {
      if (parked) {
        if (img.src) {
          img.dataset.parkedSrc = img.src;
          img.removeAttribute('src');
        }
      } else if (img.dataset.parkedSrc) {
        img.src = img.dataset.parkedSrc;
        delete img.dataset.parkedSrc;
      }
    });
  }

  // Safe to call more than once — the Continents page renders lazily, so this
  // runs again after those rows exist. Already-registered rows are skipped.
  function initMarquees() {
    const rows = document.querySelectorAll('.cards-grid, .continent-marquee-wrapper');
    if (!rows.length) return;

    if (!initMarquees.observer) {
      initMarquees.seen = new WeakSet();
      initMarquees.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // RC-24 FIX: `entries.forEach` has no per-entry error isolation —
          // if processing ANY entry throws, every entry queued after it in
          // THIS SAME BATCH is silently skipped, because the exception
          // propagates out of forEach entirely rather than just failing
          // that one iteration. A row skipped this way keeps whatever state
          // it already had (often still holding data-src, never hydrated)
          // and, if its intersection ratio never crosses a threshold again,
          // the observer has no reason to fire for it a second time — stuck
          // indefinitely, with nothing in the DOM or this debug panel
          // showing an error, because nothing ever threw where anyone could
          // see it. A user's real-device report of exactly this shape (one
          // row permanently stuck at 0 loaded while its siblings in the same
          // batch loaded fine) is what this guards against — try/catch here
          // cannot regress anything, since every statement inside was
          // already expected to succeed.
          try {
            const track = marqueeTrackIn(entry.target);
            if (!track) return;
            const idle = !entry.isIntersecting;
            // Note the polarity: we ADD .marquee-idle to park an offscreen
            // row, and rows animate by default in CSS. Never the reverse —
            // see the .marquee-idle comment in styles.css. If this callback
            // never fires (or stops firing) the rows keep animating, which
            // is the safe outcome; gating "is it running?" on this observer
            // is what would turn an observer hiccup into a permanently
            // frozen row.
            track.classList.toggle('marquee-idle', idle);
            // RC-21, widened RC-23, re-scoped RC-25: release/restore decoded
            // image memory for Continents rows only — see setRowImagesParked
            // above for why Global Safari no longer goes through this.
            if (track.classList.contains('continent-marquee-track')) {
              setRowImagesParked(track, idle);
            }
          } catch (err) {
            console.error('[marquee] observer entry failed, row skipped this batch:', err);
          }
        });
      }, {
        // Un-park a row well BEFORE it scrolls into view, so its layer (and,
        // as of RC-21, its images) is never re-created in the same frame
        // that first paints it.
        rootMargin: '250px 0px',
        threshold: 0
      });
    }

    rows.forEach((row) => {
      const track = marqueeTrackIn(row);
      if (!track || initMarquees.seen.has(row)) return;

      // RC-19 FIX: do NOT mark this row done until it could actually be
      // measured. Both ensureMarqueeFill and tuneMarqueeSpeed bail out when
      // the row measures 0 wide, which happens on a phone more often than on
      // a desktop: the Global Safari section is position:absolute at
      // top:85svh, so it can be laid out late, and iOS additionally relayouts
      // when the address bar collapses. Marking the row seen before that
      // check (as RC-17 did) permanently skipped filling AND left the default
      // duration, with no retry — a row could be left short for the whole
      // session, which is exactly "the cards run out and it goes blank".
      if (!row.getBoundingClientRect().width) {
        initMarquees.retry = true;
        return;
      }
      initMarquees.seen.add(row);
      // Order matters: fill first, because it changes the track's width and
      // therefore both the shift distance and the duration.
      ensureMarqueeFill(row, track);
      tuneMarqueeSpeed(track);
      enableMarqueeDrag(row, track);
      // RC-28: catch this same pair getting it wrong here (a stylesheet not
      // fully applied yet) and correct it automatically once the track's
      // real size is known — see watchMarqueeTrackWidth above.
      watchMarqueeTrackWidth(row, track);
      initMarquees.observer.observe(row);
    });

    // If any row was not measurable yet, come back for it. rAF lands after
    // the next layout, which is normally enough; the timer covers the case
    // where the section is still being positioned (late webfont, svh change,
    // image-driven reflow). Bounded so a permanently 0-width row cannot spin.
    if (initMarquees.retry && (initMarquees.retries = (initMarquees.retries || 0) + 1) <= 20) {
      initMarquees.retry = false;
      requestAnimationFrame(() => initMarquees());
      setTimeout(() => initMarquees(), 400);
    }
  }

  // Card widths change at the mobile breakpoint, so loop width — and
  // therefore the duration that keeps every row at the same speed — has to be
  // recomputed. Debounced: this reads layout, and it must never end up on a
  // per-frame path (a forced synchronous layout read inside the animation
  // frame is what RC-8 got wrong and RC-16 reverted).
  let marqueeResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(marqueeResizeTimer);
    marqueeResizeTimer = setTimeout(() => {
      document.querySelectorAll('.cards-grid, .continent-marquee-wrapper')
        .forEach((row) => {
          const track = marqueeTrackIn(row);
          if (!track) return;
          // Card widths change at the breakpoint, so a row that was wide
          // enough at desktop can become a short row on mobile (and vice
          // versa). Re-fill before re-timing, same order as init.
          ensureMarqueeFill(row, track);
          tuneMarqueeSpeed(track);
        });
    }, 200);
  });

  // RC-24 SAFETY NET — independent of the IntersectionObserver above on
  // purpose. Real-device evidence (a user's debug-panel screenshots) showed
  // a row that the panel itself reported as "not idle" — i.e. the observer
  // considers it near/onscreen — permanently stuck with its images never
  // hydrated, while sibling rows in the same section loaded normally. Two
  // candidate causes, neither disprovable from a Windows dev machine, and
  // both survivable by the same fix:
  //   1. entries.forEach in the observer above has no per-entry error
  //      isolation (see the try/catch added there in RC-24): one row's
  //      processing throwing silently skips every row queued after it in
  //      that batch, and if that row's intersection ratio never crosses a
  //      threshold again, the observer has no reason to ever revisit it.
  //   2. A genuinely failed image request (a real network error on a poor
  //      mobile connection, not merely a slow one) has no retry anywhere in
  //      this codebase — it just stays broken.
  // This sweep does not know or care which one happened. Every few seconds
  // it re-checks every row the observer currently considers active
  // (not .marquee-idle) and fixes anything inconsistent with that: an
  // un-hydrated data-src left over from a skipped batch, or a real `src`
  // that finished attempting and came back with naturalWidth 0. Re-setting
  // `src` to its own value forces the browser to re-request and re-decode —
  // recovery, not just detection. This is a second, independent path to the
  // same end state as the observer, so a failure in one does not depend on
  // the other to recover. Cheap: only touches rows already marked active,
  // and only images already showing a problem.
  window.__marqueeSweepFixCount = 0;
  function sweepStuckMarqueeImages() {
    document.querySelectorAll('.marquee-inner, .continent-marquee-track').forEach((track) => {
      if (track.classList.contains('marquee-idle')) return;
      track.querySelectorAll('img').forEach((img) => {
        if (img.hasAttribute('data-src')) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          window.__marqueeSweepFixCount++;
        } else if (img.getAttribute('src') && img.complete && img.naturalWidth === 0) {
          const src = img.getAttribute('src');
          img.removeAttribute('src');
          img.src = src;
          window.__marqueeSweepFixCount++;
        }
      });
    });
  }
  setInterval(sweepStuckMarqueeImages, 4000);

  function initContinentsHeroSlider() {
    const slides = document.querySelectorAll('.continents-hero-slide');
    if (!slides || slides.length === 0) return;
    let currentSlide = 0;

    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 4000);
  }

  // ==========================================================================
  // 10. INTERACTIVE TRAVEL AI CHATBOT WIDGET ("LOVE MY TOUR CAPTAIN")
  // ==========================================================================
  function initTravelAiChatbot() {
    const launcher = document.getElementById('travelAiLauncher');
    const windowEl = document.getElementById('travelAiWindow');
    const closeBtn = document.getElementById('travelAiClose');
    const bodyContainer = document.getElementById('travelAiBody');
    const quickButtons = document.getElementById('chatQuickButtons');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');

    if (!launcher || !windowEl) return;

    function toggleChat(open = null) {
      const isCurrentlyOpen = windowEl.classList.contains('open');
      const shouldOpen = open !== null ? open : !isCurrentlyOpen;

      if (shouldOpen) {
        windowEl.classList.add('open');
        windowEl.setAttribute('aria-hidden', 'false');
        if (chatInput) chatInput.focus();
      } else {
        windowEl.classList.remove('open');
        windowEl.setAttribute('aria-hidden', 'true');
      }
    }

    launcher.addEventListener('click', () => toggleChat());
    if (closeBtn) closeBtn.addEventListener('click', () => toggleChat(false));

    function appendUserMessage(text) {
      const userDiv = document.createElement('div');
      userDiv.className = 'chat-message user-message';
      userDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
      bodyContainer.appendChild(userDiv);
      bodyContainer.scrollTop = bodyContainer.scrollHeight;
    }

    function appendBotResponse(htmlText) {
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-message bot-message';
      botDiv.innerHTML = `
        <div class="bot-avatar-mini">
          <svg viewBox="0 0 100 100" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="#ffffff" />
            <line x1="50" y1="18" x2="50" y2="35" stroke="#6366f1" stroke-width="5" />
            <circle cx="50" cy="15" r="5" fill="#6366f1" />
            <rect x="22" y="32" width="56" height="42" rx="14" fill="#0f172a" />
            <rect x="16" y="44" width="10" height="18" rx="4" fill="#c7d2fe" />
            <rect x="74" y="44" width="10" height="18" rx="4" fill="#c7d2fe" />
            <circle cx="36" cy="48" r="5" fill="#ffffff" />
            <circle cx="64" cy="48" r="5" fill="#ffffff" />
            <path d="M40 60 Q 50 70 60 60" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
          </svg>
        </div>
        <div class="message-bubble">${htmlText}</div>
      `;
      bodyContainer.appendChild(botDiv);
      bodyContainer.scrollTop = bodyContainer.scrollHeight;
    }

    function handleBotQuery(type, customText = '') {
      if (type === 'packages') {
        appendBotResponse(`
          We operate top handpicked tour packages across Bali, Dubai, Thailand, Singapore, Maldives, Europe &amp; Kashmir!<br/><br/>
          <a href="https://wa.me/919703700576?text=Hi,%20I%20am%20asking%20about%20holiday%20packages" target="_blank" class="chat-wa-btn">💬 Chat on WhatsApp for Packages</a>
        `);
      } else if (type === 'domestic') {
        appendBotResponse(`
          Explore Kashmir, Kerala, Himachal, Leh-Ladakh, Goa, and Andaman customized according to your preferred travel dates and budget!<br/><br/>
          <a href="https://wa.me/919703700576?text=Hi,%20I%20am%20asking%20about%20domestic%20India%20packages" target="_blank" class="chat-wa-btn">💬 Enquire Domestic Tours on WhatsApp</a>
        `);
      } else if (type === 'continents') {
        appendBotResponse(`
          Discover iconic tourist spots across Asia, Africa, Europe, Americas, Antarctica &amp; Australia on our dedicated 7 Continents Page!<br/><br/>
          <a href="#continents" onclick="document.getElementById('travelAiWindow').classList.remove('open');" class="chat-wa-btn">🌍 View 7 Continents Page</a>
        `);
      } else if (type === 'contact') {
        appendBotResponse(`
          You can reach our Travel Captains directly via Call or WhatsApp for instant customized quotes:<br/><br/>
          📞 <strong>Phone:</strong> +91 97037 00576 / +91 97037 00576<br/>
          💬 <strong>WhatsApp:</strong> Direct enquiry available 24/7.<br/><br/>
          <a href="https://wa.me/919703700576?text=Hi,%20I%20need%20a%20customized%20tour%20quote" target="_blank" class="chat-wa-btn">💬 Direct WhatsApp Enquiry</a>
        `);
      } else {
        appendBotResponse(`
          Thank you for reaching out! Our Travel Captain is ready to customize your trip. Chat directly on WhatsApp for live itineraries:<br/><br/>
          <a href="https://wa.me/919703700576?text=Hi,%20I%20have%20a%20question:%20${encodeURIComponent(customText)}" target="_blank" class="chat-wa-btn">💬 Chat on WhatsApp</a>
        `);
      }
    }

    if (quickButtons) {
      quickButtons.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const query = btn.getAttribute('data-query');
          appendUserMessage(btn.innerText);
          setTimeout(() => handleBotQuery(query), 300);
        });
      });
    }

    function submitChatInput() {
      const text = chatInput.value.trim();
      if (!text) return;
      appendUserMessage(text);
      chatInput.value = '';
      setTimeout(() => handleBotQuery('custom', text), 400);
    }

    if (chatSendBtn) chatSendBtn.addEventListener('click', submitChatInput);
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitChatInput();
      });
    }
  }

  initTravelAiChatbot();
});

