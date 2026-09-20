import { fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { createTestServices } from '@/services/container';
import { SilentAudioPromptService } from '@/services/defaults';
import { renderApp } from '@/test-utils/renderApp';

import { CreateHubScreen } from '../CreateHubScreen';
import { HomeScreen } from '../HomeScreen';

function Stub({ label }: { label: string }) {
  return <Text>{label}</Text>;
}

describe('Diamond Island navigation', () => {
  it('shows the four primary areas and navigates to Create → Draw', async () => {
    const voice = new SilentAudioPromptService();
    const services = createTestServices({ voice });

    const { app, q } = await renderApp(
      {
        home: HomeScreen,
        'create/index': CreateHubScreen,
        'create/draw': () => <Stub label="draw-screen" />,
        garden: () => <Stub label="garden-screen" />,
        music: () => <Stub label="music-screen" />,
        'book/index': () => <Stub label="book-screen" />,
        'parent/index': () => <Stub label="parent-screen" />,
      },
      { initialUrl: '/home', services },
    );

    await waitFor(() => expect(app.getPathname()).toBe('/home'));
    for (const label of ['Create', 'My Garden', 'Music Reef', 'My Diamond Book']) {
      expect(await q.findByRole('button', { name: label })).toBeTruthy();
    }
    // Home speaks its hint once.
    await waitFor(() => expect(voice.spoken).toContain('What do you want to do?'));

    await fireEvent.press(q.getByRole('button', { name: 'Create' }));
    await waitFor(() => expect(app.getPathname()).toBe('/create'));
    expect(await q.findByRole('button', { name: 'Draw & Paint' })).toBeTruthy();
    expect(q.getByRole('button', { name: 'Craft With Me' })).toBeTruthy();

    await fireEvent.press(q.getByRole('button', { name: 'Draw & Paint' }));
    await waitFor(() => expect(app.getPathname()).toBe('/create/draw'));
    expect(await q.findByText('draw-screen')).toBeTruthy();
  });
});
