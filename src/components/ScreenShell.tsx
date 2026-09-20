import { useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { strings } from '@/constants/strings';
import { colors, spacing, typography } from '@/theme';

import { IconButton } from './IconButton';

export interface ScreenShellProps {
  title?: string;
  /** Show a big Home button (default true). */
  showHome?: boolean;
  /** Show a Back button instead of / in addition to Home. */
  showBack?: boolean;
  backgroundColor?: string;
  /** Extra controls rendered in the top-right corner. */
  rightSlot?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  /** When true, the content fills the screen and the header floats over it. */
  immersive?: boolean;
}

/**
 * Consistent screen frame: safe-area aware, warm background, one obvious way home.
 * Titles are optional — icons and voice carry navigation for a pre-reader.
 */
export function ScreenShell({
  title,
  showHome = true,
  showBack = false,
  backgroundColor = colors.background,
  rightSlot,
  contentStyle,
  immersive = false,
  children,
}: PropsWithChildren<ScreenShellProps>) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const header = (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + spacing.sm,
          paddingLeft: insets.left + spacing.lg,
          paddingRight: insets.right + spacing.lg,
        },
        immersive && styles.headerFloating,
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.headerSide}>
        {showBack ? (
          <IconButton icon="back" label={strings.crafts.back} onPress={() => router.back()} />
        ) : null}
        {showHome ? (
          <IconButton
            icon="home"
            label={strings.common.home}
            onPress={() => router.dismissTo(routes.home)}
            color={colors.primary}
            testID="home-button"
          />
        ) : null}
      </View>
      {title ? (
        <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
      ) : (
        <View style={styles.titleSpacer} />
      )}
      <View style={[styles.headerSide, styles.headerRight]}>{rightSlot}</View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor }]}>
      {immersive ? null : header}
      <View
        style={[
          styles.content,
          {
            paddingBottom: insets.bottom,
            paddingLeft: immersive ? 0 : insets.left,
            paddingRight: immersive ? 0 : insets.right,
          },
          contentStyle,
        ]}
      >
        {children}
      </View>
      {immersive ? header : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  headerFloating: { position: 'absolute', top: 0, left: 0, right: 0 },
  headerSide: { flexDirection: 'row', gap: spacing.md, minWidth: 64 },
  headerRight: { justifyContent: 'flex-end' },
  title: {
    flex: 1,
    fontFamily: typography.family,
    fontSize: typography.size.title,
    fontWeight: typography.weight.black,
    color: colors.text,
    textAlign: 'center',
  },
  titleSpacer: { flex: 1 },
  content: { flex: 1 },
});
