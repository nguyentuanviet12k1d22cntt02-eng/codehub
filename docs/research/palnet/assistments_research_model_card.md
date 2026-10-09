# Model card — PAL-Net ASSISTments, chỉ dùng nghiên cứu

**Trạng thái:** `RESEARCH_ONLY / NOT_APPROVED_FOR_LEARNPYTHON_SERVING`  
**Run:** `final-g2-20261005T182731Z`  
**Protocol:** `palnet-research-protocol/1.0.0`  
**Nguồn dữ liệu:** ASSISTments 2009–2010 Skill Builder corrected, bài làm toán; xem [G1](assistments_g1_report.md) và manifest/checksum trong `ai-service/data/external/assistments_2009_2010/`.

## Mục đích và phạm vi

PAL-Net ước lượng xác suất đúng ở lần thử kế tiếp từ lịch sử trước event và kỹ năng mục tiêu. Đây **không phải** mô hình đo lợi ích học tập của một bài học, và `P(correct)` không phải mastery. Dữ liệu toán không khớp miền Python/JavaScript/C++/SQL. Không đăng ký checkpoint này trong `ai-service/models/serving/registry.json` và không dùng nó chọn bài LearnPython.

## Đánh giá đã chạy

Split theo người học: 20% holdout; 5-fold GroupKFold trên phần phát triển. Final test được chạy một lần, 769 người học và 38.553 event được chấm. AUC PAL-Net = **0,7517** (bootstrap 95% theo người học: **0,7386–0,7646**); DKT-LSTM = **0,7580**, PAL-Net bỏ graph = **0,7588**. Chênh PAL-Net − DKT = **−0,0063** (CI −0,0100 đến −0,0025). Không có bằng chứng PAL-Net đầy đủ vượt DKT hay chứng minh graph hữu ích trên tập này. Các chỉ số khác, calibration, latency và checksum nằm trong [báo cáo G3](assistments_g3_report.md); không chép các con số vào đây như phép đo sản phẩm.

## Rủi ro và cổng triển khai

- Đồ thị benchmark là quan hệ thống kê từ train, không phải tiền đề sư phạm được duyệt.
- CI test không bao gồm biến thiên do train seed, dataset khác hoặc chuyển miền.
- Không có checkpoint LearnPython được kiểm định; registry vận hành hiện rỗng. Loader phải fail closed và dùng fallback có tên khi thiếu/sai domain, graph, mapping hoặc checksum.
- Một model card vận hành theo từng ngôn ngữ chỉ được lập sau khi đạt ngưỡng dữ liệu in-domain trong [protocol](protocol.md), đánh giá độc lập và review phát hành. Không điền số liệu thiếu bằng synthetic hay ASSISTments.
