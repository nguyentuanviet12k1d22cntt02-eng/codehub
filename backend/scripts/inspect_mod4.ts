import { prisma } from '../src/infrastructure/database/prisma';

async function inspectMod4() {
  const lessons = await prisma.lesson.findMany({
    where: { lessonId: { startsWith: 'LS-04' } },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    },
    orderBy: { lessonId: 'asc' }
  });

  console.log(`=== KHẢO SÁT MODULE 4: XỬ LÝ CHUỖI (STRINGS) ===`);
  for (const l of lessons) {
    console.log(`\nLesson ${l.lessonId}: ${l.title} (${l.codingExercises.length} bài)`);
    for (const ex of l.codingExercises) {
      console.log(`  - [${ex.id}] "${ex.title}" (${ex.testCases.length} TCs) | Starter: ${ex.starterCode?.length || 0} | Solution: ${ex.solutionCode?.length || 0}`);
      if (ex.testCases.length < 3) {
        console.log(`     Problem preview: ${ex.problemDescription.slice(0, 150).replace(/\n/g, ' ')}...`);
        console.log(`     Solution preview: ${ex.solutionCode?.replace(/\n/g, ' ')}`);
        for (const tc of ex.testCases) {
          console.log(`     TC: In=${JSON.stringify(tc.input)} -> Exp=${JSON.stringify(tc.expectedOutput)}`);
        }
      }
    }
  }
}

inspectMod4()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
