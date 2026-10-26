import csv
import json
import sys
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

csv_path = Path(__file__).resolve().parents[2] / "data" / "synthetic_history_real_items" / "python_history.csv"
with open(csv_path, encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

new_learners = {}
for r in rows:
    if r["persona_group"] == "NEW":
        uid = r["user_id"]
        if uid not in new_learners:
            new_learners[uid] = []
        new_learners[uid].append(r)

# Sắp xếp theo tỷ lệ đúng thấp nhất để lấy học viên yếu điển hình
sorted_learners = sorted(
    new_learners.items(),
    key=lambda kv: sum(int(x["is_correct"]) for x in kv[1]) / len(kv[1])
)

uid, history = sorted_learners[0]
acc = sum(int(x["is_correct"]) for x in history) / len(history)

print(f"HỌC VIÊN ĐIỂN HÌNH: {uid}")
print(f"Tổng số bài nộp: {len(history)}")
print(f"Tỷ lệ làm đúng tổng thể: {acc:.1%}")
print("-" * 80)

# Gom nhóm theo từng buổi học (session)
sessions = []
current_session = []
prev_time = None

for step in history:
    from datetime import datetime
    t = datetime.fromisoformat(step["timestamp"])
    if prev_time and (t - prev_time).total_seconds() > 3600 * 5:  # Cách nhau > 5 tiếng là buổi học mới
        sessions.append(current_session)
        current_session = []
    current_session.append(step)
    prev_time = t

if current_session:
    sessions.append(current_session)

print(f"Số buổi học thực tế: {len(sessions)} buổi\n")

for s_idx, session in enumerate(sessions[:4], 1):
    first_step = session[0]
    last_step = session[-1]
    s_acc = sum(int(x["is_correct"]) for x in session) / len(session)
    print(f"📅 BUỔI HỌC {s_idx} ({first_step['timestamp'][:16]} -> {last_step['timestamp'][11:16]}): {len(session)} bài, Tỷ lệ đúng: {s_acc:.0%}")
    for step in session:
        status = "✅ ĐÚNG" if step["is_correct"] == "1" else f"❌ SAI ({step['error_type']})"
        print(f"   - Bước {int(step['step_index']):2d} | Lần thử {step['attempt_index']} | Kỹ năng: {step['skill_id']:<14} | Bài: {step['item_title'][:32]:<32} | Độ khó: {step['difficulty']} | {status:<18} | Thời gian: {float(step['time_taken_seconds']):.0f}s")
    print()
