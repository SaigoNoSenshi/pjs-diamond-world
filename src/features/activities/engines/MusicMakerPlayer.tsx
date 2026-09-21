import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BigButton } from '@/components/BigButton';
import { IconButton } from '@/components/IconButton';
import { strings } from '@/constants/strings';
import type { ActivityDefinition, MusicMakerData } from '@/domain/activity/schema';
import { JellySays } from '@/features/learning/components/JellySays';
import { useAppServices } from '@/hooks/useAppServices';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

import type { EngineProps } from './types';

const DEMO_GAP_MS = 380;
const MAX_GAP_MS = 1500;
const MIN_NOTES_TO_FINISH = 6;

interface Tap {
  padId: string;
  at: number;
}

/** Tap pads to play notes; record and replay a tune; Jelly can play a demo. */
export function MusicMakerPlayer({
  activity,
  onComplete,
}: EngineProps<ActivityDefinition & { data: MusicMakerData }>) {
  const data = activity.data;
  const { notes } = useAppServices();
  const { speak } = useVoice();
  const { play } = useSfx();
  const { width, height } = useWindowDimensions();
  const [taps, setTaps] = useState<Tap[]>([]);
  const [lit, setLit] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    speak(activity.instruction);
    const pending = timers.current;
    return () => {
      for (const t of pending) clearTimeout(t);
      notes.release();
    };
  }, [activity.instruction, speak, notes]);

  const sound = useCallback(
    (padId: string) => {
      const pad = data.pads.find((p) => p.id === padId);
      if (!pad) return;
      notes.play(pad.sound);
      setLit(padId);
      timers.current.push(setTimeout(() => setLit((l) => (l === padId ? null : l)), 180));
    },
    [data.pads, notes],
  );

  const tap = (padId: string) => {
    if (playing) return;
    sound(padId);
    setTaps((t) => [...t, { padId, at: Date.now() }]);
  };

  const playSequence = (seq: { padId: string; delay: number }[]) => {
    if (seq.length === 0) return;
    setPlaying(true);
    let t = 0;
    for (const step of seq) {
      t += step.delay;
      timers.current.push(setTimeout(() => sound(step.padId), t));
    }
    timers.current.push(setTimeout(() => setPlaying(false), t + 400));
  };

  const replay = () => {
    playSequence(
      taps.map((tp, i) => ({
        padId: tp.padId,
        delay: i === 0 ? 0 : Math.min(MAX_GAP_MS, Math.max(120, tp.at - taps[i - 1]!.at)),
      })),
    );
  };
  const demo = () =>
    playSequence(data.demo.map((id, i) => ({ padId: id, delay: i === 0 ? 0 : DEMO_GAP_MS })));
  const clear = () => {
    play('tap');
    setTaps([]);
  };
  const finish = () => {
    play('celebrate');
    onComplete(1);
  };

  const landscape = width > height;
  const padW = Math.min(
    110,
    Math.floor((width - spacing.lg * 2 - spacing.sm * (data.pads.length - 1)) / data.pads.length),
  );
  const baseH = Math.min(landscape ? height * 0.45 : height * 0.36, 320);

  return (
    <View style={styles.root} testID="music-maker-player">
      <JellySays text={activity.instruction} compact />
      <View style={styles.pads}>
        {data.pads.map((pad, i) => {
          const h =
            data.instrument === 'xylophone'
              ? baseH * (1 - (i / data.pads.length) * 0.45)
              : baseH * 0.7;
          return (
            <Pressable
              key={pad.id}
              accessibilityRole="button"
              accessibilityLabel={pad.label}
              onPress={() => tap(pad.id)}
              style={[
                styles.pad,
                { width: padW, height: h, backgroundColor: pad.color },
                data.instrument === 'drums' && { borderRadius: padW / 2 },
                lit === pad.id && styles.padLit,
              ]}
              testID={`pad-${pad.id}`}
            >
              <Text style={styles.padLabel}>{pad.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.actions}>
        <BigButton
          icon="jellyfish"
          label={strings.learning.jellyPlays}
          onPress={demo}
          color={palette.sunshine}
          size="comfortable"
          disabled={playing || data.demo.length === 0}
          testID="music-demo"
        />
        <BigButton
          icon="play"
          label={strings.learning.play}
          onPress={replay}
          color={palette.aqua}
          size="comfortable"
          disabled={playing || taps.length === 0}
          testID="music-replay"
        />
        <IconButton
          icon="trash"
          label={strings.learning.clear}
          onPress={clear}
          disabled={taps.length === 0}
          testID="music-clear"
        />
        <BigButton
          icon="check"
          label={strings.common.done}
          onPress={finish}
          color={palette.leaf}
          size="comfortable"
          disabled={taps.length < MIN_NOTES_TO_FINISH}
          testID="music-done"
        />
      </View>
      <Text style={styles.count} accessibilityLiveRegion="polite">
        {'♪'.repeat(Math.min(taps.length, 24))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.lg },
  pads: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pad: {
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.md,
    ...shadows.soft,
  },
  padLit: { transform: [{ scale: 1.06 }], borderWidth: 4, borderColor: palette.white },
  padLabel: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.black,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  count: { textAlign: 'center', fontSize: 20, color: colors.textSoft, minHeight: 28 },
});
