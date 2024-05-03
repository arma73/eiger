import { commonPrefix } from './main';
import { ValidationError } from './errors';

describe('commonPrefix', () => {
  it('should return the sum of common prefix lengths for each string', () => {
    const inputs = ['abcabcd', 'aa', 'ababaa'];
    const expectedResults = [10, 3, 11];
    expect(commonPrefix(inputs)).toEqual(expectedResults);
  });

  it('should handle empty strings', () => {
    const inputs = [''];
    expect(() => commonPrefix(inputs)).toThrow(ValidationError);
  });

  it('should handle single-character strings', () => {
    const inputs = ['a', 'b'];
    const expectedResults = [1, 1];
    expect(commonPrefix(inputs)).toEqual(expectedResults);
  });

  it('should handle strings with special characters', () => {
    const inputs = ['!@#$%^&*', 'ab$c'];
    expect(() => commonPrefix(inputs)).toThrow(ValidationError);
  });

  it('should handle strings with repeated characters', () => {
    const inputs = ['aaaaaa', 'abcabc'];
    const expectedResults = [21, 9];
    expect(commonPrefix(inputs)).toEqual(expectedResults);
  });

  it('should handle strings with all the same characters', () => {
    const inputs = ['bbbbbbb', 'bbbb'];
    const expectedResults = [28, 10];
    expect(commonPrefix(inputs)).toEqual(expectedResults);
  });

  it('should handle an empty array', () => {
    const inputs: string[] = [];
    expect(() => commonPrefix(inputs)).toThrow(ValidationError);
  });
});
