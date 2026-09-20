import type { Point } from './schema';

/**
 * Converts raw pointer samples into a smooth SVG path using quadratic curves
 * through midpoints. A single point becomes a tiny segment so dots render.
 */
export function pointsToSvgPath(points: readonly Point[]): string {
  const first = points[0];
  if (!first) return '';
  if (points.length === 1) {
    return `M ${r(first.x)} ${r(first.y)} L ${r(first.x + 0.1)} ${r(first.y + 0.1)}`;
  }
  let d = `M ${r(first.x)} ${r(first.y)}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const p = points[i]!;
    const n = points[i + 1]!;
    const mx = (p.x + n.x) / 2;
    const my = (p.y + n.y) / 2;
    d += ` Q ${r(p.x)} ${r(p.y)} ${r(mx)} ${r(my)}`;
  }
  const last = points[points.length - 1]!;
  d += ` L ${r(last.x)} ${r(last.y)}`;
  return d;
}

function r(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** Total polyline length; used to weigh colours for friendly names. */
export function strokeLength(points: readonly Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1]!;
    const b = points[i]!;
    total += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return points.length === 1 ? 1 : total;
}
