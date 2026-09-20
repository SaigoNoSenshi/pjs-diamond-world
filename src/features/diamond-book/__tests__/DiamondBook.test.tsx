import { fireEvent, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';

import { createTestServices } from '@/services/container';
import { renderApp } from '@/test-utils/renderApp';

import { CreationDetailScreen } from '../CreationDetailScreen';
import { DiamondBookScreen } from '../DiamondBookScreen';

function DetailRoute() {
  const { creationId } = useLocalSearchParams<{ creationId: string }>();
  return <CreationDetailScreen creationId={creationId} />;
}

describe('My Diamond Book', () => {
  it('lists creations, filters them, opens one full-screen and toggles favourite', async () => {
    const services = createTestServices();
    const repo = services.repositories.creations;
    const drawing = await repo.create({
      childId: 'chd_default',
      type: 'DRAWING',
      title: "PJ's Yellow Star",
      thumbnailUri: 'memory://t1',
      assetUri: 'memory://a1',
      metadata: {},
    });
    await repo.create({
      childId: 'chd_default',
      type: 'CRAFT',
      title: 'My Cup',
      thumbnailUri: 'asset://craft.clayCup.7',
      assetUri: 'asset://craft.clayCup.7',
      metadata: { craftId: 'crf_clay_cup' },
    });

    const { app, q } = await renderApp(
      { 'book/index': DiamondBookScreen, 'book/[creationId]': DetailRoute },
      { initialUrl: '/book', services },
    );

    expect(await q.findByText("PJ's Yellow Star")).toBeTruthy();
    expect(q.getByText('My Cup')).toBeTruthy();

    await fireEvent.press(q.getByTestId('filter-CRAFTS'));
    await waitFor(() => expect(q.queryByText("PJ's Yellow Star")).toBeNull());
    expect(q.getByText('My Cup')).toBeTruthy();

    await fireEvent.press(q.getByTestId('filter-FAVORITES'));
    await waitFor(() => expect(q.queryByText('My Cup')).toBeNull());
    expect(await q.findByText('Make something and it will appear here!')).toBeTruthy();

    await fireEvent.press(q.getByTestId('filter-ALL'));
    await fireEvent.press(await q.findByTestId(`creation-${drawing.id}`));
    await waitFor(() => expect(app.getPathname()).toBe(`/book/${drawing.id}`));

    await fireEvent.press(await q.findByTestId('favorite-toggle'));
    await waitFor(async () => expect((await repo.get(drawing.id))?.favorite).toBe(true));
  });
});
