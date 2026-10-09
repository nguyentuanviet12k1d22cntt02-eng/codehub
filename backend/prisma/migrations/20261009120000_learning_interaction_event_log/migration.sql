-- Durable, normalized event log used to build versioned PAL-Net datasets.
-- Source tables keep their original responsibility; triggers guarantee capture
-- in the same PostgreSQL transaction as the graded submission.

CREATE TABLE IF NOT EXISTS "learning_interactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_type" TEXT NOT NULL,
    "source_record_id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "session_id" TEXT,
    "language" TEXT,
    "course_id" UUID,
    "lesson_id" UUID,
    "item_id" TEXT NOT NULL,
    "primary_skill_id" TEXT,
    "secondary_skill_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "difficulty" SMALLINT,
    "graph_version" TEXT,
    "mapping_version" TEXT,
    "mapping_status" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "content_version" TEXT,
    "opened_at" TIMESTAMPTZ,
    "submitted_at" TIMESTAMPTZ NOT NULL,
    "active_time_seconds" INTEGER,
    "hint_count" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "is_correct" BOOLEAN,
    "score" DOUBLE PRECISION,
    "tests_passed" INTEGER,
    "tests_total" INTEGER,
    "error_type" TEXT,
    "code_hash" TEXT,
    "data_origin" TEXT NOT NULL DEFAULT 'REAL',
    "schema_version" TEXT NOT NULL DEFAULT 'learning-interaction/1.0',
    "payload" JSONB NOT NULL DEFAULT '{}'::JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_interactions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "learning_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "learning_interactions_source_unique" UNIQUE ("source_type", "source_record_id"),
    CONSTRAINT "learning_interactions_difficulty_range" CHECK ("difficulty" IS NULL OR "difficulty" BETWEEN 1 AND 3),
    CONSTRAINT "learning_interactions_active_time_nonnegative" CHECK ("active_time_seconds" IS NULL OR "active_time_seconds" >= 0),
    CONSTRAINT "learning_interactions_hint_count_nonnegative" CHECK ("hint_count" >= 0),
    CONSTRAINT "learning_interactions_score_range" CHECK ("score" IS NULL OR "score" BETWEEN 0 AND 1),
    CONSTRAINT "learning_interactions_test_counts" CHECK (
        ("tests_passed" IS NULL AND ("tests_total" IS NULL OR "tests_total" > 0))
        OR ("tests_passed" IS NOT NULL AND "tests_total" IS NOT NULL
            AND "tests_total" > 0 AND "tests_passed" BETWEEN 0 AND "tests_total")
    )
);

-- A failed legacy submission knows the total test count but not the exact
-- number of partial passes. Preserve that as tests_total + NULL tests_passed.
-- The ALTER also repairs an interrupted first deployment of this migration.
ALTER TABLE "learning_interactions"
    DROP CONSTRAINT IF EXISTS "learning_interactions_test_counts";
ALTER TABLE "learning_interactions"
    ADD CONSTRAINT "learning_interactions_test_counts" CHECK (
        ("tests_passed" IS NULL AND ("tests_total" IS NULL OR "tests_total" > 0))
        OR ("tests_passed" IS NOT NULL AND "tests_total" IS NOT NULL
            AND "tests_total" > 0 AND "tests_passed" BETWEEN 0 AND "tests_total")
    );

CREATE INDEX IF NOT EXISTS "learning_interactions_user_time_idx"
    ON "learning_interactions"("user_id", "submitted_at", "id");
CREATE INDEX IF NOT EXISTS "learning_interactions_skill_time_idx"
    ON "learning_interactions"("language", "primary_skill_id", "submitted_at");
CREATE INDEX IF NOT EXISTS "learning_interactions_origin_status_idx"
    ON "learning_interactions"("data_origin", "status");

-- The table is not writable through Supabase's public API. The backend uses its
-- direct PostgreSQL connection; no anon/authenticated RLS policies are created.
ALTER TABLE "learning_interactions" ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION capture_course_submission_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.status::TEXT NOT IN ('PASSED', 'FAILED') THEN
        RETURN NEW;
    END IF;

    INSERT INTO learning_interactions (
        source_type, source_record_id, user_id, language, course_id, lesson_id,
        item_id, difficulty, content_version, submitted_at, status, is_correct,
        score, tests_passed, tests_total, mapping_status, payload
    )
    SELECT
        'COURSE_SUBMISSION', NEW.id::TEXT, NEW.user_id, NEW.language::TEXT,
        m.course_id, l.id, NEW.exercise_id::TEXT,
        CASE ce.difficulty::TEXT WHEN 'EASY' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'HARD' THEN 3 END,
        ce.updated_at::TEXT, NEW.submitted_at, NEW.status::TEXT,
        NEW.status::TEXT = 'PASSED', CASE WHEN NEW.status::TEXT = 'PASSED' THEN 1.0 ELSE 0.0 END,
        CASE WHEN NEW.status::TEXT = 'PASSED' THEN COUNT(tc.id)::INTEGER ELSE NULL END,
        NULLIF(COUNT(tc.id)::INTEGER, 0), 'UNVERIFIED',
        jsonb_build_object('stableLessonId', l.lesson_id, 'runtimeMs', NEW.runtime)
    FROM coding_exercises ce
    JOIN lessons l ON l.id = ce.lesson_id
    JOIN chapters ch ON ch.id = l.chapter_id
    JOIN modules m ON m.id = ch.module_id
    LEFT JOIN test_cases tc ON tc.exercise_id = ce.id
    WHERE ce.id = NEW.exercise_id
    GROUP BY ce.id, ce.difficulty, ce.updated_at, l.id, l.lesson_id, m.course_id
    ON CONFLICT (source_type, source_record_id) DO UPDATE SET
        submitted_at = EXCLUDED.submitted_at,
        status = EXCLUDED.status,
        is_correct = EXCLUDED.is_correct,
        score = EXCLUDED.score,
        tests_passed = EXCLUDED.tests_passed,
        tests_total = EXCLUDED.tests_total,
        payload = EXCLUDED.payload;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS course_submission_learning_event ON submissions;
CREATE TRIGGER course_submission_learning_event
AFTER INSERT OR UPDATE OF status ON submissions
FOR EACH ROW EXECUTE FUNCTION capture_course_submission_interaction();

CREATE OR REPLACE FUNCTION capture_practice_submission_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.status::TEXT NOT IN ('PASSED', 'FAILED') THEN
        RETURN NEW;
    END IF;

    INSERT INTO learning_interactions (
        source_type, source_record_id, user_id, language, item_id, difficulty,
        content_version, submitted_at, status, is_correct, score, tests_passed,
        tests_total, mapping_status, payload
    )
    SELECT
        'PRACTICE_SUBMISSION', NEW.id::TEXT, NEW.user_id, NEW.language::TEXT,
        NEW.problem_id::TEXT,
        CASE p.difficulty::TEXT WHEN 'EASY' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'HARD' THEN 3 END,
        p.updated_at::TEXT, NEW.submitted_at, NEW.status::TEXT,
        NEW.status::TEXT = 'PASSED', CASE WHEN NEW.status::TEXT = 'PASSED' THEN 1.0 ELSE 0.0 END,
        CASE WHEN NEW.status::TEXT = 'PASSED' THEN COUNT(tc.id)::INTEGER ELSE NULL END,
        NULLIF(COUNT(tc.id)::INTEGER, 0), 'UNVERIFIED',
        jsonb_build_object('problemSlug', p.slug, 'runtimeMs', NEW.runtime)
    FROM practice_problems p
    LEFT JOIN practice_test_cases tc ON tc.problem_id = p.id
    WHERE p.id = NEW.problem_id
    GROUP BY p.id, p.slug, p.difficulty, p.updated_at
    ON CONFLICT (source_type, source_record_id) DO UPDATE SET
        submitted_at = EXCLUDED.submitted_at,
        status = EXCLUDED.status,
        is_correct = EXCLUDED.is_correct,
        score = EXCLUDED.score,
        tests_passed = EXCLUDED.tests_passed,
        tests_total = EXCLUDED.tests_total,
        payload = EXCLUDED.payload;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS practice_submission_learning_event ON practice_submissions;
CREATE TRIGGER practice_submission_learning_event
AFTER INSERT OR UPDATE OF status ON practice_submissions
FOR EACH ROW EXECUTE FUNCTION capture_practice_submission_interaction();

CREATE OR REPLACE FUNCTION capture_pretest_answer_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.is_correct IS NULL OR NOT NEW.is_answered THEN
        RETURN NEW;
    END IF;

    INSERT INTO learning_interactions (
        source_type, source_record_id, user_id, session_id, language, item_id,
        primary_skill_id, secondary_skill_ids, difficulty, graph_version,
        mapping_version, mapping_status, content_version, submitted_at, status,
        is_correct, score, payload
    )
    SELECT
        'PRETEST_ANSWER', NEW.id::TEXT, a.user_id, a.id::TEXT, a.language::TEXT,
        q.id::TEXT, q.primary_skill_id, q.secondary_skill_ids, q.difficulty,
        a.graph_version, 'pretest-bank/' || a.bank_version,
        CASE WHEN q.source = 'CURATED_VALIDATED' THEN 'VERIFIED' ELSE 'UNVERIFIED' END,
        q.question_version, COALESCE(NEW.answered_at, NEW.updated_at),
        CASE WHEN NEW.is_correct THEN 'PASSED' ELSE 'FAILED' END,
        NEW.is_correct, NEW.score,
        jsonb_build_object(
            'attemptId', a.id,
            'questionType', q.question_type,
            'testPassRatio', NEW.test_pass_ratio,
            'scoringVersion', a.scoring_version
        )
    FROM pretest_attempts a
    JOIN pretest_question_snapshots q
      ON q.attempt_id = a.id AND q.id = NEW.question_snapshot_id
    WHERE a.id = NEW.attempt_id
    ON CONFLICT (source_type, source_record_id) DO UPDATE SET
        submitted_at = EXCLUDED.submitted_at,
        status = EXCLUDED.status,
        is_correct = EXCLUDED.is_correct,
        score = EXCLUDED.score,
        payload = EXCLUDED.payload;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pretest_answer_learning_event ON pretest_answers;
CREATE TRIGGER pretest_answer_learning_event
AFTER INSERT OR UPDATE OF is_correct, score ON pretest_answers
FOR EACH ROW EXECUTE FUNCTION capture_pretest_answer_interaction();

CREATE OR REPLACE FUNCTION capture_roadmap_quiz_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO learning_interactions (
        source_type, source_record_id, user_id, language, item_id,
        primary_skill_id, graph_version, mapping_version, mapping_status,
        content_version, submitted_at, status, is_correct, score, payload
    )
    SELECT
        'ROADMAP_QUIZ', NEW.submission_id::TEXT, r.user_id, r.language::TEXT,
        COALESCE(ri.lesson_id, ri.id::TEXT), ri.skill_id, r.graph_version,
        r.mapping_version, 'VERIFIED', r.catalog_version, NEW.created_at,
        'SCORED', NEW.correct_count = NEW.question_count,
        NEW.correct_count::DOUBLE PRECISION / NULLIF(NEW.question_count, 0),
        jsonb_build_object(
            'roadmapId', r.id,
            'roadmapItemId', ri.id,
            'questionCount', NEW.question_count,
            'correctCount', NEW.correct_count
        )
    FROM roadmap_items ri
    JOIN roadmaps r ON r.id = ri.roadmap_id
    WHERE ri.id = NEW.roadmap_item_id
    ON CONFLICT (source_type, source_record_id) DO UPDATE SET
        submitted_at = EXCLUDED.submitted_at,
        status = EXCLUDED.status,
        is_correct = EXCLUDED.is_correct,
        score = EXCLUDED.score,
        payload = EXCLUDED.payload;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS roadmap_quiz_learning_event ON roadmap_quiz_submissions;
CREATE TRIGGER roadmap_quiz_learning_event
AFTER INSERT OR UPDATE OF score, correct_count ON roadmap_quiz_submissions
FOR EACH ROW EXECUTE FUNCTION capture_roadmap_quiz_interaction();

CREATE OR REPLACE FUNCTION capture_roadmap_practical_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    total_tests INTEGER;
    passed_tests INTEGER;
BEGIN
    total_tests := NEW.public_tests_total + NEW.hidden_tests_total;
    passed_tests := NEW.public_tests_passed + NEW.hidden_tests_passed;

    INSERT INTO learning_interactions (
        source_type, source_record_id, user_id, language, item_id,
        primary_skill_id, graph_version, mapping_version, mapping_status,
        content_version, submitted_at, status, is_correct, score,
        tests_passed, tests_total, payload
    )
    SELECT
        'ROADMAP_PRACTICAL', NEW.submission_id::TEXT, r.user_id,
        NEW.runner_language::TEXT, COALESCE(ri.lesson_id, ri.id::TEXT),
        ri.skill_id, r.graph_version, r.mapping_version, 'VERIFIED',
        r.catalog_version, NEW.created_at,
        CASE WHEN NEW.passed THEN 'PASSED' ELSE 'FAILED' END,
        NEW.passed, passed_tests::DOUBLE PRECISION / NULLIF(total_tests, 0),
        passed_tests, total_tests,
        jsonb_build_object(
            'roadmapId', r.id,
            'roadmapItemId', ri.id,
            'runnerVersion', NEW.runner_version
        )
    FROM roadmap_items ri
    JOIN roadmaps r ON r.id = ri.roadmap_id
    WHERE ri.id = NEW.roadmap_item_id
    ON CONFLICT (source_type, source_record_id) DO UPDATE SET
        submitted_at = EXCLUDED.submitted_at,
        status = EXCLUDED.status,
        is_correct = EXCLUDED.is_correct,
        score = EXCLUDED.score,
        tests_passed = EXCLUDED.tests_passed,
        tests_total = EXCLUDED.tests_total,
        payload = EXCLUDED.payload;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS roadmap_practical_learning_event ON roadmap_practical_submissions;
CREATE TRIGGER roadmap_practical_learning_event
AFTER INSERT OR UPDATE OF passed, public_tests_passed, hidden_tests_passed ON roadmap_practical_submissions
FOR EACH ROW EXECUTE FUNCTION capture_roadmap_practical_interaction();

CREATE OR REPLACE FUNCTION capture_adaptive_submission_interaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    test_total INTEGER;
    test_passed INTEGER;
BEGIN
    IF NEW.status NOT IN ('PASSED', 'FAILED', 'INFRA_ERROR') THEN
        RETURN NEW;
    END IF;

    IF jsonb_typeof(NEW.result->'test_results') = 'array' THEN
        test_total := jsonb_array_length(NEW.result->'test_results');
        SELECT COUNT(*)::INTEGER INTO test_passed
        FROM jsonb_array_elements(NEW.result->'test_results') AS test
        WHERE COALESCE((test->>'passed')::BOOLEAN, FALSE);
    ELSE
        test_total := NULL;
        test_passed := NULL;
    END IF;

    INSERT INTO learning_interactions (
        source_type, source_record_id, user_id, session_id, language, item_id,
        primary_skill_id, difficulty, graph_version, mapping_version,
        mapping_status, content_version, submitted_at, status, is_correct,
        score, tests_passed, tests_total, error_type, code_hash, payload
    )
    SELECT
        'ADAPTIVE_SUBMISSION', NEW.submission_id::TEXT, NEW.user_id,
        r.session_id::TEXT, UPPER(r.artifact->>'language'), NEW.exercise_id::TEXT,
        r.artifact->>'concept_id',
        CASE UPPER(r.artifact->>'difficulty') WHEN 'EASY' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'HARD' THEN 3 END,
        r.artifact->>'graph_version', r.artifact->>'mapping_version',
        CASE WHEN COALESCE(r.artifact->>'mapping_status', '') = 'VERIFIED' THEN 'VERIFIED' ELSE 'UNVERIFIED' END,
        r.artifact->>'content_version', CURRENT_TIMESTAMP, NEW.status,
        CASE WHEN NEW.status = 'INFRA_ERROR' THEN NULL ELSE NEW.status = 'PASSED' END,
        CASE
            WHEN NEW.status = 'INFRA_ERROR' THEN NULL
            WHEN test_total IS NOT NULL AND test_total > 0 THEN test_passed::DOUBLE PRECISION / test_total
            WHEN NEW.status = 'PASSED' THEN 1.0 ELSE 0.0
        END,
        test_passed, test_total,
        CASE WHEN NEW.status = 'INFRA_ERROR' THEN COALESCE(NEW.result->>'error', 'INFRA_ERROR') ELSE NULL END,
        NEW.code_hash,
        jsonb_build_object('traceId', NEW.trace_id, 'harnessVersion', NEW.result->>'harness_version')
    FROM adaptive_generation_runs r
    WHERE r.trace_id = NEW.trace_id
    ON CONFLICT (source_type, source_record_id) DO UPDATE SET
        submitted_at = EXCLUDED.submitted_at,
        status = EXCLUDED.status,
        is_correct = EXCLUDED.is_correct,
        score = EXCLUDED.score,
        tests_passed = EXCLUDED.tests_passed,
        tests_total = EXCLUDED.tests_total,
        error_type = EXCLUDED.error_type,
        payload = EXCLUDED.payload;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS adaptive_submission_learning_event ON adaptive_submissions;
CREATE TRIGGER adaptive_submission_learning_event
AFTER INSERT OR UPDATE OF status, result ON adaptive_submissions
FOR EACH ROW EXECUTE FUNCTION capture_adaptive_submission_interaction();

-- Backfill existing graded records through the same audited trigger logic.
-- These no-op updates are idempotent because every source has a unique key.
UPDATE submissions SET status = status WHERE status::TEXT IN ('PASSED', 'FAILED');
UPDATE practice_submissions SET status = status WHERE status::TEXT IN ('PASSED', 'FAILED');
UPDATE pretest_answers SET score = score WHERE is_correct IS NOT NULL AND is_answered;
UPDATE roadmap_quiz_submissions SET score = score;
UPDATE roadmap_practical_submissions SET passed = passed;
UPDATE adaptive_submissions SET status = status WHERE status IN ('PASSED', 'FAILED', 'INFRA_ERROR');
