import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { BigButton } from '@/components/BigButton';
import { ScreenShell } from '@/components/ScreenShell';
import { strings, voicePrompts } from '@/constants/strings';
import { enabledCreationModes } from '@/content/creationModes';
import { useAppServices } from '@/hooks/useAppServices';
import { useVoice } from '@/hooks/useVoice';
import { spacing } from '@/theme';

/** Create hub: one huge button per registered creation mode. */
export function CreateHubScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { speak } = useVoice();
  const { analytics } = useAppServices();

  useEffect(() => {
    analytics.track('screen_opened', { screen: 'create' });
    speak(voicePrompts.create);
  }, [analytics, speak]);

  const landscape = width > height;
  const tile = Math.min(landscape ? height * 0.5 : width * 0.7, 300);

  return (
    <ScreenShell title={strings.create.title}>
      <View style={[styles.grid, landscape && styles.row]}>
        {enabledCreationModes.map((mode) => (
          <BigButton
            key={mode.id}
            icon={mode.icon}
            label={mode.label}
            color={mode.color}
            size="hero"
            voicePrompt={mode.voicePrompt}
            onPress={() => router.push(mode.route)}
            style={{ width: tile, height: tile * 0.8 }}
            testID={`create-${mode.id}`}
          />
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    padding: spacing.xl,
  },
  row: { flexDirection: 'row' },
});
