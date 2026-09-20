import { clampTitle, friendlyCraftName, friendlyDrawingName } from '../friendlyName';

describe('friendlyDrawingName', () => {
  const random = () => 0;
  it('combines colour and stamp', () => {
    expect(
      friendlyDrawingName({ nickname: 'PJ', colorLabel: 'Yellow', stampNoun: 'Star', random }),
    ).toBe("PJ's Yellow Star");
  });
  it('falls back gracefully', () => {
    expect(friendlyDrawingName({ nickname: 'PJ', stampNoun: 'Flower', random })).toBe(
      "PJ's Happy Flower",
    );
    expect(friendlyDrawingName({ nickname: 'PJ', colorLabel: 'Pink', random })).toBe(
      "PJ's Pink Drawing",
    );
    expect(friendlyDrawingName({ nickname: 'PJ', random })).toBe("PJ's Happy Drawing");
  });
});

describe('friendlyCraftName / clampTitle', () => {
  it('names crafts and clamps long titles', () => {
    expect(friendlyCraftName('cup')).toBe('My Cup');
    expect(clampTitle('x'.repeat(70)).length).toBe(60);
    expect(clampTitle('short')).toBe('short');
  });
});
