/* ============================================================================
   ROUTE MANIFEST — single source of truth for every real URL on the site.

   The site used to be hash-routed (#about, #category/thailand, ...). A hash
   fragment is never sent to the server, so Google could only ever see ONE
   URL (the homepage) no matter which section was on screen — every section
   collapsed into the same search result, and none could rank on its own.

   Now every section has a real path. Two things consume this file:

     1. script.js  — matchRoute() turns location.pathname into the view to
        show, and buildPath() turns a view + id back into a URL for
        history.pushState navigation.

     2. generate-routes.mjs — runs after `vite build` and writes a real
        index.html at every path below, so GitHub Pages (which has no
        server-side rewriting and would otherwise 404) serves a genuine
        200 at each URL. Each generated file is the full app with its own
        <title>/<meta description>/<link canonical>, so the live site is
        what loads — no stub page, no redirect hop.

   Paths are stored WITHOUT a trailing slash and normalised on both sides;
   canonical URLs are emitted WITH one, matching how GitHub Pages serves a
   directory.
   ========================================================================== */

const SITE = 'https://www.lovemytour.com';

/** Strips leading/trailing slashes so '/a/b/' and 'a/b' compare equal. */
export function normalisePath(pathname) {
  return String(pathname || '').replace(/^\/+|\/+$/g, '');
}

/** The canonical, absolute URL for a route path ('' === homepage). */
export function canonicalUrl(path) {
  const clean = normalisePath(path);
  return clean ? `${SITE}/${clean}/` : `${SITE}/`;
}

/** Root-relative href for a route path, for use in the DOM. */
export function hrefFor(path) {
  const clean = normalisePath(path);
  return clean ? `/${clean}/` : '/';
}

/* -- Fixed, hand-authored sections ----------------------------------------
   These mirror the .page-view containers in index.html. `view` is the key
   used by handleRoute() in script.js. */
export const STATIC_ROUTES = [
  {
    path: '',
    view: 'home',
    title: 'Love My Tour - Outbound & Domestic Travel Packages | Hyderabad',
    description:
      'Love My Tour (Trilochan Travel Solutions) offers discount domestic and international tour packages, flight tickets, and expert travel guides from Hyderabad.'
  },
  {
    path: 'about-us',
    view: 'about',
    title: 'About Love My Tour — Hyderabad Travel Agency | Trilochan Travel Solutions',
    description:
      'Love My Tour by Trilochan Travel Solutions is a trusted Hyderabad-based travel company crafting customized holiday packages, luxury vacations, honeymoon tours, and complete travel solutions.'
  },
  {
    path: 'services',
    view: 'services',
    title: 'Services Offered By Love My Tour — Flights, Tours, Resorts & Visa | Hyderabad',
    description:
      'Services offered by Love My Tour: Domestic & International Flight Tickets, Tailored Tour Packages, Luxury Resorts & Stays, Express Visa Assistance, Private Transport, Local Tour Guides, and Travel Insurance.'
  },
  {
    path: 'contact',
    view: 'contact',
    title: 'Contact Love My Tour — Hyderabad Travel Agency | +91 8686555506',
    description:
      'Contact Love My Tour in Secunderabad, Hyderabad for custom holiday packages, flight bookings and visa assistance. Call +91 8686555506 or email info@lovemytour.com.'
  },
  {
    path: 'careers',
    view: 'careers',
    title: 'Careers at Love My Tour — Travel Jobs in Hyderabad',
    description:
      'Join the Love My Tour team in Secunderabad, Hyderabad. Current openings in travel sales, itinerary planning and operations.'
  },
  {
    path: 'popular',
    view: 'popular',
    title: 'Popular Destinations — Beach, City, Islands, Mountains & Safari | Love My Tour',
    description:
      'Browse our best-loved destinations by the kind of trip you want — beaches, cities, tropical forests, islands, mountains, and safaris & wildlife.'
  },
  {
    path: 'continents',
    view: 'continents',
    title: 'Explore the World by Continent — 7 Continents Guide | Love My Tour',
    description:
      'Discover handpicked tourist destinations across Asia, Africa, North America, South America, Antarctica, Europe and Australia with Love My Tour.'
  }
];

/* -- Routes that exist as their own hand-written static page ---------------
   These are NOT generated from the app shell — they have unique standalone
   content and stay as real Vite entries. Listed here only so the sitemap
   and the internal-link checker know about them. */
export const STANDALONE_ROUTES = [
  {
    path: 'safari-adventures',
    title: 'Global Safari Adventures — Big 5, Serengeti, Arctic & Amazon | Love My Tour',
    description:
      'Wildlife safari holidays across Africa, Asia, the Americas, the Arctic and Antarctica, arranged from Hyderabad by Love My Tour.'
  }
];

/**
 * Builds the full route table from the live package data.
 * Passing the data in (rather than importing it) keeps this file usable from
 * both the browser bundle and the Node build script without duplicating the
 * import path logic.
 */
export function buildRoutes(destinationsData, continentsData, popularCategories) {
  const routes = STATIC_ROUTES.map((r) => ({ ...r }));

  // /popular/<category>
  (popularCategories || []).forEach((cat) => {
    routes.push({
      path: `popular/${cat.key}`,
      view: 'popular',
      id: cat.key,
      title: `${cat.label} Destinations — Popular Trips | Love My Tour`,
      description: `Our best-loved ${cat.label.toLowerCase()} destinations, hand-picked across every continent by Love My Tour, Hyderabad.`
    });
  });

  // /continents/<continent>
  Object.values(continentsData || {}).forEach((cont) => {
    routes.push({
      path: `continents/${cont.id}`,
      view: 'continents',
      id: cont.id,
      title: `${cont.name} Tour Packages — ${cont.tagline} | Love My Tour`,
      description: cont.description
    });
  });

  // /<destination>-tour-packages
  Object.values(destinationsData || {}).forEach((dest) => {
    const name = String(dest.title || dest.id).replace(/\s+Packages$/i, '');
    routes.push({
      path: `${dest.id}-tour-packages`,
      view: 'category',
      id: dest.id,
      title: `${name} Tour Packages from Hyderabad | Love My Tour`,
      description: dest.description
    });
  });

  // /packages/<package>
  Object.values(destinationsData || {}).forEach((dest) => {
    (dest.packages || []).forEach((pkg) => {
      routes.push({
        path: `packages/${pkg.id}`,
        view: 'package',
        id: pkg.id,
        title: `${pkg.title} — ${pkg.duration}, ${pkg.price} | Love My Tour`,
        description: `${pkg.title}: ${pkg.duration} ${dest.title ? 'in ' + String(dest.title).replace(/\s+Packages$/i, '') : ''}. ${(pkg.highlights || []).slice(0, 3).join(', ')}. Book with Love My Tour, Hyderabad.`
      });
    });
  });

  return routes;
}

/**
 * pathname -> { view, id } for the client-side router.
 * Returns the home route for anything unrecognised, which matches the old
 * hash router's fall-through behaviour.
 */
export function matchRoute(pathname) {
  const clean = normalisePath(pathname);

  if (!clean) return { view: 'home', id: null };

  const segments = clean.split('/');

  if (segments.length === 1) {
    if (clean === 'about-us') return { view: 'about', id: null };
    if (clean === 'services') return { view: 'services', id: null };
    if (clean === 'contact') return { view: 'contact', id: null };
    if (clean === 'careers') return { view: 'careers', id: null };
    if (clean === 'popular') return { view: 'popular', id: null };
    if (clean === 'continents') return { view: 'continents', id: null };
    // /<destination>-tour-packages
    const destMatch = clean.match(/^(.+)-tour-packages$/);
    if (destMatch) return { view: 'category', id: destMatch[1] };
    return { view: 'home', id: null };
  }

  if (segments[0] === 'continents') return { view: 'continents', id: segments[1] };
  if (segments[0] === 'popular') return { view: 'popular', id: segments[1] };
  if (segments[0] === 'packages') return { view: 'package', id: segments[1] };
  if (segments[0] === 'careers' && segments[1] === 'apply') return { view: 'careers', id: 'apply' };

  return { view: 'home', id: null };
}

/** { view, id } -> root-relative href. Inverse of matchRoute. */
export function buildPath(view, id) {
  switch (view) {
    case 'home': return '/';
    case 'about': return '/about-us/';
    case 'services': return '/services/';
    case 'contact': return '/contact/';
    case 'careers': return id === 'apply' ? '/careers/apply/' : '/careers/';
    case 'popular': return id ? `/popular/${id}/` : '/popular/';
    case 'continents': return id ? `/continents/${id}/` : '/continents/';
    case 'category': return `/${id}-tour-packages/`;
    case 'package': return `/packages/${id}/`;
    default: return '/';
  }
}
