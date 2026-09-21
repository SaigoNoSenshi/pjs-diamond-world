import { activityDefinitionSchema } from '@/domain/activity/schema';
import { tracingActivities } from '../tracing';

describe('tracingActivities', () => {
  it('exports exactly 42 activities', () => {
    expect(tracingActivities).toHaveLength(42);
  });

  it('has 26 letter activities on the letters island', () => {
    const letters = tracingActivities.filter((a) => a.islandId === 'letters');
    expect(letters).toHaveLength(26);
  });

  it('has 16 number/shape activities on the numbers island', () => {
    const numbers = tracingActivities.filter((a) => a.islandId === 'numbers');
    expect(numbers).toHaveLength(16);
  });

  it('every activity passes activityDefinitionSchema.parse', () => {
    for (const act of tracingActivities) {
      expect(() => activityDefinitionSchema.parse(act)).not.toThrow();
    }
  });

  it('every stroke has ≥2 points and all points are within 0.1..0.9', () => {
    for (const act of tracingActivities) {
      expect(act.data.kind).toBe('TRACE');
      if (act.data.kind !== 'TRACE') continue;
      for (const stroke of act.data.strokes) {
        expect(stroke.points.length).toBeGreaterThanOrEqual(2);
        for (const pt of stroke.points) {
          expect(pt.x).toBeGreaterThanOrEqual(0.1);
          expect(pt.x).toBeLessThanOrEqual(0.9);
          expect(pt.y).toBeGreaterThanOrEqual(0.1);
          expect(pt.y).toBeLessThanOrEqual(0.9);
        }
      }
    }
  });

  it('all ids are unique and match expected pattern', () => {
    const ids = tracingActivities.map((a) => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^act_trace_[a-z0-9_]+$/);
    }
  });

  it('all activities have kind TRACE', () => {
    for (const act of tracingActivities) {
      expect(act.kind).toBe('TRACE');
      expect(act.data.kind).toBe('TRACE');
    }
  });
});
