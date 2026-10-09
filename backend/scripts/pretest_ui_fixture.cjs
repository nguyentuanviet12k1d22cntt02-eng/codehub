/** Temporary local UI fixture. Usage: node scripts/pretest_ui_fixture.cjs create
 * or node scripts/pretest_ui_fixture.cjs cleanup <user-id>. */
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
require('ts-node/register/transpile-only');
const { prisma } = require('../src/infrastructure/database/prisma');
const { getLanguageGraphConfig } = require('../src/modules/onboarding/onboardingConfig');

async function main() {
  const action = process.argv[2];
  if (action === 'cleanup') {
    const userId = process.argv[3];
    if (!/^[0-9a-f-]{36}$/i.test(userId || '')) throw new Error('INVALID_FIXTURE_USER_ID');
    const deleted = await prisma.user.deleteMany({ where: { id: userId, username: { startsWith: 'pretest-ui-' } } });
    process.stdout.write(`${JSON.stringify({ status: 'UI_FIXTURE_CLEANED', deleted: deleted.count })}\n`);
    return;
  }
  if (action !== 'create') throw new Error('USAGE: create | cleanup <user-id>');
  const suffix = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
  const username = `pretest-ui-${suffix}`;
  const password = 'TempPretest!2026';
  const user = await prisma.user.create({
    data: { username, email: `${username}@example.invalid`, password: await bcrypt.hash(password, 10) },
  });
  const graph = getLanguageGraphConfig('PYTHON');
  const survey = await prisma.learnerSurvey.create({
    data: {
      userId: user.id, language: 'PYTHON', goalId: 'GOAL_PY_BASICS', surveyVersion: '2.0',
      mcodeHistory: 'NEVER_ENROLLED', externalExperience: 'NONE',
      selfAssessment: Object.fromEntries(graph.modules.map(module => [module.id, 1])),
      hoursPerWeek: '2_TO_5_HOURS', preferredPace: 'BALANCED',
      verificationStatus: 'NEW_STUDENT', isDraft: false,
    },
  });
  process.stdout.write(`${JSON.stringify({ status: 'UI_FIXTURE_READY', userId: user.id, username, password, surveyId: survey.id })}\n`);
}

main().finally(() => prisma.$disconnect()).catch(error => {
  process.stderr.write(`${JSON.stringify({ status: 'UI_FIXTURE_FAILED', error: error.message })}\n`);
  process.exitCode = 1;
});
