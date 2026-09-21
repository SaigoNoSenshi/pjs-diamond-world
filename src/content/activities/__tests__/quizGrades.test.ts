import { activityDefinitionSchema } from '@/domain/activity/schema';
import { gradeQuizActivities } from '../quizGrades';

const ALLOWED_ICONS = new Set([
  'fish',
  'crab',
  'turtle',
  'octopus',
  'starfish',
  'whale',
  'seahorse',
  'sun',
  'moon',
  'cloud',
  'rain',
  'tree',
  'house',
  'boat',
  'apple',
  'banana',
  'mango',
  'coconut',
  'carrot',
  'rice',
  'cat',
  'dog',
  'bird',
  'frog',
  'butterfly',
  'bee',
  'ball',
  'cup',
  'chair',
  'rock',
  'spoon',
  'jeepney',
  'eye',
  'ear',
  'hand',
  'nose',
  'mouth',
  'foot',
  'hat',
  'shirt',
  'gift',
  'flower',
  'leaf',
  'star',
  'heart',
  'diamond',
  'flask',
  'book',
  'island',
]);

describe('gradeQuizActivities', () => {
  it('has exactly 24 activities', () => {
    expect(gradeQuizActivities).toHaveLength(24);
  });

  it('every activity passes schema validation', () => {
    for (const act of gradeQuizActivities) {
      expect(() => activityDefinitionSchema.parse(act)).not.toThrow();
    }
  });

  it('science first-set activities (act_quiz_sci_gN) have 10 questions each', () => {
    for (let g = 1; g <= 6; g++) {
      const act = gradeQuizActivities.find((a) => a.id === `act_quiz_sci_g${g}`);
      expect(act).toBeDefined();
      if (act && act.data.kind === 'QUIZ') {
        expect(act.data.questions).toHaveLength(10);
      }
    }
  });

  it('science second-set activities (act_quiz_sci2_gN) have 8 questions each', () => {
    for (let g = 1; g <= 6; g++) {
      const act = gradeQuizActivities.find((a) => a.id === `act_quiz_sci2_g${g}`);
      expect(act).toBeDefined();
      if (act && act.data.kind === 'QUIZ') {
        expect(act.data.questions).toHaveLength(8);
      }
    }
  });

  it('Araling Panlipunan first-set activities (act_quiz_ap_gN) have 10 questions each', () => {
    for (let g = 1; g <= 6; g++) {
      const act = gradeQuizActivities.find((a) => a.id === `act_quiz_ap_g${g}`);
      expect(act).toBeDefined();
      if (act && act.data.kind === 'QUIZ') {
        expect(act.data.questions).toHaveLength(10);
      }
    }
  });

  it('Araling Panlipunan second-set activities (act_quiz_ap2_gN) have 8 questions each', () => {
    for (let g = 1; g <= 6; g++) {
      const act = gradeQuizActivities.find((a) => a.id === `act_quiz_ap2_g${g}`);
      expect(act).toBeDefined();
      if (act && act.data.kind === 'QUIZ') {
        expect(act.data.questions).toHaveLength(8);
      }
    }
  });

  it('grades 1–6 are each present for both science and Araling Panlipunan', () => {
    for (let g = 1; g <= 6; g++) {
      const sciAct = gradeQuizActivities.find((a) => a.id === `act_quiz_sci_g${g}`);
      const apAct = gradeQuizActivities.find((a) => a.id === `act_quiz_ap_g${g}`);
      expect(sciAct).toBeDefined();
      expect(apAct).toBeDefined();
      if (sciAct) expect(sciAct.grades).toContain(g);
      if (apAct) expect(apAct.grades).toContain(g);
    }
  });

  it("every answerId is present among that question's choices", () => {
    for (const act of gradeQuizActivities) {
      if (act.data.kind === 'QUIZ') {
        for (const q of act.data.questions) {
          const choiceIds = q.choices.map((c) => c.id);
          expect(choiceIds).toContain(q.answerId);
        }
      }
    }
  });

  it('all picture icons (when present) are in the allowed icon list', () => {
    for (const act of gradeQuizActivities) {
      if (act.data.kind === 'QUIZ') {
        for (const q of act.data.questions) {
          for (const c of q.choices) {
            if (c.picture) {
              expect(ALLOWED_ICONS.has(c.picture.icon)).toBe(true);
            }
          }
        }
      }
    }
  });

  it('all activities have kind QUIZ and subject set correctly', () => {
    const scienceActivities = gradeQuizActivities.filter((a) => a.islandId === 'science');
    const apActivities = gradeQuizActivities.filter((a) => a.islandId === 'stories');

    expect(scienceActivities).toHaveLength(12);
    expect(apActivities).toHaveLength(12);

    for (const act of scienceActivities) {
      expect(act.kind).toBe('QUIZ');
      expect(act.subject).toBe('science');
    }
    for (const act of apActivities) {
      expect(act.kind).toBe('QUIZ');
      expect(act.subject).toBe('araling_panlipunan');
    }
  });
});
