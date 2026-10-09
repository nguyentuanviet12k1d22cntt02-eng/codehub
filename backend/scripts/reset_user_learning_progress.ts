/**
 * Removes learning activity for exactly one existing user while retaining the
 * account and course enrollments, so the learner can start the learning flow
 * again without needing to sign up or enroll again.
 *
 * Usage:
 *   npx ts-node scripts/reset_user_learning_progress.ts --email user@example.com --apply
 */
import { prisma } from '../src/infrastructure/database/prisma';

type Counts = Record<string, number>;

function readArgument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function snapshot(userId: string): Promise<Counts> {
  const roadmapWhere = { roadmap: { userId } };
  const itemWhere = { roadmapItem: roadmapWhere };
  const attemptWhere = { attempt: { userId } };
  const queries: Array<[string, any]> = [
    ['lessonProgress', prisma.lessonProgress.count({ where: { userId } })],
    ['codingSubmissions', prisma.submission.count({ where: { userId } })],
    ['practiceSubmissions', prisma.practiceSubmission.count({ where: { userId } })],
    ['aiReviews', prisma.aIReview.count({ where: { userId } })],
    ['certificates', prisma.certificate.count({ where: { userId } })],
    ['personalizedPaths', prisma.personalizedPath.count({ where: { userId } })],
    ['pathChatSessions', prisma.pathChatSession.count({ where: { userId } })],
    ['learnerSurveys', prisma.learnerSurvey.count({ where: { userId } })],
    ['pretestAttempts', prisma.pretestAttempt.count({ where: { userId } })],
    ['pretestQuestions', prisma.pretestQuestionSnapshot.count({ where: attemptWhere })],
    ['pretestAnswers', prisma.pretestAnswer.count({ where: attemptWhere })],
    ['pretestAssessments', prisma.pretestAssessment.count({ where: { userId } })],
    ['learnerSkillStates', prisma.learnerSkillState.count({ where: { userId } })],
    ['roadmaps', prisma.roadmap.count({ where: { userId } })],
    ['roadmapItems', prisma.roadmapItem.count({ where: roadmapWhere })],
    ['roadmapTheoryCheckpoints', prisma.roadmapTheoryCheckpoint.count({ where: itemWhere })],
    ['roadmapQuizSubmissions', prisma.roadmapQuizSubmission.count({ where: itemWhere })],
    ['roadmapPracticalSubmissions', prisma.roadmapPracticalSubmission.count({ where: itemWhere })],
    ['idempotencyRecords', prisma.idempotencyRecord.count({ where: { userId } })],
    ['adaptiveGenerationRuns', prisma.adaptiveGenerationRun.count({ where: { userId } })],
    ['adaptiveSubmissions', prisma.adaptiveSubmission.count({ where: { userId } })],
    ['adaptiveLearnerStates', prisma.adaptiveLearnerState.count({ where: { userId } })],
    ['adaptiveMasteryEvents', prisma.adaptiveMasteryEvent.count({ where: { userId } })],
    // Intentionally preserved: an enrollment grants access to the course; it is
    // not completion evidence.
    ['enrollmentsPreserved', prisma.enrollment.count({ where: { userId } })],
  ];
  const values = await prisma.$transaction(queries.map(([, query]) => query));
  return Object.fromEntries(queries.map(([name], index) => [name, values[index] as number]));
}

async function main(): Promise<void> {
  const email = readArgument('--email')?.trim().toLowerCase();
  const apply = process.argv.includes('--apply');
  if (!email || !email.includes('@')) {
    throw new Error('An exact --email is required. No data changed.');
  }
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, username: true },
  });
  if (!user) throw new Error(`No user found for ${email}. No data changed.`);

  const before = await snapshot(user.id);
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY_RUN', user, before }, null, 2));
  if (!apply) return;

  await prisma.$transaction(async (tx) => {
    // Delete child activity before its parent records. Course/catalog data and
    // user/enrollment records are intentionally absent from this transaction.
    await tx.lessonProgress.deleteMany({ where: { userId: user.id } });
    await tx.submission.deleteMany({ where: { userId: user.id } });
    await tx.practiceSubmission.deleteMany({ where: { userId: user.id } });
    await tx.aIReview.deleteMany({ where: { userId: user.id } });
    await tx.certificate.deleteMany({ where: { userId: user.id } });
    await tx.personalizedPath.deleteMany({ where: { userId: user.id } });

    await tx.adaptiveMasteryEvent.deleteMany({ where: { userId: user.id } });
    await tx.adaptiveSubmission.deleteMany({ where: { userId: user.id } });
    await tx.adaptiveGenerationRun.deleteMany({ where: { userId: user.id } });
    await tx.pathChatSession.deleteMany({ where: { userId: user.id } });
    await tx.adaptiveLearnerState.deleteMany({ where: { userId: user.id } });

    // A roadmap references an assessment with RESTRICT, so remove roadmaps
    // (and their cascading items/evidence) before deleting pretest data.
    await tx.roadmap.deleteMany({ where: { userId: user.id } });
    await tx.pretestAssessment.deleteMany({ where: { userId: user.id } });
    await tx.pretestAttempt.deleteMany({ where: { userId: user.id } });
    await tx.learnerSurvey.deleteMany({ where: { userId: user.id } });
    await tx.learnerSkillState.deleteMany({ where: { userId: user.id } });
    await tx.idempotencyRecord.deleteMany({ where: { userId: user.id } });
  }, { timeout: 30000 });

  const after = await snapshot(user.id);
  const remaining = Object.entries(after)
    .filter(([key, value]) => key !== 'enrollmentsPreserved' && value !== 0);
  if (remaining.length) throw new Error(`Reset incomplete: ${JSON.stringify(Object.fromEntries(remaining))}`);
  console.log(JSON.stringify({ reset: 'COMPLETE', user, after }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
