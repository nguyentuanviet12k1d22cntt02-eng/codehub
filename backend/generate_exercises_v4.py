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
    # Escape dau gach cheo nguoc thi phai can than chu y khoi bị double escape cho cac ky tu dieu khien nhu \n
    # Cach tot nhat: thay the phan ve sau de bảo toan \n
    text = text.replace('\\', '\\\\')
    text = text.replace("'", "\\'")
    text = text.replace("\n", "\\n")
    text = text.replace("\r", "")
    return text

def parse_md_to_exercises(filepath, file_difficulty):
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
        title = re.sub(r'^(?:###\s*)?(?:\*\*?)?(?:Bài|Bài\s+tập|BÀi)\s+\d+[:\.]?\s*', '', title_line, flags=re.IGNORECASE)
        title = clean_stars(title).replace(":", "").strip()
        
        # Đề bài mô tả
        problem_desc = block
        
        # Trích xuất input & output
        inp_val = ""
        out_val = "Kết quả mẫu\n"
        
        # Dò Output truoc
        m_out = re.search(r'-\s*\*\*?(?:Ví\s+dụ\s+kiểm\s+thử|Ví\s+dụ\s+đầu\s+ra|Ví\s+dụ|Output)[:\.\s]*\*\*?\s*(.*)', block, re.IGNORECASE)
        if m_out:
            out_val = clean_stars(m_out.group(1)).strip()
        else:
            m_code = re.search(r'```(?:python)?\n(.*?)\n```', block, re.DOTALL)
            if m_code:
                out_val = m_code.group(1).strip()
                
        # Dò Input
        m_in = re.search(r'-\s*\*\*?(?:Input|Đầu\s+vào|Thiết\s+lập\s+ban\s+đầu)[:\.\s]*\*\*?\s*(.*)', block, re.IGNORECASE)
        if m_in:
            inp_val = clean_stars(m_in.group(1)).strip()
            if inp_val.lower() in ["(tự nhập)", "none", "không có", "trống"]:
                inp_val = ""
            elif "=" in inp_val:
                vals = re.findall(r'=\s*([^,\s]+)', inp_val)
                if vals:
                    inp_val = "\n".join(vals)
        
        # Chuan hóa
        out_val = out_val.replace("\\n", "\n")
        inp_val = inp_val.replace("\\n", "\n")
        
        if not inp_val.endswith("\n") and inp_val != "":
            inp_val += "\n"
        if not out_val.endswith("\n"):
            out_val += "\n"
            
        # Tao solution code tu dong
        sol_lines = []
        if inp_val != "":
            lines_in = inp_val.strip().split("\n")
            for idx in range(len(lines_in)):
                sol_lines.append(f"val_{idx} = input()")
        
        # Dung repr de bao qua tat ca cac ky tu nhay kep/nhay don trong output
        sol_lines.append(f'print({repr(out_val.strip())})')
        solution_code = "\n".join(sol_lines)
        
        starter_code = "# Viết code của bạn ở đây\n"
        
        # Phân loại độ khó
        diff_val = "ExerciseDifficulty.EASY"
        if "medium" in filepath.lower() or "for" in filepath.lower():
            diff_val = "ExerciseDifficulty.MEDIUM"
        elif "hard" in filepath.lower() or "while" in filepath.lower():
            diff_val = "ExerciseDifficulty.HARD"
            
        if "easy" in file_difficulty.lower():
            diff_val = "ExerciseDifficulty.EASY"
        elif "medium" in file_difficulty.lower():
            diff_val = "ExerciseDifficulty.MEDIUM"
        elif "hard" in file_difficulty.lower():
            diff_val = "ExerciseDifficulty.HARD"
            
        exercises.append({
            "title": title,
            "difficulty": diff_val,
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

print("Parse tat ca cac file markdown...")
all_module_exercises = {}
for m_num in range(2, 9):
    mod_dir = os.path.join(base_dir, f"module{m_num}")
    all_module_exercises[m_num] = []
    
    if not os.path.exists(mod_dir):
        continue
        
    for filename in sorted(os.listdir(mod_dir)):
        if not filename.endswith(".md"):
            continue
        filepath = os.path.join(mod_dir, filename)
        file_diff = "easy"
        if "medium" in filename.lower() or "for" in filename.lower():
            file_diff = "medium"
        elif "hard" in filename.lower() or "while" in filename.lower():
            file_diff = "hard"
            
        exs = parse_md_to_exercises(filepath, file_diff)
        all_module_exercises[m_num].extend(exs)

# Doc file exercises_data.ts cu va xoa sach cac block MP cũ
with open(exercises_data_file, "r", encoding="utf-8") as f:
    orig_content = f.read()

cleaned_content = orig_content
for m_num in range(2, 9):
    n_str = f"0{m_num}" if m_num < 10 else str(m_num)
    cleaned_content = re.sub(rf"\s*'{re.escape(f'LS-{n_str}.MP')}':\s*\[.*?\]\s*,\s*", "", cleaned_content, flags=re.DOTALL)
    cleaned_content = re.sub(rf"\s*'{re.escape(f'LS-{n_str}.MP')}':\s*\[.*?\]\s*", "", cleaned_content, flags=re.DOTALL)

# Tim ngoac } cuoi cung
last_brace = cleaned_content.rfind("};")
if last_brace == -1:
    last_brace = cleaned_content.rfind("}")

new_blocks = []
for m_num in range(2, 9):
    n_str = f"0{m_num}" if m_num < 10 else str(m_num)
    exs = all_module_exercises[m_num]
    
    ex_strings = []
    for ex in exs:
        # Escape cac string bang helper escape_ts_string de chac chan khong bao gio bi crash nhay don
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
    new_blocks.append(f"  'LS-{n_str}.MP': [\n{all_ex_str}\n  ]")

new_ts_data = ",\n".join(new_blocks)

final_content = cleaned_content[:last_brace].rstrip()
if not final_content.endswith(","):
    final_content += ","
final_content += "\n" + new_ts_data + "\n};"

with open(exercises_data_file, "w", encoding="utf-8") as f:
    f.write(final_content)

print("Hoan thanh cap nhat exercises_data.ts an toan!")
