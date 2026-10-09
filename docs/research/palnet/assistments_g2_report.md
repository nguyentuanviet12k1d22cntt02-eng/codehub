# Báo cáo Giai đoạn 2 — Pipeline train và đối chuẩn Knowledge Tracing

**Trạng thái:** `COMPLETED_FINAL_TEST_EVALUATED_ONCE`  
**Protocol:** `palnet-research-protocol/1.0.0`  
**Phạm vi đã chạy:** 5-fold development CV trên 80% learner và đúng một lần final test trên 20% learner giữ riêng.

## 1. Split đã khóa

Pipeline đọc đúng artifact G1 có SHA-256 `d612d7464795bf7fa43c84ed19cb5f8855aadb636added5eb0d9192a2fc6026e`. Seed được khóa là `20261005`.

- Tổng: 3.845 learner, 211.305 event lịch sử, 207.460 event được chấm.
- Development: 3.076 learner.
- Test cuối: 769 learner (20%), đã đánh giá đúng một lần trong run `final-g2-20261005T182731Z`.
- Năm validation fold có lần lượt 33.782, 33.782, 33.781, 33.781 và 33.781 event được chấm; learner không giao nhau giữa train/validation/test.

Danh sách `user_id` được lưu trong `ai-service/data/external/assistments_2009_2010/g2_split_manifest.json`. Train của mỗi fold là toàn bộ learner development trừ learner validation của fold đó.

## 2. Pipeline và hợp đồng chống leakage

- Loader xác minh checksum, schema, event ID duy nhất, thứ tự `order_id → problem_id → event_id`, `sequence_index` liên tục và event đầu không được chấm.
- Đặc trưng của event mục tiêu được chụp **trước** khi cập nhật bằng `correct` của event đó. Không dùng profile Yếu/Trung bình/Giỏi, hint, thời gian, đáp án hoặc attempt hiện tại.
- Global rate, skill rate có Beta smoothing; BKT chọn tham số train-only; DKT-LSTM nhận chuỗi tương tác trước; PAL-Net benchmark dùng history trước event và skill embedding.
- Đồ thị PAL-Net là đồ thị **liên hệ chuyển tiếp kỹ năng**, không phải đồ thị prerequisite. Mỗi fold xây graph chỉ từ learner train, giữ tối đa tám láng giềng liên hệ mỗi skill.
- Ablation bắt buộc gồm `palnet_no_graph` và `palnet_no_history`.
- Mỗi mô hình trong cùng fold phải có cùng digest `event_id,label`; bước tổng hợp dừng nếu bất kỳ cặp nào lệch.
- Command `dev` không có đường chạy test cuối. Command `final` chỉ chạy khi authorization, config lock và mọi checksum khớp, đồng thời từ chối nếu đã tồn tại run record/result.
- Final train dùng toàn bộ 3.076 learner development trong đúng 8 epoch đã khóa. Không tính test loss giữa các epoch; suy luận test chỉ xảy ra một lần sau huấn luyện. Checkpoint nghiên cứu không thay thế model LearnPython đang vận hành.

## 3. Kết quả development dùng để khóa cấu hình

Các số dưới đây là trung bình ± sample standard deviation trên 5 validation fold. Đây là số **development**, không phải test cuối và chưa kèm bootstrap CI của G3. F1 dùng ngưỡng chọn từ prediction OOF validation; Accuracy luôn dùng ngưỡng 0,5.

| Model | AUC | Accuracy | RMSE | F1 | Brier |
| --- | ---: | ---: | ---: | ---: | ---: |
| Global rate | 0,5000 ± 0,0000 | 0,6597 ± 0,0108 | 0,4738 ± 0,0036 | 0,7949 ± 0,0078 | 0,2245 ± 0,0035 |
| Skill rate | 0,6181 ± 0,0059 | 0,6705 ± 0,0076 | 0,4632 ± 0,0028 | 0,7963 ± 0,0068 | 0,2145 ± 0,0026 |
| BKT | 0,6774 ± 0,0069 | 0,7124 ± 0,0048 | 0,4480 ± 0,0020 | 0,8123 ± 0,0060 | 0,2007 ± 0,0018 |
| DKT-LSTM | 0,7443 ± 0,0057 | 0,7269 ± 0,0047 | 0,4303 ± 0,0024 | 0,8161 ± 0,0052 | 0,1852 ± 0,0021 |
| PAL-Net | 0,7352 ± 0,0041 | 0,7267 ± 0,0050 | 0,4313 ± 0,0026 | 0,8184 ± 0,0062 | 0,1860 ± 0,0023 |
| PAL-Net không graph | 0,7457 ± 0,0034 | 0,7309 ± 0,0051 | 0,4279 ± 0,0027 | 0,8197 ± 0,0062 | 0,1831 ± 0,0023 |
| PAL-Net không history | 0,6048 ± 0,0057 | 0,6652 ± 0,0092 | 0,4655 ± 0,0029 | 0,7950 ± 0,0079 | 0,2167 ± 0,0027 |

Development hiện không cho thấy graph liên hệ cải thiện PAL-Net: ablation không graph có AUC cao hơn PAL-Net đầy đủ. Ngược lại, bỏ history làm giảm mạnh AUC. Đây là quan sát development cần được giữ nguyên, không dùng để sửa giao thức sau khi thấy kết quả.

## 4. Kết quả final test đã khóa

Chủ nghiên cứu đã phê duyệt rõ `palnet-research-protocol/1.0.0`. Run `final-g2-20261005T182731Z` bắt đầu lúc `2026-10-05T18:30:41.530251Z` và hoàn tất lúc `2026-10-05T18:33:30.520983Z`, attempt 1. Tất cả mô hình chấm cùng 38.553 event của 769 learner (`13.210` nhãn 0, `25.343` nhãn 1) và có cùng digest event-label `644ff165e92cf61d9b3daeb588cb569e0ba938cbe2e81ec46f83de9a8624402b`.

| Model | AUC | Accuracy | RMSE | F1 | Log loss | Brier | ECE |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Global rate | 0,500000 | 0,657355 | 0,474600 | 0,793258 | 0,642787 | 0,225245 | 0,066674 |
| Skill rate | 0,623511 | 0,673411 | 0,462076 | 0,796610 | 0,616108 | 0,213515 | 0,019064 |
| BKT | 0,690077 | 0,716650 | 0,445621 | 0,813808 | 0,585620 | 0,198578 | 0,048952 |
| DKT-LSTM | 0,757987 | 0,731876 | 0,425449 | 0,819010 | 0,541205 | 0,181007 | 0,010803 |
| PAL-Net | 0,751702 | 0,732291 | 0,426656 | 0,821083 | 0,544304 | 0,182035 | 0,015823 |
| PAL-Net không graph | 0,758764 | 0,735429 | 0,424118 | 0,821278 | 0,538449 | 0,179876 | 0,012313 |
| PAL-Net không history | 0,611159 | 0,670116 | 0,464468 | 0,793258 | 0,621079 | 0,215730 | 0,020121 |

Accuracy dùng ngưỡng 0,5; F1 dùng ngưỡng OOF development đã khóa riêng cho từng model; calibration giữ nguyên identity. Kết quả mô tả tiếp tục cho thấy `palnet_no_graph` cao hơn PAL-Net đầy đủ về AUC (`+0,007062`) và PAL-Net đầy đủ cao hơn `palnet_no_history` (`+0,140543`). Chưa kết luận ý nghĩa thống kê tại G2; paired learner bootstrap, CI 95% và Holm correction thuộc Giai đoạn 3. Không có retune hoặc chạy lại sau khi xem metric test.

## 5. Artifact và khả năng tái lập

- Config khóa trước test: `ai-service/configs/knowledge_tracing/assistments_g2.json`.
- Split: `ai-service/data/external/assistments_2009_2010/g2_split_manifest.json`.
- Summary máy đọc: `ai-service/data/external/assistments_2009_2010/g2_development_summary.json`.
- Config lock: `ai-service/data/external/assistments_2009_2010/g2_selected_config_lock.json`.
- Authorization: `ai-service/data/external/assistments_2009_2010/g2_final_test_authorization.json`.
- Final result máy đọc: `ai-service/data/external/assistments_2009_2010/g2_final_test_result.json`.
- Run record chống chạy lại: `ai-service/data/external/assistments_2009_2010/g2_final_test_run_record.json`.
- Pipeline: `ai-service/scripts/run_kt_benchmark.py`.
- Bộ tổng hợp/kiểm tra ma trận 7×5: `ai-service/scripts/summarize_kt_development.py`.
- Checkpoint, log epoch, graph và prediction theo fold được sinh trong `ai-service/artifacts/knowledge_tracing/assistments_g2/`; thư mục này được Git bỏ qua vì kích thước và có thể tái tạo từ config/split/data checksum.

Các mô hình neural đều có median best epoch là 8 theo CV; ngưỡng F1 của từng model và checksum nguồn được ghi trong config lock. Không áp dụng post-hoc calibration (`identity`). Artifact final gồm 4 checkpoint neural, 4 train log, 7 file prediction và 7 result; SHA-256 của final result là `ba422257641fb41004ae7e25ba0b5cd9db40aeac0bc85c336013c50788f0756f` và khớp run record.

## 6. Cổng chuyển Giai đoạn 3

Giai đoạn 2 đã hoàn tất. Giai đoạn 3 sẽ đọc prediction đã lưu để bootstrap theo learner 2.000 lần, tính CI 95%, paired difference cho ablation, hiệu chỉnh Holm và lập báo cáo tái lập. Không huấn luyện lại hoặc mở lại final test trong bước phân tích này.
