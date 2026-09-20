import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, shadows, spacing } from '@/theme';

export interface CardProps {
  onPress?: () => void;
  accessibilityLabel?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Large rounded surface. Tappable when `onPress` is provided. */
export function Card({
  onPress,
  accessibilityLabel,
  color = colors.surface,
  style,
  testID,
  children,
}: PropsWithChildren<CardProps>) {
  if (!onPress) {
    return (
      <Pressable disabled style={[styles.card, { backgroundColor: color }, style]} testID={testID}>
        {children}
      </Pressable>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: color },
        pressed && styles.pressed,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radii.lg, padding: spacing.lg, ...shadows.soft },
  pressed: { transform: [{ scale: 0.98 }] },
});
