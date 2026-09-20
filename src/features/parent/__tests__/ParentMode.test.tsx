import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { createTestServices } from '@/services/container';
import { renderApp } from '@/test-utils/renderApp';

import { ParentCreationsScreen } from '../ParentCreationsScreen';
import { ParentGateScreen } from '../ParentGateScreen';
import { ParentHomeScreen } from '../ParentHomeScreen';
import { ParentSettingsScreen } from '../ParentSettingsScreen';

jest.setTimeout(20000);

describe('Parent Mode', () => {
  it('requires hold + a correct sum, then lets a parent change settings and manage creations', async () => {
    const services = createTestServices();
    await services.repositories.creations.create({
      childId: 'chd_default',
      type: 'DRAWING',
      title: "PJ's Yellow Star",
      thumbnailUri: 'memory://t',
      assetUri: 'memory://a',
      metadata: {},
    });

    const { app, q } = await renderApp(
      {
        'parent/index': ParentGateScreen,
        'parent/home': ParentHomeScreen,
        'parent/settings': ParentSettingsScreen,
        'parent/creations': ParentCreationsScreen,
        'parent/privacy': () => <Text>privacy</Text>,
        home: () => <Text>home-screen</Text>,
      },
      { initialUrl: '/parent', services },
    );

    // Deep-linking to a parent screen while locked bounces back to the gate.
    expect(await q.findByTestId('parent-gate-hold')).toBeTruthy();

    // Hold the lock for the full duration.
    const hold = q.getByTestId('parent-gate-hold');
    await act(async () => {
      fireEvent(hold, 'pressIn');
      await new Promise((r) => setTimeout(r, 2300));
    });
    const question = await q.findByTestId('parent-gate-question');
    const match = /What is (\d+) \+ (\d+)\?/.exec(String(question.props.children));
    expect(match).not.toBeNull();
    const answer = Number(match![1]) + Number(match![2]);

    // A wrong answer stays on the gate with a message and a fresh question.
    const wrong = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20].find(
      (n) => n !== answer && q.queryByTestId(`gate-option-${n}`),
    );
    if (wrong) {
      await fireEvent.press(q.getByTestId(`gate-option-${wrong}`));
      expect(await q.findByText('Not quite — try again.')).toBeTruthy();
    }
    const q2 = await q.findByTestId('parent-gate-question');
    const m2 = /What is (\d+) \+ (\d+)\?/.exec(String(q2.props.children))!;
    await fireEvent.press(q.getByTestId(`gate-option-${Number(m2[1]) + Number(m2[2])}`));
    await waitFor(() => expect(app.getPathname()).toBe('/parent/home'));

    // Settings: toggle voice off, persisted.
    await fireEvent.press(await q.findByTestId('parent-settings'));
    await waitFor(() => expect(app.getPathname()).toBe('/parent/settings'));
    const voiceToggle = await q.findByTestId('toggle-voice');
    await fireEvent(voiceToggle, 'valueChange', false);
    await waitFor(async () =>
      expect((await services.repositories.settings.getProfile()).settings.voiceEnabled).toBe(false),
    );

    // Creations: rename then delete.
    await fireEvent.press(q.getByRole('button', { name: 'Back' }));
    await fireEvent.press(await q.findByTestId('parent-creations'));
    await waitFor(() => expect(app.getPathname()).toBe('/parent/creations'));
    const [creation] = await services.repositories.creations.list('chd_default');
    await fireEvent.press(await q.findByTestId(`rename-${creation!.id}`));
    await fireEvent.changeText(await q.findByTestId('rename-input'), 'Star for Grandma');
    await fireEvent(q.getByTestId('rename-input'), 'submitEditing');
    await waitFor(async () =>
      expect((await services.repositories.creations.get(creation!.id))?.title).toBe(
        'Star for Grandma',
      ),
    );
    await fireEvent.press(await q.findByTestId(`delete-${creation!.id}`));
    await waitFor(async () =>
      expect(await services.repositories.creations.count('chd_default')).toBe(0),
    );
  });
});
