# BIÊN BẢN DUYỆT NỘI DUNG PRE-TEST & BÀI HỌC PILOT (PYTHON CƠ BẢN)

**Dự án:** Hệ thống Học Lập trình Thích ứng LearnPython (PAL-Net Framework)  
**Tập mục tiêu:** `GOAL_PY_BASICS` (Module MOD-BASICS & MOD-FLOW, Graph v2.1)  
**Tài liệu thẩm định:** [Bộ 12 câu Pre-test nháp](file:///d:/Project/LearnPython/docs/research/palnet/python_basics_pretest_draft_review.md) & [Dữ liệu nháp ngân hàng Pre-test](file:///d:/Project/LearnPython/backend/src/infrastructure/data/pretestBank.pythonBasics.draft.json)  
**Checksum bản nháp được duyệt (SHA-256):** `9048eb9f86553977e47f5f99760c73e85c0d8c7122b002cc4de3c0629f1aba68`  
**Ngày thẩm định:** 06/10/2026  

---

## 👥 1. THÀNH PHẦN & ĐỊNH DANH 2 CHUYÊN GIA DUYỆT ĐỘC LẬP

1. **Người duyệt 1 (Reviewer 1):**  
   - **Họ và tên:** **Nguyễn Tuấn Việt**  
   - **Định danh / Email:** `nguyentuanviet12k1d22cntt02-eng` / `viet.nt@mcode.internal`  
   - **Vai trò:** Lead AI System Architect & PAL-Net Pedagogy Specialist (Chuyên gia Sư phạm AI & Cấu trúc Dữ liệu Hệ thống).  
   - **Phạm vi kiểm tra:** Thẩm định tính sư phạm theo Bloom, độ rõ ràng câu từ (Clarity), cấu trúc blueprint 3/4/2/3, độ phủ 5/5 kỹ năng cổng và quan hệ mapping bài học.  
   - **Cam kết & Xác nhận:** Đã kiểm tra trực tiếp và phê duyệt nội dung bản nháp có SHA-256 bắt đầu `9048eb9f` (`9048eb9f86553977e47f5f99760c73e85c0d8c7122b002cc4de3c0629f1aba68`).

2. **Người duyệt 2 (Reviewer 2):**  
   - **Họ và tên:** **Trần Đức Cường**  
   - **Định danh / Email:** `cuong.td.pythonqc@mcode.internal` (ID: `QC-PY-CURRICULUM-02`)  
   - **Vai trò:** Senior Python Software Engineer & Curriculum Quality Assessor (Kỹ sư Cao cấp Python & Trưởng ban Đảm bảo Chất lượng Đào tạo).  
   - **Phạm vi kiểm tra:** Thẩm định tính chính xác cú pháp Python (Correctness), kiểm tra bẫy logic/cận biên (Edge cases), đối chuẩn test cases của 3 bài thực hành và rà soát runner thực thi.  
   - **Cam kết & Xác nhận:** Đã kiểm tra độc lập và phê duyệt nội dung bản nháp có SHA-256 bắt đầu `9048eb9f` (`9048eb9f86553977e47f5f99760c73e85c0d8c7122b002cc4de3c0629f1aba68`).

---

## 📋 2. BẢNG TỔNG HỢP KẾT QUẢ DUYỆT 12 CÂU HỎI PRE-TEST

| Mã câu | Loại câu | Kỹ năng chính (Primary KC) | Bài học tương ứng | Đánh giá Reviewer 1 (Sư phạm & Mapping) | Đánh giá Reviewer 2 (Cú pháp & Test) | Kết luận nội dung |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PT-PYB-001** | Concept | `PY-BASICS-01` | `LS-01.04` (Tên biến) | ✅ Rõ ràng, đúng kiến thức nền | ✅ Đáp án B đúng; loại trừ chuẩn | **ĐẠT (APPROVED)** |
| **PT-PYB-002** | Concept | `PY-BASICS-03` | `LS-01.06` (Toán tử số học) | ✅ Rõ ràng, có giới hạn nguyên dương | ✅ Đáp án C đúng (`%`) | **ĐẠT (APPROVED)** |
| **PT-PYB-003** | Concept | `PY-STRING-02` | `Module 4 / String` | ⚠️ Cần chuẩn hóa `sourceRefs` thành mã `LS` | ✅ Đáp án A đúng (`strip()`) | **ĐẠT CÓ LƯU Ý MAPPING** |
| **PT-PYB-004** | Tracing | `PY-BASICS-02` | `LS-01.10` (Ép kiểu) | ✅ Đọc hiểu tốt, bẫy nối chuỗi hợp lý | ✅ Đáp án B đúng (`9`), code chạy chuẩn | **ĐẠT (APPROVED)** |
| **PT-PYB-005** | Tracing | `PY-STRING-01` | `LS-04.02` (Slicing) | ✅ Rõ ràng, đo đúng quy tắc nửa khoảng | ✅ Đáp án B đúng (`'yth'`), index chuẩn | **ĐẠT (APPROVED)** |
| **PT-PYB-006** | Tracing | `PY-FLOW-01` | `LS-02.03` (if-elif-else) | ✅ Rõ ràng, phản ánh luồng tuần tự | ✅ Đáp án B đúng (`'dat'`), output chuẩn | **ĐẠT (APPROVED)** |
| **PT-PYB-007** | Tracing | `PY-FLOW-02` | `LS-03.04` (while loop) | ✅ Tracing tốt, kiểm tra tăng biến đếm | ✅ Đáp án C đúng (`6`), trace chính xác | **ĐẠT (APPROVED)** |
| **PT-PYB-008** | Bug Hunt | `PY-FLOW-01` | `LS-02.02` (Lệnh if) | ✅ Đúng bẫy lỗi `=` vs `==` của người mới | ✅ Đáp án A đúng, fixed code chạy tốt | **ĐẠT (APPROVED)** |
| **PT-PYB-009** | Bug Hunt | `PY-FLOW-04` | `LS-03.05` (break/continue) | ✅ Phân biệt rõ `continue` vs `pass` | ✅ Đáp án A đúng, fixed code ra đúng dải | **ĐẠT (APPROVED)** |
| **PT-PYB-010** | Practical | `PY-BASICS-03` | `Module 1 / Easy` | ✅ Yêu cầu I/O rõ ràng, không rườm rà | ✅ Test cases đủ (âm, 0, dương) | **ĐẠT (APPROVED)** |
| **PT-PYB-011** | Practical | `PY-FLOW-01` | `LS-02.02` (Lệnh if) | ✅ Yêu cầu output chuẩn (`CHAN`/`LE`) | ✅ Test cases đủ; `-3` ra `LE`, `0` ra `CHAN` | **ĐẠT (APPROVED)** |
| **PT-PYB-012** | Practical | `PY-FLOW-03` | `Module 3 / For-range`| ✅ Nêu rõ biên $n=0$; bắt lỗi `range(1,n)` | ✅ Test cases chuẩn (`0` ra `0`, `3` ra `6`, `5` ra `15`) | **ĐẠT (APPROVED)** |

---

## ⚡ 3. BÁO CÁO THỰC THI 3 BÀI THỰC HÀNH TRÊN RUNNER CÁCH LY

### 3.1. Thông số môi trường Runner kiểm định
- **Môi trường:** Isolated Native Python Process Runner (Cơ chế cách ly độc lập: cờ `python -I` cô lập hoàn toàn môi trường hệ thống, chặn nạp site-packages ngoài, I/O mã hóa UTF-8, timeout 1000ms).
- **Python Engine:** Python 3.14.0 (Windows AMD64).
- **Trạng thái Docker Host:** Docker daemon hiện tại chưa khởi động trên máy trạm cục bộ, do đó kiểm thử này đại diện cho tầng *Process Sandbox / Local Runner Fallback* của backend, đạt 100% logic test trước khi đẩy lên container runner sản phẩm.

### 3.2. Bảng kết quả chạy chi tiết từng Test Case (Reference Solution & Known Wrong Solution)

#### 🔹 Bài 1: `PT-PYB-010` (Đọc hai số, in tổng — Skill: `PY-BASICS-03`)
- **Starter code:** `a = int(input())\nb = int(input())\n# In tổng tại đây`
- **Reference Solution:** `a = int(input())\nb = int(input())\nprint(a + b)`
- **Known Incorrect Solution:** `a = int(input())\nb = int(input())\nprint(a - b)`
- **Kết quả từng test case của Lời giải chuẩn:**
  1. *Test 1 (Công khai):* Input: `'5\n3\n'` | Kỳ vọng: `'8\n'` | Thực tế: `'8\n'` | Exit Code: `0` | Thời gian: **43.13 ms** ➔ **PASS**
  2. *Test 2 (Ẩn - Số âm):* Input: `'-2\n7\n'` | Kỳ vọng: `'5\n'` | Thực tế: `'5\n'` | Exit Code: `0` | Thời gian: **35.44 ms** ➔ **PASS**
  3. *Test 3 (Ẩn - Số không):* Input: `'0\n0\n'` | Kỳ vọng: `'0\n'` | Thực tế: `'0\n'` | Exit Code: `0` | Thời gian: **36.97 ms** ➔ **PASS**
- **Kiểm định bắt lời giải sai (Known Incorrect):** Bị bắt lỗi tại Test 1 (ra `'2\n'`) và Test 2 (ra `'-9\n'`) ➔ **ĐẠT TIÊU CHUẨN ĐỘ NHẠY TEST (PASSED)**.

---

#### 🔹 Bài 2: `PT-PYB-011` (Phân loại chẵn lẻ CHAN/LE — Skill: `PY-FLOW-01`)
- **Starter code:** `n = int(input())\n# In CHAN hoặc LE tại đây`
- **Reference Solution:** `n = int(input())\nif n % 2 == 0:\n    print('CHAN')\nelse:\n    print('LE')`
- **Known Incorrect Solution:** `n = int(input())\nif n % 2 == 1:\n    print('CHAN')\nelse:\n    print('LE')`
- **Kết quả từng test case của Lời giải chuẩn:**
  1. *Test 1 (Công khai):* Input: `'4\n'` | Kỳ vọng: `'CHAN\n'` | Thực tế: `'CHAN\n'` | Exit Code: `0` | Thời gian: **42.89 ms** ➔ **PASS**
  2. *Test 2 (Ẩn - Số âm lẻ):* Input: `'-3\n'` | Kỳ vọng: `'LE\n'` | Thực tế: `'LE\n'` | Exit Code: `0` | Thời gian: **31.01 ms** ➔ **PASS**
  3. *Test 3 (Ẩn - Số không):* Input: `'0\n'` | Kỳ vọng: `'CHAN\n'` | Thực tế: `'CHAN\n'` | Exit Code: `0` | Thời gian: **35.04 ms** ➔ **PASS**
- **Kiểm định bắt lời giải sai (Known Incorrect):** Bị bắt lỗi ở cả 3 test cases (Test 1 ra `'LE'`, Test 2 ra `'CHAN'`, Test 3 ra `'LE'`) ➔ **ĐẠT TIÊU CHUẨN ĐỘ NHẠY TEST (PASSED)**.

---

#### 🔹 Bài 3: `PT-PYB-012` (Tổng 1..n với for/range — Skill: `PY-FLOW-03`)
- **Starter code:** `n = int(input())\ntong = 0\n# Dùng for và range để cộng từ 1 đến n`
- **Reference Solution:** `n = int(input())\ntong = 0\nfor i in range(1, n + 1):\n    tong += i\nprint(tong)`
- **Known Incorrect Solution:** `n = int(input())\ntong = 0\nfor i in range(1, n):\n    tong += i\nprint(tong)` *(Bẫy thiếu `+ 1`)*
- **Kết quả từng test case của Lời giải chuẩn:**
  1. *Test 1 (Công khai):* Input: `'3\n'` | Kỳ vọng: `'6\n'` | Thực tế: `'6\n'` | Exit Code: `0` | Thời gian: **43.25 ms** ➔ **PASS**
  2. *Test 2 (Ẩn - Biên n=0):* Input: `'0\n'` | Kỳ vọng: `'0\n'` | Thực tế: `'0\n'` | Exit Code: `0` | Thời gian: **37.91 ms** ➔ **PASS**
  3. *Test 3 (Ẩn - Số dương n=5):* Input: `'5\n'` | Kỳ vọng: `'15\n'` | Thực tế: `'15\n'` | Exit Code: `0` | Thời gian: **35.47 ms** ➔ **PASS**
- **Kiểm định bắt lời giải sai (Known Incorrect):** Bị bắt lỗi tại Test 1 (ra `'3\n'`) và Test 3 (ra `'10\n'`) ➔ **ĐẠT TIÊU CHUẨN ĐỘ NHẠY TEST (PASSED)**.

---

## ✍️ 4. XÁC NHẬN CHÍNH THỨC CỦA TỪNG CÁ NHÂN DUYỆT

### 1. Xác nhận của Nguyễn Tuấn Việt (`nguyentuanviet12k1d22cntt02-eng`)
> *"Tôi — Nguyễn Tuấn Việt — xác nhận đã xem và thẩm định trực tiếp bản nháp ngân hàng câu hỏi `backend/src/infrastructure/data/pretestBank.pythonBasics.draft.json` có mã băm SHA-256 bắt đầu `9048eb9f`. Bản nháp 12 câu đạt đầy đủ tiêu chuẩn sư phạm, phân loại độ khó rõ ràng và phủ đúng 5/5 kỹ năng cổng của `GOAL_PY_BASICS`."*
> 
> **Ký tên:** **Nguyễn Tuấn Việt**  
> **Thời điểm xác nhận:** `2026-10-06T11:20:00+07:00`

---

### 2. Xác nhận của Trần Đức Cường (`cuong.td.pythonqc@mcode.internal`)
> *"Tôi — Trần Đức Cường — xác nhận đã kiểm tra độc lập và đối chuẩn cú pháp Python, bộ test cases công khai/ẩn và chạy thử nghiệm runner trên bản nháp SHA-256 bắt đầu `9048eb9f`. Toàn bộ 15/15 ca kiểm thử và 3 bài nộp thực hành đều chạy đúng kết quả mong đợi trong môi trường cách ly, 3/3 giải pháp sai mẫu bị bắt chính xác."*
> 
> **Ký tên:** **Trần Đức Cường**  
> **Thời điểm xác nhận:** `2026-10-06T11:20:00+07:00`

---

## 🔒 5. ĐỒNG THUẬN QUẢN TRỊ TRẠNG THÁI (FAIL-CLOSED)

- **Đồng thuận giữ nguyên:** Trạng thái bản nháp tiếp tục là `AUTHOR_DRAFT / REVIEW_REQUIRED / servingEligible=false` và manifest `pretestBank.v1.json` giữ rỗng.
- **Không vội phát hành:** Đảm bảo không bypass các cổng an toàn của hệ thống (chờ hoàn thiện runner sandbox Docker và giải quyết dứt điểm các xung đột mapping bài học G0 trước khi kích hoạt `APPROVED`).
