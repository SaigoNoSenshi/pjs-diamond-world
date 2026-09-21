import type { Point } from '@/domain/drawing/schema';

/**
 * Incremental SVG path building for the live stroke. Every function is a worklet so
 * the native canvas can extend the path on the UI thread inside gesture callbacks
 * without touching React or the JS thread. Mirrors `domain/drawing/svgPath.ts`
 * (quadratic curves through midpoints) so the live stroke and the committed stroke
 * look identical.
 */

function fmt(n: number): string {
  'worklet';
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** Path for a stroke that has a single point: a tiny segment so a dot renders. */
export function startLivePath(p: Point): string {
  'worklet';
  return `M ${fmt(p.x)} ${fmt(p.y)} L ${fmt(p.x + 0.1)} ${fmt(p.y + 0.1)}`;
}

/** Appends the curve through `prev` ending at the midpoint of `prev` and `next`. */
export function extendLivePath(d: string, prev: Point, next: Point): string {
  'worklet';
  const mx = (prev.x + next.x) / 2;
  const my = (prev.y + next.y) / 2;
  return `${d} Q ${fmt(prev.x)} ${fmt(prev.y)} ${fmt(mx)} ${fmt(my)}`;
}

/** Same threshold as the reducer: ignore samples closer than this to the last one. */
export const LIVE_MIN_DISTANCE = 1.5;

export function farEnough(prev: Point | null, next: Point): boolean {
  'worklet';
  return !prev || Math.hypot(prev.x - next.x, prev.y - next.y) >= LIVE_MIN_DISTANCE;
}
