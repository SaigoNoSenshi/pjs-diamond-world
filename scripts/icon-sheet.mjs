#!/usr/bin/env node
/**
 * Visual QA for data-driven icons: renders every spec in src/components/icons/extraIcons.ts
 * to a single HTML contact sheet (plain <svg>), so a designer or a reviewer can look at
 * all of them at once. Usage: node scripts/icon-sheet.mjs > /tmp/icons.html
 * (then screenshot it with any headless browser).
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

// Load the TS spec file through a tiny transpile: strip types via esbuild if present,
// otherwise a regex fallback for this simple, data-only module.
const file = path.resolve('src/components/icons/extraIcons.ts');
let source = readFileSync(file, 'utf8');
source = source
  .replace(/^import[^\n]*\n/gm, '')
  .replace(/export const extraIconSpecs: [^=]+=/, 'module.exports.extraIconSpecs =')
  .replace(/const placeholder = \(\): IconSpec =>/, 'const placeholder = () =>');
const require = createRequire(import.meta.url);
const m = { exports: {} };
new Function('module', 'exports', 'require', source)(m, m.exports, require);
const specs = m.exports.extraIconSpecs;

const C = '#FFD93D',
  A = '#FF7BAC',
  S = '#2D3142';
const color = (t, fb) =>
  t === undefined ? fb : t === 'c' ? C : t === 'a' ? A : t === 's' ? S : t === 'white' ? '#fff' : t;
const attrs = (el) =>
  `fill="${color(el.fill, 'none')}" stroke="${color(el.stroke, S)}" stroke-width="${el.strokeWidth ?? 6}" opacity="${el.opacity ?? 1}"`;
const render = (el) => {
  switch (el.kind) {
    case 'path':
      return `<path d="${el.d}" ${attrs(el)}/>`;
    case 'circle':
      return `<circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" ${attrs(el)}/>`;
    case 'ellipse':
      return `<ellipse cx="${el.cx}" cy="${el.cy}" rx="${el.rx}" ry="${el.ry}" ${attrs(el)}/>`;
    case 'rect':
      return `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${el.rx ?? 0}" ${attrs(el)}/>`;
    case 'polygon':
      return `<polygon points="${el.points}" ${attrs(el)}/>`;
    case 'line':
      return `<line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" ${attrs(el)}/>`;
    default:
      return '';
  }
};
const cells = Object.entries(specs)
  .map(
    ([name, spec]) =>
      `<div class="c"><svg viewBox="0 0 100 100" width="96" height="96" stroke-linejoin="round" stroke-linecap="round">${spec.elements.map(render).join('')}</svg><span>${name}</span></div>`,
  )
  .join('');
console.log(
  `<!doctype html><meta charset="utf-8"><style>body{font:14px sans-serif;background:#FFF7E6;margin:16px}.g{display:grid;grid-template-columns:repeat(8,120px);gap:12px}.c{background:#fff;border-radius:16px;padding:8px;text-align:center}</style><div class="g">${cells}</div>`,
);
