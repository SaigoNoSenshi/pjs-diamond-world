import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { Text } from 'react-native';

import { activities, findActivity } from '@/content/activities';
import { stickers } from '@/content/stickers';
import { pickDailyQuest } from '@/domain/learning/dailyQuest';
import { dateKeyFor } from '@/domain/learning/schema';
import { StickerBookScreen } from '@/features/collection/StickerBookScreen';
import { IslandScreen } from '@/features/islands/IslandScreen';
import { createTestServices } from '@/services/container';
import { renderApp } from '@/test-utils/renderApp';

import { DailyQuestScreen } from '../DailyQuestScreen';

describe('Daily Quest, islands and stickers', () => {
  it('shows today’s three quest activities and opens one; island lists its activities; sticker book shows locked/owned', async () => {
    const services = createTestServices();
    await services.repositories.learning.save({
      childId: 'chd_default',
      diamonds: 7,
      stickers: ['stk_star'],
      completions: { act_trace_a: { count: 1, lastAt: '2026-09-21T00:00:00.000Z' } },
      quest: null,
      updatedAt: '2026-09-21T00:00:00.000Z',
    });
    const { app, q } = await renderApp(
      {
        quest: DailyQuestScreen,
        stickers: StickerBookScreen,
        'island/[islandId]': () => <IslandScreen islandId="letters" />,
        'play/[activityId]': () => <Text>play-screen</Text>,
      },
      { initialUrl: '/quest', services },
    );
    const expected = pickDailyQuest(activities, dateKeyFor(new Date()), 'chd_default');
    for (const id of expected) expect(await q.findByTestId(`quest-${id}`)).toBeTruthy();
    expect(q.getByTestId('quest-chest')).toBeTruthy();
    expect(q.getByTestId('diamond-counter')).toHaveTextContent('7');

    await fireEvent.press(q.getByTestId(`quest-${expected[0]}`));
    await waitFor(() => expect(app.getPathname()).toBe(`/play/${expected[0]}`));
    expect(await q.findByText('play-screen')).toBeTruthy();

    act(() => router.push('/island/letters'));
    await waitFor(() => expect(app.getPathname()).toBe('/island/letters'));
    expect(await q.findByTestId('island-activities')).toBeTruthy();
    expect(q.getByTestId('done-act_trace_a')).toBeTruthy();
    expect(q.queryByTestId('done-act_trace_b')).toBeNull();
    const letters = activities.filter((a) => a.islandId === 'letters').length;
    expect(q.getByTestId('island-progress')).toHaveTextContent(`1 of ${letters} done`);
    expect(findActivity('act_trace_b')).toBeDefined();

    act(() => router.push('/stickers'));
    await waitFor(() => expect(app.getPathname()).toBe('/stickers'));
    expect(await q.findByTestId('sticker-grid')).toBeTruthy();
    expect(q.getByTestId('sticker-stk_star-owned')).toBeTruthy();
    expect(q.getAllByTestId(/-locked$/)).toHaveLength(stickers.length - 1);
  });
});
