import type React from "react";
import pythonImg from "../../../assets/python.jpg";
import sqlImg from "../../../assets/SQL.jpg";
import cppImg from "../../../assets/C++.jpg";
import jsImg from "../../../assets/javascript.jpg";

export interface Course {
    id: string;
    title: string;
    description: string;
    level?: string;
    rating?: string;
    students?: string;
    duration?: string;
    lessonsCount?: number;
    thumbnailUrl?: string;
}

interface CourseCardProps {
    course: Course;
    onClick?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
    const isCpp = /c\+\+/i.test(course.title);
    const isSql = /sql/i.test(course.title);
    const isJs = /javascript|js\b/i.test(course.title);
    const isPython = !isCpp && !isSql && !isJs;

    // Sử dụng 4 hình ảnh người dùng đã cung cấp trong src/assets
    const imageSrc = isPython
        ? pythonImg
        : isSql
        ? sqlImg
        : isCpp
        ? cppImg
        : isJs
        ? jsImg
        : (course.thumbnailUrl || pythonImg);

    return (
        <div
            className="bg-white dark:bg-[#151D2E] border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col text-left hover:-translate-y-1 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md group"
            onClick={onClick}
        >
            {/* Thumbnail hình ảnh người dùng cung cấp từ src/assets */}
            <div className={`h-[150px] w-full relative overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800 ${
                isJs ? 'bg-[#18161b]' : 'bg-white'
            }`}>
                <img
                    src={imageSrc}
                    alt={course.title}
                    className={`w-full h-full ${
                        isSql || isCpp ? 'object-contain p-2.5' : 'object-cover'
                    } group-hover:scale-105 transition-transform duration-300`}
                    loading="lazy"
                />
            </div>
            {/* Thông tin chi tiết bên dưới - đồng bộ chữ đen */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-sm text-black dark:text-white line-clamp-2 mb-2 transition-colors">
                        {course.title}
                    </h4>
                    <div className="text-xs font-bold mb-2 text-black dark:text-slate-200">
                        Miễn phí
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span className="text-[#F7DF1E]">⭐⭐⭐⭐⭐</span>
                        <span className="text-[11px] ml-1 font-semibold text-black dark:text-slate-300">{course.rating || '5.0'}</span>
                    </div>
                </div>
                {/* Các chỉ số phụ */}
                <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-[10px] text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">👤 {course.students || '39'}</span>
                    <span className="flex items-center gap-1 font-medium">▶ {course.lessonsCount || '5'} bài học</span>
                    <span className="flex items-center gap-1 font-medium">🕒 {course.duration || '1h10p'}</span>
                </div>
            </div>
        </div>
    );
};