#!/usr/bin/env node
/**
 * Performance budget for the web build. Fails `npm run validate` (and CI) when the
 * app gets heavier than a child's tablet on home Wi-Fi should have to download.
 *
 * Budgets are gzip sizes because that is what travels over the network from any
 * static host (GitHub Pages, Netlify, Cloudflare all gzip/brotli by default).
 *
 * Baseline before Plan 3 (2026-09-19): entry 4.20 MB raw / 957 KB gzip, one chunk for
 * all routes, 5.2 MB of PNG, 1.1 MB of WAV. Budgets below are what we hold ourselves to
 * from now on; tighten them, never loosen them without a note in docs/BUILD_LOG.md.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = path.resolve(process.argv[2] ?? 'dist');
const BUDGET = {
  // Measured after Plan 3 / A1 (2026-09-19): entry 606 KB gzip. What remains is the
  // framework floor (expo-router + react-native-web + react-dom + reanimated ≈ 70%) plus
  // zod (~90 KB gzip, candidate for a zod/mini migration). Budget = measured + ~7%.
  entryGzipKB: 650, // main JS chunk (what must load before Diamond Island appears)
  totalJsGzipKB: 950, // every JS chunk together, incl. the never-loaded-by-default Firebase chunk
  assetsKB: 1000, // images + audio + icons shipped with the app (raw bytes)
  largestAssetKB: 160, // any single image/audio file
};

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const files = await walk(dist);
const js = files.filter((f) => f.endsWith('.js') && !f.endsWith('sw.js') && f.includes('_expo'));
const assets = files.filter((f) => /\.(webp|png|jpe?g|mp3|wav|ttf|otf)$/i.test(f));

const jsSizes = await Promise.all(
  js.map(async (f) => {
    const buf = await fs.readFile(f);
    return { file: path.relative(dist, f), raw: buf.length, gzip: gzipSync(buf).length };
  }),
);
jsSizes.sort((a, b) => b.gzip - a.gzip);
const entry = jsSizes.find((j) => path.basename(j.file).startsWith('entry-')) ?? jsSizes[0];
const totalJsGzip = jsSizes.reduce((a, j) => a + j.gzip, 0);

const assetSizes = await Promise.all(
  assets.map(async (f) => ({ file: path.relative(dist, f), raw: (await fs.stat(f)).size })),
);
assetSizes.sort((a, b) => b.raw - a.raw);
const totalAssets = assetSizes.reduce((a, s) => a + s.raw, 0);

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const rows = [
  ['entry JS (gzip)', entry?.gzip ?? 0, BUDGET.entryGzipKB * 1024],
  ['all JS (gzip)', totalJsGzip, BUDGET.totalJsGzipKB * 1024],
  ['assets (raw)', totalAssets, BUDGET.assetsKB * 1024],
  ['largest asset', assetSizes[0]?.raw ?? 0, BUDGET.largestAssetKB * 1024],
];

console.log(`bundle budget — ${jsSizes.length} JS chunks, ${assetSizes.length} assets`);
for (const j of jsSizes)
  console.log(`  ${kb(j.gzip).padStart(8)} gz  ${kb(j.raw).padStart(9)} raw  ${j.file}`);
if (assetSizes[0]) console.log(`  largest asset: ${kb(assetSizes[0].raw)} ${assetSizes[0].file}`);

let failed = false;
for (const [label, actual, limit] of rows) {
  const ok = actual <= limit;
  failed ||= !ok;
  console.log(
    `${ok ? 'OK  ' : 'FAIL'} ${label.padEnd(16)} ${kb(actual).padStart(8)} / ${kb(limit)}`,
  );
}
if (failed) {
  console.error('bundle budget exceeded — see scripts/check-bundle-budget.mjs');
  process.exit(1);
}
