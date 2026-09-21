import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/icons/Icon';
import { images } from '@/constants/images';
import { strings } from '@/constants/strings';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { colors, palette, radii, shadows, spacing, typography } from '@/theme';

/**
 * "Jelly reads it": a small Jelly, a speech bubble with the instruction, and a
 * speaker button. Tapping anywhere on it speaks the text again. Present on every
 * activity so a pre-reader never depends on reading the instruction.
 */
export function JellySays({
  text,
  voice,
  compact = false,
  testID = 'jelly-says',
}: {
  text: string;
  /** Spoken text when it differs from the written one. */
  voice?: string;
  compact?: boolean;
  testID?: string;
}) {
  const { speak } = useVoice();
  const { play } = useSfx();
  const say = () => {
    play('bubble');
    speak(voice ?? text);
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${strings.learning.jellyReads} ${text}`}
      onPress={say}
      testID={testID}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Image
        source={images['character.jelly']}
        style={{ width: compact ? 44 : 64, height: compact ? 44 : 64 }}
        contentFit="contain"
      />
      <View style={[styles.bubble, compact && styles.bubbleCompact]}>
        <Text style={[styles.text, compact && styles.textCompact]}>{text}</Text>
        <View style={styles.speaker}>
          <Icon name="volume" size={22} color={palette.ink} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pressed: { opacity: 0.85 },
  bubble: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...shadows.soft,
  },
  bubbleCompact: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  text: {
    flex: 1,
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  textCompact: { fontSize: typography.size.body },
  speaker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.sunshine,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
