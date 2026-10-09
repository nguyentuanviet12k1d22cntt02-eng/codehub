/** End-to-end verification against the configured database and Docker runner.
 * Creates isolated synthetic users, runs one full Python Basics Pre-test, then
 * deletes only those synthetic users (all related rows cascade). Never prints
 * answer keys, submitted code, hidden inputs or expected outputs. */
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
require('ts-node/register/transpile-only');

const { prisma } = require('../src/infrastructure/database/prisma');
const { getLanguageGraphConfig } = require('../src/modules/onboarding/onboardingConfig');
const { pretestRuntimeService } = require('../src/modules/onboarding/pretestRuntimeService');

const root = path.resolve(__dirname, '../..');
const draftPath = path.join(root, 'backend/src/infrastructure/data/pretestBank.pythonBasics.draft.json');

async function main() {
  const runId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const usernames = [`pretest-qc-${runId}`, `pretest-qc-other-${runId}`];
  const createdUserIds = [];
  const startedAt = new Date().toISOString();
  let report;
  try {
    for (const username of usernames) {
      const user = await prisma.user.create({
        data: { username, email: `${username}@example.invalid`, password: 'SYNTHETIC_QC_NOT_A_LOGIN' },
      });
      createdUserIds.push(user.id);
    }
    const graph = getLanguageGraphConfig('PYTHON');
    const survey = await prisma.learnerSurvey.create({
      data: {
        userId: createdUserIds[0], language: 'PYTHON', surveyVersion: '2.0', goalId: 'GOAL_PY_BASICS',
        mcodeHistory: 'NEVER_ENROLLED', externalExperience: 'NONE',
        selfAssessment: Object.fromEntries(graph.modules.map(module => [module.id, 1])),
        hoursPerWeek: '2_TO_5_HOURS', preferredPace: 'BALANCED',
        verificationStatus: 'NEW_STUDENT', isDraft: false,
      },
    });

    const attempt = await pretestRuntimeService.createOrResumeAttempt(createdUserIds[0], survey.id);
    assert.equal(attempt.status, 'ACTIVE');
    assert.equal(attempt.questions.length, 12);
    assert.equal(attempt.answers.length, 12);
    const publicJson = JSON.stringify(attempt);
    for (const forbidden of ['correctAnswerHash', 'testCasesJson', 'expectedStdout', 'referenceSolution', 'knownIncorrectSolution']) {
      assert.equal(publicJson.includes(forbidden), false, `public response leaked ${forbidden}`);
    }
    await assert.rejects(
      pretestRuntimeService.getAttempt(createdUserIds[1], attempt.id),
      /FORBIDDEN/,
    );

    const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
    assert.equal(draft.items.length, attempt.questions.length);
    const answers = attempt.questions.map((question, index) => {
      const item = draft.items[index];
      assert.equal(question.orderIndex, index + 1);
      assert.equal(question.questionType, item.questionType);
      return item.questionType === 'PRACTICAL'
        ? { questionSnapshotId: question.id, submittedCode: item.referenceSolution }
        : { questionSnapshotId: question.id, selectedOption: item.correctOption };
    });
    const payload = { answers };
    const key = `qc-submit-${runId}`;
    const submitted = await pretestRuntimeService.submitAttempt(createdUserIds[0], attempt.id, payload, key);
    assert.equal(submitted.status, 'SUBMITTED');
    assert.ok(submitted.assessmentId);
    const replayed = await pretestRuntimeService.submitAttempt(createdUserIds[0], attempt.id, payload, key);
    assert.equal(replayed.assessmentId, submitted.assessmentId);
    await assert.rejects(
      pretestRuntimeService.submitAttempt(createdUserIds[0], attempt.id, { answers: [] }, key),
      /IDEMPOTENCY_CONFLICT/,
    );

    const assessment = await pretestRuntimeService.getAssessment(createdUserIds[0], submitted.assessmentId);
    assert.equal(assessment.totalScore, assessment.maxPossibleScore);
    assert.equal(Object.keys(assessment.skills).length, 9);
    const profile = await pretestRuntimeService.getLearnerProfile(createdUserIds[0], 'PYTHON');
    assert.equal(Object.keys(profile.skills).length, 9);
    const stored = await prisma.pretestAttempt.findUnique({
      where: { id: attempt.id }, include: { questions: true, answers: true, assessment: true },
    });
    assert.equal(stored.status, 'SUBMITTED');
    assert.equal(stored.answers.filter(answer => answer.isAnswered && answer.score !== null).length, 12);
    assert.ok(stored.assessment);

    report = {
      status: 'PRETEST_RUNTIME_E2E_PASSED',
      startedAt,
      finishedAt: new Date().toISOString(),
      attemptQuestions: attempt.questions.length,
      objectivelyAndRunnerGraded: stored.answers.filter(answer => answer.score !== null).length,
      skillProfiles: Object.keys(profile.skills).length,
      score: assessment.totalScore,
      maxScore: assessment.maxPossibleScore,
      idempotentReplay: replayed.assessmentId === submitted.assessmentId,
      crossUserAccessBlocked: true,
      publicSecretsBlocked: true,
      dockerPracticalQuestions: 3,
      cleanup: 'SYNTHETIC_USERS_DELETED',
    };
  } finally {
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }
    await prisma.$disconnect();
  }
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch(error => {
  process.stderr.write(`${JSON.stringify({ status: 'PRETEST_RUNTIME_E2E_FAILED', error: error.message })}\n`);
  process.exitCode = 1;
});
