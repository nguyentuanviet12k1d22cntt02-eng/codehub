const RETRYABLE_TRANSACTION = /write conflict|deadlock|could not serialize/i;

function isRetryableTransactionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { code?: unknown; message?: unknown };
  return candidate.code === 'P2034'
    || (typeof candidate.message === 'string' && RETRYABLE_TRANSACTION.test(candidate.message));
}

/** Prisma recommends retrying P2034 because serialization conflicts and
 * deadlocks are transient. Roadmap sync is idempotent, so retrying is safe. */
export async function withRoadmapTransactionRetry<T>(
  operation: () => Promise<T>,
  options: { maxRetries?: number; baseDelayMs?: number } = {},
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 25;
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isRetryableTransactionError(error)) throw error;
      if (attempt >= maxRetries) {
        throw new Error('ROADMAP_SYNC_BUSY: Tiến độ đang được cập nhật. Vui lòng thử lại sau vài giây.');
      }
      const delayMs = Math.min(baseDelayMs * (2 ** attempt), 200);
      if (delayMs > 0) await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}
