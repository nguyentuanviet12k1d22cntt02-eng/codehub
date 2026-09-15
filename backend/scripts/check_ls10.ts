import { prisma } from '../src/infrastructure/database/prisma';

async function f() {
  const les = await prisma.lesson.findFirst({
    where: { lessonId: 'LS-01.10' },
    include: { codingExercises: true }
  });
  console.log('LS-01.10 exercises:', les?.codingExercises.map(e => ({ id: e.id, title: e.title })));
}

f().catch(console.error).finally(() => prisma.$disconnect());
