import { executeCode, executeCodeBatch } from '../sandbox/sandbox.service';
import { BatchExecutionOptions, ExecuteResult, SupportedLanguage } from '../sandbox/sandbox.types';

type QueueExecutionResult = ExecuteResult | ExecuteResult[];

interface ExecutionJob {
    id: string;
    language: SupportedLanguage;
    execute: () => Promise<QueueExecutionResult>;
    resolve: (value: QueueExecutionResult) => void;
    reject: (reason: any) => void;
}

class CodeExecutionQueue {
    private queue: ExecutionJob[] = [];
    private activeCount = 0;
    private readonly maxConcurrency: number;

    constructor(maxConcurrency: number = 4) {
        this.maxConcurrency = maxConcurrency;
    }

    /**
     * Đẩy một yêu cầu chạy code vào hàng đợi và đợi kết quả.
     * Sử dụng crypto timestamp để đảm bảo ID unique, tránh race condition.
     */
    public pushJob(
        userCode: string,
        language: SupportedLanguage = 'PYTHON',
        inputData: string = '',
        timeoutMs?: number
    ): Promise<ExecuteResult> {
        const actualTimeout = timeoutMs ?? this.defaultTimeout(language);
        return this.enqueue(language, () => executeCode(userCode, language, {
            inputData,
            timeoutMs: actualTimeout
        })) as Promise<ExecuteResult>;
    }

    /**
     * Một job batch chiếm đúng một slot trong queue, dù nó có nhiều testcase.
     * Nhờ vậy một lượt nộp không chiếm nhiều slot Judge0 cạnh tranh với chính nó.
     */
    public pushBatchJob(
        userCode: string,
        language: SupportedLanguage,
        inputs: string[],
        options?: BatchExecutionOptions
    ): Promise<ExecuteResult[]> {
        const timeoutMs = options?.timeoutMs ?? this.defaultTimeout(language);
        return this.enqueue(language, () => executeCodeBatch(userCode, language, inputs, {
            ...options,
            timeoutMs
        })) as Promise<ExecuteResult[]>;
    }

    private defaultTimeout(language: SupportedLanguage): number {
        return language === 'CPP' || language === 'C' ? 5000 : 3000;
    }

    private enqueue(
        language: SupportedLanguage,
        execute: () => Promise<QueueExecutionResult>
    ): Promise<QueueExecutionResult> {
        return new Promise<QueueExecutionResult>((resolve, reject) => {
            this.queue.push({
                id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
                language,
                execute,
                resolve,
                reject
            });
            this.drainQueue();
        });
    }

    /**
     * Xử lý queue triệt để: chạy nhiều jobs cùng lúc cho đến khi hết slot hoặc hết queue.
     * Khác với processNext() chỉ lấy 1 job, drainQueue() lấy nhiều job để tối dụng maxConcurrency.
     */
    private drainQueue(): void {
        // Lặp lấy nhiều job cùng lúc miễn là còn slot và còn job
        while (this.activeCount < this.maxConcurrency && this.queue.length > 0) {
            const job = this.queue.shift();
            if (!job) break;

            this.activeCount++;
            console.log(`[Queue] Bắt đầu Job ${job.id} (${job.language}). Active: ${this.activeCount}/${this.maxConcurrency}. Queue: ${this.queue.length}`);

            // Chạy job bất đồng bộ, không await ở đây để loop tiếp tục lấy job tiếp theo
            job.execute()
                .then((result) => {
                    job.resolve(result);
                })
                .catch((error) => {
                    job.reject(error);
                })
                .finally(() => {
                    this.activeCount--;
                    console.log(`[Queue] Hoàn thành Job ${job.id}. Active: ${this.activeCount}/${this.maxConcurrency}. Queue: ${this.queue.length}`);
                    // Khi một job xong, kích hoạt lại drainQueue để lấy job tiếp theo trong hàng chờ
                    this.drainQueue();
                });
        }
    }
}

// Export một instance duy nhất (Singleton) cho toàn hệ thống
// The remote AWS grader has its own stricter semaphore (1 on t3.micro).
// This queue also protects the legacy Judge0 provider and backend request load.
export const codeExecutionQueue = new CodeExecutionQueue(4);
