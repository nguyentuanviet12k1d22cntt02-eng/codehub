export interface PracticeDiagnostic {
    kind: 'syntax' | 'logic';
    line: number;
    column?: number;
    endLine?: number;
    endColumn?: number;
    message: string;
    source: 'SANDBOX' | 'AI';
}

export interface PracticeGuidance {
    tone: 'success' | 'thinking';
    title: string;
    location?: string;
    reason: string;
    hint: string;
    source: 'AI' | 'EVIDENCE';
    analysisKind?: 'syntax' | 'runtime' | 'constraint' | 'logic' | 'success' | 'system';
    diagnostic?: PracticeDiagnostic;
}

export function isPracticeGuidance(value: unknown): value is PracticeGuidance {
    if (!value || typeof value !== 'object') return false;
    const item = value as Record<string, unknown>;
    return (item.source === 'AI' || item.source === 'EVIDENCE')
        && (item.tone === 'success' || item.tone === 'thinking')
        && ['title', 'reason', 'hint'].every(key => typeof item[key] === 'string' && (item[key] as string).trim().length > 0);
}

/** A late response can never replace another submission's feedback. */
export function matchingPracticeGuidance(payload: { submissionId?: string; guidance?: unknown } | undefined,
    submissionId: string, requestId: number, currentRequestId: number): PracticeGuidance | null {
    return requestId === currentRequestId && payload?.submissionId === submissionId && isPracticeGuidance(payload.guidance)
        ? payload.guidance : null;
}
