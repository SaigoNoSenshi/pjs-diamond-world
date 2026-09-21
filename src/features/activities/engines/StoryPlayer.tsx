import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BigButton } from '@/components/BigButton';
import { IconButton } from '@/components/IconButton';
import { Icon } from '@/components/icons/Icon';
import { resolveImage } from '@/constants/images';
import { strings } from '@/constants/strings';
import type { ActivityDefinition, StoryData } from '@/domain/activity/schema';
import { ProgressDots } from '@/features/learning/components/ProgressDots';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

import { QuizPlayer } from './QuizPlayer';
import type { EngineProps } from './types';

/**
 * Read-along story: one illustrated page at a time, every word tappable (spoken),
 * "Read to me" reads the page. Ends with one gentle question when the story has one.
 */
export function StoryPlayer({
  activity,
  onComplete,
}: EngineProps<ActivityDefinition & { data: StoryData }>) {
  const data = activity.data;
  const { speak, stop } = useVoice();
  const { play } = useSfx();
  const { width, height } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const [asking, setAsking] = useState(false);
  const current = data.pages[page]!;
  const landscape = width > height;

  useEffect(() => {
    speak(current.text);
    return () => stop();
  }, [current.text, speak, stop]);

  const next = () => {
    play('tap');
    if (page + 1 < data.pages.length) setPage(page + 1);
    else if (data.question) setAsking(true);
    else {
      speak(strings.learning.theEnd);
      onComplete(1);
    }
  };
  const back = () => {
    play('tap');
    if (page > 0) setPage(page - 1);
  };

  if (asking && data.question) {
    return (
      <QuizPlayer
        activity={{
          ...activity,
          kind: 'QUIZ',
          data: { kind: 'QUIZ', questions: [data.question], pick: 1 },
        }}
        questions={[data.question]}
        onComplete={(score) => onComplete(score)}
      />
    );
  }

  const source = resolveImage(current.illustration);
  const imageSize = Math.min(landscape ? height * 0.6 : width - spacing.lg * 2, 420);
  const words = current.text.split(/\s+/);

  return (
    <View style={styles.root} testID="story-player">
      <ProgressDots total={data.pages.length} done={page} color={palette.lavender} />
      <View style={[styles.body, landscape && styles.bodyRow]}>
        <View style={[styles.illustration, { width: imageSize, height: imageSize }]}>
          {source ? (
            <Image
              source={source}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Icon name="book" size={imageSize * 0.4} color={palette.lavender} />
          )}
        </View>
        <ScrollView style={styles.textWrap} contentContainerStyle={styles.textContent}>
          <View style={styles.words}>
            {words.map((word, i) => (
              <Pressable
                key={`${page}-${i}`}
                accessibilityRole="button"
                accessibilityLabel={word}
                onPress={() => speak(word.replace(/[^\p{L}\p{N}'’]/gu, ''))}
                style={({ pressed }) => [styles.word, pressed && styles.wordPressed]}
              >
                <Text style={styles.wordText}>{word}</Text>
              </Pressable>
            ))}
          </View>
          <BigButton
            icon="volume"
            label={strings.learning.readToMe}
            onPress={() => speak(current.text)}
            color={palette.lavender}
            iconColor={palette.white}
            size="comfortable"
            testID="story-read"
          />
        </ScrollView>
      </View>
      <View style={styles.nav}>
        <IconButton
          icon="back"
          label={strings.crafts.back}
          onPress={back}
          disabled={page === 0}
          testID="story-back"
        />
        <Text style={styles.pageNumber}>
          {page + 1} / {data.pages.length}
        </Text>
        <BigButton
          icon="next"
          label={page + 1 < data.pages.length ? strings.learning.nextPage : strings.learning.theEnd}
          onPress={next}
          color={palette.sunshine}
          size="comfortable"
          testID="story-next"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.md },
  body: { flex: 1, gap: spacing.lg, alignItems: 'center' },
  bodyRow: { flexDirection: 'row', alignItems: 'stretch' },
  illustration: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  textWrap: { flex: 1, alignSelf: 'stretch' },
  textContent: { gap: spacing.lg, alignItems: 'center', paddingBottom: spacing.md },
  words: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 },
  word: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: radii.sm },
  wordPressed: { backgroundColor: palette.sunshine },
  wordText: {
    fontFamily: typography.family,
    fontSize: 26,
    lineHeight: 36,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  pageNumber: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    color: colors.textSoft,
  },
});
