import { waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { renderApp } from '@/test-utils/renderApp';

import UnmatchedRoute from '../[...unmatched]';

describe('unknown URLs', () => {
  it('redirect to the intro instead of showing a not-found screen', async () => {
    const { app, q } = await renderApp(
      {
        index: () => <Text>intro-screen</Text>,
        home: () => <Text>home-screen</Text>,
        '[...unmatched]': UnmatchedRoute,
      },
      { initialUrl: '/p/some-hosting-prefix?v=4' },
    );
    await waitFor(() => expect(app.getPathname()).toBe('/'));
    expect(await q.findByText('intro-screen')).toBeTruthy();
  });
});
