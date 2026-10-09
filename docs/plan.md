# Kế hoạch phát triển lại PAL-Net và đánh giá gợi ý bài học

**Trạng thái:** G1–G3 benchmark đã báo cáo; G4 đang triển khai nhưng chưa kích hoạt cho người học; G5 chưa thể chạy, G6 mới có tài liệu chuẩn bị.  
**Mục tiêu sản phẩm:** Dựa trên bằng chứng học tập hiện có để chọn **bài học tiếp theo** phù hợp với mục tiêu, năng lực và điều kiện tiên quyết của người học.  
**Mục tiêu nghiên cứu:** Đánh giá riêng (1) chất lượng dự đoán câu trả lời tiếp theo và (2) tác động của chính sách chọn bài học lên kết quả học tập. Không dùng chỉ số của bài toán (1) để khẳng định đã chứng minh bài toán (2).

Các giai đoạn **G0–G6 trong tài liệu này chỉ dành cho PAL-Net và thực nghiệm của nó**; chúng không thay thế cách đánh số giai đoạn của kế hoạch Pre-test/roadmap hiện hành.

## 1. Điểm xuất phát và ranh giới với kế hoạch hiện có

- `ai-service/scripts/train_palnet.py` hiện đọc `data/mock_user_history.csv`, chia ngẫu nhiên theo lượt tương tác và chỉ báo loss/accuracy. Bộ sinh dữ liệu dùng tham số BKT cho ba nhóm học viên; đây là dữ liệu mô phỏng, không phải bằng chứng thực nghiệm trên người học thật.
- `ai-service/app/knowledge_tracing/palnet.py` trả xác suất làm đúng theo kỹ năng. `ai-service/main.py` dùng khoảng cách đến `0.775` để xếp **bài tập**; chưa trực tiếp tối ưu hay đánh giá quyết định **chọn bài học**. `predicted_mastery` trong API hiện mang giá trị xác suất làm đúng, cần đổi tên hoặc định nghĩa lại để tránh đánh đồng hai khái niệm.
- Loader trong `ai-service/main.py` ưu tiên `models/palnet_model.pth` và có nhánh dùng mô hình khởi tạo ngẫu nhiên khi checkpoint thiếu/không khớp. Không được báo mô hình “đã train” trong trường hợp đó.
- [Kế hoạch roadmap hiện hành](ke_hoach.md) và [đặc tả Giai đoạn 0](dac_ta_giai_doan_0.md) áp dụng cho Python, JavaScript, C++ và SQL; mỗi roadmap chỉ có tối đa một mục chưa hoàn thành được mở. PAL-Net sẽ là thành phần hỗ trợ chọn/xếp mục hợp lệ, không tự bỏ qua điều kiện tiên quyết, bằng chứng hoàn thành hoặc thay đổi thứ tự các mục đã khóa mà không có phiên bản hợp đồng mới.
- Benchmark ASSISTments là dữ liệu **toán**. Checkpoint huấn luyện trên đó phục vụ nghiên cứu khả năng Knowledge Tracing; không đưa trực tiếp vào dịch vụ gợi ý bài học lập trình. Mỗi ngôn ngữ cần dữ liệu, đồ thị kỹ năng và kiểm định riêng trước khi bật mô hình tương ứng.

## 2. Câu hỏi nghiên cứu và định nghĩa đầu ra

| Mã | Câu hỏi | Đầu ra và thước đo chính |
| --- | --- | --- |
| RQ1 | PAL-Net dự đoán kết quả lượt trả lời tiếp theo tốt đến đâu so với BKT, DKT và baseline đơn giản? | Xác suất `P(correct at t | history before t, target skill/item)`; **AUC-ROC** chính, kèm Accuracy, RMSE, F1, log loss/Brier và calibration. |
| RQ2 | Thành phần đồ thị và đặc trưng lịch sử đóng góp bao nhiêu? | So sánh PAL-Net đầy đủ với các ablation dùng cùng fold và cùng ngân sách huấn luyện. |
| RQ3 | Chính sách dùng trạng thái người học để chọn bài có cải thiện việc học so với lộ trình/quy tắc hiện tại không? | Kết quả đánh giá độc lập sau học, duy trì kiến thức, hoàn thành và thời gian học; đánh giá trên LearnPython, không suy ra từ AUC. |

**Đơn vị quyết định trong sản phẩm:** một `lessonId` thuộc đúng ngôn ngữ và mục tiêu học. Bài tập là bằng chứng đánh giá hoặc nội dung trong bài, không thay thế định nghĩa “bài học tiếp theo”. Đầu ra cần gồm `lessonId`, kỹ năng mục tiêu, lý do chọn, nguồn bằng chứng, độ tin cậy, `modelVersion`, `policyVersion` và `graphVersion`.

## 3. Lộ trình thực hiện theo giai đoạn

### Giai đoạn 0 — Khóa giao thức nghiên cứu và hợp đồng sản phẩm

**Việc làm**

- [x] Chốt RQ1–RQ3, nhãn, đơn vị phân tích, tập loại trừ, baseline, chỉ số chính/phụ và cách tính khoảng tin cậy **trước khi xem kết quả test**. Xem `research/palnet/protocol.md`.
- [x] Chốt thời điểm chọn bài: policy v1 chọn khi tạo chỉ mục roadmap, không xếp lại phần chưa học; giữ quy tắc chỉ một mục đang mở. Xem `research/palnet/product_contract.v1.json`.
- [ ] Hoàn tất mapping `lessonId ↔ skillId` toàn khóa/bốn ngôn ngữ. Đã có manifest pilot Python Basics 26 bài/9 kỹ năng khóa theo SHA và sửa 4 xung đột mã bài chuỗi; phần còn lại của 59 dòng Python, các prerequisite ref treo và các ngôn ngữ khác vẫn chờ rà soát.
- [x] Kiểm kê dữ liệu thật theo ngôn ngữ: số học viên, số sự kiện có nhãn, kỹ năng, độ dài chuỗi, độ phủ bài học và nguồn dữ liệu mô phỏng/seed; đặt ngưỡng đủ dữ liệu trước khi chọn mô hình triển khai. Xem `research/palnet/data_inventory.md`.

**Trạng thái triển khai 06/10/2026:** `IN_PROGRESS_MAPPING_REVIEW`. Bộ lọc eligibility và kiểm tra bất biến đã có tại `ai-service/app/recommendation/lesson_eligibility.py` và `ai-service/tests/test_lesson_eligibility_contract.py`; mapping chưa đủ để phục vụ model. Theo ủy quyền của chủ dự án, G1 benchmark toán độc lập được thực hiện song song và không thay thế cổng duyệt mapping này.

**Đầu ra:** `protocol.md`, bảng mapping/version và biên bản kiểm kê dữ liệu.  
**Cổng nghiệm thu:** từ trạng thái và tập bài cho trước, người triển khai độc lập xác định được bài nào được xét và nhãn nào được dự đoán. Kiểm tra nhỏ: `assert eligible_lessons` không chứa bài sai ngôn ngữ, chưa đủ tiền đề hoặc đã hoàn thành.

### Giai đoạn 1 — Chuẩn hóa ASSISTments 2009–2010 Skill Builder

**Việc làm**

- [x] Tải **bản đã sửa trùng bản ghi** từ [trang Skill Builder chính thức](https://sites.google.com/site/assistmentsdata/home/2009-2010-assistment-data/skill-builder-data-2009-2010); lưu URL nguồn, ngày lấy, tên file, checksum và điều kiện sử dụng. File raw và event chuẩn hóa được Git bỏ qua; metadata nằm trong `ai-service/data/external/assistments_2009_2010/data_manifest.json`.
- [x] Đọc schema thực tế; chuẩn hóa `user_id`, `order_id`, `problem_id`, `skill_id`, `correct`. Xếp tương tác theo học viên bằng khóa `order_id → problem_id → event_id`; `correct` là nhãn, không thuộc feature của event hiện tại.
- [x] Bản đã sửa gộp nhiều kỹ năng của một tương tác vào một dòng. Tập chính chỉ giữ dòng **một kỹ năng**; tập mở rộng lưu `skill_ids` dưới dạng JSON array trên đúng một event, không nhân bản đáp án.
- [x] Chốt chính sách: chỉ `original = 1`, loại skill thiếu/sai, learner còn dưới hai event, duplicate student–problem; không đưa `attempt_count`, hint, thời gian/đáp án hoặc `correct` hiện tại vào feature.

**Trạng thái triển khai 06/10/2026:** `COMPLETED`. Script tái chạy được tại `ai-service/scripts/normalize_assistments_2009_2010.py`; số liệu và giới hạn sử dụng tại `research/palnet/assistments_g1_report.md`. G1 là benchmark toán độc lập, không mở khóa checkpoint vận hành cho LearnPython và không thay đổi trạng thái mapping G0.

**Đầu ra:** script chuyển đổi tái chạy được, dữ liệu chuẩn hóa, `data_manifest.json` và báo cáo số dòng trước/sau từng bước.  
**Cổng nghiệm thu:** một tương tác hợp lệ chỉ có một event ID trong tập chính; mọi hàng có nhãn 0/1; thứ tự trong từng học viên tăng dần; kiểm tra nhỏ `assert no_current_answer_in_features`.

### Giai đoạn 2 — Xây pipeline train và đối chuẩn Knowledge Tracing

**Việc làm**

- [x] Tách bộ đọc dữ liệu, sinh đặc trưng quá khứ, mô hình, train, đánh giá và xuất artifact. Bỏ đường dẫn dữ liệu giả lập hard-code trong luồng benchmark; đặt seed và lưu cấu hình chạy.
- [x] Dành riêng **20% học viên** làm test cuối cùng; trên 80% còn lại dùng **5-fold GroupKFold theo `user_id`** để chọn cấu hình. Không chia ngẫu nhiên từng lượt làm bài. Lưu danh sách ID từng split để mọi mô hình dùng chung.
- [x] Xây baseline: tỷ lệ đúng toàn cục/kỹ năng, BKT với tham số học từ train, DKT-LSTM, PAL-Net. Cùng tập event được chấm, cùng thông tin sẵn có tại thời điểm dự đoán và ngân sách điều chỉnh siêu tham số được công bố.
- [x] Bỏ nhãn nhóm Yếu/Trung bình/Giỏi do simulator cấp sẵn. Nếu tạo profile từ lịch sử, chỉ dùng lịch sử trước thời điểm dự đoán và kiểm tra công bằng đầu vào giữa baseline.
- [x] Với ASSISTments, xây đồ thị từ metadata chuyên môn hoặc quan hệ thống kê **chỉ từ train**; nếu dùng đồng xuất hiện, gọi là đồ thị liên hệ chứ không khẳng định quan hệ tiên quyết. Thêm ablation không đồ thị để đo đóng góp của GCN.
- [x] Dự đoán tuần tự: tính xác suất trước khi cập nhật trạng thái bằng nhãn lượt hiện tại. Chỉ dùng validation để chọn epoch, ngưỡng F1 và hiệu chuẩn xác suất; test được chạy một lần sau khi chốt cấu hình. **Final test đã chạy đúng một lần trong run `final-g2-20261005T182731Z`, không retune.**

**Trạng thái triển khai 06/10/2026:** `COMPLETED_FINAL_TEST_EVALUATED_ONCE`. Đã hoàn tất ma trận 7 mô hình × 5 fold development và run final duy nhất trên 769 learner/38.553 event. Authorization, run record, result, checkpoint/config/log và kiểm tra event-label dùng chung được lưu đầy đủ. Xem `research/palnet/assistments_g2_report.md`; phân tích CI/bootstrap chuyển sang Giai đoạn 3.

**Đầu ra:** checkpoint và config của từng mô hình/fold, split manifest, log train, script chạy benchmark.  
**Cổng nghiệm thu:** tập học viên train/validation/test không giao nhau; cùng một event nhận cùng nhãn ở mọi mô hình; không có tính toán đặc trưng nhìn trước. Kiểm tra cô lập dưới 5 giây cho từng bất biến; quá trình huấn luyện đầy đủ được ghi là **thực nghiệm**, không phải test runner nhanh.

### Giai đoạn 3 — Phân tích, tái lập và báo cáo benchmark

**Việc làm**

- [x] Báo AUC-ROC, Accuracy, RMSE, F1, log loss/Brier, calibration và độ trễ suy luận. F1 dùng ngưỡng chọn trên validation; nêu tỷ lệ lớp đúng và baseline đa số để diễn giải Accuracy.
- [x] Báo trung bình ± độ lệch chuẩn của 5 fold phát triển; báo test giữ riêng với khoảng tin cậy bootstrap **theo học viên**, không bootstrap ngẫu nhiên theo lượt. Phân tích người học ít/nhiều lịch sử, kỹ năng và nhóm lỗi.
- [x] Đo suy luận trên cùng cấu hình máy và thiết bị, ghi batch size, warm-up, số lần lặp; nếu dùng GPU thì đồng bộ trước/sau phép đo. Tách thời gian mô hình khỏi thời gian lấy/chuẩn bị dữ liệu.
- [x] Báo ablation và chênh lệch cặp giữa mô hình trên cùng học viên/split; nêu cả trường hợp PAL-Net không vượt baseline. Lưu seed, thư viện, mã nguồn, dữ liệu/checksum và checkpoint ứng với từng bảng.

**Trạng thái G3 06/10/2026:** Đã phân tích prediction của run final `final-g2-20261005T182731Z` bằng 2.000 bootstrap learner, CI percentile 95%, paired AUC và Holm cho hai ablation. Báo cáo và biểu đồ tái tạo bằng script tại `research/palnet/assistments_g3_report.md`; kết quả máy đọc tại `ai-service/data/external/assistments_2009_2010/g3_final_analysis.json`, phép đo độ trễ riêng tại `g3_latency.json`. Không train hoặc chọn lại cấu hình.

**Đầu ra:** bảng kết quả tái tạo bằng script, biểu đồ ROC/calibration, phân tích lỗi và phần giới hạn nghiên cứu.  
**Cổng nghiệm thu:** không có ô kết quả ước lượng hoặc nhập tay; mỗi con số truy ngược được tới run ID, split, config và checkpoint. Không dùng kết quả này để tuyên bố chính sách chọn bài giúp học tốt hơn.

### Giai đoạn 4 — Thiết kế chính sách chọn bài học cho LearnPython

**Trạng thái 06/10/2026:** Đã có Pre-test 12 câu Python Basics, chấm Docker và hồ sơ 9 kỹ năng. Pilot roadmap 26 bài Python Basics đã nối với assessment thật: trang kết quả tự tạo lộ trình, xếp nhánh bài theo kỹ năng yếu khi đủ điều kiện, khóa bài sau và đồng bộ tiến độ. Kiểm thử toàn chuỗi Pre-test → lộ trình bằng tài khoản giả đạt và đã dọn dữ liệu thử. Catalog pilot kiểm mã/title/SHA/khóa PUBLISHED; mapping toàn khóa và ba ngôn ngữ còn lại chưa được duyệt. Chưa có checkpoint LearnPython hoặc bằng chứng gợi ý cải thiện kết quả học. Xem `research/palnet/python_basics_roadmap_pilot_2026-10-06.md`.

**Việc làm**

- [ ] Dùng hồ sơ theo `userId + language`, bằng chứng Pre-test/bài nộp đã xác minh và đồ thị kỹ năng tương ứng. Không suy ra thành thạo từ tự khai, thiếu dữ liệu hoặc kết quả ngôn ngữ khác.
- [ ] Sinh tập bài đủ điều kiện theo mục tiêu, điều kiện tiên quyết, nội dung đã phát hành, trạng thái roadmap và lịch sử hoàn thành. Thiếu bằng chứng thì ưu tiên bài chẩn đoán hoặc đường học an toàn.
- [ ] Xây các chính sách so sánh: thứ tự chương trình hiện hành, kỹ năng còn yếu, quy tắc khoảng xác suất 0,775 hiện tại và chính sách mới. Công thức điểm của chính sách mới phải công bố; xác suất làm đúng, độ tin cậy và độ khó là các tín hiệu, chưa được gọi là “lợi ích học tập” nếu chưa đo được kết quả sau học.
- [ ] Tách artifact nghiên cứu ASSISTments khỏi checkpoint vận hành theo ngôn ngữ. Khi dữ liệu LearnPython còn ít, dùng baseline đã hiệu chuẩn/quy tắc hiện hành; chỉ train hoặc hiệu chuẩn checkpoint vận hành từ bằng chứng đúng miền và đánh giá riêng.
- [ ] Sửa loader/status: thiếu checkpoint, mismatch skill graph hoặc sai phiên bản phải trả trạng thái chưa sẵn sàng và dùng fallback có tên rõ, không suy luận bằng trọng số ngẫu nhiên như mô hình đã train.

**Đầu ra:** hợp đồng API gợi ý bài học, policy version, lý do gợi ý, model registry và fallback.  
**Cổng nghiệm thu:** mọi bài được trả thuộc đúng ngôn ngữ/mục tiêu, đủ điều kiện và có thể học; checkpoint sai phiên bản không được phục vụ; không phá bất biến roadmap chỉ một mục đang mở.

### Giai đoạn 5 — Thu thập và đánh giá hiệu quả gợi ý thực tế

**Trạng thái 06/10/2026:** Chưa có thử nghiệm hoặc outcome LearnPython hợp lệ. Đã chuẩn bị [hồ sơ sẵn sàng G5](research/palnet/g5_experiment_readiness.md) phân biệt shadow và A/B; chưa khóa cỡ mẫu hay bộ post-test độc lập, chưa bật ghi log shadow sản phẩm. Không báo tác động học tập.

**Việc làm**

- [ ] Ghi log có phiên bản tại từng quyết định: trạng thái trước chọn, tập bài đủ điều kiện, điểm từng ứng viên, bài hiển thị/chọn, chính sách và xác suất phân phối lựa chọn nếu có thử nghiệm ngẫu nhiên. Không ghi thông tin cá nhân không cần thiết vào bộ nghiên cứu.
- [ ] Chạy **shadow mode**: chính sách mới chỉ tính và ghi log, người học vẫn theo lộ trình hiện hành. Kiểm tra an toàn, độ trễ, tỷ lệ fallback và phân bố đề xuất; không diễn giải shadow log là tác động học tập.
- [ ] Khi có đủ người học và bài đánh giá độc lập, thiết kế thử nghiệm có kiểm soát theo **học viên**, so sánh chính sách hiện hành với chính sách mới. Chốt trước chỉ số chính như mức tiến bộ ở bài đánh giá độc lập hoặc duy trì kiến thức sau một khoảng thời gian; chỉ số phụ gồm hoàn thành, thời gian học và mức độ sử dụng.
- [ ] Theo dõi sự khác biệt theo nhóm học viên, kỹ năng, ngôn ngữ và độ dài lịch sử; kiểm tra liệu chính sách có đẩy người học vào bài quá khó hoặc lặp quá nhiều bài dễ.

**Đầu ra:** báo cáo hiệu quả chọn bài học riêng với benchmark KT.  
**Cổng nghiệm thu:** có định nghĩa outcome, nhóm so sánh, khoảng thời gian và số học viên rõ ràng. Nếu chưa đủ dữ liệu hoặc chưa có thử nghiệm hợp lệ, ghi “chưa đủ bằng chứng về hiệu quả gợi ý”, không thay bằng AUC/Accuracy.

### Giai đoạn 6 — Công bố kết quả và vận hành có giám sát

**Trạng thái 06/10/2026:** Đã có [model card ASSISTments chỉ dùng nghiên cứu](research/palnet/assistments_research_model_card.md) và [runbook phát hành dự kiến](research/palnet/serving_runbook.md). Chưa có model card checkpoint LearnPython hoặc hệ thống serving đang bật; G6 chưa nghiệm thu.

**Việc làm**

- [ ] Hoàn thiện báo cáo gồm dữ liệu, xử lý, mô hình, baseline, split, siêu tham số, chỉ số, ablation, độ trễ, giới hạn và khả năng tái lập; tách bảng dữ liệu mô phỏng, ASSISTments và LearnPython.
- [ ] Đóng gói model card: miền áp dụng, phiên bản, ngày train, dữ liệu, ngôn ngữ, chỉ số, ngưỡng sẵn sàng, trường hợp fallback và rủi ro chuyển miền.
- [ ] Phát hành theo cổng sẵn sàng từng ngôn ngữ và theo hợp đồng roadmap chung. Theo dõi drift, calibration, lỗi tải model, độ trễ và tỷ lệ fallback; giữ khả năng quay về chính sách hiện hành.

**Đầu ra:** báo cáo nghiên cứu, model card, artifact tái lập và runbook vận hành.  
**Cổng nghiệm thu:** chỉ công bố kết quả đã chạy; chỉ bật mô hình trên ngôn ngữ có đủ dữ liệu, kiểm định và checkpoint phù hợp. Việc triển khai thử từng adapter không đồng nghĩa đã hoàn thành phạm vi roadmap bốn ngôn ngữ.

## 4. Mẫu bảng báo cáo bắt buộc

**Bảng A — Dự đoán lượt trả lời tiếp theo (mỗi dataset một bảng riêng)**

| Dataset | Mô hình | AUC ↑ | Accuracy ↑ | RMSE ↓ | F1 ↑ | Brier ↓ | Inference ms ↓ |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| ASSISTments 2009–2010 corrected | 7 mô hình, gồm baseline/BKT/DKT/PAL-Net/ablation | [Bảng G3](research/palnet/assistments_g3_report.md) | [Bảng G3](research/palnet/assistments_g3_report.md) | [Bảng G3](research/palnet/assistments_g3_report.md) | [Bảng G3](research/palnet/assistments_g3_report.md) | [Bảng G3](research/palnet/assistments_g3_report.md) | [Bảng G3](research/palnet/assistments_g3_report.md) |

**Bảng B — Hiệu quả chọn bài học trên LearnPython (chỉ lập số liệu khi có đánh giá hợp lệ)**

| Chính sách | Số học viên | Kết quả đánh giá độc lập | Duy trì kiến thức | Hoàn thành | Thời gian học | Khoảng tin cậy |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Lộ trình hiện hành / chính sách mới | Chưa chạy | Chưa chạy | Chưa chạy | Chưa chạy | Chưa chạy | Chưa chạy |

## 5. Thứ tự phụ thuộc và quyết định phát hành

`G0 giao thức → G1 dữ liệu → G2 train đối chuẩn → G3 báo cáo KT → G4 chính sách bài học → G5 đánh giá thực tế → G6 công bố/vận hành`.

Có thể chuẩn bị mapping bài học và công cụ ghi log song song với G1–G3. **Không được** dùng kết quả G3 để tự động khẳng định đã đạt G5; không triển khai checkpoint ASSISTments cho bài học Python/JavaScript/C++/SQL. Tập mô phỏng chỉ là kiểm tra kỹ thuật và phải được dán nhãn *synthetic* trong mọi bảng.

## 6. Nguồn nghiên cứu và tài liệu liên quan

- [ASSISTments 2009–2010 Skill Builder: dữ liệu, bản sửa và hướng dẫn trích dẫn](https://sites.google.com/site/assistmentsdata/home/2009-2010-assistment-data/skill-builder-data-2009-2010).
- [Piech và cộng sự, Deep Knowledge Tracing (2015)](https://arxiv.org/abs/1506.05908).
- [Nghiên cứu về đánh giá chính sách từ log của hệ thống gợi ý](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/Published-3.pdf).
- Tài liệu nội bộ: [kế hoạch roadmap](ke_hoach.md), [các giai đoạn roadmap](giai_doan_phat_trien.md), [đặc tả Giai đoạn 0](dac_ta_giai_doan_0.md), `.agent/specs/current-task.md`.
