import { ValidationError } from './errors';
import { containsOnlyLowerCaseLetters } from './utils';

/**
 * @throws {ValidationError}
 */
export const commonPrefix = (inputs: string[]): number[] => {
  const results: number[] = [];

  if (inputs.length < 1 || inputs.length > 10) {
    throw new ValidationError(
      '1 ≤ n ≤ 10 (number of elements in the inputs array)'
    );
  }

  for (const value of inputs) {
    if (value.length < 1 || value.length > 10 ** 5) {
      throw new ValidationError(
        '1 ≤ |inputs[i]| ≤ 10^5 (length of string inputs[i])'
      );
    }

    if (!containsOnlyLowerCaseLetters(value)) {
      throw new ValidationError(
        'Each inputs[i] element contains only letters in the range ascii[a-z].'
      );
    }

    let prefixSum = 0;

    for (let i = 0; i < value.length; i++) {
      const suffix: string = value.slice(i);
      let commonPrefixLen = 0;
      for (let j = 0; j < suffix.length; j++) {
        if (suffix[j] === value[j]) {
          commonPrefixLen++;
        } else {
          break;
        }
      }

      prefixSum += commonPrefixLen;
    }

    results.push(prefixSum);
  }
  return results;
};
