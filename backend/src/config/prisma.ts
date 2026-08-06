import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 1. Cấu hình CSDL chính (Supabase Cloud)
const supabaseUrl = process.env.DATABASE_URL;
const supabasePool = new Pool({ connectionString: supabaseUrl });
const supabaseAdapter = new PrismaPg(supabasePool);
const supabasePrisma = new PrismaClient({ adapter: supabaseAdapter });

// 2. Cấu hình CSDL phụ (Local PostgreSQL cho pgAdmin)
const localUrl = process.env.LOCAL_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/learnpython";
const localPool = new Pool({ connectionString: localUrl });
const localAdapter = new PrismaPg(localPool);
const localPrisma = new PrismaClient({ adapter: localAdapter });

// Các phương thức ghi dữ liệu cần đồng bộ sang cả 2 CSDL
const writeMethods = ['create', 'update', 'delete', 'upsert', 'createMany', 'updateMany', 'deleteMany'];

// Tạo Model Proxy để điều phối ghi/đọc
function createModelProxy(modelName: string) {
    const supabaseModel = (supabasePrisma as any)[modelName];
    const localModel = (localPrisma as any)[modelName];

    if (!supabaseModel || !localModel) return supabaseModel;

    return new Proxy(supabaseModel, {
        get(target, propKey, receiver) {
            const originalMethod = target[propKey];
            if (typeof originalMethod === 'function') {
                return async function (...args: any[]) {
                    const method = propKey as string;

                    if (writeMethods.includes(method)) {
                        console.log(`🔌 Dual-Write: Đang đồng bộ hóa ghi [${modelName}.${method}] sang cả Supabase và Local...`);

                        // Thực thi ghi song song trên cả 2 CSDL
                        const [resSupabase, resLocal] = await Promise.allSettled([
                            supabaseModel[method](...args),
                            localModel[method](...args)
                        ]);

                        if (resSupabase.status === 'rejected') {
                            console.error(`❌ Lỗi ghi vào Supabase [${modelName}.${method}]:`, resSupabase.reason);
                        }
                        if (resLocal.status === 'rejected') {
                            console.error(`❌ Lỗi ghi vào Local PostgreSQL [${modelName}.${method}]:`, resLocal.reason);
                        }

                        // Trả về kết quả (ưu tiên từ Supabase)
                        if (resSupabase.status === 'fulfilled') {
                            return resSupabase.value;
                        }
                        if (resLocal.status === 'fulfilled') {
                            return resLocal.value;
                        }

                        // Nếu cả 2 đều lỗi thì ném lỗi
                        throw (resSupabase as PromiseRejectedResult).reason;
                    } else {
                        // Thao tác đọc (read): Ưu tiên đọc từ Local CSDL để lấy tốc độ phản hồi cực nhanh (0ms mạng)
                        try {
                            return await localModel[method](...args);
                        } catch (err: any) {
                            // Tự động fallback đọc từ Cloud Supabase nếu kết nối Local bị gián đoạn
                            console.warn(`⚠️ Đọc dữ liệu từ Local thất bại, tự động chuyển vùng đọc từ Supabase Cloud:`, err.message || err);
                            return await supabaseModel[method](...args);
                        }
                    }
                };
            }
            return Reflect.get(target, propKey, receiver);
        }
    });
}

// Xuất bản đối tượng prisma bọc proxy
export const prisma = new Proxy(supabasePrisma, {
    get(target, propKey, receiver) {
        const propStr = propKey as string;

        if (propStr === '$disconnect') {
            return async () => {
                await Promise.all([supabasePrisma.$disconnect(), localPrisma.$disconnect()]);
            };
        }
        if (propStr === '$connect') {
            return async () => {
                await Promise.all([supabasePrisma.$connect(), localPrisma.$connect()]);
            };
        }
        if (propStr === '$transaction') {
            return async (arg: any) => {
                console.log(`🔌 Dual-Write: Thực thi $transaction song song trên cả hai CSDL...`);
                const [resSupabase, resLocal] = await Promise.allSettled([
                    supabasePrisma.$transaction(arg),
                    localPrisma.$transaction(arg)
                ]);
                if (resSupabase.status === 'fulfilled') return resSupabase.value;
                if (resLocal.status === 'fulfilled') return resLocal.value;
                throw (resSupabase as PromiseRejectedResult).reason;
            };
        }

        if (propStr.startsWith('$')) {
            return Reflect.get(target, propKey, receiver);
        }

        return createModelProxy(propStr);
    }
});