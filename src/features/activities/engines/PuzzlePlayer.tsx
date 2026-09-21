import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { resolveImage } from '@/constants/images';
import type { ActivityDefinition, PatternRound, PuzzleData } from '@/domain/activity/schema';
import { ChoiceButton, type ChoiceState } from '@/features/learning/components/ChoiceButton';
import { JellySays } from '@/features/learning/components/JellySays';
import { PictureView } from '@/features/learning/components/PictureView';
import { ProgressDots } from '@/features/learning/components/ProgressDots';
import { correctLine, shuffle, tryAgainLine } from '@/features/learning/feedback';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

import type { EngineProps } from './types';

export function PuzzlePlayer(props: EngineProps<ActivityDefinition & { data: PuzzleData }>) {
  return props.activity.data.mode === 'jigsaw' ? (
    <JigsawPlayer {...props} data={props.activity.data} />
  ) : (
    <PatternPlayer {...props} rounds={props.activity.data.rounds} />
  );
}

/** Tap-two-to-swap jigsaw. Tiles are clipped windows onto one image. */
function JigsawPlayer({
  activity,
  onComplete,
  data,
  initialOrder,
}: EngineProps<ActivityDefinition & { data: PuzzleData }> & {
  data: Extract<PuzzleData, { mode: 'jigsaw' }>;
  initialOrder?: number[];
}) {
  const { speak } = useVoice();
  const { play } = useSfx();
  const { width, height } = useWindowDimensions();
  const n = data.grid;
  const total = n * n;
  const [order, setOrder] = useState<number[]>(() => {
    if (initialOrder) return initialOrder;
    let o = shuffle(Array.from({ length: total }, (_, i) => i));
    if (o.every((v, i) => v === i)) o = [...o.slice(1), o[0]!];
    return o;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const swaps = useRef(0);
  const solved = order.every((v, i) => v === i);
  const source = resolveImage(data.image);

  useEffect(() => {
    if (solved) {
      play('celebrate');
      const t = setTimeout(
        () => onComplete(Math.min(1, total / Math.max(total, swaps.current))),
        700,
      );
      return () => clearTimeout(t);
    }
    return undefined;
  }, [solved, onComplete, play, total]);

  const board = Math.min(width - spacing.lg * 2, height * 0.55, 480);
  const tile = board / n;

  const tap = (slot: number) => {
    if (solved) return;
    play('tap');
    if (selected === null) {
      setSelected(slot);
      return;
    }
    if (selected === slot) {
      setSelected(null);
      return;
    }
    swaps.current += 1;
    const next = [...order];
    [next[selected], next[slot]] = [next[slot]!, next[selected]!];
    setOrder(next);
    setSelected(null);
    if (next[slot] === slot || next[selected] === selected) speak(correctLine(null));
  };

  return (
    <View style={styles.root} testID="jigsaw-player">
      <JellySays text={activity.instruction} compact />
      <View style={[styles.board, { width: board, height: board }]}>
        {order.map((piece, slot) => {
          const px = piece % n;
          const py = Math.floor(piece / n);
          return (
            <Pressable
              key={slot}
              accessibilityRole="button"
              accessibilityLabel={`Piece ${slot + 1}`}
              accessibilityState={{ selected: selected === slot }}
              onPress={() => tap(slot)}
              style={[
                styles.tile,
                {
                  width: tile,
                  height: tile,
                  left: (slot % n) * tile,
                  top: Math.floor(slot / n) * tile,
                },
                selected === slot && styles.tileSelected,
                solved && styles.tileSolved,
              ]}
              testID={`tile-${slot}`}
            >
              {source ? (
                <Image
                  source={source}
                  contentFit="cover"
                  style={{
                    position: 'absolute',
                    width: board,
                    height: board,
                    left: -px * tile,
                    top: -py * tile,
                  }}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>
      {solved ? <Text style={styles.solved}>✓</Text> : null}
    </View>
  );
}

function PatternPlayer({
  activity,
  onComplete,
  rounds,
}: EngineProps<ActivityDefinition & { data: PuzzleData }> & { rounds: PatternRound[] }) {
  const { speak } = useVoice();
  const { play } = useSfx();
  const [index, setIndex] = useState(0);
  const [states, setStates] = useState<Record<number, ChoiceState>>({});
  const missed = useRef(false);
  const firstTry = useRef(0);
  const lastLine = useRef<string | null>(null);
  const round = rounds[index]!;
  const gap = useMemo(() => round.sequence.findIndex((s) => s === null), [round]);

  useEffect(() => {
    speak(activity.instruction);
  }, [activity.instruction, speak, index]);

  const choose = (i: number) => {
    if (states[i] === 'correct') return;
    const ok = i === round.answerIndex;
    play(ok ? 'sparkle' : 'bubble');
    const line = ok ? correctLine(lastLine.current) : tryAgainLine(lastLine.current);
    lastLine.current = line;
    speak(line);
    if (ok) {
      if (!missed.current) firstTry.current += 1;
      setStates({ [i]: 'correct' });
      setTimeout(() => {
        if (index + 1 >= rounds.length) onComplete(firstTry.current / rounds.length);
        else {
          setIndex(index + 1);
          setStates({});
          missed.current = false;
        }
      }, 900);
    } else {
      missed.current = true;
      setStates((s) => ({ ...s, [i]: 'wrong' }));
      setTimeout(() => setStates((s) => ({ ...s, [i]: 'dim' })), 400);
    }
  };
  const filled = states[round.answerIndex] === 'correct';

  return (
    <View style={styles.root} testID="pattern-player">
      <ProgressDots total={rounds.length} done={index} />
      <JellySays text={activity.instruction} compact />
      <View style={styles.sequence}>
        {round.sequence.map((item, i) => (
          <View key={i} style={[styles.seqCell, i === gap && styles.gapCell]}>
            {item ? (
              <PictureView picture={item} size={56} />
            ) : filled ? (
              <PictureView picture={round.choices[round.answerIndex]!} size={56} />
            ) : (
              <Text style={styles.question}>?</Text>
            )}
          </View>
        ))}
      </View>
      <View style={styles.choices}>
        {round.choices.map((c, i) => (
          <ChoiceButton
            key={i}
            picture={c}
            state={states[i] ?? 'idle'}
            onPress={() => choose(i)}
            size={110}
            testID={`pattern-choice-${i}`}
            accessibilityLabel={`${c.icon} choice`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.lg, alignItems: 'center' },
  board: {
    position: 'relative',
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: palette.mist,
  },
  tile: { position: 'absolute', overflow: 'hidden', borderWidth: 2, borderColor: palette.white },
  tileSelected: { borderWidth: 5, borderColor: palette.sunshine },
  tileSolved: { borderColor: 'transparent' },
  solved: { fontSize: 40, color: palette.leaf },
  sequence: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    ...shadows.soft,
  },
  seqCell: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  gapCell: {
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: palette.inkSoft,
    borderRadius: radii.sm,
  },
  question: {
    fontFamily: typography.family,
    fontSize: 36,
    fontWeight: typography.weight.black,
    color: palette.inkSoft,
  },
  choices: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
});
