import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LessonFooterActionsProps {
    lessonId: string;
    lessonCode?: string;
    hasQuiz: boolean;
    quizCount: number;
    hasExercise: boolean;
    roadmapId?: string | null;
    onCompleteWithoutExercise: () => void;
}

export const LessonFooterActions: React.FC<LessonFooterActionsProps> = ({
    lessonId,
    lessonCode,
    hasQuiz,
    quizCount,
    hasExercise,
    roadmapId,
    onCompleteWithoutExercise,
}) => {
    const navigate = useNavigate();

    if (hasQuiz && hasExercise) {
        return <div className="grid gap-3 sm:grid-cols-2">
            <button className="min-h-11 rounded-xl bg-accent-custom px-4 text-sm font-semibold text-white hover:bg-accent-hover" onClick={() => navigate(`/quiz/${lessonId}${roadmapId ? `?roadmapId=${roadmapId}` : ''}`)}>Làm trắc nghiệm củng cố ({quizCount} câu)</button>
            <button className="min-h-11 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700" onClick={() => navigate(`/practice/${lessonId}${roadmapId ? `?roadmapId=${roadmapId}` : ''}`)}>Làm bài tập code để hoàn thành</button>
        </div>;
    }

    if (hasQuiz) {
        return (
            <button
                className="bg-accent-custom hover:bg-accent-hover text-white py-3.5 rounded-xl text-sm font-semibold cursor-pointer active:scale-95 transition-all w-full border-none shadow-md flex items-center justify-center gap-2"
                onClick={() => navigate(`/quiz/${lessonId}${roadmapId ? `?roadmapId=${roadmapId}` : ''}`)}
            >
                <span>Bắt đầu làm trắc nghiệm củng cố ({quizCount} câu)</span>
                <span>➔</span>
            </button>
        );
    }

    if (hasExercise) {
        return (
            <button
                className="bg-accent-custom hover:bg-accent-hover text-white py-3.5 rounded-xl text-sm font-semibold cursor-pointer active:scale-95 transition-all w-full border-none shadow-md flex items-center justify-center gap-2"
                onClick={() => {
                    if (lessonCode === 'LS-01.MP') {
                        navigate(`/module-practice/MOD-01/${lessonId}${roadmapId ? `?roadmapId=${roadmapId}` : ''}`);
                    } else {
                        navigate(`/practice/${lessonId}${roadmapId ? `?roadmapId=${roadmapId}` : ''}`);
                    }
                }}
            >
                <span>Chuyển sang làm bài tập thực hành code</span>
                <span>➔</span>
            </button>
        );
    }

    return (
        <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl text-sm font-semibold cursor-pointer active:scale-95 transition-all w-full border-none shadow-md flex items-center justify-center gap-2"
            onClick={onCompleteWithoutExercise}
        >
            <span>Hoàn thành bài học này</span>
            <span>✔</span>
        </button>
    );
};
