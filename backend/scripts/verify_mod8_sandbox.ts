import { prisma } from '../src/infrastructure/database/prisma';
import { ExerciseService } from '../src/modules/exercises/exercise.service';

async function verifyModule8() {
  const service = new ExerciseService();

  const lessons = await prisma.lesson.findMany({
    where: {
      lessonId: { startsWith: 'LS-08' }
    },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    },
    orderBy: { lessonId: 'asc' }
  });

  console.log(`\n======================================================`);
  console.log(`BẮT ĐẦU CHẤM THỬ TOÀN BỘ MODULE 8 TRÊN SANDBOX THỰC TẾ...`);
  console.log(`======================================================`);

  let totalExercises = 0;
  let passedCount = 0;
  let failedCount = 0;
  const failedList: string[] = [];

  for (const lesson of lessons) {
    console.log(`\n--- [Lesson ${lesson.lessonId}: ${lesson.title}] ---`);

    for (let i = 0; i < lesson.codingExercises.length; i++) {
      totalExercises++;
      const ex = lesson.codingExercises[i];
      process.stdout.write(`[${i + 1}/${lesson.codingExercises.length}] "${ex.title}" (${ex.testCases.length} TCs)... `);

      if (!ex.solutionCode) {
        console.log(`❌ THIẾU SOLUTION CODE!`);
        failedCount++;
        failedList.push(`[${lesson.lessonId}] ${ex.title}: Thiếu solution code`);
        continue;
      }

      try {
        const evalResult = await service.evaluateTestCases(
          ex.solutionCode,
          'PYTHON',
          ex.testCases.map((tc: any) => ({
            id: tc.id,
            input: tc.input,
            expectedOutput: tc.expectedOutput
          }))
        );

        if (evalResult.allPassed) {
          console.log(`✅ PASSED (${evalResult.totalRuntimeMs}ms)`);
          passedCount++;
        } else {
          console.log(`❌ FAILED!`);
          failedCount++;
          failedList.push(`[${lesson.lessonId}] ${ex.title}`);
          for (const r of evalResult.results) {
            if (!r.passed) {
              console.log(`     - TC: input=[${JSON.stringify(r.input)}]`);
              console.log(`       expected=[${JSON.stringify(r.expectedOutput)}]`);
              console.log(`       actual  =[${JSON.stringify(r.actualOutput)}]`);
            }
          }
        }
      } catch (err: any) {
        console.log(`❌ ERROR: ${err.message}`);
        failedCount++;
        failedList.push(`[${lesson.lessonId}] ${ex.title}: ${err.message}`);
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`KẾT QUẢ TỔNG KẾT MODULE 8:`);
  console.log(`  Tổng số bài: ${totalExercises}`);
  console.log(`  PASSED: ${passedCount}`);
  console.log(`  FAILED: ${failedCount}`);
  if (failedCount > 0) {
    console.log(`Các bài thất bại:`);
    failedList.forEach((f) => console.log(`  - ${f}`));
  }
  console.log(`======================================================\n`);

  await prisma.$disconnect();
}

verifyModule8().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
