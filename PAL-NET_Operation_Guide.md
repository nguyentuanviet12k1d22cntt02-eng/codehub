# Hướng Dẫn Vận Hành Hệ Thống Gợi Ý Học Tập PAL-Net
Tài liệu hướng dẫn triển khai, vận hành, kiểm thử và xử lý sự cố cho phân hệ AI Gợi ý học tập thích ứng (Adaptive Recommender System) của nền tảng LearnPython.

---

## 1. Tổng Quan Kiến Trúc Hệ Thống

Hệ thống được thiết kế theo mô hình **Microservices** tách biệt tài nguyên tính toán AI khỏi nghiệp vụ cốt lõi:
1. **Core Backend (Node.js/Express.js)**: Chạy tại cổng `3000`. Xử lý xác thực người dùng, lưu mã nguồn bài tập, ghi nhận trạng thái thông qua PostgreSQL (Prisma ORM) và cung cấp API tổng hợp cho Frontend.
2. **AI Service (FastAPI/PyTorch/SciPy)**: Chạy tại cổng `8000`. Lưu trữ đồ thị tri thức (`skill_graph.json`), nạp trực tiếp bộ tham số BKT và trọng số nơ-ron mạng DKT, PAL-Net để thực hiện suy diễn (inference) thời gian thực.

```mermaid
graph LR
    User[Học viên] <--> Backend[Express.js Backend <br> Port 3000]
    Backend -- 1. Truy vấn tiến trình học tập --> DB[(PostgreSQL <br> Supabase)]
    Backend -- 2. Gọi API suy diễn gợi ý <br> /recommend?user_id & algo & limit --> AIService[AI Service FastAPI <br> Port 8000]
    AIService -- 3. Đọc mẫu lịch sử --> DB
    AIService -- 4. Trả về kết quả dự đoán --> Backend
```

---

## 2. Các Kiến Thức Thành Phần (Knowledge Components) & Đồ Thị Tri Thức

Đồ thị tri thức được cấu hình trong `ai-service/data/skill_graph.json` định nghĩa **7 kỹ năng cơ bản** của ngôn ngữ Python theo thứ tự tiến trình khóa học:

| KC ID | Tên Kỹ Năng / Khái Niệm | Mô Tả | Bài Học Mã Hóa (Ví dụ) |
|---|---|---|---|
| `KC_VAR` | Variables & Types | Khai báo biến, hằng, phân biệt kiểu dữ liệu nguyên thủy | `LS-01.01` đến `LS-01.07` |
| `KC_COND` | Conditional Statements | Biểu thức Logic, cấu trúc rẽ nhánh `if-elif-else` | `LS-02.01` đến `LS-02.03` |
| `KC_LOOP` | Loops & Control Flow | Vòng lặp `for`, `while`, điều hướng `break`, `continue` | `LS-02.04` đến `LS-02.07` |
| `KC_LIST` | Lists & Sequences | Thao tác với cấu trúc danh sách, lập chỉ mục và cắt lát | `LS-03.01` đến `LS-03.05` |
| `KC_DICT` | Dictionaries & Sets | Thao tác với cấu trúc dữ liệu khóa-giá trị, tập hợp | `LS-03.06` đến `LS-03.08` |
| `KC_FUNC` | Functions & Modules | Định nghĩa hàm, tham số đầu vào, phạm vi biến và import tự tạo | `LS-04.01` đến `LS-04.05` |
| `KC_OOP` | Object-Oriented Programming | Định nghĩa Lớp (Class), Thuộc tính, Đối tượng, Kế thừa | `LS-05.01` đến `LS-05.05` |

---

## 3. Cài Đặt và Khởi Tạo Môi Trường

### Bước 3.1. Đối với Core Backend (Node.js)
1. Đảm bảo cấu hình biến môi trường tại `.env` trong thư mục `backend/`:
   ```env
   PORT=3000
   JWT_SECRET=mykey
   DATABASE_URL="postgresql://username:password@host:port/database"
   AI_SERVICE_URL="http://localhost:8000"
   ```
2. Cài đặt các package của Node.js:
   ```bash
   cd backend
   npm install
   ```

### Bước 3.2. Đối với AI Service (Python)
1. Cài đặt Python (khuyến nghị phiên bản 3.10 đến 3.14).
2. Tạo môi trường ảo và cài đặt thư viện phụ thuộc:
   ```bash
   cd ai-service
   python -m venv venv
   .\venv\Scripts\activate   # Trên Windows
   pip install -r requirements.txt
   ```
   *Lưu ý*: Các thư viện chính bao gồm `fastapi`, `uvicorn`, `torch`, `pandas`, `scikit-learn`, `psycopg2-binary`, `requests`, `python-dotenv`.

---

## 4. Quản Lý Dữ Liệu & Huấn Luyện Mô Hình ML

Hệ thống cung cấp sẵn các script điều phối dữ liệu học tập mô phỏng để vượt qua rào cản khởi động lạnh (Cold-Start Problem).

### Bước 4.1. Sinh dữ liệu mô phỏng và nạp PostgreSQL
Chạy script sinh dữ liệu học tập tự động của 120 học viên (tạo ra khoảng ~12,000 tương tác):
```bash
python scripts/mock_data_generator.py --seed-db
```
*Script này sẽ thực hiện:*
- Tạo 120 tài khoản học viên dạng `mock_student_XXX@learnpython.edu` với mật khẩu xác thực mặc định là `123456` (được băm đồng bộ bằng `$2b$` tương tự bcryptjs của Node.js).
- Tạo dữ liệu lịch sử nộp bài mô phỏng ngẫu nhiên theo xác suất phân phối của bài học.
- Tự động xóa lịch sử mô phỏng cũ và chèn hàng loạt (Bulk Insert) để duy trì hiệu năng tối ưu của PostgreSQL.

### Bước 4.2. Huấn luyện các mô hình AI

Sau khi nạp dữ liệu thành công vào database, tiến hành huấn luyện các mô hình ML để cập nhật tham số độ chính xác:

1. **Huấn luyện mô hình BKT (Bayesian Knowledge Tracing)**:
   ```bash
   python scripts/train_bkt.py
   ```
   *Kết quả*: Lưu tham số học tập $L_0, T, S, G$ của 7 KCs tại `ai-service/data/bkt_parameters.json`.

2. **Huấn luyện mô hình DKT (Deep Knowledge Tracing - LSTM)**:
   ```bash
   python scripts/train_dkt.py
   ```
   *Kết quả*: Lưu tệp trọng số LSTM học tập tại `ai-service/data/dkt_model.pth`.

3. **Huấn luyện mô hình PAL-Net (Personalized Adaptive Learning Network - GCN & Attention)**:
   ```bash
   python scripts/train_palnet.py
   ```
   *Kết quả*: Lưu tệp trọng số kết nối Graph Convolution, Learner Profiler và Attention tại `ai-service/data/palnet_model.pth`.

---

## 5. Khởi Chạy Dịch Vụ

Khởi động các dịch vụ trên hai cửa sổ terminal độc lập:

1. **Khởi chạy AI Service (FastAPI)**:
   ```bash
   cd ai-service
   python -m uvicorn main:app --port 8000 --host 0.0.0.0
   ```
   *Dịch vụ sẽ tự động tải các tệp trọng số tại thư mục `data/` trong quá trình khởi động.*

2. **Khởi chạy Core Backend (Express)**:
   ```bash
   cd backend
   npx ts-node src/app.ts
   ```

---

## 6. Đặc Tả Endpoint & API Gợi Ý

### 6.1. Endpoint AI Service (Nội bộ / localhost:8000)

* **`GET /recommend`**: Tạo danh sách bài tập đo lường theo vùng ZPD.
  - **Tham số Query**:
    - `user_id` (UUID - Bắt buộc): Mã số học viên.
    - `algo` (BKT, DKT, hoặc PAL-Net - Mặc định PAL-Net): Thuật toán suy diễn.
    - `limit` (Hằng số nguyên - Mặc định 5): Số lượng phần tử gợi ý tối đa.
  - **Phản hồi mẫu**:
    ```json
    [
      {
        "id": "c32fa1b4-e57f-4a5d-be68-61d9ebd783c8",
        "type": "LESSON_EXERCISE",
        "title": "Cập nhật ví tiết kiệm",
        "kc_id": "KC_VAR",
        "predicted_mastery": 0.7028,
        "zpd_score": 0.9278,
        "difficulty": "EASY"
      }
    ]
    ```

* **`GET /model-status`**: Trả về tình trạng sức khỏe các mô hình AI.
* **`POST /train`**: Cho phép trigger huấn luyện lại các mô hình ML ngay lập tức thông qua gọi API nội bộ bằng tham số query `model_type` (`all`, `BKT`, `DKT`, `PAL-Net`).

### 6.2. Endpoint Core Backend (Ngoại vi / localhost:3000)

* **`GET /api/auth/recommendations`**: Phục vụ tương tác gợi ý từ Frontend.
  - **Headers**: `Authorization: Bearer <JWT_Token>`
  - **Tham số Query**: `algo` (Mặc định: `PAL-Net`), `limit` (Mặc định: `5`)
  - **Phản hồi thành công**:
    ```json
    {
      "success": true,
      "engine": "PAL-Net",
      "data": [
        {
          "id": "c32fa1b4-e57f-4a5d-be68-61d9ebd783c8",
          "type": "LESSON_EXERCISE",
          "title": "Cập nhật ví tiết kiệm",
          "kc_id": "KC_VAR",
          "predicted_mastery": 0.7028,
          "zpd_score": 0.9278,
          "difficulty": "EASY"
        }
      ]
    }
    ```

---

## 7. Cơ Chế Tự Động Giải Cứu Lỗi (Fallback Mechanism)

Để đảm bảo hệ thống đạt tính sẵn sàng cao (**High Availability**), Express Backend cài đặt cơ chế tự động bảo vệ qua 2 lớp tại `recommendController.ts`:

1. **Giới hạn thời gian phản hồi (Inference Timeout Guardian)**:
   Sử dụng `AbortController` của JavaScript giới hạn thời gian phản hồi từ AI Service tối đa **3 giây**. Nếu AI Service phản hồi chậm hơn 3s, Express Backend tự động chủ động ngắt kết nối chặn hiện tượng treo luồng mạng (hanging process threads).
2. **Thuật toán giải cứu cơ sở luật (Local Rule-based Recommender)**:
   Khi ngắt kết nối do quá hạn phản hồi hoặc khi AI Service bị offline hoàn toàn (cổng 8000 sụp đổ):
   - Backend sẽ tự động bắt ngoại lệ (catch block).
   - Truy vấn danh sách toàn bộ các bài tập thực hành chưa nộp hoặc đã nộp nhưng ở trạng thái `FAILED`.
   - Lọc và xếp thứ hạng các bài tập theo thứ tự ưu tiên cấu trúc mục lục khóa học (Module Index $\rightarrow$ Chapter Index $\rightarrow$ Lesson Index).
   - Trả lại danh sách bài tập cho học viên với nhãn `"engine": "FALLBACK_RULE_BASED"`.
   - Học viên vẫn làm bài bình thường không gặp bất kỳ thông báo lỗi kỹ thuật nào.

---

## 8. Quy Trình Kiểm Thử Định Kỳ (Verification Checklist)

Để thực hiện kiểm tra kiểm thử liên tục (CI/CD hoặc vận hành định kỳ):

1. Đảm bảo uvicorn (FastAPI) và node (Express) đang chạy.
2. Thực thi script kiểm thử tích hợp:
   ```bash
   cd ai-service
   python scripts/test_recommendation.py
   ```
3. **Đọc đầu ra kiểm thử**:
   - `[Test 1]` Đăng nhập thành công học viên mô phỏng để lấy Token.
   - `[Test 2]`, `[Test 3]`, `[Test 4]` Trả về gợi ý có chỉ số `predicted_mastery` nằm trong ngưỡng phát triển ZPD $[0.70, 0.85]$ (hoặc lân cận tối ưu nhất) cho thuật toán tương ứng và bộ đếm `zpd_score` cao hơn.
   - `[Test 5]` Trình giả lập kích hoạt thành công `"engine": "FALLBACK_RULE_BASED"` khi tham số thuật toán bị sai lệch hoặc cổng mạng bị chặn.
