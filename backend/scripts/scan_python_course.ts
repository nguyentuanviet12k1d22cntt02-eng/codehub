import { prisma } from '../src/infrastructure/database/prisma';

async function scan() {
  const pythonCourse = await prisma.course.findFirst({
    where: {
      OR: [
        { title: { contains: 'Python', mode: 'insensitive' } },
        { description: { contains: 'Python', mode: 'insensitive' } }
      ]
    },
    include: {
      modules: {
        orderBy: { orderIndex: 'asc' },
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
      }
    }
  });

  if (!pythonCourse) {
    console.log('Python course not found!');
    return;
  }

  console.log('Course:', pythonCourse.id, pythonCourse.title);
  let totalExercises = 0;
  let exercisesNeedWork = 0;
  let exercisesGood = 0;

  const detailsList: any[] = [];

  for (const mod of pythonCourse.modules) {
    console.log('\n======================================================');
    console.log(`Module: [${mod.moduleId}] ${mod.title}`);
    for (const chap of mod.chapters) {
      for (const les of chap.lessons) {
        if (les.codingExercises.length > 0) {
          console.log(`  Lesson: [${les.lessonId || 'NO-ID'}] ${les.title} (${les.codingExercises.length} bài)`);
          for (const ex of les.codingExercises) {
            totalExercises++;
            const tcCount = ex.testCases.length;
            const hasJunk = ex.testCases.some(tc => 
              tc.input.includes('10\n20\n30') || 
              tc.expectedOutput.includes('val_0') || 
              tc.expectedOutput.includes('- Input:') ||
              tc.expectedOutput.includes('string (') ||
              tc.expectedOutput.includes('dictionary (') ||
              tc.expectedOutput.includes('Dữ liệu trên') ||
              tc.input.includes('Không có') ||
              tc.expectedOutput.includes('Kết quả mẫu')
            );
            const isGood = tcCount >= 3 && !hasJunk;
            if (isGood) {
              exercisesGood++;
              console.log(`    [OK] ${ex.title} (${tcCount} TCs)`);
            } else {
              exercisesNeedWork++;
              console.log(`    [NEED FIX] ${ex.title} (${tcCount} TCs, junk: ${hasJunk})`);
              detailsList.push({
                moduleId: mod.moduleId,
                moduleTitle: mod.title,
                lessonId: les.lessonId,
                lessonTitle: les.title,
                exId: ex.id,
                exTitle: ex.title,
                tcCount,
                hasJunk,
                sampleInput: ex.testCases[0]?.input,
                sampleOutput: ex.testCases[0]?.expectedOutput
              });
            }
          }
        }
      }
    }
  }

  console.log('\n======================================================');
  console.log(`TOTAL: ${totalExercises} exercises | GOOD: ${exercisesGood} | NEED WORK: ${exercisesNeedWork}`);
}

scan()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
