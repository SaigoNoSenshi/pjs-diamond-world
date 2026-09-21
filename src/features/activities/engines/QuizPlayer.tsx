import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { ActivityDefinition, QuizData, QuizQuestion } from '@/domain/activity/schema';
import { ChoiceButton, type ChoiceState } from '@/features/learning/components/ChoiceButton';
import { JellySays } from '@/features/learning/components/JellySays';
import { ProgressDots } from '@/features/learning/components/ProgressDots';
import { correctLine, shuffle, tryAgainLine } from '@/features/learning/feedback';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, spacing, typography } from '@/theme';

import type { EngineProps } from './types';

const ADVANCE_MS = 900;

/**
 * "Jelly asks": one picture question at a time, 2–4 big answer cards. A wrong tap
 * wobbles and Jelly encourages; the right tap pops, then the next question comes.
 * Score = questions answered right on the first try / total.
 */
export function QuizPlayer({
  activity,
  onComplete,
  questions: override,
}: EngineProps<ActivityDefinition & { data: QuizData }> & { questions?: QuizQuestion[] }) {
  const { speak } = useVoice();
  const { play } = useSfx();
  const { width } = useWindowDimensions();
  const questions = useMemo(
    () => override ?? shuffle(activity.data.questions).slice(0, activity.data.pick),
    [activity.data.questions, activity.data.pick, override],
  );
  const [index, setIndex] = useState(0);
  const [states, setStates] = useState<Record<string, ChoiceState>>({});
  const [missed, setMissed] = useState(false);
  const firstTryRight = useRef(0);
  const lastLine = useRef<string | null>(null);
  const done = useRef(false);

  const question = questions[index];

  useEffect(() => {
    if (question) speak(question.voice ?? question.prompt);
  }, [question, speak]);

  if (!question) return null;

  const choose = (choiceId: string) => {
    if (done.current || states[choiceId] === 'correct') return;
    if (choiceId === question.answerId) {
      play('sparkle');
      const line = correctLine(lastLine.current);
      lastLine.current = line;
      speak(line);
      if (!missed) firstTryRight.current += 1;
      setStates((s) => ({ ...s, [choiceId]: 'correct' }));
      setTimeout(() => {
        if (index + 1 >= questions.length) {
          done.current = true;
          onComplete(firstTryRight.current / questions.length);
        } else {
          setIndex(index + 1);
          setStates({});
          setMissed(false);
        }
      }, ADVANCE_MS);
    } else {
      play('bubble');
      const line = tryAgainLine(lastLine.current);
      lastLine.current = line;
      speak(line);
      setMissed(true);
      setStates((s) => ({ ...s, [choiceId]: 'wrong' }));
      setTimeout(() => setStates((s) => ({ ...s, [choiceId]: 'dim' })), 400);
    }
  };

  const cardSize = Math.min(150, Math.floor((width - spacing.lg * 2 - spacing.md * 3) / 2));
  // Text-only answers (grade quizzes) get double-width cards so long words never break.
  const wide = question.choices.some((c) => !c.picture);

  return (
    <View style={styles.root} testID="quiz-player">
      <ProgressDots total={questions.length} done={index} />
      <JellySays text={question.prompt} {...(question.voice ? { voice: question.voice } : {})} />
      <View style={styles.grid}>
        {question.choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            {...(choice.picture ? { picture: choice.picture } : {})}
            label={choice.label}
            state={states[choice.id] ?? 'idle'}
            onPress={() => choose(choice.id)}
            size={cardSize}
            wide={wide}
            testID={`choice-${choice.id}`}
          />
        ))}
      </View>
      <Text style={styles.counter} accessibilityLiveRegion="polite">
        {index + 1} / {questions.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  grid: {
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
