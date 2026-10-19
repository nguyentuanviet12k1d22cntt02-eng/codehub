/**
 * Định nghĩa kiểu dữ liệu cho Sandbox Execution Engine
 */

export type SupportedLanguage = 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'C' | 'SQL' | 'JAVA';

export interface ExecuteResult {
    stdout: string;
    stderr: string;
    status: 'SUCCESS' | 'TIMEOUT' | 'ERROR';
    runtimeMs: number;
    failureType?: 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'OUTPUT_LIMIT_EXCEEDED' | 'INTERNAL_ERROR';
    provider?: 'judge0' | 'aws-docker';
}

export interface ExecutionOptions {
    inputData?: string;
    timeoutMs?: number;
    memoryKb?: number;
}

export interface BatchExecutionOptions extends Omit<ExecutionOptions, 'inputData'> {
}
