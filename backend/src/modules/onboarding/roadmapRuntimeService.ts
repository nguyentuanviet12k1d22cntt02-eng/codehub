import { Prisma } from '@prisma/client';
import { prisma } from '../../infrastructure/database/prisma';
import { RoadmapDto, SupportedLanguage } from '../../shared/types/roadmapContracts';
import { getLanguageGraphConfig } from './onboardingConfig';
import { loadPythonBasicsPilotCatalog, PilotCatalog } from './pythonBasicsLessonCatalog';
import { planPythonBasicsRoadmap, PlannedLesson, SkillSignal } from './roadmapPlanner';
import { verifiedPythonBasicsCompletions, VerifiedLessonCompletion } from './roadmapCompletionEvidence';
import { withRoadmapTransactionRetry } from './roadmapTransactionRetry';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const detail = { items: { orderBy: { orderIndex: 'asc' as const } } };

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function signalsFromAssessment(raw: unknown, language: string, goalId: string, graphVersion: string): Record<string, SkillSignal> {
  if (!record(raw) || !record(raw.profile)) throw new Error('ASSESSMENT_EVIDENCE_INVALID: Thiếu hồ sơ đã chấm.');
  const profile = raw.profile;
  if (profile.language !== language || profile.goalId !== goalId || profile.graphVersion !== graphVersion
    || !record(profile.skills)) throw new Error('ASSESSMENT_EVIDENCE_SCOPE_MISMATCH: Hồ sơ kỹ năng không khớp bài kiểm tra.');
  const output: Record<string, SkillSignal> = {};
  for (const [skillId, value] of Object.entries(profile.skills)) {
    if (!record(value)) continue;
    const masteryScore = value.masteryScore;
    const confidence = value.confidence;
    const evidenceCount = value.evidenceCount;
    if ((masteryScore === null || (typeof masteryScore === 'number' && masteryScore >= 0 && masteryScore <= 1))
      && typeof confidence === 'number' && confidence >= 0 && confidence <= 1
      && Number.isInteger(evidenceCount) && Number(evidenceCount) >= 0) {
      output[skillId] = { masteryScore: masteryScore as number | null, confidence, evidenceCount: Number(evidenceCount) };
    }
  }
  return output;
}

function serialize(roadmap: any): RoadmapDto {
  return {
    id: roadmap.id, assessmentId: roadmap.assessmentId,
    language: roadmap.language as SupportedLanguage, goalId: roadmap.goalId,
    graphVersion: roadmap.graphVersion, profileVersion: roadmap.profileVersion,
    policyVersion: roadmap.policyVersion, mappingVersion: roadmap.mappingVersion,
    catalogVersion: roadmap.catalogVersion, title: roadmap.title,
    description: roadmap.description, status: roadmap.status,
    totalItems: roadmap.totalItems, completedItems: roadmap.completedItems,
    items: roadmap.items.map((item: any) => ({
      id: item.id, orderIndex: item.orderIndex, lessonId: item.lessonId,
      contentId: item.contentId, skillId: item.skillId, title: item.title,
      objective: item.objective, reason: item.reason,
      prerequisiteSkillIds: item.prerequisiteSkillIds,
      estimatedMinutes: item.estimatedMinutes, learningStatus: item.learningStatus,
      contentStatus: item.contentStatus, theoryCompleted: item.theoryCompleted,
      quizScore: item.quizScore, practicalPassed: item.practicalPassed,
      startedAt: item.startedAt?.toISOString() ?? null,
      completedAt: item.completedAt?.toISOString() ?? null,
    })),
  };
}

function roadmapItemData(
  plan: readonly PlannedLesson[],
  completedLessonIds: ReadonlySet<string>,
  completionProof: ReadonlyMap<string, VerifiedLessonCompletion>,
  assessmentId: string,
  catalog: PilotCatalog,
) {
  const firstIncompleteIndex = plan.findIndex(item => !completedLessonIds.has(item.lesson.lessonId));
  return plan.map((item, index) => {
    const proof = completionProof.get(item.lesson.lessonId);
    const learningStatus = proof ? 'COMPLETED' as const
      : index === firstIncompleteIndex ? 'AVAILABLE' as const : 'LOCKED' as const;
    return {
      orderIndex: index + 1, lessonId: item.lesson.lessonId,
      skillId: item.lesson.primarySkillId, title: item.lesson.title,
      objective: `Củng cố ${item.lesson.primarySkillId} qua nội dung bài học đã phát hành.`,
      reason: item.reason, estimatedMinutes: Math.max(1, item.lesson.estimatedMinutes),
      learningStatus, contentStatus: 'READY' as const, contentId: item.lesson.contentId,
      completedAt: proof?.completedAt,
      completionEvidence: proof ? {
        source: 'ALL_PASSED_SUBMISSIONS', lessonDbId: item.lesson.contentId,
        passedExerciseCount: proof.passedExerciseCount,
      } as Prisma.InputJsonValue : undefined,
      selectionEvidence: {
        source: item.weakness === null ? 'NO_SKILL_EVIDENCE' : 'PRETEST',
        assessmentId, policyVersion: catalog.policyVersion,
        effectivePolicy: item.effectivePolicy,
        fallback: item.weakness === null ? 'NO_VERIFIED_SKILL_EVIDENCE' : 'NO_COMPLETE_VALIDATED_IN_DOMAIN_SIGNALS',
        mappingVersion: catalog.mappingVersion, graphVersion: catalog.graphVersion,
        contentSha256: item.lesson.contentSha256, weakness: item.weakness,
        confidence: item.confidence, prerequisiteLessonIds: item.lesson.prerequisiteLessonIds,
        modelVersion: null,
      } as Prisma.InputJsonValue,
    };
  });
}

export class RoadmapRuntimeService {
  public async create(userId: string, assessmentId: string): Promise<RoadmapDto> {
    if (!UUID.test(assessmentId)) throw new Error('INVALID_ASSESSMENT_ID: Mã kết quả không hợp lệ.');
    const assessment = await prisma.pretestAssessment.findUnique({
      where: { id: assessmentId }, include: { attempt: { include: { survey: true } }, roadmaps: { include: detail } },
    });
    if (!assessment) throw new Error('ASSESSMENT_NOT_FOUND: Không tìm thấy kết quả Pre-test.');
    if (assessment.userId !== userId) throw new Error('FORBIDDEN: Không thể tạo lộ trình từ kết quả của người khác.');
    if (!['SUBMITTED', 'TIMED_OUT'].includes(assessment.attempt.status)
      || assessment.attempt.survey.isDraft
      || assessment.language !== 'PYTHON' || assessment.goalId !== 'GOAL_PY_BASICS') {
      throw new Error('ROADMAP_PILOT_UNAVAILABLE: Pilot lộ trình hiện chỉ hỗ trợ Python Basics đã chấm.');
    }
    const graph = getLanguageGraphConfig('PYTHON');
    if (assessment.graphVersion !== graph.graphVersion) throw new Error('GRAPH_VERSION_MISMATCH: Cần kiểm tra lại hồ sơ.');
    const catalog = await loadPythonBasicsPilotCatalog();
    const existing = assessment.roadmaps[0];
    if (existing) {
      if (existing.catalogSha256 !== catalog.catalogSha256 || existing.graphVersion !== catalog.graphVersion) {
        throw new Error('ROADMAP_VERSION_MISMATCH: Lộ trình cũ cần được rà soát lại.');
      }
      if (existing.items.length === 0) return this.sync(userId, existing.id);
      return serialize(existing);
    }
    const signals = signalsFromAssessment(assessment.rawAssessmentData, assessment.language, assessment.goalId, assessment.graphVersion);
    const verifiedCompletion = await verifiedPythonBasicsCompletions(userId, catalog.lessons);
    const completedLessonIds = new Set(verifiedCompletion.keys());
    // Keep the complete curriculum visible. Verified lessons are marked completed
    // instead of being removed from the roadmap.
    const plan = planPythonBasicsRoadmap(catalog.lessons, new Set(), signals);
    const firstIncomplete = plan.find(item => !completedLessonIds.has(item.lesson.lessonId));
    if (firstIncomplete && !firstIncomplete.lesson.prerequisiteLessonIds.every(id => completedLessonIds.has(id))) {
      throw new Error('ROADMAP_CONTRACT_VIOLATION: Bài mở đầu chưa đủ điều kiện tiên quyết.');
    }
    try {
      const created = await prisma.roadmap.create({
        data: {
          userId, language: 'PYTHON', goalId: catalog.goalId, assessmentId,
          graphVersion: catalog.graphVersion, profileVersion: assessment.profileVersion,
          policyVersion: catalog.policyVersion, mappingVersion: catalog.mappingVersion,
          catalogVersion: catalog.catalogVersion, catalogSha256: catalog.catalogSha256,
          title: 'Lộ trình Python Basics từ kết quả Pre-test',
          description: 'Thứ tự bài được chọn từ kết quả Pre-test và điều kiện tiên quyết. Bài sau mở khi bạn hoàn thành bài trước.',
          status: firstIncomplete ? 'ACTIVE' : 'COMPLETED', totalItems: plan.length,
          completedItems: completedLessonIds.size,
          items: { create: roadmapItemData(plan, completedLessonIds, verifiedCompletion, assessmentId, catalog) },
        },
        include: detail,
      });
      return serialize(created);
    } catch (error: any) {
      if (error?.code !== 'P2002') throw error;
      const created = await prisma.roadmap.findUnique({ where: { assessmentId }, include: detail });
      if (!created || created.userId !== userId) throw error;
      return serialize(created);
    }
  }

  public async getLatest(userId: string): Promise<RoadmapDto | null> {
    const roadmap = await prisma.roadmap.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: detail,
    });
    if (!roadmap) return null;
    return this.get(userId, roadmap.id);
  }

  public async get(userId: string, id: string): Promise<RoadmapDto> {
    if (!UUID.test(id)) throw new Error('INVALID_ROADMAP_ID: Mã lộ trình không hợp lệ.');
    const roadmap = await prisma.roadmap.findUnique({ where: { id }, include: detail });
    if (!roadmap) throw new Error('ROADMAP_NOT_FOUND: Không tìm thấy lộ trình.');
    if (roadmap.userId !== userId) throw new Error('FORBIDDEN: Không có quyền xem lộ trình này.');
    const catalog = await loadPythonBasicsPilotCatalog();
    if (roadmap.catalogSha256 !== catalog.catalogSha256
      || roadmap.catalogVersion !== catalog.catalogVersion
      || roadmap.mappingVersion !== catalog.mappingVersion
      || roadmap.policyVersion !== catalog.policyVersion
      || roadmap.graphVersion !== catalog.graphVersion) {
      throw new Error('ROADMAP_VERSION_MISMATCH: Catalog hoặc quy tắc đã thay đổi.');
    }
    return serialize(roadmap);
  }

  public async sync(userId: string, id: string): Promise<RoadmapDto> {
    // Catalog is checked before any state change. A changed lesson stays closed.
    await this.get(userId, id);
    const catalog = await loadPythonBasicsPilotCatalog();
    const verifiedCompletion = await verifiedPythonBasicsCompletions(userId, catalog.lessons);
    const updated = await withRoadmapTransactionRetry(() => prisma.$transaction(async tx => {
      // Serialize syncs for this roadmap across tabs and application instances.
      await tx.$queryRaw`SELECT 1::int AS acquired
        FROM (SELECT pg_advisory_xact_lock(hashtext('roadmap-sync'), hashtext(${id}))) AS lock_guard`;
      let roadmap = await tx.roadmap.findUniqueOrThrow({ where: { id }, include: detail });
      // Repair roadmaps created by the old behavior that removed all completed
      // lessons and persisted an invalid 0/0 roadmap.
      if (roadmap.items.length === 0) {
        const assessment = await tx.pretestAssessment.findUniqueOrThrow({ where: { id: roadmap.assessmentId } });
        const signals = signalsFromAssessment(
          assessment.rawAssessmentData, assessment.language, assessment.goalId, assessment.graphVersion,
        );
        const plan = planPythonBasicsRoadmap(catalog.lessons, new Set(), signals);
        const completedLessonIds = new Set(verifiedCompletion.keys());
        const firstIncomplete = plan.find(item => !completedLessonIds.has(item.lesson.lessonId));
        roadmap = await tx.roadmap.update({
          where: { id },
          data: {
            totalItems: plan.length, completedItems: completedLessonIds.size,
            status: firstIncomplete ? 'ACTIVE' : 'COMPLETED',
            items: { create: roadmapItemData(plan, completedLessonIds, verifiedCompletion, assessment.id, catalog) },
          },
          include: detail,
        });
      }
      const items = roadmap.items;
      const completedStableIds = new Set<string>(verifiedCompletion.keys());
      for (const item of items) if (item.learningStatus === 'COMPLETED' && item.lessonId) completedStableIds.add(item.lessonId);
      await tx.roadmapItem.updateMany({
        where: { roadmapId: id, learningStatus: { in: ['AVAILABLE', 'IN_PROGRESS'] } },
        data: { learningStatus: 'LOCKED' },
      });
      for (const item of items) {
        const proof = item.lessonId ? verifiedCompletion.get(item.lessonId) : null;
        if (proof && item.learningStatus !== 'COMPLETED') {
          await tx.roadmapItem.update({ where: { id: item.id }, data: {
            learningStatus: 'COMPLETED', completedAt: proof.completedAt,
            completionEvidence: { source: 'ALL_PASSED_SUBMISSIONS',
              lessonDbId: item.contentId, passedExerciseCount: proof.passedExerciseCount } as Prisma.InputJsonValue,
          } });
        }
      }
      const first = items.find(item => !item.lessonId || !completedStableIds.has(item.lessonId));
      if (first) {
        const meta = record(first.selectionEvidence) ? first.selectionEvidence : {};
        const prerequisites = Array.isArray(meta.prerequisiteLessonIds) ? meta.prerequisiteLessonIds : [];
        if (!prerequisites.every(value => typeof value === 'string' && completedStableIds.has(value))) {
          throw new Error('ROADMAP_PREREQUISITE_UNMET: Bài kế tiếp chưa đủ điều kiện.');
        }
        await tx.roadmapItem.update({ where: { id: first.id }, data: { learningStatus: 'AVAILABLE' } });
      }
      const completedItems = items.filter(item => item.lessonId && completedStableIds.has(item.lessonId)).length;
      await tx.roadmap.update({ where: { id }, data: {
        completedItems, status: completedItems === items.length ? 'COMPLETED' : 'ACTIVE',
      } });
      return tx.roadmap.findUniqueOrThrow({ where: { id }, include: detail });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted }));
    return serialize(updated);
  }
}

export const roadmapRuntimeService = new RoadmapRuntimeService();
