import { defineConfig } from 'vite';

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
});
