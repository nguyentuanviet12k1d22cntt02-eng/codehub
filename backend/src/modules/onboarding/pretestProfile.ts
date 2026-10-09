/** Pure scorer for finalized, server-graded Pre-test evidence.
 * Callers must read answers and grading provenance from trusted storage, never
 * from a learner request. This module does not create an assessment or roadmap. */
import { PretestQuestionType, SupportedLanguage, LearnerSkillStatus } from '../../shared/types/roadmapContracts';
import { getLanguageGraphConfig } from './onboardingConfig';

export interface FinalizedAttemptScope {
  userId: string;
  language: SupportedLanguage;
  goalId: string;
  graphVersion: string;
  status: 'SUBMITTED' | 'TIMED_OUT';
}

export interface VerifiedPretestAnswer {
  userId: string;
  language: SupportedLanguage;
  goalId: string;
  graphVersion: string;
  questionSnapshotId: string;
  questionFamilyId: string;
  primarySkillId: string;
  questionType: PretestQuestionType;
  source: 'CURATED_VALIDATED';
  isAnswered: boolean;
  score: number | null;
  gradingMethod: 'OBJECTIVE_VERIFIED' | 'RUNNER_VERIFIED' | 'INFRASTRUCTURE_FAILURE' | null;
  scoredAt: string | null;
}

export interface PretestSkillProfile {
  skillId: string;
  masteryScore: number | null;
  confidence: number;
  evidenceCount: number;
  hasApplicationEvidence: boolean;
  status: LearnerSkillStatus;
  evidenceQuestionIds: string[];
  lastAssessedAt: string | null;
}

export interface PretestProfileResult {
  language: SupportedLanguage;
  goalId: string;
  graphVersion: string;
  profileVersion: '2.0';
  skills: Record<string, PretestSkillProfile>;
  answeredQuestions: number;
  unansweredQuestions: number;
}

const QUESTION_WEIGHT: Record<PretestQuestionType, number> = {
  CONCEPT: 1, TRACING: 1.25, BUG_HUNTING: 1.25, PRACTICAL: 2,
};

function goalSkillIds(language: SupportedLanguage, goalId: string, graphVersion: string): string[] {
  const graph = getLanguageGraphConfig(language);
  if (graph.graphVersion !== graphVersion) throw new Error('GRAPH_VERSION_MISMATCH');
  const goal = graph.goals.find(candidate => candidate.goalId === goalId);
  if (!goal) throw new Error('INVALID_GOAL_ID');
  const byId = new Map(graph.skills.map(skill => [skill.id, skill]));
  const closure = new Set(graph.skills.filter(skill => goal.moduleIds.includes(skill.moduleId)).map(skill => skill.id));
  const pending = [...closure];
  while (pending.length > 0) {
    const skill = byId.get(pending.pop()!);
    if (!skill) throw new Error('GRAPH_GOAL_INVALID');
    for (const prerequisite of skill.prerequisites) {
      if (!byId.has(prerequisite)) throw new Error('GRAPH_GOAL_INVALID');
      if (!closure.has(prerequisite)) { closure.add(prerequisite); pending.push(prerequisite); }
    }
  }
  return graph.skills.filter(skill => closure.has(skill.id)).map(skill => skill.id);
}

export function buildPretestProfile(scope: FinalizedAttemptScope,
                                    answers: readonly VerifiedPretestAnswer[]): PretestProfileResult {
  if (!scope.userId || !['SUBMITTED', 'TIMED_OUT'].includes(scope.status)) {
    throw new Error('ASSESSMENT_NOT_FINALIZED');
  }
  const skillIds = goalSkillIds(scope.language, scope.goalId, scope.graphVersion);
  const validSkills = new Set(skillIds);
  const questionIds = new Set<string>();
  const families = new Set<string>();
  const bySkill = new Map<string, VerifiedPretestAnswer[]>();
  let answeredQuestions = 0;
  for (const answer of answers) {
    if (answer.userId !== scope.userId || answer.language !== scope.language
      || answer.goalId !== scope.goalId || answer.graphVersion !== scope.graphVersion) {
      throw new Error('PRETEST_EVIDENCE_SCOPE_MISMATCH');
    }
    if (!answer.questionSnapshotId || !answer.questionFamilyId || !validSkills.has(answer.primarySkillId)
      || answer.source !== 'CURATED_VALIDATED' || !Object.prototype.hasOwnProperty.call(QUESTION_WEIGHT, answer.questionType)
      || questionIds.has(answer.questionSnapshotId) || families.has(answer.questionFamilyId)) {
      throw new Error('PRETEST_EVIDENCE_INVALID');
    }
    questionIds.add(answer.questionSnapshotId);
    families.add(answer.questionFamilyId);
    if (!answer.isAnswered) {
      if (answer.score !== null || answer.gradingMethod !== null) throw new Error('PRETEST_BLANK_HAS_GRADE');
      continue;
    }
    if (!Number.isFinite(answer.score) || answer.score! < 0 || answer.score! > 1
      || !answer.scoredAt || Number.isNaN(Date.parse(answer.scoredAt))) {
      throw new Error('PRETEST_SCORE_INVALID');
    }
    const expectedMethod = answer.questionType === 'PRACTICAL' ? 'RUNNER_VERIFIED' : 'OBJECTIVE_VERIFIED';
    if (answer.gradingMethod !== expectedMethod) throw new Error('PRETEST_GRADING_UNVERIFIED');
    if (answer.questionType !== 'PRACTICAL' && answer.score !== 0 && answer.score !== 1) {
      throw new Error('PRETEST_OBJECTIVE_SCORE_INVALID');
    }
    answeredQuestions++;
    const group = bySkill.get(answer.primarySkillId) ?? [];
    group.push(answer);
    bySkill.set(answer.primarySkillId, group);
  }

  const skills: Record<string, PretestSkillProfile> = {};
  for (const skillId of skillIds) {
    const evidence = bySkill.get(skillId) ?? [];
    const evidenceCount = evidence.length;
    const totalWeight = evidence.reduce((sum, answer) => sum + QUESTION_WEIGHT[answer.questionType], 0);
    const masteryScore = totalWeight > 0
      ? evidence.reduce((sum, answer) => sum + QUESTION_WEIGHT[answer.questionType] * answer.score!, 0) / totalWeight
      : null;
    const confidence = 1 - (0.4 ** evidenceCount);
    // Only a runner-verified practical answer is unambiguously application evidence.
    const hasApplicationEvidence = evidence.some(answer => answer.questionType === 'PRACTICAL');
    let status: LearnerSkillStatus = 'UNKNOWN';
    if (masteryScore !== null && confidence >= 0.5) {
      if (masteryScore < 0.45) status = 'NEEDS_FOUNDATION';
      else if (masteryScore >= 0.75 && confidence >= 0.7 && hasApplicationEvidence) status = 'PROFICIENT';
      else status = 'DEVELOPING';
    }
    skills[skillId] = {
      skillId, masteryScore, confidence, evidenceCount, hasApplicationEvidence, status,
      evidenceQuestionIds: evidence.map(answer => answer.questionSnapshotId),
      lastAssessedAt: evidence.length > 0
        ? evidence.reduce((latest, answer) => Date.parse(answer.scoredAt!) > Date.parse(latest) ? answer.scoredAt! : latest,
          evidence[0].scoredAt!) : null,
    };
  }
  return {
    language: scope.language, goalId: scope.goalId, graphVersion: scope.graphVersion,
    profileVersion: '2.0', skills, answeredQuestions, unansweredQuestions: answers.length - answeredQuestions,
  };
}
