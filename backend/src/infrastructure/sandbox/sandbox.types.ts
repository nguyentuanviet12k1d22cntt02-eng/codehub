/**
 * Định nghĩa kiểu dữ liệu cho Sandbox Execution Engine
 */

export type SupportedLanguage = 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'C' | 'SQL' | 'JAVA';

export interface ExecuteResult {
    stdout: string;
    stderr: string;
    status: 'SUCCESS' | 'TIMEOUT' | 'ERROR';
    runtimeMs: number;
}

export interface ExecutionOptions {
    inputData?: string;
    timeoutMs?: number;
    memoryLimit?: string;
}

export interface BatchExecutionOptions extends Omit<ExecutionOptions, 'inputData'> {
    compileTimeoutMs?: number;
}

export interface ICodeRunner {
    readonly language: SupportedLanguage;
    run(code: string, options?: ExecutionOptions): Promise<ExecuteResult>;
}
