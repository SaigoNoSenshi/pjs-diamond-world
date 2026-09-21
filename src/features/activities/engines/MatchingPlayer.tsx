import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Icon } from '@/components/icons/Icon';
import type { ActivityDefinition, MatchingData } from '@/domain/activity/schema';
import { JellySays } from '@/features/learning/components/JellySays';
import { PictureView } from '@/features/learning/components/PictureView';
import { ProgressDots } from '@/features/learning/components/ProgressDots';
import { correctLine, shuffle } from '@/features/learning/feedback';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing } from '@/theme';

import type { EngineProps } from './types';

interface Card {
  key: string;
  pairId: string;
}

const HIDE_MS = 900;

/** Memory cards: flip two, keep matches face up. No timer, no move counter. */
export function MatchingPlayer({
  activity,
  onComplete,
  order,
}: EngineProps<ActivityDefinition & { data: MatchingData }> & { order?: string[] }) {
  const { speak } = useVoice();
  const { play } = useSfx();
  const { width, height } = useWindowDimensions();
  const pairs = activity.data.pairs;
  const cards = useMemo<Card[]>(() => {
    const all = pairs.flatMap((p) => [
      { key: `${p.id}-a`, pairId: p.id },
      { key: `${p.id}-b`, pairId: p.id },
    ]);
    if (order) return order.map((k) => all.find((c) => c.key === k)!).filter(Boolean);
    return shuffle(all);
  }, [pairs, order]);
  const [faceUp, setFaceUp] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const busy = useRef(false);
  const lastLine = useRef<string | null>(null);
  const attempts = useRef(0);

  useEffect(() => {
    if (matched.length === pairs.length && pairs.length > 0) {
      const score = Math.min(1, pairs.length / Math.max(pairs.length, attempts.current));
      const t = setTimeout(() => onComplete(score), 600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [matched.length, pairs.length, onComplete]);

  const flip = (card: Card) => {
    if (busy.current || faceUp.includes(card.key) || matched.includes(card.pairId)) return;
    play('tap');
    const next = [...faceUp, card.key];
    setFaceUp(next);
    if (next.length === 2) {
      attempts.current += 1;
      const [a, b] = next.map((k) => cards.find((c) => c.key === k)!);
      if (a && b && a.pairId === b.pairId) {
        play('sparkle');
        const pair = pairs.find((p) => p.id === a.pairId);
        const line = correctLine(lastLine.current);
        lastLine.current = line;
        speak(pair ? `${pair.label}! ${line}` : line);
        setMatched((m) => [...m, a.pairId]);
        setFaceUp([]);
      } else {
        busy.current = true;
        setTimeout(() => {
          setFaceUp([]);
          busy.current = false;
        }, HIDE_MS);
      }
    }
  };

  const columns = cards.length <= 8 ? 4 : cards.length <= 12 ? 4 : 5;
  const rows = Math.ceil(cards.length / columns);
  const cardSize = Math.max(
    72,
    Math.min(
      140,
      Math.floor((width - spacing.lg * 2 - spacing.sm * (columns - 1)) / columns),
      Math.floor((height * 0.55 - spacing.sm * (rows - 1)) / rows),
    ),
  );

  return (
    <View style={styles.root} testID="matching-player">
      <ProgressDots total={pairs.length} done={matched.length} />
      <JellySays text={activity.instruction} compact />
      <View style={[styles.grid, { width: columns * cardSize + (columns - 1) * spacing.sm }]}>
        {cards.map((card) => {
          const pair = pairs.find((p) => p.id === card.pairId)!;
          const up = faceUp.includes(card.key) || matched.includes(card.pairId);
          return (
            <Pressable
              key={card.key}
              accessibilityRole="button"
              accessibilityLabel={up ? pair.label : 'Card'}
              accessibilityState={{ selected: up }}
              onPress={() => flip(card)}
              style={[
                styles.card,
                { width: cardSize, height: cardSize },
                !up && { backgroundColor: activity.data.backColor ?? palette.sea },
                matched.includes(card.pairId) && styles.matched,
              ]}
              testID={`card-${card.key}`}
            >
              {up ? (
                <PictureView picture={pair.picture} size={Math.round(cardSize * 0.62)} />
              ) : (
                <Icon
                  name="diamond"
                  size={Math.round(cardSize * 0.4)}
                  color={palette.white}
                  stroke={palette.white}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.md, alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  card: {
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  matched: { borderWidth: 4, borderColor: palette.leaf },
});
