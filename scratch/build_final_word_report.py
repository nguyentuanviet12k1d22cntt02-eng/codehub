import os
import docx
from docx.shared import Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import qn, nsdecls

def set_cell_border(cell, **kwargs):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = tcPr.first_child_found_in("w:tcBorders")
    if tcBorders is None:
        tcBorders = OxmlElement('w:tcBorders')
        tcPr.append(tcBorders)
    for edge in ('top', 'left', 'bottom', 'right'):
        edge_data = kwargs.get(edge)
        if edge_data:
            tag = 'w:{}'.format(edge)
            element = tcBorders.find(qn(tag))
            if element is None:
                element = OxmlElement(tag)
                tcBorders.append(element)
            for key, val in edge_data.items():
                element.set(qn('w:{}'.format(key)), str(val))

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_footer_page_number(run):
    fldChar1 = OxmlElement('w:fldChar')
    fldChar1.set(qn('w:fldCharType'), 'begin')
    instrText = OxmlElement('w:instrText')
    instrText.set(qn('xml:space'), 'preserve')
    instrText.text = "PAGE"
    fldChar2 = OxmlElement('w:fldChar')
    fldChar2.set(qn('w:fldCharType'), 'separate')
    fldChar3 = OxmlElement('w:fldChar')
    fldChar3.set(qn('w:fldCharType'), 'end')
    r = run._r
    r.append(fldChar1)
    r.append(instrText)
    r.append(fldChar2)
    r.append(fldChar3)

def generate_report():
    doc = docx.Document()

    # 1. Page Setup A4
    for section in doc.sections:
        section.page_width = Cm(21.0)
        section.page_height = Cm(29.7)
        section.top_margin = Cm(2.0)
        section.bottom_margin = Cm(2.0)
        section.left_margin = Cm(3.0)
        section.right_margin = Cm(2.0)

        footer = section.footer
        f_p = footer.paragraphs[0]
        f_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        f_run1 = f_p.add_run("Trang ")
        f_run1.font.name = "Times New Roman"
        f_run1.font.size = Pt(10)
        f_run1.font.color.rgb = RGBColor(0, 0, 0)
        
        f_run2 = f_p.add_run()
        f_run2.font.name = "Times New Roman"
        f_run2.font.size = Pt(10)
        f_run2.font.color.rgb = RGBColor(0, 0, 0)
        add_footer_page_number(f_run2)

    # Base styling
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(13)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)

    def add_p(text="", bold=False, italic=False, space_after=6, space_before=0, align=WD_ALIGN_PARAGRAPH.JUSTIFY, line_spacing=1.2):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.line_spacing = line_spacing
        if text:
            run = p.add_run(text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(13)
            run.font.color.rgb = RGBColor(0, 0, 0)
            run.font.bold = bold
            run.font.italic = italic
        return p

    def add_bullet(lead_text, body_text="", bold_lead=True, space_after=4):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.line_spacing = 1.2
        r1 = p.add_run(lead_text)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(13)
        r1.font.color.rgb = RGBColor(0, 0, 0)
        r1.font.bold = bold_lead
        if body_text:
            r2 = p.add_run(" " + body_text)
            r2.font.name = 'Times New Roman'
            r2.font.size = Pt(13)
            r2.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_h1(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.italic = True
        run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    # ----------------------------------------------------
    # COVER / HEADER TITLE
    # ----------------------------------------------------
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    r_inst = p_inst.add_run("BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC")
    r_inst.font.name = "Times New Roman"
    r_inst.font.size = Pt(12)
    r_inst.font.bold = True

    p_khoa = doc.add_paragraph()
    p_khoa.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_khoa.paragraph_format.space_after = Pt(18)
    r_khoa = p_khoa.add_run("KHOA CÔNG NGHỆ THÔNG TIN")
    r_khoa.font.name = "Times New Roman"
    r_khoa.font.size = Pt(12)
    r_khoa.font.bold = True

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(8)
    r_title = p_title.add_run("BÁO CÁO KỸ THUẬT ĐẶC TẢ CHỨC NĂNG ĐỀ TÀI")
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(17)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(0, 0, 0)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(16)
    r_sub = p_sub.add_run("HỆ THỐNG HỌC LẬP TRÌNH THÍCH ỨNG TÍCH HỢP TRỢ LÝ ẢO AI VÀ CHẤM CODE TỰ ĐỘNG\n(NỀN TẢNG VIBECODE AI / CODEHUB)")
    r_sub.font.name = "Times New Roman"
    r_sub.font.size = Pt(13)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(0, 0, 0)

    # Meta Table
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_widths = [Cm(5.0), Cm(11.0)]
    meta_data = [
        ("Loại tài liệu:", "Báo cáo phân rã chức năng & Đặc tả Use Case phần mềm"),
        ("Kiến trúc hệ thống:", "Feature-Based Microservices (React 19, Express 5, FastAPI, Docker)"),
        ("Ngày hoàn thiện:", "Tháng 09/2026"),
        ("Công cụ mô hình hóa:", "Sơ đồ tư duy (Mindmap), Sơ đồ Use Case chuẩn UML")
    ]
    border_spec = dict(sz=4, val='single', color='CCCCCC', space='0')
    for i, (k, v) in enumerate(meta_data):
        row = meta_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = col_widths[0]
        c1.width = col_widths[1]
        set_cell_background(c0, "FAFAFA")
        set_cell_background(c1, "FFFFFF")
        set_cell_border(c0, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)
        set_cell_border(c1, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)
        set_cell_margins(c0, 60, 60, 100, 100)
        set_cell_margins(c1, 60, 60, 100, 100)
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(k)
        r0.font.name = "Times New Roman"
        r0.font.size = Pt(12)
        r0.font.bold = True
        
        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(v)
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(12)

    doc.add_page_break()

    # ----------------------------------------------------
    # MỤC LỤC
    # ----------------------------------------------------
    p_toc_title = doc.add_paragraph()
    p_toc_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc_title.paragraph_format.space_before = Pt(6)
    p_toc_title.paragraph_format.space_after = Pt(14)
    r_toc_title = p_toc_title.add_run("MỤC LỤC BÁO CÁO")
    r_toc_title.font.name = "Times New Roman"
    r_toc_title.font.size = Pt(15)
    r_toc_title.font.bold = True

    toc_items = [
        ("1. SƠ ĐỒ TƯ DUY PHÂN RÃ CHỨC NĂNG TOÀN HỆ THỐNG (FUNCTIONAL MINDMAP)", 0),
        ("1.1. Sơ đồ tư duy chức năng tổng thể", 1),
        ("1.2. Mô tả 6 nhánh phân rã chức năng cốt lõi", 1),
        ("2. SƠ ĐỒ USE CASE TỔNG THỂ & GIẢI THÍCH CHI TIẾT CÁC CHỨC NĂNG", 0),
        ("2.1. Sơ đồ Use Case tổng thể toàn hệ thống", 1),
        ("2.2. Danh sách các tác nhân (Actors) tham gia hệ thống", 1),
        ("2.3. Giải thích chi tiết các ca sử dụng (Use Cases) trên sơ đồ", 1),
        ("2.3.1. Nhóm Use Case của Học viên (Student - UC01 đến UC07)", 2),
        ("2.3.2. Nhóm Use Case của Giảng viên & Quản trị viên (Teacher & Admin - UC08 đến UC12)", 2),
        ("2.3.3. Nhóm Use Case của Hệ thống Dịch vụ (AI Service & Sandbox - UC13 & UC14)", 2),
        ("2.4. Bảng ma trận phân quyền truy cập theo vai trò (RBAC)", 1),
        ("3. ĐẶC TẢ CHI TIẾT CÁC PHÂN HỆ CHỨC NĂNG HỆ THỐNG", 0),
        ("3.1. Phân hệ Người dùng & Học viên (Learner Portal)", 1),
        ("3.2. Phân hệ Không gian Học tập & Chấm Code Trực tuyến (Code Studio & Sandbox)", 1),
        ("3.3. Phân hệ Trợ lý ảo AI & Lộ trình Học Thích ứng (Adaptive AI Tutor)", 1),
        ("3.4. Phân hệ Hạ tầng Thực thi Mã nguồn An toàn (Isolated Sandbox Engine)", 1),
        ("3.5. Phân hệ Quản trị Hệ thống Toàn diện (Admin Management Portal)", 1),
        ("4. PHÂN HỆ GIÁO TRÌNH & NỘI DUNG ĐÀO TẠO TÍCH HỢP (CURRICULUM SYSTEM)", 0),
        ("4.1. Khóa học Lập trình Python & SQL Chuyên sâu", 1),
        ("4.2. Khóa học Lập trình C++ Nền tảng & C++ Hệ thống (48 bài chuẩn hóa)", 1),
        ("4.3. Bộ quy chuẩn chuẩn hóa 100% của toàn bộ 48 bài học C++", 1),
        ("5. BẢNG TỔNG HỢP CÔNG NGHỆ KỸ THUẬT & KẾT LUẬN", 0),
        ("5.1. Bảng ma trận ngăn xếp công nghệ (Technology Stack Matrix)", 1),
        ("5.2. Kết luận & Đánh giá ý nghĩa thực tiễn đề tài", 1)
    ]

    for title, lvl in toc_items:
        p_t = doc.add_paragraph()
        p_t.paragraph_format.space_before = Pt(1)
        p_t.paragraph_format.space_after = Pt(2)
        p_t.paragraph_format.line_spacing = 1.15
        if lvl == 0:
            p_t.paragraph_format.left_indent = Cm(0)
            r_t = p_t.add_run(title)
            r_t.font.name = "Times New Roman"
            r_t.font.size = Pt(12)
            r_t.font.bold = True
        elif lvl == 1:
            p_t.paragraph_format.left_indent = Cm(0.6)
            r_t = p_t.add_run(title)
            r_t.font.name = "Times New Roman"
            r_t.font.size = Pt(11.5)
            r_t.font.bold = False
        else:
            p_t.paragraph_format.left_indent = Cm(1.2)
            r_t = p_t.add_run(title)
            r_t.font.name = "Times New Roman"
            r_t.font.size = Pt(11)
            r_t.font.italic = True

    doc.add_page_break()

    # ----------------------------------------------------
    # PHẦN 1: SƠ ĐỒ TƯ DUY PHÂN RÃ CHỨC NĂNG
    # ----------------------------------------------------
    add_h1("1. SƠ ĐỒ TƯ DUY PHÂN RÃ CHỨC NĂNG TOÀN HỆ THỐNG (FUNCTIONAL MINDMAP)")
    add_p("Nhằm cung cấp cái nhìn trực quan, bao quát và mạch lạc nhất về toàn bộ cấu trúc phần mềm, các chức năng của đề tài Hệ thống học lập trình thích ứng tích hợp Trợ lý ảo AI và Chấm code tự động (VIBECODE AI / CODEHUB) được mô hình hóa dưới dạng Sơ đồ tư duy (Functional Mindmap) với 6 nhánh phân hệ chuyên biệt tỏa ra từ khối điều phối trung tâm.")

    add_h2("1.1. Sơ đồ tư duy chức năng tổng thể")
    mindmap_img = r"d:\Project\LearnPython\docs\features\so_do_tu_duy_chuc_nang.png"
    if os.path.exists(mindmap_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(4)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(mindmap_img, width=Cm(16.0))
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(8)
        r_cap = p_cap.add_run("Hình 1.1: Sơ đồ tư duy phân rã toàn bộ chức năng hệ thống VIBECODE AI")
        r_cap.font.name = "Times New Roman"
        r_cap.font.size = Pt(11)
        r_cap.font.italic = True

    add_h2("1.2. Mô tả 6 nhánh phân rã chức năng cốt lõi")
    add_p("Từ nút gốc trung tâm (Hệ thống đào tạo VIBECODE AI), 6 khối chức năng được phân bổ cân đối và liên kết chặt chẽ:")
    add_bullet("Nhánh 1 - Người dùng & Học viên (Learner Portal):", "Bao quát các tính năng cửa ngõ gồm Xác thực tài khoản (JWT/Bcrypt), Phân quyền 4 cấp (RBAC), Hồ sơ năng lực cá nhân, Learner Dashboard với chuỗi ngày học liên tục (Streak), và Khám phá danh mục đề cương khóa học 4 tầng.", True)
    add_bullet("Nhánh 2 - Code Studio & Sandbox (Không gian Học tập & Viết Code):", "Môi trường học tập cốt lõi gồm Lý thuyết sư phạm 5 phần súc tích, Trắc nghiệm Quiz tương tác tức thì, Trình soạn thảo Monaco Editor chuẩn VS Code, Chấm điểm Testcase tự động (công khai và ẩn), Cơ chế kiểm tra ràng buộc cú pháp động, và Đo hiệu năng thời gian thực thi (Runtime Beats %).", True)
    add_bullet("Nhánh 3 - Hạ tầng Sandbox Cô lập (Isolated Execution):", "Nền tảng thực thi an toàn gồm Runner chuyên biệt (Python, C++17, SQLite in-memory, JavaScript), Môi trường Docker Container cách ly tài nguyên (Production), và Subprocess an toàn có timeout (Local Dev).", True)
    add_bullet("Nhánh 4 - Trợ lý AI & Lộ trình Thích ứng (Adaptive ZPD):", "Trái tim thông minh gồm Mascot AI Chatbot đồng hành 24/7, Phân cụm 4 phong cách người học (Archetypes), Động cơ theo dõi tri thức mạng nơ-ron đồ thị PALNet (GCN & Attention Mechanism), Đồ thị kỹ năng DAG 33 nodes, và Quy trình Multi-Agent Critic tự động kiểm duyệt mã giải mẫu.", True)
    add_bullet("Nhánh 5 - Quản trị Admin Portal (Central Management):", "Hệ thống quản trị toàn diện gồm Bảng chỉ số KPI & Health-Check thời gian thực, Quản lý tài khoản & phân quyền, Công cụ Lesson Studio Editor soạn thảo giáo trình kèm live-preview, Đối soát bài nộp học viên, và Bể quản lý Dynamic AI Key Pool xoay vòng thông minh.", True)
    add_bullet("Nhánh 6 - Giáo trình Tích hợp (Curriculum System):", "Hệ thống nội dung đào tạo hoàn chỉnh gồm Khóa học Python (8 modules), SQL chuyên sâu, C++ Cơ bản (29 bài học), C++ Nâng cao & Lập trình hệ thống (19 bài học) với 100% 48 bài học C++ chuẩn mực.", True)

    doc.add_page_break()

    # ----------------------------------------------------
    # PHẦN 2: SƠ ĐỒ USE CASE TỔNG THỂ & GIẢI THÍCH
    # ----------------------------------------------------
    add_h1("2. SƠ ĐỒ USE CASE TỔNG THỂ & GIẢI THÍCH CHI TIẾT CÁC CHỨC NĂNG")
    add_p("Sơ đồ Use Case tổng thể mô hình hóa ranh giới hệ thống (System Boundary), các tác nhân tham gia (Actors) và mối quan hệ chức năng giữa người dùng với các dịch vụ thành phần trong toàn bộ đề tài.")

    add_h2("2.1. Sơ đồ Use Case tổng thể toàn hệ thống")
    usecase_img = r"d:\Project\LearnPython\docs\features\so_do_usecase_tong_the.png"
    if os.path.exists(usecase_img):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(4)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(usecase_img, width=Cm(16.0))
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(8)
        r_cap = p_cap.add_run("Hình 2.1: Sơ đồ Use Case tổng thể toàn hệ thống VIBECODE AI / CODEHUB")
        r_cap.font.name = "Times New Roman"
        r_cap.font.size = Pt(11)
        r_cap.font.italic = True

    add_h2("2.2. Danh sách các tác nhân (Actors) tham gia hệ thống")
    add_p("Hệ thống phân định rõ ràng 5 tác nhân tham gia tương tác:")
    add_bullet("Học viên (Student - Tác nhân chính bên trái):", "Người học sử dụng nền tảng để tra cứu giáo trình, tiếp thu bài giảng, làm trắc nghiệm, viết code thực hành và nhận lộ trình thích ứng từ AI.", True)
    add_bullet("Giảng viên (Teacher - Tác nhân quản trị đào tạo bên phải):", "Người phụ trách chuyên môn, sử dụng công cụ Lesson Studio Editor để biên soạn bài giảng, thiết lập câu hỏi trắc nghiệm, cấu hình ràng buộc cú pháp và theo dõi bài nộp học viên.", True)
    add_bullet("Quản trị viên (Administrator - Tác nhân quản trị hệ thống bên phải):", "Người nắm toàn quyền hệ thống, quản lý người dùng, phân quyền vai trò, cấu hình bể API Key AI, giám sát KPI và bảo trì vận hành máy chủ.", True)
    add_bullet("Hệ thống AI Service (Tác nhân dịch vụ thông minh bên phải):", "Vi dịch vụ ngoại vi xử lý mô hình mạng nơ-ron đồ thị PALNet (GCN & Attention), truy vấn đồ thị DAG, điều phối Multi-Agent và sinh nội dung học theo Vùng phát triển gần (ZPD).", True)
    add_bullet("Hệ thống Chấm Sandbox (Sandbox Judge - Tác nhân thực thi bên phải):", "Hạ tầng cô lập nhận mã nguồn từ Backend API Gateway, thực thi trong Container/Subprocess có timeout, thu thập kết quả và so khớp test case.", True)

    add_h2("2.3. Giải thích chi tiết các ca sử dụng (Use Cases) trên sơ đồ")
    add_p("Toàn bộ 14 Use Cases trên sơ đồ Hình 2.1 được giải thích chi tiết theo từng nhóm tác nhân:")

    add_h3("2.3.1. Nhóm Use Case của Học viên (Student - UC01 đến UC07)")
    add_bullet("UC01: Đăng ký, Đăng nhập & Quản lý Hồ sơ:", "Học viên khởi tạo tài khoản mới với mật khẩu mã hóa Bcrypt, đăng nhập nhận token JWT an toàn, cập nhật thông tin cá nhân và xem lịch sử các lần nộp bài.", True)
    add_bullet("UC02: Khám phá Đề cương & Ghi danh Khóa học:", "Xem danh mục khóa học (Python, SQL, C++), duyệt cây đề cương 4 tầng (Khóa học -> Module -> Chương -> Bài học), học thử bài miễn phí và ghi danh tham gia.", True)
    add_bullet("UC03: Học Lý thuyết Sư phạm & Làm trắc nghiệm Quiz:", "Đọc bài giảng 5 phần chuẩn hóa (Khái niệm, Cú pháp, Minh họa, Ví dụ ngắn có nút Copy, Bẫy ghi nhớ), trả lời câu hỏi trắc nghiệm và nhận ngay lời giải thích sư phạm củng cố.", True)
    add_bullet("UC04: Soạn thảo mã nguồn trên Monaco Studio:", "Viết mã nguồn trực tiếp trên trình biên tập Monaco Editor tích hợp (hỗ trợ C++, Python, SQL, JS), tận dụng tính năng tô màu cú pháp, tự động thụt lề, mã khởi đầu và đổi giao diện Sáng/Tối.", True)
    add_bullet("UC05: Nộp bài chấm tự động & Kiểm tra Ràng buộc:", "Học viên bấm nộp bài, hệ thống kích hoạt cơ chế kiểm tra ràng buộc cú pháp (từ khóa bắt buộc, từ khóa cấm, chú thích) và bao hàm (<<include>>) gọi đến UC14 để thực thi trong Sandbox.", True)
    add_bullet("UC06: Tương tác Mascot AI & Nhận lộ trình ZPD:", "Đối thoại với Mascot trợ lý ảo 24/7, thực hiện khảo sát mục tiêu và bao hàm (<<include>>) gọi đến UC13 để nhận các bài học cá nhân hóa đúng vùng phát triển gần.", True)
    add_bullet("UC07: Xem phân tích tiến độ & Xếp hạng Beats %:", "Xem biểu đồ tiến độ học tập cá nhân, thống kê tỷ lệ đúng (Acceptance Rate) và phần trăm hiệu năng chạy nhanh hơn cộng đồng (Runtime Beats %).", True)

    add_h3("2.3.2. Nhóm Use Case của Giảng viên & Quản trị viên (Teacher & Admin - UC08 đến UC12)")
    add_bullet("UC08: Soạn giáo trình & Ràng buộc (Lesson Studio Editor):", "Giảng viên và Admin sử dụng giao diện Markdown Live Preview, thanh công cụ chèn nhanh mẫu code/bảng, và GUI thiết lập ràng buộc cú pháp động (`requiredKeywords`, `forbiddenKeywords`, `requireComment`).", True)
    add_bullet("UC09: Quản trị Khóa học, Bài học & Bộ Testcases ẩn/hiện:", "Tạo mới khóa học, quản lý các module/chương/bài học, thiết lập bộ testcase chấm điểm có phân định cờ ẩn (`isHidden`) để chống gian lận.", True)
    add_bullet("UC10: Quản lý Người dùng, Phân quyền RBAC & Khóa TK:", "Dành riêng cho Quản trị viên: xem danh sách tài khoản, thăng cấp hoặc hạ cấp vai trò (`STUDENT`, `TEACHER`, `ADMIN`) và vô hiệu hóa tài khoản vi phạm.", True)
    add_bullet("UC11: Giám sát KPI Hệ thống & Báo cáo Analytics:", "Theo dõi số lượng học viên hoạt động, tỷ lệ hoàn thành bài tập, biểu đồ phân tích tỷ lệ rớt (Pass Rate Analysis) và kiểm tra sức khỏe các dịch vụ.", True)
    add_bullet("UC12: Quản lý Bể API Key AI (Dynamic Key Pool xoay vòng):", "Dành riêng cho Quản trị viên: thêm/sửa khóa API (Gemini, OpenRouter), kiểm tra kết nối (Test Connection) và giám sát nhật ký cuộc gọi `AICallLog`.", True)

    add_h3("2.3.3. Nhóm Use Case của Hệ thống Dịch vụ (AI Service & Sandbox - UC13 & UC14)")
    add_bullet("UC13: Chẩn đoán tri thức PALNet & Sinh bài học thích ứng ZPD:", "AI Microservice tự động chạy mô hình mạng nơ-ron đồ thị PALNet (kết hợp Graph Convolutional Network - GCN và cơ chế Attention), phân cụm Archetype, rà soát lỗ hổng trên Đồ thị kỹ năng DAG 33 nodes, sinh bài học và dùng CriticEvaluatorAgent thẩm định code mẫu.", True)
    add_bullet("UC14: Thực thi mã cô lập trong Sandbox (Docker/Subprocess):", "Hạ tầng Sandbox tự động nhận mã nguồn, biên dịch qua `g++` (đối với C++) hoặc thông dịch (Python/SQL/JS), thực thi trong môi trường cô lập tài nguyên và so khớp kết quả chuẩn xác.", True)

    add_h2("2.4. Bảng ma trận phân quyền truy cập theo vai trò (RBAC)")
    add_p("Bảng 2.1: Ma trận phân quyền thực thi các Use Case theo vai trò người dùng", italic=True, space_after=3)
    
    rbac_table = doc.add_table(rows=15, cols=5)
    rbac_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    rbac_widths = [Cm(2.0), Cm(5.5), Cm(2.5), Cm(2.5), Cm(3.5)]
    
    rbac_headers = ["Mã UC", "Tên Ca Sử Dụng", "Học Viên", "Giảng Viên", "Quản Trị Viên"]
    hdr_row = rbac_table.rows[0]
    for idx, name in enumerate(rbac_headers):
        cell = hdr_row.cells[idx]
        cell.width = rbac_widths[idx]
        set_cell_background(cell, "EAEAEA")
        set_cell_margins(cell, 100, 100, 100, 100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(name)
        run.font.name = "Times New Roman"
        run.font.size = Pt(11)
        run.font.bold = True

    rbac_rows = [
        ("UC01", "Đăng ký, Đăng nhập & Quản lý Hồ sơ", "Toàn quyền", "Toàn quyền", "Toàn quyền"),
        ("UC02", "Khám phá Đề cương & Ghi danh Khóa học", "Toàn quyền", "Toàn quyền", "Toàn quyền"),
        ("UC03", "Học Lý thuyết Sư phạm & Làm trắc nghiệm Quiz", "Toàn quyền", "Toàn quyền", "Toàn quyền"),
        ("UC04", "Soạn thảo mã nguồn trên Monaco Studio", "Toàn quyền", "Toàn quyền", "Toàn quyền"),
        ("UC05", "Nộp bài chấm tự động & Kiểm tra Ràng buộc", "Toàn quyền", "Toàn quyền", "Toàn quyền"),
        ("UC06", "Tương tác Mascot AI & Nhận lộ trình ZPD", "Toàn quyền", "Toàn quyền", "Toàn quyền"),
        ("UC07", "Xem phân tích tiến độ & Xếp hạng Beats %", "Toàn quyền", "Toàn quyền", "Toàn quyền"),
        ("UC08", "Soạn giáo trình & Ràng buộc (Lesson Studio)", "Không", "Toàn quyền", "Toàn quyền"),
        ("UC09", "Quản trị Khóa học & Bộ Testcases ẩn/hiện", "Không", "Toàn quyền", "Toàn quyền"),
        ("UC10", "Quản lý Người dùng, Phân quyền & Khóa TK", "Không", "Không", "Toàn quyền"),
        ("UC11", "Giám sát KPI Hệ thống & Báo cáo Analytics", "Không", "Xem báo cáo", "Toàn quyền"),
        ("UC12", "Quản lý Bể API Key AI (Dynamic Key Pool)", "Không", "Không", "Toàn quyền"),
        ("UC13", "Chẩn đoán tri thức PALNet & Sinh bài ZPD", "Hệ thống AI", "Hệ thống AI", "Hệ thống AI"),
        ("UC14", "Thực thi mã cô lập trong Sandbox", "Sandbox", "Sandbox", "Sandbox")
    ]

    for r_idx, row_data in enumerate(rbac_rows):
        row = rbac_table.rows[r_idx + 1]
        bg_color = "FDFDFD" if r_idx % 2 == 0 else "F7F7F7"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = rbac_widths[c_idx]
            set_cell_background(cell, bg_color)
            set_cell_border(cell, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx != 1 else WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(10.5)
            if val == "Toàn quyền":
                run.font.bold = True

    add_p() # spacing

    doc.add_page_break()

    # ----------------------------------------------------
    # PHẦN 3: ĐẶC TẢ CHI TIẾT CÁC PHÂN HỆ CHỨC NĂNG
    # ----------------------------------------------------
    add_h1("3. ĐẶC TẢ CHI TIẾT CÁC PHÂN HỆ CHỨC NĂNG HỆ THỐNG")
    add_p("Phần này trình bày đặc tả kỹ thuật chi tiết của 5 phân hệ phần mềm cốt lõi đảm bảo vận hành toàn vẹn hệ thống.")

    add_h2("3.1. Phân hệ Người dùng & Học viên (Learner Portal)")
    add_bullet("Xác thực & Bảo mật tài khoản:", "Học viên đăng ký tài khoản với họ tên, username, email và mật khẩu. Toàn bộ mật khẩu được băm một chiều an toàn bằng thuật toán Bcrypt (Salt rounds = 10). Cơ chế đăng nhập cấp phát JSON Web Token (JWT) có chữ ký số bí mật, phân quyền truy cập thông qua các Middleware bảo vệ tuyến đường.", True)
    add_bullet("Hồ sơ năng lực cá nhân:", "Học viên có thể cập nhật thông tin cá nhân, xem biểu đồ tỷ lệ bài tập hoàn thành (Acceptance Rate), tổng số điểm tích lũy và bảng lịch sử chi tiết toàn bộ các lần nộp bài (thời gian chạy, kết quả đúng/sai).", True)
    add_bullet("Bảng điều khiển học viên (Dashboard):", "Theo dõi trực quan tiến độ các khóa học đang tham gia, chuỗi ngày học liên tục (Learning Streak) kích thích thói quen học tập, và nút tắt thông minh Resume Learning đưa học viên quay lại ngay bài học đang dang dở.", True)
    add_bullet("Khám phá & Ghi danh khóa học:", "Duyệt danh mục khóa học trực quan, khám phá cây đề cương 4 cấp (Khóa học -> Module -> Chương -> Bài học), học thử bài miễn phí và đăng ký ghi danh (Enrollment).", True)

    add_h2("3.2. Phân hệ Không gian Học tập & Chấm Code Trực tuyến (Code Studio & Sandbox)")
    add_bullet("Trình học lý thuyết sư phạm chuẩn 5 phần:", "Nội dung bài học biên soạn súc tích, loại bỏ code dài dòng lan man, tuân thủ cấu trúc: Khái niệm -> Cú pháp quy chuẩn -> Minh họa trực quan -> Ví dụ ngắn gọn nhất (có nút Copy) -> Bẫy thường gặp & Ghi nhớ.", True)
    add_bullet("Câu hỏi trắc nghiệm tương tác tức thì:", "Hệ thống trắc nghiệm khách quan kiểm tra độ hiểu bài ngay sau phần lý thuyết, phản hồi màu sắc trực quan (Xanh/Đỏ) kèm đoạn văn giải thích lý do đáp án đúng.", True)
    add_bullet("Trình soạn thảo Monaco Studio chuyên nghiệp:", "Tích hợp Monaco Editor (chuẩn Microsoft VS Code) hỗ trợ Syntax Highlighting cho C++, Python, SQL, JS; tự động thụt lề; tự đóng mở ngoặc; gợi ý mã IntelliSense; chuyển đổi theme Sáng/Tối và nút Reset Code khôi phục mã nguồn ban đầu.", True)
    add_bullet("Chấm điểm tự động & Kiểm tra ràng buộc cú pháp động:", "Học viên có thể chạy thử nghiệm tự do (Run Code) hoặc nộp bài chấm điểm chính thức (Submit Code). Hệ thống tự động kiểm tra các ràng buộc: từ khóa bắt buộc (`requiredKeywords`), từ khóa cấm (`forbiddenKeywords`), bắt buộc viết chú thích (`requireComment`) với cơ chế bóc tách comment thông minh trước khi kiểm tra.", True)
    add_bullet("Đo đạc thời gian chạy & Xếp hạng Beats %:", "Ghi nhận thời gian thực thi chính xác đến mili-giây và tính toán tỷ lệ phần trăm chạy nhanh hơn cộng đồng để khích lệ học viên tối ưu độ phức tạp thuật toán.", True)

    add_h2("3.3. Phân hệ Trợ lý ảo AI & Lộ trình Học Thích ứng (Adaptive AI Tutor)")
    add_bullet("Trợ lý ảo Mascot tương tác 24/7:", "Nhân vật Mascot thông minh đồng hành cùng học viên, khảo sát mục tiêu học tập (Onboarding) và đối thoại sư phạm gợi mở theo phương pháp Socratic.", True)
    add_bullet("Chẩn đoán trình độ & Phân cụm 4 phong cách:", "Phân loại người học vào 4 Archetypes: The Optimizer (Tối ưu), The Persister (Kiên trì), The Rusher (Nhanh vội), The Stuck (Gặp khó) để AI tự động điều chỉnh độ khó và phong cách gợi ý phù hợp.", True)
    add_bullet("Mô hình mạng đồ thị theo dõi tri thức PALNet (PyTorch GCN & Attention):", "Ứng dụng mạng nơ-ron đồ thị PALNet (Personalized Adaptive Learning Network) tích hợp 2 tầng tích chập đồ thị (GCN) trên ma trận kề DAG kỹ năng, bộ mã hóa hồ sơ học viên (Learner Profile Embedding) và cơ chế Attention theo ngữ cảnh để dự báo chuẩn xác năng lực thông thạo từng khái niệm của người học.", True)
    add_bullet("Đồ thị Tri thức Kỹ năng DAG 33 Nodes:", "Mô hình hóa mối quan hệ tiên quyết giữa 33 khái niệm lập trình trọng tâm, giúp AI định vị chính xác nguồn gốc lỗ hổng kiến thức khi học viên gặp bế tắc.", True)
    add_bullet("Sinh lộ trình cá nhân hóa theo Vùng phát triển gần (ZPD):", "Tự động sinh trọn bộ bài giảng lý thuyết ngắn, câu hỏi trắc nghiệm và bài tập lập trình vừa vặn với năng lực phát triển kế tiếp của học viên.", True)
    add_bullet("Cơ chế tự kiểm duyệt chất lượng Multi-Agent:", "Chu trình khép kín giữa RouterAgent -> KnowledgeRetriever -> ExerciseGeneratorAgent -> CriticEvaluatorAgent (chạy thử nghiệm mã giải mẫu trực tiếp trong Sandbox trước khi giao cho học viên, loại bỏ hoàn toàn lỗi ảo).", True)

    add_h2("3.4. Phân hệ Hạ tầng Thực thi Mã nguồn An toàn (Isolated Sandbox Engine)")
    add_bullet("Trình chạy mã đa ngôn ngữ chuyên biệt:", "Bao gồm Python Runner, C/C++ Runner G++17 (tách biệt pha biên dịch và pha thực thi, bắt lỗi Segmentation Fault), SQL Runner (SQLite in-memory độc lập cho từng phiên chạy), và JavaScript Runner.", True)
    add_bullet("Cơ chế điều phối kép thông minh (Dual Dispatcher):", "Chế độ Docker Container Mode (môi trường Production) cô lập tuyệt đối mạng (`--network none`), giới hạn CPU (0.5 core) và RAM (128MB); kết hợp Chế độ Subprocess Cục bộ (Local Fallback) có bộ đệm timeout an toàn đảm bảo hệ thống luôn hoạt động liên tục.", True)

    add_h2("3.5. Phân hệ Quản trị Hệ thống Toàn diện (Admin Management Portal)")
    add_bullet("Admin Dashboard & Service Health-Check:", "Theo dõi các chỉ số KPI thời gian thực (tổng số học viên, khóa học, bài nộp) và tình trạng kết nối của Backend, AI Service và Database.", True)
    add_bullet("Quản lý Người dùng & Phân quyền RBAC:", "Tra cứu chi tiết lịch sử học tập của từng học viên, thăng/hạ cấp vai trò tài khoản và khóa tài khoản vi phạm.", True)
    add_bullet("Quản lý Khóa học & Vòng đời xuất bản:", "Tạo mới, chỉnh sửa khóa học, chuyển đổi trạng thái Bản nháp (DRAFT) sang Đã xuất bản (PUBLISHED), hỗ trợ xóa liên hoàn an toàn.", True)
    add_bullet("Lesson Studio Editor chuyên nghiệp:", "Soạn thảo bài giảng Markdown xem trước thời gian thực (Live Preview), thanh công cụ chèn nhanh khối lệnh, giao diện cấu hình Ràng buộc cú pháp động (Code Constraints GUI), quản lý bộ test cases (công khai/ẩn) và Quiz Builder.", True)
    add_bullet("Báo cáo phân tích chuyên sâu (Advanced Analytics):", "Biểu đồ xu hướng học tập, cơ cấu ngôn ngữ và phân tích tỷ lệ rớt (Pass Rate Analysis) giúp giảng viên kịp thời tinh chỉnh nội dung đào tạo.", True)
    add_bullet("Bể quản lý API Key AI xoay vòng thông minh (Dynamic AI Key Pool):", "Quản lý tập trung API Key đa nhà cung cấp (Gemini, OpenRouter), kiểm tra kết nối (Test Connection), tự động luân phiên xoay vòng Round-Robin và tự động chuyển sang Key dự phòng khi gặp lỗi Rate Limit, ghi vết đầy đủ vào nhật ký kiểm toán `AICallLog`.", True)

    doc.add_page_break()

    # ----------------------------------------------------
    # PHẦN 4: GIÁO TRÌNH & NỘI DUNG ĐÀO TẠO
    # ----------------------------------------------------
    add_h1("4. PHÂN HỆ GIÁO TRÌNH & NỘI DUNG ĐÀO TẠO TÍCH HỢP (CURRICULUM SYSTEM)")
    add_p("Nền tảng tích hợp sẵn 4 chương trình đào tạo tiêu chuẩn, được biên soạn công phu và kiểm thử tự động:")

    add_h2("4.1. Khóa học Lập trình Python & SQL Chuyên sâu")
    add_bullet("Khóa học Python Căn bản & Nâng cao:", "Gồm 8 Modules với hơn 40 bài giảng bài bản, bao quát từ Biến, Cấu trúc điều khiển, Vòng lặp, List/Tuple/Dictionary, Xử lý chuỗi, Hàm, File I/O đến Lập trình hướng đối tượng (OOP).", True)
    add_bullet("Khóa học Hệ quản trị CSDL SQL:", "Chuyên đề thực hành truy vấn cơ sở dữ liệu quan hệ với SQLite in-memory: SELECT, WHERE, GROUP BY, HAVING, các phép kết nối INNER/LEFT/OUTER JOIN và truy vấn lồng (Subquery).", True)

    add_h2("4.2. Khóa học Lập trình C++ Nền tảng & C++ Hệ thống (48 bài chuẩn hóa)")
    add_bullet("Khóa học C++ Nền tảng (Cơ bản - 7 Modules, 29 bài học):", "C++17 Fast I/O, Biến, Cấu trúc rẽ nhánh If-Else và Switch-Case, Vòng lặp For/While, Xử lý chuỗi std::string, Mảng 1 chiều, Hàm & Tham chiếu (&), Mảng 2 chiều và Ma trận.", True)
    add_bullet("Khóa học C++ Nâng cao & Hệ thống (6 Modules, 19 bài học):", "Kỹ thuật Bit-fields, Căn chỉnh bộ nhớ (Memory Alignment/Padding), Stack và Heap, Con trỏ thông minh (Smart Pointers), Đọc ghi tệp nhị phân, Biên dịch nhiều tệp (Makefile) và Thuật toán Quay lui (Backtracking).", True)

    add_h2("4.3. Bộ quy chuẩn chuẩn hóa 100% của toàn bộ 48 bài học C++")
    add_p("Toàn bộ 48 bài học C++ trong hệ thống đạt chuẩn đồng nhất tuyệt đối:")
    add_bullet("Đầy đủ 3 hợp phần sư phạm:", "100% bài học đều bao gồm: Bài đọc lý thuyết 5 phần + Câu hỏi trắc nghiệm kiểm tra độ hiểu bài + Bài tập lập trình thực hành.", True)
    add_bullet("Test Cases chuẩn mực:", "Mỗi bài tập lập trình đều được nạp sẵn danh sách Test Cases công khai và Test Cases ẩn kiểm thử các trường hợp biên.", True)
    add_bullet("Ràng buộc cú pháp động đồng bộ:", "100% bài tập được tích hợp các ràng buộc (`requiredKeywords`, `forbiddenKeywords`, `requireComment`) kết nối trực tiếp giữa Lesson Studio Editor và bộ chấm mã nguồn Backend Sandbox.", True)

    # ----------------------------------------------------
    # PHẦN 5: BẢNG TỔNG HỢP CÔNG NGHỆ & KẾT LUẬN
    # ----------------------------------------------------
    add_h1("5. BẢNG TỔNG HỢP CÔNG NGHỆ KỸ THUẬT & KẾT LUẬN")

    add_h2("5.1. Bảng ma trận ngăn xếp công nghệ (Technology Stack Matrix)")
    add_p("Bảng 5.1: Danh mục công nghệ kỹ thuật sử dụng trong dự án", italic=True, space_after=3)
    
    tech_table = doc.add_table(rows=13, cols=3)
    tech_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tech_widths = [Cm(3.5), Cm(4.5), Cm(8.0)]
    
    tech_headers = ["Tầng Hệ Thống", "Công Nghệ Sử Dụng", "Vai Trò & Chức Năng Kỹ Thuật"]
    hdr_row = tech_table.rows[0]
    for idx, name in enumerate(tech_headers):
        cell = hdr_row.cells[idx]
        cell.width = tech_widths[idx]
        set_cell_background(cell, "EAEAEA")
        set_cell_margins(cell, 100, 100, 100, 100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(name)
        run.font.name = "Times New Roman"
        run.font.size = Pt(11)
        run.font.bold = True

    tech_rows = [
        ("Frontend Client", "React 19, TypeScript, Vite", "Xây dựng Single Page Application (SPA) tốc độ cao, type-safe toàn diện"),
        ("Giao Diện & Icon", "Tailwind CSS, Lucide React", "Thiết kế giao diện hiện đại, Dark/Light Mode, responsive trên mọi kích thước màn hình"),
        ("Trình Viết Code", "Monaco Editor", "Bộ soạn thảo mã nguồn chuyên nghiệp, tô màu cú pháp, tự động gợi ý code"),
        ("Quản Lý Cache", "TanStack React Query v5", "Đồng bộ trạng thái từ xa, tối ưu hóa request và lưu cache dữ liệu client"),
        ("Backend Gateway", "Node.js, Express 5, TypeScript", "Xây dựng RESTful API Gateway, định tuyến bảo mật, xác thực và xử lý nghiệp vụ"),
        ("Tầng Dữ Liệu ORM", "Prisma ORM 7.x", "Quản lý schema cơ sở dữ liệu, tự động sinh migration và truy vấn Type-Safe"),
        ("Cơ Sở Dữ Liệu", "PostgreSQL (Supabase / Local)", "Lưu trữ quan hệ bền vững dữ liệu người dùng, khóa học, bài nộp, AI keys, logs"),
        ("Bảo Mật Xác Thực", "JWT, Bcrypt", "Băm mật khẩu an toàn, cấp phát và thẩm định token phiên làm việc"),
        ("AI Microservice", "FastAPI, Python 3.10+", "Vi dịch vụ AI bất đồng bộ hiệu năng cao phục vụ gợi ý và trò chuyện thông minh"),
        ("Mô Hình Đồ Thị PALNet", "PyTorch, Scikit-Learn", "Mô hình hóa tri thức người học bằng mạng đồ thị PALNet (GCN & Multi-Head Attention)"),
        ("Mô Hình Ngôn Ngữ", "Gemini API, OpenRouter API", "Mô hình Gemini Flash, Llama 3.3, DeepSeek V3 sinh bài học ZPD và gia sư AI"),
        ("Sandbox Thực Thi", "Docker Engine, GCC/G++17", "Môi trường container cô lập an toàn để biên dịch và chấm điểm mã nguồn tự động")
    ]

    for r_idx, row_data in enumerate(tech_rows):
        row = tech_table.rows[r_idx + 1]
        bg_color = "FDFDFD" if r_idx % 2 == 0 else "F7F7F7"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = tech_widths[c_idx]
            set_cell_background(cell, bg_color)
            set_cell_border(cell, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else (WD_ALIGN_PARAGRAPH.LEFT if c_idx == 2 else WD_ALIGN_PARAGRAPH.CENTER)
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(11)
            if c_idx in [0, 1]:
                run.font.bold = True

    add_p() # spacing

    add_h2("5.2. Kết luận & Đánh giá ý nghĩa thực tiễn đề tài")
    add_p("Đề tài 'Hệ thống học lập trình thích ứng tích hợp Trợ lý ảo AI và Chấm code tự động (VIBECODE AI / CODEHUB)' đã hoàn thiện toàn diện các mục tiêu đề ra, mang lại 3 đóng góp quan trọng:")
    add_bullet("Đột phá trong phương pháp giáo dục cá nhân hóa:", "Kết hợp thuyết Vùng phát triển gần (ZPD) với mạng nơ-ron đồ thị PALNet (GCN & Attention) giúp loại bỏ hoàn toàn tình trạng học viên bị quá tải hoặc chán nản.", True)
    add_bullet("Môi trường thực hành trực tuyến chuẩn công nghiệp:", "Sự kết hợp giữa Monaco Editor chuyên nghiệp, hệ thống kiểm tra ràng buộc cú pháp động và hạ tầng Sandbox cô lập giúp học sinh rèn luyện tư duy code sạch và chuẩn mực.", True)
    add_bullet("Khả năng vận hành bền bỉ & tiết kiệm chi phí:", "Cơ chế Dynamic AI Key Pool Manager tự động xoay vòng thông minh giữa các nhà cung cấp AI giúp hệ thống hoạt động 24/7 mà không lo cạn kiệt ngân sách hay bị ngắt quãng do Rate Limit.", True)

    # Save files
    file_root = r"d:\Project\LearnPython\BAO_CAO_DANH_SACH_CHUC_NANG_DE_TAI.docx"
    file_docs = r"d:\Project\LearnPython\docs\features\BAO_CAO_DANH_SACH_CHUC_NANG_DE_TAI.docx"
    
    os.makedirs(os.path.dirname(file_docs), exist_ok=True)
    doc.save(file_root)
    doc.save(file_docs)
    print(f"Successfully generated final DOCX files:\n1. {file_root}\n2. {file_docs}")

if __name__ == "__main__":
    generate_report()
