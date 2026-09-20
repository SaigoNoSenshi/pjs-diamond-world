import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BigButton } from '@/components/BigButton';
import { IconButton } from '@/components/IconButton';
import { strings } from '@/constants/strings';
import { useAppServices } from '@/hooks/useAppServices';
import { colors, palette, radii, spacing, typography } from '@/theme';

export interface CameraCaptureProps {
  onCaptured: (uri: string) => void;
  onCancel: () => void;
}

/**
 * Full-screen camera with one huge shutter. Permission is asked here, at the moment
 * PJ wants a picture, with a friendly explanation. Denied → "No picture today".
 * The capture stays in the app cache until saveCraft copies it into app storage.
 */
export function CameraCapture({ onCaptured, onCancel }: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();
  const { logger } = useAppServices();
  const cameraRef = useRef<CameraView>(null);
  const [busy, setBusy] = useState(false);

  const take = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.7,
        skipProcessing: false,
        exif: false,
      });
      if (photo?.uri) onCaptured(photo.uri);
    } catch (error) {
      logger.error('camera capture failed', error);
    } finally {
      setBusy(false);
    }
  };

  if (!permission) {
    return <View style={styles.root} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.emoji}>📷</Text>
        <Text style={styles.message}>{strings.crafts.takePicture}?</Text>
        <View style={styles.row}>
          {permission.canAskAgain ? (
            <BigButton
              icon="camera"
              label={strings.common.yes}
              onPress={() => void requestPermission()}
              color={palette.sunshine}
              testID="camera-allow"
            />
          ) : null}
          <BigButton
            icon="next"
            label={strings.crafts.skipPhoto}
            onPress={onCancel}
            color={colors.surface}
            size="comfortable"
            testID="camera-skip"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        mute
        animateShutter={false}
      />
      <View style={[styles.top, { paddingTop: insets.top + spacing.md }]} pointerEvents="box-none">
        <IconButton
          icon="close"
          label={strings.common.close}
          onPress={onCancel}
          testID="camera-cancel"
        />
      </View>
      <View
        style={[styles.bottom, { paddingBottom: insets.bottom + spacing.xl }]}
        pointerEvents="box-none"
      >
        <BigButton
          icon="camera"
          label={strings.crafts.takePicture}
          onPress={() => void take()}
          color={palette.sunshine}
          size="hero"
          disabled={busy}
          testID="camera-shutter"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.ink },
  center: { alignItems: 'center', justifyContent: 'center', gap: spacing.xl, padding: spacing.xl },
  emoji: { fontSize: 80 },
  message: {
    fontFamily: typography.family,
    fontSize: typography.size.title,
    fontWeight: typography.weight.black,
    color: palette.white,
    textAlign: 'center',
  },
  row: { flexDirection: 'row', gap: spacing.lg, flexWrap: 'wrap', justifyContent: 'center' },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-end',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
  },
});
