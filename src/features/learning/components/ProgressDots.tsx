import { StyleSheet, View } from 'react-native';

import { palette, spacing } from '@/theme';

/** Round progress dots: filled = done, ring = current, faint = ahead. No numbers. */
export function ProgressDots({
  total,
  done,
  color = palette.aqua,
}: {
  total: number;
  done: number;
  color?: string;
}) {
  return (
    <View style={styles.row} accessibilityLabel={`${done} of ${total}`} testID="progress-dots">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < done
              ? { backgroundColor: color }
              : i === done
                ? { borderColor: color }
                : styles.ahead,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', alignItems: 'center' },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 3, borderColor: 'transparent' },
  ahead: { backgroundColor: palette.mist },
});
