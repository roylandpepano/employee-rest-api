export const PHONE_DIGIT_TO_LETTERS = {
    '2': 'abc',
    '3': 'def',
    '4': 'ghi',
    '5': 'jkl',
    '6': 'mno',
    '7': 'pqrs',
    '8': 'tuv',
    '9': 'wxyz',
} as const;

export type PhoneDigit = keyof typeof PHONE_DIGIT_TO_LETTERS;

export function isSupportedPhoneDigits(digits: string): boolean {
    return /^[2-9]*$/.test(digits);
}

export function phoneLetterCombinations(digits: string): string[] {
    if (!digits) return [''];
    if (!isSupportedPhoneDigits(digits)) return [];

    const results: string[] = [];
    const path: string[] = [];

    const backtrack = (index: number) => {
        if (index === digits.length) {
            results.push(path.join(''));
            return;
        }

        const digit = digits[index] as PhoneDigit;
        const letters = PHONE_DIGIT_TO_LETTERS[digit];

        for (const letter of letters) {
            path.push(letter);
            backtrack(index + 1);
            path.pop();
        }
    };

    backtrack(0);
    return results;
}

export function phoneLetterCombinationsLimited(digits: string, limit: number): string[] {
    if (!digits) return limit > 0 ? [''] : [];
    if (!isSupportedPhoneDigits(digits)) return [];
    if (limit <= 0) return [];

    const results: string[] = [];
    const path: string[] = [];

    const backtrack = (index: number) => {
        if (results.length >= limit) return;

        if (index === digits.length) {
            results.push(path.join(''));
            return;
        }

        const digit = digits[index] as PhoneDigit;
        const letters = PHONE_DIGIT_TO_LETTERS[digit];

        for (const letter of letters) {
            if (results.length >= limit) return;
            path.push(letter);
            backtrack(index + 1);
            path.pop();
        }
    };

    backtrack(0);
    return results;
}

export function phoneLetterCombinationCount(digits: string): number {
    if (!digits) return 1;
    if (!isSupportedPhoneDigits(digits)) return 0;

    let count = 1;
    for (const d of digits) {
        const digit = d as PhoneDigit;
        count *= PHONE_DIGIT_TO_LETTERS[digit].length;
    }

    return count;
}
