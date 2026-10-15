import {
    ICodeRunner,
    SupportedLanguage,
    ExecuteResult,
    ExecutionOptions,
    BatchExecutionOptions
} from './sandbox.types';
import { PythonRunner } from './python/python.runner';
import { SqlRunner } from './sql/sql.runner';
import { JavaScriptRunner } from './js/js.runner';
import { CppRunner } from './cpp/cpp.runner';
import { BatchCodeRunner } from './batch/batch.runner';
import { executeJudge0, useJudge0 } from './judge0/judge0.client';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

function requireSafeProvider(): void {
    if (process.env.NODE_ENV === 'production' || process.env.ALLOW_LOCAL_SANDBOX === 'false') {
        throw new Error('RUNNER_UNAVAILABLE: Configure SANDBOX_PROVIDER=judge0 for isolated execution.');
    }
}

export class SandboxService {
    private runners: Map<SupportedLanguage, ICodeRunner> = new Map();
    private readonly batchRunner = new BatchCodeRunner();

    constructor() {
        // Đăng ký mặc định các runner ngôn ngữ trong các thư mục chuyên biệt
        this.registerRunner(new PythonRunner());
        this.registerRunner(new SqlRunner());
        this.registerRunner(new JavaScriptRunner());
        this.registerRunner(new CppRunner('CPP'));
        this.registerRunner(new CppRunner('C'));
    }

    /**
     * Đăng ký một Code Runner mới vào hệ thống (Mở rộng cho Java, Rust, Go...)
     */
    public registerRunner(runner: ICodeRunner): void {
        this.runners.set(runner.language, runner);
    }

    /**
     * Lấy runner tương ứng với ngôn ngữ yêu cầu
     */
    public getRunner(language: SupportedLanguage): ICodeRunner {
        const runner = this.runners.get(language);
        if (!runner) {
            throw new Error(`[SandboxService] Ngôn ngữ '${language}' chưa được hỗ trợ bởi Sandbox Engine.`);
        }
        return runner;
    }

    /**
     * Thực thi mã nguồn theo Runner Pattern
     */
    public async execute(
        code: string,
        language: SupportedLanguage = 'PYTHON',
        options?: ExecutionOptions
    ): Promise<ExecuteResult> {
        if (useJudge0()) {
            if (language === 'SQL') {
                const deployed = path.join(__dirname, 'sql', 'sql.runner.py');
                const source = path.join(__dirname, '..', '..', '..', 'src', 'infrastructure', 'sandbox', 'sql', 'sql.runner.py');
                const wrapper = readFileSync(existsSync(deployed) ? deployed : source, 'utf8');
                return executeJudge0(wrapper, 'PYTHON', code, options?.timeoutMs || 5000);
            }
            return executeJudge0(code, language, options?.inputData || '', options?.timeoutMs || 5000);
        }
        requireSafeProvider();
        if (language === 'SQL' || language === 'JAVA') {
            throw new Error('RUNNER_UNAVAILABLE: Isolated local runner unavailable for this language.');
        }
        const [result] = await this.batchRunner.run(code, language, [options?.inputData || ''], {
            timeoutMs: options?.timeoutMs, memoryLimit: options?.memoryLimit, strictIsolation: true
        });
        return result;
    }

    /** Chấm từng testcase qua Judge0, hoặc trong một Docker container cách ly khi chạy cục bộ. */
    public async executeBatch(
        code: string,
        language: SupportedLanguage,
        inputData: string[],
        options?: BatchExecutionOptions
    ): Promise<ExecuteResult[]> {
        if (useJudge0()) {
            const results: ExecuteResult[] = [];
            for (const input of inputData) results.push(await this.execute(code, language, {...options, inputData: input}));
            return results;
        }
        requireSafeProvider();
        if (language !== 'PYTHON' && language !== 'JAVASCRIPT' && language !== 'CPP' && language !== 'C') {
            const { compileTimeoutMs: _compileTimeoutMs, ...executionOptions } = options || {};
            return Promise.all(inputData.map((input) => this.execute(code, language, {
                ...executionOptions,
                inputData: input
            })));
        }
        return this.batchRunner.run(code, language, inputData, {...options, strictIsolation: true});
    }

    /**
     * Phương thức tiện ích duy trì tương thích ngược 100% với chữ ký cũ
     */
    public async runCodeInDocker(
        userCode: string,
        language: SupportedLanguage = 'PYTHON',
        inputData: string = '',
        timeoutMs?: number
    ): Promise<ExecuteResult> {
        return this.execute(userCode, language, {
            inputData,
            timeoutMs
        });
    }
}

// Export singleton instance dùng chung toàn hệ thống
export const sandboxService = new SandboxService();

// Export hàm runCodeInDocker tiện ích trực tiếp
export const runCodeInDocker = sandboxService.runCodeInDocker.bind(sandboxService);
export const runCodeBatch = sandboxService.executeBatch.bind(sandboxService);
