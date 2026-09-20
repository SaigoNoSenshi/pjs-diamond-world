import { craftTemplateSchema, type CraftTemplate } from '../schema';

const valid: CraftTemplate = {
  id: 'crf_test',
  title: 'Test Craft',
  noun: 'thing',
  description: 'A test craft.',
  icon: 'star',
  difficulty: 'EASY',
  estimatedMinutes: 5,
  materials: ['paper'],
  steps: [
    {
      id: 's0',
      order: 0,
      kind: 'INSTRUCTION',
      instruction: 'Fold it.',
      illustration: 'fold',
      audioPrompt: 'Fold it.',
    },
    {
      id: 's1',
      order: 1,
      kind: 'PHOTO',
      instruction: 'Take a picture.',
      illustration: 'camera',
      audioPrompt: 'Take a picture!',
    },
    {
      id: 's2',
      order: 2,
      kind: 'SAVE',
      instruction: 'Save it.',
      illustration: 'save',
      audioPrompt: 'Save it!',
    },
  ],
  tags: ['test'],
  reward: { creativityPoints: 3 },
  completionAction: 'SAVE_PHOTO',
};

describe('craftTemplateSchema', () => {
  it('accepts a well-formed template', () => {
    expect(craftTemplateSchema.safeParse(valid).success).toBe(true);
  });

  it('requires contiguous step ordering', () => {
    const broken = {
      ...valid,
      steps: valid.steps.map((s, i) => ({ ...s, order: i === 1 ? 5 : s.order })),
    };
    expect(craftTemplateSchema.safeParse(broken).success).toBe(false);
  });

  it('requires exactly one SAVE step, placed last', () => {
    const noSave = {
      ...valid,
      steps: valid.steps.map((s) => ({ ...s, kind: 'INSTRUCTION' as const })),
    };
    expect(craftTemplateSchema.safeParse(noSave).success).toBe(false);
    const saveFirst = {
      ...valid,
      steps: [valid.steps[2]!, valid.steps[0]!, valid.steps[1]!].map((s, i) => ({
        ...s,
        order: i,
      })),
    };
    expect(craftTemplateSchema.safeParse(saveFirst).success).toBe(false);
  });

  it('rejects overly long instructions (children should not read paragraphs)', () => {
    const long = {
      ...valid,
      steps: valid.steps.map((s) => ({ ...s, instruction: 'x'.repeat(81) })),
    };
    expect(craftTemplateSchema.safeParse(long).success).toBe(false);
  });
});
