import { prisma } from '../src/infrastructure/database/prisma';

async function inspect5() {
  const ids = [
    '7493c189-4094-4cbb-acd2-199ce07cde61',
    '709cd0b1-6ad5-43d0-a25d-f9083fc2efad',
    'a5c65484-55c1-4281-b2fc-f5a39faaa26e',
    '193e7ad2-7fb5-4be0-b95d-9b0ee3e20476',
    '949ac099-dc42-4e04-a9d3-8f908edb8f9c'
  ];

  const exercises = await prisma.codingExercise.findMany({
    where: { id: { in: ids } },
    include: { testCases: true }
  });

  for (const ex of exercises) {
    console.log(`\n========================================`);
    console.log(`ID: ${ex.id} | Title: "${ex.title}"`);
    console.log(`Problem:\n${ex.problemDescription}`);
    console.log(`StarterCode:\n${ex.starterCode}`);
    console.log(`SolutionCode:\n${ex.solutionCode}`);
    console.log(`TestCases (${ex.testCases.length}):`);
    for (const tc of ex.testCases) {
      console.log(`  - Input: ${JSON.stringify(tc.input)} | Expected: ${JSON.stringify(tc.expectedOutput)} | Hidden: ${tc.isHidden}`);
    }
  }
}

inspect5()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
