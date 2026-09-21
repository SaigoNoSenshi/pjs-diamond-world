/**
 * Data-driven icons. Each icon is a list of SVG primitives on a 100×100 grid.
 * Colour tokens: 'c' = main colour prop, 'a' = accent prop, 's' = outline/ink prop,
 * 'white', 'none', or a literal hex. The same data renders through react-native-svg
 * in the app and through plain <svg> in the icon QA sheet (scripts/icon-sheet.mjs).
 */
export type ColorToken = 'c' | 'a' | 's' | 'white' | 'none' | `#${string}`;

interface Styled {
  fill?: ColorToken;
  stroke?: ColorToken;
  /** Defaults to the standard 6px outline. */
  strokeWidth?: number;
  opacity?: number;
}

export type IconElement =
  | ({ kind: 'path'; d: string } & Styled)
  | ({ kind: 'circle'; cx: number; cy: number; r: number } & Styled)
  | ({ kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number } & Styled)
  | ({ kind: 'rect'; x: number; y: number; width: number; height: number; rx?: number } & Styled)
  | ({ kind: 'polygon'; points: string } & Styled)
  | ({ kind: 'line'; x1: number; y1: number; x2: number; y2: number } & Styled);

export interface IconSpec {
  elements: IconElement[];
}

/** Icons added for the learning islands (Plan 3). Specs live in extraIcons.ts. */
export type ExtraIconName =
  | 'fish'
  | 'crab'
  | 'turtle'
  | 'octopus'
  | 'starfish'
  | 'whale'
  | 'seahorse'
  | 'sun'
  | 'moon'
  | 'cloud'
  | 'rain'
  | 'tree'
  | 'house'
  | 'boat'
  | 'apple'
  | 'banana'
  | 'mango'
  | 'coconut'
  | 'carrot'
  | 'rice'
  | 'cat'
  | 'dog'
  | 'bird'
  | 'frog'
  | 'butterfly'
  | 'bee'
  | 'ball'
  | 'cup'
  | 'chair'
  | 'rock'
  | 'spoon'
  | 'jeepney'
  | 'circle'
  | 'square'
  | 'triangle'
  | 'rectangle'
  | 'oval'
  | 'hexagon'
  | 'eye'
  | 'ear'
  | 'hand'
  | 'nose'
  | 'mouth'
  | 'foot'
  | 'hat'
  | 'shirt'
  | 'chest'
  | 'abc'
  | 'numbers'
  | 'flask'
  | 'scissors'
  | 'gift';

export const EXTRA_ICON_NAMES: readonly ExtraIconName[] = [
  'fish',
  'crab',
  'turtle',
  'octopus',
  'starfish',
  'whale',
  'seahorse',
  'sun',
  'moon',
  'cloud',
  'rain',
  'tree',
  'house',
  'boat',
  'apple',
  'banana',
  'mango',
  'coconut',
  'carrot',
  'rice',
  'cat',
  'dog',
  'bird',
  'frog',
  'butterfly',
  'bee',
  'ball',
  'cup',
  'chair',
  'rock',
  'spoon',
  'jeepney',
  'circle',
  'square',
  'triangle',
  'rectangle',
  'oval',
  'hexagon',
  'eye',
  'ear',
  'hand',
  'nose',
  'mouth',
  'foot',
  'hat',
  'shirt',
  'chest',
  'abc',
  'numbers',
  'flask',
  'scissors',
  'gift',
];
