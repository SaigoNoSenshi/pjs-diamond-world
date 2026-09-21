import { fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { createTestServices } from '@/services/container';
import { SilentAudioPromptService } from '@/services/defaults';
import { renderApp } from '@/test-utils/renderApp';

import { HomeScreen } from '../HomeScreen';
import { dayPhaseFor, PHASE_GREETING } from '../dayNight';

function Stub({ label }: { label: string }) {
  return <Text>{label}</Text>;
}

describe('Diamond Island map', () => {
  it('shows the six islands and the child’s places, speaks a greeting, and opens an island', async () => {
    const voice = new SilentAudioPromptService();
    const services = createTestServices({ voice });

    const { app, q } = await renderApp(
      {
        home: HomeScreen,
        'island/[islandId]': () => <Stub label="island-screen" />,
        quest: () => <Stub label="quest-screen" />,
        stickers: () => <Stub label="stickers-screen" />,
        garden: () => <Stub label="garden-screen" />,
        music: () => <Stub label="music-screen" />,
        'book/index': () => <Stub label="book-screen" />,
        'parent/index': () => <Stub label="parent-screen" />,
      },
      { initialUrl: '/home', services },
    );

    await waitFor(() => expect(app.getPathname()).toBe('/home'));
    for (const id of ['letters', 'numbers', 'art', 'science', 'stories', 'crafts']) {
      expect(await q.findByTestId(`island-${id}`)).toBeTruthy();
    }
    for (const id of ['home-quest', 'home-garden', 'home-music', 'home-book', 'home-stickers']) {
      expect(q.getByTestId(id)).toBeTruthy();
    }
    await waitFor(() => expect(voice.spoken).toContain(PHASE_GREETING[dayPhaseFor(new Date())]));

    await fireEvent.press(q.getByTestId('island-letters'));
    await waitFor(() => expect(app.getPathname()).toBe('/island/letters'));
    expect(await q.findByText('island-screen')).toBeTruthy();
  });
});

describe('dayPhaseFor', () => {
  it('maps hours to phases', () => {
    expect(dayPhaseFor(new Date(2026, 0, 1, 6))).toBe('morning');
    expect(dayPhaseFor(new Date(2026, 0, 1, 12))).toBe('day');
    expect(dayPhaseFor(new Date(2026, 0, 1, 18))).toBe('evening');
    expect(dayPhaseFor(new Date(2026, 0, 1, 21))).toBe('night');
    expect(dayPhaseFor(new Date(2026, 0, 1, 2))).toBe('night');
  });
});
