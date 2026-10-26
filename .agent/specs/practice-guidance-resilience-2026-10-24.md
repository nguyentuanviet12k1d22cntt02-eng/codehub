# Nhận xét bài làm luôn có kết quả hữu ích

## Phân tích trước triển khai

Luồng hiện tại: EC2 chấm → trả kết quả (không nhận xét) → trình duyệt gọi `/practice-guidance` → AI. Backend timeout 30s, AI ngân sách 25s; mọi lỗi AI thành HTTP 503. Trình duyệt không đặt timeout và chỉ chấp nhận `source: AI`, nên hết cơ hội nhận xét là rơi vào khung lỗi mặc định. Không có đường dự phòng dù đã có code và bằng chứng chấm hợp lệ.

## Phương án

- Trả nhận xét ngắn dựa trên bằng chứng ngay trong kết quả chấm. Phân loại lỗi cấu trúc, cú pháp/thực thi, định dạng, sai output, chỉ sai test ẩn, thành công và lỗi hạ tầng. Không suy đoán nguyên nhân/line thiếu bằng chứng.
- AI tiếp tục phân tích cùng code và kết quả đã lưu; thành công thay bằng nhận xét AI. AI lỗi/quá tải/timeout/JSON lỗi vẫn trả nhận xét bằng chứng, nhãn nguồn rõ ràng, không giả lập model.
- Giao diện giữ phản hồi bằng chứng khi đang bổ sung AI hoặc dịch vụ phân tích mất kết nối; timeout hữu hạn; không buộc nộp lại chỉ để nhận gợi ý.
- Giữ kiểm tra chủ sở hữu, không lộ test ẩn/đáp án, không ghi đè lần nộp mới bằng phản hồi cũ. Không thay đổi mascot, grader hay logic sinh bài.

## Tiêu chí nghiệm thu

- [x] Mỗi kết quả chấm có hướng dẫn không rỗng, hữu ích theo bằng chứng hiện tại, không phụ thuộc AI.
- [x] AI hợp lệ dùng được; offline/429/503/timeout/nội dung sai đều có fallback và nguồn EVIDENCE.
- [x] Lỗi grader không quy cho học viên; không bịa dòng harness hay chi tiết test ẩn.
- [x] UI nhận cả hai nguồn, hiện hướng dẫn trong lúc phân tích và sau lỗi, giới hạn thời gian; kiểm tra stale response.
- [x] Kiểm thử nhanh, build và kiểm chứng API + UI thực tế; báo rõ phạm vi, không cam kết nhà cung cấp AI luôn sẵn sàng.

## Kết quả kiểm chứng

13 test backend riêng, 35 test hồi quy adaptive/sandbox, 2 test frontend phản hồi/SSR, 4 test mascot và 10 test AI đều đạt. TypeScript backend và frontend production build đạt. API QA với AI offline thật vẫn trả nhận xét EVIDENCE cho bốn bài qua EC2 (thiếu output/for, cú pháp dòng 1, đúng); online hai lần trả AI thật, bài sai chỉ dòng 3. UI thực hành xác nhận nhận xét khi offline, giữ nội dung khi AI đang phân tích thêm, rồi phản hồi AI đúng theo bản nộp mới. Nền sáng/tối và viewport 375px không tràn khung. Backend cục bộ :3000 đã khởi động lại; QA :3001 đã khôi phục AI bình thường. Chưa deploy từ xa.

Báo cáo: `reviews/ai-pipeline/practice-guidance-resilience-2026-10-24.md`.
