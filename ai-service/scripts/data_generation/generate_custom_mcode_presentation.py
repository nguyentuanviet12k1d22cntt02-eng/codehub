import os
from pathlib import Path
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ==============================================================================
# CONFIGURATION & COLOR SYSTEM (Blue Professional Corporate Light Aesthetic)
# ==============================================================================
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Palette: Clean, High-Contrast Corporate Light Theme
COLOR_BG = RGBColor(248, 250, 252)         # #F8FAFC (Soft clean off-white canvas)
COLOR_WHITE = RGBColor(255, 255, 255)      # #FFFFFF (Pure white card background)
COLOR_CARD_BORDER = RGBColor(203, 213, 225)# #CBD5E1 (Subtle crisp border)
COLOR_CARD_BORDER_BLUE = RGBColor(147, 197, 253) # #93C5FD (Accent card border)

COLOR_TEXT_NAVY = RGBColor(15, 23, 42)     # #0F172A (Deep Slate Navy - Max readability)
COLOR_TEXT_BODY = RGBColor(51, 65, 85)     # #334155 (Dark Slate body text)
COLOR_TEXT_MUTED = RGBColor(100, 116, 139) # #64748B (Muted secondary text)

COLOR_PRIMARY_BLUE = RGBColor(29, 78, 216) # #1D4ED8 (Vibrant Corporate Blue)
COLOR_ACCENT_BLUE = RGBColor(37, 99, 235)  # #2563EB (Electric Blue)
COLOR_LIGHT_BLUE = RGBColor(239, 246, 255) # #EFF6FF (Pill tag background)
COLOR_LIGHT_CYAN = RGBColor(224, 242, 254) # #E0F2FE (Cyan tint pill)

IMG_DIR = Path(r"d:\Project\LearnPython\docs\slide-thuyet_trinh\images")
OUTPUT_PPTX = Path(r"d:\Project\LearnPython\docs\slide-thuyet_trinh\slide_thuyet_trinh_mcode.pptx")

# ==============================================================================
# HELPER FUNCTIONS FOR 100% EXPLICIT RUN-LEVEL TYPOGRAPHY
# ==============================================================================
def set_slide_background(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_BG
    bg.line.fill.background()
    
    # Add subtle top decorative corporate bar
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = COLOR_PRIMARY_BLUE
    bar.line.fill.background()
    return bg

def add_header(slide, eyebrow_text, title_text, slide_num):
    # Eyebrow Pill Tag
    eyebrow_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.38), Inches(8.5), Inches(0.35))
    tf_eye = eyebrow_box.text_frame
    tf_eye.word_wrap = True
    p_eye = tf_eye.paragraphs[0]
    p_eye.text = ""
    r_eye = p_eye.add_run()
    r_eye.text = eyebrow_text.upper()
    r_eye.font.size = Pt(13)
    r_eye.font.bold = True
    r_eye.font.color.rgb = COLOR_PRIMARY_BLUE
    r_eye.font.name = "Segoe UI"
    
    # Title Text (Large, crisp, authoritative: 28pt)
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.74), Inches(10.5), Inches(0.65))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = ""
    r_title = p_title.add_run()
    r_title.text = title_text
    r_title.font.size = Pt(28)
    r_title.font.bold = True
    r_title.font.color.rgb = COLOR_TEXT_NAVY
    r_title.font.name = "Segoe UI"
    
    # Watermark slide indicator
    num_box = slide.shapes.add_textbox(Inches(11.2), Inches(0.55), Inches(1.3), Inches(0.5))
    tf_num = num_box.text_frame
    p_num = tf_num.paragraphs[0]
    p_num.alignment = PP_ALIGN.RIGHT
    p_num.text = ""
    r_num = p_num.add_run()
    r_num.text = f"{slide_num:02d} / 11"
    r_num.font.size = Pt(14)
    r_num.font.bold = True
    r_num.font.color.rgb = COLOR_TEXT_MUTED
    r_num.font.name = "Segoe UI"

def add_clean_card(slide, left, top, width, height, bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    card.line.color.rgb = border_color
    card.line.width = Pt(1.5)
    return card

def add_bullets_box(slide, left, top, width, height, items, font_size=Pt(20.5)):
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.15)
    tf.margin_right = Inches(0.15)
    tf.margin_top = Inches(0.15)
    tf.margin_bottom = Inches(0.15)
    
    for i, (prefix, text) in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(14)
        p.line_spacing = 1.15
        p.text = ""
        
        # Lead-in title/icon bold
        r_lead = p.add_run()
        r_lead.text = prefix + " "
        r_lead.font.bold = True
        r_lead.font.size = font_size
        r_lead.font.name = "Segoe UI"
        r_lead.font.color.rgb = COLOR_TEXT_NAVY
        
        # Body text
        r_body = p.add_run()
        r_body.text = text
        r_body.font.bold = False
        r_body.font.size = font_size
        r_body.font.name = "Segoe UI"
        r_body.font.color.rgb = COLOR_TEXT_BODY

def add_image_card(slide, img_path, left, top, width, height, caption=None):
    # Base card frame
    add_clean_card(slide, left, top, width, height, bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER_BLUE)
    
    pad = Inches(0.12)
    box_w = width - pad * 2
    box_h = height - pad * 2 - (Inches(0.4) if caption else 0)
    
    im = Image.open(img_path)
    im_w, im_h = im.size
    aspect = im_w / im_h
    box_aspect = box_w / box_h
    
    if aspect > box_aspect:
        final_w = box_w
        final_h = int(box_w / aspect)
        final_left = left + pad
        final_top = top + pad + int((box_h - final_h) / 2)
    else:
        final_h = box_h
        final_w = int(box_h * aspect)
        final_top = top + pad
        final_left = left + pad + int((box_w - final_w) / 2)
        
    slide.shapes.add_picture(str(img_path), final_left, final_top, width=final_w, height=final_h)
    
    if caption:
        tb_cap = slide.shapes.add_textbox(left, top + height - Inches(0.45), width, Inches(0.4))
        p_cap = tb_cap.text_frame.paragraphs[0]
        p_cap.alignment = PP_ALIGN.CENTER
        p_cap.text = ""
        r_cap = p_cap.add_run()
        r_cap.text = caption
        r_cap.font.size = Pt(12.5)
        r_cap.font.bold = True
        r_cap.font.color.rgb = COLOR_PRIMARY_BLUE
        r_cap.font.name = "Segoe UI"

# ==============================================================================
# SLIDE 1: BÌA ĐỀ TÀI (Title Cover)
# ==============================================================================
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1)

card_main = add_clean_card(s1, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER_BLUE)

# Eyebrow
eb = s1.shapes.add_textbox(Inches(1.4), Inches(1.3), Inches(10.5), Inches(0.4))
p_eb = eb.text_frame.paragraphs[0]
p_eb.text = ""
r_eb = p_eb.add_run()
r_eb.text = "BÁO CÁO ĐỒ ÁN TỐT NGHIỆP • KHOA CÔNG NGHỆ THÔNG TIN"
r_eb.font.size = Pt(15)
r_eb.font.bold = True
r_eb.font.color.rgb = COLOR_PRIMARY_BLUE
r_eb.font.name = "Segoe UI"

# Big Title (36pt bold)
tb_t = s1.shapes.add_textbox(Inches(1.4), Inches(1.85), Inches(10.5), Inches(1.6))
tf_t = tb_t.text_frame
tf_t.word_wrap = True
p_t = tf_t.paragraphs[0]
p_t.text = ""
r_t = p_t.add_run()
r_t.text = "MCODE: NỀN TẢNG HỌC LẬP TRÌNH THÍCH ỨNG & CHẤM CODE TỰ ĐỘNG"
r_t.font.size = Pt(36)
r_t.font.bold = True
r_t.font.color.rgb = COLOR_TEXT_NAVY
r_t.font.name = "Segoe UI"

# Subtitle (22pt)
tb_sub = s1.shapes.add_textbox(Inches(1.4), Inches(3.6), Inches(10.5), Inches(0.8))
tf_sub = tb_sub.text_frame
tf_sub.word_wrap = True
p_sub = tf_sub.paragraphs[0]
p_sub.text = ""
r_sub = p_sub.add_run()
r_sub.text = "Hệ Thống Trợ Lý AI Hướng Dẫn Sư Phạm & Knowledge Tracing Cá Nhân Hóa Đa Ngôn Ngữ"
r_sub.font.size = Pt(22)
r_sub.font.color.rgb = COLOR_ACCENT_BLUE
r_sub.font.name = "Segoe UI"

# Metadata Pill Box (Bottom)
meta_card = add_clean_card(s1, Inches(1.4), Inches(4.7), Inches(10.5), Inches(1.4), bg_color=COLOR_LIGHT_BLUE, border_color=COLOR_CARD_BORDER_BLUE)
tb_meta = s1.shapes.add_textbox(Inches(1.7), Inches(4.85), Inches(10.0), Inches(1.1))
tf_meta = tb_meta.text_frame
tf_meta.word_wrap = True

p_m1 = tf_meta.paragraphs[0]
p_m1.text = ""
r_m1 = p_m1.add_run()
r_m1.text = "Sinh viên thực hiện: Nguyễn Tuấn Việt   •   Lớp: D22CNTT02"
r_m1.font.size = Pt(20)
r_m1.font.bold = True
r_m1.font.color.rgb = COLOR_TEXT_NAVY
r_m1.font.name = "Segoe UI"

p_m2 = tf_meta.add_paragraph()
p_m2.space_before = Pt(6)
p_m2.text = ""
r_m2 = p_m2.add_run()
r_m2.text = "Chuyên ngành: Kỹ thuật Phần mềm & Trí tuệ Nhân tạo   •   Năm bảo vệ: 2026"
r_m2.font.size = Pt(18)
r_m2.font.color.rgb = COLOR_TEXT_BODY
r_m2.font.name = "Segoe UI"

# ==============================================================================
# SLIDE 2: LÝ DO CHỌN ĐỀ TÀI & TÍNH CẤP THIẾT
# ==============================================================================
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2)
add_header(s2, "Bối Cảnh & Động Lực Nghiên Cứu", "Khủng Hoảng Nhập Môn & Giới Hạn Của Đào Tạo Truyền Thống", 2)

# Left Card: Traditional Limits
add_clean_card(s2, Inches(0.8), Inches(1.65), Inches(5.7), Inches(5.3), bg_color=COLOR_WHITE, border_color=RGBColor(254, 202, 202))
tb_h1 = s2.shapes.add_textbox(Inches(1.1), Inches(1.85), Inches(5.1), Inches(0.6))
p_h1 = tb_h1.text_frame.paragraphs[0]
p_h1.text = ""
r_h1 = p_h1.add_run()
r_h1.text = "⚠️ Thực Trạng Giáo Dục Truyền Thống"
r_h1.font.size = Pt(22)
r_h1.font.bold = True
r_h1.font.color.rgb = RGBColor(220, 38, 38)
r_h1.font.name = "Segoe UI"

items_s2_left = [
    ("• Tỷ lệ bỏ cuộc cao (40%–70%):", "Học viên nhập môn thường xuyên bị 'Syntax & Logic Shock', mất phương hướng khi gặp lỗi biên dịch."),
    ("• Giới hạn 'One-size-fits-all':", "Chương trình áp đặt chung một tiến độ cho mọi sinh viên, bỏ quên sự khác biệt về nền tảng tư duy."),
    ("• Thiếu trợ giúp kịp thời:", "Giảng viên và trợ giảng quá tải, không thể hỗ trợ 1:1 giải thích nguyên nhân lỗi sai vào ban đêm.")
]
add_bullets_box(s2, Inches(1.1), Inches(2.55), Inches(5.1), Inches(4.2), items_s2_left, font_size=Pt(20))

# Right Card: Mcode Solution
add_clean_card(s2, Inches(6.8), Inches(1.65), Inches(5.7), Inches(5.3), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER_BLUE)
tb_h2 = s2.shapes.add_textbox(Inches(7.1), Inches(1.85), Inches(5.1), Inches(0.6))
p_h2 = tb_h2.text_frame.paragraphs[0]
p_h2.text = ""
r_h2 = p_h2.add_run()
r_h2.text = "🎯 Đột Phá Từ Giải Pháp Mcode"
r_h2.font.size = Pt(22)
r_h2.font.bold = True
r_h2.font.color.rgb = COLOR_PRIMARY_BLUE
r_h2.font.name = "Segoe UI"

items_s2_right = [
    ("• Thích ứng cá nhân hóa ZPD:", "Hệ thống AI tự động đề xuất bài tập vừa sức theo Vùng phát triển gần nhất của từng người học."),
    ("• Trợ lý AI sư phạm đồng hành:", "Gợi ý tư duy từng bước (Scaffolding), hướng dẫn cách giải quyết gốc rễ vấn đề thay vì giải hộ code."),
    ("• Sandbox chấm code tức thời:", "Môi trường Judge0 Docker chấm bài an toàn, bảo vệ máy chủ tuyệt đối và phản hồi trong <1 giây.")
]
add_bullets_box(s2, Inches(7.1), Inches(2.55), Inches(5.1), Inches(4.2), items_s2_right, font_size=Pt(20))

# ==============================================================================
# SLIDE 3: KIẾN TRÚC TỔNG THỂ HỆ THỐNG MCODE
# ==============================================================================
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3)
add_header(s3, "Thiết Kế Kiến Trúc", "Kiến Trúc Microservices Phân Tách 4 Tầng Chuyên Biệt", 3)

arch_img = IMG_DIR / "00_kien_truc_he_thong_mcode.png"
add_image_card(s3, arch_img, Inches(0.8), Inches(1.65), Inches(6.1), Inches(5.3), caption="Sơ đồ 4 Tầng Phân Tách Độc Lập Giữa Nghiệp Vụ, Trí Tuệ AI & Sandbox")

# Right side: 4 Tiers breakdown
add_clean_card(s3, Inches(7.1), Inches(1.65), Inches(5.4), Inches(5.3), bg_color=COLOR_WHITE)
tb_h3 = s3.shapes.add_textbox(Inches(7.3), Inches(1.8), Inches(5.0), Inches(0.5))
p_h3 = tb_h3.text_frame.paragraphs[0]
p_h3.text = ""
r_h3 = p_h3.add_run()
r_h3.text = "🏗️ Phân Rã 4 Tầng Cốt Lõi"
r_h3.font.size = Pt(22)
r_h3.font.bold = True
r_h3.font.color.rgb = COLOR_PRIMARY_BLUE
r_h3.font.name = "Segoe UI"

items_s3 = [
    ("1. Client Layer (React/Vite):", "Monaco Editor hỗ trợ Python/JS/C++, cây kỹ năng trực quan, khung chat AI tương tác."),
    ("2. Backend Core (Node.js/Prisma):", "Xác thực JWT an toàn, quản lý bài tập, theo dõi tiến độ học tập trên PostgreSQL Supabase."),
    ("3. AI Microservice (Python/FastAPI):", "Mô hình Deep Knowledge Tracing (DKT, PAL-Net) định lượng năng lực thực tế."),
    ("4. Sandbox Service (Judge0 Engine):", "Biên dịch và chạy mã nguồn cô lập trong container Docker, giới hạn RAM/CPU chặt chẽ.")
]
add_bullets_box(s3, Inches(7.3), Inches(2.35), Inches(5.0), Inches(4.4), items_s3, font_size=Pt(19.5))

# ==============================================================================
# SLIDE 4: DỮ LIỆU HUẤN LUYỆN & BÀI TOÁN KHỞI ĐỘNG NGUỘI
# ==============================================================================
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4)
add_header(s4, "Dữ Liệu Huấn Luyện AI", "Khắc Phục Cold-Start Bằng Thuật Toán Cognitive Traversal", 4)

kpi_data = [
    ("71.273", "LƯỢT TƯƠNG TÁC", COLOR_PRIMARY_BLUE),
    ("900", "HỌC VIÊN GIẢ LẬP", COLOR_PRIMARY_BLUE),
    ("917", "BÀI TẬP THẬT CATALOG", COLOR_ACCENT_BLUE),
    ("5", "NHÓM NĂNG LỰC (PERSONAS)", COLOR_ACCENT_BLUE)
]

w_kpi = Inches(2.78)
h_kpi = Inches(1.7)
y_kpi = Inches(1.65)

for i, (val, label, col) in enumerate(kpi_data):
    x_kpi = Inches(0.8 + i * 2.98)
    add_clean_card(s4, x_kpi, y_kpi, w_kpi, h_kpi, bg_color=COLOR_WHITE)
    
    tb_k = s4.shapes.add_textbox(x_kpi, y_kpi + Inches(0.15), w_kpi, Inches(1.4))
    tf_k = tb_k.text_frame
    tf_k.word_wrap = True
    
    p_val = tf_k.paragraphs[0]
    p_val.alignment = PP_ALIGN.CENTER
    p_val.text = ""
    r_v = p_val.add_run()
    r_v.text = val
    r_v.font.size = Pt(44)
    r_v.font.bold = True
    r_v.font.color.rgb = col
    r_v.font.name = "Segoe UI"
    
    p_lab = tf_k.add_paragraph()
    p_lab.alignment = PP_ALIGN.CENTER
    p_lab.space_before = Pt(4)
    p_lab.text = ""
    r_l = p_lab.add_run()
    r_l.text = label
    r_l.font.size = Pt(13)
    r_l.font.bold = True
    r_l.font.color.rgb = COLOR_TEXT_MUTED
    r_l.font.name = "Segoe UI"

# Big Lower Summary Card
add_clean_card(s4, Inches(0.8), Inches(3.6), Inches(11.733), Inches(3.35), bg_color=COLOR_WHITE)
items_s4 = [
    ("• Thách thức Khởi động nguội (Cold-Start):", "Dữ liệu người dùng thật ban đầu (15 tài khoản, 549 bài nộp) không đủ quy mô để huấn luyện mạng nơ-ron sâu (DKT) với hàng chục nghìn tham số."),
    ("• Thuật toán Mô phỏng Nhận thức (Cognitive Traversal + IRT):", "Duyệt đồ thị tiên quyết DAG kết hợp lý thuyết Item Response Theory, mô phỏng thời gian Log-Normal và đường cong quên lãng Ebbinghaus."),
    ("• Đảm bảo tính trung thực khoa học:", "Mô phỏng trên 100% bài tập thật (917 bài), phân bổ cân bằng 3 ngôn ngữ: Python (27.054 lượt), JavaScript (22.825 lượt), C++ (21.394 lượt).")
]
add_bullets_box(s4, Inches(1.1), Inches(3.8), Inches(11.1), Inches(3.0), items_s4, font_size=Pt(20.5))

# ==============================================================================
# SLIDE 5: BIỂU ĐỒ 1 — QUỸ ĐẠO NHẬN THỨC 3 NGÔN NGỮ
# ==============================================================================
# SLIDE 5: MÔ HÌNH HÓA TRI THỨC — BKT -> DKT -> PAL-NET
# ==============================================================================
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5)
add_header(s5, "Trọng Tâm Nghiên Cứu AI", "Mô Hình Hóa Tri Thức: Từ BKT, DKT Đến Đề Xuất PAL-Net", 5)

# 3 Columns for BKT, DKT, PAL-Net
col_w = Inches(3.68)
gap_w = Inches(0.34)
left_base = Inches(0.8)

# Col 1: BKT
add_clean_card(s5, left_base, Inches(1.65), col_w, Inches(5.3), bg_color=COLOR_WHITE)
tb_c1 = s5.shapes.add_textbox(left_base + Inches(0.2), Inches(1.8), col_w - Inches(0.4), Inches(0.5))
p_c1 = tb_c1.text_frame.paragraphs[0]
r_c1 = p_c1.add_run()
r_c1.text = "📌 BKT (Cổ Điển)"
r_c1.font.size = Pt(21)
r_c1.font.bold = True
r_c1.font.color.rgb = COLOR_PRIMARY_BLUE
r_c1.font.name = "Segoe UI"

items_c1 = [
    ("• Bản chất:", "Mô hình Markov ẩn (HMM) theo dõi trạng thái nhị phân làm chủ kỹ năng (Mastered/Not)."),
    ("• 4 Tham số:", "Ước lượng xác suất L0 (biết trước), T (học được), G (đoán mò), S (sơ suất)."),
    ("• Ưu điểm:", "Công thức xác suất đóng, dễ giải thích, suy diễn cực nhanh."),
    ("• Hạn chế lớn:", "Coi mọi kỹ năng độc lập, không mô hình hóa được chuỗi tương tác dài.")
]
add_bullets_box(s5, left_base + Inches(0.2), Inches(2.35), col_w - Inches(0.4), Inches(4.4), items_c1, font_size=Pt(18.5))

# Col 2: DKT
c2_left = left_base + col_w + gap_w
add_clean_card(s5, c2_left, Inches(1.65), col_w, Inches(5.3), bg_color=COLOR_WHITE)
tb_c2 = s5.shapes.add_textbox(c2_left + Inches(0.2), Inches(1.8), col_w - Inches(0.4), Inches(0.5))
p_c2 = tb_c2.text_frame.paragraphs[0]
r_c2 = p_c2.add_run()
r_c2.text = "🧠 DKT (Deep KT)"
r_c2.font.size = Pt(21)
r_c2.font.bold = True
r_c2.font.color.rgb = COLOR_TEXT_NAVY
r_c2.font.name = "Segoe UI"

items_c2 = [
    ("• Bản chất:", "Mạng nơ-ron hồi quy LSTM (Piech et al., 2015) đọc chuỗi nộp bài theo thời gian."),
    ("• Ưu điểm:", "Học được quan hệ phi tuyến tính phức tạp trong lịch sử người học."),
    ("• Hạn chế lớn:", "'Mù cấu trúc' — hoàn toàn bỏ qua mối quan hệ tiên quyết trên Đồ thị Tri thức DAG."),
    ("• Hậu quả:", "Dễ bị nhiễu gradient khi học viên chuyển đổi qua lại giữa các module.")
]
add_bullets_box(s5, c2_left + Inches(0.2), Inches(2.35), col_w - Inches(0.4), Inches(4.4), items_c2, font_size=Pt(18.5))

# Col 3: PAL-Net (Đề xuất)
c3_left = c2_left + col_w + gap_w
add_clean_card(s5, c3_left, Inches(1.65), col_w, Inches(5.3), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER_BLUE)
tb_c3 = s5.shapes.add_textbox(c3_left + Inches(0.2), Inches(1.8), col_w - Inches(0.4), Inches(0.5))
p_c3 = tb_c3.text_frame.paragraphs[0]
r_c3 = p_c3.add_run()
r_c3.text = "⭐ PAL-Net (Đề Xuất)"
r_c3.font.size = Pt(21)
r_c3.font.bold = True
r_c3.font.color.rgb = COLOR_PRIMARY_BLUE
r_c3.font.name = "Segoe UI"

items_c3 = [
    ("• Kiến trúc đột phá:", "Kết hợp Graph Neural Network (GNN/GCN) trên Đồ thị DAG + Multi-Head Self-Attention."),
    ("• Lan truyền tiên quyết:", "Trạng thái thành thạo của kỹ năng cha được lan truyền sang hỗ trợ kỹ năng con."),
    ("• Giải quyết Cold-Start:", "Dự đoán chính xác ngay ở các lượt đầu (t=1..3) của chủ đề mới."),
    ("• Hiệu năng thực tế:", "Thời gian suy diễn <12ms trên CPU, sẵn sàng phục vụ quy mô lớn.")
]
add_bullets_box(s5, c3_left + Inches(0.2), Inches(2.35), col_w - Inches(0.4), Inches(4.4), items_c3, font_size=Pt(18.5))

# ==============================================================================
# SLIDE 6: KẾT QUẢ THỰC NGHIỆM ĐỐI ĐẦU: BKT VS DKT VS PAL-NET
# ==============================================================================
s6 = prs.slides.add_slide(blank_layout)
set_slide_background(s6)
add_header(s6, "Kết Quả Thực Nghiệm AI", "Đánh Giá Hiệu Năng Độc Lập Qua 3 Seeds Trên 3 Ngôn Ngữ", 6)

# Table shape for empirical benchmark results
table_shape = s6.shapes.add_table(10, 5, Inches(0.8), Inches(1.6), Inches(11.733), Inches(3.2))
tbl = table_shape.table
tbl.columns[0].width = Inches(2.2)
tbl.columns[1].width = Inches(3.2)
tbl.columns[2].width = Inches(2.2)
tbl.columns[3].width = Inches(2.1)
tbl.columns[4].width = Inches(2.033)

headers = ["Ngôn ngữ", "Mô hình KT", "ROC-AUC ↑", "Accuracy ↑", "Log Loss ↓"]
table_data = [
    ["Python", "BKT (Baseline)", "0.5863", "56.15%", "0.6855"],
    ["Python", "DKT (LSTM)", "0.5354", "53.90%", "0.6891"],
    ["Python", "PAL-Net (Đề xuất)", "0.6449 (+10.95%)", "61.09%", "0.6614"],
    ["JavaScript", "BKT (Baseline)", "0.5921", "57.11%", "0.6789"],
    ["JavaScript", "DKT (LSTM)", "0.5183", "50.25%", "0.6930"],
    ["JavaScript", "PAL-Net (Đề xuất)", "0.6338 (+11.55%)", "59.82%", "0.6699"],
    ["C++", "BKT (Baseline)", "0.5673", "57.04%", "0.6869"],
    ["C++", "DKT (LSTM)", "0.5353", "53.07%", "0.6918"],
    ["C++", "PAL-Net (Đề xuất)", "0.6167 (+8.14%)", "58.32%", "0.6714"]
]

for col_idx, h_text in enumerate(headers):
    cell = tbl.cell(0, col_idx)
    cell.fill.solid()
    cell.fill.fore_color.rgb = COLOR_PRIMARY_BLUE
    cell.text = ""
    p = cell.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = h_text
    r.font.bold = True
    r.font.size = Pt(17)
    r.font.color.rgb = COLOR_WHITE
    r.font.name = "Segoe UI"

for row_idx, row in enumerate(table_data):
    is_palnet = "PAL-Net" in row[1]
    for col_idx, val in enumerate(row):
        cell = tbl.cell(row_idx + 1, col_idx)
        cell.fill.solid()
        if is_palnet:
            cell.fill.fore_color.rgb = COLOR_LIGHT_CYAN
        elif row_idx % 2 == 0:
            cell.fill.fore_color.rgb = COLOR_WHITE
        else:
            cell.fill.fore_color.rgb = COLOR_BG
        cell.text = ""
        p = cell.text_frame.paragraphs[0]
        if col_idx in (0, 1):
            p.alignment = PP_ALIGN.LEFT
        else:
            p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = val
        r.font.size = Pt(15.5)
        r.font.name = "Segoe UI"
        if is_palnet:
            r.font.bold = True
            r.font.color.rgb = COLOR_PRIMARY_BLUE
        else:
            r.font.color.rgb = COLOR_TEXT_NAVY

# 2 Takeaway Cards below the table
add_clean_card(s6, Inches(0.8), Inches(5.0), Inches(5.7), Inches(1.95), bg_color=COLOR_WHITE)
tb_t1 = s6.shapes.add_textbox(Inches(1.0), Inches(5.1), Inches(5.3), Inches(1.75))
tf_t1 = tb_t1.text_frame
tf_t1.word_wrap = True
p1 = tf_t1.paragraphs[0]
r1_h = p1.add_run()
r1_h.text = "🏆 PAL-Net Dẫn Đầu Toàn Diện: "
r1_h.font.bold = True
r1_h.font.size = Pt(17)
r1_h.font.color.rgb = COLOR_PRIMARY_BLUE
r1_b = p1.add_run()
r1_b.text = "Đạt ROC-AUC cao nhất trên cả 3 ngôn ngữ (Python 0.6449, JS 0.6338, C++ 0.6167). Cấu trúc đồ thị DAG giúp mô hình dự đoán chính xác bước chuyển kỹ năng."
r1_b.font.size = Pt(16.5)
r1_b.font.color.rgb = COLOR_TEXT_BODY

add_clean_card(s6, Inches(6.8), Inches(5.0), Inches(5.7), Inches(1.95), bg_color=COLOR_WHITE)
tb_t2 = s6.shapes.add_textbox(Inches(7.0), Inches(5.1), Inches(5.3), Inches(1.75))
tf_t2 = tb_t2.text_frame
tf_t2.word_wrap = True
p2 = tf_t2.paragraphs[0]
r2_h = p2.add_run()
r2_h.text = "⚡ Hiệu Năng Suy Diễn Siêu Tốc: "
r2_h.font.bold = True
r2_h.font.size = Pt(17)
r2_h.font.color.rgb = COLOR_ACCENT_BLUE
r2_b = p2.add_run()
r2_b.text = "Thời gian suy diễn chỉ <12ms trên CPU. DKT thuần túy hụt hơi vì thiếu bias cấu trúc đồ thị tiên quyết. Đạt yêu cầu thời gian thực cho hệ thống sản xuất."
r2_b.font.size = Pt(16.5)
r2_b.font.color.rgb = COLOR_TEXT_BODY

# ==============================================================================
# SLIDE 7: PHÂN TÍCH NHẬN THỨC & THỜI ĐIỂM VÀNG AI CAN THIỆP
# ==============================================================================
s7 = prs.slides.add_slide(blank_layout)
set_slide_background(s7)
add_header(s7, "Phân Tích Thực Nghiệm Sư Phạm", "Thời Gian Tư Duy & Xác Định 'Thời Điểm Vàng' AI Can Thiệp", 7)

chart2_img = IMG_DIR / "02_cognitive_load_and_difficulty.png"
add_image_card(s7, chart2_img, Inches(0.8), Inches(1.65), Inches(6.1), Inches(5.3))

add_clean_card(s7, Inches(7.1), Inches(1.65), Inches(5.4), Inches(5.3), bg_color=COLOR_WHITE)
tb_h7 = s7.shapes.add_textbox(Inches(7.3), Inches(1.8), Inches(5.0), Inches(0.5))
p_h7 = tb_h7.text_frame.paragraphs[0]
p_h7.text = ""
r_h7 = p_h7.add_run()
r_h7.text = "⏱️ Định Lượng Tải Nhận Thức & ZPD"
r_h7.font.size = Pt(22)
r_h7.font.bold = True
r_h7.font.color.rgb = COLOR_PRIMARY_BLUE
r_h7.font.name = "Segoe UI"

items_s7 = [
    ("• Bài Dễ (d=1):", "Học viên hoàn thành nhanh trong 45–65 giây, độ chính xác đạt >75%, tâm lý hào hứng."),
    ("• Bài Trung bình (d=2):", "Thời gian tư duy 90–130 giây, độ chính xác 45–55%, vùng rèn luyện tối ưu nhất."),
    ("• Bài Khó (d=3):", "Tải nhận thức tăng vọt (180–300 giây). Học viên nhóm Yếu (NEW) tỷ lệ đúng giảm sâu dưới 20%."),
    ("🎯 Ngưỡng can thiệp 180s:", "Khi học viên kẹt quá 180s ở bài khó, Trợ lý AI tự động kích hoạt gợi ý từng bước (Scaffolding) để ngăn chặn bỏ cuộc.")
]
add_bullets_box(s7, Inches(7.3), Inches(2.35), Inches(5.0), Inches(4.4), items_s7, font_size=Pt(20))

# ==============================================================================
# SLIDE 8: ỨNG DỤNG PAL-NET VÀO ĐIỀU HƯỚNG LỘ TRÌNH THÍCH ỨNG
# ==============================================================================
s8 = prs.slides.add_slide(blank_layout)
set_slide_background(s8)
add_header(s8, "Ứng Dụng Hệ Thống", "Điều Hướng Cá Nhân Hóa & Vùng Thử Thách Vừa Sức (ZPD)", 8)

# 2 Cards for ZPD and Remediation
card_w8 = Inches(5.6)
add_clean_card(s8, Inches(0.8), Inches(1.65), card_w8, Inches(5.3), bg_color=COLOR_WHITE)
tb_h8a = s8.shapes.add_textbox(Inches(1.0), Inches(1.8), card_w8 - Inches(0.4), Inches(0.5))
p_h8a = tb_h8a.text_frame.paragraphs[0]
r_h8a = p_h8a.add_run()
r_h8a.text = "🎯 Chiến Lược 'Golden Zone' (ZPD)"
r_h8a.font.size = Pt(22)
r_h8a.font.bold = True
r_h8a.font.color.rgb = COLOR_PRIMARY_BLUE
r_h8a.font.name = "Segoe UI"

items_s8a = [
    ("• Công thức đề xuất:", "Dựa trên xác suất dự đoán P(correct) của mô hình PAL-Net cho các bài tập ứng viên."),
    ("• Ngưỡng 0.70 - 0.85:", "Đảm bảo bài tập vừa đủ thử thách để tư duy nhưng không gây nản chí, giữ người học trong 'Flow State'."),
    ("• Tránh thái cực:", "P > 0.85 (quá dễ gây nhàm chán); P < 0.50 (quá khó dễ dẫn tới bỏ cuộc môn học."),
    ("• Cập nhật tức thời:", "Xác suất làm chủ được tái tính toán ngay sau mỗi lần học viên nộp bài.")
]
add_bullets_box(s8, Inches(1.0), Inches(2.35), card_w8 - Inches(0.4), Inches(4.4), items_s8a, font_size=Pt(20))

# Right Card: Remediation
add_clean_card(s8, Inches(6.9), Inches(1.65), card_w8, Inches(5.3), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER_BLUE)
tb_h8b = s8.shapes.add_textbox(Inches(7.1), Inches(1.8), card_w8 - Inches(0.4), Inches(0.5))
p_h8b = tb_h8b.text_frame.paragraphs[0]
r_h8b = p_h8b.add_run()
r_h8b.text = "🗺️ Tự Động Phục Hồi Tri Thức"
r_h8b.font.size = Pt(22)
r_h8b.font.bold = True
r_h8b.font.color.rgb = COLOR_PRIMARY_BLUE
r_h8b.font.name = "Segoe UI"

items_s8b = [
    ("• Truy vết đồ thị DAG:", "Khi học viên làm sai liên tiếp bài khó, hệ thống lập tức truy vết ngược về các node kỹ năng cha."),
    ("• Đề xuất bài bắc cầu:", "Chèn bài củng cố kỹ năng thành phần (Sub-skills) trước khi cho học viên thử lại bài toán phức tạp."),
    ("• Trực quan hóa Roadmap:", "Cây kỹ năng cập nhật trạng thái màu: Xanh (Thành thạo), Vàng (Đang học ZPD), Xám (Khóa)."),
    ("• Lợi ích giáo dục:", "Triệt tiêu hiện tượng 'học vẹt' và lấp đầy lỗ hổng cú pháp nền tảng bền vững.")
]
add_bullets_box(s8, Inches(7.1), Inches(2.35), card_w8 - Inches(0.4), Inches(4.4), items_s8b, font_size=Pt(20))

# ==============================================================================
# SLIDE 9: TRỢ LÝ SƯ PHẠM AI & SANDBOX CHẤM CODE AN TOÀN
# ==============================================================================
s9 = prs.slides.add_slide(blank_layout)
set_slide_background(s9)
add_header(s9, "Hạ Tầng Kỹ Thuật & An Toàn", "Trợ Lý Multi-Agent Sư Phạm & Sandbox Docker Zero-Trust", 9)

# Left Card: Multi-Agent
add_clean_card(s9, Inches(0.8), Inches(1.65), card_w8, Inches(5.3), bg_color=COLOR_WHITE)
tb_h9a = s9.shapes.add_textbox(Inches(1.0), Inches(1.8), card_w8 - Inches(0.4), Inches(0.5))
p_h9a = tb_h9a.text_frame.paragraphs[0]
r_h9a = p_h9a.add_run()
r_h9a.text = "🤖 Trợ Lý Sư Phạm Multi-Agent"
r_h9a.font.size = Pt(22)
r_h9a.font.bold = True
r_h9a.font.color.rgb = COLOR_PRIMARY_BLUE
r_h9a.font.name = "Segoe UI"

items_s9a = [
    ("• Intent Router Agent:", "Định tuyến ý định người dùng (hỏi code, hỏi lý thuyết, tán gẫu) trong <20ms."),
    ("• Socratic Tutor Agent:", "Áp dụng phương pháp gợi mở, TUYỆT ĐỐI KHÔNG LÀM HỘ CODE mà đặt câu hỏi phản chiếu lỗi sai."),
    ("• AI Key Pool & Fallback:", "Hồ chứa API Key tự động xoay tua khi gặp Rate Limit (429), kèm bộ luật dự phòng chạy offline."),
    ("• Phân tích cú pháp AST:", "Quét cây AST để giải thích chính xác nguyên nhân lỗi biên dịch theo ngữ cảnh bài học.")
]
add_bullets_box(s9, Inches(1.0), Inches(2.35), card_w8 - Inches(0.4), Inches(4.4), items_s9a, font_size=Pt(20))

# Right Card: Sandbox
add_clean_card(s9, Inches(6.9), Inches(1.65), card_w8, Inches(5.3), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER_BLUE)
tb_h9b = s9.shapes.add_textbox(Inches(7.1), Inches(1.8), card_w8 - Inches(0.4), Inches(0.5))
p_h9b = tb_h9b.text_frame.paragraphs[0]
r_h9b = p_h9b.add_run()
r_h9b.text = "🛡️ Sandbox Docker Zero-Trust"
r_h9b.font.size = Pt(22)
r_h9b.font.bold = True
r_h9b.font.color.rgb = COLOR_PRIMARY_BLUE
r_h9b.font.name = "Segoe UI"

items_s9b = [
    ("• Cách ly mạng tuyệt đối:", "Container gắn cờ '--network none', ngăn chặn 100% tấn công mạng hoặc hack database."),
    ("• Giới hạn tài nguyên cứng:", "Khống chế 128MB RAM, 3.0s CPU và '--pids-limit 64' triệt tiêu nguy cơ treo máy do Fork-bomb."),
    ("• Quyền hạn tối thiểu:", "Chạy dưới user không đặc quyền 'nobody', toàn bộ file system là Read-Only."),
    ("• Tốc độ phản hồi cực nhanh:", "Thời gian chấm qua 5 test case dưới 1 giây, điều tiết qua Concurrency Queue.")
]
add_bullets_box(s9, Inches(7.1), Inches(2.35), card_w8 - Inches(0.4), Inches(4.4), items_s9b, font_size=Pt(20))


# ==============================================================================
# SLIDE 10: TỔNG KẾT ĐÓNG GÓP & HƯỚNG PHÁT TRIỂN
# ==============================================================================
s10 = prs.slides.add_slide(blank_layout)
set_slide_background(s10)
add_header(s10, "Kết Luận & Định Hướng", "Đóng Góp Cốt Lõi Của Đề Tài & Kế Hoạch Tương Lai", 10)

# Left Card: Contributions
add_clean_card(s10, Inches(0.8), Inches(1.65), Inches(5.7), Inches(5.3), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER_BLUE)
tb_h10_1 = s10.shapes.add_textbox(Inches(1.1), Inches(1.85), Inches(5.1), Inches(0.6))
p_h10_1 = tb_h10_1.text_frame.paragraphs[0]
p_h10_1.text = ""
r_h10_1 = p_h10_1.add_run()
r_h10_1.text = "🏆 Đóng Góp Thực Tiễn Của Đề Tài"
r_h10_1.font.size = Pt(22)
r_h10_1.font.bold = True
r_h10_1.font.color.rgb = COLOR_PRIMARY_BLUE
r_h10_1.font.name = "Segoe UI"

items_s10_left = [
    ("1. Hệ thống hoàn chỉnh:", "Xây dựng thành công nền tảng tích hợp Client, Backend Core, AI Microservice và Sandbox chấm code tự động."),
    ("2. Bộ dữ liệu chuẩn hóa:", "71.273 bản ghi tương tác trên 917 bài tập thật, làm cơ sở thực nghiệm vững chắc cho mô hình DKT."),
    ("3. Trợ lý AI Scaffolding:", "Định lượng chính xác thời điểm can thiệp, giúp giảm đáng kể áp lực nhận thức cho người mới bắt đầu.")
]
add_bullets_box(s10, Inches(1.1), Inches(2.55), Inches(5.1), Inches(4.2), items_s10_left, font_size=Pt(20.5))

# Right Card: Future Work
add_clean_card(s10, Inches(6.8), Inches(1.65), Inches(5.7), Inches(5.3), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER_BLUE)
tb_h10_2 = s10.shapes.add_textbox(Inches(7.1), Inches(1.85), Inches(5.1), Inches(0.6))
p_h10_2 = tb_h10_2.text_frame.paragraphs[0]
p_h10_2.text = ""
r_h10_2 = p_h10_2.add_run()
r_h10_2.text = "🚀 Hướng Mở Rộng & Phát Triển"
r_h10_2.font.size = Pt(22)
r_h10_2.font.bold = True
r_h10_2.font.color.rgb = COLOR_PRIMARY_BLUE
r_h10_2.font.name = "Segoe UI"

items_s10_right = [
    ("1. Tích hợp LLM Fine-tuned:", "Áp dụng mô hình ngôn ngữ lớn tinh chỉnh để sinh phản hồi sư phạm tự nhiên và trực quan hơn."),
    ("2. Mở rộng đa ngôn ngữ:", "Hỗ trợ thêm Java, Golang, Rust và phân tích độ phức tạp thời gian/không gian thuật toán O(N)."),
    ("3. Triển khai diện rộng:", "Ứng dụng thử nghiệm trực tiếp tại các lớp học nhập môn CNTT để thu thập dữ liệu người dùng thật.")
]
add_bullets_box(s10, Inches(7.1), Inches(2.55), Inches(5.1), Inches(4.2), items_s10_right, font_size=Pt(20.5))

# ==============================================================================
# SLIDE 11: LỜI CẢM ƠN (Thank You)
# ==============================================================================
s11 = prs.slides.add_slide(blank_layout)
set_slide_background(s11)

card_ty = add_clean_card(s11, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9), bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER_BLUE)

tb_ty_badge = s11.shapes.add_textbox(Inches(1.4), Inches(1.4), Inches(10.5), Inches(0.4))
p_ty_b = tb_ty_badge.text_frame.paragraphs[0]
p_ty_b.text = ""
r_ty_b = p_ty_b.add_run()
r_ty_b.text = "KẾT THÚC PHẦN TRÌNH BÀY"
r_ty_b.font.size = Pt(15)
r_ty_b.font.bold = True
r_ty_b.font.color.rgb = COLOR_PRIMARY_BLUE
r_ty_b.font.name = "Segoe UI"

tb_ty = s11.shapes.add_textbox(Inches(1.4), Inches(1.9), Inches(10.5), Inches(1.4))
tf_ty = tb_ty.text_frame
tf_ty.word_wrap = True
p_ty = tf_ty.paragraphs[0]
p_ty.text = ""
r_ty = p_ty.add_run()
r_ty.text = "XIN CHÂN THÀNH CẢM ƠN!"
r_ty.font.size = Pt(44)
r_ty.font.bold = True
r_ty.font.color.rgb = COLOR_TEXT_NAVY
r_ty.font.name = "Segoe UI"

p_ty_sub = tf_ty.add_paragraph()
p_ty_sub.space_before = Pt(8)
p_ty_sub.text = ""
r_tys = p_ty_sub.add_run()
r_tys.text = "Kính chúc Quý Thầy Cô trong Hội đồng sức khỏe và công tác tốt!"
r_tys.font.size = Pt(24)
r_tys.font.color.rgb = COLOR_ACCENT_BLUE
r_tys.font.name = "Segoe UI"

# Info box inside Thank You card
card_info = add_clean_card(s11, Inches(1.4), Inches(4.2), Inches(10.5), Inches(1.9), bg_color=COLOR_LIGHT_BLUE, border_color=COLOR_CARD_BORDER_BLUE)
tb_info = s11.shapes.add_textbox(Inches(1.7), Inches(4.35), Inches(10.0), Inches(1.6))
tf_info = tb_info.text_frame
tf_info.word_wrap = True

p_i1 = tf_info.paragraphs[0]
p_i1.text = ""
r_i1 = p_i1.add_run()
r_i1.text = "Đề tài: Mcode — Nền Tảng Học Lập Trình Thích Ứng & Chấm Code Tự Động"
r_i1.font.size = Pt(21)
r_i1.font.bold = True
r_i1.font.color.rgb = COLOR_TEXT_NAVY
r_i1.font.name = "Segoe UI"

p_i2 = tf_info.add_paragraph()
p_i2.space_before = Pt(6)
p_i2.text = ""
r_i2 = p_i2.add_run()
r_i2.text = "Sinh viên báo cáo: Nguyễn Tuấn Việt   •   Lớp: D22CNTT02"
r_i2.font.size = Pt(20)
r_i2.font.color.rgb = COLOR_TEXT_BODY
r_i2.font.name = "Segoe UI"

p_i3 = tf_info.add_paragraph()
p_i3.space_before = Pt(6)
p_i3.text = ""
r_i3 = p_i3.add_run()
r_i3.text = "💬 Sẵn sàng tiếp nhận các câu hỏi và ý kiến đóng góp từ Hội đồng (Q&A)"
r_i3.font.size = Pt(20)
r_i3.font.bold = True
r_i3.font.color.rgb = COLOR_PRIMARY_BLUE
r_i3.font.name = "Segoe UI"

# Save presentation
prs.save(OUTPUT_PPTX)
print(f"Fresh custom presentation successfully generated and saved to: {OUTPUT_PPTX}")
