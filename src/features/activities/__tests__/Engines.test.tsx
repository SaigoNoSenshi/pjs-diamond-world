import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { findActivity } from '@/content/activities';
import type { PuzzleData, StoryData } from '@/domain/activity/schema';
import { AppServicesProvider } from '@/hooks/useAppServices';
import { ProfileProvider } from '@/hooks/useProfile';
import { createTestServices, type AppServices } from '@/services/container';
import { SilentNoteService } from '@/services/defaults';

import { MusicMakerPlayer } from '../engines/MusicMakerPlayer';
import { PuzzlePlayer } from '../engines/PuzzlePlayer';
import { StoryPlayer } from '../engines/StoryPlayer';

function wrap(ui: React.ReactElement, services: AppServices = createTestServices()) {
  return render(
    <AppServicesProvider services={services}>
      <ProfileProvider>{ui}</ProfileProvider>
    </AppServicesProvider>,
  );
}

describe('PuzzlePlayer (pattern)', () => {
  it('fills every gap and completes', async () => {
    const activity = findActivity('act_pattern_next')! as Parameters<
      typeof PuzzlePlayer
    >[0]['activity'];
    const rounds = (activity.data as Extract<PuzzleData, { mode: 'pattern' }>).rounds;
    const onComplete = jest.fn();
    const screen = await wrap(<PuzzlePlayer activity={activity} onComplete={onComplete} />);
    for (const [i, round] of rounds.entries()) {
      await waitFor(() =>
        expect(screen.getByTestId(`pattern-choice-${round.answerIndex}`)).toBeTruthy(),
      );
      await fireEvent.press(screen.getByTestId(`pattern-choice-${round.answerIndex}`));
      if (i < rounds.length - 1) {
        await waitFor(
          () =>
            expect(screen.getByTestId('progress-dots').props.accessibilityLabel).toBe(
              `${i + 1} of ${rounds.length}`,
            ),
          {
            timeout: 3000,
          },
        );
      }
    }
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(1), { timeout: 3000 });
  });
});

describe('StoryPlayer', () => {
  it('turns pages, speaks tapped words, asks the question, and completes', async () => {
    const services = createTestServices();
    const voice = services.voice as unknown as { spoken: string[] };
    const activity = findActivity('act_story_lost_diamond')! as Parameters<
      typeof StoryPlayer
    >[0]['activity'];
    const data = activity.data as StoryData;
    const onComplete = jest.fn();
    const screen = await wrap(
      <StoryPlayer activity={activity} onComplete={onComplete} />,
      services,
    );
    await waitFor(() => expect(voice.spoken).toContain(data.pages[0]!.text));
    const firstWord = data.pages[0]!.text.split(/\s+/)[0]!;
    await fireEvent.press(screen.getAllByText(firstWord)[0]!);
    expect(voice.spoken.some((s) => firstWord.replace(/[^\p{L}\p{N}'’]/gu, '') === s)).toBe(true);
    for (let i = 0; i < data.pages.length; i += 1) {
      await fireEvent.press(screen.getByTestId('story-next'));
    }
    // Question at the end.
    expect(await screen.findByTestId('quiz-player')).toBeTruthy();
    await fireEvent.press(screen.getByTestId(`choice-${data.question!.answerId}`));
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(1), { timeout: 3000 });
  });
});

describe('MusicMakerPlayer', () => {
  it('plays notes on tap, replays the tune, and can finish after six notes', async () => {
    const notes = new SilentNoteService();
    const services = createTestServices({ notes });
    const activity = findActivity('act_music_xylophone')! as Parameters<
      typeof MusicMakerPlayer
    >[0]['activity'];
    const onComplete = jest.fn();
    const screen = await wrap(
      <MusicMakerPlayer activity={activity} onComplete={onComplete} />,
      services,
    );
    expect(screen.getByTestId('music-done').props.accessibilityState.disabled).toBe(true);
    for (const id of ['c', 'd', 'e', 'c', 'e', 'g'])
      await fireEvent.press(screen.getByTestId(`pad-${id}`));
    expect(notes.played).toEqual(['xylo.c', 'xylo.d', 'xylo.e', 'xylo.c', 'xylo.e', 'xylo.g']);
    await fireEvent.press(screen.getByTestId('music-replay'));
    await waitFor(() => expect(notes.played.length).toBe(12), { timeout: 4000 });
    await waitFor(
      () => expect(screen.getByTestId('music-done').props.accessibilityState.disabled).toBe(false),
      {
        timeout: 3000,
      },
    );
    await fireEvent.press(screen.getByTestId('music-done'));
    expect(onComplete).toHaveBeenCalledWith(1);
  });
});
