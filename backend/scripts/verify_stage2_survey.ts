import { prisma } from '../src/infrastructure/database/prisma';
import { onboardingService } from '../src/modules/onboarding/onboardingService';
import { CreateSurveyDto } from '../src/shared/types/roadmapContracts';

async function main() {
  console.log('🧪 Starting Stage 2 Onboarding Survey Verification...\n');

  // Create two temporary test users to test multi-tenancy and ownership
  const timestamp = Date.now();
  let verificationFixtureCourseId: string | null = null;
  const testUserA = await prisma.user.create({
    data: {
      username: `test_survey_a_${timestamp}`,
      email: `test_survey_a_${timestamp}@example.invalid`,
      password: 'hashed_password_mock',
    }
  });
  console.log(`✅ Created Test User A: ${testUserA.email}`);

  const testUserB = await prisma.user.create({
    data: {
      username: `test_survey_b_${timestamp}`,
      email: `test_survey_b_${timestamp}@example.invalid`,
      password: 'hashed_password_mock',
    }
  });
  console.log(`✅ Created Test User B: ${testUserB.email}`);

  try {
    // 1. Verify Goals & Modules API for all 4 supported languages
    console.log('\n--- 1. Testing getGoals for all 4 languages ---');
    const languages = ['PYTHON', 'JAVASCRIPT', 'CPP', 'SQL'] as const;
    for (const lang of languages) {
      const goalsData = onboardingService.getGoals(lang);
      console.log(`✅ Language ${lang}: ${goalsData.goals.length} goals, ${goalsData.modules.length} modules, graphVersion: ${goalsData.graphVersion}`);
      if (goalsData.goals.length === 0 || goalsData.modules.length === 0) {
        throw new Error(`FAILED: Language ${lang} has missing goals or modules!`);
      }
    }

    // Negative test: Language 'C' or invalid language must be rejected
    let languageCRejected = false;
    try {
      onboardingService.getGoals('C');
    } catch (err: any) {
      if (err.message.includes('LANGUAGE_NOT_SUPPORTED')) {
        languageCRejected = true;
      }
    }
    if (!languageCRejected) {
      throw new Error('FAILED: Language C was not rejected by getGoals!');
    }
    console.log('✅ Invariant check passed: Language C is strictly rejected (LANGUAGE_NOT_SUPPORTED).');

    // Goal config must remain aligned with the skill graph, not only be non-empty.
    const expectedConfig = {
      PYTHON: { goals: 4, modules: 6, skills: 35 },
      JAVASCRIPT: { goals: 3, modules: 9, skills: 23 },
      CPP: { goals: 3, modules: 7, skills: 21 },
      SQL: { goals: 3, modules: 7, skills: 7 },
    };
    for (const language of languages) {
      const data = onboardingService.getGoals(language);
      const fullGoal = data.goals.at(-1);
      if (!fullGoal || data.goals.length !== expectedConfig[language].goals || data.modules.length !== expectedConfig[language].modules || fullGoal.skillCount !== expectedConfig[language].skills) {
        throw new Error(`FAILED: ${language} goal metadata no longer matches its graph.`);
      }
    }
    console.log('✅ Goal metadata is aligned with all four versioned skill graphs.');

    // 2. Testing Survey Submission: Newbie learner (NEVER_ENROLLED)
    console.log('\n--- 2. Testing Survey Submission: Newbie learner (NEVER_ENROLLED) ---');
    const newbieDto: CreateSurveyDto = {
      surveyVersion: '2.0',
      language: 'PYTHON',
      goalId: 'GOAL_PY_BASICS',
      mcodeHistory: 'NEVER_ENROLLED',
      externalExperience: 'NONE',
      selfAssessment: {
        'MOD-BASICS': 1,
        'MOD-FLOW': 1,
        'MOD-COLLECTIONS': 1,
        'MOD-FUNC': 1,
        'MOD-EXC-IO': 1,
        'MOD-OOP': 1,
      },
      hoursPerWeek: '2_TO_5_HOURS',
      preferredPace: 'BALANCED',
      isDraft: false,
    };
    const surveyA = await onboardingService.createOrUpdateSurvey(testUserA.id, newbieDto);
    console.log(`✅ User A survey created: UUID=${surveyA.surveyId}, status=${surveyA.verificationStatus}, nextStep=${surveyA.nextStep}`);
    if (surveyA.verificationStatus !== 'NEW_STUDENT') {
      throw new Error(`FAILED: Expected NEW_STUDENT but got ${surveyA.verificationStatus}`);
    }

    // 3. Testing Survey Submission: Self-reported COMPLETED without MCODE records
    console.log('\n--- 3. Testing Anti-Tamper: Self-reported COMPLETED without MCODE records ---');
    const liarDto: CreateSurveyDto = {
      surveyVersion: '2.0',
      language: 'JAVASCRIPT',
      goalId: 'GOAL_JS_BASICS',
      mcodeHistory: 'COMPLETED', // claims completed MCODE
      externalExperience: 'OVER_1_YEAR',
      selfAssessment: {
        'MOD-JS-VAR': 3,
        'MOD-JS-TYPE': 3,
        'MOD-JS-CONTROL': 3,
        'MOD-JS-FUNC': 3,
        'MOD-JS-DATA': 3,
        'MOD-JS-ES6': 3,
        'MOD-JS-EXEC': 3,
        'MOD-JS-OOP': 3,
        'MOD-JS-ENG': 3,
      },
      hoursPerWeek: '5_TO_10_HOURS',
      preferredPace: 'PRACTICE_HEAVY',
      isDraft: false,
    };
    const surveyLiar = await onboardingService.createOrUpdateSurvey(testUserA.id, liarDto);
    console.log(`✅ User A Javascript survey: status=${surveyLiar.verificationStatus}`);
    if (surveyLiar.verificationStatus !== 'SELF_REPORTED_UNVERIFIED') {
      throw new Error(`FAILED: Expected SELF_REPORTED_UNVERIFIED for unverified claim, got ${surveyLiar.verificationStatus}`);
    }
    console.log('✅ Anti-tamper verified: Declaring COMPLETED without course records is marked SELF_REPORTED_UNVERIFIED.');

    // The payload is untrusted at the HTTP boundary: unknown module IDs must never be persisted.
    let invalidModuleRejected = false;
    try {
      await onboardingService.createOrUpdateSurvey(testUserA.id, {
        ...newbieDto,
        selfAssessment: { ...newbieDto.selfAssessment, 'MOD-NOT-IN-GRAPH': 3 },
      });
    } catch (err: any) {
      invalidModuleRejected = err.message.includes('INVALID_SELF_ASSESSMENT');
    }
    if (!invalidModuleRejected) {
      throw new Error('FAILED: Unknown module ID was accepted in selfAssessment!');
    }
    console.log('✅ Input validation rejects unknown module IDs before persistence.');

    // 4. Testing Draft Save & Resume
    console.log('\n--- 4. Testing Draft Save & Resume ---');
    const draftDto: CreateSurveyDto = {
      surveyVersion: '2.0',
      language: 'CPP',
      goalId: 'GOAL_CPP_BASICS',
      mcodeHistory: 'LEARNING',
      externalExperience: 'LESS_THAN_3_MONTHS',
      selfAssessment: {
        'MOD-CPP-SYNTAX': 2,
        'MOD-CPP-CONTROL': 1,
      },
      hoursPerWeek: '2_TO_5_HOURS',
      preferredPace: 'THEORY_FIRST',
      isDraft: true,
    };
    const draftSurvey = await onboardingService.createOrUpdateSurvey(testUserA.id, draftDto);
    console.log(`✅ Draft survey saved: UUID=${draftSurvey.surveyId}, isDraft=${draftSurvey.isDraft}, nextStep=${draftSurvey.nextStep}`);
    if (!draftSurvey.isDraft || draftSurvey.nextStep !== 'DRAFT_SAVED') {
      throw new Error('FAILED: Draft survey was not saved with isDraft=true!');
    }

    // Retrieve the draft
    const retrievedDraft = await onboardingService.getLatestSurvey(testUserA.id, 'CPP');
    if (!retrievedDraft || retrievedDraft.id !== draftSurvey.surveyId || !retrievedDraft.isDraft) {
      throw new Error('FAILED: Unable to retrieve saved draft correctly!');
    }
    console.log(`✅ Draft retrieved successfully: goalId=${retrievedDraft.goalId}`);

    // Update draft to finalized
    const finalizedDto: CreateSurveyDto = {
      ...draftDto,
      selfAssessment: {
        'MOD-CPP-SYNTAX': 2,
        'MOD-CPP-CONTROL': 2,
        'MOD-CPP-DATA': 1,
        'MOD-CPP-RECORDS': 1,
        'MOD-CPP-STL': 1,
        'MOD-CPP-ALGO': 1,
        'MOD-CPP-ROBUST': 1,
      },
      isDraft: false,
    };
    const finalizedSurvey = await onboardingService.createOrUpdateSurvey(testUserA.id, finalizedDto);
    console.log(`✅ Draft updated to finalized: isDraft=${finalizedSurvey.isDraft}, nextStep=${finalizedSurvey.nextStep}`);
    if (finalizedSurvey.isDraft || finalizedSurvey.nextStep !== 'READY_FOR_PRETEST') {
      throw new Error('FAILED: Finalized survey still marked as draft!');
    }

    // 5. Testing Security & Multi-tenancy Isolation (User B cannot read/modify User A's survey)
    console.log('\n--- 5. Testing Security & Ownership Protection ---');
    let forbiddenCaught = false;
    try {
      await onboardingService.getSurveyById(testUserB.id, surveyA.surveyId);
    } catch (err: any) {
      if (err.message.includes('FORBIDDEN')) {
        forbiddenCaught = true;
      }
    }
    if (!forbiddenCaught) {
      throw new Error("FAILED: User B was able to access User A's survey!");
    }
    console.log("✅ Ownership check passed: User B cannot access User A's survey (FORBIDDEN).");

    // 6. Test verification state semantics with a course fixture scoped to Python.
    console.log('\n--- 6. Testing verified MCODE progress thresholds ---');
    const fixtureCourse = await prisma.course.create({
      data: {
        title: `QA Survey Python ${timestamp}`,
        description: 'Temporary Stage 2 verification fixture',
        level: 'BASIC',
        status: 'DRAFT',
        createdBy: testUserA.id,
      },
    });
    verificationFixtureCourseId = fixtureCourse.id;
    const fixtureModule = await prisma.module.create({
      data: {
        moduleId: `QA-SURVEY-MODULE-${timestamp}`,
        courseId: fixtureCourse.id,
        title: 'Fixture module',
        orderIndex: 1,
      },
    });
    const fixtureChapter = await prisma.chapter.create({
      data: {
        chapterId: `QA-SURVEY-CHAPTER-${timestamp}`,
        moduleId: fixtureModule.id,
        title: 'Fixture chapter',
        orderIndex: 1,
      },
    });
    const fixtureLessons = await Promise.all(Array.from({ length: 5 }, (_, index) => prisma.lesson.create({
      data: { chapterId: fixtureChapter.id, title: `Fixture lesson ${index + 1}`, orderIndex: index + 1 },
    })));
    await prisma.enrollment.create({ data: { userId: testUserB.id, courseId: fixtureCourse.id } });
    await Promise.all(fixtureLessons.slice(0, 4).map((lesson) => prisma.lessonProgress.create({
      data: { userId: testUserB.id, lessonId: lesson.id, isCompleted: true, completedAt: new Date() },
    })));

    const activity = await onboardingService.verifyMcodeHistory(testUserB.id, 'PYTHON', 'LEARNING');
    if (activity.verificationStatus !== 'VERIFIED_ACTIVITY' || activity.verifiedCourseProgress.progressPercent !== 80) {
      throw new Error(`FAILED: 80% progress must be VERIFIED_ACTIVITY, got ${activity.verificationStatus} at ${activity.verifiedCourseProgress.progressPercent}%.`);
    }
    const contradictoryDeclaration = await onboardingService.verifyMcodeHistory(testUserB.id, 'PYTHON', 'NEVER_ENROLLED');
    if (contradictoryDeclaration.verificationStatus !== 'VERIFIED_ACTIVITY' || !contradictoryDeclaration.verifiedCourseProgress.declarationConflict) {
      throw new Error('FAILED: Real verified activity did not override a contradictory NEVER_ENROLLED declaration.');
    }
    await prisma.lessonProgress.create({ data: { userId: testUserB.id, lessonId: fixtureLessons[4].id, isCompleted: true, completedAt: new Date() } });
    const completion = await onboardingService.verifyMcodeHistory(testUserB.id, 'PYTHON', 'COMPLETED');
    if (completion.verificationStatus !== 'VERIFIED_COURSE_COMPLETION') {
      throw new Error(`FAILED: 100% course progress must be VERIFIED_COURSE_COMPLETION, got ${completion.verificationStatus}.`);
    }
    console.log('✅ 80% progress is VERIFIED_ACTIVITY; 100% is VERIFIED_COURSE_COMPLETION; actual evidence overrides contradictory self-report.');

    // 7. Testing SQL Goal & Dialect metadata
    console.log('\n--- 7. Testing SQL Goals & Modules ---');
    const sqlGoals = onboardingService.getGoals('SQL');
    console.log(`✅ SQL Domain: ${sqlGoals.domainName}, ${sqlGoals.goals.length} goals.`);
    const fullSqlGoal = sqlGoals.goals.find(g => g.goalId === 'GOAL_SQL_FULL');
    if (!fullSqlGoal || fullSqlGoal.skillCount !== 7 || fullSqlGoal.estimatedPretestQuestions !== 15) {
      throw new Error('FAILED: GOAL_SQL_FULL configuration mismatch!');
    }
    console.log('✅ SQL T-SQL Goals verified.');

    console.log('\n🎉 ALL STAGE 2 ONBOARDING SURVEY VERIFICATIONS PASSED SUCCESSFULLY!');
  } finally {
    // Cleanup temporary test users and cascaded surveys
    console.log('\n🧹 Cleaning up test users...');
    if (verificationFixtureCourseId) {
      await prisma.course.delete({ where: { id: verificationFixtureCourseId } });
    }
    await prisma.user.delete({ where: { id: testUserA.id } });
    await prisma.user.delete({ where: { id: testUserB.id } });
    await prisma.$disconnect();
    console.log('✨ Cleanup complete.');
  }
}

main().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
