import { spawn, exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { ICodeRunner, SupportedLanguage, ExecuteResult, ExecutionOptions } from '../sandbox.types';
import {
    temp_dir,
    ensureTempDir,
    generateUniqueId,
    safeUnlink,
    checkDockerDaemon,
    setDockerDaemonStatus,
    parseRuntimeStderr
} from '../utils/docker.utils';

export class PythonRunner implements ICodeRunner {
    public readonly language: SupportedLanguage = 'PYTHON';

    public async run(code: string, options?: ExecutionOptions): Promise<ExecuteResult> {
        await ensureTempDir();

        const inputData = options?.inputData ?? '';
        const timeoutMs = options?.timeoutMs ?? 3000;
        const memoryLimit = options?.memoryLimit ?? '128m';

        const uniqueId = generateUniqueId();
        const fileName = `sol_${uniqueId}.py`;
        const filePath = path.join(temp_dir, fileName);

        await fs.writeFile(filePath, code, 'utf-8');

        const hasDocker = await checkDockerDaemon();
        if (!hasDocker) {
            return this.runLocally(filePath, inputData, timeoutMs);
        }

        return this.runInDocker(filePath, fileName, uniqueId, inputData, timeoutMs, memoryLimit);
    }

    /**
     * Thực thi Python an toàn trong Docker Container cô lập
     */
    private async runInDocker(
        filePath: string,
        fileName: string,
        uniqueId: string,
        inputData: string,
        timeoutMs: number,
        memoryLimit: string
    ): Promise<ExecuteResult> {
        const hostDir = temp_dir.replace(/\\/g, '/');
        const containerName = `sandbox_py_${uniqueId}`;
        const startTime = Date.now();

        // Wrapper đọc toàn bộ stdin trước, sau đó spawn subprocess Python riêng để đo thời gian chính xác
        const runCommand = [
            `python3 -X utf8 -c "`,
            `import sys, time, subprocess;`,
            `stdin_data = sys.stdin.buffer.read();`,
            `t0 = time.perf_counter();`,
            `p = subprocess.run([sys.executable, '-X', 'utf8', '/tmp/${fileName}'], input=stdin_data, capture_output=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE);`,
            `t1 = time.perf_counter();`,
            `sys.stdout.buffer.write(p.stdout);`,
            `sys.stdout.buffer.flush();`,
            `clean_err = p.stderr.decode('utf-8', errors='replace');`,
            `sys.stderr.write(clean_err);`,
            `sys.stderr.write(f'\\n___RUNTIME___:{int((t1-t0)*1000)}\\n');`,
            `sys.stderr.flush();`,
            `sys.exit(p.returncode)`,
            `"`
        ].join('');

        return new Promise((resolve) => {
            const child = spawn('docker', [
                'run',
                '--name', containerName,
                '--rm',
                '-i',
                '-u', 'nobody',
                '--network', 'none',
                '--memory', memoryLimit,
                '--cpus', '0.5',
                '-e', 'PYTHONUTF8=1',
                '-e', 'PYTHONIOENCODING=utf-8',
                '-e', 'LANG=C.UTF-8',
                '-v', `${hostDir}:/code:ro`,
                '-w', '/tmp',
                'python:3.10-alpine',
                'sh', '-c', `cp /code/${fileName} /tmp/${fileName} && ${runCommand}`
            ]);

            let stdout = '';
            let stderr = '';
            let isFinished = false;

            if (inputData) {
                const formattedInput = inputData.endsWith('\n') ? inputData : inputData + '\n';
                child.stdin.write(formattedInput, 'utf-8');
            }
            child.stdin.end();

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
                    exec(`docker kill ${containerName}`, async () => {
                        await safeUnlink(filePath);
                        resolve({
                            stdout,
                            stderr: stderr + `\n[TIMEOUT] Thời gian chạy vượt quá giới hạn cho phép (${timeoutMs}ms).`,
                            status: 'TIMEOUT',
                            runtimeMs: timeoutMs
                        });
                    });
                }
            }, timeoutMs);

            child.on('close', async (code) => {
                if (isFinished) return;
                isFinished = true;
                clearTimeout(timer);

                if (code !== 0 && /docker API|Cannot connect to the Docker daemon|docker\.sock|no such file or directory/i.test(stderr)) {
                    setDockerDaemonStatus(false);
                    const localResult = await this.runLocally(filePath, inputData, timeoutMs);
                    return resolve(localResult);
                }

                await safeUnlink(filePath);

                const parsed = parseRuntimeStderr(stderr, Date.now() - startTime);
                resolve({
                    stdout,
                    stderr: parsed.stderr,
                    status: code === 0 ? 'SUCCESS' : 'ERROR',
                    runtimeMs: parsed.runtimeMs
                });
            });

            child.on('error', async (err) => {
                if (isFinished) return;
                isFinished = true;
                clearTimeout(timer);

                console.log(`[PythonRunner] Lỗi gọi Docker, fallback sang process cục bộ: ${err.message}`);
                const localResult = await this.runLocally(filePath, inputData, timeoutMs);
                resolve(localResult);
            });
        });
    }

    /**
     * Fallback thực thi bằng Native Python Process khi không có Docker
     */
    private runLocally(filePath: string, inputData: string, timeoutMs: number): Promise<ExecuteResult> {
        const startTime = Date.now();
        const command = process.platform === 'win32' ? 'python' : 'python3';
        const args = process.platform === 'win32' ? ['-X', 'utf8', filePath] : [filePath];

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

            if (inputData) {
                const formattedInput = inputData.endsWith('\n') ? inputData : inputData + '\n';
                child.stdin.write(formattedInput, 'utf-8');
            }
            child.stdin.end();

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
                        stderr: stderr + `\n[TIMEOUT] Thời gian chạy vượt quá giới hạn cho phép (${timeoutMs}ms).`,
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
                    stderr: `[Lỗi chạy Python cục bộ] ${err.message}`,
                    status: 'ERROR',
                    runtimeMs: Date.now() - startTime
                });
            });
        });
    }
}
