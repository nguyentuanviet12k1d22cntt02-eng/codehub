# Cấu trúc Thư mục Dự án LearnPython

Tài liệu này mô tả chi tiết cấu trúc thư mục của toàn bộ dự án `LearnPython`, bao gồm cả **Backend (Node.js + Express + Prisma)** và **Frontend (React + Vite + TypeScript)**.

---

## 1. Sơ đồ Cấu trúc Tổng quan

```text
LearnPython/
│
├── backend/                             # --- THƯ MỤC BACKEND ---
│   ├── prisma/
│   │   └── migrations/                  # Lịch sử thay đổi Database (tự động sinh khi chạy migrate)
│   │       └── 20260522073004_init/
│   │           └── migration.sql        # File SQL tạo bảng trong cơ sở dữ liệu
│   │
│   ├── src/                             # Mã nguồn chính của Backend
│   │   ├── config/                      # Nơi cấu hình hệ thống (Database client, các thiết lập...)
│   │   │   └── (trống)                  # -> Bạn sẽ tạo file prisma.ts ở đây để khởi tạo Prisma Client
│   │   │
│   │   ├── controllers/                 # Nơi xử lý logic nghiệp vụ (Business Logic)
│   │   │   └── controller.ts            # Các API xử lý Đăng nhập/Đăng ký (đang sử dụng mock data)
│   │   │
│   │   ├── middlewares/                 # Các middleware chặn/xử lý request (Auth, validate...)
│   │   │   └── (trống)
│   │   │
│   │   ├── prisma/                      # Cấu hình Prisma và Database Schema
│   │   │   └── schema.prisma            # File định nghĩa các bảng (models) và mối quan hệ database
│   │   │
│   │   ├── routes/                      # Định nghĩa các Route (Endpoint API)
│   │   │   └── routes.ts                # Định nghĩa các route POST /register, POST /login...
│   │   │
│   │   ├── services/                    # Các service phụ trợ (Email, File Upload...)
│   │   │   └── (trống)
│   │   │
│   │   ├── .env                         # Biến môi trường cục bộ cho thư mục src
│   │   ├── prisma.config.ts             # Cấu hình phụ của Prisma 7
│   │   └── app.ts                       # Entry Point (Khởi chạy Express server)
│   │
│   ├── .env                             # File cấu hình biến môi trường chính (DATABASE_URL, PORT...)
│   ├── .gitignore                       # Chỉ định các thư mục không đưa lên GitHub (node_modules, .env...)
│   ├── package.json                     # Danh sách thư viện và các script chạy backend
│   ├── prisma.config.ts                 # Cấu hình Prisma chính
│   └── tsconfig.json                    # Cấu hình trình biên dịch TypeScript cho Backend
│
└── frontend/                            # --- THƯ MỤC FRONTEND ---
    ├── public/                          # Thư mục chứa tài nguyên tĩnh (logo, favicon...) công khai
    ├── src/                             # Mã nguồn chính của Frontend (React)
    │   ├── assets/                      # Hình ảnh, icon, font chữ sử dụng trong ứng dụng
    │   ├── components/                  # Các UI Components nhỏ có thể tái sử dụng (Button, Input, Form...)
    │   ├── pages/                       # Các trang chính hiển thị trên trình duyệt
    │   │   └── (trống)                  # -> Bạn sẽ tạo Login.tsx và Register.tsx tại đây
    │   │
    │   ├── services/                    # Hàm gọi API gửi/nhận dữ liệu sang Backend
    │   │   └── (trống)                  # -> Bạn sẽ tạo authService.ts để xử lý gọi API Đăng nhập/Đăng ký
    │   │
    │   ├── store/                       # Quản lý State toàn cục (Zustand, Redux, Context API)
    │   ├── utils/                       # Các helper function (format ngày tháng, tiền tệ, regex...)
    │   ├── App.css                      # Styling riêng cho App component
    │   ├── App.tsx                      # Component gốc của ứng dụng React
    │   ├── index.css                    # Styling toàn cục (Global CSS)
    │   └── main.tsx                     # File gốc liên kết React với thẻ HTML
    │
    ├── index.html                       # File HTML duy nhất để React render giao diện
    ├── package.json                     # Danh sách thư viện và script chạy frontend
    ├── vite.config.ts                   # Cấu hình Vite bundler
    └── tsconfig.json                    # Cấu hình TypeScript cho Frontend
```

---

## 2. Các vị trí cần chỉnh sửa/tạo mới để làm chức năng Đăng ký & Đăng nhập

Dưới đây là tóm tắt các vị trí bạn cần viết mã khi thực hành tự làm tính năng Xác thực (Authentication):

### A. Phía Backend
1. **`backend/src/config/prisma.ts`**: Tạo mới file này để khởi tạo và export `PrismaClient` làm kết nối chính.
2. **`backend/src/controllers/controller.ts`**: Chuyển đổi logic từ mảng `users` ảo sang truy vấn cơ sở dữ liệu bằng `PrismaClient` (`prisma.user.findUnique`, `prisma.user.create`).
3. **`backend/src/app.ts`**: Tải thư viện `cors` và khai báo `app.use(cors())` để cấp quyền cho Frontend gọi API.

### B. Phía Frontend
1. **`frontend/src/services/authService.ts`**: Tạo mới để viết các hàm gửi HTTP Request (bằng `axios` hoặc `fetch`) kết nối đến API Đăng nhập & Đăng ký của Backend.
2. **`frontend/src/pages/Register.tsx`** & **`Login.tsx`**: Tạo giao diện form, lưu trạng thái người dùng nhập vào bằng `useState`, và gọi các hàm trong `authService.ts` khi gửi form.
3. **`frontend/src/App.tsx`**: Cài đặt React Router (`react-router-dom`) để định nghĩa đường dẫn chuyển trang cho `/login` và `/register`.
