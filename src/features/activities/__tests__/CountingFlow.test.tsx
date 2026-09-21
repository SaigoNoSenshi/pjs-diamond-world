import { fireEvent, waitFor } from '@testing-library/react-native';

import { findActivity } from '@/content/activities';
import type { CountingData } from '@/domain/activity/schema';
import { createTestServices } from '@/services/container';
import { renderApp } from '@/test-utils/renderApp';

import { ActivityPlayerScreen } from '../ActivityPlayerScreen';

function Route() {
  return <ActivityPlayerScreen activityId="act_count_sea" />;
}

jest.setTimeout(30000);

describe('Count the Sea Friends', () => {
  it('shows the right number of pictures, tolerates a wrong tap, and completes', async () => {
    const services = createTestServices();
    const { q } = await renderApp(
      { 'play/[activityId]': Route, 'island/[islandId]': () => null },
      { initialUrl: '/play/act_count_sea', services },
    );
    const activity = findActivity('act_count_sea')!;
    const data = activity.data as Extract<CountingData, { mode: 'count' }>;

    expect(await q.findByTestId('counting-player')).toBeTruthy();
    for (const [i, round] of data.rounds.entries()) {
      await waitFor(() => expect(q.getByTestId('count-items').children).toHaveLength(round.count));
      if (i === 0) {
        const wrong = round.choices.find((c) => c !== round.count)!;
        await fireEvent.press(q.getByTestId(`count-choice-${wrong}`));
      }
      await fireEvent.press(q.getByTestId(`count-choice-${round.count}`));
      if (i < data.rounds.length - 1) {
        const nextRound = data.rounds[i + 1]!;
        await waitFor(
          () => expect(q.getByTestId('count-items').children).toHaveLength(nextRound.count),
          { timeout: 3000 },
        );
      }
    }
    expect(await q.findByTestId('play-again', {}, { timeout: 3000 })).toBeTruthy();
    const saved = await services.repositories.learning.get('chd_default');
    // One round was missed on the first try.
    expect(saved?.completions[activity.id]?.best).toBeCloseTo(
      (data.rounds.length - 1) / data.rounds.length,
    );
  });
});
