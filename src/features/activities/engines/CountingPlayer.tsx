import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { strings } from '@/constants/strings';
import type {
  ActivityDefinition,
  CompareRound,
  CountRound,
  CountingData,
  SortRound,
} from '@/domain/activity/schema';
import { ChoiceButton, type ChoiceState } from '@/features/learning/components/ChoiceButton';
import { JellySays } from '@/features/learning/components/JellySays';
import { PictureView } from '@/features/learning/components/PictureView';
import { ProgressDots } from '@/features/learning/components/ProgressDots';
import { correctLine, tryAgainLine } from '@/features/learning/feedback';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

import type { EngineProps } from './types';

const ADVANCE_MS = 900;

/** Counting, sorting and comparing — three small games sharing one round loop. */
export function CountingPlayer({
  activity,
  onComplete,
}: EngineProps<ActivityDefinition & { data: CountingData }>) {
  const data = activity.data;
  const [index, setIndex] = useState(0);
  const firstTry = useRef(0);
  const missed = useRef(false);
  const lastLine = useRef<string | null>(null);
  const { speak } = useVoice();
  const { play } = useSfx();
  const total = data.rounds.length;

  const advance = () => {
    if (!missed.current) firstTry.current += 1;
    missed.current = false;
    if (index + 1 >= total) onComplete(firstTry.current / total);
    else setIndex(index + 1);
  };
  const feedback = (ok: boolean) => {
    play(ok ? 'sparkle' : 'bubble');
    const line = ok ? correctLine(lastLine.current) : tryAgainLine(lastLine.current);
    lastLine.current = line;
    speak(line);
    if (!ok) missed.current = true;
  };

  return (
    <View style={styles.root} testID="counting-player">
      <ProgressDots total={total} done={index} />
      {data.mode === 'count' ? (
        <CountRoundView
          key={data.rounds[index]!.id}
          round={data.rounds[index]!}
          onFeedback={feedback}
          onDone={() => setTimeout(advance, ADVANCE_MS)}
        />
      ) : data.mode === 'sort' ? (
        <SortRoundView
          key={data.rounds[index]!.id}
          round={data.rounds[index]!}
          onFeedback={feedback}
          onDone={() => setTimeout(advance, ADVANCE_MS)}
        />
      ) : (
        <CompareRoundView
          key={data.rounds[index]!.id}
          round={data.rounds[index]!}
          onFeedback={feedback}
          onDone={() => setTimeout(advance, ADVANCE_MS)}
        />
      )}
    </View>
  );
}

interface RoundProps<R> {
  round: R;
  onFeedback: (ok: boolean) => void;
  onDone: () => void;
}

function CountRoundView({ round, onFeedback, onDone }: RoundProps<CountRound>) {
  const { speak } = useVoice();
  const { width } = useWindowDimensions();
  const [states, setStates] = useState<Record<number, ChoiceState>>({});
  const prompt = round.prompt ?? `How many ${round.picture.icon}s do you see?`;
  useEffect(() => {
    speak(prompt);
  }, [prompt, speak]);
  const itemSize = round.count > 12 ? 44 : round.count > 6 ? 56 : 72;
  const choose = (n: number) => {
    if (states[n] === 'correct') return;
    const ok = n === round.count;
    onFeedback(ok);
    setStates((s) => ({ ...s, [n]: ok ? 'correct' : 'wrong' }));
    if (ok) onDone();
    else setTimeout(() => setStates((s) => ({ ...s, [n]: 'dim' })), 400);
  };
  const cardSize = Math.min(120, Math.floor((width - spacing.lg * 4) / round.choices.length));
  return (
    <>
      <JellySays text={prompt} compact />
      <View style={styles.items} testID="count-items">
        {Array.from({ length: round.count }, (_, i) => (
          <PictureView key={i} picture={round.picture} size={itemSize} />
        ))}
      </View>
      <View style={styles.choices}>
        {round.choices.map((n) => (
          <ChoiceButton
            key={n}
            text={String(n)}
            state={states[n] ?? 'idle'}
            onPress={() => choose(n)}
            size={cardSize}
            testID={`count-choice-${n}`}
            accessibilityLabel={String(n)}
          />
        ))}
      </View>
    </>
  );
}

function SortRoundView({ round, onFeedback, onDone }: RoundProps<SortRound>) {
  const { speak } = useVoice();
  const { play } = useSfx();
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({}); // itemId → binId
  useEffect(() => {
    speak(round.prompt);
  }, [round.prompt, speak]);
  const remaining = round.items.filter((i) => !placed[i.id]);

  const pickItem = (id: string) => {
    play('tap');
    setSelected(id);
  };
  const dropInBin = (binId: string) => {
    if (!selected) return;
    const item = round.items.find((i) => i.id === selected);
    if (!item) return;
    const ok = item.binId === binId;
    onFeedback(ok);
    if (ok) {
      const next = { ...placed, [item.id]: binId };
      setPlaced(next);
      setSelected(null);
      if (Object.keys(next).length === round.items.length) onDone();
    }
  };

  return (
    <>
      <JellySays text={round.prompt} compact />
      <View style={styles.items} testID="sort-items">
        {remaining.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`${item.picture.icon}`}
            accessibilityState={{ selected: selected === item.id }}
            onPress={() => pickItem(item.id)}
            style={[styles.sortItem, selected === item.id && styles.sortItemSelected]}
            testID={`sort-item-${item.id}`}
          >
            <PictureView picture={item.picture} size={64} />
          </Pressable>
        ))}
      </View>
      <View style={styles.bins}>
        {round.bins.map((bin) => {
          const inBin = round.items.filter((i) => placed[i.id] === bin.id);
          return (
            <Pressable
              key={bin.id}
              accessibilityRole="button"
              accessibilityLabel={`${bin.label} basket`}
              onPress={() => dropInBin(bin.id)}
              style={[styles.bin, { borderColor: bin.color ?? palette.ink }]}
              testID={`sort-bin-${bin.id}`}
            >
              <View style={styles.binHeader}>
                {bin.picture ? <PictureView picture={bin.picture} size={36} /> : null}
                <Text style={[styles.binLabel, bin.color ? { color: bin.color } : null]}>
                  {bin.label}
                </Text>
              </View>
              <View style={styles.binItems}>
                {inBin.map((i) => (
                  <PictureView key={i.id} picture={i.picture} size={40} />
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

function CompareRoundView({ round, onFeedback, onDone }: RoundProps<CompareRound>) {
  const { speak } = useVoice();
  const [state, setState] = useState<Record<string, ChoiceState>>({});
  useEffect(() => {
    speak(round.prompt);
  }, [round.prompt, speak]);
  const choose = (side: 'left' | 'right' | 'same') => {
    if (state[side] === 'correct') return;
    const ok = side === round.answer;
    onFeedback(ok);
    setState((s) => ({ ...s, [side]: ok ? 'correct' : 'wrong' }));
    if (ok) onDone();
    else setTimeout(() => setState((s) => ({ ...s, [side]: 'dim' })), 400);
  };
  return (
    <>
      <JellySays text={round.prompt} compact />
      <View style={styles.compareRow}>
        <CompareSide side="left" round={round} state={state['left'] ?? 'idle'} onChoose={choose} />
        <CompareSide
          side="right"
          round={round}
          state={state['right'] ?? 'idle'}
          onChoose={choose}
        />
      </View>
      <View style={styles.choices}>
        <ChoiceButton
          text="="
          label={strings.learning.same}
          state={state['same'] ?? 'idle'}
          onPress={() => choose('same')}
          size={110}
          testID="compare-same"
          accessibilityLabel={strings.learning.same}
        />
      </View>
    </>
  );
}

function CompareSide({
  side,
  round,
  state,
  onChoose,
}: {
  side: 'left' | 'right';
  round: CompareRound;
  state: ChoiceState;
  onChoose: (side: 'left' | 'right') => void;
}) {
  const group = round[side];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${side} side, ${group.count}`}
      onPress={() => onChoose(side)}
      style={[
        styles.compareSide,
        state === 'correct' && styles.compareCorrect,
        state === 'dim' && styles.dim,
      ]}
      testID={`compare-${side}`}
    >
      <View style={styles.items}>
        {Array.from({ length: group.count }, (_, i) => (
          <PictureView key={i} picture={group.picture} size={group.count > 6 ? 40 : 56} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.md },
  items: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: spacing.sm,
    minHeight: 80,
  },
  choices: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, flexWrap: 'wrap' },
  sortItem: {
    padding: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: 'transparent',
    ...shadows.soft,
  },
  sortItemSelected: { borderColor: palette.ink },
  bins: { flexDirection: 'row', gap: spacing.md, minHeight: 130 },
  bin: {
    flex: 1,
    borderWidth: 4,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceSoft,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  binHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  binLabel: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.black,
    color: colors.text,
  },
  binItems: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, justifyContent: 'center' },
  compareRow: { flex: 1, flexDirection: 'row', gap: spacing.md },
  compareSide: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 4,
    borderColor: 'transparent',
    padding: spacing.sm,
    ...shadows.soft,
  },
  compareCorrect: { borderColor: palette.leaf, backgroundColor: '#EAF9EE' },
  dim: { opacity: 0.5 },
});
