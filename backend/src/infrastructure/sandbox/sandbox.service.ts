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
        const runner = this.getRunner(language);
        return runner.run(code, options);
    }

    /**
     * Chấm nhiều testcase trong cùng một sandbox. C++ chỉ được biên dịch một lần;
     * Python và JavaScript cũng chỉ khởi tạo một container cho toàn bộ lượt nộp.
     */
    public async executeBatch(
        code: string,
        language: SupportedLanguage,
        inputData: string[],
        options?: BatchExecutionOptions
    ): Promise<ExecuteResult[]> {
        if (language !== 'PYTHON' && language !== 'JAVASCRIPT' && language !== 'CPP' && language !== 'C') {
            const { compileTimeoutMs: _compileTimeoutMs, ...executionOptions } = options || {};
            return Promise.all(inputData.map((input) => this.execute(code, language, {
                ...executionOptions,
                inputData: input
            })));
        }
        return this.batchRunner.run(code, language, inputData, options);
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
