import { Course } from "@prisma/client";
import { NextFunction, Request, response, Response } from "express";
import { prisma } from "../config/prisma";

export const getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courses = await prisma.course.findMany({
            where: { status: "PUBLISHED" }
        })

        res.status(200).json(courses)

    } catch (error) {
        next(error)
    }
}

export const getCourseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params

        // Kiểm tra định dạng UUID trước khi truy vấn để tránh lỗi cơ sở dữ liệu
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id as string)) {
            res.status(400).json({ message: "ID khóa học không đúng định dạng UUID" });
            return;
        }

        const course = await prisma.course.findUnique({
            where: { id: id as string }, // ID kiểu UUID
            include: {
                modules: {
                    orderBy: {
                        orderIndex: 'asc'
                    },
                    include: {
                        chapters: {
                            orderBy: {
                                orderIndex: 'asc' // Sắp xếp chương theo thứ tự
                            },
                            include: {
                                lessons: {
                                    orderBy: {
                                        orderIndex: 'asc' // Sắp xếp bài học theo thứ tự
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        if (!course) {
            res.status(404).json({ message: "Không tìm thấy khóa học" })
            return
        }

        // Lấy tiến độ hoàn thành bài học của học viên nếu đã đăng nhập
        let completedLessonIds: Set<string> = new Set();
        const userId = (req as any).user?.id;
        if (userId) {
            const progressList = await prisma.lessonProgress.findMany({
                where: {
                    userId: userId,
                    isCompleted: true
                },
                select: {
                    lessonId: true
                }
            });
            completedLessonIds = new Set(progressList.map(p => p.lessonId));
        }

        const formattedModules = course.modules.map(mod => ({
            ...mod,
            chapters: mod.chapters.map(ch => ({
                ...ch,
                lessons: ch.lessons.map(l => ({
                    ...l,
                    isCompleted: completedLessonIds.has(l.id)
                }))
            }))
        }));

        res.status(200).json({
            ...course,
            modules: formattedModules
        });

    } catch (error) {
        next(error);
    }

}

export const getLessonById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id as string)) {
            res.status(400).json({ message: "ID bài học không đúng định dạng UUID" });
            return;
        }

        const lesson = await prisma.lesson.findUnique({
            where: { id: id as string },
            include: {
                codingExercises: {
                    include: {
                        testCases: {
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                }
            }
        });

        if (!lesson) {
            res.status(404).json({ message: "Không tìm thấy bài học" });
            return;
        }

        // Lấy thông tin chapter, module, course để duyệt cây bài học tìm bài tiếp theo
        const currentChapter = await prisma.chapter.findUnique({
            where: { id: lesson.chapterId },
            include: {
                module: {
                    include: {
                        course: {
                            include: {
                                modules: {
                                    orderBy: { orderIndex: 'asc' },
                                    include: {
                                        chapters: {
                                            orderBy: { orderIndex: 'asc' },
                                            include: {
                                                lessons: {
                                                    orderBy: { orderIndex: 'asc' }
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
        });

        // Tập hợp tất cả lessons của khóa học theo đúng thứ tự
        const allLessons: any[] = [];
        if (currentChapter?.module?.course?.modules) {
            for (const mod of currentChapter.module.course.modules) {
                for (const chap of mod.chapters) {
                    for (const les of chap.lessons) {
                        allLessons.push(les);
                    }
                }
            }
        }

        // Tìm vị trí của bài học hiện tại và lấy ID bài tiếp theo
        const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
        const nextLesson = currentIndex !== -1 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

        res.status(200).json({
            ...lesson,
            nextLessonId: nextLesson ? nextLesson.id : null
        });
    } catch (error) {
        next(error);
    }
};

export const completeLesson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string;
        const userId = (req as any).user?.id as string;

        if (!userId) {
            res.status(401).json({ message: "Người dùng chưa đăng nhập" });
            return;
        }

        const progress = await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId: id
                }
            },
            update: {
                isCompleted: true,
                completedAt: new Date()
            },
            create: {
                userId,
                lessonId: id,
                isCompleted: true,
                completedAt: new Date()
            }
        });

        res.status(200).json({ success: true, progress });
    } catch (error) {
        next(error);
    }
};