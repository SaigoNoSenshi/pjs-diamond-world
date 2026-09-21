import type { ActivityDefinition } from '@/domain/activity/schema';

import { ensureQuest, pickDailyQuest, questComplete, seededRandom } from '../dailyQuest';
import { CHEST_DIAMONDS, recordCompletion, REPEAT_DIAMONDS } from '../rewards';
import { createInitialLearningProgress, dateKeyFor } from '../schema';

const act = (
  id: string,
  islandId: ActivityDefinition['islandId'],
  stickerId?: string,
): ActivityDefinition => ({
  id: `act_${id}`,
  kind: 'QUIZ',
  islandId,
  title: id,
  icon: 'star',
  color: '#fff',
  voiceIntro: 'hi',
  instruction: 'tap',
  reward: { diamonds: 3, ...(stickerId ? { stickerId } : {}) },
  tags: [],
  data: {
    kind: 'QUIZ',
    pick: 1,
    questions: [
      {
        id: 'q',
        prompt: 'p',
        choices: [
          { id: 'a', label: 'a', picture: { icon: 'star' } },
          { id: 'b', label: 'b', picture: { icon: 'heart' } },
        ],
        answerId: 'a',
      },
    ],
  },
});

const ACTS = [
  act('a1', 'art', 'stk_a'),
  act('l1', 'letters', 'stk_l'),
  act('n1', 'numbers'),
  act('s1', 'science'),
  act('t1', 'stories'),
];
const CATALOGUE = ['stk_a', 'stk_l', 'stk_x', 'stk_y'];
const NOW = '2026-09-21T01:00:00.000Z';

describe('daily quest', () => {
  it('is deterministic for a date and child, and spans three islands', () => {
    const a = pickDailyQuest(ACTS, '2026-09-21', 'chd_default');
    const b = pickDailyQuest(ACTS, '2026-09-21', 'chd_default');
    expect(a).toEqual(b);
    expect(a).toHaveLength(3);
    const islands = new Set(a.map((id) => ACTS.find((x) => x.id === id)!.islandId));
    expect(islands.size).toBe(3);
    expect(a.map((id) => ACTS.find((x) => x.id === id)!.islandId)).toContain('art');
  });

  it('changes on another day and resets at midnight', () => {
    const p0 = createInitialLearningProgress('chd_default', NOW);
    const day1 = ensureQuest(p0, ACTS, '2026-09-21');
    const day2 = ensureQuest(day1, ACTS, '2026-09-22');
    expect(day1.quest?.dateKey).toBe('2026-09-21');
    expect(day2.quest?.dateKey).toBe('2026-09-22');
    expect(day2.quest?.completedIds).toEqual([]);
    expect(ensureQuest(day1, ACTS, '2026-09-21')).toBe(day1);
  });

  it('seededRandom is stable', () => {
    const r1 = seededRandom('x');
    const r2 = seededRandom('x');
    expect([r1(), r1(), r1()]).toEqual([r2(), r2(), r2()]);
  });

  it('dateKeyFor uses the local calendar day', () => {
    expect(dateKeyFor(new Date(2026, 8, 21, 23, 59))).toBe('2026-09-21');
  });
});

describe('rewards', () => {
  it('grants full diamonds and the sticker once, then a small thank-you on repeats', () => {
    let p = createInitialLearningProgress('chd_default', NOW);
    const first = recordCompletion(p, {
      activity: ACTS[0]!,
      now: NOW,
      dateKey: '2026-09-21',
      score: 0.9,
      activities: ACTS,
      stickerCatalogue: CATALOGUE,
    });
    p = first.progress;
    expect(first.earned.stickerId).toBe('stk_a');
    expect(p.stickers).toEqual(['stk_a']);
    expect(p.completions['act_a1']?.best).toBe(0.9);
    const again = recordCompletion(p, {
      activity: ACTS[0]!,
      now: NOW,
      dateKey: '2026-09-21',
      score: 0.5,
      activities: ACTS,
      stickerCatalogue: CATALOGUE,
    });
    expect(again.earned.stickerId).toBeNull();
    expect(again.earned.diamonds).toBe(REPEAT_DIAMONDS);
    expect(again.progress.completions['act_a1']?.count).toBe(2);
    expect(again.progress.completions['act_a1']?.best).toBe(0.9);
    expect(again.progress.stickers).toEqual(['stk_a']);
  });

  it('opens the chest with bonus diamonds and a new sticker when the quest completes', () => {
    let p = ensureQuest(createInitialLearningProgress('chd_default', NOW), ACTS, '2026-09-21');
    const ids = p.quest!.activityIds;
    let earnedTotal = 0;
    let chest: string | null = null;
    for (const id of ids) {
      const r = recordCompletion(p, {
        activity: ACTS.find((a) => a.id === id)!,
        now: NOW,
        dateKey: '2026-09-21',
        activities: ACTS,
        stickerCatalogue: CATALOGUE,
      });
      p = r.progress;
      earnedTotal += r.earned.diamonds;
      if (r.earned.questJustCompleted) chest = r.earned.chestStickerId;
    }
    expect(questComplete(p.quest)).toBe(true);
    expect(p.quest?.chestOpened).toBe(true);
    expect(earnedTotal).toBe(3 * 3 + CHEST_DIAMONDS);
    expect(chest).not.toBeNull();
    expect(CATALOGUE).toContain(chest);
    expect(new Set(p.stickers).size).toBe(p.stickers.length);
    // Completing a quest activity again never re-opens the chest.
    const r = recordCompletion(p, {
      activity: ACTS.find((a) => a.id === ids[0])!,
      now: NOW,
      dateKey: '2026-09-21',
      activities: ACTS,
      stickerCatalogue: CATALOGUE,
    });
    expect(r.earned.questJustCompleted).toBe(false);
    expect(r.earned.diamonds).toBe(REPEAT_DIAMONDS);
  });
});
