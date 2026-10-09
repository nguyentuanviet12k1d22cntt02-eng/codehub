# Báo cáo chuẩn hóa ASSISTments 2009–2010 Skill Builder

**Trạng thái:** `COMPLETED`  
**Ngày lấy dữ liệu:** 2026-10-06 (Asia/Bangkok)  
**Policy:** `assistments-2009-2010-normalization/1.0.0`  
**Nguồn chính thức:** [ASSISTments Skill Builder 2009–2010 corrected](https://sites.google.com/site/assistmentsdata/home/2009-2010-assistment-data/skill-builder-data-2009-2010)

## 1. Nguồn và khả năng tái lập

File chính thức được dùng là `skill_builder_data_corrected_collapsed.csv`, dung lượng 64.412.812 byte, encoding `cp1252`, SHA-256:

```text
162ef8d2d28bcbfea6591a282994062bd8d5eaa00636544292a0d268dca6e5da
```

Trang chính thức nói bản corrected có một dòng cho mỗi student–problem và gộp nhiều skill thành chuỗi trên cùng dòng. Trang cũng yêu cầu công bố đúng URL dataset và trích dẫn bài ASSISTments được liệt kê tại đó. Không thấy license tường minh trên trang vào ngày lấy; vì vậy repository không commit hoặc phân phối lại file raw hay các hàng event đã chuẩn hóa. Trước khi phát hành dữ liệu ra ngoài nhóm nghiên cứu phải xác nhận lại quyền sử dụng/phân phối.

Metadata máy đọc được nằm tại `ai-service/data/external/assistments_2009_2010/data_manifest.json`. Chạy lại chuyển đổi bằng:

```powershell
python ai-service\scripts\normalize_assistments_2009_2010.py `
  --retrieved-at 2026-10-06 `
  --expected-sha256 162ef8d2d28bcbfea6591a282994062bd8d5eaa00636544292a0d268dca6e5da
```

## 2. Quy tắc chuẩn hóa đã khóa

- Kiểm tra checksum trước khi đọc; thiếu/sai cột bắt buộc làm pipeline dừng.
- Chỉ nhận ID số nguyên không âm, `correct ∈ {0,1}`, `original = 1` và skill ID số hợp lệ.
- Tập chính chỉ nhận đúng một skill. Tập mở rộng giữ danh sách skill dưới dạng JSON array trong một dòng event; không nhân bản một đáp án thành nhiều event.
- Duplicate được định nghĩa bởi `(user_id, problem_id)`; giữ dòng sớm nhất theo `order_id → problem_id → event_id`.
- Trong từng learner, thứ tự cố định là `order_id → problem_id → event_id`. `sequence_index` bắt đầu từ 0 và tăng nghiêm ngặt kể cả khi `order_id` trùng.
- Loại learner còn dưới hai event hợp lệ. Event đầu của learner còn lại được giữ để khởi tạo lịch sử nhưng có `is_scored_event = 0`; chỉ event sau đó được chấm.
- `correct` là nhãn. Feature cho event hiện tại không chứa `correct`, attempt count, hint, thời gian phản hồi, answer ID/text, first action, bottom hint hay opportunity của chính event đó.

## 3. Báo cáo lọc tập chính

Các bước đầu trong bảng là loại trừ tuần tự và không chồng lặp.

| Bước | Số dòng |
| --- | ---: |
| Nguồn ban đầu | 346.860 |
| ID không hợp lệ | 0 |
| Nhãn `correct` không nhị phân | 0 |
| Loại do `original != 1` hoặc `original` sai | 71.402 |
| Loại do skill thiếu/sai | 16.059 |
| Loại khỏi tập chính do nhiều skill | 44.974 |
| Ứng viên một skill | 214.425 |
| Duplicate student–problem bị loại | 2.962 |
| Event của learner chuỗi ngắn bị loại | 158 |
| **Event lịch sử tập chính** | **211.305** |
| Event đầu chỉ dùng khởi tạo | 3.845 |
| **Event được chấm** | **207.460** |

Tập chính có 3.845 learner, 101 skill và 13.108 problem. Độ dài chuỗi min/median/p90 nearest-rank/max là `2 / 19 / 138 / 707`. Trong các event được chấm có 70.683 nhãn 0 và 136.777 nhãn 1.

Không có nhóm trùng `order_id` trong tập chính thực tế, nhưng tie-break `problem_id → event_id` vẫn được khóa và có test fixture riêng.

## 4. Tập mở rộng multi-skill

Tập mở rộng có 255.394 event lịch sử của 4.022 learner, trong đó 251.372 event được chấm. Có 44.052 event thực sự chứa nhiều skill sau dedup/lọc chuỗi; mỗi event vẫn chỉ xuất hiện một lần. Tập này phủ 123 skill và có độ dài chuỗi min/median/p90 nearest-rank/max là `2 / 20 / 153 / 913`.

Artefact cục bộ bị Git bỏ qua:

- `processed/main_events.csv.gz`: SHA-256 `d612d7464795bf7fa43c84ed19cb5f8855aadb636added5eb0d9192a2fc6026e`.
- `processed/multiskill_events.csv.gz`: SHA-256 `38a7e57a9b731b6d7a0583c1f0c16b9a405abf5cbec393b851ec0e5c72aeb692`.

## 5. Cổng nghiệm thu

`ai-service/tests/test_assistments_normalization.py` kiểm tra cô lập:

1. một student–problem hợp lệ chỉ tạo một event ID;
2. nhãn đầu ra luôn là 0/1, chuỗi và tie-break xác định;
3. event đầu không được chấm nhưng vẫn khởi tạo lịch sử;
4. multi-skill được mã hóa trên một dòng, không nhân bản;
5. output gzip byte-deterministic với cùng input;
6. feature contract không chứa đáp án hoặc trường sau đáp án của event hiện tại.

Pipeline toàn bộ cũng kiểm tra thứ tự tăng nghiêm ngặt trong lúc ghi và dừng nếu checksum nguồn không khớp. Những artefact này chỉ mở đường cho benchmark KT G2; chúng không phải bằng chứng rằng PAL-Net cải thiện việc học và không được dùng làm checkpoint vận hành cho Python/JavaScript/C++/SQL.
