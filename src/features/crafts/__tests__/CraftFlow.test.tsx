import { fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import type { ProgressionEvent } from '@/domain/progression/schema';
import { createTestServices } from '@/services/container';
import { NoCameraService, SilentAudioPromptService } from '@/services/defaults';
import { renderApp } from '@/test-utils/renderApp';

import { CraftPlayerScreen } from '../CraftPlayerScreen';

const craftRoutes = {
  'create/craft/[craftId]': () => <CraftPlayerScreen craftId="crf_clay_cup" />,
  'book/index': () => <Text>book-screen</Text>,
  garden: () => <Text>garden-screen</Text>,
  home: () => <Text>home-screen</Text>,
};

describe("PJ's Clay Cup flow", () => {
  it('walks all seven steps, picks a photo, saves, celebrates, and lands in the Book', async () => {
    const voice = new SilentAudioPromptService();
    const camera = new NoCameraService(async () => ({
      uri: 'file:///picked/cup.jpg',
      width: 100,
      height: 100,
    }));
    const services = createTestServices({ voice, camera });
    const events: ProgressionEvent[] = [];
    services.eventBus.subscribe((e) => {
      events.push(e);
    });

    const { app, q } = await renderApp(craftRoutes, {
      initialUrl: '/create/craft/crf_clay_cup',
      services,
    });

    expect(await q.findByText('Make a clay log.')).toBeTruthy();
    await waitFor(() =>
      expect(voice.spoken).toContain("Let's make a cup! First, make a clay log."),
    );

    for (const instruction of [
      'Connect the clay together.',
      'Shape the cup.',
      'Add colors.',
      'Make the handle.',
      'Take a picture.',
    ]) {
      await fireEvent.press(q.getByTestId('craft-next'));
      expect(await q.findByText(instruction)).toBeTruthy();
    }

    // Progress is persisted so an interrupted craft resumes.
    await waitFor(async () =>
      expect(
        (await services.repositories.craftProgress.get('chd_default', 'crf_clay_cup'))
          ?.currentStepIndex,
      ).toBe(5),
    );

    await fireEvent.press(q.getByTestId('photo-take'));
    expect(await q.findByTestId('photo-keep')).toBeTruthy();
    await fireEvent.press(q.getByTestId('photo-keep'));
    expect(await q.findByText('Save my cup.')).toBeTruthy();

    await fireEvent.press(q.getByTestId('craft-save'));
    expect(await q.findByText('PJ made a cup!')).toBeTruthy();

    const creations = await services.repositories.creations.list('chd_default');
    expect(creations).toHaveLength(1);
    expect(creations[0]?.title).toBe('My Cup');
    expect(creations[0]?.type).toBe('CRAFT');
    // The garden reacts too (flower for the craft, sprout for the first creation).
    expect(events.filter((e) => e.type === 'GARDEN_ITEM_UNLOCKED')).toHaveLength(2);
    // CRAFT_COMPLETED also completes the matching learning activity (async), so the
    // ACTIVITY_COMPLETED position varies; compare as a multiset.
    expect(
      events
        .map((e) => e.type)
        .filter((t) => t !== 'GARDEN_ITEM_UNLOCKED')
        .sort(),
    ).toEqual(['ACTIVITY_COMPLETED', 'CRAFT_COMPLETED', 'CREATION_SAVED', 'PHOTO_SAVED']);
    expect(await services.repositories.craftProgress.get('chd_default', 'crf_clay_cup')).toBeNull();

    await fireEvent.press(q.getByTestId('craft-go-book'));
    await waitFor(() => expect(app.getPathname()).toBe('/book'));
  });
});
