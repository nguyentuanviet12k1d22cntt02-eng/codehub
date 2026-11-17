export type OutputComparisonPolicy = 'candidate_strict' | 'legacy_course' | 'legacy_practice';

/**
 * Normalizes text output for comparison.
 * Preserves leading whitespace and significant intra-line spacing,
 * but normalizes CRLF to LF and trims trailing newlines/spaces.
 */
export function normalizeTextOutput(text: string): string {
    if (typeof text !== 'string') return '';
    // Normalize CRLF to LF and trim only trailing newlines,
    // strictly preserving meaningful trailing/leading spaces, tabs, and indentation.
    return text.replace(/\r\n/g, '\n').replace(/\n+$/, '');
}

/**
 * Canonicalizes JSON values by sorting object keys recursively.
 */
export function canonicalizeJson(value: any): any {
    if (Array.isArray(value)) {
        return value.map(canonicalizeJson);
    }
    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.keys(value).sort().map(k => [k, canonicalizeJson(value[k])])
        );
    }
    return value;
}

/**
 * Compares two JSON outputs structurally.
 */
export function equalJsonOutput(actual: string, expected: string): boolean {
    try {
        const actNorm = normalizeTextOutput(actual);
        const expNorm = normalizeTextOutput(expected);
        const a = canonicalizeJson(JSON.parse(actNorm));
        const e = canonicalizeJson(JSON.parse(expNorm));
        return JSON.stringify(a) === JSON.stringify(e);
    } catch {
        return false;
    }
}

/**
 * Evaluates candidate Python output.
 * 
 * Rules:
 * 1. For text (stdio):
 *    - Rejects WRONG_PREFIX: no endsWith suffix matching that tolerates arbitrary prefix garbage.
 *    - Preserves meaningful leading spaces and intra-line characters.
 *    - Normalizes CRLF -> LF and trims trailing newlines.
 * 2. For json (function):
 *    - Deep structural equality with sorted keys.
 */
export function matchPythonOutput(
    actual: string,
    expected: string,
    comparator: 'text' | 'json' = 'text'
): { passed: boolean; failureReason?: string } {
    if (comparator === 'json') {
        const passed = equalJsonOutput(actual, expected);
        return {
            passed,
            failureReason: passed ? undefined : 'JSON_STRUCTURE_MISMATCH'
        };
    }

    const normActual = normalizeTextOutput(actual);
    const normExpected = normalizeTextOutput(expected);

    if (normActual === normExpected) {
        return { passed: true };
    }

    // Explicitly detect and reject WRONG_PREFIX defect
    if (normActual.endsWith(normExpected) && normActual.length > normExpected.length) {
        return {
            passed: false,
            failureReason: 'WRONG_PREFIX_DETECTED'
        };
    }

    return {
        passed: false,
        failureReason: 'TEXT_OUTPUT_MISMATCH'
    };
}

/**
 * Bài có đáp số là số thực mà đề không quy định cách làm tròn. Nội dung các bài
 * này được model r03 ghim (contentVersion), nên sửa ở cách chấm chứ không sửa đề:
 * so từng dòng, dòng nào cả hai là số thì chấp nhận lệch trong `tolerance`.
 */
export const NUMERIC_TOLERANCE_EXERCISES: Readonly<Record<string, number>> = Object.freeze({
    // LS-01.MP "Tính điểm thi cuối kỳ (có trọng số)": ck*0.5+gk*0.3+bt*0.2 in 7.8999999999999995.
    '45c415d2-ab5e-4b3f-a75c-e82622ba3eeb': 1e-6,
    // LS-01.MP "Tính toán chi phí sơn nhà": int(2*(d*c+r*c)*g) cắt 1679999.99… thành 1679999.
    'c087d75a-97f8-4065-9330-c99dd4ac4390': 1,
});

const NUMBER_LINE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

export function matchNumericOutput(actual: string, expected: string, tolerance: number): boolean {
    const a = normalizeTextOutput(actual).split('\n'), e = normalizeTextOutput(expected).split('\n');
    if (a.length !== e.length) return false;
    return e.every((line, i) => {
        const x = a[i].trim(), y = line.trim();
        if (NUMBER_LINE.test(x) && NUMBER_LINE.test(y)) return Math.abs(Number(x) - Number(y)) <= tolerance;
        return a[i] === line;
    });
}

/** Chấm output Python của bài trong khóa học; chỉ các bài trong danh sách trên mới được so số có sai số. */
export function matchCoursePythonOutput(exerciseId: string, actual: string, expected: string): boolean {
    if (matchPythonOutput(actual, expected, 'text').passed) return true;
    const tolerance = NUMERIC_TOLERANCE_EXERCISES[exerciseId];
    return tolerance !== undefined && matchNumericOutput(actual, expected, tolerance);
}
