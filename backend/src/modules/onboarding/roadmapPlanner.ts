import { PilotLesson } from './pythonBasicsLessonCatalog';
import type { PalnetAdvice } from './palnetRuntimeClient';

export interface SkillSignal {
  masteryScore: number | null;
  confidence: number;
  evidenceCount: number;
}

export interface PlannedLesson {
  lesson: PilotLesson;
  weakness: number | null;
  confidence: number | null;
  reason: string;
  effectivePolicy: 'WEAK_SKILL' | 'CURRICULUM_ORDER' | 'PALNET_ADVISORY';
  predictedCorrectness?: number | null;
  advisory?: PalnetAdvice;
}

/** Plans locked future lessons using the same weak-skill fallback as G4.
 * A planned prerequisite only determines order; it does not unlock a lesson.
 * Actual unlocking still requires the previous lesson to be completed. */
export function planPythonBasicsRoadmap(
  lessons: readonly PilotLesson[], completedLessonIds: ReadonlySet<string>,
  signals: Readonly<Record<string, SkillSignal>>,
  advisory?: PalnetAdvice,
): PlannedLesson[] {
  const remaining = new Map(lessons.filter(item => !completedLessonIds.has(item.lessonId))
    .map(item => [item.lessonId, item]));
  const planned = new Set(completedLessonIds);
  const hasEvidence = lessons.some(item => {
    const signal = signals[item.primarySkillId];
    return signal && signal.evidenceCount > 0 && signal.masteryScore !== null
      && Number.isFinite(signal.masteryScore) && signal.masteryScore >= 0 && signal.masteryScore <= 1
      && Number.isFinite(signal.confidence) && signal.confidence >= 0 && signal.confidence <= 1;
  });
  const hasModel = !!advisory?.modelVersion && advisory.historyCount > 0
    && lessons.every(item => {
      const p = advisory.probabilities[item.primarySkillId];
      return typeof p === 'number' && Number.isFinite(p) && p >= 0 && p <= 1;
    });
  const effectivePolicy = hasEvidence ? 'WEAK_SKILL' : 'CURRICULUM_ORDER';
  const result: PlannedLesson[] = [];
  while (remaining.size > 0) {
    const ready = [...remaining.values()].filter(item => item.prerequisiteLessonIds.every(id => planned.has(id)));
    if (ready.length === 0) throw new Error('LESSON_CATALOG_INVALID: Điều kiện tiên quyết tạo vòng hoặc thiếu bài.');
    const score = (item: PilotLesson): number => {
      if (!hasEvidence) return -1;
      const signal = signals[item.primarySkillId];
      if (!signal || signal.evidenceCount <= 0 || signal.masteryScore === null
        || !Number.isFinite(signal.masteryScore) || signal.masteryScore < 0 || signal.masteryScore > 1
        || !Number.isFinite(signal.confidence) || signal.confidence < 0 || signal.confidence > 1) return -1;
      return (1 - signal.masteryScore) * signal.confidence;
    };
    // A current-history proxy for a new code opportunity, not mastery or
    // expected learning gain. Prerequisites filter before model ranking.
    const rank = (item: PilotLesson) => hasModel ? advisory!.probabilities[item.primarySkillId] : score(item);
    ready.sort((a, b) => rank(b) - rank(a)
      || a.curriculumOrder - b.curriculumOrder || a.lessonId.localeCompare(b.lessonId));
    const chosen = ready[0];
    const signal = signals[chosen.primarySkillId];
    const verified = score(chosen) >= 0;
    result.push({
      lesson: chosen, weakness: verified ? score(chosen) : null,
      confidence: verified ? signal.confidence : null,
      effectivePolicy: hasModel ? 'PALNET_ADVISORY' : verified ? effectivePolicy : 'CURRICULUM_ORDER',
      predictedCorrectness: hasModel ? advisory!.probabilities[chosen.primarySkillId] : null,
      advisory,
      reason: hasModel
        ? 'Gợi ý PAL-Net thử nghiệm từ ' + advisory!.historyCount + ' lượt code đã chấm; luôn giữ điều kiện tiên quyết.'
        : verified
        ? `Kết quả Pre-test cho thấy kỹ năng ${chosen.primarySkillId} cần ưu tiên củng cố.`
        : `Chưa đủ bằng chứng cho kỹ năng ${chosen.primarySkillId}; theo thứ tự chương trình.`,
    });
    planned.add(chosen.lessonId);
    remaining.delete(chosen.lessonId);
  }
  return result;
}
