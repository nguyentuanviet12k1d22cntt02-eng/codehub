import { spawn, exec } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const temp_dir = path.join(__dirname, 'temp_code');

export interface ExecuteResult {
    stdout: string;
    stderr: string;
    status: 'SUCCESS' | 'TIMEOUT' | 'ERROR';
    runtimeMs: number
}

// Tạo tên file ngẫu nhiên an toàn dùng crypto để tránh collision khi chạy song song
const generateUniqueId = () => crypto.randomBytes(12).toString('hex');

const runCodeLocally = async (
    filePath: string,
    language: string,
    inputData: string,
    timeoutMs: number
): Promise<ExecuteResult> => {
    const startTime = Date.now();
    return new Promise((resolve) => {
        let command = '';
        let args: string[] = [];

        if (language === 'PYTHON') {
            command = process.platform === 'win32' ? 'python' : 'python3';
            args = [filePath];
        } else if (language === 'JAVASCRIPT') {
            command = 'node';
            args = [filePath];
        } else if (language === 'CPP' || language === 'C') {
            const compiler = language === 'CPP' ? 'g++' : 'gcc';
            const outputPath = filePath.replace(/\.(cpp|c)$/, process.platform === 'win32' ? '.exe' : '');
            try {
                const { execSync } = require('child_process');
                execSync(`${compiler} -O3 "${filePath}" -o "${outputPath}"`);
                command = outputPath;
                args = [];
            } catch (err: any) {
                fs.unlink(filePath).catch(() => {});
                resolve({
                    stdout: '',
                    stderr: `[Lỗi biên dịch cục bộ] ${err.message}`,
                    status: 'ERROR',
                    runtimeMs: Date.now() - startTime
                });
                return;
            }
        }

        const child = spawn(command, args);

        let stdout = '';
        let stderr = '';
        let isFinished = false;

        if (inputData) {
            child.stdin.write(inputData);
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
                fs.unlink(filePath).catch(() => {});
                if (language === 'CPP' || language === 'C') {
                    const outputPath = filePath.replace(/\.(cpp|c)$/, process.platform === 'win32' ? '.exe' : '');
                    fs.unlink(outputPath).catch(() => {});
                }
                resolve({
                    stdout,
                    stderr: stderr + `\n[TIMEOUT] Thời gian chạy vượt quá giới hạn cho phép (${timeoutMs}ms).`,
                    status: 'TIMEOUT',
                    runtimeMs: Date.now() - startTime
                });
            }
        }, timeoutMs);

        const cleanUpAndResolve = async (code: number | null, errMessage?: string) => {
            if (isFinished) return;
            isFinished = true;
            clearTimeout(timer);
            await fs.unlink(filePath).catch(() => {});
            if (language === 'CPP' || language === 'C') {
                const outputPath = filePath.replace(/\.(cpp|c)$/, process.platform === 'win32' ? '.exe' : '');
                await fs.unlink(outputPath).catch(() => {});
            }
            resolve({
                stdout,
                stderr: errMessage ? stderr + `\n${errMessage}` : stderr,
                status: code === 0 ? 'SUCCESS' : 'ERROR',
                runtimeMs: Date.now() - startTime
            });
        };

        child.on('close', (code) => {
            cleanUpAndResolve(code);
        });

        child.on('error', (err) => {
            cleanUpAndResolve(1, `[Lỗi chạy cục bộ] ${err.message}`);
        });
    });
};

export const runCodeInDocker = async (
    userCode: string,
    language: 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'C' = 'PYTHON',
    inputData: string = '',
    timeoutMs?: number
): Promise<ExecuteResult> => {
    await fs.mkdir(temp_dir, { recursive: true });

    let suffix = 'py';
    let dockerImage = 'python:3.10-alpine';
    let defaultTimeout = 3000;
    let memoryLimit = '128m';

    if (language === 'JAVASCRIPT') {
        suffix = 'js';
        dockerImage = 'node:18-alpine';
        defaultTimeout = 3000;
    } else if (language === 'CPP') {
        suffix = 'cpp';
        dockerImage = 'gcc:12-alpine';
        defaultTimeout = 5000; // 5s để include cả compile time
        memoryLimit = '64m';
    } else if (language === 'C') {
        suffix = 'c';
        dockerImage = 'gcc:12-alpine';
        defaultTimeout = 5000;
        memoryLimit = '64m';
    }

    const actualTimeout = timeoutMs || defaultTimeout;

    // Dùng crypto.randomBytes thay vì Date.now() + Math.random() để đảm bảo unique khi chạy song song
    const uniqueId = generateUniqueId();
    const fileName = `sol_${uniqueId}.${suffix}`;
    const filePath = path.join(temp_dir, fileName);
    const containerName = `sandbox_${uniqueId}`;

    // ghi code của user vào filePath
    await fs.writeFile(filePath, userCode, 'utf-8');

    // chuyển đường dẫn tuyệt đối dạng windows sang định dạng docker dễ đọc
    const hostDir = temp_dir.replace(/\\/g, '/');
    const startTime = Date.now();

    // =================== TIMING MEASUREMENT STRATEGY ===================
    // Để đo thời gian chạy THỰC SỰ của code user (không bao gồm overhead khởi động Docker
    // hay load Python interpreter), chúng ta spawn một subprocess riêng từ bên trong container
    // và đo thời gian của subprocess đó. Cách này tách biệt hoàn toàn:
    //   - Overhead Docker container startup
    //   - Overhead Python/Node interpreter init + module loading của wrapper
    //   - Overhead biên dịch bytecode của file user (với Python)
    // Chỉ đo đúng phần: thực thi logic của user code
    //
    // PYTHON: Dùng subprocess.run để fork một process Python con. Process con này kế thừa
    //   stdin/stdout/stderr nên input/output hoạt động bình thường. Parent đo wall-clock time.
    //   Quan trọng: stdin phải được đọc trước khi fork vì pipe chỉ có 1 reader.
    //
    // JAVASCRIPT: Dùng child_process.spawnSync từ trong Node.js wrapper.
    //   stdin được pipe qua và stdout/stderr được forward lại.
    //
    // C/C++: Compile trước → chạy binary đã compile. Đo bằng /proc/uptime (centisecond precision)
    //   vì Alpine không có date +%N. Tách riêng thời gian compile và thời gian chạy.
    // ====================================================================

    let runCommand: string;

    if (language === 'PYTHON') {
        // Wrapper đọc toàn bộ stdin trước, sau đó spawn subprocess Python riêng để đo thời gian chính xác
        runCommand = [
            `python3 -c "`,
            `import sys, time, subprocess, os;`,
            `stdin_data = sys.stdin.buffer.read();`,
            `t0 = time.perf_counter();`,
            `p = subprocess.run([sys.executable, '/tmp/${fileName}'], input=stdin_data, capture_output=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE);`,
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
    } else if (language === 'JAVASCRIPT') {
        // Wrapper Node.js: spawn child process và forward stdin/stdout/stderr
        runCommand = [
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
    } else if (language === 'CPP') {
        // C++: biên dịch trước, rồi đo thời gian chỉ phần chạy binary
        runCommand = [
            `g++ -O2 -o /tmp/sol_bin /tmp/${fileName} 2>&1 && `,
            `python3 -c "`,
            `import sys,time,subprocess;`,
            `stdin_data=sys.stdin.buffer.read();`,
            `t0=time.perf_counter();`,
            `p=subprocess.run(['/tmp/sol_bin'],input=stdin_data,stdout=subprocess.PIPE,stderr=subprocess.PIPE);`,
            `t1=time.perf_counter();`,
            `sys.stdout.buffer.write(p.stdout);`,
            `sys.stderr.write(p.stderr.decode('utf-8',errors='replace'));`,
            `sys.stderr.write(f'\\n___RUNTIME___:{int((t1-t0)*1000)}\\n');`,
            `sys.exit(p.returncode)`,
            `"`
        ].join('');
    } else { // C
        runCommand = [
            `gcc -O2 -o /tmp/sol_bin /tmp/${fileName} -lm 2>&1 && `,
            `python3 -c "`,
            `import sys,time,subprocess;`,
            `stdin_data=sys.stdin.buffer.read();`,
            `t0=time.perf_counter();`,
            `p=subprocess.run(['/tmp/sol_bin'],input=stdin_data,stdout=subprocess.PIPE,stderr=subprocess.PIPE);`,
            `t1=time.perf_counter();`,
            `sys.stdout.buffer.write(p.stdout);`,
            `sys.stderr.write(p.stderr.decode('utf-8',errors='replace'));`,
            `sys.stderr.write(f'\\n___RUNTIME___:{int((t1-t0)*1000)}\\n');`,
            `sys.exit(p.returncode)`,
            `"`
        ].join('');
    }

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
            dockerImage,
            'sh', '-c', `cp /code/${fileName} /tmp/${fileName} && ${runCommand}`
        ]);

        let stdout = '';
        let stderr = '';
        let isFinished = false;

        if (inputData) {
            child.stdin.write(inputData);
        }
        child.stdin.end();

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        // Hẹn giờ kill container nếu vượt timeout
        const timer = setTimeout(() => {
            if (!isFinished) {
                isFinished = true;
                exec(`docker kill ${containerName}`, async () => {
                    await fs.unlink(filePath).catch(() => {});
                    resolve({
                        stdout,
                        stderr: stderr + `\n[TIMEOUT] Thời gian chạy vượt quá giới hạn cho phép (${actualTimeout}ms).`,
                        status: 'TIMEOUT',
                        runtimeMs: actualTimeout // Đối với TIMEOUT, report đúng giá trị timeout
                    });
                });
            }
        }, actualTimeout);

        child.on('close', async (code) => {
            if (isFinished) return;
            isFinished = true;
            clearTimeout(timer);

            await fs.unlink(filePath).catch(() => {});

            // Trích xuất runtime từ stderr và loại bỏ marker trước khi trả về
            let runtimeMs = Date.now() - startTime; // fallback nếu không có marker
            const runtimeMatch = stderr.match(/___RUNTIME___:(\d+)/);
            if (runtimeMatch) {
                runtimeMs = parseInt(runtimeMatch[1], 10);
                // Xóa dòng marker khỏi stderr để user không thấy
                stderr = stderr.replace(/\n?___RUNTIME___:\d+\n?/, '').trim();
            }

            resolve({
                stdout,
                stderr,
                status: code === 0 ? 'SUCCESS' : 'ERROR',
                runtimeMs
            });
        });

        child.on('error', async (err) => {
            if (isFinished) return;
            isFinished = true;
            clearTimeout(timer);

            console.log(`[Docker Sandbox] Gặp lỗi khi chạy Docker, chuyển sang chạy cục bộ làm fallback: ${err.message}`);
            const localResult = await runCodeLocally(filePath, language, inputData, actualTimeout);
            resolve(localResult);
        });
    });
};