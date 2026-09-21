import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, touch, typography } from '@/theme';

import { Icon, type IconName } from './icons/Icon';

export type BigButtonSize = 'primary' | 'hero' | 'comfortable';

export interface BigButtonProps {
  label: string;
  icon: IconName;
  onPress: () => void;
  color?: string;
  iconColor?: string;
  size?: BigButtonSize;
  /** Spoken when pressed if voice is enabled; defaults to the label. */
  voicePrompt?: string;
  /** Show the label under the icon (icon-first UI can hide it for tiny buttons). */
  showLabel?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * The primary control of the app: large, icon-first, voice-supported, with a soft
 * press animation. Minimum 96px for primary, 140px for hero.
 */
export function BigButton({
  label,
  icon,
  onPress,
  color = colors.primary,
  iconColor = palette.ink,
  size = 'primary',
  voicePrompt,
  showLabel = true,
  disabled = false,
  style,
  testID,
}: BigButtonProps) {
  const scale = useSharedValue(1);
  const { speak } = useVoice();
  const { play } = useSfx();

  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  const handlePressIn = useCallback(() => {
    scale.set(withTiming(0.94, { duration: 90 }));
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.set(withSpring(1, { damping: 12, stiffness: 220 }));
  }, [scale]);

  const handlePress = useCallback(() => {
    play('tap');
    speak(voicePrompt ?? label);
    onPress();
  }, [play, speak, voicePrompt, label, onPress]);

  const dimension =
    size === 'hero' ? touch.hero : size === 'primary' ? touch.primary : touch.comfortable;
  const iconSize = Math.round(dimension * 0.5);

  return (
    <Animated.View style={[animated, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={8}
        testID={testID}
        style={[
          styles.button,
          { backgroundColor: color, minHeight: dimension, minWidth: dimension, flex: 1 },
          disabled && styles.disabled,
        ]}
      >
        <View style={styles.iconWrap}>
          <Icon name={icon} size={iconSize} color={iconColor} />
        </View>
        {showLabel ? (
          <Text
            style={[styles.label, size === 'hero' && styles.heroLabel]}
            // Three lines so "My Diamond Book" never truncates: react-native-web ignores
            // adjustsFontSizeToFit and would show "My Diamond ..".
            numberOfLines={size === 'hero' ? 3 : 2}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {label}
          </Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    ...shadows.soft,
  },
  disabled: { opacity: 0.5 },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  label: {
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.bold,
    color: palette.ink,
    textAlign: 'center',
  },
  heroLabel: { fontSize: 24, lineHeight: 28 },
});
