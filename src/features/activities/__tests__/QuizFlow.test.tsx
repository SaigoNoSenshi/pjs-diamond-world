import { fireEvent, waitFor } from '@testing-library/react-native';

import { findActivity } from '@/content/activities';
import type { QuizData } from '@/domain/activity/schema';
import { createTestServices } from '@/services/container';
import { renderApp } from '@/test-utils/renderApp';

import { ActivityPlayerScreen } from '../ActivityPlayerScreen';

function Route() {
  return <ActivityPlayerScreen activityId="act_quiz_shapes" />;
}

jest.setTimeout(30000);

describe('Jelly Asks quiz — full activity flow', () => {
  it('answers every question, earns diamonds and a sticker, and records the completion', async () => {
    const services = createTestServices();
    const { q } = await renderApp(
      { 'play/[activityId]': Route, 'island/[islandId]': () => null },
      { initialUrl: '/play/act_quiz_shapes', services },
    );
    const activity = findActivity('act_quiz_shapes')!;
    const data = activity.data as QuizData;

    expect(await q.findByTestId('quiz-player')).toBeTruthy();
    expect(q.getByTestId('diamond-counter')).toHaveTextContent('0');

    // Answer each shown question by reading its prompt and picking the right choice.
    for (let i = 0; i < data.pick; i += 1) {
      const prompt = await waitFor(() => {
        const bubble = q.getByTestId('jelly-says');
        return bubble.props.accessibilityLabel as string;
      });
      const question = data.questions.find((qq) => prompt.includes(qq.prompt));
      expect(question).toBeDefined();
      await fireEvent.press(q.getByTestId(`choice-${question!.answerId}`));
      if (i < data.pick - 1) {
        await waitFor(() => expect(q.getByText(`${i + 2} / ${data.pick}`)).toBeTruthy(), {
          timeout: 3000,
        });
      }
    }

    // Celebration with the reward.
    expect(await q.findByText(`+${activity.reward.diamonds}`, {}, { timeout: 3000 })).toBeTruthy();
    expect(q.getByTestId('play-again')).toBeTruthy();
    const saved = await services.repositories.learning.get('chd_default');
    expect(saved?.completions[activity.id]?.count).toBe(1);
    expect(saved?.completions[activity.id]?.best).toBe(1);
    expect(saved?.diamonds).toBe(activity.reward.diamonds);
    if (activity.reward.stickerId) expect(saved?.stickers).toContain(activity.reward.stickerId);
    // Garden progression saw the activity too.
    await services.progression.whenIdle();
    const garden = await services.repositories.garden.get('chd_default');
    expect(garden?.counters.activities).toBe(1);
    expect(garden?.creativityPoints).toBe(activity.reward.diamonds);
  });
});
