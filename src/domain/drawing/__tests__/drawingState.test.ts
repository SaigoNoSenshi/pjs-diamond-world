import {
  canRedo,
  canUndo,
  createDrawingState,
  drawingReducer,
  isEmpty,
  type DrawingState,
} from '../drawingState';

const begin = (s: DrawingState, id = 's1', kind: 'brush' | 'crayon' | 'eraser' = 'brush') =>
  drawingReducer(s, {
    type: 'BEGIN_STROKE',
    id,
    kind,
    color: '#FF0000',
    width: 10,
    point: { x: 0, y: 0 },
  });

describe('drawingReducer', () => {
  it('begins, extends and commits a stroke with undo/redo history', () => {
    let s = createDrawingState();
    s = begin(s);
    s = drawingReducer(s, { type: 'EXTEND_STROKE', point: { x: 10, y: 10 } });
    s = drawingReducer(s, { type: 'EXTEND_STROKE', point: { x: 10.5, y: 10.5 } }); // too close, ignored
    expect(s.activeStroke?.points).toHaveLength(2);
    s = drawingReducer(s, { type: 'END_STROKE' });
    expect(s.activeStroke).toBeNull();
    expect(s.elements).toHaveLength(1);
    expect(canUndo(s)).toBe(true);
    expect(canRedo(s)).toBe(false);

    s = drawingReducer(s, { type: 'UNDO' });
    expect(s.elements).toHaveLength(0);
    expect(canRedo(s)).toBe(true);
    s = drawingReducer(s, { type: 'REDO' });
    expect(s.elements).toHaveLength(1);
  });

  it('uses the background colour for eraser strokes', () => {
    const s = begin(createDrawingState('#ABCDEF'), 'e1', 'eraser');
    expect(s.activeStroke?.color).toBe('#ABCDEF');
  });

  it('adds stamps and clears with an undoable history entry', () => {
    let s = createDrawingState();
    s = drawingReducer(s, {
      type: 'ADD_STAMP',
      stamp: { id: 'st1', stampId: 'star', x: 50, y: 50, size: 96, color: '#FFD93D' },
    });
    expect(s.elements[0]?.type).toBe('stamp');
    s = drawingReducer(s, { type: 'CLEAR' });
    expect(isEmpty(s)).toBe(true);
    s = drawingReducer(s, { type: 'UNDO' });
    expect(s.elements).toHaveLength(1);
  });

  it('a new action after undo discards the redo stack', () => {
    let s = createDrawingState();
    s = drawingReducer(begin(s, 'a'), { type: 'END_STROKE' });
    s = drawingReducer(begin(s, 'b'), { type: 'END_STROKE' });
    s = drawingReducer(s, { type: 'UNDO' });
    expect(canRedo(s)).toBe(true);
    s = drawingReducer(begin(s, 'c'), { type: 'END_STROKE' });
    expect(canRedo(s)).toBe(false);
    expect(s.elements.map((e) => (e.type === 'stroke' ? e.stroke.id : ''))).toEqual(['a', 'c']);
  });

  it('LOAD replaces elements and resets history', () => {
    let s = drawingReducer(begin(createDrawingState(), 'a'), { type: 'END_STROKE' });
    s = drawingReducer(s, { type: 'LOAD', elements: [], backgroundColor: '#FFFFFF' });
    expect(isEmpty(s)).toBe(true);
    expect(canUndo(s)).toBe(false);
  });
});
