import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { codeExecutionQueue } from '../services/queueService';
import { AuthenticatedRequest } from '../middlewares/auth';

// Chạy thử code (không lưu database)
export const runCodeDynamic = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, input, language } = req.body;

        if (!code) {
            res.status(400).json({ error: "Mã nguồn không được để trống!" });
            return;
        }

        const execLanguage = language || (/SELECT|FROM|WHERE|INSERT|UPDATE|DELETE/i.test(code) ? 'SQL' : 'PYTHON');
        const result = await codeExecutionQueue.pushJob(code, execLanguage as any, input || '', 5000);

        if (result.status === 'TIMEOUT') {
            res.status(200).json({
                success: false,
                output: "Lỗi: Chương trình chạy quá thời gian cho phép (Timeout 5s)."
            });
            return;
        }

        if (result.status === 'ERROR' || result.stderr) {
            res.status(200).json({
                success: false,
                output: result.stderr.trim()
            });
            return;
        }

        res.status(200).json({
            success: true,
            output: result.stdout
        });

    } catch (err: any) {
        res.status(500).json({ error: "Lỗi Server nội bộ", details: err.message });
    }
};

// Hàm kiểm tra các ràng buộc biến (Review 3) để tránh người dùng in tắt chuỗi kết quả
function validateCodeConstraints(exerciseTitle: string, code: string): string | null {
    // Loại bỏ chú thích để tránh so khớp giả
    const cleanCode = code.replace(/#.*$/gm, '').replace(/'''[\s\S]*?'''/g, '').replace(/"""[\s\S]*?"""/g, '');

    switch (exerciseTitle) {
        case 'Viết chú thích và in nhiều dòng':
            if (!/#.+/.test(code)) {
                return "Đề bài yêu cầu bạn phải viết ít nhất một dòng chú thích bắt đầu bằng ký tự `#`.";
            }
            break;

        case 'Khai báo biến cơ bản':
            if (!/course_title\s*=/i.test(cleanCode)) {
                return "Đề bài yêu cầu bạn phải khai báo biến chính xác tên là `course_title`.";
            }
            if (!/course_title\s*=\s*['"]Học Python cùng MCODE['"]/i.test(cleanCode)) {
                return "Hãy gán giá trị 'Học Python cùng MCODE' cho biến `course_title`.";
            }
            break;

        case 'Tính toán hóa đơn áo thun':
            if (!/so_ao_thun/i.test(cleanCode)) {
                return "Đề bài yêu cầu bạn khai báo biến `so_ao_thun`.";
            }
            if (!/gia_moi_ao/i.test(cleanCode)) {
                return "Đề bài yêu cầu bạn khai báo biến `gia_moi_ao`.";
            }
            if (!/tong_tien/i.test(cleanCode)) {
                return "Đề bài yêu cầu bạn khai báo biến `tong_tien` chứa kết quả tính toán.";
            }
            break;

        case 'Khai báo kiểu dữ liệu nguyên thủy':
            if (!/tuoi/i.test(cleanCode)) {
                return "Đề bài yêu cầu khai báo biến `tuoi`.";
            }
            if (!/diem_so/i.test(cleanCode)) {
                return "Đề bài yêu cầu khai báo biến `diem_so`.";
            }
            if (!/is_student/i.test(cleanCode)) {
                return "Đề bài yêu cầu khai báo biến `is_student`.";
            }
            break;

        case 'Kiểm tra kiểu dữ liệu với type()':
            if (!/chieu_cao/i.test(cleanCode)) {
                return "Đề bài yêu cầu khai báo biến `chieu_cao`.";
            }
            if (!/type\s*\(\s*chieu_cao\s*\)/i.test(cleanCode)) {
                return "Hãy sử dụng hàm `type(chieu_cao)` kết hợp với `print()` để in kiểu dữ liệu.";
            }
            break;

        case 'Tính toán chia chia lấy dư pizza':
            if (!/so_tien_moi_nguoi/i.test(cleanCode)) {
                return "Đề bài yêu cầu bạn khai báo biến `so_tien_moi_nguoi`.";
            }
            if (!/so_tien_du/i.test(cleanCode)) {
                return "Đề bài yêu cầu bạn khai báo biến `so_tien_du`.";
            }
            break;

        case 'Cập nhật ví tiết kiệm':
            if (!/tien_tiet_kiem/i.test(cleanCode)) {
                return "Đề bài yêu cầu khai báo và cập nhật biến `tien_tiet_kiem`.";
            }
            if (!/\+=\s*50000/i.test(cleanCode) && !/tien_tiet_kiem\s*=\s*tien_tiet_kiem\s*\+\s*50000/i.test(cleanCode)) {
                return "Bạn cần sử dụng toán tử cộng dồn tích lũy thêm 50,000đ.";
            }
            if (!/\*=\s*2/i.test(cleanCode) && !/tien_tiet_kiem\s*=\s*tien_tiet_kiem\s*\*\s*2/i.test(cleanCode)) {
                return "Bạn cần nhân đôi số tiền tiết kiệm.";
            }
            break;

        case 'Định dạng ngày xuất bản':
            if (!/ngay/i.test(cleanCode) || !/thang/i.test(cleanCode) || !/nam/i.test(cleanCode)) {
                return "Đề bài yêu cầu khai báo 3 biến `ngay`, `thang`, `nam`.";
            }
            if (!/sep\s*=\s*['"]\/['"]/i.test(cleanCode)) {
                return "Bạn cần chỉ định tham số `sep='/'` trong hàm `print()`.";
            }
            break;
    }

    return null;
}

interface CodeConstraintConfig {
    requireComment?: boolean;
    requiredKeywords?: string[];
    forbiddenKeywords?: string[];
    customErrorMessage?: string;
}

function parseAndValidateConstraints(problemDescription: string, exerciseTitle: string, code: string): string | null {
    // 1. Kiểm tra nếu có metadata CONSTRAINTS trong problemDescription
    const match = /<!--\s*CONSTRAINTS:\s*(\{[\s\S]*?\})\s*-->/.exec(problemDescription || '');
    if (match) {
        try {
            const config: CodeConstraintConfig = JSON.parse(match[1]);
            const cleanCode = code.replace(/#.*$/gm, '').replace(/'''[\s\S]*?'''/g, '').replace(/"""[\s\S]*?"""/g, '');

            // 1.1 Kiểm tra bắt buộc có comment (#)
            if (config.requireComment && !/#.+/.test(code)) {
                return config.customErrorMessage || "Đề bài yêu cầu bạn phải viết ít nhất một dòng chú thích bắt đầu bằng ký tự `#`.";
            }

            // 1.2 Kiểm tra các từ khóa bắt buộc
            if (config.requiredKeywords && config.requiredKeywords.length > 0) {
                for (const kw of config.requiredKeywords) {
                    const trimmed = kw.trim();
                    if (!trimmed) continue;
                    const kwRegex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                    if (!kwRegex.test(code)) {
                        return config.customErrorMessage || `Mã nguồn của bạn bắt buộc phải sử dụng cú pháp/từ khóa \`${trimmed}\`.`;
                    }
                }
            }

            // 1.3 Kiểm tra các từ khóa bị cấm
            if (config.forbiddenKeywords && config.forbiddenKeywords.length > 0) {
                for (const kw of config.forbiddenKeywords) {
                    const trimmed = kw.trim();
                    if (!trimmed) continue;
                    const kwRegex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                    if (kwRegex.test(cleanCode)) {
                        return config.customErrorMessage || `Đề bài cấm sử dụng cú pháp/hàm \`${trimmed}\`. Bạn hãy tự cài đặt thuật toán nhé!`;
                    }
                }
            }
        } catch (e) {
            console.error('Lỗi khi parse cấu hình constraints:', e);
        }
    }

    // 2. Fallback sang kiểm tra các bài tập đã định nghĩa cố định
    return validateCodeConstraints(exerciseTitle, code);
}

// Nộp bài chấm điểm (có lưu vào DB, có tính runtime beats & distribution chart)
export const submitExercise = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string; // ID của CodingExercise
        const { code } = req.body;
        const userId = req.user?.id as string;

        if (!userId) {
            res.status(401).json({ error: "Người dùng chưa đăng nhập" });
            return;
        }

        if (!code) {
            res.status(400).json({ error: "Mã nguồn không được để trống!" });
            return;
        }

        // 1. Lấy thông tin bài tập cùng testcases
        const exercise = await prisma.codingExercise.findUnique({
            where: { id },
            include: { testCases: true, lesson: true }
        }) as any;

        if (!exercise) {
            res.status(404).json({ error: "Không tìm thấy bài tập thực hành này." });
            return;
        }

        const isSqlExercise = exercise.lesson?.lessonId?.startsWith('SQL-') || /SELECT|FROM|WHERE/i.test(code);
        const execLanguage = isSqlExercise ? 'SQL' : 'PYTHON';

        // 2. Kiểm tra ràng buộc biến tĩnh & dynamic constraints chỉ khi là bài tập Python
        if (!isSqlExercise) {
            const constraintError = parseAndValidateConstraints(exercise.problemDescription || '', exercise.title, code);
            if (constraintError) {
                res.status(200).json({
                    success: true,
                    allPassed: false,
                    message: constraintError,
                    results: (exercise.testCases || []).map((tc: any) => ({
                        id: tc.id,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        actualOutput: `[Lỗi chấm bài] ${constraintError}`,
                        passed: false
                    }))
                });
                return;
            }
        }

        // 3. Thực thi song song tất cả các testcase trong môi trường Sandbox/Local
        let totalRuntime = 0;
        let hasSystemError = false;

        const results = await Promise.all(
            (exercise.testCases || []).map(async (tc: any) => {
                try {
                    const result = await codeExecutionQueue.pushJob(code, execLanguage as any, tc.input, 5000);
                    totalRuntime += result.runtimeMs;

                    if (result.status === 'TIMEOUT') {
                        return {
                            id: tc.id,
                            input: tc.input,
                            expectedOutput: tc.expectedOutput,
                            actualOutput: "Lỗi: Quá thời gian thực thi (5s)",
                            passed: false
                        };
                    }

                    const matchOutput = (act: string, exp: string): boolean => {
                        const cleanActual = act.replace(/\r\n/g, '\n').trim().replace(/\s+/g, ' ');
                        const cleanExpected = exp.replace(/\r\n/g, '\n').trim().replace(/\s+/g, ' ');
                        if (cleanActual === cleanExpected) return true;
                        if (cleanActual.endsWith(cleanExpected)) {
                            return true;
                        }
                        return false;
                    };
                    const actual = result.stdout || '';
                    const passed = matchOutput(actual, tc.expectedOutput);

                    return {
                        id: tc.id,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        actualOutput: result.status === 'ERROR' ? result.stderr : actual,
                        passed
                    };
                } catch (e: any) {
                    hasSystemError = true;
                    return {
                        id: tc.id,
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        actualOutput: `Lỗi hệ thống: ${e.message}`,
                        passed: false
                    };
                }
            })
        );

        if (hasSystemError) {
            res.status(500).json({ error: "Lỗi trong quá trình chấm bài." });
            return;
        }

        const allPassed = results.every((r: any) => r.passed);

        // Đo lường thời gian chạy trung bình thực tế cho 1 testcase
        const avgRuntime = (exercise.testCases || []).length > 0 ? totalRuntime / exercise.testCases.length : 15;
        const normalizedRuntime = Math.max(5, avgRuntime);

        // 4. Lưu kết quả nộp bài vào DB
        const submission = await prisma.submission.create({
            data: {
                userId,
                exerciseId: id,
                code,
                language: execLanguage as any,
                status: allPassed ? 'PASSED' : 'FAILED',
                runtime: normalizedRuntime
            }
        });

        // 5. Cập nhật tiến trình bài học (hoàn thành) nếu người dùng đã vượt qua bài tập
        if (allPassed) {
            await prisma.lessonProgress.upsert({
                where: {
                    userId_lessonId: {
                        userId,
                        lessonId: exercise.lessonId
                    }
                },
                update: {
                    isCompleted: true,
                    lastCode: code,
                    completedAt: new Date()
                },
                create: {
                    userId,
                    lessonId: exercise.lessonId,
                    isCompleted: true,
                    lastCode: code,
                    completedAt: new Date()
                }
            });
        }

        // 6. Tính toán Leetcode Beats Percentile từ dữ liệu thực tế
        let beats = 100;
        if (allPassed) {
            const totalPassed = await prisma.submission.count({
                where: { exerciseId: id, status: 'PASSED' }
            });
            const slowerPassed = await prisma.submission.count({
                where: { exerciseId: id, status: 'PASSED', runtime: { gt: normalizedRuntime } }
            });
            beats = totalPassed > 1 ? (slowerPassed / totalPassed) * 100 : 100.0;
        }

        // 7. Tạo dữ liệu biểu đồ phân phối thời gian chạy từ dữ liệu thực tế
        const allSubmissions = await prisma.submission.findMany({
            where: { exerciseId: id, status: 'PASSED' },
            select: { runtime: true }
        });

        // Chia biểu đồ thành 8 cột (buckets) từ 10ms đến 90ms+
        const buckets = [
            { label: '10-20ms', min: 10, max: 20, count: 0 },
            { label: '20-30ms', min: 20, max: 30, count: 0 },
            { label: '30-40ms', min: 30, max: 40, count: 0 },
            { label: '40-50ms', min: 40, max: 50, count: 0 },
            { label: '50-60ms', min: 50, max: 60, count: 0 },
            { label: '60-70ms', min: 60, max: 70, count: 0 },
            { label: '70-80ms', min: 70, max: 80, count: 0 },
            { label: '80ms+', min: 80, max: 9999, count: 0 }
        ];

        // Đếm số lượng thực tế trong cơ sở dữ liệu
        allSubmissions.forEach(sub => {
            const rt = sub.runtime || 25;
            const bucket = buckets.find(b => rt >= b.min && rt < b.max);
            if (bucket) bucket.count++;
        });

        res.status(200).json({
            success: true,
            allPassed,
            submissionId: submission.id,
            results,
            runtimeMs: parseFloat(normalizedRuntime.toFixed(1)),
            runtimeBeats: parseFloat(beats.toFixed(1)),
            distribution: buckets.map(b => ({ range: b.label, count: b.count }))
        });

    } catch (err: any) {
        next(err);
    }
};

// Lấy lịch sử nộp bài của học viên (Review 4)
export const getSubmissions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = req.params.id as string; // ID của CodingExercise
        const userId = req.user?.id as string;

        if (!userId) {
            res.status(401).json({ error: "Người dùng chưa đăng nhập" });
            return;
        }

        const submissions = await prisma.submission.findMany({
            where: {
                userId,
                exerciseId: id
            },
            orderBy: {
                submittedAt: 'desc'
            },
            take: 10
        });

        res.status(200).json(submissions);
    } catch (err) {
        next(err);
    }
};