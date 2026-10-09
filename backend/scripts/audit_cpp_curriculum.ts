import { readdirSync, readFileSync, statSync } from 'fs';
import * as path from 'path';
import { prisma } from '../src/infrastructure/database/prisma';
import { cppCanonicalAssessments } from './lib/cppCanonicalAssessments';
import { readCppLessonMetadata } from './lib/cppLessonMetadata';

const ROOT = path.resolve(__dirname, '../..');
const CONTENT_ROOT = path.join(ROOT, 'docs/Dữ liệu nội dung bài học/C++');
const COURSE_IDS = ['c7b5c7a1-4f8d-4e9b-9c3a-8b7d6e5f4a11', 'd8c6d8b2-5f9e-4f0c-0d4b-9c8e7f6a5b22'];

function listLessonFiles(directory: string): string[] {
    return readdirSync(directory).flatMap(entry => {
        const fullPath = path.join(directory, entry);
        if (statSync(fullPath).isDirectory()) return listLessonFiles(fullPath);
        return /^Lesson_.*\.md$/i.test(entry) ? [fullPath] : [];
    });
}

function lessonIdFrom(content: string, filePath: string): string {
    const match = content.match(/^lessonId:\s*"?([^"\n]+)"?\s*$/m);
    if (!match) throw new Error(`Thiếu lessonId: ${filePath}`);
    return match[1];
}

function testCaseSignature(testCase: { input: string; expectedOutput: string; isHidden: boolean }): string {
    return JSON.stringify([testCase.input, testCase.expectedOutput, testCase.isHidden]);
}

async function main(): Promise<void> {
    const graph = JSON.parse(readFileSync(path.join(ROOT, 'curriculum/cppSkillGraph.json'), 'utf8')) as {
        lesson_mappings: Record<string, string>;
    };
    const sourceLessons = new Map<string, { filePath: string; content: string; title: string; objective: string; difficulty: string; durationMinutes: number }>();
    for (const filePath of listLessonFiles(CONTENT_ROOT)) {
        const metadata = readCppLessonMetadata(filePath);
        const lessonId = lessonIdFrom(metadata.content, filePath);
        sourceLessons.set(lessonId, { filePath, ...metadata });
    }

    const courses = await prisma.course.findMany({
        where: { id: { in: COURSE_IDS } },
        include: {
            modules: {
                include: {
                    chapters: {
                        include: {
                            lessons: {
                                include: {
                                    codingExercises: { include: { testCases: true } },
                                    quizQuestions: { include: { options: true } }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const databaseLessons = new Map<string, (typeof courses)[number]['modules'][number]['chapters'][number]['lessons'][number]>();
    let moduleCount = 0;
    for (const course of courses) {
        moduleCount += course.modules.length;
        for (const module of course.modules) {
            for (const chapter of module.chapters) {
                for (const lesson of chapter.lessons) {
                    if (lesson.lessonId) databaseLessons.set(lesson.lessonId, lesson);
                }
            }
        }
    }

    const mismatches: string[] = [];
    if (courses.length !== 2) mismatches.push(`Database có ${courses.length}/2 khóa C++ cần có.`);
    if (moduleCount !== 13) mismatches.push(`Database có ${moduleCount}/13 module C++ cần có.`);
    if (sourceLessons.size !== 48) mismatches.push(`Nguồn có ${sourceLessons.size}/48 bài C++.`);
    const coreDatabaseLessonIds = [...databaseLessons.keys()].filter(lessonId => sourceLessons.has(lessonId));
    const supplementalLessonIds = [...databaseLessons.keys()].filter(lessonId => !sourceLessons.has(lessonId)).sort();
    if (coreDatabaseLessonIds.length !== sourceLessons.size) {
        mismatches.push(`Database có ${coreDatabaseLessonIds.length}/${sourceLessons.size} bài kiến thức C++.`);
    }

    for (const [lessonId, source] of sourceLessons) {
        const lesson = databaseLessons.get(lessonId);
        if (!lesson) {
            mismatches.push(`${lessonId}: chưa có trong database.`);
            continue;
        }
        if (!graph.lesson_mappings[lessonId]) mismatches.push(`${lessonId}: chưa có liên kết đồ thị.`);
        if (lesson.title !== source.title) mismatches.push(`${lessonId}: title database lệch tài liệu.`);
        if (lesson.objective !== source.objective) mismatches.push(`${lessonId}: objective database lệch tài liệu.`);
        if (lesson.content !== source.content) mismatches.push(`${lessonId}: content database lệch tài liệu.`);
        if (lesson.difficulty !== source.difficulty) mismatches.push(`${lessonId}: difficulty database lệch tài liệu.`);
        if (lesson.durationMinutes !== source.durationMinutes) mismatches.push(`${lessonId}: duration database lệch tài liệu.`);
        if (lesson.codingExercises.length !== 1) mismatches.push(`${lessonId}: cần đúng một coding exercise.`);
        if (lesson.quizQuestions.length !== 1) mismatches.push(`${lessonId}: cần đúng một quiz.`);
        if (lesson.quizQuestions[0] && lesson.quizQuestions[0].options.filter(option => option.isCorrect).length !== 1) {
            mismatches.push(`${lessonId}: quiz phải có đúng một đáp án.`);
        }

        const canonical = cppCanonicalAssessments[lessonId];
        const exercise = lesson.codingExercises[0];
        if (canonical && exercise) {
            if (graph.lesson_mappings[lessonId] !== canonical.targetSkillId) {
                mismatches.push(`${lessonId}: assessment lệch kỹ năng đồ thị.`);
            }
            if (exercise.title !== canonical.exercise.title || exercise.solutionCode !== canonical.exercise.solutionCode) {
                mismatches.push(`${lessonId}: assessment database lệch reference đã kiểm định.`);
            }
            const expectedTests = canonical.exercise.testCases.map(testCaseSignature).sort();
            const actualTests = exercise.testCases.map(testCaseSignature).sort();
            if (JSON.stringify(actualTests) !== JSON.stringify(expectedTests)) {
                mismatches.push(`${lessonId}: testcase database lệch bộ kiểm định.`);
            }
            const quiz = lesson.quizQuestions[0];
            if (!quiz || quiz.question !== canonical.quiz.question || quiz.explanation !== canonical.quiz.explanation) {
                mismatches.push(`${lessonId}: quiz database lệch assessment chuẩn.`);
            }
        }
    }

    const report = {
        courses: courses.length,
        modules: moduleCount,
        sourceLessons: sourceLessons.size,
        coreDatabaseLessons: coreDatabaseLessonIds.length,
        supplementalPracticeLessons: supplementalLessonIds,
        graphMappings: Object.keys(graph.lesson_mappings).length,
        canonicalAssessments: Object.keys(cppCanonicalAssessments).length,
        mismatches
    };
    console.log(JSON.stringify(report, null, 2));
    if (mismatches.length) process.exitCode = 1;
}

main()
    .catch(error => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
