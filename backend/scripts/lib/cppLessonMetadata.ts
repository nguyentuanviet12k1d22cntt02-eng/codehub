import * as fs from 'fs';

export type LessonDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface CppLessonMetadata {
    content: string;
    title: string;
    objective: string;
    difficulty: LessonDifficulty;
    durationMinutes: number;
}

function readFrontmatterValue(content: string, key: string): string {
    const match = content.match(new RegExp(`^${key}:\\s*\\"?([^\\"\\n]+)\\"?\\s*$`, 'm'));
    if (!match?.[1]?.trim()) {
        throw new Error(`Thiếu trường ${key} trong metadata bài học C++.`);
    }
    return match[1].trim();
}

function deriveObjectiveFromSummary(content: string, title: string): string {
    const summary = content.match(/## 5\. Ghi nhớ trọng tâm\s*([\s\S]*?)(?=\n## |$)/i)?.[1] ?? '';
    const points = summary
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.startsWith('- '))
        .map(line => line.slice(2).trim())
        .filter(Boolean)
        .slice(0, 2);

    if (!points.length) {
        throw new Error(`Thiếu phần “Ghi nhớ trọng tâm” để tạo mục tiêu cho bài: ${title}`);
    }
    return points.join(' ');
}

export function readCppLessonMetadata(filePath: string): CppLessonMetadata {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Không tìm thấy nội dung bài học C++: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const title = readFrontmatterValue(content, 'title');
    const rawDifficulty = readFrontmatterValue(content, 'difficulty').toUpperCase();
    const durationMinutes = Number.parseInt(readFrontmatterValue(content, 'estimatedDuration'), 10);

    if (!['EASY', 'MEDIUM', 'HARD'].includes(rawDifficulty)) {
        throw new Error(`Độ khó C++ không hợp lệ trong ${filePath}: ${rawDifficulty}`);
    }
    if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
        throw new Error(`estimatedDuration C++ không hợp lệ trong ${filePath}`);
    }

    return {
        content,
        title,
        objective: deriveObjectiveFromSummary(content, title),
        difficulty: rawDifficulty as LessonDifficulty,
        durationMinutes
    };
}
