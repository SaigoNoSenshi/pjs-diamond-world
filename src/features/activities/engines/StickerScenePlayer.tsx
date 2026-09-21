import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { BigButton } from '@/components/BigButton';
import { IconButton } from '@/components/IconButton';
import { Icon, type IconName } from '@/components/icons/Icon';
import { strings } from '@/constants/strings';
import type { ActivityDefinition, StickerSceneData } from '@/domain/activity/schema';
import { captureDrawing } from '@/services/media/captureDrawing';
import { JellySays } from '@/features/learning/components/JellySays';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing } from '@/theme';

import { saveScene } from '../saveScene';
import type { EngineProps } from './types';

const STICKER_SIZE = 84;
const MIN_TO_SAVE = 3;

interface Placed {
  id: number;
  icon: IconName;
  x: number;
  y: number;
}

/** Sticker scene: pick a sticker, tap the scene to place it. Save to the Diamond Book. */
export function StickerScenePlayer({
  activity,
  onComplete,
}: EngineProps<ActivityDefinition & { data: StickerSceneData }>) {
  const data = activity.data;
  const { repositories, eventBus, logger } = useAppServices();
  const { profile } = useProfile();
  const { speak } = useVoice();
  const { play } = useSfx();
  const { width, height } = useWindowDimensions();
  const [selected, setSelected] = useState<IconName>(data.stickers[0] as IconName);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [saving, setSaving] = useState(false);
  const sceneRef = useRef<View>(null);
  const nextId = useRef(1);

  useEffect(() => {
    speak(activity.instruction);
  }, [activity.instruction, speak]);

  const sceneW = Math.min(width - spacing.lg * 2, 640);
  const sceneH = Math.min(height * 0.45, sceneW * 0.66);

  const place = (x: number, y: number) => {
    play('sparkle');
    setPlaced((p) => [...p, { id: nextId.current++, icon: selected, x, y }]);
  };
  const undo = () => {
    play('tap');
    setPlaced((p) => p.slice(0, -1));
  };

  const save = async () => {
    if (saving || placed.length < MIN_TO_SAVE) return;
    setSaving(true);
    try {
      const opts = { width: sceneW, height: sceneH, backgroundColor: palette.aqua };
      const capture = await captureDrawing(sceneRef, opts);
      const thumbnail = await captureDrawing(sceneRef, { ...opts, targetWidth: 320 });
      const result = await saveScene(
        { repositories, eventBus },
        {
          childId: profile.id,
          title: `${profile.nickname}'s ${activity.title.replace(/^Decorate the /i, '')} Scene`,
          capture,
          thumbnail,
          width: sceneW,
          height: sceneH,
          activityId: activity.id,
        },
      );
      if (!result.ok) throw result.error;
      play('save');
      speak(strings.learning.sceneSaved);
      onComplete(1);
    } catch (error) {
      logger.error('scene save failed', error);
      play('oops');
      speak(strings.common.oops);
      setSaving(false);
    }
  };

  return (
    <View style={styles.root} testID="sticker-scene-player">
      <JellySays text={activity.instruction} compact />
      <View style={styles.center}>
        <View
          ref={sceneRef}
          collapsable={false}
          style={[styles.scene, { width: sceneW, height: sceneH }]}
        >
          <SceneBackground kind={data.background} width={sceneW} height={sceneH} />
          {placed.map((s) => (
            <View
              key={s.id}
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: s.x - STICKER_SIZE / 2,
                top: s.y - STICKER_SIZE / 2,
              }}
            >
              <Icon name={s.icon} size={STICKER_SIZE} color={palette.sunshine} />
            </View>
          ))}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Scene. Tap to place the sticker"
            onPress={(e) => place(e.nativeEvent.locationX, e.nativeEvent.locationY)}
            style={StyleSheet.absoluteFill}
            testID="scene-surface"
          />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tray}
      >
        {data.stickers.map((name) => (
          <Pressable
            key={name}
            accessibilityRole="radio"
            accessibilityLabel={name}
            accessibilityState={{ selected: selected === name }}
            onPress={() => {
              play('tap');
              setSelected(name as IconName);
            }}
            style={[styles.trayItem, selected === name && styles.trayItemSelected]}
            testID={`sticker-${name}`}
          >
            <Icon name={name as IconName} size={52} color={palette.sunshine} />
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.actions}>
        <IconButton
          icon="undo"
          label={strings.drawing.undo}
          onPress={undo}
          disabled={placed.length === 0}
          testID="scene-undo"
        />
        <BigButton
          icon="save"
          label={strings.learning.saveScene}
          onPress={() => void save()}
          color={palette.leaf}
          size="comfortable"
          disabled={saving || placed.length < MIN_TO_SAVE}
          testID="scene-save"
        />
      </View>
    </View>
  );
}

/** Vector scenery so the whole scene rasterises on web and stays tiny. */
function SceneBackground({
  kind,
  width,
  height,
}: {
  kind: StickerSceneData['background'];
  width: number;
  height: number;
}) {
  const w = width;
  const h = height;
  switch (kind) {
    case 'sea':
      return (
        <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={w} height={h} fill="#7FD8E6" />
          <Rect x={0} y={h * 0.15} width={w} height={h} fill={palette.aqua} />
          <Path
            d={`M0 ${h * 0.15} Q ${w * 0.25} ${h * 0.08} ${w * 0.5} ${h * 0.15} T ${w} ${h * 0.15} L ${w} ${h * 0.3} L 0 ${h * 0.3} Z`}
            fill="#3BB9B0"
            opacity={0.6}
          />
          <Ellipse cx={w * 0.5} cy={h} rx={w * 0.7} ry={h * 0.18} fill="#F4D58D" />
          <Path
            d={`M${w * 0.1} ${h * 0.92} C ${w * 0.08} ${h * 0.7} ${w * 0.14} ${h * 0.6} ${w * 0.12} ${h * 0.45}`}
            stroke={palette.leaf}
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d={`M${w * 0.88} ${h * 0.92} C ${w * 0.9} ${h * 0.7} ${w * 0.84} ${h * 0.62} ${w * 0.86} ${h * 0.5}`}
            stroke={palette.leaf}
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      );
    case 'sky':
      return (
        <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={w} height={h} fill="#BDE6FF" />
          <Ellipse cx={w * 0.5} cy={h * 1.05} rx={w * 0.8} ry={h * 0.3} fill={palette.leaf} />
        </Svg>
      );
    case 'garden':
      return (
        <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={w} height={h} fill="#DFF5FF" />
          <Rect x={0} y={h * 0.55} width={w} height={h} fill="#8FD98A" />
          <Circle cx={w * 0.85} cy={h * 0.15} r={h * 0.1} fill={palette.sunshine} />
        </Svg>
      );
    default:
      return (
        <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={w} height={h} fill="#FFE1C4" />
          <Rect x={0} y={h * 0.35} width={w} height={h} fill={palette.aqua} />
          <Ellipse cx={w * 0.5} cy={h * 0.78} rx={w * 0.42} ry={h * 0.22} fill="#F4D58D" />
          <Circle cx={w * 0.12} cy={h * 0.14} r={h * 0.09} fill={palette.sunshine} />
        </Svg>
      );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scene: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: palette.aqua,
    ...shadows.soft,
  },
  tray: { gap: spacing.sm, paddingHorizontal: spacing.sm, alignItems: 'center' },
  trayItem: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'transparent',
  },
  trayItemSelected: { borderColor: palette.ink },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
});
