import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { executeJudge0 } from './judge0/judge0.client';
import {
    SupportedLanguage,
    ExecuteResult,
    ExecutionOptions,
    BatchExecutionOptions
} from './sandbox.types';

/**
 * Judge0 is the only execution backend. Untrusted source code is never
 * executed by a local process or by a Docker daemon owned by this backend.
 */
export class SandboxService {
    public async execute(
        code: string,
        language: SupportedLanguage = 'PYTHON',
        options?: ExecutionOptions
    ): Promise<ExecuteResult> {
        if (language === 'SQL') {
            const deployed = path.join(__dirname, 'sql', 'sql.runner.py');
            const source = path.join(__dirname, '..', '..', '..', 'src', 'infrastructure', 'sandbox', 'sql', 'sql.runner.py');
            const wrapper = readFileSync(existsSync(deployed) ? deployed : source, 'utf8');
            return executeJudge0(wrapper, 'PYTHON', code, options?.timeoutMs || 5000, {
                memoryKb: options?.memoryKb
            });
        }
        return executeJudge0(code, language, options?.inputData || '', options?.timeoutMs || 5000, {
            memoryKb: options?.memoryKb
        });
    }

    /** One independent Judge0 submission is created for every testcase. */
    public async executeBatch(
        code: string,
        language: SupportedLanguage,
        inputData: string[],
        options?: BatchExecutionOptions
    ): Promise<ExecuteResult[]> {
        const results: ExecuteResult[] = [];
        for (const input of inputData) {
            results.push(await this.execute(code, language, { ...options, inputData: input }));
        }
        return results;
    }
}

export const sandboxService = new SandboxService();
export const executeCode = sandboxService.execute.bind(sandboxService);
export const executeCodeBatch = sandboxService.executeBatch.bind(sandboxService);
