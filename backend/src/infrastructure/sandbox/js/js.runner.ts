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

export class JavaScriptRunner implements ICodeRunner {
    public readonly language: SupportedLanguage = 'JAVASCRIPT';

    public async run(code: string, options?: ExecutionOptions): Promise<ExecuteResult> {
        await ensureTempDir();

        const inputData = options?.inputData ?? '';
        const timeoutMs = options?.timeoutMs ?? 3000;
        const memoryLimit = options?.memoryLimit ?? '128m';

        const uniqueId = generateUniqueId();
        const fileName = `sol_${uniqueId}.js`;
        const filePath = path.join(temp_dir, fileName);

        await fs.writeFile(filePath, code, 'utf-8');

        const hasDocker = await checkDockerDaemon();
        if (!hasDocker) {
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
        const containerName = `sandbox_js_${uniqueId}`;
        const startTime = Date.now();

        const runCommand = [
            `node -e "`,
            `const {spawnSync}=require('child_process');`,
            `const {performance}=require('perf_hooks');`,
            `const stdin=require('fs').readFileSync('/dev/stdin');`,
            `const t0=performance.now();`,
            `const r=spawnSync(process.execPath,['/tmp/${fileName}'],{input:stdin,encoding:'buffer',maxBuffer:10*1024*1024});`,
            `const t1=performance.now();`,
            `if(r.stdout)process.stdout.write(r.stdout);`,
            `if(r.stderr)process.stderr.write(r.stderr);`,
            `process.stderr.write('\\n___RUNTIME___:'+Math.round(t1-t0)+'\\n');`,
            `process.exit(r.status||0)`,
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
                'node:18-alpine',
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
                console.log(`[JavaScriptRunner] Lỗi gọi Docker, fallback sang process cục bộ: ${err.message}`);
                const localResult = await this.runLocally(filePath, inputData, timeoutMs);
                resolve(localResult);
            });
        });
    }

    private runLocally(filePath: string, inputData: string, timeoutMs: number): Promise<ExecuteResult> {
        const startTime = Date.now();
        return new Promise((resolve) => {
            const child = spawn('node', [filePath]);

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
                    stderr: `[Lỗi chạy Node.js cục bộ] ${err.message}`,
                    status: 'ERROR',
                    runtimeMs: Date.now() - startTime
                });
            });
        });
    }
}
