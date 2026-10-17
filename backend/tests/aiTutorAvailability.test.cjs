const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { prisma } = require('../dist/infrastructure/database/prisma');
const {
  AI_TUTOR_FEATURE_KEY,
  getTutorAvailability,
  setTutorAvailability,
} = require('../dist/modules/ai-tutor/tutorAvailability');

test('AI Tutor availability persists a single global switch through parameterized queries', async () => {
  const original = prisma.$queryRawUnsafe;
  const calls = [];
  prisma.$queryRawUnsafe = async (...args) => {
    calls.push(args);
    return [{ is_enabled: args.includes(false) ? false : true, updated_at: new Date('2026-10-17T00:00:00.000Z'), updated_by: null }];
  };
  try {
    assert.deepEqual(await getTutorAvailability(), {
      enabled: true,
      updatedAt: new Date('2026-10-17T00:00:00.000Z'),
      updatedBy: null,
    });
    assert.equal((await setTutorAvailability(false, '11111111-1111-1111-1111-111111111111')).enabled, false);
    assert.equal(calls.length, 2);
    assert.match(calls[0][0], /ON CONFLICT \("key"\)/);
    assert.match(calls[0][0], /DO NOTHING/);
    assert.match(calls[1][0], /\$2/);
    assert.deepEqual(calls[1].slice(1), [AI_TUTOR_FEATURE_KEY, false, '11111111-1111-1111-1111-111111111111']);
  } finally {
    prisma.$queryRawUnsafe = original;
  }
});

test('AI Tutor availability migration and learner route are present', () => {
  const migration = fs.readFileSync(path.join(__dirname,
    '../prisma/migrations/20261017090000_ai_tutor_availability/migration.sql'), 'utf8');
  const routes = fs.readFileSync(path.join(__dirname, '../src/modules/learning-path/learningPathRoutes.ts'), 'utf8');
  const controller = fs.readFileSync(path.join(__dirname, '../src/modules/adaptive/adaptive.controller.ts'), 'utf8');
  assert.match(migration, /CREATE TABLE IF NOT EXISTS "platform_feature_settings"/);
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.ok(routes.indexOf("'/ai-tutor/availability'") < routes.indexOf("'/:pathId'"));
  assert.match(controller, /AI_TUTOR_LOCKED/);
});
