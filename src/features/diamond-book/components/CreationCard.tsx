import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Icon } from '@/components/icons/Icon';
import type { Creation } from '@/domain/creation/schema';
import { colors, palette, radii, spacing, typography } from '@/theme';
import { imageSourceFromUri } from '@/utils/imageSource';

export interface CreationCardProps {
  creation: Creation;
  size: number;
  onPress: (creation: Creation) => void;
}

/** Big picture card. The picture is the point; the title is short and friendly. */
export function CreationCard({ creation, size, onPress }: CreationCardProps) {
  const typeIcon = creation.type === 'DRAWING' ? 'paintbrush' : 'clay';
  return (
    <Card
      onPress={() => onPress(creation)}
      accessibilityLabel={`${creation.title}${creation.favorite ? ', favorite' : ''}`}
      style={[styles.card, { width: size }]}
      testID={`creation-${creation.id}`}
    >
      <View style={[styles.imageWrap, { height: size - spacing.lg * 2 }]}>
        <Image
          source={imageSourceFromUri(creation.thumbnailUri)}
          style={styles.image}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
          recyclingKey={creation.id}
        />
        <View style={styles.badge}>
          <Icon name={typeIcon} size={26} color={palette.ink} />
        </View>
        {creation.favorite ? (
          <View style={[styles.badge, styles.badgeRight]}>
            <Icon name="heart" size={26} color={palette.coral} />
          </View>
        ) : null}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {creation.title}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.md, gap: spacing.sm },
  imageWrap: { borderRadius: radii.md, overflow: 'hidden', backgroundColor: palette.mist },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radii.pill,
    padding: spacing.xs,
  },
  badgeRight: { left: undefined, right: spacing.sm },
  title: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.text,
    textAlign: 'center',
  },
});
