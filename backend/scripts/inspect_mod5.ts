import { prisma } from '../src/infrastructure/database/prisma';

async function inspectModule5() {
  const lessons = await prisma.lesson.findMany({
    where: {
      lessonId: { startsWith: 'LS-05' }
    },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    },
    orderBy: { lessonId: 'asc' }
  });

  console.log(`\n=== TỔNG QUAN BÀI HỌC VÀ BÀI TẬP MODULE 5 ===\n`);

  let totalEx = 0;
  for (const l of lessons) {
    console.log(`\nLesson [${l.lessonId}] "${l.title}" - ${l.codingExercises.length} bài tập:`);
    for (const ex of l.codingExercises) {
      totalEx++;
      const tcCount = ex.testCases.length;
      const isPlaceholder = ex.solutionCode?.includes('In ra') || ex.solutionCode?.includes('val_0 = input()');
      console.log(`  - [${ex.id}] "${ex.title}" | TCs: ${tcCount} | Solution: ${isPlaceholder ? '❌ PLACEHOLDER' : (ex.solutionCode ? '✔️ CÓ' : '❌ TRỐNG')}`);
      if (isPlaceholder || tcCount < 3) {
        console.log(`    Problem: ${ex.problemDescription.substring(0, 80).replace(/\n/g, ' ')}...`);
        console.log(`    Starter: ${ex.starterCode?.substring(0, 40).replace(/\n/g, ' ')}...`);
        console.log(`    Solution: ${ex.solutionCode?.substring(0, 50).replace(/\n/g, ' ')}...`);
      }
    }
  }

  console.log(`\nTổng số bài tập Module 5: ${totalEx}`);
  await prisma.$disconnect();
}

inspectModule5().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
