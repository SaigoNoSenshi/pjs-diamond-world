import { creationSchema, matchesFilter, type Creation } from '../schema';

const base: Creation = {
  id: 'cre_1',
  childId: 'chd_default',
  type: 'DRAWING',
  title: "PJ's Yellow Star",
  thumbnailUri: 'file:///thumb.png',
  assetUri: 'file:///asset.png',
  createdAt: '2026-09-14T00:00:00.000Z',
  updatedAt: '2026-09-14T00:00:00.000Z',
  favorite: false,
  metadata: {},
};

describe('creationSchema', () => {
  it('accepts a valid creation', () => {
    expect(creationSchema.safeParse(base).success).toBe(true);
  });

  it('rejects an empty title and bad timestamps', () => {
    expect(creationSchema.safeParse({ ...base, title: '' }).success).toBe(false);
    expect(creationSchema.safeParse({ ...base, createdAt: 'yesterday' }).success).toBe(false);
  });

  it('rejects unknown creation types', () => {
    expect(creationSchema.safeParse({ ...base, type: 'VIDEO' }).success).toBe(false);
  });
});

describe('matchesFilter', () => {
  it('filters by type and favourite', () => {
    const craft: Creation = { ...base, id: 'cre_2', type: 'CRAFT', favorite: true };
    expect(matchesFilter(base, 'ALL')).toBe(true);
    expect(matchesFilter(base, 'DRAWINGS')).toBe(true);
    expect(matchesFilter(base, 'CRAFTS')).toBe(false);
    expect(matchesFilter(craft, 'CRAFTS')).toBe(true);
    expect(matchesFilter(craft, 'FAVORITES')).toBe(true);
    expect(matchesFilter(base, 'FAVORITES')).toBe(false);
  });
});
