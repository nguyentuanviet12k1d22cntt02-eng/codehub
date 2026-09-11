import { Response } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { AuthenticatedRequest } from '../../shared/middleware/auth';
import { codeExecutionQueue } from '../../infrastructure/queue/queueService';
import { getDynamicUserMasteryFallback } from '../recommendations/recommendationController';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

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

        // Fallback default structure if AI Service unreachable
        if (!aiData) {
            aiData = {
                path_title: "Lộ Trình Thích Ứng PAL-Net: Chinh Phục Cấu Trúc Điều Kiện & Vòng Lặp Python",
                description: "Lộ trình được tạo tự động dựa trên vùng phát triển ZPD và lịch sử nộp bài của bạn.",
                target_skills: ["python_loops", "python_lists"],
                pal_net_avg_score: 0.76,
                lessons: [
                    {
                        order_index: 1,
                        title: "Nắm Vững Vòng Lặp For & Duyệt Danh Sách Python",
                        target_skill_id: "python_loops",
                        theory_content: "# Bài Học Cá Nhân Hóa: Vòng Lặp For trong Python\n\nVòng lặp for cho phép duyệt qua các phần tử của một chuỗi hoặc danh sách trong Python một cách dễ dàng.",
                        quizzes: [
                            {
                                question: "Hàm range(1, 5) sinh ra chuỗi số nào?",
                                option_a: "1 2 3 4 5",
                                option_b: "1 2 3 4",
                                option_c: "0 1 2 3 4",
                                option_d: "1 3 5",
                                correct_option: "B",
                                explanation: "Hàm range(1, 5) tạo dãy số bắt đầu từ 1 và kết thúc trước 5 (tức là 4)."
                            }
                        ],
                        exercise: {
                            title: "Tính Tổng Các Số Chẵn Trong Mảng",
                            difficulty: "MEDIUM",
                            problem_description: "Viết hàm `sum_even(lst)` nhận vào danh sách số nguyên và trả về tổng các số chẵn.",
                            starter_code: "def sum_even(lst):\n    pass",
                            solution_code: "def sum_even(lst):\n    return sum(x for x in lst if x % 2 == 0)",
                            test_cases: [
                                { input: "[1, 2, 3, 4, 6]", expected_output: "12", is_hidden: false }
                            ]
                        }
                    }
                ]
            };
        }

        // Save to Database via Prisma
        const newPath = await prisma.personalizedPath.create({
            data: {
                userId,
                title: aiData.path_title || 'Lộ Trình Thích Ứng Cá Nhân Hóa',
                description: aiData.description || 'Lộ trình bài học cá nhân hóa PAL-Net',
                targetSkills: aiData.target_skills || ['python_loops'],
                palNetAvgScore: aiData.pal_net_avg_score || 0.75,
                lessons: {
                    create: (aiData.lessons || []).map((l: any) => ({
                        orderIndex: l.order_index,
                        title: l.title,
                        targetSkillId: l.target_skill_id || 'python_loops',
                        theoryContent: l.theory_content,
                        quizzes: {
                            create: (l.quizzes || []).map((q: any) => ({
                                question: q.question,
                                optionA: q.option_a,
                                optionB: q.option_b,
                                optionC: q.option_c,
                                optionD: q.option_d,
                                correctOption: (q.correct_option as any) || 'A',
                                explanation: q.explanation
                            }))
                        },
                        ...(l.exercise ? {
                            exercise: {
                                create: {
                                    title: l.exercise.title || 'Bài tập thực hành',
                                    difficulty: (l.exercise.difficulty as any) || 'MEDIUM',
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

        res.status(200).json({ success: true, data: path });
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

        for (const tc of exercise.testCases) {
            const rawInput = tc.input ? tc.input.trim() : '';
            const expectedOut = (tc.expectedOutput || '').trim();

            // Tự động xây dựng execution harness để kiểm thử linh hoạt Function & Class OOP
            let codeToRun = code;
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

            const jobRes = await codeExecutionQueue.pushJob(codeToRun, 'PYTHON', rawInput, 5000);
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

        res.status(200).json({
            success: true,
            isPassed: isAllPassed,
            score: totalCases > 0 ? Math.round((passedCases / totalCases) * 100) : 100,
            passedCases,
            totalCases,
            results
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

        const { goal, target_concept_id } = req.body;
        const initialGoal = goal || 'Tôi muốn học lập trình Python cá nhân hóa';

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
            const masteryRes = await getDynamicUserMasteryFallback(userId);
            userMastery = masteryRes?.mastery?.['PAL-Net'] || {};
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
                    target_concept_id: target_concept_id || null
                })
            });
            if (aiRes.ok) {
                const json: any = await aiRes.json();
                aiReplyData = json?.data;
            }
        } catch (e) {
            console.error('AI Service adaptive-tutor-agent error:', e);
        }

        const aiReplyContent = aiReplyData?.reply || 'Chào bạn! PAL-Net Engine đã sẵn sàng đồng hành cùng bạn. Bạn muốn kiểm tra điểm yếu hay bắt đầu rèn luyện chủ đề nào?';
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
                    exercise: aiReplyData?.exercise || null,
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

// 7. POST /api/learning-path/chat/reply
export const replyChatMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { sessionId, content, target_concept_id } = req.body;
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
            const masteryRes = await getDynamicUserMasteryFallback(userId);
            userMastery = masteryRes?.mastery?.['PAL-Net'] || {};
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
                    target_concept_id: target_concept_id || null
                })
            });
            if (aiRes.ok) {
                const json: any = await aiRes.json();
                aiReplyData = json?.data;
            }
        } catch (e) {
            console.error('AI Service adaptive-tutor-agent error:', e);
        }

        const aiReplyContent = aiReplyData?.reply || 'Tôi đã xử lý yêu cầu của bạn.';
        
        // Save AI Message with Multi-Agent metadata
        const aiMsg = await prisma.pathChatMessage.create({
            data: {
                sessionId: session.id,
                sender: 'AI_TUTOR',
                content: aiReplyContent,
                metadata: {
                    intent: aiReplyData?.intent || 'GENERAL_CHAT',
                    agentTraces: aiReplyData?.agent_traces || [],
                    exercise: aiReplyData?.exercise || null,
                    suggestedOptions: aiReplyData?.suggested_options || [],
                    step: aiReplyData?.exercise ? 'EXERCISE_READY' : 'CHAT'
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
            res.status(500).json({ success: false, error: 'Không nhận được dữ liệu Lộ trình từ Gemini AI.' });
            return;
        }

        const newPath = await prisma.personalizedPath.create({
            data: {
                userId,
                title: aiData.path_title || 'Lộ Trình AI Tutor Cá Nhân Hóa',
                description: aiData.description || 'Lộ trình từ phiên đối thoại AI Tutor',
                targetSkills: aiData.target_skills || ['python_loops'],
                palNetAvgScore: aiData.pal_net_avg_score || 0.78,
                lessons: {
                    create: (aiData.lessons || []).map((l: any) => ({
                        orderIndex: l.order_index,
                        title: l.title,
                        targetSkillId: l.target_skill_id || 'python_loops',
                        theoryContent: l.theory_content,
                        quizzes: {
                            create: (l.quizzes || []).map((q: any) => ({
                                question: q.question,
                                optionA: q.option_a,
                                optionB: q.option_b,
                                optionC: q.option_c,
                                optionD: q.option_d,
                                correctOption: (q.correct_option as any) || 'A',
                                explanation: q.explanation
                            }))
                        },
                        ...(l.exercise ? {
                            exercise: {
                                create: {
                                    title: l.exercise.title || 'Bài tập thực hành',
                                    difficulty: (l.exercise.difficulty as any) || 'MEDIUM',
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

function generateRichTheoryContent(exercise: any): string {
    if (exercise.detailed_theory && exercise.detailed_theory.includes('Execution Trace Table')) {
        return exercise.detailed_theory;
    }

    const title = exercise.title || 'Kỹ Năng Lập Trình Python Thực Chiến';
    const conceptName = exercise.concept_name || exercise.concept_id || 'Lập Trình Python';
    const quickTheory = exercise.quick_theory || 'Nắm vững nguyên lý cốt lõi để xây dựng phần mềm ổn định, tối ưu.';
    const pitfall = exercise.common_pitfall_warning || 'Chú ý kiểm tra kiểu dữ liệu, ngoại lệ và giá trị biên.';
    const solutionCode = exercise.reference_solution || 'def solution(data):\n    return data';
    const starterCode = exercise.starter_code || 'def solution(data):\n    pass';
    const sampleInput = exercise.sample_input || "([1, 2, 3, 4],)";

    return `## 1. Khái niệm & Vấn đề
Hãy tưởng tượng bạn đang xây dựng một module trong hệ thống phần mềm thực tế cần xử lý dữ liệu về **${conceptName}**. Nếu không có thuật toán và kỹ thuật xử lý phù hợp, chương trình sẽ dễ gặp lỗi dữ liệu khuyết thiếu, rò rỉ bộ nhớ hoặc dừng đột ngột.

| Thuật ngữ | Định nghĩa thực tế | Phép ẩn dụ |
| :--- | :--- | :--- |
| **${conceptName}** | ${quickTheory} | Như một quy trình kiểm soát chất lượng tự động trên băng chuyền dữ liệu. |

## 2. Cú pháp & Vận hành
Để triển khai giải thuật xử lý chuẩn xác trong Python, ta thực hiện đoạn mã sau:

\`\`\`python
${solutionCode}

# Chạy thử với dữ liệu mẫu:
test_data = ${sampleInput}
result = ${solutionCode.includes('def ') ? (solutionCode.split('def ')[1]?.split('(')[0] || 'solution').trim() + '(*test_data)' : 'solution(*test_data)'}
print("Kết quả chạy thử:", result)
\`\`\`

**Bảng theo dõi thực thi (Execution Trace Table):**
| DÒNG MÃ | LỆNH ĐƯỢC CHẠY | TRẠNG THÁI BIẾN | HÀNH ĐỘNG CỦA MÁY TÍNH |
|:---:|:---|:---|:---|
| 1 | Khởi tạo hàm xử lý | \`test_data\`: ${sampleInput} | Định nghĩa hàm vào không gian tên bộ nhớ |
| 2 | Nạp đối số & thực thi | \`result\`: Đang tính toán | Đọc dữ liệu từ bộ nhớ và áp dụng logic giải thuật |
| 3 | \`print("Kết quả...", result)\` | \`result\`: Đã có giá trị | Xuất kết quả đã xử lý ra màn hình hoặc trả về caller |

**Trạng thái bộ nhớ RAM:**
\`\`\`text
[RAM Stack]                       [RAM Heap]
test_data ──────────────────► [ ${sampleInput} ]
result    ──────────────────► [ Kết quả sau khi xử lý ]
\`\`\`

## 3. Lỗi thường gặp & Tối ưu
> [!WARNING]
> **Các lỗi thường gặp cần tránh:**
> * **Không kiểm tra dữ liệu biên**: ${pitfall}
> * **Truy xuất trực tiếp không an toàn**: Làm ứng dụng bị crash khi gặp ngoại lệ bất ngờ.

> [!TIP]
> Luôn giữ phong cách lập trình chuẩn **PEP 8**, đặt tên hàm và biến theo chuẩn **snake_case**, ưu tiên sử dụng các hàm tích hợp sẵn (built-in) của Python để tối ưu tốc độ.

## 4. Đúc kết & Đi tiếp
* Nắm vững nguyên lý và luồng dữ liệu của **${conceptName}** giúp bạn tự tin viết mã nguồn ít lỗi nhất.
* Luôn rà soát qua Bảng theo dõi thực thi (Execution Trace Table) trong đầu trước khi viết code phức tạp.
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
                targetSkills: [exercise.concept_id || 'python_practice'],
                palNetAvgScore: 0.70,
                lessons: {
                    create: [
                        {
                            orderIndex: 1,
                            title: exercise.title,
                            targetSkillId: String(exercise.concept_id || 'PY-GEN'),
                            theoryContent: generateRichTheoryContent(exercise),
                            exercise: {
                                create: {
                                    title: exercise.title,
                                    difficulty: exercise.difficulty_stars === 1 ? 'EASY' : 'MEDIUM',
                                    problemDescription: exercise.problem_statement || exercise.title,
                                    starterCode: exercise.starter_code || 'def solution():\n    pass',
                                    solutionCode: exercise.reference_solution || '',
                                    language: 'PYTHON',
                                    qcStatus: 'VERIFIED',
                                    testCases: {
                                        create: testCasesList.length > 0 ? testCasesList : [
                                            { input: '(5, 10)', expectedOutput: '15', isHidden: false }
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
            const masteryRes = await getDynamicUserMasteryFallback(userId);
            currentMastery = masteryRes?.mastery?.['PAL-Net'] || {};
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



