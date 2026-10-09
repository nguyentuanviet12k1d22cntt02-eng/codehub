ALTER TABLE "roadmaps"
  ADD COLUMN IF NOT EXISTS "policy_version" TEXT NOT NULL DEFAULT 'palnet-lesson-policy/1.0.0',
  ADD COLUMN IF NOT EXISTS "mapping_version" TEXT NOT NULL DEFAULT 'lesson-skill-mapping/1.0.0-py-basics-pilot',
  ADD COLUMN IF NOT EXISTS "catalog_version" TEXT NOT NULL DEFAULT 'python-basics-lessons/1.0.0-pilot',
  ADD COLUMN IF NOT EXISTS "catalog_sha256" TEXT;

ALTER TABLE "roadmap_items"
  ADD COLUMN IF NOT EXISTS "lesson_id" TEXT,
  ADD COLUMN IF NOT EXISTS "selection_evidence" JSONB;

CREATE UNIQUE INDEX IF NOT EXISTS "roadmaps_assessment_id_key" ON "roadmaps"("assessment_id");
CREATE UNIQUE INDEX IF NOT EXISTS "roadmap_items_roadmap_id_lesson_id_key"
  ON "roadmap_items"("roadmap_id", "lesson_id") WHERE "lesson_id" IS NOT NULL;
