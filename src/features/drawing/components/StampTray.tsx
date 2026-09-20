import { ScrollView, StyleSheet } from 'react-native';

import { IconButton } from '@/components/IconButton';
import { allStamps } from '@/content/stamps';
import { colors, spacing, touch } from '@/theme';

export interface StampTrayProps {
  selected: string;
  color: string;
  onSelect: (stampId: string) => void;
}

/** Stamp picker. Stamps preview in the current drawing colour. */
export function StampTray({ selected, color, onSelect }: StampTrayProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityLabel="Stamps"
    >
      {allStamps.map((stamp) => (
        <IconButton
          key={stamp.id}
          icon={stamp.icon}
          label={stamp.label}
          iconColor={color}
          color={colors.surface}
          size={touch.comfortable}
          selected={stamp.id === selected}
          speak
          onPress={() => onSelect(stamp.id)}
          testID={`stamp-${stamp.id}`}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
});
