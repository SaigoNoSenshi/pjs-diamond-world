import { StyleSheet, View } from 'react-native';

import { palette, spacing } from '@/theme';

/** Non-textual progress: one dot per step, filled up to the current one. */
export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current + 1} of ${total}`}
      accessibilityValue={{ min: 0, max: total, now: current + 1 }}
    >
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i < current && styles.done, i === current && styles.active]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center' },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: palette.mist,
    borderWidth: 2,
    borderColor: palette.inkSoft,
  },
  done: { backgroundColor: palette.leaf, borderColor: palette.leaf },
  active: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.sunshine,
    borderColor: palette.ink,
  },
});
