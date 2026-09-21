import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/icons/Icon';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { palette } from '@/theme';

interface Decor {
  id: string;
  icon: IconName;
  color: string;
  name: string;
  x: number;
  y: number;
  size: number;
}

const DECOR: Decor[] = [
  {
    id: 'fish',
    icon: 'fish',
    color: palette.tangerine,
    name: 'A fish!',
    x: 0.06,
    y: 0.5,
    size: 56,
  },
  {
    id: 'starfish',
    icon: 'starfish',
    color: palette.coral,
    name: 'A starfish!',
    x: 0.95,
    y: 0.42,
    size: 52,
  },
  {
    id: 'shell',
    icon: 'shell',
    color: palette.blossom,
    name: 'A seashell!',
    x: 0.62,
    y: 0.97,
    size: 46,
  },
  {
    id: 'crab',
    icon: 'crab',
    color: palette.coral,
    name: 'A crab! Click click.',
    x: 0.42,
    y: 0.97,
    size: 50,
  },
  {
    id: 'bird',
    icon: 'bird',
    color: palette.sea,
    name: 'A bird! Tweet tweet.',
    x: 0.62,
    y: 0.06,
    size: 46,
  },
];

/** Little things on the island that react when tapped: a bounce, a sound, a word. */
export function ReactiveDecor({
  width,
  height,
  night,
}: {
  width: number;
  height: number;
  night: boolean;
}) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {DECOR.map((d) => (
        <DecorItem key={d.id} decor={d} x={d.x * width} y={d.y * height} dim={night} />
      ))}
      {night ? (
        <View
          style={[styles.moon, { left: width * 0.08, top: height * 0.05 }]}
          pointerEvents="none"
        >
          <Icon name="moon" size={64} color={palette.cream} stroke={palette.cream} />
        </View>
      ) : null}
    </View>
  );
}

function DecorItem({ decor, x, y, dim }: { decor: Decor; x: number; y: number; dim: boolean }) {
  const { play } = useSfx();
  const { speak } = useVoice();
  const scale = useSharedValue(1);
  const lift = useSharedValue(0);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }, { translateY: lift.get() }],
  }));
  const poke = () => {
    play('bubble');
    speak(decor.name);
    scale.set(withSequence(withTiming(1.35, { duration: 120 }), withSpring(1, { damping: 8 })));
    lift.set(withSequence(withTiming(-24, { duration: 160 }), withSpring(0, { damping: 9 })));
  };
  return (
    <Animated.View
      style={[styles.item, { left: x - decor.size / 2, top: y - decor.size / 2 }, animated]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={decor.name}
        onPress={poke}
        hitSlop={10}
        style={dim && styles.dim}
        testID={`decor-${decor.id}`}
      >
        <Icon name={decor.icon} size={decor.size} color={decor.color} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: { position: 'absolute' },
  dim: { opacity: 0.75 },
  moon: { position: 'absolute' },
});
