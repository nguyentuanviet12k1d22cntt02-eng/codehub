import csv
import json
from pathlib import Path
from collections import Counter

root = Path(__file__).resolve().parents[2] / "data" / "synthetic_history_real_items"

total_interactions = 0
total_learners = 0

import sys
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

print("=" * 65)
print("     BAO CAO KIEM DINH TAP DU LIEU GIA LAP (900 HOC VIEN)     ")
print("=" * 65)

for lang in ["python", "javascript", "cpp"]:
    csv_file = root / f"{lang}_history.csv"
    meta_file = root / f"{lang}_metadata.json"
    
    with open(csv_file, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    with open(meta_file, encoding="utf-8") as f:
        meta = json.load(f)
        
    users = sorted(list({r["user_id"] for r in rows}))
    n_users = len(users)
    n_rows = len(rows)
    total_interactions += n_rows
    total_learners += n_users
    
    persona_counts = Counter(r["persona_group"] for r in rows)
    user_personas = Counter(u.split("_")[2].upper() for u in users)
    
    acc = sum(int(r["is_correct"]) for r in rows) / n_rows
    
    times_d1 = [float(r["time_taken_seconds"]) for r in rows if r["difficulty"] == "1"]
    times_d2 = [float(r["time_taken_seconds"]) for r in rows if r["difficulty"] == "2"]
    times_d3 = [float(r["time_taken_seconds"]) for r in rows if r["difficulty"] == "3"]
    
    timestamps = [r["timestamp"] for r in rows]
    min_date = min(timestamps)[:10]
    max_date = max(timestamps)[:10]
    
    print(f"\n📘 NGÔN NGỮ: {lang.upper()}")
    print(f"  - Số học viên giả lập: {n_users} (Mục tiêu: 300) -> {'✅ ĐẠT' if n_users == 300 else '❌'}")
    print(f"  - Phân bổ 5 Personas:  {dict(user_personas)}")
    print(f"  - Tổng lượt tương tác: {n_rows:,} bài nộp")
    print(f"  - Tỉ lệ làm đúng (Acc): {acc:.1%}")
    print(f"  - Khoảng thời gian:    {min_date} đến {max_date}")
    print(f"  - Thời gian TB bài dễ:  {sum(times_d1)/len(times_d1):.1f}s (~{sum(times_d1)/len(times_d1)/60:.1f} phút)")
    if times_d2:
        print(f"  - Thời gian TB bài TB:  {sum(times_d2)/len(times_d2):.1f}s (~{sum(times_d2)/len(times_d2)/60:.1f} phút)")
    if times_d3:
        print(f"  - Thời gian TB bài khó: {sum(times_d3)/len(times_d3):.1f}s (~{sum(times_d3)/len(times_d3)/60:.1f} phút)")
    print(f"  - Bài tập thật quan sát:{meta['items_observed']}/{meta['catalog_items']} items")

print("\n" + "=" * 65)
print(f"TỔNG KẾT: {total_learners} HỌC VIÊN | {total_interactions:,} LƯỢT TƯƠNG TÁC")
print("=" * 65)
