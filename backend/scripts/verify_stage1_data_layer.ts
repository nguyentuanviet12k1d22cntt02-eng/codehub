import { randomUUID } from 'crypto';
import { prisma } from '../src/infrastructure/database/prisma';

type ExpectedDatabaseCode = 'P2002' | 'P2003' | 'P2004' | '23514';

const LANGUAGE_CASES = [
  { language: 'PYTHON', goalId: 'GOAL_PY_BASICS', graphVersion: '2.1', skillId: 'PY-BASICS-01' },
  { language: 'JAVASCRIPT', goalId: 'GOAL_JS_BASICS', graphVersion: '3.0.0', skillId: 'JS-VAR-01' },
  { language: 'CPP', goalId: 'GOAL_CPP_BASICS', graphVersion: '4.0.0', skillId: 'CPP-SYNTAX-01' },
  { language: 'SQL', goalId: 'GOAL_SQL_BASICS', graphVersion: '2.0', skillId: 'SQL-RDBMS-01' },
] as const;

async function expectPrismaError(
  label: string,
  expectedCodes: ExpectedDatabaseCode[],
  action: () => Promise<unknown>,
) {
  try {
    await action();
  } catch (error) {
    const directCode = typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : null;
    const driverCode = typeof error === 'object' && error !== null && 'cause' in error
      && typeof (error as { cause: unknown }).cause === 'object'
      && (error as { cause: object | null }).cause !== null
      && 'originalCode' in (error as { cause: object }).cause
      ? String((error as { cause: { originalCode: unknown } }).cause.originalCode)
      : null;
    const code = directCode ?? driverCode;
    if (code && expectedCodes.includes(code as ExpectedDatabaseCode)) {
      console.log(`✅ ${label}: rejected with ${code}.`);
      return;
    }
    throw new Error(`${label}: expected ${expectedCodes.join('/')} but received ${code ?? 'a non-Prisma error'}`, {
      cause: error,
    });
  }
  throw new Error(`${label}: database accepted invalid data.`);
}

async function snapshotProtectedCounts() {
  const [courses, users, enrollments, lessonProgress, submissions, adaptiveRuns, adaptiveSubmissions, adaptiveStates, adaptiveEvents] =
    await Promise.all([
      prisma.course.count(),
      prisma.user.count(),
      prisma.enrollment.count(),
      prisma.lessonProgress.count(),
      prisma.submission.count(),
      prisma.adaptiveGenerationRun.count(),
      prisma.adaptiveSubmission.count(),
      prisma.adaptiveLearnerState.count(),
      prisma.adaptiveMasteryEvent.count(),
    ]);
  return { courses, users, enrollments, lessonProgress, submissions, adaptiveRuns, adaptiveSubmissions, adaptiveStates, adaptiveEvents };
}

async function cleanupVerificationUser(userId: string) {
  await prisma.roadmap.deleteMany({ where: { userId } });
  await prisma.pretestAttempt.deleteMany({ where: { userId } });
  await prisma.learnerSurvey.deleteMany({ where: { userId } });
  await prisma.learnerSkillState.deleteMany({ where: { userId } });
  await prisma.idempotencyRecord.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
}

async function main() {
  console.log('🧪 Starting isolated Stage 1 Data Layer Verification...');
  const before = await snapshotProtectedCounts();
  if (before.courses === 0) {
    throw new Error('FAILED: No existing course data was found.');
  }

  const runId = randomUUID();
  const testUser = await prisma.user.create({
    data: {
      username: `stage1_verify_${runId}`,
      email: `stage1-verify-${runId}@example.invalid`,
      password: randomUUID(),
    },
    select: { id: true },
  });

  let verificationError: unknown;
  try {
    for (const fixture of LANGUAGE_CASES) {
      const survey = await prisma.learnerSurvey.create({
        data: {
          userId: testUser.id,
          language: fixture.language,
          surveyVersion: '2.0',
          goalId: fixture.goalId,
          mcodeHistory: 'NEVER_ENROLLED',
          externalExperience: 'NONE',
          selfAssessment: {},
          hoursPerWeek: '2_TO_5_HOURS',
          preferredPace: 'BALANCED',
          verificationStatus: 'NEW_STUDENT',
        },
      });

      const attempt = await prisma.pretestAttempt.create({
        data: {
          userId: testUser.id,
          surveyId: survey.id,
          language: fixture.language,
          goalId: fixture.goalId,
          graphVersion: fixture.graphVersion,
          totalQuestions: 12,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
          idempotencyKey: `create-${fixture.language}`,
          idempotencyRequestHash: `hash-${fixture.language}`,
        },
      });

      await expectPrismaError(`one ACTIVE ${fixture.language} attempt per learner`, ['P2002'], () =>
        prisma.pretestAttempt.create({
          data: {
            userId: testUser.id,
            surveyId: survey.id,
            language: fixture.language,
            goalId: fixture.goalId,
            graphVersion: fixture.graphVersion,
            totalQuestions: 12,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
          },
        }),
      );

      const question = await prisma.pretestQuestionSnapshot.create({
        data: {
          attemptId: attempt.id,
          language: fixture.language,
          orderIndex: 1,
          questionVersion: '1.0',
          rubricVersion: '1.0',
          primarySkillId: fixture.skillId,
          questionType: 'CONCEPT',
          prompt: `Validated ${fixture.language} verification question`,
          correctAnswerHash: 'verification-only-hash',
          optionsJson: ['A', 'B', 'C', 'D'],
        },
      });

      await prisma.pretestAnswer.create({
        data: {
          attemptId: attempt.id,
          questionSnapshotId: question.id,
          selectedOption: 'A',
          isAnswered: true,
          answeredAt: new Date(),
          score: 1,
          isCorrect: true,
        },
      });

      await prisma.pretestAttempt.update({
        where: { id: attempt.id },
        data: { status: 'SUBMITTED', submittedAt: new Date() },
      });

      const assessment = await prisma.pretestAssessment.create({
        data: {
          attemptId: attempt.id,
          userId: testUser.id,
          language: fixture.language,
          goalId: fixture.goalId,
          graphVersion: fixture.graphVersion,
          profileVersion: '2.0',
          totalScore: 1,
          maxPossibleScore: 1,
          evaluatedSkillsCount: 1,
          developingCount: 1,
          rawAssessmentData: { [fixture.skillId]: { score: 1, confidence: 0.6, status: 'DEVELOPING' } },
        },
      });

      await prisma.learnerSkillState.create({
        data: {
          userId: testUser.id,
          language: fixture.language,
          skillId: fixture.skillId,
          graphVersion: fixture.graphVersion,
          masteryScore: 1,
          confidence: 0.6,
          evidenceCount: 1,
          evidenceSources: [{ type: 'PRETEST', assessmentId: assessment.id, questionId: question.id }],
          status: 'DEVELOPING',
        },
      });

      const roadmap = await prisma.roadmap.create({
        data: {
          userId: testUser.id,
          language: fixture.language,
          goalId: fixture.goalId,
          assessmentId: assessment.id,
          graphVersion: fixture.graphVersion,
          title: `Verification roadmap ${fixture.language}`,
          totalItems: 2,
        },
      });

      const firstItem = await prisma.roadmapItem.create({
        data: {
          roadmapId: roadmap.id,
          orderIndex: 1,
          skillId: fixture.skillId,
          title: 'Verification item 1',
          objective: 'Verify sequential learning state',
          reason: 'Stage 1 verification',
          learningStatus: 'AVAILABLE',
          contentStatus: 'PLANNED',
          requiredTheoryCheckpointCount: 1,
        },
      });

      await prisma.roadmapItem.create({
        data: {
          roadmapId: roadmap.id,
          orderIndex: 2,
          skillId: `${fixture.skillId}-NEXT`,
          title: 'Verification item 2',
          objective: 'Remain locked',
          reason: 'Stage 1 verification',
          learningStatus: 'LOCKED',
          contentStatus: 'PLANNED',
        },
      });

      await expectPrismaError(`one open item in ${fixture.language} roadmap`, ['P2002'], () =>
        prisma.roadmapItem.create({
          data: {
            roadmapId: roadmap.id,
            orderIndex: 3,
            skillId: `${fixture.skillId}-INVALID-OPEN`,
            title: 'Invalid second open item',
            objective: 'Must be rejected',
            reason: 'Invariant test',
            learningStatus: 'IN_PROGRESS',
          },
        }),
      );

      await prisma.roadmapTheoryCheckpoint.create({
        data: { roadmapItemId: firstItem.id, checkpointId: 'theory-1', evidence: { source: 'server' } },
      });
      await prisma.roadmapQuizSubmission.create({
        data: {
          submissionId: randomUUID(),
          roadmapItemId: firstItem.id,
          questionCount: 5,
          correctCount: 4,
          score: 80,
          answersJson: [],
        },
      });
      await prisma.roadmapPracticalSubmission.create({
        data: {
          submissionId: randomUUID(),
          roadmapItemId: firstItem.id,
          runnerLanguage: fixture.language,
          runnerVersion: 'verification-runner',
          publicTestsPassed: 2,
          publicTestsTotal: 2,
          hiddenTestsPassed: 2,
          hiddenTestsTotal: 2,
          passed: true,
        },
      });

      console.log(`✅ ${fixture.language}: ownership, snapshot, profile, roadmap and DoD evidence persisted.`);
    }

    const firstCase = LANGUAGE_CASES[0];
    const firstAttempt = await prisma.pretestAttempt.findFirstOrThrow({
      where: { userId: testUser.id, language: firstCase.language },
      orderBy: { createdAt: 'asc' },
    });
    const secondSurvey = await prisma.learnerSurvey.create({
      data: {
        userId: testUser.id,
        language: firstCase.language,
        goalId: firstCase.goalId,
        mcodeHistory: 'NOT_SURE',
        externalExperience: 'NONE',
        selfAssessment: {},
        hoursPerWeek: '2_TO_5_HOURS',
        preferredPace: 'BALANCED',
      },
    });
    const secondAttempt = await prisma.pretestAttempt.create({
      data: {
        userId: testUser.id,
        surveyId: secondSurvey.id,
        language: firstCase.language,
        goalId: firstCase.goalId,
        graphVersion: firstCase.graphVersion,
        totalQuestions: 12,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });
    const secondQuestion = await prisma.pretestQuestionSnapshot.create({
      data: {
        attemptId: secondAttempt.id,
        language: firstCase.language,
        orderIndex: 1,
        primarySkillId: firstCase.skillId,
        questionType: 'CONCEPT',
        prompt: 'Cross-attempt foreign key verification',
        correctAnswerHash: 'verification-only-hash',
      },
    });
    await expectPrismaError('cross-attempt answer ownership', ['P2003'], () =>
      prisma.pretestAnswer.create({
        data: {
          attemptId: firstAttempt.id,
          questionSnapshotId: secondQuestion.id,
          selectedOption: 'A',
          isAnswered: true,
        },
      }),
    );

    await prisma.idempotencyRecord.create({
      data: {
        userId: testUser.id,
        scope: 'CREATE_ROADMAP',
        key: 'same-key',
        requestHash: 'hash-1',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    await expectPrismaError('idempotency key scope', ['P2002'], () =>
      prisma.idempotencyRecord.create({
        data: {
          userId: testUser.id,
          scope: 'CREATE_ROADMAP',
          key: 'same-key',
          requestHash: 'different-payload-hash',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      }),
    );

    await expectPrismaError('unsupported C roadmap language', ['P2004', '23514'], () =>
      prisma.learnerSurvey.create({
        data: {
          userId: testUser.id,
          language: 'C',
          goalId: 'GOAL_C_UNSUPPORTED',
          mcodeHistory: 'NEVER_ENROLLED',
          externalExperience: 'NONE',
          selfAssessment: {},
          hoursPerWeek: '2_TO_5_HOURS',
          preferredPace: 'BALANCED',
        },
      }),
    );

    console.log('🎉 ALL ISOLATED STAGE 1 DATA LAYER VERIFICATIONS PASSED.');
  } catch (error) {
    verificationError = error;
  } finally {
    await cleanupVerificationUser(testUser.id);
    const after = await snapshotProtectedCounts();
    if (JSON.stringify(after) !== JSON.stringify(before)) {
      const countError = new Error(`Protected row counts changed: before=${JSON.stringify(before)} after=${JSON.stringify(after)}`);
      verificationError = verificationError
        ? new AggregateError([verificationError, countError], 'Verification failed and cleanup changed protected data')
        : countError;
    }
    await prisma.$disconnect();
  }

  if (verificationError) {
    throw verificationError;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  });
