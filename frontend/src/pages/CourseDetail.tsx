import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { DBCourse } from '../components/course-detail/types';
import { CourseDetailHeader } from '../components/course-detail/CourseDetailHeader';
import { CourseHero } from '../components/course-detail/CourseHero';
import { CourseOverview } from '../components/course-detail/CourseOverview';
import { CourseCurriculum } from '../components/course-detail/CourseCurriculum';
import { CourseSidebar } from '../components/course-detail/CourseSidebar';

// Giải mã JWT để hiển thị Header đồng bộ
const decodeToken = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('Học viên');

    // Nạp dữ liệu chi tiết khóa học bằng React Query
    const { data: course, isLoading, error } = useQuery<DBCourse>({
        queryKey: ['course', id],
        queryFn: () => authService.getCourseDetail(id!),
        enabled: !!id,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.username) {
                setUsername(decoded.username);
            }
        }
    }, [id, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="text-text-primary text-center py-24 bg-bg-primary min-h-screen flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-accent-custom border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-text-tertiary">Đang tải thông tin khóa học...</span>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="text-text-primary text-center py-24 bg-bg-primary min-h-screen flex flex-col justify-center items-center gap-4 font-sans">
                <p className="text-rose-400 text-sm">⚠️ {error ? (error as any).response?.data?.message || (error as any).message : 'Không tìm thấy khóa học yêu cầu'}</p>
                <button
                    className="bg-accent-custom hover:bg-accent-hover text-white dark:bg-white dark:text-black px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all border-none"
                    onClick={() => navigate('/dashboard')}
                >
                    Quay lại Dashboard
                </button>
            </div>
        );
    }

    // Tính tổng số bài học và tổng thời lượng
    const totalLessons = course.modules.reduce((sum, mod) =>
        sum + mod.chapters.reduce((cSum, ch) => cSum + ch.lessons.length, 0), 0
    );
    const totalDuration = course.modules.reduce((sum, mod) =>
        sum + mod.chapters.reduce((cSum, ch) =>
            cSum + ch.lessons.reduce((lSum, l) => lSum + (l.durationMinutes || 0), 0), 0
        ), 0
    );

    const firstLessonId = course.modules?.[0]?.chapters?.[0]?.lessons?.[0]?.id;

    return (
        <div className="bg-bg-primary text-text-primary min-h-screen w-full relative overflow-hidden flex flex-col font-sans select-none transition-colors duration-200">
            {/* 1. Header & Breadcrumb */}
            <CourseDetailHeader
                courseTitle={course.title}
                username={username}
                onLogout={handleLogout}
            />

            {/* 2. Main Content */}
            <main className="flex-1 px-6 py-8 md:px-10 max-w-[1200px] mx-auto w-full box-border flex flex-col lg:flex-row gap-8 text-left">
                {/* Cột trái: Nội dung khóa học (Hero, Tổng quan, Lộ trình) */}
                <div className="flex-1 flex flex-col gap-8 lg:max-w-[70%] w-full">
                    <CourseHero
                        title={course.title}
                        level={course.level}
                        totalDuration={totalDuration}
                    />

                    <CourseOverview description={course.description} />

                    <CourseCurriculum modules={course.modules} />
                </div>

                {/* Cột phải: Sticky Sidebar đăng ký & Thông tin */}
                <CourseSidebar
                    firstLessonId={firstLessonId}
                    totalDuration={totalDuration}
                    totalLessons={totalLessons}
                    level={course.level}
                />
            </main>
        </div>
    );
};

export default CourseDetail;
