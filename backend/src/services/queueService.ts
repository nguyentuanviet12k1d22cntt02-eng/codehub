import { runCodeInDocker, ExecuteResult } from './sandboxService';

interface ExecutionJob {
    id: string;
    userCode: string;
    language: 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'C';
    inputData: string;
    timeoutMs: number;
    resolve: (value: ExecuteResult) => void;
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
        language: 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'C' = 'PYTHON',
        inputData: string = '',
        timeoutMs?: number
    ): Promise<ExecuteResult> {
        return new Promise<ExecuteResult>((resolve, reject) => {
            let defaultTimeout = 3000;
            if (language === 'CPP' || language === 'C') {
                defaultTimeout = 5000; // đồng bộ với sandboxService
            }
            const actualTimeout = timeoutMs ?? defaultTimeout;

            const job: ExecutionJob = {
                id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userCode,
                language,
                inputData,
                timeoutMs: actualTimeout,
                resolve,
                reject
            };

            this.queue.push(job);
            // Flush queue mỗi khi có job mới, đảm bảo không bỏ sót slot trống
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
            runCodeInDocker(job.userCode, job.language, job.inputData, job.timeoutMs)
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
// maxConcurrency=4: chạy 4 container Docker đồng thời
export const codeExecutionQueue = new CodeExecutionQueue(4);
