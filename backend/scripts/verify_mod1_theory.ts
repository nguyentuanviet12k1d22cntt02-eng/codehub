import { prisma } from '../src/infrastructure/database/prisma';
import { ExerciseService } from '../src/modules/exercises/exercise.service';

async function verifyMod1Theory() {
  const service = new ExerciseService();
  const lessons = await prisma.lesson.findMany({
    where: {
      lessonId: { in: ['LS-01.09', 'LS-01.10'] }
    },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    }
  });

  let allPassed = true;
  for (const l of lessons) {
    console.log(`\n=== Kiểm tra ${l.lessonId}: ${l.title} ===`);
    for (const ex of l.codingExercises) {
      if (!ex.solutionCode) {
        console.log(`⚠️ Bài ${ex.title} không có solution code!`);
        continue;
      }
      const evalResult = await service.evaluateTestCases(
        ex.solutionCode,
        'PYTHON',
        ex.testCases.map((tc) => ({
          id: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput
        }))
      );
      if (evalResult.allPassed) {
        console.log(`✅ [PASSED] "${ex.title}" (${ex.testCases.length}/${ex.testCases.length} TCs)`);
      } else {
        allPassed = false;
        console.log(`❌ [FAILED] "${ex.title}"`);
        for (const r of evalResult.results) {
          if (!r.passed) {
            console.log(`   Input: ${JSON.stringify(r.input)} | Expected: ${JSON.stringify(r.expectedOutput)} | Actual: ${JSON.stringify(r.actualOutput)}`);
          }
        }
      }
    }
  }
}

verifyMod1Theory()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
