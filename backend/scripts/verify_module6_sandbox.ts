import { prisma } from '../src/infrastructure/database/prisma';
import { ExerciseService } from '../src/modules/exercises/exercise.service';

async function verifyAll() {
  const service = new ExerciseService();

  const lesson = await prisma.lesson.findFirst({
    where: { title: { contains: 'thực hành tổng hợp Module 6' } },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    }
  });

  if (!lesson) {
    throw new Error('Lesson not found');
  }

  console.log(`\n======================================================`);
  console.log(`BẮT ĐẦU CHẤM THỬ 21 BÀI TẬP VỚI SANDBOX THỰC TẾ...`);
  console.log(`======================================================`);

  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < lesson.codingExercises.length; i++) {
    const ex = lesson.codingExercises[i];
    console.log(`\n[${i + 1}/${lesson.codingExercises.length}] Đang kiểm tra: "${ex.title}" (${ex.testCases.length} testcases)...`);

    if (!ex.solutionCode) {
      console.error(`  ❌ LỖI: Không có solutionCode!`);
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
      console.log(`  ✅ PASSED (${evalResult.totalRuntimeMs}ms) - ${evalResult.results.length}/${evalResult.results.length} test cases đúng`);
      passedCount++;
    } else {
      console.error(`  ❌ FAILED!`);
      for (const r of evalResult.results) {
        if (!r.passed) {
          console.error(`     - TC ID: ${r.id}`);
          console.error(`       Input: [${JSON.stringify(r.input)}]`);
          console.error(`       Expected: [${JSON.stringify(r.expectedOutput)}]`);
          console.error(`       Actual:   [${JSON.stringify(r.actualOutput)}]`);
        }
      }
      failedCount++;
    }
  }

  console.log(`\n======================================================`);
  console.log(`KẾT QUẢ TỔNG KẾT: ${passedCount} PASSED / ${failedCount} FAILED`);
  console.log(`======================================================`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

verifyAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
