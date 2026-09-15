import { prisma } from '../src/infrastructure/database/prisma';

async function checkMod3Theory() {
  const lessons = await prisma.lesson.findMany({
    where: {
      lessonId: { in: ['LS-03.01', 'LS-03.02', 'LS-03.03', 'LS-03.04'] }
    },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    },
    orderBy: { lessonId: 'asc' }
  });

  for (const l of lessons) {
    console.log(`\nLesson ${l.lessonId}: ${l.title}`);
    for (const ex of l.codingExercises) {
      console.log(`  - "${ex.title}" (${ex.testCases.length} TCs) | SolutionCode:\n${ex.solutionCode}\n`);
    }
  }
}

checkMod3Theory()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
