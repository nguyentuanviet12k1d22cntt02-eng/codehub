# 📚 Danh mục & Cấu trúc Tài liệu Báo cáo Thực tập Tốt nghiệp (Mcode)

Thư mục này quản lý toàn bộ tài liệu báo cáo thực tập, phiếu đánh giá doanh nghiệp, hồ sơ kiểm thử và minh chứng kỹ thuật cho đồ án **Hệ thống Học lập trình thích ứng tích hợp Trợ lý AI & Chấm code tự động (Mcode)**.

---

## 🗂️ 1. Cấu trúc thư mục

```text
docs/bao_cao/
├── Bao_Cao_Thực Tập.docx                       # ⭐ BÁO CÁO CHÍNH THỨC (Bản hoàn chỉnh 42 trang)
├── README.md                                    # Hướng dẫn danh mục tài liệu & tra cứu
│
├── 📁 tai_lieu_bo_sung/                         # Tài liệu phụ lục, đo kiểm & kiểm thử
│   ├── Bao_Cao_Thực_Tập_bổ_sung_LLM_token_latency.docx   # Bằng chứng đo kiểm LLM token & latency Docker
│   └── test Agent.docx                          # Ma trận 10 ca kiểm thử chuyên sâu chức năng Luyện tập AI
│
├── 📁 bieu_mau_va_danh_gia/                     # Biểu mẫu quy chuẩn của trường & Phiếu chấm DN
│   ├── Mau Bao Cao_Thực Tập.docx                # Mẫu hướng dẫn trình bày báo cáo của Trường / Viện
│   ├── PHIEU CHAM DANH CHO DOANH NGHIEP_v2 (1).docx  # Phiếu chấm DN ĐÃ ĐIỀN (Công ty Sao Việt - CBHD Hồ Đình Khải)
│   └── PHIEU CHAM DANH CHO DOANH NGHIEP_v2 (2).docx  # Phiếu chấm DN bản MẪU TRỐNG
│
└── 📁 ban_nhap_cu/                              # Lưu trữ bản nháp lịch sử
    └── bao_cao.docx                             # Dự thảo ban đầu (phiên bản rút gọn 65 đoạn văn)
```

---

## 📑 2. Chi tiết các tệp tài liệu

| Tên tệp / Thư mục | Định dạng | Trạng thái | Mục đích & Nội dung |
| :--- | :--- | :--- | :--- |
| **`Bao_Cao_Thực Tập.docx`** | DOCX (~12 MB) | **Chính thức** | Báo cáo thực tập tốt nghiệp toàn diện (Lời mở đầu, 6 Chương nội dung, Kết luận, Tài liệu tham khảo, Phụ lục). Đã tích hợp đầy đủ sơ đồ kiến trúc, đồ thị tri thức 3 ngôn ngữ và kết quả thực nghiệm 3 mô hình BKT, DKT, PAL-Net. |
| **`tai_lieu_bo_sung/Bao_Cao_Thực_Tập_bổ_sung_LLM_token_latency.docx`** | DOCX (~46 KB) | Phụ lục kỹ thuật | 5 trang bằng chứng đo kiểm hiệu năng pipeline Multi-Agent, chi phí token LLM và độ trễ phản hồi khi chạy qua Docker Sandbox. |
| **`tai_lieu_bo_sung/test Agent.docx`** | DOCX (~51 KB) | Minh chứng nghiệm thu | Bảng 15 dòng (1 Header + 4 ca cũ + 10 ca kiểm thử mới chuyên sâu) về chức năng AI Tutor Multi-Agent System. |
| **`bieu_mau_va_danh_gia/Mau Bao Cao_Thực Tập.docx`** | DOCX (~1.9 MB) | Biểu mẫu chuẩn | Quy định trình bày báo cáo thực tập do Viện Công nghệ số - Trường ĐH Thủ Dầu Một ban hành. |
| **`bieu_mau_va_danh_gia/PHIEU CHAM DANH CHO DOANH NGHIEP_v2 (1).docx`** | DOCX (~2.8 MB) | Đã hoàn tất | Phiếu chấm điểm thực tập đã điền đầy đủ thông tin cán bộ hướng dẫn (Hồ Đình Khải) và cơ quan tiếp nhận (Công ty TNHH Giáo dục Tin học Sao Việt). |
| **`bieu_mau_va_danh_gia/PHIEU CHAM DANH CHO DOANH NGHIEP_v2 (2).docx`** | DOCX (~12 KB) | Biểu mẫu trống | Phiếu chấm điểm doanh nghiệp mẫu chưa điền thông tin. |
| **`ban_nhap_cu/bao_cao.docx`** | DOCX (~5.5 MB) | Lưu trữ lịch sử | Bản đề cương dự thảo giai đoạn đầu đề tài. |

---

## 🖼️ 3. Thư mục tài nguyên hình ảnh (`assets/bao_cao/`)

Toàn bộ hình ảnh minh chứng, sơ đồ kiến trúc, biểu đồ use case và đồ thị tri thức đã được quy hoạch tập trung tại thư mục [`assets/bao_cao/`](file:///d:/Project/LearnPython/assets/bao_cao):

| Tệp hình ảnh | Kích thước | Mô tả & Vị trí trong báo cáo |
| :--- | :--- | :--- |
| `kien_truc_he_thong_mcode.png` | 1.3 MB (300 DPI) | **Hình 2.1**: Sơ đồ 4 tầng kiến trúc hệ thống Mcode (UI, API Gateway, Services, Sandbox) |
| `bieu_do_usecase_tong_the.png` | 1.1 MB (300 DPI) | **Hình 2.2**: Sơ đồ Use Case tổng thể toàn hệ thống (5 tác nhân, 14 ca sử dụng) |
| `usecase_phan_he_hoc_vien.png` | 758 KB (300 DPI) | **Hình 2.3**: Sơ đồ Use Case phân hệ Học viên & Không gian thực hành Monaco Code Studio |
| `usecase_phan_he_quan_tri.png` | 759 KB (300 DPI) | **Hình 2.4**: Sơ đồ Use Case phân hệ Quản trị viên & Giảng viên |
| `do_thi_tri_thuc_python.png` | 277 KB (Hi-Res) | **Hình 2.5**: Đồ thị đầy đủ 45 kỹ năng và 53 quan hệ tiên quyết Python |
| `do_thi_tri_thuc_javascript.png` | 204 KB (Hi-Res) | **Hình 2.6**: Đồ thị đầy đủ 30 kỹ năng và 33 quan hệ tiên quyết JavaScript |
| `do_thi_tri_thuc_cpp.png` | 198 KB (Hi-Res) | **Hình 2.7**: Đồ thị đầy đủ 30 kỹ năng và 33 quan hệ tiên quyết C++ |
| `hinh_mo_hinh_bkt.png` | 339 KB | **Hình 3.1**: Cấu trúc mạng Bayes mô hình Bayesian Knowledge Tracing (BKT) |
| `hinh_mo_hinh_dkt.png` | 277 KB | **Hình 3.2**: Kiến trúc mạng hồi quy LSTM trải theo chuỗi thời gian mô hình DKT |
| `hinh_mo_hinh_palnet.png` | 149 KB | **Hình 3.3**: Kiến trúc học chuyển giao tri thức thích ứng kết hợp đồ thị (PAL-Net) |
| `so_do_usecase_tong_the.png` | 1.1 MB | Bản sao chuẩn hóa tên tệp sơ đồ Use Case tổng thể |
| `kien_truc_he_thong_learnpython.png` | 1.3 MB | Bản sao lưu đối chiếu kiến trúc giai đoạn đầu |

---

## ⚙️ 4. Scripts liên quan

Khi cần kết xuất lại đồ thị tri thức hoặc làm mới hình nhúng trong tài liệu Word, chạy các script sau:
1. **Render đồ thị tri thức 3 ngôn ngữ**:
   ```bash
   node scripts/render_full_report_skill_graphs.cjs
   ```
   *(Xuất ảnh PNG chất lượng cao 2400px trực tiếp vào `assets/bao_cao/`)*
2. **Cập nhật hình ảnh & bảng tra cứu vào Word**:
   ```bash
   python scripts/update_report_knowledge_graphs.py
   ```
   *(Đọc ảnh từ `assets/bao_cao/` và cập nhật trực tiếp vào `docs/bao_cao/Bao_Cao_Thực Tập.docx`)*
