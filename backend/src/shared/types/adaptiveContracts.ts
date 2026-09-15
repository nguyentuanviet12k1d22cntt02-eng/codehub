/**
 * Data Contracts chuẩn hóa cho Kiến trúc Multi-Agent Adaptive Learning
 * Đồng bộ 1:1 với Pydantic models trong ai-service/app/contracts/
 */

export type AdaptiveIntent = 
    | 'REQUEST_ADAPTIVE_EXERCISE'
    | 'CHECK_WEAKNESS'
    | 'EXPLAIN_CONCEPT'
    | 'GENERAL_CHAT';

export type AdaptiveLanguage = 'python' | 'cpp' | 'javascript' | 'sql';

export type AdaptiveDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'CHALLENGE';

export type AdaptiveMode = 'remediation' | 'progression' | 'diagnostic';

export interface RoutingDecision {
    intent: AdaptiveIntent;
    language: AdaptiveLanguage;
    topic?: string | null;
    difficulty_request: 'easier' | 'same' | 'harder' | 'auto';
    mode: AdaptiveMode;
    confidence: number;
    user_text: string;
    trace_id: string;
}

export interface ExerciseSpecification {
    target_concept: string;
    concept_title?: string | null;
    language: AdaptiveLanguage;
    target_sub_skills: string[];
    difficulty: AdaptiveDifficulty;
    mode: AdaptiveMode;
    prerequisites: string[];
    required_constructs: string[];
    forbidden_constructs: string[];
    recent_errors: string[];
    test_constraints: Record<string, any>;
    reasoning?: string | null;
    trace_id: string;
}

export interface TestCaseResult {
    id?: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    error?: string | null;
}

export interface ExecutionResult {
    submission_id: string;
    user_id?: string | null;
    exercise_id?: string | null;
    concept_id?: string | null;
    status: 'PASSED' | 'WRONG_ANSWER' | 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'TIMEOUT' | 'CONSTRAINT_VIOLATION';
    passed_count: number;
    total_count: number;
    test_results: TestCaseResult[];
    code: string;
    runtime: AdaptiveLanguage;
    raw_error?: string | null;
    trace_id: string;
}

export interface ErrorEvent {
    error_id: string;
    submission_id: string;
    normalized_type: 'SYNTAX_ERROR' | 'TYPE_ERROR' | 'LOGIC_ERROR' | 'RUNTIME_ERROR' | 'CONSTRAINT_VIOLATION' | 'TIMEOUT';
    sub_type?: string | null;
    message: string;
    test_case_id?: string | null;
    code_location?: string | null;
    code_excerpt?: string | null;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    created_at: string;
    trace_id: string;
}

export interface CandidateAttribution {
    concept: string;
    sub_skill?: string | null;
    confidence: number;
}

export interface ConceptAttribution {
    error_id: string;
    submission_id: string;
    candidates: CandidateAttribution[];
    selected?: CandidateAttribution | null;
    evidence: string;
    model_version: string;
    created_at: string;
    trace_id: string;
}

export interface LearnerState {
    user_id: string;
    concept_id: string;
    mastery: number; // 0.0 -> 1.0
    confidence: number;
    attempts: number;
    correct_count: number;
    wrong_count: number;
    last_attempt_at?: string | null;
    current_streak: number;
    recent_error_ids: string[];
}

export interface MasteryEvent {
    event_id: string;
    user_id: string;
    concept_id: string;
    previous_mastery: number;
    delta: number;
    new_mastery: number;
    reason: string;
    evidence_ids: string[];
    policy_version: string;
    created_at: string;
    trace_id: string;
}

export interface AdaptiveExerciseTestCase {
    id?: string;
    input: string;
    expected_output: string;
    is_hidden: boolean;
    explanation?: string;
}

export interface AdaptiveExerciseScaffoldHints {
    scaffold_1_conceptual: string;
    scaffold_2_syntax: string;
    scaffold_3_pseudocode: string;
}

export interface AdaptiveExerciseModel {
    exercise_id: string;
    title: string;
    concept_id: string;
    concept_name: string;
    language: AdaptiveLanguage;
    difficulty: AdaptiveDifficulty;
    difficulty_stars: number;
    mode: AdaptiveMode;
    problem_statement: string;
    quick_theory: string;
    starter_code: string;
    reference_solution: string;
    test_cases: AdaptiveExerciseTestCase[];
    hints?: AdaptiveExerciseScaffoldHints | null;
    constraints: string[];
    common_pitfall_warning?: string | null;
    detailed_theory?: string | null;
    spec_snapshot?: ExerciseSpecification | null;
    trace_id: string;
}
