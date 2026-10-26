# Kiểm tra quy trình sinh bài — 2026-10-24

## Bằng chứng trước khi sửa

- Bộ gốc `trace_bc97bea8dff94f7fae8d4f7c1f5a6189` có 3 bài; bài thứ ba
  `trace_5b692e654d6f419a964ccc663c140f54` thất bại.
- Nghiệm mẫu chạy thành công trên EC2 nhưng một expected_output tính sai.
  Generator sửa bằng cách thay cả bài toán (thêm danh sách/đọc dữ liệu khác).
  Hai bản sau đều chỉ có một câu mô tả, bị SchemaValidator chặn.
- Phản hồi sửa hiện chứa toàn bộ bản nháp/biên nhận kiểm thử; không có giới hạn
  trường được sửa. Quy tắc 2–4 câu chỉ nằm trong prompt văn bản.
- Kiểm thử baseline định dạng/batch: 18/18 đạt (0.435s), nhưng chưa bao phủ chuỗi
  lỗi thật này. Kết quả mock không phải bằng chứng provider/sandbox thật.

## Thiết kế

1. Generator xuất phần đề có cấu trúc (mảng 2–4 câu, Input, Output). Hệ thống
   dựng Markdown và ví dụ từ test công khai; hợp đồng hiển thị cũ vẫn đọc được.
2. Phân loại lỗi trước khi sửa. Lỗi định dạng chỉ sửa đề; OUTPUT_MISMATCH chỉ
   sửa expected_output của test lỗi hoặc nghiệm mẫu, không đổi input, số test,
   kỹ năng, starter hoặc bài toán. Mỗi bản sửa có chẩn đoán ngắn có thể kiểm tra.
3. Không chép actual thành expected tự động. Model phải xác định phần sai theo
   đề; sau đó toàn bộ validator và critic độc lập vẫn chạy. Không chạy mã local.
4. Nếu sửa hẹp không khắc phục cùng lỗi, dừng kèm nguyên nhân thay vì lặp lại.
   Giữ tối đa ba vòng kiểm định và các giới hạn thời gian hiện có.
5. Checkpoint luôn gắn với bản nháp mới nhất, không tái dùng receipt của bản cũ.

## Tiêu chí nghiệm thu

- Regression: sửa sai expected không làm đổi đề/input/test count; sửa một câu
  không làm đổi code/tests; từ chối patch ngoài phạm vi, patch rỗng hoặc vô lý.
- Một câu vẫn bị chặn (không nới quy tắc 2–4 câu); ví dụ luôn khớp test công khai.
- Lỗi hạ tầng không bị coi là sai nội dung, không làm giảm chất lượng kiểm định.
- Luồng thật bằng tài khoản QA cô lập: tạo đủ 4 bài đúng chủ đề, tất cả testcase
  thực thi EC2 Docker, phát hành nguyên bộ vào cùng tab thực hành, một phản hồi
  cuối, không lộ nghiệm mẫu/test ẩn. Kiểm tra idempotency và checkpoint.
- Tách rõ kiểm thử cục bộ, provider/EC2 thật, trình duyệt và triển khai từ xa.
  Chỉ báo đã kiểm chứng những phần có bằng chứng; lưu nhật ký kết quả.

## Phạm vi

Không đổi thứ tự provider, không ép INCEPTION, không tắt validator/critic,
không chỉnh dữ liệu học viên hoặc tài khoản đang gặp lỗi; không deploy từ xa.

## Phát hiện khi kiểm chứng API và trình duyệt

- Bộ 4 bài QA đã phát hành nguyên bộ, 19/19 test EC2 Docker đạt. Không sinh lại
  bộ này khi kiểm tra riêng trợ giảng.
- Pool nhiều khóa làm chia nhỏ thời gian gọi nội dung còn khoảng 5 giây. Chuyển
  sang cửa sổ thời gian theo provider trong cùng ngân sách bước/lượt có sẵn;
  lỗi nhanh có thể thử khóa anh em, provider chậm phải nhường phần dự phòng.
- API trợ giảng đúng/sai đạt, nhưng lượt trình duyệt sau đó phát hiện JSON hợp
  lệ có hint đưa thẳng `print(ch)`. Validator từ chối đúng quy tắc, tuy nhiên
  trước đây nằm SAU vòng chọn provider, khiến không có cơ hội chuyển tiếp.
- Phương án: validator nội dung là callback tùy chọn trong `PipelineLLMClient`;
  chỉ dùng cho trợ giảng ở thay đổi này, không đổi pipeline sinh đề. Nội dung
  vi phạm ghi `PROVIDER_CONTRACT_INVALID` trước khi đánh dấu thành công, chuyển
  provider kế tiếp trong đúng deadline cũ, không lặp khóa/không cooldown khóa.
  Giữ chặn mã lời giải và cơ chế lỗi rõ ràng nếu mọi provider đều không đạt.
  Regression dùng chính phản hồi OpenRouter quan sát được, kiểm tra cả trường
  hợp phục hồi lẫn thất bại toàn bộ, sau đó kiểm chứng lại API và trình duyệt.

## Kết quả nghiệm thu

- Kiểm thử liên quan: Python 143/143 (74 + 27 + 42), backend 39/39, UI một khung
  trạng thái 1/1 đạt; TypeScript backend kiểm tra kiểu thành công. Bản dựng
  frontend đã đạt ở lượt kiểm tra trước, không thay đổi nguồn frontend trong
  lượt sửa hợp đồng/provider cuối. SSR UI cần khoảng 6 giây để nạp Vite;
  các nhóm unit Python/backend được chia nhỏ, mỗi nhóm thực thi dưới 5 giây.
- API QA: đủ 4 bài, 19/19 testcase trên aws-docker, nguyên bộ trong một tab,
  xuất bản idempotent và không lộ nghiệm mẫu/test ẩn. Kiểm thử Set riêng đạt
  6/6 testcase EC2, critic duyệt và publication gate đạt. Không bỏ validator.
- Trình duyệt QA: thấy đủ 4 bài, trạng thái đang chấm/đang phân tích, phản hồi
  dòng 3 từ INCEPTION cho mã có pass; sửa mã làm xóa nhận xét cũ; nộp đúng
  đạt 100/100 với nhận xét tích cực từ GROQ. Có ảnh và biên nhận model thật.
- Content failover quan sát thực tế: GROQ vi phạm hợp đồng, OPENROUTER timeout,
  INCEPTION trả nội dung đạt trong cùng lượt phân tích.
- Các cổng thường dùng 5173/3000/8000 phản hồi HTTP 200; AI 8000 chạy --reload.
  QA riêng 5174/3001/8001; worker QA chỉ xử lý fixture riêng. Không sửa tài
  khoản học viên và không triển khai máy chủ xa.
- Giới hạn: không cam kết provider bên ngoài luôn hoạt động. Hết thời hạn hoặc
  mọi nội dung không đạt vẫn báo lỗi thật, không phát hành bài thiếu hay dựng
  phản hồi. Các ca cụ thể này không chứng minh mọi chủ đề/ngôn ngữ không thể lỗi.
