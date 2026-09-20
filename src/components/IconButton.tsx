import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, touch } from '@/theme';

import { Icon, type IconName } from './icons/Icon';

export interface IconButtonProps {
  icon: IconName;
  /** Accessibility label; also spoken on press when `speak` is true. */
  label: string;
  onPress: () => void;
  color?: string;
  iconColor?: string;
  size?: number;
  selected?: boolean;
  disabled?: boolean;
  speak?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Round icon-only button. Default 64px, never below 48px. Selected state uses a ring, not colour alone. */
export function IconButton({
  icon,
  label,
  onPress,
  color = colors.surface,
  iconColor = palette.ink,
  size = touch.comfortable,
  selected = false,
  disabled = false,
  speak = false,
  style,
  testID,
}: IconButtonProps) {
  const { play } = useSfx();
  const { speak: say } = useVoice();
  const dimension = Math.max(touch.min, size);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      hitSlop={6}
      testID={testID}
      onPress={() => {
        play('tap');
        if (speak) say(label);
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { width: dimension, height: dimension, borderRadius: radii.pill, backgroundColor: color },
        selected && styles.selected,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Icon name={icon} size={Math.round(dimension * 0.55)} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center', ...shadows.soft },
  selected: { borderWidth: 5, borderColor: palette.ink },
  pressed: { transform: [{ scale: 0.92 }] },
  disabled: { opacity: 0.4 },
});
