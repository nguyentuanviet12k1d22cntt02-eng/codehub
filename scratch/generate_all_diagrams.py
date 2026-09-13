import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

def generate_mindmap(output_path):
    fig, ax = plt.subplots(figsize=(16, 12), dpi=300)
    ax.set_xlim(0, 160)
    ax.set_ylim(-15, 115)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')

    # Title
    ax.text(80, 110, "SƠ ĐỒ TƯ DUY PHÂN RÃ CHỨC NĂNG HỆ THỐNG (FUNCTIONAL MINDMAP)",
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')
    ax.text(80, 106, "HỆ THỐNG HỌC LẬP TRÌNH THÍCH ỨNG TÍCH HỢP TRỢ LÝ AI & CHẤM CODE TỰ ĐỘNG (VIBECODE AI)",
            ha='center', va='center', fontsize=11, fontstyle='italic', color='#475569')

    # Center Root Node
    root_box = patches.FancyBboxPatch(
        (62, 45), 36, 16,
        boxstyle="round,pad=0.8,rounding_size=2",
        edgecolor="#1D4ED8", facecolor="#DBEAFE", linewidth=2.5
    )
    ax.add_patch(root_box)
    ax.text(80, 55, "HỆ THỐNG ĐÀO TẠO\nVIBECODE AI", ha='center', va='center',
            fontsize=13, fontweight='bold', color='#1E3A8A', linespacing=1.2)
    ax.text(80, 48.5, "(CodeHub Platform)", ha='center', va='center',
            fontsize=10, fontstyle='italic', color='#3B82F6')

    # 6 Branches around the root
    branches = [
        # 1. Top Left: Người dùng & Học viên
        {
            "id": "B1", "title": "1. NGƯỜI DÙNG & HỌC VIÊN",
            "pos": (28, 90), "size": (36, 8),
            "color_bg": "#F0FDF4", "color_bd": "#16A34A", "color_txt": "#14532D",
            "root_conn": (62, 57),
            "items": [
                "• Xác thực an toàn JWT & Bcrypt",
                "• Phân quyền người dùng (RBAC 4 cấp)",
                "• Hồ sơ năng lực & Tỷ lệ Acceptance",
                "• Dashboard chuỗi ngày học (Streak)",
                "• Khám phá & Đề cương khóa học 4 cấp"
            ]
        },
        # 2. Mid Left: Không gian Học tập & Chấm Code
        {
            "id": "B2", "title": "2. CODE STUDIO & SANDBOX",
            "pos": (28, 52), "size": (36, 8),
            "color_bg": "#EFF6FF", "color_bd": "#2563EB", "color_txt": "#1E3A8A",
            "root_conn": (62, 53),
            "items": [
                "• Lý thuyết sư phạm 5 phần súc tích",
                "• Trắc nghiệm Quiz tương tác tức thì",
                "• Monaco Editor chuẩn VS Code",
                "• Chấm testcase tự động (Công khai/Ẩn)",
                "• Ràng buộc cú pháp động (Constraints)",
                "• Đo hiệu năng Runtime Beats %"
            ]
        },
        # 3. Bottom Left: Hạ tầng Sandbox An toàn
        {
            "id": "B3", "title": "3. HẠ TẦNG SANDBOX CÔ LẬP",
            "pos": (28, 14), "size": (36, 8),
            "color_bg": "#FFFBEB", "color_bd": "#D97706", "color_txt": "#78350F",
            "root_conn": (62, 49),
            "items": [
                "• Runner Python, C++17, SQLite, JS",
                "• Docker Container cách ly (Production)",
                "• Subprocess đệm an toàn (Local Dev)",
                "• Giám sát giới hạn RAM / CPU / Timeout"
            ]
        },
        # 4. Top Right: Trợ lý ảo AI & Lộ trình Thích ứng
        {
            "id": "B4", "title": "4. TRỢ LÝ AI & LỘ TRÌNH ZPD",
            "pos": (132, 90), "size": (36, 8),
            "color_bg": "#FAF5FF", "color_bd": "#9333EA", "color_txt": "#581C87",
            "root_conn": (98, 57),
            "items": [
                "• Mascot AI Chatbot đồng hành 24/7",
                "• Phân cụm 4 phong cách (Archetypes)",
                "• Theo dõi tri thức PALNet (GCN & Attention)",
                "• Đồ thị kỹ năng DAG 33 nodes tiên quyết",
                "• Sinh bài học cá nhân hóa theo ZPD",
                "• Multi-Agent Critic tự test code mẫu"
            ]
        },
        # 5. Mid Right: Quản trị Admin Portal
        {
            "id": "B5", "title": "5. QUẢN TRỊ ADMIN PORTAL",
            "pos": (132, 52), "size": (36, 8),
            "color_bg": "#FEF2F2", "color_bd": "#DC2626", "color_txt": "#7F1D1D",
            "root_conn": (98, 53),
            "items": [
                "• Bảng chỉ số KPI & Health-Check",
                "• Quản lý User, phân quyền & khóa TK",
                "• Lesson Studio Editor (Markdown, Code GUI)",
                "• Đối soát chi tiết toàn bộ bài nộp",
                "• Phân tích Pass Rate & Thống kê lỗi",
                "• Dynamic AI Key Pool xoay vòng thông minh"
            ]
        },
        # 6. Bottom Right: Giáo trình Chuẩn hóa
        {
            "id": "B6", "title": "6. GIÁO TRÌNH TÍCH HỢP",
            "pos": (132, 14), "size": (36, 8),
            "color_bg": "#F8FAFC", "color_bd": "#475569", "color_txt": "#0F172A",
            "root_conn": (98, 49),
            "items": [
                "• Python Cơ bản & Nâng cao (8 modules)",
                "• Hệ quản trị CSDL SQL chuyên sâu",
                "• C++ Cơ bản (29 bài học chuẩn hóa)",
                "• C++ Nâng cao & Hệ thống (19 bài)",
                "• 100% 48 bài C++ đủ Lý thuyết/Quiz/Code"
            ]
        }
    ]

    for b in branches:
        bx, by = b["pos"]
        w, h = b["size"]
        
        rx, ry = b["root_conn"]
        conn_x = bx + w/2 if bx < 80 else bx - w/2
        conn_y = by
        ax.annotate("", xy=(conn_x, conn_y), xytext=(rx, ry),
                    arrowprops=dict(arrowstyle="->", connectionstyle="arc3,rad=0.08",
                                    color=b["color_bd"], lw=2.0))

        box = patches.FancyBboxPatch(
            (bx - w/2, by - h/2), w, h,
            boxstyle="round,pad=0.5,rounding_size=1.5",
            edgecolor=b["color_bd"], facecolor=b["color_bg"], linewidth=2.0
        )
        ax.add_patch(box)
        ax.text(bx, by, b["title"], ha='center', va='center',
                fontsize=10.5, fontweight='bold', color=b["color_txt"])

        card_h = len(b["items"]) * 3.4 + 2.5
        card_y = by - h/2 - 1.2 - card_h/2
        card_box = patches.FancyBboxPatch(
            (bx - w/2, card_y - card_h/2), w, card_h,
            boxstyle="square,pad=0.3",
            edgecolor="#CBD5E1", facecolor="#FFFFFF", linewidth=1.2
        )
        ax.add_patch(card_box)

        start_text_y = card_y + card_h/2 - 2.4
        for idx, item in enumerate(b["items"]):
            ax.text(bx - w/2 + 1.8, start_text_y - idx * 3.4, item,
                    ha='left', va='center', fontsize=8.6, color="#1E293B")

    plt.tight_layout()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, bbox_inches='tight', facecolor=fig.get_facecolor(), dpi=300)
    plt.close()
    print(f"Mindmap updated: {output_path}")

def generate_overall_usecase(output_path):
    fig, ax = plt.subplots(figsize=(16, 12), dpi=300)
    ax.set_xlim(0, 160)
    ax.set_ylim(0, 118)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')

    # System boundary box
    system_box = patches.FancyBboxPatch(
        (34, 4), 92, 105,
        boxstyle="round,pad=1,rounding_size=2",
        edgecolor="#0F172A", facecolor="#F8FAFC", linewidth=2.2
    )
    ax.add_patch(system_box)

    # Title of system
    ax.text(80, 104, "HỆ THỐNG HỌC LẬP TRÌNH THÍCH ỨNG (VIBECODE AI / CODEHUB)", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#0F172A',
            bbox=dict(boxstyle="square,pad=0.5", fc="#E2E8F0", ec="#64748B", lw=1.2))

    # Helper function for Actor
    def draw_actor(x, y, name, role_desc):
        head = plt.Circle((x, y + 4.5), 2.2, edgecolor='#0F172A', facecolor='#E2E8F0', lw=2.2)
        ax.add_patch(head)
        ax.plot([x, x], [y + 2.3, y - 3.0], color='#0F172A', lw=2.2)
        ax.plot([x - 3.5, x + 3.5], [y + 0.9, y + 0.9], color='#0F172A', lw=2.2)
        ax.plot([x, x - 3.0], [y - 3.0, y - 8.0], color='#0F172A', lw=2.2)
        ax.plot([x, x + 3.0], [y - 3.0, y - 8.0], color='#0F172A', lw=2.2)
        ax.text(x, y - 10.2, name, ha='center', va='top', fontsize=11, fontweight='bold', color='#0F172A')
        ax.text(x, y - 13.5, role_desc, ha='center', va='top', fontsize=9, fontstyle='italic', color='#475569')

    # Draw Actors
    draw_actor(16, 62, "Học Viên", "(Student)")
    draw_actor(144, 93, "Giảng Viên", "(Teacher)")
    draw_actor(144, 65, "Quản Trị Viên", "(Administrator)")
    draw_actor(144, 37, "AI Service", "(PALNet & ZPD)")
    draw_actor(144, 11, "Sandbox Judge", "(Hệ thống Chấm)")

    usecases = {
        # Learner Use Cases
        "UC01": ("UC01: Đăng ký, Đăng nhập\n& Quản lý Hồ sơ", 58, 94, 17, 3.8, "#EFF6FF", "#2563EB"),
        "UC02": ("UC02: Khám phá Đề cương\n& Ghi danh Khóa học", 58, 80, 17, 3.8, "#EFF6FF", "#2563EB"),
        "UC03": ("UC03: Học Lý thuyết Sư phạm\n& Làm trắc nghiệm Quiz", 58, 66, 17, 3.8, "#EFF6FF", "#2563EB"),
        "UC04": ("UC04: Soạn thảo mã nguồn\ntrên Monaco Studio", 58, 52, 17, 3.8, "#EFF6FF", "#2563EB"),
        "UC05": ("UC05: Nộp bài chấm tự động\n& Kiểm tra Ràng buộc", 58, 38, 17, 3.8, "#EFF6FF", "#2563EB"),
        "UC06": ("UC06: Tương tác Mascot AI\n& Nhận lộ trình ZPD", 58, 24, 17, 3.8, "#FAF5FF", "#9333EA"),
        "UC07": ("UC07: Xem phân tích tiến độ\n& Xếp hạng Beats %", 58, 10, 17, 3.8, "#EFF6FF", "#2563EB"),

        # Admin & System Use Cases
        "UC08": ("UC08: Soạn giáo trình & Ràng buộc\n(Lesson Studio Editor)", 102, 94, 18, 3.8, "#F0FDF4", "#16A34A"),
        "UC09": ("UC09: Quản trị Khóa học, Bài học\n& Bộ Testcases ẩn/hiện", 102, 80, 18, 3.8, "#F0FDF4", "#16A34A"),
        "UC10": ("UC10: Quản lý Người dùng,\nPhân quyền RBAC & Khóa TK", 102, 66, 18, 3.8, "#FEF2F2", "#DC2626"),
        "UC11": ("UC11: Giám sát KPI Hệ thống\n& Báo cáo Analytics", 102, 52, 18, 3.8, "#FEF2F2", "#DC2626"),
        "UC12": ("UC12: Quản lý Bể API Key AI\n(Dynamic Key Pool xoay vòng)", 102, 38, 18, 3.8, "#FEF2F2", "#DC2626"),
        "UC13": ("UC13: Chẩn đoán tri thức PALNet\n& Sinh bài học thích ứng ZPD", 102, 24, 18, 3.8, "#FAF5FF", "#9333EA"),
        "UC14": ("UC14: Thực thi mã cô lập\ntrong Sandbox (Docker/Subproc)", 102, 10, 18, 3.8, "#FFFBEB", "#D97706"),
    }

    # Draw all ellipses
    for uid, (text, cx, cy, rx, ry, bg, border) in usecases.items():
        ellipse = patches.Ellipse((cx, cy), rx * 2, ry * 2, edgecolor=border, facecolor=bg, linewidth=1.8)
        ax.add_patch(ellipse)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=8.8, fontweight='bold', color='#1E293B', linespacing=1.2)

    # Actor lines: Student -> UC01 .. UC07
    student_pt = (20, 62)
    for uid in ["UC01", "UC02", "UC03", "UC04", "UC05", "UC06", "UC07"]:
        _, cx, cy, rx, ry, _, _ = usecases[uid]
        ax.plot([student_pt[0], cx - rx], [student_pt[1], cy], color="#334155", lw=1.3)

    # Actor lines: Teacher -> UC08, UC09, UC11
    teacher_pt = (140, 93)
    for uid in ["UC08", "UC09", "UC11"]:
        _, cx, cy, rx, ry, _, _ = usecases[uid]
        ax.plot([teacher_pt[0], cx + rx], [teacher_pt[1], cy], color="#16A34A", lw=1.3)

    # Actor lines: Admin -> UC08, UC09, UC10, UC11, UC12
    admin_pt = (140, 65)
    for uid in ["UC08", "UC09", "UC10", "UC11", "UC12"]:
        _, cx, cy, rx, ry, _, _ = usecases[uid]
        ax.plot([admin_pt[0], cx + rx], [admin_pt[1], cy], color="#DC2626", lw=1.3)

    # Actor lines: AI Service -> UC13
    ai_pt = (140, 37)
    _, cx13, cy13, rx13, ry13, _, _ = usecases["UC13"]
    ax.plot([ai_pt[0], cx13 + rx13], [ai_pt[1], cy13], color="#9333EA", lw=1.5)

    # Actor lines: Sandbox Judge -> UC14
    judge_pt = (140, 11)
    _, cx14, cy14, rx14, ry14, _, _ = usecases["UC14"]
    ax.plot([judge_pt[0], cx14 + rx14], [judge_pt[1], cy14], color="#D97706", lw=1.5)

    # Include relationships:
    # UC05 (Submit code) <<include>> UC14 (Sandbox)
    _, cx5, cy5, rx5, ry5, _, _ = usecases["UC05"]
    ax.annotate("", xy=(cx14 - rx14, cy14 + 1.5), xytext=(cx5 + rx5, cy5 - 1.5),
                arrowprops=dict(arrowstyle="->", color="#DC2626", lw=1.6, ls="--"))
    ax.text(78, 30, "<<include>>",
            ha='center', va='center', fontsize=8, fontweight='bold', color="#DC2626",
            rotation=-32)

    # UC06 (Adaptive ZPD) <<include>> UC13 (AI Service DKT)
    _, cx6, cy6, rx6, ry6, _, _ = usecases["UC06"]
    ax.annotate("", xy=(cx13 - rx13, cy13), xytext=(cx6 + rx6, cy6),
                arrowprops=dict(arrowstyle="->", color="#9333EA", lw=1.6, ls="--"))
    ax.text((cx6 + rx6 + cx13 - rx13)/2, cy6 + 2.2, "<<include>>",
            ha='center', va='bottom', fontsize=8, fontweight='bold', color="#9333EA")

    plt.tight_layout()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, bbox_inches='tight', facecolor=fig.get_facecolor(), dpi=300)
    plt.close()
    print(f"Overall Use Case diagram updated: {output_path}")

if __name__ == "__main__":
    generate_mindmap("d:/Project/LearnPython/docs/features/so_do_tu_duy_chuc_nang.png")
    generate_overall_usecase("d:/Project/LearnPython/docs/features/so_do_usecase_tong_the.png")
