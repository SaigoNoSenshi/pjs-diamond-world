import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BigButton } from '@/components/BigButton';
import { Celebration } from '@/components/Celebration';
import { FriendlyError } from '@/components/FriendlyError';
import { ScreenShell } from '@/components/ScreenShell';
import { findCraft } from '@/content/crafts';
import { routes } from '@/constants/routes';
import { strings, voicePrompts } from '@/constants/strings';
import { canComplete, currentStep } from '@/domain/craft/craftEngine';
import type { CraftTemplate } from '@/domain/craft/schema';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { useSfx } from '@/hooks/useSfx';
import { palette } from '@/theme';

import { CraftStepView } from './components/CraftStepView';
import { PhotoStep } from './components/PhotoStep';
import { useCraftSession } from './hooks/useCraftSession';
import { saveCraft } from './saveCraft';

type Status =
  | { kind: 'playing' }
  | { kind: 'camera' }
  | { kind: 'saving' }
  | { kind: 'done'; title: string }
  | { kind: 'error' };

export type RenderCamera = (props: {
  onCaptured: (uri: string) => void;
  onCancel: () => void;
}) => React.ReactNode;

export interface CraftPlayerScreenProps {
  craftId: string;
  /** Camera UI, injected so the player stays platform-agnostic (Phase 8 supplies it). */
  renderCamera?: RenderCamera;
}

/** Resolves the template and hands off to the generic player. */
export function CraftPlayerScreen({ craftId, renderCamera }: CraftPlayerScreenProps) {
  const router = useRouter();
  const template = findCraft(craftId);

  if (!template) {
    return (
      <ScreenShell title={strings.crafts.title}>
        <FriendlyError onRetry={() => router.replace(routes.create)} />
      </ScreenShell>
    );
  }
  return <CraftPlayer template={template} renderCamera={renderCamera} />;
}

/** Plays any CraftTemplate. Handles the PHOTO and SAVE steps generically. */
export function CraftPlayer({
  template,
  renderCamera,
}: {
  template: CraftTemplate;
  renderCamera?: RenderCamera | undefined;
}) {
  const router = useRouter();
  const { repositories, eventBus, logger, analytics, camera, sync, makeThumbnail } =
    useAppServices();
  const { profile } = useProfile();
  const { play } = useSfx();
  const [status, setStatus] = useState<Status>({ kind: 'playing' });
  const craft = useCraftSession(template);
  const session = craft.session;

  useEffect(() => {
    analytics.track('activity_started', { activity: template.id });
  }, [analytics, template.id]);

  const handleTakePhoto = useCallback(async () => {
    if (camera.hasLiveCamera() && renderCamera) {
      setStatus({ kind: 'camera' });
      return;
    }
    // Web / no camera: pick from the library instead.
    const picked = await camera.pickFromLibrary();
    if (picked) craft.setPhoto(picked.uri);
  }, [camera, renderCamera, craft]);

  const handleSave = useCallback(async () => {
    if (!session || !canComplete(session) || status.kind === 'saving') return;
    setStatus({ kind: 'saving' });
    const result = await saveCraft(
      { repositories, eventBus, logger, sync, makeThumbnail },
      { childId: profile.id, session },
    );
    if (result.ok) {
      analytics.track('activity_completed', { activity: template.id });
      analytics.track('creation_saved', { type: 'CRAFT' });
      play('celebrate');
      setStatus({ kind: 'done', title: result.value.title });
    } else {
      logger.error('craft save failed', result.error);
      play('oops');
      setStatus({ kind: 'error' });
    }
  }, [
    session,
    status.kind,
    repositories,
    eventBus,
    logger,
    sync,
    makeThumbnail,
    profile.id,
    analytics,
    template.id,
    play,
  ]);

  if (status.kind === 'error') {
    return (
      <ScreenShell title={template.title}>
        <FriendlyError onRetry={() => setStatus({ kind: 'playing' })} />
      </ScreenShell>
    );
  }

  if (status.kind === 'camera' && renderCamera) {
    return (
      <View style={styles.camera}>
        {renderCamera({
          onCaptured: (uri) => {
            craft.setPhoto(uri);
            setStatus({ kind: 'playing' });
          },
          onCancel: () => setStatus({ kind: 'playing' }),
        })}
      </View>
    );
  }

  if (!session) {
    return <ScreenShell title={template.title} />;
  }

  const step = currentStep(session);
  let actionSlot: React.ReactNode | undefined;
  if (step.kind === 'PHOTO') {
    actionSlot = (
      <PhotoStep
        photoUri={session.photoUri}
        onTakePhoto={() => void handleTakePhoto()}
        onSkip={() => {
          craft.setPhoto(null);
          craft.next();
        }}
        onRetake={() => craft.setPhoto(null)}
        onKeep={craft.next}
      />
    );
  } else if (step.kind === 'SAVE') {
    actionSlot = (
      <BigButton
        icon="save"
        label={strings.crafts.save(template.noun)}
        onPress={() => void handleSave()}
        color={palette.leaf}
        size="primary"
        disabled={status.kind === 'saving'}
        testID="craft-save"
      />
    );
  }

  return (
    <ScreenShell title={template.title}>
      <CraftStepView
        session={session}
        onNext={craft.next}
        onBack={craft.back}
        actionSlot={actionSlot}
      />
      <Celebration
        visible={status.kind === 'done'}
        message={strings.crafts.celebrate(profile.nickname, template.noun)}
        icon="clay"
        voicePrompt={voicePrompts.celebrate(profile.nickname, template.noun)}
      >
        <BigButton
          icon="book"
          label={strings.home.book}
          onPress={() => router.replace(routes.book)}
          color={palette.blossom}
          testID="craft-go-book"
        />
        <BigButton
          icon="flower"
          label={strings.home.garden}
          onPress={() => router.replace(routes.garden)}
          color={palette.leaf}
          testID="craft-go-garden"
        />
        <BigButton
          icon="home"
          label={strings.common.home}
          onPress={() => router.dismissTo(routes.home)}
          color={palette.sunshine}
          testID="craft-go-home"
        />
      </Celebration>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  camera: { flex: 1, backgroundColor: palette.ink },
});
