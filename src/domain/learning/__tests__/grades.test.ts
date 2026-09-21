import type { ActivityDefinition } from '@/domain/activity/schema';

import {
  activitiesForGrade,
  clampGrade,
  masteryForGrade,
  MIN_CORE_FOR_MASTERY,
  nextGrade,
} from '../grades';
import { createInitialLearningProgress } from '../schema';

const mk = (
  id: string,
  grade: number,
  subject: ActivityDefinition['subject'],
): ActivityDefinition => ({
  id: `act_${id}`,
  kind: 'MATH',
  islandId: 'numbers',
  title: id,
  icon: 'star',
  color: '#fff',
  voiceIntro: 'hi',
  instruction: 'go',
  reward: { diamonds: 3 },
  tags: [],
  grades: [grade],
  subject,
  data: { kind: 'MATH', generator: 'addition', grade, rounds: 6, input: 'auto' },
});

const ALL = [
  ...Array.from({ length: 6 }, (_, i) => mk(`g1_${i}`, 1, 'math')),
  mk('g1_art', 1, 'art'),
  ...Array.from({ length: 6 }, (_, i) => mk(`g2_${i}`, 2, 'english')),
];

describe('grades', () => {
  it('clamps and filters by grade', () => {
    expect(clampGrade(0)).toBe(1);
    expect(clampGrade(9)).toBe(6);
    expect(activitiesForGrade(ALL, 2)).toHaveLength(6);
  });

  it('mastery counts only core subjects scored ≥ 0.8 and needs enough core activities', () => {
    let p = createInitialLearningProgress('chd_default', '2026-09-21T00:00:00.000Z');
    expect(masteryForGrade(p, ALL, 1)).toMatchObject({ core: 6, mastered: 0, complete: false });
    const now = '2026-09-21T00:00:00.000Z';
    for (let i = 0; i < 5; i += 1)
      p = {
        ...p,
        completions: { ...p.completions, [`act_g1_${i}`]: { count: 1, lastAt: now, best: 0.9 } },
      };
    p = {
      ...p,
      completions: {
        ...p.completions,
        act_g1_5: { count: 1, lastAt: now, best: 0.5 },
        act_g1_art: { count: 3, lastAt: now },
      },
    };
    const m = masteryForGrade(p, ALL, 1);
    expect(m.mastered).toBe(5);
    expect(m.fraction).toBeCloseTo(5 / 6);
    expect(m.complete).toBe(true);
    expect(MIN_CORE_FOR_MASTERY).toBe(5);
    // Auto-advance moves to grade 2 but not beyond (grade 2 not mastered).
    expect(nextGrade(p, ALL, 1, true)).toBe(2);
    expect(nextGrade(p, ALL, 1, false)).toBe(1);
    // Never moves down.
    expect(nextGrade(p, ALL, 3, true)).toBe(3);
  });
});
