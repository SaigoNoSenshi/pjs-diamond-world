import type { BrushKind, DrawingElement, Point, StampPlacement, Stroke } from './schema';

/**
 * Pure drawing state machine. UI dispatches actions; this module owns the element
 * list, the in-progress stroke, and undo/redo history. No React, no I/O.
 */

export interface DrawingState {
  elements: readonly DrawingElement[];
  /** Stroke currently being drawn (not yet committed to history). */
  activeStroke: Stroke | null;
  past: readonly (readonly DrawingElement[])[];
  future: readonly (readonly DrawingElement[])[];
  backgroundColor: string;
}

export type DrawingAction =
  | { type: 'LOAD'; elements: readonly DrawingElement[]; backgroundColor?: string }
  | {
      type: 'BEGIN_STROKE';
      id: string;
      kind: BrushKind;
      color: string;
      width: number;
      point: Point;
    }
  | { type: 'EXTEND_STROKE'; point: Point }
  | { type: 'END_STROKE' }
  /** Whole stroke at once — the fast canvases collect points off-React and commit once. */
  | {
      type: 'COMMIT_STROKE';
      id: string;
      kind: BrushKind;
      color: string;
      width: number;
      points: readonly Point[];
    }
  | { type: 'ADD_STAMP'; stamp: StampPlacement }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' };

export const MAX_HISTORY = 50;

export function createDrawingState(backgroundColor = '#FFFFFF'): DrawingState {
  return { elements: [], activeStroke: null, past: [], future: [], backgroundColor };
}

function pushHistory(state: DrawingState, next: readonly DrawingElement[]): DrawingState {
  const past = [...state.past, state.elements].slice(-MAX_HISTORY);
  return { ...state, elements: next, past, future: [] };
}

/** Skip points closer than this (logical px) to keep paths light. */
const MIN_POINT_DISTANCE = 1.5;

export function drawingReducer(state: DrawingState, action: DrawingAction): DrawingState {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        elements: action.elements,
        activeStroke: null,
        past: [],
        future: [],
        backgroundColor: action.backgroundColor ?? state.backgroundColor,
      };
    case 'BEGIN_STROKE':
      return {
        ...state,
        activeStroke: {
          id: action.id,
          kind: action.kind,
          color: action.kind === 'eraser' ? state.backgroundColor : action.color,
          width: action.width,
          points: [action.point],
        },
      };
    case 'EXTEND_STROKE': {
      const stroke = state.activeStroke;
      if (!stroke) return state;
      const last = stroke.points[stroke.points.length - 1];
      if (
        last &&
        Math.hypot(last.x - action.point.x, last.y - action.point.y) < MIN_POINT_DISTANCE
      ) {
        return state;
      }
      return { ...state, activeStroke: { ...stroke, points: [...stroke.points, action.point] } };
    }
    case 'END_STROKE': {
      const stroke = state.activeStroke;
      if (!stroke) return state;
      const committed = pushHistory(state, [...state.elements, { type: 'stroke', stroke }]);
      return { ...committed, activeStroke: null };
    }
    case 'COMMIT_STROKE': {
      const points = thinPoints(action.points);
      if (points.length === 0) return state;
      const stroke: Stroke = {
        id: action.id,
        kind: action.kind,
        color: action.kind === 'eraser' ? state.backgroundColor : action.color,
        width: action.width,
        points,
      };
      const committed = pushHistory(state, [...state.elements, { type: 'stroke', stroke }]);
      return { ...committed, activeStroke: null };
    }
    case 'ADD_STAMP':
      return pushHistory(state, [...state.elements, { type: 'stamp', stamp: action.stamp }]);
    case 'UNDO': {
      const previous = state.past[state.past.length - 1];
      if (!previous) return state;
      return {
        ...state,
        elements: previous,
        past: state.past.slice(0, -1),
        future: [state.elements, ...state.future].slice(0, MAX_HISTORY),
        activeStroke: null,
      };
    }
    case 'REDO': {
      const next = state.future[0];
      if (!next) return state;
      return {
        ...state,
        elements: next,
        past: [...state.past, state.elements].slice(-MAX_HISTORY),
        future: state.future.slice(1),
        activeStroke: null,
      };
    }
    case 'CLEAR':
      if (state.elements.length === 0 && !state.activeStroke) return state;
      return { ...pushHistory(state, []), activeStroke: null };
  }
}

/** Drops samples closer than MIN_POINT_DISTANCE to their predecessor (keeps the first). */
export function thinPoints(points: readonly Point[]): Point[] {
  const out: Point[] = [];
  for (const p of points) {
    const last = out[out.length - 1];
    if (!last || Math.hypot(last.x - p.x, last.y - p.y) >= MIN_POINT_DISTANCE) out.push(p);
  }
  return out;
}

export const canUndo = (s: DrawingState): boolean => s.past.length > 0;
export const canRedo = (s: DrawingState): boolean => s.future.length > 0;
export const isEmpty = (s: DrawingState): boolean => s.elements.length === 0 && !s.activeStroke;
