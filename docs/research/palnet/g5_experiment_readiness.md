# G5 — Hồ sơ sẵn sàng đánh giá hiệu quả chọn bài

**Trạng thái 06/10/2026:** `NOT_READY / NO_CAUSAL_RESULT`. Đây là kế hoạch kiểm tra và mẫu khóa thử nghiệm, **chưa phải** kết quả thử nghiệm. Protocol RQ3 đã khóa tại [protocol.md](protocol.md); phần cỡ mẫu, outcome instrument và cửa sổ tuyển người học cần một bản bổ sung được phê duyệt **trước khi** gán nhóm.

## Tách ba tầng bằng chứng

1. Benchmark ASSISTments G1–G3 đo dự đoán câu trả lời trên dữ liệu toán; không trả lời câu hỏi bài học LearnPython có hiệu quả hơn không.
2. Shadow mode ghi quyết định chính sách trên dữ liệu thật nhưng vẫn phục vụ lộ trình hiện hành. Nó đo eligibility, latency, fallback, sai lệch dữ liệu và mức độ an toàn; **không** ước lượng tác động học tập.
3. Chỉ thử nghiệm có kiểm soát theo **người học**, cùng đánh giá độc lập trước/sau, mới có thể ước lượng tác động chính sách. Phân tích chính là intention-to-treat, kể cả người học không mở bài được gợi ý.

## Điều kiện mở shadow

- Pre-test có bank đã duyệt, runner đúng ngôn ngữ, attempt/assessment/profile đã chấm và bảo vệ quyền truy cập; không dùng bộ nháp Python.
- Mapping lesson–skill `VERIFIED`, lesson đúng language/goal, `PUBLISHED` và nội dung `VALIDATED`; không có prerequisite treo hoặc roadmap có hơn một item mở.
- Decision adapter chỉ đọc bằng chứng server, ghi version của graph/mapping/policy/model, trạng thái trước quyết định, tập candidate **sau eligibility**, điểm từng candidate, bài shadow chọn và bài thực tế hiển thị. Log nghiên cứu dùng mã người học giả danh, không gồm email/code cá nhân.
- Kiểm tra một mẫu log bằng tay đối chiếu DB; không ghi câu trả lời Pre-test/test ẩn vào log. Đo tỷ lệ `NO_ELIGIBLE_LESSON`, mọi fallback, latency p50/p95 và phân bố đề xuất theo kỹ năng/nhóm đầu vào. Cổng an toàn phải fail closed; không sửa roadmap khi chạy shadow.

## Bản bổ sung cần khóa trước A/B

| Hạng mục | Quyết định bắt buộc trước tuyển mẫu |
| --- | --- |
| Đơn vị gán nhóm | `userId` cố định, phân tầng language + goal + mức đầu vào; không gán lại theo từng lesson. |
| Đối chứng/can thiệp | Lộ trình hiện hành so với đúng một `policyVersion`; giữ bất biến nội dung/runner và quyền truy cập. |
| Outcome chính | Mức tăng pre→post trên **bộ câu độc lập** theo cùng skill, không dùng để train/rank; định nghĩa thang điểm, thời điểm và missingness trước khi xem kết quả. |
| Outcome phụ | Retention ngày 30 (±3), completion, thời gian học, fallback và sự cố an toàn. |
| Cỡ mẫu | Tính power từ độ lệch chuẩn outcome pilot và mức cải thiện có ý nghĩa thực tiễn; ghi alpha, power, attrition, strata và cỡ mẫu mỗi nhánh. Hiện **chưa có số hợp lệ**. |
| Phân tích | ITT; effect và CI 95% theo người học, điều chỉnh baseline/strata như đã khóa; không đổi chỉ số chính theo kết quả quan sát. |
| Riêng tư/an toàn | Cơ sở pháp lý/đồng ý phù hợp, quyền rút lui, giới hạn lưu log, quy tắc dừng khi bài sai language/tiền đề hoặc lỗi chấm. |

## Trạng thái nguồn ngày 06/10/2026

Pilot DB chỉ đọc có 0 assessment Pre-test, 0 roadmap, 0 mapping VERIFIED và 7 học viên với submission Python pass. Chưa có post-test độc lập, retention hoặc phân nhóm chính sách. Vì vậy bảng hiệu quả G5 phải để `CHƯA CHẠY`; không dùng AUC G3, dữ liệu synthetic, hay completion đơn lẻ để thay thế.
