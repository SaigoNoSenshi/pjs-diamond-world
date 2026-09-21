import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { parentStrings } from '@/constants/parentStrings';
import { GRADE_NAMES, masteryForGrade, MAX_GRADE, MIN_GRADE } from '@/domain/learning/grades';
import { useLearning } from '@/features/learning/LearningProvider';
import { useActivities } from '@/hooks/useActivities';
import { useAppServices } from '@/hooks/useAppServices';
import { useProfile } from '@/hooks/useProfile';
import { colors, palette, spacing, typography } from '@/theme';

import { ParentHint, ParentSection, ParentShell } from './components/ParentShell';

const SUBJECT_LABEL: Record<string, string> = {
  english: 'English',
  math: 'Math',
  science: 'Science',
  filipino: 'Filipino',
  araling_panlipunan: 'Araling Panlipunan',
  art: 'Art',
  music: 'Music',
  craft: 'Crafts',
};

/** Grade level, auto-advance, progress report and content updates. Adults only. */
export function ParentLearningScreen() {
  const { settings, updateSettings } = useProfile();
  const { progress } = useLearning();
  const all = useActivities();
  const { remoteContent } = useAppServices();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const grade = settings.grade;
  const mastery = masteryForGrade(progress, all, grade);
  const completed = Object.keys(progress.completions).length;

  const bySubject = new Map<string, { done: number; total: number }>();
  for (const a of all.filter((x) => x.grades.includes(grade))) {
    const row = bySubject.get(a.subject) ?? { done: 0, total: 0 };
    row.total += 1;
    if (a.id in progress.completions) row.done += 1;
    bySubject.set(a.subject, row);
  }

  const check = async () => {
    setChecking(true);
    setMessage(null);
    const result = await remoteContent.refresh();
    setChecking(false);
    if (result.status === 'updated')
      setMessage(parentStrings.learning.updated(result.added + result.replaced));
    else if (result.status === 'unchanged') setMessage(parentStrings.learning.upToDate);
    else setMessage(parentStrings.learning.offline);
  };
  const meta = remoteContent.getMeta();

  return (
    <ParentShell title={parentStrings.learning.title}>
      <ParentSection title={parentStrings.learning.grade}>
        <View style={styles.grades} accessibilityRole="radiogroup">
          {Array.from({ length: MAX_GRADE - MIN_GRADE + 1 }, (_, i) => i + MIN_GRADE).map((g) => (
            <Pressable
              key={g}
              accessibilityRole="radio"
              accessibilityLabel={GRADE_NAMES[g] ?? String(g)}
              accessibilityState={{ selected: g === grade }}
              onPress={() => void updateSettings({ grade: g })}
              style={[styles.gradeButton, g === grade && styles.gradeSelected]}
              testID={`grade-${g}`}
            >
              <Text style={[styles.gradeText, g === grade && styles.gradeTextSelected]}>{g}</Text>
            </Pressable>
          ))}
        </View>
        <ParentHint>{parentStrings.learning.gradeHint}</ParentHint>
        <View style={styles.row}>
          <Text style={styles.label}>{parentStrings.learning.autoAdvance}</Text>
          <Switch
            value={settings.autoAdvanceGrade}
            onValueChange={(v) => void updateSettings({ autoAdvanceGrade: v })}
            accessibilityLabel={parentStrings.learning.autoAdvance}
            trackColor={{ true: palette.leaf }}
            testID="toggle-auto-advance"
          />
        </View>
        <ParentHint>{parentStrings.learning.autoAdvanceHint}</ParentHint>
      </ParentSection>

      <ParentSection title={parentStrings.learning.report}>
        <Text style={styles.stat} testID="report-mastery">
          {GRADE_NAMES[grade]}: {parentStrings.learning.mastery(mastery.mastered, mastery.core)}
        </Text>
        <Text style={styles.stat}>{parentStrings.learning.diamonds(progress.diamonds)}</Text>
        <Text style={styles.stat} testID="report-completed">
          {parentStrings.learning.activitiesDone(completed)}
        </Text>
        <Text style={styles.sub}>{parentStrings.learning.subjects}</Text>
        {[...bySubject.entries()].map(([subject, row]) => (
          <View key={subject} style={styles.subjectRow}>
            <Text style={styles.label}>{SUBJECT_LABEL[subject] ?? subject}</Text>
            <View style={styles.bar}>
              <View
                style={[
                  styles.barFill,
                  { width: `${row.total ? Math.round((row.done / row.total) * 100) : 0}%` },
                ]}
              />
            </View>
            <Text style={styles.count}>
              {row.done}/{row.total}
            </Text>
          </View>
        ))}
        {completed === 0 ? <ParentHint>{parentStrings.learning.noData}</ParentHint> : null}
      </ParentSection>

      <ParentSection title={parentStrings.learning.content}>
        <ParentHint>{parentStrings.learning.contentHint}</ParentHint>
        <Text style={styles.stat}>
          {parentStrings.learning.lastUpdate(
            meta ? new Date(meta.checkedAt).toLocaleString() : parentStrings.learning.never,
          )}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => void check()}
          disabled={checking}
          style={[styles.button, checking && styles.buttonDisabled]}
          testID="button-check-content"
        >
          <Text style={styles.buttonText}>{parentStrings.learning.checkNow}</Text>
        </Pressable>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </ParentSection>
    </ParentShell>
  );
}

const styles = StyleSheet.create({
  grades: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gradeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeSelected: { backgroundColor: palette.seaDeep },
  gradeText: {
    fontFamily: typography.family,
    fontSize: typography.size.label,
    fontWeight: typography.weight.black,
    color: colors.text,
  },
  gradeTextSelected: { color: palette.white },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    marginTop: spacing.md,
  },
  label: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    color: colors.text,
    flexShrink: 1,
  },
  stat: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sub: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    color: colors.textSoft,
    marginTop: spacing.sm,
  },
  subjectRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 36 },
  bar: { flex: 1, height: 10, borderRadius: 5, backgroundColor: palette.mist, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: palette.leaf },
  count: {
    fontFamily: typography.family,
    fontSize: typography.size.caption,
    color: colors.textSoft,
    minWidth: 44,
    textAlign: 'right',
  },
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: palette.sunshine,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  message: {
    fontFamily: typography.family,
    fontSize: typography.size.body,
    color: palette.seaDeep,
    marginTop: spacing.sm,
  },
});
