import { Platform } from 'react-native';

/**
 * Design tokens for PJ's Diamond World.
 * Magical, soft, bright, friendly, playful, clean. Large rounded shapes, generous spacing.
 */
export const palette = {
  sunshine: '#FFD93D',
  tangerine: '#FF9F1C',
  blossom: '#FF7BAC',
  aqua: '#4ECDC4',
  lavender: '#9B5DE5',
  sea: '#2E86DE',
  seaDeep: '#1B4F9C',
  leaf: '#6BCB77',
  coral: '#FF595E',
  white: '#FFFFFF',
  sand: '#FFF7E6',
  cream: '#FFFDF7',
  ink: '#2D3142',
  inkSoft: '#5C6378',
  mist: '#E9EEF5',
  shadow: 'rgba(45, 49, 66, 0.18)',
} as const;

export const colors = {
  background: palette.sand,
  surface: palette.white,
  surfaceSoft: palette.cream,
  text: palette.ink,
  textSoft: palette.inkSoft,
  primary: palette.sunshine,
  secondary: palette.aqua,
  accent: palette.blossom,
  danger: palette.coral,
  success: palette.leaf,
  border: palette.mist,
  overlay: 'rgba(27, 79, 156, 0.55)',
} as const;

/** The nine drawing colours PJ asked for, as large tappable circles. */
export const drawingColors = [
  { id: 'yellow', label: 'Yellow', hex: '#FFD93D' },
  { id: 'orange', label: 'Orange', hex: '#FF9F1C' },
  { id: 'pink', label: 'Pink', hex: '#FF7BAC' },
  { id: 'blue', label: 'Blue', hex: '#2E86DE' },
  { id: 'green', label: 'Green', hex: '#6BCB77' },
  { id: 'purple', label: 'Purple', hex: '#9B5DE5' },
  { id: 'red', label: 'Red', hex: '#FF595E' },
  { id: 'white', label: 'White', hex: '#FFFFFF' },
  { id: 'black', label: 'Black', hex: '#2D3142' },
] as const;

export type DrawingColorId = (typeof drawingColors)[number]['id'];

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export const radii = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 40,
  pill: 999,
} as const;

/** Touch targets. Minimum 48 logical px; primary controls are much larger. */
export const touch = {
  min: 48,
  comfortable: 64,
  primary: 96,
  hero: 140,
} as const;

export const typography = {
  family: Platform.select({
    ios: 'ui-rounded',
    android: 'sans-serif-medium',
    web: '"Nunito", "Varela Round", "Segoe UI Rounded", system-ui, sans-serif',
    default: 'System',
  }),
  size: {
    caption: 14,
    body: 18,
    label: 22,
    title: 30,
    display: 42,
    hero: 56,
  },
  weight: {
    regular: '500' as const,
    bold: '700' as const,
    black: '900' as const,
  },
} as const;

export const shadows = {
  soft: {
    shadowColor: palette.ink,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  lifted: {
    shadowColor: palette.ink,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;

export const motion = {
  /** Short feedback animations. */
  quick: 180,
  normal: 320,
  slow: 600,
} as const;

export const theme = {
  palette,
  colors,
  drawingColors,
  spacing,
  radii,
  touch,
  typography,
  shadows,
  motion,
};
export type Theme = typeof theme;
