import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { hashPin } from '@/domain/profile/parentGate';
import { createTestServices } from '@/services/container';
import { renderApp } from '@/test-utils/renderApp';

import { ParentGateScreen } from '../ParentGateScreen';

jest.setTimeout(20000);

describe('Parent gate with PIN', () => {
  it('asks for the PIN instead of arithmetic when one is set', async () => {
    const services = createTestServices();
    await services.repositories.settings.updateSettings({ parentPinHash: hashPin('2468') });

    const { app, q } = await renderApp(
      { 'parent/index': ParentGateScreen, 'parent/home': () => <Text>parent-home</Text> },
      { initialUrl: '/parent', services },
    );

    const hold = await q.findByTestId('parent-gate-hold');
    await act(async () => {
      fireEvent(hold, 'pressIn');
      await new Promise((r) => setTimeout(r, 2300));
    });
    expect(await q.findByText('Enter your parent PIN')).toBeTruthy();

    for (const d of ['1', '1', '1', '1']) await fireEvent.press(q.getByTestId(`pin-${d}`));
    expect(await q.findByText('Not quite — try again.')).toBeTruthy();

    for (const d of ['2', '4', '6', '8']) await fireEvent.press(q.getByTestId(`pin-${d}`));
    await waitFor(() => expect(app.getPathname()).toBe('/parent/home'));
  });
});
