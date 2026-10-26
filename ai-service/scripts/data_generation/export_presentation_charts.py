import os
from pathlib import Path
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "data" / "synthetic_history_real_items"
OUTPUT_IMG_DIR = Path("D:/Project/LearnPython/docs/slide-thuyet_trinh/images")
OUTPUT_IMG_DIR.mkdir(parents=True, exist_ok=True)

# Load datasets
dfs = {
    'python': pd.read_csv(DATA_DIR / "python_history.csv"),
    'javascript': pd.read_csv(DATA_DIR / "javascript_history.csv"),
    'cpp': pd.read_csv(DATA_DIR / "cpp_history.csv")
}

PALETTE = {
    'FAST': '#2ECC71',        # Xanh lá: Nhanh nhạy / Xuất sắc
    'RETURNING': '#3498DB',   # Xanh dương: Có nền tảng
    'STEADY': '#9B59B6',      # Tím: Chăm chỉ / Ổn định
    'TRIAL_ERROR': '#E67E22',  # Cam: Thử và sai
    'NEW': '#E74C3C'          # Đỏ: Người mới / Yếu
}
personas_order = ['NEW', 'TRIAL_ERROR', 'STEADY', 'RETURNING', 'FAST']

plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Segoe UI']

# 1. Đường cong tiến bộ nhận thức tích lũy
fig1, axes1 = plt.subplots(1, 3, figsize=(18, 5.2), sharey=True)
for idx, (lang, df) in enumerate(dfs.items()):
    ax = axes1[idx]
    for persona, color in [('FAST', '#2ECC71'), ('RETURNING', '#3498DB'), ('STEADY', '#9B59B6'), ('TRIAL_ERROR', '#E67E22'), ('NEW', '#E74C3C')]:
        sub = df[df['persona_group'] == persona].sort_values(by=['user_id', 'step_index'])
        step_acc = sub.groupby('step_index')['is_correct'].mean()
        smoothed = step_acc.rolling(window=5, min_periods=1).mean()
        ax.plot(smoothed.index, smoothed.values, label=persona, color=color, linewidth=2.5, alpha=0.9)
    ax.set_title(f"Quỹ đạo nhận thức — {lang.upper()}", fontsize=13, fontweight='bold', pad=10)
    ax.set_xlabel("Số bước bài tập (Step Index)", fontsize=11)
    if idx == 0:
        ax.set_ylabel("Tỷ lệ đúng tích lũy (Accuracy)", fontsize=11)
    ax.set_ylim(0.1, 0.95)
    ax.grid(True, linestyle='--', alpha=0.5)
    ax.legend(title="Cấp độ tư duy", loc='lower right', frameon=True, fontsize=9)
fig1.tight_layout()
p1 = OUTPUT_IMG_DIR / "01_learning_curves_3_languages.png"
fig1.savefig(p1, dpi=200, bbox_inches='tight')
plt.close(fig1)
print(f"Saved: {p1}")

# 2. Ma trận tải nhận thức: Thời gian và Tỷ lệ giải quyết bài khó
fig2, axes2 = plt.subplots(1, 3, figsize=(18, 5.5))
for idx, (lang, df) in enumerate(dfs.items()):
    ax = axes2[idx]
    time_pivot = df.pivot_table(index='persona_group', columns='difficulty', values='time_taken_seconds', aggfunc='mean').reindex(personas_order)
    acc_pivot = df.pivot_table(index='persona_group', columns='difficulty', values='is_correct', aggfunc='mean').reindex(personas_order)
    
    x = np.arange(len(personas_order))
    width = 0.25
    ax.bar(x - width, time_pivot[1] / 60, width, label='Dễ (d=1)', color='#85C1E9', alpha=0.85)
    ax.bar(x, time_pivot[2] / 60, width, label='TB (d=2)', color='#F8C471', alpha=0.85)
    ax.bar(x + width, time_pivot[3] / 60, width, label='Khó (d=3)', color='#F1948A', alpha=0.85)
    
    ax.set_title(f"Thời gian tư duy & Tải nhận thức — {lang.upper()}", fontsize=12, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(personas_order, rotation=15, fontsize=10)
    ax.set_ylabel("Thời gian trung bình (Phút)", fontsize=11)
    ax.set_ylim(0, 16)
    ax.grid(True, linestyle='--', alpha=0.4)
    
    ax2 = ax.twinx()
    ax2.plot(x, acc_pivot[3] * 100, color='#C0392B', marker='o', linewidth=2.2, label='Đúng bài khó (%)')
    ax2.set_ylim(0, 100)
    if idx == 2:
        ax2.set_ylabel("Tỷ lệ đúng bài Khó (%)", color='#C0392B', fontsize=11)
    else:
        ax2.set_yticklabels([])
    if idx == 0:
        l1, lab1 = ax.get_legend_handles_labels()
        l2, lab2 = ax2.get_legend_handles_labels()
        ax.legend(l1 + l2, lab1 + lab2, loc='upper left', fontsize=9, frameon=True)
fig2.tight_layout()
p2 = OUTPUT_IMG_DIR / "02_cognitive_load_and_difficulty.png"
fig2.savefig(p2, dpi=200, bbox_inches='tight')
plt.close(fig2)
print(f"Saved: {p2}")

# 3. Mức độ hấp thụ tri thức theo 4 tầng kiến thức
fig3, axes3 = plt.subplots(1, 3, figsize=(18, 5.2), sharey=True)
def categorize_skill(skill_id):
    s = str(skill_id).upper()
    if any(k in s for k in ['BASIC', 'TYPE', 'INTRO', 'PRINT']):
        return 'T1: Cú pháp'
    elif any(k in s for k in ['FLOW', 'LOOP', 'COND', 'IF', 'WHILE', 'EXEC']):
        return 'T2: Điều khiển'
    elif any(k in s for k in ['LIST', 'ARRAY', 'STRING', 'DICT', 'VECTOR', 'MEM']):
        return 'T3: CTDL'
    else:
        return 'T4: Nâng cao'

tiers = ['T1: Cú pháp', 'T2: Điều khiển', 'T3: CTDL', 'T4: Nâng cao']
for idx, (lang, df) in enumerate(dfs.items()):
    ax = axes3[idx]
    df['tier'] = df['skill_id'].apply(categorize_skill)
    tier_pivot = df.pivot_table(index='persona_group', columns='tier', values='is_correct', aggfunc='mean').reindex(personas_order)[tiers]
    
    x = np.arange(len(tiers))
    width = 0.15
    for p_idx, persona in enumerate(personas_order):
        vals = tier_pivot.loc[persona].values * 100
        ax.bar(x + (p_idx - 2) * width, vals, width, label=persona, color=PALETTE[persona], alpha=0.9)
    ax.set_title(f"Hấp thụ theo tầng kỹ năng — {lang.upper()}", fontsize=12, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(tiers, fontsize=10)
    if idx == 0:
        ax.set_ylabel("Tỷ lệ làm đúng (%)", fontsize=11)
    ax.set_ylim(0, 100)
    ax.grid(True, linestyle='--', alpha=0.4)
    if idx == 0:
        ax.legend(title="Cấp độ", loc='upper right', fontsize=9, frameon=True)
fig3.tight_layout()
p3 = OUTPUT_IMG_DIR / "03_curriculum_tier_mastery.png"
fig3.savefig(p3, dpi=200, bbox_inches='tight')
plt.close(fig3)
print(f"Saved: {p3}")

# 4. Phân loại rào cản nhận thức & danh mục lỗi sai
fig4, axes4 = plt.subplots(1, 3, figsize=(18, 5.2))
for idx, (lang, df) in enumerate(dfs.items()):
    ax = axes4[idx]
    err_df = df[df['error_type'] != 'NONE']
    top_errors = err_df['error_type'].value_counts().head(5).index.tolist()
    new_err = err_df[err_df['persona_group'] == 'NEW']['error_type'].value_counts().reindex(top_errors, fill_value=0)
    fast_err = err_df[err_df['persona_group'] == 'FAST']['error_type'].value_counts().reindex(top_errors, fill_value=0)
    
    x = np.arange(len(top_errors))
    width = 0.35
    ax.bar(x - width/2, new_err.values, width, label='Nhóm Yếu (NEW)', color='#E74C3C', alpha=0.85)
    ax.bar(x + width/2, fast_err.values, width, label='Nhóm Giỏi (FAST)', color='#2ECC71', alpha=0.85)
    ax.set_title(f"Tần suất lỗi sai điển hình — {lang.upper()}", fontsize=12, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(top_errors, rotation=20, fontsize=9)
    ax.set_ylabel("Số lượt nộp dính lỗi", fontsize=11)
    ax.grid(True, linestyle='--', alpha=0.4)
    ax.legend(frameon=True, fontsize=9)
fig4.tight_layout()
p4 = OUTPUT_IMG_DIR / "04_error_bottlenecks_comparison.png"
fig4.savefig(p4, dpi=200, bbox_inches='tight')
plt.close(fig4)
print(f"Saved: {p4}")

# 5. Tỷ lệ sửa sai thành công
fig5, axes5 = plt.subplots(1, 3, figsize=(18, 5.2), sharey=True)
for idx, (lang, df) in enumerate(dfs.items()):
    ax = axes5[idx]
    retry_df = df[df['attempt_index'] > 1]
    retry_recovery = retry_df.groupby('persona_group')['is_correct'].mean().reindex(personas_order) * 100
    bars = ax.bar(personas_order, retry_recovery.values, color=[PALETTE[p] for p in personas_order], alpha=0.88, width=0.55)
    ax.set_title(f"Tỷ lệ sửa sai thành công (Attempt > 1) — {lang.upper()}", fontsize=12, fontweight='bold')
    ax.set_ylabel("Tỷ lệ đúng khi nộp lại (%)" if idx == 0 else "", fontsize=11)
    ax.set_ylim(0, 100)
    ax.grid(True, linestyle='--', alpha=0.4)
    for bar in bars:
        h = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., h + 2, f"{h:.1f}%", ha='center', va='bottom', fontsize=9, fontweight='bold')
fig5.tight_layout()
p5 = OUTPUT_IMG_DIR / "05_retry_recovery_rates.png"
fig5.savefig(p5, dpi=200, bbox_inches='tight')
plt.close(fig5)
print(f"Saved: {p5}")

print("All 5 presentation charts exported successfully!")
