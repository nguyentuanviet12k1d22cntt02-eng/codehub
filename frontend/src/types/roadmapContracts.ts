/**
 * Hợp đồng dữ liệu frontend cho luồng Onboarding Survey, Pre-test, Learner Profile và Roadmap cá nhân hóa
 * Đồng bộ 1:1 với backend/src/shared/types/roadmapContracts.ts
 */

export type SupportedLanguage = 'PYTHON' | 'JAVASCRIPT' | 'CPP' | 'SQL';

export type SurveyVerificationStatus = 
  | 'VERIFIED_COURSE_COMPLETION'
  | 'VERIFIED_ACTIVITY'
  | 'SELF_REPORTED_UNVERIFIED'
  | 'NEW_STUDENT';

export type McodeHistory = 'NEVER_ENROLLED' | 'LEARNING' | 'COMPLETED' | 'NOT_SURE';
export type ExternalExperience = 'NONE' | 'LESS_THAN_3_MONTHS' | '3_TO_12_MONTHS' | 'OVER_1_YEAR';
export type StudyHoursPerWeek = '2_TO_5_HOURS' | '5_TO_10_HOURS' | 'OVER_10_HOURS';
export type PreferredPace = 'PRACTICE_HEAVY' | 'BALANCED' | 'THEORY_FIRST';
export type SurveyNextStep = 'DRAFT_SAVED' | 'READY_FOR_PRETEST';

export type PretestAttemptStatus = 
  | 'ACTIVE'
  | 'SUBMITTED'
  | 'TIMED_OUT'
  | 'ASSESSMENT_FAILED';

export type PretestQuestionType = 
  | 'CONCEPT'
  | 'TRACING'
  | 'BUG_HUNTING'
  | 'PRACTICAL';

export type LearnerSkillStatus = 
  | 'UNKNOWN'
  | 'NEEDS_FOUNDATION'
  | 'DEVELOPING'
  | 'PROFICIENT';

export type RoadmapLearningStatus = 
  | 'LOCKED'
  | 'AVAILABLE'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export type RoadmapContentStatus = 
  | 'PLANNED'
  | 'GENERATING'
  | 'READY'
  | 'FAILED';

export type RoadmapStatus = 
  | 'ACTIVE'
  | 'COMPLETED'
  | 'ARCHIVED';

export interface LearningGoalDto {
  goalId: string;
  title: string;
  description?: string;
  moduleIds: string[];
  skillCount?: number;
  questionCount?: 12 | 14 | 15;
  estimatedPretestQuestions?: number;
  pretestAvailable: boolean;
  availabilityMessage?: string;
}

export interface ModuleDefinitionDto {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
}

export interface LearningGoalsResponseDto {
  language: SupportedLanguage;
  graphVersion: string;
  goals: LearningGoalDto[];
  modules?: ModuleDefinitionDto[];
}

// ==================== ONBOARDING SURVEY ====================

export interface CreateSurveyDto {
  surveyVersion: string;
  language: SupportedLanguage;
  goalId: string;
  mcodeHistory: McodeHistory;
  externalExperience: ExternalExperience;
  selfAssessment: Record<string, number>; // moduleId -> 1 | 2 | 3
  hoursPerWeek: StudyHoursPerWeek;
  preferredPace: PreferredPace;
  isDraft?: boolean;
}

export interface VerifiedCourseProgressDto {
  language: SupportedLanguage;
  matchStrategy: 'COURSE_TITLE_PATTERN_FALLBACK';
  matchedCourseCount: number;
  matchedCourseTitles: string[];
  hasEnrollment: boolean;
  hasCertificate: boolean;
  totalLessonsCount: number;
  completedLessonsCount: number;
  progressPercent: number;
  passedSubmissionsCount: number;
  declarationConflict: boolean;
  courseProgress: Array<{
    title: string;
    totalLessonsCount: number;
    completedLessonsCount: number;
    progressPercent: number;
  }>;
  checkedAt: string;
}

export interface SurveyResponseDto {
  surveyId: string;
  userId: string;
  language: SupportedLanguage;
  surveyVersion: string;
  goalId: string;
  verificationStatus: SurveyVerificationStatus;
  verifiedCourseProgress: VerifiedCourseProgressDto;
  nextStep: SurveyNextStep;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LearnerSurveyDto {
  id: string;
  language: SupportedLanguage;
  goalId: string;
  mcodeHistory: McodeHistory;
  externalExperience: ExternalExperience;
  selfAssessment: Record<string, number>;
  hoursPerWeek: StudyHoursPerWeek;
  preferredPace: PreferredPace;
  verificationStatus: SurveyVerificationStatus;
  verifiedCourseProgress: VerifiedCourseProgressDto | null;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== PRETEST ATTEMPT ====================

export interface CreatePretestDto {
  surveyId: string;
}

export interface PublicPretestQuestionDto {
  id: string;
  orderIndex: number;
  primarySkillId: string;
  secondarySkillIds: string[];
  questionType: PretestQuestionType;
  difficulty: number;
  prompt: string;
  starterCode?: string | null;
  options?: Array<{ key: string; text: string }> | null;
  source: string;
}

export interface SavedPretestAnswerDto {
  questionSnapshotId: string;
  selectedOption: string | null;
  submittedCode: string | null;
  isAnswered: boolean;
  savedAt: string | null;
}

export interface PretestAttemptDto {
  id: string;
  language: SupportedLanguage;
  goalId: string;
  graphVersion: string;
  totalQuestions: number;
  durationMinutes: number;
  startedAt: string;
  expiresAt: string;
  status: PretestAttemptStatus;
  questions: PublicPretestQuestionDto[];
  answers: SavedPretestAnswerDto[];
}

export interface SubmitAnswerDto {
  questionSnapshotId: string;
  selectedOption?: string | null;
  submittedCode?: string | null;
}

export interface SubmitPretestDto {
  answers?: SubmitAnswerDto[];
}

export interface SavePretestAnswerResponseDto {
  questionSnapshotId: string;
  savedAt: string;
  attemptStatus: PretestAttemptStatus;
}

export interface SubmitPretestResponseDto {
  assessmentId: string | null;
  status: PretestAttemptStatus;
  profileVersion: string | null;
}

// ==================== LEARNER PROFILE & ASSESSMENT ====================

export interface SkillMasteryDto {
  skillId: string;
  masteryScore: number | null;
  confidence: number;
  evidenceCount: number;
  hasApplicationEvidence: boolean;
  status: LearnerSkillStatus;
  lastAssessedAt: string | null;
}

export interface AssessmentResponseDto {
  id: string;
  attemptId: string;
  language: SupportedLanguage;
  goalId: string;
  totalScore: number;
  maxPossibleScore: number;
  proficientCount: number;
  developingCount: number;
  needsFoundationCount: number;
  unknownCount: number;
  skills: Record<string, SkillMasteryDto>;
}

export interface LearnerProfileResponseDto {
  language: SupportedLanguage;
  graphVersion: string;
  profileVersion: string;
  skills: Record<string, SkillMasteryDto>;
}

// ==================== ROADMAP & SEQUENTIAL ITEMS ====================

export interface CreateRoadmapDto {
  assessmentId: string;
}

export interface RoadmapItemDto {
  id: string;
  orderIndex: number;
  lessonId: string | null;
  contentId: string | null;
  skillId: string;
  title: string;
  objective: string;
  reason: string;
  prerequisiteSkillIds: string[];
  estimatedMinutes: number;
  learningStatus: RoadmapLearningStatus;
  contentStatus: RoadmapContentStatus;
  theoryCompleted: boolean;
  quizScore: number | null;
  practicalPassed: boolean;
  startedAt?: string | null;
  completedAt?: string | null;
}

export interface RoadmapDto {
  id: string;
  assessmentId: string;
  language: SupportedLanguage;
  goalId: string;
  graphVersion: string;
  profileVersion: string;
  policyVersion: string;
  mappingVersion: string;
  catalogVersion: string;
  title: string;
  description?: string | null;
  status: RoadmapStatus;
  totalItems: number;
  completedItems: number;
  items: RoadmapItemDto[];
}

export interface StartRoadmapItemResponseDto {
  itemId: string;
  learningStatus: RoadmapLearningStatus;
  contentStatus: RoadmapContentStatus;
  generationJobId: string | null;
  contentId: string | null;
}

export interface QuizAnswerDto {
  questionId: string;
  selectedOption: string;
}

export interface SubmitRoadmapQuizDto {
  submissionId: string;
  answers: QuizAnswerDto[];
}

export interface RoadmapQuizResultDto {
  submissionId: string;
  questionCount: number;
  correctCount: number;
  score: number;
}

export interface SubmitRoadmapPracticalDto {
  submissionId: string;
  source: string;
}

export interface RoadmapPracticalResultDto {
  submissionId: string;
  publicTestsPassed: number;
  publicTestsTotal: number;
  hiddenTestsPassed: number;
  hiddenTestsTotal: number;
  passed: boolean;
}

export interface CompleteRoadmapItemResponseDto {
  roadmapId: string;
  completedItemId: string;
  nextAvailableItemId: string | null;
  roadmapStatus: RoadmapStatus;
}

// ==================== ERROR CODES ====================

export const ROADMAP_ERROR_CODES = {
  UNSUPPORTED_LANGUAGE: 'UNSUPPORTED_LANGUAGE',
  GRAPH_UNAVAILABLE: 'GRAPH_UNAVAILABLE',
  LOCKED_ITEM: 'LOCKED_ITEM',
  PRETEST_COOLDOWN: 'PRETEST_COOLDOWN',
  PREREQUISITE_SURVEY_MISSING: 'PREREQUISITE_SURVEY_MISSING',
  PRETEST_ALREADY_FINALIZED: 'PRETEST_ALREADY_FINALIZED',
  DOD_NOT_MET: 'DOD_NOT_MET',
  PRETEST_UNAVAILABLE: 'PRETEST_UNAVAILABLE',
  IDEMPOTENCY_CONFLICT: 'IDEMPOTENCY_CONFLICT',
  RUNNER_UNAVAILABLE: 'RUNNER_UNAVAILABLE',
  ASSESSMENT_NOT_READY: 'ASSESSMENT_NOT_READY',
  NO_GAPS: 'NO_GAPS',
  GENERATION_FAILED: 'GENERATION_FAILED',
} as const;

export type RoadmapErrorCode = typeof ROADMAP_ERROR_CODES[keyof typeof ROADMAP_ERROR_CODES];
