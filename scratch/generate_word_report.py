import os
import docx
from docx.shared import Inches, Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import qn, nsdecls

def create_element(name):
    return OxmlElement(name)

def set_cell_border(cell, **kwargs):
    """
    kwargs: top, bottom, left, right
    values: dict(sz=12, val='single', color='CCCCCC', space='0')
    """
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
    
    # 1. Page Setup A4: Top 2.0cm, Bottom 2.0cm, Left 3.0cm, Right 2.0cm
    sections = doc.sections
    for section in sections:
        section.page_width = Cm(21.0)
        section.page_height = Cm(29.7)
        section.top_margin = Cm(2.0)
        section.bottom_margin = Cm(2.0)
        section.left_margin = Cm(3.0)
        section.right_margin = Cm(2.0)
        
        # Setup Footer: "Trang X" (Centered, black)
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
    
    # Helper to add paragraphs
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

    def add_callout(text, italic=False):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Cm(16.0)
        set_cell_background(cell, "F5F5F5")
        border_spec = dict(sz=12, val='single', color='333333', space='0')
        border_none = dict(sz=0, val='none', color='auto', space='0')
        set_cell_border(cell, left=border_spec, top=border_none, right=border_none, bottom=border_none)
        set_cell_margins(cell, top=120, bottom=120, left=200, right=150)
        
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        run.font.italic = italic
        run.font.color.rgb = RGBColor(0, 0, 0)
        # Empty space after table
        sp = doc.add_paragraph()
        sp.paragraph_format.space_before = Pt(0)
        sp.paragraph_format.space_after = Pt(4)

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
    r_title = p_title.add_run("BÁO CÁO KỸ THUẬT CHI TIẾT DANH SÁCH CHỨC NĂNG ĐỀ TÀI")
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
        ("Loại tài liệu:", "Báo cáo đặc tả chức năng & kiến trúc phần mềm"),
        ("Kiến trúc hệ thống:", "Feature-Based Microservices (React 19, Express 5, FastAPI, Docker)"),
        ("Ngày hoàn thiện:", "Tháng 09/2026"),
        ("Phạm vi ứng dụng:", "Đào tạo lập trình thích ứng cá nhân hóa và chấm thi tự động")
    ]
    for i, (k, v) in enumerate(meta_data):
        row = meta_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = col_widths[0]
        c1.width = col_widths[1]
        set_cell_background(c0, "FAFAFA")
        set_cell_background(c1, "FFFFFF")
        b_spec = dict(sz=4, val='single', color='E0E0E0', space='0')
        set_cell_border(c0, top=b_spec, bottom=b_spec, left=b_spec, right=b_spec)
        set_cell_border(c1, top=b_spec, bottom=b_spec, left=b_spec, right=b_spec)
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
        ("1. TỔNG QUAN KIẾN TRÚC & MA TRẬN PHÂN HỆ", 0),
        ("1.1. Kiến trúc phân tầng Feature-Based Microservices", 1),
        ("1.2. Ma trận phân quyền truy cập theo vai trò (RBAC)", 1),
        ("2. PHÂN HỆ NGƯỜI DÙNG & HỌC VIÊN (LEARNER PORTAL)", 0),
        ("2.1. Xác thực & bảo mật tài khoản người dùng", 1),
        ("2.2. Hồ sơ năng lực cá nhân & thống kê học tập", 1),
        ("2.3. Bảng điều khiển học viên (Learner Dashboard)", 1),
        ("2.4. Khám phá & ghi danh khóa học (Course Catalog & Enrollment)", 1),
        ("3. PHÂN HỆ KHÔNG GIAN HỌC TẬP & CHẤM CODE TRỰC TUYẾN (CODE STUDIO & SANDBOX)", 0),
        ("3.1. Trình học lý thuyết sư phạm chuẩn 5 phần", 1),
        ("3.2. Hệ thống câu hỏi trắc nghiệm tương tác tức thời", 1),
        ("3.3. Trình soạn thảo mã nguồn chuyên nghiệp Monaco Studio", 1),
        ("3.4. Trình chấm điểm & kiểm thử tự động đa trường hợp", 1),
        ("3.5. Cơ chế kiểm tra ràng buộc cú pháp động (Dynamic Code Constraints)", 1),
        ("3.6. Đánh giá hiệu năng thời gian thực thi (Runtime Beats Distribution)", 1),
        ("4. PHÂN HỆ TRỢ LÝ ẢO AI & LỘ TRÌNH HỌC THÍCH ỨNG (ADAPTIVE AI TUTOR)", 0),
        ("4.1. Trợ lý ảo Mascot tương tác và khảo sát mục tiêu học tập", 1),
        ("4.2. Chẩn đoán trình độ & phân cụm người học (Learner Archetyping)", 1),
        ("4.3. Các mô hình theo dõi tri thức (BKT, Deep DKT PyTorch, Skill Graph DAG)", 1),
        ("4.4. Sinh lộ trình học cá nhân hóa theo Vùng phát triển gần (ZPD)", 1),
        ("4.5. Cơ chế tự thẩm định chất lượng đa đặc vụ (Multi-Agent Loop)", 1),
        ("4.6. Không gian thực hành lộ trình riêng (Personalized Path Workspace)", 1),
        ("5. PHÂN HỆ SÂN CHƠI THUẬT TOÁN (PRACTICE ARENA)", 0),
        ("5.1. Sơ đồ Use Case tổng thể phân hệ Practice Arena", 1),
        ("5.2. Bảng đặc tả các ca sử dụng (Use Cases) cốt lõi", 1),
        ("5.3. Quy trình thực hiện bài tập thuật toán (4 bước tinh gọn)", 1),
        ("6. PHÂN HỆ HẠ TẦNG THỰC THI MÃ NGUỒN AN TOÀN (ISOLATED SANDBOX ENGINE)", 0),
        ("6.1. Trình chạy mã chuyên biệt cho từng ngôn ngữ lập trình", 1),
        ("6.2. Cơ chế điều phối kép thông minh (Docker Container vs Local Subprocess)", 1),
        ("7. PHÂN HỆ QUẢN TRỊ HỆ THỐNG TOÀN DIỆN (ADMIN MANAGEMENT PORTAL)", 0),
        ("7.1. Bảng điều khiển quản trị trung tâm & giám sát sức khỏe dịch vụ", 1),
        ("7.2. Quản lý người dùng, phân quyền & khóa tài khoản", 1),
        ("7.3. Quản lý khóa học & vòng đời xuất bản (Course Management)", 1),
        ("7.4. Trung tâm biên soạn giáo trình chuyên nghiệp (Lesson Studio Editor)", 1),
        ("7.5. Quản lý ngân hàng bài tập đấu trường thuật toán", 1),
        ("7.6. Quản lý & đối soát lịch sử bài nộp thực hành", 1),
        ("7.7. Báo cáo phân tích & đo lường chất lượng đào tạo (Advanced Analytics)", 1),
        ("7.8. Bể quản lý API Key AI xoay vòng thông minh (Dynamic AI Key Pool)", 1),
        ("8. PHÂN HỆ GIÁO TRÌNH & NỘI DUNG ĐÀO TẠO TÍCH HỢP (CURRICULUM SYSTEM)", 0),
        ("8.1. Khóa học Lập trình Python Căn bản & Nâng cao", 1),
        ("8.2. Khóa học Hệ quản trị Cơ sở dữ liệu SQL Chuyên sâu", 1),
        ("8.3. Khóa học Lập trình C++ Nền tảng (Cơ bản)", 1),
        ("8.4. Khóa học Lập trình C++ Chuyên sâu & Hệ thống (Nâng cao)", 1),
        ("8.5. Bộ quy chuẩn đồng nhất 100% của 48 bài học C++ chuẩn mực", 1),
        ("9. BẢNG TỔNG HỢP CÔNG NGHỆ KỸ THUẬT (TECHNOLOGY STACK MATRIX)", 0),
        ("10. KẾT LUẬN & ĐÁNH GIÁ ĐỀ TÀI", 0),
        ("10.1. Đánh giá tính khoa học & giá trị thực tiễn", 1),
        ("10.2. Tiềm năng ứng dụng & hướng phát triển tương lai", 1)
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
        else:
            p_t.paragraph_format.left_indent = Cm(0.7)
            r_t = p_t.add_run(title)
            r_t.font.name = "Times New Roman"
            r_t.font.size = Pt(11.5)
            r_t.font.bold = False

    doc.add_page_break()

    # ----------------------------------------------------
    # PHẦN 1
    # ----------------------------------------------------
    add_h1("1. TỔNG QUAN KIẾN TRÚC & MA TRẬN PHÂN HỆ")
    add_p("Hệ thống học lập trình thích ứng tích hợp Trợ lý ảo AI và Chấm code tự động (VIBECODE AI / CODEHUB) được xây dựng theo mô hình kiến trúc Feature-Based Microservices hiện đại. Mô hình này phân tách rành mạch giữa giao diện người dùng (Client SPA), tầng cổng giao tiếp ứng dụng (API Gateway), tầng trí tuệ nhân tạo (AI Intelligence Service) và tầng hạ tầng thực thi mã nguồn an toàn (Isolated Sandbox Engine).")

    add_h2("1.1. Kiến trúc phân tầng Feature-Based Microservices")
    add_p("Hệ thống bao gồm 4 tầng dịch vụ cốt lõi hoạt động nhịp nhàng qua giao thức RESTful API chuẩn hóa:")
    add_bullet("Tầng Giao diện Người dùng (Client Presentation Layer):", "Phát triển bằng React 19, TypeScript, Vite và Tailwind CSS. Tích hợp thư viện Monaco Editor để cung cấp môi trường viết code trực quan ngang tầm VS Code cho học viên và bộ công cụ Lesson Studio Editor cho giảng viên.", True)
    add_bullet("Tầng Cổng Giao tiếp & Nghiệp vụ (Core API Gateway):", "Phát triển trên nền tảng Node.js với Express 5 và TypeScript. Chịu trách nhiệm xác thực người dùng, định tuyến bảo mật, xử lý tiến độ học tập, quản lý khóa học và phân phối tác vụ đến Sandbox Engine và AI Service.", True)
    add_bullet("Tầng Dữ liệu Bền vững (Data Persistence Layer):", "Sử dụng cơ sở dữ liệu quan hệ PostgreSQL thông qua Prisma ORM 7.x, lưu trữ toàn vẹn dữ liệu người dùng, cấu trúc khóa học 4 tầng, lịch sử làm bài, bộ test cases, các phiên lộ trình cá nhân hóa và nhật ký hoạt động AI.", True)
    add_bullet("Tầng Trí tuệ Nhân tạo Thích ứng (AI Intelligence Microservice):", "Được xây dựng độc lập bằng Python 3.10+ và FastAPI. Đảm nhiệm việc theo dõi tri thức người học (Knowledge Tracing), quản lý đồ thị kỹ năng DAG 33 nodes, điều phối quy trình Multi-Agent và tự động sinh bài học theo Vùng phát triển gần (ZPD).", True)
    add_bullet("Tầng Thực thi Mã nguồn Cô lập (Isolated Sandbox Engine):", "Môi trường thực thi bảo mật hỗ trợ đa ngôn ngữ (Python, C/C++ G++17, SQLite in-memory, JavaScript), tự động phát hiện mã độc hại, áp dụng timeout nghiêm ngặt và đo đạc hiệu năng chi tiết.", True)

    add_h2("1.2. Ma trận phân quyền truy cập theo vai trò (RBAC)")
    add_p("Hệ thống áp dụng cơ chế kiểm soát truy cập dựa trên vai trò (Role-Based Access Control) với 4 nhóm người dùng chính, đảm bảo tính phân tách và an toàn dữ liệu tuyệt đối:")

    # Table RBAC
    add_p("Bảng 1.1: Ma trận phân quyền chức năng hệ thống theo vai trò người dùng", italic=True, space_after=3)
    rbac_table = doc.add_table(rows=11, cols=5)
    rbac_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    rbac_widths = [Cm(5.5), Cm(2.5), Cm(2.5), Cm(2.5), Cm(3.0)]
    
    rbac_headers = ["Nhóm Chức Năng", "Khách (Guest)", "Học Viên (Student)", "Giảng Viên (Teacher)", "Quản Trị (Admin)"]
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
        ("Xem Trang chủ & Danh mục khóa học", "Cho phép", "Cho phép", "Cho phép", "Cho phép"),
        ("Đăng ký tài khoản & Đăng nhập", "Cho phép", "Cho phép", "Cho phép", "Cho phép"),
        ("Học lý thuyết & Làm trắc nghiệm Quiz", "Không", "Cho phép", "Cho phép", "Cho phép"),
        ("Chạy thử nghiệm Code tự do", "Không", "Cho phép", "Cho phép", "Cho phép"),
        ("Nộp bài tập chấm điểm & Lưu lịch sử", "Không", "Cho phép", "Cho phép", "Cho phép"),
        ("Tương tác AI Mascot & Nhận lộ trình ZPD", "Không", "Cho phép", "Cho phép", "Cho phép"),
        ("Luyện tập đấu trường Practice Arena", "Không", "Cho phép", "Cho phép", "Cho phép"),
        ("Quản lý học viên & Xem chi tiết bài nộp", "Không", "Không", "Xem hạn chế", "Toàn quyền"),
        ("Soạn thảo giáo trình (Lesson Studio)", "Không", "Không", "Cho phép", "Toàn quyền"),
        ("Cấu hình Bể API Key AI & Giám sát hệ thống", "Không", "Không", "Không", "Toàn quyền")
    ]

    border_spec = dict(sz=4, val='single', color='CCCCCC', space='0')
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
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT if c_idx == 0 else WD_ALIGN_PARAGRAPH.CENTER
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(11)
            if val in ["Cho phép", "Toàn quyền"]:
                run.font.bold = True

    add_p() # spacing

    # ----------------------------------------------------
    # PHẦN 2
    # ----------------------------------------------------
    add_h1("2. PHÂN HỆ NGƯỜI DÙNG & HỌC VIÊN (LEARNER PORTAL)")
    add_p("Phân hệ người dùng đóng vai trò là cửa ngõ tương tác đầu tiên của học viên với nền tảng, cung cấp môi trường quản lý học tập thân thiện, trực quan và an toàn.")

    add_h2("2.1. Xác thực & bảo mật tài khoản người dùng")
    add_bullet("Đăng ký tài khoản (Register):", "Cho phép người dùng mới tạo tài khoản học tập với các thông tin: Họ tên, Tên đăng nhập (username), Email và Mật khẩu. Hệ thống kiểm tra trùng lặp email/username theo thời gian thực.", True)
    add_bullet("Bảo mật mật khẩu với Bcrypt:", "Toàn bộ mật khẩu của người dùng được mã hóa một chiều an toàn bằng thuật toán băm Bcrypt kết hợp muối ngẫu nhiên (Salt rounds = 10), đảm bảo không bao giờ lưu trữ mật khẩu gốc dưới dạng văn bản thô.", True)
    add_bullet("Đăng nhập & Cấp phát JWT (Authentication):", "Xác thực danh tính người dùng và cấp phát mã thông báo JSON Web Token (JWT) có thời hạn hiệu lực được ký bởi khóa bí mật an toàn trên máy chủ, cho phép duy trì phiên đăng nhập không trạng thái (stateless).", True)
    add_bullet("Cơ chế bảo vệ tuyến đường (Protected Routes):", "Bộ lọc Middleware tại cả Frontend (React Router Guards) và Backend (Express Auth Middleware) tự động kiểm tra tính hợp lệ của Token và phân quyền truy cập đúng vai trò trước khi xử lý yêu cầu.", True)
    add_bullet("Đăng xuất an toàn (Logout):", "Hủy bỏ token phiên làm việc, xóa sạch dữ liệu cache xác thực tại trình duyệt và chuyển hướng người dùng an toàn về trang đăng nhập.", True)

    add_h2("2.2. Hồ sơ năng lực cá nhân & thống kê học tập")
    add_bullet("Xem & chỉnh sửa hồ sơ:", "Học viên có thể xem thông tin cá nhân, cập nhật họ tên, ảnh đại diện (avatar), tiểu sử bản thân và mật khẩu mới.", True)
    add_bullet("Bảng phân tích năng lực giải bài:", "Tổng hợp tự động tổng số bài nộp, số lượng bài tập hoàn thành (Accepted), tỷ lệ giải đúng (Acceptance Rate) và phân bổ số bài đã vượt qua theo từng ngôn ngữ lập trình.", True)
    add_bullet("Nhật ký nộp bài chi tiết (Submission History):", "Bảng thống kê toàn diện lịch sử các lần nộp bài của học viên, ghi nhận chính xác: Tên bài học, ngôn ngữ thực thi, trạng thái chấm điểm (Accepted / Wrong Answer / Compile Error), thời gian chạy (ms) và mốc thời gian nộp.", True)

    add_h2("2.3. Bảng điều khiển học viên (Learner Dashboard)")
    add_bullet("Thẻ tóm tắt tiến độ học tập:", "Hiển thị trực quan số khóa học đang tham gia, số bài học đã vượt qua, số bài tập đã nộp và tỷ lệ phần trăm hoàn thành chương trình.", True)
    add_bullet("Chuỗi ngày học liên tục (Learning Streak):", "Cơ chế Gamification theo dõi số ngày liên tục học viên có hoạt động học lý thuyết hoặc nộp code, tạo động lực duy trì thói quen học tập hàng ngày.", True)
    add_bullet("Nút tắt học tiếp thông minh (Resume Learning):", "Thuật toán tự động xác định bài học chưa hoàn thành gần nhất của học viên và hiển thị nút tắt 1-chạm giúp người học quay lại ngay mạch học tập mà không cần tìm kiếm thủ công.", True)

    add_h2("2.4. Khám phá & ghi danh khóa học (Course Catalog & Enrollment)")
    add_bullet("Danh mục khóa học đa dạng:", "Giao diện hiển thị các khóa học (Python, SQL, C++ Cơ bản, C++ Nâng cao) kèm theo ảnh bìa nhận diện, nhãn cấp độ (Beginner, Intermediate, Advanced) và tổng số lượng bài học.", True)
    add_bullet("Trang chi tiết & Đề cương khóa học 4 cấp:", "Hiển thị lộ trình đào tạo phân cấp khoa học: Khóa học -> Module -> Chương -> Bài học. Cho phép học viên xem trước mục tiêu đào tạo, thời lượng dự kiến và nội dung tổng quan.", True)
    add_bullet("Cơ chế học thử bài học miễn phí:", "Các bài học được cấu hình cờ `isFree = true` cho phép người dùng trải nghiệm học lý thuyết và viết code thực tế trước khi đăng ký chính thức.", True)
    add_bullet("Ghi danh khóa học (Enrollment):", "Học viên chỉ cần bấm nút tham gia, hệ thống sẽ tự động khởi tạo bản ghi Enrollment và sinh cây tiến độ học tập `LessonProgress` tương ứng trong cơ sở dữ liệu.", True)

    # ----------------------------------------------------
    # PHẦN 3
    # ----------------------------------------------------
    add_h1("3. PHÂN HỆ KHÔNG GIAN HỌC TẬP & CHẤM CODE TRỰC TUYẾN (CODE STUDIO & SANDBOX)")
    add_p("Đây là không gian trung tâm của nền tảng, nơi học viên tiếp thu lý thuyết, làm trắc nghiệm kiểm tra và viết mã thực hành. Giao diện được thiết kế theo dạng Chia đôi màn hình (Split-Screen Workspace) tối ưu cho việc vừa đọc bài giảng vừa lập trình.")

    add_h2("3.1. Trình học lý thuyết sư phạm chuẩn 5 phần")
    add_p("Toàn bộ nội dung lý thuyết trên hệ thống được chuẩn hóa theo quy chuẩn sư phạm 5 phần chặt chẽ, loại bỏ văn phong hàn lâm khô khan và các đoạn code quá dài gây quá tải nhận thức:")
    add_bullet("Phần 1 - Khái niệm & Đặt vấn đề:", "Giải thích nguồn gốc bài toán bằng ngôn từ gần gũi, nêu rõ lý do tại sao cần dùng cú pháp/cấu trúc dữ liệu này trong thực tế.", True)
    add_bullet("Phần 2 - Cú pháp & Quy chuẩn chuẩn hóa:", "Trình bày bảng cú pháp rõ ràng, loại bỏ ký hiệu công thức toán LaTeX phức tạp gây khó tiếp cận.", True)
    add_bullet("Phần 3 - Minh họa trực quan & Cơ chế hoạt động:", "Sử dụng bảng so sánh trực quan, sơ đồ phân bổ bộ nhớ (Stack vs Heap) và luồng điều khiển dữ liệu.", True)
    add_bullet("Phần 4 - Ví dụ ngắn gọn nhất:", "Các đoạn code mẫu ngắn chỉ từ 3 đến 8 dòng tập trung đúng trọng tâm cú pháp, tích hợp nút 'Copy Code' một chạm tiện lợi.", True)
    add_bullet("Phần 5 - Bẫy thường gặp & Ghi nhớ:", "Cảnh báo trước các lỗi sai kinh điển (như trôi lệnh cin, chia số nguyên, tràn số nguyên 32-bit, rò rỉ con trỏ) giúp học sinh tránh sai sót ngay từ đầu.", True)

    add_h2("3.2. Hệ thống câu hỏi trắc nghiệm tương tác tức thời")
    add_bullet("Kiểm tra nhanh sau lý thuyết:", "Mỗi bài học tích hợp câu hỏi trắc nghiệm khách quan đánh giá ngay mức độ hiểu bài của học viên trước khi bắt tay vào viết code.", True)
    add_bullet("Phản hồi trực quan tức thì:", "Hệ thống đổi màu đáp án ngay khi học viên chọn (Màu xanh: Chính xác, Màu đỏ: Chưa chính xác).", True)
    add_bullet("Giải thích sư phạm chuyên sâu:", "Hiển thị đoạn văn phân tích lý do tại sao đáp án đó là đúng và tại sao các phương án khác bị loại, củng cố tri thức nền tảng.", True)

    add_h2("3.3. Trình soạn thảo mã nguồn chuyên nghiệp Monaco Studio")
    add_bullet("Nhúng bộ soạn thảo Monaco Editor:", "Sử dụng cùng nền tảng công nghệ với Microsoft Visual Studio Code, mang lại cảm giác lập trình chuyên nghiệp.", True)
    add_bullet("Tính năng biên tập cao cấp:", "Tô màu cú pháp (Syntax Highlighting) cho C++, Python, SQL; Tự động thụt lề chuẩn; Tự động đóng mở ngoặc nhọn/tròn; Hiển thị số dòng; Bản đồ cuộn mã nguồn (Minimap).", True)
    add_bullet("Mã khởi đầu thông minh (Starter Code):", "Tự động nạp sẵn khung chương trình chuẩn kèm chú thích hướng dẫn cho từng bài tập lập trình.", True)
    add_bullet("Chế độ Giao diện Sáng/Tối (Light/Dark Mode):", "Tùy biến theme editor (VS-Dark / VS-Light) đồng bộ với giao diện toàn trang, bảo vệ thị lực học viên khi học đêm.", True)
    add_bullet("Nút khôi phục mã nguồn (Reset Code):", "Giúp học viên nhanh chóng xóa bỏ các sửa đổi lỗi và đưa mã nguồn về lại trạng thái ban đầu của đề bài.", True)

    add_h2("3.4. Trình chấm điểm & kiểm thử tự động đa trường hợp")
    add_bullet("Chế độ chạy thử tự do (Run Code):", "Cho phép học viên biên dịch và chạy thử code với dữ liệu nhập tùy biến để kiểm tra kết quả in ra màn hình (`stdout`) và xem lỗi biên dịch (`stderr`) mà không bị ghi nhận kết quả thất bại.", True)
    add_bullet("Chế độ nộp bài chấm điểm (Submit Code):", "Tự động gửi mã nguồn đến Sandbox, chạy kiểm thử tuần tự qua toàn bộ các Test Cases đã được thiết lập sẵn.", True)
    add_bullet("Phân tách Test Case công khai & Test Case ẩn:", "Học viên được xem chi tiết Đầu vào, Đầu ra thực tế và Đầu ra mong đợi của testcase công khai để gỡ lỗi; trong khi testcase bí mật được ẩn thông tin nhằm chống gian lận nộp code in sẵn kết quả (Hardcoded output).", True)
    add_bullet("Chuẩn hóa so khớp đầu ra thông minh:", "Hệ thống tự động xử lý chuẩn hóa khoảng trắng thừa ở đầu/cuối dòng và đồng nhất ký tự ngắt dòng (`\\r\\n` và `\\n`), đảm bảo chấm điểm công bằng, tránh đánh trượt oan học viên vì lỗi xuống dòng.", True)

    add_h2("3.5. Cơ chế kiểm tra ràng buộc cú pháp động (Dynamic Code Constraints)")
    add_p("Đây là một trong những tính năng độc quyền và sáng tạo nhất của đề tài, đảm bảo học viên thực sự rèn luyện tư duy thuật toán theo đúng yêu cầu sư phạm của bài học:")
    add_bullet("Bắt buộc sử dụng từ khóa (`requiredKeywords`):", "Yêu cầu bài giải bắt buộc phải chứa các cấu trúc chỉ định (ví dụ: `while`, `for`, `switch`, `case`, `long long`, `vector`, `const`). Nếu học viên dùng cấu trúc khác không đúng mục tiêu bài học, bài nộp sẽ bị từ chối kèm lời nhắc nhở.", True)
    add_bullet("Cấm sử dụng hàm/từ khóa làm sẵn (`forbiddenKeywords`):", "Ngăn chặn việc dùng hàm thư viện viết sẵn thay vì tự cài đặt thuật toán (ví dụ: cấm dùng `std::sort` khi học Bubble Sort; cấm `std::gcd` khi học thuật toán Euclid; cấm `pow` khi học vòng lặp lũy thừa).", True)
    add_bullet("Bắt buộc viết chú thích mã nguồn (`requireComment`):", "Đòi hỏi bài nộp phải có ít nhất một dòng ghi chú (`//` hoặc `/*` cho C++, `#` cho Python) nhằm rèn luyện tác phong viết code sạch và có giải thích.", True)
    add_bullet("Thuật toán bóc tách comment thông minh:", "Bộ tiền xử lý tự động loại bỏ toàn bộ phần chú thích trước khi quét từ khóa cấm, đảm bảo nếu học viên chỉ nhắc đến từ khóa trong phần comment thì không bị tính là vi phạm.", True)
    add_bullet("Thông điệp sư phạm tùy chỉnh (`customErrorMessage`):", "Hiển thị câu thông báo ân cần, giải thích rõ lỗi vi phạm và hướng dẫn cách khắc phục thay vì báo lỗi kỹ thuật khó hiểu.", True)

    add_h2("3.6. Đánh giá hiệu năng thời gian thực thi (Runtime Beats Distribution)")
    add_bullet("Đo đạc chính xác thời gian thực thi (Runtime ms):", "Ghi nhận thời gian chạy của mã nguồn chính xác đến từng mili-giây trên môi trường Sandbox.", True)
    add_bullet("Biểu đồ so sánh phần trăm cộng đồng:", "Tính toán và thông báo tỷ lệ học viên chạy nhanh hơn cộng đồng (Ví dụ: 'Mã nguồn của bạn chạy nhanh hơn 85.4% các bài nộp khác'), kích thích học viên tìm tòi giải pháp tối ưu hóa độ phức tạp thuật toán.", True)

    # ----------------------------------------------------
    # PHẦN 4
    # ----------------------------------------------------
    add_h1("4. PHÂN HỆ TRỢ LÝ ẢO AI & LỘ TRÌNH HỌC THÍCH ỨNG (ADAPTIVE AI TUTOR)")
    add_p("Phân hệ AI Thích ứng là 'trái tim thông minh' của hệ thống, được vận hành bởi một Microservice độc lập viết bằng Python FastAPI và PyTorch, triển khai kỹ thuật Học Thích Ứng (Adaptive Learning) tiên tiến nhằm cá nhân hóa việc học cho từng cá nhân.")

    add_h2("4.1. Trợ lý ảo Mascot tương tác và khảo sát mục tiêu học tập")
    add_bullet("Mascot gia sư thông minh 24/7:", "Nhân vật hoạt họa trợ lý ảo thân thiện xuất hiện tại góc màn hình, sẵn sàng hỗ trợ giải đáp thắc mắc của học viên bất kỳ lúc nào.", True)
    add_bullet("Khảo sát mục tiêu cá nhân (Goal Onboarding):", "Khi học viên mới bắt đầu, AI tiến hành đối thoại ngắn để tìm hiểu mục tiêu (Học nhập môn, Luyện thi học sinh giỏi, Chuẩn bị phỏng vấn, Nâng cao tư duy) để làm căn cứ cá nhân hóa lộ trình.", True)
    add_bullet("Đối thoại sư phạm gợi mở:", "Áp dụng phương pháp Socratic (hỏi đáp gợi mở), hướng dẫn học viên tự phát hiện lỗi sai trong code thay vì đưa ngay đáp án giải sẵn.", True)

    add_h2("4.2. Chẩn đoán trình độ & phân cụm người học (Learner Archetyping)")
    add_p("Hệ thống ứng dụng thuật toán phân cụm hành vi học tập để chia học viên thành 4 nhóm đặc trưng (Archetypes):")
    add_bullet("Nhóm Người Tối Ưu (The Optimizer):", "Học viên viết code cẩn thận, chú trọng cấu trúc sạch và thời gian thực thi tối ưu. AI sẽ đề xuất các bài toán có yêu cầu khắt khe hơn về giới hạn thời gian/bộ nhớ.", True)
    add_bullet("Nhóm Người Kiên Trì (The Persister):", "Học viên sẵn sàng thử sai nhiều lần cho đến khi đạt kết quả. AI sẽ cung cấp các gợi ý từng bước (hint) giúp tiết kiệm thời gian gỡ rối.", True)
    add_bullet("Nhóm Người Nhanh Vội (The Rusher):", "Học viên viết code rất nhanh nhưng hay bỏ sót các trường hợp biên hoặc lỗi cú pháp cơ bản. AI sẽ tăng cường các câu hỏi trắc nghiệm bẫy để rèn tính cẩn trọng.", True)
    add_bullet("Nhóm Người Gặp Khó (The Stuck):", "Học viên dừng lại quá lâu ở một bài toán mà không có tiến triển. AI chủ động đưa ra lời động viên và hạ nhỏ độ khó bài tập để giúp học viên vượt qua điểm nghẽn nhận thức.", True)

    add_h2("4.3. Các mô hình theo dõi tri thức (BKT, Deep DKT PyTorch, Skill Graph DAG)")
    add_bullet("Bayesian Knowledge Tracing (BKT):", "Mô hình xác suất cập nhật trạng thái làm chủ từng kỹ năng của học viên dựa trên chuỗi kết quả làm bài đúng/sai, cân nhắc các tham số đoán mò (Guess) và sơ suất (Slip).", True)
    add_bullet("Deep Knowledge Tracing (DKT - Mạng PyTorch LSTM):", "Mô hình mạng nơ-ron hồi quy sâu phân tích toàn bộ chuỗi hành vi học tập theo thời gian, dự đoán chính xác xác suất học viên sẽ giải đúng dạng bài tiếp theo.", True)
    add_bullet("Đồ thị Tri Thức Kỹ Năng (Skill Graph DAG 33 Nodes):", "Biểu diễn đồ thị có hướng không chu trình thể hiện mối quan hệ tiên quyết giữa 33 kỹ năng lập trình trọng tâm. Giúp AI truy vết chính xác nguồn gốc lỗ hổng kiến thức khi học viên làm sai một bài toán phức hợp.", True)

    add_h2("4.4. Sinh lộ trình học cá nhân hóa theo Vùng phát triển gần (ZPD)")
    add_bullet("Học thuyết Vùng phát triển gần (Zone of Proximal Development):", "Đảm bảo bài tập luôn nằm ở ranh giới giữa những gì học viên đã thuần thục và những gì chuẩn bị tiếp thu, ngăn chặn triệt để tâm lý chán nản (khi bài quá dễ) hoặc bỏ cuộc (khi bài quá khó).", True)
    add_bullet("Tự động sinh trọn gói nội dung học tập:", "AI tự động sinh bài đọc lý thuyết ngắn giải thích đúng phần học viên bị hổng, 2 câu trắc nghiệm củng cố và 1 bài tập lập trình kèm theo bộ testcase kiểm thử hoàn chỉnh.", True)

    add_h2("4.5. Cơ chế tự thẩm định chất lượng đa đặc vụ (Multi-Agent Loop)")
    add_p("Hệ thống giải quyết triệt để vấn đề 'ảo giác' (hallucination) của AI thông qua chu trình kiểm duyệt khép kín giữa 4 đặc vụ chuyên trách:")
    add_bullet("RouterAgent:", "Tiếp nhận câu hỏi, phân loại ý định người dùng và phân tích cảm xúc.", True)
    add_bullet("KnowledgeRetriever:", "Tra cứu trạng thái tri thức của học viên trên Đồ thị kỹ năng DAG và mô hình BKT/DKT.", True)
    add_bullet("ExerciseGeneratorAgent:", "Sinh đề bài, mã khởi đầu, lời giải mẫu và danh sách test cases.", True)
    add_bullet("CriticEvaluatorAgent (Vòng kiểm duyệt sống còn):", "Tự động lấy mã giải mẫu do Generator sinh ra, đưa vào Sandbox thực thi trực tiếp qua toàn bộ Test Cases. Nếu code mẫu bị lỗi hoặc sai testcase, Critic sẽ từ chối và yêu cầu Generator sinh lại. Đảm bảo 100% bài tập giao cho học viên không bao giờ bị lỗi ảo!", True)

    add_h2("4.6. Không gian thực hành lộ trình riêng (Personalized Path Workspace)")
    add_bullet("Trang thực hành riêng biệt (`/personalized-path/:pathId`):", "Học viên có không gian học tập độc lập dành riêng cho các bài học do AI thiết kế cá nhân hóa.", True)
    add_bullet("Cây tiến độ kỹ năng cá nhân:", "Hiển thị trực quan các nút kỹ năng đã được củng cố và các nấc thang tiếp theo cần chinh phục.", True)

    # ----------------------------------------------------
    # PHẦN 5
    # ----------------------------------------------------
    add_h1("5. PHÂN HỆ SÂN CHƠI THUẬT TOÁN (PRACTICE ARENA)")
    add_p("Phân hệ Practice Arena là không gian rèn luyện giải thuật chuyên sâu được xây dựng theo chuẩn quốc tế (tương tự LeetCode, HackerRank). Phân hệ tập trung tối đa vào việc phát triển tư duy thuật toán, giúp học viên ôn luyện cho các kỳ thi lập trình và chuẩn bị các vòng phỏng vấn kỹ thuật.")

    add_h2("5.1. Sơ đồ Use Case tổng thể phân hệ Practice Arena")
    add_p("Sơ đồ Use Case dưới đây mô tả tương tác giữa 3 tác nhân chính: Học viên (Student - Tác nhân chính), Hệ thống Chấm (Sandbox Judge - Tác nhân thực thi) và Quản trị viên/Giảng viên (Admin/Teacher - Tác nhân quản trị).")

    # Add Image
    img_path = r"d:\Project\LearnPython\docs\features\usecase_practice_arena.png"
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(4)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Cm(15.5))
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(8)
        r_cap = p_cap.add_run("Hình 5.1: Sơ đồ Use Case phân hệ Sân chơi Thuật toán (Practice Arena)")
        r_cap.font.name = "Times New Roman"
        r_cap.font.size = Pt(11)
        r_cap.font.italic = True

    add_h2("5.2. Bảng đặc tả các ca sử dụng (Use Cases) cốt lõi")
    add_p("Bảng 5.1: Danh mục đặc tả các Use Case cốt lõi trong phân hệ Practice Arena", italic=True, space_after=3)
    
    uc_table = doc.add_table(rows=9, cols=4)
    uc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    uc_widths = [Cm(2.0), Cm(4.0), Cm(3.5), Cm(6.5)]
    
    uc_headers = ["Mã UC", "Tên Use Case", "Tác Nhân Chính", "Mô Tả Chức Năng"]
    hdr_uc = uc_table.rows[0]
    for idx, name in enumerate(uc_headers):
        cell = hdr_uc.cells[idx]
        cell.width = uc_widths[idx]
        set_cell_background(cell, "EAEAEA")
        set_cell_margins(cell, 100, 100, 100, 100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(name)
        run.font.name = "Times New Roman"
        run.font.size = Pt(11)
        run.font.bold = True

    uc_data = [
        ("UC01", "Tìm kiếm & Lọc bài tập", "Học viên, Admin", "Tra cứu bài toán nhanh theo độ khó (Easy, Medium, Hard), thẻ thuật toán (Array, DP...) và trạng thái làm bài (Todo, Attempted, Solved)."),
        ("UC02", "Xem chi tiết bài toán", "Học viên", "Xem mô tả đề bài, định dạng I/O, ràng buộc kích thước dữ liệu, ví dụ mẫu kèm giải thích, giới hạn thời gian (1.0 - 2.0s) và bộ nhớ (128 - 256MB)."),
        ("UC03", "Soạn thảo giải thuật", "Học viên", "Lập trình giải bài trên Monaco Editor tích hợp, hỗ trợ đa ngôn ngữ (Python, C++, SQL, JavaScript) với IntelliSense và phím tắt chuẩn VS Code."),
        ("UC04", "Chạy thử Custom Test", "Học viên", "Tự do nhập dữ liệu kiểm thử biên cá nhân để chạy thử nghiệm và kiểm tra kết quả in ra trước khi nộp chính thức."),
        ("UC05", "Nộp bài chấm điểm", "Học viên, Sandbox", "Gửi mã nguồn lên hệ thống để kích hoạt tiến trình chấm tự động qua toàn bộ bộ test case (gồm cả test case công khai và test case ẩn)."),
        ("UC06", "Xem phân tích kết quả", "Học viên", "Nhận kết quả Accepted hoặc lỗi chi tiết (Wrong Answer, TLE, MLE, Compile Error), hiển thị thời gian chạy và tỷ lệ chạy nhanh hơn cộng đồng (Beats %)."),
        ("UC07", "Thực thi mã cô lập", "Sandbox Judge", "Biên dịch và chạy mã nguồn trong môi trường Sandbox cô lập (Docker/Subprocess), giám sát nghiêm ngặt tài nguyên và giới hạn timeout."),
        ("UC08", "Quản trị ngân hàng bài", "Admin / Giảng viên", "Tạo mới, chỉnh sửa, xóa bài tập, gắn thẻ phân loại, quản lý bộ testcases ẩn/hiện thông qua phân hệ Admin Portal.")
    ]

    for r_idx, row_data in enumerate(uc_data):
        row = uc_table.rows[r_idx + 1]
        bg_color = "FDFDFD" if r_idx % 2 == 0 else "F7F7F7"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.width = uc_widths[c_idx]
            set_cell_background(cell, bg_color)
            set_cell_border(cell, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [0, 2] else WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(10.5)
            if c_idx == 0:
                run.font.bold = True

    add_p() # spacing

    add_h2("5.3. Quy trình thực hiện bài tập thuật toán (4 bước tinh gọn)")
    add_p("Quy trình giải bài tập trên Practice Arena được tinh gọn hóa theo 4 bước trực quan:")
    add_bullet("Bước 1 - Lựa chọn bài tập:", "Học viên lọc và chọn bài toán phù hợp với trình độ hoặc chủ đề muốn rèn luyện (ví dụ: Quy hoạch động mức Medium).", True)
    add_bullet("Bước 2 - Phân tích & Lập trình:", "Nghiên cứu kỹ giới hạn thời gian/bộ nhớ, chọn ngôn ngữ sở trường và viết mã giải thuật trên Monaco Editor.", True)
    add_bullet("Bước 3 - Kiểm chứng với Custom Testcase:", "Nhập các trường hợp đặc biệt (mảng rỗng, giá trị biên cực đại/cực tiểu) để kiểm tra tính ổn định của giải thuật.", True)
    add_bullet("Bước 4 - Nộp bài & Nhận đánh giá:", "Hệ thống tự động chấm điểm toàn diện, hiển thị kết quả chi tiết từng testcase và vị trí xếp hạng hiệu năng thực thi của thuật toán.", True)

    # ----------------------------------------------------
    # PHẦN 6
    # ----------------------------------------------------
    add_h1("6. PHÂN HỆ HẠ TẦNG THỰC THI MÃ NGUỒN AN TOÀN (ISOLATED SANDBOX ENGINE)")
    add_p("Hạ tầng Sandbox chịu trách nhiệm biên dịch và thực thi mã nguồn do người dùng nộp lên một cách an toàn, bảo vệ máy chủ khỏi nguy cơ tấn công chiếm quyền hoặc cạn kiệt tài nguyên.")

    add_h2("6.1. Trình chạy mã chuyên biệt cho từng ngôn ngữ lập trình")
    add_bullet("Python Runner (`python.runner.ts`):", "Thực thi mã Python trong môi trường cô lập, áp dụng timeout chặt chẽ, thu thập chính xác `stdout` và bắt trọn vẹn lỗi Traceback.", True)
    add_bullet("C/C++ Runner (`cpp.runner.ts`):", "Tích hợp trình biên dịch `g++` hỗ trợ chuẩn hiện đại C++17. Quy trình tách biệt thành 2 pha rõ ràng: Pha Biên dịch (Compile Phase) phát hiện lỗi cú pháp và Pha Thực thi (Execution Phase) phát hiện lỗi Runtime/Segmentation Fault. Hỗ trợ truyền dữ liệu vào qua chuẩn `stdin`.", True)
    add_bullet("SQL Runner (`sql.runner.ts` & `sql.runner.py`):", "Khởi tạo cơ sở dữ liệu SQLite in-memory độc lập cho từng phiên chạy, tự động nạp schema bảng mẫu và dữ liệu giả lập, thực thi truy vấn `SELECT` và trả về bảng kết quả dạng JSON để đối chiếu chính xác với đáp án.", True)
    add_bullet("JavaScript Runner (`js.runner.ts`):", "Thực thi mã nguồn JavaScript trên môi trường Node.js cách ly.", True)

    add_h2("6.2. Cơ chế điều phối kép thông minh (Docker Container vs Local Subprocess)")
    add_bullet("Chế độ Docker Container (Môi trường Triển khai Production):", "Chạy mã nguồn trong Container Docker siêu nhẹ (Alpine Linux). Container bị ngắt hoàn toàn kết nối mạng bên ngoài (`--network none`), giới hạn CPU tối đa 50% (`--cpus=0.5`), giới hạn RAM 128MB (`--memory=128m`) và tự động hủy bỏ ngay sau khi thực thi.", True)
    add_bullet("Chế độ Subprocess Cục bộ (Môi trường Phát triển & Dự phòng):", "Tự động kích hoạt cơ chế thực thi tiến trình con (Local Subprocess) có timeout an toàn khi máy chủ không cài sẵn Docker Daemon, đảm bảo hệ thống luôn luôn hoạt động liên tục không gián đoạn.", True)

    # ----------------------------------------------------
    # PHẦN 7
    # ----------------------------------------------------
    add_h1("7. PHÂN HỆ QUẢN TRỊ HỆ THỐNG TOÀN DIỆN (ADMIN MANAGEMENT PORTAL)")
    add_p("Phân hệ quản trị cung cấp bộ công cụ mạnh mẽ dành cho Quản trị viên (Admin) và Giảng viên (Teacher) tại đường dẫn chuyên biệt `/admin`, giúp vận hành, giám sát và phát triển nội dung đào tạo một cách chuyên nghiệp.")

    add_h2("7.1. Bảng điều khiển quản trị trung tâm & giám sát sức khỏe dịch vụ")
    add_bullet("Thẻ chỉ số KPI thời gian thực:", "Thống kê tổng số học viên đăng ký, số khóa học, số bài học đang hoạt động, tổng số lượt nộp bài và tỷ lệ nộp bài thành công trên toàn hệ thống.", True)
    add_bullet("Giám sát trạng thái hoạt động (Service Health-Check):", "Kiểm tra và hiển thị tình trạng kết nối thời gian thực của Cổng API Backend, Dịch vụ AI Service và Cơ sở dữ liệu PostgreSQL.", True)
    add_bullet("Dòng nhật ký hoạt động gần nhất:", "Cập nhật liên tục các tài khoản vừa đăng ký và các bài tập vừa được nộp.", True)

    add_h2("7.2. Quản lý người dùng, phân quyền & khóa tài khoản")
    add_bullet("Danh sách người dùng phân trang:", "Hiển thị đầy đủ thông tin tài khoản: Họ tên, Email, Tên đăng nhập, Vai trò hiện tại, Ngày tạo.", True)
    add_bullet("Xem chi tiết học viên (User Detail):", "Tra cứu lịch sử học tập cụ thể, danh sách khóa học đang tham gia và toàn bộ các bài code đã nộp của từng cá nhân.", True)
    add_bullet("Phân quyền vai trò người dùng:", "Cho phép Quản trị viên thăng cấp tài khoản lên `TEACHER`/`ADMIN` hoặc chuyển về `STUDENT`.", True)
    add_bullet("Khóa & mở khóa tài khoản:", "Vô hiệu hóa quyền truy cập đối với các tài khoản vi phạm nội quy học tập.", True)

    add_h2("7.3. Quản lý khóa học & vòng đời xuất bản (Course Management)")
    add_bullet("Khởi tạo & chỉnh sửa khóa học:", "Nhập tiêu đề, mô tả tóm tắt, ảnh bìa khóa học, cấp độ đào tạo.", True)
    add_bullet("Vòng đời xuất bản khóa học:", "Hỗ trợ chuyển đổi trạng thái giữa Bản nháp (DRAFT - chỉ giáo viên nhìn thấy) và Đã xuất bản (PUBLISHED - mở cho học viên đăng ký).", True)
    add_bullet("Xóa liên hoàn an toàn (Cascade Delete):", "Tự động dọn dẹp các module, chương, bài học và bài nộp liên quan khi xóa khóa học.", True)

    add_h2("7.4. Trung tâm biên soạn giáo trình chuyên nghiệp (Lesson Studio Editor)")
    add_p("Đây là tính năng nổi bật dành riêng cho công tác sư phạm số của giảng viên:")
    add_bullet("Quản lý Cây Đề cương Đa Tầng:", "Thêm mới, sửa tên, sắp xếp thứ tự các Module (`CPP-MOD-01`, `CPP-MOD-02`...), Chương và Bài học.", True)
    add_bullet("Trình soạn thảo Markdown Live Preview:", "Soạn thảo bài giảng lý thuyết bằng cú pháp Markdown với cửa sổ xem trước giao diện thời gian thực.", True)
    add_bullet("Thanh công cụ chèn nhanh (Quick Insert Toolbar):", "Chèn bảng dữ liệu mẫu, khối code C++/Python/SQL, nhãn tên bảng/cột và khung ghi chú nổi bật chỉ với một cú nhấp chuột.", True)
    add_bullet("Giao diện Quản lý Ràng buộc Cú pháp (Code Constraints GUI):", "Cung cấp bảng điều khiển trực quan để giáo viên thiết lập: Checkbox bắt buộc viết chú thích (`requireComment`), Nhập danh sách từ khóa bắt buộc (`requiredKeywords`), Nhập danh sách từ khóa cấm (`forbiddenKeywords`) và Nhập thông báo lỗi sư phạm (`customErrorMessage`). Hệ thống tự động mã hóa thành thẻ metadata chuẩn.", True)
    add_bullet("Quản trị Bài tập & Bộ Test Cases:", "Nhập tiêu đề bài tập, độ khó, mã khởi đầu (starterCode), mã giải mẫu (solutionCode), thêm/xóa/sửa danh sách test case và gắn cờ ẩn (`isHidden`).", True)
    add_bullet("Trình soạn thảo trắc nghiệm (Quiz Builder):", "Nhập câu hỏi, 4 phương án trả lời, chọn đáp án đúng và viết lời giải thích sư phạm chi tiết.", True)

    add_h2("7.5. Quản lý ngân hàng bài tập đấu trường thuật toán")
    add_bullet("Thêm & biên tập bài toán Arena:", "Soạn thảo đề bài, thiết lập slug URL thân thiện SEO, gắn thẻ danh mục và gán cấp độ khó.", True)
    add_bullet("Cấu hình giới hạn tài nguyên:", "Thiết lập giới hạn thời gian chạy (Time Limit) và dung lượng bộ nhớ (Memory Limit) cho từng bài toán.", True)

    add_h2("7.6. Quản lý & đối soát lịch sử bài nộp thực hành")
    add_bullet("Nhật ký bài nộp toàn hệ thống:", "Bảng tra cứu toàn bộ lượt nộp bài của mọi học viên với bộ lọc linh hoạt theo ngôn ngữ, trạng thái đúng/sai và tên học viên.", True)
    add_bullet("Xem mã nguồn & kết quả chi tiết:", "Giảng viên có thể xem trực tiếp mã nguồn học viên đã viết, thời gian chạy thực tế và lỗi biên dịch chi tiết để kịp thời hỗ trợ.", True)

    add_h2("7.7. Báo cáo phân tích & đo lường chất lượng đào tạo (Advanced Analytics)")
    add_bullet("Biểu đồ xu hướng học tập:", "Theo dõi khối lượng học tập và số lượt nộp bài theo từng ngày trong tuần/tháng.", True)
    add_bullet("Cơ cấu ngôn ngữ lập trình:", "Phân tích tỷ lệ học viên lựa chọn học Python, C++, SQL và JavaScript.", True)
    add_bullet("Phân tích tỷ lệ vượt qua (Pass Rate Analysis):", "Nhận diện tự động các bài học/bài tập có tỷ lệ trượt cao bất thường để giảng viên kịp thời bổ sung nội dung giảng giải hoặc điều chỉnh độ khó đề bài.", True)

    add_h2("7.8. Bể quản lý API Key AI xoay vòng thông minh (Dynamic AI Key Pool)")
    add_p("Hệ thống giải quyết bài toán chi phí và giới hạn hạn mức (Rate Limits) của các nhà cung cấp AI thông qua phân hệ quản lý Key động:")
    add_bullet("Hỗ trợ đa nhà cung cấp AI:", "Quản lý tập trung API Key của Google Gemini (Gemini 2.5 Flash, 3.5 Flash), OpenRouter (Llama 3.3, DeepSeek V3), Groq và OpenAI.", True)
    add_bullet("Kiểm tra kết nối tức thời (Test Connection):", "Nút bấm kiểm tra xem Key có còn hạn mức và phản hồi tốt hay không ngay trên giao diện quản trị.", True)
    add_bullet("Cơ chế xoay vòng tự động (Dynamic Round-Robin & Fallback):", "AI Service tự động đồng bộ danh sách Key từ database, luân chuyển Key cho từng truy vấn. Khi một Key chạm ngưỡng Rate Limit hoặc phát sinh lỗi, hệ thống tự động tăng `errorCount`, hạ mức ưu tiên và chuyển ngay sang Key dự phòng mà không làm gián đoạn trải nghiệm học viên.", True)
    add_bullet("Nhật ký cuộc gọi AI chi tiết (`AICallLog`):", "Lưu vết toàn bộ các lượt gọi AI gồm: Nhà cung cấp, Model sử dụng, Key đã dùng (được che bảo mật), Trạng thái (Success/Failed), Mã HTTP, Độ trễ mili-giây, Mẫu câu hỏi và Mẫu câu trả lời phục vụ kiểm toán hệ thống.", True)

    # ----------------------------------------------------
    # PHẦN 8
    # ----------------------------------------------------
    add_h1("8. PHÂN HỆ GIÁO TRÌNH & NỘI DUNG ĐÀO TẠO TÍCH HỢP (CURRICULUM SYSTEM)")
    add_p("Hệ thống hiện đã nạp sẵn và hoàn thiện trọn vẹn 4 chương trình đào tạo tiêu chuẩn, bao quát từ nhập môn cơ bản đến lập trình hệ thống nâng cao:")

    add_h2("8.1. Khóa học Lập trình Python Căn bản & Nâng cao")
    add_bullet("Quy mô đào tạo:", "Bao gồm 8 Modules lớn với hơn 40 bài học bài bản.", True)
    add_bullet("Nội dung cốt lõi:", "Biến, kiểu dữ liệu, cấu trúc rẽ nhánh If-Elif-Else, vòng lặp For/While, cấu trúc dữ liệu List/Tuple/Dictionary/Set, Xử lý chuỗi nâng cao, Hàm và Phạm vi biến, Xử lý tệp tin (File I/O) và Lập trình hướng đối tượng (OOP).", True)

    add_h2("8.2. Khóa học Hệ quản trị Cơ sở dữ liệu SQL Chuyên sâu")
    add_bullet("Quy mô đào tạo:", "Chương trình chuyên đề thực hành truy vấn dữ liệu quan hệ.", True)
    add_bullet("Nội dung cốt lõi:", "Truy vấn dữ liệu cơ bản với SELECT/WHERE, lọc và sắp xếp dữ liệu (ORDER BY, LIMIT), các hàm tổng hợp dữ liệu (COUNT, SUM, AVG, GROUP BY, HAVING), kỹ thuật kết nối bảng chuyên sâu (INNER JOIN, LEFT JOIN, FULL OUTER JOIN) và truy vấn con (Subquery) trên cơ sở dữ liệu mẫu thực tế.", True)

    add_h2("8.3. Khóa học Lập trình C++ Nền tảng (Cơ bản)")
    add_bullet("Quy mô đào tạo:", "Bao gồm 7 Modules với 29 bài học tiêu chuẩn.", True)
    add_bullet("Nội dung cốt lõi:", "C++17 Fast I/O (`cin`, `cout`), Biến và kiểu dữ liệu chuẩn, Cấu trúc rẽ nhánh `if-else` và `switch-case`, Vòng lặp `for`, `while`, `do-while`, Xử lý chuỗi ký tự (`std::string`), Mảng 1 chiều, Kỹ thuật viết Hàm và Tham chiếu (`&`), Mảng 2 chiều và thao tác Ma trận.", True)

    add_h2("8.4. Khóa học Lập trình C++ Chuyên sâu & Hệ thống (Nâng cao)")
    add_bullet("Quy mô đào tạo:", "Bao gồm 6 Modules với 19 bài học nâng cao.", True)
    add_bullet("Nội dung cốt lõi:", "Kỹ thuật Bit-fields và căn chỉnh bộ nhớ (Data Alignment/Padding), Cơ chế phân bổ bộ nhớ Stack và Heap, Con trỏ nâng cao và Con trỏ thông minh (Smart Pointers: `unique_ptr`, `shared_ptr`), Thao tác đọc/ghi tệp nhị phân (Binary File I/O), Quy trình biên dịch nhiều tệp nguồn (Multi-file Compilation & Makefile) và Thuật toán Quay lui đệ quy (Backtracking).", True)

    add_h2("8.5. Bộ quy chuẩn đồng nhất 100% của 48 bài học C++ chuẩn mực")
    add_p("Toàn bộ 48 bài học C++ trong hệ thống đã trải qua quá trình rà soát và chuẩn hóa đồng bộ:")
    add_bullet("Cấu trúc bài học 3 phần trọn vẹn:", "100% bài học đều có đủ: Lý thuyết sư phạm 5 phần súc tích + Câu hỏi trắc nghiệm kiểm tra độ hiểu bài + Bài tập lập trình thực hành.", True)
    add_bullet("Bộ Test Cases chuẩn mực:", "Mỗi bài tập đều được thiết lập sẵn các bộ test case công khai và test case ẩn với dữ liệu đầu vào/ra nhất quán.", True)
    add_bullet("Tích hợp Ràng buộc cú pháp động:", "Toàn bộ bài tập đều được cấu hình các thẻ ràng buộc cú pháp (`requiredKeywords`, `forbiddenKeywords`, `requireComment`) đồng bộ hoàn toàn giữa giao diện Lesson Studio Editor của Admin và bộ chấm điểm của Backend Sandbox.", True)

    # ----------------------------------------------------
    # PHẦN 9
    # ----------------------------------------------------
    add_h1("9. BẢNG TỔNG HỢP CÔNG NGHỆ KỸ THUẬT (TECHNOLOGY STACK MATRIX)")
    add_p("Hệ thống ứng dụng những công nghệ hiện đại, ổn định và có hiệu năng cao hàng đầu hiện nay:")

    add_p("Bảng 9.1: Bảng tổng hợp chi tiết ngăn xếp công nghệ của hệ thống", italic=True, space_after=3)
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
        ("Học Máy & DKT", "PyTorch, Scikit-Learn", "Mô hình hóa chuỗi tri thức người học bằng Deep Knowledge Tracing (DKT LSTM) & BKT"),
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

    # ----------------------------------------------------
    # PHẦN 10
    # ----------------------------------------------------
    add_h1("10. KẾT LUẬN & ĐÁNH GIÁ ĐỀ TÀI")

    add_h2("10.1. Đánh giá tính khoa học & giá trị thực tiễn")
    add_p("Đề tài 'Hệ thống học lập trình thích ứng tích hợp Trợ lý ảo AI và Chấm code tự động (VIBECODE AI / CODEHUB)' đã hoàn thành xuất sắc các mục tiêu nghiên cứu và phát triển phần mềm đề ra, mang lại những giá trị thiết thực:")
    add_bullet("Đột phá trong phương pháp giáo dục cá nhân hóa:", "Bằng việc tích hợp học thuyết Vùng phát triển gần (ZPD) với các mô hình Machine Learning tiên tiến (BKT, Deep Knowledge Tracing PyTorch LSTM), hệ thống giải quyết triệt để vấn đề người học bị quá tải hoặc chán nản, tạo ra lộ trình học tập 'đo ni đóng giày' cho từng học viên.", True)
    add_bullet("Môi trường thực hành trực tuyến chuẩn công nghiệp:", "Sự kết hợp giữa Monaco Editor chuyên nghiệp, hệ thống kiểm tra ràng buộc cú pháp động và hạ tầng Sandbox cô lập giúp học viên được rèn luyện tác phong lập trình chuẩn chỉ ngay từ những bài học đầu tiên.", True)
    add_bullet("Khả năng vận hành bền bỉ & tiết kiệm chi phí:", "Cơ chế Dynamic AI Key Pool Manager tự động xoay vòng thông minh giữa các nhà cung cấp AI giúp hệ thống hoạt động 24/7 mà không lo cạn kiệt ngân sách hay bị ngắt quãng do Rate Limit.", True)

    add_h2("10.2. Tiềm năng ứng dụng & hướng phát triển tương lai")
    add_p("Hệ thống có tiềm năng ứng dụng cao trong thực tế tại các trường đại học, trường phổ thông và các trung tâm đào tạo lập trình. Trong các giai đoạn tiếp theo, nhóm phát triển định hướng mở rộng thêm các tính năng nâng cao:")
    add_bullet("Tổ chức thi đấu trực tiếp (Live Coding Contest):", "Mở rộng phân hệ Arena thành phòng thi đấu đối kháng thời gian thực (1vs1 hoặc nhiều người chơi) qua WebSocket.", True)
    add_bullet("Hỗ trợ mở rộng thêm ngôn ngữ:", "Tích hợp thêm runner và giáo trình cho các ngôn ngữ phổ biến khác như Java, Go, Rust.", True)
    add_bullet("Gia sư AI bằng giọng nói tương tác (Voice AI Tutor):", "Ứng dụng công nghệ Text-to-Speech và Speech-to-Text để học viên có thể đàm thoại trực tiếp với Mascot AI như một gia sư kèm cặp bằng lời nói.", True)

    # Save to both target locations
    file_root = r"d:\Project\LearnPython\BAO_CAO_DANH_SACH_CHUC_NANG_DE_TAI.docx"
    file_docs = r"d:\Project\LearnPython\docs\features\BAO_CAO_DANH_SACH_CHUC_NANG_DE_TAI.docx"
    
    os.makedirs(os.path.dirname(file_docs), exist_ok=True)
    doc.save(file_root)
    doc.save(file_docs)
    print(f"Successfully generated DOCX files:\n1. {file_root}\n2. {file_docs}")

if __name__ == "__main__":
    generate_report()
