import { StyleSheet, View } from 'react-native';
import Animated, { css } from 'react-native-reanimated';

import { Icon } from '@/components/icons/Icon';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { palette } from '@/theme';

interface SparkleProps {
  /** Number of sparkles scattered inside the container. */
  count?: number;
  color?: string;
  size?: number;
  /** When false, sparkles stay hidden (used to trigger on tap). */
  active?: boolean;
  /** Repeat forever (ambient) or burst once. */
  loop?: boolean;
}

const POSITIONS = [
  { left: '10%', top: '15%' },
  { left: '70%', top: '10%' },
  { left: '85%', top: '55%' },
  { left: '30%', top: '70%' },
  { left: '55%', top: '40%' },
  { left: '5%', top: '60%' },
] as const;

const STAGGER_MS = 120;
const CYCLE_MS = 1480;

/**
 * Pop in, breathe, spin, fade out. A CSS keyframe animation so the browser's
 * compositor (or the native UI thread) drives it — no JS work per frame.
 */
const twinkle = css.keyframes({
  from: { transform: [{ scale: 0 }, { rotate: '0deg' }] },
  '22%': { transform: [{ scale: 1 }, { rotate: '80deg' }] },
  '50%': { transform: [{ scale: 0.6 }, { rotate: '180deg' }] },
  '78%': { transform: [{ scale: 1 }, { rotate: '280deg' }] },
  to: { transform: [{ scale: 0 }, { rotate: '360deg' }] },
});

/** Scattered diamond sparkles. Overlay on any container (absolute fill). */
export function Sparkle({
  count = 5,
  color = palette.sunshine,
  size = 28,
  active = true,
  loop = true,
}: SparkleProps) {
  const reduced = useReducedMotion();
  if (!active) return null;
  const n = Math.min(count, POSITIONS.length);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" testID="sparkle">
      {Array.from({ length: n }, (_, i) => {
        const pos = POSITIONS[i]!;
        return (
          <Animated.View
            key={i}
            style={[
              styles.sparkle,
              { left: pos.left, top: pos.top },
              reduced
                ? styles.still
                : {
                    animationName: twinkle,
                    animationDuration: CYCLE_MS,
                    animationDelay: i * STAGGER_MS,
                    animationIterationCount: loop ? 'infinite' : 1,
                    animationFillMode: 'both',
                    animationTimingFunction: 'ease-in-out',
                  },
            ]}
          >
            <Icon name="sparkle" size={size} color={color} stroke={color} />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sparkle: { position: 'absolute' },
  still: { opacity: 0.9 },
});
