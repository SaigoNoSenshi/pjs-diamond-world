#!/usr/bin/env node
/**
 * Binary asset mirror.
 *
 * The GitHub connection used to publish this repository can only write text files, so
 * every binary asset (images, audio, icons) also lives as a base64 text twin under
 * `assets-mirror/` (same relative path + `.b64`). Either form can be regenerated from
 * the other:
 *
 *   node scripts/assets-mirror.mjs encode   # binaries → assets-mirror/**.b64 (run after changing an asset)
 *   node scripts/assets-mirror.mjs decode   # assets-mirror/**.b64 → binaries (runs on `npm install`; no-op when identical)
 *   node scripts/assets-mirror.mjs check    # fail if the two are out of sync (part of `npm run validate`)
 *
 * A checkout that has only the text twins (a fresh CI clone) gets its binaries on install;
 * a checkout that has both is verified in sync. No asset content is ever changed by this.
 */
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const MIRROR = path.join(root, 'assets-mirror');
const ROOTS = ['assets', 'public/icons'];
const BINARY = /\.(png|webp|jpe?g|gif|mp3|wav|ogg|ttf|otf|woff2?|ico)$/i;
const mode = process.argv[2] ?? 'check';

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const sha = (buf) => createHash('sha1').update(buf).digest('hex');
const rel = (p) => path.relative(root, p).split(path.sep).join('/');

async function binaries() {
  const files = [];
  for (const r of ROOTS) files.push(...(await walk(path.join(root, r))));
  return files.filter((f) => BINARY.test(f)).sort();
}
async function mirrors() {
  return (await walk(MIRROR)).filter((f) => f.endsWith('.b64')).sort();
}

if (mode === 'encode') {
  await fs.rm(MIRROR, { recursive: true, force: true });
  let n = 0;
  for (const f of await binaries()) {
    const target = path.join(MIRROR, rel(f) + '.b64');
    await fs.mkdir(path.dirname(target), { recursive: true });
    const b64 = (await fs.readFile(f)).toString('base64').replace(/(.{76})/g, '$1\n');
    await fs.writeFile(target, b64 + '\n');
    n += 1;
  }
  console.log(`assets-mirror: encoded ${n} binaries → assets-mirror/`);
} else if (mode === 'decode') {
  let written = 0;
  let same = 0;
  for (const m of await mirrors()) {
    const target = path.join(
      root,
      rel(m)
        .replace(/^assets-mirror\//, '')
        .replace(/\.b64$/, ''),
    );
    const bytes = Buffer.from((await fs.readFile(m, 'utf8')).replace(/\s+/g, ''), 'base64');
    let existing = null;
    try {
      existing = await fs.readFile(target);
    } catch {
      /* missing */
    }
    if (existing && sha(existing) === sha(bytes)) {
      same += 1;
      continue;
    }
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, bytes);
    written += 1;
  }
  console.log(`assets-mirror: decoded ${written} binaries (${same} already up to date)`);
} else {
  const bins = await binaries();
  const mirs = await mirrors();
  const problems = [];
  const mirrorSet = new Set(
    mirs.map((m) =>
      rel(m)
        .replace(/^assets-mirror\//, '')
        .replace(/\.b64$/, ''),
    ),
  );
  for (const f of bins) {
    const key = rel(f);
    if (!mirrorSet.has(key)) {
      problems.push(`missing mirror for ${key}`);
      continue;
    }
    const b64 = await fs.readFile(path.join(MIRROR, key + '.b64'), 'utf8');
    if (sha(Buffer.from(b64.replace(/\s+/g, ''), 'base64')) !== sha(await fs.readFile(f))) {
      problems.push(`mirror out of date for ${key}`);
    }
  }
  const binSet = new Set(bins.map(rel));
  for (const key of mirrorSet)
    if (!binSet.has(key)) problems.push(`stale mirror ${key}.b64 (binary removed)`);
  if (problems.length) {
    console.error('assets-mirror: OUT OF SYNC — run `node scripts/assets-mirror.mjs encode`');
    for (const p of problems) console.error('  ' + p);
    process.exit(1);
  }
  console.log(`assets-mirror: ${bins.length} binaries in sync`);
}
