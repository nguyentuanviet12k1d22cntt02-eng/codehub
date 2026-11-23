-- Read-only store for skill graphs (content kept byte-for-byte so model hash checks still pass).
-- Idempotent: safe to run again if the table was already created by hand.
CREATE TABLE IF NOT EXISTS "skill_graphs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "language" "ProgrammingLanguage" NOT NULL,
    "version" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "skill_graphs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "skill_graphs_language_version_key" ON "skill_graphs"("language", "version");
