import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors, palette } from '@/theme';

/**
 * Suspense fallback while a lazily-loaded screen's code arrives. Quiet on purpose:
 * same background as every screen, one soft spinner, no text a child would have to read.
 * On a warm cache this is on screen for a few milliseconds at most.
 */
export function ScreenLoading() {
  return (
    <View style={styles.root} testID="screen-loading">
      <ActivityIndicator size="large" color={palette.aqua} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
