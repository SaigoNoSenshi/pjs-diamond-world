import { clayCup } from '@/content/crafts/clayCup';

import {
  attachPhoto,
  canComplete,
  completeSession,
  createCraftSession,
  currentStep,
  isFirstStep,
  isLastStep,
  nextStep,
  previousStep,
  progressRatio,
  toCraftProgress,
} from '../craftEngine';

const NOW = '2026-09-14T00:00:00.000Z';

describe('craftEngine', () => {
  it('walks forward and back through the steps without overflowing', () => {
    let s = createCraftSession(clayCup, NOW);
    expect(isFirstStep(s)).toBe(true);
    expect(currentStep(s).id).toBe('log');
    s = previousStep(s);
    expect(s.stepIndex).toBe(0);
    for (let i = 0; i < 10; i += 1) s = nextStep(s);
    expect(isLastStep(s)).toBe(true);
    expect(currentStep(s).kind).toBe('SAVE');
    expect(progressRatio(s)).toBe(1);
    s = previousStep(s);
    expect(currentStep(s).kind).toBe('PHOTO');
  });

  it('only allows completion on the SAVE step, with or without a photo', () => {
    let s = createCraftSession(clayCup, NOW);
    expect(canComplete(s)).toBe(false);
    while (!isLastStep(s)) s = nextStep(s);
    expect(canComplete(s)).toBe(true);
    s = attachPhoto(s, 'file:///cup.jpg');
    expect(s.photoUri).toBe('file:///cup.jpg');
    const done = completeSession(s, NOW);
    expect(done.completedAt).toBe(NOW);
  });

  it('resumes from saved progress and ignores completed progress', () => {
    const progress = toCraftProgress(
      attachPhoto(nextStep(nextStep(createCraftSession(clayCup, NOW))), 'file:///p.jpg'),
      'chd_default',
      NOW,
    );
    expect(progress.currentStepIndex).toBe(2);
    expect(progress.photoUri).toBe('file:///p.jpg');

    const resumed = createCraftSession(clayCup, '2026-09-15T00:00:00.000Z', progress);
    expect(resumed.stepIndex).toBe(2);
    expect(resumed.photoUri).toBe('file:///p.jpg');
    expect(resumed.startedAt).toBe(NOW);

    const fresh = createCraftSession(clayCup, NOW, { ...progress, completedAt: NOW });
    expect(fresh.stepIndex).toBe(0);
    expect(fresh.photoUri).toBeNull();
  });
});
