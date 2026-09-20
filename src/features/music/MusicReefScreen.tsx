import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BigButton } from '@/components/BigButton';
import { IconButton } from '@/components/IconButton';
import { ScreenShell } from '@/components/ScreenShell';
import { Sparkle } from '@/components/animations/Sparkle';
import { strings, voicePrompts } from '@/constants/strings';
import { JellyGuide } from '@/features/home/components/JellyGuide';
import { useAppServices } from '@/hooks/useAppServices';
import { useMusic } from '@/hooks/useMusic';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, spacing, typography } from '@/theme';

const VOLUME_STEPS = [
  { id: 'quiet', value: 0.3, size: 52 },
  { id: 'medium', value: 0.6, size: 64 },
  { id: 'loud', value: 0.85, size: 76 },
] as const;

/** Music Reef: one big play/pause, next song, and three volume sizes. Jelly dances. */
export function MusicReefScreen() {
  const { playing, track, volume, enabled, toggle, next, setVolume } = useMusic();
  const { speak } = useVoice();
  const { analytics } = useAppServices();

  useEffect(() => {
    analytics.track('screen_opened', { screen: 'music' });
    speak(voicePrompts.music);
  }, [analytics, speak]);

  return (
    <ScreenShell title={strings.music.title} backgroundColor={palette.seaDeep}>
      <View style={styles.root}>
        <View style={styles.stage}>
          {playing ? <Sparkle count={6} color={palette.aqua} /> : null}
          <JellyGuide size={playing ? 200 : 170} voicePrompt={voicePrompts.music} />
          <Text style={styles.trackTitle} accessibilityLiveRegion="polite" testID="track-title">
            {track ? `♪ ${track.title}` : strings.music.title}
          </Text>
        </View>

        <View style={styles.controls}>
          <BigButton
            icon={playing ? 'pause' : 'play'}
            label={playing ? strings.music.pause : strings.music.play}
            onPress={toggle}
            color={palette.sunshine}
            size="hero"
            disabled={!enabled}
            testID="music-toggle"
          />
          <BigButton
            icon="next"
            label={strings.music.next}
            onPress={next}
            color={palette.aqua}
            size="primary"
            testID="music-next"
          />
        </View>

        <View
          style={styles.volumeRow}
          accessibilityRole="radiogroup"
          accessibilityLabel={strings.music.volume}
        >
          {VOLUME_STEPS.map((step) => (
            <IconButton
              key={step.id}
              icon="volume"
              label={`${strings.music.volume} ${step.id}`}
              size={step.size}
              color={colors.surface}
              iconColor={palette.seaDeep}
              selected={Math.abs(volume - step.value) < 0.01}
              onPress={() => setVolume(step.value)}
              testID={`volume-${step.id}`}
            />
          ))}
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between', padding: spacing.xl, gap: spacing.xl },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  trackTitle: {
    fontFamily: typography.family,
    fontSize: typography.size.title,
    fontWeight: typography.weight.black,
    color: palette.white,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
  volumeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: spacing.xl,
  },
});
