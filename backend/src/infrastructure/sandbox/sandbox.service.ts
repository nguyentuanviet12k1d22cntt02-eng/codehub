import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { executeAwsDockerBatch } from './aws-docker/docker-grader.client';
import { parsePythonFileCase, preparePythonFileExecution } from './pythonFileCase';
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
    private assertAwsDocker(): void {
        const selected = (process.env.SANDBOX_PROVIDER || 'AWS_DOCKER').trim().toUpperCase();
        if (selected !== 'AWS_DOCKER') throw new Error('SANDBOX_PROVIDER_MUST_BE_AWS_DOCKER');
    }

    private sqlWrapper(): string {
        const deployed = path.join(__dirname, 'sql', 'sql.runner.py');
        const source = path.join(__dirname, '..', '..', '..', 'src', 'infrastructure', 'sandbox', 'sql', 'sql.runner.py');
        return readFileSync(existsSync(deployed) ? deployed : source, 'utf8');
    }

    public async execute(
        code: string,
        language: SupportedLanguage = 'PYTHON',
        options?: ExecutionOptions
    ): Promise<ExecuteResult> {
        this.assertAwsDocker();
        const fileExecution = language === 'PYTHON'
            ? preparePythonFileExecution(code, options?.inputData || '', options?.timeoutMs || 5000) : null;
        const results = await executeAwsDockerBatch(fileExecution?.code || (language === 'SQL' ? this.sqlWrapper() : code),
            language === 'SQL' ? 'PYTHON' : language, [fileExecution?.input ?? (language === 'SQL' ? code : options?.inputData || '')],
            options?.timeoutMs || 5000, {
            memoryKb: options?.memoryKb
        });
        return results[0];
    }

    /** SQL runs through a Python/SQLite wrapper inside the same EC2 Docker sandbox. */
    public async executeBatch(
        code: string,
        language: SupportedLanguage,
        inputData: string[],
        options?: BatchExecutionOptions
    ): Promise<ExecuteResult[]> {
        this.assertAwsDocker();
        const fileCases = language === 'PYTHON' ? inputData.map(parsePythonFileCase) : [];
        if (fileCases.some(fileCase => fileCase !== null)) {
            if (!inputData.length || inputData.length > 50) throw new Error('PYTHON_FILE_BATCH_SIZE_INVALID');
            // Validate every envelope/source limit before dispatching any remote request.
            inputData.forEach(input => preparePythonFileExecution(code, input, options?.timeoutMs || 5000));
            const results: ExecuteResult[] = [];
            // Each file testcase gets a separate remote request/container, preserving order.
            for (const input of inputData) results.push(await this.execute(code, language, {
                inputData: input, timeoutMs: options?.timeoutMs, memoryKb: options?.memoryKb
            }));
            return results;
        }
        return executeAwsDockerBatch(language === 'SQL' ? this.sqlWrapper() : code,
            language === 'SQL' ? 'PYTHON' : language, language === 'SQL' ? inputData.map(() => code) : inputData,
            options?.timeoutMs || 5000, { memoryKb: options?.memoryKb });
    }
}

export const sandboxService = new SandboxService();
export const executeCode = sandboxService.execute.bind(sandboxService);
export const executeCodeBatch = sandboxService.executeBatch.bind(sandboxService);
