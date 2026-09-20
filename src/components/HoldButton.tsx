import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { layout } from '@/constants/layout';
import { colors, palette, radii, spacing, touch, typography } from '@/theme';

import { Icon, type IconName } from './icons/Icon';

export interface HoldButtonProps {
  icon: IconName;
  label: string;
  /** Fires only after the full hold. */
  onComplete: () => void;
  holdMs?: number;
  color?: string;
  size?: number;
  testID?: string;
}

/**
 * Press-and-hold control for destructive or gated actions (clear canvas, parent
 * gate). A ring fills while holding; releasing early cancels. Works without
 * reading: the ring itself communicates progress.
 */
export function HoldButton({
  icon,
  label,
  onComplete,
  holdMs = layout.holdToConfirmMs,
  color = colors.surface,
  size = touch.primary,
  testID,
}: HoldButtonProps) {
  const [progress, setProgress] = useState(0);
  const start = useRef<number | null>(null);
  const frame = useRef<ReturnType<typeof setInterval> | null>(null);
  const completed = useRef(false);

  const stop = useCallback(() => {
    if (frame.current) clearInterval(frame.current);
    frame.current = null;
    start.current = null;
    setProgress(0);
  }, []);

  useEffect(() => stop, [stop]);

  const begin = useCallback(() => {
    completed.current = false;
    start.current = Date.now();
    frame.current = setInterval(() => {
      if (start.current === null) return;
      const ratio = Math.min(1, (Date.now() - start.current) / holdMs);
      setProgress(ratio);
      if (ratio >= 1 && !completed.current) {
        completed.current = true;
        stop();
        onComplete();
      }
    }, 32);
  }, [holdMs, onComplete, stop]);

  const radius = size / 2 - 5;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint="Press and hold"
        onPressIn={begin}
        onPressOut={stop}
        testID={testID}
        style={[styles.button, { width: size, height: size, backgroundColor: color }]}
      >
        <Svg width={size} height={size} style={styles.ring} pointerEvents="none">
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={palette.mist}
            strokeWidth={8}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={palette.coral}
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - progress)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <Icon name={icon} size={Math.round(size * 0.45)} />
      </Pressable>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.xs },
  button: { borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', top: 0, left: 0 },
  label: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
    color: colors.textSoft,
  },
});
