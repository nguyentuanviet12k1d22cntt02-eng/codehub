import { prisma } from '../src/infrastructure/database/prisma';
import * as fs from 'fs';

async function dumpMod2() {
  const lesson = await prisma.lesson.findFirst({
    where: { lessonId: 'LS-02.MP' },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    }
  });

  if (!lesson) return;

  const data = lesson.codingExercises.map((ex) => ({
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
  }));

  fs.writeFileSync('scripts/mod2_problems.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Đã dump ${data.length} bài tập LS-02.MP vào scripts/mod2_problems.json`);
}

dumpMod2()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
