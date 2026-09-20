import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HoldButton } from '@/components/HoldButton';
import { ScreenShell } from '@/components/ScreenShell';
import { layout } from '@/constants/layout';
import { parentStrings } from '@/constants/parentStrings';
import { routes } from '@/constants/routes';
import { createChallenge, verifyPin } from '@/domain/profile/parentGate';
import { useParentSession } from '@/hooks/useParentSession';
import { useProfile } from '@/hooks/useProfile';
import { colors, palette, radii, spacing, touch, typography } from '@/theme';

import { PinPad } from './components/PinPad';

type Stage = 'hold' | 'challenge';

/**
 * Parent gate: press-and-hold, then an arithmetic question (or the parent PIN).
 * Deliberately plain so it does not invite a child to play with it.
 */
export function ParentGateScreen() {
  const router = useRouter();
  const { settings } = useProfile();
  const { unlock } = useParentSession();
  const [stage, setStage] = useState<Stage>('hold');
  const [error, setError] = useState<string | null>(null);
  // A new question on every wrong answer.
  const [challenge, setChallenge] = useState(() => createChallenge());

  const succeed = () => {
    unlock();
    router.replace(routes.parentHome);
  };

  const answer = (value: number) => {
    if (value === challenge.answer) {
      succeed();
    } else {
      setError(parentStrings.gate.wrong);
      setChallenge(createChallenge());
    }
  };

  const tryPin = (pin: string) => {
    if (verifyPin(pin, settings.parentPinHash)) succeed();
    else setError(parentStrings.gate.wrong);
  };

  return (
    <ScreenShell title={parentStrings.gate.title} backgroundColor={palette.mist}>
      <View style={styles.root}>
        {stage === 'hold' ? (
          <>
            <Text style={styles.hint}>{parentStrings.gate.holdHint}</Text>
            <HoldButton
              icon="lock"
              label={parentStrings.gate.hold}
              holdMs={layout.parentGateHoldMs}
              onComplete={() => setStage('challenge')}
              size={touch.hero}
              testID="parent-gate-hold"
            />
          </>
        ) : settings.parentPinHash ? (
          <>
            <Text style={styles.question}>{parentStrings.gate.pinTitle}</Text>
            <PinPad onComplete={tryPin} error={error ?? undefined} />
          </>
        ) : (
          <>
            <Text style={styles.question} accessibilityRole="header" testID="parent-gate-question">
              {parentStrings.gate.question(challenge.a, challenge.b)}
            </Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.options}>
              {challenge.options.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityLabel={String(option)}
                  onPress={() => answer(option)}
                  style={({ pressed }) => [styles.option, pressed && styles.pressed]}
                  testID={`gate-option-${option}`}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    padding: spacing.xl,
  },
  hint: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    color: colors.textSoft,
    textAlign: 'center',
  },
  question: {
    fontFamily: typography.family,
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  error: { fontFamily: typography.family, fontSize: typography.size.body, color: palette.coral },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, justifyContent: 'center' },
  option: {
    width: touch.primary,
    height: touch.primary,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.95 }] },
  optionText: {
    fontFamily: typography.family,
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
});
