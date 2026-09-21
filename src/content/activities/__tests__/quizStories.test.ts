import { activityDefinitionSchema } from '@/domain/activity/schema';
import { quizActivities } from '../quiz';
import { storyActivities } from '../stories';

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
  'circle',
  'square',
  'triangle',
  'rectangle',
  'oval',
  'hexagon',
  'eye',
  'ear',
  'hand',
  'nose',
  'mouth',
  'foot',
  'hat',
  'shirt',
  'chest',
  'gift',
  'abc',
  'numbers',
  'flask',
  'scissors',
  'flower',
  'leaf',
  'star',
  'heart',
  'diamond',
  'jellyfish',
  'crown',
  'robot',
  'pig',
  'shell',
  'rainbow',
  'music',
  'book',
  'island',
  'sparkle',
  'paintbrush',
  'camera',
]);

type ParsedActivity = ReturnType<typeof activityDefinitionSchema.parse>;

function collectPictureIcons(activity: ParsedActivity): string[] {
  const icons: string[] = [];
  const { data } = activity;
  if (data.kind === 'QUIZ') {
    for (const q of data.questions) {
      for (const c of q.choices) {
        icons.push(c.picture.icon);
      }
    }
  } else if (data.kind === 'STORY') {
    if (data.question) {
      for (const c of data.question.choices) {
        icons.push(c.picture.icon);
      }
    }
  }
  return icons;
}

describe('quiz and story activities', () => {
  it('every activity definition is valid according to the schema', () => {
    const all = [...quizActivities, ...storyActivities];
    for (const activity of all) {
      expect(() => activityDefinitionSchema.parse(activity)).not.toThrow();
    }
  });

  it('has exactly 8 quiz activities, each with at least 7 questions', () => {
    expect(quizActivities).toHaveLength(8);
    for (const activity of quizActivities) {
      const parsed = activityDefinitionSchema.parse(activity);
      expect(parsed.data.kind).toBe('QUIZ');
      if (parsed.data.kind === 'QUIZ') {
        expect(parsed.data.questions.length).toBeGreaterThanOrEqual(7);
      }
    }
  });

  it('has exactly 3 story activities, each with exactly 5 pages', () => {
    expect(storyActivities).toHaveLength(3);
    for (const activity of storyActivities) {
      const parsed = activityDefinitionSchema.parse(activity);
      expect(parsed.data.kind).toBe('STORY');
      if (parsed.data.kind === 'STORY') {
        expect(parsed.data.pages).toHaveLength(5);
      }
    }
  });

  it('every picture icon in all activities is in the allowed icon list', () => {
    const all = [...quizActivities, ...storyActivities];
    for (const activity of all) {
      const parsed = activityDefinitionSchema.parse(activity);
      const icons = collectPictureIcons(parsed);
      for (const icon of icons) {
        expect(ALLOWED_ICONS.has(icon)).toBe(true);
      }
    }
  });
});
