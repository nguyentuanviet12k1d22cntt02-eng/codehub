import { prisma } from '../src/infrastructure/database/prisma';

async function checkMod4Mp() {
  const lesson = await prisma.lesson.findFirst({
    where: { lessonId: 'LS-04.MP' },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    }
  });

  if (!lesson) return;

  console.log(`=== BÀI TẬP TỔNG HỢP MODULE 4 (${lesson.codingExercises.length} bài) ===`);
  for (const ex of lesson.codingExercises) {
    console.log(`\n- [${ex.id}] "${ex.title}" (${ex.testCases.length} TCs)`);
    console.log(`  Solution: ${ex.solutionCode?.slice(0, 80).replace(/\n/g, ' ')}...`);
    for (const tc of ex.testCases) {
      console.log(`    TC: In=${JSON.stringify(tc.input)} -> Exp=${JSON.stringify(tc.expectedOutput)}`);
    }
  }
}

checkMod4Mp()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
