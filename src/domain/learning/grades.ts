import type { ActivityDefinition } from '../activity/schema';
import type { LearningProgress } from './schema';

/**
 * Grade levels (Philippines K-12, Grades 1–6). The child's grade is set by a parent
 * and, when auto-advance is on, moves up by itself once the grade is mastered.
 * It never moves down.
 */
export const MIN_GRADE = 1;
export const MAX_GRADE = 6;

export const GRADE_NAMES: Record<number, string> = {
  1: 'Grade 1',
  2: 'Grade 2',
  3: 'Grade 3',
  4: 'Grade 4',
  5: 'Grade 5',
  6: 'Grade 6',
};

export function clampGrade(g: number): number {
  return Math.min(MAX_GRADE, Math.max(MIN_GRADE, Math.round(g)));
}

/** Activities meant for this grade. */
export function activitiesForGrade(
  all: readonly ActivityDefinition[],
  grade: number,
): ActivityDefinition[] {
  return all.filter((a) => a.grades.includes(grade));
}

/** Activities that count as "core" for mastery: the learning subjects, not art/music/craft. */
const CORE_SUBJECTS = new Set(['english', 'math', 'science', 'filipino', 'araling_panlipunan']);

export const MASTERY_SCORE = 0.8;
export const MASTERY_FRACTION = 0.8;
/** At least this many core activities must exist before a grade can be considered mastered. */
export const MIN_CORE_FOR_MASTERY = 5;

export interface GradeMastery {
  grade: number;
  core: number;
  mastered: number;
  /** 0..1 */
  fraction: number;
  complete: boolean;
}

export function masteryForGrade(
  progress: LearningProgress,
  all: readonly ActivityDefinition[],
  grade: number,
): GradeMastery {
  const core = activitiesForGrade(all, grade).filter((a) => CORE_SUBJECTS.has(a.subject));
  const mastered = core.filter((a) => {
    const rec = progress.completions[a.id];
    return !!rec && (rec.best === undefined ? rec.count >= 1 : rec.best >= MASTERY_SCORE);
  }).length;
  const fraction = core.length ? mastered / core.length : 0;
  return {
    grade,
    core: core.length,
    mastered,
    fraction,
    complete: core.length >= MIN_CORE_FOR_MASTERY && fraction >= MASTERY_FRACTION,
  };
}

/** The grade the child should be on after this progress, given the current setting. */
export function nextGrade(
  progress: LearningProgress,
  all: readonly ActivityDefinition[],
  current: number,
  autoAdvance: boolean,
): number {
  if (!autoAdvance) return clampGrade(current);
  let g = clampGrade(current);
  while (g < MAX_GRADE && masteryForGrade(progress, all, g).complete) g += 1;
  return g;
}
