import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icons/Icon';
import { strings } from '@/constants/strings';
import { colors, palette, radii, spacing, typography } from '@/theme';

/** Small pill showing the child's diamonds. Informational only — never a score to beat. */
export function DiamondCounter({
  count,
  testID = 'diamond-counter',
}: {
  count: number;
  testID?: string;
}) {
  return (
    <View
      style={styles.pill}
      accessibilityLabel={`${count} ${strings.learning.diamonds}`}
      accessibilityRole="text"
      testID={testID}
    >
      <Icon name="diamond" size={26} color={palette.aqua} />
      <Text style={styles.text}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingLeft: spacing.sm,
    paddingRight: spacing.md,
    minHeight: 40,
  },
  text: {
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.black,
    color: colors.text,
  },
});
