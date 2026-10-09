# Sổ đăng ký mapping bài học — kỹ năng

**Contract đích:** `lesson-skill-mapping/1.0.0`  
**Snapshot rà soát:** `lesson-skill-mapping/0.1.0-review`  
**Ngày kiểm kê:** 2026-10-06

## Quy tắc chuẩn

- Khóa ổn định là `(language, lessonId, graphVersion)`. UUID database không thay thế `lessonId`.
- Mỗi bài có đúng một `primarySkillId`; có thể có nhiều `secondarySkillIds` nhưng tất cả phải thuộc bao đóng goal.
- `prerequisiteLessonIds` và `prerequisiteSkillIds` là hai tập khác nhau. Một secondary skill không tự động chứng minh đã đạt tiền đề.
- Chỉ dòng `mappingStatus=VERIFIED`, bài `PUBLISHED` và nội dung `VALIDATED` mới đủ điều kiện. `REVIEW_REQUIRED_*` và `BLOCKED_*` bị loại an toàn.
- Bất kỳ thay đổi lesson/skill/prerequisite nào cũng tạo mapping version mới và chạy lại kiểm tra toàn vẹn trước khi phục vụ.

## Trạng thái hiện tại

| Language | Graph | Bài trong catalog kiểm kê | Dòng provisional | Xung đột | `VERIFIED` | Sẵn sàng phục vụ |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| PYTHON | 2.1 | 59 | 59 | 9 mapping + 7 prerequisite ref | 0 | Không |
| JAVASCRIPT | 3.0.0 | Chưa có catalog DB định danh language | 0 | Chưa kiểm kê | 0 | Không |
| CPP | 4.0.0 | Chưa có catalog DB định danh language | 0 | Chưa kiểm kê | 0 | Không |
| SQL | 2.0 | Chưa có catalog DB định danh language | 0 | Chưa kiểm kê | 0 | Không |

Chi tiết bản rà soát toàn khóa nằm trong `lesson_skill_mapping.v0.1.csv`. Nguồn title mapping phủ 59/59 bài seed, nhưng chỉ 22 dòng đồng thuận với legacy code mapping; 9 dòng xung đột trực tiếp và 28 dòng chỉ có title mapping. Bản mapping **toàn khóa** chưa có dòng được nâng lên `VERIFIED`.

Pilot riêng `GOAL_PY_BASICS` đã khóa 26 bài/9 kỹ năng trong `backend/src/infrastructure/data/pythonBasicsLessonCatalog.pilot.json`, phiên bản `lesson-skill-mapping/1.0.0-py-basics-pilot`. Bốn xung đột `LS-04.01`–`LS-04.04` về mã cũ trong nội dung đã được sửa theo checksum; các xung đột ngoài pilot vẫn chờ rà soát. Cổng runtime đối chiếu mã bài, title, SHA nội dung, published course và graph trước khi tạo lộ trình. Đây là xác nhận kỹ thuật bởi Codex AI cùng kiểm tra nguồn, không thay cho duyệt giáo trình của con người. Xem [biên bản pilot](python_basics_roadmap_pilot_2026-10-06.md).

### Xung đột bắt buộc xử lý

- `LS-04.01`–`LS-04.04` và `LS-05.01`–`LS-05.05`: mapping theo mã bài thuộc cấu trúc giáo trình cũ, trái với mapping theo title/nội dung hiện tại.
- Tiền đề không tồn tại trong catalog: `LS-02.07`, `LS-03.11`, `LS-04.05`, `LS-04.06`, `LS-04.08`, `LS-04.07`, `LS-05.06`.
- `Course` chưa có trường language, nên không thể chứng minh catalog theo language chỉ bằng DB. Không dùng title pattern làm mapping chuẩn vận hành.

## Quy trình nâng version 1.0.0

1. Chủ nội dung duyệt primary/secondary skill và tiền đề từng bài trên graph đúng phiên bản.
2. Sửa mọi prerequisite ref treo; kiểm tra DAG cho lesson và skill.
3. Bổ sung trạng thái phát hành/QC có bằng chứng, không suy từ việc file tồn tại.
4. Hai người duyệt độc lập hoặc một người duyệt + test nguồn chuẩn; lưu reviewer, reviewedAt và checksum.
5. Đóng băng CSV/JSON, checksum và đổi toàn bộ dòng hợp lệ thành `VERIFIED`; cập nhật contract mappingVersion atomically.

