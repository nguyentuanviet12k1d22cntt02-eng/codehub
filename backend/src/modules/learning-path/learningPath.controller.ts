import { Response } from 'express';
import { sanitizeLegacy } from '../adaptive/adaptiveEvidence';
import { prisma } from '../../infrastructure/database/prisma';
import { AuthenticatedRequest } from '../../shared/middleware/auth';
import { codeExecutionQueue } from '../../infrastructure/queue/queueService';
import { getEvidenceBasedUserMastery } from '../recommendations/recommendationController';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

const generatedPathValidationError = (value: any): string | null => {
    if (!value || typeof value !== 'object') return 'Thiếu dữ liệu lộ trình';
    if (typeof value.path_title !== 'string' || !value.path_title.trim()) return 'Thiếu tiêu đề lộ trình';
    if (!Array.isArray(value.target_skills) || value.target_skills.length === 0) return 'Thiếu kỹ năng mục tiêu';
    if (!Number.isFinite(Number(value.pal_net_avg_score)) || Number(value.pal_net_avg_score) < 0 || Number(value.pal_net_avg_score) > 1) return 'Điểm hồ sơ không hợp lệ';
    if (!Array.isArray(value.lessons) || value.lessons.length === 0) return 'Lộ trình không có bài học';
    for (const lesson of value.lessons) {
        if (!Number.isInteger(Number(lesson?.order_index)) || Number(lesson.order_index) < 1) return 'Thứ tự bài học không hợp lệ';
        if (typeof lesson?.title !== 'string' || !lesson.title.trim()) return 'Bài học thiếu tiêu đề';
        if (typeof lesson?.target_skill_id !== 'string' || !lesson.target_skill_id.trim()) return 'Bài học thiếu kỹ năng mục tiêu';
        if (typeof lesson?.theory_content !== 'string' || !lesson.theory_content.trim()) return 'Bài học thiếu nội dung lý thuyết';
        if (lesson.exercise) {
            if (typeof lesson.exercise.title !== 'string' || !lesson.exercise.title.trim()) return 'Bài tập thiếu tiêu đề';
            if (!['EASY', 'MEDIUM', 'HARD'].includes(String(lesson.exercise.difficulty))) return 'Độ khó bài tập không hợp lệ';
            if (typeof lesson.exercise.problem_description !== 'string' || !lesson.exercise.problem_description.trim()) return 'Bài tập thiếu đề bài';
            if (typeof lesson.exercise.starter_code !== 'string' || typeof lesson.exercise.solution_code !== 'string') return 'Bài tập thiếu mã nguồn kiểm định';
            if (!Array.isArray(lesson.exercise.test_cases) || lesson.exercise.test_cases.length === 0) return 'Bài tập thiếu bộ test';
        }
        for (const quiz of lesson.quizzes || []) {
            if (!['A', 'B', 'C', 'D'].includes(String(quiz?.correct_option))) return 'Đáp án trắc nghiệm không hợp lệ';
        }
    }
    return null;
};

// 1. POST /api/learning-path/generate
export const generatePersonalizedPath = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Chưa xác thực người dùng!' });
            return;
        }

        const { archetype } = req.body;

        // Call AI Microservice
        let aiData: any = null;
        try {
            const aiRes = await fetch(`${AI_SERVICE_URL}/pal-net/generate-path`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    archetype: archetype || 'Persister'
                })
            });
            if (aiRes.ok) {
                const resJson: any = await aiRes.json();
                aiData = resJson?.data;
            }
        } catch (e) {
            console.error('Error calling AI Service /pal-net/generate-path:', e);
        }

        if (!aiData) {
            res.status(503).json({ success: false, error: 'AI_PATH_PROVIDER_UNAVAILABLE: Chưa có lộ trình hợp lệ để phát hành.' });
            return;
        }
        const validationError = generatedPathValidationError(aiData);
        if (validationError) {
            res.status(502).json({ success: false, error: `AI_PATH_SCHEMA_INVALID: ${validationError}` });
            return;
        }

        // Save to Database via Prisma
        const newPath = await prisma.personalizedPath.create({
            data: {
                userId,
                title: aiData.path_title,
                description: aiData.description || null,
                targetSkills: aiData.target_skills,
                palNetAvgScore: Number(aiData.pal_net_avg_score),
                lessons: {
                    create: (aiData.lessons || []).map((l: any) => ({
                        orderIndex: l.order_index,
                        title: l.title,
                        targetSkillId: l.target_skill_id,
                        theoryContent: l.theory_content,
                        quizzes: {
                            create: (l.quizzes || []).map((q: any) => ({
                                question: q.question,
                                optionA: q.option_a,
                                optionB: q.option_b,
                                optionC: q.option_c,
                                optionD: q.option_d,
                                correctOption: q.correct_option as any,
                                explanation: q.explanation
                            }))
                        },
                        ...(l.exercise ? {
                            exercise: {
                                create: {
                                    title: l.exercise.title,
                                    difficulty: l.exercise.difficulty as any,
                                    problemDescription: l.exercise.problem_description,
                                    starterCode: l.exercise.starter_code,
                                    solutionCode: l.exercise.solution_code,
                                    language: 'PYTHON',
                                    qcStatus: 'VERIFIED',
                                    testCases: {
                                        create: (l.exercise.test_cases || []).map((tc: any) => ({
                                            input: String(tc.input),
                                            expectedOutput: String(tc.expected_output),
                                            isHidden: !!tc.is_hidden
                                        }))
                                    }
                                }
                            }
                        } : {})
                    }))
                }
            },
            include: {
                lessons: {
                    include: {
                        quizzes: true,
                        exercise: {
                            include: {
                                testCases: true
                            }
                        }
                    }
                }
            }
        });

        res.status(200).json({ success: true, data: newPath });
    } catch (error: any) {
        console.error('Error generating personalized path:', error);
        res.status(500).json({ success: false, error: error.message || 'Lỗi hệ thống khi sinh lộ trình' });
    }
};

// 2. GET /api/learning-path/my-paths
export const getMyPaths = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Chưa xác thực người dùng!' });
            return;
        }

        const paths = await prisma.personalizedPath.findMany({
            where: { userId },
            include: {
                lessons: {
                    select: {
                        id: true,
                        title: true,
                        isCompleted: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, data: paths });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. GET /api/learning-path/:pathId
export const getPathById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const pathIdStr = String(req.params.pathId);
        const userId = req.user?.id;

        const path = await prisma.personalizedPath.findUnique({
            where: { id: pathIdStr },
            include: {
                lessons: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        quizzes: true,
                        exercise: {
                            include: {
                                testCases: {
                                    where: { isHidden: false }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!path || path.userId !== userId) {
            res.status(404).json({ success: false, error: 'Không tìm thấy lộ trình học!' });
            return;
        }

        res.status(200).json({ success: true, data: sanitizeLegacy(path) });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. POST /api/learning-path/submit-quiz
export const submitQuizAnswer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { quizId, selectedOption } = req.body;

        const quiz = await prisma.personalizedQuiz.findUnique({
            where: { id: String(quizId) }
        });

        if (!quiz) {
            res.status(404).json({ success: false, error: 'Câu hỏi không tồn tại!' });
            return;
        }

        const isCorrect = quiz.correctOption === selectedOption;

        res.status(200).json({
            success: true,
            isCorrect,
            correctOption: quiz.correctOption,
            explanation: quiz.explanation
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 5. POST /api/learning-path/submit-exercise
export const submitExerciseCode = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { exerciseId, code } = req.body;
        const userId = req.user?.id;

        if (!exerciseId || !code) {
            res.status(400).json({ success: false, error: 'Thiếu mã nguồn hoặc bài tập!' });
            return;
        }

        const exercise = await prisma.personalizedExercise.findUnique({
            where: { id: String(exerciseId) },
            include: { testCases: true, lesson: true }
        });

        if (!exercise) {
            res.status(404).json({ success: false, error: 'Bài tập không tồn tại!' });
            return;
        }

        // Run Docker Sandbox Execution via Code Execution Queue
        let passedCases = 0;
        const totalCases = exercise.testCases.length;
        const results = [];

        const rawLang = String(exercise.language || '').toUpperCase();
        const isCpp = rawLang === 'CPP' || rawLang.includes('C++') || /#include\s*<|std::/i.test(code);
        const isJs = !isCpp && (rawLang === 'JAVASCRIPT' || rawLang.includes('JS') || /console\.log|function\s*\(|let\s+|const\s+/i.test(code));
        const execLanguage: 'CPP' | 'JAVASCRIPT' | 'PYTHON' = isCpp ? 'CPP' : (isJs ? 'JAVASCRIPT' : 'PYTHON');

        for (const tc of exercise.testCases) {
            const rawInput = tc.input ? tc.input.trim() : '';
            const expectedOut = (tc.expectedOutput || '').trim();

            let codeToRun = code;

            if (execLanguage === 'CPP') {
                // Nếu code chưa có main(), tự động bọc main caller
                if (!code.includes('main(')) {
                    const fnMatch = code.match(/(?:int|void|std::string|string|double|float|bool|auto)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/);
                    const fnName = fnMatch ? fnMatch[1] : 'solution';
                    const paramsStr = fnMatch ? fnMatch[2].trim() : '';
                    const paramCount = paramsStr ? paramsStr.split(',').length : 0;

                    codeToRun = `
${code}

#include <iostream>
#include <sstream>
#include <string>

int main() {
    std::string rawInput = ${JSON.stringify(rawInput)};
    std::stringstream ss(rawInput);
    ${paramCount >= 2 
        ? 'int a = 0, b = 0; ss >> a >> b; std::cout << ' + fnName + '(a, b);' 
        : (paramCount === 0 
            ? 'std::cout << ' + fnName + '();' 
            : 'int a = 0; ss >> a; std::cout << ' + fnName + '(a);')}
    return 0;
}
`;
                }
            } else if (execLanguage === 'JAVASCRIPT') {
                // Tự động phát hiện hàm cần gọi và bọc harness thực thi đa tham số
                codeToRun = `
${code}

// Injected Smart Harness for JS Unit Testing
(function __runner() {
    let targetFn = null;

    // 1. Quét tìm danh sách các hàm được định nghĩa trong mã nguồn người học
    const funcRegex = /(?:function\\s+([a-zA-Z0-9_$]+)|(?:const|let|var)\\s+([a-zA-Z0-9_$]+)\\s*=\\s*(?:function|\\([^)]*\\)\\s*=>|[a-zA-Z0-9_$]+\\s*=>))/g;
    const candidates = [];
    let m;
    const codeStr = ${JSON.stringify(code)};
    while ((m = funcRegex.exec(codeStr)) !== null) {
        const fnName = m[1] || m[2];
        if (fnName && fnName !== '__runner') {
            try {
                const fnObj = eval(fnName);
                if (typeof fnObj === 'function') {
                    candidates.push({ name: fnName, fn: fnObj });
                }
            } catch (e) {}
        }
    }

    if (candidates.length > 0) {
        // Ưu tiên hàm tên 'solution' nếu có, nếu không lấy hàm cuối cùng được khai báo
        const pref = candidates.find(c => c.name === 'solution') || candidates[candidates.length - 1];
        targetFn = pref.fn;
    }

    // Nếu không tìm thấy hàm nào (ví dụ code dạng script thuần túy), thoát để script tự chạy
    if (!targetFn) return;

    const raw = ${JSON.stringify(rawInput)};
    let args = [];
    if (raw && typeof raw === 'string' && raw.trim().length > 0) {
        let trimmed = raw.trim();
        let norm = trimmed
            .replace(/\\bTrue\\b/g, 'true')
            .replace(/\\bFalse\\b/g, 'false')
            .replace(/\\bNone\\b/g, 'null');

        if ((norm.startsWith('(') && norm.endsWith(')')) || (norm.startsWith('[') && norm.endsWith(']'))) {
            norm = norm.slice(1, -1).trim();
        }

        try {
            args = eval('[' + norm + ']');
            if (!Array.isArray(args)) args = [args];
        } catch (e1) {
            try {
                const p = JSON.parse(trimmed);
                args = Array.isArray(p) ? p : [p];
            } catch (e2) {
                if (trimmed.includes(',')) {
                    args = trimmed.split(',').map(s => {
                        const t = s.trim();
                        if (t === 'true') return true;
                        if (t === 'false') return false;
                        if (!isNaN(t) && t !== '') return Number(t);
                        return t.replace(/^["']|["']$/g, '');
                    });
                } else {
                    args = [trimmed];
                }
            }
        }
    }

    try {
        const out = targetFn(...args);
        if (out !== undefined && out !== null) {
            if (typeof out === 'object') {
                console.log(JSON.stringify(out));
            } else {
                console.log(out);
            }
        }
    } catch (err) {
        console.error(err);
    }
})();
`;
            } else {
                // Python: Sử dụng execution harness linh hoạt Function & Class OOP
                if (rawInput) {
                    codeToRun = `
import sys
import ast
import inspect
import json

${code}

if __name__ == '__main__':
    try:
        raw_val = ${JSON.stringify(rawInput)}
        
        is_literal = False
        parsed_arg = None
        try:
            parsed_arg = ast.literal_eval(raw_val)
            is_literal = True
        except Exception:
            is_literal = False

        if is_literal:
            custom_funcs = [
                f for f in list(globals().keys())
                if callable(globals()[f]) and not f.startswith('__') and f not in ['sys', 'ast', 'inspect', 'json']
            ]
            if custom_funcs:
                target_fn = globals()[custom_funcs[-1]]
                res = None
                
                if inspect.isclass(target_fn):
                    init_sig = inspect.signature(target_fn.__init__)
                    num_params = len([p for p in init_sig.parameters.values() if p.name != 'self'])
                    if isinstance(parsed_arg, tuple) and num_params > 1 and len(parsed_arg) == num_params:
                        inst = target_fn(*parsed_arg)
                    else:
                        inst = target_fn(parsed_arg)
                        
                    methods = [m for m in dir(inst) if callable(getattr(inst, m)) and not m.startswith('__')]
                    called = False
                    for m in methods:
                        try:
                            m_val = getattr(inst, m)()
                            if m_val is not None:
                                res = m_val
                                called = True
                                break
                        except Exception:
                            pass
                    if not called:
                        res = inst
                else:
                    sig = inspect.signature(target_fn)
                    num_params = len(sig.parameters)
                    if isinstance(parsed_arg, tuple) and num_params > 1 and len(parsed_arg) == num_params:
                        res = target_fn(*parsed_arg)
                    else:
                        res = target_fn(parsed_arg)

                if res is not None:
                    print(res)
            else:
                try:
                    res = eval(raw_val)
                    if res is not None:
                        print(res)
                except Exception:
                    exec(raw_val)
        else:
            # Script statement hoặc gán biến (ví dụ: s = Student(...); print(...))
            local_scope = dict()
            custom_funcs = [
                f for f in list(globals().keys())
                if callable(globals()[f]) and not f.startswith('__') and f not in ['sys', 'ast', 'inspect', 'json']
            ]
            if custom_funcs and '=' in raw_val and ('\\n' in raw_val or ';' in raw_val):
                target_fn = globals()[custom_funcs[-1]]
                exec(raw_val, globals(), local_scope)
                sig = inspect.signature(target_fn)
                kwargs = dict((k, local_scope[k]) for k in sig.parameters.keys() if k in local_scope)
                if len(kwargs) == len(sig.parameters):
                    res = target_fn(**kwargs)
                else:
                    res = target_fn(*list(local_scope.values()))
                if res is not None:
                    print(res)
            else:
                try:
                    exec(raw_val, globals(), local_scope)
                except Exception:
                    res = eval(raw_val, globals(), local_scope)
                    if res is not None:
                        print(res)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
`;
                }
            }

            const jobRes = await codeExecutionQueue.pushJob(codeToRun, execLanguage, rawInput, 5000);
            const actualOut = (jobRes.stdout || '').trim();
            const errOut = (jobRes.stderr || '').trim();

            const checkMatch = (act: string, exp: string): boolean => {
                if (act === exp) return true;
                const normAct = act.replace(/\r\n/g, '\n').trim();
                const normExp = exp.replace(/\r\n/g, '\n').trim();
                if (normAct === normExp) return true;
                if (normExp.toLowerCase() === 'none' && (normAct === 'None' || normAct === '')) return true;
                if (normExp === '' && normAct === '') return true;

                // 1. So khớp sau khi chuẩn hóa dấu nháy đơn / kép và khoảng trắng
                const normalizeQuotes = (s: string) => s
                    .replace(/["']/g, '"')
                    .replace(/\s+/g, ' ')
                    .trim();
                if (normalizeQuotes(normAct) === normalizeQuotes(normExp)) return true;

                // 2. So sánh cấu trúc dữ liệu Python (hỗ trợ cả Tuple, List, Dict, Boolean, None)
                try {
                    const pyToJson = (s: string) => s
                        .trim()
                        .replace(/\(/g, '[')
                        .replace(/\)/g, ']')
                        .replace(/'/g, '"')
                        .replace(/\bTrue\b/g, 'true')
                        .replace(/\bFalse\b/g, 'false')
                        .replace(/\bNone\b/g, 'null');
                    const parsedAct = JSON.parse(pyToJson(normAct));
                    const parsedExp = JSON.parse(pyToJson(normExp));
                    if (JSON.stringify(parsedAct) === JSON.stringify(parsedExp)) return true;
                } catch {}

                return false;
            };

            const isPassed = jobRes.status === 'SUCCESS' && checkMatch(actualOut, expectedOut);
            if (isPassed) passedCases++;

            results.push({
                testCaseId: tc.id,
                passed: isPassed,
                input: tc.isHidden ? 'Hidden' : tc.input,
                expectedOutput: tc.isHidden ? 'Hidden' : tc.expectedOutput,
                actualOutput: tc.isHidden ? (isPassed ? 'Passed' : 'Mismatch') : actualOut,
                errorMessage: errOut || undefined
            });
        }

        const isAllPassed = totalCases > 0 && passedCases === totalCases;

        // If passed, mark lesson as completed
        if (isAllPassed && exercise.lessonId) {
            await prisma.personalizedLesson.update({
                where: { id: exercise.lessonId },
                data: { isCompleted: true }
            });
        }

        // Closed Feedback Loop: Call AI Service /pal-net/submission-feedback
        let adaptiveFeedback: any = null;
        try {
            const conceptId = exercise.lesson?.targetSkillId || 'PY-BASICS-01';
            const firstError = results.find(r => !r.passed)?.errorMessage || '';
            const statusStr = isAllPassed 
                ? 'PASSED' 
                : (firstError.includes('Lỗi:') ? 'RUNTIME_ERROR' : 'WRONG_ANSWER');

            const fbRes = await fetch(`${AI_SERVICE_URL}/pal-net/submission-feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submission_id: `sub_${Date.now()}`,
                    user_id: userId,
                    exercise_id: exercise.id,
                    concept_id: conceptId,
                    status: statusStr,
                    passed_count: passedCases,
                    total_count: totalCases,
                    test_results: results.map(r => ({
                        id: r.testCaseId,
                        input: r.input,
                        expected: r.expectedOutput,
                        actual: r.actualOutput,
                        passed: r.passed,
                        error: r.errorMessage
                    })),
                    code,
                    runtime: (exercise.language || 'PYTHON').toLowerCase(),
                    raw_error: firstError || null
                })
            });
            if (fbRes.ok) {
                const fbJson: any = await fbRes.json();
                adaptiveFeedback = fbJson?.data;
            }
        } catch (fbErr) {
            console.warn('[Adaptive Feedback Loop Warning]:', fbErr);
        }

        res.status(200).json({
            success: true,
            isPassed: isAllPassed,
            score: totalCases > 0 ? Math.round((passedCases / totalCases) * 100) : 100,
            passedCases,
            totalCases,
            results,
            adaptiveFeedback
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 6. POST /api/learning-path/chat/start
export const startChatSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Chưa xác thực người dùng!' });
            return;
        }

        const { goal, target_concept_id, language } = req.body;
        const initialGoal = goal || 'Tôi muốn học lập trình cá nhân hóa';

        // 1. Create DB Session
        const session = await prisma.pathChatSession.create({
            data: {
                userId,
                initialGoal,
                messages: {
                    create: {
                        sender: 'USER',
                        content: initialGoal
                    }
                }
            },
            include: { messages: true }
        });

        // 2. Fetch user mastery profile
        let userMastery: Record<string, number> = {};
        try {
            const masteryRes = await getEvidenceBasedUserMastery(userId);
            userMastery = masteryRes?.mastery?.['Evidence-Based'] || {};
        } catch (e) {
            console.warn('Could not load user mastery:', e);
        }

        // 3. Call AI Service Multi-Agent Endpoint
        let aiReplyData: any = null;
        try {
            const aiRes = await fetch(`${AI_SERVICE_URL}/pal-net/adaptive-tutor-agent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    session_id: session.id,
                    messages: [{ sender: 'USER', content: initialGoal }],
                    user_mastery: userMastery,
                    target_concept_id: target_concept_id || null,
                    language: language || null
                })
            });
            if (aiRes.ok) {
                const json: any = await aiRes.json();
                aiReplyData = json?.data;
            }
        } catch (e) {
            console.error('AI Service adaptive-tutor-agent error:', e);
        }

        const aiReplyContent = cleanChineseArtifacts(aiReplyData?.reply || 'Chào bạn! PAL-Net Engine đã sẵn sàng đồng hành cùng bạn. Bạn muốn kiểm tra điểm yếu hay bắt đầu rèn luyện chủ đề nào?');
        const suggestedOptions = aiReplyData?.suggested_options || [
            '🔍 Tôi đang bị yếu phần nào nhất của Python?',
            '🎯 Hãy tạo bài tập rèn luyện cho phần tôi yếu nhất',
            '📚 Rèn luyện cấu trúc Dictionary & Key-Value'
        ];

        // 4. Save AI message with Multi-Agent traces and exercise
        const aiMessage = await prisma.pathChatMessage.create({
            data: {
                sessionId: session.id,
                sender: 'AI_TUTOR',
                content: aiReplyContent,
                metadata: {
                    intent: aiReplyData?.intent || 'GENERAL_CHAT',
                    agentTraces: aiReplyData?.agent_traces || [],
                    exercise: aiReplyData?.exercise ? sanitizeExerciseObj(aiReplyData.exercise) : null,
                    suggestedOptions,
                    step: aiReplyData?.exercise ? 'EXERCISE_READY' : 'CHAT'
                }
            }
        });

        res.status(200).json({
            success: true,
            sessionId: session.id,
            messages: [session.messages[0], aiMessage]
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 6b. POST /api/learning-path/chat/start-stream (Real-time SSE Multi-Agent Stream)
export const startChatSessionStream = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Chưa xác thực người dùng!' });
            return;
        }

        const { goal, target_concept_id, language } = req.body;
        const initialGoal = goal || 'Tôi muốn học lập trình cá nhân hóa';

        // 1. Create DB Session
        const session = await prisma.pathChatSession.create({
            data: {
                userId,
                initialGoal,
                messages: {
                    create: {
                        sender: 'USER',
                        content: initialGoal
                    }
                }
            },
            include: { messages: true }
        });

        // 2. Load user mastery
        let userMastery: Record<string, number> = {};
        try {
            const masteryRes = await getEvidenceBasedUserMastery(userId);
            userMastery = masteryRes?.mastery?.['Evidence-Based'] || {};
        } catch (e) {
            console.warn('Could not load user mastery:', e);
        }

        // Set SSE Headers
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        (res as any).flushHeaders?.();

        res.write(`data: ${JSON.stringify({ type: 'session_created', sessionId: session.id, userMessage: session.messages[0] })}\n\n`);

        // Connect to AI Service stream
        const aiStreamRes = await fetch(`${AI_SERVICE_URL}/pal-net/adaptive-tutor-agent/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                session_id: session.id,
                messages: [{ sender: 'USER', content: initialGoal }],
                user_mastery: userMastery,
                target_concept_id: target_concept_id || null,
                language: language || null
            })
        });

        if (!aiStreamRes.ok || !aiStreamRes.body) {
            throw new Error(`AI Service stream error: ${aiStreamRes.statusText}`);
        }

        const reader = aiStreamRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let finalData: any = null;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split('\n\n');
            buffer = parts.pop() || '';

            for (const part of parts) {
                const trimmed = part.trim();
                if (!trimmed.startsWith('data: ')) continue;
                try {
                    const json = JSON.parse(trimmed.slice(6));
                    if (json.type === 'agent_step') {
                        res.write(`data: ${JSON.stringify(json)}\n\n`);
                    } else if (json.type === 'complete') {
                        finalData = json.data;
                    }
                } catch (pe) {
                    // ignore JSON chunk slice warning
                }
            }
        }

        const aiReplyContent = cleanChineseArtifacts(finalData?.reply || 'Chào bạn! PAL-Net Engine đã sẵn sàng đồng hành cùng bạn.');
        const cleanExercise = finalData?.exercise ? sanitizeExerciseObj(finalData.exercise) : null;
        const suggestedOptions = finalData?.suggested_options || [
            '🔍 Tôi đang bị yếu phần nào nhất của Python?',
            '🎯 Hãy tạo bài tập rèn luyện cho phần tôi yếu nhất',
            '📚 Rèn luyện cấu trúc Dictionary & Key-Value'
        ];

        const aiMessage = await prisma.pathChatMessage.create({
            data: {
                sessionId: session.id,
                sender: 'AI_TUTOR',
                content: aiReplyContent,
                metadata: {
                    intent: finalData?.intent || 'GENERAL_CHAT',
                    agentTraces: finalData?.agent_traces || [],
                    exercise: cleanExercise,
                    suggestedOptions,
                    step: cleanExercise ? 'EXERCISE_READY' : 'CHAT'
                }
            }
        });

        res.write(`data: ${JSON.stringify({
            type: 'complete',
            sessionId: session.id,
            messages: [session.messages[0], aiMessage]
        })}\n\n`);

        res.end();
    } catch (error: any) {
        console.error('startChatSessionStream error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
        res.end();
    }
};

// 7. POST /api/learning-path/chat/reply
export const replyChatMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { sessionId, content, target_concept_id, language } = req.body;
        const userId = req.user?.id;

        if (!sessionId || !content) {
            res.status(400).json({ success: false, error: 'Thiếu session ID hoặc nội dung tin nhắn!' });
            return;
        }

        const session = await prisma.pathChatSession.findUnique({
            where: { id: String(sessionId) },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!session || session.userId !== userId) {
            res.status(404).json({ success: false, error: 'Không tìm thấy phiên trò chuyện!' });
            return;
        }

        // Save User Message
        const userMsg = await prisma.pathChatMessage.create({
            data: {
                sessionId: session.id,
                sender: 'USER',
                content
            }
        });

        const updatedHistory = [...session.messages, userMsg].map(m => ({
            sender: m.sender,
            content: m.content
        }));

        // Load user mastery profile
        let userMastery: Record<string, number> = {};
        try {
            const masteryRes = await getEvidenceBasedUserMastery(userId);
            userMastery = masteryRes?.mastery?.['Evidence-Based'] || {};
        } catch (e) {
            console.warn('Could not load user mastery:', e);
        }

        // Call AI Service Adaptive Multi-Agent
        let aiReplyData: any = null;
        try {
            const aiRes = await fetch(`${AI_SERVICE_URL}/pal-net/adaptive-tutor-agent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    session_id: session.id,
                    messages: updatedHistory,
                    user_mastery: userMastery,
                    target_concept_id: target_concept_id || null,
                    language: language || null
                })
            });
            if (aiRes.ok) {
                const json: any = await aiRes.json();
                aiReplyData = json?.data;
            }
        } catch (e) {
            console.error('AI Service adaptive-tutor-agent error:', e);
        }

        const aiReplyContent = cleanChineseArtifacts(aiReplyData?.reply || 'Tôi đã xử lý yêu cầu của bạn.');
        const cleanExercise = aiReplyData?.exercise ? sanitizeExerciseObj(aiReplyData.exercise) : null;
        
        // Save AI Message with Multi-Agent metadata
        const aiMsg = await prisma.pathChatMessage.create({
            data: {
                sessionId: session.id,
                sender: 'AI_TUTOR',
                content: aiReplyContent,
                metadata: {
                    intent: aiReplyData?.intent || 'GENERAL_CHAT',
                    agentTraces: aiReplyData?.agent_traces || [],
                    exercise: cleanExercise,
                    suggestedOptions: aiReplyData?.suggested_options || [],
                    step: cleanExercise ? 'EXERCISE_READY' : 'CHAT'
                }
            }
        });

        res.status(200).json({
            success: true,
            userMessage: userMsg,
            aiMessage: aiMsg,
            intent: aiReplyData?.intent,
            agentTraces: aiReplyData?.agent_traces || [],
            exercise: aiReplyData?.exercise || null
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 7b. POST /api/learning-path/chat/reply-stream (Real-time SSE Multi-Agent Stream)
export const replyChatMessageStream = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { sessionId, content, target_concept_id, language } = req.body;
        const userId = req.user?.id;

        if (!sessionId || !content) {
            res.status(400).json({ success: false, error: 'Thiếu session ID hoặc nội dung tin nhắn!' });
            return;
        }

        const session = await prisma.pathChatSession.findUnique({
            where: { id: String(sessionId) },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!session || session.userId !== userId) {
            res.status(404).json({ success: false, error: 'Không tìm thấy phiên trò chuyện!' });
            return;
        }

        // Save User Message
        const userMsg = await prisma.pathChatMessage.create({
            data: {
                sessionId: session.id,
                sender: 'USER',
                content
            }
        });

        const updatedHistory = [...session.messages, userMsg].map(m => ({
            sender: m.sender,
            content: m.content
        }));

        let userMastery: Record<string, number> = {};
        try {
            const masteryRes = await getEvidenceBasedUserMastery(userId);
            userMastery = masteryRes?.mastery?.['Evidence-Based'] || {};
        } catch (e) {
            console.warn('Could not load user mastery:', e);
        }

        // Set SSE Headers
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        (res as any).flushHeaders?.();

        res.write(`data: ${JSON.stringify({ type: 'user_message_saved', userMessage: userMsg })}\n\n`);

        // Connect to AI Service stream
        const aiStreamRes = await fetch(`${AI_SERVICE_URL}/pal-net/adaptive-tutor-agent/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                session_id: session.id,
                messages: updatedHistory,
                user_mastery: userMastery,
                target_concept_id: target_concept_id || null,
                language: language || null
            })
        });

        if (!aiStreamRes.ok || !aiStreamRes.body) {
            throw new Error(`AI Service stream error: ${aiStreamRes.statusText}`);
        }

        const reader = aiStreamRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let finalData: any = null;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split('\n\n');
            buffer = parts.pop() || '';

            for (const part of parts) {
                const trimmed = part.trim();
                if (!trimmed.startsWith('data: ')) continue;
                try {
                    const json = JSON.parse(trimmed.slice(6));
                    if (json.type === 'agent_step') {
                        res.write(`data: ${JSON.stringify(json)}\n\n`);
                    } else if (json.type === 'complete') {
                        finalData = json.data;
                    }
                } catch (pe) {
                    // ignore JSON chunk slice warning
                }
            }
        }

        const aiReplyContent = cleanChineseArtifacts(finalData?.reply || 'Tôi đã xử lý yêu cầu của bạn.');
        const cleanExercise = finalData?.exercise ? sanitizeExerciseObj(finalData.exercise) : null;

        const aiMsg = await prisma.pathChatMessage.create({
            data: {
                sessionId: session.id,
                sender: 'AI_TUTOR',
                content: aiReplyContent,
                metadata: {
                    intent: finalData?.intent || 'GENERAL_CHAT',
                    agentTraces: finalData?.agent_traces || [],
                    exercise: cleanExercise,
                    suggestedOptions: finalData?.suggested_options || [],
                    step: cleanExercise ? 'EXERCISE_READY' : 'CHAT'
                }
            }
        });

        res.write(`data: ${JSON.stringify({
            type: 'complete',
            userMessage: userMsg,
            aiMessage: aiMsg,
            intent: finalData?.intent,
            agentTraces: finalData?.agent_traces || [],
            exercise: cleanExercise
        })}\n\n`);

        res.end();
    } catch (error: any) {
        console.error('replyChatMessageStream error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
        res.end();
    }
};

// 8. POST /api/learning-path/chat/confirm
export const confirmAndBuildPath = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { sessionId } = req.body;
        const userId = req.user?.id;

        if (!sessionId) {
            res.status(400).json({ success: false, error: 'Thiếu session ID!' });
            return;
        }

        const session = await prisma.pathChatSession.findUnique({
            where: { id: String(sessionId) }
        });

        if (!session || session.userId !== userId) {
            res.status(404).json({ success: false, error: 'Không tìm thấy phiên trò chuyện!' });
            return;
        }

        // Call generatePersonalizedPath logic
        let aiData: any = null;
        try {
            const aiRes = await fetch(`${AI_SERVICE_URL}/pal-net/generate-path`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    archetype: 'Persister',
                    topic: session.initialGoal
                })
            });
            if (aiRes.ok) {
                const data = await aiRes.json();
                aiData = data.data;
                console.log('🚀 [EXPRESS BACKEND RECEIVED 100% DYNAMIC AI PATH FROM GEMINI]:', JSON.stringify(aiData, null, 2));
            } else {
                const errText = await aiRes.text();
                console.error('AI Service Error:', errText);
                res.status(500).json({ success: false, error: 'AI Service không thể kết nối hoặc gọi Gemini API thất bại.' });
                return;
            }
        } catch (e) {
            console.error('Error calling AI Service /pal-net/generate-path:', e);
        }

        if (!aiData) {
            res.status(503).json({ success: false, error: 'AI_PATH_PROVIDER_UNAVAILABLE: Chưa có lộ trình hợp lệ để phát hành.' });
            return;
        }
        const validationError = generatedPathValidationError(aiData);
        if (validationError) {
            res.status(502).json({ success: false, error: `AI_PATH_SCHEMA_INVALID: ${validationError}` });
            return;
        }

        const newPath = await prisma.personalizedPath.create({
            data: {
                userId,
                title: aiData.path_title,
                description: aiData.description || null,
                targetSkills: aiData.target_skills,
                palNetAvgScore: Number(aiData.pal_net_avg_score),
                lessons: {
                    create: (aiData.lessons || []).map((l: any) => ({
                        orderIndex: l.order_index,
                        title: l.title,
                        targetSkillId: l.target_skill_id,
                        theoryContent: l.theory_content,
                        quizzes: {
                            create: (l.quizzes || []).map((q: any) => ({
                                question: q.question,
                                optionA: q.option_a,
                                optionB: q.option_b,
                                optionC: q.option_c,
                                optionD: q.option_d,
                                correctOption: q.correct_option as any,
                                explanation: q.explanation
                            }))
                        },
                        ...(l.exercise ? {
                            exercise: {
                                create: {
                                    title: l.exercise.title,
                                    difficulty: l.exercise.difficulty as any,
                                    problemDescription: l.exercise.problem_description,
                                    starterCode: l.exercise.starter_code,
                                    solutionCode: l.exercise.solution_code,
                                    language: 'PYTHON',
                                    qcStatus: 'VERIFIED',
                                    testCases: {
                                        create: (l.exercise.test_cases || []).map((tc: any) => ({
                                            input: String(tc.input),
                                            expectedOutput: String(tc.expected_output),
                                            isHidden: !!tc.is_hidden
                                        }))
                                    }
                                }
                            }
                        } : {})
                    }))
                }
            },
            include: {
                lessons: {
                    include: {
                        quizzes: true,
                        exercise: {
                            include: { testCases: true }
                        }
                    }
                }
            }
        });

        // Mark session as finalized
        await prisma.pathChatSession.update({
            where: { id: session.id },
            data: {
                isFinalized: true,
                createdPathId: newPath.id
            }
        });

        res.status(200).json({ success: true, data: newPath });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export function cleanChineseArtifacts(text: any): any {
    if (!text || typeof text !== 'string') return text;
    return text
        .replace(/\$\s*\\rightarrow\s*\$/g, '→')
        .replace(/\\rightarrow/g, '→')
        .replace(/\$\s*\\Rightarrow\s*\$/g, '⇒')
        .replace(/\\Rightarrow/g, '⇒')
        .replace(/\$\s*\\le\s*\$/g, '≤')
        .replace(/\\le/g, '≤')
        .replace(/\$\s*\\ge\s*\$/g, '≥')
        .replace(/\\ge/g, '≥')
        .replace(/\$\s*\\neq\s*\$/g, '≠')
        .replace(/\\neq/g, '≠')
        .replace(/在这里写代码|在此处编写代码|在下方编写代码|在下方写代码|请在此处编写代码/g, 'Viết mã tại đây')
        .replace(/写代码|编写代码/g, 'Viết mã')
        .replace(/你的代码/g, 'Mã của bạn')
        .replace(/代码/g, 'mã nguồn')
        .replace(/输入/g, 'Đầu vào')
        .replace(/输出/g, 'Đầu ra')
        .replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g, '');
}

export function sanitizeExerciseObj(ex: any): any {
    if (!ex) return ex;
    if (typeof ex === 'string') return cleanChineseArtifacts(ex);
    if (Array.isArray(ex)) return ex.map(sanitizeExerciseObj);
    if (typeof ex === 'object') {
        const res: any = {};
        for (const k of Object.keys(ex)) {
            res[k] = sanitizeExerciseObj(ex[k]);
        }
        return res;
    }
    return ex;
}

function generateRichTheoryContent(rawExercise: any): string {
    const exercise = sanitizeExerciseObj(rawExercise);
    if (exercise.detailed_theory && exercise.detailed_theory.includes('Execution Trace Table')) {
        return exercise.detailed_theory;
    }

    const rawLang = String(exercise.language || '').toUpperCase();
    const isCpp = rawLang.includes('CPP') || rawLang.includes('C++') || /#include\s*<|std::/i.test(exercise.reference_solution || '') || /#include\s*<|std::/i.test(exercise.starter_code || '');
    const isJs = !isCpp && (rawLang.includes('JS') || rawLang.includes('JAVASCRIPT') || /console\.log|function\s*\(|let\s+|const\s+/i.test(exercise.reference_solution || '') || /console\.log|function\s*\(|let\s+|const\s+/i.test(exercise.starter_code || ''));
    const langName = isCpp ? 'C++' : isJs ? 'JavaScript' : 'Python';
    const langCode = isCpp ? 'cpp' : isJs ? 'javascript' : 'python';

    const title = exercise.title || `Kỹ Năng Lập Trình ${langName} Thực Chiến`;
    const conceptName = exercise.concept_name || exercise.concept_id || `Lập Trình ${langName}`;
    const quickTheory = exercise.quick_theory || `Nắm vững nguyên lý cốt lõi của ${langName} để xây dựng phần mềm ổn định, tối ưu.`;
    const pitfall = exercise.common_pitfall_warning || 'Chú ý kiểm tra kiểu dữ liệu, ngoại lệ và giá trị biên.';
    const solutionCode = exercise.reference_solution || (isCpp ? '#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}' : isJs ? 'function solution(n) {\n    return n;\n}' : 'def solution(data):\n    return data');

    const syntaxHeading = `Để triển khai giải thuật xử lý chuẩn xác trong ${langName}, ta thực hiện đoạn mã sau:`;
    const bestPracticeTip = isCpp 
        ? 'Luôn tuân thủ chuẩn **C++ Core Guidelines**, sử dụng `cin/cout` hiệu quả, giải phóng bộ nhớ an toàn (RAII) và đặt tên biến theo quy tắc rõ nghĩa.'
        : isJs 
            ? 'Luôn giữ phong cách lập trình chuẩn **ES6+ Clean Code**, ưu tiên sử dụng `const` và `let` thay vì `var`, đặt tên hàm theo chuẩn **camelCase**.'
            : 'Luôn giữ phong cách lập trình chuẩn **PEP 8**, đặt tên hàm và biến theo chuẩn **snake_case**, ưu tiên sử dụng các hàm tích hợp sẵn (built-in) của Python để tối ưu tốc độ.';

    const memoryVisual = isCpp
        ? `\`\`\`text
[RAM Stack]                       [RAM Heap]
Biến cục bộ / Tham chiếu ───────► [ Dữ liệu I/O Stream & Bộ nhớ động ]
Hàm thực thi (Stack Frame) ─────► [ Kết quả xuất ra cout / return ]
\`\`\``
        : isJs
            ? `\`\`\`text
[Execution Context Stack]         [Memory Heap]
Biến phạm vi Block / Scope ─────► [ Đối tượng Object / Array ]
Call Stack thực thi hàm ────────► [ Kết quả trả về caller ]
\`\`\``
            : `\`\`\`text
[RAM Stack]                       [RAM Heap]
test_data ──────────────────► [ Dữ liệu đầu vào ]
result    ──────────────────► [ Đối tượng Python sau xử lý ]
\`\`\``;

    return `## 1. Khái niệm & Vấn đề
Hãy tưởng tượng bạn đang xây dựng một module trong hệ thống phần mềm thực tế cần xử lý dữ liệu về **${conceptName}** trong ngôn ngữ **${langName}**. Nếu không có thuật toán và kỹ thuật xử lý phù hợp, chương trình sẽ dễ gặp lỗi dữ liệu khuyết thiếu, rò rỉ bộ nhớ hoặc dừng đột ngột.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **${conceptName}** | ${quickTheory} | Như một quy trình kiểm soát chất lượng tự động trên băng chuyền dữ liệu. |

## 2. Cú pháp & Vận hành
${syntaxHeading}

\`\`\`${langCode}
${solutionCode}
\`\`\`

**Bảng theo dõi thực thi (Execution Trace Table):**
| BƯỚC | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | Khởi tạo & nạp dữ liệu | Đầu vào sẵn sàng | Nạp mã vào bộ nhớ tiến trình (${langName}) |
| 2 | Thực thi giải thuật | Đang tính toán | Đọc dữ liệu từ bộ nhớ và áp dụng logic xử lý |
| 3 | Xuất kết quả | Đã có giá trị | Xuất kết quả đã xử lý ra màn hình console hoặc trả về |

**Mô hình bộ nhớ ${langName}:**
${memoryVisual}

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Không kiểm tra dữ liệu biên**: ${pitfall}
> * **Truy xuất trực tiếp không an toàn**: Làm ứng dụng bị dừng đột ngột khi gặp dữ liệu bất ngờ.

> [!TIP]
> ${bestPracticeTip}

## 4. Đúc kết & Đi tiếp
* Nắm vững nguyên lý và luồng dữ liệu của **${conceptName}** giúp bạn tự tin viết mã nguồn ít lỗi nhất.
* Luôn rà soát qua Bảng theo dõi thực thi trong đầu trước khi viết code phức tạp.
* Bây giờ, hãy chuyển sang tab **Thực Hành Lập Trình** để tự tay giải bài tập và kiểm thử với các test cases!`;
}

// 9. POST /api/learning-path/adaptive/start-exercise
export const startAdaptiveExerciseFromChat = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { sessionId, exercise } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, error: 'Chưa xác thực người dùng!' });
            return;
        }

        if (!exercise || !exercise.title) {
            res.status(400).json({ success: false, error: 'Thiếu thông tin bài tập thích ứng!' });
            return;
        }

        // Xác định ngôn ngữ chính xác của bài tập
        const rawLang = String(exercise.language || '').toUpperCase();
        const isCpp = rawLang.includes('CPP') || rawLang.includes('C++') || /#include\s*<|std::/i.test(exercise.reference_solution || '') || /#include\s*<|std::/i.test(exercise.starter_code || '');
        const isJs = !isCpp && (rawLang.includes('JS') || rawLang.includes('JAVASCRIPT') || /console\.log|function\s*\(|let\s+|const\s+/i.test(exercise.reference_solution || '') || /console\.log|function\s*\(|let\s+|const\s+/i.test(exercise.starter_code || ''));
        const normalizedLang: 'CPP' | 'JAVASCRIPT' | 'PYTHON' = isCpp ? 'CPP' : (isJs ? 'JAVASCRIPT' : 'PYTHON');

        const targetSkillFallback = isCpp ? 'cpp_practice' : (isJs ? 'js_practice' : 'python_practice');
        const targetSkillId = String(exercise.concept_id || (isCpp ? 'CPP-SYNTAX-01' : (isJs ? 'JS-VAR-01' : 'PY-BASICS-01')));

        // Tạo một PersonalizedPath đơn mục tiêu cho bài tập thích ứng này
        const testCasesList = (exercise.test_cases || []).map((tc: any) => ({
            input: String(tc.input || ''),
            expectedOutput: String(tc.expected_output || ''),
            isHidden: !!tc.is_hidden
        }));

        const newPath = await prisma.personalizedPath.create({
            data: {
                userId,
                title: `[Thích ứng ZPD] ${exercise.title}`,
                description: exercise.quick_theory || `Thực hành khắc phục điểm yếu concept ${exercise.concept_name || exercise.concept_id}`,
                targetSkills: [targetSkillId],
                palNetAvgScore: 0.70,
                lessons: {
                    create: [
                        {
                            orderIndex: 1,
                            title: exercise.title,
                            targetSkillId: targetSkillId,
                            theoryContent: generateRichTheoryContent(exercise),
                            exercise: {
                                create: {
                                    title: exercise.title,
                                    difficulty: exercise.difficulty_stars === 1 ? 'EASY' : 'MEDIUM',
                                    problemDescription: exercise.problem_statement || exercise.title,
                                    starterCode: exercise.starter_code || (isCpp 
                                        ? '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Viết mã nguồn C++ ở đây:\n    return 0;\n}' 
                                        : isJs 
                                            ? 'function solution(n) {\n    // Viết mã nguồn JS ở đây:\n}' 
                                            : 'def solution(n):\n    pass'),
                                    solutionCode: exercise.reference_solution || '',
                                    language: normalizedLang,
                                    qcStatus: 'VERIFIED',
                                    testCases: {
                                        create: testCasesList.length > 0 ? testCasesList : [
                                            { input: '2', expectedOutput: '4', isHidden: false }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            include: {
                lessons: {
                    include: {
                        exercise: {
                            include: { testCases: true }
                        }
                    }
                }
            }
        });

        // Nếu có sessionId, cập nhật createdPathId
        if (sessionId) {
            try {
                await prisma.pathChatSession.update({
                    where: { id: String(sessionId) },
                    data: { createdPathId: newPath.id }
                });
            } catch (e) {
                console.warn('Could not bind createdPathId to session:', e);
            }
        }

        const createdExercise = (newPath as any).lessons?.[0]?.exercise;

        res.status(200).json({
            success: true,
            pathId: newPath.id,
            exerciseId: createdExercise?.id,
            data: newPath
        });
    } catch (error: any) {
        console.error('startAdaptiveExerciseFromChat error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 10. POST /api/learning-path/adaptive/update-mastery
export const updateAdaptiveMastery = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { conceptId, passed } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, error: 'Chưa xác thực người dùng!' });
            return;
        }

        if (!conceptId) {
            res.status(400).json({ success: false, error: 'Thiếu concept ID!' });
            return;
        }

        // 1. Lấy điểm năng lực hiện tại của người học
        let currentMastery: Record<string, number> = {};
        try {
            const masteryRes = await getEvidenceBasedUserMastery(userId);
            currentMastery = masteryRes?.mastery?.['Evidence-Based'] || {};
        } catch (e) {
            console.warn('Could not load user mastery:', e);
        }

        // 2. Gọi AI Service cập nhật tiến trình trên đồ thị DAG
        let aiData: any = null;
        try {
            const aiRes = await fetch(`${AI_SERVICE_URL}/pal-net/update-mastery-progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    concept_id: conceptId,
                    passed: passed ?? true,
                    current_mastery: currentMastery
                })
            });
            if (aiRes.ok) {
                const resJson = await aiRes.json();
                aiData = resJson?.data;
            }
        } catch (e) {
            console.error('AI Service update-mastery-progress error:', e);
        }

        // Fallback calculation nếu AI Service tạm thời không phản hồi
        if (!aiData) {
            const oldScore = currentMastery[conceptId] || 0.40;
            const newScore = passed ? Math.min(1.0, +(oldScore + 0.25).toFixed(2)) : Math.max(0.1, +(oldScore - 0.10).toFixed(2));
            aiData = {
                concept_id: conceptId,
                old_mastery: oldScore,
                new_mastery: newScore,
                passed: !!passed,
                reply: passed
                    ? `🎉 Chúc mừng bạn! Độ thành thạo concept ${conceptId} đã tăng từ ${Math.round(oldScore * 100)}% lên ${Math.round(newScore * 100)}%.`
                    : `Bài làm chưa vượt qua toàn bộ testcases. Điểm hiện tại: ${Math.round(newScore * 100)}%.`
            };
        }

        res.status(200).json({
            success: true,
            data: aiData
        });
    } catch (error: any) {
        console.error('updateAdaptiveMastery error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 11. GET /api/learning-path/chat/sessions
export const getChatSessions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Chưa xác thực!' });
            return;
        }

        const sessions = await prisma.pathChatSession.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        content: true,
                        sender: true,
                        createdAt: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            sessions: sessions.map(s => ({
                id: s.id,
                initialGoal: s.initialGoal,
                isFinalized: s.isFinalized,
                createdPathId: s.createdPathId,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
                lastMessage: s.messages[0] || null
            }))
        });
    } catch (error: any) {
        console.error('getChatSessions error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 12. GET /api/learning-path/chat/session/:sessionId
export const getChatSessionById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const sessionId = String(req.params.sessionId);

        if (!userId) {
            res.status(401).json({ success: false, error: 'Chưa xác thực!' });
            return;
        }

        const session = await prisma.pathChatSession.findUnique({
            where: { id: sessionId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!session || session.userId !== userId) {
            res.status(404).json({ success: false, error: 'Không tìm thấy phiên trò chuyện!' });
            return;
        }

        res.status(200).json({
            success: true,
            session
        });
    } catch (error: any) {
        console.error('getChatSessionById error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 13. DELETE /api/learning-path/chat/session/:sessionId
export const deleteChatSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const sessionId = String(req.params.sessionId);

        if (!userId) {
            res.status(401).json({ success: false, error: 'Chưa xác thực!' });
            return;
        }

        const session = await prisma.pathChatSession.findUnique({
            where: { id: sessionId }
        });

        if (!session || session.userId !== userId) {
            res.status(404).json({ success: false, error: 'Không tìm thấy phiên trò chuyện!' });
            return;
        }

        await prisma.pathChatSession.delete({
            where: { id: sessionId }
        });

        res.status(200).json({
            success: true,
            message: 'Đã xóa phiên trò chuyện thành công!'
        });
    } catch (error: any) {
        console.error('deleteChatSession error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
