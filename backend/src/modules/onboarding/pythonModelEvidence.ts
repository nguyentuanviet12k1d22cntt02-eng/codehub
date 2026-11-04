import { createHash } from 'crypto';

export const PYTHON_GRADING_EVIDENCE = 'python-code-grading/1.0';
const sha = (value: string) => createHash('sha256').update(value).digest('hex');

export const pythonCodeHash = sha;

export interface VersionedPythonExercise {
  id: string; lessonId: string; title: string; problemDescription: string;
  starterCode: string | null;
  testCases: Array<{ id: string; input: string; expectedOutput: string; isHidden: boolean }>;
}

/** Server-owned fingerprint includes the complete hidden contract; only its hash leaves the backend. */
export function pythonContentVersion(exercise: VersionedPythonExercise): string {
  return 'python-content-v1:' + sha(JSON.stringify({
    contract: PYTHON_GRADING_EVIDENCE, exerciseId: exercise.id, lessonId: exercise.lessonId,
    title: exercise.title, statement: exercise.problemDescription, starter: exercise.starterCode,
    cases: [...exercise.testCases].sort((a,b) => a.id.localeCompare(b.id)).map(t =>
      [t.id, t.input, t.expectedOutput, t.isHidden]),
  }));
}

export interface TrustedFeedback {
  event_id: string; item_id: string; content_version: string; skill_id: string;
  correct: boolean; feedback_ready_at: string;
}

export function trustedPythonFeedback(
  events: readonly any[], submissions: readonly any[], exercises: readonly VersionedPythonExercise[],
  lessonSkills: ReadonlyMap<string, string>, cutoff: Date,
): TrustedFeedback[] {
  const bySubmission = new Map(submissions.map(s => [s.id,s]));
  const byExercise = new Map(exercises.map(e => [e.id,e]));
  const result: TrustedFeedback[] = [], seen = new Set<string>();
  for (const e of events) {
    const submission = bySubmission.get(e.sourceRecordId), exercise = byExercise.get(e.itemId);
    const skill = exercise && lessonSkills.get(exercise.lessonId), payload = e.payload;
    if (!submission || !exercise || !skill || seen.has(e.sourceRecordId)
      || e.userId !== submission.userId || e.sourceType !== 'COURSE_SUBMISSION'
      || e.language !== 'PYTHON' || e.dataOrigin !== 'REAL' || submission.language !== 'PYTHON'
      || submission.exerciseId !== exercise.id || !['PASSED','FAILED'].includes(submission.status)
      || e.status !== submission.status || e.isCorrect !== (submission.status === 'PASSED')
      || e.codeHash !== sha(submission.code) || e.contentVersion !== pythonContentVersion(exercise)
      || !payload || payload.gradingContract !== PYTHON_GRADING_EVIDENCE
      || typeof payload.feedbackReadyAt !== 'string'
      || !Number.isInteger(e.testsTotal) || e.testsTotal !== exercise.testCases.length || e.testsTotal <= 0
      || !Number.isInteger(e.testsPassed) || e.testsPassed < 0 || e.testsPassed > e.testsTotal
      || (e.isCorrect && e.testsPassed !== e.testsTotal)) continue;
    const ready = new Date(payload.feedbackReadyAt);
    if (!Number.isFinite(ready.getTime()) || ready >= cutoff || ready < submission.submittedAt) continue;
    seen.add(e.sourceRecordId);
    result.push({event_id:e.id,item_id:exercise.id,content_version:e.contentVersion,
      skill_id:skill,correct:e.isCorrect,feedback_ready_at:ready.toISOString()});
  }
  return result.sort((a,b) => a.feedback_ready_at.localeCompare(b.feedback_ready_at) || a.event_id.localeCompare(b.event_id));
}

