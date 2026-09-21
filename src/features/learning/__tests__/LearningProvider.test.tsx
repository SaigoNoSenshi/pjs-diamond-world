import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { findActivity } from '@/content/activities';
import { createProgressionEvent } from '@/domain/progression/events';
import { AppServicesProvider } from '@/hooks/useAppServices';
import { ProfileProvider } from '@/hooks/useProfile';
import { createTestServices } from '@/services/container';

import { LearningProvider, useLearning } from '../LearningProvider';

describe('LearningProvider', () => {
  it('completes a DRAW activity when a drawing is actually saved, and a CRAFT when its craft completes', async () => {
    const services = createTestServices();
    function Wrapper({ children }: PropsWithChildren) {
      return (
        <AppServicesProvider services={services}>
          <ProfileProvider>
            <LearningProvider>{children}</LearningProvider>
          </ProfileProvider>
        </AppServicesProvider>
      );
    }
    const { result } = await renderHook(() => useLearning(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.progress.quest?.activityIds).toHaveLength(3);

    await act(async () => result.current.setPendingActivity('act_draw_fish'));
    await act(async () => {
      await services.eventBus.publish(
        createProgressionEvent(
          'DRAWING_COMPLETED',
          'chd_default',
          { creationId: 'cre_1' },
          {
            id: 'evt_1',
            occurredAt: '2026-09-21T00:00:00.000Z',
          },
        ),
      );
    });
    await waitFor(() => expect(result.current.isCompleted('act_draw_fish')).toBe(true));
    expect(result.current.progress.diamonds).toBe(findActivity('act_draw_fish')!.reward.diamonds);

    // A second drawing with no pending activity counts as free drawing.
    await act(async () => {
      await services.eventBus.publish(
        createProgressionEvent(
          'DRAWING_COMPLETED',
          'chd_default',
          { creationId: 'cre_2' },
          {
            id: 'evt_2',
            occurredAt: '2026-09-21T00:00:01.000Z',
          },
        ),
      );
    });
    await waitFor(() => expect(result.current.isCompleted('act_draw_free')).toBe(true));

    await act(async () => {
      await services.eventBus.publish(
        createProgressionEvent(
          'CRAFT_COMPLETED',
          'chd_default',
          { craftId: 'crf_paper_crown', creationId: 'cre_3' },
          {
            id: 'evt_3',
            occurredAt: '2026-09-21T00:00:02.000Z',
          },
        ),
      );
    });
    await waitFor(() => expect(result.current.isCompleted('act_craft_paper_crown')).toBe(true));
    expect(result.current.progress.stickers).toContain('stk_crown');
    const saved = await services.repositories.learning.get('chd_default');
    expect(saved?.completions['act_craft_paper_crown']?.count).toBe(1);
  });
});
