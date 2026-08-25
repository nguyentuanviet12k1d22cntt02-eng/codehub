# 🚀 KẾ HOẠCH TRIỂN KHAI HỆ THỐNG (DEPLOYMENT BLUEPRINT)

> **Dự án:** Nền tảng Học lập trình & Thực hành trực tuyến (LearnPython / CodeHub)  
> **Phiên bản:** 1.0 (Core MVP: Frontend + Backend API + Database + Code Sandbox Runner)  
> **Mục tiêu:** Triển khai sản phẩm hoàn chỉnh, chấm bài tập tự động mượt mà, hoạt động bền vững với chi phí 0 VNĐ (hoặc VPS giá rẻ).

---

## 🏛️ 1. Kiến Trúc Triển Khai Tổng Quan

Hệ thống được thiết kế theo mô hình **Cloud Phân Tán (Decoupled Cloud Architecture)** giúp tối ưu hóa chi phí, bảo mật và khả năng chịu tải:

```text
                               ┌──────────────────────────────────────────┐
                               │             NGƯỜI DÙNG                   │
                               │      (Trình duyệt Web / Mobile)          │
                               └────────────────────┬─────────────────────┘
                                                    │
                         Truy cập giao diện Web     │
                                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. FRONTEND LAYER                                                                                      │
│    👉 Nền tảng: VERCEL (Miễn phí 100%)                                                                │
│    👉 Công nghệ: React 18 + Vite + Tailwind CSS + Monaco Code Editor                                  │
│    👉 Nhiệm vụ: Hiển thị lý thuyết, giao diện trắc nghiệm củng cố, trình soạn thảo code lập trình.     │
└───────────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                    │ Gọi API RESTful (HTTPS)
                                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. BACKEND & CODE SANDBOX LAYER                                                                        │
│    👉 Nền tảng: RENDER.COM / RAILWAY (Gói Free Web Service Docker)                                      │
│    👉 Công nghệ: Node.js 20 + Express + TypeScript + Python 3 (Runner) + SQLite In-Memory               │
│    👉 Nhiệm vụ:                                                                                        │
│       • Xử lý xác thực JWT, bảo mật người dùng.                                                        │
│       • Phục vụ nội dung bài học, câu hỏi trắc nghiệm.                                                 │
│       • Bộ máy Sandbox (sql_runner.py & python_runner): Thực thi câu lệnh SQL/Python, so khớp testcase │
│         và chấm điểm tự động trong vòng < 50ms (có cơ chế Timeout 5s chống treo server).               │
└───────────────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                                    │ Kết nối Prisma ORM (Port 5432/6543)
                                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. DATABASE LAYER                                                                                      │
│    👉 Nền tảng: SUPABASE (PostgreSQL Cloud Miễn phí 100%)                                              │
│    👉 Nhiệm vụ: Lưu trữ bảng User, Course, Module, Chapter, Lesson, QuizQuestion, Exercise, Submission│
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 2. Bảng Phân Tích & So Sánh Chi Phí

| Thành phần | Nền tảng khuyến nghị | Chi phí hàng tháng | Lý do lựa chọn |
| :--- | :--- | :---: | :--- |
| **Frontend** | **Vercel** | **0 VNĐ (Free)** | Băng thông CDN toàn cầu siêu nhanh, tích hợp CI/CD tự động với GitHub. |
| **Database** | **Supabase** | **0 VNĐ (Free)** | Cung cấp 500MB PostgreSQL, giao diện quản lý bảng trực quan, bảo mật cao. |
| **Backend & Sandbox** | **Render.com / Railway** | **0 VNĐ (Free)** | Hỗ trợ chạy Docker container có sẵn môi trường Python & SQLite để chấm code. |
| **AI Service (Tương lai)** | **In-House Router / Cloud API** | **0 VNĐ – Rất rẻ** | Tích hợp AI Router nội bộ gọi Gemini Flash / Groq qua API key miễn phí. |

---

## 🛠️ 3. Kế Hoạch Thực Hiện Từng Bước (Step-by-Step Roadmap)

### BƯỚC 1: Khởi Tạo Database PostgreSQL Trên Supabase
1. Truy cập [https://supabase.com](https://supabase.com) $\rightarrow$ Đăng nhập bằng GitHub.
2. Bấm **New Project** $\rightarrow$ Đặt tên dự án (ví dụ: `codehub-db`) $\rightarrow$ Nhập mật khẩu Database.
3. Vào **Project Settings** $\rightarrow$ **Database** $\rightarrow$ Copy chuỗi **Connection String (URI / Session Mode)**:
   ```text
   postgresql://postgres.[PROJECT_ID]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
4. Kiểm tra và đồng bộ cấu trúc bảng từ máy local:
   * Mở file `backend/.env`, cập nhật: `DATABASE_URL="chuỗi_supabase_vừa_copy"`
   * Chạy lệnh đẩy bảng:
     ```bash
     cd backend
     npx prisma db push
     ```
   * Chạy lệnh nạp toàn bộ khóa học & bài tập SQL:
     ```bash
     npx ts-node src/scripts/seed_sql_course.ts
     ```

---

### BƯỚC 2: Triển Khai Backend & Sandbox Lên Render.com
*(Do Backend cần môi trường chạy tiến trình Python `sql_runner.py` để chấm bài)*

1. Truy cập [https://render.com](https://render.com) $\rightarrow$ Đăng nhập bằng GitHub.
2. Chọn **New +** $\rightarrow$ **Web Service** $\rightarrow$ Chọn Repository `LearnPython` của bạn.
3. Thiết lập các thông số cơ bản:
   * **Name**: `codehub-backend`
   * **Root Directory**: `backend`
   * **Runtime / Environment**: `Docker` *(Render sẽ tự động đọc `backend/Dockerfile` có chứa Node.js + Python + SQLite)*
   * **Instance Type**: `Free`
4. Cấu hình **Environment Variables (Biến môi trường)**:
   * `DATABASE_URL`: `postgresql://postgres.[PROJECT_ID]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   * `PORT`: `3000`
   * `JWT_SECRET`: `your_super_secret_jwt_key_2026`
   * `NODE_ENV`: `production`
5. Bấm **Create Web Service**. Sau 2-3 phút, bạn sẽ nhận được đường dẫn API dạng:
   ```text
   https://codehub-backend.onrender.com
   ```

---

### BƯỚC 3: Triển Khai Frontend Lên Vercel
1. Truy cập [https://vercel.com](https://vercel.com) $\rightarrow$ Bấm **Add New...** $\rightarrow$ **Project**.
2. Chọn Repository `LearnPython` $\rightarrow$ Bấm **Import**.
3. Cấu hình dự án trên Vercel:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click **Edit** $\rightarrow$ Chọn thư mục `frontend`.
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Cấu hình **Environment Variables**:
   * `VITE_API_URL`: `https://codehub-backend.onrender.com` *(Link backend lấy từ Bước 2)*
5. Bấm **Deploy**. Sau ~1 phút, bạn sẽ có trang web chạy trực tiếp tại:
   ```text
   https://codehub-learning.vercel.app
   ```

---

## 🔒 4. Cơ Chế Đảm Bảo Hệ Thống Không Bao Giờ Sập

1. **Bộ Đệm Cách Ly Chống Treo Server (Sandbox Safety Guard)**:
   * Mọi bài nộp code của học viên đều được chạy trong tiến trình cô lập với cờ giới hạn thời gian **Timeout = 5000ms (5 giây)**.
   * Dù học viên cố tình viết vòng lặp vô tận `while True: pass` hay câu lệnh SQL tạo bảng khổng lồ, hệ thống sẽ tự động ngắt kết nối và trả về thông báo lỗi `Timeout` an toàn, không chiếm dụng tài nguyên máy chủ.
2. **Không Gian Dữ Liệu Tạm Thời (In-Memory Isolation)**:
   * Mỗi bài nộp SQL được khởi tạo một Database ảo trong RAM và hủy bỏ ngay sau khi xuất kết quả. Lệnh `DROP TABLE` hay `DELETE` của học viên không bao giờ tác động đến Database chính trên Supabase.
3. **Cơ Chế Kháng Lỗi Dịch Vụ AI (Fault-Tolerant)**:
   * Dịch vụ AI được thiết kế dạng bất đồng bộ có `try...catch` và `Fallback Rules`. Nếu phần AI tạm thời mất mạng, hệ thống vẫn phục vụ việc học lý thuyết, làm trắc nghiệm và chấm code thực hành 100% bình thường.

---

## 💡 5. Lộ Trình Phát Triển Tính Năng AI Tiếp Theo (Giai Đoạn 2)

Khi hệ thống cốt lõi (Frontend + Backend + Sandbox) đã chạy ổn định trên Production, chúng ta sẽ mở rộng tính năng AI theo mô hình **In-House AI Router**:
* **Không cần cài Omniroute bên ngoài**: Tích hợp trực tiếp module AI Router vào Backend.
* **Xoay vòng Key (Key Rotation)**: Tự động đổi giữa các API Key miễn phí (Google Gemini, Groq, OpenRouter).
* **Bộ nhớ đệm câu trả lời (Semantic Caching)**: Lưu lại các phân tích lỗi SQL phổ biến vào Supabase, giúp phản hồi tức thì và tiết kiệm 90% chi phí gọi AI.

---

*Tài liệu được lập ngày 25/08/2026 - Antigravity Engineering Team.*
