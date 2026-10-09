import { prisma } from '../../infrastructure/database/prisma';
import { PilotLesson } from './pythonBasicsLessonCatalog';

export interface VerifiedLessonCompletion {
  completedAt: Date;
  passedExerciseCount: number;
}

/** Legacy lesson_progress becomes true after the first passed exercise.
 * Pilot roadmap completion therefore requires a passed submission for every
 * coding exercise attached to a lesson. No client-supplied completion flag. */
export async function verifiedPythonBasicsCompletions(
  userId: string, lessons: readonly PilotLesson[],
): Promise<Map<string, VerifiedLessonCompletion>> {
  const exercises = await prisma.codingExercise.findMany({
    where: { lessonId: { in: lessons.map(item => item.contentId) } },
    select: { id: true, lessonId: true },
  });
  const exerciseIds = exercises.map(item => item.id);
  const submissions = await prisma.submission.findMany({
    where: { userId, language: 'PYTHON', status: 'PASSED', exerciseId: { in: exerciseIds } },
    select: { exerciseId: true, submittedAt: true },
  });
  const latestPass = new Map<string, Date>();
  for (const submission of submissions) {
    const prior = latestPass.get(submission.exerciseId);
    if (!prior || submission.submittedAt > prior) latestPass.set(submission.exerciseId, submission.submittedAt);
  }
  const byLesson = new Map<string, string[]>();
  for (const exercise of exercises) {
    const group = byLesson.get(exercise.lessonId) ?? [];
    group.push(exercise.id);
    byLesson.set(exercise.lessonId, group);
  }
  const result = new Map<string, VerifiedLessonCompletion>();
  for (const lesson of lessons) {
    const ids = byLesson.get(lesson.contentId) ?? [];
    if (ids.length === 0 || !ids.every(id => latestPass.has(id))) continue;
    result.set(lesson.lessonId, {
      completedAt: new Date(Math.max(...ids.map(id => latestPass.get(id)!.getTime()))),
      passedExerciseCount: ids.length,
    });
  }
  return result;
}
