import dotenv from 'dotenv';
dotenv.config({ override: true });
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Chỉ sử dụng duy nhất CSDL Local PostgreSQL
const databaseUrl = process.env.DATABASE_URL;
console.log("🔌 Prisma Config: Database Local URL =", databaseUrl ? databaseUrl.replace(/:[^:]+@/, ":***@") : "Chưa định cấu hình!");

const pool = new Pool({
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
    console.warn('⚠️ [pg.Pool] Client idle connection warning:', err.message);
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
    adapter,
    transactionOptions: {
        maxWait: 10000,
        timeout: 30000,
    }
});



