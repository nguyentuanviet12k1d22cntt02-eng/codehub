import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import {
    BatchExecutionOptions,
    ExecuteResult,
    SupportedLanguage
} from '../sandbox.types';
import {
    checkDockerDaemon,
    ensureTempDir,
    generateUniqueId,
    setDockerDaemonStatus,
    temp_dir
} from '../utils/docker.utils';

type BatchLanguage = 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'C';

interface RuntimeConfig {
    sourceFile: string;
    dockerImage: string;
    dockerPrepareCommand: string;
    dockerRunCommand: string;
    localPrepare: (workspace: string) => { command: string; args: string[] };
    localRun: (workspace: string) => { command: string; args: string[] };
}

interface ProcessResult extends ExecuteResult {
    exitCode: number | null;
}

const COMPILATION_TIMEOUT_MS = 10_000;
const SANDBOX_STARTUP_BUFFER_MS = 2_000;

/**
 * Executes every testcase of one submission in one isolated container. This
 * avoids compiling C++ once per testcase and prevents a single submission from
 * competing with itself for the global sandbox queue.
 */
export class BatchCodeRunner {
    public async run(
        code: string,
        language: SupportedLanguage,
        inputs: string[],
        options?: BatchExecutionOptions
    ): Promise<ExecuteResult[]> {
        if (!this.isSupported(language)) {
            throw new Error(`Batch sandbox chưa hỗ trợ ngôn ngữ ${language}.`);
        }
        if (inputs.length === 0) return [];

        const runtimeMs = options?.timeoutMs ?? (language === 'CPP' || language === 'C' ? 5000 : 3000);
        const compileTimeoutMs = options?.compileTimeoutMs ?? COMPILATION_TIMEOUT_MS;
        const memoryLimit = options?.memoryLimit ?? (language === 'CPP' || language === 'C' ? '64m' : '128m');
        const config = this.getConfig(language);
        const uniqueId = generateUniqueId();
        const workspace = path.join(temp_dir, `batch_${uniqueId}`);

        await ensureTempDir();
        await fs.mkdir(workspace, { recursive: true });

        try {
            await fs.writeFile(path.join(workspace, config.sourceFile), code, 'utf8');

            if (await checkDockerDaemon()) {
                return await this.runInDocker({
                    workspace,
                    language,
                    config,
                    inputs,
                    uniqueId,
                    runtimeMs,
                    compileTimeoutMs,
                    memoryLimit
                });
            }

            return await this.runLocally({ workspace, language, config, inputs, runtimeMs, compileTimeoutMs });
        } finally {
            await fs.rm(workspace, { recursive: true, force: true });
        }
    }

    private isSupported(language: SupportedLanguage): language is BatchLanguage {
        return language === 'PYTHON' || language === 'JAVASCRIPT' || language === 'CPP' || language === 'C';
    }

    private getConfig(language: BatchLanguage): RuntimeConfig {
        const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
        const cppOutput = process.platform === 'win32' ? 'program.exe' : 'program';

        switch (language) {
            case 'PYTHON':
                return {
                    sourceFile: 'solution.py',
                    dockerImage: 'python:3.10-alpine',
                    dockerPrepareCommand: 'cp /code/solution.py /tmp/solution.py && timeout -s KILL __COMPILE_SECONDS__ python3 -m py_compile /tmp/solution.py',
                    dockerRunCommand: 'python3 -X utf8 /tmp/solution.py',
                    localPrepare: (workspace) => ({ command: pythonCommand, args: ['-m', 'py_compile', path.join(workspace, 'solution.py')] }),
                    localRun: (workspace) => ({ command: pythonCommand, args: ['-X', 'utf8', path.join(workspace, 'solution.py')] })
                };
            case 'JAVASCRIPT':
                return {
                    sourceFile: 'solution.js',
                    dockerImage: 'node:18-alpine',
                    dockerPrepareCommand: 'cp /code/solution.js /tmp/solution.js && timeout -s KILL __COMPILE_SECONDS__ node --check /tmp/solution.js',
                    dockerRunCommand: 'node /tmp/solution.js',
                    localPrepare: (workspace) => ({ command: 'node', args: ['--check', path.join(workspace, 'solution.js')] }),
                    localRun: (workspace) => ({ command: 'node', args: [path.join(workspace, 'solution.js')] })
                };
            case 'CPP':
                return {
                    sourceFile: 'solution.cpp',
                    dockerImage: 'gcc:12-alpine',
                    dockerPrepareCommand: 'timeout -s KILL __COMPILE_SECONDS__ g++ -std=c++17 -O2 -pipe /code/solution.cpp -o /tmp/program',
                    dockerRunCommand: '/tmp/program',
                    localPrepare: (workspace) => ({
                        command: 'g++',
                        args: ['-std=c++17', '-O2', '-pipe', path.join(workspace, 'solution.cpp'), '-o', path.join(workspace, cppOutput)]
                    }),
                    localRun: (workspace) => ({ command: path.join(workspace, cppOutput), args: [] })
                };
            case 'C':
                return {
                    sourceFile: 'solution.c',
                    dockerImage: 'gcc:12-alpine',
                    dockerPrepareCommand: 'timeout -s KILL __COMPILE_SECONDS__ gcc -O2 -pipe /code/solution.c -lm -o /tmp/program',
                    dockerRunCommand: '/tmp/program',
                    localPrepare: (workspace) => ({
                        command: 'gcc',
                        args: ['-O2', '-pipe', path.join(workspace, 'solution.c'), '-lm', '-o', path.join(workspace, cppOutput)]
                    }),
                    localRun: (workspace) => ({ command: path.join(workspace, cppOutput), args: [] })
                };
        }
    }

    private async runLocally(params: {
        workspace: string;
        language: BatchLanguage;
        config: RuntimeConfig;
        inputs: string[];
        runtimeMs: number;
        compileTimeoutMs: number;
    }): Promise<ExecuteResult[]> {
        const prepare = params.config.localPrepare(params.workspace);
        const compilation = await this.runProcess(prepare.command, prepare.args, '', params.compileTimeoutMs);

        if (compilation.status !== 'SUCCESS') {
            return this.compilationFailureResults(params.language, params.inputs.length, compilation.stderr, compilation.status === 'TIMEOUT');
        }

        const results: ExecuteResult[] = [];
        for (const input of params.inputs) {
            const command = params.config.localRun(params.workspace);
            results.push(await this.runProcess(command.command, command.args, input, params.runtimeMs));
        }
        return results;
    }

    private async runInDocker(params: {
        workspace: string;
        language: BatchLanguage;
        config: RuntimeConfig;
        inputs: string[];
        uniqueId: string;
        runtimeMs: number;
        compileTimeoutMs: number;
        memoryLimit: string;
    }): Promise<ExecuteResult[]> {
        const hostDir = params.workspace.replace(/\\/g, '/');
        const containerName = `sandbox_batch_${params.uniqueId}`;
        const compileSeconds = Math.max(1, Math.ceil(params.compileTimeoutMs / 1000));
        const runtimeSeconds = Math.max(1, Math.ceil(params.runtimeMs / 1000));
        const prepareCommand = params.config.dockerPrepareCommand.replace('__COMPILE_SECONDS__', String(compileSeconds));
        const script = this.dockerHarness(prepareCommand, params.config.dockerRunCommand, runtimeSeconds);
        const totalTimeoutMs = params.compileTimeoutMs + (params.inputs.length * params.runtimeMs) + SANDBOX_STARTUP_BUFFER_MS;

        return new Promise((resolve) => {
            const child = spawn('docker', [
                'run',
                '--name', containerName,
                '--rm',
                '-i',
                '-u', 'nobody',
                '--network', 'none',
                '--memory', params.memoryLimit,
                '--cpus', '0.5',
                '--pids-limit', '64',
                '-e', 'PYTHONUTF8=1',
                '-e', 'PYTHONIOENCODING=utf-8',
                '-e', 'LANG=C.UTF-8',
                '-v', `${hostDir}:/code:ro`,
                '-w', '/tmp',
                params.config.dockerImage,
                'sh', '-c', script
            ]);

            let stdout = '';
            let stderr = '';
            let isFinished = false;

            child.stdout.setEncoding('utf8');
            child.stderr.setEncoding('utf8');
            child.stdout.on('data', (data) => { stdout += data; });
            child.stderr.on('data', (data) => { stderr += data; });

            const inputPayload = params.inputs
                .map((input) => Buffer.from(this.normalizeInput(input), 'utf8').toString('base64'))
                .join('\n');
            child.stdin.end(`${inputPayload}\n`, 'utf8');

            const timer = setTimeout(() => {
                if (isFinished) return;
                isFinished = true;
                const killer = spawn('docker', ['kill', containerName]);
                killer.on('error', () => undefined);
                resolve(this.timeoutResults(params.inputs.length, params.runtimeMs, 'Sandbox vượt quá thời gian chuẩn bị hoặc thực thi.'));
            }, totalTimeoutMs);

            child.on('close', async (exitCode) => {
                if (isFinished) return;
                isFinished = true;
                clearTimeout(timer);

                if (exitCode !== 0 && /docker API|Cannot connect to the Docker daemon|docker\.sock|no such file or directory|Unable to find image|failed to resolve reference|pull access denied/i.test(stderr)) {
                    setDockerDaemonStatus(false);
                    resolve(await this.runLocally(params));
                    return;
                }

                resolve(this.parseDockerResults(stdout, stderr, params.language, params.inputs.length, params.runtimeMs));
            });

            child.on('error', async (error) => {
                if (isFinished) return;
                isFinished = true;
                clearTimeout(timer);
                console.warn(`[BatchCodeRunner] Không thể tạo Docker sandbox: ${error.message}`);
                resolve(await this.runLocally(params));
            });
        });
    }

    private dockerHarness(prepareCommand: string, runCommand: string, runtimeSeconds: number): string {
        return `
${prepareCommand} >/tmp/compile.stdout 2>/tmp/compile.stderr
compile_status=$?
if [ "$compile_status" -ne 0 ]; then
  compile_output=$(cat /tmp/compile.stdout /tmp/compile.stderr | base64 | tr -d '\\n')
  printf '__MCODE_COMPILE_ERROR__%s__%s\\n' "$compile_status" "$compile_output"
  exit 0
fi
index=0
while IFS= read -r encoded_input || [ -n "$encoded_input" ]; do
  printf '%s' "$encoded_input" | base64 -d >/tmp/input
  start=$(date +%s%3N 2>/dev/null || echo 0)
  timeout -s KILL ${runtimeSeconds} ${runCommand} </tmp/input >/tmp/out_"$index" 2>/tmp/err_"$index"
  status=$?
  finish=$(date +%s%3N 2>/dev/null || echo 0)
  runtime=0
  case "$start:$finish" in
    *[!0-9:]*) runtime=0 ;;
    *) runtime=$((finish - start)) ;;
  esac
  output=$(base64 /tmp/out_"$index" | tr -d '\\n')
  error=$(base64 /tmp/err_"$index" | tr -d '\\n')
  printf '__MCODE_CASE__%s__%s__%s__%s__ERR__%s\\n' "$index" "$status" "$runtime" "$output" "$error"
  index=$((index + 1))
done`;
    }

    private parseDockerResults(
        stdout: string,
        stderr: string,
        language: BatchLanguage,
        count: number,
        timeoutMs: number
    ): ExecuteResult[] {
        const compileMatch = stdout.match(/__MCODE_COMPILE_ERROR__(\d+)__([^\r\n]*)/);
        if (compileMatch) {
            const output = this.decodeBase64(compileMatch[2]);
            return this.compilationFailureResults(language, count, output, compileMatch[1] === '124' || compileMatch[1] === '137');
        }

        const results = new Map<number, ExecuteResult>();
        for (const line of stdout.split(/\r?\n/)) {
            const match = /^__MCODE_CASE__(\d+)__(\d+)__(\d+)__([A-Za-z0-9+/=]*)__ERR__([A-Za-z0-9+/=]*)$/.exec(line);
            if (!match) continue;

            const index = Number(match[1]);
            const exitCode = Number(match[2]);
            const runtimeMs = Number(match[3]) || 0;
            const isTimeout = exitCode === 124 || exitCode === 137;
            results.set(index, {
                stdout: this.decodeBase64(match[4]),
                stderr: this.decodeBase64(match[5]),
                status: isTimeout ? 'TIMEOUT' : exitCode === 0 ? 'SUCCESS' : 'ERROR',
                runtimeMs: isTimeout ? timeoutMs : runtimeMs
            });
        }

        if (results.size === 0 && stderr.trim()) {
            return Array.from({ length: count }, () => ({
                stdout: '',
                stderr: `[Lỗi Docker sandbox] ${stderr.trim()}`,
                status: 'ERROR' as const,
                runtimeMs: 0
            }));
        }

        return Array.from({ length: count }, (_, index) => (
            results.get(index) ?? {
                stdout: '',
                stderr: '[TIMEOUT] Sandbox không trả về kết quả cho testcase này.',
                status: 'TIMEOUT' as const,
                runtimeMs: timeoutMs
            }
        ));
    }

    private compilationFailureResults(language: BatchLanguage, count: number, stderr: string, timedOut: boolean): ExecuteResult[] {
        const message = timedOut
            ? `[Lỗi biên dịch ${language}] Quá thời gian biên dịch cho phép.`
            : `[Lỗi biên dịch ${language}] ${stderr.trim() || 'Không thể chuẩn bị mã nguồn.'}`;
        return Array.from({ length: count }, () => ({
            stdout: '',
            stderr: message,
            status: 'ERROR' as const,
            runtimeMs: 0
        }));
    }

    private timeoutResults(count: number, timeoutMs: number, reason: string): ExecuteResult[] {
        return Array.from({ length: count }, () => ({
            stdout: '',
            stderr: `[TIMEOUT] ${reason}`,
            status: 'TIMEOUT' as const,
            runtimeMs: timeoutMs
        }));
    }

    private runProcess(command: string, args: string[], input: string, timeoutMs: number): Promise<ProcessResult> {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const child = spawn(command, args, { windowsHide: true });
            let stdout = '';
            let stderr = '';
            let isFinished = false;

            child.stdout.setEncoding('utf8');
            child.stderr.setEncoding('utf8');
            child.stdout.on('data', (data) => { stdout += data; });
            child.stderr.on('data', (data) => { stderr += data; });

            const timer = setTimeout(() => {
                if (isFinished) return;
                isFinished = true;
                child.kill('SIGKILL');
                resolve({
                    stdout,
                    stderr: `${stderr}\n[TIMEOUT] Thời gian chạy vượt quá giới hạn cho phép (${timeoutMs}ms).`,
                    status: 'TIMEOUT',
                    runtimeMs: timeoutMs,
                    exitCode: null
                });
            }, timeoutMs);

            if (input) child.stdin.end(this.normalizeInput(input), 'utf8');
            else child.stdin.end();

            child.on('close', (exitCode) => {
                if (isFinished) return;
                isFinished = true;
                clearTimeout(timer);
                resolve({
                    stdout,
                    stderr: stderr.trim(),
                    status: exitCode === 0 ? 'SUCCESS' : 'ERROR',
                    runtimeMs: Date.now() - startTime,
                    exitCode
                });
            });

            child.on('error', (error) => {
                if (isFinished) return;
                isFinished = true;
                clearTimeout(timer);
                resolve({
                    stdout,
                    stderr: error.message,
                    status: 'ERROR',
                    runtimeMs: Date.now() - startTime,
                    exitCode: null
                });
            });
        });
    }

    private normalizeInput(input: string): string {
        return input && !input.endsWith('\n') ? `${input}\n` : input;
    }

    private decodeBase64(value: string): string {
        return value ? Buffer.from(value, 'base64').toString('utf8') : '';
    }
}
