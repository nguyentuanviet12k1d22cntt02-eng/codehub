import dotenv from 'dotenv';
dotenv.config({ override: true });
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Chỉ sử dụng duy nhất CSDL Local PostgreSQL
const databaseUrl = process.env.DATABASE_URL;
console.log("🔌 Prisma Config: Database Local URL =", databaseUrl ? databaseUrl.replace(/:[^:]+@/, ":***@") : "Chưa định cấu hình!");

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });



