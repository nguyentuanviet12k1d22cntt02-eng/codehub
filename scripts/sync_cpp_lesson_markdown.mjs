import { copyFileSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const curriculumRoot = resolve(root, 'docs/Dữ liệu nội dung bài học/C++');
let normalizedFiles = 0;
let mirroredFiles = 0;

function normalizeCppFences(source) {
    return source.replace(/```cpp\r?\n([\s\S]*?)```/g, (fence, code) => {
        // A newline inside an ordinary quoted C++ string is ill-formed.  These
        // documents previously contained a number of such copied snippets.
        const normalizedCode = code.replace(/"([^"\r\n]*)\r?\n"/g, '"$1\\\\n"');
        return normalizedCode === code ? fence : fence.replace(code, normalizedCode);
    });
}

function walk(directory) {
    for (const entry of readdirSync(directory)) {
        const filePath = join(directory, entry);
        if (statSync(filePath).isDirectory()) {
            walk(filePath);
            continue;
        }
        if (!/^Lesson_.*\.md$/i.test(entry)) continue;

        const source = readFileSync(filePath, 'utf8');
        const normalized = normalizeCppFences(source);
        if (normalized !== source) {
            writeFileSync(filePath, normalized, 'utf8');
            normalizedFiles += 1;
        }

        const textMirror = filePath.replace(/\.md$/i, '.txt');
        if (existsSync(textMirror)) {
            copyFileSync(filePath, textMirror);
            mirroredFiles += 1;
        }
    }
}

walk(curriculumRoot);
console.log(`Đã chuẩn hóa ${normalizedFiles} bài có literal newline lỗi trong C++ snippet và đồng bộ ${mirroredFiles} bản .txt.`);
