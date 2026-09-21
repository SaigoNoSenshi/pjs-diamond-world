import { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

import { IconButton } from '@/components/IconButton';
import { strings } from '@/constants/strings';
import type { ActivityDefinition, TraceData, UnitPoint } from '@/domain/activity/schema';
import { evaluateTrace, glyphStrokePath, strokeStart } from '@/domain/activity/trace';
import { JellySays } from '@/features/learning/components/JellySays';
import { PictureView } from '@/features/learning/components/PictureView';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

import type { EngineProps } from './types';

const GUIDE_WIDTH = 0.075; // fraction of the square
const INK_WIDTH = 0.06;

/**
 * Trace a letter, number or shape. The guide is a dotted grey line with numbered
 * start dots. The child's strokes are kept and re-evaluated after each one; guide
 * strokes turn green as they are covered. Any direction, any speed — coverage counts.
 */
export function TracePlayer({
  activity,
  onComplete,
}: EngineProps<ActivityDefinition & { data: TraceData }>) {
  const data = activity.data;
  const { speak } = useVoice();
  const { play } = useSfx();
  const { width, height } = useWindowDimensions();
  const [size, setSize] = useState(0);
  const [drawn, setDrawn] = useState<UnitPoint[][]>([]);
  const [live, setLive] = useState<UnitPoint[]>([]);
  const liveRef = useRef<UnitPoint[]>([]);
  const sizeRef = useRef(0);
  const done = useRef(false);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  const evaluation = useMemo(
    () => evaluateTrace(data.strokes, drawn, data.tolerance),
    [data.strokes, data.tolerance, drawn],
  );

  useEffect(() => {
    speak(data.sayName);
  }, [data.sayName, speak]);

  useEffect(() => {
    if (evaluation.passed && !done.current) {
      done.current = true;
      play('celebrate');
      if (data.sayExample) speak(data.sayExample);
      const t = setTimeout(() => onComplete(evaluation.overall), 1200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [evaluation.passed, evaluation.overall, onComplete, play, speak, data.sayExample]);

  // Plain responder props (no PanResponder gesture state): works with touch and mouse
  // on every platform and is trivially testable.
  const toUnit = (e: GestureResponderEvent): UnitPoint => {
    const s = sizeRef.current || 1;
    return { x: e.nativeEvent.locationX / s, y: e.nativeEvent.locationY / s };
  };
  const responderProps = {
    onStartShouldSetResponder: () => true,
    onMoveShouldSetResponder: () => true,
    onResponderTerminationRequest: () => false,
    onResponderGrant: (e: GestureResponderEvent) => {
      liveRef.current = [toUnit(e)];
      setLive(liveRef.current);
    },
    onResponderMove: (e: GestureResponderEvent) => {
      liveRef.current = [...liveRef.current, toUnit(e)];
      setLive(liveRef.current);
    },
    onResponderRelease: () => {
      const stroke = liveRef.current;
      liveRef.current = [];
      setLive([]);
      if (stroke.length > 0) setDrawn((d) => [...d, stroke]);
    },
    onResponderTerminate: () => {
      liveRef.current = [];
      setLive([]);
    },
  };

  const onLayout = (e: LayoutChangeEvent) => setSize(Math.floor(e.nativeEvent.layout.width));
  const board = Math.min(width - spacing.lg * 2, height * 0.55, 460);

  const clear = () => {
    play('tap');
    setDrawn([]);
  };

  const inkPath = (pts: readonly UnitPoint[]) =>
    pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(p.x * size).toFixed(1)} ${(p.y * size).toFixed(1)}`)
      .join(' ') +
    (pts.length === 1
      ? ` L ${(pts[0]!.x * size + 0.1).toFixed(1)} ${(pts[0]!.y * size).toFixed(1)}`
      : '');

  return (
    <View style={styles.root} testID="trace-player">
      <JellySays text={data.sayName} compact />
      <View style={styles.row}>
        <View
          onLayout={onLayout}
          style={[styles.board, { width: board, height: board }]}
          accessibilityLabel={`Trace ${data.glyph}`}
          accessibilityHint="Follow the dotted line with your finger"
          testID="trace-canvas"
          {...responderProps}
        >
          {size > 0 ? (
            <Svg width={size} height={size} pointerEvents="none">
              {data.strokes.map((stroke, i) => (
                <Path
                  key={`g${i}`}
                  d={glyphStrokePath(stroke, size)}
                  stroke={(evaluation.perStroke[i] ?? 0) >= 0.8 ? palette.leaf : palette.mist}
                  strokeWidth={size * GUIDE_WIDTH}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...((evaluation.perStroke[i] ?? 0) >= 0.8
                    ? {}
                    : { strokeDasharray: `${size * 0.02} ${size * 0.035}` })}
                  fill="none"
                />
              ))}
              {drawn.map((pts, i) => (
                <Path
                  key={`d${i}`}
                  d={inkPath(pts)}
                  stroke={activity.color}
                  strokeWidth={size * INK_WIDTH}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity={0.9}
                  fill="none"
                />
              ))}
              {live.length > 0 ? (
                <Path
                  d={inkPath(live)}
                  stroke={activity.color}
                  strokeWidth={size * INK_WIDTH}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ) : null}
              {data.strokes.map((stroke, i) =>
                (evaluation.perStroke[i] ?? 0) >= 0.8 ? null : (
                  <StartDot key={`s${i}`} point={strokeStart(stroke)} size={size} index={i + 1} />
                ),
              )}
            </Svg>
          ) : null}
        </View>
        <View style={styles.side}>
          {data.examplePicture ? <PictureView picture={data.examplePicture} size={88} /> : null}
          <Text style={styles.glyph} accessibilityLabel={data.glyph}>
            {data.glyph.length <= 2 ? data.glyph : ''}
          </Text>
          <IconButton
            icon="trash"
            label={strings.learning.clear}
            onPress={clear}
            testID="trace-clear"
          />
        </View>
      </View>
    </View>
  );
}

function StartDot({ point, size, index }: { point: UnitPoint; size: number; index: number }) {
  const r = size * 0.05;
  return (
    <>
      <Circle
        cx={point.x * size}
        cy={point.y * size}
        r={r}
        fill={palette.sunshine}
        stroke={palette.ink}
        strokeWidth={3}
      />
      <SvgText
        x={point.x * size}
        y={point.y * size + r * 0.7}
        fontSize={r * 1.6}
        fontWeight="bold"
        fill={palette.ink}
        textAnchor="middle"
      >
        {String(index)}
      </SvgText>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: spacing.lg, gap: spacing.md },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  board: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.soft,
  },
  side: { alignItems: 'center', gap: spacing.lg, minWidth: 100 },
  glyph: {
    fontFamily: typography.family,
    fontSize: 64,
    lineHeight: 72,
    fontWeight: typography.weight.black,
    color: colors.textSoft,
  },
});
