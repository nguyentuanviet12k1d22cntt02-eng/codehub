import { prisma } from '../src/infrastructure/database/prisma';

async function getMod1Details() {
  const mod1 = await prisma.module.findFirst({
    where: { moduleId: 'MOD-01' },
    include: {
      chapters: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' },
            include: {
              codingExercises: {
                include: { testCases: true },
                orderBy: { title: 'asc' }
              }
            }
          }
        }
      }
    }
  });

  if (!mod1) {
    console.log('MOD-01 not found');
    return;
  }

  console.log(`=== CHI TIẾT BÀI TẬP MOD-01: ${mod1.title} ===`);

  let count = 0;
  for (const chap of mod1.chapters) {
    for (const les of chap.lessons) {
      if (les.codingExercises.length === 0) continue;
      console.log(`\nLesson: [${les.lessonId}] ${les.title}`);
      for (const ex of les.codingExercises) {
        count++;
        console.log(`--------------------------------------------------`);
        console.log(`[#${count}] ID: ${ex.id} | Title: "${ex.title}" | Difficulty: ${ex.difficulty}`);
        console.log(`Desc: ${ex.problemDescription.slice(0, 150).replace(/\n/g, ' ')}...`);
        console.log(`Starter: ${JSON.stringify(ex.starterCode)}`);
        console.log(`Solution: ${JSON.stringify(ex.solutionCode)}`);
        console.log(`TestCases (${ex.testCases.length}):`);
        for (const tc of ex.testCases) {
          console.log(`  - Input: [${JSON.stringify(tc.input)}] | Exp: [${JSON.stringify(tc.expectedOutput)}] | Hidden: ${tc.isHidden}`);
        }
      }
    }
  }
}

getMod1Details()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
