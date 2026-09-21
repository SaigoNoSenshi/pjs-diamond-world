import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/icons/Icon';
import { parentStrings } from '@/constants/parentStrings';
import { routes } from '@/constants/routes';
import { useParentSession } from '@/hooks/useParentSession';
import { colors, palette, spacing, typography } from '@/theme';

import { ParentHint, ParentShell } from './components/ParentShell';

const ENTRIES: readonly {
  icon: IconName;
  title: string;
  hint: string;
  route: string;
  testID: string;
}[] = [
  {
    icon: 'settings',
    title: parentStrings.home.settings,
    hint: parentStrings.home.settingsHint,
    route: routes.parentSettings,
    testID: 'parent-settings',
  },
  {
    icon: 'abc',
    title: parentStrings.home.learning,
    hint: parentStrings.home.learningHint,
    route: routes.parentLearning,
    testID: 'parent-learning',
  },
  {
    icon: 'book',
    title: parentStrings.home.creations,
    hint: parentStrings.home.creationsHint,
    route: routes.parentCreations,
    testID: 'parent-creations',
  },
  {
    icon: 'lock',
    title: parentStrings.home.privacy,
    hint: parentStrings.home.privacyHint,
    route: routes.parentPrivacy,
    testID: 'parent-privacy',
  },
];

export function ParentHomeScreen() {
  const router = useRouter();
  const { lock } = useParentSession();

  const exit = () => {
    lock();
    router.dismissTo(routes.home);
  };

  return (
    <ParentShell title={parentStrings.home.title} showBack={false}>
      <ParentHint>{parentStrings.home.intro}</ParentHint>
      {ENTRIES.map((entry) => (
        <Pressable
          key={entry.route}
          accessibilityRole="button"
          accessibilityLabel={entry.title}
          onPress={() => router.push(entry.route)}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          testID={entry.testID}
        >
          <Icon name={entry.icon} size={36} color={palette.seaDeep} />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{entry.title}</Text>
            <Text style={styles.rowHint}>{entry.hint}</Text>
          </View>
          <Icon name="next" size={24} color={colors.textSoft} stroke={colors.textSoft} />
        </Pressable>
      ))}
      <Pressable
        accessibilityRole="button"
        onPress={exit}
        style={({ pressed }) => [styles.exit, pressed && styles.pressed]}
        testID="parent-exit"
      >
        <Icon name="island" size={28} />
        <Text style={styles.exitText}>{parentStrings.home.exit}</Text>
      </Pressable>
    </ParentShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    minHeight: 72,
  },
  rowText: { flex: 1 },
  rowTitle: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  rowHint: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    color: colors.textSoft,
  },
  pressed: { opacity: 0.85 },
  exit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: palette.sunshine,
  },
  exitText: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
});
