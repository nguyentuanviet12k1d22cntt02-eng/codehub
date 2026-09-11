export interface DBLessonDetail {
    id: string;
    lessonId?: string;
    title: string;
    content: string | null;
    durationMinutes: number | null;
    isFree: boolean;
    isCompleted?: boolean;
    codingExercises?: any[];
    nextLessonId?: string | null;
}
