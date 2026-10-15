/**
 * Export a read-only, skill-mapped exercise catalog for KT experiments.
 *
 * The exported IDs, titles, lesson codes and difficulties come from the live
 * product database. No learner identity, submitted code or free-text answer is
 * read or written.
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ quiet: true });

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const GRAPH_ROOT = path.join(PROJECT_ROOT, 'ai-service', 'data');
const OUTPUT_ROOT = path.join(GRAPH_ROOT, 'real_exercise_catalog');
const LANGUAGES = {
  python: { db: 'PYTHON', graph: 'pythonSkillGraph.json' },
  javascript: { db: 'JAVASCRIPT', graph: 'javascriptSkillGraph.json' },
  cpp: { db: 'CPP', graph: 'cppSkillGraph.json' },
};
const DIFFICULTY = { EASY: 1, MEDIUM: 2, HARD: 3 };

function mappedSkills(graph, lessonCode, lessonTitle) {
  const raw = graph.multi_skill_lesson_mappings?.[lessonCode]
    ?? graph.lesson_title_mappings?.[lessonTitle]
    ?? graph.lesson_mappings?.[lessonCode];
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const valid = new Set((graph.skills || []).map((skill) => String(skill.id)));
  return [...new Set(values.map(String).filter((skill) => valid.has(skill)))];
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    connectionTimeoutMillis: 10000,
  });
  const client = await pool.connect();
  const catalogs = {};
  let submissionInventory = [];
  try {
    await client.query('BEGIN READ ONLY');
    await client.query("SET LOCAL statement_timeout = '10000ms'");
    const exercises = (await client.query(`
      SELECT ce.id::text AS item_id,
             ce.title AS item_title,
             ce.difficulty::text AS difficulty,
             l.lesson_id AS lesson_code,
             l.title AS lesson_title,
             c.title AS course_title
      FROM coding_exercises ce
      JOIN lessons l ON l.id = ce.lesson_id
      JOIN chapters ch ON ch.id = l.chapter_id
      JOIN modules m ON m.id = ch.module_id
      JOIN courses c ON c.id = m.course_id
      ORDER BY l.lesson_id, ce.title, ce.id
    `)).rows;
    submissionInventory = (await client.query(`
      SELECT language::text AS language,
             COUNT(*) FILTER (WHERE status::text IN ('PASSED', 'FAILED'))::int AS labeled_events,
             COUNT(DISTINCT user_id) FILTER (WHERE status::text IN ('PASSED', 'FAILED'))::int AS learners,
             COUNT(DISTINCT exercise_id) FILTER (WHERE status::text IN ('PASSED', 'FAILED'))::int AS covered_items
      FROM submissions
      GROUP BY language
      ORDER BY language
    `)).rows;
    await client.query('COMMIT');

    for (const [language, config] of Object.entries(LANGUAGES)) {
      const graphPath = path.join(GRAPH_ROOT, config.graph);
      const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
      const items = exercises.flatMap((exercise) => {
        const skillIds = mappedSkills(graph, exercise.lesson_code, exercise.lesson_title);
        if (!skillIds.length) return [];
        return [{
          item_id: exercise.item_id,
          item_title: exercise.item_title,
          item_source: 'CODING_EXERCISE_DB',
          lesson_code: exercise.lesson_code,
          lesson_title: exercise.lesson_title,
          course_title: exercise.course_title,
          difficulty: DIFFICULTY[exercise.difficulty] || 2,
          difficulty_label: exercise.difficulty,
          skill_ids: skillIds,
        }];
      });
      if (!items.length) throw new Error(`No mapped database exercises for ${language}`);
      catalogs[language] = {
        schema_version: 'real-exercise-catalog/1.0',
        language,
        database_language: config.db,
        data_origin: 'REAL_PRODUCT_CATALOG',
        contains_learner_data: false,
        source_graph: config.graph,
        mapping_basis: 'Versioned lesson mappings in the language skill graph',
        items,
      };
    }
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch (_) { /* connection may already be closed */ }
    throw error;
  } finally {
    client.release();
    await pool.end();
  }

  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
  for (const [language, catalog] of Object.entries(catalogs)) {
    fs.writeFileSync(
      path.join(OUTPUT_ROOT, `${language}_items.json`),
      `${JSON.stringify(catalog, null, 2)}\n`,
      'utf8',
    );
  }
  const inventory = {
    schema_version: 'real-exercise-inventory/1.0',
    data_origin: 'REAL_PRODUCT_DATABASE',
    privacy: 'Aggregate counts only; no learner identifiers or submitted code',
    catalog_items: Object.fromEntries(
      Object.entries(catalogs).map(([language, catalog]) => [language, catalog.items.length]),
    ),
    catalog_skills: Object.fromEntries(
      Object.entries(catalogs).map(([language, catalog]) => [
        language,
        new Set(catalog.items.flatMap((item) => item.skill_ids)).size,
      ]),
    ),
    real_submission_inventory: submissionInventory,
  };
  fs.writeFileSync(
    path.join(OUTPUT_ROOT, 'inventory.json'),
    `${JSON.stringify(inventory, null, 2)}\n`,
    'utf8',
  );
  console.log(JSON.stringify(inventory, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
