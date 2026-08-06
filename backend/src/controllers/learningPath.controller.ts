import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { codeExecutionQueue } from '../services/queueService';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

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
            const jobRes = await codeExecutionQueue.pushJob(code, 'PYTHON', tc.input || '', 5000);
            const actualOut = (jobRes.stdout || '').trim();
            const expectedOut = tc.expectedOutput.trim();

            const isPassed = jobRes.status === 'SUCCESS' && actualOut === expectedOut;
            if (isPassed) passedCases++;

            results.push({
                testCaseId: tc.id,
                passed: isPassed,
                input: tc.isHidden ? 'Hidden' : tc.input,
                expectedOutput: tc.isHidden ? 'Hidden' : tc.expectedOutput,
                actualOutput: tc.isHidden ? (isPassed ? 'Passed' : 'Mismatch') : actualOut
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

        const { goal } = req.body;
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

        // 2. Call AI Service for initial response
        let aiReplyData: any = null;
        try {
            const aiRes = await fetch(`${AI_SERVICE_URL}/pal-net/chat-interact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    session_id: session.id,
                    messages: [{ sender: 'USER', content: initialGoal }]
                })
            });
            if (aiRes.ok) {
                const json: any = await aiRes.json();
                aiReplyData = json?.data;
            }
        } catch (e) {
            console.error('AI Service chat-interact error:', e);
        }

        const aiReplyContent = aiReplyData?.reply || 'Chào bạn! PAL-Net Engine đã sẵn sàng đồng hành cùng bạn. Bạn dự định dành bao nhiêu thời gian học mỗi ngày? (15m, 30m hay 1 giờ)';
        const suggestedOptions = aiReplyData?.suggested_options || [
            '⏱️ 30 phút/ngày, Tập trung gõ code thực hành nhiều hơn',
            '⏱️ 15 phút/ngày, Cần lý thuyết ngắn gọn & trắc nghiệm'
        ];

        // 3. Save AI message
        const aiMessage = await prisma.pathChatMessage.create({
            data: {
                sessionId: session.id,
                sender: 'AI_TUTOR',
                content: aiReplyContent,
                metadata: {
                    step: aiReplyData?.step || 'CLARIFY',
                    suggestedOptions
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
        const { sessionId, content } = req.body;
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

        // Call AI Service
        let aiReplyData: any = null;
        try {
            const aiRes = await fetch(`${AI_SERVICE_URL}/pal-net/chat-interact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    session_id: session.id,
                    messages: updatedHistory
                })
            });
            if (aiRes.ok) {
                const json: any = await aiRes.json();
                aiReplyData = json?.data;
            }
        } catch (e) {
            console.error('AI Service chat-interact error:', e);
        }

        const aiReplyContent = aiReplyData?.reply || 'Tôi đã ghi nhận mong muốn của bạn và tạo bản phác thảo lộ trình!';
        
        // Save AI Message
        const aiMsg = await prisma.pathChatMessage.create({
            data: {
                sessionId: session.id,
                sender: 'AI_TUTOR',
                content: aiReplyContent,
                metadata: {
                    step: aiReplyData?.step || 'PREVIEW',
                    previewData: aiReplyData?.preview_data,
                    suggestedOptions: aiReplyData?.suggested_options
                }
            }
        });

        res.status(200).json({
            success: true,
            userMessage: userMsg,
            aiMessage: aiMsg,
            step: aiReplyData?.step || 'PREVIEW',
            previewData: aiReplyData?.preview_data
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

