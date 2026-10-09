# Bàn giao Pre-test Python Basics — runtime pilot đã hoạt động

Ngày 06/10/2026, DB LearnPython có **2 khảo sát đã hoàn tất**, nhưng **0 Pre-test assessment** và **0 câu Pre-test đã chấm**. Backend trước đó mới có schema; chưa có ngân hàng câu đã duyệt, API tạo/chấm attempt hoặc runner kiểm định đề Pre-test. Các quiz hiện có của khóa học không tự động trở thành câu Pre-test đã kiểm định.

Manifest server-owned `backend/src/infrastructure/data/pretestBank.v1.json` hiện phê duyệt đúng SHA của 12 câu Python Basics theo mô hình hai phản biện AI được chủ dự án ủy quyền công khai. API `GET /api/onboarding/pretest-readiness/:surveyId` yêu cầu token, xác minh chủ sở hữu và survey không phải draft; với `GOAL_PY_BASICS` hiện trả bank sẵn sàng và `attemptCreationAvailable=true`, nhưng không trả đáp án hoặc test ẩn.

Gate hiện tại cho `GOAL_PY_BASICS`: đủ 3 `CONCEPT`, 4 `TRACING`, 2 `BUG_HUNTING`, 3 `PRACTICAL`; đủ năm kỹ năng cổng `PY-BASICS-01`, `PY-BASICS-03`, `PY-STRING-02`, `PY-FLOW-01`, `PY-FLOW-03`.

Đã soạn [bộ 12 câu Python cơ bản](python_basics_pretest_draft_review.md) từ graph và nội dung khóa học hiện có. Tệp nội dung vẫn tự khóa `servingEligible=false`; manifest chỉ cho phép đúng SHA đã qua hai phản biện AI và Docker QC, nên mọi thay đổi nội dung sau duyệt sẽ bị từ chối.

Ngày 06/10 đã [tiếp nhận biên bản chấp thuận do người dùng gửi](python_basics_review_intake_2026-10-06.md). Biên bản đầu tiên một mình chưa đủ bằng chứng; sau đó có phản biện AI độc lập đúng checksum, xác nhận Codex theo ủy quyền của chủ dự án và biên bản Docker thật. Manifest ghi đúng loại reviewer là AI, không biến các nhãn vai trò ban đầu thành danh tính con người.

Đã lập [kịch bản kiểm tra Python Basics A–G](python_basics_pilot_test_scenarios.md) với kết quả cụ thể cho 12 câu, phiếu reviewer, mapping, API và thí nghiệm sau pilot. Ngày 06/10/2026, script `backend/scripts/verify_python_basics_runner.cjs` đã chạy ba bài thực hành qua BatchCodeRunner ở chế độ Docker-only, chặn fallback local và trả `RUNNER_QC_PASSED`. Cả 9 test của lời giải chuẩn đều qua; lời giải sai mẫu của cả ba câu đều bị bắt. Bằng chứng: `evidence/python_basics_runner_qc_2026-10-06.json`.

[Phản biện AI ngày 06/10](python_basics_ai_review_intake_2026-10-06.md) đã kết luận `ACCEPT_AS_DRAFT` cho đúng SHA của 12 câu và không nêu blocker nội dung. Kết quả này đóng phần phản biện AI của draft, nhưng không thay Docker QC, hai cá nhân chịu trách nhiệm, mapping lesson hoặc API runtime.

Theo ủy quyền trực tiếp của chủ dự án, [OpenAI Codex đã xác nhận kỹ thuật](python_basics_codex_review_2026-10-06.md) cho đúng SHA và ghi rõ đây là AI reviewer. Cùng phản biện AI độc lập trước đó, manifest lưu chính xác hai định danh AI; không ghi giả thành con người. Đây là quyết định phục vụ pilot của chủ dự án, không phải chứng nhận chuyên môn con người.

Runtime đã được triển khai tại `/api/pretests` và `/api/learner-profile`: tạo/resume một attempt ACTIVE, snapshot 12 câu, lưu từng câu, khóa 30 phút, idempotency khi nộp, chấm objective phía server, chấm practical Docker-only, tạo assessment và 9 trạng thái kỹ năng. Giao diện `/pretest/:surveyId` và `/pretest/result/:assessmentId` đã được nối từ trang khảo sát. [Kiểm tra end-to-end DB + Docker](evidence/python_basics_runtime_e2e_2026-10-06.json) đạt: 12/12 câu chấm, tổng điểm chuẩn 16.5/16.5, nộp lặp trả cùng assessment, chặn truy cập chéo user, không lộ đáp án/test ẩn và đã xóa dữ liệu giả.

Cổng authoring hiện tìm một tổ hợp đề hợp lệ theo blueprint, gateway và questionFamily (không còn phụ thuộc lựa chọn tham lam đầu tiên); ID câu trùng bị loại an toàn. Nếu số câu theo từng loại có vẻ đủ nhưng không thể chọn đồng thời do trùng family/gateway, `selectionConflict=true`. Bộ tính hồ sơ `backend/src/modules/onboarding/pretestProfile.ts` đã nối với attempt/assessment/DB và tạo 9 trạng thái kỹ năng từ câu đã chấm.

Mỗi item được phát hành phải đúng language + graphVersion + primarySkillId thuộc bao đóng mục tiêu, questionFamilyId duy nhất trong đề, đúng loại câu và có prompt. Manifest yêu cầu hai định danh reviewer độc lập cùng báo cáo kiểm định có checksum SHA-256. Câu khách quan có phương án và hash đáp án; câu thực hành có checksum test, ít nhất một test ẩn và biên bản runner. Pilot hiện dùng hai reviewer AI theo ủy quyền minh bạch của chủ dự án; nếu dự án yêu cầu chứng nhận con người về sau, đó là một cổng quản trị bổ sung chứ không được sửa nhãn AI thành người.

Blueprint khóa G0: 12 câu = 3 khái niệm, 4 tracing, 2 bug hunting, 3 thực hành; 14 câu = 4/4/3/3; 15 câu = 4/5/3/3. Bộ chọn hiện tìm tổ hợp chính xác, bảo đảm câu độc lập, đúng kỹ năng cổng và đủ câu đã kiểm định cho **từng** goal/language; thiếu thì `PRETEST_UNAVAILABLE`. Python Basics đã đủ; các goal/language khác vẫn fail-closed.

Phần Pre-test và [lộ trình Python Basics pilot](python_basics_roadmap_pilot_2026-10-06.md) có thể thử bằng tài khoản thật. Mapping cho các mục tiêu khác và toàn khóa vẫn chờ duyệt; mô hình dự đoán LearnPython và đánh giá hiệu quả học tập chưa có.
