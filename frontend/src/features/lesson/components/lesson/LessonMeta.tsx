import React from 'react';

interface LessonMetaProps {
    title: string;
    durationMinutes: number | null;
}

export const LessonMeta: React.FC<LessonMetaProps> = ({ title, durationMinutes }) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-text-tertiary bg-bg-tertiary px-2.5 py-1 rounded-md border border-border-custom">
                    📖 Bài học lý thuyết
                </span>
                {durationMinutes && (
                    <span className="text-xs text-text-tertiary">
                        ⏱️ {durationMinutes} phút đọc
                    </span>
                )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mt-1 leading-snug">
                {title}
            </h1>
        </div>
    );
};
