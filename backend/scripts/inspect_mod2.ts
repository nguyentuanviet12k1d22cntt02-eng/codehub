import { prisma } from '../src/infrastructure/database/prisma';
import { ExerciseService } from '../src/modules/exercises/exercise.service';

async function checkMod2() {
  const service = new ExerciseService();
  const lessons = await prisma.lesson.findMany({
    where: {
      lessonId: { startsWith: 'LS-02' }
    },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    },
    orderBy: { lessonId: 'asc' }
  });

  console.log(`=== KHẢO SÁT MODULE 2: CẤU TRÚC ĐIỀU KIỆN (IF / ELSE) ===`);
  let totalEx = 0;
  let needUpdate = 0;

  for (const l of lessons) {
    console.log(`\nLesson ${l.lessonId}: ${l.title} (${l.codingExercises.length} bài)`);
    for (const ex of l.codingExercises) {
      totalEx++;
      const hasStarter = !!ex.starterCode?.trim();
      const hasSolution = !!ex.solutionCode?.trim();
      const tcCount = ex.testCases.length;
      const isOk = tcCount >= 3 && hasSolution;
      if (!isOk) {
        needUpdate++;
        console.log(`  ❌ [CẦN SỬA] ID: ${ex.id} | "${ex.title}" | TCs: ${tcCount} | Solution: ${hasSolution ? 'Có' : 'KHÔNG'}`);
        console.log(`     Problem: ${ex.problemDescription.slice(0, 100)}...`);
      } else {
        console.log(`  ✓ [ĐÃ ĐỦ] ID: ${ex.id} | "${ex.title}" | TCs: ${tcCount}`);
      }
    }
  }

  console.log(`\nTổng kết Module 2: ${totalEx} bài, ${needUpdate} bài cần sửa/bổ sung TCs.`);
}

checkMod2()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
