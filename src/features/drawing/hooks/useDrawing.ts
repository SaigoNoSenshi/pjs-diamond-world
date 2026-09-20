import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { layout } from '@/constants/layout';
import {
  canRedo,
  canUndo,
  createDrawingState,
  drawingReducer,
  isEmpty,
  type DrawingState,
} from '@/domain/drawing/drawingState';
import type { BrushKind, Point } from '@/domain/drawing/schema';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { drawingColors } from '@/theme';
import { createId } from '@/utils/ids';
import { nowIso } from '@/utils/time';

export type DrawingTool = BrushKind | 'stamp';

const BRUSH_WIDTH: Record<BrushKind, number> = { brush: 10, crayon: 18, eraser: 36 };
const STAMP_SIZE = 96;

/**
 * Drawing session: tool/colour selection, the pure reducer, and draft autosave
 * (every few seconds, on background, and on unmount) so leaving never loses work.
 */
export function useDrawing() {
  const { repositories, logger } = useAppServices();
  const { profile } = useProfile();
  const childId = profile.id;

  const [state, dispatch] = useReducer(drawingReducer, undefined, () =>
    createDrawingState('#FFFFFF'),
  );
  const [tool, setTool] = useState<DrawingTool>('brush');
  const [color, setColor] = useState<string>(drawingColors[0].hex);
  const [stampId, setStampId] = useState<string>('star');
  const [loaded, setLoaded] = useState(false);

  const stateRef = useRef<DrawingState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const dirty = useRef(false);
  const draftId = useRef(createId('drf'));

  // Restore an unfinished drawing.
  useEffect(() => {
    let mounted = true;
    repositories.drafts
      .getCurrent(childId)
      .then((draft) => {
        if (!mounted) return;
        // Never overwrite strokes PJ made while the draft was still loading.
        if (draft && draft.elements.length > 0 && isEmpty(stateRef.current)) {
          draftId.current = draft.id;
          dispatch({
            type: 'LOAD',
            elements: draft.elements,
            backgroundColor: draft.backgroundColor,
          });
        }
      })
      .catch((error: unknown) => logger.warn('draft restore failed', { error: String(error) }))
      .finally(() => {
        if (mounted) setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, [repositories.drafts, childId, logger]);

  const persistDraft = useCallback(async () => {
    if (!dirty.current) return;
    const current = stateRef.current;
    dirty.current = false;
    try {
      if (isEmpty(current)) {
        await repositories.drafts.clear(childId);
      } else {
        await repositories.drafts.save({
          id: draftId.current,
          childId,
          elements: [...current.elements],
          backgroundColor: current.backgroundColor,
          updatedAt: nowIso(),
        });
      }
    } catch (error) {
      dirty.current = true;
      logger.warn('draft autosave failed', { error: String(error) });
    }
  }, [repositories.drafts, childId, logger]);

  // Periodic autosave + save when the app goes to background + on unmount.
  useEffect(() => {
    const interval = setInterval(() => void persistDraft(), layout.draftAutosaveMs);
    const sub = AppState.addEventListener('change', (next) => {
      if (next !== 'active') void persistDraft();
    });
    return () => {
      clearInterval(interval);
      sub.remove();
      void persistDraft();
    };
  }, [persistDraft]);

  const markDirty = () => {
    dirty.current = true;
  };

  const beginAt = useCallback(
    (point: Point) => {
      if (tool === 'stamp') {
        dispatch({
          type: 'ADD_STAMP',
          stamp: { id: createId('drf'), stampId, x: point.x, y: point.y, size: STAMP_SIZE, color },
        });
        markDirty();
        return;
      }
      dispatch({
        type: 'BEGIN_STROKE',
        id: createId('drf'),
        kind: tool,
        color,
        width: BRUSH_WIDTH[tool],
        point,
      });
    },
    [tool, stampId, color],
  );

  const moveTo = useCallback(
    (point: Point) => {
      if (tool === 'stamp') return;
      dispatch({ type: 'EXTEND_STROKE', point });
    },
    [tool],
  );

  const end = useCallback(() => {
    if (tool === 'stamp') return;
    dispatch({ type: 'END_STROKE' });
    markDirty();
  }, [tool]);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
    markDirty();
  }, []);
  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
    markDirty();
  }, []);
  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
    markDirty();
  }, []);

  /** After a successful save the draft is gone; start fresh. */
  const reset = useCallback(() => {
    draftId.current = createId('drf');
    dispatch({ type: 'LOAD', elements: [] });
    dirty.current = false;
  }, []);

  return {
    state,
    loaded,
    tool,
    setTool,
    color,
    setColor,
    stampId,
    setStampId,
    beginAt,
    moveTo,
    end,
    undo,
    redo,
    clear,
    reset,
    canUndo: canUndo(state),
    canRedo: canRedo(state),
    isEmpty: isEmpty(state),
  };
}

export type DrawingSession = ReturnType<typeof useDrawing>;
