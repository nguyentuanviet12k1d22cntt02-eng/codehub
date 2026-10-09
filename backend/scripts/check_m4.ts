import { prisma } from '../src/infrastructure/database/prisma';

async function main() {
    const m = await prisma.module.findUnique({
        where: { moduleId: 'CPP-MOD-04' },
        include: {
            chapters: {
                include: {
                    lessons: {
                        select: { id: true, lessonId: true, title: true, orderIndex: true }
                    }
                }
            }
        }
    });
    console.log(JSON.stringify(m, null, 2));
    await prisma.$disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
