import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CourseSidebarProps {
    firstLessonId?: string;
    totalDuration: number;
    totalLessons: number;
    level: string;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
    firstLessonId,
    totalDuration,
    totalLessons,
    level,
}) => {
    const navigate = useNavigate();

    return (
        <div className="w-full lg:w-[30%] lg:sticky lg:top-[90px] self-start">
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-6 flex flex-col gap-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-border-custom pb-4">
                    <span className="text-xs text-text-tertiary">Giá khóa học:</span>
                    <span className="text-xl font-bold text-[#ff9f0a]">Miễn phí</span>
                </div>

                <button
                    className="bg-accent-custom hover:bg-accent-hover text-white dark:bg-white dark:text-black font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-[0.98] text-sm text-center flex items-center justify-center gap-2 border-none w-full shadow-md"
                    onClick={() => {
                        if (firstLessonId) {
                            navigate(`/lesson/${firstLessonId}`);
                        } else {
                            navigate('/dashboard');
                        }
                    }}
                >
                    Bắt đầu học ngay &rarr;
                </button>

                <div className="flex flex-col gap-3.5">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-text-tertiary">Thời lượng:</span>
                        <span className="text-text-primary font-medium">{totalDuration} phút</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-text-tertiary">Số bài học:</span>
                        <span className="text-text-primary font-medium">{totalLessons} bài</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-text-tertiary">Cấp độ học:</span>
                        <span className="text-text-primary font-medium">{level}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-text-tertiary">Hình thức:</span>
                        <span className="text-text-primary font-medium">Học trực tuyến</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
