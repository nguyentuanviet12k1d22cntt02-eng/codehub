/**
 * Validator and semantic checker helpers for Practice problems:
 * - Add Two Numbers (UUID: 01cae930-03ea-433b-a69b-d95d1cc54e05)
 * - Two Sum (UUID: 1ffd40d0-2ecb-43a6-b68c-a2917c002885)
 */

export interface AddTwoNumbersValidationResult {
    valid: boolean;
    reason?: string;
    details?: string;
    n1?: number;
    l1?: number[];
    n2?: number;
    l2?: number[];
}

/**
 * Validates Add Two Numbers input according to system contract:
 * - Line 1: N1 (positive integer >= 1)
 * - Line 2: N1 single digits (0-9) separated by whitespace; if N1 > 1, last digit is not 0
 * - Line 3: N2 (positive integer >= 1)
 * - Line 4: N2 single digits (0-9) separated by whitespace; if N2 > 1, last digit is not 0
 * 
 * Does NOT execute reference code.
 */
export function validateAddTwoNumbersInput(raw: string): AddTwoNumbersValidationResult {
    if (typeof raw !== 'string') {
        return { valid: false, reason: 'INPUT_NOT_STRING' };
    }

    // Normalize CRLF to LF and trim only trailing newlines
    const lines = raw.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n');
    if (lines.length !== 4) {
        return {
            valid: false,
            reason: 'LINE_COUNT_MISMATCH',
            details: `Expected exactly 4 lines (N1, list1, N2, list2), received ${lines.length}`
        };
    }

    // Line 1: N1
    const n1Str = lines[0].trim();
    if (!/^\d+$/.test(n1Str)) {
        return { valid: false, reason: 'N1_NOT_INTEGER', details: `Line 1 '${n1Str}' is not a valid non-negative integer` };
    }
    const n1 = parseInt(n1Str, 10);
    if (n1 < 1) {
        return { valid: false, reason: 'N1_EMPTY_LIST', details: 'N1 must be >= 1 for non-empty linked list' };
    }

    // Line 2: l1 digits
    const l1Tokens = lines[1].trim().split(/\s+/);
    if (l1Tokens.length !== n1) {
        return {
            valid: false,
            reason: 'L1_LENGTH_MISMATCH',
            details: `N1 specified ${n1} elements, but line 2 has ${l1Tokens.length} tokens`
        };
    }
    for (const t of l1Tokens) {
        if (!/^\d$/.test(t)) {
            return {
                valid: false,
                reason: 'L1_INVALID_DIGIT',
                details: `Token '${t}' is not a single digit 0-9`
            };
        }
    }
    if (n1 > 1 && l1Tokens[l1Tokens.length - 1] === '0') {
        return {
            valid: false,
            reason: 'L1_LEADING_ZERO',
            details: 'Number cannot contain leading zeros (most significant digit, at the end, is 0)'
        };
    }

    // Line 3: N2
    const n2Str = lines[2].trim();
    if (!/^\d+$/.test(n2Str)) {
        return { valid: false, reason: 'N2_NOT_INTEGER', details: `Line 3 '${n2Str}' is not a valid non-negative integer` };
    }
    const n2 = parseInt(n2Str, 10);
    if (n2 < 1) {
        return { valid: false, reason: 'N2_EMPTY_LIST', details: 'N2 must be >= 1 for non-empty linked list' };
    }

    // Line 4: l2 digits
    const l2Tokens = lines[3].trim().split(/\s+/);
    if (l2Tokens.length !== n2) {
        return {
            valid: false,
            reason: 'L2_LENGTH_MISMATCH',
            details: `N2 specified ${n2} elements, but line 4 has ${l2Tokens.length} tokens`
        };
    }
    for (const t of l2Tokens) {
        if (!/^\d$/.test(t)) {
            return {
                valid: false,
                reason: 'L2_INVALID_DIGIT',
                details: `Token '${t}' is not a single digit 0-9`
            };
        }
    }
    if (n2 > 1 && l2Tokens[l2Tokens.length - 1] === '0') {
        return {
            valid: false,
            reason: 'L2_LEADING_ZERO',
            details: 'Number cannot contain leading zeros (most significant digit, at the end, is 0)'
        };
    }

    return {
        valid: true,
        n1,
        l1: l1Tokens.map(Number),
        n2,
        l2: l2Tokens.map(Number)
    };
}

/**
 * Independent oracle for Add Two Numbers using BigInt arbitrary-precision arithmetic.
 * Overloaded to support both (l1, l2) and (n1, l1, n2, l2).
 */
export function addTwoNumbersOracle(l1: number[], l2: number[]): string;
export function addTwoNumbersOracle(n1: number, l1: number[], n2: number, l2: number[]): string;
export function addTwoNumbersOracle(arg1: any, arg2: any, arg3?: any, arg4?: any): string {
    const l1: number[] = Array.isArray(arg1) ? arg1 : arg2;
    const l2: number[] = Array.isArray(arg1) ? arg2 : arg4;
    const num1 = BigInt(l1.slice().reverse().join(''));
    const num2 = BigInt(l2.slice().reverse().join(''));
    const sumVal = num1 + num2;
    return sumVal.toString().split('').reverse().join(' ');
}

export interface ParsedTwoSumInput {
    valid: boolean;
    reason?: string;
    details?: string;
    n?: number;
    nums?: bigint[];
    target?: bigint;
}

/**
 * Shared strict parser for Two Sum standard input:
 * - Line 1: N (integer >= 2, safe integer)
 * - Line 2: N integers separated by whitespace (represented as BigInt)
 * - Line 3: target integer (represented as BigInt)
 * 
 * Rejects inputs that:
 * - Do not have exactly 3 lines (e.g. all on 1 line)
 * - Contain partial non-numeric tokens (suffixes like 2abc, fractions like 2.5)
 * - Contain token count mismatch on line 2
 */
export function parseTwoSumInput(rawInput: string): ParsedTwoSumInput {
    if (typeof rawInput !== 'string') {
        return { valid: false, reason: 'INPUT_NOT_STRING' };
    }

    // Normalize CRLF to LF and trim only trailing newlines
    const normalized = rawInput.replace(/\r\n/g, '\n').replace(/\n+$/, '');
    const lines = normalized.split('\n');
    if (lines.length !== 3) {
        return {
            valid: false,
            reason: 'LINE_COUNT_MISMATCH',
            details: `Expected exactly 3 lines (N, nums, target), received ${lines.length}`
        };
    }

    // Line 1: N
    const nStr = lines[0].trim();
    if (!/^\d+$/.test(nStr)) {
        return {
            valid: false,
            reason: 'INVALID_N_NOT_INTEGER',
            details: `Line 1 '${nStr}' is not a valid non-negative integer`
        };
    }
    const n = Number(nStr);
    if (!Number.isSafeInteger(n) || n < 2) {
        return {
            valid: false,
            reason: 'INVALID_ARRAY_LENGTH_N',
            details: `N must be a safe integer >= 2, received ${n}`
        };
    }

    // Line 2: nums
    const trimmedLine1 = lines[1].trim();
    const numTokens = trimmedLine1 === '' ? [] : trimmedLine1.split(/\s+/);
    if (numTokens.length !== n) {
        return {
            valid: false,
            reason: 'TOKEN_COUNT_MISMATCH',
            details: `Line 2 specifies ${numTokens.length} tokens, but N=${n}`
        };
    }

    const nums: bigint[] = [];
    for (let i = 0; i < n; i++) {
        const token = numTokens[i];
        if (!/^-?\d+$/.test(token)) {
            return {
                valid: false,
                reason: 'NON_INTEGER_ELEMENT_IN_NUMS',
                details: `Element at index ${i} ('${token}') is not a complete integer`
            };
        }
        nums.push(BigInt(token));
    }

    // Line 3: target
    const targetStr = lines[2].trim();
    if (!/^-?\d+$/.test(targetStr)) {
        return {
            valid: false,
            reason: 'NON_INTEGER_TARGET',
            details: `Target '${targetStr}' is not a complete integer`
        };
    }
    const target = BigInt(targetStr);

    return {
        valid: true,
        n,
        nums,
        target
    };
}

export interface TwoSumUniquenessResult {
    valid: boolean;
    reason?: string;
    details?: string;
    n?: number;
    nums?: bigint[];
    target?: bigint;
    pairs?: [number, number][];
}

/**
 * Validates Two Sum problem assumption:
 * "Bạn có thể giả định rằng mỗi đầu vào sẽ có chính xác một giải pháp"
 * 
 * Uses shared strict parser and BigInt arithmetic for precision.
 * Enumerates all index pairs (i, j) where 0 <= i < j < N and nums[i] + nums[j] === target.
 * Rejects inputs with 0 solutions or >1 solutions.
 */
export function validateTwoSumUniqueness(rawInput: string): TwoSumUniquenessResult {
    const parsed = parseTwoSumInput(rawInput);
    if (!parsed.valid) {
        return {
            valid: false,
            reason: parsed.reason,
            details: parsed.details
        };
    }

    const { n, nums, target } = parsed;
    const pairs: [number, number][] = [];
    for (let i = 0; i < n!; i++) {
        for (let j = i + 1; j < n!; j++) {
            if (nums![i] + nums![j] === target!) {
                pairs.push([i, j]);
            }
        }
    }

    if (pairs.length === 0) {
        return {
            valid: false,
            reason: 'NO_SOLUTION',
            details: `No two numbers in array sum to target ${target}`,
            n,
            nums,
            target,
            pairs
        };
    }

    if (pairs.length > 1) {
        return {
            valid: false,
            reason: 'MULTIPLE_SOLUTIONS',
            details: `Found ${pairs.length} solutions: ${JSON.stringify(pairs)}, violating exact single solution assumption`,
            n,
            nums,
            target,
            pairs
        };
    }

    return {
        valid: true,
        n,
        nums,
        target,
        pairs
    };
}

export interface TwoSumSemanticResult {
    passed: boolean;
    failureReason?: string;
    details?: string;
    idx1?: number;
    idx2?: number;
}

/**
 * Semantic checker for Two Sum:
 * - Input parsed via shared strict parseTwoSumInput.
 * - Output Grammar: Exactly two non-negative integers on a single line separated by whitespace.
 * - Rejects multiline output (e.g. '0\n1') per problem specification: "In ra chỉ số của hai số trên cùng một dòng, phân tách bởi khoảng trắng."
 * - Order independent: [0, 1] and [1, 0] are both valid.
 * - Rejects:
 *   - Duplicate index (idx1 === idx2)
 *   - Out of bounds (< 0 or >= N)
 *   - Sum mismatch (nums[idx1] + nums[idx2] !== target, BigInt arithmetic)
 *   - Extra tokens, non-integers, brackets, unparseable output
 */
export function checkTwoSumSemanticOutput(actualOutput: string, rawInput: string): TwoSumSemanticResult {
    // Validate input via shared strict parser
    const parsed = parseTwoSumInput(rawInput);
    if (!parsed.valid) {
        return {
            passed: false,
            failureReason: parsed.reason,
            details: parsed.details
        };
    }

    if (typeof actualOutput !== 'string') {
        return { passed: false, failureReason: 'OUTPUT_NOT_STRING' };
    }

    // Normalize CRLF to LF and trim trailing newlines
    const cleanActual = actualOutput.replace(/\r\n/g, '\n').replace(/\n+$/, '');
    if (!cleanActual.trim()) {
        return { passed: false, failureReason: 'EMPTY_OUTPUT' };
    }

    // Problem specification: "In ra chỉ số của hai số trên cùng một dòng, phân tách bởi khoảng trắng."
    // Reject multiline outputs
    if (cleanActual.includes('\n')) {
        return {
            passed: false,
            failureReason: 'MULTILINE_OUTPUT_MISMATCH',
            details: 'Output must be on a single line separated by whitespace'
        };
    }

    // Grammar check on single line output
    const outputTokens = cleanActual.trim().split(/\s+/);
    if (outputTokens.length < 2) {
        return { passed: false, failureReason: 'INSUFFICIENT_TOKENS' };
    }
    if (outputTokens.length > 2) {
        return { passed: false, failureReason: 'EXTRA_TOKENS' };
    }

    const [t1, t2] = outputTokens;
    if (!/^\d+$/.test(t1) || !/^\d+$/.test(t2)) {
        return { passed: false, failureReason: 'NON_INTEGER_OR_NEGATIVE_INDEX' };
    }

    const idx1 = Number(t1);
    const idx2 = Number(t2);

    if (!Number.isSafeInteger(idx1) || !Number.isSafeInteger(idx2)) {
        return { passed: false, failureReason: 'UNSAFE_INDEX_INTEGER' };
    }

    // Bounds check
    const n = parsed.n!;
    if (idx1 < 0 || idx1 >= n || idx2 < 0 || idx2 >= n) {
        return {
            passed: false,
            failureReason: 'INDEX_OUT_OF_BOUNDS',
            details: `Index [${idx1}, ${idx2}] out of range [0, ${n - 1}]`
        };
    }

    // Distinct index check: "không thể sử dụng cùng một phần tử hai lần"
    if (idx1 === idx2) {
        return {
            passed: false,
            failureReason: 'DUPLICATE_INDEX',
            details: `Cannot use the same index twice (${idx1})`
        };
    }

    // Exact BigInt sum check
    const sumVal = parsed.nums![idx1] + parsed.nums![idx2];
    if (sumVal !== parsed.target!) {
        return {
            passed: false,
            failureReason: 'SUM_MISMATCH',
            details: `nums[${idx1}](${parsed.nums![idx1]}) + nums[${idx2}](${parsed.nums![idx2]}) = ${sumVal} !== target ${parsed.target}`
        };
    }

    return {
        passed: true,
        idx1,
        idx2
    };
}
