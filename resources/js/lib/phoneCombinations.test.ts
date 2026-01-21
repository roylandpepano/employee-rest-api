import { describe, expect, it } from 'vitest';

import { phoneLetterCombinationCount, phoneLetterCombinations } from './phoneCombinations';

describe('phoneLetterCombinations', () => {
    it('example 1: "23"', () => {
        expect(phoneLetterCombinations('23')).toEqual(['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']);
        expect(phoneLetterCombinationCount('23')).toBe(9);
    });

    it('example 2: empty', () => {
        expect(phoneLetterCombinations('')).toEqual(['']);
        expect(phoneLetterCombinationCount('')).toBe(1);
    });

    it('example 3: "2"', () => {
        expect(phoneLetterCombinations('2')).toEqual(['a', 'b', 'c']);
        expect(phoneLetterCombinationCount('2')).toBe(3);
    });

    it('returns [] for unsupported digits (0/1/non-digits)', () => {
        expect(phoneLetterCombinations('10')).toEqual([]);
        expect(phoneLetterCombinations('2a3')).toEqual([]);
        expect(phoneLetterCombinationCount('10')).toBe(0);
    });
});
