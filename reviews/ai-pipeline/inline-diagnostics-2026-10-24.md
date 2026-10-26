# Chẩn đoán nội tuyến trong editor — 24/10/2026

## Kết quả

Luồng đã phân nhánh: Sandbox → cú pháp/thực thi/cấu trúc được giải thích trực tiếp từ bằng chứng → chỉ chạy AI logic khi chương trình thực thi thành công nhưng sai output → bài đúng hiển thị hoàn thành. Không gọi model để suy đoán lại dòng cú pháp hoặc bình luận thêm thuật toán khi syntax còn sai.

- Python harness ghi metadata SyntaxError thực tế: line/offset/end_line/end_offset và thông điệp, gắn filename `<submission>`. Dịch thành 1–2 câu tiếng Việt theo loại lỗi, không phụ thuộc provider.
- JavaScript không bị chặn bằng mã lỗi Acorn làm mất vị trí nữa; sandbox precompile với filename submission.js. C++ vẫn dùng compiler EC2; khi có xung đột cú pháp/cấu trúc, cho compiler báo cú pháp trước. Không chuyển provider hoặc chạy mã học viên cục bộ.
- Guidance có `analysisKind` và `diagnostic` có kiểu, gồm nguồn, loại, dòng/cột/phạm vi và thông điệp. Không dùng `/work/main.py` của harness hoặc hidden stderr làm vị trí học viên.
- AI logic giới hạn reason/hint tối đa hai câu, mỗi phần lần lượt <=180/160 ký tự. Muốn inline phải có confidence high, đoạn code trích nguyên văn khớp duy nhất tại dòng được báo và testcase công khai sai. Thiếu bằng chứng/chỉ test ẩn/chưa chắc thì không có diagnostic; vẫn có nhận xét trong card.
- Monaco có một marker đỏ cho syntax hoặc vàng cho logic và một view zone chứa giải thích dưới dòng lỗi. Zone dành không gian thật, không overlay lên mã, dùng textContent để không thực thi HTML trong thông điệp. ResizeObserver tự đo chiều cao khi hẹp màn hình. Không thêm thư viện.
- Marker và zone được dọn ngay khi sửa mã, đổi model/bài, nộp lại hoặc unmount. Guard submission ID/sequence và hủy request cũ vẫn giữ nguyên.

Đối chiếu API editor với [tài liệu markers của Monaco](https://microsoft.github.io/monaco-editor/typedoc/functions/editor_editor_api.editor.setModelMarkers.html) và [IStandaloneCodeEditor](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor_editor_api.editor.IStandaloneCodeEditor.html), đồng thời kiểm tra type definitions của phiên bản đang cài. Kỹ năng UI/UX được dùng cho cách đặt thông báo sát lỗi, aria-live và tránh che/tràn mã.

## Kiểm thử

| Nhóm | Kết quả |
| --- | --- |
| Backend parser/guidance/adaptive/EC2 | 54/54, ~0.52s |
| Frontend range, zone cleanup, card SSR, stale response | 4/4, ~2.91s |
| Mascot hồi quy | 4/4, ~0.22s |
| AI validator/provider/service | 12/12, ~2.49s cả process |
| Backend TypeScript | Đạt |
| Frontend production build | Đạt; cảnh báo bundle lớn sẵn có |
| ESLint editor/helper mới | Đạt |

Bao phủ range Unicode/codepoint→UTF16, zero-width SyntaxError, không nhận dòng harness/ẩn/sai phạm vi, không đánh dấu logic low-confidence hoặc excerpt không khớp, không gọi model cho runtime/syntax/constraint/system/success, timeout fallback còn hoạt động, cleanup marker/zone khi edit/model switch và từ chối snapshot cũ.

Trong kiểm chứng phát hiện hai điểm cần sửa có nguyên nhân cụ thể: assertion Acorn cũ trái hợp đồng mới (syntax phải đến sandbox) được cập nhật; regex SyntaxError dùng chung đã bắt nhầm stderr JS như Python và được phân biệt theo filename JS trước. Sau sửa, các suite liên quan đạt; không giảm tiêu chí hoặc bỏ test lỗi.

## Kiểm thử thực tế

Tài khoản QA riêng reliability_qa_*, không sử dụng tài khoản học viên. Các bài Python gửi qua API authenticated và chấm Docker EC2; JS/C++ kiểm thử trực tiếp runner EC2 không tạo bài hoặc evidence học viên.

- `print("Hello)` → Sandbox SyntaxError, dòng 1 cột 7; nội dung: “Thiếu dấu \" để đóng chuỗi. Đóng chuỗi trước khi kết thúc câu lệnh.” Không kèm nhận xét thiếu vòng for.
- JavaScript chuỗi chưa đóng → dòng 1 cột 13 từ stderr Node.
- C++ chuỗi chưa đóng → dòng 2 cột 27 từ compiler, dù specification còn yêu cầu for; không ưu tiên sai nhánh constraint.
- Chương trình duyệt chuỗi nhưng thân chỉ có pass → AI thật trả hai câu, xác định dòng 3 bằng trích đoạn code; UI gạch vàng và hiển thị gợi ý ngay dưới dòng 3.
- Bài đúng → 6/6 testcase, thông báo hoàn thành không chờ model; không có diagnostic.

Trên UI thật: nhập qua Monaco, nhấn Nộp bài; quan sát 1 gạch đỏ + 1 thông báo ở dòng 1/cột 7. Sau sửa và nộp logic, gạch đỏ cũ bằng 0, có 1 gạch vàng tại dòng 3. Sau sửa đúng và nộp lại: annotation/red/warning đều 0. Viewport 375: editor rộng 314px; nội dung inline cao 104px, zone cao 114px, không tràn ngang; đã reset viewport. Editor giữ theme vs-dark sẵn có.

## Bằng chứng / phạm vi

- `measurements/inline-diagnostics-2026-10-24.json`: kết quả API/EC2, nhận xét AI thật, stderr của các mã QA.
- `measurements/inline-syntax-ui-2026-10-24.png`: gạch đỏ + giải thích sát code.
- `measurements/inline-logic-ui-2026-10-24.png`: gạch vàng + AI hai câu.
- `measurements/inline-mobile-ui-2026-10-24.png`: giải thích tự xuống dòng và dành đủ không gian.

Backend chính :3000 và QA :3001, AI QA :8001 đã nạp bản sửa; frontend dev dùng code hiện tại. Không deploy lên hosting từ xa, không thay asset thỏ hoặc logic sinh bài. SQL không có tọa độ đáng tin từ SQLite hiện tại thì không tạo marker tùy tiện. Vị trí logic là nhận xét AI có kiểm tra bằng chứng nguồn, không được coi như tọa độ chắc chắn do compiler cung cấp; trường hợp không đủ độ chắc chắn giữ ở card, không inline.
