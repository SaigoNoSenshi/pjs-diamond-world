import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BigButton } from '@/components/BigButton';
import { Celebration } from '@/components/Celebration';
import { FriendlyError } from '@/components/FriendlyError';
import { Icon, type IconName } from '@/components/icons/Icon';
import { ScreenLoading } from '@/components/ScreenLoading';
import { ScreenShell } from '@/components/ScreenShell';
import { activitiesForIsland, findActivity } from '@/content/activities';
import { findSticker } from '@/content/stickers';
import { routes } from '@/constants/routes';
import { strings, voicePrompts } from '@/constants/strings';
import type { ActivityDefinition } from '@/domain/activity/schema';
import type { CompletionOutcome } from '@/features/learning/LearningProvider';
import { DiamondCounter } from '@/features/learning/components/DiamondCounter';
import { useLearning } from '@/features/learning/LearningProvider';
import { useActivities } from '@/hooks/useActivities';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, spacing, typography } from '@/theme';

import { ColoringPlayer } from './engines/ColoringPlayer';
import { CountingPlayer } from './engines/CountingPlayer';
import { MatchingPlayer } from './engines/MatchingPlayer';
import { MathPlayer } from './engines/MathPlayer';
import { MusicMakerPlayer } from './engines/MusicMakerPlayer';
import { PuzzlePlayer } from './engines/PuzzlePlayer';
import { QuizPlayer } from './engines/QuizPlayer';
import { StickerScenePlayer } from './engines/StickerScenePlayer';
import { StoryPlayer } from './engines/StoryPlayer';
import { TracePlayer } from './engines/TracePlayer';
import { WordsPlayer } from './engines/WordsPlayer';

/** Resolves an activity id and plays it with the right engine. */
export function ActivityPlayerScreen({ activityId }: { activityId: string }) {
  const router = useRouter();
  const { ready } = useLearning();
  useActivities(); // re-render when the lazy grade banks or a remote pack land
  const activity = findActivity(activityId);
  if (!activity) {
    // Deep link into a grade activity before its chunk has loaded: wait, don't apologise.
    if (!ready) return <ScreenLoading />;
    return (
      <ScreenShell title={strings.app.worldName}>
        <FriendlyError onRetry={() => router.dismissTo(routes.home)} />
      </ScreenShell>
    );
  }
  return <ActivityPlayer key={activity.id} activity={activity} />;
}

function ActivityPlayer({ activity }: { activity: ActivityDefinition }) {
  const router = useRouter();
  const { analytics } = useAppServices();
  const { profile } = useProfile();
  const { speak } = useVoice();
  const learning = useLearning();
  const [round, setRound] = useState(0);
  const [earned, setEarned] = useState<CompletionOutcome | null>(null);
  const [busy, setBusy] = useState(false);

  // Drawing and crafts use their own full screens; remember which activity sent us.
  useEffect(() => {
    if (activity.data.kind === 'DRAW') {
      learning.setPendingActivity(activity.id);
      router.replace(routes.draw);
    } else if (activity.data.kind === 'CRAFT') {
      learning.setPendingActivity(activity.id);
      router.replace(routes.craft(activity.data.craftId));
    }
  }, [activity, learning, router]);

  useEffect(() => {
    analytics.track('activity_started', { activity: activity.id });
    speak(activity.voiceIntro);
  }, [activity.id, activity.voiceIntro, analytics, speak]);

  const handleComplete = useCallback(
    (score?: number) => {
      if (busy) return;
      setBusy(true);
      analytics.track('activity_completed', { activity: activity.id });
      void learning.complete(activity, score).then((e) => {
        setEarned(e);
        setBusy(false);
      });
    },
    [activity, analytics, busy, learning],
  );

  const playAgain = () => {
    setEarned(null);
    setRound((r) => r + 1);
  };
  const backToIsland = () => router.replace(routes.island(activity.islandId));
  const nextActivity = () => {
    const siblings = activitiesForIsland(activity.islandId, learning.grade);
    const next =
      siblings.find((a) => a.id !== activity.id && !learning.isCompleted(a.id)) ??
      siblings.find((a) => a.id !== activity.id);
    if (next) router.replace(routes.play(next.id));
    else backToIsland();
  };

  const sticker = earned?.stickerId ? findSticker(earned.stickerId) : null;
  const chestSticker = earned?.chestStickerId ? findSticker(earned.chestStickerId) : null;

  return (
    <ScreenShell
      title={activity.title}
      showBack
      backgroundColor={colors.background}
      rightSlot={<DiamondCounter count={learning.progress.diamonds} />}
    >
      <View style={styles.body} key={round}>
        <Engine activity={activity} onComplete={handleComplete} />
      </View>
      <Celebration
        visible={earned !== null}
        message={
          earned?.newGrade
            ? strings.learning.levelUp(earned.newGrade)
            : strings.learning.greatJob(profile.nickname)
        }
        icon={earned?.newGrade ? 'crown' : (activity.icon as IconName)}
        voicePrompt={
          earned?.newGrade
            ? voicePrompts.levelUp(profile.nickname, earned.newGrade)
            : voicePrompts.complete(profile.nickname)
        }
      >
        {earned ? (
          <View style={styles.rewards}>
            <View style={styles.rewardRow}>
              <Icon name="diamond" size={36} color={palette.aqua} />
              <Text style={styles.rewardText}>+{earned.diamonds}</Text>
            </View>
            {sticker ? (
              <View style={styles.rewardRow}>
                <Icon name={sticker.icon as IconName} size={36} color={sticker.color} />
                <Text style={styles.rewardText}>{strings.learning.newSticker(sticker.name)}</Text>
              </View>
            ) : null}
            {earned.questJustCompleted ? (
              <View style={styles.rewardRow}>
                <Icon name="chest" size={36} color={palette.tangerine} />
                <Text style={styles.rewardText}>{strings.learning.questDone}</Text>
              </View>
            ) : null}
            {chestSticker ? (
              <View style={styles.rewardRow}>
                <Icon name={chestSticker.icon as IconName} size={36} color={chestSticker.color} />
                <Text style={styles.rewardText}>
                  {strings.learning.newSticker(chestSticker.name)}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <BigButton
          icon="redo"
          label={strings.learning.playAgain}
          onPress={playAgain}
          color={palette.sunshine}
          testID="play-again"
        />
        <BigButton
          icon="next"
          label={strings.learning.nextActivity}
          onPress={nextActivity}
          color={palette.aqua}
          testID="next-activity"
        />
        <BigButton
          icon="island"
          label={strings.learning.backToIsland}
          onPress={backToIsland}
          color={palette.leaf}
          testID="back-to-island"
        />
      </Celebration>
    </ScreenShell>
  );
}

function Engine({
  activity,
  onComplete,
}: {
  activity: ActivityDefinition;
  onComplete: (score?: number) => void;
}) {
  const data = activity.data;
  switch (data.kind) {
    case 'TRACE':
      return <TracePlayer activity={{ ...activity, data }} onComplete={onComplete} />;
    case 'QUIZ':
      return <QuizPlayer activity={{ ...activity, data }} onComplete={onComplete} />;
    case 'COUNTING':
      return <CountingPlayer activity={{ ...activity, data }} onComplete={onComplete} />;
    case 'MATCHING':
      return <MatchingPlayer activity={{ ...activity, data }} onComplete={onComplete} />;
    case 'PUZZLE':
      return <PuzzlePlayer activity={{ ...activity, data }} onComplete={onComplete} />;
    case 'COLORING':
      return <ColoringPlayer activity={{ ...activity, data }} onComplete={onComplete} />;
    case 'STICKER_SCENE':
      return <StickerScenePlayer activity={{ ...activity, data }} onComplete={onComplete} />;
    case 'STORY':
      return <StoryPlayer activity={{ ...activity, data }} onComplete={onComplete} />;
    case 'MUSIC_MAKER':
      return <MusicMakerPlayer activity={{ ...activity, data }} onComplete={onComplete} />;
    case 'MATH':
      return <MathPlayer activity={{ ...activity, data }} onComplete={onComplete} />;
    case 'WORDS':
      return <WordsPlayer activity={{ ...activity, data }} onComplete={onComplete} />;
    case 'DRAW':
    case 'CRAFT':
      return null; // redirected
  }
}

const styles = StyleSheet.create({
  body: { flex: 1 },
  rewards: { gap: spacing.sm, alignItems: 'center', width: '100%' },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rewardText: {
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
});
