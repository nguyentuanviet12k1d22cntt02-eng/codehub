import type { CodeConstraintConfig } from '../../infrastructure/analysis/staticCodeAnalyzer';

/**
 * Vá nội dung cho bài luyện tập theo module (LS-0x.MP).
 *
 * Nội dung các bài này (tiêu đề, đề, code khởi đầu, testcase) bị model PAL-Net r03 ghim qua
 * `contentVersion`; sửa trong DB sẽ làm lệch catalog. Vì vậy:
 *  - ràng buộc bổ sung được áp khi chấm (gộp với `<!-- CONSTRAINTS -->` trong đề);
 *  - phần làm rõ đề chỉ được thêm vào nội dung trả cho học viên, không ghi vào DB.
 * Danh sách lỗi gốc: reviews/exercise-content-audit-2026-11-16/REPORT.md (nhóm B, C).
 */

const req = (...requiredConstructs: string[]): CodeConstraintConfig => ({ requiredConstructs });

export const CONSTRAINT_PATCHES: Readonly<Record<string, CodeConstraintConfig>> = Object.freeze({
    // C1: bài không có input, in cứng đáp số vẫn đạt → bắt buộc thao tác đề yêu cầu trên dữ liệu đã cho.
    'f8bdfd0f-1e51-4809-8a06-6ecbb9a6b436': req('call:issubset|call:issuperset', 'read:bai_viet'), // Hashtags
    '023a50f3-f8ee-46fb-9d46-4edfcdd6aa12': req('call:len', 'read:danh_ba'), // Kích thước của Dictionary
    '4f55875b-3715-46f5-ab13-7e1e222d948a': req('op:in', 'read:thoi_tiet'), // Kiểm tra sự tồn tại của key
    'e692203f-e1a9-4e3e-9f9c-c821f7f553a9': req('call:set', 'op:union', 'op:intersect', 'op:diff'), // Phần tử trùng/độc nhất
    '90bc921b-00e1-423b-88e0-a690011605cf': req('call:set', 'op:xor'), // Hiệu đối xứng
    'e03ec5c1-adcc-4e15-aadf-8742c6bdbb69': req('call:get', 'read:diem_thi'), // .get()
    'a79d4420-67ba-419e-9aab-6d441ee7d2a2': req('setitem:san_pham', 'read:san_pham'), // Sửa đổi giá trị
    '6c3f5a1c-4bdf-4241-867d-cfbbaf865ea2': req('getitem:thong_tin_nguoi'), // Tạo Dictionary và truy cập
    '9a26e9f7-5f35-4056-8892-33fc4909e392': req('setitem:sinh_vien', 'read:sinh_vien'), // Thêm cặp key-value
    '24088679-3757-4e12-ac9e-05a399cf5b76': req('call:pop|del', 'read:cau_hinh'), // Xóa cặp key-value

    // C2: đề bắt buộc vòng lặp / ngoại lệ / thuật toán.
    'da8062a8-faa7-4d0c-91ce-ab01c10132e6': req('for'), // Tích 1..N (ngân hàng for)
    'c03edb56-558d-4cec-85e6-dc5b983ea7f4': req('while'), // Tích 1..N bằng while
    '009ce998-acf2-4ccd-a87e-4debf443dc40': req('class:SoAmError', 'def:nhap_tuoi', 'call:nhap_tuoi', 'raise', 'try', 'except:SoAmError'),
    '6b78f296-e489-4732-a426-738de86f23f0': { requiredConstructs: ['while|recursion'], forbiddenConstructs: ['call:index'] }, // Nhị phân
    'b7806a4c-e837-44a6-a83e-b2a6dae09dfe': { forbiddenConstructs: ['slice:reverse'] }, // B9: cấm [::-1]

    // C2: đề yêu cầu viết hàm.
    '08ca3bd9-a535-4856-9567-4192fb69ff42': req('def:chuan_hoa_ten', 'call:chuan_hoa_ten', 'return'),
    '262ad94e-d955-42b1-858d-c65d8ddeba5f': req('def:tinh_ucln', 'def:tinh_bcnn', 'call:tinh_ucln', 'call:tinh_bcnn', 'return'),
    '35dd1298-543e-4c5d-92b9-958e171bbe7b': req('def:lai_kep', 'call:lai_kep', 'return'),
    '4f692ccb-a8ce-41e3-84f3-94019fab2d74': req('def:fibonacci', 'call:fibonacci', 'return'),
    'c7dea275-e1dd-4bb8-b458-653c9d89457e': req('call:strptime|call:date|call:fromisoformat|call:datetime'),
    'cc3b3941-aa81-47e0-8e6a-2358a1a08a69': req('def:la_so_nguyen_to', 'call:la_so_nguyen_to', 'return'),
    'cde49c88-3027-4896-a349-1f5ca5505932': req('def:giai_thua', 'call:giai_thua', 'return'),
    'f68a256a-b491-4ae2-9fe7-e227c62c789d': req('def:gui_thu_moi', 'call:gui_thu_moi'),
    'cc51ec22-95d3-4726-960a-a12560341c4b': req('def:loc_so_lon_hon', 'call:loc_so_lon_hon', 'return'),
    '49e473e1-e496-44dd-a87f-b42c3ff4ca3b': req('for', 'return'), // đã có def/call trong đề
    '00c01cd8-2c1d-493d-9703-4bd829d453c4': req('def:cap_nhat_diem', 'call:cap_nhat_diem', 'return'),
    '5dd30834-06a7-4bd7-be31-57f29b1f6349': req('def:tim_san_pham_gia_cao_nhat', 'call:tim_san_pham_gia_cao_nhat', 'return'),
    'fd026dca-563c-4ef3-ae2e-768f6ef60706': req('return'), // đã có def/call trong đề

    // C2: đề yêu cầu lớp, __init__, phương thức.
    '377e2b02-3b78-4538-98af-1d5296df6d42': req('class:SinhVien', 'def:__init__', 'call:SinhVien'),
    'aacd1c46-4677-41a4-b276-aa2db2732c5c': req('class:SinhVien', 'def:__init__', 'def:gioi_thieu', 'call:gioi_thieu'),
    '54b0f538-67ee-41fc-8bdc-f755fdb00fbf': req('class:Book', 'def:__init__', 'def:__str__', 'call:Book'),
    'b63bc6c7-5864-4128-b5b8-06f21912d101': req('class:NhanVien', 'def:__init__', 'def:tinh_luong', 'call:tinh_luong'),
    'e1a87ce2-f75d-4ab1-b3b8-309f5c7dda1f': req('class:PhanSo', 'def:__init__', 'def:rut_gon', 'call:rut_gon', 'call:gcd'),
    '20760d45-5492-4c4f-b1a9-27031b951da0': req('class:TaiKhoan', 'def:__init__', 'def:nap_tien', 'def:rut_tien', 'call:nap_tien|call:rut_tien'),
    'a5a916b6-c387-4ce1-88ca-f215cdb6b4ec': req('class:HinhTron', 'def:__init__', 'def:tinh_dien_tich', 'call:tinh_dien_tich'),
    '3f9849b6-0441-4f13-861d-8a5d6890aa37': req('class:TaiKhoanTinDung', 'def:__init__', 'def:rut_tien', 'call:rut_tien'),
});

/** Nhóm B: làm rõ đề (hiển thị cho học viên, không đổi nội dung đã ghim). */
export const STATEMENT_CLARIFICATIONS: Readonly<Record<string, string>> = Object.freeze({
    // B1
    'b39ac033-804f-45d5-b2c9-41cb59e3d6e2': 'Thứ tự đúng là mục **Thứ tự kiểm tra bắt buộc**: số tiền không hợp lệ → `Số dư không đủ` → `Vượt quá hạn mức mỗi lần rút` → thành công. Danh sách gạch đầu dòng phía trên chỉ liệt kê các thông báo, không quy định thứ tự.',
    // B3
    '8e5987cf-60a4-4262-b8c2-d465e1e7a951': 'Ở ví dụ, Input là **một dòng trống** (chỉ nhấn Enter, không gõ gì). Chữ "(dòng trống)" chỉ để minh họa, không phải dữ liệu nhập.',
    // B4
    '83d56e04-fe17-4f8c-b42c-03bdefae1d53': 'Mức **Trung bình** được hiểu là: **không có cả hai môn dưới 5.0** (tối đa 1 môn dưới 5.0) **và** vắng < 10. Khi đã thỏa điều kiện này thì không cần xét thêm trung bình cộng. Các mức được xét lần lượt từ Xuất sắc xuống Yếu, gặp mức nào thỏa trước thì dừng.',
    // B5
    '294c15d4-ec35-41fd-8cd7-424c355a5587': 'Quãng đường lẻ **tính theo tỉ lệ**, không làm tròn số km. Ví dụ 7.5 km ban ngày: `15000 + 6.5 × 12000 = 93000.0`. In số tiền dạng số thực như kết quả phép tính (vd `93000.0`).',
    // B6
    '01d2ed36-94d7-4e6c-8a30-06115950cda4': 'Khung giờ mở cửa **gồm cả 9h và 18h**: ngày thường, `9 <= gio_hien_tai <= 18` là đang mở.',
    // B7
    '139fd9ad-7b97-41f0-a0df-c9ff99a7ce97': 'Bài này chỉ cần xử lý `KeyError` khi tra `kho[key]`; không có trường hợp `IndexError` cần xử lý.',
    // B8
    'ac95e910-3bd9-43cc-9a14-78273b1dd392': 'Bài chỉ chấm kết quả diện tích hai hình; bạn có thể dùng lớp (đa hình) hoặc tính trực tiếp đều được.',
    // B9
    'b7806a4c-e837-44a6-a83e-b2a6dae09dfe': 'Tiêu đề ghi `[-1]` nhưng ý là cách cắt đảo ngược **`[::-1]`**: không được dùng cách này. Hãy dùng `reverse()` hoặc vòng lặp.',
    // B10
    'be9b4034-155c-469f-913e-1dfa8d1ccd1a': '"Nhân đôi" ở đây là **lặp lại mỗi phần tử 2 lần liên tiếp** (vd `[1, 2]` → `[1, 1, 2, 2]`), không phải nhân giá trị với 2.',
    // B11
    'f5e6c92d-ed11-489c-b7df-abf09f69267a': 'Dữ liệu thật có khoảng trắng ở hai đầu, ví dụ Input `"     Hello     "` (có dấu cách trước và sau) → Output `Hello`.',
    // B12
    'afa2b150-e849-4ca6-a3ce-d5f9218423d8': 'Input ví dụ gồm 5 dòng `4`, `1`, `2`, `3`, `4`, mỗi dòng **không có khoảng trắng ở đầu**; phần thụt lề trong khung ví dụ chỉ do cách trình bày.',
});

export function constraintPatchFor(exerciseId: string): CodeConstraintConfig {
    return CONSTRAINT_PATCHES[exerciseId] ?? {};
}

const fence = (text: string) => '```text\n' + text.replace(/\r\n/g, '\n').replace(/\n+$/, '') + '\n```';

/**
 * Đề trả cho học viên: thêm phần làm rõ (nếu có) và, với bài chưa có mục Ví dụ,
 * ví dụ lấy từ testcase công khai đầu tiên. Không đổi dữ liệu trong DB.
 */
export function learnerStatement(exercise: { id: string; problemDescription: string | null;
    testCases?: { input: string; expectedOutput: string; isHidden?: boolean | null }[] }): string {
    let statement = exercise.problemDescription || '';
    const note = STATEMENT_CLARIFICATIONS[exercise.id];
    if (note) statement += `\n\n> **Làm rõ đề:** ${note}`;
    const sample = (exercise.testCases || []).find(tc => !tc.isHidden && !tc.input.includes('"__pythonFileCase"'));
    if (sample && !/###\s*Ví dụ/i.test(statement)) {
        statement += '\n\n### Ví dụ\n' + (sample.input.trim() ? `**Input**\n${fence(sample.input)}\n` : '')
            + `**Output**\n${fence(sample.expectedOutput)}\n\n`
            + 'In đúng từng dòng như Output (mỗi giá trị trên một dòng nếu Output có nhiều dòng), không in thêm chữ gợi ý.';
    }
    return statement;
}
