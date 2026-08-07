// Runs automatically before every build (see package.json "prebuild").
//
// packagesData.js / script.js reference images as plain runtime strings
// (e.g. `image: "assets/images/kenya.jpg"`), not as ES module imports.
// Vite's bundler only hashes/copies assets it can statically detect (a
// literal <img src="..."> in index.html, or a JS `import`) — a string built
// at runtime from a data object is invisible to it. Those files only make
// it into dist/ if they also exist, verbatim, under public/ (Vite's
// designated "copy as-is" folder). This script keeps public/assets/ an
// exact mirror of the real assets/ folder so that gap can never reopen,
// instead of relying on someone remembering to copy it by hand.
import { cpSync, rmSync, existsSync } from 'node:fs';

const SRC = 'assets';
const DEST = 'public/assets';

if (existsSync(DEST)) rmSync(DEST, { recursive: true, force: true });
cpSync(SRC, DEST, { recursive: true });

console.log(`Synced ${SRC}/ -> ${DEST}/`);
