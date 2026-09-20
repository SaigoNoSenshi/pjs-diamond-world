import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { lazyScreen } from '../lazyScreen';

function Greeting({ name }: { name: string }) {
  return <Text>hello {name}</Text>;
}

describe('lazyScreen', () => {
  it('shows the quiet loader, then the screen with its props', async () => {
    let resolve: ((c: typeof Greeting) => void) | null = null;
    const Lazy = lazyScreen<{ name: string }>(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    const screen = await render(<Lazy name="PJ" />);
    expect(screen.getByTestId('screen-loading')).toBeTruthy();
    resolve!(Greeting);
    expect(await screen.findByText('hello PJ')).toBeTruthy();
    expect(screen.queryByTestId('screen-loading')).toBeNull();
  });
});
