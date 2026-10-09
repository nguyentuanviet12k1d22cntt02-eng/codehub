import { ExecuteResult } from '../../infrastructure/sandbox/sandbox.types';

export const INTERACTION_ERROR_TYPES = [
    'SYNTAX_ERROR',
    'COMPILE_ERROR',
    'RUNTIME_ERROR',
    'TIMEOUT',
    'WRONG_OUTPUT',
    'AST_VALIDATION_ERROR',
    'INFRA_ERROR',
] as const;

export type InteractionErrorType = typeof INTERACTION_ERROR_TYPES[number];

interface AstResultLike {
    isValid: boolean;
    error?: string | null;
}

interface TestResultLike {
    passed: boolean;
}

interface GradingDiagnosticsInput {
    language: string;
    allPassed: boolean;
    astResult: AstResultLike;
    executionResults: ExecuteResult[];
    testResults: TestResultLike[];
}

export interface GradingDiagnostics {
    errorType: InteractionErrorType | null;
    errorSummary: string | null;
    testsPassed: number;
    testsTotal: number;
}

const INFRA_ERROR_PATTERN = /docker(?: daemon| api|\.sock| not available)|cannot connect to the docker|sandbox (?:không|did not)|no such (?:container|image)|grading_interrupted/i;
const SYNTAX_ERROR_PATTERN = /\b(?:syntaxerror|indentationerror|taberror)\b|syntax error|unexpected token|unexpected end of input|unterminated (?:string|literal)|expected .* before/i;
const COMPILE_ERROR_PATTERN = /^\[Lỗi biên dịch |compilation (?:failed|error)|compiler error/i;

function sanitizeErrorSummary(value: string | null | undefined): string | null {
    if (!value) return null;

    const sanitized = value
        .replace(/\u001b\[[0-9;]*m/g, '')
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
        .replace(/(?:[A-Za-z]:\\|\/)(?:[^\s:'"<>|]+[\\/])+[^\s:'"<>|]*/g, '<path>')
        .replace(/\s+/g, ' ')
        .trim();

    return sanitized ? sanitized.slice(0, 500) : null;
}

function classifyExecutionError(result: ExecuteResult, language: string): InteractionErrorType | null {
    if (result.status === 'TIMEOUT') return 'TIMEOUT';
    if (result.status !== 'ERROR') return null;

    const stderr = result.stderr || '';
    if (INFRA_ERROR_PATTERN.test(stderr)) return 'INFRA_ERROR';
    if (/^(?:C|CPP)$/i.test(language) && COMPILE_ERROR_PATTERN.test(stderr)) return 'COMPILE_ERROR';
    if (SYNTAX_ERROR_PATTERN.test(stderr)) return 'SYNTAX_ERROR';
    if (COMPILE_ERROR_PATTERN.test(stderr)) return 'COMPILE_ERROR';

    // Batch C/C++ compilation errors are normally prefixed by the runner. This
    // fallback covers compiler variants that only emit the conventional marker.
    if (/^(?:C|CPP)$/i.test(language) && /(?:^|\n).+?:\d+(?::\d+)?:\s*(?:fatal\s+)?error:/i.test(stderr)) {
        return 'COMPILE_ERROR';
    }

    return 'RUNTIME_ERROR';
}

export function buildGradingDiagnostics(input: GradingDiagnosticsInput): GradingDiagnostics {
    const testsTotal = input.testResults.length;
    const testsPassed = input.testResults.filter(test => test.passed).length;

    if (input.allPassed) {
        return { errorType: null, errorSummary: null, testsPassed, testsTotal };
    }

    for (const executionResult of input.executionResults) {
        const errorType = classifyExecutionError(executionResult, input.language);
        if (errorType) {
            return {
                errorType,
                errorSummary: sanitizeErrorSummary(executionResult.stderr) || errorType,
                testsPassed,
                testsTotal,
            };
        }
    }

    if (!input.astResult.isValid) {
        return {
            errorType: 'AST_VALIDATION_ERROR',
            errorSummary: sanitizeErrorSummary(input.astResult.error) || 'AST_VALIDATION_ERROR',
            testsPassed,
            testsTotal,
        };
    }

    return {
        errorType: 'WRONG_OUTPUT',
        errorSummary: 'OUTPUT_MISMATCH',
        testsPassed,
        testsTotal,
    };
}
