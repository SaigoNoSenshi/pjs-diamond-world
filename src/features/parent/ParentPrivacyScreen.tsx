import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { parentStrings } from '@/constants/parentStrings';
import { isBundledAssetUri } from '@/domain/creation/assetUri';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { colors, palette, spacing, typography } from '@/theme';

import { ParentHint, ParentSection, ParentShell } from './components/ParentShell';

export function ParentPrivacyScreen() {
  const { repositories, logger } = useAppServices();
  const { profile } = useProfile();
  const [usage, setUsage] = useState<{ bytes: number; count: number } | null>(null);
  const [showLog, setShowLog] = useState(false);

  const load = useCallback(async () => {
    try {
      const [bytes, count] = await Promise.all([
        repositories.assets.totalBytes(),
        repositories.creations.count(profile.id),
      ]);
      setUsage({ bytes, count });
    } catch (error) {
      logger.error('usage load failed', error);
    }
  }, [repositories, profile.id, logger]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const deleteAll = async () => {
    const go = async () => {
      try {
        const all = await repositories.creations.list(profile.id);
        for (const c of all) {
          await repositories.creations.remove(c.id);
          if (!isBundledAssetUri(c.assetUri)) await repositories.assets.remove(c.assetUri);
        }
        await repositories.drafts.clear(profile.id);
      } catch (error) {
        logger.error('delete all failed', error);
      }
      void load();
    };
    if (Platform.OS === 'web' || process.env.NODE_ENV === 'test') {
      await go();
      return;
    }
    const { Alert } = await import('react-native');
    Alert.alert(parentStrings.creations.confirmDeleteAll, undefined, [
      { text: parentStrings.creations.cancel, style: 'cancel' },
      { text: parentStrings.creations.deleteAll, style: 'destructive', onPress: () => void go() },
    ]);
  };

  const mb = usage ? (usage.bytes / (1024 * 1024)).toFixed(1) : '0.0';

  return (
    <ParentShell title={parentStrings.privacy.title}>
      <ParentSection title={parentStrings.home.privacy}>
        {parentStrings.privacy.bullets.map((b) => (
          <Text key={b} style={styles.bullet}>
            • {b}
          </Text>
        ))}
      </ParentSection>
      <ParentSection title="Storage">
        <Text style={styles.storage} testID="storage-usage">
          {parentStrings.privacy.storage(mb, usage?.count ?? 0)}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => void deleteAll()}
          style={styles.danger}
          testID="delete-all"
        >
          <Text style={styles.dangerText}>{parentStrings.creations.deleteAll}</Text>
        </Pressable>
      </ParentSection>
      <ParentSection title={parentStrings.privacy.logs}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowLog((v) => !v)}
          style={styles.quiet}
        >
          <Text style={styles.quietText}>{showLog ? 'Hide' : 'Show'}</Text>
        </Pressable>
        {showLog ? (
          <View>
            {logger
              .recent()
              .slice(-30)
              .map((entry, i) => (
                <Text key={i} style={styles.log}>
                  {entry.at.slice(11, 19)} [{entry.level}] {entry.message}
                </Text>
              ))}
            {logger.recent().length === 0 ? <ParentHint>Nothing logged yet.</ParentHint> : null}
          </View>
        ) : null}
      </ParentSection>
    </ParentShell>
  );
}

const styles = StyleSheet.create({
  bullet: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    color: colors.text,
    lineHeight: 26,
  },
  storage: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  danger: {
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: '#FFE5E6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  dangerText: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: palette.coral,
  },
  quiet: {
    minHeight: 44,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: palette.mist,
    justifyContent: 'center',
  },
  quietText: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  log: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 12,
    color: colors.textSoft,
  },
});
