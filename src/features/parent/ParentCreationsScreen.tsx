import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { parentStrings } from '@/constants/parentStrings';
import { isBundledAssetUri } from '@/domain/creation/assetUri';
import type { Creation } from '@/domain/creation/schema';
import { useCreations } from '@/features/diamond-book/hooks/useCreations';
import { useAppServices } from '@/hooks/useAppServices';
import { colors, palette, spacing, typography } from '@/theme';
import { imageSourceFromUri } from '@/utils/imageSource';

import { ParentHint, ParentShell } from './components/ParentShell';

/** Confirm helper that works in tests/web (no native Alert) by falling back to immediate confirm. */
function confirm(message: string, onConfirm: () => void) {
  if (Platform.OS === 'web' || process.env.NODE_ENV === 'test') {
    onConfirm();
    return;
  }
  Alert.alert(message, undefined, [
    { text: parentStrings.creations.cancel, style: 'cancel' },
    { text: parentStrings.creations.delete, style: 'destructive', onPress: onConfirm },
  ]);
}

export function ParentCreationsScreen() {
  const { repositories, logger } = useAppServices();
  const { items, refresh } = useCreations('ALL');
  const [editing, setEditing] = useState<{ id: string; title: string } | null>(null);

  const remove = useCallback(
    (creation: Creation) =>
      confirm(parentStrings.creations.confirmDelete, async () => {
        try {
          await repositories.creations.remove(creation.id);
          if (!isBundledAssetUri(creation.assetUri))
            await repositories.assets.remove(creation.assetUri);
          if (
            creation.thumbnailUri !== creation.assetUri &&
            !isBundledAssetUri(creation.thumbnailUri)
          ) {
            await repositories.assets.remove(creation.thumbnailUri);
          }
        } catch (error) {
          logger.error('delete creation failed', error);
        }
        void refresh();
      }),
    [repositories, logger, refresh],
  );

  const exportCreation = useCallback(
    async (creation: Creation) => {
      if (isBundledAssetUri(creation.assetUri)) return;
      try {
        if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(creation.assetUri);
      } catch (error) {
        logger.error('export failed', error);
      }
    },
    [logger],
  );

  const saveTitle = useCallback(async () => {
    if (!editing) return;
    const title = editing.title.trim().slice(0, 60);
    if (title) {
      try {
        await repositories.creations.update(editing.id, { title });
      } catch (error) {
        logger.error('rename failed', error);
      }
    }
    setEditing(null);
    void refresh();
  }, [editing, repositories, logger, refresh]);

  return (
    <ParentShell title={parentStrings.creations.title}>
      {items.length === 0 ? <ParentHint>{parentStrings.creations.empty}</ParentHint> : null}
      {items.map((creation) => (
        <View key={creation.id} style={styles.row} testID={`parent-creation-${creation.id}`}>
          <Image
            source={imageSourceFromUri(creation.thumbnailUri)}
            style={styles.thumb}
            contentFit="cover"
          />
          <View style={styles.body}>
            {editing?.id === creation.id ? (
              <TextInput
                value={editing.title}
                onChangeText={(title) => setEditing({ id: creation.id, title })}
                onSubmitEditing={() => void saveTitle()}
                onBlur={() => void saveTitle()}
                autoFocus
                maxLength={60}
                style={styles.input}
                accessibilityLabel={parentStrings.creations.rename}
                testID="rename-input"
              />
            ) : (
              <Text style={styles.title}>{creation.title}</Text>
            )}
            <Text style={styles.meta}>
              {creation.type} · {new Date(creation.createdAt).toLocaleDateString()}
            </Text>
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setEditing({ id: creation.id, title: creation.title })}
                style={styles.action}
                testID={`rename-${creation.id}`}
              >
                <Text style={styles.actionText}>{parentStrings.creations.rename}</Text>
              </Pressable>
              {!isBundledAssetUri(creation.assetUri) ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void exportCreation(creation)}
                  style={styles.action}
                  testID={`export-${creation.id}`}
                >
                  <Text style={styles.actionText}>{parentStrings.creations.export}</Text>
                </Pressable>
              ) : null}
              <Pressable
                accessibilityRole="button"
                onPress={() => remove(creation)}
                style={[styles.action, styles.danger]}
                testID={`delete-${creation.id}`}
              >
                <Text style={[styles.actionText, styles.dangerText]}>
                  {parentStrings.creations.delete}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}
    </ParentShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
  },
  thumb: { width: 88, height: 88, borderRadius: 12, backgroundColor: palette.mist },
  body: { flex: 1, gap: spacing.xs },
  title: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  meta: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    color: colors.textSoft,
  },
  input: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: palette.mist,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    minHeight: 44,
  },
  actions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', marginTop: spacing.xs },
  action: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: palette.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  danger: { backgroundColor: '#FFE5E6' },
  dangerText: { color: palette.coral },
});
