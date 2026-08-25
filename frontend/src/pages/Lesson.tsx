import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { authService } from '../services/authService';
import { API_BASE_URL } from '../config/api';
import type { DBLessonDetail } from '../components/lesson/types';
import { LessonHeader } from '../components/lesson/LessonHeader';
import { LessonMeta } from '../components/lesson/LessonMeta';
import { LessonContentRenderer } from '../components/lesson/LessonContentRenderer';
import { LessonFooterActions } from '../components/lesson/LessonFooterActions';

const Lesson: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 1. Lấy dữ liệu bài học lý thuyết
    const { data: lesson, isLoading: loadingLesson, error } = useQuery<DBLessonDetail>({
        queryKey: ['lesson', id],
        queryFn: () => authService.getLessonDetail(id!),
        enabled: !!id,
    });

    // 2. Lấy thông tin trắc nghiệm từ Database
    const { data: quizData } = useQuery({
        queryKey: ['lesson-quiz', id],
        queryFn: () => authService.getLessonQuiz(id!),
        enabled: !!id,
    });

    const quizQuestions = quizData?.questions || [];
    const hasQuiz = quizQuestions.length > 0;
    const hasExercise = !!(lesson?.codingExercises && lesson.codingExercises.length > 0);

    const handleCompleteWithoutExercise = async () => {
        if (!lesson) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_BASE_URL}/api/auth/lessons/${id}/complete`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            queryClient.invalidateQueries();
            if (lesson.nextLessonId) {
                navigate(`/lesson/${lesson.nextLessonId}`);
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            console.error('Lỗi hoàn thành bài học:', err);
            navigate('/dashboard');
        }
    };

    if (loadingLesson) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-accent-custom border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-text-tertiary">Đang tải lý thuyết bài học...</span>
                </div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="bg-bg-primary text-text-primary min-h-screen flex flex-col items-center justify-center gap-4 font-sans">
                <span className="text-sm text-rose-400">⚠️ {error ? (error as any).response?.data?.message || (error as any).message : 'Không tìm thấy thông tin bài học'}</span>
                <Link to="/dashboard" className="text-xs text-accent-custom hover:underline">
                    Quay lại Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-bg-primary text-text-primary min-h-screen w-full relative flex flex-col font-sans select-none transition-colors duration-200">
            {/* 1. Header */}
            <LessonHeader lessonTitle={lesson.title} />

            {/* 2. Main Reading Content */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-10 flex justify-center">
                <div className="w-full max-w-[800px] flex flex-col gap-6 text-left select-text">
                    {/* Header meta (Title, Reading time) */}
                    <LessonMeta
                        title={lesson.title}
                        durationMinutes={lesson.durationMinutes}
                    />

                    <hr className="border-border-custom m-0" />

                    {/* Markdown Body */}
                    <LessonContentRenderer content={lesson.content || ''} />

                    <div className="h-2"></div>

                    {/* Bottom CTA Action Button */}
                    <LessonFooterActions
                        lessonId={id!}
                        lessonCode={lesson.lessonId}
                        hasQuiz={hasQuiz}
                        quizCount={quizQuestions.length}
                        hasExercise={hasExercise}
                        onCompleteWithoutExercise={handleCompleteWithoutExercise}
                    />
                </div>
            </main>
        </div>
    );
};

export default Lesson;
