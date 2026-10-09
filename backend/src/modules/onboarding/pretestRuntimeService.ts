import crypto from 'crypto';
import { Prisma, ProgrammingLanguage } from '@prisma/client';
import { prisma } from '../../infrastructure/database/prisma';
import { BatchCodeRunner } from '../../infrastructure/sandbox/batch/batch.runner';
import {
  AssessmentResponseDto,
  LearnerProfileResponseDto,
  PretestAttemptDto,
  PretestQuestionType,
  SavePretestAnswerResponseDto,
  SubmitAnswerDto,
  SubmitPretestDto,
  SubmitPretestResponseDto,
  SupportedLanguage,
} from '../../shared/types/roadmapContracts';
import { getLanguageGraphConfig, SUPPORTED_LANGUAGES } from './onboardingConfig';
import { BankItem, loadPretestBank, selectPretestBankItems } from './pretestBankGate';
import { buildPretestProfile, VerifiedPretestAnswer } from './pretestProfile';

const ATTEMPT_DURATION_MINUTES = 30;
const RETAKE_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const MAX_CODE_LENGTH = 20_000;
const MAX_IDEMPOTENCY_KEY_LENGTH = 128;
const QUESTION_WEIGHT: Record<PretestQuestionType, number> = {
  CONCEPT: 1, TRACING: 1.25, BUG_HUNTING: 1.25, PRACTICAL: 2,
};

type PublicOption = { key: string; text: string };
type SnapshotTestCase = { input: string; expectedStdout: string; isHidden: boolean };

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function publicOptions(value: unknown): PublicOption[] | null {
  if (!Array.isArray(value)) return null;
  const options = value.filter((entry): entry is PublicOption => isRecord(entry)
    && typeof entry.key === 'string' && typeof entry.text === 'string');
  return options.length === value.length ? options : null;
}

function testCases(value: unknown): SnapshotTestCase[] {
  if (!Array.isArray(value)) throw new Error('PRETEST_SNAPSHOT_INVALID: Thiếu test phía máy chủ.');
  const parsed = value.filter((entry): entry is SnapshotTestCase => isRecord(entry)
    && typeof entry.input === 'string' && typeof entry.expectedStdout === 'string'
    && typeof entry.isHidden === 'boolean');
  if (parsed.length !== value.length || parsed.length === 0) {
    throw new Error('PRETEST_SNAPSHOT_INVALID: Test phía máy chủ không hợp lệ.');
  }
  return parsed;
}

function canonicalSubmission(dto: SubmitPretestDto): string {
  const answers = Array.isArray(dto.answers) ? [...dto.answers]
    .map(answer => ({
      questionSnapshotId: answer.questionSnapshotId,
      selectedOption: answer.selectedOption ?? null,
      submittedCode: answer.submittedCode ?? null,
    }))
    .sort((a, b) => String(a.questionSnapshotId).localeCompare(String(b.questionSnapshotId))) : [];
  return JSON.stringify({ answers });
}

function normalizeStdout(value: string): string {
  return value.replace(/\r\n/g, '\n');
}

function countsByStatus(skills: Record<string, { status: string }>) {
  const values = Object.values(skills);
  return {
    proficientCount: values.filter(skill => skill.status === 'PROFICIENT').length,
    developingCount: values.filter(skill => skill.status === 'DEVELOPING').length,
    needsFoundationCount: values.filter(skill => skill.status === 'NEEDS_FOUNDATION').length,
    unknownCount: values.filter(skill => skill.status === 'UNKNOWN').length,
  };
}

function serializeAttempt(attempt: any): PretestAttemptDto {
  const answerByQuestion = new Map((attempt.answers ?? []).map((answer: any) => [answer.questionSnapshotId, answer]));
  return {
    id: attempt.id,
    language: attempt.language as SupportedLanguage,
    goalId: attempt.goalId,
    graphVersion: attempt.graphVersion,
    totalQuestions: attempt.totalQuestions,
    durationMinutes: attempt.durationMinutes,
    startedAt: attempt.startedAt.toISOString(),
    expiresAt: attempt.expiresAt.toISOString(),
    status: attempt.status,
    questions: [...attempt.questions].sort((a: any, b: any) => a.orderIndex - b.orderIndex).map((question: any) => ({
      id: question.id,
      orderIndex: question.orderIndex,
      primarySkillId: question.primarySkillId,
      secondarySkillIds: question.secondarySkillIds,
      questionType: question.questionType,
      difficulty: question.difficulty,
      prompt: question.prompt,
      starterCode: question.starterCode,
      options: publicOptions(question.optionsJson),
      source: question.source,
    })),
    answers: [...attempt.questions].sort((a: any, b: any) => a.orderIndex - b.orderIndex).map((question: any) => {
      const answer: any = answerByQuestion.get(question.id);
      return {
        questionSnapshotId: question.id,
        selectedOption: answer?.selectedOption ?? null,
        submittedCode: answer?.submittedCode ?? null,
        isAnswered: answer?.isAnswered ?? false,
        savedAt: answer?.updatedAt?.toISOString() ?? null,
      };
    }),
  };
}

function snapshotData(item: BankItem, index: number) {
  return {
    orderIndex: index + 1,
    questionFamilyId: item.questionFamilyId,
    questionVersion: item.questionVersion,
    rubricVersion: '1.0',
    primarySkillId: item.primarySkillId,
    secondarySkillIds: item.secondarySkillIds ?? [],
    questionType: item.questionType,
    difficulty: item.difficulty,
    prompt: item.prompt,
    starterCode: item.starterCode,
    optionsJson: item.options as unknown as Prisma.InputJsonValue | undefined,
    correctAnswerHash: item.correctAnswerHash!,
    rubricJson: {
      bankItemId: item.id,
      bankVersion: item.bankVersion,
      runnerSpec: item.runnerSpec ?? null,
      testCasesSha256: item.testCasesSha256 ?? null,
      runnerValidationSha256: item.runnerValidationSha256 ?? null,
    } as Prisma.InputJsonValue,
    testCasesJson: item.testCases as unknown as Prisma.InputJsonValue | undefined,
    source: 'CURATED_VALIDATED',
  };
}

export class PretestRuntimeService {
  private readonly runner = new BatchCodeRunner();

  public async createOrResumeAttempt(userId: string, surveyId: string): Promise<PretestAttemptDto> {
    if (!isUuid(surveyId)) throw new Error('INVALID_SURVEY_ID: surveyId không hợp lệ.');
    const survey = await prisma.learnerSurvey.findUnique({ where: { id: surveyId } });
    if (!survey) throw new Error('SURVEY_NOT_FOUND: Không tìm thấy bản khảo sát.');
    if (survey.userId !== userId) throw new Error('FORBIDDEN: Không có quyền sử dụng khảo sát này.');
    if (survey.isDraft) throw new Error('SURVEY_DRAFT: Cần hoàn tất khảo sát trước Pre-test.');
    if (!SUPPORTED_LANGUAGES.includes(survey.language as SupportedLanguage)) {
      throw new Error('LANGUAGE_NOT_SUPPORTED: Ngôn ngữ khảo sát chưa được hỗ trợ.');
    }

    const active = await prisma.pretestAttempt.findFirst({
      where: { userId, language: survey.language, status: 'ACTIVE' },
      include: { questions: true, answers: true },
    });
    if (active && active.expiresAt.getTime() > Date.now()) return serializeAttempt(active);
    if (active) {
      await this.submitAttempt(userId, active.id, {}, `system-expiry-${active.id}`, true);
    }

    const latestFinalized = await prisma.pretestAttempt.findFirst({
      where: { userId, language: survey.language, status: { in: ['SUBMITTED', 'TIMED_OUT'] }, assessment: { isNot: null } },
      orderBy: [{ submittedAt: 'desc' }, { expiresAt: 'desc' }],
      include: { assessment: { include: { roadmaps: { select: { status: true } } } } },
    });
    if (latestFinalized) {
      const cooldownFrom = latestFinalized.status === 'TIMED_OUT'
        ? latestFinalized.expiresAt : latestFinalized.submittedAt ?? latestFinalized.expiresAt;
      const roadmapCompleted = latestFinalized.assessment?.roadmaps.some(roadmap => roadmap.status === 'COMPLETED') ?? false;
      if (!roadmapCompleted && Date.now() - cooldownFrom.getTime() < RETAKE_COOLDOWN_MS) {
        throw new Error(`PRETEST_COOLDOWN: Có thể làm lại sau ${new Date(cooldownFrom.getTime() + RETAKE_COOLDOWN_MS).toISOString()}.`);
      }
    }

    const language = survey.language as SupportedLanguage;
    const selected = selectPretestBankItems(language, survey.goalId, loadPretestBank());
    if (!selected) throw new Error('PRETEST_UNAVAILABLE: Chưa có đủ câu hỏi đã kiểm định cho mục tiêu này.');
    const graph = getLanguageGraphConfig(language);
    const bankVersions = new Set(selected.map(item => item.bankVersion));
    if (bankVersions.size !== 1) throw new Error('PRETEST_BANK_INVALID: Một đề không được trộn nhiều phiên bản bank.');
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + ATTEMPT_DURATION_MINUTES * 60_000);

    try {
      return await prisma.$transaction(async tx => {
        const resumed = await tx.pretestAttempt.findFirst({
          where: { userId, language: survey.language, status: 'ACTIVE' },
          include: { questions: true, answers: true },
        });
        if (resumed) return serializeAttempt(resumed);
        const created = await tx.pretestAttempt.create({
          data: {
            userId, surveyId: survey.id, language: survey.language, goalId: survey.goalId,
            graphVersion: graph.graphVersion, bankVersion: selected[0].bankVersion,
            scoringVersion: '2.0', totalQuestions: selected.length,
            durationMinutes: ATTEMPT_DURATION_MINUTES, startedAt, expiresAt,
            questions: { create: selected.map((item, index) => snapshotData(item, index)) },
          },
          include: { questions: true, answers: true },
        });
        return serializeAttempt(created);
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error: any) {
      if (error?.code !== 'P2002') throw error;
      const resumed = await prisma.pretestAttempt.findFirst({
        where: { userId, language: survey.language, status: 'ACTIVE' },
        include: { questions: true, answers: true },
      });
      if (!resumed) throw error;
      return serializeAttempt(resumed);
    }
  }

  public async getAttempt(userId: string, attemptId: string): Promise<PretestAttemptDto> {
    if (!isUuid(attemptId)) throw new Error('INVALID_ATTEMPT_ID: attemptId không hợp lệ.');
    const attempt = await prisma.pretestAttempt.findUnique({
      where: { id: attemptId }, include: { questions: true, answers: true },
    });
    if (!attempt) throw new Error('PRETEST_NOT_FOUND: Không tìm thấy lượt Pre-test.');
    if (attempt.userId !== userId) throw new Error('FORBIDDEN: Không có quyền xem lượt Pre-test này.');
    return serializeAttempt(attempt);
  }

  private validateAnswer(question: any, dto: SubmitAnswerDto) {
    if (!isRecord(dto) || !isUuid(dto.questionSnapshotId)) {
      throw new Error('INVALID_PRETEST_ANSWER: questionSnapshotId không hợp lệ.');
    }
    if (question.questionType === 'PRACTICAL') {
      if (dto.selectedOption !== undefined && dto.selectedOption !== null) {
        throw new Error('INVALID_PRETEST_ANSWER: Câu thực hành không nhận selectedOption.');
      }
      if (dto.submittedCode !== undefined && dto.submittedCode !== null && typeof dto.submittedCode !== 'string') {
        throw new Error('INVALID_PRETEST_ANSWER: submittedCode phải là chuỗi.');
      }
      if ((dto.submittedCode?.length ?? 0) > MAX_CODE_LENGTH) {
        throw new Error(`INVALID_PRETEST_ANSWER: Code vượt quá ${MAX_CODE_LENGTH} ký tự.`);
      }
      const submittedCode = dto.submittedCode?.trim() ? dto.submittedCode : null;
      return { selectedOption: null, submittedCode, isAnswered: submittedCode !== null };
    }
    if (dto.submittedCode !== undefined && dto.submittedCode !== null) {
      throw new Error('INVALID_PRETEST_ANSWER: Câu khách quan không nhận submittedCode.');
    }
    const options = publicOptions(question.optionsJson) ?? [];
    const selectedOption = dto.selectedOption?.trim() || null;
    if (selectedOption !== null && !options.some(option => option.key === selectedOption)) {
      throw new Error('INVALID_PRETEST_ANSWER: Phương án không thuộc câu hỏi.');
    }
    return { selectedOption, submittedCode: null, isAnswered: selectedOption !== null };
  }

  public async saveAnswer(userId: string, attemptId: string, dto: SubmitAnswerDto): Promise<SavePretestAnswerResponseDto> {
    if (!isUuid(attemptId)) throw new Error('INVALID_ATTEMPT_ID: attemptId không hợp lệ.');
    const attempt = await prisma.pretestAttempt.findUnique({
      where: { id: attemptId }, include: { questions: true },
    });
    if (!attempt) throw new Error('PRETEST_NOT_FOUND: Không tìm thấy lượt Pre-test.');
    if (attempt.userId !== userId) throw new Error('FORBIDDEN: Không có quyền sửa lượt Pre-test này.');
    if (attempt.status !== 'ACTIVE') throw new Error('PRETEST_NOT_ACTIVE: Lượt Pre-test đã bị khóa.');
    if (attempt.expiresAt.getTime() <= Date.now()) {
      await this.submitAttempt(userId, attemptId, {}, `system-expiry-${attemptId}`, true);
      throw new Error('PRETEST_EXPIRED: Lượt Pre-test đã hết thời gian và được tự động chấm.');
    }
    const question = attempt.questions.find(item => item.id === dto?.questionSnapshotId);
    if (!question) throw new Error('PRETEST_QUESTION_SCOPE_MISMATCH: Câu hỏi không thuộc lượt làm bài này.');
    const answer = this.validateAnswer(question, dto);
    const saved = await prisma.pretestAnswer.upsert({
      where: { attemptId_questionSnapshotId: { attemptId, questionSnapshotId: question.id } },
      create: {
        attemptId, questionSnapshotId: question.id, ...answer,
        answeredAt: answer.isAnswered ? new Date() : null,
      },
      update: {
        ...answer, answeredAt: answer.isAnswered ? new Date() : null,
        score: null, isCorrect: null, testPassRatio: null, testRunDetails: Prisma.DbNull,
      },
    });
    return { questionSnapshotId: question.id, savedAt: saved.updatedAt.toISOString(), attemptStatus: attempt.status };
  }

  public async submitAttempt(userId: string, attemptId: string, dto: SubmitPretestDto,
                             idempotencyKey: string, forceTimeout = false): Promise<SubmitPretestResponseDto> {
    if (!isUuid(attemptId)) throw new Error('INVALID_ATTEMPT_ID: attemptId không hợp lệ.');
    if (!isRecord(dto)) throw new Error('INVALID_PRETEST_SUBMISSION: Dữ liệu nộp bài không hợp lệ.');
    if (typeof idempotencyKey !== 'string' || !idempotencyKey.trim()
      || idempotencyKey.length > MAX_IDEMPOTENCY_KEY_LENGTH) {
      throw new Error('INVALID_IDEMPOTENCY_KEY: Cần Idempotency-Key hợp lệ khi nộp bài.');
    }
    const key = idempotencyKey.trim();
    const requestHash = sha256(canonicalSubmission(dto));
    const scope = `pretest-submit:${attemptId}`;
    const previous = await prisma.idempotencyRecord.findUnique({
      where: { userId_scope_key: { userId, scope, key } },
    });
    if (previous) {
      if (previous.requestHash !== requestHash) throw new Error('IDEMPOTENCY_CONFLICT: Cùng key nhưng payload khác.');
      if (previous.responseBody) return previous.responseBody as unknown as SubmitPretestResponseDto;
      const finalized = await prisma.pretestAttempt.findUnique({
        where: { id: attemptId }, include: { assessment: true },
      });
      if (finalized?.assessment) return {
        assessmentId: finalized.assessment.id,
        status: finalized.status,
        profileVersion: finalized.assessment.profileVersion,
      };
      throw new Error('PRETEST_SUBMISSION_IN_PROGRESS: Bài đang được chấm.');
    }

    const initial = await prisma.pretestAttempt.findUnique({
      where: { id: attemptId }, include: { assessment: true, questions: true },
    });
    if (!initial) throw new Error('PRETEST_NOT_FOUND: Không tìm thấy lượt Pre-test.');
    if (initial.userId !== userId) throw new Error('FORBIDDEN: Không có quyền nộp lượt Pre-test này.');
    if (initial.assessment) {
      return { assessmentId: initial.assessment.id, status: initial.status, profileVersion: initial.assessment.profileVersion };
    }
    if (!['ACTIVE', 'ASSESSMENT_FAILED'].includes(initial.status)) {
      throw new Error('PRETEST_SUBMISSION_IN_PROGRESS: Lượt Pre-test đang được xử lý.');
    }
    const submittedAnswers = Array.isArray(dto.answers) ? dto.answers : [];
    if (submittedAnswers.length > initial.questions.length
      || new Set(submittedAnswers.map(answer => answer?.questionSnapshotId)).size !== submittedAnswers.length) {
      throw new Error('INVALID_PRETEST_SUBMISSION: Danh sách câu trả lời bị trùng hoặc vượt số câu trong đề.');
    }
    if (initial.status === 'ASSESSMENT_FAILED' && submittedAnswers.length > 0) {
      throw new Error('PRETEST_NOT_ACTIVE: Chỉ được chấm lại dữ liệu đã khóa sau lỗi hạ tầng.');
    }
    // The server clock owns expiry. Answers arriving after expiresAt are not
    // accepted, even if the browser clock still shows time remaining.
    if (initial.expiresAt.getTime() > Date.now()) {
      for (const answer of submittedAnswers) await this.saveAnswer(userId, attemptId, answer);
    }

    try {
      await prisma.idempotencyRecord.create({
        data: { userId, scope, key, requestHash, expiresAt: new Date(Date.now() + RETAKE_COOLDOWN_MS) },
      });
    } catch (error: any) {
      if (error?.code !== 'P2002') throw error;
      return this.submitAttempt(userId, attemptId, dto, key, forceTimeout);
    }

    const intendedStatus = forceTimeout || initial.expiresAt.getTime() <= Date.now() ? 'TIMED_OUT' : 'SUBMITTED';
    const claimed = await prisma.pretestAttempt.updateMany({
      where: { id: attemptId, userId, status: initial.status },
      data: { status: intendedStatus, submittedAt: new Date() },
    });
    if (claimed.count !== 1) {
      await prisma.idempotencyRecord.delete({ where: { userId_scope_key: { userId, scope, key } } });
      const existing = await prisma.pretestAssessment.findUnique({ where: { attemptId } });
      if (existing) return { assessmentId: existing.id, status: intendedStatus, profileVersion: existing.profileVersion };
      throw new Error('PRETEST_SUBMISSION_IN_PROGRESS: Bài đang được chấm.');
    }

    try {
      const locked = await prisma.pretestAttempt.findUniqueOrThrow({
        where: { id: attemptId }, include: { questions: true, answers: true },
      });
      const answerByQuestion = new Map(locked.answers.map(answer => [answer.questionSnapshotId, answer]));
      const scoredAt = new Date();
      const evidence: VerifiedPretestAnswer[] = [];
      const grades: Array<{
        questionSnapshotId: string; score: number | null; isCorrect: boolean | null;
        testPassRatio: number | null; testRunDetails: Prisma.InputJsonValue | typeof Prisma.DbNull;
      }> = [];

      for (const question of [...locked.questions].sort((a, b) => a.orderIndex - b.orderIndex)) {
        const answer = answerByQuestion.get(question.id);
        let score: number | null = null;
        let isCorrect: boolean | null = null;
        let testPassRatio: number | null = null;
        let gradingMethod: VerifiedPretestAnswer['gradingMethod'] = null;
        let details: Prisma.InputJsonValue | typeof Prisma.DbNull = Prisma.DbNull;
        if (answer?.isAnswered) {
          if (question.questionType === 'PRACTICAL') {
            const cases = testCases(question.testCasesJson);
            const rubric = isRecord(question.rubricJson) ? question.rubricJson : {};
            const runnerSpec = isRecord(rubric.runnerSpec) ? rubric.runnerSpec : {};
            const timeoutMs = Number.isInteger(runnerSpec.timeLimitMs) ? Number(runnerSpec.timeLimitMs) : 1000;
            const results = await this.runner.run(answer.submittedCode ?? '', locked.language, cases.map(item => item.input), {
              strictIsolation: true, timeoutMs, compileTimeoutMs: 10_000, memoryLimit: '128m',
            });
            const passed = results.map((result, index) => result.status === 'SUCCESS'
              && normalizeStdout(result.stdout) === normalizeStdout(cases[index].expectedStdout));
            const passedCount = passed.filter(Boolean).length;
            score = passedCount / cases.length;
            isCorrect = passedCount === cases.length;
            testPassRatio = score;
            gradingMethod = 'RUNNER_VERIFIED';
            details = {
              runner: 'BatchCodeRunner/Docker-only', total: cases.length, passed: passedCount,
              cases: results.map((result, index) => ({
                index, hidden: cases[index].isHidden, passed: passed[index],
                status: result.status, runtimeMs: result.runtimeMs,
              })),
            } as Prisma.InputJsonValue;
          } else {
            score = sha256(answer.selectedOption ?? '') === question.correctAnswerHash ? 1 : 0;
            isCorrect = score === 1;
            gradingMethod = 'OBJECTIVE_VERIFIED';
          }
        }
        grades.push({ questionSnapshotId: question.id, score, isCorrect, testPassRatio, testRunDetails: details });
        evidence.push({
          userId, language: locked.language as SupportedLanguage, goalId: locked.goalId,
          graphVersion: locked.graphVersion, questionSnapshotId: question.id,
          questionFamilyId: question.questionFamilyId ?? question.id,
          primarySkillId: question.primarySkillId, questionType: question.questionType,
          source: 'CURATED_VALIDATED', isAnswered: answer?.isAnswered ?? false,
          score, gradingMethod, scoredAt: answer?.isAnswered ? scoredAt.toISOString() : null,
        });
      }

      const profile = buildPretestProfile({
        userId, language: locked.language as SupportedLanguage, goalId: locked.goalId,
        graphVersion: locked.graphVersion, status: intendedStatus,
      }, evidence);
      const statusCounts = countsByStatus(profile.skills);
      const totalScore = evidence.reduce((sum, answer) => sum
        + (answer.score === null ? 0 : QUESTION_WEIGHT[answer.questionType] * answer.score), 0);
      const maxPossibleScore = evidence.reduce((sum, answer) => sum + QUESTION_WEIGHT[answer.questionType], 0);

      const response = await prisma.$transaction(async tx => {
        const alreadyCreated = await tx.pretestAssessment.findUnique({ where: { attemptId } });
        if (alreadyCreated) {
          return { assessmentId: alreadyCreated.id, status: intendedStatus, profileVersion: alreadyCreated.profileVersion } as SubmitPretestResponseDto;
        }
        for (const grade of grades) {
          await tx.pretestAnswer.upsert({
            where: { attemptId_questionSnapshotId: { attemptId, questionSnapshotId: grade.questionSnapshotId } },
            create: {
              attemptId, questionSnapshotId: grade.questionSnapshotId, isAnswered: grade.score !== null,
              score: grade.score, isCorrect: grade.isCorrect, testPassRatio: grade.testPassRatio,
              testRunDetails: grade.testRunDetails, answeredAt: grade.score !== null ? scoredAt : null,
            },
            update: {
              score: grade.score, isCorrect: grade.isCorrect, testPassRatio: grade.testPassRatio,
              testRunDetails: grade.testRunDetails,
            },
          });
        }
        const assessment = await tx.pretestAssessment.create({
          data: {
            attemptId, userId, language: locked.language, goalId: locked.goalId,
            scoringVersion: locked.scoringVersion, graphVersion: locked.graphVersion, profileVersion: profile.profileVersion,
            totalScore, maxPossibleScore,
            evaluatedSkillsCount: Object.values(profile.skills).filter(skill => skill.status !== 'UNKNOWN').length,
            ...statusCounts,
            summaryFeedback: `Đã chấm ${profile.answeredQuestions}/${locked.totalQuestions} câu bằng quy tắc máy chủ.`,
            rawAssessmentData: { profile, answeredQuestions: profile.answeredQuestions, unansweredQuestions: profile.unansweredQuestions } as unknown as Prisma.InputJsonValue,
          },
        });
        for (const skill of Object.values(profile.skills)) {
          await tx.learnerSkillState.upsert({
            where: { userId_language_skillId: { userId, language: locked.language, skillId: skill.skillId } },
            create: {
              userId, language: locked.language, skillId: skill.skillId, graphVersion: locked.graphVersion,
              profileVersion: profile.profileVersion, masteryScore: skill.masteryScore,
              confidence: skill.confidence, evidenceCount: skill.evidenceCount,
              evidenceSources: [{ assessmentId: assessment.id, questionSnapshotIds: skill.evidenceQuestionIds }],
              hasApplicationEvidence: skill.hasApplicationEvidence, status: skill.status,
              lastAssessedAt: skill.lastAssessedAt ? new Date(skill.lastAssessedAt) : scoredAt,
            },
            update: {
              graphVersion: locked.graphVersion, profileVersion: profile.profileVersion,
              masteryScore: skill.masteryScore, confidence: skill.confidence, evidenceCount: skill.evidenceCount,
              evidenceSources: [{ assessmentId: assessment.id, questionSnapshotIds: skill.evidenceQuestionIds }],
              hasApplicationEvidence: skill.hasApplicationEvidence, status: skill.status,
              lastAssessedAt: skill.lastAssessedAt ? new Date(skill.lastAssessedAt) : scoredAt,
            },
          });
        }
        const result: SubmitPretestResponseDto = {
          assessmentId: assessment.id, status: intendedStatus, profileVersion: profile.profileVersion,
        };
        await tx.idempotencyRecord.update({
          where: { userId_scope_key: { userId, scope, key } },
          data: { responseStatus: 200, responseBody: result as unknown as Prisma.InputJsonValue, resourceId: assessment.id },
        });
        return result;
      });
      return response;
    } catch (error: any) {
      await prisma.pretestAttempt.updateMany({
        where: { id: attemptId, userId, assessment: { is: null } },
        data: { status: 'ASSESSMENT_FAILED', submittedAt: null },
      });
      await prisma.idempotencyRecord.deleteMany({ where: { userId, scope, key, responseBody: { equals: Prisma.DbNull } } });
      if (/RUNNER_UNAVAILABLE/.test(error?.message ?? '')) {
        throw new Error('RUNNER_UNAVAILABLE: Docker chấm bài hiện không khả dụng; bài làm chưa bị tính sai.');
      }
      throw error;
    }
  }

  public async getAssessment(userId: string, assessmentId: string): Promise<AssessmentResponseDto> {
    if (!isUuid(assessmentId)) throw new Error('INVALID_ASSESSMENT_ID: assessmentId không hợp lệ.');
    const assessment = await prisma.pretestAssessment.findUnique({ where: { id: assessmentId } });
    if (!assessment) throw new Error('ASSESSMENT_NOT_FOUND: Không tìm thấy kết quả Pre-test.');
    if (assessment.userId !== userId) throw new Error('FORBIDDEN: Không có quyền xem kết quả này.');
    const raw = isRecord(assessment.rawAssessmentData) ? assessment.rawAssessmentData : {};
    const profile = isRecord(raw.profile) ? raw.profile : {};
    const skills = isRecord(profile.skills) ? profile.skills : {};
    return {
      id: assessment.id, attemptId: assessment.attemptId,
      language: assessment.language as SupportedLanguage, goalId: assessment.goalId,
      totalScore: assessment.totalScore, maxPossibleScore: assessment.maxPossibleScore,
      proficientCount: assessment.proficientCount, developingCount: assessment.developingCount,
      needsFoundationCount: assessment.needsFoundationCount, unknownCount: assessment.unknownCount,
      skills: skills as unknown as AssessmentResponseDto['skills'],
    };
  }

  public async getLearnerProfile(userId: string, languageValue: string): Promise<LearnerProfileResponseDto> {
    const language = languageValue.toUpperCase() as SupportedLanguage;
    if (!SUPPORTED_LANGUAGES.includes(language)) throw new Error('LANGUAGE_NOT_SUPPORTED: Ngôn ngữ không được hỗ trợ.');
    const graph = getLanguageGraphConfig(language);
    const states = await prisma.learnerSkillState.findMany({
      where: { userId, language: language as ProgrammingLanguage }, orderBy: { skillId: 'asc' },
    });
    return {
      language, graphVersion: graph.graphVersion, profileVersion: '2.0',
      skills: Object.fromEntries(states.map(skill => [skill.skillId, {
        skillId: skill.skillId, masteryScore: skill.masteryScore, confidence: skill.confidence,
        evidenceCount: skill.evidenceCount, hasApplicationEvidence: skill.hasApplicationEvidence,
        status: skill.status, lastAssessedAt: skill.lastAssessedAt.toISOString(),
      }])),
    };
  }
}

export const pretestRuntimeService = new PretestRuntimeService();
