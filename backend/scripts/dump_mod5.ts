import { prisma } from '../src/infrastructure/database/prisma';
import * as fs from 'fs';

async function exportMod5() {
  const lessons = await prisma.lesson.findMany({
    where: {
      lessonId: { startsWith: 'LS-05' }
    },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    },
    orderBy: { lessonId: 'asc' }
  });

  const data = lessons.map(l => ({
    lessonId: l.lessonId,
    title: l.title,
    exercises: l.codingExercises.map(e => ({
      id: e.id,
      title: e.title,
      difficulty: e.difficulty,
      problemDescription: e.problemDescription,
      starterCode: e.starterCode,
      solutionCode: e.solutionCode,
      tcCount: e.testCases.length,
      testCases: e.testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden
      }))
    }))
  }));

  fs.writeFileSync('./scripts/mod5_dump.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Đã xuất dữ liệu Module 5: ${lessons.length} lessons, tổng cộng ${data.reduce((acc, cur) => acc + cur.exercises.length, 0)} bài tập.`);
  await prisma.$disconnect();
}

exportMod5().catch(console.error);
