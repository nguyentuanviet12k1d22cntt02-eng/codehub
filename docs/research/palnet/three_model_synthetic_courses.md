# So sánh BKT, DKT và PAL-Net trên bài tập thật, lịch sử mô phỏng

## Câu hỏi và phạm vi

Mỗi ngôn ngữ được đánh giá riêng: với lịch sử làm bài trước một lượt nộp, mô hình nào dự đoán xác suất trả lời đúng của lượt đó tốt hơn? Bảng chính chỉ gồm BKT, DKT và PAL-Net. Mã, tên, bài học và độ khó của bài tập được xuất từ database thật; người học, kết quả, thời gian và lỗi vẫn được mô phỏng. Vì vậy đây là phép kiểm tra quy trình, không đo tác động đối với người học thật.

Các tài liệu, kết quả và mô hình phụ của benchmark ASSISTments vẫn được giữ tại [thư mục nghiên cứu hiện hành](assistments_g3_report.md) để truy vết và kiểm tra thành phần của PAL-Net. Chúng không được trộn với dữ liệu khóa học giả lập trong bảng này.

## Dữ liệu

| Khóa học | Bài tập thật trong catalog | Bài tập thật đã dùng | Học viên mô phỏng | Lượt nộp mô phỏng | Kỹ năng có bài thật |
| :--- | ---: | ---: | ---: | ---: | ---: |
| Python | 322 | 300 | 60 | 6.471 | 26/35 |
| JavaScript | 127 | 127 | 60 | 3.566 | 23/23 |
| C++ | 48 | 48 | 60 | 3.531 | 21/21 |

Bộ xuất catalog chỉ đọc database và không lấy danh tính hay mã nguồn đã nộp. Mỗi `item_id` là UUID của `CodingExercise` thật; `item_title`, `lesson_code` và `difficulty` cũng lấy từ database, sau đó được gắn kỹ năng bằng mapping có phiên bản trong đồ thị của từng ngôn ngữ. Bộ sinh lịch sử chỉ chọn trong catalog này. Mỗi người học mô phỏng có năng lực ban đầu, tốc độ tiến bộ, xu hướng làm lại, lỗi hay mắc, phiên học và khoảng nghỉ khác nhau. Không có cột xem gợi ý vì giao diện hiện tại không ghi nhận hành động này.

Kiểm kê database tại thời điểm xuất có 486 lượt Python đã chấm từ 7 học viên, nhưng JavaScript chỉ có 1 lượt từ 1 học viên và C++ có 4 lượt từ 1 học viên. Khối lượng này chưa đủ để huấn luyện và so sánh ba mô hình một cách có ý nghĩa cho cả ba ngôn ngữ. Do đó không được gọi ba lịch sử dưới đây là “dữ liệu người học thật”.

Mã xuất catalog: [`export_real_kt_catalog.cjs`](../../../backend/scripts/export_real_kt_catalog.cjs). Catalog và kiểm kê nằm trong [`ai-service/data/real_exercise_catalog/`](../../../ai-service/data/real_exercise_catalog/). Mã sinh lịch sử: [`generate_multilanguage_kt.py`](../../../ai-service/scripts/data_generation/generate_multilanguage_kt.py). Dữ liệu và metadata nằm trong [`ai-service/data/synthetic_history_real_items/`](../../../ai-service/data/synthetic_history_real_items/). Metadata lưu checksum riêng của dataset, đồ thị và catalog để ngăn trộn nhầm nguồn.

## Quy trình đánh giá

1. Kiểm tra checksum, kỹ năng hợp lệ, thứ tự lượt học, làm lại cùng bài và chỉ số tiên quyết được tính từ lịch sử trước lượt hiện tại.
2. Trong mỗi nhóm hành vi gồm 12 người, chia 8 train, 2 validation, 2 test. Không có học viên xuất hiện ở hai tập.
3. Ba mô hình cùng dự đoán mọi lượt từ lượt thứ hai trở đi. BKT chọn bộ tham số bằng validation log loss. DKT và PAL-Net có cùng số epoch tối đa, optimizer, learning rate, weight decay và patience; cùng chọn checkpoint có validation log loss thấp nhất. Test chỉ được tính sau khi đã chọn mô hình.
4. Chạy ba seed chia tập `20261013`, `20261014`, `20261015`. Báo trung bình; notebook còn hiển thị từng seed và độ lệch chuẩn. Lưu xác suất dự đoán theo từng lượt để kiểm tra ba mô hình được chấm trên cùng nhãn.

Toàn bộ phần định nghĩa và huấn luyện BKT, DKT, PAL-Net nằm trực tiếp trong ba notebook: [`train_python_models.ipynb`](../../../ai-service/notebooks/train_python_models.ipynb), [`train_javascript_models.ipynb`](../../../ai-service/notebooks/train_javascript_models.ipynb) và [`train_cpp_models.ipynb`](../../../ai-service/notebooks/train_cpp_models.ipynb). Notebook không gọi script training, không bỏ qua training khi artifact đã tồn tại và mỗi lần Run All đều huấn luyện lại ba mô hình.

Để chạy notebook, cài dependency dịch vụ trong `ai-service/requirements.txt` cùng các thư viện hiển thị trong [`ai-service/notebooks/requirements.txt`](../../../ai-service/notebooks/requirements.txt). Biểu đồ ROC và độ khớp xác suất được tính trực tiếp bằng NumPy nên không cần cài scikit-learn. Chạy notebook từ thư mục gốc dự án hoặc `ai-service/`.

## Kết quả test trung bình qua ba seed

| Ngôn ngữ | Mô hình | ROC-AUC ↑ | Accuracy ↑ | Log loss ↓ | Brier ↓ |
| :--- | :--- | ---: | ---: | ---: | ---: |
| Python | BKT | 0,5863 | 0,5615 | 0,6855 | 0,2459 |
| Python | DKT | 0,5354 | 0,5390 | 0,6891 | 0,2480 |
| Python | PAL-Net | 0,6449 | 0,6109 | 0,6614 | 0,2345 |
| JavaScript | BKT | 0,5921 | 0,5711 | 0,6789 | 0,2429 |
| JavaScript | DKT | 0,5183 | 0,5025 | 0,6930 | 0,2499 |
| JavaScript | PAL-Net | 0,6338 | 0,5982 | 0,6699 | 0,2385 |
| C++ | BKT | 0,5673 | 0,5704 | 0,6869 | 0,2467 |
| C++ | DKT | 0,5353 | 0,5307 | 0,6918 | 0,2493 |
| C++ | PAL-Net | 0,6167 | 0,5832 | 0,6714 | 0,2393 |

Trên **ba lịch sử mô phỏng dùng bài tập thật này**, PAL-Net có AUC và log loss tốt nhất trong ba mô hình. Đây chưa phải bằng chứng PAL-Net sẽ dẫn đầu trên lịch sử học thật. Công thức sinh đúng/sai mới không dùng mức thành thạo kỹ năng tiên quyết, nhưng vẫn mô phỏng quá trình tiến bộ theo số lần luyện tập và thứ tự chương trình vẫn theo đồ thị. Thực nghiệm ASSISTments trước đó còn cho kết quả khác: DKT AUC 0,7580, PAL-Net 0,7517, BKT 0,6901 trên một bộ dữ liệu toán học. Do đó không nên tuyên bố PAL-Net luôn tốt hơn.

## Cách diễn đạt ba nhận định dễ bị hỏi lại

- **Cold-start:** các notebook báo riêng lượt có 1–3, 4–7 và từ 8 lịch sử trước đó. Chỉ có thể nói các mô hình đã được kiểm tra ở giai đoạn đầu; chưa thể nói PAL-Net “giải quyết triệt để” cold-start. Lượt hoàn toàn chưa có lịch sử (`t=1`) hiện chưa được chấm trong bảng công bằng này.
- **Ngăn chặn mã độc:** BKT, DKT và PAL-Net chỉ ước lượng khả năng trả lời đúng. Bộ chạy code cô lập của hệ thống mới là phần có thể hạn chế rủi ro khi chạy mã người học; phải đánh giá an toàn bằng bài kiểm thử riêng.
- **Golden Zone 0,70–0,85:** cần định nghĩa rõ khoảng này là xác suất dự đoán hay mức thành thạo và chứng minh nó dẫn đến kết quả học tập tốt hơn. Thực nghiệm dự đoán đúng/sai hiện tại không kiểm định ngưỡng này, nên chỉ nêu là giả thuyết/chính sách đề xuất.

## Giới hạn bắt buộc ghi trong báo cáo

Tham số hành vi được đặt theo giả định, không được ước lượng từ người học thật. Việc dùng UUID và nội dung catalog thật không biến kết quả làm bài mô phỏng thành telemetry thật. Ba seed vẫn ít để kết luận chắc chắn. Checkpoint do notebook sinh tại `ai-service/outputs/notebook_fair_kt/` chỉ dành cho nghiên cứu và không được đưa vào registry vận hành. Bước tiếp theo để đánh giá khả năng dùng thật là thu thập thêm lịch sử JavaScript/C++ có phép sử dụng, hoàn thiện mapping item–skill và lặp lại phép so sánh trên dữ liệu đó.
