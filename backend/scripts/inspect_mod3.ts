import { prisma } from '../src/infrastructure/database/prisma';
import * as fs from 'fs';

async function inspectMod3() {
  const lessons = await prisma.lesson.findMany({
    where: { lessonId: { startsWith: 'LS-03' } },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    },
    orderBy: { lessonId: 'asc' }
  });

  console.log(`=== KHẢO SÁT MODULE 3: VÒNG LẶP (FOR / WHILE) ===`);
  const mpData: any[] = [];
  for (const l of lessons) {
    console.log(`\nLesson ${l.lessonId}: ${l.title} (${l.codingExercises.length} bài)`);
    for (const ex of l.codingExercises) {
      const isPlaceholder = !ex.solutionCode ||
        ex.solutionCode.includes('val_0 = input()') ||
        ex.solutionCode.includes('print("In ra') ||
        ex.solutionCode.includes('print("- Input:');
      console.log(`  - [${ex.id}] "${ex.title}" (${ex.testCases.length} TCs) | Placeholder: ${isPlaceholder}`);
      if (l.lessonId && l.lessonId.startsWith('LS-03.MP')) {
        mpData.push({
          lessonId: l.lessonId,
          id: ex.id,
          title: ex.title,
          difficulty: ex.difficulty,
          problemDescription: ex.problemDescription,
          starterCode: ex.starterCode,
          solutionCode: ex.solutionCode,
          testCases: ex.testCases.map((tc) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden
          }))
        });
      }
    }
  }

  fs.writeFileSync('scripts/mod3_problems.json', JSON.stringify(mpData, null, 2), 'utf-8');
  console.log(`\nĐã lưu ${mpData.length} bài LS-03.MP vào scripts/mod3_problems.json`);
}

inspectMod3()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
