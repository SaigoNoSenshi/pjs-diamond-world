import { decodeBase64 } from '../FileSystemAssetStore';

describe('decodeBase64', () => {
  it('decodes plain and data-URI base64 with any padding', () => {
    expect(Array.from(decodeBase64('aGVsbG8='))).toEqual([104, 101, 108, 108, 111]);
    expect(Array.from(decodeBase64('data:image/png;base64,aGk='))).toEqual([104, 105]);
    expect(Array.from(decodeBase64('YWJj'))).toEqual([97, 98, 99]);
    expect(decodeBase64('').length).toBe(0);
  });
});
