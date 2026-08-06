1. Luồng xử lý dữ liệu (Data Flow)
Bước 1: Gửi yêu cầu (Frontend)
Người dùng viết code trên trình duyệt (thường dùng các thư viện như Monaco Editor hoặc CodeMirror). Khi bấm "Chạy", Frontend sẽ đóng gói một payload gửi lên API bao gồm:

Mã nguồn (Source Code).

Ngôn ngữ lập trình (VD: python3).

ID bài tập (để hệ thống biết cần lôi bộ Testcase nào ra so sánh).

Bước 2: Tiếp nhận và Xếp hàng (Backend & Message Queue)

Backend nhận yêu cầu nhưng không chạy code ngay.

Yêu cầu được đẩy vào một Hàng đợi (Message Queue như Redis, RabbitMQ). Việc này đảm bảo nếu có 1,000 học sinh cùng bấm "Chạy" một lúc, máy chủ của bạn không bị quá tải. Hệ thống sẽ xử lý tuần tự hoặc song song tùy năng lực máy chủ.

Bước 3: Khởi tạo môi trường cách ly (Sandbox / Worker)

Một hệ thống Worker sẽ lấy nhiệm vụ từ Hàng đợi.

Worker này khởi tạo một môi trường Sandbox (thường là Docker Container hạng nhẹ). Đây là một "phòng giam" ảo, hoàn toàn cách ly với máy chủ vật lý bên ngoài.

Bước 4: Thực thi và Giám sát (Execution & Constraints)
Đoạn code được bơm vào Sandbox để chạy. Tại đây, hệ thống giám sát (Monitor) sẽ áp dụng "bàn tay sắt":

Time Limit (Giới hạn thời gian): Nếu code chạy quá 3 giây (thường do lặp vô hạn), ép dừng ngay lập tức.

Memory Limit (Giới hạn bộ nhớ): Không cho phép code ngốn quá 128MB RAM.

Network Restriction: Vô hiệu hóa toàn bộ kết nối Internet bên trong Sandbox để ngăn người dùng dùng code gọi API tải mã độc về.

System Call Restriction: Cấm các lệnh can thiệp hệ thống (như xóa file, format ổ cứng).

Bước 5: Đánh giá và Thu thập kết quả (Evaluation)

Hệ thống "chụp" lại toàn bộ những gì code in ra màn hình (stdout) và các lỗi văng ra (stderr).

Nếu đây là một bài tập (Exercise), hệ thống mang kết quả này so sánh với các Testcases đã định nghĩa sẵn để chấm điểm (Pass/Fail).

Bước 6: Dọn dẹp (Cleanup) & Trả kết quả

Ngay khi có kết quả, Sandbox (Docker Container) lập tức bị tiêu hủy để giải phóng tài nguyên RAM/CPU cho người tiếp theo.

Kết quả cuối cùng (kèm thông báo lỗi hoặc điểm số) được Backend gửi ngược lại cho Frontend hiển thị cho người học.