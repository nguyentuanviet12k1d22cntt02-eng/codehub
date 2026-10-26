# Kết quả kiểm tra quy trình AI Tutor — 24/10/2026

## Nguyên nhân đã xác minh

1. Bộ ba bài gốc dừng ở bài thứ ba: một expected_output tính sai, nhưng lượt
   sửa thay cả bài toán. Các bản sau lại vi phạm mô tả 2–4 câu. Đây là lỗi phạm
   vi sửa và hợp đồng đầu ra, không phải thiếu khả năng chạy sandbox.
2. Phân chia thời gian theo toàn bộ khóa trong pool làm cửa sổ gọi AI quá ngắn.
   Provider chậm có thể tiêu hết thời gian, khiến provider sau không được gọi.
3. Trợ giảng coi JSON hợp lệ là thành công trước khi kiểm tra nội dung. Khi hint
   chứa câu lệnh giải, bộ kiểm tra sau đó từ chối nhưng không còn chuyển provider.

## Thay đổi chính

- Đề mới dùng hợp đồng có cấu trúc cho 2–4 câu mô tả, Input, Output; ví dụ dựng
  từ test công khai. Không nới kiểm định định dạng/chủ đề/kiến thức học viên.
- Sửa theo loại lỗi: chỉ lời đề, hoặc chỉ đáp án test lỗi/nghiệm mẫu. Giữ input,
  số test, kỹ năng, mã khung và các phần không lỗi; chạy lại toàn bộ kiểm định.
  Nếu cùng lỗi sửa hẹp vẫn không đạt, dừng kèm nguyên nhân thay vì lặp mù.
- Chia thời gian theo provider trong ngân sách sẵn có, không theo số lượng khóa.
- Kiểm tra nội dung trợ giảng trước khi ghi thành công. Phản hồi vi phạm chuyển
  sang provider sau trong cùng deadline, không phạt khóa vì lỗi nội dung.
  Không đưa câu lệnh lời giải vào gợi ý, không tạo nhận xét giả khi AI thất bại.

## Bằng chứng kiểm chứng

| Phạm vi | Kết quả |
| --- | --- |
| Unit/regression Python liên quan | 143/143 đạt |
| Backend liên quan | 39/39 đạt; kiểm tra kiểu TypeScript đạt |
| UI phản hồi một khung | 1/1 đạt; initial/retry/batch không lặp khung |
| Bộ bốn bài Python for qua API thật | 4/4 bài, 19/19 testcase EC2 Docker |
| Xuất bản bộ bài | Cùng tab thực hành, không có bài lẻ, gọi lại không tạo bản sao |
| Bài Set qua provider/EC2 thật | 6/6 testcase, critic và publication gate đạt |
| Trình duyệt nộp sai | INCEPTION chỉ đúng dòng 3 và thiếu thao tác xuất ký tự |
| Trình duyệt sửa rồi nộp đúng | 100/100, GROQ nhận xét đúng cách dùng for |

Bộ bốn bài vẫn có bản nháp không đạt và checkpoint phục hồi do provider timeout;
không tuyên bố mọi bản nháp đều đúng ngay lần đầu. INCEPTION đã được gọi thật:
trong kiểm chứng trình duyệt cuối, GROQ bị từ chối vì gợi ý lộ câu lệnh,
OPENROUTER timeout, rồi INCEPTION trả nội dung đạt. Biên nhận phân biệt lỗi nội
dung với lỗi kết nối, không đánh dấu transport thành công là nội dung đạt.

## Tài liệu bằng chứng

- Biên bản API/trình duyệt: `measurements/generation-reliability-2026-10-24.json`.
- Kiểm thử Set: `measurements/set-batch-live-latest.json`.
- Ảnh bài sai: `measurements/practice-feedback-wrong-2026-10-24.png`.
- Ảnh bài đúng: `measurements/practice-feedback-correct-2026-10-24.png`.

## Phạm vi và giới hạn

Kiểm tra bằng tài khoản QA cô lập; không sửa tài khoản học viên. Không triển
khai lên website từ xa. Giao diện thường dùng tại cổng 5173, backend 3000 và
AI 8000 đều phản hồi; AI 8000 bật tự nạp lại nguồn. QA dùng cổng riêng.

Provider bên ngoài vẫn có thể hết quota/timeout hoặc trả nội dung không đạt.
Khi tất cả đều thất bại, hệ thống báo lỗi có giới hạn thời gian, không bỏ kiểm
định, không chạy mã ngoài EC2 và không giả vờ hoàn thành. Các ca đã kiểm tra
không phải bảo đảm tuyệt đối cho mọi chủ đề/ngôn ngữ hoặc mọi thời điểm.
