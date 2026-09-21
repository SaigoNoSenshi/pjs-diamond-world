import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Sparkle } from '@/components/animations/Sparkle';
import { Icon, type IconName } from '@/components/icons/Icon';
import { ScreenShell } from '@/components/ScreenShell';
import { findActivity } from '@/content/activities';
import { findIsland } from '@/content/islands';
import { routes } from '@/constants/routes';
import { strings, voicePrompts } from '@/constants/strings';
import { CHEST_DIAMONDS } from '@/domain/learning/rewards';
import { questComplete } from '@/domain/learning/dailyQuest';
import { DiamondCounter } from '@/features/learning/components/DiamondCounter';
import { JellySays } from '@/features/learning/components/JellySays';
import { ProgressDots } from '@/features/learning/components/ProgressDots';
import { useLearning } from '@/features/learning/LearningProvider';
import { useAppServices } from '@/hooks/useAppServices';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

/** Daily Quest: three adventures and a treasure chest. No streaks, no timer. */
export function DailyQuestScreen() {
  const router = useRouter();
  const { speak } = useVoice();
  const { play } = useSfx();
  const { analytics } = useAppServices();
  const { progress } = useLearning();
  const quest = progress.quest;

  useEffect(() => {
    analytics.track('screen_opened', { screen: 'quest' });
    speak(voicePrompts.quest);
  }, [analytics, speak]);

  const complete = questComplete(quest);
  const doneCount = quest?.completedIds.length ?? 0;

  return (
    <ScreenShell
      title={strings.learning.quest}
      backgroundColor={palette.sand}
      rightSlot={<DiamondCounter count={progress.diamonds} />}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <JellySays
          text={complete ? strings.learning.questDone : strings.learning.questIntro}
          voice={complete ? strings.learning.questDone : voicePrompts.quest}
        />
        <ProgressDots total={3} done={doneCount} color={palette.tangerine} />
        <View style={styles.list}>
          {(quest?.activityIds ?? []).map((id, i) => {
            const activity = findActivity(id);
            if (!activity) return null;
            const island = findIsland(activity.islandId);
            const done = quest?.completedIds.includes(id) ?? false;
            return (
              <Pressable
                key={id}
                accessibilityRole="button"
                accessibilityLabel={`${i + 1}. ${activity.title}`}
                accessibilityState={{ checked: done }}
                onPress={() => {
                  play('tap');
                  router.push(routes.play(id));
                }}
                style={({ pressed }) => [
                  styles.card,
                  done && styles.cardDone,
                  pressed && styles.pressed,
                ]}
                testID={`quest-${id}`}
              >
                <View style={[styles.cardIcon, { backgroundColor: activity.color }]}>
                  <Icon name={activity.icon as IconName} size={44} />
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{activity.title}</Text>
                  {island ? <Text style={styles.cardIsland}>{island.name}</Text> : null}
                </View>
                {done ? (
                  <View style={styles.check}>
                    <Icon name="check" size={26} color={palette.white} stroke={palette.white} />
                  </View>
                ) : (
                  <Icon name="next" size={32} color={palette.inkSoft} />
                )}
              </Pressable>
            );
          })}
        </View>
        <View style={styles.chest} testID="quest-chest">
          {complete ? <Sparkle count={6} /> : null}
          <Icon name={complete ? 'gift' : 'chest'} size={140} color={palette.tangerine} />
          <Text style={styles.chestText}>
            {complete ? strings.learning.chestOpened(CHEST_DIAMONDS) : strings.learning.chest}
          </Text>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.huge },
  list: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    minHeight: 96,
    ...shadows.soft,
  },
  cardDone: { borderWidth: 4, borderColor: palette.leaf },
  pressed: { transform: [{ scale: 0.98 }] },
  cardIcon: { borderRadius: radii.md, padding: spacing.sm },
  cardText: { flex: 1, gap: 2 },
  cardTitle: {
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.black,
    color: colors.text,
  },
  cardIsland: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    color: colors.textSoft,
  },
  check: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chest: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  chestText: {
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.bold,
    color: colors.text,
    textAlign: 'center',
  },
});
