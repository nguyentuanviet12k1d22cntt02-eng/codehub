import type React from 'react';
import { ArrowUpRight, BookOpen, Clock3, Star, Users } from 'lucide-react';
import pythonImg from '../../../assets/python.jpg';
import sqlImg from '../../../assets/SQL.jpg';
import cppImg from '../../../assets/C++.jpg';
import jsImg from '../../../assets/javascript.jpg';

export interface Course {
    id: string;
    title: string;
    description: string;
    level?: string;
    rating?: string;
    students?: string;
    duration?: string;
    lessonsCount?: number;
    thumbnail?: string;
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

    const fallbackImage = isPython ? pythonImg : isSql ? sqlImg : isCpp ? cppImg : jsImg;
    const imageSrc = course.thumbnailUrl || course.thumbnail || fallbackImage;
    const courseMeta = [
        course.students ? { icon: Users, label: course.students } : null,
        course.lessonsCount ? { icon: BookOpen, label: `${course.lessonsCount} bài` } : null,
        course.duration ? { icon: Clock3, label: course.duration } : null,
    ].filter(Boolean) as Array<{ icon: typeof Users; label: string }>;

    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-border-custom bg-bg-secondary text-left shadow-[0_16px_45px_-36px_rgba(15,23,42,0.75)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-border hover:shadow-[0_24px_55px_-34px_rgba(79,70,229,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-custom focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary motion-reduce:transform-none"
        >
            <div className={`relative h-44 w-full overflow-hidden ${isJs ? 'bg-[#17151b]' : 'bg-white'}`}>
                <img
                    src={imageSrc}
                    alt=""
                    className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none ${isSql || isCpp ? 'object-contain p-3' : 'object-cover'}`}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-70" aria-hidden="true" />
                <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-slate-950/50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.11em] text-white backdrop-blur-md">
                    {course.level || 'Khóa học'}
                </span>
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-slate-950/40 text-white backdrop-blur-md transition-all duration-200 group-hover:bg-accent-custom">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        Miễn phí
                    </span>
                    {course.rating && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-text-secondary">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                            {course.rating}
                        </span>
                    )}
                </div>

                <h3 className="line-clamp-2 text-[15px] font-extrabold leading-5 text-text-primary transition-colors group-hover:text-accent-custom">
                    {course.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-text-tertiary">{course.description}</p>

                <div className="mt-auto pt-5">
                    {courseMeta.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border-custom pt-4 text-[10px] font-semibold text-text-tertiary">
                            {courseMeta.map(({ icon: Icon, label }) => (
                                <span key={label} className="inline-flex items-center gap-1.5">
                                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                    {label}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-between border-t border-border-custom pt-4 text-[11px] font-bold text-accent-custom">
                            Xem nội dung khóa học
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
};
