# Pilot lộ trình Python Basics từ Pre-test — 06/10/2026

## Phạm vi đang chạy

Sau khi mở trang kết quả Pre-test, frontend tự gọi `POST /api/roadmaps` với `assessmentId`. Backend chỉ nhận assessment đã chấm của đúng người học, ngôn ngữ `PYTHON`, goal `GOAL_PY_BASICS` và graph `2.1`. Tạo lặp cùng assessment trả lại lộ trình cũ. `/roadmap/:id` hiển thị 26 bài, lý do xếp, tiến độ và đúng một bài đang mở; `POST /api/roadmaps/:id/sync` đối chiếu các bài nộp `PASSED` để mở bài kế tiếp sau khi **toàn bộ** bài tập code của bài hiện tại đã đạt.

Catalog pilot `backend/src/infrastructure/data/pythonBasicsLessonCatalog.pilot.json` chứa 26 bài/9 kỹ năng và khóa chính xác mã bài, tiêu đề, điều kiện tiên quyết, SHA-256 nội dung. Quan hệ tiền đề bài học được kiểm tra bao phủ quan hệ tiền đề của đồ thị kỹ năng; pilot thêm cổng toán tử trước bài chuỗi và cổng chuỗi trước nhánh vòng lặp theo graph `2.1`. Chỉ khóa học đúng tiêu đề và trạng thái `PUBLISHED` được xét; thiếu bài, đổi nội dung, đổi graph hoặc đổi version sẽ dừng tạo/mở mới. Các bài mini practice có nội dung ngắn và các bài ngoài Python Basics chưa được đưa vào pilot. Manifest ghi reviewer là **AI technical review**, không tuyên bố chứng nhận chuyên môn con người hay kiểm định hiệu quả học tập.

Năm bài đã sửa trên DB theo script có checksum bảo vệ `backend/scripts/repair_python_basics_pilot_content.cjs`: `LS-01.01` được đồng bộ lại từ bản nguồn và `LS-04.01`–`LS-04.04` được sửa mã cũ trong frontmatter/tham chiếu sang mã đang phát hành. Script từ chối cập nhật nếu nội dung ban đầu đã khác checksum dự kiến và có thể chạy lại an toàn sau khi seed. Nội dung nguồn seed cũ chưa đổi, vì vậy cần chạy script sau mỗi lần tái seed; nếu không, catalog gate sẽ dừng phục vụ.

Policy thực tế là quy tắc `WEAK_SKILL`: tại các nhánh đã đủ điều kiện, điểm ưu tiên `(1 - masteryScore) × confidence` lấy từ assessment Pre-test đã chấm. Thiếu bằng chứng thì theo thứ tự chương trình. Bài tương lai được xếp một lần khi tạo roadmap; một bài đã được *dự kiến trước* vẫn khóa đến khi điều kiện tiên quyết thực sự hoàn thành. `modelVersion=null`, fallback `NO_COMPLETE_VALIDATED_IN_DOMAIN_SIGNALS`. Đây là thứ tự học theo bằng chứng, chưa có mô hình LearnPython in-domain hoặc thí nghiệm chứng minh giúp học tốt hơn.

`lesson_progress.is_completed` của hệ thống khóa học hiện tại bật ngay khi một bài tập code đạt, nên **không dùng một mình** để mở lộ trình. Pilot yêu cầu mỗi bài trong catalog có bài tập code và mọi bài tập của bài đó đều có submission `PASSED` đúng người học/ngôn ngữ. Đây là bằng chứng hoàn thành bài, chưa phải đo hiệu quả học tập độc lập. Phạm vi Python Basics có một chuỗi bài nền tảng bắt buộc, nên vài bài đầu giống nhau cho người học mới; sau đó nhánh chuỗi/toán tử/điều khiển có thể đổi thứ tự theo kết quả Pre-test.

## Kiểm tra đã chạy

- `node --test tests/roadmapPlanner.test.cjs`: 2/2, dưới 1 giây. Xác nhận ưu tiên kỹ năng yếu, thứ tự tiền đề và lỗi chu trình.
- `npx tsc --noEmit` backend và `npm run build` frontend: đạt.
- `node scripts/verify_python_basics_roadmap.cjs`: `ROADMAP_E2E_PASSED` trên database cấu hình của ứng dụng. Catalog 26 bài, bài chuỗi yếu lên vị trí 8 sau bảy bài nền cần thiết, tạo lặp không nhân đôi roadmap, user khác không xem được, chỉ một bài mở. Một bài tập đạt sớm chưa mở khóa; khi cả hai bài tập `LS-01.01` đều đạt thì mở `LS-01.02`. Hai tài khoản/assessment/roadmap thử nghiệm đã được xóa.
- `node scripts/verify_pretest_to_roadmap.cjs`: `PRETEST_TO_ROADMAP_PASSED`. Một lượt Pre-test 12 câu được chấm thật qua Docker, 9 kỹ năng được lưu, tạo roadmap 26 bài, một bài mở; tài khoản/assessment/roadmap thử đã được xóa.
- Migration `20261006123000_python_basics_roadmap_pilot` đã áp dụng. Prisma báo host database là Supabase `aws-0-ap-northeast-1.pooler.supabase.com`; Docker được dùng cho chấm bài Pre-test, không phải host DB của cấu hình hiện tại.

Checksum manifest: `489763a177ac2e13885527c385e1d4e9610e8e87ccf62c53f0a012968621f5ef`.

## Cách kiểm tra bằng tài khoản

Khởi động lại backend để nạp API mới, rồi mở frontend. Đăng nhập → `/onboarding` → Python → mục tiêu “Nhập môn Python cơ bản” → làm Pre-test → trang kết quả. Trang kết quả tự tạo lộ trình; bấm “Xem lộ trình học”. Sau khi làm đạt tất cả bài tập code của một bài, trở lại lộ trình để xem bài kế tiếp được mở. Nếu catalog đã đổi, trang sẽ báo cần rà soát nội dung thay vì mở bài không còn khớp.

Các mục tiêu/ngôn ngữ khác và bộ mapping đầy đủ 59 bài vẫn ở trạng thái rà soát. G5 về hiệu quả học tập chưa có dữ liệu để kết luận.
