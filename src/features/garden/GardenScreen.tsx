import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Bounce } from '@/components/animations/Bounce';
import { Sparkle } from '@/components/animations/Sparkle';
import { Celebration } from '@/components/Celebration';
import { ScreenShell } from '@/components/ScreenShell';
import { images, resolveImage } from '@/constants/images';
import { strings, voicePrompts } from '@/constants/strings';
import type { GardenItem } from '@/domain/progression/schema';
import { JellyGuide } from '@/features/home/components/JellyGuide';
import { useAppServices } from '@/hooks/useAppServices';
import { useVoice } from '@/hooks/useVoice';
import { palette, spacing } from '@/theme';

import { useGarden } from './hooks/useGarden';

const BASE_ITEM_SIZE = 120;

function GardenItemView({
  item,
  stage,
}: {
  item: GardenItem;
  stage: { width: number; height: number };
}) {
  const source = resolveImage(item.asset);
  if (!source) return null;
  const size = BASE_ITEM_SIZE * item.scale * Math.min(1.4, Math.max(0.7, stage.width / 600));
  return (
    <Animated.View
      entering={ZoomIn.springify().damping(12)}
      style={[
        styles.item,
        {
          left: item.position.x * stage.width - size / 2,
          top: item.position.y * stage.height - size / 2,
          width: size,
          height: size,
        },
      ]}
      accessibilityLabel={item.name}
      accessibilityRole="image"
      testID={`garden-item-${item.id}`}
    >
      <Bounce
        amplitude={item.type === 'JELLYFISH' ? 10 : 3}
        duration={item.type === 'JELLYFISH' ? 1800 : 2600}
      >
        <Image source={source} style={styles.itemImage} contentFit="contain" />
      </Bounce>
    </Animated.View>
  );
}

/** My Garden: everything PJ made has grown something on the island. No scores, no pressure. */
export function GardenScreen() {
  const { unlockedItems, justUnlocked, acknowledgeUnlock, state } = useGarden();
  const { speak } = useVoice();
  const { analytics } = useAppServices();
  const [stage, setStage] = useState({ width: 0, height: 0 });

  useEffect(() => {
    analytics.track('screen_opened', { screen: 'garden' });
    speak(voicePrompts.garden);
  }, [analytics, speak]);

  const onLayout = (e: LayoutChangeEvent) =>
    setStage({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });

  const firstUnlock = justUnlocked[0];
  const hint = unlockedItems.length === 0 ? strings.garden.hint : undefined;

  return (
    <ScreenShell title={strings.garden.title} backgroundColor={palette.aqua} immersive>
      <View style={styles.stage} onLayout={onLayout} testID="garden-stage">
        <Image source={images['scene.island']} style={StyleSheet.absoluteFill} contentFit="cover" />
        {state && state.creativityPoints > 0 ? (
          <Sparkle count={Math.min(6, 1 + Math.floor(state.creativityPoints / 5))} size={24} />
        ) : null}
        {stage.width > 0
          ? unlockedItems.map((item) => <GardenItemView key={item.id} item={item} stage={stage} />)
          : null}
        <View style={styles.jelly} pointerEvents="box-none">
          <JellyGuide
            size={130}
            {...(hint ? { says: hint } : {})}
            voicePrompt={hint ?? voicePrompts.garden}
          />
        </View>
      </View>
      <Celebration
        visible={Boolean(firstUnlock)}
        message={firstUnlock ? strings.garden.unlocked(firstUnlock.name) : ''}
        icon="flower"
        voicePrompt={voicePrompts.gardenGrew}
        actionLabel={strings.common.done}
        onAction={acknowledgeUnlock}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, overflow: 'hidden' },
  item: { position: 'absolute' },
  itemImage: { width: '100%', height: '100%' },
  jelly: { position: 'absolute', right: spacing.lg, bottom: spacing.xl },
});
