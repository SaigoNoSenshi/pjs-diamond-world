import { summarizeDrawing } from '../analysis';
import type { DrawingElement } from '../schema';
import { pointsToSvgPath, strokeLength } from '../svgPath';

describe('pointsToSvgPath', () => {
  it('renders a dot for a single point and smooth curves for many', () => {
    expect(pointsToSvgPath([])).toBe('');
    expect(pointsToSvgPath([{ x: 5, y: 5 }])).toMatch(/^M 5 5 L/);
    const d = pointsToSvgPath([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ]);
    expect(d).toBe('M 0 0 Q 10 0 10 5 L 10 10');
  });

  it('measures stroke length', () => {
    expect(strokeLength([{ x: 0, y: 0 }])).toBe(1);
    expect(
      strokeLength([
        { x: 0, y: 0 },
        { x: 3, y: 4 },
      ]),
    ).toBe(5);
  });
});

describe('summarizeDrawing', () => {
  it('finds the dominant colour by ink and lists stamps, ignoring eraser strokes', () => {
    const elements: DrawingElement[] = [
      {
        type: 'stroke',
        stroke: {
          id: 'a',
          kind: 'brush',
          color: '#FFD93D',
          width: 10,
          points: [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
          ],
        },
      },
      {
        type: 'stroke',
        stroke: {
          id: 'b',
          kind: 'brush',
          color: '#2E86DE',
          width: 10,
          points: [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
          ],
        },
      },
      {
        type: 'stroke',
        stroke: {
          id: 'e',
          kind: 'eraser',
          color: '#FFFFFF',
          width: 40,
          points: [
            { x: 0, y: 0 },
            { x: 500, y: 0 },
          ],
        },
      },
      {
        type: 'stamp',
        stamp: { id: 's1', stampId: 'star', x: 0, y: 0, size: 20, color: '#2E86DE' },
      },
      {
        type: 'stamp',
        stamp: { id: 's2', stampId: 'star', x: 0, y: 0, size: 20, color: '#2E86DE' },
      },
    ];
    const summary = summarizeDrawing(elements);
    expect(summary.dominantColor).toBe('#FFD93D');
    expect(summary.stamps).toEqual(['star']);
    expect(summary.strokeCount).toBe(3);
    expect(summary.stampCount).toBe(2);
  });

  it('returns null colour for an empty drawing', () => {
    expect(summarizeDrawing([]).dominantColor).toBeNull();
  });
});
