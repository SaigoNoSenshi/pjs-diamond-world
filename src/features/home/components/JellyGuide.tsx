import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { Bounce } from '@/components/animations/Bounce';
import { GUIDE } from '@/constants/characters';
import { images } from '@/constants/images';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';

import { SpeechBubble } from './SpeechBubble';

export interface JellyGuideProps {
  size?: number;
  /** Short bubble text; omit for a quiet Jelly. */
  says?: string;
  /** Spoken when tapped (default: the bubble text). */
  voicePrompt?: string;
  onPress?: () => void;
}

/**
 * Jelly, the guide. Communicates through bounce, a short bubble and one voice line.
 * Never chatty. Tapping Jelly repeats the current hint.
 */
export function JellyGuide({ size = 140, says, voicePrompt, onPress }: JellyGuideProps) {
  const { speak } = useVoice();
  const { play } = useSfx();

  const handlePress = () => {
    play('bubble');
    const line = voicePrompt ?? says;
    if (line) speak(line);
    onPress?.();
  };

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      {says ? <SpeechBubble text={says} /> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={GUIDE.name}
        accessibilityHint="Tap to hear the hint again"
        onPress={handlePress}
        hitSlop={12}
        testID="jelly-guide"
      >
        <Bounce amplitude={10} duration={1800}>
          <Image
            source={images['character.jelly']}
            style={{ width: size, height: size }}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
        </Bounce>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4 },
});
