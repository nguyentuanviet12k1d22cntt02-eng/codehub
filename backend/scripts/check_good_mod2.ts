import { prisma } from '../src/infrastructure/database/prisma';

async function checkGoodMod2() {
  const mod2 = await prisma.module.findFirst({
    where: { moduleId: 'MOD-02' },
    include: {
      chapters: {
        include: {
          lessons: {
            where: { lessonId: 'LS-02.MP' },
            include: {
              codingExercises: {
                take: 3,
                include: { testCases: true }
              }
            }
          }
        }
      }
    }
  });

  if (!mod2) return;
  const les = mod2.chapters[0]?.lessons[0];
  if (!les) return;
  console.log('Lesson:', les.title);
  for (const ex of les.codingExercises) {
    console.log('\n--- Exercise:', ex.title);
    console.log('Desc:\n', ex.problemDescription.slice(0, 300));
    console.log('Starter:', ex.starterCode);
    console.log('Solution:\n', ex.solutionCode);
    console.log('TCs:');
    for (const tc of ex.testCases) {
      console.log('  Input:', JSON.stringify(tc.input), '-> Output:', JSON.stringify(tc.expectedOutput), 'Hidden:', tc.isHidden);
    }
  }
}

checkGoodMod2()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
