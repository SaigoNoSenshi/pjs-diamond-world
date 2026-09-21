import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Icon, type IconName } from '@/components/icons/Icon';
import { ScreenShell } from '@/components/ScreenShell';
import { stickers } from '@/content/stickers';
import { strings, voicePrompts } from '@/constants/strings';
import { DiamondCounter } from '@/features/learning/components/DiamondCounter';
import { JellySays } from '@/features/learning/components/JellySays';
import { useLearning } from '@/features/learning/LearningProvider';
import { useAppServices } from '@/hooks/useAppServices';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

/** Sticker album: earned stickers in colour, the rest as quiet grey shapes to discover. */
export function StickerBookScreen() {
  const { speak } = useVoice();
  const { analytics } = useAppServices();
  const { progress } = useLearning();
  const { width } = useWindowDimensions();

  useEffect(() => {
    analytics.track('screen_opened', { screen: 'stickers' });
    speak(voicePrompts.stickers);
  }, [analytics, speak]);

  const owned = new Set(progress.stickers);
  const columns = width >= 900 ? 6 : width >= 600 ? 5 : 3;
  const size = Math.floor((width - spacing.lg * 2 - spacing.md * (columns - 1)) / columns);

  return (
    <ScreenShell
      title={strings.learning.stickers}
      backgroundColor={palette.cream}
      rightSlot={<DiamondCounter count={progress.diamonds} />}
    >
      <View style={styles.header}>
        <JellySays
          text={
            owned.size === 0 ? strings.learning.stickersEmpty : `${owned.size} / ${stickers.length}`
          }
          voice={owned.size === 0 ? strings.learning.stickersEmpty : voicePrompts.stickers}
          compact
        />
      </View>
      <ScrollView contentContainerStyle={styles.grid} testID="sticker-grid">
        {stickers.map((sticker) => {
          const has = owned.has(sticker.id);
          return (
            <View
              key={sticker.id}
              style={[styles.cell, { width: size, height: size }, !has && styles.locked]}
              accessibilityLabel={has ? sticker.name : strings.learning.stickersLocked}
              testID={`sticker-${sticker.id}-${has ? 'owned' : 'locked'}`}
            >
              <Icon
                name={sticker.icon as IconName}
                size={Math.round(size * 0.55)}
                color={has ? sticker.color : '#D9DEE7'}
                stroke={has ? palette.ink : '#9AA3B2'}
              />
              <Text style={[styles.name, !has && styles.nameLocked]} numberOfLines={1}>
                {has ? sticker.name : '?'}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.huge,
  },
  cell: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    ...shadows.soft,
  },
  locked: { backgroundColor: '#F3F5F9' },
  name: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  nameLocked: { color: palette.inkSoft },
});
