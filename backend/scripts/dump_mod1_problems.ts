import { prisma } from '../src/infrastructure/database/prisma';
import fs from 'fs';

async function dumpMod1() {
  const lesson = await prisma.lesson.findFirst({
    where: { lessonId: 'LS-01.MP' },
    include: {
      codingExercises: {
        orderBy: { title: 'asc' }
      }
    }
  });

  if (!lesson) return;
  let out = '';
  for (let i = 0; i < lesson.codingExercises.length; i++) {
    const ex = lesson.codingExercises[i];
    out += `\n======================================================\n`;
    out += `[${i + 1}] ID: ${ex.id}\nTitle: ${ex.title}\nDifficulty: ${ex.difficulty}\n`;
    out += `--- PROBLEM DESCRIPTION ---\n${ex.problemDescription}\n`;
  }

  fs.writeFileSync('../scratch/mod1_problems_dump.txt', out, 'utf8');
  console.log('Dumped to scratch/mod1_problems_dump.txt');
}

dumpMod1()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
