import { allActivities, findActivity, registerActivities, unregisterSource } from '../registry';

describe('activity registry', () => {
  it('built-ins are registered, generated math/words exist for every grade', () => {
    // Importing the index registers built-ins.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../index');
    const all = allActivities();
    expect(all.length).toBeGreaterThan(100);
    for (let g = 1; g <= 6; g += 1) {
      expect(all.some((a) => a.kind === 'MATH' && a.grades.includes(g))).toBe(true);
    }
    expect(findActivity('act_math_addition_g1')?.data.kind).toBe('MATH');
    expect(findActivity('act_math_integers_g6')).toBeDefined();
    expect(findActivity('act_math_integers_g1')).toBeUndefined();
    const ids = all.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('merges a remote pack, rejects invalid entries without throwing, and can withdraw the pack', () => {
    const before = allActivities().length;
    const result = registerActivities(
      [
        {
          id: 'act_remote_quiz_test',
          kind: 'QUIZ',
          islandId: 'science',
          title: 'Remote quiz',
          icon: 'flask',
          color: '#6BCB77',
          voiceIntro: 'hi',
          instruction: 'tap',
          reward: { diamonds: 2 },
          grades: [2],
          subject: 'science',
          data: {
            kind: 'QUIZ',
            pick: 1,
            questions: [
              {
                id: 'q',
                prompt: 'p',
                choices: [
                  { id: 'a', label: 'A' },
                  { id: 'b', label: 'B' },
                ],
                answerId: 'a',
              },
            ],
          },
        },
        { id: 'act_bad', kind: 'QUIZ' },
      ],
      'remote:test',
    );
    expect(result).toMatchObject({ added: 1, replaced: 0 });
    expect(result.rejected).toHaveLength(1);
    expect(allActivities().length).toBe(before + 1);
    expect(findActivity('act_remote_quiz_test')?.grades).toEqual([2]);
    expect(unregisterSource('remote:test')).toBe(1);
    expect(allActivities().length).toBe(before);
  });
});
