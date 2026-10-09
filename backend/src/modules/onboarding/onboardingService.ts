import { Prisma, ProgrammingLanguage } from '@prisma/client';
import { prisma } from '../../infrastructure/database/prisma';
import {
  CreateSurveyDto,
  ExternalExperience,
  McodeHistory,
  PreferredPace,
  StudyHoursPerWeek,
  SupportedLanguage,
  SurveyResponseDto,
  SurveyVerificationStatus,
  VerifiedCourseProgressDto,
} from '../../shared/types/roadmapContracts';
import { getLanguageGraphConfig, SUPPORTED_LANGUAGES } from './onboardingConfig';
import { evaluatePretestBank, loadPretestBank } from './pretestBankGate';

const MCODE_HISTORY_VALUES: readonly McodeHistory[] = ['NEVER_ENROLLED', 'LEARNING', 'COMPLETED', 'NOT_SURE'];
const EXTERNAL_EXPERIENCE_VALUES: readonly ExternalExperience[] = ['NONE', 'LESS_THAN_3_MONTHS', '3_TO_12_MONTHS', 'OVER_1_YEAR'];
const HOURS_PER_WEEK_VALUES: readonly StudyHoursPerWeek[] = ['2_TO_5_HOURS', '5_TO_10_HOURS', 'OVER_10_HOURS'];
const PREFERRED_PACE_VALUES: readonly PreferredPace[] = ['PRACTICE_HEAVY', 'BALANCED', 'THEORY_FIRST'];

const COURSE_TITLE_MATCHERS: Record<SupportedLanguage, { terms: string[]; matches: (title: string) => boolean }> = {
  PYTHON: { terms: ['python'], matches: (title) => /\bpython\b/i.test(title) },
  JAVASCRIPT: { terms: ['javascript'], matches: (title) => /\bjavascript\b/i.test(title) },
  CPP: { terms: ['c++', 'cpp'], matches: (title) => /(?:\bc\+\+|\bcpp\b)/i.test(title) },
  SQL: { terms: ['sql', 't-sql', 'tsql'], matches: (title) => /(?:\bsql\b|\bt-sql\b|\btsql\b)/i.test(title) },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertEnumValue<T extends string>(value: unknown, allowedValues: readonly T[], fieldName: string): asserts value is T {
  if (typeof value !== 'string' || !allowedValues.includes(value as T)) {
    throw new Error(`INVALID_SURVEY_FIELD: '${fieldName}' không hợp lệ.`);
  }
}

function assertSupportedLanguage(value: unknown): asserts value is SupportedLanguage {
  if (typeof value !== 'string' || !SUPPORTED_LANGUAGES.includes(value.toUpperCase() as SupportedLanguage)) {
    throw new Error(`LANGUAGE_NOT_SUPPORTED: Ngôn ngữ '${String(value ?? '')}' không được hỗ trợ trong lộ trình cá nhân hóa (chỉ hỗ trợ PYTHON, JAVASCRIPT, CPP, SQL).`);
  }
}

export class OnboardingService {
  /** Lấy mục tiêu, module và version đồ thị đúng với ngôn ngữ yêu cầu. */
  public getGoals(language: string) {
    const config = getLanguageGraphConfig(language);
    const bank = loadPretestBank();
    return {
      language: config.language,
      surveyVersion: '2.0',
      graphVersion: config.graphVersion,
      domainName: config.domainName,
      domainDescription: config.domainDescription,
      goals: config.goals.map((goal) => {
        const pretestAvailable = evaluatePretestBank(config.language, goal.goalId, bank).attemptCreationAvailable;
        return {
          ...goal,
          pretestAvailable,
          availabilityMessage: pretestAvailable
            ? 'Bộ đề đã được duyệt và sẵn sàng.'
            : 'Bộ đề cho mục tiêu này đang được hoàn thiện.',
        };
      }),
      modules: config.modules,
    };
  }

  /**
   * Đối chiếu trong các khóa MCODE thuộc ngôn ngữ được chọn.
   * Course hiện chưa có languageId nên title-pattern là fallback có chủ đích và được ghi lại trong snapshot.
   */
  public async verifyMcodeHistory(
    userId: string,
    language: SupportedLanguage,
    declaredHistory: McodeHistory,
  ): Promise<{ verificationStatus: SurveyVerificationStatus; verifiedCourseProgress: VerifiedCourseProgressDto }> {
    const matcher = COURSE_TITLE_MATCHERS[language];
    const candidateCourses = await prisma.course.findMany({
      where: {
        OR: matcher.terms.map((term) => ({ title: { contains: term, mode: 'insensitive' as const } })),
      },
      include: {
        modules: {
          include: {
            chapters: {
              include: { lessons: { select: { id: true } } },
            },
          },
        },
        certificates: { where: { userId } },
        enrollments: { where: { userId } },
      },
    });
    const courses = candidateCourses.filter((course) => matcher.matches(course.title));
    const courseIds = courses.map((course) => course.id);
    const lessonIds = Array.from(new Set(courses.flatMap((course) =>
      course.modules.flatMap((module) => module.chapters.flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id))),
    )));

    const completedLessonRows = lessonIds.length === 0
      ? []
      : await prisma.lessonProgress.findMany({
        where: { userId, lessonId: { in: lessonIds }, isCompleted: true },
        select: { lessonId: true },
      });
    const completedLessonIds = new Set(completedLessonRows.map((progress) => progress.lessonId));
    const courseProgress = courses.map((course) => {
      const courseLessonIds = course.modules.flatMap((module) => module.chapters.flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id)));
      const completedLessonsCount = courseLessonIds.filter((lessonId) => completedLessonIds.has(lessonId)).length;
      const progressPercent = courseLessonIds.length === 0 ? 0 : Math.round((completedLessonsCount / courseLessonIds.length) * 100);
      return {
        title: course.title,
        totalLessonsCount: courseLessonIds.length,
        completedLessonsCount,
        progressPercent,
      };
    });
    const mostAdvancedCourse = courseProgress.reduce<(typeof courseProgress)[number] | null>((best, course) => !best || course.progressPercent > best.progressPercent ? course : best, null);
    const passedSubmissionsCount = courseIds.length === 0
      ? 0
      : await prisma.submission.count({
        where: {
          userId,
          language: language as ProgrammingLanguage,
          status: 'PASSED',
          exercise: { lesson: { chapter: { module: { courseId: { in: courseIds } } } } },
        },
      });

    const hasEnrollment = courses.some((course) => course.enrollments.length > 0);
    const hasCertificate = courses.some((course) => course.certificates.length > 0);
    const totalLessonsCount = mostAdvancedCourse?.totalLessonsCount ?? 0;
    const completedLessonsCount = mostAdvancedCourse?.completedLessonsCount ?? 0;
    const progressPercent = mostAdvancedCourse?.progressPercent ?? 0;
    const hasVerifiedCompletion = hasCertificate || courseProgress.some((course) => course.totalLessonsCount > 0 && course.completedLessonsCount === course.totalLessonsCount);
    const hasVerifiedActivity = courseProgress.some((course) => course.progressPercent >= 80);
    const hasAnyCourseEvidence = hasEnrollment || completedLessonIds.size > 0 || passedSubmissionsCount > 0 || hasCertificate;

    let verificationStatus: SurveyVerificationStatus;
    if (hasVerifiedCompletion) {
      verificationStatus = 'VERIFIED_COURSE_COMPLETION';
    } else if (hasVerifiedActivity) {
      verificationStatus = 'VERIFIED_ACTIVITY';
    } else if (declaredHistory === 'NEVER_ENROLLED' && !hasAnyCourseEvidence) {
      verificationStatus = 'NEW_STUDENT';
    } else {
      verificationStatus = 'SELF_REPORTED_UNVERIFIED';
    }

    return {
      verificationStatus,
      verifiedCourseProgress: {
        language,
        matchStrategy: 'COURSE_TITLE_PATTERN_FALLBACK',
        matchedCourseCount: courses.length,
        matchedCourseTitles: courses.map((course) => course.title),
        hasEnrollment,
        hasCertificate,
        totalLessonsCount,
        completedLessonsCount,
        progressPercent,
        passedSubmissionsCount,
        declarationConflict: declaredHistory === 'NEVER_ENROLLED' && hasAnyCourseEvidence,
        courseProgress,
        checkedAt: new Date().toISOString(),
      },
    };
  }

  /** Validate untrusted HTTP input before persisting either a draft or final survey. */
  private validateSurveyDto(dto: CreateSurveyDto): { language: SupportedLanguage; selfAssessment: Record<string, number> } {
    if (!isRecord(dto)) {
      throw new Error('INVALID_SURVEY_PAYLOAD: Dữ liệu khảo sát phải là một object hợp lệ.');
    }
    assertSupportedLanguage(dto.language);
    const language = dto.language.toUpperCase() as SupportedLanguage;
    const config = getLanguageGraphConfig(language);

    if (dto.surveyVersion !== '2.0') {
      throw new Error("INVALID_SURVEY_VERSION: Chỉ hỗ trợ surveyVersion '2.0'.");
    }
    if (typeof dto.goalId !== 'string' || !config.goals.some((goal) => goal.goalId === dto.goalId)) {
      throw new Error(`INVALID_GOAL_ID: Mục tiêu '${String(dto.goalId ?? '')}' không hợp lệ đối với ngôn ngữ ${language}.`);
    }
    if (!evaluatePretestBank(language, dto.goalId, loadPretestBank()).attemptCreationAvailable) {
      throw new Error('PRETEST_UNAVAILABLE: Mục tiêu này chưa có bộ đề đã duyệt. Vui lòng chọn mục tiêu đang mở.');
    }
    assertEnumValue(dto.mcodeHistory, MCODE_HISTORY_VALUES, 'mcodeHistory');
    assertEnumValue(dto.externalExperience, EXTERNAL_EXPERIENCE_VALUES, 'externalExperience');
    assertEnumValue(dto.hoursPerWeek, HOURS_PER_WEEK_VALUES, 'hoursPerWeek');
    assertEnumValue(dto.preferredPace, PREFERRED_PACE_VALUES, 'preferredPace');
    if (dto.isDraft !== undefined && typeof dto.isDraft !== 'boolean') {
      throw new Error("INVALID_SURVEY_FIELD: 'isDraft' phải là boolean.");
    }
    if (!isRecord(dto.selfAssessment)) {
      throw new Error("INVALID_SELF_ASSESSMENT: 'selfAssessment' phải là object moduleId -> 1|2|3.");
    }

    const validModuleIds = new Set(config.modules.map((module) => module.id));
    const selfAssessment: Record<string, number> = {};
    for (const [moduleId, value] of Object.entries(dto.selfAssessment)) {
      if (!validModuleIds.has(moduleId) || !Number.isInteger(value) || value < 1 || value > 3) {
        throw new Error(`INVALID_SELF_ASSESSMENT: Module '${moduleId}' phải thuộc đồ thị ${language} và có mức tự đánh giá nguyên từ 1 đến 3.`);
      }
      selfAssessment[moduleId] = value;
    }

    if (!dto.isDraft) {
      const missingModules = config.modules.filter((module) => selfAssessment[module.id] === undefined).map((module) => module.id);
      if (missingModules.length > 0) {
        throw new Error(`INVALID_SELF_ASSESSMENT: Thiếu tự đánh giá cho module: ${missingModules.join(', ')}.`);
      }
    }

    return { language, selfAssessment };
  }

  /** Tạo mới khảo sát hoặc cập nhật bản nháp gần nhất của cùng người học và ngôn ngữ. */
  public async createOrUpdateSurvey(userId: string, dto: CreateSurveyDto): Promise<SurveyResponseDto> {
    const { language, selfAssessment } = this.validateSurveyDto(dto);
    const { verificationStatus, verifiedCourseProgress } = await this.verifyMcodeHistory(userId, language, dto.mcodeHistory);

    const existingDraft = await prisma.learnerSurvey.findFirst({
      where: { userId, language: language as ProgrammingLanguage, isDraft: true },
      orderBy: { updatedAt: 'desc' },
    });
    const surveyData = {
      userId,
      language: language as ProgrammingLanguage,
      surveyVersion: '2.0',
      goalId: dto.goalId,
      mcodeHistory: dto.mcodeHistory,
      externalExperience: dto.externalExperience,
      selfAssessment,
      hoursPerWeek: dto.hoursPerWeek,
      preferredPace: dto.preferredPace,
      selfReportedHistory: {
        declaredHistory: dto.mcodeHistory,
        declaredExperience: dto.externalExperience,
        declaredAt: new Date().toISOString(),
      },
      verifiedCourseProgress: verifiedCourseProgress as unknown as Prisma.InputJsonValue,
      verificationStatus,
      isDraft: Boolean(dto.isDraft),
    };
    const survey = existingDraft
      ? await prisma.learnerSurvey.update({ where: { id: existingDraft.id }, data: surveyData })
      : await prisma.learnerSurvey.create({ data: surveyData });

    return {
      surveyId: survey.id,
      userId: survey.userId,
      language,
      goalId: survey.goalId,
      surveyVersion: survey.surveyVersion,
      verificationStatus: survey.verificationStatus,
      isDraft: survey.isDraft,
      verifiedCourseProgress,
      nextStep: survey.isDraft ? 'DRAFT_SAVED' : 'READY_FOR_PRETEST',
      createdAt: survey.createdAt.toISOString(),
      updatedAt: survey.updatedAt.toISOString(),
    };
  }

  /** Lấy khảo sát gần nhất, ưu tiên bản nháp để người học có thể tiếp tục đúng nơi đã dừng. */
  public async getLatestSurvey(userId: string, language: string) {
    assertSupportedLanguage(language);
    const normalizedLanguage = language.toUpperCase() as SupportedLanguage;
    return prisma.learnerSurvey.findFirst({
      where: { userId, language: normalizedLanguage as ProgrammingLanguage },
      orderBy: [{ isDraft: 'desc' }, { updatedAt: 'desc' }],
    });
  }

  /** Lấy chi tiết theo ID và kiểm tra quyền sở hữu trước khi trả dữ liệu. */
  public async getSurveyById(userId: string, surveyId: string) {
    const survey = await prisma.learnerSurvey.findUnique({ where: { id: surveyId } });
    if (!survey) {
      throw new Error('SURVEY_NOT_FOUND: Không tìm thấy bản khảo sát.');
    }
    if (survey.userId !== userId) {
      throw new Error('FORBIDDEN: Bạn không có quyền truy cập bản khảo sát của người khác.');
    }
    return survey;
  }
}

export const onboardingService = new OnboardingService();
