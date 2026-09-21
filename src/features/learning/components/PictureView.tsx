import { StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/icons/Icon';
import type { Picture } from '@/domain/activity/schema';
import { palette, typography } from '@/theme';

/**
 * Renders a content `Picture`: a tinted icon, optionally with big text on top
 * (letters and numbers). Content only names icons; this is the single place that
 * turns names into drawings, so an unknown name degrades to a star, never a crash.
 */
export function PictureView({ picture, size = 72 }: { picture: Picture; size?: number }) {
  const icon = picture.icon as IconName;
  const color = picture.color ?? palette.sunshine;
  if (picture.text) {
    return (
      <View style={[styles.box, { width: size, height: size }]}>
        <View style={styles.faded}>
          <Icon name={icon} size={size} color={color} />
        </View>
        <Text
          style={[styles.text, { fontSize: size * 0.62, lineHeight: size * 0.7 }]}
          accessibilityLabel={picture.text}
        >
          {picture.text}
        </Text>
      </View>
    );
  }
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <Icon name={icon} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  faded: { position: 'absolute', opacity: 0.18 },
  text: {
    fontFamily: typography.family,
    fontWeight: typography.weight.black,
    color: palette.ink,
    textAlign: 'center',
  },
});
