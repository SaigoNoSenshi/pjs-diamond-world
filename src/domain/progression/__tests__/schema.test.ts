import {
  createInitialGardenState,
  gardenItemSchema,
  gardenStateSchema,
  unlockRequirementSchema,
} from '../schema';

describe('progression schemas', () => {
  it('creates a valid initial garden state', () => {
    const state = createInitialGardenState('chd_default', '2026-09-14T00:00:00.000Z');
    expect(gardenStateSchema.safeParse(state).success).toBe(true);
    expect(state.level).toBe(1);
    expect(state.unlockedItems).toEqual([]);
  });

  it('validates unlock requirement variants', () => {
    expect(
      unlockRequirementSchema.safeParse({ kind: 'CREATIONS_AT_LEAST', count: 1 }).success,
    ).toBe(true);
    expect(
      unlockRequirementSchema.safeParse({ kind: 'EVENT', eventType: 'CRAFT_COMPLETED' }).success,
    ).toBe(true);
    expect(
      unlockRequirementSchema.safeParse({ kind: 'CREATIONS_AT_LEAST', count: 0 }).success,
    ).toBe(false);
    expect(unlockRequirementSchema.safeParse({ kind: 'LEADERBOARD_RANK', rank: 1 }).success).toBe(
      false,
    );
  });

  it('applies the default scale to garden items', () => {
    const parsed = gardenItemSchema.parse({
      id: 'sprout',
      type: 'SPROUT',
      name: 'sprout',
      unlockRequirement: { kind: 'CREATIONS_AT_LEAST', count: 1 },
      asset: 'garden.sprout',
      position: { x: 0.5, y: 0.5 },
    });
    expect(parsed.scale).toBe(1);
  });
});
