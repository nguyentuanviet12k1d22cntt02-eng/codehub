export type AdaptiveDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'CHALLENGE';

export interface MasteryObservation {
    previousMastery: number;
    priorAttempts: number;
    priorEvidenceWeight?: number;
    passedCases: number;
    totalCases: number;
    difficulty: AdaptiveDifficulty | string;
    repeatedExercise: boolean;
}

export interface MasteryUpdate {
    nextMastery: number;
    delta: number;
    observedScore: number;
    observationWeight: number;
    confidenceBefore: number;
    confidenceAfter: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function calculateMasteryUpdate(observation: MasteryObservation): MasteryUpdate {
    const totalCases = Math.max(1, observation.totalCases);
    const observedScore = clamp(observation.passedCases / totalCases, 0, 1);
    const difficultyWeight: Record<string, number> = { EASY: .8, MEDIUM: 1, HARD: 1.2, CHALLENGE: 1.4 };
    const noveltyWeight = observation.repeatedExercise ? .35 : 1;
    const observationWeight = (difficultyWeight[observation.difficulty] || 1) * noveltyWeight;
    const priorEvidenceWeight = Math.max(0, observation.priorEvidenceWeight ?? observation.priorAttempts);
    const historyWeight = Math.min(8, Math.max(2, 1 + 2 * Math.log2(1 + priorEvidenceWeight)));
    const rawNext = (clamp(observation.previousMastery, 0, 1) * historyWeight + observedScore * observationWeight)
        / (historyWeight + observationWeight);
    const nextMastery = Math.round(clamp(rawNext, .05, .98) * 10000) / 10000;
    const delta = Math.round((nextMastery - observation.previousMastery) * 10000) / 10000;
    const confidenceBefore = 1 - Math.exp(-priorEvidenceWeight / 3);
    const confidenceAfter = 1 - Math.exp(-(priorEvidenceWeight + observationWeight) / 3);
    return { nextMastery, delta, observedScore, observationWeight, confidenceBefore, confidenceAfter };
}
