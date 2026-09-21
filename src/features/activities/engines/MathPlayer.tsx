import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { ActivityDefinition, MathData } from '@/domain/activity/schema';
import { generateMath, type MathQuestion } from '@/domain/generators/math';
import { ChoiceButton, type ChoiceState } from '@/features/learning/components/ChoiceButton';
import { JellySays } from '@/features/learning/components/JellySays';
import { Keypad } from '@/features/learning/components/Keypad';
import { PictureView } from '@/features/learning/components/PictureView';
import { ProgressDots } from '@/features/learning/components/ProgressDots';
import { correctLine, tryAgainLine } from '@/features/learning/feedback';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

import type { EngineProps } from './types';

const ADVANCE_MS = 900;

/**
 * Generated math: a fresh seeded set each play. Choice cards for young grades, a
 * keypad from Grade 3. Two wrong tries on a keypad question reveal the answer
 * (learning, not punishment) and the round moves on.
 */
export function MathPlayer({
  activity,
  onComplete,
  seed,
}: EngineProps<ActivityDefinition & { data: MathData }> & { seed?: string }) {
  const data = activity.data;
  const { speak } = useVoice();
  const { play } = useSfx();
  const { width } = useWindowDimensions();
  // A fresh seed per mount (and per "play again"), fixed for the life of this round.
  const [runSeed] = useState(() => seed ?? String(Date.now()));
  const questions = useMemo(
    () => generateMath(data.generator, data.grade, data.rounds, runSeed, data.input),
    [data.generator, data.grade, data.rounds, data.input, runSeed],
  );
  const [index, setIndex] = useState(0);
  const [states, setStates] = useState<Record<string, ChoiceState>>({});
  const [typed, setTyped] = useState('');
  const [reveal, setReveal] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const missed = useRef(false);
  const wrongTries = useRef(0);
  const firstTry = useRef(0);
  const lastLine = useRef<string | null>(null);
  const question: MathQuestion | undefined = questions[index];

  useEffect(() => {
    if (question) speak(question.voice ?? question.prompt);
  }, [question, speak]);

  if (!question) return null;

  const advance = () => {
    if (!missed.current) firstTry.current += 1;
    missed.current = false;
    wrongTries.current = 0;
    setTimeout(() => {
      if (index + 1 >= questions.length) onComplete(firstTry.current / questions.length);
      else {
        setIndex(index + 1);
        setStates({});
        setTyped('');
        setReveal(null);
        setLocked(false);
      }
    }, ADVANCE_MS);
  };
  const feedback = (ok: boolean) => {
    play(ok ? 'sparkle' : 'bubble');
    const line = ok ? correctLine(lastLine.current) : tryAgainLine(lastLine.current);
    lastLine.current = line;
    speak(line);
    if (!ok) missed.current = true;
  };

  const chooseCard = (value: string) => {
    if (locked || states[value] === 'correct') return;
    const ok = normalise(value) === normalise(question.answer);
    feedback(ok);
    setStates((s) => ({ ...s, [value]: ok ? 'correct' : 'wrong' }));
    if (ok) {
      setLocked(true);
      advance();
    } else setTimeout(() => setStates((s) => ({ ...s, [value]: 'dim' })), 400);
  };

  const checkTyped = () => {
    if (locked) return;
    const ok = normalise(typed) === normalise(question.answer);
    feedback(ok);
    if (ok) {
      setLocked(true);
      setReveal(question.answer);
      advance();
      return;
    }
    wrongTries.current += 1;
    if (wrongTries.current >= 2) {
      speak(`The answer is ${question.answer}.`);
      setReveal(question.answer);
      setLocked(true);
      advance();
    } else setTyped('');
  };

  const cardSize = Math.min(150, Math.floor((width - spacing.lg * 2 - spacing.md * 3) / 4));
  const allowNegative = data.generator === 'integers';
  const allowDecimal = data.generator === 'decimals';

  return (
    <View style={styles.root} testID="math-player">
      <ProgressDots total={questions.length} done={index} color={palette.sea} />
      <JellySays text={question.prompt} {...(question.voice ? { voice: question.voice } : {})} />
      {question.visual ? (
        <View style={styles.visual} testID="math-visual">
          {Array.from({ length: question.visual.count }, (_, i) => (
            <PictureView
              key={i}
              picture={{ icon: question.visual!.icon, color: palette.tangerine }}
              size={question.visual!.count > 8 ? 36 : 52}
            />
          ))}
        </View>
      ) : null}
      <View style={styles.prompt}>
        <Text style={styles.promptText} accessibilityRole="header">
          {question.prompt}
        </Text>
        {reveal ? (
          <Text style={styles.reveal} testID="math-reveal">
            = {reveal}
          </Text>
        ) : null}
      </View>
      {question.choices ? (
        <View style={styles.choices}>
          {question.choices.map((c) => (
            <ChoiceButton
              key={c}
              text={c}
              state={states[c] ?? 'idle'}
              onPress={() => chooseCard(c)}
              size={cardSize}
              accessibilityLabel={c}
              testID={`math-choice-${c.replace(/[^0-9a-z]/gi, '_')}`}
            />
          ))}
        </View>
      ) : (
        <Keypad
          value={typed}
          onChange={setTyped}
          onCheck={checkTyped}
          allowNegative={allowNegative}
          allowDecimal={allowDecimal}
          disabled={locked}
        />
      )}
      <Text style={styles.counter}>
        {index + 1} / {questions.length}
      </Text>
    </View>
  );
}

function normalise(v: string): string {
  const t = v.trim().replace(/\s+/g, '');
  if (/^-?\d+(\.\d+)?$/.test(t)) return String(Number(t));
  return t.toLowerCase();
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.md },
  visual: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.xs },
  prompt: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.soft,
  },
  promptText: {
    fontFamily: typography.family,
    fontSize: 30,
    fontWeight: typography.weight.black,
    color: colors.text,
    textAlign: 'center',
  },
  reveal: {
    fontFamily: typography.family,
    fontSize: 28,
    fontWeight: typography.weight.black,
    color: palette.leaf,
  },
  choices: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: spacing.md,
  },
  counter: {
    textAlign: 'center',
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    color: colors.textSoft,
  },
});
