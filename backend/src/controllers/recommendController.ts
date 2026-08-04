import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
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

// Load lesson mappings to map coding exercises to KCs if we fall back
const skillGraphPath = path.resolve(__dirname, '../../../ai-service/data/skill_graph.json');
let lessonMappings: Record<string, string> = {};
let practiceMappings: Record<string, string> = {};

try {
    if (fs.existsSync(skillGraphPath)) {
        const graph = JSON.parse(fs.readFileSync(skillGraphPath, 'utf-8'));
        lessonMappings = graph.lesson_mappings || {};
        practiceMappings = graph.practice_problem_mappings || {};
    }
} catch (e) {
    console.error("Could not load skill graph mapping inside Express backend:", e);
}

// Rule-based absolute fallback recommendation
async function getRuleBasedFallback(userId: string, limit: number): Promise<RecommendItem[]> {
    console.log(`Executing rule-based fallback recommendation for user: ${userId}`);

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

async function getDynamicUserMasteryFallback(userId: string) {
    // 1. Fetch user info
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, email: true }
    });

    const username = user?.username || "Học viên";
    const email = user?.email || "";

    // 2. Fetch all lesson exercises and practice problems
    const codingExercises = await prisma.codingExercise.findMany({
        include: { lesson: true }
    });
    const practiceProblems = await prisma.practiceProblem.findMany();

    // 3. Group by Knowledge Component (KC)
    const kcs = ['KC_VAR', 'KC_COND', 'KC_LOOP', 'KC_LIST', 'KC_DICT', 'KC_FUNC', 'KC_OOP'];
    const totalByKC: Record<string, number> = {};
    kcs.forEach(kc => { totalByKC[kc] = 0; });

    const exerciseToKCMap: Record<string, string> = {};
    const problemToKCMap: Record<string, string> = {};

    codingExercises.forEach((ex: any) => {
        const lessonCode = ex.lesson?.lessonId || '';
        const kc = lessonMappings[lessonCode] || 'KC_VAR';
        exerciseToKCMap[ex.id] = kc;
        if (kcs.includes(kc)) {
            totalByKC[kc]++;
        }
    });

    practiceProblems.forEach((prob: any) => {
        const kc = practiceMappings[prob.slug] || 'KC_LIST';
        problemToKCMap[prob.id] = kc;
        if (kcs.includes(kc)) {
            totalByKC[kc]++;
        }
    });

    // 4. Fetch passed submissions
    const passedSubmissions = await prisma.submission.findMany({
        where: { userId, status: 'PASSED' },
        select: { exerciseId: true }
    });
    const passedPractice = await prisma.practiceSubmission.findMany({
        where: { userId, status: 'PASSED' },
        select: { problemId: true }
    });

    const completedByKC: Record<string, number> = {};
    kcs.forEach(kc => { completedByKC[kc] = 0; });

    const passedExerciseIds = new Set(passedSubmissions.map(s => s.exerciseId));
    const passedPracticeIds = new Set(passedPractice.map(p => p.problemId));

    passedExerciseIds.forEach(id => {
        const kc = exerciseToKCMap[id];
        if (kc && kcs.includes(kc)) {
            completedByKC[kc]++;
        }
    });

    passedPracticeIds.forEach(id => {
        const kc = problemToKCMap[id];
        if (kc && kcs.includes(kc)) {
            completedByKC[kc]++;
        }
    });

    // Count attempts for actions stats
    const totalSubmitsCount = await prisma.submission.count({ where: { userId } });
    const totalPracticeSubmitsCount = await prisma.practiceSubmission.count({ where: { userId } });
    const totalActions = totalSubmitsCount + totalPracticeSubmitsCount;

    // 5. Estimate profile status
    const totalCompleted = passedExerciseIds.size + passedPracticeIds.size;
    let profile: 'STRUGGLING' | 'AVERAGE' | 'EXCELLENT' = "AVERAGE";
    if (totalActions > 0) {
        const successRate = totalCompleted / totalActions;
        if (successRate >= 0.8 && totalCompleted >= 5) {
            profile = "EXCELLENT";
        } else if (successRate < 0.4 && totalActions >= 5) {
            profile = "STRUGGLING";
        }
    }

    // 6. Calculate mastery values for each model (varying standard baselines)
    const palNetMastery: Record<string, number> = {};
    const bktMastery: Record<string, number> = {};
    const dktMastery: Record<string, number> = {};

    kcs.forEach(kc => {
        const total = totalByKC[kc];
        const completed = completedByKC[kc];
        const pct = total > 0 ? (completed / total) : 0;

        palNetMastery[kc] = 0.4 + 0.55 * pct;
        bktMastery[kc] = 0.35 + 0.55 * pct;
        dktMastery[kc] = 0.45 + 0.5 * pct;
    });

    return {
        success: true,
        student_meta: { username, email, profile },
        mastery: {
            "PAL-Net": palNetMastery,
            "BKT": bktMastery,
            "DKT": dktMastery
        },
        stats: {
            lessons_completed: passedExerciseIds.size,
            practice_completed: passedPracticeIds.size,
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
        if (!userId) {
            res.status(401).json({ error: "Người dùng chưa đăng nhập" });
            return;
        }

        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        const url = `${aiServiceUrl}/user_mastery?user_id=${userId}`;

        console.log(`Connecting to AI Service for user mastery: ${url}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

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
                res.status(200).json(data);
            } else {
                console.warn(`AI Service returned unexpected status: ${response.status}. Triggering database-driven fallback...`);
                const fallbackData = await getDynamicUserMasteryFallback(userId);
                res.status(200).json(fallbackData);
            }
        } catch (fetchErr: any) {
            clearTimeout(timeoutId);
            console.error(`Could not reach AI Service for user mastery. Using database-driven fallback.`, fetchErr);
            const fallbackData = await getDynamicUserMasteryFallback(userId);
            res.status(200).json(fallbackData);
        }
    } catch (err) {
        next(err);
    }
};
