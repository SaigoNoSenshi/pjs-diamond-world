import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Icon } from '@/components/icons/Icon';
import { useSfx } from '@/hooks/useSfx';
import { drawingColors, palette, spacing, touch } from '@/theme';

export interface ColorPaletteProps {
  selected: string;
  onSelect: (hex: string) => void;
  horizontal?: boolean;
  size?: number;
}

/** Nine big colour circles. Selection shows a ring and a check mark, never colour alone. */
export function ColorPalette({
  selected,
  onSelect,
  horizontal = true,
  size = touch.comfortable,
}: ColorPaletteProps) {
  const { play } = useSfx();
  const { width } = useWindowDimensions();
  // Narrow phones: slightly smaller circles that wrap onto two rows — every colour stays visible.
  const swatch = width < 520 ? Math.min(size, 56) : size;
  return (
    <View
      style={[styles.row, !horizontal && styles.column]}
      accessibilityRole="radiogroup"
      accessibilityLabel="Colors"
    >
      {drawingColors.map((c) => {
        const isSelected = c.hex === selected;
        const isLight = c.id === 'white' || c.id === 'yellow';
        return (
          <Pressable
            key={c.id}
            accessibilityRole="radio"
            accessibilityLabel={c.label}
            accessibilityState={{ selected: isSelected }}
            onPress={() => {
              play('tap');
              onSelect(c.hex);
            }}
            hitSlop={4}
            testID={`color-${c.id}`}
            style={({ pressed }) => [
              styles.swatch,
              { width: swatch, height: swatch, borderRadius: swatch / 2, backgroundColor: c.hex },
              c.id === 'white' && styles.whiteBorder,
              isSelected && styles.selected,
              pressed && styles.pressed,
            ]}
          >
            {isSelected ? (
              <View style={styles.check}>
                <Icon
                  name="check"
                  size={swatch * 0.5}
                  color={isLight ? palette.ink : palette.white}
                  stroke={isLight ? palette.ink : palette.white}
                />
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  column: { flexDirection: 'column', paddingVertical: spacing.md },
  swatch: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(45,49,66,0.15)',
  },
  whiteBorder: { borderColor: palette.mist },
  selected: { borderWidth: 5, borderColor: palette.ink, transform: [{ scale: 1.1 }] },
  pressed: { transform: [{ scale: 0.92 }] },
  check: { alignItems: 'center', justifyContent: 'center' },
});
