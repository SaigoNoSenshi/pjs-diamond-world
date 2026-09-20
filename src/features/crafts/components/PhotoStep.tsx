import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { BigButton } from '@/components/BigButton';
import { strings } from '@/constants/strings';
import { colors, palette, radii, spacing } from '@/theme';

export interface PhotoStepProps {
  photoUri: string | null;
  onTakePhoto: () => void;
  onSkip: () => void;
  onRetake: () => void;
  onKeep: () => void;
}

/**
 * Controls for the PHOTO step. No photo yet: "Take a picture" or "No picture today".
 * Photo taken: preview with "Keep it" / "Try again". The camera itself lives in
 * `CameraCapture` (Phase 8); this component only decides what PJ can do next.
 */
export function PhotoStep({ photoUri, onTakePhoto, onSkip, onRetake, onKeep }: PhotoStepProps) {
  if (photoUri) {
    return (
      <View style={styles.row}>
        <View style={styles.preview}>
          <Image
            source={{ uri: photoUri }}
            style={styles.previewImage}
            contentFit="cover"
            accessibilityLabel="Your picture"
          />
        </View>
        <BigButton
          icon="undo"
          label={strings.crafts.retake}
          onPress={onRetake}
          color={colors.surface}
          size="comfortable"
          testID="photo-retake"
        />
        <BigButton
          icon="check"
          label={strings.crafts.keep}
          onPress={onKeep}
          color={palette.leaf}
          size="primary"
          testID="photo-keep"
        />
      </View>
    );
  }
  return (
    <View style={styles.row}>
      <BigButton
        icon="camera"
        label={strings.crafts.takePicture}
        onPress={onTakePhoto}
        color={palette.sunshine}
        size="primary"
        testID="photo-take"
      />
      <BigButton
        icon="next"
        label={strings.crafts.skipPhoto}
        onPress={onSkip}
        color={colors.surface}
        size="comfortable"
        testID="photo-skip"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  preview: {
    width: 96,
    height: 96,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: palette.mist,
  },
  previewImage: { width: '100%', height: '100%' },
});
