// Regenerates the latin-subset variable fonts in src/fonts/ from the `geist`
// package. Run `pnpm fonts` after bumping geist, then commit the new woff2
// files. Not part of the build: the committed subsets are what next/font/local
// serves, so CI never needs this toolchain.
//
// Why subset at all: the package ships full-charset files (~70KB each); the
// site renders latin text plus ASCII box-drawing diagrams, which halves the
// transfer for every first-visit mobile user and pulls the font inside
// font-display: optional's 100ms block far more often.
import subsetFont from 'subset-font';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// geist's exports map blocks require.resolve of its font files, and
// layout.tsx already references them relatively, so do the same here.
const geist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../node_modules/geist/dist/fonts');

// Google's standard latin range plus what the site actually draws with these
// fonts: arrows, <=/>=, box drawing and geometric shapes (docs diagrams in
// GeistMono, caret glyphs in UI chrome). Chars missing from Geist itself
// (check marks, hamburger, command key) already fall back to system fonts.
const UNICODE_RANGES =
  '0000-00FF,0131,0152-0153,02BB-02BC,02C6,02DA,02DC,0304,0308,0329,' +
  '2000-206F,20AC,2122,2190-2199,2212,2215,2264-2265,2500-257F,25A0-25FF,FEFF,FFFD';

const codepoints = new Set();
for (const range of UNICODE_RANGES.split(',')) {
  const [start, end = start] = range.split('-').map((hex) => parseInt(hex, 16));
  for (let c = start; c <= end; c++) codepoints.add(c);
}
const text = [...codepoints].map((c) => String.fromCodePoint(c)).join('');

const outDir = new URL('../src/fonts/', import.meta.url);
fs.mkdirSync(outDir, { recursive: true });

const fonts = [
  ['geist-sans/Geist-Variable.woff2', 'Geist-Variable-latin.woff2'],
  ['geist-mono/GeistMono-Variable.woff2', 'GeistMono-Variable-latin.woff2'],
];

for (const [src, dest] of fonts) {
  const input = fs.readFileSync(path.join(geist, src));
  const output = await subsetFont(input, text, { targetFormat: 'woff2' });
  fs.writeFileSync(new URL(dest, outDir), output);
  console.log(`${dest}: ${(input.length / 1024).toFixed(0)}KB -> ${(output.length / 1024).toFixed(0)}KB`);
}
