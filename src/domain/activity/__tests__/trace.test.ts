import { coverage, distanceToPolyline, evaluateTrace, resample } from '../trace';

const line = {
  points: [
    { x: 0.1, y: 0.5 },
    { x: 0.9, y: 0.5 },
  ],
};

describe('trace geometry', () => {
  it('resamples evenly', () => {
    const pts = resample(line.points, 0.1);
    expect(pts.length).toBeGreaterThanOrEqual(9);
    expect(pts[0]).toEqual({ x: 0.1, y: 0.5 });
    expect(pts[pts.length - 1]!.x).toBeCloseTo(0.9);
    expect(pts[pts.length - 1]!.y).toBeCloseTo(0.5);
  });

  it('measures distance to a polyline', () => {
    expect(distanceToPolyline({ x: 0.5, y: 0.6 }, line.points)).toBeCloseTo(0.1);
    expect(distanceToPolyline({ x: 0.0, y: 0.5 }, line.points)).toBeCloseTo(0.1);
  });

  it('passes a wobbly but close trace and fails a stroke elsewhere', () => {
    const wobbly = Array.from({ length: 40 }, (_, i) => ({
      x: 0.1 + (0.8 * i) / 39,
      y: 0.5 + (i % 2 ? 0.04 : -0.04),
    }));
    expect(coverage(line, [wobbly], 0.09)).toBeGreaterThan(0.95);
    const elsewhere = [
      { x: 0.1, y: 0.1 },
      { x: 0.9, y: 0.1 },
    ];
    expect(coverage(line, [elsewhere], 0.09)).toBe(0);
    const half = [
      { x: 0.1, y: 0.5 },
      { x: 0.5, y: 0.5 },
    ];
    const c = coverage(line, [half], 0.09);
    expect(c).toBeGreaterThan(0.4);
    expect(c).toBeLessThan(0.7);
  });

  it('evaluates all strokes and requires each to be covered', () => {
    const glyph = [
      line,
      {
        points: [
          { x: 0.5, y: 0.1 },
          { x: 0.5, y: 0.9 },
        ],
      },
    ];
    const drawnBoth = [
      [
        { x: 0.1, y: 0.5 },
        { x: 0.9, y: 0.5 },
      ],
      [
        { x: 0.5, y: 0.1 },
        { x: 0.5, y: 0.9 },
      ],
    ];
    expect(evaluateTrace(glyph, drawnBoth, 0.09).passed).toBe(true);
    const drawnOne = [
      [
        { x: 0.1, y: 0.5 },
        { x: 0.9, y: 0.5 },
      ],
    ];
    const partial = evaluateTrace(glyph, drawnOne, 0.09);
    expect(partial.passed).toBe(false);
    expect(partial.perStroke[0]).toBeGreaterThan(0.9);
    expect(partial.perStroke[1]).toBeLessThan(0.3);
  });
});
