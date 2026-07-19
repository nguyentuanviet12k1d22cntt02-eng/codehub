# Quy Trình Làm Việc Với Git & Quản Lý Phiên Bản

Tài liệu này hướng dẫn quy trình chuẩn để quản lý mã nguồn, tạo tính năng mới và quay lại các phiên bản cũ một cách an toàn và chuyên nghiệp trong dự án **LearnPython**.

---

## 1. Mô hình Phân Nhánh (Branching Strategy)
Để tránh làm hỏng code đang chạy ổn định, chúng ta sử dụng mô hình phân nhánh đơn giản:

*   **Nhánh `main`**: Nhánh chính chứa code chạy ổn định nhất (đã test kỹ và deploy). **Không code trực tiếp trên nhánh này.**
*   **Nhánh `feature/*`**: Các nhánh phụ dùng để phát triển các tính năng hoặc sửa lỗi cụ thể (ví dụ: `feature/react-query`, `feature/practice-workspace`, `bugfix/login-error`).

### Quy trình tạo tính năng mới:
1.  Chuyển về nhánh `main` và cập nhật code mới nhất từ GitHub:
    ```bash
    git checkout main
    git pull origin main
    ```
2.  Tạo nhánh mới để làm việc:
    ```bash
    git checkout -b feature/ten-tính-năng
    ```
3.  Thực hiện code và commit trên nhánh này.

---

## 2. Quy Tắc Commit Code
Nên chia nhỏ quá trình code thành nhiều commit có nghĩa. Mỗi commit đại diện cho một phần việc hoàn thành.

*   **Xem trạng thái các file thay đổi:**
    ```bash
    git status
    ```
*   **Thêm file vào hàng chờ (Staging Area):**
    ```bash
    git add .
    ```
*   **Commit code với thông điệp rõ ràng:**
    ```bash
    git commit -m "feat: tích hợp tanstack query vào trang dashboard"
    ```
    *(Tiền tố khuyên dùng: `feat:` cho tính năng mới, `fix:` sửa lỗi, `refactor:` tối ưu code, `docs:` viết tài liệu)*.

---

## 3. Cách Quay Lại Phiên Bản Cũ (Rollback / Checkout)

Khi bạn muốn xem lại hoặc khôi phục code về một thời điểm trước đó:

### Trường hợp A: Chỉ muốn xem thử hoặc chạy thử code cũ (Chỉ đọc)
1.  Xem lịch sử các commit để lấy mã hash (ví dụ: `7a1b2c3`):
    ```bash
    git log --oneline
    ```
2.  Chuyển code về thời điểm commit đó:
    ```bash
    git checkout 7a1b2c3
    ```
3.  Khi xem xong và muốn quay lại code mới nhất trên nhánh hiện tại:
    ```bash
    git checkout main
    # Hoặc tên nhánh bạn đang làm việc
    ```

### Trường hợp B: Muốn bỏ các thay đổi đang viết dở (Chưa commit) để khôi phục về trạng thái sạch gần nhất
*   Khôi phục một file cụ thể:
    ```bash
    git checkout -- path/to/file.tsx
    ```
*   Khôi phục toàn bộ thư mục về commit gần nhất:
    ```bash
    git reset --hard HEAD
    ```
    *⚠️ Lưu ý: Lệnh này sẽ xóa vĩnh viễn các thay đổi chưa được commit.*

### Trường hợp C: Tạo một nhánh mới từ một commit cũ để tiếp tục phát triển
Nếu bạn nhận ra code hiện tại bị đi sai hướng và muốn quay lại làm tiếp từ commit cũ `7a1b2c3`:
```bash
git checkout -b feature/lam-lai-tu-dau 7a1b2c3
```

### Trường hợp D: Xóa bỏ hoàn toàn commit lỗi cuối cùng sau khi đã push lên GitHub
*   Cách an toàn (Tạo commit đảo ngược, lịch sử commit vẫn giữ nguyên):
    ```bash
    git revert HEAD
    git push origin main
    ```
*   Cách đè lịch sử (Chỉ dùng khi làm việc 1 mình và cực kỳ chắc chắn):
    ```bash
    git reset --hard HEAD~1
    git push origin main --force
    ```

---

## 4. Sử Dụng Tag Đánh Dấu Phiên Bản Quan Trọng
Khi hệ thống chạy ổn định và đạt các mốc lớn (Release):

*   **Tạo tag phiên bản mới:**
    ```bash
    git tag -a v1.0.0 -m "Phiên bản ổn định đầu tiên chạy trên Supabase"
    ```
*   **Đẩy tag lên GitHub:**
    ```bash
    git push origin v1.0.0
    ```
*   **Chuyển toàn bộ code về đúng phiên bản v1.0.0 bất cứ lúc nào:**
    ```bash
    git checkout v1.0.0
    ```

---

## 5. Công Cụ Trực Quan Khuyên Dùng
Nếu không muốn gõ lệnh terminal phức tạp:
1.  **Git Graph (Extension VS Code):** Cài đặt extension này để xem lược đồ commit, lịch sử nhánh bằng giao diện đồ họa. Bạn chỉ cần click chuột để checkout, merge hoặc revert.
2.  **GitHub Desktop:** Phần mềm miễn phí hỗ trợ quản lý commit, nhánh, stash code dở và chuyển đổi phiên bản rất dễ dàng bằng giao diện kéo thả.
