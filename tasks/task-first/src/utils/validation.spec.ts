import { containsOnlyLowerCaseLetters } from './validation';

describe('utils: validation', () => {
  describe('containsOnlyLowerCaseLetters', () => {
    it('should return true for strings containing only lowercase letters', () => {
      const inputs = ['hello', 'world', 'javascript'];
      for (const input of inputs) {
        expect(containsOnlyLowerCaseLetters(input)).toBe(true);
      }
    });

    it('should return false for strings containing uppercase letters', () => {
      const inputs = ['Hello', 'WORLD', 'JavaSCript'];
      for (const input of inputs) {
        expect(containsOnlyLowerCaseLetters(input)).toBe(false);
      }
    });

    it('should return false for strings containing numbers or symbols', () => {
      const inputs = ['h3llo', 'w0rld', 'java$cript'];
      for (const input of inputs) {
        expect(containsOnlyLowerCaseLetters(input)).toBe(false);
      }
    });

    it('should return false for empty strings', () => {
      expect(containsOnlyLowerCaseLetters('')).toBe(false);
    });
  });
});
