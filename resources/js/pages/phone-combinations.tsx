import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import {
    PHONE_DIGIT_TO_LETTERS,
    isSupportedPhoneDigits,
    phoneLetterCombinationCount,
    phoneLetterCombinationsLimited,
    type PhoneDigit,
} from '@/lib/phoneCombinations';

const KEYPAD: Array<{ digit: PhoneDigit; letters: string }> = [
    { digit: '2', letters: PHONE_DIGIT_TO_LETTERS['2'] },
    { digit: '3', letters: PHONE_DIGIT_TO_LETTERS['3'] },
    { digit: '4', letters: PHONE_DIGIT_TO_LETTERS['4'] },
    { digit: '5', letters: PHONE_DIGIT_TO_LETTERS['5'] },
    { digit: '6', letters: PHONE_DIGIT_TO_LETTERS['6'] },
    { digit: '7', letters: PHONE_DIGIT_TO_LETTERS['7'] },
    { digit: '8', letters: PHONE_DIGIT_TO_LETTERS['8'] },
    { digit: '9', letters: PHONE_DIGIT_TO_LETTERS['9'] },
];

function sanitizeDigits(value: string): string {
    return value.replace(/[^2-9]/g, '');
}

export default function PhoneCombinationsPage() {
    const [digits, setDigits] = useState<string>('23');
    const [limitEnabled, setLimitEnabled] = useState(true);
    const limit = 5000;

    const { count, combinations, isLimited } = useMemo(() => {
        const c = phoneLetterCombinationCount(digits);

        if (digits === '') return { count: 1, combinations: [''] as string[], isLimited: false };
        if (!isSupportedPhoneDigits(digits)) return { count: 0, combinations: [] as string[], isLimited: false };

        if (limitEnabled && c > limit) {
            return {
                count: c,
                combinations: phoneLetterCombinationsLimited(digits, limit),
                isLimited: true,
            };
        }

        return {
            count: c,
            combinations: phoneLetterCombinationsLimited(digits, Number.POSITIVE_INFINITY),
            isLimited: false,
        };
    }, [digits, limitEnabled]);

    const onKeypadPress = (digit: PhoneDigit) => setDigits((prev) => `${prev}${digit}`);
    const onBackspace = () => setDigits((prev) => prev.slice(0, -1));
    const onClear = () => setDigits('');

    const invalid = digits.length > 0 && !isSupportedPhoneDigits(digits);

    return (
        <>
            <Head title="Phone Letter Combinations" />

            <div className="min-h-screen bg-[#FDFDFC] p-6 text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="mb-6 flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold">Phone keypad letter combinations</h1>
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Enter digits 2–9 and generate all possible letter combinations.</p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <section className="rounded-lg bg-white p-5 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <div className="mb-4 flex flex-col gap-2">
                                <label className="text-sm font-medium" htmlFor="digits">
                                    Digits
                                </label>
                                <input
                                    id="digits"
                                    value={digits}
                                    inputMode="numeric"
                                    placeholder="e.g. 23"
                                    onChange={(e) => setDigits(sanitizeDigits(e.target.value))}
                                    className="w-full rounded-md border border-black/10 bg-white px-3 py-2 font-mono text-base ring-0 outline-none focus:border-black/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:focus:border-white/25"
                                />
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={onBackspace}
                                        className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm hover:border-black/20 dark:border-white/10 dark:bg-[#0f0f0f] dark:hover:border-white/20"
                                    >
                                        Backspace
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClear}
                                        className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm hover:border-black/20 dark:border-white/10 dark:bg-[#0f0f0f] dark:hover:border-white/20"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDigits('23')}
                                        className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm hover:border-black/20 dark:border-white/10 dark:bg-[#0f0f0f] dark:hover:border-white/20"
                                    >
                                        Example: 23
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDigits('2')}
                                        className="rounded-md border border-black/10 bg-white px-3 py-1.5 text-sm hover:border-black/20 dark:border-white/10 dark:bg-[#0f0f0f] dark:hover:border-white/20"
                                    >
                                        Example: 2
                                    </button>
                                </div>
                            </div>

                            {invalid ? (
                                <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
                                    Digits must be 2–9 only.
                                </div>
                            ) : null}

                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="text-sm">
                                    <div>
                                        <span className="font-medium">Combinations:</span> {count.toLocaleString()}
                                    </div>
                                    {isLimited ? (
                                        <div className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                            Displaying first {limit.toLocaleString()} only (enable “show all” to display everything).
                                        </div>
                                    ) : null}
                                </div>

                                <label className="flex items-center gap-2 text-sm select-none">
                                    <input
                                        type="checkbox"
                                        checked={limitEnabled}
                                        onChange={(e) => setLimitEnabled(e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    Limit output
                                </label>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {KEYPAD.map(({ digit, letters }) => {
                                    const active = digits.includes(digit);

                                    return (
                                        <button
                                            key={digit}
                                            type="button"
                                            onClick={() => onKeypadPress(digit)}
                                            className={
                                                'rounded-lg border px-3 py-3 text-left transition-colors ' +
                                                (active
                                                    ? 'border-[#f53003]/40 bg-[#fff2f2] dark:border-[#FF4433]/35 dark:bg-[#1D0002]'
                                                    : 'border-black/10 bg-white hover:border-black/20 dark:border-white/10 dark:bg-[#0f0f0f] dark:hover:border-white/20')
                                            }
                                        >
                                            <div className="text-lg font-semibold">{digit}</div>
                                            <div className="text-xs tracking-wide text-[#706f6c] uppercase dark:text-[#A1A09A]">{letters}</div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-4 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                Tip: you can type digits, or click the keypad buttons.
                            </div>
                        </section>

                        <section className="rounded-lg bg-white p-5 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <div className="mb-3 flex items-baseline justify-between gap-3">
                                <h2 className="text-lg font-semibold">Results</h2>
                                <div className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                    Showing {combinations.length.toLocaleString()} item(s)
                                </div>
                            </div>

                            {combinations.length === 0 ? (
                                <div className="rounded-md border border-black/10 bg-black/5 p-4 text-sm dark:border-white/10 dark:bg-white/5">
                                    No combinations (digits must be 2–9).
                                </div>
                            ) : (
                                <div className="max-h-[70vh] overflow-auto rounded-md border border-black/10 p-3 dark:border-white/10">
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                                        {combinations.map((combo) => (
                                            <div key={combo} className="rounded-md bg-black/5 px-2 py-1 font-mono text-sm dark:bg-white/5">
                                                {combo === '' ? '""' : combo}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
