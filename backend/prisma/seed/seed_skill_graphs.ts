import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import path from 'path';
import type { PrismaClient, ProgrammingLanguage } from '@prisma/client';

// One canonical copy of each graph lives in src/infrastructure/data; the database serves it from here on.
const DATA_DIR = path.join(__dirname, '../../src/infrastructure/data');
const FILES: Array<[ProgrammingLanguage, string]> = [
  ['PYTHON', 'pythonSkillGraph.json'],
  ['JAVASCRIPT', 'javascriptSkillGraph.json'],
  ['CPP', 'cppSkillGraph.json'],
  ['SQL', 'sqlSkillGraph.json'],
];

export async function seedSkillGraphs(prisma: PrismaClient): Promise<void> {
  for (const [language, file] of FILES) {
    const raw = readFileSync(path.join(DATA_DIR, file));
    const content = raw.toString('utf-8');
    const version = String(JSON.parse(content).version);
    const sha256 = createHash('sha256').update(raw).digest('hex');
    // Insert-only: an existing (language, version) row is never modified.
    await prisma.skillGraph.upsert({
      where: { language_version: { language, version } },
      update: {},
      create: { language, version, sha256, content },
    });
    console.log(`skill graph ${language} v${version} sha256=${sha256.slice(0, 12)}`);
  }
}

if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { prisma } = require('../../src/infrastructure/database/prisma');
  seedSkillGraphs(prisma).finally(() => prisma.$disconnect());
}
