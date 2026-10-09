/** Synthetic DB integration: real catalog, rule selection, persistence and unlock.
 * Creates and removes only its own synthetic users and roadmap. */
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
require('ts-node/register/transpile-only');
const { prisma } = require('../src/infrastructure/database/prisma');
const { loadPythonBasicsPilotCatalog } = require('../src/modules/onboarding/pythonBasicsLessonCatalog');
const { roadmapRuntimeService } = require('../src/modules/onboarding/roadmapRuntimeService');

async function main() {
  const suffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const created = [];
  let roadmapId = null;
  try {
    const catalog = await loadPythonBasicsPilotCatalog();
    const skills = ['PY-BASICS-01','PY-BASICS-02','PY-BASICS-03','PY-STRING-01','PY-STRING-02',
      'PY-FLOW-01','PY-FLOW-02','PY-FLOW-03','PY-FLOW-04'];
    for (const name of [`roadmap-qc-${suffix}`, `roadmap-other-${suffix}`]) {
      const user = await prisma.user.create({ data: {
        username: name, email: `${name}@example.invalid`, password: 'SYNTHETIC_QC_NOT_A_LOGIN',
      } });
      created.push(user.id);
    }
    const survey = await prisma.learnerSurvey.create({ data: {
      userId: created[0], language: 'PYTHON', goalId: 'GOAL_PY_BASICS',
      mcodeHistory: 'NEVER_ENROLLED', externalExperience: 'NONE', selfAssessment: {},
      hoursPerWeek: '2_TO_5_HOURS', preferredPace: 'BALANCED', isDraft: false,
    } });
    const attempt = await prisma.pretestAttempt.create({ data: {
      userId: created[0], surveyId: survey.id, language: 'PYTHON', goalId: 'GOAL_PY_BASICS',
      graphVersion: catalog.graphVersion, bankVersion: 'SYNTHETIC_INTEGRATION',
      scoringVersion: '2.0', status: 'SUBMITTED', totalQuestions: 12,
      expiresAt: new Date(Date.now() + 60_000), submittedAt: new Date(),
    } });
    const profile = {
      language: 'PYTHON', goalId: 'GOAL_PY_BASICS', graphVersion: catalog.graphVersion,
      profileVersion: '2.0', skills: Object.fromEntries(skills.map(skillId => [skillId, {
        skillId, masteryScore: skillId.startsWith('PY-STRING') ? 0.1 : 0.9,
        confidence: 0.9, evidenceCount: 2, hasApplicationEvidence: false,
      }])),
    };
    const assessment = await prisma.pretestAssessment.create({ data: {
      attemptId: attempt.id, userId: created[0], language: 'PYTHON', goalId: 'GOAL_PY_BASICS',
      graphVersion: catalog.graphVersion, profileVersion: '2.0',
      totalScore: 8, maxPossibleScore: 16.5, evaluatedSkillsCount: skills.length,
      rawAssessmentData: { profile, synthetic: true },
    } });
    const roadmap = await roadmapRuntimeService.create(created[0], assessment.id);
    roadmapId = roadmap.id;
    assert.equal(roadmap.totalItems, 26);
    assert.equal(roadmap.items.filter(item => item.learningStatus === 'AVAILABLE').length, 1);
    assert.equal(roadmap.items[0].lessonId, 'LS-01.01');
    assert.equal(roadmap.items[7].lessonId, 'LS-04.01');
    assert.equal((await roadmapRuntimeService.create(created[0], assessment.id)).id, roadmapId);
    await assert.rejects(roadmapRuntimeService.get(created[1], roadmapId), /FORBIDDEN/);
    const concurrentSyncs = await Promise.all(Array.from({ length: 4 }, () =>
      roadmapRuntimeService.sync(created[0], roadmapId)));
    assert.ok(concurrentSyncs.every(result =>
      result.items.filter(item => item.learningStatus === 'AVAILABLE').length === 1));
    const exercises = await prisma.codingExercise.findMany({
      where: { lessonId: roadmap.items[0].contentId }, select: { id: true },
    });
    assert.ok(exercises.length > 1);
    await prisma.submission.create({ data: {
      userId: created[0], exerciseId: exercises[0].id, language: 'PYTHON',
      code: 'SYNTHETIC_QC_PASS', status: 'PASSED',
    } });
    await prisma.lessonProgress.create({ data: {
      userId: created[0], lessonId: roadmap.items[0].contentId,
      isCompleted: true, completedAt: new Date(),
    } });
    const premature = await roadmapRuntimeService.sync(created[0], roadmapId);
    assert.equal(premature.completedItems, 0);
    assert.equal(premature.items.find(item => item.learningStatus === 'AVAILABLE').lessonId, 'LS-01.01');
    await prisma.submission.createMany({ data: exercises.slice(1).map(exercise => ({
      userId: created[0], exerciseId: exercise.id, language: 'PYTHON',
      code: 'SYNTHETIC_QC_PASS', status: 'PASSED',
    })) });
    const synced = await roadmapRuntimeService.sync(created[0], roadmapId);
    assert.equal(synced.completedItems, 1);
    assert.equal(synced.items.filter(item => item.learningStatus === 'AVAILABLE').length, 1);
    assert.equal(synced.items.find(item => item.learningStatus === 'AVAILABLE').lessonId, 'LS-01.02');
    await prisma.roadmap.delete({ where: { id: roadmapId } });
    roadmapId = null;
    const recreated = await roadmapRuntimeService.create(created[0], assessment.id);
    roadmapId = recreated.id;
    assert.equal(recreated.totalItems, 26);
    assert.equal(recreated.items.length, 26);
    assert.equal(recreated.completedItems, 1);
    assert.equal(recreated.items[0].learningStatus, 'COMPLETED');
    assert.equal(recreated.items.find(item => item.learningStatus === 'AVAILABLE').lessonId, 'LS-01.02');
    console.log(JSON.stringify({ status: 'ROADMAP_E2E_PASSED', catalogLessons: catalog.lessons.length,
      weakStringLessonPosition: 8, idempotent: true, crossUserBlocked: true,
      oneOpenItem: true, concurrentSyncSafe: true, completedLessonPreserved: true,
      prematureUnlockBlocked: true,
      nextLesson: 'LS-01.02', cleanup: 'SYNTHETIC_USERS_DELETED' }, null, 2));
  } finally {
    if (roadmapId) await prisma.roadmap.deleteMany({ where: { id: roadmapId } });
    if (created.length) await prisma.user.deleteMany({ where: { id: { in: created } } });
    await prisma.$disconnect();
  }
}
main().catch(error => { console.error(JSON.stringify({ status: 'ROADMAP_E2E_FAILED', error: error.message })); process.exitCode = 1; });
