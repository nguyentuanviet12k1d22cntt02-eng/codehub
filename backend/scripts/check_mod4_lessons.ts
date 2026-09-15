import { prisma } from '../src/infrastructure/database/prisma';

async function checkMod4Lessons() {
  const lessons = await prisma.lesson.findMany({
    where: { lessonId: { startsWith: 'LS-04' } },
    include: {
      codingExercises: {
        select: { id: true, title: true, testCases: { select: { id: true } } }
      }
    },
    orderBy: { lessonId: 'asc' }
  });

  for (const l of lessons) {
    console.log(`Lesson ${l.lessonId}: "${l.title}" - ${l.codingExercises.length} bài`);
    for (const ex of l.codingExercises) {
      console.log(`  - "${ex.title}": ${ex.testCases.length} TCs`);
    }
  }
}

checkMod4Lessons()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
