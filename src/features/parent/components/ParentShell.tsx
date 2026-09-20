import { Redirect, useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { routes } from '@/constants/routes';
import { useParentSession } from '@/hooks/useParentSession';
import { colors, palette, spacing, typography } from '@/theme';

/**
 * Frame for parent screens: calmer, denser, adult typography. Redirects to the gate
 * when the session is locked so deep links cannot bypass it.
 */
export function ParentShell({
  title,
  children,
  showBack = true,
}: PropsWithChildren<{ title: string; showBack?: boolean }>) {
  const { unlocked } = useParentSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!unlocked) return <Redirect href={routes.parentGate} />;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        {showBack ? (
          <IconButton icon="back" label="Back" onPress={() => router.back()} size={48} />
        ) : (
          <View style={styles.spacer} />
        )}
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <View style={styles.spacer} />
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function ParentSection({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export function ParentHint({ children }: PropsWithChildren) {
  return <Text style={styles.hint}>{children}</Text>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.mist },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  spacer: { width: 48 },
  title: {
    flex: 1,
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  content: { padding: spacing.lg, gap: spacing.lg },
  section: { gap: spacing.sm },
  sectionTitle: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
    color: colors.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.md, gap: spacing.md },
  hint: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    color: colors.textSoft,
  },
});
