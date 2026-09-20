import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { parentStrings } from '@/constants/parentStrings';
import { hashPin, isValidPin } from '@/domain/profile/parentGate';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { colors, palette, spacing, typography } from '@/theme';

import { ParentHint, ParentSection, ParentShell } from './components/ParentShell';

function Row({
  label,
  value,
  onChange,
  testID,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  testID: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        testID={testID}
        trackColor={{ true: palette.leaf }}
      />
    </View>
  );
}

export function ParentSettingsScreen() {
  const { profile, settings, updateSettings, updateNickname } = useProfile();
  const { sync } = useAppServices();
  const [nickname, setNickname] = useState(profile.nickname);
  const [pinDraft, setPinDraft] = useState('');
  const [pinMessage, setPinMessage] = useState<string | null>(null);

  const savePin = () => {
    if (!isValidPin(pinDraft)) {
      setPinMessage(parentStrings.settings.pinInvalid);
      return;
    }
    void updateSettings({ parentPinHash: hashPin(pinDraft) });
    setPinDraft('');
    setPinMessage(parentStrings.settings.pinSaved);
  };

  return (
    <ParentShell title={parentStrings.settings.title}>
      <ParentSection title={parentStrings.settings.audio}>
        <Row
          label={parentStrings.settings.music}
          value={settings.musicEnabled}
          onChange={(v) => void updateSettings({ musicEnabled: v })}
          testID="toggle-music"
        />
        <Row
          label={parentStrings.settings.soundEffects}
          value={settings.soundEffectsEnabled}
          onChange={(v) => void updateSettings({ soundEffectsEnabled: v })}
          testID="toggle-sfx"
        />
        <Row
          label={parentStrings.settings.voice}
          value={settings.voiceEnabled}
          onChange={(v) => void updateSettings({ voiceEnabled: v })}
          testID="toggle-voice"
        />
      </ParentSection>

      <ParentSection title={parentStrings.settings.motion}>
        <Row
          label={parentStrings.settings.reducedMotion}
          value={settings.reducedMotion ?? false}
          onChange={(v) => void updateSettings({ reducedMotion: v })}
          testID="toggle-motion"
        />
        <ParentHint>{parentStrings.settings.reducedMotionHint}</ParentHint>
      </ParentSection>

      <ParentSection title={parentStrings.settings.profile}>
        <Text style={styles.label}>{parentStrings.settings.nickname}</Text>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          onBlur={() => void updateNickname(nickname)}
          onSubmitEditing={() => void updateNickname(nickname)}
          maxLength={24}
          style={styles.input}
          accessibilityLabel={parentStrings.settings.nickname}
          testID="input-nickname"
        />
        <ParentHint>{parentStrings.settings.nicknameHint}</ParentHint>
      </ParentSection>

      <ParentSection title={parentStrings.settings.pin}>
        <ParentHint>{parentStrings.settings.pinHint}</ParentHint>
        <View style={styles.pinRow}>
          <TextInput
            value={pinDraft}
            onChangeText={(t) => setPinDraft(t.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            placeholder="••••"
            style={[styles.input, styles.pinInput]}
            accessibilityLabel={parentStrings.settings.pin}
            testID="input-pin"
          />
          <Pressable
            accessibilityRole="button"
            onPress={savePin}
            style={styles.button}
            testID="button-set-pin"
          >
            <Text style={styles.buttonText}>{parentStrings.settings.setPin}</Text>
          </Pressable>
          {settings.parentPinHash ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void updateSettings({ parentPinHash: undefined });
                setPinMessage(null);
              }}
              style={[styles.button, styles.buttonQuiet]}
              testID="button-clear-pin"
            >
              <Text style={styles.buttonText}>{parentStrings.settings.clearPin}</Text>
            </Pressable>
          ) : null}
        </View>
        {pinMessage ? <Text style={styles.message}>{pinMessage}</Text> : null}
      </ParentSection>

      <ParentSection title={parentStrings.settings.intro}>
        <Row
          label={parentStrings.settings.replayIntro}
          value={!settings.introSeen}
          onChange={(v) => void updateSettings({ introSeen: !v })}
          testID="toggle-intro"
        />
      </ParentSection>

      <ParentSection title={parentStrings.settings.cloud}>
        <Row
          label={parentStrings.settings.cloudSync}
          value={settings.cloudSyncEnabled}
          onChange={(v) => void updateSettings({ cloudSyncEnabled: v })}
          testID="toggle-cloud"
        />
        <ParentHint>
          {!sync.isConfigured()
            ? parentStrings.settings.cloudUnavailable
            : settings.cloudSyncEnabled
              ? parentStrings.settings.cloudOn
              : parentStrings.settings.cloudOff}
        </ParentHint>
      </ParentSection>
    </ParentShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  label: { fontFamily: typography.family, fontSize: typography.size.body, color: colors.text },
  input: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: palette.mist,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
    backgroundColor: palette.cream,
  },
  pinRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' },
  pinInput: { width: 120, letterSpacing: 6, textAlign: 'center' },
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: palette.sunshine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonQuiet: { backgroundColor: palette.mist },
  buttonText: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  message: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    color: colors.textSoft,
  },
});
