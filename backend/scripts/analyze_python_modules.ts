import { prisma } from '../src/infrastructure/database/prisma';

async function analyze() {
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

  if (!pythonCourse) return;

  console.log('=== PHÂN TÍCH TỔNG QUAN KHÓA HỌC PYTHON ===\n');

  for (const mod of pythonCourse.modules) {
    let modTotal = 0;
    let modGood = 0;
    let modNeed = 0;

    const mpLessons: any[] = [];
    const regularLessons: any[] = [];

    for (const chap of mod.chapters) {
      for (const les of chap.lessons) {
        if (les.codingExercises.length === 0) continue;
        const isMp = les.lessonId?.includes('.MP') || les.title.includes('tổng hợp');
        if (isMp) mpLessons.push(les);
        else regularLessons.push(les);

        for (const ex of les.codingExercises) {
          modTotal++;
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
          if (tcCount >= 3 && !hasJunk) {
            modGood++;
          } else {
            modNeed++;
          }
        }
      }
    }

    console.log(`[${mod.moduleId}] ${mod.title}`);
    console.log(`  -> Tổng bài tập: ${modTotal} | Đạt chuẩn: ${modGood} | Cần làm: ${modNeed}`);
    console.log(`  -> Số bài học lý thuyết có code: ${regularLessons.length} | Bài tổng hợp (.MP): ${mpLessons.map(l => `${l.title} (${l.codingExercises.length} bài)`).join(', ') || 'Không có'}\n`);
  }
}

analyze()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
