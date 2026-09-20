import { useEffect, type PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, spacing, typography } from '@/theme';

import { BigButton } from './BigButton';
import { Icon, type IconName } from './icons/Icon';
import { Sparkle } from './animations/Sparkle';

export interface CelebrationProps {
  visible: boolean;
  message: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
  /** Spoken once when shown; defaults to message. */
  voicePrompt?: string;
}

/** Gentle full-screen celebration. No confetti storms; a few sparkles and a kind message. */
export function Celebration({
  visible,
  message,
  icon = 'star',
  actionLabel,
  onAction,
  voicePrompt,
  children,
}: PropsWithChildren<CelebrationProps>) {
  const { speak } = useVoice();
  const { play } = useSfx();

  useEffect(() => {
    if (visible) {
      play('celebrate');
      speak(voicePrompt ?? message);
    }
  }, [visible, message, voicePrompt, play, speak]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
      accessibilityViewIsModal
    >
      <Sparkle count={6} loop={false} />
      <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.card}>
        <View style={styles.iconWrap}>
          <Icon name={icon} size={96} color={palette.sunshine} />
        </View>
        <Text style={styles.message} accessibilityRole="header">
          {message}
        </Text>
        {actionLabel && onAction ? (
          <BigButton icon="check" label={actionLabel} onPress={onAction} color={palette.leaf} />
        ) : null}
        {children ? <View style={styles.actions}>{children}</View> : null}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.xl,
    maxWidth: 480,
    width: '100%',
  },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  message: {
    fontFamily: typography.family,
    fontSize: typography.size.display,
    fontWeight: typography.weight.black,
    color: colors.text,
    textAlign: 'center',
  },
});
