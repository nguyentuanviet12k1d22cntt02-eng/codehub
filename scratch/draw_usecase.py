import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

def draw_usecase_diagram(output_path):
    # Setup canvas
    fig, ax = plt.subplots(figsize=(13, 9), dpi=300)
    ax.set_xlim(0, 130)
    ax.set_ylim(0, 100)
    ax.axis('off')

    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')

    # System boundary box
    system_box = patches.FancyBboxPatch(
        (28, 4), 74, 91,
        boxstyle="round,pad=1,rounding_size=2",
        edgecolor="#0F172A", facecolor="#F8FAFC", linewidth=2.0
    )
    ax.add_patch(system_box)

    # Title of system
    ax.text(65, 91, "PHÂN HỆ SÂN CHƠI THUẬT TOÁN (PRACTICE ARENA)", 
            ha='center', va='center', fontsize=12, fontweight='bold', color='#0F172A',
            bbox=dict(boxstyle="square,pad=0.4", fc="#E2E8F0", ec="#64748B", lw=1.2))

    # Helper function for Actor
    def draw_actor(x, y, name, role_desc):
        head = plt.Circle((x, y + 4.2), 2.0, edgecolor='#0F172A', facecolor='#E2E8F0', lw=2.2)
        ax.add_patch(head)
        ax.plot([x, x], [y + 2.2, y - 2.8], color='#0F172A', lw=2.2)
        ax.plot([x - 3.2, x + 3.2], [y + 0.8, y + 0.8], color='#0F172A', lw=2.2)
        ax.plot([x, x - 2.8], [y - 2.8, y - 7.5], color='#0F172A', lw=2.2)
        ax.plot([x, x + 2.8], [y - 2.8, y - 7.5], color='#0F172A', lw=2.2)
        ax.text(x, y - 9.5, name, ha='center', va='top', fontsize=11, fontweight='bold', color='#0F172A')
        ax.text(x, y - 12.5, role_desc, ha='center', va='top', fontsize=9, fontstyle='italic', color='#475569')

    # Primary Actor: Student (Left)
    draw_actor(14, 52, "Học Viên", "(Student)")

    # Secondary Actor: Sandbox Engine (Right)
    draw_actor(116, 28, "Sandbox Judge", "(Hệ thống Chấm)")

    # Secondary Actor: Admin/Teacher (Top Right)
    draw_actor(116, 75, "Quản Trị / GV", "(Admin / Teacher)")

    # Layout of Use Cases:
    # 2 Columns inside boundary box:
    # Left column (x=49) for Learner flows
    # Right column (x=83) for Execution & Filtering / Management
    
    usecases = {
        "UC01": ("Tìm kiếm & Lọc bài tập\n(Độ khó, Thẻ kỹ năng, Trạng thái)", 50, 81, 15, 4.2, "#EFF6FF", "#2563EB"),
        "UC02": ("Xem chi tiết đề bài\n& Ràng buộc tài nguyên", 50, 67, 15, 4.2, "#EFF6FF", "#2563EB"),
        "UC03": ("Soạn thảo giải thuật\n(Monaco Editor đa ngôn ngữ)", 50, 53, 15, 4.2, "#EFF6FF", "#2563EB"),
        "UC04": ("Chạy thử nghiệm với\nTestcase tùy chỉnh", 50, 39, 15, 4.2, "#EFF6FF", "#2563EB"),
        "UC05": ("Nộp bài giải thuật\nchấm điểm chính thức", 50, 25, 15, 4.2, "#EFF6FF", "#2563EB"),
        "UC06": ("Xem bảng phân tích kết quả\n& Xếp hạng Beats %", 50, 11, 15, 4.2, "#EFF6FF", "#2563EB"),
        
        # Right Column
        "UC07": ("Biên dịch & Chạy mã\ntrong Sandbox cô lập", 83, 25, 14.5, 4.2, "#FEF3C7", "#D97706"),
        "UC08": ("Quản trị ngân hàng bài tập\n& Bộ Testcases ẩn/hiện", 83, 75, 14.5, 4.2, "#F1F5F9", "#64748B"),
    }

    # Draw all ellipses
    for uid, (text, cx, cy, rx, ry, bg, border) in usecases.items():
        ellipse = patches.Ellipse((cx, cy), rx * 2, ry * 2, edgecolor=border, facecolor=bg, linewidth=1.8)
        ax.add_patch(ellipse)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=9.2, fontweight='bold', color='#1E293B', linespacing=1.2)

    # Actor lines: Student -> UC01, UC02, UC03, UC04, UC05, UC06
    student_pt = (17, 52)
    for uid in ["UC01", "UC02", "UC03", "UC04", "UC05", "UC06"]:
        _, cx, cy, rx, ry, _, _ = usecases[uid]
        ax.plot([student_pt[0], cx - rx], [student_pt[1], cy], color="#334155", lw=1.3)

    # Admin lines: Admin -> UC08, UC01
    admin_pt = (113, 75)
    # to UC08
    _, cx8, cy8, rx8, ry8, _, _ = usecases["UC08"]
    ax.plot([admin_pt[0], cx8 + rx8], [admin_pt[1], cy8], color="#475569", lw=1.3)
    # to UC01
    _, cx1, cy1, rx1, ry1, _, _ = usecases["UC01"]
    ax.plot([admin_pt[0], cx1 + rx1], [admin_pt[1], cy1], color="#475569", lw=1.1, ls=":")

    # UC05 <<include>> UC07
    _, cx5, cy5, rx5, ry5, _, _ = usecases["UC05"]
    _, cx7, cy7, rx7, ry7, _, _ = usecases["UC07"]
    
    # Arrow from UC05 (Submit) to UC07 (Sandbox)
    ax.annotate("", xy=(cx7 - rx7, cy7), xytext=(cx5 + rx5, cy5),
                arrowprops=dict(arrowstyle="->", color="#DC2626", lw=1.8, ls="--"))
    ax.text((cx5 + rx5 + cx7 - rx7)/2, cy5 + 1.8, "<<include>>", 
            ha='center', va='bottom', fontsize=8.5, fontweight='bold', color="#DC2626")

    # Sandbox Judge lines: Sandbox Judge -> UC07
    judge_pt = (113, 28)
    ax.plot([judge_pt[0], cx7 + rx7], [judge_pt[1], cy7], color="#B45309", lw=1.4)

    # Output Arrow from UC05 down to UC06
    ax.annotate("", xy=(cx5, cy5 - ry5 - 0.3), xytext=(cx5, 15.5),
                arrowprops=dict(arrowstyle="<-", color="#2563EB", lw=1.5, ls=":"))
    ax.text(cx5 + 1.0, 18.0, "sinh kết quả", ha='left', va='center', fontsize=8, fontstyle='italic', color="#2563EB")

    plt.tight_layout()
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none', dpi=300)
    plt.close()
    print(f"Diagram updated at {output_path}")

if __name__ == "__main__":
    draw_usecase_diagram("d:/Project/LearnPython/docs/features/usecase_practice_arena.png")
