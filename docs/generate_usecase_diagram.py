"""
Script vẽ Sơ đồ Use Case tổng thể và chi tiết cho đề tài VIBECODE AI / CODEHUB.
Đầu ra được lưu vào thư mục docs/bao_cao/ phục vụ báo cáo thực tập tốt nghiệp & đồ án.
"""

import os
import sys
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path

# Đảm bảo in ký tự Unicode không bị lỗi trên Windows console
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Cấu hình font chữ hỗ trợ tiếng Việt chuẩn Unicode
plt.rcParams['font.sans-serif'] = ['Segoe UI', 'Arial', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

def draw_actor(ax, x, y, name, role_desc, primary_color="#1E293B", bg_color="#F1F5F9", is_system=False):
    """
    Vẽ biểu tượng tác nhân (Actor) UML tiêu chuẩn.
    Nếu là người (Human Actor): hình người UML cách điệu cao cấp.
    Nếu là hệ thống (System Actor): hình khối server nhỏ gọn kèm stereotype <<system>>.
    """
    if not is_system:
        # 1. Human Actor (UML Stickman cao cấp, nét mượt mà)
        # Đầu
        head = plt.Circle((x, y + 4.5), 2.0, edgecolor=primary_color, facecolor=bg_color, lw=2.4, zorder=5)
        ax.add_patch(head)
        # Thân
        ax.plot([x, x], [y + 2.5, y - 2.5], color=primary_color, lw=2.5, solid_capstyle='round', zorder=5)
        # Tay
        ax.plot([x - 3.4, x + 3.4], [y + 1.0, y + 1.0], color=primary_color, lw=2.5, solid_capstyle='round', zorder=5)
        # Chân
        ax.plot([x, x - 2.6], [y - 2.5, y - 7.2], color=primary_color, lw=2.5, solid_capstyle='round', zorder=5)
        ax.plot([x, x + 2.6], [y - 2.5, y - 7.2], color=primary_color, lw=2.5, solid_capstyle='round', zorder=5)
        
        # Tên & vai trò tác nhân
        ax.text(x, y - 9.2, name, ha='center', va='top', fontsize=10.5, fontweight='bold', color=primary_color, zorder=6)
        ax.text(x, y - 11.8, role_desc, ha='center', va='top', fontsize=8.6, fontstyle='italic', color='#475569', zorder=6)
    else:
        # 2. System Actor (Server rack nhỏ gọn để không va chạm nhãn)
        # Khung máy chủ
        bw, bh = 7.6, 5.4
        box = patches.FancyBboxPatch(
            (x - bw/2, y - bh/2 + 0.6), bw, bh,
            boxstyle="round,pad=0.25,rounding_size=0.8",
            edgecolor=primary_color, facecolor=bg_color, linewidth=2.0, zorder=5
        )
        ax.add_patch(box)
        # Các rãnh server
        ax.plot([x - 2.4, x + 1.2], [y + 2.1, y + 2.1], color=primary_color, lw=1.6, zorder=6)
        ax.plot([x - 2.4, x + 1.2], [y + 0.6, y + 0.6], color=primary_color, lw=1.6, zorder=6)
        ax.plot([x - 2.4, x + 1.2], [y - 0.9, y - 0.9], color=primary_color, lw=1.6, zorder=6)
        # Đèn LED trạng thái
        ax.plot([x + 2.2, x + 2.2], [y + 2.1, y + 2.1], marker='o', markersize=2.8, color=primary_color, zorder=6)
        ax.plot([x + 2.2, x + 2.2], [y + 0.6, y + 0.6], marker='o', markersize=2.8, color=primary_color, zorder=6)
        ax.plot([x + 2.2, x + 2.2], [y - 0.9, y - 0.9], marker='o', markersize=2.8, color=primary_color, zorder=6)

        # Nhãn stereotype và tên
        ax.text(x, y + 4.1, "«system»", ha='center', va='bottom', fontsize=8.0, fontweight='semibold', color=primary_color, zorder=6)
        ax.text(x, y - 3.2, name, ha='center', va='top', fontsize=10.0, fontweight='bold', color=primary_color, zorder=6)
        ax.text(x, y - 5.6, role_desc, ha='center', va='top', fontsize=8.2, fontstyle='italic', color='#475569', zorder=6)


def draw_overall_usecase(output_path):
    """
    Vẽ Sơ đồ Use Case tổng thể toàn hệ thống (Hình 2.1 trong báo cáo).
    Bao gồm 5 Actors và 14 Use Cases chuẩn hóa với cấu trúc hoàn mỹ, không giao cắt đường liên kết.
    """
    fig, ax = plt.subplots(figsize=(17.0, 13.5), dpi=300)
    ax.set_xlim(0, 170)
    ax.set_ylim(0, 126)
    ax.axis('off')

    # Nền canvas trắng tinh tế
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')

    # 1. Header Tiêu đề chính của biểu đồ
    ax.text(85.0, 122.0, "SƠ ĐỒ USE CASE TỔNG THỂ TOÀN HỆ THỐNG", 
            ha='center', va='center', fontsize=17, fontweight='bold', color='#0F172A')
    ax.text(85.0, 118.5, "HỆ THỐNG HỌC LẬP TRÌNH THÍCH ỨNG TÍCH HỢP TRỢ LÝ AI & CHẤM CODE TỰ ĐỘNG (VIBECODE AI / CODEHUB)", 
            ha='center', va='center', fontsize=11, fontstyle='italic', color='#475569')

    # 2. System Boundary Box (Ranh giới hệ thống)
    # Đổ bóng nhẹ phía sau ranh giới
    shadow_box = patches.FancyBboxPatch(
        (34.5, 4.0), 101.0, 110.0,
        boxstyle="round,pad=0.8,rounding_size=2.2",
        edgecolor="none", facecolor="#E2E8F0", alpha=0.55, zorder=1
    )
    ax.add_patch(shadow_box)

    system_box = patches.FancyBboxPatch(
        (34.0, 4.5), 101.0, 110.0,
        boxstyle="round,pad=0.8,rounding_size=2.2",
        edgecolor="#334155", facecolor="#F8FAFC", linewidth=2.4, zorder=2
    )
    ax.add_patch(system_box)

    # Nhãn ranh giới hệ thống (System Title Bar)
    sys_title_box = patches.FancyBboxPatch(
        (49.0, 109.2), 71.0, 4.8,
        boxstyle="round,pad=0.4,rounding_size=1.0",
        edgecolor="#2563EB", facecolor="#EFF6FF", linewidth=1.6, zorder=3
    )
    ax.add_patch(sys_title_box)
    ax.text(84.5, 111.6, "Ranh giới Hệ thống: Nền tảng Học Lập trình Trực tuyến VIBECODE AI / CODEHUB", 
            ha='center', va='center', fontsize=11.0, fontweight='bold', color='#1D4ED8', zorder=4)

    # 3. Định nghĩa vị trí 14 Use Cases
    # Sắp xếp để 2 đường <<include>> nằm hoàn toàn song song theo phương ngang:
    # Row 6: UC05 (Nộp bài) -> UC14 (Sandbox) ở y = 28.0
    # Row 7: UC06 (Mascot AI) -> UC13 (AI Service) ở y = 14.0
    rx = 16.8
    ry = 3.65

    usecases = {
        # --- CỘT TRÁI: HỌC VIÊN (Student Portal) ---
        "UC01": {
            "title": "UC01: Đăng ký, Đăng nhập\n& Quản lý Hồ sơ",
            "pos": (59.0, 98.0), "bg": "#EFF6FF", "bd": "#2563EB", "txt": "#1E3A8A"
        },
        "UC02": {
            "title": "UC02: Khám phá Đề cương\n& Ghi danh Khóa học",
            "pos": (59.0, 84.0), "bg": "#EFF6FF", "bd": "#2563EB", "txt": "#1E3A8A"
        },
        "UC03": {
            "title": "UC03: Học Lý thuyết Sư phạm\n& Làm trắc nghiệm Quiz",
            "pos": (59.0, 70.0), "bg": "#EFF6FF", "bd": "#2563EB", "txt": "#1E3A8A"
        },
        "UC04": {
            "title": "UC04: Soạn thảo mã nguồn\ntrên Monaco Studio",
            "pos": (59.0, 56.0), "bg": "#EFF6FF", "bd": "#2563EB", "txt": "#1E3A8A"
        },
        "UC07": {
            "title": "UC07: Xem phân tích tiến độ\n& Xếp hạng Beats %",
            "pos": (59.0, 42.0), "bg": "#EFF6FF", "bd": "#2563EB", "txt": "#1E3A8A"
        },
        "UC05": {
            "title": "UC05: Nộp bài chấm tự động\n& Kiểm tra Ràng buộc",
            "pos": (59.0, 28.0), "bg": "#EFF6FF", "bd": "#2563EB", "txt": "#1E3A8A"
        },
        "UC06": {
            "title": "UC06: Tương tác Mascot AI\n& Nhận lộ trình ZPD",
            "pos": (59.0, 14.0), "bg": "#FAF5FF", "bd": "#9333EA", "txt": "#581C87"
        },

        # --- CỘT PHẢI: QUẢN TRỊ / GIẢNG VIÊN / DỊCH VỤ HỆ THỐNG ---
        "UC08": {
            "title": "UC08: Soạn giáo trình & Ràng buộc\n(Lesson Studio Editor)",
            "pos": (110.0, 98.0), "bg": "#F0FDF4", "bd": "#059669", "txt": "#064E3B"
        },
        "UC09": {
            "title": "UC09: Quản trị Khóa học, Bài học\n& Bộ Testcases ẩn/hiện",
            "pos": (110.0, 84.0), "bg": "#F0FDF4", "bd": "#059669", "txt": "#064E3B"
        },
        "UC11": {
            "title": "UC11: Giám sát KPI Hệ thống\n& Báo cáo Analytics",
            "pos": (110.0, 70.0), "bg": "#FEF2F2", "bd": "#DC2626", "txt": "#7F1D1D"
        },
        "UC10": {
            "title": "UC10: Quản lý Người dùng,\nPhân quyền RBAC & Khóa TK",
            "pos": (110.0, 56.0), "bg": "#FEF2F2", "bd": "#DC2626", "txt": "#7F1D1D"
        },
        "UC12": {
            "title": "UC12: Quản lý Bể API Key AI\n(Dynamic Key Pool xoay vòng)",
            "pos": (110.0, 42.0), "bg": "#FEF2F2", "bd": "#DC2626", "txt": "#7F1D1D"
        },
        "UC14": {
            "title": "UC14: Thực thi mã cô lập\ntrong Sandbox (Docker/Subproc)",
            "pos": (110.0, 28.0), "bg": "#FFFBEB", "bd": "#D97706", "txt": "#78350F"
        },
        "UC13": {
            "title": "UC13: Chẩn đoán tri thức PALNet\n& Sinh bài học thích ứng ZPD",
            "pos": (110.0, 14.0), "bg": "#FAF5FF", "bd": "#9333EA", "txt": "#581C87"
        },
    }

    # 4. Vẽ các hình Oval Use Case
    for uid, data in usecases.items():
        cx, cy = data["pos"]
        # Đổ bóng nhẹ cho hình oval
        shadow_oval = patches.Ellipse(
            (cx + 0.35, cy - 0.35), rx * 2, ry * 2,
            edgecolor="none", facecolor="#CBD5E1", alpha=0.55, zorder=3
        )
        ax.add_patch(shadow_oval)

        # Oval chính
        oval = patches.Ellipse(
            (cx, cy), rx * 2, ry * 2,
            edgecolor=data["bd"], facecolor=data["bg"], linewidth=1.9, zorder=4
        )
        ax.add_patch(oval)

        # Chữ bên trong Oval
        ax.text(cx, cy, data["title"], ha='center', va='center',
                fontsize=8.9, fontweight='bold', color=data["txt"], linespacing=1.22, zorder=5)

    # 5. Vẽ 5 Actors ở các vị trí tọa độ tối ưu
    # Tác nhân chính bên trái: Học viên (y = 56.0, trung tâm cột trái)
    draw_actor(ax, 16.0, 56.0, "Học Viên", "(Student / Learner)", 
               primary_color="#1D4ED8", bg_color="#DBEAFE", is_system=False)

    # Tác nhân bên phải
    # Giảng viên (y = 84.0, trực diện với UC08, UC09, UC11)
    draw_actor(ax, 153.5, 84.0, "Giảng Viên", "(Teacher / Instructor)", 
               primary_color="#059669", bg_color="#D1FAE5", is_system=False)

    # Quản trị viên (y = 56.0, trực diện với UC10, UC12)
    draw_actor(ax, 153.5, 56.0, "Quản Trị Viên", "(Administrator)", 
               primary_color="#DC2626", bg_color="#FEE2E2", is_system=False)

    # Sandbox Judge (y = 28.0) - Cùng hàng ngang với UC14
    draw_actor(ax, 153.5, 28.0, "Sandbox Judge", "(Hạ tầng Chấm Cô lập)", 
               primary_color="#D97706", bg_color="#FEF3C7", is_system=True)

    # AI Service (y = 14.0) - Cùng hàng ngang với UC13
    draw_actor(ax, 153.5, 14.0, "AI Service", "(PALNet & ZPD Engine)", 
               primary_color="#7C3AED", bg_color="#EDE9FE", is_system=True)

    # 6. Đường kết nối Tác nhân (Association Lines)
    # Học viên nối tới 7 Use Cases cột trái
    student_pt = (20.0, 56.0)
    for uid in ["UC01", "UC02", "UC03", "UC04", "UC07", "UC05", "UC06"]:
        cx, cy = usecases[uid]["pos"]
        ax.plot([student_pt[0], cx - rx], [student_pt[1], cy], 
                color="#1E3A8A", lw=1.35, alpha=0.85, zorder=3)

    # Giảng viên nối tới: UC08, UC09, UC11
    teacher_pt = (149.5, 84.0)
    for uid in ["UC08", "UC09", "UC11"]:
        cx, cy = usecases[uid]["pos"]
        ax.plot([teacher_pt[0], cx + rx], [teacher_pt[1], cy], 
                color="#059669", lw=1.35, alpha=0.85, zorder=3)

    # Quản trị viên nối tới: UC08, UC09, UC10, UC11, UC12
    admin_pt = (149.5, 56.0)
    for uid in ["UC08", "UC09", "UC11", "UC10", "UC12"]:
        cx, cy = usecases[uid]["pos"]
        ax.plot([admin_pt[0], cx + rx], [admin_pt[1], cy], 
                color="#DC2626", lw=1.35, alpha=0.85, zorder=3)

    # Sandbox Judge nối trực tiếp hàng ngang tới UC14 (y = 28.0)
    judge_pt = (149.5, 28.0)
    cx14, cy14 = usecases["UC14"]["pos"]
    ax.plot([judge_pt[0], cx14 + rx], [judge_pt[1], cy14], 
            color="#D97706", lw=1.75, alpha=0.95, zorder=3)

    # AI Service nối trực tiếp hàng ngang tới UC13 (y = 14.0)
    ai_pt = (149.5, 14.0)
    cx13, cy13 = usecases["UC13"]["pos"]
    ax.plot([ai_pt[0], cx13 + rx], [ai_pt[1], cy13], 
            color="#7C3AED", lw=1.75, alpha=0.95, zorder=3)

    # 7. Quan hệ Bao hàm <<include>> (Hoàn toàn nằm ngang, tuyệt đối không giao cắt!)
    # UC05 (Nộp bài) <<include>> UC14 (Sandbox) ở y = 28.0
    cx5, cy5 = usecases["UC05"]["pos"]
    ax.annotate("", xy=(cx14 - rx, cy14), xytext=(cx5 + rx, cy5),
                arrowprops=dict(arrowstyle="-|>", color="#DC2626", lw=1.9, ls="--", mutation_scale=15),
                zorder=6)
    ax.text((cx5 + rx + cx14 - rx)/2, cy5 + 2.0, "«include»",
            ha='center', va='bottom', fontsize=9.0, fontweight='bold', color="#DC2626",
            bbox=dict(boxstyle="round,pad=0.25", fc="#FFF1F2", ec="#FDA4AF", lw=1.0), zorder=7)

    # UC06 (Tương tác Mascot) <<include>> UC13 (AI Service) ở y = 14.0
    cx6, cy6 = usecases["UC06"]["pos"]
    ax.annotate("", xy=(cx13 - rx, cy13), xytext=(cx6 + rx, cy6),
                arrowprops=dict(arrowstyle="-|>", color="#7C3AED", lw=1.9, ls="--", mutation_scale=15),
                zorder=6)
    ax.text((cx6 + rx + cx13 - rx)/2, cy6 + 2.0, "«include»",
            ha='center', va='bottom', fontsize=9.0, fontweight='bold', color="#7C3AED",
            bbox=dict(boxstyle="round,pad=0.25", fc="#FAF5FF", ec="#C084FC", lw=1.0), zorder=7)

    # 8. Legend (Bảng chú giải các màu sắc & thành phần)
    legend_box = patches.FancyBboxPatch(
        (37.0, 5.8), 95.0, 3.4,
        boxstyle="round,pad=0.3,rounding_size=0.6",
        edgecolor="#94A3B8", facecolor="#FFFFFF", linewidth=1.1, zorder=5
    )
    ax.add_patch(legend_box)

    legend_items = [
        ("● Học viên (Learner)", "#2563EB"),
        ("● Giảng viên (Teacher)", "#059669"),
        ("● Quản trị viên (Admin)", "#DC2626"),
        ("● Trợ lý AI (PALNet)", "#9333EA"),
        ("● Sandbox Judge", "#D97706"),
        ("--► Quan hệ «include»", "#DC2626")
    ]
    for i, (leg_text, leg_color) in enumerate(legend_items):
        lx = 39.0 + i * 15.6
        ax.text(lx, 7.5, leg_text, ha='left', va='center', fontsize=8.2, fontweight='bold', color=leg_color, zorder=6)

    plt.tight_layout()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, bbox_inches='tight', facecolor=fig.get_facecolor(), dpi=300)
    plt.close()
    print(f"Biểu đồ Use Case tổng thể đã được tạo thành công tại: {output_path}")


def draw_student_subsystem_usecase(output_path):
    """
    Vẽ Sơ đồ Use Case phân hệ Học viên (Learner Portal Subsystem).
    Đi sâu vào các quy trình học tập, làm bài, tương tác AI, nộp bài và xem tiến độ.
    """
    fig, ax = plt.subplots(figsize=(15.5, 11.5), dpi=300)
    ax.set_xlim(0, 155)
    ax.set_ylim(0, 112)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')

    # Header
    ax.text(77.5, 108.0, "PHÂN HỆ HỌC VIÊN & KHÔNG GIAN HỌC TẬP (LEARNER PORTAL)", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')
    ax.text(77.5, 104.5, "Sơ đồ ca sử dụng chi tiết tương tác của Người học với Nền tảng và Dịch vụ ngoài", 
            ha='center', va='center', fontsize=10.5, fontstyle='italic', color='#475569')

    # Boundary
    system_box = patches.FancyBboxPatch(
        (32.0, 4.0), 91.0, 97.0,
        boxstyle="round,pad=0.8,rounding_size=2.0",
        edgecolor="#2563EB", facecolor="#F8FAFC", linewidth=2.2, zorder=2
    )
    ax.add_patch(system_box)

    # Actors
    draw_actor(ax, 15.0, 52.0, "Học Viên", "(Student)", primary_color="#1D4ED8", bg_color="#DBEAFE")
    draw_actor(ax, 139.0, 68.0, "AI Service", "(PALNet & ZPD)", primary_color="#7C3AED", bg_color="#EDE9FE", is_system=True)
    draw_actor(ax, 139.0, 22.0, "Sandbox Judge", "(Chấm mã nguồn)", primary_color="#D97706", bg_color="#FEF3C7", is_system=True)

    rx = 16.0
    ry = 3.6
    sub_ucs = {
        "S1": ("Khảo sát mục tiêu & Làm Pre-test\nđánh giá năng lực đầu vào", 53.0, 90.0, "#EFF6FF", "#2563EB"),
        "S2": ("Duyệt khóa học, xem đề cương\n& Đăng ký ghi danh", 53.0, 76.0, "#EFF6FF", "#2563EB"),
        "S3": ("Học lý thuyết sư phạm 5 phần\n& Trắc nghiệm Quiz tương tác", 53.0, 62.0, "#EFF6FF", "#2563EB"),
        "S4": ("Thực hành code trên Monaco Editor\n(Gợi ý syntax, phím tắt, reset)", 53.0, 48.0, "#EFF6FF", "#2563EB"),
        "S5": ("Chạy thử nghiệm (Run Code)\nvới testcase cá nhân", 53.0, 34.0, "#EFF6FF", "#2563EB"),
        "S6": ("Nộp bài chấm điểm chính thức\n(Submit Code & Kiểm tra constraints)", 53.0, 20.0, "#EFF6FF", "#2563EB"),
        "S7": ("Xem bảng phân tích kết quả,\nBeats % & Lịch sử nộp bài", 53.0, 7.5, "#EFF6FF", "#2563EB"),

        # Services / Extension usecases
        "S8": ("Nhận phản hồi & gợi ý Socratic\ntừ Mascot AI Chatbot 24/7", 98.0, 76.0, "#FAF5FF", "#9333EA"),
        "S9": ("Cập nhật tri thức PALNet\n& Sinh bài học thích ứng ZPD", 98.0, 60.0, "#FAF5FF", "#9333EA"),
        "S10": ("Thực thi cô lập trong Sandbox\n& So khớp Testcases ẩn/hiện", 98.0, 20.0, "#FFFBEB", "#D97706"),
    }

    for uid, (title, cx, cy, bg, bd) in sub_ucs.items():
        oval = patches.Ellipse((cx, cy), rx * 2, ry * 2, edgecolor=bd, facecolor=bg, lw=1.8, zorder=4)
        ax.add_patch(oval)
        ax.text(cx, cy, title, ha='center', va='center', fontsize=8.6, fontweight='bold', color="#1E293B", zorder=5)

    # Actor lines
    st_pt = (19.0, 52.0)
    for uid in ["S1", "S2", "S3", "S4", "S5", "S6", "S7"]:
        _, cx, cy, _, _ = sub_ucs[uid]
        ax.plot([st_pt[0], cx - rx], [st_pt[1], cy], color="#1E3A8A", lw=1.3, zorder=3)

    # Student to Mascot chat
    ax.plot([st_pt[0], 98.0 - rx], [st_pt[1], 76.0], color="#9333EA", lw=1.1, ls=":", zorder=3)

    # AI Service to S8 & S9
    ai_pt = (135.0, 68.0)
    ax.plot([ai_pt[0], 98.0 + rx], [ai_pt[1], 76.0], color="#7C3AED", lw=1.5, zorder=3)
    ax.plot([ai_pt[0], 98.0 + rx], [ai_pt[1], 60.0], color="#7C3AED", lw=1.5, zorder=3)

    # Sandbox to S10 & S5
    sb_pt = (135.0, 22.0)
    ax.plot([sb_pt[0], 98.0 + rx], [sb_pt[1], 20.0], color="#D97706", lw=1.5, zorder=3)

    # Includes
    # S6 <<include>> S10
    ax.annotate("", xy=(98.0 - rx, 20.0), xytext=(53.0 + rx, 20.0),
                arrowprops=dict(arrowstyle="-|>", color="#DC2626", lw=1.8, ls="--", mutation_scale=14), zorder=6)
    ax.text((53.0 + rx + 98.0 - rx)/2, 22.0, "«include»", ha='center', va='bottom',
            fontsize=8.5, fontweight='bold', color="#DC2626", bbox=dict(boxstyle="round,pad=0.2", fc="#FFF1F2", ec="#FDA4AF", lw=0.9), zorder=7)

    # S8 <<include>> S9
    ax.annotate("", xy=(98.0, 60.0 + ry), xytext=(98.0, 76.0 - ry),
                arrowprops=dict(arrowstyle="-|>", color="#7C3AED", lw=1.8, ls="--", mutation_scale=14), zorder=6)
    ax.text(98.0 + 1.2, 68.0, "«include»", ha='left', va='center',
            fontsize=8.2, fontweight='bold', color="#7C3AED", bbox=dict(boxstyle="round,pad=0.2", fc="#FAF5FF", ec="#C084FC", lw=0.9), zorder=7)

    plt.tight_layout()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, bbox_inches='tight', facecolor=fig.get_facecolor(), dpi=300)
    plt.close()
    print(f"Biểu đồ Use Case phân hệ Học viên đã tạo tại: {output_path}")


def draw_admin_subsystem_usecase(output_path):
    """
    Vẽ Sơ đồ Use Case phân hệ Quản trị & Giảng viên (Admin & Teacher Subsystem).
    """
    fig, ax = plt.subplots(figsize=(15.5, 11.0), dpi=300)
    ax.set_xlim(0, 155)
    ax.set_ylim(0, 108)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')

    # Header
    ax.text(77.5, 104.0, "PHÂN HỆ QUẢN TRỊ VIÊN & GIẢNG VIÊN (ADMIN & TEACHER PORTAL)", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0F172A')
    ax.text(77.5, 100.5, "Sơ đồ ca sử dụng nghiệp vụ biên soạn giáo trình, quản lý khóa học và giám sát hệ thống", 
            ha='center', va='center', fontsize=10.5, fontstyle='italic', color='#475569')

    # Boundary
    system_box = patches.FancyBboxPatch(
        (33.0, 4.0), 91.0, 93.0,
        boxstyle="round,pad=0.8,rounding_size=2.0",
        edgecolor="#DC2626", facecolor="#F8FAFC", linewidth=2.2, zorder=2
    )
    ax.add_patch(system_box)

    # Actors
    draw_actor(ax, 15.0, 72.0, "Giảng Viên", "(Teacher)", primary_color="#059669", bg_color="#D1FAE5")
    draw_actor(ax, 15.0, 26.0, "Quản Trị Viên", "(Administrator)", primary_color="#DC2626", bg_color="#FEE2E2")

    rx = 16.5
    ry = 3.65
    admin_ucs = {
        "A1": ("Soạn bài giảng Markdown Live-Preview\n(Lesson Studio Editor)", 54.0, 86.0, "#F0FDF4", "#059669"),
        "A2": ("Thiết lập Ràng buộc cú pháp động\n(required, forbidden, comment)", 54.0, 72.0, "#F0FDF4", "#059669"),
        "A3": ("Quản lý bộ Testcases chấm điểm\n(Phân định Test công khai & Test ẩn)", 54.0, 58.0, "#F0FDF4", "#059669"),
        "A4": ("Tạo mới & Xuất bản Khóa học\n(Quản lý Cây đề cương 4 cấp)", 54.0, 44.0, "#FEF2F2", "#DC2626"),
        "A5": ("Quản lý Người dùng & Phân quyền\n(RBAC: Student, Teacher, Admin)", 54.0, 30.0, "#FEF2F2", "#DC2626"),
        "A6": ("Bể API Key AI xoay vòng thông minh\n(Dynamic Key Pool Manager)", 54.0, 16.0, "#FEF2F2", "#DC2626"),

        # Right Column
        "A7": ("Theo dõi KPI & Health-Check Dịch vụ\n(Backend, AI Service, Database)", 99.0, 60.0, "#FEF2F2", "#DC2626"),
        "A8": ("Đối soát lịch sử bài nộp của học viên\n& Phân tích tỷ lệ đạt (Pass Rate)", 99.0, 44.0, "#FEF2F2", "#DC2626"),
        "A9": ("Kiểm tra kết nối (Test Key)\n& Giám sát vết cuộc gọi AICallLog", 99.0, 16.0, "#FEF2F2", "#DC2626"),
    }

    for uid, (title, cx, cy, bg, bd) in admin_ucs.items():
        oval = patches.Ellipse((cx, cy), rx * 2, ry * 2, edgecolor=bd, facecolor=bg, lw=1.8, zorder=4)
        ax.add_patch(oval)
        ax.text(cx, cy, title, ha='center', va='center', fontsize=8.6, fontweight='bold', color="#1E293B", zorder=5)

    # Teacher lines
    tc_pt = (19.0, 72.0)
    for uid in ["A1", "A2", "A3", "A4", "A8"]:
        _, cx, cy, _, _ = admin_ucs[uid]
        ax.plot([tc_pt[0], cx - rx], [tc_pt[1], cy], color="#059669", lw=1.35, zorder=3)

    # Admin lines (Admin có toàn quyền)
    ad_pt = (19.0, 26.0)
    for uid in ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"]:
        _, cx, cy, _, _ = admin_ucs[uid]
        ax.plot([ad_pt[0], cx - rx], [ad_pt[1], cy], color="#DC2626", lw=1.35, zorder=3)

    # A6 <<include>> A9
    ax.annotate("", xy=(99.0 - rx, 16.0), xytext=(54.0 + rx, 16.0),
                arrowprops=dict(arrowstyle="-|>", color="#DC2626", lw=1.8, ls="--", mutation_scale=14), zorder=6)
    ax.text((54.0 + rx + 99.0 - rx)/2, 18.0, "«include»", ha='center', va='bottom',
            fontsize=8.5, fontweight='bold', color="#DC2626", bbox=dict(boxstyle="round,pad=0.2", fc="#FFF1F2", ec="#FDA4AF", lw=0.9), zorder=7)

    plt.tight_layout()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, bbox_inches='tight', facecolor=fig.get_facecolor(), dpi=300)
    plt.close()
    print(f"Biểu đồ Use Case phân hệ Quản trị đã tạo tại: {output_path}")


if __name__ == "__main__":
    out_dir = "d:/Project/LearnPython/docs/bao_cao"
    os.makedirs(out_dir, exist_ok=True)
    
    # 1. Biểu đồ Use Case tổng thể toàn hệ thống
    draw_overall_usecase(os.path.join(out_dir, "so_do_usecase_tong_the.png"))
    # Copy thêm một bản tên bieu_do_usecase_tong_the.png để linh hoạt chèn báo cáo
    draw_overall_usecase(os.path.join(out_dir, "bieu_do_usecase_tong_the.png"))

    # 2. Biểu đồ Use Case chi tiết phân hệ Học viên
    draw_student_subsystem_usecase(os.path.join(out_dir, "usecase_phan_he_hoc_vien.png"))

    # 3. Biểu đồ Use Case chi tiết phân hệ Quản trị & Giảng viên
    draw_admin_subsystem_usecase(os.path.join(out_dir, "usecase_phan_he_quan_tri.png"))

    print("\n>>> TẤT CẢ 3 BIỂU ĐỒ USE CASE ĐÃ ĐƯỢC SINH THÀNH CÔNG VÀO docs/bao_cao/! <<<")

