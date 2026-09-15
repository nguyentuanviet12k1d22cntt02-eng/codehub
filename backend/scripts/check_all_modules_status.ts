import { prisma } from '../src/infrastructure/database/prisma';

async function scanModules() {
  const lessons = await prisma.lesson.findMany({
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    },
    orderBy: { lessonId: 'asc' }
  });

  const moduleStats: Record<string, { total: number; placeholderSolution: number; lowTcCount: number; validExercises: number }> = {};

  for (const l of lessons) {
    if (!l.lessonId) continue;
    const modMatch = l.lessonId.match(/^LS-(\d+)/);
    if (!modMatch) continue;
    const modKey = `Module ${parseInt(modMatch[1])}`;
    if (!moduleStats[modKey]) {
      moduleStats[modKey] = { total: 0, placeholderSolution: 0, lowTcCount: 0, validExercises: 0 };
    }

    for (const ex of l.codingExercises) {
      moduleStats[modKey].total++;
      const isPlaceholder = !ex.solutionCode ||
        ex.solutionCode.includes('val_0 = input()') ||
        ex.solutionCode.includes('print("In ra') ||
        ex.solutionCode.includes('print("- Input:');
      
      if (isPlaceholder) {
        moduleStats[modKey].placeholderSolution++;
      }
      if (ex.testCases.length < 3 && !l.lessonId.match(/\.0[1-8]$/)) {
        moduleStats[modKey].lowTcCount++;
      }
    }
  }

  console.log(`=== BÁO CÁO TOÀN BỘ 8 MODULE KHÓA HỌC PYTHON ===`);
  console.table(moduleStats);
}

scanModules()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
