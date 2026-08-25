import { prisma } from '../config/prisma';

async function check() {
    const userId = "19fac5ca-b6ee-4790-8c88-392bdf4136e9";
    const submissions = await prisma.submission.findMany({
        where: { userId },
        include: {
            exercise: {
                select: {
                    title: true,
                    lessonId: true
                }
            }
        },
        orderBy: {
            submittedAt: 'desc'
        },
        take: 20
    });

    console.log(`Submissions count (top 20): ${submissions.length}`);
    submissions.forEach((sub: any) => {
        console.log(`Sub: ${sub.id} | Exercise: ${sub.exercise?.title} | Status: ${sub.status} | Lesson: ${sub.exercise?.lessonId}`);
    });
}

check().catch(console.error);
