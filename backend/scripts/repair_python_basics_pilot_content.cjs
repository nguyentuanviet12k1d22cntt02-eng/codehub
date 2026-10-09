// One-time, checksum-guarded repair for the published Python Basics pilot.
// Run after seeding. No row outside the five explicitly listed lessons is changed.
require('dotenv').config({ quiet: true });
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { Pool } = require('pg');

const expected = new Map([
  ['LS-01.01', '5c9388c543ab6eb0c0c09f863b88dd26af7718f695294ae973481aa8bb88dfe1'],
  ['LS-04.01', '873870b055350c1e6cb0bfce74eca72a88382b636cd1678566f414f257f3e264'],
  ['LS-04.02', '90c3b39a977737c8e19a76a649752365e39c9cfa0c8c23c708695c0b8e4993ac'],
  ['LS-04.03', '8045441afb8cd5fb5fc0991764dd3bb9edcdad6a649d5e3c4ed39b93718cb809'],
  ['LS-04.04', 'f1367f9abc00cde0f42b582b275e381201cf58e4b146ebe7ccf90f6d31005e7b'],
]);

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }

function repaired(id, original) {
  if (id === 'LS-01.01') {
    const source = path.resolve(__dirname, '../../docs/Dữ liệu nội dung bài học/Python/Cấu trúc bài học/Chapter 01/Lession1.txt');
    return fs.readFileSync(source, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trimEnd() + '\n';
  }
  let content = original.replace(/LS-03\.0([1-4])/g, 'LS-04.0$1')
    .replace(/Lesson 03\.0([1-4])/g, 'Lesson 04.0$1');
  if (id === 'LS-04.04') content = content.replace('LS-03.05: Khái niệm List', 'LS-05.01: Khái niệm List');
  return content;
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `SELECT l.id, l.lesson_id, l.title, l.content, c.status, c.title AS course_title
         FROM lessons l JOIN chapters h ON h.id = l.chapter_id
         JOIN modules m ON m.id = h.module_id JOIN courses c ON c.id = m.course_id
        WHERE l.lesson_id = ANY($1::text[]) FOR UPDATE OF l`,
      [[...expected.keys()]],
    );
    if (result.rows.length !== expected.size) throw new Error('PILOT_CONTENT_SCOPE_MISMATCH');
    const changes = [];
    for (const row of result.rows) {
      if (row.status !== 'PUBLISHED' || row.course_title !== 'Lập trình Python cơ bản cho người mới bắt đầu') {
        throw new Error(`PILOT_COURSE_MISMATCH:${row.lesson_id}`);
      }
      const after = repaired(row.lesson_id, row.content || '');
      const beforeHash = sha(row.content || '');
      if (beforeHash !== expected.get(row.lesson_id) && beforeHash !== sha(after)) {
        throw new Error(`PILOT_CONTENT_CHANGED:${row.lesson_id}`);
      }
      if (beforeHash !== sha(after)) {
        await client.query('UPDATE lessons SET content = $1, updated_at = NOW() WHERE id = $2', [after, row.id]);
      }
      changes.push({ lessonId: row.lesson_id, from: beforeHash, to: sha(after), updated: beforeHash !== sha(after) });
    }
    await client.query('COMMIT');
    console.log(JSON.stringify({ status: 'PILOT_CONTENT_REPAIRED', changes }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
