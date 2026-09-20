import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Sparkle } from '@/components/animations/Sparkle';
import { Icon } from '@/components/icons/Icon';
import { PRINCESS } from '@/constants/characters';
import { images } from '@/constants/images';
import { layout } from '@/constants/layout';
import { routes } from '@/constants/routes';
import { strings, voicePrompts } from '@/constants/strings';
import { useProfile } from '@/hooks/useProfile';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, spacing, touch, typography } from '@/theme';

import { JellyGuide } from '../home/components/JellyGuide';

type Stage = 'logo' | 'island' | 'bloom' | 'welcome';

/**
 * Intro: logo → island → tap the princess → plant grows, flowers bloom, diamonds
 * sparkle, musical cue → Jelly welcomes PJ → home. Target 5–10 s total.
 * Returning users get a large SKIP; the sequence also auto-advances if PJ does nothing.
 */
export function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, settings, ready, updateSettings } = useProfile();
  const { speak } = useVoice();
  const { play } = useSfx();
  const [stage, setStage] = useState<Stage>('logo');
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    if (!settings.introSeen) void updateSettings({ introSeen: true });
    router.replace(routes.home);
  }, [router, settings.introSeen, updateSettings]);

  // Stage timeline. Logo is brief; island waits for a tap but never forever.
  useEffect(() => {
    if (stage === 'logo') {
      const t = setTimeout(() => setStage('island'), 1400);
      return () => clearTimeout(t);
    }
    if (stage === 'island') {
      speak(voicePrompts.tapPrincess);
      const t = setTimeout(() => setStage('bloom'), layout.introAutoAdvanceMs);
      return () => clearTimeout(t);
    }
    if (stage === 'bloom') {
      play('sparkle');
      const t = setTimeout(() => setStage('welcome'), 1800);
      return () => clearTimeout(t);
    }
    if (stage === 'welcome') {
      speak(voicePrompts.welcome(profile.nickname));
      const t = setTimeout(finish, 2600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [stage, speak, play, finish, profile.nickname]);

  const onPrincess = () => {
    if (stage === 'island') setStage('bloom');
  };

  const showSkip = ready && settings.introSeen;
  const bloomed = stage === 'bloom' || stage === 'welcome';

  return (
    <View style={styles.root} testID="intro-screen">
      {stage === 'logo' ? (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.logo}
        >
          <Icon name="diamond" size={140} color={palette.aqua} />
          <Text style={styles.logoText}>{strings.app.name}</Text>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn.duration(500)} style={styles.scene}>
          <Image
            source={images['scene.island']}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <Sparkle count={6} active={bloomed} loop={false} size={36} />

          <View
            style={[styles.stage, { paddingBottom: insets.bottom + spacing.xxl }]}
            pointerEvents="box-none"
          >
            {bloomed ? (
              <View style={styles.garden} pointerEvents="none">
                <Animated.View entering={ZoomIn.duration(500)}>
                  <Image
                    source={images['garden.sprout']}
                    style={styles.plant}
                    contentFit="contain"
                  />
                </Animated.View>
                <Animated.View entering={ZoomIn.delay(500).duration(500)}>
                  <Image
                    source={images['garden.flower']}
                    style={styles.plant}
                    contentFit="contain"
                  />
                </Animated.View>
                <Animated.View entering={ZoomIn.delay(900).duration(500)}>
                  <Image
                    source={images['garden.diamond']}
                    style={styles.plant}
                    contentFit="contain"
                  />
                </Animated.View>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={strings.intro.tapPrincess}
              onPress={onPrincess}
              disabled={stage !== 'island'}
              hitSlop={16}
              testID="intro-princess"
              style={styles.princess}
            >
              <Animated.View entering={ZoomIn.springify().damping(12)}>
                <Image
                  source={images['character.princess']}
                  style={styles.princessImage}
                  contentFit="contain"
                  accessibilityLabel={PRINCESS.name}
                />
              </Animated.View>
              {stage === 'island' ? (
                <Animated.View entering={FadeIn.delay(400)} style={styles.hint}>
                  <Text style={styles.hintText}>{strings.intro.tapPrincess}</Text>
                </Animated.View>
              ) : null}
            </Pressable>

            {stage === 'welcome' ? (
              <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.jelly}>
                <JellyGuide
                  size={150}
                  says={strings.intro.guideHello}
                  voicePrompt={voicePrompts.welcome(profile.nickname)}
                />
              </Animated.View>
            ) : null}
          </View>
        </Animated.View>
      )}

      {showSkip ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.intro.skip}
          onPress={finish}
          style={[styles.skip, { top: insets.top + spacing.md, right: insets.right + spacing.lg }]}
          testID="intro-skip"
        >
          <Icon name="next" size={28} />
          <Text style={styles.skipText}>{strings.intro.skip}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  logo: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  logoText: {
    fontFamily: typography.family,
    fontSize: typography.size.display,
    fontWeight: typography.weight.black,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  scene: { flex: 1 },
  stage: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  garden: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    marginBottom: -spacing.lg,
  },
  plant: { width: 110, height: 110 },
  princess: { alignItems: 'center' },
  princessImage: { width: 260, height: 260 },
  hint: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  hintText: {
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  jelly: { position: 'absolute', right: spacing.xl, bottom: 120 },
  skip: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: touch.comfortable,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  skipText: {
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
});
