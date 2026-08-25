export interface DBLesson {
    id: string;
    lessonId?: string;
    title: string;
    durationMinutes: number | null;
    isFree: boolean;
    isCompleted?: boolean;
    objective?: string | null;
}

export interface DBChapter {
    id: string;
    title: string;
    lessons: DBLesson[];
}

export interface DBModule {
    id: string;
    title: string;
    chapters: DBChapter[];
}

export interface DBCourse {
    id: string;
    title: string;
    description: string | null;
    level: string;
    modules: DBModule[];
}
