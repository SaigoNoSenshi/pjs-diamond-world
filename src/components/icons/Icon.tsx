import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';

import { palette } from '@/theme';

/**
 * Original, hand-authored icon set drawn on a 100×100 grid. Thick friendly strokes,
 * rounded shapes. Icons double as stamps (see `stampIds`). Colour is a prop so the
 * chosen drawing colour tints stamps.
 */
export type IconName =
  | 'paintbrush'
  | 'rainbow'
  | 'flower'
  | 'leaf'
  | 'music'
  | 'shell'
  | 'book'
  | 'diamond'
  | 'star'
  | 'heart'
  | 'jellyfish'
  | 'crown'
  | 'robot'
  | 'pig'
  | 'camera'
  | 'undo'
  | 'redo'
  | 'eraser'
  | 'crayon'
  | 'brush'
  | 'save'
  | 'home'
  | 'next'
  | 'back'
  | 'play'
  | 'pause'
  | 'volume'
  | 'lock'
  | 'check'
  | 'trash'
  | 'clay'
  | 'sparkle'
  | 'stamp'
  | 'palette'
  | 'close'
  | 'island'
  | 'settings'
  | 'photo'
  | 'export';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  /** Secondary colour for two-tone icons. */
  accent?: string;
  /** Outline colour; defaults to ink. */
  stroke?: string;
}

const SW = 6;

export function Icon({
  name,
  size = 48,
  color = palette.ink,
  accent = palette.sunshine,
  stroke = palette.ink,
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      {renderIcon(name, color, accent, stroke)}
    </Svg>
  );
}

function renderIcon(name: IconName, c: string, a: string, s: string) {
  const common = {
    stroke: s,
    strokeWidth: SW,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  };
  switch (name) {
    case 'paintbrush':
    case 'brush':
      return (
        <G {...common}>
          <Path d="M62 12 L88 38 L50 76 L24 50 Z" fill={a} />
          <Path d="M24 50 C10 60 22 74 12 90 C30 88 42 80 50 76 Z" fill={c} />
        </G>
      );
    case 'crayon':
      return (
        <G {...common}>
          <Path d="M30 70 L60 20 L80 32 L50 82 Z" fill={c} />
          <Path d="M30 70 L50 82 L36 92 Z" fill={a} />
          <Rect x={57} y={18} width={26} height={12} rx={4} fill={s} transform="rotate(31 70 24)" />
        </G>
      );
    case 'rainbow':
      return (
        <G fill="none" strokeWidth={10} strokeLinecap="round">
          <Path d="M12 80 A38 38 0 0 1 88 80" stroke={palette.coral} />
          <Path d="M24 80 A26 26 0 0 1 76 80" stroke={a} />
          <Path d="M36 80 A14 14 0 0 1 64 80" stroke={palette.aqua} />
        </G>
      );
    case 'flower':
      return (
        <G {...common}>
          <Circle cx={50} cy={26} r={14} fill={c} />
          <Circle cx={74} cy={44} r={14} fill={c} />
          <Circle cx={66} cy={72} r={14} fill={c} />
          <Circle cx={34} cy={72} r={14} fill={c} />
          <Circle cx={26} cy={44} r={14} fill={c} />
          <Circle cx={50} cy={50} r={13} fill={a} />
        </G>
      );
    case 'leaf':
      return (
        <G {...common}>
          <Path d="M18 82 C18 40 50 14 86 14 C86 54 58 82 18 82 Z" fill={c} />
          <Path d="M22 78 C40 60 56 44 78 22" fill="none" />
        </G>
      );
    case 'music':
      return (
        <G {...common}>
          <Path d="M40 20 L80 12 L80 62" fill="none" />
          <Path d="M40 20 L40 72" fill="none" />
          <Ellipse cx={28} cy={74} rx={13} ry={10} fill={c} />
          <Ellipse cx={68} cy={64} rx={13} ry={10} fill={c} />
        </G>
      );
    case 'shell':
      return (
        <G {...common}>
          <Path
            d="M50 88 C18 88 10 60 18 40 C26 20 40 12 50 12 C60 12 74 20 82 40 C90 60 82 88 50 88 Z"
            fill={c}
          />
          <Path d="M50 14 L50 86 M30 20 L44 86 M70 20 L56 86" fill="none" />
        </G>
      );
    case 'book':
      return (
        <G {...common}>
          <Path d="M14 20 L48 28 L48 86 L14 78 Z" fill={c} />
          <Path d="M86 20 L52 28 L52 86 L86 78 Z" fill={a} />
          <Polygon
            points="50,44 56,56 50,66 44,56"
            fill={palette.white}
            stroke={s}
            strokeWidth={3}
          />
        </G>
      );
    case 'diamond':
      return (
        <G {...common}>
          <Polygon points="28,14 72,14 90,38 50,90 10,38" fill={c} />
          <Path
            d="M10 38 L90 38 M28 14 L40 38 L50 90 M72 14 L60 38 L50 90"
            fill="none"
            strokeWidth={3}
          />
        </G>
      );
    case 'star':
      return (
        <G {...common}>
          <Polygon points="50,8 61,36 92,38 68,58 76,90 50,72 24,90 32,58 8,38 39,36" fill={c} />
        </G>
      );
    case 'heart':
      return (
        <G {...common}>
          <Path
            d="M50 88 C20 66 8 50 12 32 C16 14 40 10 50 28 C60 10 84 14 88 32 C92 50 80 66 50 88 Z"
            fill={c}
          />
        </G>
      );
    case 'jellyfish':
      return (
        <G {...common}>
          <Path d="M14 52 C14 24 30 10 50 10 C70 10 86 24 86 52 Z" fill={c} />
          <Path
            d="M24 54 C22 66 30 74 26 88 M40 54 C40 68 46 76 42 90 M60 54 C60 68 54 76 58 90 M76 54 C78 66 70 74 74 88"
            fill="none"
          />
          <Circle cx={40} cy={36} r={4} fill={s} stroke="none" />
          <Circle cx={60} cy={36} r={4} fill={s} stroke="none" />
          <Path d="M42 44 Q50 50 58 44" fill="none" strokeWidth={4} />
        </G>
      );
    case 'crown':
      return (
        <G {...common}>
          <Path d="M14 78 L14 34 L34 52 L50 20 L66 52 L86 34 L86 78 Z" fill={c} />
          <Circle cx={50} cy={20} r={5} fill={a} />
          <Circle cx={14} cy={34} r={5} fill={a} />
          <Circle cx={86} cy={34} r={5} fill={a} />
        </G>
      );
    case 'robot':
      return (
        <G {...common}>
          <Rect x={20} y={30} width={60} height={50} rx={10} fill={c} />
          <Line x1={50} y1={30} x2={50} y2={14} />
          <Circle cx={50} cy={12} r={5} fill={a} />
          <Circle cx={37} cy={50} r={6} fill={palette.white} />
          <Circle cx={63} cy={50} r={6} fill={palette.white} />
          <Path d="M36 66 L64 66" fill="none" />
          <Rect x={8} y={44} width={12} height={20} rx={4} fill={c} />
          <Rect x={80} y={44} width={12} height={20} rx={4} fill={c} />
        </G>
      );
    case 'pig':
      return (
        <G {...common}>
          <Polygon points="20,40 14,14 40,24" fill={c} />
          <Polygon points="80,40 86,14 60,24" fill={c} />
          <Circle cx={50} cy={54} r={34} fill={c} />
          <Ellipse cx={50} cy={62} rx={14} ry={10} fill={a} />
          <Circle cx={44} cy={62} r={3} fill={s} stroke="none" />
          <Circle cx={56} cy={62} r={3} fill={s} stroke="none" />
          <Circle cx={36} cy={44} r={4} fill={s} stroke="none" />
          <Circle cx={64} cy={44} r={4} fill={s} stroke="none" />
        </G>
      );
    case 'camera':
    case 'photo':
      return (
        <G {...common}>
          <Rect x={10} y={30} width={80} height={54} rx={10} fill={c} />
          <Path d="M34 30 L40 18 L60 18 L66 30" fill={c} />
          <Circle cx={50} cy={57} r={15} fill={palette.white} />
          <Circle cx={50} cy={57} r={6} fill={a} />
        </G>
      );
    case 'undo':
      return (
        <G {...common} fill="none" strokeWidth={9}>
          <Path d="M30 40 L14 40 L14 24" />
          <Path d="M16 40 C28 22 56 18 72 32 C90 48 84 76 60 82 C48 85 38 80 32 74" />
        </G>
      );
    case 'redo':
      return (
        <G {...common} fill="none" strokeWidth={9}>
          <Path d="M70 40 L86 40 L86 24" />
          <Path d="M84 40 C72 22 44 18 28 32 C10 48 16 76 40 82 C52 85 62 80 68 74" />
        </G>
      );
    case 'eraser':
      return (
        <G {...common}>
          <Path d="M14 66 L54 26 L84 56 L60 80 L36 80 Z" fill={palette.blossom} />
          <Path d="M36 80 L60 80 L84 56 L70 42 Z" fill={palette.white} />
          <Path d="M12 88 L88 88" fill="none" />
        </G>
      );
    case 'save':
      return (
        <G {...common}>
          <Path d="M50 12 L50 60 M30 42 L50 62 L70 42" fill="none" strokeWidth={9} />
          <Path d="M16 70 L16 84 L84 84 L84 70" fill="none" strokeWidth={9} />
        </G>
      );
    case 'home':
    case 'island':
      return (
        <G {...common}>
          <Ellipse cx={50} cy={78} rx={38} ry={12} fill={a} />
          <Path d="M50 70 L50 30" fill="none" />
          <Path d="M50 32 C40 20 26 22 22 30 C34 32 44 34 50 32 Z" fill={palette.leaf} />
          <Path d="M50 32 C60 20 74 22 78 30 C66 32 56 34 50 32 Z" fill={palette.leaf} />
          <Path d="M50 30 C46 18 52 12 50 8 C56 14 54 24 50 30 Z" fill={palette.leaf} />
          <Polygon points="20,66 28,56 36,66 28,76" fill={c} />
        </G>
      );
    case 'next':
      return (
        <G {...common} fill="none" strokeWidth={10}>
          <Path d="M16 50 L80 50 M56 26 L82 50 L56 74" />
        </G>
      );
    case 'back':
      return (
        <G {...common} fill="none" strokeWidth={10}>
          <Path d="M84 50 L20 50 M44 26 L18 50 L44 74" />
        </G>
      );
    case 'play':
      return (
        <G {...common}>
          <Polygon points="28,16 84,50 28,84" fill={c} />
        </G>
      );
    case 'pause':
      return (
        <G {...common}>
          <Rect x={22} y={16} width={20} height={68} rx={6} fill={c} />
          <Rect x={58} y={16} width={20} height={68} rx={6} fill={c} />
        </G>
      );
    case 'volume':
      return (
        <G {...common}>
          <Path d="M14 38 L30 38 L50 20 L50 80 L30 62 L14 62 Z" fill={c} />
          <Path d="M62 36 C70 44 70 56 62 64 M72 26 C86 40 86 60 72 74" fill="none" />
        </G>
      );
    case 'lock':
      return (
        <G {...common}>
          <Path d="M30 44 L30 32 C30 18 40 12 50 12 C60 12 70 18 70 32 L70 44" fill="none" />
          <Rect x={18} y={44} width={64} height={44} rx={10} fill={c} />
          <Circle cx={50} cy={64} r={6} fill={s} stroke="none" />
        </G>
      );
    case 'check':
      return (
        <G {...common} fill="none" strokeWidth={12}>
          <Path d="M16 54 L40 76 L84 26" />
        </G>
      );
    case 'close':
      return (
        <G {...common} fill="none" strokeWidth={12}>
          <Path d="M24 24 L76 76 M76 24 L24 76" />
        </G>
      );
    case 'trash':
      return (
        <G {...common}>
          <Path d="M20 28 L80 28 M38 28 L38 18 L62 18 L62 28" fill="none" />
          <Path d="M26 28 L30 86 L70 86 L74 28 Z" fill={c} />
          <Path d="M42 40 L42 74 M58 40 L58 74" fill="none" strokeWidth={4} />
        </G>
      );
    case 'clay':
      return (
        <G {...common}>
          <Path d="M20 40 L80 40 L74 84 L26 84 Z" fill={c} />
          <Path d="M80 48 C94 48 94 70 78 72" fill="none" />
          <Ellipse cx={50} cy={40} rx={30} ry={8} fill={a} />
        </G>
      );
    case 'sparkle':
      return (
        <G {...common}>
          <Path
            d="M50 8 C52 36 64 48 92 50 C64 52 52 64 50 92 C48 64 36 52 8 50 C36 48 48 36 50 8 Z"
            fill={c}
          />
        </G>
      );
    case 'stamp':
      return (
        <G {...common}>
          <Rect x={16} y={64} width={68} height={22} rx={6} fill={c} />
          <Rect x={42} y={38} width={16} height={26} fill={c} />
          <Circle cx={50} cy={26} r={16} fill={a} />
        </G>
      );
    case 'palette':
      return (
        <G {...common}>
          <Path
            d="M50 10 C26 10 10 28 10 50 C10 72 26 90 46 90 C56 90 56 80 52 76 C48 70 54 64 62 66 C80 70 90 60 90 46 C90 26 72 10 50 10 Z"
            fill={c}
          />
          <Circle cx={32} cy={38} r={7} fill={palette.coral} />
          <Circle cx={50} cy={28} r={7} fill={a} />
          <Circle cx={68} cy={38} r={7} fill={palette.aqua} />
          <Circle cx={28} cy={60} r={7} fill={palette.lavender} />
        </G>
      );
    case 'settings':
      return (
        <G {...common}>
          <Circle cx={50} cy={50} r={30} fill={c} />
          <Circle cx={50} cy={50} r={12} fill={palette.white} />
          <Path
            d="M50 8 L50 20 M50 80 L50 92 M8 50 L20 50 M80 50 L92 50 M20 20 L28 28 M72 72 L80 80 M80 20 L72 28 M28 72 L20 80"
            fill="none"
          />
        </G>
      );
    case 'export':
      return (
        <G {...common}>
          <Path d="M50 62 L50 14 M30 32 L50 12 L70 32" fill="none" strokeWidth={9} />
          <Path d="M16 56 L16 84 L84 84 L84 56" fill="none" strokeWidth={9} />
        </G>
      );
  }
}
