import { prisma } from '../src/infrastructure/database/prisma';
import * as fs from 'fs';
import * as path from 'path';

interface TestCaseDef {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface ExerciseDef {
  title: string;
  problemDescription?: string;
  starterCode?: string;
  solutionCode: string;
  testCases: TestCaseDef[];
}

// 25 BÀI THỰC HÀNH TỔNG HỢP (LS-07.MP)
const mpExercises: ExerciseDef[] = [
  // 1. Bắt các loại ngoại lệ lồng nhau
  {
    title: 'Bắt các loại ngoại lệ lồng nhau',
    problemDescription: `### Bài tập: Bắt các loại ngoại lệ lồng nhau

- **Mô tả:** Dòng 1 là danh sách các số nguyên cách nhau bởi khoảng trắng. Dòng 2 là chỉ số \`chi_so\`. Dòng 3 là số chia \`chia\`.
- **Yêu cầu:** Viết khối lệnh \`try-except\` để lấy phần tử tại \`chi_so\` và chia cho \`chia\`.
  - Nếu gặp \`IndexError\`, in ra: \`Lỗi chỉ số\`
  - Nếu gặp \`ZeroDivisionError\`, in ra: \`Lỗi chia cho 0\`
  - Nếu thành công, in ra kết quả phép chia dạng float.
- **Input:** 3 dòng (danh sách, chỉ số, số chia).
- **Output:** Kết quả phép chia hoặc thông báo lỗi tương ứng.
- **Ví dụ:**
\`\`\`text
Input:
10 20 30
1
2
Output:
10.0
\`\`\``,
    starterCode: `lst = list(map(int, input().split()))
chi_so = int(input())
chia = int(input())
# Viết try-except xử lý IndexError và ZeroDivisionError
`,
    solutionCode: `lst = list(map(int, input().split()))
chi_so = int(input())
chia = int(input())
try:
    val = lst[chi_so]
    res = val / chia
    print(res)
except IndexError:
    print("Lỗi chỉ số")
except ZeroDivisionError:
    print("Lỗi chia cho 0")
`,
    testCases: [
      { input: "10 20 30\n1\n2\n", expectedOutput: "10.0\n", isHidden: false },
      { input: "10 20\n5\n2\n", expectedOutput: "Lỗi chỉ số\n", isHidden: true },
      { input: "5 15\n0\n0\n", expectedOutput: "Lỗi chia cho 0\n", isHidden: true }
    ]
  },

  // 2. Bắt lỗi chia cho 0
  {
    title: 'Bắt lỗi chia cho 0',
    solutionCode: `try:
    a = int(input())
    b = int(input())
    print(a / b)
except ZeroDivisionError:
    print("Không thể chia cho 0")
`,
    testCases: [
      { input: "10\n0\n", expectedOutput: "Không thể chia cho 0\n", isHidden: false },
      { input: "15\n3\n", expectedOutput: "5.0\n", isHidden: true },
      { input: "7\n2\n", expectedOutput: "3.5\n", isHidden: true },
      { input: "0\n5\n", expectedOutput: "0.0\n", isHidden: true },
      { input: "100\n0\n", expectedOutput: "Không thể chia cho 0\n", isHidden: true }
    ]
  },

  // 3. Bắt lỗi ép kiểu dữ liệu
  {
    title: 'Bắt lỗi ép kiểu dữ liệu',
    solutionCode: `try:
    x = int(input())
    print(x)
except ValueError:
    print("Đầu vào không phải là số hợp lệ")
`,
    testCases: [
      { input: "abc\n", expectedOutput: "Đầu vào không phải là số hợp lệ\n", isHidden: false },
      { input: "123\n", expectedOutput: "123\n", isHidden: true },
      { input: "3.14\n", expectedOutput: "Đầu vào không phải là số hợp lệ\n", isHidden: true },
      { input: "-99\n", expectedOutput: "-99\n", isHidden: true },
      { input: "hello world\n", expectedOutput: "Đầu vào không phải là số hợp lệ\n", isHidden: true }
    ]
  },

  // 4. Custom Exception - Lỗi số âm
  {
    title: 'Custom Exception - Lỗi số âm',
    problemDescription: `### Bài tập: Custom Exception - Lỗi số âm

- **Mô tả:** Nhập vào một số nguyên đại diện cho tuổi học viên.
- **Yêu cầu:** Tạo lớp ngoại lệ \`SoAmError(Exception)\`. Viết hàm \`nhap_tuoi(tuoi)\`:
  - Nếu \`tuoi < 0\`, ném ngoại lệ \`raise SoAmError("Tuổi không được âm")\`.
  - Ngược lại, in ra \`Tuổi hợp lệ: {tuoi}\`.
  - Sử dụng khối \`try-except\` bắt \`SoAmError\` và in thông báo lỗi ra màn hình.
- **Input:** Một số nguyên.
- **Output:** Thông báo kết quả tương ứng.
- **Ví dụ:**
\`\`\`text
Input:
20
Output:
Tuổi hợp lệ: 20
\`\`\``,
    starterCode: `class SoAmError(Exception):
    pass

# Viết hàm nhap_tuoi và khối try-except
`,
    solutionCode: `class SoAmError(Exception):
    pass

def nhap_tuoi(tuoi):
    if tuoi < 0:
        raise SoAmError("Tuổi không được âm")
    print(f"Tuổi hợp lệ: {tuoi}")

try:
    t = int(input())
    nhap_tuoi(t)
except SoAmError as e:
    print(e)
`,
    testCases: [
      { input: "20\n", expectedOutput: "Tuổi hợp lệ: 20\n", isHidden: false },
      { input: "-5\n", expectedOutput: "Tuổi không được âm\n", isHidden: true },
      { input: "0\n", expectedOutput: "Tuổi hợp lệ: 0\n", isHidden: true }
    ]
  },

  // 5. Đếm số ngày giữa hai thời gian với module datetime
  {
    title: 'Đếm số ngày giữa hai thời gian với module datetime',
    problemDescription: `### Bài tập: Đếm số ngày giữa hai thời gian với module datetime

- **Mô tả:** Nhập 2 ngày dưới dạng chuỗi định dạng "YYYY-MM-DD" trên 2 dòng riêng biệt. Sử dụng module \`datetime\` để chuyển thành đối tượng \`date\`, tính khoảng cách (số ngày dương) giữa hai thời điểm và in kết quả.
- **Input:** 2 dòng chứa 2 chuỗi ngày.
- **Output:** Một số nguyên là số ngày chênh lệch.
- **Ví dụ:**
\`\`\`text
Input:
2023-10-01
2023-10-10
Output:
9
\`\`\``,
    starterCode: `from datetime import datetime
# Nhập 2 ngày và tính khoảng cách
`,
    solutionCode: `from datetime import datetime
d1_str = input().strip()
d2_str = input().strip()
d1 = datetime.strptime(d1_str, "%Y-%m-%d")
d2 = datetime.strptime(d2_str, "%Y-%m-%d")
print(abs((d2 - d1).days))
`,
    testCases: [
      { input: "2023-10-01\n2023-10-10\n", expectedOutput: "9\n", isHidden: false },
      { input: "2024-01-01\n2024-01-01\n", expectedOutput: "0\n", isHidden: true },
      { input: "2023-12-31\n2024-01-10\n", expectedOutput: "10\n", isHidden: true }
    ]
  },

  // 6. Fibonacci thứ N
  {
    title: 'Fibonacci thứ N',
    problemDescription: `### Bài tập: Fibonacci thứ N

- **Mô tả:** Viết hàm \`fibonacci(n)\` tính và trả về số thứ \`n\` trong dãy Fibonacci, quy ước: $F(1) = 1, F(2) = 1, F(3) = 2, F(4) = 3...$. Nhập số nguyên dương \`n\` từ bàn phím và in kết quả.
- **Input:** Số nguyên dương \`n\`.
- **Output:** Số Fibonacci thứ \`n\`.
- **Ví dụ:**
\`\`\`text
Input:
6
Output:
8
\`\`\``,
    starterCode: `def fibonacci(n):
    # Viết code hàm tính Fibonacci
    pass

n = int(input())
print(fibonacci(n))
`,
    solutionCode: `def fibonacci(n):
    if n <= 2:
        return 1
    a, b = 1, 1
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

n = int(input())
print(fibonacci(n))
`,
    testCases: [
      { input: "6\n", expectedOutput: "8\n", isHidden: false },
      { input: "1\n", expectedOutput: "1\n", isHidden: true },
      { input: "10\n", expectedOutput: "55\n", isHidden: true },
      { input: "12\n", expectedOutput: "144\n", isHidden: true }
    ]
  },

  // 7. Giao dịch rút tiền ATM an toàn
  {
    title: 'Giao dịch rút tiền ATM an toàn',
    problemDescription: `### Bài tập: Giao dịch rút tiền ATM an toàn

- **Mô tả:** Giả sử số dư ban đầu \`so_du = 10000000\` (10 triệu), hạn mức rút tối đa mỗi lần là \`5000000\` (5 triệu). Nhập vào số tiền muốn rút \`so_tien\`.
  - Nếu \`so_tien < 50000\` hoặc \`so_tien % 50000 != 0\`: in \`Số tiền phải là bội số của 50000\`
  - Nếu \`so_tien > 5000000\`: in \`Vượt quá hạn mức mỗi lần rút\`
  - Nếu \`so_tien > 10000000\`: in \`Số dư không đủ\`
  - Ngược lại: in \`Rút tiền thành công: {so_tien}\`
- **Input:** Số nguyên \`so_tien\`.
- **Output:** Thông báo giao dịch.
- **Ví dụ:**
\`\`\`text
Input:
1000000
Output:
Rút tiền thành công: 1000000
\`\`\``,
    starterCode: `so_du = 10000000
han_muc = 5000000
so_tien = int(input())
# Kiểm tra điều kiện rút tiền
`,
    solutionCode: `so_du = 10000000
han_muc = 5000000
so_tien = int(input())

if so_tien < 50000 or so_tien % 50000 != 0:
    print("Số tiền phải là bội số của 50000")
elif so_tien > han_muc:
    print("Vượt quá hạn mức mỗi lần rút")
elif so_tien > so_du:
    print("Số dư không đủ")
else:
    print(f"Rút tiền thành công: {so_tien}")
`,
    testCases: [
      { input: "1000000\n", expectedOutput: "Rút tiền thành công: 1000000\n", isHidden: false },
      { input: "35000\n", expectedOutput: "Số tiền phải là bội số của 50000\n", isHidden: true },
      { input: "6000000\n", expectedOutput: "Vượt quá hạn mức mỗi lần rút\n", isHidden: true }
    ]
  },

  // 8. Hàm chào hỏi linh hoạt (Tham số mặc định)
  {
    title: 'Hàm chào hỏi linh hoạt (Tham số mặc định)',
    problemDescription: `### Bài tập: Hàm chào hỏi linh hoạt (Tham số mặc định)

- **Mô tả:** Viết hàm \`gui_thu_moi(ten, dia_diem="Hà Nội")\`. Hàm in ra: \`Kính mời {ten} tham dự sự kiện tại {dia_diem}!\`. Nhập \`ten\` ở dòng 1 và \`dia_diem\` ở dòng 2 (nếu dòng 2 là chuỗi \`DEFAULT\` thì gọi hàm với địa điểm mặc định).
- **Input:**
  - Dòng 1: Tên người nhận.
  - Dòng 2: Địa điểm hoặc "DEFAULT".
- **Output:** Dòng thư mời.
- **Ví dụ:**
\`\`\`text
Input:
Nam
Đà Nẵng
Output:
Kính mời Nam tham dự sự kiện tại Đà Nẵng!
\`\`\``,
    starterCode: `def gui_thu_moi(ten, dia_diem="Hà Nội"):
    # Viết hàm in lời mời
    pass

ten = input().strip()
dd = input().strip()
# Gọi hàm
`,
    solutionCode: `def gui_thu_moi(ten, dia_diem="Hà Nội"):
    print(f"Kính mời {ten} tham dự sự kiện tại {dia_diem}!")

ten = input().strip()
dd = input().strip()
if dd == "DEFAULT":
    gui_thu_moi(ten)
else:
    gui_thu_moi(ten, dd)
`,
    testCases: [
      { input: "Nam\nĐà Nẵng\n", expectedOutput: "Kính mời Nam tham dự sự kiện tại Đà Nẵng!\n", isHidden: false },
      { input: "Viet\nDEFAULT\n", expectedOutput: "Kính mời Viet tham dự sự kiện tại Hà Nội!\n", isHidden: true },
      { input: "Lan\nTP. Hồ Chí Minh\n", expectedOutput: "Kính mời Lan tham dự sự kiện tại TP. Hồ Chí Minh!\n", isHidden: true }
    ]
  },

  // 9. Hàm chuẩn hóa tên người
  {
    title: 'Hàm chuẩn hóa tên người',
    problemDescription: `### Bài tập: Hàm chuẩn hóa tên người

- **Mô tả:** Viết hàm \`chuan_hoa_ten(ten_tho)\` nhận vào một chuỗi họ tên thô (chứa nhiều khoảng trắng thừa, chữ hoa chữ thường lộn xộn). Trả về họ tên đã chuẩn hóa (mỗi từ viết hoa chữ cái đầu, các chữ sau viết thường, cách nhau đúng 1 dấu cách).
- **Input:** Chuỗi tên thô.
- **Output:** Tên đã chuẩn hóa.
- **Ví dụ:**
\`\`\`text
Input:
   nguYen   tUAn  vIET   
Output:
Nguyen Tuan Viet
\`\`\``,
    starterCode: `def chuan_hoa_ten(ten_tho):
    # Chuẩn hóa tên
    pass

s = input()
print(chuan_hoa_ten(s))
`,
    solutionCode: `def chuan_hoa_ten(ten_tho):
    words = ten_tho.strip().split()
    return " ".join(w.capitalize() for w in words)

s = input()
print(chuan_hoa_ten(s))
`,
    testCases: [
      { input: "   nguYen   tUAn  vIET   \n", expectedOutput: "Nguyen Tuan Viet\n", isHidden: false },
      { input: "tran   van   an\n", expectedOutput: "Tran Van An\n", isHidden: true },
      { input: "LE   HOANG\n", expectedOutput: "Le Hoang\n", isHidden: true }
    ]
  },

  // 10. Hàm in lời chào
  {
    title: 'Hàm in lời chào',
    solutionCode: `def xin_chao(ten):
    print(f"Xin chào, {ten}!")

ten = input().strip()
xin_chao(ten)
`,
    testCases: [
      { input: "Python\n", expectedOutput: "Xin chào, Python!\n", isHidden: false },
      { input: "Nam\n", expectedOutput: "Xin chào, Nam!\n", isHidden: true },
      { input: "Viet\n", expectedOutput: "Xin chào, Viet!\n", isHidden: true },
      { input: "Admin\n", expectedOutput: "Xin chào, Admin!\n", isHidden: true },
      { input: "AI Assistant\n", expectedOutput: "Xin chào, AI Assistant!\n", isHidden: true }
    ]
  },

  // 11. Hàm kiểm tra số chẵn
  {
    title: 'Hàm kiểm tra số chẵn',
    solutionCode: `def la_so_chan(n):
    return n % 2 == 0

n = int(input())
print(la_so_chan(n))
`,
    testCases: [
      { input: "10\n", expectedOutput: "True\n", isHidden: false },
      { input: "7\n", expectedOutput: "False\n", isHidden: true },
      { input: "0\n", expectedOutput: "True\n", isHidden: true },
      { input: "-6\n", expectedOutput: "True\n", isHidden: true },
      { input: "-13\n", expectedOutput: "False\n", isHidden: true }
    ]
  },

  // 12. Hàm kiểm tra số nguyên tố
  {
    title: 'Hàm kiểm tra số nguyên tố',
    problemDescription: `### Bài tập: Hàm kiểm tra số nguyên tố

- **Mô tả:** Viết hàm \`la_so_nguyen_to(n)\` nhận vào một số nguyên \`n\`. Trả về \`True\` nếu \`n\` là số nguyên tố, ngược lại trả về \`False\`. Nhập \`n\` từ bàn phím và in kết quả.
- **Input:** Số nguyên \`n\`.
- **Output:** \`True\` hoặc \`False\`.
- **Ví dụ:**
\`\`\`text
Input:
7
Output:
True
\`\`\``,
    starterCode: `def la_so_nguyen_to(n):
    # Kiểm tra số nguyên tố
    pass

n = int(input())
print(la_so_nguyen_to(n))
`,
    solutionCode: `def la_so_nguyen_to(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

n = int(input())
print(la_so_nguyen_to(n))
`,
    testCases: [
      { input: "7\n", expectedOutput: "True\n", isHidden: false },
      { input: "4\n", expectedOutput: "False\n", isHidden: true },
      { input: "1\n", expectedOutput: "False\n", isHidden: true },
      { input: "2\n", expectedOutput: "True\n", isHidden: true }
    ]
  },

  // 13. Hàm tính bình phương
  {
    title: 'Hàm tính bình phương',
    solutionCode: `def binh_phuong(x):
    return x ** 2

x = int(input())
print(binh_phuong(x))
`,
    testCases: [
      { input: "5\n", expectedOutput: "25\n", isHidden: false },
      { input: "9\n", expectedOutput: "81\n", isHidden: true },
      { input: "-4\n", expectedOutput: "16\n", isHidden: true },
      { input: "0\n", expectedOutput: "0\n", isHidden: true },
      { input: "12\n", expectedOutput: "144\n", isHidden: true }
    ]
  },

  // 14. Hàm tính chu vi hình chữ nhật
  {
    title: 'Hàm tính chu vi hình chữ nhật',
    solutionCode: `def chu_vi_hcn(chieu_dai, chieu_rong):
    return (chieu_dai + chieu_rong) * 2

chieu_dai = int(input())
chieu_rong = int(input())
print(chu_vi_hcn(chieu_dai, chieu_rong))
`,
    testCases: [
      { input: "5\n3\n", expectedOutput: "16\n", isHidden: false },
      { input: "10\n4\n", expectedOutput: "28\n", isHidden: true },
      { input: "7\n2\n", expectedOutput: "18\n", isHidden: true },
      { input: "15\n8\n", expectedOutput: "46\n", isHidden: true },
      { input: "20\n20\n", expectedOutput: "80\n", isHidden: true }
    ]
  },

  // 15. Hàm tính giai thừa
  {
    title: 'Hàm tính giai thừa',
    problemDescription: `### Bài tập: Hàm tính giai thừa

- **Mô tả:** Viết hàm \`giai_thua(n)\` tính giai thừa của số nguyên không âm \`n\` ($n! = 1 \times 2 \times ... \times n$, quy ước $0! = 1$). Nhập \`n\` từ bàn phím và in kết quả.
- **Input:** Số nguyên \`n \ge 0\`.
- **Output:** Giá trị $n!$.
- **Ví dụ:**
\`\`\`text
Input:
5
Output:
120
\`\`\``,
    starterCode: `def giai_thua(n):
    # Tính giai thừa
    pass

n = int(input())
print(giai_thua(n))
`,
    solutionCode: `def giai_thua(n):
    res = 1
    for i in range(2, n + 1):
        res *= i
    return res

n = int(input())
print(giai_thua(n))
`,
    testCases: [
      { input: "5\n", expectedOutput: "120\n", isHidden: false },
      { input: "0\n", expectedOutput: "1\n", isHidden: true },
      { input: "6\n", expectedOutput: "720\n", isHidden: true }
    ]
  },

  // 16. Hàm tính tổng một danh sách
  {
    title: 'Hàm tính tổng một danh sách',
    solutionCode: `def tinh_tong_danh_sach(lst):
    return sum(lst)

n = int(input())
lst = []
for _ in range(n):
    lst.append(int(input()))
print(tinh_tong_danh_sach(lst))
`,
    testCases: [
      { input: "4\n1\n2\n3\n4\n", expectedOutput: "10\n", isHidden: false },
      { input: "3\n10\n25\n15\n", expectedOutput: "50\n", isHidden: true },
      { input: "4\n-5\n10\n-2\n7\n", expectedOutput: "10\n", isHidden: true },
      { input: "1\n100\n", expectedOutput: "100\n", isHidden: true },
      { input: "5\n2\n4\n6\n8\n10\n", expectedOutput: "30\n", isHidden: true },
      { input: "2\n-50\n50\n", expectedOutput: "0\n", isHidden: true }
    ]
  },

  // 17. Khử trùng lặp chuỗi dùng đệ quy
  {
    title: 'Khử trùng lặp chuỗi dùng đệ quy',
    problemDescription: `### Bài tập: Khử trùng lặp chuỗi dùng đệ quy

- **Mô tả:** Nhập vào một chuỗi ký tự \`s\`. Viết hàm loại bỏ các cặp ký tự trùng nhau đứng liền kề liên tiếp cho đến khi không còn cặp nào trùng nhau đứng cạnh nhau. In chuỗi kết quả cuối cùng.
- **Input:** Một chuỗi ký tự.
- **Output:** Chuỗi sau khi đã khử toàn bộ trùng lặp liền kề.
- **Ví dụ:**
\`\`\`text
Input:
abbaca
Output:
ca
\`\`\``,
    starterCode: `s = input().strip()
# Khử các cặp ký tự liền kề giống nhau
`,
    solutionCode: `s = input().strip()
stack = []
for ch in s:
    if stack and stack[-1] == ch:
        stack.pop()
    else:
        stack.append(ch)
print("".join(stack))
`,
    testCases: [
      { input: "abbaca\n", expectedOutput: "ca\n", isHidden: false },
      { input: "azxxzy\n", expectedOutput: "ay\n", isHidden: true },
      { input: "a\n", expectedOutput: "a\n", isHidden: true }
    ]
  },

  // 18. Sử dụng module math để tính căn bậc hai
  {
    title: 'Sử dụng module math để tính căn bậc hai',
    solutionCode: `import math

x = float(input())
print(math.sqrt(x))
`,
    testCases: [
      { input: "16\n", expectedOutput: "4.0\n", isHidden: false },
      { input: "25\n", expectedOutput: "5.0\n", isHidden: true },
      { input: "9\n", expectedOutput: "3.0\n", isHidden: true },
      { input: "100\n", expectedOutput: "10.0\n", isHidden: true },
      { input: "1\n", expectedOutput: "1.0\n", isHidden: true }
    ]
  },

  // 19. Sử dụng module random sinh số ngẫu nhiên
  {
    title: 'Sử dụng module random sinh số ngẫu nhiên',
    solutionCode: `import random

random.seed(42)
print(random.randint(1, 10))
`,
    testCases: [
      { input: "\n", expectedOutput: "2\n", isHidden: false },
      { input: "test\n", expectedOutput: "2\n", isHidden: true }
    ]
  },

  // 20. Thuật toán Tìm kiếm Nhị phân (Binary Search)
  {
    title: 'Thuật toán Tìm kiếm Nhị phân (Binary Search)',
    problemDescription: `### Bài tập: Thuật toán Tìm kiếm Nhị phân (Binary Search)

- **Mô tả:** Dòng 1 là danh sách các số nguyên đã được sắp xếp tăng dần cách nhau bởi khoảng trắng. Dòng 2 là số nguyên \`target\` cần tìm. Hãy viết thuật toán tìm kiếm nhị phân in ra chỉ số của \`target\` trong danh sách. Nếu không tìm thấy, in ra \`-1\`.
- **Input:**
  - Dòng 1: Danh sách các số nguyên tăng dần.
  - Dòng 2: Số nguyên cần tìm.
- **Output:** Chỉ số của phần tử hoặc \`-1\`.
- **Ví dụ:**
\`\`\`text
Input:
2 3 4 10 40
10
Output:
3
\`\`\``,
    starterCode: `lst = list(map(int, input().split()))
target = int(input())
# Tìm kiếm nhị phân
`,
    solutionCode: `lst = list(map(int, input().split()))
target = int(input())

def binary_search(arr, x):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == x:
            return mid
        elif arr[mid] < x:
            low = mid + 1
        else:
            high = mid - 1
    return -1

print(binary_search(lst, target))
`,
    testCases: [
      { input: "2 3 4 10 40\n10\n", expectedOutput: "3\n", isHidden: false },
      { input: "2 3 4 10 40\n5\n", expectedOutput: "-1\n", isHidden: true },
      { input: "1 5 9 12 18\n1\n", expectedOutput: "0\n", isHidden: true }
    ]
  },

  // 21. Tìm số lớn hơn
  {
    title: 'Tìm số lớn hơn',
    solutionCode: `def so_lon_nhat(a, b):
    return a if a > b else b

a = int(input())
b = int(input())
print(so_lon_nhat(a, b))
`,
    testCases: [
      { input: "12\n18\n", expectedOutput: "18\n", isHidden: false },
      { input: "25\n10\n", expectedOutput: "25\n", isHidden: true },
      { input: "-5\n-12\n", expectedOutput: "-5\n", isHidden: true },
      { input: "7\n7\n", expectedOutput: "7\n", isHidden: true },
      { input: "100\n99\n", expectedOutput: "100\n", isHidden: true }
    ]
  },

  // 22. Tìm số tốt nhất (Hàm lọc)
  {
    title: 'Tìm số tốt nhất (Hàm lọc)',
    problemDescription: `### Bài tập: Tìm số tốt nhất (Hàm lọc)

- **Mô tả:** Dòng 1 là danh sách các số nguyên. Dòng 2 là số nguyên \`nguong\`. Viết hàm \`loc_so_lon_hon(lst, nguong)\` trả về danh sách mới chỉ chứa các phần tử trong \`lst\` lớn hơn \`nguong\`. In danh sách kết quả ra màn hình.
- **Input:**
  - Dòng 1: Danh sách các số nguyên.
  - Dòng 2: Số nguyên ngưỡng.
- **Output:** Danh sách các số lớn hơn ngưỡng.
- **Ví dụ:**
\`\`\`text
Input:
1 5 8 12 3
6
Output:
[8, 12]
\`\`\``,
    starterCode: `def loc_so_lon_hon(lst, nguong):
    # Lọc các số > nguong
    pass

lst = list(map(int, input().split()))
nguong = int(input())
print(loc_so_lon_hon(lst, nguong))
`,
    solutionCode: `def loc_so_lon_hon(lst, nguong):
    return [x for x in lst if x > nguong]

lst = list(map(int, input().split()))
nguong = int(input())
print(loc_so_lon_hon(lst, nguong))
`,
    testCases: [
      { input: "1 5 8 12 3\n6\n", expectedOutput: "[8, 12]\n", isHidden: false },
      { input: "10 20 30\n5\n", expectedOutput: "[10, 20, 30]\n", isHidden: true },
      { input: "4 2 1\n10\n", expectedOutput: "[]\n", isHidden: true }
    ]
  },

  // 23. Tính lãi kép (Compound Interest)
  {
    title: 'Tính lãi kép (Compound Interest)',
    problemDescription: `### Bài tập: Tính lãi kép (Compound Interest)

- **Mô tả:** Viết hàm \`lai_kep(goc, lai_suat, nam)\` tính số tiền tích lũy theo công thức $A = P \times (1 + r)^t$.
- **Input:**
  - Dòng 1: Số tiền gốc \`P\` (float).
  - Dòng 2: Lãi suất năm \`r\` (float, ví dụ 0.05).
  - Dòng 3: Số năm \`t\` (int).
- **Output:** Số tiền tích lũy làm tròn 2 chữ số thập phân (in dạng float).
- **Ví dụ:**
\`\`\`text
Input:
1000
0.05
2
Output:
1102.5
\`\`\``,
    starterCode: `def lai_kep(goc, lai_suat, nam):
    # Tính lãi kép
    pass

goc = float(input())
lai_suat = float(input())
nam = int(input())
print(lai_kep(goc, lai_suat, nam))
`,
    solutionCode: `def lai_kep(goc, lai_suat, nam):
    res = goc * ((1 + lai_suat) ** nam)
    return round(res, 2)

goc = float(input())
lai_suat = float(input())
nam = int(input())
print(lai_kep(goc, lai_suat, nam))
`,
    testCases: [
      { input: "1000\n0.05\n2\n", expectedOutput: "1102.5\n", isHidden: false },
      { input: "5000\n0.1\n1\n", expectedOutput: "5500.0\n", isHidden: true },
      { input: "2000\n0.08\n3\n", expectedOutput: "2519.42\n", isHidden: true }
    ]
  },

  // 24. Tự thiết kế thư viện toán học riêng và nạp
  {
    title: 'Tự thiết kế thư viện toán học riêng và nạp',
    problemDescription: `### Bài tập: Tính UCLN và BCNN

- **Mô tả:** Nhập 2 số nguyên dương \`a\` và \`b\` trên 2 dòng riêng biệt. Viết hàm tính Ước chung lớn nhất (UCLN) và Bội chung nhỏ nhất (BCNN). In kết quả theo định dạng:
\`UCLN: {ucln}\`
\`BCNN: {bcnn}\`
- **Input:** 2 dòng, mỗi dòng là một số nguyên dương.
- **Output:** 2 dòng kết quả.
- **Ví dụ:**
\`\`\`text
Input:
12
18
Output:
UCLN: 6
BCNN: 36
\`\`\``,
    starterCode: `import math
a = int(input())
b = int(input())
# Tính và in UCLN, BCNN
`,
    solutionCode: `import math

a = int(input())
b = int(input())
ucln = math.gcd(a, b)
bcnn = (a * b) // ucln
print(f"UCLN: {ucln}")
print(f"BCNN: {bcnn}")
`,
    testCases: [
      { input: "12\n18\n", expectedOutput: "UCLN: 6\nBCNN: 36\n", isHidden: false },
      { input: "5\n7\n", expectedOutput: "UCLN: 1\nBCNN: 35\n", isHidden: true },
      { input: "20\n30\n", expectedOutput: "UCLN: 10\nBCNN: 60\n", isHidden: true }
    ]
  },

  // 25. Xử lý ngoại lệ KeyError và IndexError
  {
    title: 'Xử lý ngoại lệ KeyError và IndexError',
    problemDescription: `### Bài tập: Xử lý ngoại lệ KeyError trong từ điển kho hàng

- **Mô tả:** Cho kho hàng là từ điển: \`kho = {"tao": 5, "cam": 10, "chuoi": 8}\`. Nhập tên sản phẩm \`key\` từ bàn phím. Sử dụng khối \`try-except\` để tra cứu \`kho[key]\`. Nếu sản phẩm có trong kho, in số lượng của nó. Nếu xảy ra lỗi \`KeyError\`, in ra dòng chữ: \`Sản phẩm không có trong kho\`.
- **Input:** Chuỗi tên sản phẩm.
- **Output:** Số lượng sản phẩm hoặc thông báo lỗi.
- **Ví dụ:**
\`\`\`text
Input:
tao
Output:
5
\`\`\``,
    starterCode: `kho = {"tao": 5, "cam": 10, "chuoi": 8}
key = input().strip()
# Tra cứu trong try-except
`,
    solutionCode: `kho = {"tao": 5, "cam": 10, "chuoi": 8}
key = input().strip()
try:
    print(kho[key])
except KeyError:
    print("Sản phẩm không có trong kho")
`,
    testCases: [
      { input: "tao\n", expectedOutput: "5\n", isHidden: false },
      { input: "xoai\n", expectedOutput: "Sản phẩm không có trong kho\n", isHidden: true },
      { input: "cam\n", expectedOutput: "10\n", isHidden: true }
    ]
  }
];

async function updateModule7() {
  console.log(`🚀 Bắt đầu cập nhật Module 7 vào CSDL và Seed file...`);

  // Bổ sung thêm test case cho LS-07.06 (Bắt lỗi với Try-Except)
  const ls06 = await prisma.lesson.findFirst({
    where: { lessonId: 'LS-07.06' },
    include: { codingExercises: true }
  });

  if (ls06 && ls06.codingExercises.length > 0) {
    const ex = ls06.codingExercises[0];
    await prisma.testCase.deleteMany({ where: { exerciseId: ex.id } });
    await prisma.codingExercise.update({
      where: { id: ex.id },
      data: {
        testCases: {
          create: [
            { input: "5\n", expectedOutput: "25\n", isHidden: false },
            { input: "abc\n", expectedOutput: "Không phải số nguyên\n", isHidden: false },
            { input: "-4\n", expectedOutput: "16\n", isHidden: true },
            { input: "xyz 123\n", expectedOutput: "Không phải số nguyên\n", isHidden: true }
          ]
        }
      }
    });
    console.log(`✓ Đã cập nhật 4 TCs cho bài lý thuyết LS-07.06`);
  }

  // Cập nhật 25 bài LS-07.MP
  const mpLesson = await prisma.lesson.findFirst({
    where: { lessonId: 'LS-07.MP' },
    include: { codingExercises: true }
  });

  if (!mpLesson) {
    throw new Error('Không tìm thấy LS-07.MP');
  }

  for (const def of mpExercises) {
    const existing = mpLesson.codingExercises.find(
      (e) => e.title.trim().toLowerCase() === def.title.trim().toLowerCase()
    );

    if (!existing) {
      console.warn(`⚠️ Không tìm thấy bài tập: "${def.title}" trong LS-07.MP`);
      continue;
    }

    console.log(`- Cập nhật bài: "${def.title}" (ID: ${existing.id})...`);

    await prisma.testCase.deleteMany({
      where: { exerciseId: existing.id }
    });

    const updateData: any = {
      solutionCode: def.solutionCode,
      testCases: {
        create: def.testCases.map((tc) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden
        }))
      }
    };

    if (def.problemDescription) {
      updateData.problemDescription = def.problemDescription;
    }
    if (def.starterCode) {
      updateData.starterCode = def.starterCode;
    }

    await prisma.codingExercise.update({
      where: { id: existing.id },
      data: updateData
    });

    console.log(`  ✓ Xong (${def.testCases.length} TCs).`);
  }

  // Đồng bộ file seed_course_data.json
  const seedPath = path.resolve(__dirname, '../prisma/seed/seed_course_data.json');
  console.log(`\nĐang đồng bộ file seed: ${seedPath}...`);
  const seedContent = fs.readFileSync(seedPath, 'utf-8');
  const seedData = JSON.parse(seedContent);

  const pythonCourse = seedData.find((c: any) =>
    c.title?.includes('Python') || c.slug?.includes('python')
  );

  if (pythonCourse) {
    for (const module of pythonCourse.modules || []) {
      for (const chapter of module.chapters || []) {
        for (const lesson of chapter.lessons || []) {
          if (lesson.lessonId === 'LS-07.06') {
            for (const ex of lesson.codingExercises || []) {
              ex.testCases = [
                { input: "5\n", expectedOutput: "25\n", isHidden: false },
                { input: "abc\n", expectedOutput: "Không phải số nguyên\n", isHidden: false },
                { input: "-4\n", expectedOutput: "16\n", isHidden: true },
                { input: "xyz 123\n", expectedOutput: "Không phải số nguyên\n", isHidden: true }
              ];
            }
          }

          if (lesson.lessonId === 'LS-07.MP') {
            for (const def of mpExercises) {
              const ex = (lesson.codingExercises || []).find(
                (e: any) => e.title?.trim().toLowerCase() === def.title.trim().toLowerCase()
              );
              if (ex) {
                if (def.problemDescription) ex.problemDescription = def.problemDescription;
                if (def.starterCode) ex.starterCode = def.starterCode;
                ex.solutionCode = def.solutionCode;
                ex.testCases = def.testCases.map((tc) => ({
                  input: tc.input,
                  expectedOutput: tc.expectedOutput,
                  isHidden: tc.isHidden
                }));
              }
            }
          }
        }
      }
    }
    fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2), 'utf-8');
    console.log(`✓ Đã đồng bộ seed_course_data.json thành công!`);
  }

  console.log(`\n🎉 HOÀN TẤT CẬP NHẬT MODULE 7!`);
  await prisma.$disconnect();
}

updateModule7().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
