-- Global, durable availability switch for the learner-facing AI Tutor.
-- The backend owns this table; RLS prevents direct public API access.
CREATE TABLE IF NOT EXISTS "platform_feature_settings" (
    "key" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "updated_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_feature_settings_pkey" PRIMARY KEY ("key")
);

ALTER TABLE "platform_feature_settings" ENABLE ROW LEVEL SECURITY;
