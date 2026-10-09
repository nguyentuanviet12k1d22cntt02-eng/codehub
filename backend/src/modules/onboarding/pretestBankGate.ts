/** Read-only quality gate for pre-test authoring. No attempt is issued here. */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getLanguageGraphConfig } from './onboardingConfig';
import { PretestQuestionType, SupportedLanguage } from '../../shared/types/roadmapContracts';

type QuestionType = PretestQuestionType;
const TYPES: readonly QuestionType[] = ['CONCEPT', 'TRACING', 'BUG_HUNTING', 'PRACTICAL'];
const QUOTAS: Record<number, Record<QuestionType, number>> = {
  12: { CONCEPT: 3, TRACING: 4, BUG_HUNTING: 2, PRACTICAL: 3 },
  13: { CONCEPT: 3, TRACING: 4, BUG_HUNTING: 3, PRACTICAL: 3 },
  14: { CONCEPT: 4, TRACING: 4, BUG_HUNTING: 3, PRACTICAL: 3 },
  15: { CONCEPT: 4, TRACING: 5, BUG_HUNTING: 3, PRACTICAL: 3 },
};
const GATEWAYS: Record<SupportedLanguage, readonly string[]> = {
  PYTHON: ['PY-BASICS-01', 'PY-BASICS-03', 'PY-STRING-02', 'PY-FLOW-01', 'PY-FLOW-03', 'PY-LIST-01', 'PY-DICT-01', 'PY-FUNC-01', 'PY-EXC-01', 'PY-IO-01', 'PY-OOP-01', 'PY-OOP-04'],
  JAVASCRIPT: ['JS-VAR-01', 'JS-TYPE-01', 'JS-COND-01', 'JS-LOOP-01', 'JS-FUNC-01', 'JS-ARRAY-01', 'JS-OBJECT-01', 'JS-SCOPE-01', 'JS-ARRAY-HOF-01', 'JS-CLASS-01', 'JS-ERROR-01', 'JS-MODULE-01'],
  CPP: ['CPP-SYNTAX-01', 'CPP-TYPE-01', 'CPP-COND-01', 'CPP-LOOP-01', 'CPP-FUNC-01', 'CPP-ARRAY-01', 'CPP-VECTOR-01', 'CPP-STRUCT-01', 'CPP-PTR-01', 'CPP-RECUR-01', 'CPP-BUILD-01', 'CPP-SMARTPTR-01'],
  SQL: ['SQL-RDBMS-01', 'SQL-DQL-01', 'SQL-WHERE-01', 'SQL-LOGIC-01', 'SQL-SORT-01', 'SQL-AGG-01', 'SQL-JOIN-01'],
};

export interface BankItem {
  id: string;
  language: SupportedLanguage;
  goalId: string;
  graphVersion: string;
  bankVersion: string;
  questionFamilyId: string;
  questionVersion: string;
  primarySkillId: string;
  secondarySkillIds?: string[];
  questionType: QuestionType;
  difficulty: number;
  prompt: string;
  options?: Array<{ key: string; text: string }>;
  starterCode?: string;
  runnerSpec?: { language: SupportedLanguage; mode: 'STDIN_STDOUT'; timeLimitMs: number };
  testCases?: Array<{ input: string; expectedStdout: string; isHidden: boolean }>;
  correctAnswerHash?: string;
  testCasesSha256?: string;
  source: string;
  reviewStatus: string;
  reviewers: string[];
  validationReportSha256: string;
  runnerValidationSha256?: string;
}

export interface PretestBankReadiness {
  status: 'BANK_READY_FOR_ATTEMPT_IMPLEMENTATION' | 'PRETEST_UNAVAILABLE';
  language: SupportedLanguage;
  goalId: string;
  graphVersion: string;
  requiredQuestions: number;
  availableByType: Record<QuestionType, number>;
  missingByType: Record<QuestionType, number>;
  missingGatewaySkills: string[];
  selectionConflict: boolean;
  rejectedBankItems: number;
  attemptCreationAvailable: boolean;
}

interface ApprovedBankSource {
  language: SupportedLanguage;
  goalId: string;
  graphVersion: string;
  bankVersion: string;
  contentFile: string;
  contentSha256: string;
  approvedItemIds: string[];
  source: 'CURATED_VALIDATED';
  reviewStatus: 'APPROVED';
  reviewers: string[];
  validationReportSha256: string;
  runnerValidationSha256: string;
}

function sha256(value: string | Buffer): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/** Exact, deterministic search over the small (12–15 item) blueprint. A greedy
 * gateway-first pass can reject a valid bank when a gateway has two question
 * types but another gateway has only one. This search is authoring-only. */
function findBlueprintSelection(eligible: readonly BankItem[], gateways: readonly string[],
                                quotas: Record<QuestionType, number>): BankItem[] | null {
  const ordered = [...eligible].sort((a, b) => a.id.localeCompare(b.id));
  const byGateway = gateways.map(skill => ({
    skill, items: ordered.filter(item => item.primarySkillId === skill),
  })).sort((a, b) => a.items.length - b.items.length || a.skill.localeCompare(b.skill));
  if (byGateway.some(group => group.items.length === 0)) return null;
  const remaining = { ...quotas };
  const usedFamilies = new Set<string>();
  const selected: BankItem[] = [];
  const failedStates = new Set<string>();

  function stateKey(phase: string): string {
    return `${phase}|${TYPES.map(type => remaining[type]).join(',')}|${[...usedFamilies].sort().join(',')}`;
  }
  function take(item: BankItem): void {
    selected.push(item);
    usedFamilies.add(item.questionFamilyId);
    remaining[item.questionType]--;
  }
  function untake(item: BankItem): void {
    selected.pop();
    usedFamilies.delete(item.questionFamilyId);
    remaining[item.questionType]++;
  }
  function hasCapacity(): boolean {
    return TYPES.every(type => {
      const families = new Set(ordered.filter(item => item.questionType === type
        && !usedFamilies.has(item.questionFamilyId)).map(item => item.questionFamilyId));
      return families.size >= remaining[type];
    });
  }
  function fill(): boolean {
    if (TYPES.every(type => remaining[type] === 0)) return true;
    if (!hasCapacity()) return false;
    const key = stateKey('fill');
    if (failedStates.has(key)) return false;
    const types = TYPES.filter(type => remaining[type] > 0).sort((a, b) => {
      const available = (type: QuestionType) => new Set(ordered.filter(item => item.questionType === type
        && !usedFamilies.has(item.questionFamilyId)).map(item => item.questionFamilyId)).size;
      return (available(a) - remaining[a]) - (available(b) - remaining[b]) || a.localeCompare(b);
    });
    for (const item of ordered) {
      if (item.questionType !== types[0] || usedFamilies.has(item.questionFamilyId)) continue;
      take(item);
      if (fill()) return true;
      untake(item);
    }
    failedStates.add(key);
    return false;
  }
  function coverGateway(index: number): boolean {
    if (index === byGateway.length) return fill();
    if (!hasCapacity()) return false;
    const key = stateKey(`gateway-${index}`);
    if (failedStates.has(key)) return false;
    for (const item of byGateway[index].items) {
      if (remaining[item.questionType] <= 0 || usedFamilies.has(item.questionFamilyId)) continue;
      take(item);
      if (coverGateway(index + 1)) return true;
      untake(item);
    }
    failedStates.add(key);
    return false;
  }
  return coverGateway(0) ? [...selected] : null;
}

function isApproved(item: BankItem): boolean {
  const hash = (value: unknown) => typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value);
  const reviewed = Array.isArray(item.reviewers) && new Set(item.reviewers
    .filter((reviewer): reviewer is string => typeof reviewer === 'string' && reviewer.trim().length > 0)
    .map(reviewer => reviewer.trim().toLocaleLowerCase('en-US'))).size >= 2;
  const answerReady = item.questionType === 'PRACTICAL'
    ? hash(item.testCasesSha256) && hash(item.runnerValidationSha256)
      && Array.isArray(item.testCases) && item.testCases.length > 0
      && item.testCases.some(testCase => testCase?.isHidden === true)
      && item.testCases.every(testCase => typeof testCase?.input === 'string'
        && typeof testCase?.expectedStdout === 'string' && typeof testCase?.isHidden === 'boolean')
      && item.runnerSpec?.language === item.language && item.runnerSpec.mode === 'STDIN_STDOUT'
      && Number.isInteger(item.runnerSpec.timeLimitMs) && item.runnerSpec.timeLimitMs > 0
    : Array.isArray(item.options) && item.options.length >= 2
      && new Set(item.options.map(option => option?.key)).size === item.options.length
      && item.options.every(option => typeof option?.key === 'string' && option.key.trim().length > 0
        && typeof option?.text === 'string' && option.text.trim().length > 0)
      && hash(item.correctAnswerHash);
  return typeof item.id === 'string' && item.id.trim().length > 0
    && typeof item.questionFamilyId === 'string' && item.questionFamilyId.trim().length > 0
    && typeof item.primarySkillId === 'string' && item.primarySkillId.trim().length > 0
    && typeof item.prompt === 'string' && item.prompt.trim().length > 0
    && TYPES.includes(item.questionType)
    && item.source === 'CURATED_VALIDATED'
    && item.reviewStatus === 'APPROVED'
    && reviewed && hash(item.validationReportSha256) && answerReady;
}

export function loadPretestBank(): BankItem[] {
  const filename = path.join(__dirname, '../../infrastructure/data/pretestBank.v1.json');
  const sourceFile = fs.existsSync(filename)
    ? filename : path.resolve(__dirname, '../../../src/infrastructure/data/pretestBank.v1.json');
  if (!fs.existsSync(sourceFile)) return [];
  const raw: unknown = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)
      || (raw as any).schemaVersion !== 'learnpython-pretest-bank/1.0.0'
      || !Array.isArray((raw as any).items) || !Array.isArray((raw as any).sources)) {
    throw new Error('PRETEST_BANK_INVALID: Bank manifest không đúng hợp đồng.');
  }
  const manifest = raw as { items: BankItem[]; sources: ApprovedBankSource[] };
  const composed: BankItem[] = [...manifest.items];
  const dataDir = path.dirname(sourceFile);
  for (const source of manifest.sources) {
    if (!source || path.basename(source.contentFile) !== source.contentFile
      || !/^[a-f0-9]{64}$/i.test(source.contentSha256)
      || !Array.isArray(source.approvedItemIds) || new Set(source.approvedItemIds).size !== source.approvedItemIds.length) {
      throw new Error('PRETEST_BANK_INVALID: Nguồn nội dung đã duyệt không hợp lệ.');
    }
    const contentPath = path.join(dataDir, source.contentFile);
    if (!fs.existsSync(contentPath)) throw new Error('PRETEST_BANK_INVALID: Thiếu tệp nội dung đã duyệt.');
    const contentBytes = fs.readFileSync(contentPath);
    if (sha256(contentBytes) !== source.contentSha256.toLowerCase()) {
      throw new Error('PRETEST_BANK_CONTENT_MISMATCH: Nội dung đã đổi sau khi duyệt.');
    }
    const draft: any = JSON.parse(contentBytes.toString('utf8'));
    if (draft?.schemaVersion !== 'learnpython-pretest-bank-draft/1.0.0'
      || draft.language !== source.language || draft.goalId !== source.goalId
      || draft.graphVersion !== source.graphVersion || !Array.isArray(draft.items)) {
      throw new Error('PRETEST_BANK_INVALID: Phạm vi nguồn nội dung không khớp manifest.');
    }
    const approvedIds = new Set(source.approvedItemIds);
    for (const item of draft.items.filter((candidate: any) => approvedIds.has(candidate?.id))) {
      const options = Array.isArray(item.options) ? item.options.map((option: any) => ({
        key: String(option.key), text: String(option.text),
      })) : undefined;
      const testCases = Array.isArray(item.testCases) ? item.testCases.map((testCase: any) => ({
        input: String(testCase.input), expectedStdout: String(testCase.expectedStdout), isHidden: testCase.isHidden === true,
      })) : undefined;
      composed.push({
        id: item.id, language: source.language, goalId: source.goalId,
        graphVersion: source.graphVersion, bankVersion: source.bankVersion,
        questionFamilyId: item.questionFamilyId, questionVersion: source.contentSha256.slice(0, 16),
        primarySkillId: item.primarySkillId,
        secondarySkillIds: Array.isArray(item.secondarySkillIds) ? item.secondarySkillIds : [],
        questionType: item.questionType, difficulty: item.difficulty, prompt: item.prompt,
        options, starterCode: item.starterCode,
        runnerSpec: item.runnerSpec, testCases,
        correctAnswerHash: sha256(String(item.questionType === 'PRACTICAL'
          ? item.referenceSolution : item.correctOption)),
        testCasesSha256: testCases ? sha256(JSON.stringify(testCases)) : undefined,
        source: source.source, reviewStatus: source.reviewStatus,
        reviewers: source.reviewers,
        validationReportSha256: source.validationReportSha256,
        runnerValidationSha256: item.questionType === 'PRACTICAL' ? source.runnerValidationSha256 : undefined,
      });
    }
    if (draft.items.filter((candidate: any) => approvedIds.has(candidate?.id)).length !== approvedIds.size) {
      throw new Error('PRETEST_BANK_INVALID: Manifest tham chiếu câu hỏi không tồn tại.');
    }
  }
  return composed;
}

export function selectPretestBankItems(language: SupportedLanguage, goalId: string,
                                       bank: readonly BankItem[]): BankItem[] | null {
  const graph = getLanguageGraphConfig(language);
  const goal = graph.goals.find(item => item.goalId === goalId);
  if (!goal) throw new Error('INVALID_GOAL_ID: Goal không thuộc ngôn ngữ được chọn.');
  const skillById = new Map(graph.skills.map(skill => [skill.id, skill]));
  const closure = new Set(graph.skills.filter(skill => goal.moduleIds.includes(skill.moduleId)).map(skill => skill.id));
  const pending = [...closure];
  while (pending.length) {
    const skill = skillById.get(pending.pop()!);
    if (!skill) throw new Error('GRAPH_GOAL_INVALID: Skill không tồn tại.');
    for (const prerequisite of skill.prerequisites) {
      if (!skillById.has(prerequisite)) throw new Error('GRAPH_GOAL_INVALID: Tiền đề không tồn tại.');
      if (!closure.has(prerequisite)) { closure.add(prerequisite); pending.push(prerequisite); }
    }
  }
  const quotas = QUOTAS[goal.estimatedPretestQuestions];
  if (!quotas) throw new Error('PRETEST_BLUEPRINT_INVALID');
  const eligible = bank.filter(item => item && item.language === language && item.goalId === goalId
    && item.graphVersion === graph.graphVersion && closure.has(item.primarySkillId) && isApproved(item));
  const idCounts = new Map<string, number>();
  for (const item of eligible) idCounts.set(item.id, (idCounts.get(item.id) ?? 0) + 1);
  const unique = eligible.filter(item => idCounts.get(item.id) === 1);
  const gateways = GATEWAYS[language].filter(skill => closure.has(skill));
  const selected = findBlueprintSelection(unique, gateways, quotas);
  return selected?.sort((a, b) => a.id.localeCompare(b.id)) ?? null;
}

export function evaluatePretestBank(language: SupportedLanguage, goalId: string,
                                    bank: readonly BankItem[]): PretestBankReadiness {
  const graph = getLanguageGraphConfig(language);
  const goal = graph.goals.find(item => item.goalId === goalId);
  if (!goal) throw new Error('INVALID_GOAL_ID: Goal không thuộc ngôn ngữ được chọn.');
  const skillById = new Map(graph.skills.map(skill => [skill.id, skill]));
  const closure = new Set(graph.skills.filter(skill => goal.moduleIds.includes(skill.moduleId)).map(skill => skill.id));
  const pending = [...closure];
  while (pending.length) {
    const skill = skillById.get(pending.pop()!);
    if (!skill) throw new Error('GRAPH_GOAL_INVALID: Skill không tồn tại.');
    for (const prerequisite of skill.prerequisites) {
      if (!skillById.has(prerequisite)) throw new Error('GRAPH_GOAL_INVALID: Tiền đề không tồn tại.');
      if (!closure.has(prerequisite)) { closure.add(prerequisite); pending.push(prerequisite); }
    }
  }
  const quotas = QUOTAS[goal.estimatedPretestQuestions];
  if (!quotas) throw new Error('PRETEST_BLUEPRINT_INVALID');
  const eligible = bank.filter(item => item && item.language === language && item.goalId === goalId
    && item.graphVersion === graph.graphVersion && closure.has(item.primarySkillId) && isApproved(item));
  const idCounts = new Map<string, number>();
  for (const item of eligible) idCounts.set(item.id, (idCounts.get(item.id) ?? 0) + 1);
  const uniquelyIdentified = eligible.filter(item => idCounts.get(item.id) === 1);
  const counts = Object.fromEntries(TYPES.map(type => [type, 0])) as Record<QuestionType, number>;
  for (const item of uniquelyIdentified) counts[item.questionType]++;

  // A conservative deterministic selection: first represent each gateway,
  // then fill the remaining blueprint slots. Never reuse a question family.
  const selected: BankItem[] = [];
  const families = new Set<string>();
  const remaining = { ...quotas };
  function take(item: BankItem): void {
    selected.push(item); families.add(item.questionFamilyId); remaining[item.questionType]--;
  }
  const gateways = GATEWAYS[language].filter(skill => closure.has(skill));
  for (const skill of gateways) {
    const item = uniquelyIdentified.filter(candidate => candidate.primarySkillId === skill
      && !families.has(candidate.questionFamilyId) && remaining[candidate.questionType] > 0)
      .sort((a, b) => remaining[b.questionType] - remaining[a.questionType] || a.id.localeCompare(b.id))[0];
    if (item) take(item);
  }
  for (const type of TYPES) {
    for (const item of uniquelyIdentified.filter(candidate => candidate.questionType === type)
      .sort((a, b) => a.id.localeCompare(b.id))) {
      if (remaining[type] <= 0) break;
      if (!families.has(item.questionFamilyId)) take(item);
    }
  }
  const exactSelection = selectPretestBankItems(language, goalId, bank);
  const missingGatewaySkills = exactSelection ? [] : gateways.filter(skill => !selected.some(item => item.primarySkillId === skill));
  const complete = exactSelection !== null;
  return {
    status: complete ? 'BANK_READY_FOR_ATTEMPT_IMPLEMENTATION' : 'PRETEST_UNAVAILABLE',
    language, goalId, graphVersion: graph.graphVersion,
    requiredQuestions: goal.estimatedPretestQuestions,
    availableByType: counts, missingByType: complete ? Object.fromEntries(TYPES.map(type => [type, 0])) as Record<QuestionType, number> : remaining,
    missingGatewaySkills, selectionConflict: !complete && TYPES.every(type => counts[type] >= quotas[type])
      && gateways.every(skill => uniquelyIdentified.some(item => item.primarySkillId === skill)),
    rejectedBankItems: bank.length - uniquelyIdentified.length,
    attemptCreationAvailable: complete,
  };
}
