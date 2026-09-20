import { fireEvent, waitFor } from '@testing-library/react-native';

import { musicTracks } from '@/content/music/tracks';
import { createTestServices } from '@/services/container';
import { SilentMusicService } from '@/services/defaults';
import { renderApp } from '@/test-utils/renderApp';

import { MusicReefScreen } from '../MusicReefScreen';

describe('Music Reef', () => {
  it('plays, pauses, skips tracks and remembers the volume', async () => {
    const music = new SilentMusicService(musicTracks);
    const services = createTestServices({ music });
    const { q } = await renderApp({ music: MusicReefScreen }, { initialUrl: '/music', services });

    expect(await q.findByText('♪ Princess Waltz')).toBeTruthy();
    expect(q.getByRole('button', { name: 'Play' })).toBeTruthy();

    await fireEvent.press(q.getByTestId('music-toggle'));
    await waitFor(() => expect(music.isPlaying()).toBe(true));
    expect(await q.findByRole('button', { name: 'Pause' })).toBeTruthy();

    await fireEvent.press(q.getByTestId('music-next'));
    expect(await q.findByText('♪ Sea Breeze')).toBeTruthy();

    await fireEvent.press(q.getByTestId('volume-loud'));
    await waitFor(() => expect(music.getVolume()).toBe(0.85));
    await waitFor(async () =>
      expect((await services.repositories.settings.getProfile()).settings.musicVolume).toBe(0.85),
    );

    await fireEvent.press(q.getByTestId('music-toggle'));
    await waitFor(() => expect(music.isPlaying()).toBe(false));
  });

  it('cannot start music when the parent disabled it', async () => {
    const music = new SilentMusicService(musicTracks);
    const services = createTestServices({ music });
    await services.repositories.settings.updateSettings({ musicEnabled: false });
    const { q } = await renderApp({ music: MusicReefScreen }, { initialUrl: '/music', services });
    const toggle = await q.findByTestId('music-toggle');
    await fireEvent.press(toggle);
    expect(music.isPlaying()).toBe(false);
  });
});
