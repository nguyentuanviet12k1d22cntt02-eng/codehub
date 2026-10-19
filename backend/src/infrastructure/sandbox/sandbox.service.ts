import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { executeJudge0 } from './judge0/judge0.client';
import { executeAwsDockerBatch } from './aws-docker/docker-grader.client';
import {
    SupportedLanguage,
    ExecuteResult,
    ExecutionOptions,
    BatchExecutionOptions
} from './sandbox.types';

/**
 * Untrusted source code is always delegated to a remote isolated provider.
 * The Render backend never starts local processes or owns a Docker daemon.
 */
export class SandboxService {
    private provider(language: SupportedLanguage): 'JUDGE0' | 'AWS_DOCKER' {
        // The project SQL exercises use a dedicated Judge0 Python wrapper. The
        // AWS Docker service intentionally has no SQL runner in this phase.
        if (language === 'SQL') return 'JUDGE0';
        const selected = (process.env.SANDBOX_PROVIDER || 'JUDGE0').trim().toUpperCase();
        if (selected !== 'JUDGE0' && selected !== 'AWS_DOCKER') throw new Error('SANDBOX_PROVIDER_INVALID');
        return selected;
    }

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
        if (this.provider(language) === 'AWS_DOCKER') {
            const results = await executeAwsDockerBatch(code, language, [options?.inputData || ''], options?.timeoutMs || 5000, {
                memoryKb: options?.memoryKb,
            });
            return results[0];
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
        if (language !== 'SQL' && this.provider(language) === 'AWS_DOCKER') {
            return executeAwsDockerBatch(code, language, inputData, options?.timeoutMs || 5000, {
                memoryKb: options?.memoryKb,
            });
        }
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
