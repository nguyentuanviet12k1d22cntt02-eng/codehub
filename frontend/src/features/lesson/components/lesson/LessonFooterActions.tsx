import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LessonFooterActionsProps {
    lessonId: string;
    lessonCode?: string;
    hasQuiz: boolean;
    quizCount: number;
    hasExercise: boolean;
    onCompleteWithoutExercise: () => void;
}

export const LessonFooterActions: React.FC<LessonFooterActionsProps> = ({
    lessonId,
    lessonCode,
    hasQuiz,
    quizCount,
    hasExercise,
    onCompleteWithoutExercise,
}) => {
    const navigate = useNavigate();

    if (hasQuiz) {
        return (
            <button
                className="bg-accent-custom hover:bg-accent-hover text-white py-3.5 rounded-xl text-sm font-semibold cursor-pointer active:scale-95 transition-all w-full border-none shadow-md flex items-center justify-center gap-2"
                onClick={() => navigate(`/quiz/${lessonId}`)}
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
                        navigate(`/module-practice/MOD-01/${lessonId}`);
                    } else {
                        navigate(`/practice/${lessonId}`);
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
