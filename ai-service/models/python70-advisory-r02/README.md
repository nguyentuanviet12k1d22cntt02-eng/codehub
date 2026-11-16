# Python70 advisory bundle R02

Checkpoint PAL-Net cho lộ trình Python cơ bản, huấn luyện trên dữ liệu mô phỏng v4-T (`syn-py70-v4-20261106-0128e5469e-T`), thay cho R01 (huấn luyện trên v2).

- Model: `python70-r02-s20261102-advisory-v1`, seed định trước 20261102. Kiến trúc và đặc trưng giữ nguyên R01 (`python70-causal-adapter/1.0`, `python70-causal-feedback/1.0`), đồ thị 2.1.
- Huấn luyện: 56 học viên mô phỏng, 9623 sự kiện. Siêu tham số khóa từ Stage 3, không dò lại.
- Kiểm tra (14 học viên, 3159 sự kiện): AUC 0.693, AP 0.445. Đây chính là mô hình seed 20261102 trong notebook `python70_v4_tong_quan_va_train_test.ipynb`.
- Chế độ ADVISORY / SYNTHETIC_EXPLORATORY: chỉ gợi ý thứ tự, có dự phòng theo luật. Chưa đo trên học viên thật.
- Bằng chứng: `reviews/synthetic-python-70-2026-10-28/learning-v4-2026-11-06/serving-r02/`. Bundle R01 ở `models/python70-advisory/` được giữ nguyên để hoàn nguyên.
