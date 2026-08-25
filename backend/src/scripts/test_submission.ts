import { prisma } from '../config/prisma';

async function testSubmission() {
    const exercise = await prisma.codingExercise.findFirst({
        where: { title: 'Truy Xuất Thông Tin Menu Bán Hàng' }
    });
    const user = await prisma.user.findFirst();
    if (!exercise || !user) {
        console.log('No exercise or user found');
        return;
    }
    const sub = await prisma.submission.create({
        data: {
            userId: user.id,
            exerciseId: exercise.id,
            code: 'SELECT ProductID, ProductName, UnitPrice FROM sales.Products;',
            language: 'SQL',
            status: 'PASSED',
            runtime: 45
        }
    });
    console.log('✅ Created SQL submission successfully:', sub.id, sub.language, sub.status);
}

testSubmission()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
