import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// ============ ADVANCED ANALYTICS ============

export const getUserGrowthStats = async (req: Request, res: Response) => {
    try {
        const { days = 30 } = req.query;
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - Number(days));

        const users = await prisma.user.findMany({
            where: {
                createdAt: {
                    gte: daysAgo
                }
            },
            select: {
                createdAt: true,
                role: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Group by date
        const dailyStats = users.reduce((acc: any, user) => {
            const date = user.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = { total: 0, students: 0, teachers: 0, admins: 0 };
            }
            acc[date].total++;
            if (user.role === 'STUDENT') acc[date].students++;
            if (user.role === 'TEACHER') acc[date].teachers++;
            if (user.role === 'ADMIN') acc[date].admins++;
            return acc;
        }, {});

        res.json({
            period: `${days} days`,
            dailyStats: Object.entries(dailyStats).map(([date, stats]) => ({
                date,
                ...(stats as any)
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thống kê tăng trưởng user', error });
    }
};

export const getSubmissionStats = async (req: Request, res: Response) => {
    try {
        const { days = 7 } = req.query;
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - Number(days));

        const [submissions, practiceSubmissions] = await Promise.all([
            prisma.submission.groupBy({
                by: ['status', 'language'],
                where: {
                    submittedAt: { gte: daysAgo }
                },
                _count: { status: true }
            }),
            prisma.practiceSubmission.groupBy({
                by: ['status', 'language'],
                where: {
                    submittedAt: { gte: daysAgo }
                },
                _count: { status: true }
            })
        ]);

        const totalSubmissions = await prisma.submission.count({
            where: { submittedAt: { gte: daysAgo } }
        });

        const totalPracticeSubmissions = await prisma.practiceSubmission.count({
            where: { submittedAt: { gte: daysAgo } }
        });

        res.json({
            period: `${days} days`,
            overview: {
                totalSubmissions,
                totalPracticeSubmissions,
                total: totalSubmissions + totalPracticeSubmissions
            },
            byStatusAndLanguage: {
                submissions,
                practiceSubmissions
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thống kê submissions', error });
    }
};

export const getCourseEngagement = async (req: Request, res: Response) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                _count: {
                    select: {
                        enrollments: true,
                        modules: true
                    }
                }
            },
            orderBy: {
                enrollments: {
                    _count: 'desc'
                }
            },
            take: 10
        });

        const courseStats = await Promise.all(
            courses.map(async (course) => {
                const completionRate = await prisma.enrollment.count({
                    where: {
                        courseId: course.id,
                        user: {
                            certificates: {
                                some: {
                                    courseId: course.id
                                }
                            }
                        }
                    }
                });

                return {
                    id: course.id,
                    title: course.title,
                    level: course.level,
                    enrollments: course._count.enrollments,
                    modules: course._count.modules,
                    completionRate: course._count.enrollments > 0
                        ? Math.round((completionRate / course._count.enrollments) * 100)
                        : 0
                };
            })
        );

        res.json({
            topCourses: courseStats
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thống kê engagement', error });
    }
};

export const getTopPerformers = async (req: Request, res: Response) => {
    try {
        const { limit = 10 } = req.query;

        // Top by submissions
        const topBySubmissions = await prisma.user.findMany({
            take: Number(limit),
            select: {
                id: true,
                username: true,
                email: true,
                _count: {
                    select: {
                        submissions: true,
                        practiceSubmissions: true
                    }
                }
            },
            orderBy: [
                {
                    submissions: {
                        _count: 'desc'
                    }
                }
            ]
        });

        // Top by passed submissions
        const topByPassed = await prisma.user.findMany({
            take: Number(limit),
            select: {
                id: true,
                username: true,
                email: true,
                submissions: {
                    where: { status: 'PASSED' },
                    select: { id: true }
                },
                practiceSubmissions: {
                    where: { status: 'PASSED' },
                    select: { id: true }
                }
            }
        });

        const topByPassedFormatted = topByPassed
            .map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                passedCount: user.submissions.length + user.practiceSubmissions.length
            }))
            .sort((a, b) => b.passedCount - a.passedCount);

        res.json({
            topBySubmissions: topBySubmissions.map(user => ({
                ...user,
                totalSubmissions: user._count.submissions + user._count.practiceSubmissions
            })),
            topByPassed: topByPassedFormatted
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy top performers', error });
    }
};

export const getSystemHealth = async (req: Request, res: Response) => {
    try {
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const [
            activeUsers24h,
            activeUsers7d,
            submissions24h,
            failedSubmissions24h,
            newEnrollments24h
        ] = await Promise.all([
            prisma.user.count({
                where: {
                    OR: [
                        { submissions: { some: { submittedAt: { gte: last24h } } } },
                        { practiceSubmissions: { some: { submittedAt: { gte: last24h } } } }
                    ]
                }
            }),
            prisma.user.count({
                where: {
                    OR: [
                        { submissions: { some: { submittedAt: { gte: last7d } } } },
                        { practiceSubmissions: { some: { submittedAt: { gte: last7d } } } }
                    ]
                }
            }),
            prisma.submission.count({
                where: { submittedAt: { gte: last24h } }
            }),
            prisma.submission.count({
                where: {
                    submittedAt: { gte: last24h },
                    status: 'FAILED'
                }
            }),
            prisma.enrollment.count({
                where: { enrolledAt: { gte: last24h } }
            })
        ]);

        const errorRate = submissions24h > 0
            ? Math.round((failedSubmissions24h / submissions24h) * 100)
            : 0;

        res.json({
            activeUsers: {
                last24h: activeUsers24h,
                last7d: activeUsers7d
            },
            submissions: {
                last24h: submissions24h,
                errorRate: `${errorRate}%`
            },
            enrollments: {
                last24h: newEnrollments24h
            },
            health: errorRate < 30 ? 'good' : errorRate < 60 ? 'warning' : 'critical'
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy system health', error });
    }
};
