import { fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';

import { createTestServices } from '@/services/container';
import { NoCameraService } from '@/services/defaults';
import { renderApp } from '@/test-utils/renderApp';

import { CraftPlayerScreen } from '../CraftPlayerScreen';

describe("PJ's Clay Cup flow (no photo)", () => {
  it('can skip the photo and still complete with the bundled illustration', async () => {
    const services = createTestServices({ camera: new NoCameraService() });
    const { q } = await renderApp(
      {
        'create/craft/[craftId]': () => <CraftPlayerScreen craftId="crf_clay_cup" />,
        'book/index': () => <Text>book-screen</Text>,
      },
      { initialUrl: '/create/craft/crf_clay_cup', services },
    );

    await q.findByText('Make a clay log.');
    for (let i = 0; i < 5; i += 1) await fireEvent.press(q.getByTestId('craft-next'));
    await fireEvent.press(await q.findByTestId('photo-skip'));
    await fireEvent.press(await q.findByTestId('craft-save'));
    expect(await q.findByText('PJ made a cup!')).toBeTruthy();

    const [creation] = await services.repositories.creations.list('chd_default');
    expect(creation?.assetUri).toBe('asset://craft.clayCup.7');
    expect(creation?.title).toBe('My Cup');
  });
});
