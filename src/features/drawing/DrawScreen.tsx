import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { BigButton } from '@/components/BigButton';
import { Celebration } from '@/components/Celebration';
import { FriendlyError } from '@/components/FriendlyError';
import { ScreenShell } from '@/components/ScreenShell';
import { findStamp } from '@/content/stamps';
import { layout } from '@/constants/layout';
import { routes } from '@/constants/routes';
import { strings, voicePrompts } from '@/constants/strings';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { useSfx } from '@/hooks/useSfx';
import { useVoice } from '@/hooks/useVoice';
import { captureDrawing } from '@/services/media/captureDrawing';
import { drawingColors, palette, spacing } from '@/theme';

import { ColorPalette } from './components/ColorPalette';
import { DrawingCanvas } from './components/DrawingCanvas';
import { DrawingToolbar } from './components/DrawingToolbar';
import { StampTray } from './components/StampTray';
import { useDrawing } from './hooks/useDrawing';
import { saveDrawing } from './saveDrawing';

type SaveStatus =
  { kind: 'idle' } | { kind: 'saving' } | { kind: 'saved'; title: string } | { kind: 'error' };

const colorLabel = (hex: string) => drawingColors.find((c) => c.hex === hex)?.label ?? null;
const stampNoun = (id: string) => findStamp(id)?.noun ?? null;

/** Draw & Paint. Canvas fills the screen; colours along the bottom; tools along the side. */
export function DrawScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { repositories, eventBus, logger, analytics, sync } = useAppServices();
  const { profile } = useProfile();
  const { speak } = useVoice();
  const { play } = useSfx();
  const drawing = useDrawing();
  const canvasRef = useRef<View>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [status, setStatus] = useState<SaveStatus>({ kind: 'idle' });

  useEffect(() => {
    analytics.track('activity_started', { activity: 'draw' });
    speak(voicePrompts.draw);
  }, [analytics, speak]);

  const landscape = width > height;

  const handleSave = useCallback(async () => {
    if (drawing.isEmpty || status.kind === 'saving') return;
    setStatus({ kind: 'saving' });
    try {
      const size = {
        width: Math.max(1, Math.round(canvasSize.width)),
        height: Math.max(1, Math.round(canvasSize.height)),
        backgroundColor: drawing.state.backgroundColor,
      };
      const capture = await captureDrawing(canvasRef, size);
      const thumbnail = await captureDrawing(canvasRef, {
        ...size,
        targetWidth: layout.thumbnailSize,
      });

      const result = await saveDrawing(
        { repositories, eventBus, logger, sync, colorLabel, stampNoun },
        {
          childId: profile.id,
          nickname: profile.nickname,
          elements: drawing.state.elements,
          capture,
          thumbnail,
          width: Math.round(canvasSize.width),
          height: Math.round(canvasSize.height),
        },
      );
      if (!result.ok) throw result.error;
      analytics.track('creation_saved', { type: 'DRAWING' });
      play('save');
      setStatus({ kind: 'saved', title: result.value.title });
    } catch (error) {
      logger.error('drawing save failed', error);
      play('oops');
      setStatus({ kind: 'error' });
    }
  }, [
    drawing.isEmpty,
    drawing.state.elements,
    drawing.state.backgroundColor,
    status.kind,
    repositories,
    eventBus,
    logger,
    sync,
    analytics,
    profile,
    canvasSize,
    play,
  ]);

  const afterSave = (destination: 'again' | 'book') => {
    drawing.reset();
    setStatus({ kind: 'idle' });
    if (destination === 'book') router.replace(routes.book);
  };

  if (status.kind === 'error') {
    return (
      <ScreenShell title={strings.create.draw}>
        <FriendlyError onRetry={() => setStatus({ kind: 'idle' })} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title={strings.create.draw} backgroundColor={palette.mist}>
      <View style={[styles.body, landscape && styles.bodyLandscape]}>
        <View style={styles.canvasWrap}>
          <DrawingCanvas
            ref={canvasRef}
            state={drawing.state}
            onBegin={drawing.beginAt}
            onMove={drawing.moveTo}
            onEnd={drawing.end}
            onLayout={setCanvasSize}
          />
        </View>
        <DrawingToolbar
          tool={drawing.tool}
          onTool={drawing.setTool}
          onUndo={drawing.undo}
          onRedo={drawing.redo}
          onClear={drawing.clear}
          onSave={() => void handleSave()}
          canUndo={drawing.canUndo}
          canRedo={drawing.canRedo}
          canSave={!drawing.isEmpty && status.kind === 'idle'}
          vertical={landscape}
        />
      </View>
      <View style={styles.tray}>
        {drawing.tool === 'stamp' ? (
          <StampTray
            selected={drawing.stampId}
            color={drawing.color}
            onSelect={drawing.setStampId}
          />
        ) : null}
        <ColorPalette selected={drawing.color} onSelect={drawing.setColor} />
      </View>

      <Celebration
        visible={status.kind === 'saved'}
        message={status.kind === 'saved' ? strings.drawing.saved(status.title) : ''}
        icon="book"
        voicePrompt={voicePrompts.saved}
      >
        <BigButton
          icon="paintbrush"
          label={strings.create.draw}
          onPress={() => afterSave('again')}
          color={palette.sunshine}
          testID="draw-again"
        />
        <BigButton
          icon="book"
          label={strings.home.book}
          onPress={() => afterSave('book')}
          color={palette.blossom}
          testID="go-to-book"
        />
      </Celebration>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, flexDirection: 'column' },
  bodyLandscape: { flexDirection: 'row-reverse' },
  canvasWrap: {
    flex: 1,
    margin: spacing.sm,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: palette.white,
  },
  tray: { paddingVertical: spacing.sm, gap: spacing.sm, backgroundColor: palette.cream },
});
