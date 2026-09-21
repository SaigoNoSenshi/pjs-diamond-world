import { activityDefinitionSchema } from '@/domain/activity/schema';
import { languageQuizActivities } from '../quizLanguage';

const ALLOWED_ICONS = new Set([
  'fish',
  'crab',
  'turtle',
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
  'book',
]);

describe('languageQuizActivities', () => {
  it('has exactly 18 activities', () => {
    expect(languageQuizActivities).toHaveLength(18);
  });

  it('every activity passes schema validation', () => {
    for (const act of languageQuizActivities) {
      expect(() => activityDefinitionSchema.parse(act)).not.toThrow();
    }
  });

  it('Filipino first-set activities (act_quiz_fil_gN) have 10 questions each', () => {
    for (let g = 1; g <= 6; g++) {
      const act = languageQuizActivities.find((a) => a.id === `act_quiz_fil_g${g}`);
      expect(act).toBeDefined();
      if (act && act.data.kind === 'QUIZ') {
        expect(act.data.questions).toHaveLength(10);
      }
    }
  });

  it('Filipino second-set activities (act_quiz_fil2_gN) have 8 questions each', () => {
    for (let g = 1; g <= 6; g++) {
      const act = languageQuizActivities.find((a) => a.id === `act_quiz_fil2_g${g}`);
      expect(act).toBeDefined();
      if (act && act.data.kind === 'QUIZ') {
        expect(act.data.questions).toHaveLength(8);
      }
    }
  });

  it('English activities (act_quiz_eng_gN) have 10 questions each', () => {
    for (let g = 1; g <= 6; g++) {
      const act = languageQuizActivities.find((a) => a.id === `act_quiz_eng_g${g}`);
      expect(act).toBeDefined();
      if (act && act.data.kind === 'QUIZ') {
        expect(act.data.questions).toHaveLength(10);
      }
    }
  });

  it('grades 1–6 are each present for Filipino (both sets) and English', () => {
    for (let g = 1; g <= 6; g++) {
      const fil = languageQuizActivities.find((a) => a.id === `act_quiz_fil_g${g}`);
      const fil2 = languageQuizActivities.find((a) => a.id === `act_quiz_fil2_g${g}`);
      const eng = languageQuizActivities.find((a) => a.id === `act_quiz_eng_g${g}`);
      expect(fil).toBeDefined();
      expect(fil2).toBeDefined();
      expect(eng).toBeDefined();
      if (fil) expect(fil.grades).toContain(g);
      if (fil2) expect(fil2.grades).toContain(g);
      if (eng) expect(eng.grades).toContain(g);
    }
  });

  it("every answerId is present among that question's choices", () => {
    for (const act of languageQuizActivities) {
      if (act.data.kind === 'QUIZ') {
        for (const q of act.data.questions) {
          const choiceIds = q.choices.map((c) => c.id);
          expect(choiceIds).toContain(q.answerId);
        }
      }
    }
  });

  it('question ids are unique within each activity', () => {
    for (const act of languageQuizActivities) {
      if (act.data.kind === 'QUIZ') {
        const ids = act.data.questions.map((q) => q.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  });

  it('all picture icons (when present) are in the allowed icon list', () => {
    for (const act of languageQuizActivities) {
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

  it('all activities have kind QUIZ and subject/islandId set correctly', () => {
    const filipinoActivities = languageQuizActivities.filter((a) => a.subject === 'filipino');
    const englishActivities = languageQuizActivities.filter((a) => a.subject === 'english');

    expect(filipinoActivities).toHaveLength(12);
    expect(englishActivities).toHaveLength(6);

    for (const act of languageQuizActivities) {
      expect(act.kind).toBe('QUIZ');
      expect(act.islandId).toBe('letters');
    }
  });
});
