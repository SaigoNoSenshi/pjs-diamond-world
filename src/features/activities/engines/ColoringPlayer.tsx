import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { BigButton } from '@/components/BigButton';
import { strings } from '@/constants/strings';
import type { ActivityDefinition, ColoringData } from '@/domain/activity/schema';
import { captureDrawing } from '@/services/media/captureDrawing';
import { JellySays } from '@/features/learning/components/JellySays';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, drawingColors, palette, radii, shadows, spacing } from '@/theme';

import { saveScene } from '../saveScene';
import type { EngineProps } from './types';

/**
 * Coloring page: tap a colour, tap a region. Regions are SVG paths from content.
 * "Save my picture" stores it in My Diamond Book and completes the activity.
 */
export function ColoringPlayer({
  activity,
  onComplete,
}: EngineProps<ActivityDefinition & { data: ColoringData }>) {
  const data = activity.data;
  const { repositories, eventBus, logger } = useAppServices();
  const { profile } = useProfile();
  const { speak } = useVoice();
  const { play } = useSfx();
  const { width, height } = useWindowDimensions();
  const [color, setColor] = useState<string>(drawingColors[0].hex);
  const [fills, setFills] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<View>(null);

  useEffect(() => {
    speak(activity.instruction);
  }, [activity.instruction, speak]);

  const board = Math.min(width - spacing.lg * 2, height * 0.5, 440);

  const fill = useCallback(
    (regionId: string) => {
      play('bubble');
      setFills((f) => ({ ...f, [regionId]: color }));
    },
    [color, play],
  );

  const save = async () => {
    if (saving || Object.keys(fills).length === 0) return;
    setSaving(true);
    try {
      const opts = { width: board, height: board, backgroundColor: palette.white };
      const capture = await captureDrawing(canvasRef, opts);
      const thumbnail = await captureDrawing(canvasRef, { ...opts, targetWidth: 320 });
      const result = await saveScene(
        { repositories, eventBus },
        {
          childId: profile.id,
          title: `${profile.nickname}'s ${activity.title.replace(/^Color the /i, '')}`,
          capture,
          thumbnail,
          width: board,
          height: board,
          activityId: activity.id,
        },
      );
      if (!result.ok) throw result.error;
      play('save');
      speak(strings.learning.pictureSaved);
      onComplete(Math.min(1, Object.keys(fills).length / data.regions.length));
    } catch (error) {
      logger.error('coloring save failed', error);
      play('oops');
      speak(strings.common.oops);
      setSaving(false);
    }
  };

  return (
    <View style={styles.root} testID="coloring-player">
      <JellySays text={activity.instruction} compact />
      <View style={styles.center}>
        <View
          ref={canvasRef}
          collapsable={false}
          style={[styles.board, { width: board, height: board }]}
        >
          <Svg width={board} height={board} viewBox={data.viewBox}>
            {data.regions.map((region) => (
              <Path
                key={region.id}
                d={region.d}
                fill={fills[region.id] ?? palette.white}
                stroke={palette.ink}
                strokeWidth={1.6}
                strokeLinejoin="round"
                onPress={() => fill(region.id)}
                testID={`region-${region.id}`}
              />
            ))}
            {data.outlines.map((d, i) => (
              <Path
                key={`o${i}`}
                d={d}
                fill="none"
                stroke={palette.ink}
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            ))}
          </Svg>
        </View>
      </View>
      <View style={styles.palette} accessibilityRole="radiogroup">
        {drawingColors.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="radio"
            accessibilityLabel={c.label}
            accessibilityState={{ selected: color === c.hex }}
            onPress={() => {
              play('tap');
              setColor(c.hex);
            }}
            style={[
              styles.swatch,
              { backgroundColor: c.hex },
              color === c.hex && styles.swatchSelected,
            ]}
            testID={`color-${c.id}`}
          />
        ))}
      </View>
      <View style={styles.actions}>
        <BigButton
          icon="save"
          label={strings.learning.savePicture}
          onPress={() => void save()}
          color={palette.leaf}
          size="comfortable"
          disabled={saving || Object.keys(fills).length === 0}
          testID="coloring-save"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  board: {
    backgroundColor: palette.white,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.soft,
  },
  palette: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  swatch: { width: 52, height: 52, borderRadius: 26, borderWidth: 3, borderColor: colors.border },
  swatchSelected: { borderWidth: 5, borderColor: palette.ink, transform: [{ scale: 1.1 }] },
  actions: { alignItems: 'center' },
});
