/**
 * Read-only inventory of LearnPython events relevant to PAL-Net G0.
 *
 * This script emits aggregate JSON only. It contains no create/update/delete
 * operation and never prints the database URL or learner identifiers.
 */
import 'dotenv/config';
import { Pool, PoolClient } from 'pg';

type AggregateRow = Record<string, string | number | boolean | null>;

async function select(client: PoolClient, sql: string): Promise<AggregateRow[]> {
  const result = await client.query<AggregateRow>(sql);
  return result.rows;
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not configured');
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 1,
    connectionTimeoutMillis: 10_000,
  });
  const client = await pool.connect();
  const report: {
    schemaVersion: string;
    capturedAt: string;
    mode: string;
    sources: Record<string, AggregateRow[] | { status: string }>;
    knownLimitations: string[];
  } = {
    schemaVersion: 'palnet-data-inventory/1.0.0',
    capturedAt: new Date().toISOString(),
    mode: 'READ_ONLY',
    sources: {},
    knownLimitations: [
      'Course has no language column; catalog coverage cannot be attributed safely by language.',
      'Coding/practice events require a verified item-to-skill mapping before they are KT-ready.',
      'PASSED/FAILED is an attempt outcome, not automatically a first-attempt label.',
    ],
  };

  try {
    await client.query('BEGIN READ ONLY');
    await client.query("SET LOCAL statement_timeout = '5000ms'");

    report.sources.codingSubmissions = await select(client, `
    WITH labeled AS (
      SELECT s.language::text AS language,
             s.user_id,
             s.exercise_id,
             s.status::text AS status,
             l.lesson_id,
             ROW_NUMBER() OVER (
               PARTITION BY s.user_id, s.exercise_id
               ORDER BY s.submitted_at, s.id
             ) AS attempt_number
      FROM submissions s
      JOIN coding_exercises ce ON ce.id = s.exercise_id
      JOIN lessons l ON l.id = ce.lesson_id
      WHERE s.status::text IN ('PASSED', 'FAILED')
    ), per_user AS (
      SELECT language, user_id, COUNT(*) FILTER (WHERE attempt_number = 1)::int AS sequence_length
      FROM labeled
      GROUP BY language, user_id
    ), sequence_stats AS (
      SELECT language,
             MIN(sequence_length)::int AS sequence_min,
             PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sequence_length)::float8 AS sequence_median,
             PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY sequence_length)::float8 AS sequence_p90,
             MAX(sequence_length)::int AS sequence_max
      FROM per_user
      GROUP BY language
    )
    SELECT l.language,
           COUNT(*)::int AS labeled_events,
           COUNT(*) FILTER (WHERE l.attempt_number = 1)::int AS first_attempt_labeled_events,
           COUNT(DISTINCT l.user_id)::int AS learners,
           COUNT(*) FILTER (WHERE l.status = 'PASSED')::int AS passed_events,
           COUNT(DISTINCT l.lesson_id)::int AS covered_lessons,
           s.sequence_min,
           s.sequence_median,
           s.sequence_p90,
           s.sequence_max
    FROM labeled l
    JOIN sequence_stats s USING (language)
    GROUP BY l.language, s.sequence_min, s.sequence_median, s.sequence_p90, s.sequence_max
    ORDER BY l.language
    `);

    report.sources.practiceSubmissions = await select(client, `
    WITH labeled AS (
      SELECT ps.language::text AS language,
             ps.user_id,
             ps.problem_id,
             ps.status::text AS status,
             ROW_NUMBER() OVER (
               PARTITION BY ps.user_id, ps.problem_id
               ORDER BY ps.submitted_at, ps.id
             ) AS attempt_number
      FROM practice_submissions ps
      WHERE ps.status::text IN ('PASSED', 'FAILED')
    ), per_user AS (
      SELECT language, user_id, COUNT(*) FILTER (WHERE attempt_number = 1)::int AS sequence_length
      FROM labeled
      GROUP BY language, user_id
    ), sequence_stats AS (
      SELECT language,
             MIN(sequence_length)::int AS sequence_min,
             PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sequence_length)::float8 AS sequence_median,
             PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY sequence_length)::float8 AS sequence_p90,
             MAX(sequence_length)::int AS sequence_max
      FROM per_user
      GROUP BY language
    )
    SELECT l.language,
           COUNT(*)::int AS labeled_events,
           COUNT(*) FILTER (WHERE l.attempt_number = 1)::int AS first_attempt_labeled_events,
           COUNT(DISTINCT l.user_id)::int AS learners,
           COUNT(*) FILTER (WHERE l.status = 'PASSED')::int AS passed_events,
           COUNT(DISTINCT l.problem_id)::int AS covered_items,
           s.sequence_min,
           s.sequence_median,
           s.sequence_p90,
           s.sequence_max
    FROM labeled l
    JOIN sequence_stats s USING (language)
    GROUP BY l.language, s.sequence_min, s.sequence_median, s.sequence_p90, s.sequence_max
    ORDER BY l.language
    `);

    const [pretestTable] = await select(
      client,
      "SELECT to_regclass('public.pretest_answers') IS NOT NULL AS exists",
    );
  if (pretestTable?.exists) {
      report.sources.validatedPretestAnswers = await select(client, `
      SELECT a.language::text AS language,
             COUNT(*)::int AS labeled_events,
             COUNT(DISTINCT a.user_id)::int AS learners,
             COUNT(DISTINCT q.primary_skill_id)::int AS covered_skills,
             COUNT(*) FILTER (WHERE ans.is_correct)::int AS correct_events
      FROM pretest_answers ans
      JOIN pretest_attempts a ON a.id = ans.attempt_id
      JOIN pretest_question_snapshots q ON q.id = ans.question_snapshot_id
      JOIN pretest_assessments assessment ON assessment.attempt_id = a.id
      WHERE ans.is_answered = TRUE AND ans.is_correct IS NOT NULL
      GROUP BY a.language
      ORDER BY a.language::text
      `);
  } else {
    report.sources.validatedPretestAnswers = { status: 'TABLE_NOT_DEPLOYED' };
  }

    report.sources.globalCatalog = await select(client, `
    SELECT c.status::text AS course_status,
           COUNT(DISTINCT c.id)::int AS courses,
           COUNT(DISTINCT l.id)::int AS lessons,
           COUNT(DISTINCT ce.id)::int AS coding_exercises
    FROM courses c
    LEFT JOIN modules m ON m.course_id = c.id
    LEFT JOIN chapters ch ON ch.module_id = m.id
    LEFT JOIN lessons l ON l.chapter_id = ch.id
    LEFT JOIN coding_exercises ce ON ce.lesson_id = l.id
    GROUP BY c.status
    ORDER BY c.status::text
    `);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }

  console.log(JSON.stringify(report, null, 2));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });

