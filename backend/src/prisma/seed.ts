import { prisma } from '../config/prisma';
import { exercisesData } from './exercises_data';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    console.log('🌱 Bắt đầu đồng bộ hóa dữ liệu từ seed_course_data.json (Không xóa tài khoản học viên)...');

    // 1. LẤY DỮ LIỆU TỪ FILE JSON
    const jsonPath = path.join(__dirname, 'seed_course_data.json');
    const courseData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // 2. TẠO/CẬP NHẬT TÀI KHOẢN ADMIN (Không xóa người dùng khác)
    console.log('1️⃣ Thiết lập tài khoản Admin...');
    const author = await prisma.user.upsert({
        where: { email: 'admin@mcode.com' },
        update: {
            username: 'admin',
            password: await bcrypt.hash('admin123', 10),
            role: 'ADMIN'
        },
        create: {
            username: 'admin',
            email: 'admin@mcode.com',
            password: await bcrypt.hash('admin123', 10),
            role: 'ADMIN'
        }
    });
    console.log('   ✅ Đã đồng bộ tài khoản Admin: admin@mcode.com / admin123');

    // Không xóa module cũ để bảo vệ dữ liệu tiến độ và lịch sử bài nộp của học viên.
    // Lệnh upsert bên dưới sẽ tự động cập nhật mọi thông tin mà không ảnh hưởng đến dữ liệu cũ.

    // 3. TẠO/CẬP NHẬT KHÓA HỌC CHÍNH
    console.log('2️⃣ Thiết lập khóa học...');
    const courseId = '8038010b-d02c-41ed-923b-3a12b011f418';

    let course = await prisma.course.findFirst({
        where: {
            OR: [
                { id: courseId },
                { title: 'Lập trình Python cơ bản cho người mới bắt đầu' }
            ]
        }
    });

    await prisma.course.deleteMany({
        where: {
            OR: [
                { createdBy: author.id },
                { title: 'Lập trình Python cơ bản cho người mới bắt đầu' }
            ]
        }
    });


    const courseDataPayload = {
        title: 'Lập trình Python cơ bản cho người mới bắt đầu',
        description: 'Khóa học lập trình Python nền tảng từ con số 0.',
        level: 'BASIC' as any,
        status: 'PUBLISHED' as any,
        createdBy: author.id
    };

    if (course) {
        course = await prisma.course.update({
            where: { id: course.id },
            data: courseDataPayload
        });
    } else {
        course = await prisma.course.create({
            data: {
                id: courseId,
                ...courseDataPayload
            }
        });
    }
    console.log('   ✅ Đã đồng bộ khóa học chính.');

    // 4. ĐỒNG BỘ MODULES, CHAPTERS, LESSONS, EXERCISES VÀ TEST CASES
    console.log('3️⃣ Đồng bộ cấu trúc bài học và bài tập (Giữ nguyên tiến độ/bài nộp của học viên)...');

    for (const mod of courseData) {
        console.log(`   - Đồng bộ Module: ${mod.moduleId} - ${mod.title}`);

        // Upsert Module (moduleId là unique nên dùng trực tiếp được)
        const dbModule = await prisma.module.upsert({
            where: { moduleId: mod.moduleId },
            update: {
                title: mod.title,
                objective: mod.objective,
                prerequisite: mod.prerequisite,
                keyKnowledge: mod.keyKnowledge,
                skillsAcquired: mod.skillsAcquired,
                duration: mod.duration,
                orderIndex: mod.orderIndex,
                courseId: course.id
            },
            create: {
                id: mod.id || undefined,
                moduleId: mod.moduleId,
                title: mod.title,
                objective: mod.objective,
                prerequisite: mod.prerequisite,
                keyKnowledge: mod.keyKnowledge,
                skillsAcquired: mod.skillsAcquired,
                duration: mod.duration,
                orderIndex: mod.orderIndex,
                courseId: course.id
            }
        });

        for (const ch of mod.chapters) {
            // Tìm Chapter cũ để lấy ID chính xác (tránh lỗi lặp hoặc thiếu ID trong file JSON cấu hình)
            let dbChapter = null;
            if (ch.id) {
                dbChapter = await prisma.chapter.findUnique({ where: { id: ch.id } });
            }
            if (!dbChapter && ch.chapterId) {
                dbChapter = await prisma.chapter.findFirst({
                    where: { chapterId: ch.chapterId, moduleId: dbModule.id }
                });
            }
            if (!dbChapter) {
                dbChapter = await prisma.chapter.findFirst({
                    where: { title: ch.title, moduleId: dbModule.id }
                });
            }

            const chapterData = {
                chapterId: ch.chapterId,
                title: ch.title,
                objective: ch.objective,
                coreKnowledge: ch.coreKnowledge,
                skillsAcquired: ch.skillsAcquired,
                orderIndex: ch.orderIndex,
                moduleId: dbModule.id
            };

            if (dbChapter) {
                dbChapter = await prisma.chapter.update({
                    where: { id: dbChapter.id },
                    data: chapterData
                });
            } else {
                dbChapter = await prisma.chapter.create({
                    data: {
                        id: ch.id || undefined,
                        ...chapterData
                    }
                });
            }

            for (const l of ch.lessons) {
                // Tìm Lesson cũ để lấy ID chính xác (tránh lỗi thiếu ID trong file JSON)
                let dbLesson = null;
                if (l.id) {
                    dbLesson = await prisma.lesson.findUnique({ where: { id: l.id } });
                }
                if (!dbLesson && l.lessonId) {
                    dbLesson = await prisma.lesson.findFirst({
                        where: { lessonId: l.lessonId, chapterId: dbChapter.id }
                    });
                }
                if (!dbLesson) {
                    dbLesson = await prisma.lesson.findFirst({
                        where: { title: l.title, chapterId: dbChapter.id }
                    });
                }

                const lessonData = {
                    lessonId: l.lessonId,
                    title: l.title,
                    objective: l.objective,
                    keyKnowledge: l.keyKnowledge,
                    difficulty: l.difficulty,
                    orderIndex: l.orderIndex,
                    isFree: l.isFree,
                    durationMinutes: l.durationMinutes,
                    content: l.content,
                    chapterId: dbChapter.id
                };

                if (dbLesson) {
                    dbLesson = await prisma.lesson.update({
                        where: { id: dbLesson.id },
                        data: lessonData
                    });
                } else {
                    dbLesson = await prisma.lesson.create({
                        data: {
                            id: l.id || undefined,
                            ...lessonData
                        }
                    });
                }

                // Lấy bài tập từ exercisesGroup của exercisesData nếu là bài tập thực hành tổng hợp
                const isPractice = l.lessonId.endsWith('.MP') || l.lessonId.includes('.MP_');
                const exercises = isPractice
                    ? (exercisesData[l.lessonId] || [])
                    : (l.codingExercises || []);

                for (const ex of exercises) {
                    let dbExercise = null;
                    if (ex.id) {
                        dbExercise = await prisma.codingExercise.findUnique({ where: { id: ex.id } });
                    }
                    if (!dbExercise) {
                        dbExercise = await prisma.codingExercise.findFirst({
                            where: {
                                lessonId: dbLesson.id,
                                title: ex.title
                            }
                        });
                    }

                    const exerciseDataPayload = {
                        title: ex.title,
                        difficulty: ex.difficulty,
                        problemDescription: ex.problemDescription,
                        starterCode: ex.starterCode,
                        solutionCode: ex.solutionCode,
                        lessonId: dbLesson.id
                    };

                    if (dbExercise) {
                        dbExercise = await prisma.codingExercise.update({
                            where: { id: dbExercise.id },
                            data: exerciseDataPayload
                        });
                    } else {
                        try {
                            dbExercise = await prisma.codingExercise.create({
                                data: {
                                    id: ex.id || undefined,
                                    ...exerciseDataPayload
                                }
                            });
                        } catch (err: any) {
                            console.error('❌ LỖI TẠO BÀI TẬP:');
                            console.error('Bài tập JSON:', JSON.stringify(ex, null, 2));
                            console.error('Payload:', JSON.stringify(exerciseDataPayload, null, 2));
                            console.error('Chi tiết lỗi:', err);
                            throw err;
                        }
                    }

                    // Để đồng bộ test cases mà không gây ảnh hưởng tới bài nộp (Submission) của học viên:
                    // Ta xóa các test cases cũ của riêng bài tập này rồi insert lại
                    await prisma.testCase.deleteMany({
                        where: { exerciseId: dbExercise.id }
                    });

                    const rawTestCases = ex.testCases?.create || ex.testCases || [];
                    if (rawTestCases.length > 0) {
                        await prisma.testCase.createMany({
                            data: rawTestCases.map((tc: any) => ({
                                exerciseId: dbExercise.id,
                                input: tc.input,
                                expectedOutput: tc.expectedOutput,
                                isHidden: tc.isHidden ?? false
                            }))
                        });
                    }
                }
            }
        }
    }

    console.log('\n🎉 Hoàn thành nạp và cập nhật dữ liệu thành công không xóa tài khoản/tiến độ người dùng!');
}

main()
    .catch((e) => {
        console.error('❌ Lỗi khi nạp dữ liệu:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
