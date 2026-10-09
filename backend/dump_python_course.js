const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function dumpFast() {
  const start = Date.now();
  try {
    const courseRes = await pool.query(`
      SELECT id, title, description, level, status
      FROM courses
      WHERE title ILIKE '%python%'
      LIMIT 1
    `);
    const course = courseRes.rows[0];
    console.log(`Exporting: ${course.title} (${course.id})`);

    const modRes = await pool.query(`
      SELECT id, module_id, title, objective, prerequisite, key_knowledge, skills_acquired, duration, order_index
      FROM modules
      WHERE course_id = $1
      ORDER BY order_index ASC
    `, [course.id]);
    const modules = modRes.rows;
    const modIds = modules.map(m => m.id);

    const chapRes = await pool.query(`
      SELECT id, chapter_id, title, objective, core_knowledge, skills_acquired, order_index, module_id
      FROM chapters
      WHERE module_id = ANY($1::uuid[])
      ORDER BY order_index ASC
    `, [modIds]);
    const chapters = chapRes.rows;
    const chapIds = chapters.map(c => c.id);

    const lesRes = await pool.query(`
      SELECT id, lesson_id, title, objective, key_knowledge, difficulty, duration_minutes, is_free, content, order_index, chapter_id
      FROM lessons
      WHERE chapter_id = ANY($1::uuid[])
      ORDER BY order_index ASC
    `, [chapIds]);
    const lessons = lesRes.rows;
    const lesIds = lessons.map(l => l.id);

    const exRes = await pool.query(`
      SELECT id, title, difficulty, problem_description, starter_code, solution_code, lesson_id
      FROM coding_exercises
      WHERE lesson_id = ANY($1::uuid[])
      ORDER BY id ASC
    `, [lesIds]);
    const exercises = exRes.rows;
    const exIds = exercises.map(e => e.id);

    const tcRes = await pool.query(`
      SELECT id, input, expected_output, is_hidden, exercise_id
      FROM test_cases
      WHERE exercise_id = ANY($1::uuid[])
      ORDER BY id ASC
    `, [exIds]);
    const testCases = tcRes.rows;

    console.log(`Fetched in ${Date.now() - start}ms:`);
    console.log(`  Modules: ${modules.length}`);
    console.log(`  Chapters: ${chapters.length}`);
    console.log(`  Lessons: ${lessons.length}`);
    console.log(`  Exercises: ${exercises.length}`);
    console.log(`  TestCases: ${testCases.length}`);

    // Map test cases to exercises
    const tcByEx = {};
    for (const tc of testCases) {
      if (!tcByEx[tc.exercise_id]) tcByEx[tc.exercise_id] = [];
      tcByEx[tc.exercise_id].push(tc);
    }
    for (const ex of exercises) {
      ex.testCases = tcByEx[ex.id] || [];
    }

    // Map exercises to lessons
    const exByLes = {};
    for (const ex of exercises) {
      if (!exByLes[ex.lesson_id]) exByLes[ex.lesson_id] = [];
      exByLes[ex.lesson_id].push(ex);
    }
    for (const les of lessons) {
      les.exercises = exByLes[les.id] || [];
    }

    // Map lessons to chapters
    const lesByChap = {};
    for (const les of lessons) {
      if (!lesByChap[les.chapter_id]) lesByChap[les.chapter_id] = [];
      lesByChap[les.chapter_id].push(les);
    }
    for (const chap of chapters) {
      chap.lessons = lesByChap[chap.id] || [];
    }

    // Map chapters to modules
    const chapByMod = {};
    for (const chap of chapters) {
      if (!chapByMod[chap.module_id]) chapByMod[chap.module_id] = [];
      chapByMod[chap.module_id].push(chap);
    }
    for (const mod of modules) {
      mod.chapters = chapByMod[mod.id] || [];
    }

    course.modules = modules;

    const outPath = path.resolve(__dirname, '../scratch/python_course_full.json');
    fs.writeFileSync(outPath, JSON.stringify(course, null, 2), 'utf-8');
    console.log(`Written to ${outPath} successfully in ${Date.now() - start}ms total.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

dumpFast();
