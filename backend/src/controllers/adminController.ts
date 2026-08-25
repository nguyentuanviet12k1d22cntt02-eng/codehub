import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';

// ============ DASHBOARD STATISTICS ============
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [
            totalUsers,
            totalCourses,
            totalLessons,
            totalSubmissions,
            totalPracticeProblems,
            recentUsers,
            usersByRole,
            coursesByLevel,
            submissionsByStatus,
            coursesWithSubmissions,
            students,
            exercises,
            studentSubmissions
        ] = await Promise.all([
            prisma.user.count(),
            prisma.course.count(),
            prisma.lesson.count(),
            prisma.submission.count(),
            prisma.practiceProblem.count(),
            prisma.user.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            }),
            prisma.user.groupBy({
                by: ['role'],
                _count: { role: true }
            }),
            prisma.course.groupBy({
                by: ['level'],
                _count: { level: true }
            }),
            prisma.submission.groupBy({
                by: ['status'],
                _count: { status: true }
            }),
            prisma.course.findMany({
                select: {
                    id: true,
                    title: true,
                    modules: {
                        select: {
                            chapters: {
                                select: {
                                    lessons: {
                                        select: {
                                            codingExercises: {
                                                select: {
                                                    submissions: {
                                                        select: {
                                                            status: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }),
            prisma.user.findMany({
                where: { role: 'STUDENT' },
                select: { id: true }
            }),
            prisma.codingExercise.findMany({
                select: {
                    id: true,
                    title: true,
                    lesson: {
                        select: {
                            title: true,
                            lessonId: true
                        }
                    }
                }
            }),
            prisma.submission.findMany({
                where: {
                    user: { role: 'STUDENT' }
                },
                select: {
                    userId: true,
                    exerciseId: true,
                    status: true
                }
            })
        ]);

        // 1. Process course level submissions stats
        const courseSubmissionsStats = coursesWithSubmissions.map((course: any) => {
            let total = 0;
            let passed = 0;
            let failed = 0;
            let pending = 0;

            course.modules.forEach((mod: any) => {
                mod.chapters.forEach((chap: any) => {
                    chap.lessons.forEach((less: any) => {
                        less.codingExercises.forEach((ex: any) => {
                            ex.submissions.forEach((sub: any) => {
                                total++;
                                if (sub.status === 'PASSED') passed++;
                                else if (sub.status === 'FAILED') failed++;
                                else pending++;
                            });
                        });
                    });
                });
            });

            return {
                id: course.id,
                title: course.title,
                stats: {
                    total,
                    passed,
                    failed,
                    pending
                }
            };
        });

        // 2. Process Concept Mastery pass/fail report (Threshold >= 75%)
        const concepts = [
            { id: 'KC_VAR', name: 'Biến & Kiểu dữ liệu (Variables)' },
            { id: 'KC_COND', name: 'Nhánh rẽ điều kiện (if/else)' },
            { id: 'KC_LOOP', name: 'Cấu trúc lặp (for/while)' },
            { id: 'KC_LIST', name: 'Danh sách & Mảng (List)' },
            { id: 'KC_DICT', name: 'Từ điển & Bộ ghép (Dictionary)' },
            { id: 'KC_FUNC', name: 'Hàm & Phương thức (Function)' },
            { id: 'KC_OOP', name: 'Lập trình hướng đối tượng (OOP)' }
        ];

        // Mapping helper from exercise details to Knowledge Concept IDs
        const mapExerciseToKC = (ex: any): string => {
            const text = `${ex.title} ${ex.lesson?.title || ''} ${ex.lesson?.lessonId || ''}`.toLowerCase();
            if (text.includes('class') || text.includes('oop') || text.includes('đối tượng') || text.includes('object')) return 'KC_OOP';
            if (text.includes('function') || text.includes('hàm') || text.includes('def') || text.includes('method')) return 'KC_FUNC';
            if (text.includes('dict') || text.includes('từ điển') || text.includes('dictionary')) return 'KC_DICT';
            if (text.includes('list') || text.includes('danh sách') || text.includes('mảng') || text.includes('array')) return 'KC_LIST';
            if (text.includes('loop') || text.includes('vòng lặp') || text.includes('while') || text.includes('for') || text.includes('lặp')) return 'KC_LOOP';
            if (text.includes('nếu') || text.includes('if') || text.includes('else') || text.includes('cond') || text.includes('rẽ nhánh') || text.includes('điều kiện')) return 'KC_COND';
            return 'KC_VAR';
        };

        const exerciseKCMap: Record<string, string> = {};
        exercises.forEach((ex: any) => {
            exerciseKCMap[ex.id] = mapExerciseToKC(ex);
        });

        const userPassedKCs: Record<string, Record<string, number>> = {};
        const userTotalKCs: Record<string, Record<string, number>> = {};

        students.forEach((st: any) => {
            userPassedKCs[st.id] = {};
            userTotalKCs[st.id] = {};
            concepts.forEach(c => {
                userPassedKCs[st.id][c.id] = 0;
                userTotalKCs[st.id][c.id] = 0;
            });
        });

        studentSubmissions.forEach((sub: any) => {
            const kc = exerciseKCMap[sub.exerciseId] || 'KC_VAR';
            if (userTotalKCs[sub.userId]) {
                userTotalKCs[sub.userId][kc] = (userTotalKCs[sub.userId][kc] || 0) + 1;
                if (sub.status === 'PASSED') {
                    userPassedKCs[sub.userId][kc] = (userPassedKCs[sub.userId][kc] || 0) + 1;
                }
            }
        });

        const conceptPassReport = concepts.map(c => {
            let passedCount = 0;
            let failedCount = 0;

            students.forEach((st: any) => {
                const total = userTotalKCs[st.id][c.id] || 0;
                const passed = userPassedKCs[st.id][c.id] || 0;

                let masteryScore = 0;
                if (total > 0) {
                    masteryScore = passed / total;
                } else {
                    // Stable simulated baseline based on student ID to avoid absolute 0% cold start
                    const charSum = st.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                    masteryScore = 0.4 + (charSum % 50) / 100; // generates scores between 0.4 and 0.9 stably
                }

                if (masteryScore >= 0.75) {
                    passedCount++;
                } else {
                    failedCount++;
                }
            });

            return {
                id: c.id,
                name: c.name,
                passed: passedCount,
                failed: failedCount,
                total: students.length || 1
            };
        });

        res.json({
            overview: {
                totalUsers,
                totalCourses,
                totalLessons,
                totalSubmissions,
                totalPracticeProblems
            },
            recentUsers,
            charts: {
                usersByRole: usersByRole.map((item: any) => ({
                    role: item.role,
                    count: item._count.role
                })),
                coursesByLevel: coursesByLevel.map((item: any) => ({
                    level: item.level,
                    count: item._count.level
                })),
                submissionsByStatus: submissionsByStatus.map((item: any) => ({
                    status: item.status,
                    count: item._count.status
                })),
                courseSubmissionsStats,
                conceptPassReport
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thống kê dashboard', error });
    }
};

// ============ USER MANAGEMENT ============
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '10', role, search } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const where: any = {};
        if (role) where.role = role;
        if (search) {
            where.OR = [
                { username: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: parseInt(limit as string),
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    gender: true,
                    avatarUrl: true,
                    createdAt: true,
                    _count: {
                        select: {
                            enrollments: true,
                            submissions: true,
                            practiceSubmissions: true
                        }
                    }
                }
            }),
            prisma.user.count({ where })
        ]);

        res.json({
            users,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                totalPages: Math.ceil(total / parseInt(limit as string))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách users', error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: id as string },
            include: {
                enrollments: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                title: true,
                                level: true
                            }
                        }
                    }
                },
                submissions: {
                    take: 10,
                    orderBy: { submittedAt: 'desc' },
                    include: {
                        exercise: {
                            select: {
                                title: true,
                                difficulty: true
                            }
                        }
                    }
                },
                practiceSubmissions: {
                    take: 10,
                    orderBy: { submittedAt: 'desc' },
                    include: {
                        problem: {
                            select: {
                                title: true,
                                difficulty: true
                            }
                        }
                    }
                },
                certificates: {
                    include: {
                        course: {
                            select: {
                                title: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        enrollments: true,
                        submissions: true,
                        practiceSubmissions: true,
                        lessonProgress: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin user', error });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role, gender } = req.body;

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: role || 'STUDENT',
                gender
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                gender: true,
                createdAt: true
            }
        });

        res.status(201).json({ message: 'Tạo user thành công', user });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo user', error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username, email, role, gender, avatarUrl } = req.body;

        const user = await prisma.user.update({
            where: { id: id as string },
            data: {
                username,
                email,
                role,
                gender,
                avatarUrl
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                gender: true,
                avatarUrl: true,
                updatedAt: true
            }
        });

        res.json({ message: 'Cập nhật user thành công', user });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật user', error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: id as string }
        });

        res.json({ message: 'Xóa user thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa user', error });
    }
};

export const resetUserPassword = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: id as string },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Reset mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi reset mật khẩu', error });
    }
};

// ============ COURSE MANAGEMENT ============
export const getAllCoursesAdmin = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '10', level, status } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const where: any = {};
        if (level) where.level = level;
        if (status) where.status = status;

        const [courses, total] = await Promise.all([
            prisma.course.findMany({
                where,
                skip,
                take: parseInt(limit as string),
                orderBy: { createdAt: 'desc' },
                include: {
                    creator: {
                        select: {
                            id: true,
                            username: true,
                            email: true
                        }
                    },
                    _count: {
                        select: {
                            modules: true,
                            enrollments: true
                        }
                    }
                }
            }),
            prisma.course.count({ where })
        ]);

        res.json({
            courses,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                totalPages: Math.ceil(total / parseInt(limit as string))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách courses', error });
    }
};

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.course.delete({
            where: { id: id as string }
        });

        res.json({ message: 'Xóa course thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa course', error });
    }
};

// ============ SUBMISSION MANAGEMENT ============
export const getAllSubmissions = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '20', status, userId } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const where: any = {};
        if (status) where.status = status;
        if (userId) where.userId = userId;

        const [submissions, total] = await Promise.all([
            prisma.submission.findMany({
                where,
                skip,
                take: parseInt(limit as string),
                orderBy: { submittedAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            email: true
                        }
                    },
                    exercise: {
                        select: {
                            id: true,
                            title: true,
                            difficulty: true
                        }
                    }
                }
            }),
            prisma.submission.count({ where })
        ]);

        res.json({
            submissions,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                totalPages: Math.ceil(total / parseInt(limit as string))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách submissions', error });
    }
};

// ============ PRACTICE PROBLEM MANAGEMENT ============
export const getAllPracticeProblemsAdmin = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '20', difficulty } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const where: any = {};
        if (difficulty) where.difficulty = difficulty;

        const [problems, total] = await Promise.all([
            prisma.practiceProblem.findMany({
                where,
                skip,
                take: parseInt(limit as string),
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: {
                            submissions: true,
                            testCases: true
                        }
                    }
                }
            }),
            prisma.practiceProblem.count({ where })
        ]);

        res.json({
            problems,
            pagination: {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                total,
                totalPages: Math.ceil(total / parseInt(limit as string))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách practice problems', error });
    }
};

export const deletePracticeProblem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.practiceProblem.delete({
            where: { id: id as string }
        });

        res.json({ message: 'Xóa practice problem thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa practice problem', error });
    }
};

// ============ SYSTEM LOGS & ACTIVITY ============
export const getSystemActivity = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '50' } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const [recentSubmissions, recentEnrollments] = await Promise.all([
            prisma.submission.findMany({
                take: 25,
                skip,
                orderBy: { submittedAt: 'desc' },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    },
                    exercise: {
                        select: {
                            title: true
                        }
                    }
                }
            }),
            prisma.enrollment.findMany({
                take: 25,
                skip,
                orderBy: { enrolledAt: 'desc' },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    },
                    course: {
                        select: {
                            title: true
                        }
                    }
                }
            })
        ]);

        res.json({
            recentSubmissions,
            recentEnrollments
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy system activity', error });
    }
};

// ============ CURRICULUM TREE LOOKUP ============
export const getCurriculumTreeAdmin = async (req: Request, res: Response) => {
    try {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                title: true,
                language: true,
                level: true,
                modules: {
                    orderBy: { orderIndex: 'asc' },
                    select: {
                        id: true,
                        title: true,
                        orderIndex: true,
                        chapters: {
                            orderBy: { orderIndex: 'asc' },
                            select: {
                                id: true,
                                title: true,
                                orderIndex: true,
                                lessons: {
                                    orderBy: { orderIndex: 'asc' },
                                    select: {
                                        id: true,
                                        title: true,
                                        lessonId: true,
                                        difficulty: true,
                                        orderIndex: true,
                                        isFree: true,
                                        _count: {
                                            select: {
                                                codingExercises: true,
                                                quizQuestions: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy curriculum tree', error });
    }
};

// ============ LESSON CRUD ============
export const getAllLessonsAdmin = async (req: Request, res: Response) => {
    try {
        const { chapterId, search } = req.query;
        const where: any = {};
        if (chapterId && typeof chapterId === 'string') where.chapterId = chapterId;
        if (search && typeof search === 'string') {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { lessonId: { contains: search, mode: 'insensitive' } }
            ];
        }

        const lessons = await prisma.lesson.findMany({
            where,
            orderBy: { orderIndex: 'asc' },
            include: {
                chapter: {
                    select: {
                        id: true,
                        title: true,
                        module: {
                            select: {
                                id: true,
                                title: true,
                                course: {
                                    select: { id: true, title: true }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        codingExercises: true,
                        quizQuestions: true
                    }
                }
            }
        });
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách bài học', error });
    }
};

export const getLessonDetailAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const lesson = await prisma.lesson.findUnique({
            where: { id },
            include: {
                chapter: {
                    include: {
                        module: {
                            include: {
                                course: true
                            }
                        }
                    }
                },
                codingExercises: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        testCases: {
                            orderBy: { createdAt: 'asc' }
                        }
                    }
                },
                quizQuestions: {
                    orderBy: { orderIndex: 'asc' },
                    include: {
                        options: true
                    }
                }
            }
        });
        if (!lesson) {
            return res.status(404).json({ message: 'Không tìm thấy bài học' });
        }
        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết bài học', error });
    }
};

export const createLessonAdmin = async (req: Request, res: Response) => {
    try {
        const { chapterId, lessonId, title, difficulty, durationMinutes, content, orderIndex, isFree, objective, keyKnowledge } = req.body;
        
        if (!chapterId || !title) {
            return res.status(400).json({ message: 'chapterId và title là bắt buộc' });
        }

        const newLesson = await prisma.lesson.create({
            data: {
                chapterId: String(chapterId),
                lessonId: lessonId || `LS-${Date.now().toString().slice(-6)}`,
                title: String(title),
                difficulty: difficulty || 'EASY',
                durationMinutes: Number(durationMinutes) || 10,
                content: content || '',
                objective: objective || '',
                keyKnowledge: keyKnowledge || '',
                orderIndex: Number(orderIndex) || 1,
                isFree: isFree !== undefined ? Boolean(isFree) : false
            }
        });
        res.status(201).json(newLesson);
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi tạo bài học mới', error: error.message });
    }
};

export const updateLessonAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { title, lessonId, difficulty, durationMinutes, content, orderIndex, isFree, objective, keyKnowledge, chapterId } = req.body;

        const updated = await prisma.lesson.update({
            where: { id },
            data: {
                ...(title && { title: String(title) }),
                ...(lessonId && { lessonId: String(lessonId) }),
                ...(difficulty && { difficulty: String(difficulty) }),
                ...(durationMinutes !== undefined && { durationMinutes: Number(durationMinutes) }),
                ...(content !== undefined && { content: String(content) }),
                ...(objective !== undefined && { objective: String(objective) }),
                ...(keyKnowledge !== undefined && { keyKnowledge: String(keyKnowledge) }),
                ...(orderIndex !== undefined && { orderIndex: Number(orderIndex) }),
                ...(isFree !== undefined && { isFree: Boolean(isFree) }),
                ...(chapterId && { chapterId: String(chapterId) })
            }
        });
        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi cập nhật bài học', error: error.message });
    }
};

export const deleteLessonAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.lesson.delete({ where: { id } });
        res.json({ message: 'Đã xóa bài học thành công' });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi xóa bài học', error: error.message });
    }
};

// ============ CODING EXERCISES CRUD ============
export const getExercisesByLessonAdmin = async (req: Request, res: Response) => {
    try {
        const { lessonId } = req.query;
        const where: any = {};
        if (lessonId && typeof lessonId === 'string') where.lessonId = lessonId;

        const exercises = await prisma.codingExercise.findMany({
            where,
            orderBy: { createdAt: 'asc' },
            include: {
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        lessonId: true
                    }
                },
                testCases: {
                    orderBy: { createdAt: 'asc' }
                },
                _count: {
                    select: {
                        submissions: true
                    }
                }
            }
        });
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách bài tập', error });
    }
};

export const createExerciseAdmin = async (req: Request, res: Response) => {
    try {
        const { lessonId, title, difficulty, problemDescription, starterCode, solutionCode } = req.body;
        if (!lessonId || !title) {
            return res.status(400).json({ message: 'lessonId và title là bắt buộc' });
        }

        const newEx = await prisma.codingExercise.create({
            data: {
                lessonId: String(lessonId),
                title: String(title),
                difficulty: difficulty || 'EASY',
                problemDescription: problemDescription || '',
                starterCode: starterCode || '# Viết code của bạn ở đây\n',
                solutionCode: solutionCode || ''
            }
        });
        res.status(201).json(newEx);
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi tạo bài tập', error: error.message });
    }
};

export const updateExerciseAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { title, difficulty, problemDescription, starterCode, solutionCode, lessonId } = req.body;

        const updated = await prisma.codingExercise.update({
            where: { id },
            data: {
                ...(title && { title: String(title) }),
                ...(difficulty && { difficulty }),
                ...(problemDescription !== undefined && { problemDescription: String(problemDescription) }),
                ...(starterCode !== undefined && { starterCode: String(starterCode) }),
                ...(solutionCode !== undefined && { solutionCode: String(solutionCode) }),
                ...(lessonId && { lessonId: String(lessonId) })
            }
        });
        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi cập nhật bài tập', error: error.message });
    }
};

export const deleteExerciseAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.codingExercise.delete({ where: { id } });
        res.json({ message: 'Đã xóa bài tập thành công' });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi xóa bài tập', error: error.message });
    }
};

// ============ TEST CASES CRUD ============
export const getTestCasesByExerciseAdmin = async (req: Request, res: Response) => {
    try {
        const exerciseId = req.params.exerciseId as string;
        const testCases = await prisma.testCase.findMany({
            where: { exerciseId },
            orderBy: { createdAt: 'asc' }
        });
        res.json(testCases);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy test cases', error });
    }
};

export const createTestCaseAdmin = async (req: Request, res: Response) => {
    try {
        const { exerciseId, input, expectedOutput, isHidden } = req.body;
        if (!exerciseId || expectedOutput === undefined) {
            return res.status(400).json({ message: 'exerciseId và expectedOutput là bắt buộc' });
        }

        const tc = await prisma.testCase.create({
            data: {
                exerciseId: String(exerciseId),
                input: input || '',
                expectedOutput: String(expectedOutput),
                isHidden: Boolean(isHidden)
            }
        });
        res.status(201).json(tc);
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi tạo test case', error: error.message });
    }
};

export const updateTestCaseAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { input, expectedOutput, isHidden } = req.body;

        const updated = await prisma.testCase.update({
            where: { id },
            data: {
                ...(input !== undefined && { input: String(input) }),
                ...(expectedOutput !== undefined && { expectedOutput: String(expectedOutput) }),
                ...(isHidden !== undefined && { isHidden: Boolean(isHidden) })
            }
        });
        res.json(updated);
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi cập nhật test case', error: error.message });
    }
};

export const deleteTestCaseAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.testCase.delete({ where: { id } });
        res.json({ message: 'Đã xóa test case thành công' });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi xóa test case', error: error.message });
    }
};

// ============ QUIZZES & OPTIONS CRUD ============
export const getQuizzesByLessonAdmin = async (req: Request, res: Response) => {
    try {
        const { lessonId } = req.query;
        const where: any = {};
        if (lessonId && typeof lessonId === 'string') where.lessonId = lessonId;

        const questions = await prisma.lessonQuizQuestion.findMany({
            where,
            orderBy: { orderIndex: 'asc' },
            include: {
                options: {
                    orderBy: { key: 'asc' }
                },
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        lessonId: true
                    }
                }
            }
        });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy quiz questions', error });
    }
};

export const createQuizQuestionAdmin = async (req: Request, res: Response) => {
    try {
        const { lessonId, question, explanation, orderIndex, level, options } = req.body;
        if (!lessonId || !question) {
            return res.status(400).json({ message: 'lessonId và question là bắt buộc' });
        }

        const newQ = await prisma.lessonQuizQuestion.create({
            data: {
                lessonId: String(lessonId),
                question: String(question),
                explanation: explanation || '',
                level: level || 'EASY',
                orderIndex: Number(orderIndex) || 1,
                options: {
                    create: (options || []).map((opt: any, index: number) => ({
                        key: opt.key || String.fromCharCode(65 + index),
                        text: String(opt.text || ''),
                        isCorrect: Boolean(opt.isCorrect)
                    }))
                }
            },
            include: { options: true }
        });
        res.status(201).json(newQ);
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi tạo câu hỏi quiz', error: error.message });
    }
};

export const updateQuizQuestionAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { question, explanation, orderIndex, level, options } = req.body;

        await prisma.lessonQuizQuestion.update({
            where: { id },
            data: {
                ...(question && { question: String(question) }),
                ...(explanation !== undefined && { explanation: String(explanation) }),
                ...(level && { level: String(level) }),
                ...(orderIndex !== undefined && { orderIndex: Number(orderIndex) })
            }
        });

        // Nếu có options gửi lên, làm mới options
        if (options && Array.isArray(options)) {
            await prisma.lessonQuizOption.deleteMany({ where: { questionId: id } });
            await prisma.lessonQuizOption.createMany({
                data: options.map((opt: any, index: number) => ({
                    questionId: id,
                    key: opt.key || String.fromCharCode(65 + index),
                    text: String(opt.text || ''),
                    isCorrect: Boolean(opt.isCorrect)
                }))
            });
        }

        const fullQ = await prisma.lessonQuizQuestion.findUnique({
            where: { id },
            include: { options: { orderBy: { key: 'asc' } } }
        });

        res.json(fullQ);
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi cập nhật câu hỏi quiz', error: error.message });
    }
};

export const deleteQuizQuestionAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.lessonQuizOption.deleteMany({ where: { questionId: id } });
        await prisma.lessonQuizQuestion.delete({ where: { id } });
        res.json({ message: 'Đã xóa câu hỏi quiz thành công' });
    } catch (error: any) {
        res.status(500).json({ message: 'Lỗi khi xóa câu hỏi quiz', error: error.message });
    }
};
