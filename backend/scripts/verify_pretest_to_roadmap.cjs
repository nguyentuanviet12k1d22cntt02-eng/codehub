/** Full synthetic Pre-test → graded profile → pilot roadmap check.
 * The user and all resulting records are removed in finally. */
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
require('ts-node/register/transpile-only');
const { prisma } = require('../src/infrastructure/database/prisma');
const { getLanguageGraphConfig } = require('../src/modules/onboarding/onboardingConfig');
const { pretestRuntimeService } = require('../src/modules/onboarding/pretestRuntimeService');
const { roadmapRuntimeService } = require('../src/modules/onboarding/roadmapRuntimeService');

async function main() {
  const suffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  let userId = null;
  let roadmapId = null;
  try {
    const username = `pretest-roadmap-qc-${suffix}`;
    const user = await prisma.user.create({ data: {
      username, email: `${username}@example.invalid`, password: 'SYNTHETIC_QC_NOT_A_LOGIN',
    } });
    userId = user.id;
    const graph = getLanguageGraphConfig('PYTHON');
    const survey = await prisma.learnerSurvey.create({ data: {
      userId, language: 'PYTHON', goalId: 'GOAL_PY_BASICS',
      surveyVersion: '2.0', mcodeHistory: 'NEVER_ENROLLED', externalExperience: 'NONE',
      selfAssessment: Object.fromEntries(graph.modules.map(module => [module.id, 1])),
      hoursPerWeek: '2_TO_5_HOURS', preferredPace: 'BALANCED',
      verificationStatus: 'NEW_STUDENT', isDraft: false,
    } });
    const attempt = await pretestRuntimeService.createOrResumeAttempt(userId, survey.id);
    assert.equal(attempt.questions.length, 12);
    const draft = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/infrastructure/data/pretestBank.pythonBasics.draft.json'), 'utf8'));
    const answers = attempt.questions.map((question, index) => {
      const item = draft.items[index];
      assert.equal(question.questionType, item.questionType);
      return item.questionType === 'PRACTICAL'
        ? { questionSnapshotId: question.id, submittedCode: item.referenceSolution }
        : { questionSnapshotId: question.id, selectedOption: item.correctOption };
    });
    const submitted = await pretestRuntimeService.submitAttempt(userId, attempt.id,
      { answers }, `full-chain-${suffix}`);
    assert.equal(submitted.status, 'SUBMITTED');
    const assessment = await pretestRuntimeService.getAssessment(userId, submitted.assessmentId);
    assert.equal(Object.keys(assessment.skills).length, 9);
    const roadmap = await roadmapRuntimeService.create(userId, assessment.id);
    roadmapId = roadmap.id;
    assert.equal(roadmap.totalItems, 26);
    assert.equal(roadmap.items[0].lessonId, 'LS-01.01');
    assert.equal(roadmap.items.filter(item => item.learningStatus === 'AVAILABLE').length, 1);
    assert.equal((await roadmapRuntimeService.get(userId, roadmap.id)).assessmentId, assessment.id);
    console.log(JSON.stringify({ status: 'PRETEST_TO_ROADMAP_PASSED',
      gradedQuestions: 12, skillStates: 9, roadmapLessons: 26,
      initialLesson: 'LS-01.01', oneOpenItem: true, cleanup: 'SYNTHETIC_USER_DELETED' }, null, 2));
  } finally {
    if (roadmapId) await prisma.roadmap.deleteMany({ where: { id: roadmapId } });
    if (userId) await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  }
}
main().catch(error => { console.error(JSON.stringify({ status: 'PRETEST_TO_ROADMAP_FAILED', error: error.message })); process.exitCode = 1; });
