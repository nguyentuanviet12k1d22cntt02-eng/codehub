import { prisma } from '../src/infrastructure/database/prisma';
import * as fs from 'fs';
import * as path from 'path';

async function syncAllModulesToSeed() {
  const seedPath = path.resolve(__dirname, '../prisma/seed/seed_course_data.json');
  console.log(`Đang đồng bộ toàn diện DB -> Seed file: ${seedPath}...`);

  const seedContent = fs.readFileSync(seedPath, 'utf-8');
  const seedModules = JSON.parse(seedContent);

  // Lấy tất cả lessons có codingExercises và testCases từ DB
  const dbLessons = await prisma.lesson.findMany({
    where: {
      lessonId: { startsWith: 'LS-' }
    },
    include: {
      codingExercises: {
        include: { testCases: true },
        orderBy: { title: 'asc' }
      }
    }
  });

  const lessonMap = new Map<string, any>();
  for (const l of dbLessons) {
    if (l.lessonId) {
      lessonMap.set(l.lessonId, l);
    }
  }

  let totalSynced = 0;

  // Duyệt qua từng module trong seed file
  for (const mod of seedModules) {
    if (!mod.chapters) continue;
    for (const chap of mod.chapters) {
      if (!chap.lessons) continue;
      for (const lesson of chap.lessons) {
        const dbLesson = lessonMap.get(lesson.lessonId);
        if (dbLesson) {
          lesson.codingExercises = dbLesson.codingExercises.map((e: any) => {
            totalSynced++;
            return {
              title: e.title,
              difficulty: e.difficulty,
              problemDescription: e.problemDescription,
              starterCode: e.starterCode,
              solutionCode: e.solutionCode,
              testCases: e.testCases.map((tc: any) => ({
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                isHidden: tc.isHidden
              }))
            };
          });
        }
      }
    }
  }

  fs.writeFileSync(seedPath, JSON.stringify(seedModules, null, 2), 'utf-8');
  console.log(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG ${totalSynced} BÀI TẬP VÀO FILE SEED_COURSE_DATA.JSON!`);

  await prisma.$disconnect();
}

syncAllModulesToSeed().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
