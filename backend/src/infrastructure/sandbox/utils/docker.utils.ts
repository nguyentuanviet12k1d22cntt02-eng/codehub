import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Thư mục temp_code nằm ở root của sandbox/
export const temp_dir = path.join(__dirname, '..', 'temp_code');

// Tạo tên ngẫu nhiên tránh xung đột khi chạy đồng thời
export const generateUniqueId = (): string => crypto.randomBytes(12).toString('hex');

export const ensureTempDir = async (): Promise<void> => {
    await fs.mkdir(temp_dir, { recursive: true });
};
export const safeUnlink = async (filePath: string): Promise<void> => {
    try {
        await fs.unlink(filePath);
    } catch {
        // Bỏ qua lỗi nếu file không tồn tại
    }
};
let isDockerDaemonAvailable: boolean | null = null;

export const checkDockerDaemon = (): Promise<boolean> => {
    if (isDockerDaemonAvailable !== null) return Promise.resolve(isDockerDaemonAvailable);
    return new Promise((resolve) => {
        exec('docker info', { timeout: 1500 }, (err) => {
            isDockerDaemonAvailable = !err;
            if (!isDockerDaemonAvailable) {
                console.log('⚡ [Sandbox Engine] Docker daemon không khả dụng. Sử dụng Native Sandboxed Process Engine (Nhanh & Tối ưu).');
            } else {
                console.log('🐳 [Sandbox Engine] Docker daemon đang hoạt động. Sử dụng Docker Container Sandbox.');
            }
            resolve(isDockerDaemonAvailable);
        });
    });
};

export const setDockerDaemonStatus = (status: boolean): void => {
    isDockerDaemonAvailable = status;
};

export const parseRuntimeStderr = (rawStderr: string, fallbackMs: number): { stderr: string; runtimeMs: number } => {
    let runtimeMs = fallbackMs;
    const match = rawStderr.match(/___RUNTIME___:(\d+)/);
    if (match) {
        runtimeMs = parseInt(match[1], 10);
        const cleanStderr = rawStderr.replace(/\n?___RUNTIME___:\d+\n?/, '').trim();
        return { stderr: cleanStderr, runtimeMs };
    }
    return { stderr: rawStderr, runtimeMs };
};

let cachedGccImage: string | null | undefined = undefined;

export const getAvailableGccImage = (): Promise<string | null> => {
    if (cachedGccImage !== undefined) return Promise.resolve(cachedGccImage);
    return new Promise((resolve) => {
        exec('docker images --format "{{.Repository}}:{{.Tag}}"', { timeout: 2000 }, (err, stdout) => {
            if (err || !stdout) {
                cachedGccImage = null;
                return resolve(null);
            }
            const lines = stdout.split('\n').map(l => l.trim()).filter(Boolean);
            if (lines.includes('gcc:12-alpine')) {
                cachedGccImage = 'gcc:12-alpine';
            } else if (lines.includes('gcc:12')) {
                cachedGccImage = 'gcc:12';
            } else {
                const found = lines.find(l => l.startsWith('gcc:'));
                cachedGccImage = found || null;
            }
            resolve(cachedGccImage);
        });
    });
};

