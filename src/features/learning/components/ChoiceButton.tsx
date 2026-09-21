import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Icon } from '@/components/icons/Icon';
import type { Picture } from '@/domain/activity/schema';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

import { PictureView } from './PictureView';

export type ChoiceState = 'idle' | 'correct' | 'wrong' | 'dim';

export interface ChoiceButtonProps {
  picture?: Picture;
  label?: string;
  /** Big text instead of a picture (numbers). */
  text?: string;
  state?: ChoiceState;
  onPress: () => void;
  size?: number;
  /** Double-width card for text-only answers so long words never break mid-word. */
  wide?: boolean;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

/**
 * The answer card used by every quiz-like engine. Correct = green ring + check and a
 * happy pop; wrong = a gentle wobble (never red, never an X). Always ≥ 96 px.
 */
export function ChoiceButton({
  picture,
  label,
  text,
  state = 'idle',
  onPress,
  size = 132,
  wide = false,
  disabled = false,
  testID,
  accessibilityLabel,
}: ChoiceButtonProps) {
  const scale = useSharedValue(1);
  const shift = useSharedValue(0);

  useEffect(() => {
    if (state === 'correct') {
      scale.set(withSequence(withTiming(1.12, { duration: 140 }), withSpring(1)));
    } else if (state === 'wrong') {
      shift.set(
        withSequence(
          withTiming(-8, { duration: 60 }),
          withTiming(8, { duration: 60 }),
          withTiming(-5, { duration: 60 }),
          withTiming(0, { duration: 60 }),
        ),
      );
    }
  }, [state, scale, shift]);

  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }, { translateX: shift.get() }],
  }));

  return (
    <Animated.View style={animated}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label ?? text ?? picture?.icon}
        accessibilityState={{ disabled, selected: state === 'correct' }}
        disabled={disabled || state === 'correct'}
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => [
          styles.card,
          wide
            ? { width: size * 2 + spacing.md, minHeight: Math.round(size * 0.7) }
            : { width: size, minHeight: size },
          state === 'correct' && styles.correct,
          state === 'dim' && styles.dim,
          pressed && styles.pressed,
        ]}
      >
        {text !== undefined ? (
          <Text style={[styles.bigText, { fontSize: size * 0.5, lineHeight: size * 0.58 }]}>
            {text}
          </Text>
        ) : picture ? (
          <PictureView picture={picture} size={Math.round(size * 0.55)} />
        ) : null}
        {label && text === undefined ? (
          <Text
            style={[styles.label, !picture && styles.labelOnly]}
            numberOfLines={picture ? 1 : 3}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {label}
          </Text>
        ) : null}
        {state === 'correct' ? (
          <View style={styles.badge}>
            <Icon name="check" size={28} color={palette.white} stroke={palette.white} />
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 4,
    borderColor: 'transparent',
    ...shadows.soft,
  },
  correct: { borderColor: palette.leaf, backgroundColor: '#EAF9EE' },
  dim: { opacity: 0.45 },
  pressed: { transform: [{ scale: 0.96 }] },
  label: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  labelOnly: { fontSize: typography.size.label, textAlign: 'center' },
  bigText: {
    fontFamily: typography.family,
    fontWeight: typography.weight.black,
    color: colors.text,
  },
  badge: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
