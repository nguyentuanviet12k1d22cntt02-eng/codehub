import os
import json
import psycopg2
import uuid
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILL_GRAPH_PATH = os.path.join(BASE_DIR, "data", "skill_graph.json")
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

def build_problems():
    kcs = ["KC_VAR", "KC_COND", "KC_LOOP", "KC_LIST", "KC_DICT", "KC_FUNC", "KC_OOP"]
    problems = []

    # --- KC_VAR (Variables, Types, Math) ---
    kc = "KC_VAR"
    
    # 10 Easy
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "EASY",
            "slug": f"var-easy-{i}",
            "title": f"Biến & Toán học - Dễ {i}",
            "description": f"Viết chương trình Python thực hiện phép toán đơn giản {i}.\nĐọc một số nguyên n từ stdin, in ra giá trị n cộng thêm {i * 5}.",
            "starter_code": "import sys\n# Đọc n từ stdin và in kết quả\nfor line in sys.stdin:\n    if line.strip():\n        n = int(line.strip())\n        # Code của bạn ở đây\n",
            "solution_code": f"import sys\nfor line in sys.stdin:\n    if line.strip():\n        n = int(line.strip())\n        print(n + {i * 5})\n",
            "test_cases": [
                {"input": "10\n", "expected": f"{10 + i * 5}\n", "hidden": False},
                {"input": "23\n", "expected": f"{23 + i * 5}\n", "hidden": True}
            ]
        })
    # 10 Medium
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "MEDIUM",
            "slug": f"var-medium-{i}",
            "title": f"Biến & Toán học - Khá {i}",
            "description": f"Viết chương trình Python tính toán bình phương của tổng.\nĐọc hai số nguyên a và b trên 2 dòng từ stdin (hoặc cách nhau bởi khoảng trắng), in ra kết quả phép tính (a + b) lũy thừa {i + 1}.",
            "starter_code": "import sys\n# Đọc a, b và tính toán\ninput_data = sys.stdin.read().split()\nif input_data:\n    a = int(input_data[0])\n    b = int(input_data[1])\n    # Code của bạn\n",
            "solution_code": f"import sys\ninput_data = sys.stdin.read().split()\nif len(input_data) >= 2:\n    a = int(input_data[0])\n    b = int(input_data[1])\n    print((a + b) ** {i + 1})\n",
            "test_cases": [
                {"input": "2 3\n", "expected": f"{(2 + 3) ** (i + 1)}\n", "hidden": False},
                {"input": "1 1\n", "expected": f"{(1 + 1) ** (i + 1)}\n", "hidden": True}
            ]
        })
    # 10 Hard
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "HARD",
            "slug": f"var-hard-{i}",
            "title": f"Biến & Toán học - Khó {i}",
            "description": f"Viết chương trình Python giải quyết bài toán phức tạp {i}.\nĐọc ba số thực x, y, z ngăn cách bởi khoảng trắng. Tính giá trị biểu thức: x * y + z^{i}.\nHãy làm tròn kết quả đến 2 chữ số thập phân.",
            "starter_code": "import sys\n# Đọc x, y, z từ stdin và tính toán làm tròn\n",
            "solution_code": f"import sys\ninput_data = sys.stdin.read().split()\nif len(input_data) >= 3:\n    x = float(input_data[0])\n    y = float(input_data[1])\n    z = float(input_data[2])\n    res = x * y + (z ** {i})\n    print(round(res, 2))\n",
            "test_cases": [
                {"input": "2.5 4.0 2.0\n", "expected": f"{round(2.5 * 4.0 + (2.0 ** i), 2)}\n", "hidden": False},
                {"input": "1.2 3.5 1.5\n", "expected": f"{round(1.2 * 3.5 + (1.5 ** i), 2)}\n", "hidden": True}
            ]
        })

    # --- KC_COND (Conditional Flow) ---
    kc = "KC_COND"
    
    # 10 Easy
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "EASY",
            "slug": f"cond-easy-{i}",
            "title": f"Rẽ nhánh - Dễ {i}",
            "description": f"Kiểm tra tính hợp lệ của số nguyên.\nĐọc một số nguyên n từ stdin. Nếu n chia hết cho {i + 1}, in ra 'YES', ngược lại in ra 'NO'.",
            "starter_code": "import sys\n# Đọc n và rẽ nhánh\n",
            "solution_code": f"import sys\nval = int(sys.stdin.read().strip())\nif val % {i + 1} == 0:\n    print('YES')\nelse:\n    print('NO')\n",
            "test_cases": [
                {"input": f"{(i + 1) * 3}\n", "expected": "YES\n", "hidden": False},
                {"input": f"{(i + 1) * 3 + 1}\n", "expected": "NO\n", "hidden": True}
            ]
        })
    # 10 Medium
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "MEDIUM",
            "slug": f"cond-medium-{i}",
            "title": f"Rẽ nhánh - Khá {i}",
            "description": f"Phân loại độ tuổi học sinh cấp độ {i}.\nĐọc tuổi n (số nguyên) từ stdin. Nếu n bé hơn 10 in ra 'KID'; n từ 10 đến {10 + i * 2} in ra 'TEEN'; n lớn hơn {10 + i * 2} in ra 'ADULT'.",
            "starter_code": "import sys\n# Phân loại độ tuổi\n",
            "solution_code": f"import sys\nage = int(sys.stdin.read().strip())\nif age < 10:\n    print('KID')\nelif age <= {10 + i * 2}:\n    print('TEEN')\nelse:\n    print('ADULT')\n",
            "test_cases": [
                {"input": "5\n", "expected": "KID\n", "hidden": False},
                {"input": f"{11 + i * 2}\n", "expected": "ADULT\n", "hidden": True}
            ]
        })
    # 10 Hard
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "HARD",
            "slug": f"cond-hard-{i}",
            "title": f"Rẽ nhánh - Khá/Khó {i}",
            "description": f"Kiểm tra năm nhuận và thế kỷ {i}.\nĐọc một năm dương lịch n. Thế kỷ của năm đó bằng n chia 100 làm tròn lên. Thế kỷ lẻ lớn hơn 10 là lẻ nâng cao.\nNếu n vừa là năm nhuận vừa thuộc thế kỷ chẵn, in ra 'EVEN LEAP', nếu là năm nhuận thế kỷ lẻ in ra 'ODD LEAP', ngược lại in ra 'COMMON'.",
            "starter_code": "import sys\n# Xác định năm nhuận và chẵn/lẻ thế kỷ\n",
            "solution_code": f"import sys\nyear = int(sys.stdin.read().strip())\nis_leap = (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)\ncentury = (year - 1) // 100 + 1\nif is_leap:\n    if century % 2 == 0:\n        print('EVEN LEAP')\n    else:\n        print('ODD LEAP')\nelse:\n    print('COMMON')\n",
            "test_cases": [
                {"input": "2000\n", "expected": "EVEN LEAP\n", "hidden": False},
                {"input": "1900\n", "expected": "COMMON\n", "hidden": True}
            ]
        })

    # --- KC_LOOP (Loops) ---
    kc = "KC_LOOP"
    
    # 10 Easy
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "EASY",
            "slug": f"loop-easy-{i}",
            "title": f"Vòng lặp - Dễ {i}",
            "description": f"Tính tổng dãy số chạy {i}.\nĐọc số nguyên dương n từ stdin. Tính và in ra tổng các số từ 1 đến n chia hết cho {i}.",
            "starter_code": "import sys\n# Dùng vòng lặp tính tổng\n",
            "solution_code": f"import sys\nn = int(sys.stdin.read().strip())\nprint(sum(x for x in range(1, n + 1) if x % {i} == 0))\n",
            "test_cases": [
                {"input": f"{i * 3}\n", "expected": f"{sum(x for x in range(1, i * 3 + 1) if x % i == 0)}\n", "hidden": False},
                {"input": "1\n", "expected": "0\n", "hidden": True}
            ]
        })
    # 10 Medium
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "MEDIUM",
            "slug": f"loop-medium-{i}",
            "title": f"Vòng lặp - Khá {i}",
            "description": f"Dãy số Collatz với giới hạn {i}.\nĐọc số nguyên dương n. Thực hiện lặp: nếu n chẵn n = n / 2, nếu lẻ n = n * 3 + 1. Dừng khi n = 1.\nIn ra số bước lặp tối đa hoặc 1.",
            "starter_code": "import sys\n# Đếm số bước lặp\n",
            "solution_code": "import sys\nn = int(sys.stdin.read().strip())\nsteps = 0\nwhile n > 1:\n    if n % 2 == 0:\n        n = n // 2\n    else:\n        n = n * 3 + 1\n    steps += 1\nprint(steps)\n",
            "test_cases": [
                {"input": "6\n", "expected": "8\n", "hidden": False},
                {"input": "1\n", "expected": "0\n", "hidden": True}
            ]
        })
    # 10 Hard
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "HARD",
            "slug": f"loop-hard-{i}",
            "title": f"Vòng lặp - Khó {i}",
            "description": f"Số nguyên tố thứ k nhỏ nhất kết nối thêm {i}.\nĐọc hai số nguyên n và k. Quét các số nguyên tố bắt đầu từ n, tìm và in số nguyên tố thứ k lớn hơn hoặc bằng n.",
            "starter_code": "import sys\n# Tìm số nguyên tố thứ k\n",
            "solution_code": "import sys\ndef is_prime(x):\n    if x < 2: return False\n    for divisor in range(2, int(x**0.5) + 1):\n        if x % divisor == 0: return False\n    return True\ninput_data = sys.stdin.read().split()\nif input_data:\n    n = int(input_data[0])\n    k = int(input_data[1])\n    count = 0\n    curr = n\n    while True:\n        if is_prime(curr):\n            count += 1\n            if count == k:\n                print(curr)\n                break\n        curr += 1\n",
            "test_cases": [
                {"input": "10 3\n", "expected": "17\n", "hidden": False},
                {"input": "2 5\n", "expected": "11\n", "hidden": True}
            ]
        })

    # --- KC_LIST (Lists & Strings) ---
    kc = "KC_LIST"
    
    # 10 Easy
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "EASY",
            "slug": f"list-easy-{i}",
            "title": f"Danh sách - Dễ {i}",
            "description": f"Lọc phần tử lớn hơn ngưỡng {i}.\nĐọc từ stdin danh sách các số nguyên ngăn cách bởi dấu cách. In ra danh sách các số lớn hơn {i * 2} lọc được, ngăn cách bởi dấu cách.",
            "starter_code": "import sys\n# Lọc danh sách và in\n",
            "solution_code": f"import sys\nnums = [int(x) for x in sys.stdin.read().split()]\nfiltered = [x for x in nums if x > {i * 2}]\nprint(' '.join(map(str, filtered)))\n",
            "test_cases": [
                {"input": f"1 5 10 {i * 2 + 5}\n", "expected": f"{i * 2 + 5}\n" if i * 2 + 5 > i * 2 else "\n", "hidden": False},
                {"input": "0\n", "expected": "\n", "hidden": True}
            ]
        })
    # 10 Medium
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "MEDIUM",
            "slug": f"list-medium-{i}",
            "title": f"Danh sách - Khá {i}",
            "description": f"Đảo ngược các từ có độ dài chẵn lẻ nâng cao {i}.\nĐọc câu tiếng Anh từ stdin. Đối với từ nào có độ dài lớn hơn hoặc bằng {i + 2}, hãy đảo ngược từ đó. In ra câu mới.",
            "starter_code": "import sys\n# Đảo ngược từ dài theo yêu cầu\n",
            "solution_code": f"import sys\nwords = sys.stdin.read().strip().split()\nres = [w[::-1] if len(w) >= {i + 2} else w for w in words]\nprint(' '.join(res))\n",
            "test_cases": [
                {"input": "hello python developer\n", "expected": "olleh nohtyp repoleved\n" if i <= 3 else "hello python developer\n", "hidden": False},
                {"input": "py\n", "expected": "yp\n" if i <= 0 else "py\n", "hidden": True}
            ]
        })
    # 10 Hard
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "HARD",
            "slug": f"list-hard-{i}",
            "title": f"Danh sách - Khó {i}",
            "description": f"Xử lý mảng nâng cao với cửa sổ dịch chuyển K={i + 1}.\nĐọc một mảng số nguyên, dòng 1 là kích thước n, dòng 2 là n số nguyên, dòng 3 là K.\nTìm và in ra tổng lớn nhất của K phần tử liên tiếp.",
            "starter_code": "import sys\n# Tìm max sum cửa sổ K\n",
            "solution_code": "import sys\ninput_data = sys.stdin.read().split()\nif len(input_data) >= 3:\n    n = int(input_data[0])\n    arr = [int(x) for x in input_data[1:n+1]]\n    k = int(input_data[n+1])\n    if k > n or k <= 0:\n        print(0)\n    else:\n        max_sum = sum(arr[:k])\n        curr_sum = max_sum\n        for index in range(k, n):\n            curr_sum = curr_sum - arr[index - k] + arr[index]\n            max_sum = max(max_sum, curr_sum)\n        print(max_sum)\n",
            "test_cases": [
                {"input": "5\n1 3 -1 -3 5\n3\n", "expected": "3\n", "hidden": False},
                {"input": "4\n1 2 3 4\n2\n", "expected": "7\n", "hidden": True}
            ]
        })

    # --- KC_DICT (Dicts and Sets) ---
    kc = "KC_DICT"
    
    # 10 Easy
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "EASY",
            "slug": f"dict-easy-{i}",
            "title": f"Từ điển - Dễ {i}",
            "description": f"Thống kê số lần xuất hiện ký tự {i}.\nĐọc chuỗi từ stdin. Sử dụng Dict để tần suất ký tự. In ra số lần ký tự thứ {i} xuất hiện (nếu không có in 0).",
            "starter_code": "import sys\n# Thống kê ký tự\n",
            "solution_code": "import sys\ntext = sys.stdin.read().strip()\nfreq = {}\nfor char in text:\n    freq[char] = freq.get(char, 0) + 1\nkeys = sorted(freq.keys())\nif len(keys) > " + str(i-1) + ":\n    print(freq[keys[" + str(i-1) + "]])\nelse:\n    print(0)\n",
            "test_cases": [
                {"input": "aabbcc\n", "expected": "2\n" if i <= 3 else "0\n", "hidden": False},
                {"input": "a\n", "expected": "1\n" if i == 1 else "0\n", "hidden": True}
            ]
        })
    # 10 Medium
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "MEDIUM",
            "slug": f"dict-medium-{i}",
            "title": f"Từ điển - Khá {i}",
            "description": f"Đồng bộ hóa hai danh mục khóa học {i}.\nĐọc từ stdin danh sách món hàng và giá từ 2 nhóm hàng hóa cách nhau bởi '---'.\nMỗi dòng chứa 'keyvalue'. Hãy in những mặt hàng xuất hiện ở cả 2 nhóm với tổng giá trị.",
            "starter_code": "import sys\n# Gộp danh mục dùng dict\n",
            "solution_code": "import sys\nparts = sys.stdin.read().strip().split('---')\nif len(parts) >= 2:\n    dict1 = {}\n    dict2 = {}\n    for line in parts[0].strip().split('\\n'):\n        if line.strip():\n            k, v = line.split()\n            dict1[k] = int(v)\n    for line in parts[1].strip().split('\\n'):\n        if line.strip():\n            k, v = line.split()\n            dict2[k] = int(v)\n    common = sorted(list(set(dict1.keys()) & set(dict2.keys())))\n    for item in common:\n        print(f'{item} {dict1[item] + dict2[item]}')\n",
            "test_cases": [
                {"input": "A 10\nB 20\n---\nA 5\nC 3\n", "expected": "A 15\n", "hidden": False},
                {"input": "Book 100\n---\nPen 5\n", "expected": "", "hidden": True}
            ]
        })
    # 10 Hard
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "HARD",
            "slug": f"dict-hard-{i}",
            "title": f"Từ điển - Khó {i}",
            "description": f"Nhóm các chuỗi đảo vị (Anagram) cấp độ {i}.\nNhập một danh sách các từ ngăn cách bằng dấu cách. Nhóm các từ cùng nhóm Anagram. In ra số lượng từ trong nhóm lớn nhất.",
            "starter_code": "import sys\n# Nhóm anagram dùng hash map\n",
            "solution_code": "import sys\nwords = sys.stdin.read().split()\ngroups = {}\nfor w in words:\n    sorted_w = ''.join(sorted(w))\n    groups[sorted_w] = groups.get(sorted_w, 0) + 1\nif groups:\n    print(max(groups.values()))\nelse:\n    print(0)\n",
            "test_cases": [
                {"input": "eat tea tan ate nat bat\n", "expected": "3\n", "hidden": False},
                {"input": "a b c d\n", "expected": "1\n", "hidden": True}
            ]
        })

    # --- KC_FUNC (Functions) ---
    kc = "KC_FUNC"
    
    # 10 Easy
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "EASY",
            "slug": f"func-easy-{i}",
            "title": f"Hàm số - Dễ {i}",
            "description": f"Định nghĩa hàm tính giai thừa của n nhân {i}.\nĐọc số nguyên n. Viết hàm calculates(n) trả về n! * {i}. In kết quả.",
            "starter_code": "import sys\n# Định nghĩa hàm và in\n",
            "solution_code": f"import sys\ndef calculates(n):\n    res = 1\n    for divisor in range(1, n+1):\n        res *= divisor\n    return res * {i}\nn = int(sys.stdin.read().strip())\nprint(calculates(n))\n",
            "test_cases": [
                {"input": "4\n", "expected": f"{24 * i}\n", "hidden": False},
                {"input": "3\n", "expected": f"{6 * i}\n", "hidden": True}
            ]
        })
    # 10 Medium
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "MEDIUM",
            "slug": f"func-medium-{i}",
            "title": f"Hàm số - Khá {i}",
            "description": f"Hàm đệ quy tính số Fibonacci thứ n cộng {i}.\nĐọc n từ stdin. Định nghĩa hàm fib(n) tính số Fib thứ n (F0=0, F1=1). In ra fib(n) + {i}.",
            "starter_code": "import sys\n# Định nghĩa hàm đệ quy\n",
            "solution_code": f"import sys\ndef fib(n):\n    if n <= 0: return 0\n    if n == 1: return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\nn = int(sys.stdin.read().strip())\nprint(fib(n) + {i})\n",
            "test_cases": [
                {"input": "6\n", "expected": f"{8 + i}\n", "hidden": False},
                {"input": "1\n", "expected": f"{1 + i}\n", "hidden": True}
            ]
        })
    # 10 Hard
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "HARD",
            "slug": f"func-hard-{i}",
            "title": f"Hàm số - Khó {i}",
            "description": f"Xây dựng hàm lọc số nguyên tố thỏa mãn tổng chữ số chia hết cho {i+1}.\nĐọc n từ stdin. Định nghĩa hàm tìm tất cả số nguyên tố <= n có tổng các chữ số chia hết cho {i+1}. In các số đó ngăn cách bởi khoảng trắng.",
            "starter_code": "import sys\n# Hàm tìm số nguyên tố thỏa mãn điều kiện chữ số\n",
            "solution_code": "import sys\ndef is_prime(x):\n    if x < 2: return False\n    for divisor in range(2, int(x**0.5) + 1):\n        if x % divisor == 0: return False\n    return True\ndef check_digits(x):\n    return sum(int(c) for c in str(x)) % " + str(i+1) + " == 0\nn = int(sys.stdin.read().strip())\nres = [x for x in range(2, n + 1) if is_prime(x) and check_digits(x)]\nprint(' '.join(map(str, res)))\n",
            "test_cases": [
                {"input": "50\n", "expected": " ".join(str(x) for x in range(2, 51) if (x in [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47]) and (sum(int(c) for c in str(x)) % (i+1) == 0)) + "\n", "hidden": False},
                {"input": "10\n", "expected": " ".join(str(x) for x in range(2, 11) if (x in [2,3,5,7]) and (sum(int(c) for c in str(x)) % (i+1) == 0)) + "\n", "hidden": True}
            ]
        })

    # --- KC_OOP (Object Oriented) ---
    kc = "KC_OOP"
    
    # 10 Easy
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "EASY",
            "slug": f"oop-easy-{i}",
            "title": f"Đối tượng - Dễ {i}",
            "description": f"Tạo Class Rectangle nhân bản diện tích {i}.\nĐọc chiều dài l và chiều rộng w cách nhau bởi dấu cách. Định nghĩa Class Rectangle có phương thức get_area() trả về l * w * {i}. In kết quả.",
            "starter_code": "import sys\n# Định nghĩa Rectangle và in diện tích\n",
            "solution_code": f"import sys\nclass Rectangle:\n    def __init__(self, l, w):\n        self.l = l\n        self.w = w\n    def get_area(self):\n        return self.l * self.w * {i}\ninputs = sys.stdin.read().split()\nif inputs:\n    l = int(inputs[0])\n    w = int(inputs[1])\n    rect = Rectangle(l, w)\n    print(rect.get_area())\n",
            "test_cases": [
                {"input": "5 4\n", "expected": f"{5 * 4 * i}\n", "hidden": False},
                {"input": "2 3\n", "expected": f"{2 * 3 * i}\n", "hidden": True}
            ]
        })
    # 10 Medium
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "MEDIUM",
            "slug": f"oop-medium-{i}",
            "title": f"Đối tượng - Khá {i}",
            "description": f"Xây dựng Class BankAccount mô phỏng giao dịch {i}.\nĐọc số tiền dư ban đầu, sau đó là lượng tiền gửi (deposit) và lượng rút (withdraw).\nRút tiền không được vượt quá số dư cộng thêm {i * 1000} (giới hạn ứng trước). In số dư cuối cùng.",
            "starter_code": "import sys\n# Class BankAccount\n",
            "solution_code": f"import sys\nclass BankAccount:\n    def __init__(self, balance):\n        self.balance = balance\n    def deposit(self, amt):\n        self.balance += amt\n    def withdraw(self, amt):\n        if self.balance + {i * 1000} >= amt:\n            self.balance -= amt\ninputs = [int(x) for x in sys.stdin.read().split()]\nif len(inputs) >= 3:\n    acc = BankAccount(inputs[0])\n    acc.deposit(inputs[1])\n    acc.withdraw(inputs[2])\n    print(acc.balance)\n",
            "test_cases": [
                {"input": f"1000 500 {1500 + i * 1000}\n", "expected": f"{1500 - (1500 + i * 1000)}\n", "hidden": False},
                {"input": "500 200 100000\n", "expected": "700\n", "hidden": True}
            ]
        })
    # 10 Hard
    for i in range(1, 11):
        problems.append({
            "kc": kc,
            "difficulty": "HARD",
            "slug": f"oop-hard-{i}",
            "title": f"Đối tượng - Khó {i}",
            "description": f"Hệ thống đa hình quản lý nhân viên cấp {i}.\nĐọc lương cơ bản b. Tạo class Employee, subclass Manager. Employee có thực nhận = b.\nManager ghi đè thực nhận = b * 1.5 + {i * 500}. In ra thực nhận của Manager dạng làm tròn số nguyên.",
            "starter_code": "import sys\n# Đa hình hướng đối tượng\n",
            "solution_code": f"import sys\nclass Employee:\n    def __init__(self, b):\n        self.b = b\n    def get_salary(self):\n        return self.b\nclass Manager(Employee):\n    def get_salary(self):\n        return self.b * 1.5 + {i * 500}\nval = int(sys.stdin.read().strip())\nmgr = Manager(val)\nprint(round(mgr.get_salary()))\n",
            "test_cases": [
                {"input": "10000\n", "expected": f"{round(10000 * 1.5 + i * 500)}\n", "hidden": False},
                {"input": "5000\n", "expected": f"{round(5000 * 1.5 + i * 500)}\n", "hidden": True}
            ]
        })

    return problems

def main():
    conn = get_db_connection()
    if not conn:
        print("Database connection failed. Exiting.")
        return
        
    cursor = conn.cursor()
    
    # 1. Load skill_graph.json to find what needs to be mapped
    try:
        with open(SKILL_GRAPH_PATH, "r", encoding="utf-8") as f:
            skill_graph = json.load(f)
    except Exception as e:
        print(f"Failed to load skill graph: {e}")
        return

    problems_data = build_problems()
    print(f"Generated {len(problems_data)} practice problems.")

    # Get existing slugs in database to avoid conflict or clean
    cursor.execute("SELECT slug, id FROM practice_problems;")
    existing_db = {row[0]: row[1] for row in cursor.fetchall()}
    
    # Clear old generated problems to prevent duplicate keys
    slugs_to_clear = [p["slug"] for p in problems_data if p["slug"] in existing_db]
    if slugs_to_clear:
        print(f"Cleaning {len(slugs_to_clear)} old generated problems from database...")
        cursor.execute("DELETE FROM practice_test_cases WHERE problem_id IN (SELECT id FROM practice_problems WHERE slug = ANY(%s));", (slugs_to_clear,))
        cursor.execute("DELETE FROM practice_problems WHERE slug = ANY(%s);", (slugs_to_clear,))
        conn.commit()

    print("Inserting practice problems and test cases into database...")
    success_count = 0
    
    # We will insert problems one-by-one or in batches to obtain the generated UUIDs
    for p in problems_data:
        p_id = str(uuid.uuid4())
        diff_enum = p["difficulty"] # EASY, MEDIUM, HARD
        
        starter_json = json.dumps({"PYTHON": p["starter_code"]})
        solution_json = json.dumps({"PYTHON": p["solution_code"]})
        
        try:
            # Insert Problem
            cursor.execute(
                """
                INSERT INTO practice_problems (id, title, slug, difficulty, description, starter_codes, solution_codes, created_at, updated_at)
                VALUES (%s, %s, %s, %s::"ExerciseDifficulty", %s, %s, %s, NOW(), NOW());
                """,
                (p_id, p["title"], p["slug"], diff_enum, p["description"], starter_json, solution_json)
            )
            
            # Insert Test Cases
            for tc in p["test_cases"]:
                tc_id = str(uuid.uuid4())
                cursor.execute(
                    """
                    INSERT INTO practice_test_cases (id, problem_id, input, expected_output, is_hidden, created_at)
                    VALUES (%s, %s, %s, %s, %s, NOW());
                    """,
                    (tc_id, p_id, tc["input"], tc["expected"], tc["hidden"])
                )
            
            success_count += 1
            
            # Update local skill_graph mapping payload
            skill_graph["practice_problem_mappings"][p["slug"]] = p["kc"]
            
        except Exception as insert_err:
            print(f"Error inserting problem {p['slug']}: {insert_err}")
            conn.rollback()
            return
            
    conn.commit()
    print(f"Successfully inserted {success_count} problems.")
    
    # 2. Write updated skill_graph.json back
    try:
        with open(SKILL_GRAPH_PATH, "w", encoding="utf-8") as f:
            json.dump(skill_graph, f, indent=2, ensure_ascii=False)
        print("Updated skill_graph.json mappings successfully.")
    except Exception as io_err:
        print(f"Failed writing updated skill graph JSON: {io_err}")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()
