import { prisma } from '../src/infrastructure/database/prisma';
import { ExerciseService } from '../src/modules/exercises/exercise.service';

async function verifyAllPython() {
  const service = new ExerciseService();

  const lessons = await prisma.lesson.findMany({
    where: {
      lessonId: { startsWith: 'LS-' }
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
  console.log(`BẮT ĐẦU KIỂM ĐỊNH TOÀN DIỆN KHÓA HỌC PYTHON (8 MODULES) TRÊN SANDBOX`);
  console.log(`======================================================`);

  let grandTotal = 0;
  let grandPassed = 0;
  let grandFailed = 0;
  const moduleStats: Record<string, { total: number; passed: number; failed: number }> = {};

  for (const lesson of lessons) {
    const modPrefix = lesson.lessonId?.substring(0, 5) || 'OTHER'; // LS-01, LS-02,...
    if (!moduleStats[modPrefix]) {
      moduleStats[modPrefix] = { total: 0, passed: 0, failed: 0 };
    }

    for (const ex of lesson.codingExercises) {
      grandTotal++;
      moduleStats[modPrefix].total++;

      if (!ex.solutionCode) {
        grandFailed++;
        moduleStats[modPrefix].failed++;
        console.error(`❌ [${lesson.lessonId}] "${ex.title}": Thiếu solutionCode`);
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
          grandPassed++;
          moduleStats[modPrefix].passed++;
        } else {
          grandFailed++;
          moduleStats[modPrefix].failed++;
          console.error(`❌ [${lesson.lessonId}] "${ex.title}": FAILED`);
          for (const r of evalResult.results) {
            if (!r.passed) {
              console.error(`   TC in: [${JSON.stringify(r.input)}] | exp: [${JSON.stringify(r.expectedOutput)}] | act: [${JSON.stringify(r.actualOutput)}]`);
            }
          }
        }
      } catch (err: any) {
        grandFailed++;
        moduleStats[modPrefix].failed++;
        console.error(`❌ [${lesson.lessonId}] "${ex.title}": ERROR ${err.message}`);
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`BẢNG TỔNG KẾT THEO TỪNG MODULE PYTHON:`);
  for (const [mod, stat] of Object.entries(moduleStats)) {
    console.log(`  - ${mod}: ${stat.passed}/${stat.total} bài PASSED (${stat.failed === 0 ? '✅ 100%' : '❌ ' + stat.failed + ' FAILED'})`);
  }
  console.log(`------------------------------------------------------`);
  console.log(`TỔNG CỘNG TOÀN BỘ KHÓA HỌC PYTHON:`);
  console.log(`  Tổng số bài tập: ${grandTotal}`);
  console.log(`  Tổng số PASSED : ${grandPassed}`);
  console.log(`  Tổng số FAILED : ${grandFailed}`);
  console.log(`  Tỉ lệ hoàn hảo : ${((grandPassed / grandTotal) * 100).toFixed(2)}%`);
  console.log(`======================================================\n`);

  await prisma.$disconnect();
}

verifyAllPython().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
