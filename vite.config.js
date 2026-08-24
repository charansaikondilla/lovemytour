import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// This site deploys to two hosts with different URL shapes: Netlify serves
// it from the domain root ("/"), GitHub Pages serves it from a repo subpath
// ("/lovemytour/"). A hardcoded absolute base would break one or the other.
// A relative base ("./") makes every built asset path resolve relative to
// wherever index.html itself is served from, so the same dist/ build works
// unmodified on both — this is safe here specifically because the site uses
// hash-based routing (#continents, #spiritual, ...), so the browser only
// ever loads index.html at one fixed location; there are no path-based
// sub-routes that could resolve relative assets incorrectly.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      // The SPA plus a handful of separate, statically-crawlable landing
      // pages (real URLs, real content) so sections like Safari Adventures,
      // Continents, Asia, Europe and About Us can be indexed by Google as
      // their own pages — hash routes like #continents can never be, since
      // the fragment never reaches the server. These pages are plain HTML
      // that link back into the real app; they don't duplicate any of the
      // SPA's JS. Registering them as build entries (rather than dropping
      // static files straight into public/) is what lets each one's own
      // <link rel="stylesheet" href="../styles.css"> get resolved to the
      // same processed, content-hashed CSS the main site uses, instead of
      // needing a separately-maintained stale copy.
      input: {
        main: resolve(__dirname, 'index.html'),
        safariAdventures: resolve(__dirname, 'safari-adventures/index.html'),
        continents: resolve(__dirname, 'continents/index.html'),
        continentsAsia: resolve(__dirname, 'continents/asia/index.html'),
        continentsEurope: resolve(__dirname, 'continents/europe/index.html'),
        aboutUs: resolve(__dirname, 'about-us/index.html'),
        services: resolve(__dirname, 'services/index.html'),
        thailandPackages: resolve(__dirname, 'thailand-tour-packages/index.html'),
        maldivesPackages: resolve(__dirname, 'maldives-tour-packages/index.html'),
        malaysiaPackages: resolve(__dirname, 'malaysia-tour-packages/index.html'),
      },
    },
  },
});
