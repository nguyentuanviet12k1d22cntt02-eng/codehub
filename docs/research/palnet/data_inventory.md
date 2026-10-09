# Biên bản kiểm kê dữ liệu PAL-Net G0

**Ngày snapshot:** 2026-10-06 (Asia/Bangkok)  
**Schema:** `palnet-data-inventory/1.0.0`  
**Trạng thái:** `IN_PROGRESS` — đã kiểm kê repository và chụp snapshot database read-only; dữ liệu chưa được coi là dataset KT hợp lệ.

## 1. Nguồn dữ liệu hiện có

| Nguồn | Loại | Người học | Event có nhãn | Skill/item | Kết luận |
| --- | --- | ---: | ---: | ---: | --- |
| `ai-service/data/mock_user_history.csv` | Synthetic/seed | 120 | 11.823 (9.905 attempt #1) | 6 legacy KC, 83 item | Chỉ smoke test kỹ thuật; cấm dùng làm bằng chứng thực nghiệm hoặc cộng ngưỡng triển khai. |
| `submissions` | LearnPython thật, coding exercise | 7 Python / 2 C++ / 1 JavaScript | 804 `PASSED/FAILED`; 479 first item-attempt | Nối tới lesson; mapping skill chưa verified | Chưa KT-ready; thiếu mapping version và cohort đủ lớn. |
| `practice_submissions` | LearnPython thật, practice | 0 | 0 | Problem/tag chưa phải skill chuẩn | Chưa có dữ liệu. |
| `pretest_answers` + assessment hợp lệ | LearnPython thật, pre-test | 0 | 0 | Có `primarySkillId` + graphVersion khi phát sinh | Chưa có dữ liệu. |
| `lesson_progress` | Trạng thái tổng hợp | Không dùng để đếm KT | Không phải nhãn câu trả lời | Lesson | Không biến completion thành nhiều event đúng. |
| ASSISTments corrected | Dữ liệu toán bên ngoài | 3.845 trong tập chính | 211.305 event lịch sử; 207.460 event được chấm | 101 skill / 13.108 problem | G1 đã chuẩn hóa; chỉ dùng benchmark G1–G3, không deploy cho LearnPython. |

Synthetic hiện có chuỗi 83–170 event/người học, median 96; các profile `STRUGGLING/AVERAGE/EXCELLENT` do simulator gán sẵn nên bị loại khỏi đặc trưng benchmark.

### Snapshot coding submission

`first_attempt_labeled_events` là lần `PASSED/FAILED` đầu tiên của mỗi cặp `(user_id, exercise_id)`, sắp theo `submitted_at, id`. Đây là định nghĩa kiểm kê; G1/G2 phải xác nhận lại event policy trước khi train.

| Language | Learners | Labeled events | First item-attempt | Covered lessons | Sequence min / median / p90 / max |
| --- | ---: | ---: | ---: | ---: | --- |
| PYTHON | 7 | 759 | 460 | 59 | 1 / 31 / 156,4 / 322 |
| CPP | 2 | 35 | 15 | 13 | 1 / 7,5 / 12,7 / 14 |
| JAVASCRIPT | 1 | 10 | 4 | 5 | 4 / 4 / 4 / 4 |
| SQL | 0 | 0 | 0 | 0 | N/A |

Database có tổng cộng 6 course `PUBLISHED`, 181 lesson và 722 coding exercise. Không phân bổ các con số catalog này theo language vì `Course.language` chưa tồn tại. Snapshot máy đọc được lưu tại `data_inventory.snapshot.2026-10-06.json`.

## 2. Graph và catalog tĩnh

| Language | Graph version | Skills | Catalog/mapping quan sát |
| --- | ---: | ---: | --- |
| PYTHON | 2.1 | 35 | Seed có 59 bài; 59 title mapping provisional, 0 verified. |
| JAVASCRIPT | 3.0.0 | 23 | Có nội dung file, chưa có catalog DB định danh language và mapping verified. |
| CPP | 4.0.0 | 21 | Có nội dung file, chưa có catalog DB định danh language và mapping verified. |
| SQL | 2.0 | 7 | Có graph; chưa có catalog/mapping verified. |

Khoảng trống schema: `Course` không có language; `Lesson` không có quan hệ versioned tới skill; trạng thái content validation chưa tồn tại trên lesson. Vì thế không được suy luận “bài có file/ở DB” là nội dung đã kiểm định.

## 3. Quy tắc đếm snapshot database

- Chỉ đếm nhãn coding/practice khi status là `PASSED` hoặc `FAILED`; `PENDING` không phải nhãn.
- Snapshot báo riêng từng nguồn và language, không gộp completion với attempt.
- Pre-test chỉ đếm answer đã trả lời, `isCorrect` khác null và attempt có `PretestAssessment` hợp lệ.
- Mỗi nguồn báo `learners`, `labeled_events`, item/lesson/skill coverage. Không xuất email, username, code hoặc nội dung đáp án.
- Script `backend/scripts/audit_palnet_g0_inventory.ts` chỉ chạy truy vấn tổng hợp `SELECT`; output không chứa DSN hoặc định danh người học.

## 4. Cổng đủ dữ liệu

Áp dụng ngưỡng đã khóa trong `protocol.md` riêng từng language: 500 learners, 10.000 first-attempt labeled events, median sequence ≥20, mapping coverage ≥80% lesson và ≥90% event, mỗi skill ≥200 event/50 learners/cả hai lớp, cùng ít nhất 30 ngày logging ổn định.

Theo snapshot repository hiện tại, cả bốn language đều `NOT_READY_FOR_MODEL_SELECTION` vì mapping verified bằng 0 và chưa có inventory first-attempt theo language. Fallback deterministic phải tiếp tục được dùng; trọng số random hoặc checkpoint ASSISTments không được báo là mô hình vận hành đã train.

