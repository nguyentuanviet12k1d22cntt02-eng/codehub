
import { Response, NextFunction } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { AuthenticatedRequest } from '../../shared/middleware/auth';
import fs from 'fs';
import path from 'path';

// Define target structures
interface RecommendItem {
    id: string;
    type: string;
    title: string;
    kc_id: string;
    predicted_mastery: number;
    zpd_score: number;
    difficulty: string;
    lesson_id?: string;
    slug?: string;
}

// Multi-language Skill Graph resolution
export function getSkillGraphData(language: string = 'PYTHON'): any {
    const lang = (language || 'PYTHON').toUpperCase();
    const filename = (lang === 'JAVASCRIPT' || lang === 'JS') ? 'javascriptSkillGraph.json'
                   : (lang === 'CPP' || lang === 'C++') ? 'cppSkillGraph.json'
                   : (lang === 'SQL') ? 'sqlSkillGraph.json'
                   : 'pythonSkillGraph.json';

    const localInfraPath = path.resolve(__dirname, `../../infrastructure/data/${filename}`);
    if (fs.existsSync(localInfraPath)) {
        try {
            return JSON.parse(fs.readFileSync(localInfraPath, 'utf-8'));
        } catch (e) {
            console.error(`Error reading skill graph from infra: ${localInfraPath}`, e);
        }
    }

    const aiServicePath = path.resolve(__dirname, `../../../ai-service/data/${filename}`);
    if (fs.existsSync(aiServicePath)) {
        try {
            return JSON.parse(fs.readFileSync(aiServicePath, 'utf-8'));
        } catch (e) {
            console.error(`Error reading skill graph from ai-service: ${aiServicePath}`, e);
        }
    }

    const legacyPath = path.resolve(__dirname, '../../../ai-service/data/skill_graph.json');
    if (fs.existsSync(legacyPath)) {
        try {
            return JSON.parse(fs.readFileSync(legacyPath, 'utf-8'));
        } catch (e) {
            console.error(`Error reading legacy skill graph: ${legacyPath}`, e);
        }
    }

    return null;
}

export const getSkillGraph = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const language = (req.query.language as string || 'PYTHON');
        const graph = getSkillGraphData(language);
        if (graph) {
            res.status(200).json({ success: true, data: graph });
            return;
        }
        res.status(404).json({ success: false, error: `Skill graph file not found for language: ${language}` });
    } catch (err) {
        next(err);
    }
};

// Rule-based absolute fallback recommendation
async function getRuleBasedFallback(userId: string, limit: number): Promise<RecommendItem[]> {
    console.log(`Executing rule-based fallback recommendation for user: ${userId}`);

    const pythonGraph = getSkillGraphData('PYTHON');
    const lessonMappings: Record<string, string> = pythonGraph?.lesson_mappings || {};
    const practiceMappings: Record<string, string> = pythonGraph?.practice_problem_mappings || {};

    // 1. Fetch completed items to filter out
    const passedSubmissions = await prisma.submission.findMany({
        where: { userId, status: 'PASSED' },
        select: { exerciseId: true }
    });

    const passedPractice = await prisma.practiceSubmission.findMany({
        where: { userId, status: 'PASSED' },
        select: { problemId: true }
    });

    const passedExerciseIds = new Set(passedSubmissions.map(s => s.exerciseId));
    const passedPracticeIds = new Set(passedPractice.map(p => p.problemId));

    // 2. Fetch all lesson exercises sorted by course progression
    // Join with lessons and modules
    const codingExercises = await prisma.codingExercise.findMany({
        include: {
            lesson: {
                include: {
                    chapter: {
                        include: {
                            module: {
                                select: {
                                    orderIndex: true
                                }
                            }
                        }
                    }
                }
            }
        }
    }) as any[];

    // Sort array by module.orderIndex asc, chapter.orderIndex asc, lesson.orderIndex asc
    codingExercises.sort((a: any, b: any) => {
        const mOrdA = a.lesson?.chapter?.module?.orderIndex ?? 0;
        const mOrdB = b.lesson?.chapter?.module?.orderIndex ?? 0;
        if (mOrdA !== mOrdB) return mOrdA - mOrdB;

        const cOrdA = a.lesson?.chapter?.orderIndex ?? 0;
        const cOrdB = b.lesson?.chapter?.orderIndex ?? 0;
        if (cOrdA !== cOrdB) return cOrdA - cOrdB;

        const lOrdA = a.lesson?.orderIndex ?? 0;
        const lOrdB = b.lesson?.orderIndex ?? 0;
        return lOrdA - lOrdB;
    });

    const filteredExercises: RecommendItem[] = [];
    for (const ex of codingExercises) {
        if (passedExerciseIds.has(ex.id)) continue;

        const lessonCode = ex.lesson?.lessonId || '';
        const kc = lessonMappings[lessonCode] || 'KC_VAR';

        filteredExercises.push({
            id: ex.id,
            type: 'LESSON_EXERCISE',
            title: ex.title,
            kc_id: kc,
            predicted_mastery: 0.5,
            zpd_score: 0.0,
            difficulty: String(ex.difficulty),
            lesson_id: ex.lesson?.id
        });

        if (filteredExercises.length >= limit) {
            break;
        }
    }

    if (filteredExercises.length >= limit) {
        return filteredExercises;
    }

    // 3. Fetch practice problems if not enough lesson exercises
    const remainingLimit = limit - filteredExercises.length;
    const practiceProblems = await prisma.practiceProblem.findMany();

    for (const prob of practiceProblems) {
        if (passedPracticeIds.has(prob.id)) continue;

        const kc = practiceMappings[prob.slug] || 'KC_LIST';
        filteredExercises.push({
            id: prob.id,
            type: 'PRACTICE_PROBLEM',
            title: prob.title,
            kc_id: kc,
            predicted_mastery: 0.5,
            zpd_score: 0.0,
            difficulty: String(prob.difficulty),
            slug: prob.slug
        });

        if (filteredExercises.length >= limit) {
            break;
        }
    }

    return filteredExercises;
}

export const getRecommendations = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id as string;
        if (!userId) {
            res.status(401).json({ error: "Người dùng chưa đăng nhập" });
            return;
        }

        const algo = (req.query.algo as string) || 'PAL-Net';
        const limitStr = req.query.limit as string;
        const limit = limitStr ? parseInt(limitStr, 10) : 5;

        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        const url = `${aiServiceUrl}/recommend?user_id=${userId}&algo=${encodeURIComponent(algo)}&limit=${limit}`;

        console.log(`Connecting to AI Service: ${url}`);

        // Fetch recommendations from AI Service with local timeout fallback
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout

        try {
            const response = await fetch(url, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                res.status(200).json({
                    success: true,
                    engine: algo,
                    data
                });
            } else {
                console.warn(`AI Service returned unexpected status: ${response.status}. Triggering rule-based fallback...`);
                const fallbackData = await getRuleBasedFallback(userId, limit);
                res.status(200).json({
                    success: true,
                    engine: 'FALLBACK_RULE_BASED',
                    data: fallbackData
                });
            }
        } catch (fetchErr: any) {
            clearTimeout(timeoutId);
            console.error(`Could not reach AI Service (${fetchErr.message}). Triggering rule-based fallback.`, fetchErr);

            const fallbackData = await getRuleBasedFallback(userId, limit);
            res.status(200).json({
                success: true,
                engine: 'FALLBACK_RULE_BASED',
                data: fallbackData
            });
        }
    } catch (err) {
        next(err);
    }
};

export async function getDynamicUserMasteryFallback(userId: string, language: string = 'PYTHON') {
    // 1. Fetch user info
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, email: true }
    });

    const username = user?.username || "Học viên";
    const email = user?.email || "";

    // 2. Load skill graph for the requested language
    const graph = getSkillGraphData(language);
    const kcs = (graph?.skills && Array.isArray(graph.skills))
        ? graph.skills.map((s: any) => s.id)
        : ['KC_VAR', 'KC_COND', 'KC_LOOP', 'KC_LIST', 'KC_DICT', 'KC_FUNC', 'KC_OOP'];
    const lessonMappings = graph?.lesson_mappings || {};
    const practiceMappings = graph?.practice_problem_mappings || {};

    // 3. Fetch all lesson exercises and practice problems
    const codingExercises = await prisma.codingExercise.findMany({
        include: { lesson: true }
    });
    const practiceProblems = await prisma.practiceProblem.findMany();

    // 4. Group by Knowledge Component (KC) for this language
    const totalByKC: Record<string, number> = {};
    kcs.forEach((kc: string) => { totalByKC[kc] = 0; });

    const exerciseToKCMap: Record<string, string> = {};
    const problemToKCMap: Record<string, string> = {};

    codingExercises.forEach((ex: any) => {
        const lessonCode = ex.lesson?.lessonId || '';
        const kc = lessonMappings[lessonCode];
        if (kc && kcs.includes(kc)) {
            exerciseToKCMap[ex.id] = kc;
            totalByKC[kc]++;
        }
    });

    practiceProblems.forEach((prob: any) => {
        const kc = practiceMappings[prob.slug];
        if (kc && kcs.includes(kc)) {
            problemToKCMap[prob.id] = kc;
            totalByKC[kc]++;
        }
    });

    // 5. Fetch passed submissions
    const passedSubmissions = await prisma.submission.findMany({
        where: { userId, status: 'PASSED' },
        select: { exerciseId: true }
    });
    const passedPractice = await prisma.practiceSubmission.findMany({
        where: { userId, status: 'PASSED' },
        select: { problemId: true }
    });

    const completedByKC: Record<string, number> = {};
    kcs.forEach((kc: string) => { completedByKC[kc] = 0; });

    let langCompletedExercises = 0;
    passedSubmissions.forEach(s => {
        const kc = exerciseToKCMap[s.exerciseId];
        if (kc && kcs.includes(kc)) {
            completedByKC[kc]++;
            langCompletedExercises++;
        }
    });

    let langCompletedPractice = 0;
    passedPractice.forEach(p => {
        const kc = problemToKCMap[p.problemId];
        if (kc && kcs.includes(kc)) {
            completedByKC[kc]++;
            langCompletedPractice++;
        }
    });

    // Count attempts for actions stats
    const totalSubmitsCount = await prisma.submission.count({ where: { userId } });
    const totalPracticeSubmitsCount = await prisma.practiceSubmission.count({ where: { userId } });
    const totalActions = totalSubmitsCount + totalPracticeSubmitsCount;

    // 6. Estimate profile status
    const totalCompleted = langCompletedExercises + langCompletedPractice;
    let profile: 'STRUGGLING' | 'AVERAGE' | 'EXCELLENT' = "AVERAGE";
    if (totalActions > 0) {
        const successRate = totalCompleted / Math.max(1, totalActions);
        if (successRate >= 0.8 && totalCompleted >= 3) {
            profile = "EXCELLENT";
        } else if (successRate < 0.4 && totalActions >= 5) {
            profile = "STRUGGLING";
        }
    }

    // 7. Calculate mastery values for PAL-Net
    const palNetMastery: Record<string, number> = {};
    kcs.forEach((kc: string) => {
        const total = totalByKC[kc] || 0;
        const completed = completedByKC[kc] || 0;
        const pct = total > 0 ? (completed / total) : 0;

        palNetMastery[kc] = 0.4 + 0.55 * pct;
    });

    return {
        success: true,
        language: language.toUpperCase(),
        student_meta: { username, email, profile },
        mastery: {
            "PAL-Net": palNetMastery
        },
        stats: {
            lessons_completed: langCompletedExercises,
            practice_completed: langCompletedPractice,
            streak_days: 5,
            total_actions: totalActions
        }
    };
}

export const getUserMastery = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id as string;
        const language = (req.query.language as string || 'PYTHON').toUpperCase();

        if (!userId) {
            res.status(401).json({ error: "Người dùng chưa đăng nhập" });
            return;
        }

        // Nếu là Python và AI service khả dụng
        if (language === 'PYTHON') {
            const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
            const url = `${aiServiceUrl}/user_mastery?user_id=${userId}`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    signal: controller.signal,
                    headers: { 'Accept': 'application/json' }
                });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    res.status(200).json(data);
                    return;
                }
            } catch {
                clearTimeout(timeoutId);
            }
        }

        // Với JS, C++, SQL hoặc fallback Python
        const fallbackData = await getDynamicUserMasteryFallback(userId, language);
        res.status(200).json(fallbackData);
    } catch (err) {
        next(err);
    }
};
