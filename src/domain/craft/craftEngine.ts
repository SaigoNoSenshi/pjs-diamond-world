import type { CraftProgress, CraftStep, CraftTemplate } from './schema';

/**
 * Craft Activity Engine — a pure state machine over a validated CraftTemplate.
 * The Craft Player renders whatever session this produces; no craft-specific code
 * lives in the UI.
 */
export interface CraftSession {
  template: CraftTemplate;
  stepIndex: number;
  photoUri: string | null;
  startedAt: string;
  completedAt: string | null;
}

export function createCraftSession(
  template: CraftTemplate,
  now: string,
  resume?: CraftProgress | null,
): CraftSession {
  if (resume && resume.craftId === template.id && !resume.completedAt) {
    return {
      template,
      stepIndex: Math.min(resume.currentStepIndex, template.steps.length - 1),
      photoUri: resume.photoUri ?? null,
      startedAt: resume.startedAt,
      completedAt: null,
    };
  }
  return { template, stepIndex: 0, photoUri: null, startedAt: now, completedAt: null };
}

export function currentStep(session: CraftSession): CraftStep {
  return session.template.steps[session.stepIndex] ?? session.template.steps[0]!;
}

export function isFirstStep(session: CraftSession): boolean {
  return session.stepIndex === 0;
}

export function isLastStep(session: CraftSession): boolean {
  return session.stepIndex >= session.template.steps.length - 1;
}

export function nextStep(session: CraftSession): CraftSession {
  if (isLastStep(session)) return session;
  return { ...session, stepIndex: session.stepIndex + 1 };
}

export function previousStep(session: CraftSession): CraftSession {
  if (isFirstStep(session)) return session;
  return { ...session, stepIndex: session.stepIndex - 1 };
}

export function attachPhoto(session: CraftSession, photoUri: string | null): CraftSession {
  return { ...session, photoUri };
}

/** A craft can always be completed on its SAVE step; a photo is encouraged, never required. */
export function canComplete(session: CraftSession): boolean {
  return currentStep(session).kind === 'SAVE';
}

export function completeSession(session: CraftSession, now: string): CraftSession {
  return { ...session, completedAt: now };
}

/** Fraction 0..1 for non-textual progress indicators. */
export function progressRatio(session: CraftSession): number {
  const total = session.template.steps.length;
  return total <= 1 ? 1 : session.stepIndex / (total - 1);
}

export function toCraftProgress(
  session: CraftSession,
  childId: string,
  now: string,
): CraftProgress {
  return {
    craftId: session.template.id,
    childId,
    currentStepIndex: session.stepIndex,
    ...(session.photoUri ? { photoUri: session.photoUri } : {}),
    startedAt: session.startedAt,
    updatedAt: now,
    ...(session.completedAt ? { completedAt: session.completedAt } : {}),
  };
}
