import { prisma } from '../src/infrastructure/database/prisma';

async function check() {
    const cppCourse = await prisma.course.findFirst({
        where: {
            OR: [
                { id: 'c7b5c7a1-4f8d-4e9b-9c3a-8b7d6e5f4a11' },
                { title: { contains: 'C++' } }
            ]
        },
        include: {
            modules: {
                include: {
                    chapters: {
                        include: {
                            lessons: {
                                include: {
                                    codingExercises: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!cppCourse) {
        console.log('❌ Chưa tìm thấy khóa học C++ trong database!');
        return;
    }

    console.log(`✅ Khóa học: ${cppCourse.title} (ID: ${cppCourse.id})`);
    console.log(`Tổng số modules: ${cppCourse.modules.length}`);
    for (const mod of cppCourse.modules) {
        console.log(`\n- [${mod.moduleId}] ${mod.title}`);
        for (const ch of mod.chapters) {
            console.log(`   Chapter: ${ch.title} (${ch.chapterId})`);
            for (const l of ch.lessons) {
                console.log(`     Lesson: [${l.lessonId}] ${l.title} (Exercises: ${l.codingExercises.length})`);
            }
        }
    }
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
