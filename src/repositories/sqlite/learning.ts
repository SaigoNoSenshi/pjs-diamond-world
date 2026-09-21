import { learningProgressSchema, type LearningProgress } from '@/domain/learning/schema';

import type { LearningProgressRepository } from '../interfaces';
import type { SqlExecutor } from './executor';

export class SqliteLearningRepository implements LearningProgressRepository {
  constructor(private readonly db: SqlExecutor) {}

  async get(childId: string): Promise<LearningProgress | null> {
    const row = await this.db.getFirstAsync<{ progress_json: string }>(
      'SELECT progress_json FROM learning_progress WHERE child_id = ?',
      [childId],
    );
    if (!row) return null;
    const parsed = learningProgressSchema.safeParse(JSON.parse(row.progress_json));
    return parsed.success ? parsed.data : null;
  }

  async save(progress: LearningProgress): Promise<void> {
    learningProgressSchema.parse(progress);
    await this.db.runAsync(
      `INSERT INTO learning_progress (child_id, progress_json, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(child_id) DO UPDATE SET progress_json = excluded.progress_json, updated_at = excluded.updated_at`,
      [progress.childId, JSON.stringify(progress), progress.updatedAt],
    );
  }
}
