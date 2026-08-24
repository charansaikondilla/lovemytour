import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// base:'/' (absolute), NOT './'.
//
// The site is served from the root of its own custom domain
// (www.lovemytour.com — see public/CNAME), never from a repo subpath, so
// absolute asset URLs are correct. They are also *required* now: routes like
// /services/ and /packages/tantalizing-thailand/ are real directories written
// by generate-routes.mjs after this build, and a relative "./assets/..." in
// those pages would resolve against their own directory and 404. See the
// guard at the top of generate-routes.mjs, which fails the build if this is
// ever switched back.
export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      // Only two real entries now:
      //
      //   main — the app shell. generate-routes.mjs copies the built result
      //   to every route in routes.js with per-route <head> metadata, so each
      //   URL serves the actual live app rather than a stub that forwards.
      //
      //   safariAdventures — the one section with substantial standalone
      //   content and no matching .page-view inside the app, so it stays a
      //   hand-written page. Being a real entry is what lets its own
      //   <link rel="stylesheet" href="../styles.css"> resolve to the same
      //   processed, content-hashed CSS the app uses.
      //
      // The previously hand-written about-us/, services/, continents/ and
      // *-tour-packages/ pages are gone: those URLs are now generated from
      // the app shell instead, so visitors land on the real interactive site
      // at those addresses instead of a separate simplified copy.
      input: {
        main: resolve(__dirname, 'index.html'),
        safariAdventures: resolve(__dirname, 'safari-adventures/index.html'),
      },
    },
  },
});
