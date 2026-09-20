import { crafts, findCraft } from '@/content/crafts';
import { images, isImageKey } from '@/constants/images';
import { allStamps } from '@/content/stamps';
import { craftTemplateSchema } from '@/domain/craft/schema';

describe('content packs', () => {
  it('every craft template is valid and references existing illustrations', () => {
    expect(crafts.length).toBeGreaterThan(0);
    for (const craft of crafts) {
      expect(craftTemplateSchema.safeParse(craft).success).toBe(true);
      for (const step of craft.steps) {
        expect(isImageKey(step.illustration)).toBe(true);
      }
      if (craft.illustration) expect(isImageKey(craft.illustration)).toBe(true);
    }
  });

  it("PJ's Clay Cup has her seven steps in order, ending with a photo then save", () => {
    const cup = findCraft('crf_clay_cup');
    expect(cup?.steps.map((s) => s.instruction)).toEqual([
      'Make a clay log.',
      'Connect the clay together.',
      'Shape the cup.',
      'Add colors.',
      'Make the handle.',
      'Take a picture.',
      'Save my cup.',
    ]);
    expect(cup?.steps.map((s) => s.kind).slice(-2)).toEqual(['PHOTO', 'SAVE']);
  });

  it('stamp ids are unique and the image registry has no dead keys', () => {
    const ids = allStamps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(['robot', 'pig', 'jellyfish', 'diamond']));
    // Metro resolves to a number; jest-expo's asset mock resolves to an object. Either way: never null.
    for (const value of Object.values(images)) expect(value).not.toBeNull();
  });
});
