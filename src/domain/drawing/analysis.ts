import type { DrawingElement } from './schema';
import { strokeLength } from './svgPath';

export interface DrawingSummary {
  /** Colour hex with the most ink (eraser strokes excluded). */
  dominantColor: string | null;
  /** Stamp ids in placement order, de-duplicated. */
  stamps: string[];
  strokeCount: number;
  stampCount: number;
}

/** Cheap summary used for friendly names and creation metadata. */
export function summarizeDrawing(elements: readonly DrawingElement[]): DrawingSummary {
  const ink = new Map<string, number>();
  const stamps: string[] = [];
  let strokeCount = 0;
  let stampCount = 0;

  for (const el of elements) {
    if (el.type === 'stroke') {
      strokeCount += 1;
      if (el.stroke.kind === 'eraser') continue;
      const weight = strokeLength(el.stroke.points) * el.stroke.width;
      ink.set(el.stroke.color, (ink.get(el.stroke.color) ?? 0) + weight);
    } else {
      stampCount += 1;
      if (!stamps.includes(el.stamp.stampId)) stamps.push(el.stamp.stampId);
      ink.set(el.stamp.color, (ink.get(el.stamp.color) ?? 0) + el.stamp.size * el.stamp.size * 0.5);
    }
  }

  let dominantColor: string | null = null;
  let best = -1;
  for (const [color, weight] of ink) {
    if (weight > best) {
      best = weight;
      dominantColor = color;
    }
  }
  return { dominantColor, stamps, strokeCount, stampCount };
}
