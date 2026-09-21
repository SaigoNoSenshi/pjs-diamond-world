import type { ExtraIconName, IconSpec } from './iconSpec';

export const extraIconSpecs: Record<ExtraIconName, IconSpec> = {
  // ── AQUATIC ─────────────────────────────────────────────────────────────────

  fish: {
    elements: [
      { kind: 'polygon', points: '70,32 92,50 70,68', fill: 'a', stroke: 's' },
      { kind: 'ellipse', cx: 44, cy: 50, rx: 26, ry: 18, fill: 'c', stroke: 's' },
      { kind: 'path', d: 'M36 32 Q48 22 60 32', fill: 'none', stroke: 's', strokeWidth: 5 },
      { kind: 'circle', cx: 26, cy: 46, r: 4, fill: 's', stroke: 'none' },
      { kind: 'path', d: 'M28 56 Q36 62 44 56', fill: 'none', stroke: 's', strokeWidth: 4 },
    ],
  },

  crab: {
    elements: [
      { kind: 'ellipse', cx: 50, cy: 66, rx: 28, ry: 20, fill: 'c', stroke: 's' },
      {
        kind: 'path',
        d: 'M22 58 C6 44 6 28 18 24 C28 20 32 32 24 40 L22 58 Z',
        fill: 'a',
        stroke: 's',
      },
      {
        kind: 'path',
        d: 'M78 58 C94 44 94 28 82 24 C72 20 68 32 76 40 L78 58 Z',
        fill: 'a',
        stroke: 's',
      },
      { kind: 'path', d: 'M34 48 L28 36 M66 48 L72 36', fill: 'none', stroke: 's', strokeWidth: 5 },
      { kind: 'circle', cx: 26, cy: 33, r: 5, fill: 's', stroke: 'none' },
      { kind: 'circle', cx: 74, cy: 33, r: 5, fill: 's', stroke: 'none' },
    ],
  },

  turtle: {
    elements: [
      { kind: 'ellipse', cx: 50, cy: 56, rx: 30, ry: 24, fill: 'c', stroke: 's' },
      {
        kind: 'path',
        d: 'M50 32 L50 80 M26 44 L74 68 M74 44 L26 68',
        fill: 'none',
        stroke: 'a',
        strokeWidth: 3,
      },
      { kind: 'circle', cx: 20, cy: 44, r: 12, fill: 'c', stroke: 's' },
      { kind: 'ellipse', cx: 36, cy: 82, rx: 10, ry: 6, fill: 'c', stroke: 's' },
      { kind: 'ellipse', cx: 72, cy: 82, rx: 10, ry: 6, fill: 'c', stroke: 's' },
      { kind: 'circle', cx: 14, cy: 40, r: 4, fill: 's', stroke: 'none' },
    ],
  },

  octopus: {
    elements: [
      {
        kind: 'path',
        d: 'M16 54 C16 24 84 24 84 54 C84 68 74 76 50 76 C26 76 16 68 16 54 Z',
        fill: 'c',
        stroke: 's',
      },
      {
        kind: 'path',
        d: 'M24 74 C20 82 26 88 22 96 M36 78 C34 86 40 90 36 98 M50 80 C50 88 54 92 50 100 M64 78 C66 86 60 90 64 98 M76 74 C80 82 74 88 78 96',
        fill: 'none',
        stroke: 's',
        strokeWidth: 7,
      },
      { kind: 'circle', cx: 38, cy: 46, r: 4, fill: 's', stroke: 'none' },
      { kind: 'circle', cx: 62, cy: 46, r: 4, fill: 's', stroke: 'none' },
      { kind: 'path', d: 'M42 60 Q50 66 58 60', fill: 'none', stroke: 's', strokeWidth: 4 },
    ],
  },

  starfish: {
    elements: [
      {
        kind: 'polygon',
        points: '50,10 61,38 92,38 68,57 78,86 50,68 22,86 32,57 8,38 39,38',
        fill: 'c',
        stroke: 's',
      },
      { kind: 'circle', cx: 50, cy: 50, r: 8, fill: 'a', stroke: 's', strokeWidth: 3 },
    ],
  },

  whale: {
    elements: [
      { kind: 'ellipse', cx: 44, cy: 54, rx: 36, ry: 24, fill: 'c', stroke: 's' },
      {
        kind: 'path',
        d: 'M80 46 C88 36 98 36 96 46 L80 54 L96 62 C98 70 88 68 80 58',
        fill: 'c',
        stroke: 's',
      },
      {
        kind: 'path',
        d: 'M14 62 Q44 76 74 64',
        fill: 'none',
        stroke: 'white',
        strokeWidth: 8,
        opacity: 0.5,
      },
      {
        kind: 'path',
        d: 'M18 30 C16 20 20 14 18 10 M24 30 C24 18 28 12 26 8',
        fill: 'none',
        stroke: 'a',
        strokeWidth: 5,
      },
      { kind: 'circle', cx: 20, cy: 50, r: 4, fill: 's', stroke: 'none' },
    ],
  },

  seahorse: {
    elements: [
      { kind: 'circle', cx: 64, cy: 22, r: 14, fill: 'c', stroke: 's' },
      { kind: 'line', x1: 64, y1: 22, x2: 84, y2: 20, stroke: 's', strokeWidth: 8 },
      {
        kind: 'path',
        d: 'M56 34 C44 46 34 50 34 62 C34 72 42 78 42 86 C42 94 38 98 36 100',
        fill: 'none',
        stroke: 'c',
        strokeWidth: 14,
      },
      {
        kind: 'path',
        d: 'M56 34 C44 46 34 50 34 62 C34 72 42 78 42 86 C42 94 38 98 36 100',
        fill: 'none',
        stroke: 's',
        strokeWidth: 6,
      },
      { kind: 'path', d: 'M70 16 C80 8 84 18 74 26', fill: 'a', stroke: 's', strokeWidth: 4 },
      { kind: 'circle', cx: 70, cy: 18, r: 4, fill: 's', stroke: 'none' },
    ],
  },

  // ── WEATHER ──────────────────────────────────────────────────────────────────

  sun: {
    elements: [
      { kind: 'circle', cx: 50, cy: 50, r: 24, fill: 'c', stroke: 's' },
      {
        kind: 'path',
        d: 'M50 8 L50 22 M78 22 L68 32 M92 50 L78 50 M78 78 L68 68 M50 92 L50 78 M22 78 L32 68 M8 50 L22 50 M22 22 L32 32',
        fill: 'none',
        stroke: 'a',
        strokeWidth: 6,
      },
    ],
  },

  moon: {
    elements: [
      {
        kind: 'path',
        d: 'M64 14 C42 14 16 30 16 50 C16 70 42 86 64 86 C54 82 48 68 50 50 C52 32 56 18 64 14 Z',
        fill: 'c',
        stroke: 's',
      },
    ],
  },

  cloud: {
    elements: [
      {
        kind: 'path',
        d: 'M20 74 Q12 74 12 62 Q12 50 24 50 Q22 36 38 34 Q40 22 56 26 Q62 18 76 22 Q88 22 88 36 Q96 36 96 50 Q96 62 86 66 Q92 74 80 74 Z',
        fill: 'c',
        stroke: 's',
      },
    ],
  },

  rain: {
    elements: [
      {
        kind: 'path',
        d: 'M20 58 Q12 58 12 46 Q12 34 24 34 Q22 20 38 18 Q40 8 56 12 Q62 4 76 8 Q88 8 88 22 Q96 22 96 36 Q96 48 86 52 Q92 58 80 58 Z',
        fill: 'c',
        stroke: 's',
      },
      {
        kind: 'path',
        d: 'M28 72 L24 86 M50 72 L46 86 M72 72 L68 86',
        fill: 'none',
        stroke: 'a',
        strokeWidth: 5,
      },
    ],
  },

  // ── NATURE ───────────────────────────────────────────────────────────────────

  tree: {
    elements: [
      { kind: 'rect', x: 42, y: 64, width: 16, height: 28, rx: 4, fill: 'a', stroke: 's' },
      { kind: 'circle', cx: 50, cy: 44, r: 32, fill: 'c', stroke: 's' },
    ],
  },

  house: {
    elements: [
      { kind: 'rect', x: 14, y: 46, width: 72, height: 44, rx: 4, fill: 'c', stroke: 's' },
      { kind: 'polygon', points: '8,50 50,14 92,50', fill: 'a', stroke: 's' },
      { kind: 'rect', x: 38, y: 64, width: 24, height: 26, rx: 4, fill: 's', stroke: 's' },
    ],
  },

  boat: {
    elements: [
      { kind: 'path', d: 'M8 62 C8 80 24 88 50 88 C76 88 92 80 92 62 Z', fill: 'c', stroke: 's' },
      { kind: 'line', x1: 50, y1: 62, x2: 50, y2: 16, stroke: 's', strokeWidth: 5 },
      { kind: 'path', d: 'M50 20 L84 56 L50 56 Z', fill: 'a', stroke: 's' },
      { kind: 'line', x1: 4, y1: 62, x2: 96, y2: 62, stroke: 's', strokeWidth: 4 },
    ],
  },

  // ── FOOD ─────────────────────────────────────────────────────────────────────

  apple: {
    elements: [
      { kind: 'path', d: 'M50 24 C50 14 58 8 60 14', fill: 'none', stroke: 's', strokeWidth: 5 },
      {
        kind: 'path',
        d: 'M50 22 C54 12 68 14 66 22 C60 18 54 18 50 22 Z',
        fill: 'a',
        stroke: 's',
        strokeWidth: 3,
      },
      {
        kind: 'path',
        d: 'M50 26 C34 26 14 38 14 56 C14 76 30 90 50 90 C70 90 86 76 86 56 C86 38 66 26 50 26 Z',
        fill: 'c',
        stroke: 's',
      },
    ],
  },

  banana: {
    elements: [
      {
        kind: 'path',
        d: 'M20 82 C14 58 18 28 46 14 C66 6 86 14 90 28 C82 32 70 28 60 30 C44 34 32 52 32 74 C32 80 28 86 20 82 Z',
        fill: 'c',
        stroke: 's',
      },
      { kind: 'path', d: 'M28 78 C28 60 38 44 52 36', fill: 'none', stroke: 'a', strokeWidth: 4 },
    ],
  },

  mango: {
    elements: [
      {
        kind: 'path',
        d: 'M50 88 C30 88 12 70 12 50 C12 30 28 14 48 14 C60 12 72 18 78 30 C84 42 84 58 78 70 C72 82 62 88 50 88 Z',
        fill: 'c',
        stroke: 's',
      },
      {
        kind: 'path',
        d: 'M48 14 C44 4 62 4 60 14 C56 10 52 10 48 14 Z',
        fill: 'a',
        stroke: 's',
        strokeWidth: 3,
      },
      { kind: 'line', x1: 50, y1: 14, x2: 50, y2: 8, stroke: 's', strokeWidth: 5 },
    ],
  },

  coconut: {
    elements: [
      { kind: 'circle', cx: 50, cy: 56, r: 34, fill: '#8B4513', stroke: 's' },
      {
        kind: 'path',
        d: 'M38 22 C36 14 42 10 44 18 M50 20 C50 12 56 10 56 18 M62 22 C64 14 70 12 68 20',
        fill: 'none',
        stroke: '#5D2E0C',
        strokeWidth: 4,
      },
      { kind: 'circle', cx: 40, cy: 50, r: 5, fill: '#2D1A0E', stroke: 'none' },
      { kind: 'circle', cx: 60, cy: 50, r: 5, fill: '#2D1A0E', stroke: 'none' },
      { kind: 'circle', cx: 50, cy: 64, r: 5, fill: '#2D1A0E', stroke: 'none' },
    ],
  },

  carrot: {
    elements: [
      { kind: 'path', d: 'M38 28 L62 28 L54 88 L46 88 Z', fill: 'c', stroke: 's' },
      {
        kind: 'path',
        d: 'M50 28 C44 14 30 8 34 18 C38 12 44 8 46 16 C46 6 54 4 54 14 C54 6 62 8 60 18 C64 10 70 14 66 24',
        fill: 'a',
        stroke: 's',
        strokeWidth: 4,
      },
    ],
  },

  rice: {
    elements: [
      {
        kind: 'path',
        d: 'M12 62 C12 82 28 92 50 92 C72 92 88 82 88 62 L88 58 L12 58 Z',
        fill: 'a',
        stroke: 's',
      },
      { kind: 'ellipse', cx: 50, cy: 58, rx: 38, ry: 8, fill: 'white', stroke: 's' },
      { kind: 'ellipse', cx: 50, cy: 48, rx: 30, ry: 16, fill: 'white', stroke: 's' },
    ],
  },

  // ── ANIMALS ──────────────────────────────────────────────────────────────────

  cat: {
    elements: [
      { kind: 'polygon', points: '18,40 28,14 42,38', fill: 'c', stroke: 's' },
      { kind: 'polygon', points: '58,38 72,14 82,40', fill: 'c', stroke: 's' },
      { kind: 'circle', cx: 50, cy: 56, r: 32, fill: 'c', stroke: 's' },
      { kind: 'circle', cx: 38, cy: 50, r: 4, fill: 's', stroke: 'none' },
      { kind: 'circle', cx: 62, cy: 50, r: 4, fill: 's', stroke: 'none' },
      { kind: 'path', d: 'M46 62 L50 66 L54 62 Z', fill: 'a', stroke: 's', strokeWidth: 2 },
      {
        kind: 'path',
        d: 'M16 60 L38 64 M16 68 L38 70 M62 64 L84 60 M62 70 L84 68',
        fill: 'none',
        stroke: 's',
        strokeWidth: 3,
      },
    ],
  },

  dog: {
    elements: [
      { kind: 'ellipse', cx: 24, cy: 48, rx: 12, ry: 20, fill: 'a', stroke: 's' },
      { kind: 'ellipse', cx: 76, cy: 48, rx: 12, ry: 20, fill: 'a', stroke: 's' },
      { kind: 'circle', cx: 50, cy: 52, r: 30, fill: 'c', stroke: 's' },
      { kind: 'circle', cx: 38, cy: 46, r: 4, fill: 's', stroke: 'none' },
      { kind: 'circle', cx: 62, cy: 46, r: 4, fill: 's', stroke: 'none' },
      { kind: 'ellipse', cx: 50, cy: 62, rx: 8, ry: 6, fill: 's', stroke: 'none' },
      { kind: 'path', d: 'M44 70 Q50 78 56 70', fill: 'none', stroke: 's', strokeWidth: 4 },
    ],
  },

  bird: {
    elements: [
      { kind: 'ellipse', cx: 52, cy: 60, rx: 26, ry: 20, fill: 'c', stroke: 's' },
      { kind: 'circle', cx: 30, cy: 38, r: 18, fill: 'c', stroke: 's' },
      { kind: 'path', d: 'M54 52 C64 44 80 42 82 54', fill: 'a', stroke: 's' },
      { kind: 'polygon', points: '12,36 6,40 12,44', fill: 'a', stroke: 's' },
      { kind: 'circle', cx: 24, cy: 34, r: 4, fill: 's', stroke: 'none' },
    ],
  },

  frog: {
    elements: [
      { kind: 'circle', cx: 32, cy: 22, r: 14, fill: 'c', stroke: 's' },
      { kind: 'circle', cx: 68, cy: 22, r: 14, fill: 'c', stroke: 's' },
      { kind: 'ellipse', cx: 50, cy: 58, rx: 36, ry: 28, fill: 'c', stroke: 's' },
      { kind: 'circle', cx: 32, cy: 22, r: 6, fill: 's', stroke: 'none' },
      { kind: 'circle', cx: 68, cy: 22, r: 6, fill: 's', stroke: 'none' },
      { kind: 'path', d: 'M28 66 Q50 84 72 66', fill: 'none', stroke: 's', strokeWidth: 5 },
    ],
  },

  butterfly: {
    elements: [
      { kind: 'ellipse', cx: 28, cy: 36, rx: 22, ry: 28, fill: 'c', stroke: 's' },
      { kind: 'ellipse', cx: 72, cy: 36, rx: 22, ry: 28, fill: 'c', stroke: 's' },
      { kind: 'ellipse', cx: 30, cy: 68, rx: 16, ry: 14, fill: 'a', stroke: 's' },
      { kind: 'ellipse', cx: 70, cy: 68, rx: 16, ry: 14, fill: 'a', stroke: 's' },
      { kind: 'ellipse', cx: 50, cy: 54, rx: 6, ry: 24, fill: 's', stroke: 's' },
    ],
  },

  bee: {
    elements: [
      {
        kind: 'ellipse',
        cx: 34,
        cy: 36,
        rx: 16,
        ry: 10,
        fill: 'white',
        stroke: 's',
        strokeWidth: 4,
        opacity: 0.85,
      },
      {
        kind: 'ellipse',
        cx: 66,
        cy: 36,
        rx: 16,
        ry: 10,
        fill: 'white',
        stroke: 's',
        strokeWidth: 4,
        opacity: 0.85,
      },
      { kind: 'ellipse', cx: 50, cy: 60, rx: 20, ry: 28, fill: 'c', stroke: 's' },
      {
        kind: 'path',
        d: 'M30 54 Q50 50 70 54 M30 64 Q50 60 70 64 M32 74 Q50 70 68 74',
        fill: 'none',
        stroke: 's',
        strokeWidth: 5,
      },
      { kind: 'path', d: 'M50 88 L50 96', fill: 'none', stroke: 's', strokeWidth: 5 },
      { kind: 'circle', cx: 42, cy: 42, r: 4, fill: 's', stroke: 'none' },
    ],
  },

  // ── OBJECTS ──────────────────────────────────────────────────────────────────

  ball: {
    elements: [
      { kind: 'circle', cx: 50, cy: 50, r: 38, fill: 'c', stroke: 's' },
      { kind: 'path', d: 'M14 38 C28 46 40 68 32 80', fill: 'none', stroke: 'a', strokeWidth: 5 },
      { kind: 'path', d: 'M50 12 C56 32 56 68 50 88', fill: 'none', stroke: 'a', strokeWidth: 5 },
      { kind: 'path', d: 'M86 38 C72 46 60 68 68 80', fill: 'none', stroke: 'a', strokeWidth: 5 },
    ],
  },

  cup: {
    elements: [
      { kind: 'path', d: 'M16 32 L22 84 L78 84 L84 32 Z', fill: 'c', stroke: 's' },
      { kind: 'path', d: 'M84 42 C98 42 98 72 84 72', fill: 'none', stroke: 's', strokeWidth: 7 },
      { kind: 'rect', x: 14, y: 24, width: 72, height: 12, rx: 4, fill: 'a', stroke: 's' },
    ],
  },

  chair: {
    elements: [
      { kind: 'rect', x: 14, y: 14, width: 72, height: 12, rx: 4, fill: 'c', stroke: 's' },
      { kind: 'rect', x: 14, y: 14, width: 12, height: 46, rx: 4, fill: 'c', stroke: 's' },
      { kind: 'rect', x: 74, y: 14, width: 12, height: 46, rx: 4, fill: 'c', stroke: 's' },
      { kind: 'rect', x: 14, y: 48, width: 72, height: 12, rx: 4, fill: 'c', stroke: 's' },
      { kind: 'rect', x: 16, y: 60, width: 12, height: 28, rx: 4, fill: 'a', stroke: 's' },
      { kind: 'rect', x: 72, y: 60, width: 12, height: 28, rx: 4, fill: 'a', stroke: 's' },
    ],
  },

  rock: {
    elements: [
      {
        kind: 'path',
        d: 'M20 80 C10 60 14 36 28 26 C42 14 64 18 76 30 C88 42 88 64 78 78 C68 90 30 90 20 80 Z',
        fill: 'c',
        stroke: 's',
      },
      {
        kind: 'path',
        d: 'M24 72 C22 58 28 42 38 36',
        fill: 'none',
        stroke: 'white',
        strokeWidth: 5,
        opacity: 0.4,
      },
    ],
  },

  spoon: {
    elements: [
      { kind: 'ellipse', cx: 50, cy: 28, rx: 18, ry: 16, fill: 'c', stroke: 's' },
      { kind: 'rect', x: 44, y: 38, width: 12, height: 54, rx: 6, fill: 'c', stroke: 's' },
    ],
  },

  jeepney: {
    elements: [
      { kind: 'rect', x: 4, y: 18, width: 86, height: 16, rx: 8, fill: 'a', stroke: 's' },
      { kind: 'rect', x: 8, y: 28, width: 84, height: 48, rx: 6, fill: 'c', stroke: 's' },
      {
        kind: 'rect',
        x: 76,
        y: 32,
        width: 16,
        height: 22,
        rx: 4,
        fill: 'white',
        stroke: 's',
        strokeWidth: 3,
      },
      {
        kind: 'rect',
        x: 8,
        y: 50,
        width: 66,
        height: 8,
        rx: 2,
        fill: 'a',
        stroke: 'none',
        opacity: 0.7,
      },
      { kind: 'circle', cx: 24, cy: 80, r: 10, fill: 's', stroke: 's' },
      { kind: 'circle', cx: 72, cy: 80, r: 10, fill: 's', stroke: 's' },
    ],
  },

  // ── GEOMETRIC SHAPES ─────────────────────────────────────────────────────────

  circle: {
    elements: [{ kind: 'circle', cx: 50, cy: 50, r: 38, fill: 'c', stroke: 's' }],
  },

  square: {
    elements: [
      { kind: 'rect', x: 12, y: 12, width: 76, height: 76, rx: 4, fill: 'c', stroke: 's' },
    ],
  },

  triangle: {
    elements: [{ kind: 'polygon', points: '50,10 90,88 10,88', fill: 'c', stroke: 's' }],
  },

  rectangle: {
    elements: [{ kind: 'rect', x: 8, y: 26, width: 84, height: 48, rx: 4, fill: 'c', stroke: 's' }],
  },

  oval: {
    elements: [{ kind: 'ellipse', cx: 50, cy: 50, rx: 40, ry: 26, fill: 'c', stroke: 's' }],
  },

  hexagon: {
    elements: [
      { kind: 'polygon', points: '50,10 88,30 88,70 50,90 12,70 12,30', fill: 'c', stroke: 's' },
    ],
  },

  // ── BODY PARTS ────────────────────────────────────────────────────────────────

  eye: {
    elements: [
      { kind: 'path', d: 'M8 50 C8 30 92 30 92 50 C92 70 8 70 8 50 Z', fill: 'white', stroke: 's' },
      { kind: 'circle', cx: 50, cy: 50, r: 18, fill: 'c', stroke: 's', strokeWidth: 3 },
      { kind: 'circle', cx: 50, cy: 50, r: 9, fill: 's', stroke: 'none' },
      { kind: 'circle', cx: 56, cy: 44, r: 4, fill: 'white', stroke: 'none' },
    ],
  },

  ear: {
    elements: [
      {
        kind: 'path',
        d: 'M30 12 C14 12 8 28 8 50 C8 72 14 88 30 88 L44 80 C34 72 26 62 26 50 C26 38 34 28 44 20 Z',
        fill: 'c',
        stroke: 's',
      },
      {
        kind: 'path',
        d: 'M38 28 C30 38 28 46 30 54 C32 62 38 70 44 76',
        fill: 'none',
        stroke: 'a',
        strokeWidth: 5,
      },
    ],
  },

  hand: {
    elements: [
      { kind: 'rect', x: 24, y: 46, width: 52, height: 38, rx: 12, fill: 'c', stroke: 's' },
      { kind: 'rect', x: 10, y: 52, width: 18, height: 24, rx: 9, fill: 'c', stroke: 's' },
      { kind: 'rect', x: 26, y: 14, width: 12, height: 36, rx: 6, fill: 'c', stroke: 's' },
      { kind: 'rect', x: 40, y: 10, width: 12, height: 40, rx: 6, fill: 'c', stroke: 's' },
      { kind: 'rect', x: 54, y: 14, width: 12, height: 36, rx: 6, fill: 'c', stroke: 's' },
      { kind: 'rect', x: 68, y: 22, width: 10, height: 28, rx: 5, fill: 'c', stroke: 's' },
    ],
  },

  nose: {
    elements: [
      {
        kind: 'path',
        d: 'M50 16 C44 36 34 58 32 70 C30 78 36 84 50 84 C64 84 70 78 68 70 C66 58 56 36 50 16 Z',
        fill: 'c',
        stroke: 's',
      },
      { kind: 'ellipse', cx: 38, cy: 76, rx: 6, ry: 4, fill: 'a', stroke: 's', strokeWidth: 3 },
      { kind: 'ellipse', cx: 62, cy: 76, rx: 6, ry: 4, fill: 'a', stroke: 's', strokeWidth: 3 },
    ],
  },

  mouth: {
    elements: [
      {
        kind: 'path',
        d: 'M18 44 C24 36 36 34 42 40 C46 36 54 36 58 40 C64 34 76 36 82 44 C74 52 60 56 50 54 C40 56 26 52 18 44 Z',
        fill: 'c',
        stroke: 's',
      },
      {
        kind: 'path',
        d: 'M18 48 C26 64 74 64 82 48 C74 56 60 62 50 60 C40 62 26 56 18 48 Z',
        fill: 'a',
        stroke: 's',
      },
    ],
  },

  foot: {
    elements: [
      {
        kind: 'path',
        d: 'M20 52 C16 74 24 90 50 90 C76 90 86 74 84 52 C82 34 68 24 50 24 C32 24 22 34 20 52 Z',
        fill: 'c',
        stroke: 's',
      },
      { kind: 'circle', cx: 26, cy: 30, r: 8, fill: 'c', stroke: 's' },
      { kind: 'circle', cx: 40, cy: 22, r: 7, fill: 'c', stroke: 's' },
      { kind: 'circle', cx: 54, cy: 20, r: 6, fill: 'c', stroke: 's' },
      { kind: 'circle', cx: 67, cy: 24, r: 6, fill: 'c', stroke: 's' },
      { kind: 'circle', cx: 78, cy: 32, r: 5, fill: 'c', stroke: 's' },
    ],
  },

  hat: {
    elements: [
      { kind: 'path', d: 'M18 70 L50 12 L82 70 Z', fill: 'c', stroke: 's' },
      { kind: 'ellipse', cx: 50, cy: 70, rx: 42, ry: 12, fill: 'a', stroke: 's' },
      {
        kind: 'polygon',
        points: '50,16 52,22 58,22 53,26 55,32 50,28 45,32 47,26 42,22 48,22',
        fill: 'a',
        stroke: 's',
        strokeWidth: 2,
      },
    ],
  },

  shirt: {
    elements: [
      { kind: 'rect', x: 22, y: 40, width: 56, height: 50, rx: 4, fill: 'c', stroke: 's' },
      { kind: 'path', d: 'M22 40 L8 28 L8 56 L22 60 Z', fill: 'c', stroke: 's' },
      { kind: 'path', d: 'M78 40 L92 28 L92 56 L78 60 Z', fill: 'c', stroke: 's' },
      { kind: 'path', d: 'M36 40 L50 58 L64 40', fill: 'none', stroke: 's', strokeWidth: 5 },
    ],
  },

  chest: {
    elements: [
      { kind: 'rect', x: 10, y: 52, width: 80, height: 36, rx: 4, fill: 'a', stroke: 's' },
      { kind: 'path', d: 'M10 52 C10 34 90 34 90 52 Z', fill: 'c', stroke: 's' },
      {
        kind: 'rect',
        x: 10,
        y: 62,
        width: 80,
        height: 10,
        fill: '#FFD700',
        stroke: 's',
        strokeWidth: 3,
      },
      {
        kind: 'rect',
        x: 42,
        y: 56,
        width: 16,
        height: 14,
        rx: 4,
        fill: '#FFD700',
        stroke: 's',
        strokeWidth: 3,
      },
    ],
  },

  // ── LEARNING ─────────────────────────────────────────────────────────────────

  abc: {
    elements: [
      {
        kind: 'path',
        d: 'M4 82 L19 16 L34 82 M7 54 L31 54',
        fill: 'none',
        stroke: 'c',
        strokeWidth: 8,
      },
      {
        kind: 'path',
        d: 'M38 16 L38 82 M38 16 C54 16 58 26 58 36 C58 46 54 48 38 48 M38 48 C56 48 60 60 60 72 C60 84 56 82 38 82',
        fill: 'none',
        stroke: 'a',
        strokeWidth: 8,
      },
      {
        kind: 'path',
        d: 'M96 28 C90 14 70 14 64 28 C58 42 58 58 64 72 C70 86 90 86 96 72',
        fill: 'none',
        stroke: 's',
        strokeWidth: 8,
      },
    ],
  },

  numbers: {
    elements: [
      { kind: 'path', d: 'M8 30 L18 22 L18 82', fill: 'none', stroke: 'c', strokeWidth: 8 },
      {
        kind: 'path',
        d: 'M36 28 C36 16 58 16 58 30 C58 44 36 58 34 82 L60 82',
        fill: 'none',
        stroke: 'a',
        strokeWidth: 8,
      },
      {
        kind: 'path',
        d: 'M66 26 C66 14 90 14 90 28 C90 42 70 50 70 50 C70 50 90 58 90 74 C90 88 66 88 66 76',
        fill: 'none',
        stroke: 's',
        strokeWidth: 8,
      },
    ],
  },

  flask: {
    elements: [
      { kind: 'rect', x: 32, y: 6, width: 36, height: 10, rx: 4, fill: 'a', stroke: 's' },
      { kind: 'rect', x: 38, y: 10, width: 24, height: 26, rx: 4, fill: 'c', stroke: 's' },
      {
        kind: 'path',
        d: 'M38 34 C24 48 10 62 10 72 C10 82 28 92 50 92 C72 92 90 82 90 72 C90 62 76 48 62 34 Z',
        fill: 'c',
        stroke: 's',
      },
      {
        kind: 'path',
        d: 'M14 72 C22 82 78 82 86 72 C84 82 70 90 50 90 C30 90 16 82 14 72 Z',
        fill: 'a',
        stroke: 'none',
      },
    ],
  },

  scissors: {
    elements: [
      { kind: 'path', d: 'M18 14 L54 56', fill: 'none', stroke: 's', strokeWidth: 8 },
      { kind: 'path', d: 'M82 14 L46 56', fill: 'none', stroke: 's', strokeWidth: 8 },
      { kind: 'circle', cx: 50, cy: 52, r: 8, fill: 'c', stroke: 's' },
      { kind: 'ellipse', cx: 28, cy: 78, rx: 16, ry: 12, fill: 'c', stroke: 's' },
      { kind: 'ellipse', cx: 72, cy: 78, rx: 16, ry: 12, fill: 'a', stroke: 's' },
      { kind: 'path', d: 'M42 58 L28 68 M58 58 L72 68', fill: 'none', stroke: 's', strokeWidth: 6 },
    ],
  },

  gift: {
    elements: [
      { kind: 'rect', x: 12, y: 50, width: 76, height: 40, rx: 4, fill: 'c', stroke: 's' },
      { kind: 'rect', x: 8, y: 38, width: 84, height: 16, rx: 4, fill: 'a', stroke: 's' },
      {
        kind: 'rect',
        x: 44,
        y: 38,
        width: 12,
        height: 52,
        rx: 2,
        fill: '#FFD700',
        stroke: 's',
        strokeWidth: 3,
      },
      {
        kind: 'rect',
        x: 8,
        y: 46,
        width: 84,
        height: 8,
        rx: 2,
        fill: '#FFD700',
        stroke: 's',
        strokeWidth: 3,
      },
      {
        kind: 'ellipse',
        cx: 38,
        cy: 34,
        rx: 14,
        ry: 8,
        fill: '#FFD700',
        stroke: 's',
        strokeWidth: 3,
      },
      {
        kind: 'ellipse',
        cx: 62,
        cy: 34,
        rx: 14,
        ry: 8,
        fill: '#FFD700',
        stroke: 's',
        strokeWidth: 3,
      },
      { kind: 'circle', cx: 50, cy: 36, r: 5, fill: '#FFD700', stroke: 's', strokeWidth: 3 },
    ],
  },
};
