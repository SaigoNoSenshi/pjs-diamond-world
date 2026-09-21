import type { GlyphStroke, UnitPoint } from './schema';

/**
 * Tracing evaluation — pure geometry, no React.
 *
 * A guide stroke is a polyline in the unit square. The child's finger path is scored
 * by COVERAGE: what fraction of the guide's sample points were passed within
 * `tolerance`. Direction and speed do not matter (a five-year-old traces however she
 * likes); staying near the line does. Wobbly strokes far outside the line are simply
 * ignored, never punished.
 */

/** Resample a polyline into points spaced ~`step` apart (unit-square units). */
export function resample(points: readonly UnitPoint[], step = 0.02): UnitPoint[] {
  const first = points[0];
  if (!first) return [];
  const out: UnitPoint[] = [first];
  let carry = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len === 0) continue;
    let t = step - carry;
    while (t <= len) {
      const k = t / len;
      out.push({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
      t += step;
    }
    carry = len - (t - step);
  }
  const last = points[points.length - 1]!;
  const tail = out[out.length - 1]!;
  if (Math.hypot(last.x - tail.x, last.y - tail.y) > step / 2) out.push(last);
  return out;
}

/** Shortest distance from point p to the polyline. */
export function distanceToPolyline(p: UnitPoint, line: readonly UnitPoint[]): number {
  let best = Infinity;
  for (let i = 1; i < line.length; i += 1) {
    const a = line[i - 1]!;
    const b = line[i]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const l2 = dx * dx + dy * dy;
    let t = l2 === 0 ? 0 : ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    const d = Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
    if (d < best) best = d;
  }
  if (line.length === 1) best = Math.hypot(p.x - line[0]!.x, p.y - line[0]!.y);
  return best;
}

/** Fraction (0..1) of the guide stroke that the child's strokes covered. */
export function coverage(
  guide: GlyphStroke,
  drawn: readonly (readonly UnitPoint[])[],
  tolerance: number,
): number {
  const samples = resample(guide.points);
  if (samples.length === 0) return 0;
  const drawnLines = drawn.filter((d) => d.length > 0);
  if (drawnLines.length === 0) return 0;
  let hit = 0;
  for (const s of samples) {
    if (drawnLines.some((line) => distanceToPolyline(s, line) <= tolerance)) hit += 1;
  }
  return hit / samples.length;
}

export const TRACE_PASS = 0.8;

export interface TraceEvaluation {
  /** Per guide stroke coverage 0..1. */
  perStroke: number[];
  overall: number;
  passed: boolean;
}

/** Evaluate all strokes; the glyph passes when every stroke is mostly covered. */
export function evaluateTrace(
  guide: readonly GlyphStroke[],
  drawn: readonly (readonly UnitPoint[])[],
  tolerance: number,
  pass = TRACE_PASS,
): TraceEvaluation {
  const perStroke = guide.map((g) => coverage(g, drawn, tolerance));
  const overall = perStroke.length ? perStroke.reduce((a, b) => a + b, 0) / perStroke.length : 0;
  return { perStroke, overall, passed: perStroke.every((c) => c >= pass) };
}

/** The dot where a stroke starts (shown so the child knows where to begin). */
export function strokeStart(stroke: GlyphStroke): UnitPoint {
  return stroke.points[0]!;
}

/** Guide polyline → SVG path in a `size`×`size` box. */
export function glyphStrokePath(stroke: GlyphStroke, size: number): string {
  return stroke.points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(p.x * size).toFixed(1)} ${(p.y * size).toFixed(1)}`)
    .join(' ');
}
