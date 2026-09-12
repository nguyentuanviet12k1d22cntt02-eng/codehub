import { spawn, exec, execSync } from 'child_process';
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

let isGccDockerImageAvailable: boolean | null = null;

export class CppRunner implements ICodeRunner {
    public readonly language: SupportedLanguage;

    constructor(language: 'CPP' | 'C' = 'CPP') {
        this.language = language;
    }

    private checkDockerImage(): Promise<boolean> {
        if (isGccDockerImageAvailable !== null) return Promise.resolve(isGccDockerImageAvailable);
        return new Promise((resolve) => {
            exec('docker images -q gcc:12-alpine', { timeout: 1500 }, (err, stdout) => {
                isGccDockerImageAvailable = !err && !!stdout && stdout.trim().length > 0;
                resolve(isGccDockerImageAvailable);
            });
        });
    }

    public async run(code: string, options?: ExecutionOptions): Promise<ExecuteResult> {
        await ensureTempDir();

        const inputData = options?.inputData ?? '';
        const timeoutMs = options?.timeoutMs ?? 5000;
        const memoryLimit = options?.memoryLimit ?? '64m';

        const suffix = this.language === 'CPP' ? 'cpp' : 'c';
        const uniqueId = generateUniqueId();
        const fileName = `sol_${uniqueId}.${suffix}`;
        const filePath = path.join(temp_dir, fileName);

        await fs.writeFile(filePath, code, 'utf-8');

        const hasDocker = await checkDockerDaemon();
        const hasImage = hasDocker ? await this.checkDockerImage() : false;

        if (!hasDocker || !hasImage) {
            return this.runLocally(filePath, inputData, timeoutMs);
        }

        return this.runInDocker(filePath, fileName, uniqueId, inputData, timeoutMs, memoryLimit);
    }

    private async runInDocker(
        filePath: string,
        fileName: string,
        uniqueId: string,
        inputData: string,
        timeoutMs: number,
        memoryLimit: string
    ): Promise<ExecuteResult> {
        const hostDir = temp_dir.replace(/\\/g, '/');
        const containerName = `sandbox_cpp_${uniqueId}`;
        const startTime = Date.now();

        const compilerCmd = this.language === 'CPP'
            ? `g++ -O2 -o /tmp/sol_bin /tmp/${fileName} 2>&1`
            : `gcc -O2 -o /tmp/sol_bin /tmp/${fileName} -lm 2>&1`;

        const runCommand = [
            `${compilerCmd} && `,
            `python3 -c "`,
            `import sys, time, subprocess;`,
            `stdin_data = sys.stdin.buffer.read();`,
            `t0 = time.perf_counter();`,
            `p = subprocess.run(['/tmp/sol_bin'], input=stdin_data, stdout=subprocess.PIPE, stderr=subprocess.PIPE);`,
            `t1 = time.perf_counter();`,
            `sys.stdout.buffer.write(p.stdout);`,
            `sys.stderr.write(p.stderr.decode('utf-8', errors='replace'));`,
            `sys.stderr.write(f'\\n___RUNTIME___:{int((t1-t0)*1000)}\\n');`,
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
                '-v', `${hostDir}:/code:ro`,
                '-w', '/tmp',
                'gcc:12-alpine',
                'sh', '-c', `cp /code/${fileName} /tmp/${fileName} && ${runCommand}`
            ]);

            let stdout = '';
            let stderr = '';
            let isFinished = false;

            if (inputData) {
                const formattedInput = inputData.endsWith('\n') ? inputData : inputData + '\n';
                child.stdin.write(formattedInput);
            }
            child.stdin.end();

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
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

                if (code !== 0 && /docker API|Cannot connect to the Docker daemon|docker\.sock|no such file or directory|Unable to find image|failed to resolve reference|pull access denied/i.test(stderr)) {
                    console.log(`[CppRunner] Docker không có sẵn image phù hợp, tự động fallback sang compiler cục bộ (${this.language})`);
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
                console.log(`[CppRunner] Lỗi gọi Docker, fallback sang process cục bộ: ${err.message}`);
                const localResult = await this.runLocally(filePath, inputData, timeoutMs);
                resolve(localResult);
            });
        });
    }

    private runLocally(filePath: string, inputData: string, timeoutMs: number): Promise<ExecuteResult> {
        const startTime = Date.now();
        const compiler = this.language === 'CPP' ? 'g++' : 'gcc';
        const outputPath = filePath.replace(/\.(cpp|c)$/, process.platform === 'win32' ? '.exe' : '');

        try {
            execSync(`${compiler} -O3 "${filePath}" -o "${outputPath}"`);
        } catch (err: any) {
            safeUnlink(filePath);
            return Promise.resolve({
                stdout: '',
                stderr: `[Lỗi biên dịch ${this.language} cục bộ] ${err.message}`,
                status: 'ERROR',
                runtimeMs: Date.now() - startTime
            });
        }

        return new Promise((resolve) => {
            const child = spawn(outputPath, []);

            let stdout = '';
            let stderr = '';
            let isFinished = false;

            if (inputData) {
                const formattedInput = inputData.endsWith('\n') ? inputData : inputData + '\n';
                child.stdin.write(formattedInput);
            }
            child.stdin.end();

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            const timer = setTimeout(() => {
                if (!isFinished) {
                    isFinished = true;
                    child.kill();
                    safeUnlink(filePath);
                    safeUnlink(outputPath);
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
                await safeUnlink(outputPath);

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
                await safeUnlink(outputPath);

                resolve({
                    stdout,
                    stderr: `[Lỗi chạy ${this.language} cục bộ] ${err.message}`,
                    status: 'ERROR',
                    runtimeMs: Date.now() - startTime
                });
            });
        });
    }
}
