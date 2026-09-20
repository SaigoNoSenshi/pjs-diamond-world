import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { BigButton } from '@/components/BigButton';
import { Bounce } from '@/components/animations/Bounce';
import { Sparkle } from '@/components/animations/Sparkle';
import { resolveImage } from '@/constants/images';
import { strings } from '@/constants/strings';
import type { CraftSession } from '@/domain/craft/craftEngine';
import { currentStep, isFirstStep, isLastStep } from '@/domain/craft/craftEngine';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, spacing, typography } from '@/theme';

import { StepDots } from './StepDots';

export interface CraftStepViewProps {
  session: CraftSession;
  onNext: () => void;
  onBack: () => void;
  /** Rendered instead of the NEXT button for PHOTO and SAVE steps. */
  actionSlot?: React.ReactNode;
}

/**
 * One craft step: huge illustration, a few words, a voice prompt spoken on arrival,
 * BACK and a very large NEXT. Reads the template — knows nothing about clay cups.
 */
export function CraftStepView({ session, onNext, onBack, actionSlot }: CraftStepViewProps) {
  const step = currentStep(session);
  const { speak } = useVoice();
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const illustration = resolveImage(step.illustration);

  useEffect(() => {
    speak(step.audioPrompt);
  }, [step.id, step.audioPrompt, speak]);

  const picture = (
    <View style={styles.illustrationWrap}>
      {step.animation === 'sparkle' ? <Sparkle count={5} loop={false} /> : null}
      {illustration ? (
        <Image
          source={illustration}
          style={styles.illustration}
          contentFit="contain"
          accessibilityLabel={step.instruction}
        />
      ) : (
        <Text style={styles.missing}>🧩</Text>
      )}
    </View>
  );

  return (
    <Animated.View
      key={step.id}
      entering={FadeIn.duration(220)}
      style={[styles.root, landscape && styles.rootLandscape]}
    >
      <View style={styles.stage}>
        {step.animation === 'bounce' || step.animation === 'wiggle' ? (
          <Bounce amplitude={6} style={styles.fill}>
            {picture}
          </Bounce>
        ) : (
          picture
        )}
        <Text style={styles.instruction} accessibilityRole="header">
          {step.instruction}
        </Text>
      </View>
      <View style={[styles.controls, landscape && styles.controlsLandscape]}>
        <StepDots total={session.template.steps.length} current={session.stepIndex} />
        <View style={styles.buttons}>
          <BigButton
            icon="back"
            label={strings.crafts.back}
            onPress={onBack}
            color={colors.surface}
            size="comfortable"
            disabled={isFirstStep(session)}
            testID="craft-back"
          />
          {actionSlot ??
            (!isLastStep(session) ? (
              <BigButton
                icon="next"
                label={strings.crafts.next}
                onPress={onNext}
                color={palette.leaf}
                size="primary"
                testID="craft-next"
              />
            ) : null)}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  rootLandscape: { flexDirection: 'row' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  illustrationWrap: {
    width: '100%',
    flex: 1,
    maxHeight: 420,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  illustration: { width: '90%', height: '90%' },
  fill: { flex: 1, width: '100%', alignSelf: 'stretch' },
  missing: { fontSize: 96 },
  instruction: {
    fontFamily: typography.family,
    fontSize: typography.size.title,
    fontWeight: typography.weight.black,
    color: colors.text,
    textAlign: 'center',
  },
  controls: { gap: spacing.lg, alignItems: 'center' },
  controlsLandscape: { justifyContent: 'center', minWidth: 260 },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
