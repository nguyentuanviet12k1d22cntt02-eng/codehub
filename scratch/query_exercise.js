const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const ex = await prisma.personalizedExercise.findFirst({
        where: { title: { contains: 'Kho Hàng' } },
        include: { testCases: true }
    });
    if (!ex) {
        console.log('No exercise found with Kho Hàng');
        const latest = await prisma.personalizedExercise.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { testCases: true }
        });
        for (const l of latest) {
            console.log('Latest:', l.id, l.title, l.language, 'Testcases:', l.testCases.length);
        }
        return;
    }
    console.log('Found:', ex.id, ex.title, ex.language);
    for (const tc of ex.testCases) {
        console.log('  TC:', tc.id, 'Input:', tc.input, 'Exp:', tc.expectedOutput);
    }
}

main().finally(() => prisma.$disconnect());
