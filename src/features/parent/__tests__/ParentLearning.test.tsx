import { fireEvent, waitFor } from '@testing-library/react-native';
import { useEffect } from 'react';

import { allActivities } from '@/content/activities';
import { IslandScreen } from '@/features/islands/IslandScreen';
import { useParentSession } from '@/hooks/useParentSession';
import { createTestServices } from '@/services/container';
import { renderApp } from '@/test-utils/renderApp';

import { ParentLearningScreen } from '../ParentLearningScreen';

/** Test-only: a parent who already passed the gate. */
function UnlockedLearning() {
  const { unlock } = useParentSession();
  useEffect(() => unlock(), [unlock]);
  return <ParentLearningScreen />;
}

describe('Parent → Learning', () => {
  it('sets the grade, toggles auto-advance and shows the report', async () => {
    const services = createTestServices();
    const { q } = await renderApp(
      { 'parent/learning': UnlockedLearning },
      { initialUrl: '/parent/learning', services },
    );
    expect(await q.findByTestId('grade-1')).toBeTruthy();
    expect(q.getByTestId('grade-1').props.accessibilityState.selected).toBe(true);
    await fireEvent.press(q.getByTestId('grade-4'));
    await waitFor(() =>
      expect(q.getByTestId('grade-4').props.accessibilityState.selected).toBe(true),
    );
    await waitFor(async () =>
      expect((await services.repositories.settings.getProfile()).settings.grade).toBe(4),
    );
    expect(q.getByTestId('report-mastery')).toHaveTextContent(/Grade 4/);
    expect(q.getByTestId('report-completed')).toHaveTextContent(/0 activities completed/);
    await fireEvent(q.getByTestId('toggle-auto-advance'), 'valueChange', false);
    await waitFor(async () =>
      expect((await services.repositories.settings.getProfile()).settings.autoAdvanceGrade).toBe(
        false,
      ),
    );
    await fireEvent.press(q.getByTestId('button-check-content'));
    expect(await q.findByText('Up to date.')).toBeTruthy(); // no URL in tests → unchanged
  });

  it('island shows grade-appropriate activities and grade chips up to the current grade', async () => {
    const services = createTestServices();
    await services.repositories.settings.updateSettings({ grade: 3 });
    const { q } = await renderApp(
      { 'island/[islandId]': () => <IslandScreen islandId="numbers" /> },
      { initialUrl: '/island/numbers', services },
    );
    expect(await q.findByTestId('island-activities')).toBeTruthy();
    await waitFor(() => expect(q.getByTestId('grade-chips')).toBeTruthy());
    await waitFor(() =>
      expect(q.getByTestId('grade-chip-3').props.accessibilityState.selected).toBe(true),
    );
    expect(q.queryByTestId('grade-chip-4')).toBeNull();
    // Grade 3 numbers island lists grade-3 math (division starts at G3), not grade-1 counting.
    expect(q.getByTestId('activity-act_math_division_g3')).toBeTruthy();
    expect(q.queryByTestId('activity-act_count_sea')).toBeNull();
    await fireEvent.press(q.getByTestId('grade-chip-1'));
    expect(await q.findByTestId('activity-act_count_sea')).toBeTruthy();
    const g1 = allActivities().filter(
      (a) => a.islandId === 'numbers' && a.grades.includes(1),
    ).length;
    expect(q.getByTestId('island-progress')).toHaveTextContent(`0 of ${g1} done`);
  });
});
