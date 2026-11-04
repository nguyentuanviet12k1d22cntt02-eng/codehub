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
