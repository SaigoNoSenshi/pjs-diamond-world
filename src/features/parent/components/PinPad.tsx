import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PIN_LENGTH } from '@/domain/profile/parentGate';
import { colors, palette, radii, spacing, touch, typography } from '@/theme';

/** Four-digit PIN pad with big keys. Calls onComplete when four digits are entered. */
export function PinPad({
  onComplete,
  error,
}: {
  onComplete: (pin: string) => void;
  error?: string | undefined;
}) {
  const [digits, setDigits] = useState('');

  const press = (d: string) => {
    const next = (digits + d).slice(0, PIN_LENGTH);
    setDigits(next);
    if (next.length === PIN_LENGTH) {
      onComplete(next);
      setDigits('');
    }
  };

  return (
    <View style={styles.root}>
      <View
        style={styles.dots}
        accessibilityLabel={`${digits.length} of ${PIN_LENGTH} digits entered`}
      >
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <View key={i} style={[styles.dot, i < digits.length && styles.dotFilled]} />
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.grid}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key, i) => (
          <Pressable
            key={`${key}-${i}`}
            accessibilityRole="button"
            accessibilityLabel={key === '⌫' ? 'Delete' : key || 'blank'}
            disabled={key === ''}
            onPress={() => (key === '⌫' ? setDigits((d) => d.slice(0, -1)) : press(key))}
            style={({ pressed }) => [
              styles.key,
              key === '' && styles.keyBlank,
              pressed && styles.pressed,
            ]}
            testID={key === '⌫' ? 'pin-delete' : key ? `pin-${key}` : undefined}
          >
            <Text style={styles.keyText}>{key}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', gap: spacing.lg },
  dots: { flexDirection: 'row', gap: spacing.md },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: palette.ink },
  dotFilled: { backgroundColor: palette.ink },
  error: { fontFamily: typography.family, color: palette.coral, fontSize: typography.size.body },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 3 * (touch.primary * 0.8 + spacing.md),
    gap: spacing.md,
    justifyContent: 'center',
  },
  key: {
    width: touch.primary * 0.8,
    height: touch.primary * 0.8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyBlank: { backgroundColor: 'transparent' },
  pressed: { transform: [{ scale: 0.94 }] },
  keyText: {
    fontFamily: typography.family,
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
});
