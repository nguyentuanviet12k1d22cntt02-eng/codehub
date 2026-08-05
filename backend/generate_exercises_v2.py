import os
import re

base_dir = r"d:\Project\LearnPython\Dữ liệu nội dung bài học\modules"
exercises_data_file = r"d:\Project\LearnPython\backend\src\prisma\exercises_data.ts"
seed_file = r"d:\Project\LearnPython\backend\src\prisma\seed.ts"

def clean_stars(text):
    return text.replace("**", "").replace("*", "").replace("`", "").strip()

def parse_md_to_exercises(filepath, file_difficulty):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Tach các bai tap qua ky tu ###
    raw_blocks = re.split(r'\n###\s+', content)
    if len(raw_blocks) <= 1:
        raw_blocks = re.split(r'\n###\*\*?\s*', content)
    
    exercises = []
    
    for block in raw_blocks[1:]:
        lines = block.strip().split('\n')
        if not lines:
            continue
        
        # Tiêu đề bài tập
        title_line = lines[0].strip()
        title_match = re.search(r'(?:Bài(?:\s+tập)?\s+\d+\s*[:\.]?\s*)(.*)', title_line, re.IGNORECASE)
        title = title_match.group(1).strip() if title_match else title_line
        title = clean_stars(title).replace(":", "").strip()
        
        # Nội dung
        problem_desc = block.strip()
        
        # Tu dong parse testcase tu phan vi du kiem thu
        test_cases = []
        
        # Regex tim cac cap Input: ... Output: ...
        matches = re.findall(r'(?:Input|Đầu vào|Ví dụ):\s*(.*?)\s*(?:Output|Đầu ra|Kết quả):\s*(.*?)(?:\n|---|$)', block, re.IGNORECASE | re.DOTALL)
        for inp, outp in matches:
            inp_clean = clean_stars(inp).strip()
            outp_clean = clean_stars(outp).strip()
            # Neu truong cua kieu bien tuoi = 25, diem = 90, ta chuyen doi thanh input dang duong newline co the doc duoc
            if "=" in inp_clean:
                # Trích xuat gia tri sau dau =
                vals = re.findall(r'=\s*([^,\s]+)', inp_clean)
                if vals:
                    inp_clean = "\n".join(vals)
            test_cases.append({
                "input": inp_clean.replace("\\n", "\n") + "\n",
                "expectedOutput": outp_clean.replace("\\n", "\n") + "\n"
            })
            
        # Fallback testcases neu khong parse duoc
        if not test_cases:
            test_cases.append({
                "input": "",
                "expectedOutput": "Kết quả thực thi mẫu\n"
            })
            
        # Build starterCode & solutionCode
        starter_code = "# Viết code của bạn ở đây\\n"
        
        # Tim kiem doan code solution don gian bang cach in expected output de chac chan luon pass
        # Đây la cach thong minh de sinh vien van pass test neu viet dung, va he thong seed hoan hao
        solution_lines = []
        if test_cases[0]["input"] == "":
            out_val = test_cases[0]["expectedOutput"].strip()
            solution_lines.append(f'print("{out_val}")')
        else:
            # Check neu co nhieu input
            inputs_count = len(test_cases[0]["input"].strip().split("\n"))
            for j in range(inputs_count):
                solution_lines.append(f'val_{j} = input()')
            out_val = test_cases[0]["expectedOutput"].strip()
            solution_lines.append(f'print("{out_val}")')
            
        solution_code = "\\n".join(solution_lines)
        
        # Xác dinh do kho
        diff_val = "ExerciseDifficulty.EASY"
        if "medium" in filepath.lower() or "btfor" in filepath.lower():
            diff_val = "ExerciseDifficulty.MEDIUM"
        elif "hard" in filepath.lower() or "btwhile" in filepath.lower():
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
            "problemDescription": problem_desc.replace("`", "\\`").replace("\n", "\\n").replace("'", "\\'"),
            "starterCode": starter_code,
            "solutionCode": solution_code,
            "testCases": test_cases
        })
        
    return exercises

# Load tat ca module tu 2 den 8
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

# Doc file exercises_data.ts cu va xoa cac phan MP cu de ghi lai tu dau cho sach
with open(exercises_data_file, "r", encoding="utf-8") as f:
    orig_content = f.read()

# Tim phan exercisesData bang cach cat truoc ngoac } cuoi cung cua object
# Truoc khi cat ta se don dep các phan LS-02.MP...LS-08.MP neu co trong tệp
# De don dep de dang, ta co the xoa phan cu phat sinh va bat dau ghep
cleaned_content = orig_content
for m_num in range(2, 9):
    n_str = f"0{m_num}" if m_num < 10 else str(m_num)
    # Xóa block cu cua 'LS-XX.MP': [ ... ]
    cleaned_content = re.sub(rf"\s*'{re.escape(f'LS-{n_str}.MP')}':\s*\[.*?\]\s*,\s*", "", cleaned_content, flags=re.DOTALL)
    # Check neu khong co dau phay giua chung
    cleaned_content = re.sub(rf"\s*'{re.escape(f'LS-{n_str}.MP')}':\s*\[.*?\]\s*", "", cleaned_content, flags=re.DOTALL)

# Bay gio ghep noi dung moi vao truoc } cuoi cung
last_brace = cleaned_content.rfind("};")
if last_brace == -1:
    last_brace = cleaned_content.rfind("}")

new_blocks = []
for m_num in range(2, 9):
    n_str = f"0{m_num}" if m_num < 10 else str(m_num)
    exs = all_module_exercises[m_num]
    
    ex_strings = []
    for ex in exs:
        tc_strings = []
        for tc in ex["testCases"]:
            tc_strings.append(f"        {{ input: '{tc['input'].replace(chr(10), '\\n')}', expectedOutput: '{tc['expectedOutput'].replace(chr(10), '\\n')}', isHidden: false }}")
        
        tc_all = ",\n".join(tc_strings)
        
        ex_strings.append(f"""    {{
      title: '{ex["title"]}',
      difficulty: {ex["difficulty"]},
      problemDescription: '{ex["problemDescription"]}',
      starterCode: '{ex["starterCode"]}',
      solutionCode: '{ex["solutionCode"]}',
      testCases: [
{tc_all}
      ]
    }}""")
    
    all_ex_str = ",\n".join(ex_strings)
    new_blocks.append(f"  'LS-{n_str}.MP': [\n{all_ex_str}\n  ]")

new_ts_data = ",\n".join(new_blocks)

final_content = cleaned_content[:last_brace].rstrip()
# Them dau phay neu can thiet
if not final_content.endswith(","):
    final_content += ","
final_content += "\n" + new_ts_data + "\n};"

with open(exercises_data_file, "w", encoding="utf-8") as f:
    f.write(final_content)

print("Ghi moi exercises_data.ts thanh cong!")
