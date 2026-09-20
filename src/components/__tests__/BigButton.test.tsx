import { fireEvent, waitFor } from '@testing-library/react-native';

import { createTestServices } from '@/services/container';
import { SilentAudioPromptService, SilentSoundEffectService } from '@/services/defaults';
import { renderWithServices } from '@/test-utils/render';

import { BigButton } from '../BigButton';

describe('BigButton', () => {
  it('renders an accessible button, speaks its label, and calls onPress', async () => {
    const voice = new SilentAudioPromptService();
    const sfx = new SilentSoundEffectService();
    const services = createTestServices({ voice, sfx });
    const onPress = jest.fn();

    const { findByRole } = await renderWithServices(
      <BigButton icon="paintbrush" label="Create" onPress={onPress} />,
      services,
    );

    const button = await findByRole('button', { name: 'Create' });
    await fireEvent.press(button);

    await waitFor(() => expect(onPress).toHaveBeenCalledTimes(1));
    expect(voice.spoken).toEqual(['Create']);
    expect(sfx.played).toEqual(['tap']);
  });

  it('stays silent when voice guidance is disabled by the parent', async () => {
    const voice = new SilentAudioPromptService();
    const services = createTestServices({ voice });
    await services.repositories.settings.updateSettings({ voiceEnabled: false });

    const { findByRole } = await renderWithServices(
      <BigButton icon="flower" label="My Garden" onPress={() => undefined} />,
      services,
    );
    const button = await findByRole('button', { name: 'My Garden' });
    await fireEvent.press(button);
    expect(voice.spoken).toEqual([]);
  });
});
