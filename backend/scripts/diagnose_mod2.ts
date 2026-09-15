import { prisma } from '../src/infrastructure/database/prisma';

async function diagMod2() {
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

  console.log(`LS-02.MP có ${lesson.codingExercises.length} bài:`);
  for (const ex of lesson.codingExercises) {
    const isPlaceholderSolution = ex.solutionCode?.includes('In ra ') || ex.solutionCode?.includes('- Input:') || ex.solutionCode?.includes('val_0 = input()');
    console.log(`- [${ex.id}] "${ex.title}" | Solution length: ${ex.solutionCode?.length || 0} | Placeholder: ${isPlaceholderSolution}`);
  }
}

diagMod2()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
