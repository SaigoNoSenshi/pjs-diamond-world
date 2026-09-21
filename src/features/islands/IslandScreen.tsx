import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { FriendlyError } from '@/components/FriendlyError';
import { Icon, type IconName } from '@/components/icons/Icon';
import { ScreenShell } from '@/components/ScreenShell';
import { findIsland } from '@/content/islands';
import { routes } from '@/constants/routes';
import { strings } from '@/constants/strings';
import type { ActivityDefinition } from '@/domain/activity/schema';
import { DiamondCounter } from '@/features/learning/components/DiamondCounter';
import { JellySays } from '@/features/learning/components/JellySays';
import { useLearning } from '@/features/learning/LearningProvider';
import { useAppServices } from '@/hooks/useAppServices';
import { useActivities } from '@/hooks/useActivities';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

/** One learning island: its activities as big tiles with a done-check. */
export function IslandScreen({ islandId }: { islandId: string }) {
  const router = useRouter();
  const island = findIsland(islandId);
  const { speak } = useVoice();
  const { analytics } = useAppServices();
  const learning = useLearning();
  const all = useActivities();
  const [gradeView, setGradeView] = useState<number | null>(null);
  const grade = gradeView ?? learning.grade;

  useEffect(() => {
    if (!island) return;
    analytics.track('screen_opened', { screen: `island:${island.id}` });
    speak(island.voiceIntro);
  }, [island, analytics, speak]);

  if (!island) {
    return (
      <ScreenShell title={strings.app.worldName}>
        <FriendlyError onRetry={() => router.dismissTo(routes.home)} />
      </ScreenShell>
    );
  }
  const list = all.filter((a) => a.islandId === island.id && a.grades.includes(grade));
  const done = list.filter((a) => learning.isCompleted(a.id)).length;
  const gradesHere = Array.from(
    new Set(all.filter((a) => a.islandId === island.id).flatMap((a) => a.grades)),
  )
    .filter((g) => g <= learning.grade)
    .sort();

  return (
    <ScreenShell
      title={island.name}
      backgroundColor={island.color}
      rightSlot={<DiamondCounter count={learning.progress.diamonds} />}
    >
      <View style={styles.header}>
        <JellySays text={island.tagline} voice={island.voiceIntro} compact />
        {gradesHere.length > 1 ? (
          <View style={styles.grades} accessibilityRole="tablist" testID="grade-chips">
            {gradesHere.map((g) => (
              <Pressable
                key={g}
                accessibilityRole="tab"
                accessibilityLabel={strings.learning.grade(g)}
                accessibilityState={{ selected: g === grade }}
                onPress={() => setGradeView(g)}
                style={[styles.chip, g === grade && styles.chipSelected]}
                testID={`grade-chip-${g}`}
              >
                <Text style={[styles.chipText, g === grade && styles.chipTextSelected]}>
                  {strings.learning.grade(g)}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <Text style={styles.progress} accessibilityLiveRegion="polite" testID="island-progress">
          {done === list.length && list.length > 0
            ? strings.learning.allDone
            : strings.learning.done(done, list.length)}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.grid} testID="island-activities">
        {list.map((activity) => (
          <ActivityTile
            key={activity.id}
            activity={activity}
            completed={learning.isCompleted(activity.id)}
            onPress={() => router.push(routes.play(activity.id))}
          />
        ))}
      </ScrollView>
    </ScreenShell>
  );
}

function ActivityTile({
  activity,
  completed,
  onPress,
}: {
  activity: ActivityDefinition;
  completed: boolean;
  onPress: () => void;
}) {
  const { width } = useWindowDimensions();
  const { play } = useSfx();
  const columns = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const size = Math.floor((width - spacing.lg * 2 - spacing.md * (columns - 1)) / columns);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={activity.title}
      accessibilityState={{ checked: completed }}
      onPress={() => {
        play('tap');
        onPress();
      }}
      style={({ pressed }) => [
        styles.tile,
        { width: size, minHeight: size * 0.9 },
        pressed && styles.pressed,
      ]}
      testID={`activity-${activity.id}`}
    >
      <View style={[styles.tileIcon, { backgroundColor: activity.color }]}>
        <Icon name={activity.icon as IconName} size={Math.round(size * 0.36)} />
      </View>
      <Text style={styles.tileTitle} numberOfLines={2}>
        {activity.title}
      </Text>
      <View style={styles.tileFooter}>
        <Icon name="diamond" size={18} color={palette.aqua} />
        <Text style={styles.tileReward}>{activity.reward.diamonds}</Text>
      </View>
      {completed ? (
        <View style={styles.check} testID={`done-${activity.id}`}>
          <Icon name="check" size={22} color={palette.white} stroke={palette.white} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  grades: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  chip: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: { backgroundColor: palette.ink },
  chipText: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.black,
    color: palette.ink,
  },
  chipTextSelected: { color: palette.white },
  progress: {
    textAlign: 'center',
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: palette.ink,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.huge,
    justifyContent: 'center',
  },
  tile: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.soft,
  },
  pressed: { transform: [{ scale: 0.97 }] },
  tileIcon: {
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.black,
    color: colors.text,
    textAlign: 'center',
  },
  tileFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tileReward: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
    color: colors.textSoft,
  },
  check: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
