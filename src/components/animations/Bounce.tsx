import { useMemo, type PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { css } from 'react-native-reanimated';

import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Gentle idle bounce for characters. Disabled under reduced motion.
 *
 * Implemented as a Reanimated CSS animation: on web this becomes a real CSS keyframe
 * animation on the compositor (zero JavaScript per frame), on native it runs on the UI
 * thread. The previous shared-value loop cost a style write per frame per character.
 */
export function Bounce({
  amplitude = 8,
  duration = 1400,
  style,
  children,
}: PropsWithChildren<{ amplitude?: number; duration?: number; style?: StyleProp<ViewStyle> }>) {
  const reduced = useReducedMotion();
  const bounce = useMemo(
    () =>
      css.keyframes({
        from: { transform: [{ translateY: 0 }] },
        '50%': { transform: [{ translateY: -amplitude }] },
        to: { transform: [{ translateY: 0 }] },
      }),
    [amplitude],
  );

  return (
    <Animated.View
      style={[
        reduced
          ? null
          : {
              animationName: bounce,
              animationDuration: duration,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
            },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
