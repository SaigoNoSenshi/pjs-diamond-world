import { forwardRef, memo, useMemo } from 'react';
import { PanResponder, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Icon } from '@/components/icons/Icon';
import { findStamp } from '@/content/stamps';
import type { DrawingState } from '@/domain/drawing/drawingState';
import type { DrawingElement, Point, StampPlacement, Stroke } from '@/domain/drawing/schema';
import { pointsToSvgPath } from '@/domain/drawing/svgPath';

export interface DrawingCanvasProps {
  state: DrawingState;
  onBegin: (point: Point) => void;
  onMove: (point: Point) => void;
  onEnd: () => void;
  onLayout?: (size: { width: number; height: number }) => void;
}

function StrokePath({ stroke }: { stroke: Stroke }) {
  const d = useMemo(() => pointsToSvgPath(stroke.points), [stroke.points]);
  return (
    <Path
      d={d}
      stroke={stroke.color}
      strokeWidth={stroke.width}
      strokeOpacity={stroke.kind === 'crayon' ? 0.75 : 1}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

/** Committed strokes only re-render when the element list changes. */
const CommittedStrokes = memo(function CommittedStrokes({
  elements,
}: {
  elements: readonly DrawingElement[];
}) {
  return (
    <>
      {elements.map((el) =>
        el.type === 'stroke' ? <StrokePath key={el.stroke.id} stroke={el.stroke} /> : null,
      )}
    </>
  );
});

function StampView({ stamp }: { stamp: StampPlacement }) {
  const def = findStamp(stamp.stampId);
  if (!def) return null;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: stamp.x - stamp.size / 2,
        top: stamp.y - stamp.size / 2,
        width: stamp.size,
        height: stamp.size,
      }}
    >
      <Icon name={def.icon} size={stamp.size} color={stamp.color} />
    </View>
  );
}

const Stamps = memo(function Stamps({ elements }: { elements: readonly DrawingElement[] }) {
  return (
    <>
      {elements.map((el) =>
        el.type === 'stamp' ? <StampView key={el.stamp.id} stamp={el.stamp} /> : null,
      )}
    </>
  );
});

/**
 * SVG drawing surface. Uses PanResponder (works with touch and mouse on web).
 * The ref points at the capture container so view-shot includes stamps.
 */
export const DrawingCanvas = forwardRef<View, DrawingCanvasProps>(function DrawingCanvas(
  { state, onBegin, onMove, onEnd, onLayout },
  ref,
) {
  // Rebuilt when the callbacks change (tool/colour switches); PanResponder creation is cheap.
  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          onBegin({ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY });
        },
        onPanResponderMove: (e) => {
          onMove({ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY });
        },
        onPanResponderRelease: () => onEnd(),
        onPanResponderTerminate: () => onEnd(),
      }),
    [onBegin, onMove, onEnd],
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    onLayout?.({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height });
  };

  return (
    <View
      ref={ref}
      collapsable={false}
      onLayout={handleLayout}
      style={[styles.canvas, { backgroundColor: state.backgroundColor }]}
      accessibilityLabel="Drawing canvas"
      accessibilityHint="Draw with your finger"
      testID="drawing-canvas"
      {...responder.panHandlers}
    >
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none" id="stroke-layer">
        <CommittedStrokes elements={state.elements} />
        {state.activeStroke ? <StrokePath stroke={state.activeStroke} /> : null}
      </Svg>
      <Stamps elements={state.elements} />
    </View>
  );
});

const styles = StyleSheet.create({
  canvas: { flex: 1, overflow: 'hidden' },
});
