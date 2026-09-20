import { createChallenge, hashPin, isValidPin, verifyPin } from '../parentGate';

describe('parent gate', () => {
  it('builds a two-digit-sum challenge with four unique options including the answer', () => {
    for (let seed = 0; seed < 50; seed += 1) {
      let n = seed;
      const random = () => {
        n = (n * 9301 + 49297) % 233280;
        return n / 233280;
      };
      const c = createChallenge(random);
      expect(c.answer).toBe(c.a + c.b);
      expect(c.answer).toBeGreaterThanOrEqual(11);
      expect(c.options).toHaveLength(4);
      expect(new Set(c.options).size).toBe(4);
      expect(c.options).toContain(c.answer);
      expect(c.options.every((o) => o > 0)).toBe(true);
    }
  });

  it('hashes and verifies a 4-digit PIN without storing it', () => {
    const hash = hashPin('1234');
    expect(hash).not.toContain('1234');
    expect(verifyPin('1234', hash)).toBe(true);
    expect(verifyPin('1235', hash)).toBe(false);
    expect(verifyPin('1234', undefined)).toBe(false);
    expect(isValidPin('12a4')).toBe(false);
    expect(isValidPin('123')).toBe(false);
  });
});
