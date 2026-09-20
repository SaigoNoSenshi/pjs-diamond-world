import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BigButton } from '@/components/BigButton';
import { IconButton } from '@/components/IconButton';
import { images } from '@/constants/images';
import { routes } from '@/constants/routes';
import { strings, voicePrompts } from '@/constants/strings';
import { useAppServices } from '@/hooks/useAppServices';
import { useVoice } from '@/hooks/useVoice';
import { palette, spacing } from '@/theme';

import { JellyGuide } from './components/JellyGuide';

const AREAS = [
  {
    id: 'create',
    label: strings.home.create,
    icon: 'paintbrush',
    color: palette.sunshine,
    route: routes.create,
    voice: voicePrompts.create,
  },
  {
    id: 'garden',
    label: strings.home.garden,
    icon: 'flower',
    color: palette.leaf,
    route: routes.garden,
    voice: voicePrompts.garden,
  },
  {
    id: 'music',
    label: strings.home.music,
    icon: 'music',
    color: palette.aqua,
    route: routes.music,
    voice: voicePrompts.music,
  },
  {
    id: 'book',
    label: strings.home.book,
    icon: 'book',
    color: palette.blossom,
    route: routes.book,
    voice: voicePrompts.book,
  },
] as const;

/**
 * Diamond Island — the home screen. Four huge icon-first areas over the island scene,
 * Jelly in a corner, and a deliberately quiet grown-ups control.
 */
export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { speak } = useVoice();
  const { analytics } = useAppServices();

  useEffect(() => {
    analytics.track('screen_opened', { screen: 'home' });
    speak(voicePrompts.home);
  }, [analytics, speak]);

  const landscape = width > height;
  const tileSize = Math.min(landscape ? height * 0.36 : width * 0.42, 220);

  return (
    <View style={styles.root} testID="home-screen">
      <Image
        source={images['scene.island']}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
      />
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <View style={[styles.grid, landscape && styles.gridLandscape]}>
          {AREAS.map((area) => (
            <BigButton
              key={area.id}
              icon={area.icon}
              label={area.label}
              color={area.color}
              size="hero"
              voicePrompt={area.voice}
              onPress={() => router.push(area.route)}
              style={{ width: tileSize, height: tileSize }}
              testID={`home-${area.id}`}
            />
          ))}
        </View>
        <View style={styles.footer} pointerEvents="box-none">
          <JellyGuide size={120} voicePrompt={voicePrompts.home} />
          <IconButton
            icon="lock"
            label={strings.home.parent}
            onPress={() => router.push(routes.parentGate)}
            color="rgba(255,255,255,0.7)"
            iconColor={palette.inkSoft}
            size={48}
            testID="parent-entry"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.aqua },
  content: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'space-between' },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    gap: spacing.lg,
  },
  gridLandscape: { flexWrap: 'nowrap' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
});
