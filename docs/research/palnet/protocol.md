# Giao thức nghiên cứu PAL-Net

**Trạng thái:** `FROZEN_BEFORE_FINAL_TEST`  
**Phiên bản:** `palnet-research-protocol/1.0.0`  
**Ngày khóa:** 2026-10-06  
**Phạm vi:** benchmark Knowledge Tracing (KT) và đánh giá chính sách chọn bài học là hai nghiên cứu tách biệt.

Mọi thay đổi sau khi xem kết quả test phải tạo phiên bản giao thức mới, ghi lý do và coi phân tích mới là hậu kiểm. Không sửa số liệu hoặc tiêu chí trong tài liệu này để phù hợp với kết quả.

## 1. Câu hỏi nghiên cứu đã khóa

| Mã | Câu hỏi | Đơn vị phân tích | Kết luận được phép |
| --- | --- | --- | --- |
| RQ1 | PAL-Net dự đoán xác suất đúng của lượt đầu tiên kế tiếp tốt đến đâu so với baseline? | Một sự kiện có nhãn của một người học; split theo người học. | Chất lượng dự đoán KT trên đúng dataset đã đánh giá. |
| RQ2 | Đồ thị và đặc trưng lịch sử đóng góp bao nhiêu? | Cặp dự đoán trên cùng event, fold và seed. | Chênh lệch dự đoán giữa PAL-Net đầy đủ và ablation. |
| RQ3 | Chính sách chọn bài học có cải thiện việc học trên LearnPython không? | Người học được gán chính sách; phân tích intention-to-treat. | Tác động chính sách chỉ khi có thử nghiệm LearnPython hợp lệ. |

AUC/Accuracy của RQ1–RQ2 không phải bằng chứng cho RQ3. Checkpoint ASSISTments không được phục vụ bài học lập trình.

## 2. RQ1–RQ2: nhãn, thời điểm và tập phân tích

- Nhãn chính là `correct ∈ {0,1}` của **lần thử đầu tiên** cho event mục tiêu. Dự đoán là `P(correct_t = 1 | history trước t, skill/item t)` và phải được tính trước khi cập nhật trạng thái bằng nhãn của event t.
- Đơn vị split là `user_id`. Giữ riêng 20% người học làm test cuối; 80% còn lại dùng 5-fold `GroupKFold(user_id)`. Một event và một người học chỉ thuộc một split.
- Sắp thứ tự bằng thứ tự gốc của nguồn; nếu trùng `order_id`, dùng khóa phụ ổn định `problem_id`, rồi event ID sinh từ dữ liệu nguồn. Quy tắc này được lưu trong manifest G1.
- Tập chính ASSISTments dùng bản corrected, chỉ hàng `original = 1`, có đúng một `skill_id`, nhãn nhị phân và khóa người học/bài/thứ tự hợp lệ. Hàng scaffolding, nhiều skill, thiếu skill, trùng student-problem, nhãn ngoài 0/1 và event đầu tiên không có lịch sử đều bị loại khỏi tập chấm chính.
- Không dùng `correct`, số lần thử, hint, thời gian phản hồi hoặc trường được tạo sau câu trả lời của chính event t làm đặc trưng. Các trường lịch sử chỉ được tính từ event `< t`.
- Người học phải còn ít nhất hai event hợp lệ sau lọc; event thứ nhất chỉ khởi tạo lịch sử và không được chấm. Thực nghiệm mở rộng multi-skill dùng một event với tập nhãn, không nhân bản đáp án.

## 3. Baseline, chỉ số và khoảng tin cậy

Baseline bắt buộc: tỷ lệ đúng toàn cục, tỷ lệ đúng theo skill với smoothing học từ train, BKT học tham số từ train, DKT-LSTM và PAL-Net. Ablation tối thiểu: PAL-Net không graph và PAL-Net không đặc trưng lịch sử tổng hợp. Mọi mô hình dùng cùng split, event chấm và ngân sách tìm siêu tham số được công bố.

- Chỉ số chính RQ1: AUC-ROC trên test giữ riêng.
- Chỉ số phụ: Accuracy tại ngưỡng 0,5; F1 tại ngưỡng chọn trên validation; RMSE; log loss; Brier; ECE với 10 bin đồng số lượng; độ trễ suy luận.
- Nếu test chỉ có một lớp, AUC là `NA`; không thay bằng số khác rồi gọi là AUC.
- Khoảng tin cậy 95%: 2.000 bootstrap **theo người học**, lấy percentile 2,5% và 97,5%, seed `20261005`. Một bootstrap lấy toàn bộ event của người học được chọn.
- So sánh RQ2 dùng chênh lệch cặp trên cùng người học/split và bootstrap theo người học. Khi kiểm định nhiều ablation, hiệu chỉnh Holm; vẫn báo effect size và CI.
- Epoch, ngưỡng F1 và calibration chỉ chọn trên validation. Test cuối được chạy một lần cho cấu hình đã khóa; mọi lần chạy lại phải có run ID và lý do.

## 4. RQ3: outcome và thiết kế

- Đơn vị ngẫu nhiên hóa: người học, phân tầng theo language, mục tiêu và mức đầu vào.
- Đối chứng: lộ trình/quy tắc đang vận hành. Can thiệp: đúng một `policyVersion` đã khóa.
- Outcome chính: chênh lệch điểm pre/post trên bộ câu độc lập, chưa dùng để train/rank và đo cùng skill mục tiêu; báo effect size cùng CI 95% theo người học.
- Outcome phụ: retention ở ngày 30 (cửa sổ ±3 ngày), tỷ lệ hoàn thành, thời gian học và tỷ lệ fallback. Không dùng completion đơn lẻ để thay outcome chính.
- Phân tích chính là intention-to-treat. Shadow mode chỉ kiểm tra an toàn/độ trễ, không ước lượng tác động học tập.
- Cỡ mẫu/power phải được khóa ở phiên bản bổ sung trước khi tuyển người học; khi chưa có power analysis và bài post-test độc lập, trạng thái là `INSUFFICIENT_EVIDENCE`.

## 5. Ngưỡng đủ dữ liệu LearnPython trước khi chọn mô hình triển khai

Đánh giá riêng cho từng language; synthetic/seed không được cộng vào ngưỡng:

1. Ít nhất 500 người học có event hợp lệ và 10.000 event lần thử đầu có nhãn.
2. Median chuỗi hợp lệ ít nhất 20 event/người học.
3. Ít nhất 80% bài PUBLISHED có mapping `VERIFIED`; ít nhất 90% event có thể nối tới skill `VERIFIED` của đúng graphVersion.
4. Mỗi skill được mô hình phục vụ có ít nhất 200 event, 50 người học và xuất hiện cả hai lớp nhãn.
5. Có ít nhất 30 ngày dữ liệu sau khi schema/version logging ổn định.

Không đạt một điều kiện thì language đó dùng fallback có tên rõ; không train hoặc phục vụ checkpoint ngẫu nhiên như mô hình đã sẵn sàng.

## 6. Hợp đồng sản phẩm đã khóa

- Đơn vị quyết định là một `lessonId`, không phải exercise.
- `palnet-lesson-policy/1.0.0` chọn thứ tự khi **tạo roadmap**. Sau khi tạo, thứ tự không đổi; hoàn thành mục hiện tại chỉ mở đúng mục kế tiếp. Muốn tái xếp phần chưa học phải tạo contract/policyVersion mới.
- Candidate trước khi chấm điểm phải qua bộ lọc trong `ai-service/app/recommendation/lesson_eligibility.py` và hợp đồng máy đọc `product_contract.v1.json`.
- Output bắt buộc: `lessonId`, `targetSkillIds`, `reasonCodes`, `evidenceSources`, `confidence`, `modelVersion`, `policyVersion`, `graphVersion`, `mappingVersion`.
- `P(correct)` phải mang tên `predictedCorrectness`; không được gọi là `predictedMastery` nếu chưa có định nghĩa/hiệu chuẩn mastery riêng.

## 7. Điều kiện mở khóa test cuối

- G1 tạo manifest checksum, báo cáo lọc và kiểm tra không nhìn trước.
- G2 lưu split user-level dùng chung cho mọi model.
- Chủ nghiên cứu ký xác nhận protocol/version trước lần đầu chạy test giữ riêng.
- Mọi deviation được ghi trước khi xem metric tương ứng.

