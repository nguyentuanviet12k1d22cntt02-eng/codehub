import { prisma } from '../../infrastructure/database/prisma';

export const AI_TUTOR_FEATURE_KEY = 'AI_TUTOR';
export const AI_TUTOR_LOCKED_MESSAGE = 'AI Tutor đang được quản trị viên tạm khóa. Vui lòng quay lại sau.';

export interface TutorAvailability {
    enabled: boolean;
    updatedAt: Date;
    updatedBy: string | null;
}

interface TutorAvailabilityRow {
    is_enabled: boolean;
    updated_at: Date;
    updated_by: string | null;
}

function toAvailability(setting: TutorAvailabilityRow): TutorAvailability {
    return {
        enabled: setting.is_enabled,
        updatedAt: setting.updated_at,
        updatedBy: setting.updated_by,
    };
}

export async function getTutorAvailability(): Promise<TutorAvailability> {
    const rows = await prisma.$queryRawUnsafe<TutorAvailabilityRow[]>(
        `WITH inserted AS (
           INSERT INTO "platform_feature_settings" ("key", "is_enabled")
           VALUES ($1, true)
           ON CONFLICT ("key") DO NOTHING
           RETURNING "is_enabled", "updated_at", "updated_by"
         )
         SELECT "is_enabled", "updated_at", "updated_by" FROM inserted
         UNION ALL
         SELECT "is_enabled", "updated_at", "updated_by"
         FROM "platform_feature_settings" WHERE "key" = $1
         LIMIT 1`,
        AI_TUTOR_FEATURE_KEY,
    );
    return toAvailability(rows[0]);
}

export async function setTutorAvailability(enabled: boolean, updatedBy: string): Promise<TutorAvailability> {
    const rows = await prisma.$queryRawUnsafe<TutorAvailabilityRow[]>(
        `INSERT INTO "platform_feature_settings" ("key", "is_enabled", "updated_by")
         VALUES ($1, $2, $3::uuid)
         ON CONFLICT ("key") DO UPDATE SET
           "is_enabled" = EXCLUDED."is_enabled",
           "updated_by" = EXCLUDED."updated_by",
           "updated_at" = CURRENT_TIMESTAMP
         RETURNING "is_enabled", "updated_at", "updated_by"`,
        AI_TUTOR_FEATURE_KEY,
        enabled,
        updatedBy,
    );
    return toAvailability(rows[0]);
}
