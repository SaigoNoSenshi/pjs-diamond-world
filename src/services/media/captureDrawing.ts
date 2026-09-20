import type { RefObject } from 'react';
import type { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import type { CanvasCapture } from '@/features/drawing/saveDrawing';

export interface CaptureDrawingOptions {
  /** Logical size of the canvas on screen. */
  width: number;
  height: number;
  backgroundColor: string;
  /** When set, the capture is scaled so its width equals this (thumbnails). */
  targetWidth?: number;
}

/**
 * Native: rasterise the canvas container with react-native-view-shot.
 * (The web build uses captureDrawing.web.ts, which serialises the SVG itself.)
 */
export async function captureDrawing(
  ref: RefObject<View | null>,
  options: CaptureDrawingOptions,
): Promise<CanvasCapture> {
  const size = options.targetWidth
    ? {
        width: options.targetWidth,
        height: Math.max(
          1,
          Math.round((options.targetWidth * options.height) / Math.max(1, options.width)),
        ),
      }
    : {};
  const uri = await captureRef(ref, { format: 'png', quality: 1, result: 'tmpfile', ...size });
  return { kind: 'uri', uri };
}
