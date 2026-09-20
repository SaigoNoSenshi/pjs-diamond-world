import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { routes } from '@/constants/routes';
import { strings } from '@/constants/strings';
import { colors, radii, spacing, touch, typography } from '@/theme';

/**
 * Temporary scaffold screen used while a feature is being built. Every route in the
 * app resolves to a real screen so navigation never shows a blank page.
 */
export function PlaceholderScreen({ title, emoji }: { title: string; emoji: string }) {
  const router = useRouter();
  return (
    <View style={styles.root} accessibilityLabel={title}>
      <Text style={styles.emoji} accessibilityElementsHidden>
        {emoji}
      </Text>
      <Text style={styles.title}>{title}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={strings.common.home}
        onPress={() => router.replace(routes.home)}
        style={({ pressed }) => [styles.homeButton, pressed && styles.pressed]}
      >
        <Text style={styles.homeLabel}>🏝️ {strings.common.home}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  emoji: { fontSize: 96 },
  title: {
    fontFamily: typography.family,
    fontSize: typography.size.title,
    fontWeight: typography.weight.black,
    color: colors.text,
    textAlign: 'center',
  },
  homeButton: {
    minHeight: touch.primary,
    minWidth: 220,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.96 }] },
  homeLabel: {
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
});
