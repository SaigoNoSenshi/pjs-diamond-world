import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BigButton } from '@/components/BigButton';
import { FriendlyError } from '@/components/FriendlyError';
import { ScreenShell } from '@/components/ScreenShell';
import { strings } from '@/constants/strings';
import { colors, palette, radii, spacing, typography } from '@/theme';
import { imageSourceFromUri } from '@/utils/imageSource';

import { useCreation } from './hooks/useCreations';

/** Full-screen view of one creation with a big favourite heart. */
export function CreationDetailScreen({ creationId }: { creationId: string | undefined }) {
  const router = useRouter();
  const { creation, status, toggleFavorite } = useCreation(creationId);

  if (status === 'error') {
    return (
      <ScreenShell title={strings.book.title} showBack>
        <FriendlyError onRetry={() => router.back()} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell showBack backgroundColor={palette.seaDeep} immersive>
      {creation ? (
        <View style={styles.root}>
          <Image
            source={imageSourceFromUri(creation.assetUri)}
            style={styles.image}
            contentFit="contain"
            transition={200}
            accessibilityLabel={creation.title}
          />
          <View style={styles.footer}>
            <Text style={styles.title}>{creation.title}</Text>
            <BigButton
              icon="heart"
              label={strings.book.favorite}
              onPress={() => void toggleFavorite()}
              color={creation.favorite ? palette.coral : colors.surface}
              iconColor={creation.favorite ? palette.white : palette.coral}
              size="comfortable"
              testID="favorite-toggle"
            />
          </View>
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  image: { flex: 1, width: '100%' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
  },
  title: {
    flex: 1,
    fontFamily: typography.family,
    fontSize: typography.size.title,
    fontWeight: typography.weight.black,
    color: colors.text,
  },
});
