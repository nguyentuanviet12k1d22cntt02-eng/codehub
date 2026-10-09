# Tiếp nhận biên bản duyệt Python Basics — chờ xác minh trước phát hành

**Ngày nhận:** 06/10/2026. **Trạng thái:** `REVIEW_SUBMITTED_PENDING_VERIFICATION`; không đồng nghĩa `APPROVED` trong serving bank. Tệp được người dùng gửi: `C:\Users\ADMIN\.codex\attachments\b26a3677-80a1-4a78-b19c-f7f28064e6c8\Pasted text.txt`, SHA-256 `159807b638c857b44d8f0ce735817849823acc3b8bdae05c3f8196342371fbf7`.

## Đã đối chiếu được

- Biên bản liệt kê đúng 12 ID `PT-PYB-001`…`012`, đúng blueprint 3/4/2/3 và các primary skill của bản nháp. Các nhận xét về đáp án, code và ca biên khớp với nội dung hiện có ở mức kiểm tra tài liệu.
- Bản nháp hiện tại có SHA-256 `9048eb9f86553977e47f5f99760c73e85c0d8c7122b002cc4de3c0629f1aba68`. Chạy lại `validate_pretest_python_basics_draft.py` cho kết quả 15/15 ca kỹ thuật và 3/3 lời giải sai mẫu bị bắt. Đây là **kiểm tra Python cục bộ**, không phải biên bản runner sản phẩm.
- Ba đường dẫn nguồn ở `PT-PYB-003`, `010`, `012` đều tồn tại. Mapping ứng viên theo title hiện là `LS-04.03` (`BLOCKED_CONFLICT`), `LS-01.MP` (`REVIEW_REQUIRED_TITLE_ONLY`) và `LS-03.03` (`REVIEW_REQUIRED_CONSISTENT`). Chưa được đổi sourceRefs sang mã lesson chuẩn hoặc coi các mapping này là VERIFIED.

## Bằng chứng còn thiếu / điểm chưa khớp

1. Mục “Họ tên & Vai trò” và chữ ký chỉ ghi nhãn chức danh: `AI Python Pedagogy Auditor` và `Senior Python Engineer & Curriculum QC Lead`. Chưa có tên hoặc định danh của **hai cá nhân độc lập** để đối chiếu xác nhận. Biên bản cũng không ghi checksum của bản nháp mà từng người đã duyệt.
2. Biên bản lặp số 15/15 và 3/3 của validator cục bộ, nhưng không kèm runner version, môi trường Docker, log từng case, kết quả reference/known-wrong trên **runner sản phẩm**, hoặc checksum báo cáo runner. Đã bổ sung chế độ `strictIsolation` cho BatchCodeRunner và script QC Docker-only; trên máy kiểm tra hiện tại Docker daemon không sẵn sàng, nên script trả `RUNNER_QC_UNAVAILABLE`. Không được lấy đường fallback Python cục bộ làm kiểm định sandbox sản phẩm.
3. Biên bản ghi `PT-PYB-003` “đạt có lưu ý mapping” và yêu cầu chuẩn hóa sourceRefs của `003`, `010`, `012`; các xung đột mapping G0 và trạng thái phát hành/QC của lesson vẫn còn. Xác nhận câu hỏi đúng không tự duyệt mapping bài học.
4. Chưa có API tạo/chấm Pre-test, snapshot đề, idempotency/cooldown, profile/roadmap end-to-end hoặc học viên pilot; mọi chỉ số G5 vẫn `CHƯA CHẠY`.

## Quyết định tiếp nhận

Ghi nhận **ý kiến duyệt được gửi** cho 12 câu, không phủ nhận nhận xét nội dung; giữ bản nháp `AUTHOR_DRAFT / REVIEW_REQUIRED / servingEligible=false` và manifest sản phẩm rỗng. Không gán `reviewers`, `validationReportSha256`, `runnerValidationSha256` giả hoặc chuyển `source=CURATED_VALIDATED` từ tệp này. [Kịch bản kiểm tra đầy đủ](python_basics_pilot_test_scenarios.md) có lệnh và kết quả mong đợi. Bước mở khóa: chủ dự án xác nhận danh tính/định danh hai người duyệt độc lập và đúng checksum bản nháp; cung cấp biên bản chạy ba bài thực hành trên runner Docker cách ly; chốt các mapping lesson được dùng trong pilot cùng nội dung/QC và prerequisite. Khi bất kỳ item nào được sửa, phải kiểm định và duyệt lại đúng checksum mới.
