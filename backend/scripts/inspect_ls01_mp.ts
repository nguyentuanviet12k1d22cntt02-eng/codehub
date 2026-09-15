import { prisma } from '../src/infrastructure/database/prisma';

async function getMp1() {
  const lesson = await prisma.lesson.findFirst({
    where: {
      lessonId: 'LS-01.MP'
    },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    }
  });

  if (!lesson) {
    console.log('LS-01.MP not found');
    return;
  }

  console.log(`=== BÀI TẬP TỔNG HỢP MOD-01 (${lesson.codingExercises.length} bài) ===`);
  for (let i = 0; i < lesson.codingExercises.length; i++) {
    const ex = lesson.codingExercises[i];
    console.log(`\n[${i + 1}] ID: ${ex.id} | Title: "${ex.title}" | Difficulty: ${ex.difficulty}`);
    console.log(`Problem:\n${ex.problemDescription.trim()}`);
    console.log(`Current TC: ${ex.testCases.length}`);
  }
}

getMp1()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
