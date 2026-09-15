import { prisma } from '../src/infrastructure/database/prisma';
import { ExerciseService } from '../src/modules/exercises/exercise.service';

async function verifyMod2() {
  const service = new ExerciseService();
  const lessons = await prisma.lesson.findMany({
    where: { lessonId: { startsWith: 'LS-02' } },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    },
    orderBy: { lessonId: 'asc' }
  });

  console.log(`=== BẮT ĐẦU CHẤM THỬ TOÀN BỘ BÀI TẬP MODULE 2 VỚI SANDBOX ===`);
  let passedCount = 0;
  let failedCount = 0;
  const failures: any[] = [];

  for (const l of lessons) {
    for (const ex of l.codingExercises) {
      if (!ex.solutionCode) {
        failures.push({ title: ex.title, reason: 'Không có solutionCode' });
        failedCount++;
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
        passedCount++;
      } else {
        failedCount++;
        const failedCases = evalResult.results.filter((r) => !r.passed);
        failures.push({
          title: ex.title,
          lesson: l.lessonId,
          failedCases
        });
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`KẾT QUẢ MODULE 2: ${passedCount} PASSED / ${failedCount} FAILED`);
  console.log(`======================================================`);

  if (failures.length > 0) {
    console.log(`\nCHI TIẾT CÁC BÀI FAILED:`);
    for (const f of failures) {
      console.log(`\n- Bài: "${f.title}" (${f.lesson}) - Reason: ${f.reason || 'TC Failed'}`);
      for (const fc of f.failedCases || []) {
        console.log(`    Input: ${JSON.stringify(fc.input)}`);
        console.log(`    Expected: ${JSON.stringify(fc.expectedOutput)}`);
        console.log(`    Actual:   ${JSON.stringify(fc.actualOutput)}`);
      }
    }
  }
}

verifyMod2()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
