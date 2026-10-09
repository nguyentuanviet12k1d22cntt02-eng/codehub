export interface InteractionTelemetry {
    sessionId: string | null;
    openedAt: Date | null;
    activeTimeSeconds: number | null;
    hintCount: number;
}

function boundedInteger(value: unknown, maximum: number): number | null {
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= maximum ? parsed : null;
}

/**
 * Treat browser telemetry as optional context, never as the correctness label.
 * Bounds prevent a stale tab or forged payload from polluting the dataset.
 */
export function parseInteractionTelemetry(value: unknown): InteractionTelemetry {
    const input = value && typeof value === 'object' && !Array.isArray(value)
        ? value as Record<string, unknown>
        : {};
    const sessionId = typeof input.sessionId === 'string' && input.sessionId.trim().length > 0
        && input.sessionId.length <= 128 ? input.sessionId.trim() : null;
    const parsedOpenedAt = typeof input.openedAt === 'string' ? new Date(input.openedAt) : null;
    const openedAt = parsedOpenedAt && Number.isFinite(parsedOpenedAt.getTime())
        && parsedOpenedAt.getTime() <= Date.now() + 5 * 60 * 1000 ? parsedOpenedAt : null;
    return {
        sessionId,
        openedAt,
        activeTimeSeconds: boundedInteger(input.activeTimeSeconds, 24 * 60 * 60),
        hintCount: boundedInteger(input.hintCount, 1000) ?? 0,
    };
}
