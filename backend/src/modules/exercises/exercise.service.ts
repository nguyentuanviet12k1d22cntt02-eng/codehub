import { codeExecutionQueue } from '../../infrastructure/queue/queueService';
import { sandboxService } from '../../infrastructure/sandbox/sandbox.service';
import { SupportedLanguage, ExecuteResult } from '../../infrastructure/sandbox/sandbox.types';

export interface TestCaseEvaluation {
    id: string;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    runtimeMs: number;
}

export interface EvaluationResult {
    allPassed: boolean;
    totalRuntimeMs: number;
    results: TestCaseEvaluation[];
}

export class ExerciseService {
    /**
     * Chạy thử mã nguồn (không qua test case)
     */
    public async runDynamicCode(
        code: string,
        language: SupportedLanguage = 'PYTHON',
        input: string = '',
        timeoutMs: number = 5000
    ): Promise<ExecuteResult> {
        return codeExecutionQueue.pushJob(code, language, input, timeoutMs);
    }

    /**
     * Chạy trực tiếp qua Sandbox Service (không qua hàng đợi, phục vụ test nội bộ)
     */
    public async executeDirect(
        code: string,
        language: SupportedLanguage = 'PYTHON',
        input: string = '',
        timeoutMs: number = 5000
    ): Promise<ExecuteResult> {
        return sandboxService.execute(code, language, { inputData: input, timeoutMs });
    }

    /**
     * Chấm điểm mã nguồn với danh sách Test Cases
     */
    public async evaluateTestCases(
        code: string,
        language: SupportedLanguage,
        testCases: Array<{ id: string; input: string; expectedOutput: string }>,
        timeoutMs: number = 5000
    ): Promise<EvaluationResult> {
        let totalRuntimeMs = 0;

        const results = await Promise.all(
            testCases.map(async (tc) => {
                try {
                    const result = await codeExecutionQueue.pushJob(code, language, tc.input, timeoutMs);
                    totalRuntimeMs += result.runtimeMs;

                    if (result.status === 'TIMEOUT') {
                        return {
                            id: tc.id,
                            input: tc.input,
                            expectedOutput: tc.expectedOutput,
                            actualOutput: `Lỗi: Quá thời gian thực thi (${timeoutMs / 1000}s)`,
                            passed: false,
                            runtimeMs: result.runtimeMs
                        };
                    }

                    const matchOutput = (act: string, exp: string): boolean => {
                        const cleanActual = act.replace(/\r\n/g, '\n').trim().replace(/\s+/g, ' ');
                        const cleanExpected = exp.replace(/\r\n/g, '\n').trim().replace(/\s+/g, ' ');
                        if (cleanActual === cleanExpected) return true;
                        if (cleanActual.endsWith(cleanExpected)) return true;
                        return false;
                    };

                    const isPassed = result.status === 'SUCCESS' && matchOutput(result.stdout, tc.expectedOutput);

                    return {
                        id: tc.id,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        actualOutput: result.status === 'SUCCESS' ? result.stdout.trim() : (result.stderr || 'Lỗi thực thi').trim(),
                        passed: isPassed,
                        runtimeMs: result.runtimeMs
                    };
                } catch (err: any) {
                    return {
                        id: tc.id,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        actualOutput: `Lỗi hệ thống: ${err.message}`,
                        passed: false,
                        runtimeMs: 0
                    };
                }
            })
        );

        const allPassed = results.length > 0 && results.every((r) => r.passed);
        return { allPassed, totalRuntimeMs, results };
    }
}

export const exerciseService = new ExerciseService();
