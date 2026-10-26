# Chẩn đoán bài thực hành ngay trong Monaco

## Nguyên nhân và phạm vi

Luồng nhận xét hiện tại có fallback theo kết quả chấm, nhưng không truyền range có kiểu dữ liệu cho editor, không đặt Monaco markers/view zones, và vẫn gọi AI cho syntax/runtime/constraint. Prompt cho phép 2–4 câu và trộn kiến thức khác trước khi sửa syntax. Python harness ast.parse chưa xuất vị trí cấu trúc; JavaScript parser chặn trước sandbox và làm mất vị trí.

## Phương án triển khai

1. Syntax từ sandbox được ưu tiên tuyệt đối: Python xuất metadata SyntaxError (line/offset/end); JS/C++ đọc compiler traceback đúng filename học viên. Dịch lỗi kỹ thuật thành tiếng Việt bằng quy tắc khớp lỗi, không gọi model đoán vị trí. Không dùng dòng harness, hidden stderr hoặc output do học viên in để xác định dòng.
2. Chỉ gọi AI logic khi thực thi thành công nhưng output không đạt. Phản hồi tối đa 2 câu; inline logic chỉ khi có dòng + trích đoạn khớp code + mức chắc chắn cao và bằng chứng công khai. Nếu chưa đủ, chỉ hiện nhận xét trong card, không đánh dấu editor. Runtime/constraint/system có phản hồi bằng chứng nhưng không phân tích logic.
3. Component editor dùng setModelMarkers và view zone nằm dưới dòng lỗi, không overlay lên code. Giới hạn một lỗi chính; syntax đỏ, logic vàng. Tự giải phóng marker/zone khi sửa mã, đổi bài/model, nộp lại hoặc unmount; giữ guard submission/sequence.
4. Giữ card thỏ và kết quả chấm; không thay sandbox provider hoặc chức năng sinh bài. Không cài thư viện mới.

## Nghiệm thu

- [x] Ví dụ print("Hello) trả syntax dòng/cột từ sandbox, tiếng Việt ngắn, không có nhận xét thiếu for/logic.
- [x] Không gọi AI cho syntax/runtime/constraint/success/system; logic chạy thành công mới gọi.
- [x] Marker đỏ + lời giải thích dưới đúng dòng trong UI thật; không che code, xóa khi chỉnh sửa.
- [x] Logic có bằng chứng vị trí mới highlight; thiếu/chỉ test ẩn không đánh dấu.
- [x] Test parser, Unicode/range, cleanup, provider contract, hồi quy và build đạt; kiểm thử thật Docker EC2 và UI; lưu báo cáo/nhật ký.

Kết quả: backend 54/54, frontend diagnostics/card 4/4 và mascot 4/4, AI 12/12. TypeScript/build và lint các thành phần mới đạt. API thật xác nhận Python dòng 1 cột 7, JavaScript dòng 1 cột 13, C++ dòng 2 cột 27; AI logic đúng dòng 3. UI xác nhận gạch đỏ/gạch vàng tương ứng, giải thích dưới dòng, tự xóa khi sửa; bài đúng 6/6 test và không còn marker. Báo cáo: `reviews/ai-pipeline/inline-diagnostics-2026-10-24.md`. Chỉ triển khai cục bộ, không deploy từ xa.
