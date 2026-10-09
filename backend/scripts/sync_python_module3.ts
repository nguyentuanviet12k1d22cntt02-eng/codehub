import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../src/infrastructure/database/prisma';
import { exercisesData } from '../prisma/seed/exercises_data';

type SourceExercise = {
    title: string;
    difficulty: string;
    problemDescription: string;
    starterCode?: string;
    solutionCode?: string;
    legacyTitles?: string[];
    testCases?: Array<{ input: string; expectedOutput: string; isHidden?: boolean }> | {
        create?: Array<{ input: string; expectedOutput: string; isHidden?: boolean }>;
    };
};

const MODULE_ID = 'MOD-03';
const CHAPTER_ID = 'CH-05';
const APPLY = process.argv.includes('--apply');

function sourceExercises(lesson: any): SourceExercise[] {
    const isPractice = lesson.lessonId.endsWith('.MP') || lesson.lessonId.includes('.MP_');
    return (isPractice ? exercisesData[lesson.lessonId] || [] : lesson.codingExercises || []) as SourceExercise[];
}

function testCases(exercise: SourceExercise) {
    const raw = exercise.testCases;
    return Array.isArray(raw) ? raw : raw?.create || [];
}

async function main() {
    const sourcePath = path.join(__dirname, '../prisma/seed/seed_course_data.json');
    const courseData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    const sourceModule = courseData.find((item: any) => item.moduleId === MODULE_ID);
    const sourceChapter = sourceModule?.chapters?.find((item: any) => item.chapterId === CHAPTER_ID);

    if (!sourceModule || !sourceChapter) {
        throw new Error('Không tìm thấy dữ liệu nguồn cho Python Module 3 / Chapter 05.');
    }

    const module = await prisma.module.findUnique({ where: { moduleId: MODULE_ID } });
    if (!module) {
        throw new Error(`Không tìm thấy ${MODULE_ID} trên cơ sở dữ liệu.`);
    }

    const chapter = await prisma.chapter.findFirst({
        where: { moduleId: module.id, chapterId: CHAPTER_ID }
    });
    if (!chapter) {
        throw new Error(`Không tìm thấy ${CHAPTER_ID} thuộc ${MODULE_ID} trên cơ sở dữ liệu.`);
    }

    console.log(APPLY ? 'Bắt đầu đồng bộ Python Module 3 lên Supabase.' : 'DRY RUN: kiểm tra Python Module 3, chưa ghi dữ liệu.');

    if (APPLY) {
        await prisma.module.update({
            where: { id: module.id },
            data: {
                title: sourceModule.title,
                objective: sourceModule.objective,
                prerequisite: sourceModule.prerequisite,
                keyKnowledge: sourceModule.keyKnowledge,
                skillsAcquired: sourceModule.skillsAcquired,
                duration: sourceModule.duration,
                orderIndex: sourceModule.orderIndex
            }
        });
        await prisma.chapter.update({
            where: { id: chapter.id },
            data: {
                chapterId: sourceChapter.chapterId,
                title: sourceChapter.title,
                objective: sourceChapter.objective,
                coreKnowledge: sourceChapter.coreKnowledge,
                skillsAcquired: sourceChapter.skillsAcquired,
                orderIndex: sourceChapter.orderIndex
            }
        });
    }

    let updatedLessons = 0;
    let updatedExercises = 0;
    let createdExercises = 0;
    let updatedTestCases = 0;
    const retainedExercises: string[] = [];

    for (const sourceLesson of sourceChapter.lessons) {
        let dbLesson = await prisma.lesson.findFirst({
            where: { chapterId: chapter.id, lessonId: sourceLesson.lessonId }
        });

        const lessonPayload = {
            lessonId: sourceLesson.lessonId,
            title: sourceLesson.title,
            objective: sourceLesson.objective,
            keyKnowledge: sourceLesson.keyKnowledge,
            difficulty: sourceLesson.difficulty,
            orderIndex: sourceLesson.orderIndex,
            isFree: sourceLesson.isFree,
            durationMinutes: sourceLesson.durationMinutes,
            content: sourceLesson.content
        };

        if (!dbLesson && !APPLY) {
            console.log(`  ${sourceLesson.lessonId}: sẽ tạo mới bài học và ${sourceExercises(sourceLesson).length} bài tập.`);
            updatedLessons++;
            continue;
        }

        if (!dbLesson) {
            dbLesson = await prisma.lesson.create({
                data: { ...lessonPayload, chapterId: chapter.id }
            });
        } else if (APPLY) {
            await prisma.lesson.update({ where: { id: dbLesson.id }, data: lessonPayload });
        }
        updatedLessons++;

        // Chụp danh sách trước khi đổi tên để legacyTitles luôn trỏ đúng bài tập cũ.
        const existing = await prisma.codingExercise.findMany({
            where: { lessonId: dbLesson.id },
            orderBy: { createdAt: 'asc' },
            include: { _count: { select: { submissions: true } } }
        });
        const usedExerciseIds = new Set<string>();
        const sourceList = sourceExercises(sourceLesson);

        for (const sourceExercise of sourceList) {
            const legacyMatch = existing.find(item =>
                !usedExerciseIds.has(item.id) &&
                (sourceExercise.legacyTitles || []).includes(item.title)
            );
            const exactMatch = existing.find(item =>
                !usedExerciseIds.has(item.id) && item.title === sourceExercise.title
            );
            // Với bài không có legacy title, tái dùng bài cũ chưa có bài nộp theo vị trí còn lại.
            const reusableMatch = existing.find(item =>
                !usedExerciseIds.has(item.id) && item._count.submissions === 0
            );
            const matched = legacyMatch || exactMatch || reusableMatch;
            const cases = testCases(sourceExercise);

            if (!APPLY) {
                console.log(
                    `  ${sourceLesson.lessonId}: ${matched ? 'cập nhật' : 'tạo mới'} bài "${sourceExercise.title}" (${cases.length} test).`
                );
                if (matched) usedExerciseIds.add(matched.id);
                continue;
            }

            const payload = {
                lessonId: dbLesson.id,
                title: sourceExercise.title,
                difficulty: sourceExercise.difficulty as any,
                problemDescription: sourceExercise.problemDescription,
                starterCode: sourceExercise.starterCode,
                solutionCode: sourceExercise.solutionCode
            };
            const dbExercise = matched
                ? await prisma.codingExercise.update({ where: { id: matched.id }, data: payload })
                : await prisma.codingExercise.create({ data: payload });

            usedExerciseIds.add(dbExercise.id);
            matched ? updatedExercises++ : createdExercises++;

            await prisma.testCase.deleteMany({ where: { exerciseId: dbExercise.id } });
            if (cases.length > 0) {
                await prisma.testCase.createMany({
                    data: cases.map(testCase => ({
                        exerciseId: dbExercise.id,
                        input: testCase.input,
                        expectedOutput: testCase.expectedOutput,
                        isHidden: testCase.isHidden ?? false
                    }))
                });
                updatedTestCases += cases.length;
            }
        }

        for (const stale of existing.filter(item => !usedExerciseIds.has(item.id))) {
            retainedExercises.push(
                `${sourceLesson.lessonId}: "${stale.title}" (bài nộp: ${stale._count.submissions})`
            );
        }
    }

    if (!APPLY) return;

    console.log(`Đã cập nhật ${updatedLessons} bài học, ${updatedExercises} bài tập hiện có, tạo ${createdExercises} bài tập và ghi ${updatedTestCases} test case.`);
    if (retainedExercises.length > 0) {
        console.log('Các bài tập cũ không được xóa để bảo toàn lịch sử:');
        for (const item of retainedExercises) console.log(`  - ${item}`);
    }

    const verification = await prisma.lesson.findMany({
        where: { chapterId: chapter.id, lessonId: { in: sourceChapter.lessons.map((item: any) => item.lessonId) } },
        orderBy: { orderIndex: 'asc' },
        include: { _count: { select: { codingExercises: true } } }
    });
    console.log('Kiểm tra sau đồng bộ:');
    for (const lesson of verification) {
        console.log(`  ${lesson.lessonId}: ${lesson.title} (${lesson._count.codingExercises} bài tập)`);
    }
}

main()
    .catch(error => {
        console.error('Đồng bộ Python Module 3 thất bại:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
