# Báo cáo kiểm chứng Pipeline AI sinh bài tập V3

## Kết luận

Pipeline V3 đã chạy thành công với model thật cho Python, JavaScript, C++ và SQL. Không run nào phát hành bài dự phòng. Một bài chỉ được lưu sau khi qua kiểm tra schema, ràng buộc, chạy nghiệm mẫu trong Docker, agent thẩm định và cổng phát hành.

Chỉ mục kiểm chứng máy đọc tại `final-verification-summary.json` có trạng thái `PASSED`. Tệp này ghi SHA-256 của từng báo cáo nguồn để phát hiện thay đổi sau khi thu bằng chứng.

## Run thật đã lưu

| Ngôn ngữ | Trace ID | Bước agent | Lời gọi model thành công | Provider/model đã thành công |
| --- | --- | ---: | ---: | --- |
| Python | `trace_e2f87a93a95a4dc08c5c8e8cd2a6b4b5` | 10 | 3 | GROQ `openai/gpt-oss-120b`; OPENROUTER `meta-llama/llama-3.3-70b-instruct` |
| JavaScript | `trace_26d6a6a955e74e7e8f751b7e44fc4048` | 18 | 5 | GROQ `openai/gpt-oss-120b`; GEMINI `gemini-3.8-flash`; OPENROUTER `meta-llama/llama-3.3-70b-instruct` |
| C++ | `trace_b77135a697b4405296ac1f1df43df44c` | 10 | 3 | GROQ `openai/gpt-oss-120b`; OPENROUTER `meta-llama/llama-3.3-70b-instruct` |
| SQL | `trace_85f99ffd01014b69a929fefa60912f82` | 10 | 3 | GEMINI `gemini-3.8-flash`; GROQ `openai/gpt-oss-120b`; OPENROUTER `meta-llama/llama-3.3-70b-instruct` |

Mỗi lời gọi thành công trong báo cáo JSON có stage, provider, model, response ID, thời gian và usage do provider trả về. Tổng cộng có 29 lượt gọi được ghi nhận, trong đó 14 lượt thành công; các lỗi provider và lần sửa không bị xóa khỏi lịch sử.

## Điều kiện đã kiểm chứng cho từng ngôn ngữ

- `fallback_used` bằng `false`.
- `PublicationGate` chỉ duyệt sau các validator và agent thẩm định.
- Bản công khai không chứa `reference_solution` hoặc SQL `fixture_sql`.
- Nộp nghiệm đúng vượt qua bộ chấm Docker; nghiệm sai bị từ chối.
- Gửi lại cùng submission và vượt qua lại cùng bài không cộng mastery lần hai.
- Docker smoke test thật đạt kết quả `passed: true`.

## Bằng chứng lỗi được giữ nguyên

- `cpp-first-attempt-failed.json`
- `cpp-second-attempt-failed.json`
- `sql-provider-timeout.json`
- `sql-schema-repair-failed.json`

Các tệp này chứng minh pipeline báo lỗi và sửa có giới hạn thay vì thay bằng một bài mẫu thành công giả.

## Kiểm thử mã nguồn và bản chạy

- AI service: 15/15 test đạt.
- Backend: 8/8 test đạt.
- TypeScript backend và Vite frontend build thành công.
- Ba container `ai-service`, `backend`, `frontend` đã được build lại; AI service báo `healthy`.
- Hai endpoint PAL-Net cũ `/pal-net/generate-path` và `/pal-net/chat-interact` trả HTTP `410`, buộc chức năng sinh bài đi qua pipeline V3.

Chi tiết kiến trúc, cách xem trong sản phẩm và cách chạy lại nằm trong `README.md` của thư mục này.
