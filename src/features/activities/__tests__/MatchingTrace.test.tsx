import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { findActivity } from '@/content/activities';
import type { MatchingData, TraceData } from '@/domain/activity/schema';
import { AppServicesProvider } from '@/hooks/useAppServices';
import { ProfileProvider } from '@/hooks/useProfile';
import { createTestServices } from '@/services/container';

import { MatchingPlayer } from '../engines/MatchingPlayer';
import { TracePlayer } from '../engines/TracePlayer';

function wrap(ui: React.ReactElement) {
  const services = createTestServices();
  return render(
    <AppServicesProvider services={services}>
      <ProfileProvider>{ui}</ProfileProvider>
    </AppServicesProvider>,
  );
}

describe('MatchingPlayer', () => {
  it('flips pairs and completes when all are matched', async () => {
    const activity = findActivity('act_match_shapes')! as Parameters<
      typeof MatchingPlayer
    >[0]['activity'];
    const pairs = (activity.data as MatchingData).pairs;
    const order = pairs.flatMap((p) => [`${p.id}-a`, `${p.id}-b`]);
    const onComplete = jest.fn();
    const screen = await wrap(
      <MatchingPlayer activity={activity} onComplete={onComplete} order={order} />,
    );
    // A mismatch first: card 0 and card 2 (different pairs).
    await fireEvent.press(screen.getByTestId(`card-${order[0]}`));
    await fireEvent.press(screen.getByTestId(`card-${order[2]}`));
    await waitFor(
      () =>
        expect(screen.getByTestId(`card-${order[0]}`).props.accessibilityState.selected).toBe(
          false,
        ),
      {
        timeout: 2500,
      },
    );
    for (const p of pairs) {
      await fireEvent.press(screen.getByTestId(`card-${p.id}-a`));
      await fireEvent.press(screen.getByTestId(`card-${p.id}-b`));
    }
    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), { timeout: 2500 });
    expect(onComplete.mock.calls[0]?.[0]).toBeGreaterThan(0.5);
  });
});

describe('TracePlayer', () => {
  it('turns a stroke green when traced and completes the glyph', async () => {
    const activity = findActivity('act_trace_l')! as Parameters<typeof TracePlayer>[0]['activity'];
    const data = activity.data as TraceData;
    const onComplete = jest.fn();
    const screen = await wrap(<TracePlayer activity={activity} onComplete={onComplete} />);
    const canvas = screen.getByTestId('trace-canvas');
    await fireEvent(canvas, 'layout', { nativeEvent: { layout: { width: 300, height: 300 } } });

    // Trace each guide stroke by following its points (in pixel space).
    for (const stroke of data.strokes) {
      const pts = stroke.points.map((p) => ({ locationX: p.x * 300, locationY: p.y * 300 }));
      await fireEvent(canvas, 'responderGrant', { nativeEvent: pts[0] });
      for (const p of pts.slice(1)) await fireEvent(canvas, 'responderMove', { nativeEvent: p });
      await fireEvent(canvas, 'responderRelease', { nativeEvent: pts[pts.length - 1] });
    }
    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), { timeout: 3000 });
    expect(onComplete.mock.calls[0]?.[0]).toBeGreaterThanOrEqual(0.8);
  });

  it('does not complete when the finger stays far from the line', async () => {
    const activity = findActivity('act_trace_l')! as Parameters<typeof TracePlayer>[0]['activity'];
    const onComplete = jest.fn();
    const screen = await wrap(<TracePlayer activity={activity} onComplete={onComplete} />);
    const canvas = screen.getByTestId('trace-canvas');
    await fireEvent(canvas, 'layout', { nativeEvent: { layout: { width: 300, height: 300 } } });
    await fireEvent(canvas, 'responderGrant', { nativeEvent: { locationX: 5, locationY: 5 } });
    await fireEvent(canvas, 'responderMove', { nativeEvent: { locationX: 5, locationY: 40 } });
    await fireEvent(canvas, 'responderRelease', { nativeEvent: { locationX: 5, locationY: 40 } });
    await new Promise((r) => setTimeout(r, 300));
    expect(onComplete).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByTestId('trace-clear'));
  });
});
