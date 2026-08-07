import { destinationsData, continentsData, getPackageById } from './packagesData.js';

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

  // 1.3 SAFARI CAROUSEL — draggable, auto-scrolling marquee (see
  //     initDraggableMarquees, defined later in this file, for how the
  //     motion/drag itself works).
  initDraggableMarquees('.destinations-container .cards-grid', '.marquee-inner', {
    secondsPerLoop: 32,
    isReverse: (track) => track.classList.contains('marquee-reverse')
  });

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
    continents: document.getElementById('continents-view')
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
              <li class="fb-meta-star">${esc(pkg.rating)} &middot; ${esc(pkg.reviewsCount)} reviews</li>
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
            <div class="fb-fact"><dt>Rating</dt><dd>${esc(pkg.rating)} &middot; ${esc(pkg.reviewsCount)} reviews</dd></div>
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

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.open-enquiry-btn');
    if (trigger) {
      const pkgName = trigger.getAttribute('data-package') || trigger.getAttribute('data-destination') || 'General Holiday Package';
      if (enquiryPackageInput) enquiryPackageInput.value = pkgName;
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

      sendEnquiryToWhatsApp('NEW BOOKING ENQUIRY — Love My Tour', [
        ['Name', fieldValue('enquiry-name')],
        ['Phone', fieldValue('enquiry-phone')],
        ['Email', fieldValue('enquiry-email')],
        ['Destination / Package', fieldValue('enquiry-package')],
        ['Travel Dates / Requirements', fieldValue('enquiry-message')]
      ]);

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

      sendEnquiryToWhatsApp('NEW QUOTE REQUEST — Love My Tour', [
        ['Name', fieldValue('quote-name')],
        ['Phone', fieldValue('quote-phone')],
        ['Email', fieldValue('quote-email')],
        ['Destination', fieldValue('quote-destination')]
      ]);

      showEnquiryToast('Opening WhatsApp with your quote request… just press send.');
      heroQuoteForm.reset();
    });
  }

  // 6.3 CONTACT PAGE FORM → WHATSAPP (was a dead alert() that discarded the data)
  const contactPageForm = document.getElementById('contactPageForm');
  if (contactPageForm) {
    contactPageForm.addEventListener('submit', (e) => {
      e.preventDefault();

      sendEnquiryToWhatsApp('NEW CONTACT ENQUIRY — Love My Tour', [
        ['Name', fieldValue('contact-name')],
        ['Phone', fieldValue('contact-phone')],
        ['Preferred Destination', fieldValue('contact-destination')],
        ['Message / Travel Details', fieldValue('contact-msg')]
      ]);

      showEnquiryToast('Opening WhatsApp with your message… just press send.');
      contactPageForm.reset();
    });
  }

  // 6.4 CAREERS PAGE — "Apply Now" on a job card preselects that role in the
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

  // 6.5 CAREERS APPLICATION FORM → WHATSAPP
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
      { tx: -820, tz:  100, rotY:  40, scale: 1.05, opacity: 0, z: 1 },
      { tx: -640, tz:   60, rotY:  28, scale: 1.15, opacity: 1, z: 10 },
      { tx: -385, tz:  -30, rotY:  16, scale: 0.95, opacity: 1, z: 7 },
      { tx: -145, tz:  -80, rotY:   6, scale: 0.82, opacity: 1, z: 5 },
      { tx:  145, tz:  -80, rotY:  -6, scale: 0.82, opacity: 1, z: 5 },
      { tx:  385, tz:  -30, rotY: -16, scale: 0.95, opacity: 1, z: 7 },
      { tx:  640, tz:   60, rotY: -28, scale: 1.15, opacity: 1, z: 10 },
      { tx:  820, tz:  100, rotY: -40, scale: 1.05, opacity: 0, z: 1 },
    ];
    const DESKTOP_POS_MAP = [-4, -3, -2, -1, 1, 2, 3, 4];

    // MOBILE 3D CENTER-MAJOR SLOTS (Matching Reference Image 2)
    const MOBILE_SLOTS = [
      { tx: -250, tz: -60, rotY:  24, scale: 0.72, opacity: 0, z: 1 },
      { tx: -145, tz: -20, rotY:  14, scale: 0.84, opacity: 0.85, z: 6 },
      { tx:    0, tz:  40, rotY:   0, scale: 1.06, opacity: 1, z: 10 },
      { tx:  145, tz: -20, rotY: -14, scale: 0.84, opacity: 0.85, z: 6 },
      { tx:  250, tz: -60, rotY: -24, scale: 0.72, opacity: 0, z: 1 },
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
            <div class="continent-card-inner" style="background-image: url('${dest.image}');">
              <div class="continent-card-gradient"></div>
              <div class="continent-card-info">
                <div class="continent-card-header-row">
                  <h3 class="continent-card-name">${dest.title}</h3>
                  <span class="continent-card-pin">📍</span>
                </div>
                <div class="continent-card-duration">${dest.badge}</div>
                <div class="continent-card-footer-row">
                  <div class="continent-card-rating">
                    <span class="star-rating">4.8 ★</span>
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
            card.style.transform  = `translate(-50%, -50%) translate3d(${slotCfg.tx}px, 0, -300px) rotateY(${slotCfg.rotY * 1.5}deg) scale(0.4)`;
            card.style.opacity    = '0';
            card.style.zIndex     = slotCfg.z;
            card.style.pointerEvents = slotCfg.opacity === 0 ? 'none' : 'auto';

            const delay = slot * 55;
            setTimeout(() => {
              card.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease';
              card.style.transform = `translate(-50%, -50%) translate3d(${slotCfg.tx}px, 0, ${slotCfg.tz}px) rotateY(${slotCfg.rotY}deg) scale(${slotCfg.scale})`;
              card.style.opacity   = slotCfg.opacity;
            }, delay);
          } else {
            card.style.transition = 'none';
            card.style.transform = `translate(-50%, -50%) translate3d(${slotCfg.tx}px, 0, ${slotCfg.tz}px) rotateY(${slotCfg.rotY}deg) scale(${slotCfg.scale})`;
            card.style.opacity   = slotCfg.opacity;
            card.style.zIndex    = slotCfg.z;
            card.style.pointerEvents = slotCfg.opacity === 0 ? 'none' : 'auto';
            void card.offsetWidth;
            card.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease';
          }
        } else {
          card.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease';
          card.style.transform = `translate(-50%, -50%) translate3d(${slotCfg.tx}px, 0, ${slotCfg.tz}px) rotateY(${slotCfg.rotY}deg) scale(${slotCfg.scale})`;
          card.style.opacity   = slotCfg.opacity;
          card.style.zIndex    = slotCfg.z;
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

      let cardsHTML = '';
      const destList = cData.destinations || [];
      // Duplicate for seamless infinite auto-scroll loop
      const fullList = [...destList, ...destList];

      fullList.forEach((dest, i) => {
        const isHidden = i >= destList.length;
        cardsHTML += `
          <a href="#category/${dest.id}" class="country-photo-card"${isHidden ? ' aria-hidden="true"' : ''}>
            <img src="${dest.image}" alt="${dest.name}" class="country-photo-img" loading="lazy" decoding="async" />
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
    initDraggableMarquees('.continent-marquee-wrapper', '.continent-marquee-track', {
      secondsPerLoop: 30,
      isReverse: (track) => track.classList.contains('reverse')
    });
    initContinentsSearch();
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
          <img src="${d.image}" alt="" class="continents-search-result-img" loading="lazy" />
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
  // UNIFIED DRAGGABLE / AUTO-SCROLLING MARQUEE
  // Used by both the Global Safari rows (home page) and the Continents page
  // rows. Motion is 100% JS/requestAnimationFrame driven — never a CSS
  // @keyframes animation. That matters for two reasons:
  //   1. iOS Safari has a documented history (see the RC-3/RC-4 fixes
  //      elsewhere in styles.css) of silently pausing or losing track of
  //      long-running CSS animations, which is exactly what made the Global
  //      Safari rows appear to "stop" scrolling after a while on iPhone. A
  //      position value that this code increments and wraps every frame has
  //      no animation-iteration-count for the browser to lose track of.
  //   2. A plain CSS animation can't be manually dragged. Driving position
  //      from JS means drag-to-scroll (mouse or touch, via Pointer Events)
  //      is just "temporarily let the user set the position instead of the
  //      clock" — the same code path handles both.
  //
  // wrapperSelector: the overflow:hidden clipping element (drag target).
  // trackSelector: its child that actually holds the (duplicated-for-loop)
  //                cards and receives the translateX.
  // secondsPerLoop: how long one full pass through the (single, not
  //                 doubled) card set should take — lower is faster.
  // isReverse(track): return true if this particular track should scroll
  //                    the opposite direction (e.g. every other row).
  function initDraggableMarquees(wrapperSelector, trackSelector, { secondsPerLoop, isReverse }) {
    const wrappers = document.querySelectorAll(wrapperSelector);

    wrappers.forEach((wrapper) => {
      const track = wrapper.querySelector(trackSelector);
      if (!track) return;

      const reverse = isReverse(track);
      const direction = reverse ? 1 : -1; // -1 = drifts left, 1 = drifts right

      let loopWidth = track.scrollWidth / 2; // content is duplicated once for a seamless loop
      let position = 0;
      let dragging = false;
      let dragStartX = 0;
      let dragStartPosition = 0;
      let resumeAt = 0;   // performance.now() timestamp; autoplay stays off until this passes
      let lastFrameTime = null;
      // Only true while the row is actually on screen (IntersectionObserver
      // below) — skipping all work while scrolled away stops this row from
      // contributing to the GPU/main-thread load that builds up over a long
      // session elsewhere on the page. Every row still costs something even
      // off-screen if left running; this is the standard fix for that.
      let isVisible = true;

      function remeasure() {
        loopWidth = track.scrollWidth / 2;
      }
      window.addEventListener('resize', remeasure);

      const visibilityObserver = new IntersectionObserver(
        (entries) => { isVisible = entries[0].isIntersecting; },
        { threshold: 0 }
      );
      visibilityObserver.observe(wrapper);

      function wrapPosition() {
        if (loopWidth <= 0) return;
        // Keep position in (-loopWidth, 0] regardless of which direction it's
        // currently moving — this is what makes the loop seamless and, more
        // importantly, makes it structurally impossible for it to "end."
        while (position <= -loopWidth) position += loopWidth;
        while (position > 0) position -= loopWidth;
      }

      function applyTransform() {
        track.style.transform = `translateX(${position}px)`;
      }

      function frame(now) {
        if (lastFrameTime === null) lastFrameTime = now;
        // Clamp elapsed time: if the tab was backgrounded and rAF was
        // suspended (normal browser behavior), the next frame's "now" can
        // be minutes ahead of the last one. Without a clamp, position would
        // jump an enormous, essentially random distance in a single frame
        // the moment the tab becomes visible again — not the same bug as
        // rows disappearing, but the same family of "looks broken after
        // being away for a while."
        const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
        lastFrameTime = now;

        if (isVisible && !dragging && now >= resumeAt && loopWidth > 0) {
          const pxPerSecond = loopWidth / secondsPerLoop;
          position += direction * pxPerSecond * dt;
          wrapPosition();
          applyTransform();
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      // ── Manual drag: mouse + touch + pen, unified via Pointer Events ──
      // Direction-locked: a touch that starts on this row is NOT assumed to
      // be a drag. It only becomes one once movement is clearly more
      // horizontal than vertical past a small dead zone — until then we
      // never call setPointerCapture or touch `position`, so a normal
      // vertical page-scroll gesture that happens to start on top of this
      // row passes straight through untouched. Committing immediately (the
      // previous version of this code) captured the pointer on every touch,
      // which fights the browser's native scrolling and was corrupting/
      // visibly breaking whichever row a user's thumb happened to land on
      // when they scrolled past it — this is what was actually causing rows
      // to appear broken/invisible, not a GPU or animation issue.
      wrapper.style.touchAction = 'pan-y'; // let vertical page scroll pass through; JS owns confirmed horizontal drags
      const DRAG_THRESHOLD_PX = 6;

      let trackingPointerId = null;
      let downX = 0;
      let downY = 0;

      function onPointerDown(e) {
        trackingPointerId = e.pointerId;
        downX = e.clientX;
        downY = e.clientY;
        // Deliberately not setting dragging=true or capturing the pointer
        // yet — see onPointerMove.
      }

      function onPointerMove(e) {
        if (e.pointerId !== trackingPointerId) return;

        if (!dragging) {
          const dx = e.clientX - downX;
          const dy = e.clientY - downY;
          if (Math.abs(dx) < DRAG_THRESHOLD_PX && Math.abs(dy) < DRAG_THRESHOLD_PX) return;
          if (Math.abs(dy) >= Math.abs(dx)) {
            // Vertical intent — this is a page scroll, not a carousel drag.
            // Back off completely for the rest of this touch.
            trackingPointerId = null;
            return;
          }
          // Horizontal intent confirmed — commit to dragging from here.
          dragging = true;
          dragStartX = e.clientX;
          dragStartPosition = position;
          if (wrapper.setPointerCapture) {
            try { wrapper.setPointerCapture(e.pointerId); } catch (err) { /* no-op */ }
          }
        }

        position = dragStartPosition + (e.clientX - dragStartX);
        wrapPosition();
        applyTransform();
      }

      function endDrag(e) {
        trackingPointerId = null;
        if (!dragging) return;
        dragging = false;
        resumeAt = performance.now() + 500; // brief grace period so autoplay doesn't yank the row right after a release
      }

      wrapper.addEventListener('pointerdown', onPointerDown);
      wrapper.addEventListener('pointermove', onPointerMove);
      wrapper.addEventListener('pointerup', endDrag);
      wrapper.addEventListener('pointercancel', endDrag);
      wrapper.addEventListener('pointerleave', endDrag);
    });
  }

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

