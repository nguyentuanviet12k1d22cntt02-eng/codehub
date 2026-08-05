import { prisma } from '../config/prisma';

async function main() {
    try {
        const codingExercises = await prisma.codingExercise.findMany({
            select: {
                id: true,
                title: true
            }
        });

        const practiceProblems = await prisma.practiceProblem.findMany({
            select: {
                id: true,
                title: true,
                slug: true
            }
        });

        console.log(`Total coding exercises in lessons: ${codingExercises.length}`);
        console.log(`Total practice problems in arena: ${practiceProblems.length}`);

        // Find how many practice problems match coding exercises by name
        const codingTitles = new Set(codingExercises.map(c => c.title.toLowerCase().trim()));

        const matchingProblems = practiceProblems.filter(p => codingTitles.has(p.title.toLowerCase().trim()));
        console.log(`Practice Problems matching Lesson Coding Exercises by title: ${matchingProblems.length}`);
        matchingProblems.forEach((m, idx) => {
            console.log(`  ${idx + 1}. Title: "${m.title}" | Slug: "${m.slug}"`);
        });

        const nonMatching = practiceProblems.filter(p => !codingTitles.has(p.title.toLowerCase().trim()));
        console.log(`\nNon-matching Practice Problems (candidates for deletion): ${nonMatching.length}`);

        // Print first 10 non-matching ones
        nonMatching.slice(0, 15).forEach((nm, idx) => {
            console.log(`  ${idx + 1}. Title: "${nm.title}" | Slug: "${nm.slug}"`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
