import type { GradeWords } from '@/domain/generators/words';
import { grade1 } from './grade1';
import { grade2 } from './grade2';
import { grade3 } from './grade3';
import { grade4 } from './grade4';
import { grade5 } from './grade5';
import { grade6 } from './grade6';

export { grade1 } from './grade1';
export { grade2 } from './grade2';
export { grade3 } from './grade3';
export { grade4 } from './grade4';
export { grade5 } from './grade5';
export { grade6 } from './grade6';

export const gradeWords: Record<number, GradeWords> = {
  1: grade1,
  2: grade2,
  3: grade3,
  4: grade4,
  5: grade5,
  6: grade6,
};

export function wordsForGrade(grade: number): GradeWords {
  const clamped = Math.max(1, Math.min(6, grade));
  const bank = gradeWords[clamped];
  if (bank === undefined) throw new Error(`Missing word bank for grade ${clamped}`);
  return bank;
}
