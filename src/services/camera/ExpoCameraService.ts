import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

import type { CameraService, CapturedPhoto } from '../interfaces';
import type { Logger } from '../logging/logger';

/**
 * Camera availability + library fallback. The live camera UI is `CameraCapture`;
 * this service only answers "can we show it?" and handles the picker path.
 * Photos never leave the device; no analysis is run on them (see CHILD_SAFETY.md).
 */
export class ExpoCameraService implements CameraService {
  constructor(private readonly logger: Logger) {}

  hasLiveCamera(): boolean {
    return Platform.OS !== 'web';
  }

  async pickFromLibrary(): Promise<CapturedPhoto | null> {
    try {
      if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return null;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: false,
        exif: false,
      });
      const asset = result.canceled ? undefined : result.assets[0];
      if (!asset) return null;
      return { uri: asset.uri, width: asset.width, height: asset.height };
    } catch (error) {
      this.logger.error('image picker failed', error);
      return null;
    }
  }
}
