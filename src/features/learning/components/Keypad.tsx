import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icons/Icon';
import { useSfx } from '@/hooks/useSfx';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

/**
 * Big-key number pad for typed answers (Grade 3+). Digits, minus (when allowed),
 * a decimal point (when allowed), backspace and a green Check.
 */
export function Keypad({
  value,
  onChange,
  onCheck,
  allowNegative = false,
  allowDecimal = false,
  maxLength = 6,
  disabled = false,
}: {
  value: string;
  onChange: (next: string) => void;
  onCheck: () => void;
  allowNegative?: boolean;
  allowDecimal?: boolean;
  maxLength?: number;
  disabled?: boolean;
}) {
  const { play } = useSfx();
  const tap = (key: string) => {
    if (disabled) return;
    play('tap');
    if (key === '⌫') return onChange(value.slice(0, -1));
    if (key === '−') return onChange(value.startsWith('-') ? value.slice(1) : `-${value}`);
    if (key === '.') return onChange(value.includes('.') ? value : `${value || '0'}.`);
    if (value.replace('-', '').length >= maxLength) return;
    onChange(value === '0' ? key : value + key);
  };
  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [allowNegative ? '−' : allowDecimal ? '.' : '', '0', '⌫'],
  ];
  return (
    <View style={styles.root} testID="keypad">
      <View
        style={styles.display}
        accessibilityRole="text"
        accessibilityLabel={value || 'empty'}
        testID="keypad-display"
      >
        <Text style={styles.displayText}>{value || ' '}</Text>
      </View>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((k, j) =>
            k === '' ? (
              <View key={j} style={styles.spacer} />
            ) : (
              <Pressable
                key={k}
                accessibilityRole="button"
                accessibilityLabel={k === '⌫' ? 'Delete' : k === '−' ? 'Minus' : k}
                onPress={() => tap(k)}
                disabled={disabled}
                style={({ pressed }) => [styles.key, pressed && styles.pressed]}
                testID={`key-${k === '⌫' ? 'back' : k === '−' ? 'minus' : k === '.' ? 'dot' : k}`}
              >
                {k === '⌫' ? (
                  <Icon name="back" size={28} />
                ) : (
                  <Text style={styles.keyText}>{k}</Text>
                )}
              </Pressable>
            ),
          )}
        </View>
      ))}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Check"
        onPress={() => {
          if (!disabled && value !== '' && value !== '-') onCheck();
        }}
        disabled={disabled || value === '' || value === '-'}
        style={({ pressed }) => [
          styles.check,
          (disabled || value === '') && styles.checkDisabled,
          pressed && styles.pressed,
        ]}
        testID="key-check"
      >
        <Icon name="check" size={30} color={palette.white} stroke={palette.white} />
        <Text style={styles.checkText}>Check</Text>
      </Pressable>
    </View>
  );
}

const KEY = 64;

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: spacing.sm },
  display: {
    minWidth: KEY * 3 + spacing.sm * 2,
    minHeight: 60,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 3,
    borderColor: palette.mist,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  displayText: {
    fontFamily: typography.family,
    fontSize: 36,
    fontWeight: typography.weight.black,
    color: colors.text,
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  key: {
    width: KEY,
    height: KEY,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  spacer: { width: KEY, height: KEY },
  pressed: { transform: [{ scale: 0.94 }] },
  keyText: {
    fontFamily: typography.family,
    fontSize: 28,
    fontWeight: typography.weight.black,
    color: colors.text,
  },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 56,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    backgroundColor: palette.leaf,
    marginTop: spacing.xs,
    ...shadows.soft,
  },
  checkDisabled: { opacity: 0.45 },
  checkText: {
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.black,
    color: palette.white,
  },
});
