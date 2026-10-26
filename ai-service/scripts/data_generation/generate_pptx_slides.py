import os
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# 1. Khởi tạo Presentation Widescreen 16:9
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Bảng màu Dark Tech thẩm mỹ cao
COLOR_BG = RGBColor(11, 15, 25)            # #0B0F19
COLOR_CARD = RGBColor(21, 29, 48)          # #151D30
COLOR_BORDER = RGBColor(35, 48, 77)        # #23304D
COLOR_TEXT_WHITE = RGBColor(255, 255, 255)
COLOR_TEXT_MUTED = RGBColor(148, 163, 184) # #94A3B8
COLOR_TEXT_BODY = RGBColor(203, 213, 225)  # #CBD5E1
COLOR_PRIMARY = RGBColor(56, 189, 248)     # #38BDF8
COLOR_ACCENT = RGBColor(129, 140, 248)     # #818CF8
COLOR_SUCCESS = RGBColor(52, 211, 153)     # #34D399
COLOR_DANGER = RGBColor(248, 113, 113)     # #F87171

IMG_DIR = Path("D:/Project/LearnPython/docs/slide-thuyet_trinh/images")
OUTPUT_PPTX = Path("D:/Project/LearnPython/docs/slide-thuyet_trinh/slide_thuyet_trinh_mcode.pptx")

def add_background(slide):
    bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg_shape.fill.solid()
    bg_shape.fill.fore_color.rgb = COLOR_BG
    bg_shape.line.fill.background()
    return bg_shape

def add_header(slide, badge_text, title_text, subtitle_text, slide_num):
    # Badge
    badge_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(8), Inches(0.35))
    tf_badge = badge_box.text_frame
    tf_badge.word_wrap = True
    p_badge = tf_badge.paragraphs[0]
    p_badge.text = badge_text.upper()
    p_badge.font.size = Pt(11)
    p_badge.font.bold = True
    p_badge.font.color.rgb = COLOR_PRIMARY
    p_badge.font.name = "Segoe UI"
    
    # Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(10.5), Inches(0.55))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.size = Pt(22)
    p_title.font.bold = True
    p_title.font.color.rgb = COLOR_TEXT_WHITE
    p_title.font.name = "Segoe UI"
    
    # Subtitle
    sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(10.5), Inches(0.4))
    tf_sub = sub_box.text_frame
    tf_sub.word_wrap = True
    p_sub = tf_sub.paragraphs[0]
    p_sub.text = subtitle_text
    p_sub.font.size = Pt(12)
    p_sub.font.color.rgb = COLOR_TEXT_MUTED
    p_sub.font.name = "Segoe UI"
    
    # Slide watermark number
    num_box = slide.shapes.add_textbox(Inches(11.2), Inches(0.6), Inches(1.5), Inches(0.5))
    tf_num = num_box.text_frame
    p_num = tf_num.paragraphs[0]
    p_num.alignment = PP_ALIGN.RIGHT
    p_num.text = f"MCODE // {slide_num:02d}"
    p_num.font.size = Pt(13)
    p_num.font.bold = True
    p_num.font.color.rgb = COLOR_PRIMARY
    p_num.font.name = "Segoe UI"

def add_card(slide, left, top, width, height, title, items, icon="🔹", title_color=COLOR_PRIMARY):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = COLOR_CARD
    card.line.color.rgb = COLOR_BORDER
    card.line.width = Pt(1)
    
    tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), height - Inches(0.4))
    tf = tb.text_frame
    tf.word_wrap = True
    
    if title:
        p_title = tf.paragraphs[0]
        p_title.text = f"{icon}  {title}"
        p_title.font.size = Pt(15)
        p_title.font.bold = True
        p_title.font.color.rgb = title_color
        p_title.font.name = "Segoe UI"
        p_title.space_after = Pt(10)
        
    for item in items:
        p = tf.add_paragraph()
        p.text = f"•  {item}"
        p.font.size = Pt(12.5)
        p.font.color.rgb = COLOR_TEXT_BODY
        p.font.name = "Segoe UI"
        p.space_after = Pt(6)

# ==============================================================================
# SLIDE 1: BÌA BÁO CÁO
# ==============================================================================
s1 = prs.slides.add_slide(blank_layout)
add_background(s1)

tb1 = s1.shapes.add_textbox(Inches(1.2), Inches(1.5), Inches(11), Inches(4.5))
tf1 = tb1.text_frame
tf1.word_wrap = True

p_badge = tf1.paragraphs[0]
p_badge.text = "BÁO CÁO ĐỒ ÁN / KHÓA LUẬN TỐT NGHIỆP"
p_badge.font.size = Pt(13)
p_badge.font.bold = True
p_badge.font.color.rgb = COLOR_PRIMARY
p_badge.font.name = "Segoe UI"
p_badge.alignment = PP_ALIGN.CENTER
p_badge.space_after = Pt(20)

p_title = tf1.add_paragraph()
p_title.text = "HỆ THỐNG HỌC LẬP TRÌNH THÍCH ỨNG\nTÍCH HỢP TRỢ LÝ AI & CHẤM CODE TỰ ĐỘNG"
p_title.font.size = Pt(36)
p_title.font.bold = True
p_title.font.color.rgb = COLOR_TEXT_WHITE
p_title.font.name = "Segoe UI"
p_title.alignment = PP_ALIGN.CENTER
p_title.space_after = Pt(20)

p_sub = tf1.add_paragraph()
p_sub.text = "Nghiên cứu và phát triển nền tảng Mcode — Đánh giá nhận thức người học qua Đồ thị Kỹ năng\nvà Mô hình Knowledge Tracing trên 3 ngôn ngữ Python, JavaScript, C++"
p_sub.font.size = Pt(15)
p_sub.font.color.rgb = COLOR_TEXT_MUTED
p_sub.font.name = "Segoe UI"
p_sub.alignment = PP_ALIGN.CENTER
p_sub.space_after = Pt(35)

p_author = tf1.add_paragraph()
p_author.text = "Tác giả: Nguyễn Tuấn Việt   |   Hệ thống: Mcode Adaptive Engine   |   Năm 2026"
p_author.font.size = Pt(13)
p_author.font.bold = True
p_author.font.color.rgb = COLOR_ACCENT
p_author.font.name = "Segoe UI"
p_author.alignment = PP_ALIGN.CENTER

# ==============================================================================
# SLIDE 2: LÝ DO CHỌN ĐỀ TÀI
# ==============================================================================
s2 = prs.slides.add_slide(blank_layout)
add_background(s2)
add_header(s2, "PHẦN 1: TỔNG QUAN", "Lý do Chọn Đề tài & Bối cảnh", "Khoảng trống của các nền tảng E-Learning truyền thống đối với người học lập trình", 2)

add_card(s2, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), 
         "Bối cảnh Giáo dục Trực tuyến", 
         [
             "Nhu cầu học lập trình bùng nổ toàn cầu, đóng vai trò kỹ năng cốt lõi cho lực lượng lao động số thế hệ mới.",
             "Các nền tảng hiện hành (Coursera, LeetCode, Codecademy) cung cấp kho bài tập lớn nhưng áp dụng cơ chế 'One-size-fits-all'.",
             "Mọi học viên đều phải đi qua giáo trình tuyến tính cồng kềnh, không phân hóa giữa người học nhanh và người mới bắt đầu.",
             "Hệ thống chỉ ghi nhận kết quả cuối cùng (Pass/Fail) mà không nắm bắt được trạng thái nhận thức và điểm mù tri thức của học viên."
         ], icon="🌐")

add_card(s2, Inches(6.9), Inches(2.0), Inches(5.6), Inches(4.8), 
         "Sứ mệnh Nền tảng Mcode", 
         [
             "Học tập thích ứng (Adaptive Learning): Tự động định lượng xác suất làm đúng qua Knowledge Tracing để gợi ý bài tập trong vùng tiếp thu an toàn.",
             "Hỗ trợ trọn vẹn 3 ngôn ngữ lập trình cốt lõi: Python, JavaScript và C++ với chương trình bài tập thật.",
             "Trợ lý AI sư phạm đồng hành: Hỗ trợ giải thích bản chất lỗi sai và định hướng tư duy mà không làm hộ bài tập.",
             "Môi trường thực thi an toàn cách ly: Đảm bảo học viên tự do chạy thử nghiệm code mà không đe dọa bảo mật máy chủ."
         ], icon="🎯", title_color=COLOR_SUCCESS)

# ==============================================================================
# SLIDE 3: TÍNH CẤP THIẾT CỦA ĐỀ TÀI
# ==============================================================================
s3 = prs.slides.add_slide(blank_layout)
add_background(s3)
add_header(s3, "PHẦN 1: TỔNG QUAN", "Tính Cấp thiết của Đề tài", "Khủng hoảng bỏ cuộc và nhu cầu cá nhân hóa trong đào tạo lập trình", 3)

add_card(s3, Inches(0.8), Inches(2.0), Inches(3.65), Inches(4.8), 
         "Khủng hoảng Bỏ cuộc (Dropout)", 
         [
             "Tỷ lệ bỏ cuộc trong các khóa học lập trình trực tuyến lên tới 40% – 70%.",
             "Nguyên nhân gốc rễ là hiện tượng Quá tải nhận thức (Cognitive Overload) khi gặp bài quá sức.",
             "Học viên cô độc khi bế tắc cú pháp và không nhận được phản hồi sư phạm kịp thời."
         ], icon="📉", title_color=COLOR_DANGER)

add_card(s3, Inches(4.85), Inches(2.0), Inches(3.65), Inches(4.8), 
         "Định lượng Năng lực Thời gian thực", 
         [
             "Nhu cầu cấp thiết về thuật toán phát hiện sớm học viên có nguy cơ bỏ cuộc (At-risk Students).",
             "Mở khóa lộ trình học dựa trên đồ thị tiên quyết (Prerequisites DAG) theo năng lực thực tế.",
             "Cân bằng độ khó bài tập để luôn duy trì người học trong trạng thái hứng thú (Flow State)."
         ], icon="🧠", title_color=COLOR_PRIMARY)

add_card(s3, Inches(8.9), Inches(2.0), Inches(3.65), Inches(4.8), 
         "An toàn Thực thi Mã nguồn", 
         [
             "Chạy mã nguồn tùy ý từ người dùng tiềm ẩn nguy cơ DoS, fork bomb, đào coin và rò rỉ dữ liệu máy chủ.",
             "Yêu cầu bắt buộc phải có môi trường Sandbox cô lập (Judge0 Docker).",
             "Giới hạn nghiêm ngặt CPU, RAM, thời gian chạy và cô lập mạng hoàn toàn."
         ], icon="🛡️", title_color=COLOR_ACCENT)

# ==============================================================================
# SLIDE 4: KIẾN TRÚC TỔNG THỂ HỆ THỐNG MCODE
# ==============================================================================
s4 = prs.slides.add_slide(blank_layout)
add_background(s4)
add_header(s4, "PHẦN 2: THIẾT KẾ KIẾN TRÚC", "Kiến trúc Tổng thể Hệ thống Mcode", "Mô hình Microservices phân tách độc lập giữa Nghiệp vụ, Trí tuệ AI và Sandbox", 4)

# Chèn ảnh kiến trúc bên trái
arch_img = IMG_DIR / "00_kien_truc_he_thong_mcode.png"
if arch_img.exists():
    s4.shapes.add_picture(str(arch_img), Inches(0.8), Inches(2.0), width=Inches(6.2))

add_card(s4, Inches(7.3), Inches(2.0), Inches(5.2), Inches(4.8), 
         "Phân rã 4 Khối Cốt lõi", 
         [
             "Tầng Client (React / Vite): Monaco Editor đa ngôn ngữ, giao diện bài học thích ứng, cây kỹ năng và khung chat AI.",
             "Tầng Backend Core (Node.js / Express / Prisma): Quản lý người dùng JWT, ghi danh khóa học, theo dõi tiến độ CSDL PostgreSQL Supabase.",
             "Tầng AI Microservice (Python / FastAPI): Bộ suy luận Knowledge Tracing (BKT, DKT, PAL-Net), RAG Intent Router và sinh bài thích ứng.",
             "Tầng Judge0 Sandbox Service: Biên dịch và chạy mã nguồn an toàn cách ly cô lập trong container Docker."
         ], icon="🏗️")

# ==============================================================================
# SLIDE 5: DỮ LIỆU HUẤN LUYỆN & BÀI TOÁN COLD-START
# ==============================================================================
s5 = prs.slides.add_slide(blank_layout)
add_background(s5)
add_header(s5, "PHẦN 3: DỮ LIỆU HUẤN LUYỆN", "Bài toán Dữ liệu Huấn luyện AI & Giải pháp", "Minh bạch thực trạng dữ liệu và chiến lược mô phỏng nhận thức trên bài tập thật", 5)

add_card(s5, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), 
         "Thách thức Khởi động nguội (Cold-Start)", 
         [
             "CSDL thật hiện ghi nhận 15 tài khoản (12 học viên thật) với 549 bài nộp (Python: 544, C++: 4, JS: 1).",
             "Khối lượng dữ liệu của C++ và JavaScript chưa đủ lớn để huấn luyện mạng nơ-ron sâu (DKT, PAL-Net) với hàng chục nghìn tham số.",
             "Không thể huấn luyện mô hình học máy hiệu quả nếu chỉ dựa trên dữ liệu thật giai đoạn ban đầu.",
             "Cần một chiến lược sinh dữ liệu mô phỏng khoa học để kiểm định pipeline và khởi tạo trọng số mô hình."
         ], icon="⚠️", title_color=COLOR_DANGER)

add_card(s5, Inches(6.9), Inches(2.0), Inches(5.6), Inches(4.8), 
         "Bộ Dữ liệu Giả lập Quy mô lớn (Synthetic)", 
         [
             "Quy mô lớn: 900 học viên giả lập (300 Python, 300 JavaScript, 300 C++).",
             "Khối lượng: 71.273 lượt nộp bài mô phỏng trên 100% bài tập thật (917 bài trong catalog hệ thống).",
             "Phân bổ đều 5 nhóm tính cách Personas (60 học viên/nhóm): NEW, STEADY, TRIAL_ERROR, FAST, RETURNING.",
             "Tỷ lệ làm đúng cân bằng khoa học: Python 54.3%, JavaScript 47.2%, C++ 45.3% (Lý tưởng cho train AI)."
         ], icon="✅", title_color=COLOR_SUCCESS)

# ==============================================================================
# SLIDE 6: THUẬT TOÁN COGNITIVE TRAVERSAL
# ==============================================================================
s6 = prs.slides.add_slide(blank_layout)
add_background(s6)
add_header(s6, "PHẦN 3: DỮ LIỆU HUẤN LUYỆN", "Thuật toán Mô phỏng Nhận thức (Cognitive Traversal + IRT)", "Mô hình duyệt Đồ thị Kỹ năng kết hợp IRT Mở rộng & Phân phối Thời gian Thực tế", 6)

add_card(s6, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), 
         "5 Trụ cột Toán học Nhận thức", 
         [
             "Duyệt lộ trình Topo (DAG): Học viên không nhảy cóc, mở khóa theo bài tiên quyết; có 27% xác suất ôn tập kỹ năng cũ (Spaced Review).",
             "Hàm xác suất Sigmoid IRT: Điểm số kết hợp Năng lực học viên (θ), Độ khó bài tập (1-3), và Độ kiên trì khi làm lại.",
             "Đường cong quên lãng Ebbinghaus: Kỹ năng bị hao mòn theo thời gian cách biệt giữa các buổi học: Forgetting ∝ ln(1 + Δt).",
             "Phân hóa 5 Personas: Khác biệt rõ rệt về năng lực khởi điểm, tốc độ tiếp thu và xu hướng thử sai."
         ], icon="📐")

add_card(s6, Inches(6.9), Inches(2.0), Inches(5.6), Inches(4.8), 
         "Cân chỉnh Thực tế & Nhiễu Tự nhiên", 
         [
             "Thời gian giải bài chuẩn Log-Normal sát thực tế:\n   • Bài dễ: 90s – 180s (1.5 – 3 phút)\n   • Bài trung bình: 240s – 480s (4 – 8 phút)\n   • Bài khó/thuật toán: 500s – 900s+ (8 – 15+ phút)",
             "Nhiễu hành vi ngẫu nhiên (5–10%): Bổ sung 4% đoán mò bài khó, 4% lỗi sơ suất bài dễ, và 3% spam nộp lại liên tiếp.",
             "Danh mục lỗi sai đặc thù: Con trỏ/tràn mảng ở C++, Ép kiểu/closures ở JS, Kiểu dữ liệu/chỉ số ở Python."
         ], icon="⏱️", title_color=COLOR_ACCENT)

# ==============================================================================
# SLIDE 7: CHART 1 & 2
# ==============================================================================
s7 = prs.slides.add_slide(blank_layout)
add_background(s7)
add_header(s7, "PHẦN 4: TRỰC QUAN HÓA TƯ DUY", "Quỹ đạo Nhận thức & Tải Nhận thức theo Độ khó", "Phân hóa rõ nét đường cong học tập và hiện tượng quá tải ở bài tập thuật toán khó", 7)

img1 = IMG_DIR / "01_learning_curves_3_languages.png"
if img1.exists():
    s7.shapes.add_picture(str(img1), Inches(0.8), Inches(2.0), width=Inches(5.7))

img2 = IMG_DIR / "02_cognitive_load_and_difficulty.png"
if img2.exists():
    s7.shapes.add_picture(str(img2), Inches(6.8), Inches(2.0), width=Inches(5.7))

# Bottom insight card
add_card(s7, Inches(0.8), Inches(5.3), Inches(11.7), Inches(1.7),
         "Phân tích Nhận thức Sư phạm",
         [
             "Hình 1 (Trái): Nhóm FAST duy trì độ chính xác cao >75%; Nhóm STEADY tăng trưởng bền vững; Nhóm NEW xuất phát thấp (<25%) leo dốc chậm.",
             "Hình 2 (Phải): Hiện tượng Quá tải nhận thức (Cognitive Overload) xuất hiện rõ ở bài độ khó 3: Học viên yếu mất 10-14 phút nhưng tỷ lệ giải đúng <15%."
         ], icon="💡")

# ==============================================================================
# SLIDE 8: CHART 3 & 4
# ==============================================================================
s8 = prs.slides.add_slide(blank_layout)
add_background(s8)
add_header(s8, "PHẦN 4: TRỰC QUAN HÓA TƯ DUY", "Hấp thụ Tầng Kỹ năng & Rào cản Lỗi sai Điển hình", "Điểm nghẽn nhận thức tại tầng cấu trúc dữ liệu và lỗi sai đặc trưng từng ngôn ngữ", 8)

img3 = IMG_DIR / "03_curriculum_tier_mastery.png"
if img3.exists():
    s8.shapes.add_picture(str(img3), Inches(0.8), Inches(2.0), width=Inches(5.7))

img4 = IMG_DIR / "04_error_bottlenecks_comparison.png"
if img4.exists():
    s8.shapes.add_picture(str(img4), Inches(6.8), Inches(2.0), width=Inches(5.7))

add_card(s8, Inches(0.8), Inches(5.3), Inches(11.7), Inches(1.7),
         "Phân tích Nhận thức Sư phạm",
         [
             "Hình 3 (Trái): Điểm nghẽn nhận thức bắt đầu xuất hiện rõ rệt tại Tầng 3 (Cấu trúc dữ liệu) và Tầng 4 (Bộ nhớ/Nâng cao), tỷ lệ đúng nhóm NEW giảm sâu xuống ~20%.",
             "Hình 4 (Phải): Nhóm NEW áp đảo về lỗi con trỏ (C++), ép kiểu ngầm (JS) và kiểu dữ liệu (Python) — Cơ sở để Trợ lý AI định hướng gỡ lỗi."
         ], icon="💡")

# ==============================================================================
# SLIDE 9: CHART 5
# ==============================================================================
s9 = prs.slides.add_slide(blank_layout)
add_background(s9)
add_header(s9, "PHẦN 4: TRỰC QUAN HÓA TƯ DUY", "Độ Kiên trì & Tỷ lệ Phục hồi sau Sai sót", "Khả năng tự gỡ lỗi ở các lần nộp lại (Attempt > 1) và cơ hội can thiệp của AI", 9)

img5 = IMG_DIR / "05_retry_recovery_rates.png"
if img5.exists():
    s9.shapes.add_picture(str(img5), Inches(0.8), Inches(2.0), width=Inches(6.2))

add_card(s9, Inches(7.3), Inches(2.0), Inches(5.2), Inches(4.8), 
         "Ý nghĩa Sư phạm & Cơ hội cho AI", 
         [
             "Nhóm STEADY có tỷ lệ phục hồi cao nhất (>68%): Đọc kỹ phản hồi và cẩn thận kiểm tra lại test case trước khi nộp lần 2.",
             "Nhóm TRIAL_ERROR nộp lại nhiều nhất nhưng tỷ lệ sửa đúng chỉ đạt ~40% do thói quen sửa bừa một vài ký tự rồi nộp tiếp (Rapid guessing).",
             "Nhóm NEW đạt tỷ lệ phục hồi thấp (30–35%), chứng minh sự cần thiết tuyệt đối của Trợ lý AI can thiệp sư phạm ngay khi học viên nộp sai lần đầu.",
             "Cơ hội cho hệ thống thích ứng: Gợi ý bài tập bắc cầu (Scaffolding) để hạ độ khó kịp thời, ngăn chặn nguy cơ bỏ cuộc."
         ], icon="🎯")

# ==============================================================================
# SLIDE 10: KẾT LUẬN & HƯỚNG PHÁT TRIỂN
# ==============================================================================
s10 = prs.slides.add_slide(blank_layout)
add_background(s10)
add_header(s10, "PHẦN 5: TỔNG KẾT", "Kết luận & Hướng Phát triển Đề tài", "Đóng góp cốt lõi của hệ thống Mcode và lộ trình triển khai trong tương lai", 10)

add_card(s10, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), 
         "Đóng góp Chính của Đề tài", 
         [
             "Xây dựng hoàn chỉnh nền tảng học lập trình thích ứng Mcode với đầy đủ 4 tầng kiến trúc Microservices hiện đại.",
             "Thiết lập kho bài tập thật và đồ thị tri thức chuẩn hóa cho cả 3 ngôn ngữ lập trình phổ biến: Python, C++, JavaScript.",
             "Chứng minh tính khả thi kỹ thuật của mô hình Knowledge Tracing trên bộ dữ liệu mô phỏng nhận thức quy mô lớn (900 học viên, 71.273 lượt nộp).",
             "Môi trường chấm bài Judge0 Sandbox an toàn, cách ly cô lập, ngăn chặn triệt để mã độc hại."
         ], icon="🎉", title_color=COLOR_SUCCESS)

add_card(s10, Inches(6.9), Inches(2.0), Inches(5.6), Inches(4.8), 
         "Hướng Phát triển Tiếp theo", 
         [
             "Triển khai thử nghiệm thực tế tại các trường đại học để thu thập dữ liệu người dùng thật đa dạng hơn.",
             "Áp dụng kỹ thuật Fine-tuning mô hình PAL-Net bằng telemetry thực tế sau khi có lượng bài nộp lớn từ người học thật.",
             "Tích hợp đánh giá độ phức tạp thuật toán (Time/Space Complexity) và tối ưu hóa code vào Trợ lý AI.",
             "Mở rộng hỗ trợ thêm các ngôn ngữ lập trình mới như Java, Go, Rust và SQL nâng cao."
         ], icon="🚀", title_color=COLOR_PRIMARY)

# Lưu file PPTX
OUTPUT_PPTX.parent.mkdir(parents=True, exist_ok=True)
prs.save(str(OUTPUT_PPTX))
print(f"[SUCCESS] Created PowerPoint presentation at: {OUTPUT_PPTX}")
