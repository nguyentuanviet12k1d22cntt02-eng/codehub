# Nhận xét theo bài làm — khắc phục mất kết quả

## Nguyên nhân có bằng chứng

- `publicGrading` trước đây chỉ trả kết quả test, không có nhận xét. Sau đó UI phải gọi một API AI riêng và chỉ nhận `source: AI`.
- Mọi lỗi provider/JSON/timeout tại nhánh AI trở thành HTTP 503. UI đặt `guidanceError` rồi che nội dung bằng thông báo trong ảnh người dùng; không có đường dùng lại bằng chứng chấm. Request frontend không có timeout riêng.
- Nhật ký gọi PracticeFeedbackAgent thực tế đã có `PROVIDER_TIMEOUT`, `PROVIDER_DEADLINE_EXCEEDED` và `PROVIDER_CONTRACT_INVALID: PRACTICE_FEEDBACK_CODE_IN_HINT`; cũng có các lần GROQ/INCEPTION thành công. Không có cơ sở cam kết provider luôn hoạt động hoặc gán chắc lỗi trong screenshot cho một call cụ thể khi không có submission ID.

## Thay đổi có giới hạn

1. Backend trả nhận xét `EVIDENCE` ngay cùng kết quả chấm, dựa trên test/cấu trúc/trạng thái của bài đó. Các nhánh: thiếu cấu trúc, dùng cấu trúc cấm, lỗi cú pháp/chạy, timeout/bộ nhớ, thiếu đầu ra, sai khoảng trắng/xuống dòng, sai kết quả, chỉ test ẩn sai, bài đúng và sự cố grader. Không đoán thuật toán sai cụ thể khi chỉ biết output mismatch.
2. AI vẫn đọc code thật và kết quả đã lưu. Đường enrich có deadline 28 giây, bao gồm đọc JSON; mất kết nối, quá tải, HTTP lỗi hoặc payload sai vẫn trả lại phản hồi bằng chứng. AI không được giả lập, validator model không bị nới lỏng.
3. Ưu tiên testcase công khai chưa đạt khi chọn dữ liệu gửi AI. Không gửi hidden input/output/stderr hoặc reference solution. Chỉ xác định dòng từ filename của mã học viên, không dùng `/work/main.py` của harness.
4. Giao diện hiện nhận xét nền ngay, thêm trạng thái “Đang phân tích thêm bằng AI…” mà không che nội dung. Phân biệt nhãn “Từ kết quả chấm”/“Nhận xét AI”; timeout enrich frontend 32 giây. Lỗi enrich giữ hướng dẫn hiện có. HTTP lỗi grader vẫn hiển thị chẩn đoán hệ thống, không đổ lỗi học viên.
5. Giữ kiểm tra chủ sở hữu, submission ID + sequence, hủy request khi đổi mã/bài và lúc unmount. Không cho phản hồi cũ ghi đè lần nộp mới. Không đổi grader EC2, sinh đề hoặc mascot.

## Kiểm thử tự động

| Nhóm | Kết quả |
| --- | --- |
| Backend `practiceGuidance.test.cjs` | 13/13, ~0.42s |
| Backend adaptive + AWS Docker | 35/35, ~0.51s |
| Frontend kết quả/SSR guidance | 2/2, ~4.12s |
| Frontend mascot hồi quy | 4/4, ~0.21s |
| AI feedback validator/provider/route | 10/10, ~2.22s cả process |
| Backend TypeScript | Đạt |
| Frontend production build | Đạt; vẫn có cảnh báo chunk lớn sẵn có |
| ESLint card/helper mới | Đạt |

Fault injection tự động gồm offline, HTTP 429/503, JSON lỗi, nội dung rỗng và fetch/JSON không bao giờ resolve; fallback vẫn hoàn tất đúng hạn. Controller test giữ 404 cho submission không thuộc chủ sở hữu, 400 cho ID sai, trả hướng dẫn cho sự cố grader. Frontend test từ chối sai submission/sequence và giữ nội dung khi analyzing/analysisError. Không tuyên bố đã mô phỏng request trả muộn bằng mạng thật trong browser; nhánh đó được kiểm tra bằng test điều kiện và rà soát caller.

## Kiểm thử thực tế

Tài khoản QA riêng `reliability_qa_*`, không dùng tài khoản học viên. Backend QA tạm ngắt kết nối AI bằng địa chỉ loopback không có dịch vụ; không sửa `.env` hay key thật. Chấm qua Docker EC2 hiện có.

| Bài nộp | Nhận xét ngay / AI offline | Dòng | Thời gian gọi phân tích offline |
| --- | --- | --- | --- |
| Vòng for có pass, không xuất kết quả | Chưa có kết quả đầu ra | Không suy đoán | 680ms |
| Không có for | Cần sử dụng for | Không dùng dòng harness | 684ms |
| For thiếu dấu hai chấm | Cần sửa cú pháp trước | 1 | 665ms |
| Lời giải đúng | Bạn đã hoàn thành bài này | Không gắn lỗi | 671ms |

Sau khôi phục AI, hai API enrich thực tế đều trả `source: AI`: bài sai 23.507s, xác định dòng 3/pass; bài đúng 6.676s. Thời gian chấm EC2 của bốn bài 6.3–8.9s; nhận xét bằng chứng đi kèm đáp ứng chấm nên không phải chờ thêm 23 giây mới thấy nội dung.

Trên giao diện thực hành thật: nhập mã qua Monaco, nhấn Nộp bài, thấy phản hồi thiếu đầu ra với nhãn bằng chứng khi AI offline. Online thấy nội dung đó cùng trạng thái phân tích thêm, sau đó nhận xét AI; sửa mã và nộp bản đúng hiển thị 100/100 cùng lời chúc mừng AI, không giữ nguyên thông báo mặc định. Card đọc được ở light/dark; viewport 375px rộng 315px không tràn. Đã trả lại viewport/theme ban đầu và kết nối AI bình thường.

## Bằng chứng và giới hạn

- `measurements/practice-guidance-resilience-2026-10-24.json`: kết quả API thật, submission IDs QA, nhận xét và timing.
- `measurements/practice-guidance-offline-ui-2026-10-24.png`: UI có nhận xét dù AI ngắt kết nối.
- `measurements/practice-guidance-online-ui-2026-10-24.png`: UI bài đúng và AI thật.
- Ảnh `practice-guidance-dark-ui-*` và `practice-guidance-mobile-ui-*`: kiểm tra theme/khung hẹp.

Backend cục bộ :3000 và QA :3001 đã nạp bản sửa, frontend dev tải nguồn hiện tại. Không deploy Render/production. “Luôn có kết quả” được thực hiện bằng phản hồi dựa trên bằng chứng khi đã có kết quả chấm, không phải hứa mọi nhà cung cấp AI luôn trả lời. Nếu chính backend/máy chấm không trả kết quả hoặc mạng trình duyệt đứt, UI báo trạng thái hệ thống và không bịa kết quả học viên.
