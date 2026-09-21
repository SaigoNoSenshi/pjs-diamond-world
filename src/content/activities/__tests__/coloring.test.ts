import { activityDefinitionSchema } from '@/domain/activity/schema';

import { coloringActivities } from '../coloring';

describe('coloringActivities', () => {
  it('exports exactly 6 activities', () => {
    expect(coloringActivities).toHaveLength(6);
  });

  it('every activity has kind COLORING', () => {
    for (const activity of coloringActivities) {
      expect(activity.kind).toBe('COLORING');
      expect(activity.data.kind).toBe('COLORING');
    }
  });

  it('every activity belongs to the art island', () => {
    for (const activity of coloringActivities) {
      expect(activity.islandId).toBe('art');
    }
  });

  it('all ids are unique', () => {
    const ids = coloringActivities.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  describe('activityDefinitionSchema validation', () => {
    for (const activity of coloringActivities) {
      it(`${activity.id} parses without error`, () => {
        const result = activityDefinitionSchema.safeParse(activity);
        if (!result.success) {
          throw new Error(
            `Schema validation failed for ${activity.id}: ${JSON.stringify(result.error.issues, null, 2)}`,
          );
        }
        expect(result.success).toBe(true);
      });

      it(`${activity.id} has at least 6 regions`, () => {
        const parsed = activityDefinitionSchema.parse(activity);
        if (parsed.data.kind !== 'COLORING') {
          throw new Error(`Expected COLORING kind but got ${parsed.data.kind}`);
        }
        expect(parsed.data.regions.length).toBeGreaterThanOrEqual(6);
      });
    }
  });
});
