import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      pretestAttempts: {
        include: {
          answers: true
        }
      },
      pretestAssessments: true,
      learnerSkillStates: true,
      adaptiveSubmissions: true,
      submissions: {
        take: 30,
        orderBy: { createdAt: 'desc' }
      },
      practiceSubmissions: {
        take: 30,
        orderBy: { createdAt: 'desc' }
      },
      roadmaps: {
        select: {
          id: true,
          status: true,
          totalNodes: true,
          completedNodes: true,
          currentMasteryAvg: true,
          targetDomain: true,
          nodes: true
        }
      }
    }
  });

  console.log("=== TOTAL USERS ===", users.length);
  for (const u of users) {
    console.log(`\n-----------------------------------------`);
    console.log(`User: ${u.username} (${u.email}) | ID: ${u.id} | Role: ${u.role}`);
    console.log(`Pretest Attempts: ${u.pretestAttempts.length}`);
    for (const pa of u.pretestAttempts) {
      console.log(`  - Attempt ${pa.id} (Status: ${pa.status}, Score: ${pa.score}/${pa.totalQuestions}, Percent: ${pa.scorePercentage}%, Ability theta: ${pa.abilityTheta})`);
      console.log(`    Answers count: ${pa.answers?.length || 0}`);
      const correctAnswers = pa.answers?.filter(a => a.isCorrect) || [];
      console.log(`    Correct: ${correctAnswers.length}, Wrong: ${(pa.answers?.length || 0) - correctAnswers.length}`);
    }

    console.log(`Pretest Assessments: ${u.pretestAssessments.length}`);
    for (const ass of u.pretestAssessments) {
      console.log(`  - Assessment profile: ${ass.profileLevel}, avgMastery: ${ass.avgMastery}, confidence: ${ass.confidenceScore}`);
      console.log(`    Skill Breakdown: ${JSON.stringify(ass.skillBreakdown)}`);
      console.log(`    Weak Skills: ${JSON.stringify(ass.weakSkills)}`);
      console.log(`    Strong Skills: ${JSON.stringify(ass.strongSkills)}`);
    }

    console.log(`Learner Skill States: ${u.learnerSkillStates.length}`);
    for (const sk of u.learnerSkillStates) {
      console.log(`  - Skill [${sk.skillId}]: mastery=${sk.masteryProbability}, attempts=${sk.attemptsCount}, correct=${sk.correctCount}, state=${sk.state}`);
    }

    console.log(`Adaptive Submissions: ${u.adaptiveSubmissions.length}`);
    for (const asub of u.adaptiveSubmissions) {
      console.log(`  - Adaptive Sub [${asub.id}]: score=${asub.score}, passed=${asub.passed}, feedback=${asub.feedback?.slice(0, 100)}...`);
    }

    console.log(`Submissions (Code): ${u.submissions.length}`);
    for (const sub of u.submissions) {
      console.log(`  - Sub [${sub.id}]: status=${sub.status}, score=${sub.score}, passedTests=${sub.passedTests}/${sub.totalTests}, lang=${sub.language}`);
    }

    console.log(`Practice Submissions: ${u.practiceSubmissions.length}`);
    for (const psub of u.practiceSubmissions) {
      console.log(`  - Practice Sub: status=${psub.status}, score=${psub.score}`);
    }

    console.log(`Roadmaps: ${u.roadmaps.length}`);
    for (const rm of u.roadmaps) {
      console.log(`  - Roadmap: target=${rm.targetDomain}, status=${rm.status}, nodes=${rm.completedNodes}/${rm.totalNodes}, avgMastery=${rm.currentMasteryAvg}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
