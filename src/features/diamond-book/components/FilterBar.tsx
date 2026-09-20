import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Icon, type IconName } from '@/components/icons/Icon';
import { strings } from '@/constants/strings';
import type { CreationFilter } from '@/domain/creation/schema';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, spacing, touch, typography } from '@/theme';

const FILTERS: readonly { id: CreationFilter; label: string; icon: IconName; color: string }[] = [
  { id: 'ALL', label: strings.book.all, icon: 'book', color: palette.sunshine },
  { id: 'DRAWINGS', label: strings.book.drawings, icon: 'paintbrush', color: palette.aqua },
  { id: 'CRAFTS', label: strings.book.crafts, icon: 'clay', color: palette.lavender },
  { id: 'FAVORITES', label: strings.book.favorites, icon: 'heart', color: palette.blossom },
];

/** Four big icon pills. Selected pill is raised and ringed, and its label is spoken. */
export function FilterBar({
  value,
  onChange,
}: {
  value: CreationFilter;
  onChange: (f: CreationFilter) => void;
}) {
  const { play } = useSfx();
  const { speak } = useVoice();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
    >
      {FILTERS.map((f) => {
        const selected = f.id === value;
        return (
          <Pressable
            key={f.id}
            accessibilityRole="tab"
            accessibilityLabel={f.label}
            accessibilityState={{ selected }}
            onPress={() => {
              play('tap');
              speak(f.label);
              onChange(f.id);
            }}
            testID={`filter-${f.id}`}
            style={({ pressed }) => [
              styles.pill,
              { backgroundColor: selected ? f.color : colors.surface },
              selected && styles.selected,
              pressed && styles.pressed,
            ]}
          >
            <Icon name={f.icon} size={30} color={selected ? palette.ink : f.color} />
            <Text style={styles.label}>{f.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: touch.comfortable,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selected: { borderColor: palette.ink },
  pressed: { transform: [{ scale: 0.96 }] },
  label: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
});
