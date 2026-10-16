const fs = require('node:fs');
const path = require('node:path');

const backendRoot = path.resolve(__dirname, '..');
const dist = path.resolve(backendRoot, 'dist');

if (path.dirname(dist) !== backendRoot || path.basename(dist) !== 'dist') {
    throw new Error(`Refusing to clean unexpected path: ${dist}`);
}

fs.rmSync(dist, { recursive: true, force: true });
