import os
import json
import random
import psycopg2
from psycopg2.extras import execute_values
import uuid
import sys
import io
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_ENV_PATH = os.path.join(os.path.dirname(BASE_DIR), "backend", ".env")

def get_db_connection():
    if not os.path.exists(BACKEND_ENV_PATH):
        print(f"Backend .env not found at root: {BACKEND_ENV_PATH}")
        return None
    load_dotenv(BACKEND_ENV_PATH)
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found in backend/.env")
        return None
    if "?schema=" in db_url:
        connection_url = db_url.split("?schema=")[0]
    else:
        connection_url = db_url
    try:
        conn = psycopg2.connect(connection_url)
        return conn
    except Exception as e:
        print(f"Could not connect to database: {e}")
        return None

def run_compiled_code_in_memory(compiled_code, stdin_data):
    # Backup original stdin/stdout
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    
    # Redirect stdin and stdout
    sys.stdin = io.StringIO(stdin_data)
    sys.stdout = io.StringIO()
    
    error = None
    output = ""
    try:
        # Create a single dictionary scope acting as both globals and locals
        scope = {
            "__name__": "__main__",
            "__builtins__": __builtins__,
        }
        # Run the pre-compiled Python code
        exec(compiled_code, scope)
        output = sys.stdout.getvalue()
    except Exception as e:
        error = str(e)
    finally:
        # Restore stdin/stdout
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        
    return output, error

def generate_inputs_for_problem(slug, num_test_cases):
    inputs = []
    # Generate unique or varied test inputs based on target count
    for idx in range(num_test_cases):
        # 1. Original practice problems
        if slug == "two-sum":
            n = random.randint(3, 10)
            arr = [random.randint(1, 30) for _ in range(n)]
            idx1, idx2 = random.sample(range(n), 2)
            target = arr[idx1] + arr[idx2]
            inp = f"{n}\n" + " ".join(map(str, arr)) + f"\n{target}\n"
            inputs.append(inp)
            
        elif slug == "add-two-numbers":
            n1 = random.randint(1, 4)
            n2 = random.randint(1, 4)
            l1 = [random.randint(0, 9) for _ in range(n1)]
            l2 = [random.randint(0, 9) for _ in range(n2)]
            inp = " ".join(map(str, l1)) + "\n" + " ".join(map(str, l2)) + "\n"
            inputs.append(inp)
            
        elif slug == "longest-substring-without-repeating-characters":
            vocab = "abcdefg"
            length = random.randint(1, 10)
            s = "".join(random.choice(vocab) for _ in range(length))
            inputs.append(s + "\n")
            
        # 2. Auto-generated practice problems
        elif slug.startswith("var-easy-"):
            inputs.append(f"{random.randint(-50, 500)}\n")
            
        elif slug.startswith("var-medium-"):
            inputs.append(f"{random.randint(-10, 30)} {random.randint(-10, 30)}\n")
            
        elif slug.startswith("var-hard-"):
            inputs.append(f"{round(random.uniform(-3.0, 3.0), 2)} {round(random.uniform(-3.0, 3.0), 2)} {round(random.uniform(0.1, 2.0), 2)}\n")
            
        elif slug.startswith("cond-easy-"):
            inputs.append(f"{random.randint(-50, 500)}\n")
            
        elif slug.startswith("cond-medium-"):
            inputs.append(f"{random.randint(0, 75)}\n")
            
        elif slug.startswith("cond-hard-"):
            inputs.append(f"{random.randint(1600, 2199)}\n")
            
        elif slug.startswith("loop-easy-"):
            inputs.append(f"{random.randint(1, 150)}\n")
            
        elif slug.startswith("loop-medium-"):
            inputs.append(f"{random.randint(1, 500)}\n")
            
        elif slug.startswith("loop-hard-"):
            inputs.append(f"{random.randint(2, 350)} {random.randint(1, 12)}\n")
            
        elif slug.startswith("list-easy-"):
            n = random.randint(1, 8)
            arr = [random.randint(0, 40) for _ in range(n)]
            inputs.append(" ".join(map(str, arr)) + "\n")
            
        elif slug.startswith("list-medium-"):
            words = ["apple", "banana", "cat", "dog", "elephant", "python", "code", "loop", "variables"]
            sentence = " ".join(random.choice(words) for _ in range(random.randint(2, 6)))
            inputs.append(sentence + "\n")
            
        elif slug.startswith("list-hard-"):
            n = random.randint(3, 8)
            arr = [random.randint(-5, 40) for _ in range(n)]
            k = random.randint(1, n)
            inputs.append(f"{n}\n" + " ".join(map(str, arr)) + f"\n{k}\n")
            
        elif slug.startswith("dict-easy-"):
            vocab = "abcde"
            length = random.randint(1, 8)
            inputs.append("".join(random.choice(vocab) for _ in range(length)) + "\n")
            
        elif slug.startswith("dict-medium-"):
            items = ["A", "B", "C", "D"]
            p1_num = random.randint(1, 3)
            p2_num = random.randint(1, 3)
            p1 = [f"{item} {random.randint(1, 80)}" for item in random.sample(items, p1_num)]
            p2 = [f"{item} {random.randint(1, 80)}" for item in random.sample(items, p2_num)]
            inputs.append("\n".join(p1) + "\n---\n" + "\n".join(p2) + "\n")
            
        elif slug.startswith("dict-hard-"):
            vocab = ["eat", "tea", "tan", "ate", "nat", "bat"]
            w_list = [random.choice(vocab) for _ in range(random.randint(2, 6))]
            inputs.append(" ".join(w_list) + "\n")
            
        elif slug.startswith("func-easy-"):
            inputs.append(f"{random.randint(0, 8)}\n")
            
        elif slug.startswith("func-medium-"):
            inputs.append(f"{random.randint(0, 20)}\n")
            
        elif slug.startswith("func-hard-"):
            inputs.append(f"{random.randint(10, 150)}\n")
            
        elif slug.startswith("oop-easy-"):
            inputs.append(f"{random.randint(1, 15)} {random.randint(1, 15)}\n")
            
        elif slug.startswith("oop-medium-"):
            inputs.append(f"{random.randint(100, 800)} {random.randint(50, 400)} {random.randint(100, 1200)}\n")
            
        elif slug.startswith("oop-hard-"):
            inputs.append(f"{random.randint(1000, 35000)}\n")
            
        else:
            inputs.append("\n")
    return inputs

def get_testcase_count_and_vis(difficulty, solution_code):
    # Check if the solution code reads input.
    has_input = False
    if solution_code:
        sol_lower = solution_code.lower()
        if "input(" in sol_lower or "sys.stdin" in sol_lower or "scanf(" in sol_lower or "cin >>" in sol_lower or "readfilesync" in sol_lower or "getline" in sol_lower:
            has_input = True
            
    if not has_input:
        return 1, 1  # 1 testcase, all visible (idx >= 1 is hidden -> False)
        
    diff_upper = str(difficulty).upper()
    if "EASY" in diff_upper:
        return 3, 2  # 3 testcases: 2 visible, 1 hidden (idx >= 2 is hidden)
    elif "INTERMEDIATE" in diff_upper or "MEDIUM" in diff_upper:
        return 10, 2  # 10 testcases: 2 visible, 8 hidden (idx >= 2 is hidden)
    elif "ADVANCED" in diff_upper or "HARD" in diff_upper:
        return 15, 3  # 15 testcases: 3 visible, 12 hidden (idx >= 3 is hidden)
    else:
        return 3, 2

def main():
    conn = get_db_connection()
    if not conn:
        print("Database connection failed.")
        return
    
    cursor = conn.cursor()
    
    # -------------------------------------------------------------
    # PART 1: Update Practice Problems (create dynamic test cases)
    # -------------------------------------------------------------
    print("Fetching all practice problems...")
    cursor.execute("SELECT id, title, slug, solution_codes, difficulty FROM practice_problems;")
    problems = cursor.fetchall()
    print(f"Loaded {len(problems)} practice problems.")
    
    for p_id, title, slug, sol_json, difficulty in problems:
        # Extract python solution
        sol_codes = sol_json if isinstance(sol_json, dict) else json.loads(sol_json)
        py_solution = sol_codes.get("PYTHON")
        if not py_solution:
            continue
            
        # Try compiling the solution once
        try:
            compiled = compile(py_solution, f"<problem-{slug}>", "exec")
        except Exception as comp_err:
            print(f"Error compiling solution for {slug}: {comp_err}")
            continue
            
        # Clear existing test cases
        cursor.execute("DELETE FROM practice_test_cases WHERE problem_id = %s;", (p_id,))
        
        # Calculate dynamic testcase count
        target_count, visible_count = get_testcase_count_and_vis(difficulty, py_solution)
        
        # Generate inputs
        inputs = generate_inputs_for_problem(slug, target_count)
        
        # Execute each and gather
        testcase_rows = []
        for idx, stdin in enumerate(inputs):
            out, err = run_compiled_code_in_memory(compiled, stdin)
            if err:
                # print(f"  Warning on testcase {idx} for {slug}: {err}")
                out, _ = run_compiled_code_in_memory(compiled, "\n")
                if not out:
                    out = "0\n" # fallback
            
            tc_id = str(uuid.uuid4())
            is_hidden = (idx >= visible_count)
            testcase_rows.append((tc_id, p_id, stdin, out, is_hidden))
            
        # Bulk Insert
        execute_values(
            cursor,
            "INSERT INTO practice_test_cases (id, problem_id, input, expected_output, is_hidden, created_at) VALUES %s",
            [(row[0], row[1], row[2], row[3], row[4], psycopg2.extensions.AsIs("NOW()")) for row in testcase_rows]
        )
        print(f"Saved {target_count} test cases for practice: {title} ({slug})")
    
    conn.commit()
    cursor.close()
    conn.close()
    print("\nFinish updating dynamic test cases for all practice problems!")

if __name__ == "__main__":
    main()
