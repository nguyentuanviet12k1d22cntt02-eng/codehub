# G6 — Runbook phát hành và giám sát (bản chuẩn bị, chưa kích hoạt)

**Trạng thái:** `SERVING_DISABLED`. Tài liệu này định nghĩa thao tác kiểm tra an toàn; không xác nhận G4/G5 đã nghiệm thu.

## Cổng trước phát hành theo từng ngôn ngữ

1. Xác thực `language + graphVersion + mappingVersion`; nội dung và catalog lesson phải cùng phiên bản, đã duyệt và không có tham chiếu tiền đề treo. Bằng chứng assessment phải thuộc cùng user/language/goal và đã chấm; survey tự khai không phải mastery.
2. Nếu dùng mô hình, yêu cầu đủ dữ liệu LearnPython theo [protocol](protocol.md), checkpoint đúng miền đã đánh giá, metadata skill có thứ tự và SHA-256 trùng registry. Không dùng artifact ASSISTments, weights ngẫu nhiên hoặc checkpoint cũ để qua cổng.
3. Chạy test eligibility, một-item-open, split/score riêng theo language, latency và fallback. Chạy shadow trước khi bật can thiệp; chỉ đánh giá tác động khi G5 có thiết kế được khóa.
4. Duyệt model card vận hành, owner nội dung, owner kỹ thuật và kế hoạch rollback. Bật dần theo language/goal; mặc định vẫn theo lộ trình hiện hành.

## Theo dõi và ứng phó

Theo dõi số quyết định, candidate hợp lệ, tỷ lệ `NO_ELIGIBLE_LESSON`, tỷ lệ fallback theo tên, lỗi load/checksum/version, latency p50/p95, coverage mapping, calibration của `predictedCorrectness` khi có nhãn, và tỷ lệ bài không phù hợp theo nhóm. Mọi log quyết định cần `policyVersion`, `graphVersion`, `mappingVersion`, `modelVersion|null`, timestamp và nguồn bằng chứng giả danh; không log đề/test ẩn hoặc dữ liệu cá nhân không cần thiết.

Nếu phát hiện sai language/goal/prerequisite, >1 item mở, checksum/version sai, hoặc chấm/runner lỗi: **tắt chính sách mới cho language/goal bị ảnh hưởng**, giữ nguyên roadmap đã khóa, chuyển về fallback có tên hoặc dừng tạo roadmap nếu không còn candidate hợp lệ. Lưu run ID, thời điểm, phiên bản, phạm vi ảnh hưởng và bản sao log tối thiểu để điều tra. Rollback không được tự gán điểm hay mở khóa bài. Chỉ bật lại sau khi lỗi được sửa, kiểm tra hồi quy và người phụ trách ký duyệt.

## Hiện trạng

Registry phục vụ hiện rỗng; mapping G0 có 0 dòng VERIFIED; bank Pre-test phát hành rỗng. Không có quyết định shadow nào trên assessment thật và chưa có tác động G5. Do đó đây là runbook dự kiến, **không** phải biên bản vận hành đang chạy.
