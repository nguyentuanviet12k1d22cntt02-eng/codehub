import { NextFunction, Response } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { AuthenticatedRequest } from '../../shared/middleware/auth';
import { getSkillGraphData } from '../recommendations/recommendationController';

type PilotLanguage = 'PYTHON' | 'JAVASCRIPT' | 'CPP';

const PYTHON_PILOT_SKILLS = new Set([
    'PY-BASICS-01', 'PY-BASICS-02', 'PY-BASICS-03',
    'PY-FLOW-01', 'PY-FLOW-02', 'PY-FLOW-03',
]);
const PYTHON_PILOT_DATASET_SHA256 = '40969384fe86f98d5f32a96d48cb7a873119c6350ff989598d3f982301391fbf';
const PYTHON_PRACTICE_SKILLS: Record<string, string> = {
    'LS-01.MP': 'PY-BASICS-03',
    'LS-02.MP': 'PY-FLOW-01',
    'LS-03.MP_FOR': 'PY-FLOW-03',
    'LS-03.MP_WHILE': 'PY-FLOW-02',
};
// These Python exercises require skills outside the six-skill Python pilot.
const OUTSIDE_PYTHON_PILOT_TITLES = new Set([
    'Kiểm tra ký tự đầu tiên của chuỗi',
    'Kiểm Tra và Đánh Giá Mật Khẩu Đơn Giản',
]);

type PracticeExercise = {
    id: string;
    title: string;
    difficulty: string;
    problemDescription: string;
    solutionCode: string | null;
    testCases: { input: string; expectedOutput: string }[];
};
type Candidate = { id: string; title: string; difficulty: string; skill_id: string; level: number };
type Score = { id: string; predicted_correctness: number };
type HistoryEvent = { skill_id: string; is_correct: number };

const difficultyLevel = (difficulty: string): number => ({ EASY: 1, MEDIUM: 2, HARD: 3 }[difficulty] || 0);

export function languageForLessonCode(lessonCode: string): PilotLanguage | null {
    if (/^JS\d?-/i.test(lessonCode)) return 'JAVASCRIPT';
    if (/^CPP-/i.test(lessonCode)) return 'CPP';
    if (/^LS-/i.test(lessonCode)) return 'PYTHON';
    return null;
}

function lessonSkill(language: PilotLanguage, lessonCode: string, title: string): string | null {
    if (language === 'PYTHON') {
        if (lessonCode === 'LS-01.MP' && title === 'Hoán đổi giá trị hai biến') return 'PY-BASICS-01';
        return PYTHON_PRACTICE_SKILLS[lessonCode] || null;
    }
    const graph = getSkillGraphData(language);
    const skill = graph?.lesson_mappings?.[lessonCode];
    const knownSkills = new Set((graph?.skills || []).map((item: { id?: unknown }) => String(item.id || '')));
    return typeof skill === 'string' && knownSkills.has(skill) ? skill : null;
}

// Exported for the small backend contract test and for keeping legacy Python mappings stable.
export function skillForPractice(lessonId: string, title: string, language?: PilotLanguage): string | null {
    return lessonSkill(language || languageForLessonCode(lessonId) || 'PYTHON', lessonId, title);
}

export function verifiedPracticeCandidates(
    lessonId: string, exercises: PracticeExercise[], language?: PilotLanguage,
): Candidate[] {
    const inferredLanguage = language || languageForLessonCode(lessonId);
    if (!inferredLanguage) return [];
    return exercises.flatMap((exercise) => {
        const level = difficultyLevel(String(exercise.difficulty));
        const minimumTests = inferredLanguage === 'PYTHON' && ['LS-01.MP', 'LS-02.MP'].includes(lessonId) ? 3 : 1;
        if (!level || !exercise.problemDescription || !exercise.solutionCode ||
            /^val_0\s*=\s*input\(\)/.test(exercise.solutionCode) ||
            exercise.testCases.length < minimumTests ||
            exercise.testCases.some((test) => !test.expectedOutput.trim() || /Kết quả mẫu|\[Tên người\]/i.test(test.expectedOutput)) ||
            (inferredLanguage === 'PYTHON' && OUTSIDE_PYTHON_PILOT_TITLES.has(exercise.title))) return [];
        const skill = lessonSkill(inferredLanguage, lessonId, exercise.title);
        if (!skill || (inferredLanguage === 'PYTHON' && !PYTHON_PILOT_SKILLS.has(skill))) return [];
        return [{ id: exercise.id, title: exercise.title, difficulty: String(exercise.difficulty), skill_id: skill, level }];
    });
}

export function selectPracticeCandidate(candidates: Candidate[], scores: Score[], history: HistoryEvent[]):
    { candidate: Candidate; readiness: number; targetLevel: number } | null {
    const byId = new Map(scores.map((score) => [score.id, score.predicted_correctness]));
    if (byId.size !== candidates.length || candidates.some((candidate) => {
        const value = byId.get(candidate.id);
        return value === undefined || !Number.isFinite(value) || value < 0 || value > 1;
    })) return null;
    const ranked = candidates.map((candidate, order) => {
        const related = candidates.filter((item) => item.skill_id === candidate.skill_id);
        const readiness = related.reduce((sum, item) => sum + byId.get(item.id)!, 0) / related.length;
        const previous = history.filter((event) => event.skill_id === candidate.skill_id);
        const passes = previous.filter((event) => event.is_correct === 1).length;
        const targetLevel = previous.length === 0 || previous.at(-1)?.is_correct === 0 || readiness < 0.55 ? 1
            : readiness < 0.63 || passes < 2 ? 2 : 3;
        return { candidate, readiness, targetLevel, order };
    });
    ranked.sort((a, b) =>
        Math.abs(a.candidate.level - a.targetLevel) - Math.abs(b.candidate.level - b.targetLevel) ||
        Math.abs(a.readiness - 0.65) - Math.abs(b.readiness - 0.65) ||
        a.order - b.order,
    );
    return ranked[0] || null;
}

function pilotResponseIsValid(
    language: PilotLanguage,
    payload: { engine?: string; language?: string; dataset_sha256?: string; scores?: Score[] },
): payload is { engine: string; language?: string; dataset_sha256: string; scores: Score[] } {
    if (!Array.isArray(payload.scores)) return false;
    if (language === 'PYTHON') {
        return payload.engine === 'PALNET_SYNTHETIC_LOCAL_PILOT' && payload.dataset_sha256 === PYTHON_PILOT_DATASET_SHA256;
    }
    return payload.engine === 'PALNET_SYNTHETIC_MULTILINGUAL_PILOT' && payload.language === language;
}

export async function getModulePracticeRecommendation(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Cần đăng nhập để nhận bài phù hợp.' });
            return;
        }
        const requestedId = String(req.params.id || '');
        const where = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestedId)
            ? { id: requestedId } : { lessonId: requestedId };
        const lesson = await prisma.lesson.findFirst({
            where,
            select: {
                lessonId: true,
                codingExercises: {
                    orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
                    select: { id: true, title: true, difficulty: true, problemDescription: true,
                        solutionCode: true, testCases: { select: { input: true, expectedOutput: true } } },
                },
            },
        });
        if (!lesson) {
            res.status(404).json({ message: 'Không tìm thấy bài tổng hợp.' });
            return;
        }
        const lessonCode = lesson.lessonId || '';
        const language = languageForLessonCode(lessonCode);
        if (!language) {
            res.status(200).json({ mode: 'MANUAL', reason: 'SKILL_OUTSIDE_PILOT' });
            return;
        }
        const candidates = verifiedPracticeCandidates(lessonCode, lesson.codingExercises, language);
        if (!candidates.length) {
            res.status(200).json({ mode: 'MANUAL', reason: 'NO_VERIFIED_EXERCISES' });
            return;
        }
        const passed = await prisma.submission.findMany({
            where: { userId, status: 'PASSED', exerciseId: { in: candidates.map((item) => item.id) } },
            select: { exerciseId: true },
        });
        const passedIds = new Set(passed.map((item) => item.exerciseId));
        const open = candidates.filter((item) => !passedIds.has(item.id));
        if (!open.length) {
            res.status(200).json({ mode: 'COMPLETE', reason: 'ALL_VERIFIED_EXERCISES_PASSED' });
            return;
        }

        const graph = getSkillGraphData(language);
        const lessonMappings: Record<string, string> = graph?.lesson_mappings || {};
        const submissions = await prisma.submission.findMany({
            where: { userId, language, status: { in: ['PASSED', 'FAILED'] } },
            orderBy: [{ submittedAt: 'desc' }, { id: 'desc' }],
            take: 500,
            select: { status: true, exercise: { select: {
                id: true, title: true, difficulty: true, problemDescription: true, solutionCode: true,
                testCases: { select: { input: true, expectedOutput: true } },
                lesson: { select: { lessonId: true } },
            } } },
        });
        const history = submissions.reverse().flatMap((submission) => {
            const code = submission.exercise.lesson.lessonId || '';
            if (languageForLessonCode(code) !== language) return [];
            const skill = language === 'PYTHON' && code.includes('.MP')
                ? verifiedPracticeCandidates(code, [submission.exercise], language).at(0)?.skill_id
                : lessonMappings[code];
            const valid = language === 'PYTHON' ? PYTHON_PILOT_SKILLS.has(skill || '') : Boolean(skill);
            return valid ? [{ skill_id: skill!, is_correct: submission.status === 'PASSED' ? 1 : 0 }] : [];
        });

        const defaultAiUrl = process.env.NODE_ENV === 'production'
            ? 'https://codehub-ai.onrender.com'
            : 'http://127.0.0.1:8000';
        const aiUrl = new URL(process.env.AI_SERVICE_URL || defaultAiUrl);
        let scores: Score[];
        try {
            const response = await fetch(new URL('/local-pilot/module-practice/score', aiUrl), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language, history,
                    candidates: open.map(({ id, skill_id, level }) => ({ id, skill_id, difficulty: level })),
                }),
                signal: AbortSignal.timeout(12000),
            });
            if (!response.ok) throw new Error(`PAL-Net HTTP ${response.status}`);
            const payload = await response.json() as { engine?: string; language?: string; dataset_sha256?: string; scores?: Score[] };
            if (!pilotResponseIsValid(language, payload)) throw new Error('PAL-Net response invalid');
            scores = payload.scores;
        } catch (err: any) {
            console.error(`[modulePracticeRecommendation] Failed to fetch ${language} PAL-Net scores from ${aiUrl.origin}:`, err?.message || err);
            res.status(200).json({ mode: 'MANUAL', reason: 'LOCAL_MODEL_UNAVAILABLE' });
            return;
        }
        const selected = selectPracticeCandidate(open, scores, history);
        if (!selected) {
            res.status(200).json({ mode: 'MANUAL', reason: 'MODEL_SCORES_INVALID' });
            return;
        }
        res.status(200).json({
            mode: language === 'PYTHON' ? 'PALNET_SYNTHETIC_LOCAL_PILOT' : 'PALNET_SYNTHETIC_MULTILINGUAL_PILOT',
            language,
            exerciseId: selected.candidate.id,
            title: selected.candidate.title,
            difficulty: selected.candidate.difficulty,
            skillId: selected.candidate.skill_id,
            estimatedReadiness: Number(selected.readiness.toFixed(3)),
            availableCount: open.length,
        });
    } catch (error) {
        next(error);
    }
}
