import { prisma } from '../src/infrastructure/database/prisma';

async function checkMod1Theory() {
  const lessons = await prisma.lesson.findMany({
    where: {
      lessonId: {
        startsWith: 'LS-01'
      },
      NOT: {
        lessonId: 'LS-01.MP'
      }
    },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    },
    orderBy: { lessonId: 'asc' }
  });

  console.log(`Tìm thấy ${lessons.length} bài học lý thuyết trong Module 1:`);
  let totalEx = 0;
  for (const l of lessons) {
    console.log(`\nLesson ${l.lessonId}: ${l.title} (${l.codingExercises.length} bài tập)`);
    for (const ex of l.codingExercises) {
      totalEx++;
      console.log(`  - [${ex.id}] "${ex.title}" (${ex.testCases.length} TCs) | StarterCode: ${ex.starterCode?.length || 0} chars | SolutionCode: ${ex.solutionCode?.length || 0} chars`);
    }
  }
  console.log(`\nTổng số bài tập lý thuyết Mod 1: ${totalEx}`);
}

checkMod1Theory()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
