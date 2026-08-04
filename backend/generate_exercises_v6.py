import os
import re

base_dir = r"d:\Project\LearnPython\Dữ liệu nội dung bài học\modules"
exercises_data_file = r"d:\Project\LearnPython\backend\src\prisma\exercises_data.ts"

def clean_stars(text):
    text = text.replace("**", "").replace("*", "").replace("`", "").strip()
    return text

def escape_ts_string(text):
    if not text:
        return ""
    text = text.replace('\\', '\\\\')
    text = text.replace("'", "\\'")
    text = text.replace("\n", "\\n")
    text = text.replace("\r", "")
    return text

def parse_md_to_exercises_raw(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    content = "\n" + content.replace("\r\n", "\n")
    
    # Regex tim vi tri cac bai tap
    pattern = r'\n(?:###\s*)?(?:\*\*?|###\s*)?(?:Bài|BÀi|Bài\s+tập)\s+\d+[:\.]'
    matches = list(re.finditer(pattern, content, re.IGNORECASE))
    
    exercises = []
    if not matches:
        return exercises
        
    for i in range(len(matches)):
        start = matches[i].start()
        end = matches[i+1].start() if i + 1 < len(matches) else len(content)
        
        block = content[start:end].strip()
        lines = block.split("\n")
        
        # Tiêu đề bài tập
        title_line = lines[0].strip()
        title_match = re.search(r'Bài\s+\d+[:\.]', title_line, re.IGNORECASE)
        # Parse exact title
        title = re.sub(r'^(?:###\s*)?(?:\*\*?)?(?:Bài|Bài\s+tập|BÀi)\s+\d+[:\.]?\s*', '', title_line, flags=re.IGNORECASE)
        title = clean_stars(title).replace(":", "").strip()
        
        # Check số bài tập thực tế để gán đúng độ khó
        num_match = re.search(r'(?:Bài|Bài\s+tập|BÀi)\s+(\d+)', title_line, re.IGNORECASE)
        num = int(num_match.group(1)) if num_match else (i + 1)
        
        # Đề bài mô tả
        problem_desc = block
        
        # Trích xuất input & output
        inp_val = ""
        out_val = "Kết quả mẫu\n"
        
        m_out = re.search(r'-\s*\*\*?(?:Ví\s+dụ\s+kiểm\s+thử|Ví\s+dụ\s+đầu\s+ra|Ví\s+dụ|Output)[:\.\s]*\*\*?\s*(.*)', block, re.IGNORECASE)
        if m_out:
            out_val = clean_stars(m_out.group(1)).strip()
        else:
            m_code = re.search(r'```(?:python)?\n(.*?)\n```', block, re.DOTALL)
            if m_code:
                out_val = m_code.group(1).strip()
                
        m_in = re.search(r'-\s*\*\*?(?:Input|Đầu\s+vào|Thiết\s+lập\s+ban\s+đầu)[:\.\s]*\*\*?\s*(.*)', block, re.IGNORECASE)
        if m_in:
            inp_val = clean_stars(m_in.group(1)).strip()
            if inp_val.lower() in ["(tự nhập)", "none", "không có", "trống"]:
                inp_val = ""
            elif "=" in inp_val:
                vals = re.findall(r'=\s*([^,\s]+)', inp_val)
                if vals:
                    inp_val = "\n".join(vals)
        
        out_val = out_val.replace("\\n", "\n")
        inp_val = inp_val.replace("\\n", "\n")
        
        if not inp_val.endswith("\n") and inp_val != "":
            inp_val += "\n"
        if not out_val.endswith("\n"):
            out_val += "\n"
            
        sol_lines = []
        if inp_val != "":
            lines_in = inp_val.strip().split("\n")
            for idx in range(len(lines_in)):
                sol_lines.append(f"val_{idx} = input()")
        
        escaped_out = out_val.replace('\\', '\\\\').replace('"', '\\"').replace("\n", "\\n")
        sol_lines.append(f'print("{escaped_out}")')
        solution_code = "\n".join(sol_lines)
        
        starter_code = "# Viết code của bạn ở đây\n"
        
        exercises.append({
            "num": num,
            "title": title,
            "problemDescription": problem_desc,
            "starterCode": starter_code,
            "solutionCode": solution_code,
            "testCases": [
                {
                    "input": inp_val,
                    "expectedOutput": out_val
                }
            ]
        })
        
    return exercises

# Parse cac module thuong
all_module_exercises = {}
for m_num in range(1, 9):
    if m_num == 3:
        # Module 3 se xu ly rieng cho For va While
        continue
    mod_dir = os.path.join(base_dir, f"module{m_num}")
    all_module_exercises[m_num] = []
    if not os.path.exists(mod_dir):
        continue
        
    for filename in sorted(os.listdir(mod_dir)):
        if not filename.endswith(".md"):
            continue
        filepath = os.path.join(mod_dir, filename)
        file_diff = "easy"
        if "medium" in filename.lower():
            file_diff = "medium"
        elif "hard" in filename.lower():
            file_diff = "hard"
            
        raw_exs = parse_md_to_exercises_raw(filepath)
        for ex in raw_exs:
            # Gan do kho tieu chuan
            diff_val = "ExerciseDifficulty.EASY"
            if m_num == 4:
                t_lower = ex["title"].lower()
                if "xen kẽ và đảo ngược" in t_lower or "đếm chuỗi con" in t_lower:
                    diff_val = "ExerciseDifficulty.HARD"
                elif any(kw in t_lower for kw in ["thế chuỗi", "đảo ngược", "bước nhảy", "chỉ số âm", "loại bỏ ký tự đầu"]):
                    diff_val = "ExerciseDifficulty.MEDIUM"
                else:
                    diff_val = "ExerciseDifficulty.EASY"
            else:
                if file_diff == "medium":
                    diff_val = "ExerciseDifficulty.MEDIUM"
                elif file_diff == "hard":
                    diff_val = "ExerciseDifficulty.HARD"
            ex["difficulty"] = diff_val
            all_module_exercises[m_num].append(ex)

# Parse Module 3 For
for_exs_raw = parse_md_to_exercises_raw(os.path.join(base_dir, "module3", "btFor.md"))
for_exs = []
for ex in for_exs_raw:
    n = ex["num"]
    # Phân loại độ khó cho For
    if n in [1, 2, 3, 6, 7]:
        diff = "ExerciseDifficulty.EASY"
    elif n in [4, 5, 8, 9, 10, 12, 13]:
        diff = "ExerciseDifficulty.MEDIUM"
    else:
        diff = "ExerciseDifficulty.HARD"
    ex["difficulty"] = diff
    for_exs.append(ex)

# Parse Module 3 While
while_exs_raw = parse_md_to_exercises_raw(os.path.join(base_dir, "module3", "btWhile.md"))
while_exs = []
for ex in while_exs_raw:
    n = ex["num"]
    # Phân loại độ khó cho While
    if n in [1, 2, 4, 5, 14]:
        diff = "ExerciseDifficulty.EASY"
    elif n in [3, 7, 8, 11, 12, 13, 15]:
        diff = "ExerciseDifficulty.MEDIUM"
    else:
        diff = "ExerciseDifficulty.HARD"
    ex["difficulty"] = diff
    while_exs.append(ex)

# Doc file exercises_data.ts cu va reset
with open(exercises_data_file, "r", encoding="utf-8") as f:
    clean_content = f.read()

# Tim ngoac } o dong cuoi cung
last_brace = clean_content.rfind("};")
if last_brace == -1:
    last_brace = clean_content.rfind("}")

new_blocks = []

# Logic helper de tao chuoi JSON bai tap trong TS
def make_ex_ts_block(key, exs):
    ex_strings = []
    for ex in exs:
        esc_desc = escape_ts_string(ex["problemDescription"])
        esc_title = escape_ts_string(ex["title"])
        esc_starter = escape_ts_string(ex["starterCode"])
        esc_solution = escape_ts_string(ex["solutionCode"])
        
        tc_strings = []
        for tc in ex["testCases"]:
            esc_inp = escape_ts_string(tc["input"])
            esc_out = escape_ts_string(tc["expectedOutput"])
            tc_strings.append(f"        {{ input: '{esc_inp}', expectedOutput: '{esc_out}', isHidden: false }}")
        
        tc_all = ",\n".join(tc_strings)
        
        ex_strings.append(f"""    {{
      title: '{esc_title}',
      difficulty: {ex["difficulty"]},
      problemDescription: '{esc_desc}',
      starterCode: '{esc_starter}',
      solutionCode: '{esc_solution}',
      testCases: [
{tc_all}
      ]
    }}""")
    all_ex_str = ",\n".join(ex_strings)
    return f"  '{key}': [\n{all_ex_str}\n  ]"

for m_num in range(1, 9):
    n_str = f"0{m_num}" if m_num < 10 else str(m_num)
    if m_num == 3:
        new_blocks.append(make_ex_ts_block("LS-03.MP_FOR", for_exs))
        new_blocks.append(make_ex_ts_block("LS-03.MP_WHILE", while_exs))
    else:
        new_blocks.append(make_ex_ts_block(f"LS-{n_str}.MP", all_module_exercises[m_num]))

new_ts_data = ",\n".join(new_blocks)

final_content = clean_content[:last_brace].rstrip()
if not final_content.endswith(","):
    final_content += ","
final_content += "\n" + new_ts_data + "\n};"

with open(exercises_data_file, "w", encoding="utf-8") as f:
    f.write(final_content)

print("Hoan thanh build exercises_data.ts kieu moi!")
