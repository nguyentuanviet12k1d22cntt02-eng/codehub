import { prisma } from '../src/infrastructure/database/prisma';

async function main() {
    const exercises = await prisma.codingExercise.findMany({
        include: {
            lesson: {
                select: {
                    lessonId: true,
                    title: true,
                    chapter: {
                        select: {
                            module: {
                                select: {
                                    course: {
                                        select: {
                                            title: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const cppExercises = exercises.filter(e => 
        e.lesson?.lessonId?.startsWith('CPP-') || e.lesson?.lessonId?.startsWith('CPP2-')
    );

    console.log(`\n======================================================`);
    console.log(`TOTAL C++ EXERCISES IN DATABASE: ${cppExercises.length}`);
    console.log(`======================================================`);

    let withMeta = 0;
    let withoutMeta = 0;

    for (const ex of cppExercises) {
        const hasMeta = /<!--\s*CONSTRAINTS:\s*(\{[\s\S]*?\})\s*-->/.test(ex.problemDescription || '');
        if (hasMeta) {
            withMeta++;
        } else {
            withoutMeta++;
            console.log(`❌ Missing meta: [${ex.lesson?.lessonId}] ${ex.title}`);
        }
    }

    console.log(`✅ Exercises with CONSTRAINTS metadata: ${withMeta} / ${cppExercises.length}`);
    console.log(`❌ Exercises without CONSTRAINTS metadata: ${withoutMeta}`);

    // Check specific exercise CPP-01.02 requested by user
    const ex1_2 = cppExercises.find(e => e.lesson?.lessonId === 'CPP-01.02');
    if (ex1_2) {
        console.log(`\n--- Verification for Lesson CPP-01.02 ---`);
        console.log(`Title: ${ex1_2.title}`);
        console.log(`Description preview:`);
        console.log(ex1_2.problemDescription);
    }
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
