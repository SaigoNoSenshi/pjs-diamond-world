import { fireEvent, waitFor } from '@testing-library/react-native';

import { createProgressionEvent } from '@/domain/progression/events';
import { createTestServices } from '@/services/container';
import { renderApp } from '@/test-utils/renderApp';

import { GardenScreen } from '../GardenScreen';

describe('My Garden', () => {
  it('shows Jelly’s hint when empty, then grows items as creations are saved', async () => {
    const services = createTestServices();
    const { q } = await renderApp({ garden: GardenScreen }, { initialUrl: '/garden', services });

    expect(await q.findByText('Make drawings and crafts to help your garden grow.')).toBeTruthy();
    fireEvent(q.getByTestId('garden-stage'), 'layout', {
      nativeEvent: { layout: { width: 800, height: 600 } },
    });

    await services.eventBus.publish(
      createProgressionEvent(
        'CREATION_SAVED',
        'chd_default',
        { creationId: 'cre_1' },
        { id: 'evt_1', occurredAt: '2026-09-14T00:00:00.000Z' },
      ),
    );
    await services.progression.whenIdle();

    expect(await q.findByText('A sprout appeared!')).toBeTruthy();
    await fireEvent.press(q.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(q.queryByText('A sprout appeared!')).toBeNull());
    expect(await q.findByTestId('garden-item-sprout')).toBeTruthy();
    expect(q.queryByText('Make drawings and crafts to help your garden grow.')).toBeNull();
  });
});
