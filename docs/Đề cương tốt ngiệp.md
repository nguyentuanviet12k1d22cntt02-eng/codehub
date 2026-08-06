
TRƯỜNG ĐẠI HỌC THỦ DẦU MỘT	CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
VIỆN CÔNG NGHỆ SỐ	Độc lập- Tự do- Hạnh phúc


TP.HCM, ngày     tháng       năm 202…

ĐỀ CƯƠNG BÁO CÁO TỐT NGHIỆP
1. Thông tin sinh viên
- Họ và tên: Nguyễn Tuấn Việt
- Mã số sinh viên: 2224802010911 
- Lớp: D22CNTT02
- Khóa: D22
- Số điện thoại: 0868274624
- Giảng viên hướng dẫn: Ngô Thị Ngọc Dịu
2. Tên đề tài đăng ký
Xây dựng hệ thống học tập lập trình trực tuyến thích ứng dựa trên khung mô hình PAL-Net
3. Mục tiêu nghiên cứu
**3.1. Mục tiêu tổng quát**
Nghiên cứu, thiết kế và xây dựng thành công hệ thống học tập trực tuyến thích ứng hỗ trợ đa ngôn ngữ (Python, JavaScript và truy vấn SQL) nhằm cá nhân hóa lộ trình học tập của từng người học, nâng cao hiệu quả tiếp thu kiến thức và kỹ năng lập trình/truy vấn dựa trên việc tích hợp khung mô hình PAL-Net (Personalized Adaptive Learning Network).

**3.2. Mục tiêu cụ thể**
- **Nghiên cứu lý thuyết:** Phân tích lý thuyết về học tập thích ứng (Adaptive Learning), các mô hình đánh giá trạng thái kiến thức và nghiên cứu chuyên sâu cấu trúc, nguyên lý hoạt động của khung mô hình PAL-Net trong việc mô hình hóa người học và gợi ý học liệu.
- **Thiết kế mô hình và thuật toán:** Xây dựng mô hình người học (Student Model) động (cập nhật liên tục trình độ, tốc độ học, phong cách học, lịch sử tương tác); thiết kế bài kiểm tra đánh giá năng lực đầu vào (Pre-test) để khởi tạo hồ sơ người học (Learner Profile) nhằm giải quyết bài toán khởi tạo lạnh (Cold-start); và thiết kế thuật toán gợi ý lộ trình học lý thuyết kết hợp với thực hành (Python, JavaScript và SQL) thích ứng phù hợp với từng cá nhân.
- **Phát triển hệ thống:** Thiết kế kiến trúc và hiện thực hóa hệ thống học tập trực tuyến (Web-based Learning Platform) hỗ trợ trình soạn thảo và môi trường sandbox biên dịch và thực thi mã nguồn đa ngôn ngữ (bao gồm Python, JavaScript và thực thi các câu lệnh truy vấn SQL trực tuyến), tích hợp bộ công cụ gợi ý thích ứng.
- **Thử nghiệm và đánh giá:** Triển khai thực nghiệm hệ thống trên nhóm người học thực tế, thu thập dữ liệu (log tương tác và kết quả làm bài) và đánh giá định lượng và định tính về mức độ cải thiện kết quả học tập cũng như mức độ hài lòng về trải nghiệm người dùng.

4. Nội dung, phạm vi nghiên cứu
**4.1. Nội dung nghiên cứu**
- **Nội dung 1: Khảo sát và nghiên cứu lý thuyết**
  - Nghiên cứu tổng quan về hệ thống học tập thích ứng và các mô hình biểu diễn tri thức người học.
  - Nghiên cứu chi tiết khung mô hình PAL-Net (Personalized Adaptive Learning Network): Khảo sát lý thuyết nền tảng, thiết kế kiến trúc và phân tích cơ chế hoạt động của mô hình học tập thích ứng cá nhân hóa trong việc theo dõi năng lực người học lập trình (Python, JavaScript) và truy vấn cơ sở dữ liệu (SQL) trực tuyến.
    - Nghiên cứu Kiến trúc Đồ thị Tri thức (GCN Module): Định nghĩa cây kỹ năng (Skill Tree) cho Python, JavaScript và SQL thông qua cấu trúc đồ thị có hướng mô tả các mối liên hệ phụ thuộc tiên quyết (prerequisite). Sử dụng mạng tích chập đồ thị (GCN) để nhúng các khái niệm kiến thức (Knowledge Components - KC) thành các đặc trưng không gian đa chiều.
    - Nghiên cứu Phân hệ Nhúng Người học (Learner Embedding): Tích hợp hồ sơ năng lực của học viên (bao gồm các chỉ số tĩnh như điểm Pre-test, kỹ năng cơ bản, phong cách học tập và các chỉ số động) vào mạng nơ-ron thông qua kỹ thuật nhúng (Embedding) nhằm cá nhân hóa trọng số dự đoán.
    - Nghiên cứu Cơ chế Chú ý Thời gian (Attention Module): Sử dụng mạng nơ-ron hồi quy GRU kết hợp cơ chế chú ý (Attention Mechanism) trên toàn bộ chuỗi lịch sử tương tác code nhằm ghi nhớ và phân tích sâu các lỗ hổng kiến thức theo tiến trình thời gian của học viên.
    - Nghiên cứu Cơ chế Cập nhật Trạng thái Kiến thức Thời gian thực: Thiết lập quy trình mã hóa kết quả thực hành từ Sandbox (đúng và sai, thời gian chạy, số lần chạy thử, lỗi biên dịch hệ thống) thành vector tương tác và thực hiện lan truyền xuôi cập nhật mức độ làm chủ các kỹ năng trên đồ thị tri thức.
- **Nội dung 2: Phân tích và thiết kế hệ thống gợi ý thích ứng**
  - Thiết kế cấu trúc cơ sở dữ liệu lưu trữ hồ sơ người học (Learner Profile) và cây kỹ năng cho các ngôn ngữ lập trình Python, JavaScript và truy vấn SQL (Programming & Query Skill Tree).
  - Giải quyết bài toán khởi tạo lạnh (Cold-start) bằng cách xây dựng bài kiểm tra đánh giá năng lực đầu vào (Pre-test) để khởi tạo hồ sơ người học (Learner Profile).
  - Nghiên cứu kiến trúc của khung PAL-Net, đồng thời tham chiếu/so sánh với các thuật toán Knowledge Tracing truyền thống (như BKT, DKT) để xây dựng bộ ước lượng kiến thức và đề xuất lộ trình học tập, bài tập lập trình và truy vấn thích ứng phù hợp (Python, JavaScript, SQL).
    - Thiết kế Quy trình chuyển tiếp từ Lý thuyết đến Thực hành: Hướng dẫn người học đi theo chu trình nhận thức toàn diện: Tiếp cận bài học lý thuyết trực quan (dạng Markdown/tài liệu hướng dẫn) -> Trả lời câu hỏi trắc nghiệm lý thuyết ngắn (Kiểm tra nhận biết và hiểu cú pháp) -> Thực hành giải bài tập viết mã nguồn (đối với Python, JavaScript) hoặc viết câu lệnh truy vấn (đối với SQL) trên sandbox (từ bài tập dễ đến bài tập nâng cao). Quy trình này đảm bảo việc tích lũy năng lực thực hành dựa sát trên nền tảng lý thuyết tương ứng.
    - Thiết kế Thuật toán gợi ý bài tập theo Vùng phát triển gần nhất (ZPD - Zone of Proximal Development): Định nghĩa khoảng xác suất giải đúng tối ưu 0.70 <= P_correct <= 0.85 dựa trên dự báo của PAL-Net. Hệ thống sẽ tự động lọc, chấm điểm và lựa chọn các bài thực hành chưa làm nằm trong khoảng ZPD này, tránh những bài tập quá dễ (gây nhàm chán) hoặc quá khó (gây nản lòng).
    - Thiết kế Cơ chế lựa chọn bài tập thích ứng củng cố: Phân tích đồ thị tri thức để xác định các kỹ năng tiên quyết chưa vững của học viên, từ đó ưu tiên gợi ý các bài thực hành giúp lấp đầy lỗ hổng kiến thức đó. Sử dụng thuật toán chọn lựa ngẫu nhiên có trọng số (weighted random) khi có nhiều bài tập phù hợp nhằm tăng tính đa dạng.
- **Nội dung 3: Phát triển ứng dụng Web-based Learning Platform**
  - Thiết kế kiến trúc hệ thống (Frontend, Backend, Database) đảm bảo tính mở rộng và khả năng tích hợp mô hình AI.
  - Xây dựng các module chức năng cốt lõi: Quản trị các khóa học lập trình và truy vấn (Python, JavaScript, SQL), Trình soạn thảo và chấm điểm mã nguồn và câu truy vấn trực tuyến (Online Judge Sandbox hỗ trợ Python, JavaScript và SQL), Trình theo dõi tiến độ và đề xuất bài học thích ứng cho học viên.
- **Nội dung 4: Thực nghiệm và đánh giá hiệu năng**
  - Xây dựng kịch bản thử nghiệm thực tế với nhóm đối tượng học sinh/sinh viên ngành Công nghệ thông tin học lập trình và truy vấn cơ sở dữ liệu (Python, JavaScript, SQL).
  - Thu thập dữ liệu tương tác, kết quả làm bài của người học (tập dữ liệu thực nghiệm quy mô nhỏ) để phân tích, đánh giá độ chính xác của mô hình gợi ý PAL-Net và hiệu quả cải thiện năng lực lập trình Python, JavaScript và SQL của người học.

**4.2. Phạm vi nghiên cứu**
- **Đối tượng nghiên cứu:** Khung mô hình học tập thích ứng cá nhân hóa PAL-Net; các thuật toán gợi ý lộ trình học tập; hệ thống biên dịch và chấm điểm mã nguồn đa ngôn ngữ (Python, JavaScript, SQL) trực tuyến.
- **Phạm vi công nghệ:** Tập trung phát triển nền tảng ứng dụng web hỗ trợ thực hành lập trình và cơ sở dữ liệu trực tuyến; môi trường Sandbox hỗ trợ biên dịch và thực thi 3 ngôn ngữ và công nghệ bao gồm Python, JavaScript và SQL. Thử nghiệm thực tế trên nhóm mẫu (quy mô khoảng 30-50 sinh viên tại Trường Đại học Thủ Dầu Một). Không đi sâu vào phát triển trình biên dịch và DBMS riêng biệt mà sử dụng các giải pháp sandbox và môi trường thực thi an toàn sẵn có.

5. Phương pháp nghiên cứu và Công nghệ dự kiến sử dụng
**5.1. Phương pháp nghiên cứu**
- **Phương pháp nghiên cứu lý thuyết (Theoretical Research):** Nghiên cứu tài liệu chuyên khảo, các bài báo khoa học trong và ngoài nước về Adaptive Learning, khung PAL-Net, các mô hình ước lượng kiến thức (Knowledge Tracing) truyền thống để làm cơ sở khoa học cho đề tài.
- **Phương pháp thực nghiệm hệ thống (System Experimentation):** Áp dụng quy trình phát triển phần mềm hiện đại (như Agile) để phân tích, thiết kế, xây dựng và hoàn thiện hệ thống phần mềm web. Cấu hình môi trường sandbox cô lập để chạy thử nghiệm các thuật toán gợi ý và chấm điểm tự động cho code Python, JavaScript và câu lệnh SQL.
- **Phương pháp thu thập và phân tích dữ liệu (Data Collection & Analysis):** Ghi nhận lịch sử làm bài, thời gian hoàn thành, tỷ lệ lỗi biên dịch của sinh viên tham gia thực nghiệm. Sử dụng các phương pháp thống kê toán học (như kiểm định T-test, đo lường các chỉ số Precision, Recall, F1-score của gợi ý) để phân tích và đánh giá hiệu quả của mô hình PAL-Net trên tập dữ liệu thực nghiệm quy mô nhỏ.

**5.2. Công nghệ dự kiến sử dụng**
- **Công nghệ Frontend:** 
  - **React.js / Next.js:** Framework JavaScript hiện đại giúp xây dựng giao diện người dùng (UI) động, phản hồi nhanh, tối ưu hóa hiệu năng tải trang và trải nghiệm người dùng mượt mà.
  - **CSS/Tailwind CSS:** Thiết kế giao diện trực quan, responsive tương thích với nhiều kích thước màn hình thiết bị.
- **Công nghệ Backend:**
  - **Node.js (Express.js) và Python (FastAPI):**
    - *Node.js* đảm nhận xử lý các tác vụ Web server, quản lý phiên đăng nhập, APIs và kết nối thời gian thực.
    - *Python* dùng để xây dựng phân hệ AI và Machine Learning, chạy thuật toán tính toán độ thích ứng và cập nhật trạng thái kiến thức đa ngôn ngữ (Python, JavaScript, SQL) của người học dựa trên khung PAL-Net (sử dụng các thư viện hỗ trợ như Scikit-learn, Pandas, NumPy).
- **Công nghệ Cơ sở dữ liệu:**
  - **PostgreSQL / MySQL:** Hệ quản trị cơ sở dữ liệu quan hệ để lưu trữ thông tin người dùng, cấu trúc các khóa học (Python, JavaScript, SQL), hồ sơ năng lực (Learner Profile) và các cây kỹ năng tương ứng (Programming & Query Skill Tree).
  - **MongoDB / Redis:** Lưu trữ dữ liệu phi cấu trúc như lịch sử tương tác chi tiết của người học (learning logs, code submissions) hoặc dùng làm bộ đệm (cache) tăng tốc độ truy xuất.
- **Kỹ thuật AI và Học máy:**
  - Xây dựng kiến trúc mô hình học sâu PAL-Net kết hợp GCN, Learner Embedding và Attention trên framework PyTorch để ước lượng chính xác trạng thái kiến thức của người học lập trình Python, JavaScript và SQL.
    - Thiết lập các cây kỹ năng lập trình và cơ sở dữ liệu định nghĩa các Node kỹ năng cho từng ngôn ngữ: đối với Python và JavaScript gồm Biến (KC_VAR), Cấu trúc rẽ nhánh (KC_COND), Vòng lặp (KC_LOOP), Mảng/Danh sách (KC_LIST), Từ điển/Đối tượng (KC_DICT), Định nghĩa hàm (KC_FUNC), Lập trình hướng đối tượng (KC_OOP); đối với SQL gồm các nhóm lệnh định nghĩa dữ liệu DDL (KC_DDL), thao tác dữ liệu DML (KC_DML), liên kết bảng (KC_JOIN), gom nhóm và lọc dữ liệu (KC_GROUP); kết quả được tổ chức trong cấu trúc đồ thị JSON làm đầu vào cho mạng GCN.
    - Xây dựng bộ tạo dữ liệu đa chiều thời gian thực từ Sandbox: Thu thập chi tiết các thuộc tính hành vi gồm: kết quả chạy testcase và câu lệnh truy vấn (correctness), tỷ lệ thời gian chạy (runtime_ratio), số lần nộp chạy code và câu lệnh truy vấn trước khi nộp (attempt_count), lỗi biên dịch và runtime cụ thể (error_type như SyntaxError, TypeError, IndexError đối với code Python và JavaScript, hoặc lỗi cú pháp SQL, lỗi ràng buộc cơ sở dữ liệu) để làm đầu vào cho mô hình.
    - Huấn luyện và Đánh giá so sánh chéo (Cross-model Evaluation): Huấn luyện và đánh giá trên tập dữ liệu lịch sử (gồm cả dữ liệu thực tế và dữ liệu giả lập). Tiến hành so sánh đối chuẩn hiệu năng giữa PAL-Net với Bayesian Knowledge Tracing (BKT - dùng thư viện pyBKT) và Deep Knowledge Tracing (DKT - dùng LSTM trên PyTorch) qua hai chỉ số AUC và RMSE để tự động lưu và đóng gói phiên bản mô hình tối ưu nhất.
    - Triển khai FastAPI microservice: Thiết lập endpoint API 'POST /api/recommend' thực thi lan truyền xuôi (Inference engine) có độ trễ cực thấp (dưới 100ms) để dự báo P_correct các bài tập chưa làm của học sinh theo thời gian thực và gợi ý bài tập trong khoảng ZPD vàng.
    - Cơ chế Dự phòng (Fallback Mechanism) chống lỗi: Tích hợp thiết lập trên Backend Node.js bộ điều khiển Circuit Breaker, tự động chuyển đổi sang cơ chế rule-based (gợi ý theo trình tự tuyến tính mặc định của bài học) trong trường hợp FastAPI gặp lỗi và quá thời gian phản hồi (timeout > 1 giây), đảm bảo hệ thống vận hành liên tục.
  - Thiết kế bài kiểm tra đánh giá năng lực đầu vào (Pre-test) tích hợp 5 câu hỏi nhanh đa cấp độ để tính toán vector nhúng ban đầu (Initial Learner Embedding E_learner^0) của học viên, giải quyết bài toán khởi tạo lạnh (Cold-start) cho người học mới.
  - Sử dụng công nghệ Docker Sandbox để cô lập môi trường thực thi code của học viên, đảm bảo an toàn bảo mật khi chạy và chấm bài tự động và hỗ trợ biên dịch và thực thi mã nguồn Python, JavaScript cũng như chạy thử nghiệm các câu lệnh truy vấn SQL.

6. Sản phẩm dự kiến
- **Hệ thống website hoàn chỉnh:** Một nền tảng học tập lập trình và cơ sở dữ liệu trực tuyến thích ứng (Web-based Adaptive Learning Platform hỗ trợ Python, JavaScript và SQL) hoạt động ổn định trên môi trường mạng. Hệ thống tích hợp đầy đủ giao diện người học (bảng điều khiển tiến trình học, bài kiểm tra đánh giá năng lực đầu vào Pre-test để khởi tạo hồ sơ học viên, trình soạn thảo và chấm bài code và câu lệnh truy vấn trực tuyến cho Python, JS, SQL, danh sách bài học/bài tập thích ứng theo lộ trình cá nhân hóa) và giao diện giảng viên/quản trị viên (quản lý ngân hàng câu hỏi, theo dõi báo cáo thống kê năng lực lớp học).
- **Tập dữ liệu (Dataset) thực nghiệm quy mô nhỏ:** Bao gồm log tương tác và kết quả làm bài của nhóm sinh viên thử nghiệm để dùng cho việc kiểm chứng mô hình.
- **Báo cáo phân tích hiệu năng của mô hình PAL-Net trên hệ thống:** Báo cáo khoa học chi tiết trình bày kết quả thực nghiệm hệ thống, phân tích định lượng hiệu năng gợi ý thích ứng của mô hình PAL-Net dựa trên các chỉ số kỹ thuật và đánh giá hiệu quả tiếp thu tri thức lập trình Python của người học so với phương pháp phương pháp học tập truyền thống.

