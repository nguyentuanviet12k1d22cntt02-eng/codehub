import { prisma } from '../src/infrastructure/database/prisma';

async function main() {
  const suspiciousStates = await prisma.learnerSkillState.findMany({
    where: {
      language: 'PYTHON',
      skillId: 'PY-BASICS-01',
      masteryScore: 0.85,
      confidence: 0.84,
      evidenceCount: 2,
      status: 'PROFICIENT',
    },
    select: {
      id: true,
      userId: true,
      evidenceSources: true,
      hasApplicationEvidence: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { email: true } },
    },
  });

  if (suspiciousStates.length === 0) {
    console.log('✅ No LearnerSkillState matching the old Stage 1 verification fixture was found.');
    return;
  }

  console.error('⚠️ Suspicious LearnerSkillState rows found. Review their history before deleting or restoring them:');
  console.error(JSON.stringify(suspiciousStates, null, 2));
  process.exitCode = 2;
}

main()
  .catch((error) => {
    console.error('❌ Stage 1 verification artifact audit failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
  .then(() => process.exit(process.exitCode ?? 0));
