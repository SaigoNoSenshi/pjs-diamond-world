import { StyleSheet, Text, View } from 'react-native';

import { strings } from '@/constants/strings';
import { colors, spacing, typography } from '@/theme';

import { BigButton } from './BigButton';

/** Child-facing failure state. Never shows technical detail. */
export function FriendlyError({ onRetry }: { onRetry?: () => void }) {
  return (
    <View style={styles.root} accessibilityRole="alert">
      <Text style={styles.emoji} accessibilityElementsHidden>
        🫧
      </Text>
      <Text style={styles.text}>{strings.common.oops}</Text>
      {onRetry ? <BigButton icon="undo" label={strings.common.tryAgain} onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    padding: spacing.xl,
  },
  emoji: { fontSize: 72 },
  text: {
    fontFamily: typography.family,
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.text,
    textAlign: 'center',
  },
});
