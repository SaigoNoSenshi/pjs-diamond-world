import { generatedActivities } from './generated';
import { gradeQuizActivities } from './quizGrades';
import { languageQuizActivities } from './quizLanguage';

/**
 * Grade 1–6 curriculum banks: authored Science / Araling Panlipunan / Filipino / English
 * quizzes plus the generated Math and Words drills. Kept out of the startup bundle and
 * loaded through `loadGradeContent()` (see ./index.ts) so the intro stays fast as the
 * curriculum grows.
 */
export const gradeContentActivities = [
  ...gradeQuizActivities,
  ...languageQuizActivities,
  ...generatedActivities,
];
