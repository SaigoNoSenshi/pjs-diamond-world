import { ScrollView, StyleSheet, View } from 'react-native';

import { HoldButton } from '@/components/HoldButton';
import { IconButton } from '@/components/IconButton';
import { strings } from '@/constants/strings';
import { colors, palette, spacing, touch } from '@/theme';

import type { DrawingTool } from '../hooks/useDrawing';

export interface DrawingToolbarProps {
  tool: DrawingTool;
  onTool: (tool: DrawingTool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canSave: boolean;
  vertical?: boolean;
}

/**
 * Tools reachable by small hands: brush, crayon, eraser, stamps, undo (always
 * visible), redo, hold-to-clear, save. Selected tool shows a ring.
 */
export function DrawingToolbar({
  tool,
  onTool,
  onUndo,
  onRedo,
  onClear,
  onSave,
  canUndo,
  canRedo,
  canSave,
  vertical = false,
}: DrawingToolbarProps) {
  const content = (
    <>
      <View style={[styles.group, vertical && styles.groupVertical]}>
        <IconButton
          icon="brush"
          label={strings.drawing.brush}
          selected={tool === 'brush'}
          onPress={() => onTool('brush')}
          speak
          testID="tool-brush"
        />
        <IconButton
          icon="crayon"
          label={strings.drawing.crayon}
          selected={tool === 'crayon'}
          onPress={() => onTool('crayon')}
          speak
          testID="tool-crayon"
        />
        <IconButton
          icon="eraser"
          label={strings.drawing.eraser}
          selected={tool === 'eraser'}
          onPress={() => onTool('eraser')}
          speak
          testID="tool-eraser"
        />
        <IconButton
          icon="stamp"
          label={strings.drawing.stamps}
          selected={tool === 'stamp'}
          onPress={() => onTool('stamp')}
          speak
          testID="tool-stamp"
        />
      </View>
      <View style={[styles.group, vertical && styles.groupVertical]}>
        <IconButton
          icon="undo"
          label={strings.drawing.undo}
          onPress={onUndo}
          disabled={!canUndo}
          testID="tool-undo"
        />
        <IconButton
          icon="redo"
          label={strings.drawing.redo}
          onPress={onRedo}
          disabled={!canRedo}
          testID="tool-redo"
        />
        <HoldButton
          icon="trash"
          label={strings.drawing.clear}
          onComplete={onClear}
          size={touch.comfortable}
          testID="tool-clear"
        />
        <IconButton
          icon="save"
          label={strings.drawing.save}
          onPress={onSave}
          disabled={!canSave}
          color={palette.leaf}
          size={touch.primary * 0.8}
          speak
          testID="tool-save"
        />
      </View>
    </>
  );
  if (vertical) {
    return (
      <ScrollView
        style={styles.verticalScroll}
        contentContainerStyle={styles.vertical}
        showsVerticalScrollIndicator={false}
        accessibilityRole="toolbar"
      >
        {content}
      </ScrollView>
    );
  }
  return (
    <View style={styles.bar} accessibilityRole="toolbar">
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSoft,
    gap: spacing.md,
  },
  verticalScroll: { flexGrow: 0, backgroundColor: colors.surfaceSoft },
  vertical: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  groupVertical: { flexDirection: 'column', gap: spacing.sm },
});
