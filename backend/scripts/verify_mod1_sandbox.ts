import { prisma } from '../src/infrastructure/database/prisma';
import { ExerciseService } from '../src/modules/exercises/exercise.service';

async function verifyMod1() {
  const service = new ExerciseService();

  const lesson = await prisma.lesson.findFirst({
    where: { lessonId: 'LS-01.MP' },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    }
  });

  if (!lesson) {
    throw new Error('Lesson LS-01.MP not found');
  }

  console.log(`\n======================================================`);
  console.log(`BẮT ĐẦU CHẤM THỬ 30 BÀI TẬP LS-01.MP VỚI SANDBOX THỰC TẾ...`);
  console.log(`======================================================`);

  const failures: any[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < lesson.codingExercises.length; i++) {
    const ex = lesson.codingExercises[i];

    if (!ex.solutionCode) {
      failures.push({ title: ex.title, reason: 'No solutionCode' });
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
      const failedCases = evalResult.results.filter(r => !r.passed);
      failures.push({ title: ex.title, failedCases });
      failedCount++;
    }
  }

  console.log(`\n======================================================`);
  console.log(`KẾT QUẢ TỔNG KẾT MOD-01: ${passedCount} PASSED / ${failedCount} FAILED`);
  console.log(`======================================================`);

  if (failures.length > 0) {
    console.log(`\nDANH SÁCH BÀI FAILED:`);
    for (const f of failures) {
      console.log(`\nBài: ${f.title}`);
      for (const fc of f.failedCases || []) {
        console.log(`  Input: ${JSON.stringify(fc.input)}`);
        console.log(`  Expected: ${JSON.stringify(fc.expectedOutput)}`);
        console.log(`  Actual:   ${JSON.stringify(fc.actualOutput)}`);
      }
    }
    process.exit(1);
  }
}

verifyMod1()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
