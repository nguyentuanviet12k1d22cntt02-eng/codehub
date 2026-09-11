import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { ICodeRunner, SupportedLanguage, ExecuteResult, ExecutionOptions } from '../sandbox.types';
import { temp_dir, ensureTempDir, generateUniqueId, safeUnlink } from '../utils/docker.utils';

export class SqlRunner implements ICodeRunner {
    public readonly language: SupportedLanguage = 'SQL';

    public async run(code: string, options?: ExecutionOptions): Promise<ExecuteResult> {
        await ensureTempDir();

        const timeoutMs = options?.timeoutMs ?? 5000;
        const uniqueId = generateUniqueId();
        const fileName = `sol_${uniqueId}.sql`;
        const filePath = path.join(temp_dir, fileName);

        await fs.writeFile(filePath, code, 'utf-8');

        return this.runSqlScript(filePath, timeoutMs);
    }

    private runSqlScript(filePath: string, timeoutMs: number): Promise<ExecuteResult> {
        const startTime = Date.now();
        const command = process.platform === 'win32' ? 'python' : 'python3';
        
        // sql.runner.py nằm ngay cạnh sql.runner.ts trong cùng thư mục sql/
        const runnerPyPath = path.join(__dirname, 'sql.runner.py');
        const args = process.platform === 'win32' ? ['-X', 'utf8', runnerPyPath, filePath] : [runnerPyPath, filePath];

        return new Promise((resolve) => {
            const child = spawn(command, args, {
                env: {
                    ...process.env,
                    PYTHONUTF8: '1',
                    PYTHONIOENCODING: 'utf-8',
                    LANG: 'en_US.UTF-8'
                }
            });

            let stdout = '';
            let stderr = '';
            let isFinished = false;

            child.stdout.setEncoding('utf-8');
            child.stdout.on('data', (data) => {
                stdout += data;
            });

            child.stderr.setEncoding('utf-8');
            child.stderr.on('data', (data) => {
                stderr += data;
            });

            const timer = setTimeout(() => {
                if (!isFinished) {
                    isFinished = true;
                    child.kill();
                    safeUnlink(filePath);
                    resolve({
                        stdout,
                        stderr: stderr + `\n[TIMEOUT] Truy vấn SQL chạy quá thời gian cho phép (${timeoutMs}ms).`,
                        status: 'TIMEOUT',
                        runtimeMs: Date.now() - startTime
                    });
                }
            }, timeoutMs);

            child.on('close', async (code) => {
                if (isFinished) return;
                isFinished = true;
                clearTimeout(timer);
                await safeUnlink(filePath);

                resolve({
                    stdout,
                    stderr,
                    status: code === 0 ? 'SUCCESS' : 'ERROR',
                    runtimeMs: Date.now() - startTime
                });
            });

            child.on('error', async (err) => {
                if (isFinished) return;
                isFinished = true;
                clearTimeout(timer);
                await safeUnlink(filePath);

                resolve({
                    stdout,
                    stderr: `[Lỗi thực thi SQL runner] ${err.message}`,
                    status: 'ERROR',
                    runtimeMs: Date.now() - startTime
                });
            });
        });
    }
}
