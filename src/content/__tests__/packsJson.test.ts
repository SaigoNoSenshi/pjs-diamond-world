import { readFileSync } from 'node:fs';
import path from 'node:path';

import { activityDefinitionSchema } from '@/domain/activity/schema';
import { contentPackSchema } from '@/services/content/RemoteContentService';

/** The published remote pack must always be valid — a bad file would be a no-op on devices, but we never want to ship one. */
describe('public/content/packs.json', () => {
  it('is a valid content pack whose activities all parse', () => {
    const raw = JSON.parse(
      readFileSync(path.resolve(__dirname, '../../../public/content/packs.json'), 'utf8'),
    );
    const pack = contentPackSchema.parse(raw);
    expect(pack.activities.length).toBeGreaterThan(0);
    for (const a of pack.activities) {
      const parsed = activityDefinitionSchema.parse(a);
      expect(parsed.id.startsWith('act_remote_')).toBe(true);
    }
  });
});
