const test = require('node:test');
const assert = require('node:assert/strict');
require('ts-node/register/transpile-only');
const { planPythonBasicsRoadmap } = require('../src/modules/onboarding/roadmapPlanner');

const lesson = (lessonId, primarySkillId, prerequisiteLessonIds, curriculumOrder) => ({
  lessonId, primarySkillId, prerequisiteLessonIds, curriculumOrder,
});
const catalog = [
  lesson('INTRO', 'BASICS', [], 1),
  lesson('MATH', 'MATH', ['INTRO'], 2),
  lesson('STRING', 'STRING', ['INTRO'], 3),
  lesson('STRING_NEXT', 'STRING', ['STRING'], 4),
];

test('weak skill changes branch order but never violates prerequisites', () => {
  const plan = planPythonBasicsRoadmap(catalog, new Set(), {
    MATH: { masteryScore: 0.9, confidence: 0.9, evidenceCount: 2 },
    STRING: { masteryScore: 0.1, confidence: 0.9, evidenceCount: 2 },
  });
  assert.deepEqual(plan.map(item => item.lesson.lessonId), ['INTRO', 'STRING', 'STRING_NEXT', 'MATH']);
  assert.equal(plan[1].effectivePolicy, 'WEAK_SKILL');
});

test('missing evidence follows curriculum and cycles fail closed', () => {
  assert.deepEqual(planPythonBasicsRoadmap(catalog, new Set(), {}).map(item => item.lesson.lessonId),
    ['INTRO', 'MATH', 'STRING', 'STRING_NEXT']);
  assert.throws(() => planPythonBasicsRoadmap([
    lesson('A', 'A', ['B'], 1), lesson('B', 'B', ['A'], 2),
  ], new Set(), {}), /LESSON_CATALOG_INVALID/);
});
