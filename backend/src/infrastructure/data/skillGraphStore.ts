import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { prisma } from '../database/prisma';

export type GraphLanguage = 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'SQL';

export interface StoredSkillGraph {
  language: GraphLanguage;
  version: string;
  sha256: string;
  raw: string;
  data: any;
  source: 'database' | 'bundled-file';
}

const FILE_BY_LANGUAGE: Record<GraphLanguage, string> = {
  PYTHON: 'pythonSkillGraph.json',
  JAVASCRIPT: 'javascriptSkillGraph.json',
  CPP: 'cppSkillGraph.json',
  SQL: 'sqlSkillGraph.json',
};

const cache = new Map<GraphLanguage, StoredSkillGraph>();

export function normalizeGraphLanguage(language?: string): GraphLanguage {
  const lang = (language || 'PYTHON').toUpperCase();
  if (lang === 'JS' || lang === 'JAVASCRIPT') return 'JAVASCRIPT';
  if (lang === 'C++' || lang === 'CPP') return 'CPP';
  if (lang === 'SQL') return 'SQL';
  return 'PYTHON';
}

function build(language: GraphLanguage, raw: string, source: StoredSkillGraph['source'], sha256?: string): StoredSkillGraph {
  const data = JSON.parse(raw);
  return {
    language,
    version: String(data.version),
    sha256: sha256 ?? createHash('sha256').update(raw, 'utf-8').digest('hex'),
    raw,
    data,
    source,
  };
}

/** Reads the packaged copy; used only until the database cache is warm or when the database is unreachable. */
function readBundled(language: GraphLanguage): StoredSkillGraph | null {
  const name = FILE_BY_LANGUAGE[language];
  // Compiled output (dist/) does not copy the JSON, so also look in the source tree relative to the working directory.
  const candidates = [
    path.resolve(__dirname, name),
    path.resolve(process.cwd(), 'src/infrastructure/data', name),
    path.resolve(__dirname, '../../../src/infrastructure/data', name),
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) return build(language, fs.readFileSync(file, 'utf-8'), 'bundled-file');
  }
  return null;
}

/** Loads the newest stored version of every graph from the database. Failures keep the bundled fallback. */
export async function warmSkillGraphCache(): Promise<void> {
  try {
    const rows = await prisma.skillGraph.findMany({ orderBy: { createdAt: 'desc' } });
    for (const row of rows) {
      const language = row.language as GraphLanguage;
      if (!(language in FILE_BY_LANGUAGE) || cache.get(language)?.source === 'database') continue;
      cache.set(language, build(language, row.content, 'database', row.sha256));
    }
    console.log(`Skill graphs loaded from database: ${[...cache.keys()].join(', ') || 'none'}`);
  } catch (error) {
    console.warn('Skill graph database unavailable, using bundled files:', (error as Error).message);
  }
}

export function getStoredSkillGraph(language?: string): StoredSkillGraph | null {
  const lang = normalizeGraphLanguage(language);
  const cached = cache.get(lang);
  if (cached) return cached;
  const fallback = readBundled(lang);
  if (fallback) cache.set(lang, fallback);
  return fallback;
}
