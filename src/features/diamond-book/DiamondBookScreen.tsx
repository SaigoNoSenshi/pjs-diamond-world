import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { FriendlyError } from '@/components/FriendlyError';
import { ScreenShell } from '@/components/ScreenShell';
import { routes } from '@/constants/routes';
import { strings, voicePrompts } from '@/constants/strings';
import type { Creation, CreationFilter } from '@/domain/creation/schema';
import { useAppServices } from '@/hooks/useAppServices';
import { useVoice } from '@/hooks/useVoice';
import { JellyGuide } from '@/features/home/components/JellyGuide';
import { colors, spacing, typography } from '@/theme';

import { CreationCard } from './components/CreationCard';
import { FilterBar } from './components/FilterBar';
import { useCreations } from './hooks/useCreations';

/** My Diamond Book: big picture cards, four filters, tap to see full-screen. */
export function DiamondBookScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { speak } = useVoice();
  const { analytics } = useAppServices();
  const [filter, setFilter] = useState<CreationFilter>('ALL');
  const { items, status, refresh } = useCreations(filter);

  useEffect(() => {
    analytics.track('screen_opened', { screen: 'book' });
    speak(voicePrompts.book);
  }, [analytics, speak]);

  const columns = width > height ? 3 : 2;
  const cardSize = Math.floor((width - spacing.lg * 2 - spacing.md * (columns - 1)) / columns);

  const open = (creation: Creation) => router.push(routes.creation(creation.id));

  return (
    <ScreenShell title={strings.book.title}>
      <FilterBar value={filter} onChange={setFilter} />
      {status === 'error' ? (
        <FriendlyError onRetry={() => void refresh()} />
      ) : (
        <FlatList
          key={columns}
          data={items}
          numColumns={columns}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => <CreationCard creation={item} size={cardSize} onPress={open} />}
          columnWrapperStyle={styles.rowWrap}
          contentContainerStyle={styles.list}
          initialNumToRender={6}
          windowSize={5}
          removeClippedSubviews
          testID="creation-list"
          ListEmptyComponent={
            status === 'ready' ? (
              <View style={styles.empty}>
                <JellyGuide size={140} says={strings.book.empty} />
              </View>
            ) : null
          }
        />
      )}
      {status === 'ready' && items.length > 0 ? (
        <Text style={styles.count} accessibilityLiveRegion="polite">
          {items.length}
        </Text>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.huge },
  rowWrap: { gap: spacing.md },
  empty: { alignItems: 'center', paddingTop: spacing.huge },
  count: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    color: colors.textSoft,
  },
});
