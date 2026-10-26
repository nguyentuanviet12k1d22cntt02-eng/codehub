import os
from pathlib import Path
from PIL import Image
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE_TYPE

TEMPLATE_PATH = Path(r"d:\Project\LearnPython\docs\slide-thuyet_trinh\Blue Professional Data Analytics Presentation.pptx")
OUTPUT_PATH = Path(r"d:\Project\LearnPython\docs\slide-thuyet_trinh\slide_thuyet_trinh_mcode.pptx")
IMG_DIR = Path(r"d:\Project\LearnPython\docs\slide-thuyet_trinh\images")

prs = pptx.Presentation(TEMPLATE_PATH)

def set_text(shape, text, font_name=None, font_size=None, font_bold=None, color_rgb=None):
    tf = shape.text_frame
    tf.word_wrap = True
    
    # Store initial formatting if present
    orig_font_name = None
    orig_font_size = None
    orig_font_bold = None
    orig_color = None
    
    if tf.paragraphs and tf.paragraphs[0].runs:
        r0 = tf.paragraphs[0].runs[0]
        orig_font_name = r0.font.name
        orig_font_size = r0.font.size
        orig_font_bold = r0.font.bold
        if r0.font.color and r0.font.color.type == 1:
            orig_color = r0.font.color.rgb
            
    # Clear existing text
    p = tf.paragraphs[0]
    p.text = text
    
    # Apply to all paragraphs / runs
    fn = font_name or orig_font_name or "Open Sans"
    fs = font_size or orig_font_size or Pt(24)
    fb = font_bold if font_bold is not None else (orig_font_bold if orig_font_bold is not None else False)
    col = color_rgb or orig_color or RGBColor(30, 41, 59) # #1E293B
    
    for para in tf.paragraphs:
        for r in para.runs:
            r.font.name = fn
            r.font.size = fs
            r.font.bold = fb
            r.font.color.rgb = col

def replace_picture_fit(slide, picture_shape, new_img_path):
    box_left = picture_shape.left
    box_top = picture_shape.top
    box_w = picture_shape.width
    box_h = picture_shape.height
    
    # Read actual image dimensions to preserve aspect ratio
    im = Image.open(new_img_path)
    im_w, im_h = im.size
    aspect = im_w / im_h
    
    box_aspect = box_w / box_h
    if aspect > box_aspect:
        # Fit to width
        final_w = box_w
        final_h = int(box_w / aspect)
        final_left = box_left
        final_top = box_top + int((box_h - final_h) / 2)
    else:
        # Fit to height
        final_h = box_h
        final_w = int(box_h * aspect)
        final_top = box_top
        final_left = box_left + int((box_w - final_w) / 2)
        
    # Remove old picture element
    sp = picture_shape._element
    sp.getparent().remove(sp)
    
    # Add new picture with fitted coordinates
    new_shape = slide.shapes.add_picture(str(new_img_path), final_left, final_top, width=final_w, height=final_h)
    return new_shape

def get_shape(slide, shape_name):
    for s in slide.shapes:
        if s.name == shape_name:
            return s
    raise ValueError(f"Shape {shape_name} not found in slide")

# ==============================================================================
# SLIDE 1: Cover
# ==============================================================================
s1 = prs.slides[0]
set_text(get_shape(s1, "TextBox 16"), "Mcode", font_name="Poppins Semi-Bold", font_size=Pt(95), font_bold=True, color_rgb=RGBColor(30, 41, 59))
set_text(get_shape(s1, "TextBox 17"), "Platform", font_name="Poppins Semi-Bold", font_size=Pt(95), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s1, "TextBox 18"), "Nền Tảng Học Lập Trình Thích Ứng & Chấm Code Tự Động", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(30, 41, 59))
set_text(get_shape(s1, "TextBox 19"), "Báo cáo đề tài tốt nghiệp:", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(100, 116, 139))
set_text(get_shape(s1, "TextBox 20"), "Nguyễn Tuấn Việt • Lớp D22CNTT02", font_name="Open Sans", font_size=Pt(24), font_bold=True, color_rgb=RGBColor(30, 41, 59))

# ==============================================================================
# SLIDE 2: Lý Do Chọn Đề Tài (Executive Summary)
# ==============================================================================
s2 = prs.slides[1]
set_text(get_shape(s2, "TextBox 8"), "Mcode • AI Education", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s2, "TextBox 9"), "Lý Do Chọn Đề Tài", font_name="Poppins Semi-Bold", font_size=Pt(68), font_bold=True, color_rgb=RGBColor(30, 41, 59))
s2_text_left = (
    "Thực trạng giáo dục lập trình hiện nay:\n\n"
    "• Phương pháp truyền thống 'One-size-fits-all' áp đặt chung một tốc độ cho mọi sinh viên.\n"
    "• Hơn 40% người học nhập môn rơi vào khủng hoảng 'Syntax & Logic Shock' dẫn đến bỏ cuộc.\n"
    "• Giảng viên và trợ giảng quá tải, không thể hỗ trợ tức thời khi học viên bế tắc cú pháp."
)
s2_text_right = (
    "Giải pháp đột phá từ nền tảng Mcode:\n\n"
    "• Ứng dụng AI mô hình hóa năng lực người học theo Vùng phát triển gần nhất (ZPD).\n"
    "• Trợ lý AI đồng hành sư phạm gợi ý từng bước (Scaffolding), rèn luyện tư duy tự giải.\n"
    "• Môi trường Sandbox cô lập (Judge0) chấm mã nguồn tự động tức thì cho Python, JS, C++."
)
set_text(get_shape(s2, "TextBox 10"), s2_text_left, font_name="Open Sans", font_size=Pt(20.5), font_bold=False, color_rgb=RGBColor(30, 41, 59))
set_text(get_shape(s2, "TextBox 11"), s2_text_right, font_name="Open Sans", font_size=Pt(20.5), font_bold=False, color_rgb=RGBColor(30, 41, 59))

# ==============================================================================
# SLIDE 3: Tổng Quan Dữ Liệu Huấn Luyện AI (Data Overview)
# ==============================================================================
s3 = prs.slides[2]
set_text(get_shape(s3, "TextBox 44"), "Mcode • AI Education", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s3, "TextBox 51"), "Dữ Liệu Huấn Luyện AI", font_name="Poppins Semi-Bold", font_size=Pt(68), font_bold=True, color_rgb=RGBColor(30, 41, 59))

# 4 metric cards
set_text(get_shape(s3, "TextBox 45"), "Lượt Tương Tác", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(30, 41, 59))
set_text(get_shape(s3, "TextBox 52"), "71.273", font_name="Poppins Semi-Bold", font_size=Pt(55), font_bold=True, color_rgb=RGBColor(255, 255, 255))

set_text(get_shape(s3, "TextBox 46"), "Học Viên Mô Phỏng", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(30, 41, 59))
set_text(get_shape(s3, "TextBox 53"), "900", font_name="Poppins Semi-Bold", font_size=Pt(55), font_bold=True, color_rgb=RGBColor(255, 255, 255))

# Expand Card 3 & 4 text boxes to fully fit card boundaries
tb47 = get_shape(s3, "TextBox 47")
set_text(tb47, "Thuật Toán Sinh Dữ Liệu", font_name="Open Sans Bold", font_size=Pt(21), font_bold=True, color_rgb=RGBColor(30, 41, 59))

tb48 = get_shape(s3, "TextBox 48")
tb48.left = Inches(10.25)
tb48.top = Inches(7.60)
tb48.width = Inches(3.95)
tb48.height = Inches(2.25)
set_text(tb48, "Cognitive Traversal + IRT:\n\nDuyệt đồ thị kỹ năng DAG kết hợp hàm xác suất Sigmoid và hàm quên lãng Ebbinghaus.", font_name="Open Sans", font_size=Pt(17.5), font_bold=True, color_rgb=RGBColor(244, 249, 253))

tb50 = get_shape(s3, "TextBox 50")
set_text(tb50, "Phân Bổ Ngôn Ngữ", font_name="Open Sans Bold", font_size=Pt(21), font_bold=True, color_rgb=RGBColor(30, 41, 59))

tb49 = get_shape(s3, "TextBox 49")
tb49.left = Inches(14.75)
tb49.top = Inches(7.60)
tb49.width = Inches(3.95)
tb49.height = Inches(2.25)
set_text(tb49, "100% trên 917 bài thật:\n\nPython (27.054 lượt)\nJavaScript (22.825 lượt)\nC++ (21.394 lượt)", font_name="Open Sans", font_size=Pt(17.5), font_bold=True, color_rgb=RGBColor(244, 249, 253))

# ==============================================================================
# SLIDE 4: Chỉ Số Năng Lực & Hiệu Năng (Key Performance Indicators)
# ==============================================================================
s4 = prs.slides[3]
set_text(get_shape(s4, "TextBox 52"), "Mcode • AI Education", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s4, "TextBox 53"), "Chỉ Số Năng Lực & Hiệu Năng", font_name="Poppins Semi-Bold", font_size=Pt(60), font_bold=True, color_rgb=RGBColor(30, 41, 59))

# 5 metric boxes
set_text(get_shape(s4, "TextBox 54"), "Độ Đúng Python", font_name="Open Sans Bold", font_size=Pt(20), font_bold=True, color_rgb=RGBColor(30, 41, 59))
set_text(get_shape(s4, "TextBox 59"), "54.3%", font_name="Poppins Semi-Bold", font_size=Pt(50), font_bold=True, color_rgb=RGBColor(255, 255, 255))

set_text(get_shape(s4, "TextBox 56"), "Độ Đúng JS", font_name="Open Sans Bold", font_size=Pt(20), font_bold=True, color_rgb=RGBColor(30, 41, 59))
set_text(get_shape(s4, "TextBox 60"), "47.2%", font_name="Poppins Semi-Bold", font_size=Pt(50), font_bold=True, color_rgb=RGBColor(255, 255, 255))

set_text(get_shape(s4, "TextBox 55"), "Độ Đúng C++", font_name="Open Sans Bold", font_size=Pt(20), font_bold=True, color_rgb=RGBColor(30, 41, 59))
set_text(get_shape(s4, "TextBox 61"), "45.3%", font_name="Poppins Semi-Bold", font_size=Pt(50), font_bold=True, color_rgb=RGBColor(255, 255, 255))

set_text(get_shape(s4, "TextBox 57"), "Kho Bài Tập Thật", font_name="Open Sans Bold", font_size=Pt(20), font_bold=True, color_rgb=RGBColor(30, 41, 59))
set_text(get_shape(s4, "TextBox 62"), "917", font_name="Poppins Semi-Bold", font_size=Pt(50), font_bold=True, color_rgb=RGBColor(255, 255, 255))

set_text(get_shape(s4, "TextBox 58"), "Độ Chính Xác DKT", font_name="Open Sans Bold", font_size=Pt(20), font_bold=True, color_rgb=RGBColor(30, 41, 59))
set_text(get_shape(s4, "TextBox 63"), "64.1%", font_name="Poppins Semi-Bold", font_size=Pt(50), font_bold=True, color_rgb=RGBColor(255, 255, 255))

# ==============================================================================
# SLIDE 5: Tính Cấp Thiết & Kiến Trúc Hệ Thống (Revenue Analysis layout)
# ==============================================================================
s5 = prs.slides[4]
set_text(get_shape(s5, "TextBox 8"), "Mcode • AI Education", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s5, "TextBox 9"), "Kiến Trúc & Tính Cấp Thiết", font_name="Poppins Semi-Bold", font_size=Pt(58), font_bold=True, color_rgb=RGBColor(30, 41, 59))

s5_desc = (
    "Phân rã 4 Tầng Kiến Trúc Hệ Thống Mcode:\n\n"
    "1. Client Layer (React / Vite / Monaco Editor):\n"
    "Giao diện viết code đa ngôn ngữ, cây tri thức trực quan, tích hợp khung chat gợi ý trợ lý AI.\n\n"
    "2. Backend Core (Node.js / Express / Prisma):\n"
    "Quản lý xác thực JWT, theo dõi tiến độ học tập và lưu trữ lịch sử trên PostgreSQL Supabase.\n\n"
    "3. AI Microservice (Python / FastAPI):\n"
    "Bộ máy suy luận Knowledge Tracing (BKT, DKT, PAL-Net), định lượng năng lực thực tế.\n\n"
    "4. Sandbox Service (Judge0 Engine):\n"
    "Biên dịch và chạy code an toàn trong Docker cô lập, giới hạn CPU/RAM, phòng chống tấn công."
)
tb10 = get_shape(s5, "TextBox 10")
tb10.left = Inches(10.0)
tb10.width = Inches(9.2)
tb10.top = Inches(4.5)
tb10.height = Inches(6.0)
set_text(tb10, s5_desc, font_name="Open Sans", font_size=Pt(17.5), font_bold=False, color_rgb=RGBColor(30, 41, 59))

arch_img = IMG_DIR / "00_kien_truc_he_thong_mcode.png"
if arch_img.exists():
    s5.shapes.add_picture(str(arch_img), Inches(0.8), Inches(2.2), width=Inches(8.8))

# ==============================================================================
# SLIDE 6: Quỹ Đạo Nhận Thức (Customer Analysis layout -> Picture on right)
# ==============================================================================
s6 = prs.slides[5]
set_text(get_shape(s6, "TextBox 6"), "Mcode • AI Education", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s6, "TextBox 7"), "Quỹ Đạo Nhận Thức", font_name="Poppins Semi-Bold", font_size=Pt(60), font_bold=True, color_rgb=RGBColor(30, 41, 59))
s6_desc = (
    "Đặc tính hấp thụ kiến thức qua 71.273 lượt học tập:\n\n"
    "• Python (54.3% Acc):\n"
    "Đường cong tăng trưởng mượt mà nhất, rào cản cú pháp thấp giúp học viên nhanh chóng vượt qua giai đoạn làm quen.\n\n"
    "• JavaScript (47.2% Acc):\n"
    "Độ phân hóa cao giữa các nhóm năng lực do tính linh hoạt kiểu dữ liệu và mô hình xử lý bất đồng bộ (Async/Promise).\n\n"
    "• C++ (45.3% Acc):\n"
    "Dốc nhận thức rất cao ở giai đoạn đầu (con trỏ, quản lý bộ nhớ). Khi đã vượt qua ngưỡng nền tảng, học viên tiến bộ rất vững chắc."
)
tb8_s6 = get_shape(s6, "TextBox 8")
tb8_s6.top = Inches(4.8)
tb8_s6.height = Inches(5.8)
set_text(tb8_s6, s6_desc, font_name="Open Sans", font_size=Pt(18.5), font_bold=False, color_rgb=RGBColor(30, 41, 59))
replace_picture_fit(s6, get_shape(s6, "Picture 9"), IMG_DIR / "01_learning_curves_3_languages.png")

# ==============================================================================
# SLIDE 7: Ma Trận Tải Nhận Thức & Độ Khó (Sales Performance layout -> Picture on right)
# ==============================================================================
s7 = prs.slides[6]
set_text(get_shape(s7, "TextBox 6"), "Mcode • AI Education", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s7, "TextBox 7"), "Tải Nhận Thức & Độ Khó", font_name="Poppins Semi-Bold", font_size=Pt(60), font_bold=True, color_rgb=RGBColor(30, 41, 59))
s7_desc = (
    "Mối quan hệ giữa thời gian tư duy và độ phức tạp:\n\n"
    "• Bài Dễ (d=1):\n"
    "Học viên hoàn thành nhanh trong 45–65s, tỷ lệ làm đúng trên 75%, tâm lý hào hứng.\n\n"
    "• Bài Trung bình (d=2):\n"
    "Thời gian tăng lên 90–130s, tỷ lệ đúng đạt 45–55%, xuất hiện tư duy thử nghiệm.\n\n"
    "• Bài Khó (d=3):\n"
    "Tải nhận thức tăng vọt (180–300s). Học viên nhóm Yếu (NEW) tỷ lệ đúng giảm dưới 20%.\n\n"
    "💡 Ý nghĩa: Đây là 'thời điểm vàng' trợ lý AI cần tự động kích hoạt gợi ý từng bước (Scaffolding)."
)
tb8_s7 = get_shape(s7, "TextBox 8")
tb8_s7.top = Inches(4.8)
tb8_s7.height = Inches(5.8)
set_text(tb8_s7, s7_desc, font_name="Open Sans", font_size=Pt(18), font_bold=False, color_rgb=RGBColor(30, 41, 59))
replace_picture_fit(s7, get_shape(s7, "Picture 9"), IMG_DIR / "02_cognitive_load_and_difficulty.png")

# ==============================================================================
# SLIDE 8: Hấp Thụ 4 Tầng Kiến Thức (Trend Analysis layout -> Picture on left)
# ==============================================================================
s8 = prs.slides[7]
set_text(get_shape(s8, "TextBox 6"), "Mcode • AI Education", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s8, "TextBox 7"), "Hấp Thụ 4 Tầng Kiến Thức", font_name="Poppins Semi-Bold", font_size=Pt(60), font_bold=True, color_rgb=RGBColor(30, 41, 59))
s8_desc = (
    "Tiến trình làm chủ kỹ năng theo khung chương trình:\n\n"
    "• Tầng 1 (Cú pháp & I/O):\n"
    "85%–92% học viên nắm vững nhanh chóng sau 10 bài đầu tiên.\n\n"
    "• Tầng 2 (Điều khiển & Vòng lặp):\n"
    "Duy trì mức độ hiểu bài tốt (65%–75%), hình thành tư duy thuật toán cơ sở.\n\n"
    "• Tầng 3 (Cấu trúc dữ liệu):\n"
    "Bắt đầu xuất hiện sự phân hóa rõ giữa nhóm chăm chỉ và nhóm bỏ cuộc.\n\n"
    "• Tầng 4 (Thuật toán & Đệ quy):\n"
    "Rào cản nhận thức lớn nhất, đòi hỏi thuật toán thích ứng phải chia nhỏ mục tiêu."
)
tb8_s8 = get_shape(s8, "TextBox 8")
tb8_s8.top = Inches(4.8)
tb8_s8.height = Inches(5.8)
set_text(tb8_s8, s8_desc, font_name="Open Sans", font_size=Pt(18.5), font_bold=False, color_rgb=RGBColor(30, 41, 59))
replace_picture_fit(s8, get_shape(s8, "Picture 9"), IMG_DIR / "03_curriculum_tier_mastery.png")

# ==============================================================================
# SLIDE 9: Rào Cản Lỗi Sai (Regional Analysis layout -> Picture on left)
# ==============================================================================
s9 = prs.slides[8]
set_text(get_shape(s9, "TextBox 6"), "Mcode • AI Education", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s9, "TextBox 7"), "Phân Tích Rào Cản Lỗi Sai", font_name="Poppins Semi-Bold", font_size=Pt(60), font_bold=True, color_rgb=RGBColor(30, 41, 59))
s9_desc = (
    "Đối chiếu hành vi lỗi giữa Nhóm Yếu (NEW) và Nhóm Giỏi (FAST):\n\n"
    "• Nhóm Yếu (NEW):\n"
    "Lỗi cú pháp (Syntax) chiếm 42% và lỗi Logic chiếm 35% do chưa làm chủ luồng thực thi dữ liệu.\n\n"
    "• Nhóm Giỏi (FAST):\n"
    "Lỗi cú pháp dưới 12%, chủ yếu gặp lỗi biên (Edge Cases) hoặc Time Limit Exceeded (TLE) ở các bài tối ưu thuật toán.\n\n"
    "🎯 Định hướng AI Tutor:\n"
    "Tập trung bắt lỗi Logic và giải thích ngữ cảnh code để ngăn chặn học viên nản chí sớm."
)
tb8_s9 = get_shape(s9, "TextBox 8")
tb8_s9.top = Inches(4.8)
tb8_s9.height = Inches(5.8)
set_text(tb8_s9, s9_desc, font_name="Open Sans", font_size=Pt(18.5), font_bold=False, color_rgb=RGBColor(30, 41, 59))
replace_picture_fit(s9, get_shape(s9, "Picture 9"), IMG_DIR / "04_error_bottlenecks_comparison.png")

# ==============================================================================
# SLIDE 10: Độ Kiên Trì & Thử Lại (Market Insights layout -> Picture on right)
# ==============================================================================
s10 = prs.slides[9]
set_text(get_shape(s10, "TextBox 6"), "Mcode • AI Education", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s10, "TextBox 7"), "Độ Kiên Trì & Phục Hồi", font_name="Poppins Semi-Bold", font_size=Pt(60), font_bold=True, color_rgb=RGBColor(30, 41, 59))
s10_desc = (
    "Hành vi sửa sai qua các lần nộp lại (Attempts 1 → 4):\n\n"
    "• Tỷ lệ vượt qua bài tăng từ 38% ở lần 1 lên 74% ở lần 3 khi học viên nhận được phản hồi sư phạm.\n\n"
    "• Nhóm Kiên trì (STEADY):\n"
    "Thể hiện khả năng phục hồi vượt bậc (>68% sau lần 2) nhờ tiếp thu phản hồi gợi ý từ hệ thống.\n\n"
    "• Nhóm Bốc đồng (TRIAL_ERROR):\n"
    "Tỷ lệ thành công thấp hơn nếu liên tục nộp bài mà không dừng lại phân tích lỗi sai."
)
tb8_s10 = get_shape(s10, "TextBox 8")
tb8_s10.top = Inches(4.8)
tb8_s10.height = Inches(5.8)
set_text(tb8_s10, s10_desc, font_name="Open Sans", font_size=Pt(18.5), font_bold=False, color_rgb=RGBColor(30, 41, 59))
replace_picture_fit(s10, get_shape(s10, "Picture 9"), IMG_DIR / "05_retry_recovery_rates.png")

# ==============================================================================
# SLIDE 11: Kết Quả & Phát Hiện Cốt Lõi (Key Findings)
# ==============================================================================
s11 = prs.slides[10]
set_text(get_shape(s11, "TextBox 6"), "Mcode • AI Education", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s11, "TextBox 7"), "Kết Quả & Phát Hiện Cốt Lõi", font_name="Poppins Semi-Bold", font_size=Pt(60), font_bold=True, color_rgb=RGBColor(30, 41, 59))

# Expand card descriptions width
tb36 = get_shape(s11, "TextBox 36")
tb36.left = Inches(3.2)
tb36.width = Inches(5.8)
tb36.height = Inches(1.8)
set_text(tb36, "Học viên Python duy trì động lực học tập tốt nhất và ít có nguy cơ bỏ cuộc ở giai đoạn nhập môn.", font_name="Open Sans", font_size=Pt(21), color_rgb=RGBColor(30, 41, 59))

tb38 = get_shape(s11, "TextBox 38")
tb38.left = Inches(3.2)
tb38.width = Inches(5.8)
tb38.height = Inches(1.8)
set_text(tb38, "Nhóm kiên trì (STEADY) đạt độ làm chủ kiến thức cao hơn nhóm thử sai (TRIAL) đến 28%.", font_name="Open Sans", font_size=Pt(21), color_rgb=RGBColor(30, 41, 59))

tb37 = get_shape(s11, "TextBox 37")
tb37.left = Inches(12.2)
tb37.width = Inches(5.8)
tb37.height = Inches(1.8)
set_text(tb37, "Lỗi Logic là nguyên nhân lớn nhất gây chán nản nếu thiếu sự hỗ trợ của trợ lý AI sư phạm.", font_name="Open Sans", font_size=Pt(21), color_rgb=RGBColor(30, 41, 59))

tb39 = get_shape(s11, "TextBox 39")
tb39.left = Inches(12.2)
tb39.width = Inches(5.8)
tb39.height = Inches(1.8)
set_text(tb39, "Cơ chế gợi ý Scaffolding tăng tỷ lệ hoàn thành bài khó thêm 41% mà không làm mất tính độc lập tư duy.", font_name="Open Sans", font_size=Pt(21), color_rgb=RGBColor(30, 41, 59))

# ==============================================================================
# SLIDE 12: Đóng Góp & Hướng Phát Triển (Recommendations)
# ==============================================================================
s12 = prs.slides[11]
set_text(get_shape(s12, "TextBox 27"), "Mcode • AI Education", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s12, "TextBox 6"), "Đóng Góp & Hướng Phát Triển", font_name="Poppins Semi-Bold", font_size=Pt(60), font_bold=True, color_rgb=RGBColor(30, 41, 59))

set_text(get_shape(s12, "TextBox 28"), "Hoàn thiện nền tảng học thích ứng hoàn chỉnh: Trợ lý AI sư phạm + Sandbox chấm tự động.", font_name="Open Sans", font_size=Pt(21), color_rgb=RGBColor(255, 255, 255))
set_text(get_shape(s12, "TextBox 29"), "Bộ dữ liệu 71.273 lượt học tập đa ngôn ngữ là nền tảng chuẩn hóa để huấn luyện mô hình DKT / PAL-Net.", font_name="Open Sans", font_size=Pt(21), color_rgb=RGBColor(255, 255, 255))
set_text(get_shape(s12, "TextBox 30"), "Mở rộng Sandbox hỗ trợ Java, Go, Rust và tích hợp thuật toán phân tích độ phức tạp O(N).", font_name="Open Sans", font_size=Pt(21), color_rgb=RGBColor(255, 255, 255))
set_text(get_shape(s12, "TextBox 31"), "Tích hợp mô hình ngôn ngữ lớn (LLM Fine-tuned) giải thích mã nguồn trực quan theo ngữ cảnh người học.", font_name="Open Sans", font_size=Pt(21), color_rgb=RGBColor(255, 255, 255))

# ==============================================================================
# SLIDE 13: Lời Cảm Ơn (Thank You)
# ==============================================================================
s13 = prs.slides[12]
set_text(get_shape(s13, "TextBox 18"), "Mcode • Adaptive Learning Platform", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s13, "TextBox 16"), "Xin Cảm", font_name="Poppins Semi-Bold", font_size=Pt(95), font_bold=True, color_rgb=RGBColor(30, 41, 59))
set_text(get_shape(s13, "TextBox 17"), "Ơn!", font_name="Poppins Semi-Bold", font_size=Pt(95), font_bold=True, color_rgb=RGBColor(37, 99, 235))
set_text(get_shape(s13, "TextBox 19"), "Đề Tài Tốt Nghiệp:", font_name="Open Sans Bold", font_size=Pt(22), font_bold=True, color_rgb=RGBColor(100, 116, 139))
set_text(get_shape(s13, "TextBox 20"), "Học Máy & Hệ Thống Gia Sư Lập Trình Thích Ứng (ITS) • SV: Nguyễn Tuấn Việt", font_name="Open Sans", font_size=Pt(24), font_bold=True, color_rgb=RGBColor(30, 41, 59))

# Save presentation
prs.save(OUTPUT_PATH)
print(f"Presentation successfully saved to: {OUTPUT_PATH}")
