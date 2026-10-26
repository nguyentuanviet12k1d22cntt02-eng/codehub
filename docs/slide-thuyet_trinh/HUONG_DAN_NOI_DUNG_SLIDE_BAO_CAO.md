# 🎓 HƯỚNG DẪN CHI TIẾT NỘI DUNG VÀ KỊCH BẢN THUYẾT TRÌNH BÁO CÁO ĐỒ ÁN / THỰC TẬP
# ĐỀ TÀI: MCODE — NỀN TẢNG HỌC LẬP TRÌNH THÍCH ỨNG & CHẤM CODE TỰ ĐỘNG

> **Tài liệu tham chiếu chính thức:** Phục vụ buổi báo cáo bảo vệ Đồ án tốt nghiệp / Báo cáo Thực tập tốt nghiệp ngành Công nghệ Thông tin (Chuyên ngành Kỹ thuật Phần mềm & Trí tuệ Nhân tạo).  
> **Sinh viên thực hiện:** Nguyễn Tuấn Việt — Lớp: D22CNTT02  
> **Tệp trình chiếu đi kèm:** [`docs/slide-thuyet_trinh/slide_thuyet_trinh_mcode.pptx`](file:///d:/Project/LearnPython/docs/slide-thuyet_trinh/slide_thuyet_trinh_mcode.pptx) (Định dạng Widescreen 16:9, phong cách Corporate Light Blue hiện đại, chữ lớn 20–44pt chuẩn hội đồng).

---

## 📑 MỤC LỤC
1. [Chiến lược Thuyết trình & Phân bổ Thời gian (12 - 15 phút)](#1-chiến-lược-thuyết-trình--phân-bổ-thời-gian)
2. [Đặc tả Chi tiết 11 Slide Thuyết trình Trọng tâm AI & Kỹ thuật Phần mềm](#2-đặc-tả-chi-tiết-11-slide-thuyết-trình-trọng-tâm-ai--kỹ-thuật-phần-mềm)
   - [Slide 1: Bìa đề tài (Title Cover)](#slide-1-bìa-đề-tài-title-cover)
   - [Slide 2: Lý do chọn đề tài & Tính cấp thiết](#slide-2-lý-do-chọn-đề-tài--tính-cấp-thiết)
   - [Slide 3: Thiết kế Kiến trúc Tổng thể Hệ thống Mcode](#slide-3-thiết-kế-kiến-trúc-tổng-thể-hệ-thống-mcode)
   - [Slide 4: Dữ liệu Huấn luyện & Bài toán Khởi động nguội (Cold-Start)](#slide-4-dữ-liệu-huấn-luyện--bài-toán-khởi-động-nguội-cold-start)
   - [Slide 5: Mô hình Hóa Tri Thức: Từ BKT, DKT Đến Đề Xuất PAL-Net](#slide-5-mô-hình-hóa-tri-thức-từ-bkt-dkt-đến-đề-xuất-pal-net)
   - [Slide 6: Kết Quả Thực Nghiệm Đối Đầu: BKT vs DKT vs PAL-Net](#slide-6-kết-quả-thực-nghiệm-đối-đầu-bkt-vs-dkt-vs-pal-net)
   - [Slide 7: Phân Tích Thực Nghiệm: Tải Nhận Thức & Thời Điểm Vàng AI](#slide-7-phân-tích-thực-nghiệm-tải-nhận-thức--thời-điểm-vàng-ai)
   - [Slide 8: Ứng Dụng PAL-Net Vào Điều Hướng Lộ Trình Thích Ứng (ZPD)](#slide-8-ứng-dụng-pal-net-vào-điều-hướng-lộ-trình-thích-ứng-zpd)
   - [Slide 9: Trợ Lý Sư Phạm AI (Multi-Agent) & Sandbox Chấm Code An Toàn](#slide-9-trợ-lý-sư-phạm-ai-multi-agent--sandbox-chấm-code-an-toàn)
   - [Slide 10: Tổng Kết Đóng Góp & Định Hướng Tương Lai](#slide-10-tổng-kết-đóng-góp--định-hướng-tương-lai)
   - [Slide 11: Lời Cảm Ơn & Phiên Q&A](#slide-11-lời-cảm-ơn--phiên-qa)
3. [Kịch bản Trình diễn Thực tế (Live Demo Flow: 3 - 5 phút)](#3-kịch-bản-trình-diễn-thực-tế-live-demo-flow)
4. [Cẩm nang Phản biện Hội đồng (Q&A Defense Guide) & Đáp án Mẫu](#4-cẩm-nang-phản-biện-hội-đồng-qa-defense-guide)
5. [Hướng dẫn Kỹ thuật Tái tạo & Tùy biến File PPTX](#5-hướng-dẫn-kỹ-thuật-tái-tạo--tùy-biến-file-pptx)

---

## 1. CHIẾN LƯỢC THUYẾT TRÌNH & PHÂN BỔ THỜI GIAN

Một bài báo cáo bảo vệ tốt nghiệp thường diễn ra trong **15 đến 20 phút** (gồm 12–15 phút trình bày + 5–10 phút vấn đáp Q&A). Cấu trúc bài báo cáo tập trung sâu vào **Mô hình Trí tuệ Nhân tạo (BKT, DKT, PAL-Net)** kết hợp **Kỹ thuật phần mềm (Microservices, Sandbox Docker)**:

| Giai đoạn | Nội dung trọng tâm | Thời lượng lý tưởng | Mục tiêu đạt được |
| :--- | :--- | :---: | :--- |
| **Phần 1: Mở đầu & Bối cảnh** | Slide 1 $\to$ Slide 2 | **2.0 phút** | Nêu bật "nỗi đau" giáo dục lập trình (rớt môn 40–70%) và sự cần thiết của cá nhân hóa lộ trình. |
| **Phần 2: Kiến trúc & Dữ liệu** | Slide 3 $\to$ Slide 4 | **3.0 phút** | Trình diễn kiến trúc Microservices 4 tầng và thuật toán Cognitive Traversal giải bài toán Cold-Start. |
| **Phần 3: Trọng tâm AI & Thực nghiệm** | Slide 5 $\to$ Slide 8 | **6.0 phút** | **Phần "ăn điểm" cao nhất**: So sánh kiến trúc BKT, DKT và đề xuất PAL-Net; phân tích bảng số liệu thực nghiệm 3 ngôn ngữ và cơ chế thích ứng ZPD. |
| **Phần 4: Ứng dụng & Demo** | Slide 9 $\to$ Slide 11 + Live Demo | **4.0 phút** | Giới thiệu Trợ lý AI Multi-Agent, Sandbox an toàn, kết luận đóng góp và tiến hành Live Demo. |

> 💡 **Mẹo làm chủ hội đồng:**
> - Tuyệt đối không đọc nguyên văn từng dòng trên slide. Slide chỉ hiển thị từ khóa, sơ đồ và bảng số liệu so sánh.
> - Sử dụng ngôn từ đĩnh đạc, tự tin, nhấn mạnh vào các từ khóa kỹ thuật: *Knowledge Tracing*, *BKT*, *DKT*, *PAL-Net*, *Đồ thị DAG*, *Vùng phát triển gần nhất (ZPD)*, *Sandbox Isolation*.

---

## 2. ĐẶC TẢ CHI TIẾT 11 SLIDE THUYẾT TRÌNH TRỌNG TÂM AI & KỸ THUẬT PHẦN MỀM

---

### SLIDE 1: BÌA ĐỀ TÀI (TITLE COVER)

* **Eyebrow Tag:** BÁO CÁO ĐỒ ÁN TỐT NGHIỆP • KHOA CÔNG NGHỆ THÔNG TIN
* **Tiêu đề chính (36pt Bold):** `MCODE: NỀN TẢNG HỌC LẬP TRÌNH THÍCH ỨNG & CHẤM CODE TỰ ĐỘNG`
* **Tiêu đề phụ (22pt):** `Nghiên Cứu Mô Hình Knowledge Tracing (BKT, DKT, PAL-Net) & Trợ Lý Sư Phạm AI Đa Ngôn Ngữ`
* **Thông tin tác giả (Thẻ thông tin 20pt):**
  - Sinh viên thực hiện: **Nguyễn Tuấn Việt** — Lớp: **D22CNTT02**
  - Chuyên ngành: **Kỹ thuật Phần mềm & Trí tuệ Nhân tạo** — Năm bảo vệ: **2026**
* **Bố cục thị giác:** Thẻ trắng trung tâm viền xanh vi tế (`#93C5FD`), nền Slate `#F8FAFC`, dải trang trí xanh dương phía trên.

#### 🎙️ Lời thoại thuyết trình (Speaker Notes - ~1 phút):
> *"Kính thưa Quý Thầy Cô trong Hội đồng chấm đồ án tốt nghiệp,*  
> *Em tên là Nguyễn Tuấn Việt, sinh viên lớp D22CNTT02, chuyên ngành Kỹ thuật Phần mềm và Trí tuệ Nhân tạo. Hôm nay, em rất vinh dự được đại diện báo cáo đề tài: **'Mcode — Nền tảng Học Lập trình Thích ứng và Chấm Code Tự động'**.*  
>  
> *Đề tài tập trung giải quyết bài toán cốt lõi: Làm thế nào để định lượng chính xác lỗ hổng kiến thức của sinh viên thông qua các mô hình Knowledge Tracing chuyên sâu (BKT, DKT, và mô hình đề xuất PAL-Net), từ đó tự động điều hướng lộ trình bài tập thích ứng vừa sức, kết hợp cùng trợ lý AI sư phạm Socratic và hạ tầng chấm code sandbox an toàn tuyệt đối. Sau đây em xin phép được bắt đầu phần trình bày."*

---

### SLIDE 2: LÝ DO CHỌN ĐỀ TÀI & TÍNH CẤP THIẾT

* **Eyebrow Tag:** BỐI CẢNH & ĐỘNG LỰC NGHIÊN CỨU
* **Tiêu đề slide (28pt):** `Khủng Hoảng Nhập Môn & Giới Hạn Của Đào Tạo Truyền Thống`
* **Bố cục thị giác:** 2 Thẻ song song (Thẻ Trái: Cảnh báo thực trạng / Thẻ Phải: Giải pháp đột phá).
* **Nội dung thẻ Trái (⚠️ Thực Trạng Giáo Dục Truyền Thống):**
  - **• Tỷ lệ bỏ cuộc cao (40%–70%):** Học viên nhập môn thường xuyên bị "Syntax & Logic Shock", mất phương hướng khi gặp lỗi biên dịch phức tạp.
  - **• Giới hạn "One-size-fits-all":** Chương trình học áp đặt chung một tiến độ cho cả lớp, không tính đến sự chênh lệch nền tảng tư duy giữa các học viên.
  - **• Thiếu trợ giúp 1:1 kịp thời:** Giảng viên quá tải, không thể hỗ trợ phân tích nguyên nhân lỗi sai vào ban đêm hoặc ngoài giờ học.
* **Nội dung thẻ Phải (🎯 Đột Phá Từ Giải Pháp Mcode):**
  - **• Mô hình hóa tri thức (Knowledge Tracing):** Định lượng chính xác xác suất làm chủ từng kỹ năng theo thời gian thực để đưa ra bài tập trúng đích.
  - **• Thích ứng cá nhân hóa theo ZPD:** Đề xuất bài tập ở ngưỡng thử thách tối ưu (Zone of Proximal Development) — không quá dễ gây chán, không quá khó gây nản.
  - **• Trợ lý AI sư phạm & Sandbox:** Hướng dẫn gợi mở tư duy (Scaffolding), kết hợp môi trường Docker Judge0 chấm code an toàn trong <1 giây.

#### 🎙️ Lời thoại thuyết trình (Speaker Notes - ~1.5 phút):
> *"Thưa Thầy Cô, theo các nghiên cứu giáo dục quốc tế, tỷ lệ sinh viên bỏ cuộc hoặc trượt môn lập trình căn bản dao động từ **40% đến 70%**. Nguyên nhân đến từ hiện tượng 'Syntax Shock', mô hình đào tạo cào bằng 'One-size-fits-all', và sự thiếu vắng người kèm cặp 1:1 ngoài giờ lên lớp.*  
>  
> *Để giải quyết triệt để vấn đề này, đề tài **Mcode** ứng dụng các mô hình học máy **Knowledge Tracing** nhằm theo dõi liên tục trạng thái nhận thức của sinh viên, kết hợp với lý thuyết **Vùng phát triển gần nhất (ZPD)** của nhà tâm lý học Lev Vygotsky để tự động điều chỉnh lộ trình bài tập vừa sức, đi kèm một trợ lý AI Socratic hướng dẫn sinh viên tự tìm ra lỗi sai."*

---

### SLIDE 3: THIẾT KẾ KIẾN TRÚC TỔNG THỂ HỆ THỐNG MCODE

* **Eyebrow Tag:** THIẾT KẾ KIẾN TRÚC
* **Tiêu đề slide (28pt):** `Kiến Trúc Microservices Phân Tách 4 Tầng Chuyên Biệt`
* **Bố cục thị giác:** 
  - Bên trái: Khung chứa ảnh sơ đồ kiến trúc [`00_kien_truc_he_thong_mcode.png`](file:///d:/Project/LearnPython/docs/slide-thuyet_trinh/images/00_kien_truc_he_thong_mcode.png).
  - Bên phải: Thẻ phân rã chi tiết 4 tầng cốt lõi.
* **Nội dung thẻ Phải (🏗️ Phân Rã 4 Tầng Cốt Lõi):**
  - **1. Client Layer (React 19 / TypeScript):** Monaco Editor tích hợp, hiển thị Cây lộ trình kỹ năng Roadmap DAG, khung chat tương tác với Trợ lý AI Mascot.
  - **2. Backend Core (Node.js / Prisma):** Quản lý xác thực JWT, điều tiết hàng đợi nộp bài Concurrency Queue, quản lý AI Key Pool, lưu trữ PostgreSQL Supabase.
  - **3. AI Microservice (Python FastAPI / PyTorch):** Trực tiếp chạy các mô hình KT (BKT, DKT, PAL-Net) và điều phối chu trình Multi-Agent sư phạm.
  - **4. Sandbox Service (Judge0 Engine):** Chấm bài cô lập trong container Docker Zero-Trust (`--network none`, 128MB RAM, 3s CPU, cgroups).

#### 🎙️ Lời thoại thuyết trình (Speaker Notes - ~1.5 phút):
> *"Hệ thống Mcode được thiết kế theo kiến trúc Microservices phân tách 4 tầng độc lập, đảm bảo độ sẵn sàng cao và khả năng mở rộng ngang:*  
> *- **Tầng 1 (Client):** Giao diện React 19 tích hợp Monaco Editor chuẩn VS Code, trực quan hóa cây kỹ năng Roadmap trực quan.*  
> *- **Tầng 2 (Backend Core):** Node.js Express với Prisma ORM, tích hợp hàng đợi nộp bài Concurrency Queue chống nghẽn server và hệ thống Key Pool tự xoay tua API AI.*  
> *- **Tầng 3 (AI Microservice):** Python FastAPI và PyTorch, chịu trách nhiệm suy diễn mô hình Knowledge Tracing trong vòng dưới 15ms và điều phối các agent AI.*  
> *- **Tầng 4 (Sandbox):** Container Docker cách ly hoàn toàn mạng Internet (`--network none`), khống chế 128MB RAM và 3 giây CPU, loại bỏ 100% rủi ro an ninh mạng khi sinh viên nộp code."*

---

### SLIDE 4: DỮ LIỆU HUẤN LUYỆN & BÀI TOÁN KHỞI ĐỘNG NGUỘI

* **Eyebrow Tag:** DỮ LIỆU HUẤN LUYỆN AI
* **Tiêu đề slide (28pt):** `Khắc Phục Cold-Start Bằng Thuật Toán Cognitive Traversal`
* **Bố cục thị giác:**
  - Hàng trên: **4 Ô chỉ số KPI lớn (44pt bold):**
    - `71.273` — LƯỢT TƯƠNG TÁC
    - `900` — HỌC VIÊN GIẢ LẬP
    - `917` — BÀI TẬP THẬT CATALOG
    - `5` — NHÓM NĂNG LỰC (PERSONAS)
  - Hàng dưới: Thẻ giải trình thuật toán Cognitive Traversal (chữ 20.5pt).
* **Nội dung thẻ Dưới:**
  - **• Thách thức Khởi động nguội (Cold-Start):** Dữ liệu người dùng thật ban đầu (15 tài khoản, 549 bài nộp) không đủ quy mô để huấn luyện các mạng nơ-ron sâu (DKT, PAL-Net) với hàng chục nghìn tham số.
  - **• Thuật toán Mô phỏng Nhận thức (Cognitive Traversal + IRT):** Duyệt đồ thị tiên quyết DAG theo thứ tự Topo, tính xác suất làm đúng qua hàm Sigmoid IRT, mô phỏng thời gian tư duy Log-Normal và đường cong quên lãng Ebbinghaus.
  - **• Đảm bảo tính trung thực khoa học:** 100% bài tập được ánh xạ với UUID thật trong CSDL (917 bài), phân bổ cân bằng 3 ngôn ngữ: Python (32.943 lượt), JavaScript (19.063 lượt), C++ (19.267 lượt).

#### 🎙️ Lời thoại thuyết trình (Speaker Notes - ~1.5 phút):
> *"Thưa Quý Thầy Cô, khi nghiên cứu mạng nơ-ron sâu trong giáo dục, rào cản lớn nhất là **Bài toán Khởi động nguội (Cold-Start)**: Ban đầu hệ thống chỉ có 15 người dùng thật với 549 bài nộp, hoàn toàn không đủ để huấn luyện mạng DKT hay PAL-Net.*  
>  
> *Để giải quyết vấn đề này một cách trung thực và có cơ sở khoa học, em đã phát triển thuật toán **Cognitive Traversal kết hợp Lý thuyết Ứng đáp Câu hỏi (IRT)**:*  
> *1. Học viên ảo duyệt tuần tự trên Đồ thị Tri thức DAG của 917 bài tập có thật trong catalog.*  
> *2. Mô phỏng 900 học viên thuộc 5 nhóm tính cách nhận thức: Mới học (NEW), Ổn định (STEADY), Thử sai (TRIAL_ERROR), Nhanh nhạy (FAST), và Đã có nền tảng (RETURNING).*  
> *3. Tích hợp quy luật suy giảm trí nhớ Ebbinghaus và phân phối thời gian Log-Normal để sinh ra **71.273 lượt tương tác thực nghiệm** có cấu trúc toán học chặt chẽ làm bệ phóng huấn luyện mô hình."*

---

### SLIDE 5: MÔ HÌNH HÓA TRI THỨC: TỪ BKT, DKT ĐẾN ĐỀ XUẤT PAL-NET

* **Eyebrow Tag:** TRỌNG TÂM NGHIÊN CỨU AI
* **Tiêu đề slide (28pt):** `Tiến Trình Kiến Trúc: BKT $\to$ DKT $\to$ Đề Xuất PAL-Net`
* **Bố cục thị giác:** 3 Thẻ cột dọc so sánh 3 kiến trúc mô hình (Cột 1: BKT / Cột 2: DKT / Cột 3: Đề xuất PAL-Net với viền xanh nổi bật).
* **Nội dung Cột 1 (📌 Bayesian Knowledge Tracing - BKT):**
  - **• Cơ chế:** Mô hình Markov ẩn (HMM) theo dõi trạng thái thành thạo nhị phân $L \in \{0, 1\}$.
  - **• Tham số:** 4 tham số xác suất ($L_0$: biết trước, $T$: chuyển tiếp học, $G$: đoán mò, $S$: sơ suất).
  - **• Giới hạn:** Giả định các kỹ năng hoàn toàn độc lập, không nắm bắt được chuỗi tương tác dài.
* **Nội dung Cột 2 (🧠 Deep Knowledge Tracing - DKT):**
  - **• Cơ chế:** Mạng nơ-ron hồi quy LSTM (hoặc RNN) xử lý chuỗi nộp bài $(x_t, y_t)$ theo thời gian.
  - **• Ưu điểm:** Học được sự phụ thuộc phi tuyến tính phức tạp trong lịch sử làm bài.
  - **• Giới hạn:** "Mù cấu trúc" — bỏ qua mối quan hệ tiên quyết trên Cây kỹ năng DAG của ngôn ngữ.
* **Nội dung Cột 3 (⭐ Path-Augmented Learning Network - PAL-Net):**
  - **• Kiến trúc đề xuất:** Kết hợp **Graph Neural Network (GNN/GCN)** trên Đồ thị Tri thức DAG + **Multi-Head Self-Attention** trên chuỗi lịch sử tương tác.
  - **• Đột phá:** Lan truyền trạng thái làm chủ qua các cạnh tiên quyết, khắc phục hiện tượng mất định hướng của LSTM khi học viên chuyển bài tập.

#### 🎙️ Lời thoại thuyết trình (Speaker Notes - ~2 phút):
> *"Trọng tâm nghiên cứu của đề tài nằm ở việc so sánh và phát triển mô hình Knowledge Tracing phù hợp cho việc học lập trình:*  
>  
> *- **Mô hình cổ điển BKT (Corbett & Anderson):** Sử dụng chuỗi Markov ẩn để ước lượng mức độ thành thạo. Dù có khả năng giải thích tốt, BKT coi mọi kỹ năng lập trình là độc lập với nhau, hoàn toàn bỏ qua sự phụ thuộc giữa các bài học.*  
> *- **Mô hình DKT (Piech et al., 2015):** Sử dụng mạng hồi quy LSTM để đọc toàn bộ chuỗi làm bài trong quá khứ. Tuy nhiên, DKT lại 'mù cấu trúc': nó chỉ nhìn dữ liệu theo dòng thời gian mà không biết rằng để học được 'Vòng lặp' thì bắt buộc phải qua 'Cú pháp điều kiện'.*  
> *- **Mô hình đề xuất PAL-Net (Path-Augmented Learning Network):** Để giải quyết điểm mù này, em đề xuất mô hình PAL-Net kết hợp mạng nơ-ron đồ thị GNN trên chính Đồ thị Tri thức DAG của khóa học, kết hợp cơ chế Attention trên lịch sử bài tập. Nhờ đó, trạng thái thành thạo của các kỹ năng cha được lan truyền sang kỹ năng con, giúp mô hình dự đoán chính xác hơn ngay cả khi học viên mới làm bài đầu tiên của một chủ đề mới."*

---

### SLIDE 6: KẾT QUẢ THỰC NGHIỆM ĐỐI ĐẦU: BKT VS DKT VS PAL-NET

* **Eyebrow Tag:** KẾT QUẢ THỰC NGHIỆM AI
* **Tiêu đề slide (28pt):** `Đánh Giá Hiệu Năng Độc Lập Qua 3 Seeds Trên 3 Ngôn Ngữ`
* **Bố cục thị giác:**
  - Nửa trên: Bảng số liệu thực nghiệm khoa học chuẩn đối chiếu BKT vs DKT vs PAL-Net.
  - Nửa dưới: 3 Thẻ phân tích định lượng then chốt.
* **Bảng Thực Nghiệm Đối Đầu (Đánh giá trung bình qua 3 Seeds: 20261013, 20261014, 20261015):**

| Ngôn ngữ | Mô hình | ROC-AUC ↑ | Accuracy ↑ | Log Loss ↓ | Brier Score ↓ |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Python** | BKT (Baseline) | 0.5863 | 0.5615 | 0.6855 | 0.2459 |
| | DKT (LSTM) | 0.5354 | 0.5390 | 0.6891 | 0.2480 |
| | **PAL-Net (Đề xuất)** | **0.6449** *(+10.95%)* | **0.6109** | **0.6614** | **0.2345** |
| **JavaScript** | BKT (Baseline) | 0.5921 | 0.5711 | 0.6789 | 0.2429 |
| | DKT (LSTM) | 0.5183 | 0.5025 | 0.6930 | 0.2499 |
| | **PAL-Net (Đề xuất)** | **0.6338** *(+11.55%)* | **0.5982** | **0.6699** | **0.2385** |
| **C++** | BKT (Baseline) | 0.5673 | 0.5704 | 0.6869 | 0.2467 |
| | DKT (LSTM) | 0.5353 | 0.5307 | 0.6918 | 0.2493 |
| | **PAL-Net (Đề xuất)** | **0.6167** *(+8.14%)* | **0.5832** | **0.6714** | **0.2393** |

* **Nội dung thẻ Phân Tích (💡 Phát Hiện Thực Nghiệm Cốt Lõi):**
  - **1. PAL-Net dẫn đầu vượt trội toàn diện:** Trên cả 3 ngôn ngữ, PAL-Net đều đạt ROC-AUC và Accuracy cao nhất, Log Loss và Brier Score thấp nhất (AUC Python đạt **0.6449**, cao hơn DKT tới +10.95%).
  - **2. Nguyên nhân DKT hụt hơi:** Mạng LSTM thuần túy gặp hiện tượng vanishing gradient và bị nhiễu khi chuỗi học tập có những bước nhảy kiến thức không liên tục, trong khi BKT đơn giản nhưng ổn định hơn.
  - **3. Độ trễ suy diễn thực tế:** PAL-Net chỉ mất trung bình **<12ms/dự đoán** trên CPU, đáp ứng hoàn hảo yêu cầu tính toán thời gian thực trong sản phẩm.

#### 🎙️ Lời thoại thuyết trình (Speaker Notes - ~2 phút):
> *"Kính thưa Hội đồng, đây là bảng kết quả thực nghiệm quan trọng nhất của đề tài. Cả 3 mô hình BKT, DKT và PAL-Net được huấn luyện và đánh giá trên cùng tập dữ liệu, cùng cách chia người học (80% train, 10% val, 10% test), và lấy trung bình qua 3 seeds ngẫu nhiên độc lập:*  
>  
> *- **PAL-Net đạt kết quả tốt nhất trên cả 3 ngôn ngữ:** Tại khóa Python, PAL-Net đạt ROC-AUC là **0.6449** (vượt trội so với BKT là 0.5863 và DKT là 0.5354). Xu hướng này lặp lại nhất quán trên cả JavaScript (**0.6338**) và C++ (**0.6167**).*  
> *- **Một phát hiện thực nghiệm rất đáng chú ý:** Mô hình Deep KT (DKT) dùng LSTM thuần túy lại có kết quả thấp hơn cả mô hình truyền thống BKT. Lý do là trong lập trình, học viên thường chuyển đổi qua lại giữa các module; LSTM bị mất phương hướng khi không có cấu trúc đồ thị dẫn dắt.*  
> *- **PAL-Net khắc phục triệt để nhược điểm này** nhờ lớp tích chập đồ thị (GCN) neo giữ quan hệ tiên quyết. Đồng thời, độ trễ suy diễn của PAL-Net chỉ mất dưới 12 mili-giây, hoàn toàn sẵn sàng phục vụ hàng nghìn người dùng đồng thời trên production."*

---

### SLIDE 7: PHÂN TÍCH THỰC NGHIỆM: TẢI NHẬN THỨC & THỜI ĐIỂM VÀNG AI

* **Eyebrow Tag:** PHÂN TÍCH THỰC NGHIỆM SƯ PHẠM
* **Tiêu đề slide (28pt):** `Tải Nhận Thức & Xác Định "Thời Điểm Vàng" AI Can Thiệp`
* **Bố cục thị giác:**
  - Bên trái: Khung chứa ảnh [`02_cognitive_load_and_difficulty.png`](file:///d:/Project/LearnPython/docs/slide-thuyet_trinh/images/02_cognitive_load_and_difficulty.png).
  - Bên phải: Thẻ phân tích định lượng ngưỡng can thiệp ZPD.
* **Nội dung thẻ Phải (⏱️ Định Lượng Tải Nhận Thức):**
  - **• Bài Dễ (d=1):** Thời gian làm bài 45–65s, độ chính xác >75%, người học duy trì hứng thú cao.
  - **• Bài Trung bình (d=2):** Thời gian tư duy 90–130s, độ chính xác 45–55%, xuất hiện tư duy thử nghiệm tích cực.
  - **• Bài Khó (d=3):** Thời gian tư duy tăng vọt (180–300s). Học viên nhóm Yếu (NEW) tỷ lệ đúng sụp đổ xuống dưới **20%**.
  - **🎯 Ngưỡng can thiệp 180s (Golden Trigger):** Nếu học viên dừng lại ở một bài khó quá 180s mà chưa nộp bài, AI tự động kích hoạt gợi ý giàn giáo (Scaffolding) để ngăn chặn cảm giác bất lực và bỏ cuộc.

#### 🎙️ Lời thoại thuyết trình (Speaker Notes - ~1.5 phút):
> *"Bên cạnh độ chính xác của mô hình KT, đề tài còn phân tích mối tương quan giữa Tải nhận thức (thời gian làm bài) và Độ khó bài tập để xác định thời điểm can thiệp sư phạm:*  
> *- Ở bài Dễ ($d=1$), sinh viên giải nhanh trong dưới 1 phút với độ đúng trên 75%.*  
> *- Ở mức độ Trung bình ($d=2$), thời gian giải từ 1.5 đến 2 phút, đây là vùng rèn luyện lý tưởng nhất.*  
> *- Tuy nhiên, ở bài Khó ($d=3$), thời gian tư duy vọt lên trên 3 phút (180-300s) và tỷ lệ giải đúng của nhóm sinh viên mới bắt đầu tụt xuống dưới 20%. Đây chính là thời điểm sinh viên dễ nản chí và từ bỏ môn học nhất.*  
>  
> *Hệ thống Mcode đã tận dụng con số thực nghiệm này để thiết lập **'Thời điểm vàng can thiệp'**: Khi phát hiện học viên bị tắc nghẽn quá 180 giây ở một bài khó, Trợ lý AI sẽ tự động xuất hiện, đưa ra câu hỏi gợi ý bước đi tiếp theo mà không làm lộ lời giải."*

---

### SLIDE 8: ỨNG DỤNG PAL-NET VÀO ĐIỀU HƯỚNG LỘ TRÌNH THÍCH ỨNG (ZPD)

* **Eyebrow Tag:** ỨNG DỤNG HỆ THỐNG
* **Tiêu đề slide (28pt):** `Điều Hướng Cá Nhân Hóa & Vùng Thử Thách Vừa Sức (ZPD)`
* **Bố cục thị giác:** 2 Thẻ lớn song song (Thẻ Trái: Thuật toán gợi ý Golden Zone / Thẻ Phải: Cây lộ trình thích ứng).
* **Nội dung thẻ Trái (🎯 Chiến Lược Vùng Thử Thách Vừa Sức - Golden Zone):**
  - **• Công thức đề xuất:** Dựa trên xác suất dự đoán $P(\text{correct})$ của PAL-Net cho các bài tập ứng viên trong đồ thị DAG.
  - **• Ngưỡng Golden Zone ($0.70 \le P \le 0.85$):** Đảm bảo bài tập vừa đủ thử thách để kích thích tư duy nhưng không vượt quá năng lực gây nản chí, duy trì trạng thái dòng chảy (Flow State).
  - **• Tránh 2 thái cực:** $P > 0.85$ (quá dễ $\to$ gây nhàm chán); $P < 0.50$ (quá khó $\to$ gây bỏ cuộc).
* **Nội dung thẻ Phải (🗺️ Cơ Chế Tự Động Phục Hồi Tri Thức - Remediation):**
  - **• Phát hiện đứt gãy tiên quyết:** Nếu học viên liên tục làm sai một bài khó, PAL-Net lập tức truy vết ngược về các node cha trong DAG.
  - **• Đề xuất bài tập bắc cầu:** Tự động chèn các bài tập củng cố kỹ năng thành phần (Sub-skills) trước khi cho học viên thử lại bài toán phức tạp.
  - **• Động thái thích ứng thời gian thực:** Trạng thái Roadmap cập nhật ngay sau mỗi lượt nộp bài.

#### 🎙️ Lời thoại thuyết trình (Speaker Notes - ~1.5 phút):
> *"Vậy mô hình PAL-Net được ứng dụng như thế nào vào sản phẩm thực tế?*  
>  
> *Mỗi khi học viên hoàn thành một bài tập, PAL-Net sẽ tính toán xác suất giải đúng $P(\text{correct})$ cho toàn bộ các bài tập tiếp theo có thể mở khóa trên Đồ thị DAG:*  
> *- Thuật toán ưu tiên chọn các bài tập rơi vào **'Golden Zone' từ 70% đến 85%**. Đây chính là Vùng phát triển gần nhất (ZPD), giúp sinh viên luôn cảm thấy mình đang tiến bộ trong vùng thử thách vừa sức mà không rơi vào trạng thái chán nản hay quá tải.*  
> *- Nếu sinh viên liên tục thất bại ở một kỹ năng nâng cao, thuật toán không ép sinh viên làm lại bài đó mà truy vết ngược đồ thị DAG, tự động gợi ý một bài tập bắc cầu ở kỹ năng tiên quyết để vá lỗ hổng kiến thức trước."*

---

### SLIDE 9: TRỢ LÝ SƯ PHẠM AI (MULTI-AGENT) & SANDBOX CHẤM CODE AN TOÀN

* **Eyebrow Tag:** HẠ TẦNG KỸ THUẬT & AN TOÀN
* **Tiêu đề slide (28pt):** `Hệ Thống Trợ Lý Multi-Agent & Môi Trường Sandbox Zero-Trust`
* **Bố cục thị giác:** 2 Thẻ song song (Thẻ Trái: Kiến trúc Multi-Agent / Thẻ Phải: Cơ chế bảo mật Sandbox).
* **Nội dung thẻ Trái (🤖 Kiến Trúc Sư Phạm Multi-Agent):**
  - **• Intent Router Agent:** Phân loại ý định người dùng (hỏi lý thuyết, hỏi lỗi cú pháp, hay tán gẫu) trong <20ms.
  - **• Socratic Tutor Agent:** Áp dụng phương pháp sư phạm gợi mở (Scaffolding). Tuyệt đối **không viết hộ code** mà đặt câu hỏi phản chiếu giúp học viên tự tìm ra bug.
  - **• AI Key Pool Fallback:** Cơ chế xoay tua API Key chống Rate Limit và bộ luật dự phòng nội bộ hoạt động 100% offline nếu mất kết nối LLM.
* **Nội dung thẻ Phải (🛡️ Sandbox Docker Zero-Trust & Chấm Điểm):**
  - **• Cách ly mạng tuyệt đối (`--network none`):** Chặn 100% nguy cơ tấn công mạng hoặc kết nối trái phép vào database.
  - **• Giới hạn tài nguyên nghiêm ngặt:** Khống chế 128MB RAM, tối đa 3.0s CPU, giới hạn tiến trình `--pids-limit 64` chống Fork-bomb.
  - **• Phân tích cú pháp tĩnh AST:** Quét cây cú pháp trước khi chạy để kiểm tra các ràng buộc thuật toán (như cấm dùng thư viện có sẵn).

#### 🎙️ Lời thoại thuyết trình (Speaker Notes - ~1.5 phút):
> *"Bên cạnh Knowledge Tracing, Mcode hoàn thiện trải nghiệm học tập bằng 2 trụ cột kỹ thuật:*  
>  
> *- **Trợ lý AI sư phạm Multi-Agent:** Được thiết kế để giải quyết vấn đề học vẹt do các công cụ như ChatGPT gây ra. Khi học viên hỏi bài, AI không giải hộ code mà đóng vai trò như một người thầy Socratic, phân tích cây cú pháp AST và đặt câu hỏi gợi mở từng bước.*  
> *- **Hạ tầng Sandbox Docker:** Áp dụng nguyên tắc Zero-Trust, cắt hoàn toàn kết nối Internet của container, khống chế 128MB RAM và 3 giây CPU, quét mã AST trước khi biên dịch, đảm bảo máy chủ an toàn tuyệt đối trước mọi hành vi cố tình chèn mã độc của sinh viên."*

---

### SLIDE 10: TỔNG KẾT ĐÓNG GÓP & ĐỊNH HƯỚNG TƯƠNG LAI

* **Eyebrow Tag:** KẾT LUẬN & ĐỊNH HƯỚNG
* **Tiêu đề slide (28pt):** `Đóng Góp Cốt Lõi Của Đề Tài & Kế Hoạch Phát Triển`
* **Bố cục thị giác:** 2 Thẻ lớn song song (Thẻ Trái: 4 Đóng góp cốt lõi / Thẻ Phải: 3 Hướng mở rộng).
* **Nội dung thẻ Trái (🏆 4 Đóng Góp Cốt Lõi Của Đề Tài):**
  - **1. Giải quyết bài toán Cold-Start:** Phát triển thuật toán Cognitive Traversal sinh tập dữ liệu 71.273 lượt tương tác chuẩn khoa học trên 917 bài tập thật.
  - **2. Mô hình PAL-Net vượt trội:** Đạt hiệu năng dẫn đầu trên cả 3 ngôn ngữ (AUC Python 0.6449, JS 0.6338, C++ 0.6167), chứng minh giá trị của việc nhúng Đồ thị Tri thức DAG.
  - **3. Điều hướng thích ứng ZPD:** Xây dựng cơ chế đề xuất bài tập Golden Zone (0.70–0.85) với độ trễ suy diễn cực thấp <12ms.
  - **4. Nền tảng hoàn chỉnh & an toàn:** Triển khai thành công hệ thống Microservices tích hợp Monaco Editor, Multi-Agent Socratic và Sandbox Zero-Trust.
* **Nội dung thẻ Phải (🚀 Kế Hoạch Mở Rộng Tương Lai):**
  - **1. Triển khai thử nghiệm thực tế:** Đưa vào lớp học nhập môn CNTT của trường để thu thập dữ liệu sinh viên thật và kiểm định thực tế.
  - **2. Tinh chỉnh LLM chuyên biệt:** Fine-tuning mô hình DeepSeek-Coder trên tập dữ liệu sư phạm để tối ưu hóa phản hồi tiếng Việt.
  - **3. Mở rộng đa ngôn ngữ:** Bổ sung Đồ thị Tri thức cho Java, Golang và hệ thống phân tích độ phức tạp thuật toán $O(N)$.

#### 🎙️ Lời thoại thuyết trình (Speaker Notes - ~1.5 phút):
> *"Kính thưa Quý Thầy Cô, tổng kết lại đề tài **Mcode**, chúng em đã đạt được 4 đóng góp kỹ thuật quan trọng:*  
> *1. Đã giải quyết thành công bài toán Khởi động nguội bằng thuật toán Cognitive Traversal có cơ sở toán học vững chắc.*  
> *2. Đề xuất mô hình PAL-Net kết hợp GNN và Đồ thị DAG, vượt trội hơn cả DKT và BKT trên cả 3 ngôn ngữ lập trình.*  
> *3. Hiện thực hóa thuật toán đề xuất lộ trình ZPD thời gian thực dưới 12ms.*  
> *4. Xây dựng một sản phẩm phần mềm hoàn chỉnh, an toàn và sẵn sàng chạy thực tế.*  
>  
> *Hướng phát triển tiếp theo của đề tài là đưa hệ thống vào thử nghiệm thực tế tại các lớp học lập trình của trường, đồng thời fine-tuning một mô hình LLM chuyên trách cho sư phạm tiếng Việt."*

---

### SLIDE 11: LỜI CẢM ƠN (THANK YOU & Q&A)

* **Eyebrow Tag:** KẾT THÚC PHẦN TRÌNH BÀY
* **Tiêu đề lớn (44pt Bold):** `XIN CHÂN THÀNH CẢM ƠN!`
* **Tiêu đề phụ (24pt):** `Kính chúc Quý Thầy Cô trong Hội đồng sức khỏe và công tác tốt!`
* **Thẻ thông tin báo cáo (20–21pt):**
  - Đề tài: **Mcode — Nền Tảng Học Lập Trình Thích Ứng & Chấm Code Tự Động**
  - Sinh viên báo cáo: **Nguyễn Tuấn Việt** — Lớp: **D22CNTT02**
  - 💬 **Sẵn sàng tiếp nhận các câu hỏi và ý kiến đóng góp từ Hội đồng (Q&A)**

#### 🎙️ Lời thoại thuyết trình (Speaker Notes - ~30 giây):
> *"Trên đây là toàn bộ nội dung báo cáo đề tài của em. Em xin trân trọng cảm ơn Quý Thầy Cô trong Hội đồng đã chú ý lắng nghe.*  
> *Sau đây, em xin phép được trình diễn nhanh sản phẩm thực tế (Live Demo) và sẵn sàng trả lời các câu hỏi phản biện của Hội đồng. Em xin chân thành cảm ơn!"*

---

## 3. KỊCH BẢN TRÌNH DIỄN THỰC TẾ (LIVE DEMO FLOW: 3 - 5 PHÚT)

```
[Bước 1: Pre-test Đánh giá] ──> [Bước 2: Roadmap Thích ứng PAL-Net] ──> [Bước 3: Code & Sandbox Chấm] ──> [Bước 4: AI Mascot & Admin Key Pool]
```

### Bước 1: Khảo sát mục tiêu & Đánh giá năng lực đầu vào (1 phút)
1. Mở trang web `http://localhost:5173`.
2. Đăng nhập học viên và hoàn thành nhanh bài **Pre-test 6 câu hỏi**.
3. Thuyết minh: *"Hệ thống không bắt sinh viên phải học lại từ bài số 1 nếu đã có kiến thức. Bài Pre-test đo lường đa năng lực trên Đồ thị Tri thức."*

### Bước 2: Hiển thị Cây Lộ Trình Cá Nhân Hóa (Roadmap DAG) (1 phút)
1. Hệ thống chuyển ngay sang trang **Personalized Roadmap**.
2. Chỉ vào các node kỹ năng: Node xanh (Đã vượt qua Pre-test), Node vàng (Đang học trong vùng ZPD), Node xám (Đang khóa).
3. Thuyết minh: *"Cây lộ trình này được mô hình PAL-Net và thuật toán Topo tự động định tuyến dựa trên chính xác suất làm chủ của học viên."*

### Bước 3: Đấu trường Luyện tập & Chấm Sandbox tức thời (1.5 phút)
1. Mở bài tập thực hành trên Roadmap.
2. Viết thử một đoạn mã Python (hoặc C++) cố tình tạo lỗi logic.
3. Bấm nút **"Chạy Thử" / "Nộp Bài"**:
   - Chỉ cho Hội đồng thấy terminal phản hồi kết quả trong vòng **dưới 1 giây**.
   - Thuyết minh: *"Code được gửi tức thời sang container Docker Sandbox cách ly hoàn toàn (`--network none`), chấm qua 5 test case và hiện thông báo lỗi chi tiết."*

### Bước 4: Tương tác cùng Trợ lý AI Mascot & Bảng Quản trị (1 phút)
1. Bấm nút *"Hỏi AI về lỗi này"*:
   - Cho Hội đồng thấy câu trả lời của AI: AI không đưa ra lời giải ngay mà hỏi gợi mở: *"Hãy chú ý giá trị của biến index khi duyệt qua mảng..."*
2. Mở tab Admin: Cho xem danh sách **AI Key Pool** tự động xoay tua khi gặp lỗi 429.

---

## 4. CẨM NANG PHẢN BIỆN HỘI ĐỒNG (Q&A DEFENSE GUIDE)

---

### ❓ Câu 1: Tại sao em lại nghiên cứu cả 3 mô hình BKT, DKT và PAL-Net? Ưu nhược điểm của từng mô hình là gì?

> **🎯 Đáp án mẫu:**  
> *"Dạ thưa Thầy Cô, việc đối đầu cả 3 thế hệ mô hình là để tìm ra giải pháp tối ưu nhất cho bài toán lập trình:*  
> *1. **BKT (1995):** Ưu điểm là tính toán cực nhanh, công thức xác suất đóng dễ giải thích. Nhưng nhược điểm là coi các kỹ năng độc lập, không bắt được chuỗi phụ thuộc dài.*  
> *2. **DKT (2015):** Dùng mạng LSTM để đọc chuỗi thời gian, rất mạnh trên các bài toán trắc nghiệm tuần tự. Nhưng nhược điểm lớn khi áp dụng vào lập trình là 'mù cấu trúc' — LSTM không biết quan hệ tiên quyết giữa các bài học, dẫn đến hiệu năng AUC bị giảm sút.*  
> *3. **PAL-Net (Đề xuất):** Kết hợp GNN trên Đồ thị Tri thức DAG và Attention trên lịch sử. Mô hình này vừa có khả năng nhớ chuỗi dài của Deep Learning, vừa có định hướng cấu trúc sư phạm của Đồ thị DAG, giúp đạt AUC cao nhất trên cả 3 ngôn ngữ (Python 0.6449 so với DKT 0.5354)."*

---

### ❓ Câu 2: Tại sao kết quả thực nghiệm DKT lại thấp hơn BKT trên bộ dữ liệu của em?

> **🎯 Đáp án mẫu:**  
> *"Dạ thưa Thầy Cô, đây là một phát hiện thực nghiệm rất giá trị và hoàn toàn phù hợp với bản chất toán học:*  
> *1. Trong giáo dục lập trình, người học không làm bài theo thứ tự tuyến tính hoàn hảo mà thường nhảy qua lại giữa các module hoặc làm lại bài cũ.*  
> *2. Mạng LSTM của DKT giả định quan hệ Markov bậc cao trên dòng thời gian thuần túy. Khi gặp bước nhảy kiến thức đột ngột mà không có ma trận kề của đồ thị dẫn hướng, LSTM bị nhiễu trọng số (gradient noise).*  
> *3. Trong khi đó, BKT ước lượng độc lập trên từng kỹ năng nên không bị ảnh hưởng bởi thứ tự nhảy cóc. Điều này chứng minh rằng với giáo dục lập trình, việc đưa Đồ thị Tiên quyết (DAG) vào mạng nơ-ron như PAL-Net là yếu tố sống còn để vượt qua giới hạn của DKT."*

---

### ❓ Câu 3: Dữ liệu 71.273 bản ghi là dữ liệu giả lập (Synthetic Data). Làm sao đảm bảo tính trung thực khoa học và giá trị thực tế?

> **🎯 Đáp án mẫu:**  
> *"Dạ thưa Thầy Cô, trong báo cáo em nêu rất minh bạch: đây là dữ liệu mô phỏng nhận thức dùng để giải quyết bài toán Khởi động nguội (Cold-Start):*  
> *1. Dữ liệu này không sinh ngẫu nhiên mà chạy trên **100% bài tập thật (917 bài UUID)** từ database.*  
> *2. Quá trình giải bài tuân theo **Lý thuyết Ứng đáp Câu hỏi (IRT)**, phân phối thời gian **Log-Normal** và quy luật quên lãng **Ebbinghaus**.*  
> *3. Bộ dữ liệu đóng vai trò như một môi trường tiền huấn luyện (Pre-training) chuẩn mực. Khi triển khai thực tế có thêm dữ liệu sinh viên thật, mô hình chỉ cần Fine-tuning tiếp mà không phải học lại từ con số 0."*

---

### ❓ Câu 4: Khi sinh viên nhập code tùy ý lên web, làm thế nào để đảm bảo học viên không thể hack database hoặc phá hủy máy chủ?

> **🎯 Đáp án mẫu:**  
> *"Dạ thưa Thầy Cô, hệ thống áp dụng nguyên tắc **Zero-Trust và Chế độ Fail-Closed** thông qua hạ tầng Sandbox Docker:*  
> *1. **Cách ly mạng tuyệt đối (`--network none`):** Container không có kết nối Internet hay mạng nội bộ, sinh viên không thể gửi request ra ngoài hay kết nối vào database PostgreSQL.*  
> *2. **Giới hạn tài nguyên cứng:** Tối đa 128MB RAM, 3.0s CPU và `--pids-limit 64` chống tấn công Fork-bomb.*  
> *3. **Quyền hạn tối thiểu:** Chạy dưới user `nobody` không đặc quyền, file system ở chế độ Read-Only.*  
> *4. **Quét cú pháp tĩnh AST:** Quét mã trước khi biên dịch để từ chối ngay các lệnh nguy hiểm."*

---

### ❓ Câu 5: Nếu có 100 sinh viên cùng bấm nộp bài một lúc, hệ thống xử lý như thế nào để không bị sập?

> **🎯 Đáp án mẫu:**  
> *"Dạ thưa Thầy Cô, Backend được tích hợp sẵn **Hàng đợi điều tiết luồng thực thi (Concurrency Queue)**:*  
> *1. Tham số `maxConcurrency` được cấu hình mặc định là 4. Khi 100 bài nộp đồng thời, 4 bài được đẩy vào Sandbox Docker chạy song song, 96 bài xếp hàng an toàn trong RAM.*  
> *2. Nhờ thời gian chạy mỗi bài rất nhanh (300ms - 800ms), toàn bộ 100 bài được giải phóng trong khoảng 15-20 giây mà CPU máy chủ không bao giờ bị quá tải 100%."*

---

### ❓ Câu 6: Tại sao không dùng thẳng ChatGPT/Gemini để gợi ý lộ trình mà phải huấn luyện mô hình KT riêng?

> **🎯 Đáp án mẫu:**  
> *"Dạ thưa Thầy Cô, có 3 lý do kỹ thuật bắt buộc phải dùng mô hình KT chuyên biệt:*  
> *1. **Hiện tượng ảo giác (Hallucination):** LLM có thể đề xuất bài tập không tồn tại hoặc nhảy cóc bỏ qua kỹ năng tiên quyết.*  
> *2. **Độ trễ và Chi phí:** Gọi LLM mất 2 đến 4 giây và tốn chi phí token cho mỗi lượt nộp bài, trong khi PAL-Net suy diễn nội bộ chỉ mất **<12ms** với chi phí bằng 0.*  
> *3. **Tính nhất quán:** PAL-Net xuất ra xác suất toán học chính xác $P(\text{correct}) \in [0, 1]$, làm đầu vào tin cậy cho thuật toán điều phối Golden Zone, trong khi LLM chỉ đóng vai trò giao tiếp ngôn ngữ tự nhiên."*

---

## 5. HƯỚNG DẪN KỸ THUẬT TÁI TẠO & TÙY BIẾN FILE PPTX

Tệp trình chiếu PowerPoint [`docs/slide-thuyet_trinh/slide_thuyet_trinh_mcode.pptx`](file:///d:/Project/LearnPython/docs/slide-thuyet_trinh/slide_thuyet_trinh_mcode.pptx) được sinh tự động bằng mã Python:

```bash
# Lệnh cập nhật và xuất lại file PowerPoint
python ai-service/scripts/data_generation/generate_custom_mcode_presentation.py
```

Chúc bạn tự tin bảo vệ đồ án và đạt kết quả xuất sắc nhất trước Hội đồng! 🎉
