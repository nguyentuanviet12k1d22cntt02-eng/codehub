# Xác nhận kỹ thuật bộ Pre-test Python Basics — OpenAI Codex

**Ngày xác nhận:** 06/10/2026  
**Người/đơn vị xác nhận:** OpenAI Codex — AI technical reviewer  
**Phạm vi được ủy quyền:** người dùng yêu cầu Codex đóng vai trò người chịu trách nhiệm xác nhận bộ câu hỏi.  
**Bản được duyệt (SHA-256):** `9048eb9f86553977e47f5f99760c73e85c0d8c7122b002cc4de3c0629f1aba68`

## Kết luận

Codex xác nhận **đạt kiểm tra kỹ thuật và nội dung ở mức AI review** cho đủ 12 câu `PT-PYB-001` đến `PT-PYB-012`:

- câu hỏi và đáp án phù hợp Python cơ bản, không thấy đáp án mơ hồ hoặc sai;
- tỷ lệ câu đúng blueprint 3 khái niệm / 4 đọc code / 2 sửa lỗi / 3 thực hành;
- đủ 5 kỹ năng cổng của mục tiêu Python Basics;
- ba câu thực hành đã chạy trên Docker thật, lời giải chuẩn đều qua và lời giải sai mẫu đều bị bắt;
- runner chạy cách ly nghiêm ngặt, không cho phép chạy dự phòng trực tiếp trên máy chủ.

Bằng chứng Docker: `evidence/python_basics_runner_qc_2026-10-06.json`, trạng thái `RUNNER_QC_PASSED`, digest `5d3a2895b47f6f13238ce356988a81fd58ce12d814a0832b9541505819717234`. SHA-256 của tệp bằng chứng đã lưu: `ff8c5a2b50da1f24c114e80f9b05312645b485fad6aaeff2e0f6c99dd932f8f4`.

## Giới hạn xác nhận

Đây là xác nhận của một hệ thống AI, không phải chữ ký giả danh con người. Xác nhận này chỉ tính là **một nguồn duyệt kỹ thuật**. Theo cổng chất lượng hiện tại, manifest phát hành vẫn yêu cầu hai người duyệt độc lập; vì vậy chưa tự động chuyển bộ câu hỏi vào production bank. Chủ dự án có thể phê duyệt thay đổi quy tắc quản trị bằng một quyết định riêng, hoặc cung cấp thêm một người duyệt có danh tính.

**Quyết định:** `AI_TECHNICAL_APPROVED`; chưa tuyên bố `APPROVED_FOR_SERVING`.
