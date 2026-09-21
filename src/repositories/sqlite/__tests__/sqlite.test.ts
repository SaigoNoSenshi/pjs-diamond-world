import { runRepositoryContract } from '../../__tests__/repositoryContract';
import { MemoryAssetStore, MemorySettingsRepository } from '../../memory';
import { SqliteLearningRepository } from '../learning';
import { migrate } from '../migrations';
import {
  SqliteCraftProgressRepository,
  SqliteCreationRepository,
  SqliteDraftRepository,
  SqliteGardenRepository,
} from '../repositories';
import { createNodeSqliteExecutor } from './nodeSqliteExecutor';

runRepositoryContract('sqlite', async () => {
  const db = createNodeSqliteExecutor();
  await migrate(db);
  return {
    creations: new SqliteCreationRepository(db),
    garden: new SqliteGardenRepository(db),
    craftProgress: new SqliteCraftProgressRepository(db),
    drafts: new SqliteDraftRepository(db),
    learning: new SqliteLearningRepository(db),
    settings: new MemorySettingsRepository(),
    assets: new MemoryAssetStore(),
  };
});

describe('migrations', () => {
  it('are idempotent and record the schema version', async () => {
    const db = createNodeSqliteExecutor();
    expect(await migrate(db)).toBe(2);
    expect(await migrate(db)).toBe(2);
    const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    expect(row?.user_version).toBe(2);
  });
});
