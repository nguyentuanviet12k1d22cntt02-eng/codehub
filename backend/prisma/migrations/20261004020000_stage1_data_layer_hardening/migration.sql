-- Stage 1: reproducible data layer for survey, pre-test, learner profile and sequential roadmap.
-- The IF NOT EXISTS clauses make this migration safe for the current Supabase database,
-- where the first draft was previously applied with `prisma db push`.

ALTER TYPE "ProgrammingLanguage" ADD VALUE IF NOT EXISTS 'CPP';
ALTER TYPE "ProgrammingLanguage" ADD VALUE IF NOT EXISTS 'C';
ALTER TYPE "ProgrammingLanguage" ADD VALUE IF NOT EXISTS 'SQL';

DO $$ BEGIN
  CREATE TYPE "SurveyVerificationStatus" AS ENUM ('VERIFIED_COURSE_COMPLETION', 'VERIFIED_ACTIVITY', 'SELF_REPORTED_UNVERIFIED', 'NEW_STUDENT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "PretestAttemptStatus" AS ENUM ('ACTIVE', 'SUBMITTED', 'TIMED_OUT', 'ASSESSMENT_FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "PretestQuestionType" AS ENUM ('CONCEPT', 'TRACING', 'BUG_HUNTING', 'PRACTICAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "LearnerSkillStatus" AS ENUM ('UNKNOWN', 'NEEDS_FOUNDATION', 'DEVELOPING', 'PROFICIENT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "RoadmapLearningStatus" AS ENUM ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "RoadmapContentStatus" AS ENUM ('PLANNED', 'GENERATING', 'READY', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "RoadmapStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "learner_surveys" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "language" "ProgrammingLanguage" NOT NULL,
  "survey_version" TEXT NOT NULL DEFAULT '2.0',
  "goal_id" TEXT NOT NULL,
  "mcode_history" TEXT NOT NULL,
  "external_experience" TEXT NOT NULL,
  "self_assessment" JSONB NOT NULL,
  "hours_per_week" TEXT NOT NULL,
  "preferred_pace" TEXT NOT NULL,
  "self_reported_history" JSONB,
  "verified_course_progress" JSONB,
  "verification_status" "SurveyVerificationStatus" NOT NULL DEFAULT 'SELF_REPORTED_UNVERIFIED',
  "is_draft" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "learner_surveys_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "pretest_attempts" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "survey_id" UUID NOT NULL,
  "language" "ProgrammingLanguage" NOT NULL,
  "goal_id" TEXT NOT NULL,
  "graph_version" TEXT NOT NULL,
  "bank_version" TEXT NOT NULL DEFAULT '1.0',
  "scoring_version" TEXT NOT NULL DEFAULT '2.0',
  "status" "PretestAttemptStatus" NOT NULL DEFAULT 'ACTIVE',
  "total_questions" INTEGER NOT NULL,
  "duration_minutes" INTEGER NOT NULL DEFAULT 30,
  "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "submitted_at" TIMESTAMP(3),
  "idempotency_key" TEXT,
  "idempotency_request_hash" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "pretest_attempts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "pretest_question_snapshots" (
  "id" UUID NOT NULL,
  "attempt_id" UUID NOT NULL,
  "language" "ProgrammingLanguage" NOT NULL,
  "order_index" INTEGER NOT NULL,
  "question_family_id" TEXT,
  "question_version" TEXT NOT NULL DEFAULT '1.0',
  "rubric_version" TEXT NOT NULL DEFAULT '1.0',
  "primary_skill_id" TEXT NOT NULL,
  "secondary_skill_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "question_type" "PretestQuestionType" NOT NULL,
  "difficulty" INTEGER NOT NULL DEFAULT 1,
  "prompt" TEXT NOT NULL,
  "starter_code" TEXT,
  "options_json" JSONB,
  "correct_answer_hash" TEXT NOT NULL,
  "rubric_json" JSONB,
  "test_cases_json" JSONB,
  "source" TEXT NOT NULL DEFAULT 'CURATED_VALIDATED',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pretest_question_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "pretest_answers" (
  "id" UUID NOT NULL,
  "attempt_id" UUID NOT NULL,
  "question_snapshot_id" UUID NOT NULL,
  "selected_option" TEXT,
  "submitted_code" TEXT,
  "score" DOUBLE PRECISION,
  "is_correct" BOOLEAN,
  "test_pass_ratio" DOUBLE PRECISION,
  "test_run_details" JSONB,
  "ai_feedback" TEXT,
  "is_answered" BOOLEAN NOT NULL DEFAULT false,
  "answered_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "pretest_answers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "pretest_assessments" (
  "id" UUID NOT NULL,
  "attempt_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "language" "ProgrammingLanguage" NOT NULL,
  "goal_id" TEXT NOT NULL,
  "scoring_version" TEXT NOT NULL DEFAULT '2.0',
  "graph_version" TEXT NOT NULL,
  "profile_version" TEXT NOT NULL DEFAULT '2.0',
  "total_score" DOUBLE PRECISION NOT NULL,
  "max_possible_score" DOUBLE PRECISION NOT NULL,
  "evaluated_skills_count" INTEGER NOT NULL,
  "proficient_count" INTEGER NOT NULL DEFAULT 0,
  "developing_count" INTEGER NOT NULL DEFAULT 0,
  "needs_foundation_count" INTEGER NOT NULL DEFAULT 0,
  "unknown_count" INTEGER NOT NULL DEFAULT 0,
  "summary_feedback" TEXT,
  "raw_assessment_data" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pretest_assessments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "learner_skill_states" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "language" "ProgrammingLanguage" NOT NULL,
  "skill_id" TEXT NOT NULL,
  "graph_version" TEXT NOT NULL,
  "profile_version" TEXT NOT NULL DEFAULT '2.0',
  "mastery_score" DOUBLE PRECISION,
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "evidence_count" INTEGER NOT NULL DEFAULT 0,
  "evidence_sources" JSONB NOT NULL DEFAULT '[]'::JSONB,
  "has_application_evidence" BOOLEAN NOT NULL DEFAULT false,
  "status" "LearnerSkillStatus" NOT NULL DEFAULT 'UNKNOWN',
  "last_assessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "learner_skill_states_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "roadmaps" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "language" "ProgrammingLanguage" NOT NULL,
  "goal_id" TEXT NOT NULL,
  "assessment_id" UUID NOT NULL,
  "graph_version" TEXT NOT NULL,
  "profile_version" TEXT NOT NULL DEFAULT '2.0',
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "RoadmapStatus" NOT NULL DEFAULT 'ACTIVE',
  "total_items" INTEGER NOT NULL,
  "completed_items" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "roadmap_items" (
  "id" UUID NOT NULL,
  "roadmap_id" UUID NOT NULL,
  "order_index" INTEGER NOT NULL,
  "skill_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "objective" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "prerequisite_skill_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "estimated_minutes" INTEGER NOT NULL DEFAULT 30,
  "learning_status" "RoadmapLearningStatus" NOT NULL DEFAULT 'LOCKED',
  "content_status" "RoadmapContentStatus" NOT NULL DEFAULT 'PLANNED',
  "content_id" TEXT,
  "generation_job_id" TEXT,
  "required_theory_checkpoint_count" INTEGER NOT NULL DEFAULT 1,
  "theory_completed" BOOLEAN NOT NULL DEFAULT false,
  "quiz_score" DOUBLE PRECISION,
  "practical_passed" BOOLEAN NOT NULL DEFAULT false,
  "completion_evidence" JSONB,
  "started_at" TIMESTAMP(3),
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "roadmap_items_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "pretest_attempts" ADD COLUMN IF NOT EXISTS "idempotency_request_hash" TEXT;
ALTER TABLE "pretest_question_snapshots" ADD COLUMN IF NOT EXISTS "language" "ProgrammingLanguage";
ALTER TABLE "pretest_question_snapshots" ADD COLUMN IF NOT EXISTS "question_version" TEXT NOT NULL DEFAULT '1.0';
ALTER TABLE "pretest_question_snapshots" ADD COLUMN IF NOT EXISTS "rubric_version" TEXT NOT NULL DEFAULT '1.0';
ALTER TABLE "pretest_assessments" ADD COLUMN IF NOT EXISTS "profile_version" TEXT NOT NULL DEFAULT '2.0';
ALTER TABLE "roadmap_items" ADD COLUMN IF NOT EXISTS "required_theory_checkpoint_count" INTEGER NOT NULL DEFAULT 1;

UPDATE "pretest_question_snapshots" AS q
SET "language" = a."language"
FROM "pretest_attempts" AS a
WHERE q."attempt_id" = a."id" AND q."language" IS NULL;
ALTER TABLE "pretest_question_snapshots" ALTER COLUMN "language" SET NOT NULL;

CREATE TABLE IF NOT EXISTS "roadmap_theory_checkpoints" (
  "id" UUID NOT NULL,
  "roadmap_item_id" UUID NOT NULL,
  "checkpoint_id" TEXT NOT NULL,
  "evidence" JSONB,
  "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "roadmap_theory_checkpoints_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "roadmap_quiz_submissions" (
  "submission_id" UUID NOT NULL,
  "roadmap_item_id" UUID NOT NULL,
  "question_count" INTEGER NOT NULL,
  "correct_count" INTEGER NOT NULL,
  "score" DOUBLE PRECISION NOT NULL,
  "answers_json" JSONB NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "roadmap_quiz_submissions_pkey" PRIMARY KEY ("submission_id")
);

CREATE TABLE IF NOT EXISTS "roadmap_practical_submissions" (
  "submission_id" UUID NOT NULL,
  "roadmap_item_id" UUID NOT NULL,
  "runner_language" "ProgrammingLanguage" NOT NULL,
  "runner_version" TEXT NOT NULL,
  "public_tests_passed" INTEGER NOT NULL,
  "public_tests_total" INTEGER NOT NULL,
  "hidden_tests_passed" INTEGER NOT NULL,
  "hidden_tests_total" INTEGER NOT NULL,
  "passed" BOOLEAN NOT NULL DEFAULT false,
  "result_summary" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "roadmap_practical_submissions_pkey" PRIMARY KEY ("submission_id")
);

CREATE TABLE IF NOT EXISTS "idempotency_records" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "scope" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "request_hash" TEXT NOT NULL,
  "response_status" INTEGER,
  "response_body" JSONB,
  "resource_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "idempotency_records_pkey" PRIMARY KEY ("id")
);

DROP INDEX IF EXISTS "pretest_attempts_idempotency_key_key";
CREATE UNIQUE INDEX IF NOT EXISTS "learner_surveys_id_user_id_language_goal_id_key" ON "learner_surveys"("id", "user_id", "language", "goal_id");
CREATE INDEX IF NOT EXISTS "learner_surveys_user_id_language_idx" ON "learner_surveys"("user_id", "language");
CREATE UNIQUE INDEX IF NOT EXISTS "pretest_attempts_id_user_id_language_goal_id_key" ON "pretest_attempts"("id", "user_id", "language", "goal_id");
CREATE UNIQUE INDEX IF NOT EXISTS "pretest_attempts_id_language_key" ON "pretest_attempts"("id", "language");
CREATE UNIQUE INDEX IF NOT EXISTS "pretest_attempts_user_id_idempotency_key_key" ON "pretest_attempts"("user_id", "idempotency_key");
CREATE INDEX IF NOT EXISTS "pretest_attempts_user_id_language_status_idx" ON "pretest_attempts"("user_id", "language", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "pretest_one_active_per_user_language" ON "pretest_attempts"("user_id", "language") WHERE "status" = 'ACTIVE';
CREATE UNIQUE INDEX IF NOT EXISTS "pretest_question_snapshots_attempt_id_order_index_key" ON "pretest_question_snapshots"("attempt_id", "order_index");
CREATE UNIQUE INDEX IF NOT EXISTS "pretest_question_snapshots_id_attempt_id_key" ON "pretest_question_snapshots"("id", "attempt_id");
CREATE INDEX IF NOT EXISTS "pretest_question_snapshots_attempt_id_primary_skill_id_idx" ON "pretest_question_snapshots"("attempt_id", "primary_skill_id");
CREATE UNIQUE INDEX IF NOT EXISTS "pretest_answers_attempt_id_question_snapshot_id_key" ON "pretest_answers"("attempt_id", "question_snapshot_id");
CREATE UNIQUE INDEX IF NOT EXISTS "pretest_assessments_attempt_id_key" ON "pretest_assessments"("attempt_id");
CREATE UNIQUE INDEX IF NOT EXISTS "pretest_assessments_attempt_id_user_id_language_goal_id_key" ON "pretest_assessments"("attempt_id", "user_id", "language", "goal_id");
CREATE UNIQUE INDEX IF NOT EXISTS "pretest_assessments_id_user_id_language_goal_id_key" ON "pretest_assessments"("id", "user_id", "language", "goal_id");
CREATE INDEX IF NOT EXISTS "pretest_assessments_user_id_language_idx" ON "pretest_assessments"("user_id", "language");
CREATE UNIQUE INDEX IF NOT EXISTS "learner_skill_states_user_id_language_skill_id_key" ON "learner_skill_states"("user_id", "language", "skill_id");
CREATE INDEX IF NOT EXISTS "learner_skill_states_user_id_language_status_idx" ON "learner_skill_states"("user_id", "language", "status");
CREATE INDEX IF NOT EXISTS "roadmaps_user_id_language_status_idx" ON "roadmaps"("user_id", "language", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_items_roadmap_id_order_index_key" ON "roadmap_items"("roadmap_id", "order_index");
CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_items_generation_job_id_key" ON "roadmap_items"("generation_job_id");
CREATE INDEX IF NOT EXISTS "roadmap_items_roadmap_id_learning_status_idx" ON "roadmap_items"("roadmap_id", "learning_status");
CREATE INDEX IF NOT EXISTS "roadmap_items_roadmap_id_skill_id_idx" ON "roadmap_items"("roadmap_id", "skill_id");
CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_one_open_item" ON "roadmap_items"("roadmap_id") WHERE "learning_status" IN ('AVAILABLE', 'IN_PROGRESS');
CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_theory_checkpoints_roadmap_item_id_checkpoint_id_key" ON "roadmap_theory_checkpoints"("roadmap_item_id", "checkpoint_id");
CREATE INDEX IF NOT EXISTS "roadmap_quiz_submissions_roadmap_item_id_created_at_idx" ON "roadmap_quiz_submissions"("roadmap_item_id", "created_at");
CREATE INDEX IF NOT EXISTS "roadmap_practical_submissions_roadmap_item_id_created_at_idx" ON "roadmap_practical_submissions"("roadmap_item_id", "created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "idempotency_records_user_id_scope_key_key" ON "idempotency_records"("user_id", "scope", "key");
CREATE INDEX IF NOT EXISTS "idempotency_records_expires_at_idx" ON "idempotency_records"("expires_at");

ALTER TABLE "pretest_attempts" DROP CONSTRAINT IF EXISTS "pretest_attempts_survey_id_fkey";
ALTER TABLE "pretest_question_snapshots" DROP CONSTRAINT IF EXISTS "pretest_question_snapshots_attempt_id_fkey";
ALTER TABLE "pretest_answers" DROP CONSTRAINT IF EXISTS "pretest_answers_question_snapshot_id_fkey";
ALTER TABLE "pretest_assessments" DROP CONSTRAINT IF EXISTS "pretest_assessments_attempt_id_fkey";
ALTER TABLE "roadmaps" DROP CONSTRAINT IF EXISTS "roadmaps_assessment_id_fkey";

DO $$ BEGIN ALTER TABLE "learner_surveys" ADD CONSTRAINT "learner_surveys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_attempts" ADD CONSTRAINT "pretest_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_attempts" ADD CONSTRAINT "pretest_attempts_survey_owner_fkey" FOREIGN KEY ("survey_id", "user_id", "language", "goal_id") REFERENCES "learner_surveys"("id", "user_id", "language", "goal_id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_question_snapshots" ADD CONSTRAINT "pretest_question_snapshots_attempt_language_fkey" FOREIGN KEY ("attempt_id", "language") REFERENCES "pretest_attempts"("id", "language") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_answers" ADD CONSTRAINT "pretest_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "pretest_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_answers" ADD CONSTRAINT "pretest_answers_question_attempt_fkey" FOREIGN KEY ("question_snapshot_id", "attempt_id") REFERENCES "pretest_question_snapshots"("id", "attempt_id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_assessments" ADD CONSTRAINT "pretest_assessments_attempt_owner_fkey" FOREIGN KEY ("attempt_id", "user_id", "language", "goal_id") REFERENCES "pretest_attempts"("id", "user_id", "language", "goal_id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_assessments" ADD CONSTRAINT "pretest_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "learner_skill_states" ADD CONSTRAINT "learner_skill_states_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_assessment_owner_fkey" FOREIGN KEY ("assessment_id", "user_id", "language", "goal_id") REFERENCES "pretest_assessments"("id", "user_id", "language", "goal_id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmap_items" ADD CONSTRAINT "roadmap_items_roadmap_id_fkey" FOREIGN KEY ("roadmap_id") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmap_theory_checkpoints" ADD CONSTRAINT "roadmap_theory_checkpoints_roadmap_item_id_fkey" FOREIGN KEY ("roadmap_item_id") REFERENCES "roadmap_items"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmap_quiz_submissions" ADD CONSTRAINT "roadmap_quiz_submissions_roadmap_item_id_fkey" FOREIGN KEY ("roadmap_item_id") REFERENCES "roadmap_items"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmap_practical_submissions" ADD CONSTRAINT "roadmap_practical_submissions_roadmap_item_id_fkey" FOREIGN KEY ("roadmap_item_id") REFERENCES "roadmap_items"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "idempotency_records" ADD CONSTRAINT "idempotency_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN ALTER TABLE "learner_surveys" ADD CONSTRAINT "learner_surveys_supported_language" CHECK ("language" IN ('PYTHON', 'JAVASCRIPT', 'CPP', 'SQL')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_attempts" ADD CONSTRAINT "pretest_attempts_supported_language" CHECK ("language" IN ('PYTHON', 'JAVASCRIPT', 'CPP', 'SQL')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_question_snapshots" ADD CONSTRAINT "pretest_questions_supported_language" CHECK ("language" IN ('PYTHON', 'JAVASCRIPT', 'CPP', 'SQL')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_assessments" ADD CONSTRAINT "pretest_assessments_supported_language" CHECK ("language" IN ('PYTHON', 'JAVASCRIPT', 'CPP', 'SQL')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "learner_skill_states" ADD CONSTRAINT "learner_skill_states_supported_language" CHECK ("language" IN ('PYTHON', 'JAVASCRIPT', 'CPP', 'SQL')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_supported_language" CHECK ("language" IN ('PYTHON', 'JAVASCRIPT', 'CPP', 'SQL')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmap_practical_submissions" ADD CONSTRAINT "roadmap_practical_supported_language" CHECK ("runner_language" IN ('PYTHON', 'JAVASCRIPT', 'CPP', 'SQL')); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_attempts" ADD CONSTRAINT "pretest_attempt_question_count" CHECK ("total_questions" BETWEEN 12 AND 15 AND "duration_minutes" = 30); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "pretest_answers" ADD CONSTRAINT "pretest_answer_score_range" CHECK (("score" IS NULL OR "score" BETWEEN 0 AND 1) AND ("test_pass_ratio" IS NULL OR "test_pass_ratio" BETWEEN 0 AND 1)); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "learner_skill_states" ADD CONSTRAINT "learner_skill_score_range" CHECK (("mastery_score" IS NULL OR "mastery_score" BETWEEN 0 AND 1) AND "confidence" BETWEEN 0 AND 1 AND "evidence_count" >= 0); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmap_item_counts" CHECK ("total_items" >= 0 AND "completed_items" BETWEEN 0 AND "total_items"); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmap_items" ADD CONSTRAINT "roadmap_item_value_ranges" CHECK ("order_index" > 0 AND "estimated_minutes" > 0 AND "required_theory_checkpoint_count" > 0 AND ("quiz_score" IS NULL OR "quiz_score" BETWEEN 0 AND 100)); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmap_quiz_submissions" ADD CONSTRAINT "roadmap_quiz_dod_range" CHECK ("question_count" >= 5 AND "correct_count" BETWEEN 0 AND "question_count" AND "score" BETWEEN 0 AND 100); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "roadmap_practical_submissions" ADD CONSTRAINT "roadmap_practical_test_counts" CHECK ("public_tests_total" > 0 AND "hidden_tests_total" > 0 AND "public_tests_passed" BETWEEN 0 AND "public_tests_total" AND "hidden_tests_passed" BETWEEN 0 AND "hidden_tests_total" AND (NOT "passed" OR ("public_tests_passed" = "public_tests_total" AND "hidden_tests_passed" = "hidden_tests_total"))); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
