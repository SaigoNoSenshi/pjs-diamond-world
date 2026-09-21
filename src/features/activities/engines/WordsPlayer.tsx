import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/icons/Icon';
import { IconButton } from '@/components/IconButton';
import { wordsForGrade } from '@/content/words';
import { strings } from '@/constants/strings';
import type { ActivityDefinition, WordsData } from '@/domain/activity/schema';
import { generateWords, type WordsQuestion } from '@/domain/generators/words';
import { ChoiceButton, type ChoiceState } from '@/features/learning/components/ChoiceButton';
import { JellySays } from '@/features/learning/components/JellySays';
import { ProgressDots } from '@/features/learning/components/ProgressDots';
import { correctLine, tryAgainLine } from '@/features/learning/feedback';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

import type { EngineProps } from './types';

const ADVANCE_MS = 900;

/** Spelling, vocabulary and grammar from the grade word banks. */
export function WordsPlayer({
  activity,
  onComplete,
  seed,
}: EngineProps<ActivityDefinition & { data: WordsData }> & { seed?: string }) {
  const data = activity.data;
  const { speak } = useVoice();
  const { play } = useSfx();
  const [runSeed] = useState(() => seed ?? String(Date.now()));
  const questions = useMemo(
    () => generateWords(wordsForGrade(data.grade), data.mode, data.rounds, runSeed),
    [data.grade, data.mode, data.rounds, runSeed],
  );
  const [index, setIndex] = useState(0);
  const missed = useRef(false);
  const firstTry = useRef(0);
  const lastLine = useRef<string | null>(null);
  const question = questions[index];

  useEffect(() => {
    if (!question) return;
    if (question.mode === 'spell') speak(`Spell ${question.word}.`);
    else if (question.mode === 'missing') speak(`Which letter is missing from ${question.word}?`);
    else if (question.mode === 'unscramble') speak('Put the words in order to make a sentence.');
    else if (question.mode === 'synonym') speak(`Which word means the same as ${question.word}?`);
    else if (question.mode === 'antonym') speak(`Which word is the opposite of ${question.word}?`);
    else speak(`What kind of word is ${question.word}?`);
  }, [question, speak]);

  if (!question) {
    if (questions.length === 0) onComplete(1);
    return null;
  }

  const feedback = (ok: boolean) => {
    play(ok ? 'sparkle' : 'bubble');
    const line = ok ? correctLine(lastLine.current) : tryAgainLine(lastLine.current);
    lastLine.current = line;
    speak(line);
    if (!ok) missed.current = true;
  };
  const advance = () => {
    if (!missed.current) firstTry.current += 1;
    missed.current = false;
    setTimeout(() => {
      if (index + 1 >= questions.length) onComplete(firstTry.current / questions.length);
      else setIndex(index + 1);
    }, ADVANCE_MS);
  };

  return (
    <View style={styles.root} testID="words-player">
      <ProgressDots total={questions.length} done={index} color={palette.blossom} />
      <JellySays text={activity.instruction} compact />
      <Round key={question.id} question={question} onFeedback={feedback} onDone={advance} />
      <Text style={styles.counter}>
        {index + 1} / {questions.length}
      </Text>
    </View>
  );
}

function Round({
  question,
  onFeedback,
  onDone,
}: {
  question: WordsQuestion;
  onFeedback: (ok: boolean) => void;
  onDone: () => void;
}) {
  switch (question.mode) {
    case 'spell':
      return (
        <TileOrder
          tokens={question.letters}
          target={question.word.split('')}
          label={question.word}
          icon={question.icon}
          hint={question.hint}
          onFeedback={onFeedback}
          onDone={onDone}
          testPrefix="letter"
        />
      );
    case 'unscramble':
      return (
        <TileOrder
          tokens={question.words}
          target={question.sentence.split(' ')}
          label={question.sentence}
          onFeedback={onFeedback}
          onDone={onDone}
          testPrefix="word"
        />
      );
    case 'missing':
      return <MissingLetter question={question} onFeedback={onFeedback} onDone={onDone} />;
    default:
      return (
        <Choose
          word={question.word}
          sentence={question.mode === 'partOfSpeech' ? question.sentence : undefined}
          choices={question.choices}
          answer={question.answer}
          onFeedback={onFeedback}
          onDone={onDone}
        />
      );
  }
}

/** Tap tokens in order (letters for spelling, words for a sentence). Wrong tap wobbles. */
function TileOrder({
  tokens,
  target,
  label,
  icon,
  hint,
  onFeedback,
  onDone,
  testPrefix,
}: {
  tokens: string[];
  target: string[];
  label: string;
  icon?: string | undefined;
  hint?: string | undefined;
  onFeedback: (ok: boolean) => void;
  onDone: () => void;
  testPrefix: string;
}) {
  const { speak } = useVoice();
  const { play } = useSfx();
  const [used, setUsed] = useState<number[]>([]);
  const [wobble, setWobble] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const placed = used.map((i) => tokens[i]!);
  const done = placed.length === target.length;

  const tap = (i: number) => {
    if (done || used.includes(i)) return;
    const expected = target[placed.length]!;
    if (tokens[i]!.toLowerCase() === expected.toLowerCase()) {
      play('tap');
      const next = [...used, i];
      setUsed(next);
      if (next.length === target.length) {
        onFeedback(true);
        speak(label);
        onDone();
      }
    } else {
      onFeedback(false);
      setWobble(i);
      setTimeout(() => setWobble(null), 400);
    }
  };
  const undo = () => {
    play('tap');
    setUsed((u) => u.slice(0, -1));
  };

  return (
    <View style={styles.tileRoot}>
      {icon ? <Icon name={icon as IconName} size={72} color={palette.sunshine} /> : null}
      <View style={styles.slots} testID="slots">
        {target.map((_t, i) => (
          <View
            key={i}
            style={[
              styles.slot,
              placed[i] !== undefined && styles.slotFilled,
              testPrefix === 'word' && styles.slotWide,
            ]}
          >
            <Text style={[styles.slotText, testPrefix === 'word' && styles.slotTextSmall]}>
              {placed[i] ?? (testPrefix === 'letter' ? '_' : '…')}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.tiles}>
        {tokens.map((tok, i) => (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={tok}
            accessibilityState={{ disabled: used.includes(i) }}
            disabled={used.includes(i) || done}
            onPress={() => tap(i)}
            style={({ pressed }) => [
              styles.tile,
              testPrefix === 'word' && styles.tileWide,
              used.includes(i) && styles.tileUsed,
              wobble === i && styles.tileWobble,
              pressed && styles.pressed,
            ]}
            testID={`${testPrefix}-${i}`}
          >
            <Text style={[styles.tileText, testPrefix === 'word' && styles.tileTextSmall]}>
              {tok}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.tileActions}>
        <IconButton
          icon="undo"
          label={strings.drawing.undo}
          onPress={undo}
          disabled={used.length === 0 || done}
          testID="tile-undo"
        />
        {hint ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={strings.learning.hearAgain}
            onPress={() => {
              setShowHint(true);
              speak(hint);
            }}
            style={styles.hintButton}
            testID="tile-hint"
          >
            <Icon name="volume" size={22} />
            <Text style={styles.hintText}>{showHint ? hint : strings.learning.hearAgain}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function MissingLetter({
  question,
  onFeedback,
  onDone,
}: {
  question: Extract<WordsQuestion, { mode: 'missing' }>;
  onFeedback: (ok: boolean) => void;
  onDone: () => void;
}) {
  const [states, setStates] = useState<Record<string, ChoiceState>>({});
  const [solved, setSolved] = useState(false);
  const shown = question.word
    .split('')
    .map((l, i) => (i === question.index && !solved ? '_' : l))
    .join(' ');
  const choose = (l: string) => {
    if (solved) return;
    const ok = l === question.word[question.index];
    onFeedback(ok);
    setStates((s) => ({ ...s, [l]: ok ? 'correct' : 'wrong' }));
    if (ok) {
      setSolved(true);
      onDone();
    } else setTimeout(() => setStates((s) => ({ ...s, [l]: 'dim' })), 400);
  };
  return (
    <View style={styles.tileRoot}>
      {question.icon ? (
        <Icon name={question.icon as IconName} size={72} color={palette.sunshine} />
      ) : null}
      <Text style={styles.bigWord} testID="missing-word">
        {shown}
      </Text>
      {question.hint ? <Text style={styles.hint}>{question.hint}</Text> : null}
      <View style={styles.choices}>
        {question.choices.map((l) => (
          <ChoiceButton
            key={l}
            text={l}
            state={states[l] ?? 'idle'}
            onPress={() => choose(l)}
            size={96}
            accessibilityLabel={l}
            testID={`letter-choice-${l}`}
          />
        ))}
      </View>
    </View>
  );
}

function Choose({
  word,
  sentence,
  choices,
  answer,
  onFeedback,
  onDone,
}: {
  word: string;
  sentence?: string | undefined;
  choices: string[];
  answer: string;
  onFeedback: (ok: boolean) => void;
  onDone: () => void;
}) {
  const [states, setStates] = useState<Record<string, ChoiceState>>({});
  const [solved, setSolved] = useState(false);
  const choose = (c: string) => {
    if (solved) return;
    const ok = c === answer;
    onFeedback(ok);
    setStates((s) => ({ ...s, [c]: ok ? 'correct' : 'wrong' }));
    if (ok) {
      setSolved(true);
      onDone();
    } else setTimeout(() => setStates((s) => ({ ...s, [c]: 'dim' })), 400);
  };
  return (
    <View style={styles.tileRoot}>
      <Text style={styles.bigWord}>{word}</Text>
      {sentence ? <Text style={styles.hint}>{sentence}</Text> : null}
      <View style={styles.choices}>
        {choices.map((c) => (
          <ChoiceButton
            key={c}
            label={c}
            state={states[c] ?? 'idle'}
            onPress={() => choose(c)}
            size={140}
            accessibilityLabel={c}
            testID={`word-choice-${c.replace(/\W/g, '_')}`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.md },
  counter: {
    textAlign: 'center',
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    color: colors.textSoft,
  },
  tileRoot: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  slots: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.xs },
  slot: {
    minWidth: 44,
    height: 56,
    borderRadius: radii.sm,
    borderBottomWidth: 4,
    borderColor: palette.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  slotWide: { minWidth: 60 },
  slotFilled: { borderColor: palette.leaf, backgroundColor: '#EAF9EE' },
  slotText: {
    fontFamily: typography.family,
    fontSize: 32,
    fontWeight: typography.weight.black,
    color: colors.text,
  },
  slotTextSmall: { fontSize: 20 },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    maxWidth: 640,
  },
  tile: {
    minWidth: 64,
    height: 64,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: palette.sunshine,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  tileWide: { minWidth: 80, backgroundColor: palette.aqua },
  tileUsed: { opacity: 0.25 },
  tileWobble: { backgroundColor: palette.mist },
  pressed: { transform: [{ scale: 0.94 }] },
  tileText: {
    fontFamily: typography.family,
    fontSize: 30,
    fontWeight: typography.weight.black,
    color: colors.text,
  },
  tileTextSmall: { fontSize: 20 },
  tileActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  hintText: { fontFamily: typography.family, fontSize: typography.size.body, color: colors.text },
  bigWord: {
    fontFamily: typography.family,
    fontSize: 40,
    fontWeight: typography.weight.black,
    color: colors.text,
    letterSpacing: 2,
    textAlign: 'center',
  },
  hint: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    color: colors.textSoft,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  choices: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
});
