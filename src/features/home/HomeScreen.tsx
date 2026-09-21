import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Sparkle } from '@/components/animations/Sparkle';
import { IconButton } from '@/components/IconButton';
import { Icon, type IconName } from '@/components/icons/Icon';
import { activitiesForIsland } from '@/content/activities';
import { islands, type IslandDefinition } from '@/content/islands';
import { images } from '@/constants/images';
import { routes } from '@/constants/routes';
import { strings } from '@/constants/strings';
import { questComplete } from '@/domain/learning/dailyQuest';
import { DiamondCounter } from '@/features/learning/components/DiamondCounter';
import { useLearning } from '@/features/learning/LearningProvider';
import { useAppServices } from '@/hooks/useAppServices';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

import { JellyGuide } from './components/JellyGuide';
import { ReactiveDecor } from './components/ReactiveDecor';
import { dayPhaseFor, PHASE_GREETING, PHASE_TINT } from './dayNight';

/**
 * Diamond Island — the home map. Six learning islands to visit, the Daily Quest chest,
 * and the child's own places (Garden, Music Reef, Diamond Book, Stickers). The scene
 * changes with the real time of day and small creatures react to taps.
 */
export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { speak } = useVoice();
  const { play } = useSfx();
  const { analytics } = useAppServices();
  const { progress, isCompleted } = useLearning();
  const [stage, setStage] = useState({ width: 0, height: 0 });

  const phase = useMemo(() => dayPhaseFor(new Date()), []);

  useEffect(() => {
    analytics.track('screen_opened', { screen: 'home' });
    speak(PHASE_GREETING[phase]);
  }, [analytics, speak, phase]);

  const landscape = width > height;
  const columns = landscape ? 3 : 2;
  const gap = spacing.md;
  const tileW = Math.min(
    landscape ? 220 : 190,
    Math.floor((width - spacing.lg * 2 - gap * (columns - 1)) / columns),
  );
  const questDone = progress.quest?.completedIds.length ?? 0;
  const questComplete_ = questComplete(progress.quest);

  const go = (path: string) => {
    play('tap');
    router.push(path);
  };

  return (
    <View style={styles.root} testID="home-screen">
      <Image
        source={images['scene.island']}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
      />
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: PHASE_TINT[phase] }]}
        pointerEvents="none"
      />
      {phase === 'night' ? <Sparkle count={6} color={palette.cream} size={18} /> : null}
      <View
        style={StyleSheet.absoluteFill}
        onLayout={(e: LayoutChangeEvent) =>
          setStage({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })
        }
        pointerEvents="none"
      />

      <View
        style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}
        pointerEvents="box-none"
      >
        <Text style={styles.title} accessibilityRole="header">
          {strings.app.worldName}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.learning.stickers}
          onPress={() => go(routes.stickers)}
          testID="home-stickers"
        >
          <DiamondCounter count={progress.diamonds} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.islands, { gap }]}>
          {islands.map((island) => {
            const list = activitiesForIsland(island.id);
            const done = list.filter((a) => isCompleted(a.id)).length;
            return (
              <IslandTile
                key={island.id}
                island={island}
                done={done}
                total={list.length}
                width={tileW}
                onPress={() => go(routes.island(island.id))}
              />
            );
          })}
        </View>

        <View style={styles.places}>
          <PlaceButton
            icon={questComplete_ ? 'gift' : 'chest'}
            label={strings.learning.quest}
            color={palette.tangerine}
            badge={`${questDone}/3`}
            onPress={() => go(routes.quest)}
            testID="home-quest"
          />
          <PlaceButton
            icon="flower"
            label={strings.home.garden}
            color={palette.leaf}
            onPress={() => go(routes.garden)}
            testID="home-garden"
          />
          <PlaceButton
            icon="music"
            label={strings.home.music}
            color={palette.aqua}
            onPress={() => go(routes.music)}
            testID="home-music"
          />
          <PlaceButton
            icon="book"
            label={strings.home.book}
            color={palette.blossom}
            onPress={() => go(routes.book)}
            testID="home-book"
          />
        </View>
      </ScrollView>

      {/* Creatures sit ABOVE the scroll layer (a scroll view swallows touches on web);
          the wrapper is box-none so only the creatures themselves take taps. */}
      {stage.width > 0 ? (
        <ReactiveDecor width={stage.width} height={stage.height} night={phase === 'night'} />
      ) : null}

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
        pointerEvents="box-none"
      >
        <JellyGuide size={110} voicePrompt={PHASE_GREETING[phase]} />
        <IconButton
          icon="lock"
          label={strings.home.parent}
          onPress={() => router.push(routes.parentGate)}
          color="rgba(255,255,255,0.7)"
          iconColor={palette.inkSoft}
          size={48}
          testID="parent-entry"
        />
      </View>
    </View>
  );
}

function IslandTile({
  island,
  done,
  total,
  width,
  onPress,
}: {
  island: IslandDefinition;
  done: number;
  total: number;
  width: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${island.name}. ${strings.learning.done(done, total)}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.island,
        { width, backgroundColor: island.color },
        pressed && styles.pressed,
      ]}
      testID={`island-${island.id}`}
    >
      <Icon name={island.icon as IconName} size={Math.round(width * 0.36)} />
      <Text style={styles.islandName} numberOfLines={2} adjustsFontSizeToFit>
        {island.name}
      </Text>
      <View style={styles.islandBar}>
        <View
          style={[
            styles.islandBarFill,
            { width: `${total ? Math.round((done / total) * 100) : 0}%` },
          ]}
        />
      </View>
    </Pressable>
  );
}

function PlaceButton({
  icon,
  label,
  color,
  badge,
  onPress,
  testID,
}: {
  icon: IconName;
  label: string;
  color: string;
  badge?: string;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={badge ? `${label}, ${badge}` : label}
      onPress={onPress}
      style={({ pressed }) => [styles.place, pressed && styles.pressed]}
      testID={testID}
    >
      <View style={[styles.placeIcon, { backgroundColor: color }]}>
        <Icon name={icon} size={40} />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.placeLabel} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.aqua },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    zIndex: 2,
  },
  title: {
    fontFamily: typography.family,
    fontSize: typography.size.title,
    fontWeight: typography.weight.black,
    color: palette.white,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 },
  },
  content: { paddingHorizontal: spacing.lg, gap: spacing.lg, alignItems: 'center' },
  islands: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  island: {
    borderRadius: radii.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 150,
    ...shadows.soft,
  },
  pressed: { transform: [{ scale: 0.96 }] },
  islandName: {
    fontFamily: typography.family,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: typography.weight.black,
    color: palette.ink,
    textAlign: 'center',
  },
  islandBar: {
    width: '80%',
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.6)',
    overflow: 'hidden',
  },
  islandBarFill: { height: '100%', backgroundColor: palette.ink, borderRadius: 5 },
  places: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    paddingBottom: 120,
  },
  place: { alignItems: 'center', gap: spacing.xs, width: 104 },
  placeIcon: {
    width: 84,
    height: 84,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  placeLabel: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    fontWeight: typography.weight.black,
    color: palette.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    ...shadows.soft,
  },
  badgeText: {
    fontFamily: typography.family,
    fontSize: 13,
    fontWeight: typography.weight.black,
    color: palette.ink,
  },
  footer: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
