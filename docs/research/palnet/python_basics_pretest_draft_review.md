# Bộ nháp Pre-test Python cơ bản — chờ duyệt nội dung

**Trạng thái:** `AI_DELEGATED_PILOT_APPROVED / servingEligible=true-by-manifest`. Nguồn máy đọc bất biến: `backend/src/infrastructure/data/pretestBank.pythonBasics.draft.json`; chính bản nháp vẫn giữ `servingEligible=false` để không thể tự phát hành. Manifest `pretestBank.v1.json` chỉ kích hoạt đúng SHA đã duyệt theo ủy quyền của chủ dự án.

Đã nhận [biên bản duyệt do người dùng gửi ngày 06/10/2026](python_basics_review_intake_2026-10-06.md). Biên bản ghi nhận chấp thuận nội dung, nhưng còn thiếu định danh hai người duyệt và báo cáo runner sản phẩm; vì vậy trạng thái phát hành **chưa đổi**.

Đã nhận thêm [báo cáo phản biện AI độc lập](python_basics_ai_review_intake_2026-10-06.md), đối chiếu đúng SHA bản nháp và kết luận `ACCEPT_AS_DRAFT`, không có blocker nội dung. Đây là bằng chứng hỗ trợ review; Docker, người chịu trách nhiệm, mapping và runtime vẫn chưa được nghiệm thu.

Ngày 06/10, theo ủy quyền trực tiếp của chủ dự án, [OpenAI Codex đã ghi xác nhận kỹ thuật](python_basics_codex_review_2026-10-06.md) cho đúng SHA bản nháp. Ba câu thực hành cũng đã đạt Docker QC thật; bằng chứng được lưu tại `evidence/python_basics_runner_qc_2026-10-06.json`. Manifest ghi hai nguồn phản biện AI độc lập bằng định danh AI minh bạch. Runtime pilot sau đó [đạt kiểm tra end-to-end](evidence/python_basics_runtime_e2e_2026-10-06.json).

| ID | Loại | Primary skill | Nội dung cần duyệt |
| --- | --- | --- | --- |
| PT-PYB-001 | Khái niệm | PY-BASICS-01 | Tên biến Python hợp lệ |
| PT-PYB-002 | Khái niệm | PY-BASICS-03 | Toán tử chia lấy dư |
| PT-PYB-003 | Khái niệm | PY-STRING-02 | `strip()` so với xóa khoảng trắng giữa chuỗi |
| PT-PYB-004 | Đọc code | PY-BASICS-02 | Ép chuỗi `'7'` sang số nguyên |
| PT-PYB-005 | Đọc code | PY-STRING-01 | Slicing chuỗi và giới hạn cuối |
| PT-PYB-006 | Đọc code | PY-FLOW-01 | Nhánh `if/elif/else` |
| PT-PYB-007 | Đọc code | PY-FLOW-02 | Điều kiện dừng `while` và biến cộng dồn |
| PT-PYB-008 | Sửa lỗi | PY-FLOW-01 | Phân biệt `=` và `==` trong `if` |
| PT-PYB-009 | Sửa lỗi | PY-FLOW-04 | `break` so với `continue` |
| PT-PYB-010 | Thực hành | PY-BASICS-03 | Đọc hai số, in tổng; có số âm và 0 |
| PT-PYB-011 | Thực hành | PY-FLOW-01 | Phân loại chẵn/lẻ; có số âm và 0 |
| PT-PYB-012 | Thực hành | PY-FLOW-03 | Tổng 1..n với `for/range`; có n=0 |

Chạy từ gốc repo: `python ai-service/scripts/validate_pretest_python_basics_draft.py`. Kết quả hiện tại: 3/4/2/3 câu theo bốn loại; 9/9 skill trong goal và 5/5 kỹ năng cổng được phủ; **15 ca chạy code đúng kỳ vọng, 3/3 lời giải sai mẫu bị test bắt**; không có lỗi cấu trúc. SHA-256 bản nháp: `9048eb9f86553977e47f5f99760c73e85c0d8c7122b002cc4de3c0629f1aba68`. Ngày 06/10/2026, ba câu thực hành tiếp tục đạt runner sản phẩm Docker-only: 9/9 test chuẩn qua và các lời giải sai mẫu đều bị bắt; trạng thái `RUNNER_QC_PASSED`.

Hai phản biện AI đã xác nhận độc lập từng câu và đúng checksum; ba bài thực hành đã qua runner Python sản phẩm. Nếu sửa bất kỳ câu nào, manifest sẽ từ chối do checksum đổi và phải chạy lại review + Docker QC. API tạo/chấm Pre-test và hồ sơ learner hiện đã triển khai, có kiểm tra end-to-end DB thật bằng dữ liệu giả đã dọn sạch.

`sourceRefs` là gợi ý truy vết nội dung, **không** phải bằng chứng mapping bài học đã VERIFIED. Đặc biệt các mã bài `LS-04.xx` vẫn nằm trong nhóm xung đột mapping G0 và cần được kiểm tra riêng.
