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

PERSONA_COLORS = {
    'FAST': '#10B981',        # Emerald Green: Xuất sắc
    'RETURNING': '#2563EB',   # Royal Blue: Có nền tảng
    'STEADY': '#8B5CF6',      # Violet: Chăm chỉ / Kiên trì
    'TRIAL_ERROR': '#F59E0B',  # Amber: Thử và sai
    'NEW': '#EF4444'          # Crimson Red: Người mới
}
PERSONAS_ORDER = ['NEW', 'TRIAL_ERROR', 'STEADY', 'RETURNING', 'FAST']

plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Segoe UI']
plt.rcParams['text.color'] = '#1E293B'
plt.rcParams['axes.labelcolor'] = '#1E293B'
plt.rcParams['xtick.color'] = '#475569'
plt.rcParams['ytick.color'] = '#475569'

# ==========================================
# 1. Đường cong tiến bộ nhận thức tích lũy (3 rows)
# ==========================================
fig1, axes1 = plt.subplots(3, 1, figsize=(10.5, 9.6), sharex=True, sharey=True)
for idx, (lang, df) in enumerate(dfs.items()):
    ax = axes1[idx]
    for persona in PERSONAS_ORDER:
        sub = df[df['persona_group'] == persona].sort_values(by=['user_id', 'step_index'])
        step_acc = sub.groupby('step_index')['is_correct'].mean()
        smoothed = step_acc.rolling(window=5, min_periods=1).mean()
        ax.plot(smoothed.index, smoothed.values, label=persona, color=PERSONA_COLORS[persona], linewidth=2.5, alpha=0.95)
    
    overall_acc = df['is_correct'].mean() * 100
    ax.set_title(f"Quỹ Đạo Nhận Thức — {lang.upper()} (Độ chính xác trung bình: {overall_acc:.1f}%)", 
                 fontsize=12, fontweight='bold', color='#0F172A', pad=6)
    ax.set_ylabel("Tỷ lệ đúng (Acc)", fontsize=10, fontweight='semibold')
    ax.set_ylim(0.15, 0.95)
    ax.grid(True, linestyle='--', alpha=0.45, color='#CBD5E1')
    if idx == 0:
        ax.legend(title="Nhóm năng lực", loc='upper left', frameon=True, facecolor='#FFFFFF', edgecolor='#CBD5E1', fontsize=9, ncol=5)
axes1[-1].set_xlabel("Số bước bài tập tuần tự (Step Index: 1 → 100)", fontsize=11, fontweight='semibold')
fig1.tight_layout()
p1 = OUTPUT_IMG_DIR / "01_learning_curves_3_languages.png"
fig1.savefig(p1, dpi=200, bbox_inches='tight', facecolor='#FFFFFF')
plt.close(fig1)
print(f"Generated: {p1}")

# ==========================================
# 2. Ma trận tải nhận thức: Thời gian và Tỷ lệ giải quyết bài khó (3 rows)
# ==========================================
fig2, axes2 = plt.subplots(3, 1, figsize=(10.5, 9.6), sharex=True)
for idx, (lang, df) in enumerate(dfs.items()):
    ax = axes2[idx]
    time_pivot = df.pivot_table(index='persona_group', columns='difficulty', values='time_taken_seconds', aggfunc='mean').reindex(PERSONAS_ORDER)
    acc_pivot = df.pivot_table(index='persona_group', columns='difficulty', values='is_correct', aggfunc='mean').reindex(PERSONAS_ORDER)
    
    x = np.arange(len(PERSONAS_ORDER))
    width = 0.25
    ax.bar(x - width, time_pivot[1] / 60, width, label='Dễ (d=1)', color='#93C5FD', alpha=0.9)
    ax.bar(x, time_pivot[2] / 60, width, label='TB (d=2)', color='#FCD34D', alpha=0.9)
    ax.bar(x + width, time_pivot[3] / 60, width, label='Khó (d=3)', color='#FCA5A5', alpha=0.9)
    
    ax.set_title(f"Tải Nhận Thức & Thời Gian Làm Bài — {lang.upper()}", fontsize=12, fontweight='bold', color='#0F172A', pad=6)
    ax.set_ylabel("Thời gian (Phút)", fontsize=10, fontweight='semibold')
    ax.set_ylim(0, 16)
    ax.grid(True, linestyle='--', alpha=0.45, color='#CBD5E1')
    
    ax2 = ax.twinx()
    ax2.plot(x, acc_pivot[3] * 100, color='#DC2626', marker='o', linewidth=2.4, label='Đúng bài khó (%)')
    ax2.set_ylim(0, 100)
    ax2.set_ylabel("Đúng bài Khó (%)", color='#DC2626', fontsize=10, fontweight='semibold')
    
    if idx == 0:
        l1, lab1 = ax.get_legend_handles_labels()
        l2, lab2 = ax2.get_legend_handles_labels()
        ax.legend(l1 + l2, lab1 + lab2, loc='upper left', fontsize=9, ncol=4, frameon=True, facecolor='#FFFFFF')
axes2[-1].set_xticks(range(len(PERSONAS_ORDER)))
axes2[-1].set_xticklabels(PERSONAS_ORDER, fontsize=10, fontweight='semibold')
axes2[-1].set_xlabel("Nhóm học viên (NEW → TRIAL → STEADY → RETURNING → FAST)", fontsize=11, fontweight='semibold')
fig2.tight_layout()
p2 = OUTPUT_IMG_DIR / "02_cognitive_load_and_difficulty.png"
fig2.savefig(p2, dpi=200, bbox_inches='tight', facecolor='#FFFFFF')
plt.close(fig2)
print(f"Generated: {p2}")

# ==========================================
# 3. Mức độ hấp thụ tri thức theo 4 tầng kiến thức (3 rows)
# ==========================================
fig3, axes3 = plt.subplots(3, 1, figsize=(10.5, 9.6), sharex=True, sharey=True)
def categorize_skill(skill_id):
    s = str(skill_id).upper()
    if any(k in s for k in ['BASIC', 'TYPE', 'INTRO', 'PRINT']):
        return 'T1: Cú pháp'
    elif any(k in s for k in ['FLOW', 'LOOP', 'COND', 'IF', 'WHILE', 'EXEC']):
        return 'T2: Điều khiển'
    elif any(k in s for k in ['LIST', 'ARRAY', 'STRING', 'DICT', 'VECTOR', 'MEM']):
        return 'T3: CTDL'
    else:
        return 'T4: Thuật toán'

tiers = ['T1: Cú pháp', 'T2: Điều khiển', 'T3: CTDL', 'T4: Thuật toán']

for idx, (lang, df) in enumerate(dfs.items()):
    ax = axes3[idx]
    df_copy = df.copy()
    df_copy['tier'] = df_copy['skill_id'].apply(categorize_skill)
    tier_pivot = df_copy.pivot_table(index='tier', columns='persona_group', values='is_correct', aggfunc='mean').reindex(tiers)[PERSONAS_ORDER]
    
    x = np.arange(len(tiers))
    width = 0.16
    for p_idx, persona in enumerate(PERSONAS_ORDER):
        ax.bar(x + (p_idx - 2) * width, tier_pivot[persona] * 100, width, label=persona, color=PERSONA_COLORS[persona], alpha=0.9)
    
    ax.set_title(f"Hấp Thụ 4 Tầng Kiến Thức — {lang.upper()}", fontsize=12, fontweight='bold', color='#0F172A', pad=6)
    ax.set_ylabel("Tỷ lệ làm chủ (%)", fontsize=10, fontweight='semibold')
    ax.set_ylim(0, 100)
    ax.grid(True, linestyle='--', alpha=0.45, color='#CBD5E1')
    if idx == 0:
        ax.legend(title="Nhóm học viên", loc='upper right', frameon=True, facecolor='#FFFFFF', edgecolor='#CBD5E1', fontsize=9, ncol=5)

axes3[-1].set_xticks(range(len(tiers)))
axes3[-1].set_xticklabels(tiers, fontsize=11, fontweight='bold')
axes3[-1].set_xlabel("4 Tầng Kiến Thức Trong Khung Chương Trình Đào Tạo Mcode", fontsize=11, fontweight='semibold')
fig3.tight_layout()
p3 = OUTPUT_IMG_DIR / "03_curriculum_tier_mastery.png"
fig3.savefig(p3, dpi=200, bbox_inches='tight', facecolor='#FFFFFF')
plt.close(fig3)
print(f"Generated: {p3}")

# ==========================================
# 4. Phân tích rào cản lỗi sai (Bottlenecks) giữa NEW và FAST (3 rows)
# ==========================================
fig4, axes4 = plt.subplots(3, 1, figsize=(10.5, 9.6), sharex=True)
for idx, (lang, df) in enumerate(dfs.items()):
    ax = axes4[idx]
    df_err = df[df['is_correct'] == 0]
    
    new_err = df_err[df_err['persona_group'] == 'NEW']['error_type'].value_counts(normalize=True)
    fast_err = df_err[df_err['persona_group'] == 'FAST']['error_type'].value_counts(normalize=True)
    
    all_err_types = ['syntax_error', 'runtime_error', 'logic_error', 'time_limit_exceeded']
    labels = ['Cú pháp (Syntax)', 'Thời thi (Runtime)', 'Sai logic (Logic)', 'Quá giờ (TLE)']
    
    new_vals = [new_err.get(e, 0.0) * 100 for e in all_err_types]
    fast_vals = [fast_err.get(e, 0.0) * 100 for e in all_err_types]
    
    x = np.arange(len(all_err_types))
    width = 0.35
    ax.bar(x - width/2, new_vals, width, label='Nhóm Mới (NEW)', color='#EF4444', alpha=0.9)
    ax.bar(x + width/2, fast_vals, width, label='Nhóm Giỏi (FAST)', color='#10B981', alpha=0.9)
    
    ax.set_title(f"Cơ Cấu Lỗi Sai Giữa Nhóm Yếu và Nhóm Giỏi — {lang.upper()}", fontsize=12, fontweight='bold', color='#0F172A', pad=6)
    ax.set_ylabel("Tỷ lệ phân bổ (%)", fontsize=10, fontweight='semibold')
    ax.set_ylim(0, 60)
    ax.grid(True, linestyle='--', alpha=0.45, color='#CBD5E1')
    if idx == 0:
        ax.legend(loc='upper right', frameon=True, facecolor='#FFFFFF', edgecolor='#CBD5E1', fontsize=9.5)

axes4[-1].set_xticks(range(len(labels)))
axes4[-1].set_xticklabels(labels, fontsize=11, fontweight='semibold')
axes4[-1].set_xlabel("Loại lỗi hệ thống ghi nhận được từ Sandbox chấm code tự động", fontsize=11, fontweight='semibold')
fig4.tight_layout()
p4 = OUTPUT_IMG_DIR / "04_error_bottlenecks_comparison.png"
fig4.savefig(p4, dpi=200, bbox_inches='tight', facecolor='#FFFFFF')
plt.close(fig4)
print(f"Generated: {p4}")

# ==========================================
# 5. Độ kiên trì & Tỷ lệ sửa sai (3 rows)
# ==========================================
fig5, axes5 = plt.subplots(3, 1, figsize=(10.5, 9.6), sharex=True, sharey=True)
attempts = [1, 2, 3, 4]

for idx, (lang, df) in enumerate(dfs.items()):
    ax = axes5[idx]
    df_attempts = df[df['attempt_index'].isin(attempts)]
    att_pivot = df_attempts.pivot_table(index='attempt_index', columns='persona_group', values='is_correct', aggfunc='mean').reindex(attempts)[PERSONAS_ORDER]
    
    for persona in PERSONAS_ORDER:
        ax.plot(attempts, att_pivot[persona] * 100, marker='o', linewidth=2.5, label=persona, color=PERSONA_COLORS[persona])
    
    ax.set_title(f"Tỷ Lệ Vượt Qua Bài Khi Thử Lại (Attempts 1 → 4) — {lang.upper()}", fontsize=12, fontweight='bold', color='#0F172A', pad=6)
    ax.set_ylabel("Tỷ lệ đúng (%)", fontsize=10, fontweight='semibold')
    ax.set_ylim(10, 95)
    ax.grid(True, linestyle='--', alpha=0.45, color='#CBD5E1')
    if idx == 0:
        ax.legend(title="Nhóm học viên", loc='lower right', frameon=True, facecolor='#FFFFFF', edgecolor='#CBD5E1', fontsize=9, ncol=5)

axes5[-1].set_xticks(attempts)
axes5[-1].set_xticklabels([f"Lần nộp {a}" for a in attempts], fontsize=11, fontweight='semibold')
axes5[-1].set_xlabel("Số lần sửa đổi & nộp lại bài tập qua Sandbox", fontsize=11, fontweight='semibold')
fig5.tight_layout()
p5 = OUTPUT_IMG_DIR / "05_retry_recovery_rates.png"
fig5.savefig(p5, dpi=200, bbox_inches='tight', facecolor='#FFFFFF')
plt.close(fig5)
print(f"Generated: {p5}")
print("All aspect-matched charts successfully generated!")
