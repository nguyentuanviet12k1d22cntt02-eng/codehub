import { prisma } from '../config/prisma';

async function main() {
    try {
        console.log('🧹 Starting Practice Problems cleanup...');

        // 1. Identify problems to keep
        const keepSlugs = [
            'two-sum',
            'add-two-numbers',
            'longest-substring-without-repeating-characters'
        ];

        // 2. Count before delete
        const allProblemsCount = await prisma.practiceProblem.count();
        console.log(`Current Practice Problems count: ${allProblemsCount}`);

        const problemsToDelete = await prisma.practiceProblem.findMany({
            where: {
                NOT: {
                    slug: {
                        in: keepSlugs
                    }
                }
            },
            select: {
                id: true,
                title: true,
                slug: true
            }
        });

        console.log(`Number of mock/extra problems to delete: ${problemsToDelete.length}`);

        if (problemsToDelete.length > 0) {
            const deleteIds = problemsToDelete.map(p => p.id);

            // 3. Delete related relations (test cases, submissions, tags references)
            // Note: Cascade deletes are defined on the database level for prisma,
            // but doing it explicitly guarantees no foreign key constraint violations.
            console.log('🗑️ Deleting associated practice test cases...');
            const tcDel = await prisma.practiceTestCase.deleteMany({
                where: {
                    problemId: {
                        in: deleteIds
                    }
                }
            });
            console.log(`✅ Deleted ${tcDel.count} test cases.`);

            console.log('🗑️ Deleting associated practice submissions...');
            const subDel = await prisma.practiceSubmission.deleteMany({
                where: {
                    problemId: {
                        in: deleteIds
                    }
                }
            });
            console.log(`✅ Deleted ${subDel.count} submissions.`);

            // Delete the problems
            console.log('🗑️ Deleting mock practice problems...');
            const probDel = await prisma.practiceProblem.deleteMany({
                where: {
                    id: {
                        in: deleteIds
                    }
                }
            });
            console.log(`✅ Deleted ${probDel.count} practice problems.`);
        }

        const remainingCount = await prisma.practiceProblem.count();
        console.log(`Remaining Practice Problems count: ${remainingCount}`);

        const remainingProblems = await prisma.practiceProblem.findMany({
            select: {
                title: true,
                slug: true
            }
        });
        console.log('Remaining problems list:', JSON.stringify(remainingProblems, null, 2));

        // 4. Verify coding exercises (inside courses) are untouched
        const codingExercisesCount = await prisma.codingExercise.count();
        console.log(`\nVerification: Coding Exercises (used in courses) count: ${codingExercisesCount} (Should be untouched)`);

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
