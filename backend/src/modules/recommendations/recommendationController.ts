
import { Response, NextFunction } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { AuthenticatedRequest } from '../../shared/middleware/auth';
import fs from 'fs';
import path from 'path';
import { getAdaptiveMasterySnapshot } from '../adaptive/adaptiveRepository';
import { calculateMasteryUpdate } from '../adaptive/masteryPolicy';

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

    const candidates = [
        path.resolve(__dirname, `../../infrastructure/data/${filename}`),
        path.resolve(process.cwd(), `src/infrastructure/data/${filename}`),
        path.resolve(process.cwd(), `../ai-service/data/${filename}`),
        path.resolve(__dirname, `../../../../ai-service/data/${filename}`)
    ];
    if (filename === 'pythonSkillGraph.json') {
        candidates.push(
            path.resolve(process.cwd(), '../ai-service/data/skill_graph.json'),
            path.resolve(__dirname, '../../../../ai-service/data/skill_graph.json')
        );
    }

    for (const candidate of [...new Set(candidates)]) {
        if (!fs.existsSync(candidate)) continue;
        try {
            return JSON.parse(fs.readFileSync(candidate, 'utf-8'));
        } catch (e) {
            console.error(`Error reading skill graph: ${candidate}`, e);
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
    const lessonTitleMappings: Record<string, string> = pythonGraph?.lesson_title_mappings || {};
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
        const lessonTitle = ex.lesson?.title || '';
        const kc = lessonTitleMappings[lessonTitle] || lessonMappings[lessonCode];
        if (!kc) continue;

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

        const kc = practiceMappings[prob.slug];
        if (!kc) continue;
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

type EvidenceProfile = {
    mastery: number;
    confidence: number;
    attempts: number;
    passed: number;
    failed: number;
    evidence_weight: number;
    passed_evidence: number;
    failed_evidence: number;
    source: 'COURSE_SANDBOX' | 'ADAPTIVE_SANDBOX' | 'MIXED_VERIFIED';
    last_assessed_at: Date | string | null;
};

type VerifiedObservation = {
    conceptId: string;
    itemId: string;
    passed: boolean;
    passedCases: number;
    totalCases: number;
    difficulty: string;
    repeatedExercise: boolean;
    assessedAt: Date | string;
    source: 'COURSE_SANDBOX' | 'ADAPTIVE_SANDBOX';
};

const mappedConceptIds = (value: unknown, validConcepts: Set<string>): string[] => {
    const values = Array.isArray(value) ? value : value ? [value] : [];
    return values.map(String).filter(id => validConcepts.has(id));
};

const bangkokDayIndex = (value: Date | string): number => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date(value));
    const part = (type: string) => Number(parts.find(item => item.type === type)?.value || 0);
    return Math.floor(Date.UTC(part('year'), part('month') - 1, part('day')) / 86400000);
};

const calculateCurrentStreak = (dates: Array<Date | string>): number => {
    const activeDays = new Set(dates.map(bangkokDayIndex));
    let cursor = bangkokDayIndex(new Date());
    if (!activeDays.has(cursor)) return 0;
    let streak = 0;
    while (activeDays.has(cursor)) {
        streak += 1;
        cursor -= 1;
    }
    return streak;
};

export async function getEvidenceBasedUserMastery(userId: string, language: string = 'PYTHON') {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, email: true }
    });

    const username = user?.username || "Học viên";
    const email = user?.email || "";

    const normalizedLanguage = language.toUpperCase();
    const graph = getSkillGraphData(normalizedLanguage);
    if (!graph?.skills || !Array.isArray(graph.skills)) {
        throw new Error(`Không có đồ thị kỹ năng hợp lệ cho ${normalizedLanguage}`);
    }
    const kcs = graph.skills.map((skill: any) => String(skill.id));
    const validConcepts = new Set<string>(kcs);
    const lessonMappings = graph?.lesson_mappings || {};
    const lessonTitleMappings = graph?.lesson_title_mappings || {};
    const multiSkillLessonMappings = graph?.multi_skill_lesson_mappings || {};
    const practiceMappings = graph?.practice_problem_mappings || {};

    const codingExercises = await prisma.codingExercise.findMany({
        include: { lesson: true }
    });
    const practiceProblems = await prisma.practiceProblem.findMany();
    const exerciseToConcepts = new Map<string, string[]>();
    const problemToConcepts = new Map<string, string[]>();
    const exerciseDifficulty = new Map<string, string>();
    const problemDifficulty = new Map<string, string>();

    codingExercises.forEach((ex: any) => {
        const lessonCode = ex.lesson?.lessonId || '';
        const lessonTitle = ex.lesson?.title || '';
        const concepts = mappedConceptIds(
            multiSkillLessonMappings[lessonCode] || lessonTitleMappings[lessonTitle] || lessonMappings[lessonCode],
            validConcepts
        );
        if (concepts.length) exerciseToConcepts.set(ex.id, concepts);
        exerciseDifficulty.set(ex.id, String(ex.difficulty || 'MEDIUM'));
    });

    practiceProblems.forEach((prob: any) => {
        const concepts = mappedConceptIds(practiceMappings[prob.slug], validConcepts);
        if (concepts.length) problemToConcepts.set(prob.id, concepts);
        problemDifficulty.set(prob.id, String(prob.difficulty || 'MEDIUM'));
    });

    const submissions = await prisma.submission.findMany({
        where: { userId, language: normalizedLanguage as any },
        select: { exerciseId: true, status: true, submittedAt: true },
        orderBy: { submittedAt: 'asc' }
    });
    const practiceSubmissions = await prisma.practiceSubmission.findMany({
        where: { userId, language: normalizedLanguage as any },
        select: { problemId: true, status: true, submittedAt: true },
        orderBy: { submittedAt: 'asc' }
    });
    const evidence: Record<string, EvidenceProfile> = {};
    const activityDates: Array<Date | string> = [];
    const completedExercises = new Set<string>();
    const completedPractice = new Set<string>();
    const observedExerciseConceptPairs = new Set<string>();
    const observedPracticeConceptPairs = new Set<string>();
    const verifiedObservations: VerifiedObservation[] = [];

    submissions.forEach(submission => {
        const concepts = exerciseToConcepts.get(submission.exerciseId) || [];
        if (!concepts.length || (submission.status !== 'PASSED' && submission.status !== 'FAILED')) return;
        const passed = submission.status === 'PASSED';
        concepts.forEach(conceptId => {
            const pairKey = `${conceptId}:${submission.exerciseId}`;
            const repeatedExercise = observedExerciseConceptPairs.has(pairKey);
            observedExerciseConceptPairs.add(pairKey);
            verifiedObservations.push({
                conceptId,itemId:submission.exerciseId,passed,passedCases:passed?1:0,totalCases:1,
                difficulty:exerciseDifficulty.get(submission.exerciseId)||'MEDIUM',repeatedExercise,
                assessedAt:submission.submittedAt,source:'COURSE_SANDBOX'
            });
        });
        activityDates.push(submission.submittedAt);
        if (passed) completedExercises.add(submission.exerciseId);
    });
    practiceSubmissions.forEach(submission => {
        const concepts = problemToConcepts.get(submission.problemId) || [];
        if (!concepts.length || (submission.status !== 'PASSED' && submission.status !== 'FAILED')) return;
        const passed = submission.status === 'PASSED';
        concepts.forEach(conceptId => {
            const pairKey = `${conceptId}:${submission.problemId}`;
            const repeatedExercise = observedPracticeConceptPairs.has(pairKey);
            observedPracticeConceptPairs.add(pairKey);
            verifiedObservations.push({
                conceptId,itemId:submission.problemId,passed,passedCases:passed?1:0,totalCases:1,
                difficulty:problemDifficulty.get(submission.problemId)||'MEDIUM',repeatedExercise,
                assessedAt:submission.submittedAt,source:'COURSE_SANDBOX'
            });
        });
        activityDates.push(submission.submittedAt);
        if (passed) completedPractice.add(submission.problemId);
    });

    const adaptive = await getAdaptiveMasterySnapshot(userId, normalizedLanguage);
    activityDates.push(...adaptive.verified_activity_dates);
    adaptive.observations.forEach((observation:any) => {
        if (!validConcepts.has(String(observation.concept_id))) return;
        verifiedObservations.push({
            conceptId:String(observation.concept_id),itemId:String(observation.exercise_id),
            passed:observation.status==='PASSED',passedCases:Number(observation.passed_cases),
            totalCases:Number(observation.total_cases),difficulty:String(observation.difficulty||'MEDIUM'),
            repeatedExercise:Boolean(observation.repeated_exercise),assessedAt:observation.assessed_at,
            source:'ADAPTIVE_SANDBOX'
        });
    });

    verifiedObservations
        .sort((left,right)=>new Date(left.assessedAt).getTime()-new Date(right.assessedAt).getTime())
        .forEach(observation=>{
            const current=evidence[observation.conceptId]||{
                mastery:.4,confidence:0,attempts:0,passed:0,failed:0,evidence_weight:0,
                passed_evidence:0,failed_evidence:0,source:observation.source,last_assessed_at:null
            };
            const update=calculateMasteryUpdate({
                previousMastery:current.mastery,priorAttempts:current.attempts,
                priorEvidenceWeight:current.evidence_weight,passedCases:observation.passedCases,
                totalCases:observation.totalCases,difficulty:observation.difficulty,
                repeatedExercise:observation.repeatedExercise
            });
            current.mastery=update.nextMastery;
            current.attempts+=1;
            current.passed+=observation.passed?1:0;
            current.failed+=observation.passed?0:1;
            current.evidence_weight+=update.observationWeight;
            current.passed_evidence+=update.observationWeight*update.observedScore;
            current.failed_evidence+=update.observationWeight*(1-update.observedScore);
            current.confidence=1-Math.exp(-current.evidence_weight/3);
            current.source=current.source===observation.source?current.source:'MIXED_VERIFIED';
            current.last_assessed_at=observation.assessedAt;
            evidence[observation.conceptId]=current;
        });

    const masteryMap = Object.fromEntries(Object.entries(evidence).map(([conceptId, item]) => [conceptId, Number(item.mastery.toFixed(4))]));
    const observed = Object.values(evidence);
    const totalActions = observed.reduce((sum, item) => sum + item.attempts, 0);
    const totalEvidenceWeight = observed.reduce((sum, item) => sum + item.evidence_weight, 0);
    const weightedMastery = totalEvidenceWeight
        ? observed.reduce((sum, item) => sum + item.mastery * item.evidence_weight, 0) / totalEvidenceWeight
        : null;
    let profile: 'NEW' | 'STRUGGLING' | 'AVERAGE' | 'EXCELLENT' = 'NEW';
    if (weightedMastery !== null) {
        profile = weightedMastery >= .8 && totalActions >= 5 ? 'EXCELLENT'
            : weightedMastery < .45 && totalActions >= 3 ? 'STRUGGLING' : 'AVERAGE';
    }

    return {
        success: true,
        language: normalizedLanguage,
        student_meta: { username, email, profile },
        mastery: {
            'Evidence-Based': masteryMap
        },
        evidence,
        model_metadata: {
            engine: 'evidence_policy_v4',
            unobserved_skills_are_null: true,
            confidence_definition: '1 - exp(-verified_evidence_weight / 3)',
            repeated_exercise_weight: .35,
            estimator: 'Chronological, difficulty-weighted verified observation policy across all sources',
            legacy_events_replayed_with_current_policy: true
        },
        stats: {
            lessons_completed: completedExercises.size,
            practice_completed: completedPractice.size,
            streak_days: calculateCurrentStreak(activityDates),
            total_actions: totalActions,
            total_evidence_weight: Number(totalEvidenceWeight.toFixed(4)),
            observed_skills: observed.length,
            total_skills: kcs.length,
            overall_mastery: weightedMastery === null ? null : Number(weightedMastery.toFixed(4))
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

        const masteryData = await getEvidenceBasedUserMastery(userId, language);
        res.status(200).json(masteryData);
    } catch (err) {
        next(err);
    }
};
