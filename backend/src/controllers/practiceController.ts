import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { codeExecutionQueue } from '../services/queueService';
import { AuthenticatedRequest } from '../middlewares/auth';
import { ProgrammingLanguage, ExerciseDifficulty, SubmissionStatus } from '@prisma/client';

// 1. Lấy danh sách bài tập luyện tập độc lập kèm bộ lọc
export const getPracticeProblems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { difficulty, tag, status, search } = req.query;
        const userId = (req as any).user?.id as string | undefined;

        // Build query conditions (Limit Practice Arena to only show the 3 original problems from GitHub)
        const whereClause: any = {
            slug: {
                in: ['two-sum', 'add-two-numbers', 'longest-substring-without-repeating-characters']
            }
        };

        if (difficulty) {
            whereClause.difficulty = difficulty as ExerciseDifficulty;
        }

        if (tag) {
            whereClause.tags = {
                some: {
                    slug: tag as string
                }
            };
        }

        if (search) {
            whereClause.title = {
                contains: search as string,
                mode: 'insensitive'
            };
        }

        // Fetch problems
        const problems = await prisma.practiceProblem.findMany({
            where: whereClause,
            include: {
                tags: true,
                submissions: userId ? {
                    where: { userId },
                    orderBy: { submittedAt: 'desc' }
                } : false
            },
            orderBy: { createdAt: 'asc' }
        });

        // Map status for frontend
        const mappedProblems = problems.map(prob => {
            let userStatus: 'NOT_ATTEMPTED' | 'PASSED' | 'FAILED' = 'NOT_ATTEMPTED';
            if (userId && prob.submissions && prob.submissions.length > 0) {
                const hasPassed = prob.submissions.some(s => s.status === 'PASSED');
                userStatus = hasPassed ? 'PASSED' : 'FAILED';
            }

            // Calculate accepted rate
            // We need count of total submissions and passed submissions
            return {
                id: prob.id,
                title: prob.title,
                slug: prob.slug,
                difficulty: prob.difficulty,
                tags: prob.tags,
                status: userStatus
            };
        });

        // Filter by userStatus if specified
        let finalProblems = mappedProblems;
        if (status && userId) {
            finalProblems = mappedProblems.filter(p => p.status === status);
        }

        // Fetch all tags for sidebar filter
        const tags = await prisma.problemTag.findMany({
            orderBy: { name: 'asc' }
        });

        res.status(200).json({
            problems: finalProblems,
            tags
        });
    } catch (err) {
        next(err);
    }
};

// 2. Lấy chi tiết bài tập theo slug (chỉ trả về public testcases)
export const getPracticeProblemBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const slug = req.params.slug as string;

        const problem = await prisma.practiceProblem.findUnique({
            where: { slug },
            include: {
                tags: true,
                testCases: {
                    where: { isHidden: false },
                    select: {
                        id: true,
                        input: true,
                        expectedOutput: true,
                        isHidden: true
                    }
                }
            }
        });

        if (!problem) {
            res.status(404).json({ error: "Không tìm thấy bài tập luyện tập này." });
            return;
        }

        // Clean to avoid sending solutions
        const { solutionCodes, ...cleanProblem } = problem;

        res.status(200).json(cleanProblem);
    } catch (err) {
        next(err);
    }
};

// 3. Chạy thử code trên các public testcases (không lưu DB)
export const runPracticeCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { code, language, input } = req.body;

        if (!code || !language) {
            res.status(400).json({ error: "Thiếu mã nguồn hoặc ngôn ngữ lập trình!" });
            return;
        }

        const result = await codeExecutionQueue.pushJob(
            code,
            language as ProgrammingLanguage,
            input || '',
            language === 'CPP' || language === 'C' ? 1000 : 3000
        );

        if (result.status === 'TIMEOUT') {
            res.status(200).json({
                success: false,
                output: `Lỗi: Chương trình chạy quá thời gian giới hạn.`
            });
            return;
        }

        if (result.status === 'ERROR' || result.stderr) {
            res.status(200).json({
                success: false,
                output: result.stderr.trim()
            });
            return;
        }

        res.status(200).json({
            success: true,
            output: result.stdout
        });
    } catch (err: any) {
        res.status(500).json({ error: "Lỗi Server", details: err.message });
    }
};

// 4. Nộp bài và chấm điểm tự động (so sánh Standard I/O với expected output)
export const submitPracticeCode = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string; // ID của PracticeProblem
        const { code } = req.body;
        const language = req.body.language as ProgrammingLanguage;
        const userId = req.user?.id as string;

        if (!userId) {
            res.status(401).json({ error: "Người dùng chưa đăng nhập" });
            return;
        }

        if (!code || !language) {
            res.status(400).json({ error: "Mã nguồn và ngôn ngữ không được để trống!" });
            return;
        }

        const problem = await prisma.practiceProblem.findUnique({
            where: { id },
            include: { testCases: true }
        }) as any;

        if (!problem) {
            res.status(404).json({ error: "Không tìm thấy bài tập này." });
            return;
        }

        // Thực thi song song tất cả các testcase
        let totalRuntime = 0;
        let hasSystemError = false;

        const results = await Promise.all(
            problem.testCases.map(async (tc: any) => {
                try {
                    // Timeout bao gồm: subprocess wrapper overhead (~200ms) + thời gian chạy user code
                    // Python/JS: 5s (3s user code + ~200ms wrapper + buffer)
                    // C/C++: 6s (5s build+run timeout trong sandboxService)
                    const timeoutMs = language === 'CPP' || language === 'C' ? 6000 : 5000;
                    const result = await codeExecutionQueue.pushJob(code, language as ProgrammingLanguage, tc.input, timeoutMs);
                    totalRuntime += result.runtimeMs;

                    if (result.status === 'TIMEOUT') {
                        return {
                            id: tc.id,
                            input: tc.isHidden ? '📌 [Ẩn]' : tc.input,
                            expectedOutput: tc.isHidden ? '📌 [Ẩn]' : tc.expectedOutput,
                            actualOutput: "Lỗi: Quá thời gian thực thi (Timeout)",
                            passed: false,
                            isHidden: tc.isHidden
                        };
                    }

                    const matchOutput = (act: string, exp: string): boolean => {
                        const cleanActual = act.replace(/\r\n/g, '\n').trim();
                        const cleanExpected = exp.replace(/\r\n/g, '\n').trim();
                        if (cleanActual === cleanExpected) return true;
                        if (cleanActual.endsWith(cleanExpected)) {
                            const prefixLen = cleanActual.length - cleanExpected.length;
                            if (prefixLen > 0) {
                                const boundary = cleanActual[prefixLen - 1];
                                if (/\s|:|：|>|\)|\]/.test(boundary)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };
                    const actual = result.stdout || '';
                    const passed = matchOutput(actual, tc.expectedOutput);

                    return {
                        id: tc.id,
                        input: tc.isHidden ? '📌 [Ẩn]' : tc.input,
                        expectedOutput: tc.isHidden ? '📌 [Ẩn]' : tc.expectedOutput,
                        actualOutput: tc.isHidden && !passed ? '❌ Kết quả sai (Ẩn)' : (result.status === 'ERROR' ? result.stderr : actual),
                        passed,
                        isHidden: tc.isHidden
                    };
                } catch (e: any) {
                    hasSystemError = true;
                    return {
                        id: tc.id,
                        input: tc.isHidden ? '📌 [Ẩn]' : tc.input,
                        expectedOutput: tc.isHidden ? '📌 [Ẩn]' : tc.expectedOutput,
                        actualOutput: `Lỗi hệ thống: ${e.message}`,
                        passed: false,
                        isHidden: tc.isHidden
                    };
                }
            })
        );

        if (hasSystemError) {
            res.status(500).json({ error: "Lỗi trong quá trình chấm bài." });
            return;
        }

        const allPassed = results.every(r => r.passed);

        // Tính toán thời gian chạy thực tế trung bình cho các testcase
        const avgRuntime = problem.testCases.length > 0 ? totalRuntime / problem.testCases.length : 15;
        const normalizedRuntime = Math.max(5, avgRuntime);

        // Lưu kết quả nộp bài vào DB
        const submission = await prisma.practiceSubmission.create({
            data: {
                userId,
                problemId: id,
                code,
                language: language as ProgrammingLanguage,
                status: allPassed ? SubmissionStatus.PASSED : SubmissionStatus.FAILED,
                runtime: normalizedRuntime
            }
        });

        // Tính toán beats percentile
        let beats = 100;
        if (allPassed) {
            const totalPassed = await prisma.practiceSubmission.count({
                where: { problemId: id, status: 'PASSED', language: language as ProgrammingLanguage }
            });
            const slowerPassed = await prisma.practiceSubmission.count({
                where: { problemId: id, status: 'PASSED', language: language as ProgrammingLanguage, runtime: { gt: normalizedRuntime } }
            });
            beats = totalPassed > 1 ? (slowerPassed / totalPassed) * 100 : 100.0;
        }

        // Tạo dữ liệu biểu đồ phân phối thời gian chạy
        const allSubmissions = await prisma.practiceSubmission.findMany({
            where: { problemId: id, status: 'PASSED', language: language as ProgrammingLanguage },
            select: { runtime: true }
        });

        const buckets = [
            { label: '10-20ms', min: 10, max: 20, count: 0 },
            { label: '20-30ms', min: 20, max: 30, count: 0 },
            { label: '30-40ms', min: 30, max: 40, count: 0 },
            { label: '40-50ms', min: 40, max: 50, count: 0 },
            { label: '50-60ms', min: 50, max: 60, count: 0 },
            { label: '60-70ms', min: 60, max: 70, count: 0 },
            { label: '70-80ms', min: 70, max: 80, count: 0 },
            { label: '80ms+', min: 80, max: 9999, count: 0 }
        ];

        allSubmissions.forEach(sub => {
            const rt = sub.runtime || 25;
            const bucket = buckets.find(b => rt >= b.min && rt < b.max);
            if (bucket) bucket.count++;
        });

        res.status(200).json({
            success: true,
            allPassed,
            submissionId: submission.id,
            results,
            runtimeMs: parseFloat(normalizedRuntime.toFixed(1)),
            runtimeBeats: parseFloat(beats.toFixed(1)),
            distribution: buckets.map(b => ({ range: b.label, count: b.count }))
        });
    } catch (err) {
        next(err);
    }
};

// 5. Xem lịch sử nộp bài của học viên đối với bài tập luyện tập
export const getPracticeSubmissions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string; // ID của PracticeProblem
        const userId = req.user?.id as string;

        if (!userId) {
            res.status(401).json({ error: "Người dùng chưa đăng nhập" });
            return;
        }

        const submissions = await prisma.practiceSubmission.findMany({
            where: {
                userId,
                problemId: id as string
            },
            orderBy: {
                submittedAt: 'desc'
            },
            take: 20
        });

        res.status(200).json(submissions);
    } catch (err) {
        next(err);
    }
};

// 6. Lấy Bảng xếp hạng điểm tích lũy (Leaderboard)
export const getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Lấy toàn bộ lượt nộp thành công sắp xếp theo thời gian nộp tăng dần
        const passedSubmissions = await prisma.practiceSubmission.findMany({
            where: { status: 'PASSED' },
            include: {
                problem: {
                    select: { difficulty: true }
                }
            },
            orderBy: { submittedAt: 'asc' }
        });

        // Map lưu trữ điểm và thời điểm giải bài mới của từng user
        // userStats: { [userId]: { score: number, lastSolvedAt: Date, solvedProblems: Set<string> } }
        const userStats: { [userId: string]: { score: number; lastSolvedAt: Date; solvedProblems: Set<string> } } = {};

        passedSubmissions.forEach(sub => {
            const { userId, problemId, problem, submittedAt } = sub;

            if (!userStats[userId]) {
                userStats[userId] = {
                    score: 0,
                    lastSolvedAt: submittedAt,
                    solvedProblems: new Set<string>()
                };
            }

            // Nếu đây là lần đầu tiên user giải bài tập này
            if (!userStats[userId].solvedProblems.has(problemId)) {
                userStats[userId].solvedProblems.add(problemId);

                // Quy tắc cộng điểm: Easy = 10, Medium = 30, Hard = 50
                let points = 10;
                if (problem.difficulty === 'MEDIUM') points = 30;
                else if (problem.difficulty === 'HARD') points = 50;

                userStats[userId].score += points;
                userStats[userId].lastSolvedAt = submittedAt;
            }
        });

        // Chuyển map sang danh sách và sắp xếp
        const statsList = Object.keys(userStats).map(userId => ({
            userId,
            score: userStats[userId].score,
            lastSolvedAt: userStats[userId].lastSolvedAt,
            solvedCount: userStats[userId].solvedProblems.size
        }));

        // Sắp xếp:
        // 1. Điểm (score) giảm dần
        // 2. Thời điểm giải bài thành công cuối cùng (lastSolvedAt) tăng dần (ai đạt mốc điểm trước đứng trước)
        statsList.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.lastSolvedAt.getTime() - b.lastSolvedAt.getTime();
        });

        // Lấy thông tin user (username, avatarUrl) cho top 50
        const topStatsList = statsList.slice(0, 50);
        const userIds = topStatsList.map(s => s.userId);

        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                username: true,
                avatarUrl: true
            }
        });

        const leaderboard = topStatsList.map((stat, idx) => {
            const user = users.find(u => u.id === stat.userId);
            return {
                rank: idx + 1,
                username: user?.username || 'Ẩn danh',
                avatarUrl: user?.avatarUrl || null,
                score: stat.score,
                solvedCount: stat.solvedCount,
                lastSolvedAt: stat.lastSolvedAt
            };
        });

        res.status(200).json(leaderboard);
    } catch (err) {
        next(err);
    }
};
