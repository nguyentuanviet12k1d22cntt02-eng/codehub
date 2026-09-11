export interface TestCaseMock {
    id: string;
    input: string;
    expectedOutput: string;
    actualOutput?: string;
    passed?: boolean;
}

export interface ExerciseMock {
    id: string;
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    problemDescription: string;
    starterCode: string;
    testCases: TestCaseMock[];
}

export interface SubmitStats {
    runtimeMs: number;
    runtimeBeats: number;
    distribution: { range: string; count: number }[];
}

export interface SubmissionItem {
    id: string;
    code: string;
    language: string;
    status: 'PASSED' | 'FAILED' | 'PENDING';
    runtime?: number | null;
    submittedAt: string;
}
