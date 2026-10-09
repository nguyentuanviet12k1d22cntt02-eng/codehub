import { execFileSync, spawnSync } from 'child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import * as path from 'path';
import { cppCanonicalAssessments } from './lib/cppCanonicalAssessments';

const root = path.resolve(__dirname, '../..');
const graph = JSON.parse(readFileSync(path.join(root, 'curriculum/cppSkillGraph.json'), 'utf8')) as {
    lesson_mappings: Record<string, string>;
};

const requiredLessonIds = new Set([
    'CPP-02.03', 'CPP-02.04', 'CPP-03.01', 'CPP-03.02', 'CPP-03.03', 'CPP-03.04', 'CPP-03.05', 'CPP-05.03', 'CPP-05.04',
    'CPP2-01.01', 'CPP2-01.02', 'CPP2-01.03', 'CPP2-02.01', 'CPP2-02.02', 'CPP2-02.03', 'CPP2-02.04', 'CPP2-03.01', 'CPP2-03.02',
    'CPP2-03.03', 'CPP2-04.01', 'CPP2-04.02', 'CPP2-04.03', 'CPP2-05.01', 'CPP2-05.02', 'CPP2-05.03', 'CPP2-06.01', 'CPP2-06.02', 'CPP2-06.03'
]);

function fail(message: string): never {
    throw new Error(`Kiểm định assessment C++ thất bại: ${message}`);
}

function normalized(text: string): string {
    return text.replace(/\r\n/g, '\n');
}

function run(): void {
    execFileSync('g++', ['--version'], { stdio: 'ignore' });

    const actualLessonIds = new Set(Object.keys(cppCanonicalAssessments));
    if (actualLessonIds.size !== requiredLessonIds.size || [...requiredLessonIds].some(id => !actualLessonIds.has(id))) {
        fail('manifest không chứa đúng tập bài cần thay assessment cũ');
    }

    const workDir = mkdtempSync(path.join(tmpdir(), 'mcode-cpp-assessment-'));
    try {
        for (const [lessonId, assessment] of Object.entries(cppCanonicalAssessments)) {
            if (graph.lesson_mappings[lessonId] !== assessment.targetSkillId) {
                fail(`${lessonId} gắn ${assessment.targetSkillId}, lệch đồ thị ${graph.lesson_mappings[lessonId]}`);
            }
            if (assessment.exercise.testCases.length < 2) {
                fail(`${lessonId} cần tối thiểu hai ca kiểm thử thật`);
            }
            if (assessment.quiz.options.filter(option => option.isCorrect).length !== 1) {
                fail(`${lessonId} cần đúng một đáp án quiz`);
            }

            const sourcePath = path.join(workDir, `${lessonId}.cpp`);
            const executablePath = path.join(workDir, `${lessonId}.exe`);
            writeFileSync(sourcePath, assessment.exercise.solutionCode, 'utf8');
            const compile = spawnSync('g++', ['-std=c++17', '-Wall', '-Wextra', sourcePath, '-o', executablePath], {
                encoding: 'utf8'
            });
            if (compile.status !== 0) {
                fail(`${lessonId} không biên dịch được:\n${compile.stderr || compile.stdout}`);
            }

            for (const testCase of assessment.exercise.testCases) {
                const execution = spawnSync(executablePath, [], { input: testCase.input, encoding: 'utf8', timeout: 3_000 });
                if (execution.status !== 0 || execution.error) {
                    fail(`${lessonId} không chạy được với input ${JSON.stringify(testCase.input)}: ${execution.error?.message ?? execution.stderr}`);
                }
                if (normalized(execution.stdout) !== normalized(testCase.expectedOutput)) {
                    fail(`${lessonId} trả ${JSON.stringify(execution.stdout)} thay vì ${JSON.stringify(testCase.expectedOutput)} cho input ${JSON.stringify(testCase.input)}`);
                }
            }
        }
    } finally {
        rmSync(workDir, { recursive: true, force: true });
    }

    console.log(`Đã biên dịch và chạy ${Object.keys(cppCanonicalAssessments).length} assessment C++ theo C++17.`);
}

run();
