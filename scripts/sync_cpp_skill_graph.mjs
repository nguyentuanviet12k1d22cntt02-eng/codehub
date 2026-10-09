import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'curriculum/cppSkillGraph.json');
const targets = [
    resolve(root, 'frontend/src/data/cppSkillGraph.json'),
    resolve(root, 'backend/src/infrastructure/data/cppSkillGraph.json'),
    resolve(root, 'ai-service/data/cppSkillGraph.json')
];

if (!existsSync(source)) {
    throw new Error(`Không tìm thấy đồ thị C++ chuẩn: ${source}`);
}

JSON.parse(readFileSync(source, 'utf8'));
for (const target of targets) {
    copyFileSync(source, target);
}

console.log(`Đã đồng bộ đồ thị C++ v${JSON.parse(readFileSync(source, 'utf8')).version} tới ${targets.length} runtime copies.`);
