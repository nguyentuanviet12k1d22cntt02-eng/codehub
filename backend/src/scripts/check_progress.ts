import { prisma } from './src/config/prisma';

async function check() {
    console.log('--- DATABASE LESSON ID CHECK ---');
    const lessons = await prisma.lesson.findMany({
        where: {
            lessonId: { in: ['LS-07.01', 'LS-07.02'] }
        }
    });
    for (const l of lessons) {
        console.log(`Lesson in DB: id=${l.id} | lessonId=${l.lessonId} | title=${l.title}`);
    }
}

check().catch(console.error);
