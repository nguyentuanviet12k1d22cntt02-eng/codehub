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

const mpExercises: ExerciseDef[] = [
  // 1. Ghi thông điệp vào tập tin
  {
    title: 'Ghi thông điệp vào tập tin',
    solutionCode: `with open("hello.txt", "w", encoding="utf-8") as f:
    f.write("Chào mừng tới lập trình Python!")

with open("hello.txt", "r", encoding="utf-8") as f:
    print(f.read())
`,
    testCases: [
      { input: "", expectedOutput: "Chào mừng tới lập trình Python!\n", isHidden: false }
    ]
  },

  // 2. Đọc dữ liệu từ tập tin
  {
    title: 'Đọc dữ liệu từ tập tin',
    solutionCode: `with open("hello.txt", "w", encoding="utf-8") as f:
    f.write("Chào mừng tới lập trình Python!")

with open("hello.txt", "r", encoding="utf-8") as f:
    print(f.read())
`,
    testCases: [
      { input: "", expectedOutput: "Chào mừng tới lập trình Python!\n", isHidden: false }
    ]
  },

  // 3. Ghi thêm dòng mới (Append)
  {
    title: 'Ghi thêm dòng mới (Append)',
    solutionCode: `with open("hello.txt", "w", encoding="utf-8") as f:
    f.write("Dòng 1\\n")

with open("hello.txt", "a", encoding="utf-8") as f:
    f.write("Chúc bạn học tốt!\\n")

with open("hello.txt", "r", encoding="utf-8") as f:
    print(f.read(), end="")
`,
    testCases: [
      { input: "", expectedOutput: "Dòng 1\nChúc bạn học tốt!\n", isHidden: false }
    ]
  },

  // 4. Lớp Học Sinh cơ bản
  {
    title: 'Lớp Học Sinh cơ bản',
    solutionCode: `class HocSinh:
    pass

hs1 = HocSinh()
print(type(hs1).__name__)
`,
    testCases: [
      { input: "", expectedOutput: "HocSinh\n", isHidden: false }
    ]
  },

  // 5. Lớp có constructor định nghĩa thuộc tính
  {
    title: 'Lớp có constructor định nghĩa thuộc tính',
    problemDescription: `### Bài tập: Lớp có constructor định nghĩa thuộc tính

- **Mô tả:** Thiết kế lớp \`SinhVien\` có hàm khởi tạo \`__init__(self, ho_ten, tuoi)\`.
- **Yêu cầu:** Nhập tên sinh viên ở dòng 1 và tuổi ở dòng 2. Khởi tạo đối tượng và in ra theo định dạng: \`Sinh viên: {ho_ten}, {tuoi} tuổi\`.
- **Input:**
  - Dòng 1: Họ tên sinh viên.
  - Dòng 2: Tuổi (số nguyên).
- **Output:** Thông tin sinh viên.
- **Ví dụ:**
\`\`\`text
Input:
Nam
20
Output:
Sinh viên: Nam, 20 tuổi
\`\`\``,
    starterCode: `class SinhVien:
    # Viết hàm __init__
    pass

name = input().strip()
age = int(input())
# Khởi tạo và in thông tin
`,
    solutionCode: `class SinhVien:
    def __init__(self, ho_ten, tuoi):
        self.ho_ten = ho_ten
        self.tuoi = tuoi

name = input().strip()
age = int(input())
sv = SinhVien(name, age)
print(f"Sinh viên: {sv.ho_ten}, {sv.tuoi} tuổi")
`,
    testCases: [
      { input: "Nam\n20\n", expectedOutput: "Sinh viên: Nam, 20 tuổi\n", isHidden: false },
      { input: "Minh\n18\n", expectedOutput: "Sinh viên: Minh, 18 tuổi\n", isHidden: true },
      { input: "An\n22\n", expectedOutput: "Sinh viên: An, 22 tuổi\n", isHidden: true }
    ]
  },

  // 6. Định nghĩa phương thức hoạt động
  {
    title: 'Định nghĩa phương thức hoạt động',
    problemDescription: `### Bài tập: Định nghĩa phương thức hoạt động

- **Mô tả:** Thiết kế lớp \`SinhVien\` có các thuộc tính \`ho_ten\`, \`tuoi\` và phương thức \`gioi_thieu(self)\` in ra: \`"Tôi tên là {ho_ten}, năm nay {tuoi} tuổi"\`.
- **Input:**
  - Dòng 1: Họ tên.
  - Dòng 2: Tuổi.
- **Output:** Lời giới thiệu.
- **Ví dụ:**
\`\`\`text
Input:
Nam
20
Output:
Tôi tên là Nam, năm nay 20 tuổi
\`\`\``,
    starterCode: `class SinhVien:
    # Viết class và method gioi_thieu
    pass

name = input().strip()
age = int(input())
sv = SinhVien(name, age)
sv.gioi_thieu()
`,
    solutionCode: `class SinhVien:
    def __init__(self, ho_ten, tuoi):
        self.ho_ten = ho_ten
        self.tuoi = tuoi
    def gioi_thieu(self):
        print(f"Tôi tên là {self.ho_ten}, năm nay {self.tuoi} tuổi")

name = input().strip()
age = int(input())
sv = SinhVien(name, age)
sv.gioi_thieu()
`,
    testCases: [
      { input: "Nam\n20\n", expectedOutput: "Tôi tên là Nam, năm nay 20 tuổi\n", isHidden: false },
      { input: "Lan\n19\n", expectedOutput: "Tôi tên là Lan, năm nay 19 tuổi\n", isHidden: true },
      { input: "Huy\n21\n", expectedOutput: "Tôi tên là Huy, năm nay 21 tuổi\n", isHidden: true }
    ]
  },

  // 7. Lớp tính diện tích hình tròn
  {
    title: 'Lớp tính diện tích hình tròn',
    problemDescription: `### Bài tập: Lớp tính diện tích hình tròn

- **Mô tả:** Thiết kế lớp \`HinhTron\` có thuộc tính bán kính \`r\`. Định nghĩa phương thức \`tinh_dien_tich(self)\` trả về diện tích ($S = 3.14 \times r^2$).
- **Input:** Một số thực \`r\`.
- **Output:** Diện tích hình tròn (in dạng float).
- **Ví dụ:**
\`\`\`text
Input:
5
Output:
78.5
\`\`\``,
    starterCode: `class HinhTron:
    # Viết class HinhTron
    pass

r = float(input())
ht = HinhTron(r)
print(ht.tinh_dien_tich())
`,
    solutionCode: `class HinhTron:
    def __init__(self, r):
        self.r = r
    def tinh_dien_tich(self):
        return round(3.14 * (self.r ** 2), 2)

r = float(input())
ht = HinhTron(r)
print(ht.tinh_dien_tich())
`,
    testCases: [
      { input: "5\n", expectedOutput: "78.5\n", isHidden: false },
      { input: "10\n", expectedOutput: "314.0\n", isHidden: true },
      { input: "2\n", expectedOutput: "12.56\n", isHidden: true }
    ]
  },

  // 8. Đọc file theo dòng
  {
    title: 'Đọc file theo dòng',
    solutionCode: `names = ["An", "Binh", "Chi"]
with open("danh_sach.txt", "w", encoding="utf-8") as f:
    for name in names:
        f.write(name + "\\n")

with open("danh_sach.txt", "r", encoding="utf-8") as f:
    for i, line in enumerate(f, 1):
        print(f"{i}. {line.strip()}")
`,
    testCases: [
      { input: "", expectedOutput: "1. An\n2. Binh\n3. Chi\n", isHidden: false }
    ]
  },

  // 9. Ghi danh sách số vào tập tin
  {
    title: 'Ghi danh sách số vào tập tin',
    solutionCode: `with open("numbers.txt", "w", encoding="utf-8") as f:
    for i in range(1, 6):
        f.write(f"{i}\\n")

with open("numbers.txt", "r", encoding="utf-8") as f:
    print(f.read(), end="")
`,
    testCases: [
      { input: "", expectedOutput: "1\n2\n3\n4\n5\n", isHidden: false }
    ]
  },

  // 10. Đọc số và tính tổng
  {
    title: 'Đọc số và tính tổng',
    solutionCode: `with open("numbers.txt", "w", encoding="utf-8") as f:
    f.write("10\\n20\\n30\\n40\\n50\\n")

with open("numbers.txt", "r", encoding="utf-8") as f:
    total = sum(int(line.strip()) for line in f if line.strip())
    print(total)
`,
    testCases: [
      { input: "", expectedOutput: "150\n", isHidden: false }
    ]
  },

  // 11. Hệ thống Quản lý Thư viện (Library Management System)
  {
    title: 'Hệ thống Quản lý Thư viện (Library Management System)',
    problemDescription: `### Bài tập: Quản lý mượn trả sách trong thư viện

- **Mô tả:** Thiết kế lớp \`Book(isbn, title, author)\` có thuộc tính \`borrowed = False\`.
- **Yêu cầu:** Lớp \`Library\` có danh sách \`books\`:
  - \`borrow_book(isbn)\`: Nếu sách tồn tại và chưa mượn, gán \`borrowed = True\` và in \`Mượn sách thành công: {title}\`. Nếu đã mượn, in \`Sách đã được mượn\`. Nếu không tìm thấy, in \`Không tìm thấy sách\`.
- **Input:** Mã ISBN cần mượn (ví dụ "101", "102", hoặc "999").
- **Output:** Thông báo mượn sách.
- **Ví dụ:**
\`\`\`text
Input:
101
Output:
Mượn sách thành công: Lập trình Python
\`\`\``,
    starterCode: `isbn_input = input().strip()
# Quản lý thư viện
`,
    solutionCode: `class Book:
    def __init__(self, isbn, title):
        self.isbn = isbn
        self.title = title
        self.borrowed = False

class Library:
    def __init__(self):
        self.books = {
            "101": Book("101", "Lập trình Python"),
            "102": Book("102", "Cấu trúc dữ liệu")
        }
        self.books["102"].borrowed = True

    def borrow_book(self, isbn):
        if isbn not in self.books:
            print("Không tìm thấy sách")
        elif self.books[isbn].borrowed:
            print("Sách đã được mượn")
        else:
            self.books[isbn].borrowed = True
            print(f"Mượn sách thành công: {self.books[isbn].title}")

isbn_input = input().strip()
lib = Library()
lib.borrow_book(isbn_input)
`,
    testCases: [
      { input: "101\n", expectedOutput: "Mượn sách thành công: Lập trình Python\n", isHidden: false },
      { input: "102\n", expectedOutput: "Sách đã được mượn\n", isHidden: true },
      { input: "999\n", expectedOutput: "Không tìm thấy sách\n", isHidden: true }
    ]
  },

  // 12. Hệ thống đọc lỗi log và cảnh báo (Log Analyzer)
  {
    title: 'Hệ thống đọc lỗi log và cảnh báo (Log Analyzer)',
    problemDescription: `### Bài tập: Phân tích file log hệ thống

- **Mô tả:** Đọc file log \`app.log\` (được tạo trước) và đếm số lượng các thông điệp theo cấp độ \`INFO\`, \`WARNING\`, \`ERROR\`.
- **Output:** In ra số lượng của từng loại log theo định dạng:
\`INFO: {so_luong}\`
\`WARNING: {so_luong}\`
\`ERROR: {so_luong}\`
`,
    solutionCode: `sample_log = """2023-10-12 10:00:00 INFO User logged in
2023-10-12 10:05:00 WARNING Low disk space
2023-10-12 10:10:00 ERROR Database connection failed
2023-10-12 10:15:00 INFO Task completed"""

with open("app.log", "w", encoding="utf-8") as f:
    f.write(sample_log)

counts = {"INFO": 0, "WARNING": 0, "ERROR": 0}
with open("app.log", "r", encoding="utf-8") as f:
    for line in f:
        for lvl in counts:
            if lvl in line:
                counts[lvl] += 1

print(f"INFO: {counts['INFO']}")
print(f"WARNING: {counts['WARNING']}")
print(f"ERROR: {counts['ERROR']}")
`,
    testCases: [
      { input: "", expectedOutput: "INFO: 2\nWARNING: 1\nERROR: 1\n", isHidden: false }
    ]
  },

  // 13. Tài khoản ngân hàng nâng cao và kế thừa thẻ tín dụng
  {
    title: 'Tài khoản ngân hàng nâng cao và kế thừa thẻ tín dụng',
    problemDescription: `### Bài tập: Thẻ tín dụng với hạn mức thấu chi

- **Mô tả:** Lớp \`TaiKhoanTinDung(chu_tk, so_du, han_muc)\`.
- **Yêu cầu:** Phương thức \`rut_tien(so_tien)\`:
  - Nếu \`so_tien <= so_du + han_muc\`: cho phép rút, cập nhật \`so_du -= so_tien\` và in \`Rút thành công, số dư còn: {so_du}\`.
  - Ngược lại: in \`Vượt quá hạn mức tín dụng\`.
- **Input:** Dòng 1 là số dư ban đầu, Dòng 2 là hạn mức, Dòng 3 là số tiền rút.
- **Output:** Thông báo giao dịch.
- **Ví dụ:**
\`\`\`text
Input:
1000
2000
2500
Output:
Rút thành công, số dư còn: -1500
\`\`\``,
    starterCode: `so_du = int(input())
han_muc = int(input())
so_tien = int(input())
# Viết logic thẻ tín dụng
`,
    solutionCode: `class TaiKhoanTinDung:
    def __init__(self, so_du, han_muc):
        self.so_du = so_du
        self.han_muc = han_muc

    def rut_tien(self, so_tien):
        if so_tien <= self.so_du + self.han_muc:
            self.so_du -= so_tien
            print(f"Rút thành công, số dư còn: {self.so_du}")
        else:
            print("Vượt quá hạn mức tín dụng")

so_du = int(input())
han_muc = int(input())
so_tien = int(input())
acc = TaiKhoanTinDung(so_du, han_muc)
acc.rut_tien(so_tien)
`,
    testCases: [
      { input: "1000\n2000\n2500\n", expectedOutput: "Rút thành công, số dư còn: -1500\n", isHidden: false },
      { input: "1000\n2000\n3500\n", expectedOutput: "Vượt quá hạn mức tín dụng\n", isHidden: true },
      { input: "500\n1000\n500\n", expectedOutput: "Rút thành công, số dư còn: 0\n", isHidden: true }
    ]
  },

  // 14. Hệ thống đa hình tính chu vi diện tích hình học (Polymorphism)
  {
    title: 'Hệ thống đa hình tính chu vi diện tích hình học (Polymorphism)',
    problemDescription: `### Bài tập: Tính diện tích hình tròn và hình chữ nhật

- **Mô tả:** Nhập bán kính hình tròn \`r\` (dòng 1), chiều dài \`d\` (dòng 2) và chiều rộng \`w\` (dòng 3). Tính và in diện tích của cả 2 hình trên 2 dòng riêng biệt:
\`Hình tròn: {dien_tich_tron}\`
\`Hình chữ nhật: {dien_tich_hcn}\`
(Diện tích hình tròn làm tròn 2 chữ số thập phân với \`pi = 3.14\`).
- **Input:** 3 dòng số (r, d, w).
- **Output:** 2 dòng kết quả.
- **Ví dụ:**
\`\`\`text
Input:
5
4
6
Output:
Hình tròn: 78.5
Hình chữ nhật: 24
\`\`\``,
    starterCode: `r = float(input())
d = int(input())
w = int(input())
# Tính diện tích đa hình
`,
    solutionCode: `r = float(input())
d = int(input())
w = int(input())
s_tron = round(3.14 * (r ** 2), 2)
s_hcn = d * w
print(f"Hình tròn: {s_tron}")
print(f"Hình chữ nhật: {s_hcn}")
`,
    testCases: [
      { input: "5\n4\n6\n", expectedOutput: "Hình tròn: 78.5\nHình chữ nhật: 24\n", isHidden: false },
      { input: "2\n10\n5\n", expectedOutput: "Hình tròn: 12.56\nHình chữ nhật: 50\n", isHidden: true },
      { input: "10\n3\n3\n", expectedOutput: "Hình tròn: 314.0\nHình chữ nhật: 9\n", isHidden: true }
    ]
  },

  // 15. Lưu trữ và phục hồi trạng thái đối tượng dạng JSON
  {
    title: 'Lưu trữ và phục hồi trạng thái đối tượng dạng JSON',
    problemDescription: `### Bài tập: Chuyển đổi đối tượng User sang JSON và ngược lại

- **Mô tả:** Nhập tên người dùng \`username\` ở dòng 1 và email ở dòng 2. Tạo đối tượng \`User\`, chuyển thành chuỗi JSON dạng \`{"username": "...", "email": "..."}\`, sau đó parse lại từ JSON và in ra: \`User: {username} - {email}\`.
- **Input:**
  - Dòng 1: Username.
  - Dòng 2: Email.
- **Output:** Chuỗi thông tin đã phục hồi.
- **Ví dụ:**
\`\`\`text
Input:
nam
nam@gmail.com
Output:
User: nam - nam@gmail.com
\`\`\``,
    starterCode: `import json
username = input().strip()
email = input().strip()
# Serialization và Deserialization
`,
    solutionCode: `import json

username = input().strip()
email = input().strip()

data = {"username": username, "email": email}
json_str = json.dumps(data)
obj = json.loads(json_str)

print(f"User: {obj['username']} - {obj['email']}")
`,
    testCases: [
      { input: "nam\nnam@gmail.com\n", expectedOutput: "User: nam - nam@gmail.com\n", isHidden: false },
      { input: "admin\nadmin@vibecode.ai\n", expectedOutput: "User: admin - admin@vibecode.ai\n", isHidden: true },
      { input: "user1\nu1@test.com\n", expectedOutput: "User: user1 - u1@test.com\n", isHidden: true }
    ]
  },

  // 16. Đếm số lượng từ trong tập tin văn bản
  {
    title: 'Đếm số lượng từ trong tập tin văn bản',
    solutionCode: `content = "Python là ngôn ngữ lập trình tuyệt vời"
with open("doc.txt", "w", encoding="utf-8") as f:
    f.write(content)

with open("doc.txt", "r", encoding="utf-8") as f:
    text = f.read()
    words = text.split()
    print(len(words))
`,
    testCases: [
      { input: "", expectedOutput: "8\n", isHidden: false }
    ]
  },

  // 17. Sao chép tệp văn bản
  {
    title: 'Sao chép tệp văn bản',
    solutionCode: `with open("source.txt", "w", encoding="utf-8") as f:
    f.write("Hello World from source\\n")

with open("source.txt", "r", encoding="utf-8") as src, open("backup.txt", "w", encoding="utf-8") as dst:
    for line in src:
        dst.write(line)

with open("backup.txt", "r", encoding="utf-8") as f:
    print(f.read(), end="")
`,
    testCases: [
      { input: "", expectedOutput: "Hello World from source\n", isHidden: false }
    ]
  },

  // 18. Lớp Nhân viên tính lương thực lĩnh
  {
    title: 'Lớp Nhân viên tính lương thực lĩnh',
    problemDescription: `### Bài tập: Tính lương thực lĩnh của nhân viên

- **Mô tả:** Thiết kế lớp \`NhanVien(ten, luong_cb, he_so)\` có phương thức \`tinh_luong()\` trả về: \`luong_cb * he_so\`.
- **Input:**
  - Dòng 1: Tên nhân viên.
  - Dòng 2: Lương cơ bản (số nguyên).
  - Dòng 3: Hệ số lương (số thực).
- **Output:** Thông tin lương theo định dạng: \`Nhân viên {ten}: {luong}\`.
- **Ví dụ:**
\`\`\`text
Input:
Hoang
5000000
2.5
Output:
Nhân viên Hoang: 12500000.0
\`\`\``,
    starterCode: `class NhanVien:
    # Viết class NhanVien
    pass

ten = input().strip()
luong_cb = int(input())
he_so = float(input())
# Tính và in lương
`,
    solutionCode: `class NhanVien:
    def __init__(self, ten, luong_cb, he_so):
        self.ten = ten
        self.luong_cb = luong_cb
        self.he_so = he_so
    def tinh_luong(self):
        return self.luong_cb * self.he_so

ten = input().strip()
luong_cb = int(input())
he_so = float(input())
nv = NhanVien(ten, luong_cb, he_so)
print(f"Nhân viên {nv.ten}: {nv.tinh_luong()}")
`,
    testCases: [
      { input: "Hoang\n5000000\n2.5\n", expectedOutput: "Nhân viên Hoang: 12500000.0\n", isHidden: false },
      { input: "An\n4000000\n1.5\n", expectedOutput: "Nhân viên An: 6000000.0\n", isHidden: true },
      { input: "Binh\n10000000\n3.0\n", expectedOutput: "Nhân viên Binh: 30000000.0\n", isHidden: true }
    ]
  },

  // 19. Lớp Phân Số (Fraction)
  {
    title: 'Lớp Phân Số (Fraction)',
    problemDescription: `### Bài tập: Rút gọn phân số

- **Mô tả:** Thiết kế lớp \`PhanSo(tu_so, mau_so)\` có phương thức \`rut_gon()\` chia cả tử và mẫu cho ước chung lớn nhất (\`math.gcd\`). In phân số tối giản theo định dạng: \`{tu}/{mau}\`.
- **Input:**
  - Dòng 1: Tử số (nguyên).
  - Dòng 2: Mẫu số (nguyên khác 0).
- **Output:** Phân số tối giản.
- **Ví dụ:**
\`\`\`text
Input:
6
8
Output:
3/4
\`\`\``,
    starterCode: `import math
tu = int(input())
mau = int(input())
# Rút gọn phân số
`,
    solutionCode: `import math

class PhanSo:
    def __init__(self, tu, mau):
        self.tu = tu
        self.mau = mau
    def rut_gon(self):
        g = math.gcd(self.tu, self.mau)
        return f"{self.tu // g}/{self.mau // g}"

tu = int(input())
mau = int(input())
ps = PhanSo(tu, mau)
print(ps.rut_gon())
`,
    testCases: [
      { input: "6\n8\n", expectedOutput: "3/4\n", isHidden: false },
      { input: "10\n5\n", expectedOutput: "2/1\n", isHidden: true },
      { input: "7\n3\n", expectedOutput: "7/3\n", isHidden: true }
    ]
  },

  // 20. Lập trình kế thừa Động vật kêu
  {
    title: 'Lập trình kế thừa Động vật kêu',
    solutionCode: `class DongVat:
    def keu(self):
        print("Động vật đang phát tiếng kêu")

class Cho(DongVat):
    def keu(self):
        print("Gâu gâu")

class Meo(DongVat):
    def keu(self):
        print("Meo meo")

cho = Cho()
meo = Meo()
cho.keu()
meo.keu()
`,
    testCases: [
      { input: "", expectedOutput: "Gâu gâu\nMeo meo\n", isHidden: false }
    ]
  },

  // 21. Xử lý tệp dữ liệu CSV kiểu mộc
  {
    title: 'Xử lý tệp dữ liệu CSV kiểu mộc',
    solutionCode: `csv_data = """An,8,9
Binh,7,6
Chi,10,9"""

with open("diem.csv", "w", encoding="utf-8") as f:
    f.write(csv_data)

with open("diem.csv", "r", encoding="utf-8") as f:
    for line in f:
        parts = line.strip().split(",")
        name = parts[0]
        p1, p2 = float(parts[1]), float(parts[2])
        avg = (p1 + p2) / 2
        print(f"{name}: {avg}")
`,
    testCases: [
      { input: "", expectedOutput: "An: 8.5\nBinh: 6.5\nChi: 9.5\n", isHidden: false }
    ]
  },

  // 22. Lớp Tài khoản ngân hàng (Account)
  {
    title: 'Lớp Tài khoản ngân hàng (Account)',
    problemDescription: `### Bài tập: Quản lý nạp rút tài khoản ngân hàng

- **Mô tả:** Thiết kế lớp \`TaiKhoan(chu_tk, so_du)\`. Có 2 phương thức:
  - \`nap_tien(so_tien)\`: cộng thêm tiền vào số dư.
  - \`rut_tien(so_tien)\`: trừ tiền khỏi số dư nếu đủ tiền mặt, nếu không đủ in \`Không đủ số dư\`.
- **Input:**
  - Dòng 1: Tên chủ tài khoản.
  - Dòng 2: Số dư khởi tạo.
  - Dòng 3: Số tiền nạp.
  - Dòng 4: Số tiền rút.
- **Output:** Số dư còn lại sau các giao dịch.
- **Ví dụ:**
\`\`\`text
Input:
Nam
1000
500
300
Output:
1200
\`\`\``,
    starterCode: `name = input().strip()
so_du = int(input())
nap = int(input())
rut = int(input())
# Quản lý giao dịch và in số dư
`,
    solutionCode: `class TaiKhoan:
    def __init__(self, chu_tk, so_du):
        self.chu_tk = chu_tk
        self.so_du = so_du
    def nap_tien(self, tien):
        self.so_du += tien
    def rut_tien(self, tien):
        if tien <= self.so_du:
            self.so_du -= tien
        else:
            print("Không đủ số dư")

name = input().strip()
so_du = int(input())
nap = int(input())
rut = int(input())
acc = TaiKhoan(name, so_du)
acc.nap_tien(nap)
acc.rut_tien(rut)
print(acc.so_du)
`,
    testCases: [
      { input: "Nam\n1000\n500\n300\n", expectedOutput: "1200\n", isHidden: false },
      { input: "An\n500\n200\n1000\n", expectedOutput: "Không đủ số dư\n700\n", isHidden: true },
      { input: "Viet\n2000\n1000\n3000\n", expectedOutput: "0\n", isHidden: true }
    ]
  },

  // 23. Kiểm tra và tính chu vi Tam giác
  {
    title: 'Kiểm tra và tính chu vi Tam giác',
    problemDescription: `### Bài tập: Kiểm tra và tính chu vi tam giác

- **Mô tả:** Nhập 3 cạnh tam giác \`a\`, \`b\`, \`c\` trên 3 dòng riêng biệt. Kiểm tra xem 3 cạnh có tạo thành tam giác hợp lệ không ($a+b>c$, $a+c>b$, $b+c>a$).
  - Nếu hợp lệ, in ra: \`Chu vi: {chu_vi}\`
  - Nếu không hợp lệ, in ra: \`Tam giác không hợp lệ\`
- **Input:** 3 dòng số nguyên.
- **Output:** Chu vi hoặc thông báo không hợp lệ.
- **Ví dụ:**
\`\`\`text
Input:
3
4
5
Output:
Chu vi: 12
\`\`\``,
    starterCode: `a = int(input())
b = int(input())
c = int(input())
# Kiểm tra tam giác
`,
    solutionCode: `a = int(input())
b = int(input())
c = int(input())
if a + b > c and a + c > b and b + c > a:
    print(f"Chu vi: {a + b + c}")
else:
    print("Tam giác không hợp lệ")
`,
    testCases: [
      { input: "3\n4\n5\n", expectedOutput: "Chu vi: 12\n", isHidden: false },
      { input: "1\n2\n5\n", expectedOutput: "Tam giác không hợp lệ\n", isHidden: true },
      { input: "6\n8\n10\n", expectedOutput: "Chu vi: 24\n", isHidden: true }
    ]
  },

  // 24. Ghi đè biểu thức biểu diễn đối tượng (__str__)
  {
    title: 'Ghi đè biểu thức biểu diễn đối tượng (__str__)',
    problemDescription: `### Bài tập: Ghi đè phương thức __str__

- **Mô tả:** Thiết kế lớp \`Book(title, author)\` có ghi đè phương thức ma thuật \`__str__(self)\` trả về chuỗi: \`"{title} - tác giả {author}"\`.
- **Input:**
  - Dòng 1: Tiêu đề sách.
  - Dòng 2: Tác giả.
- **Output:** Chuỗi đại diện của đối tượng.
- **Ví dụ:**
\`\`\`text
Input:
Dế Mèn Phiêu Lưu Ký
Tô Hoài
Output:
Dế Mèn Phiêu Lưu Ký - tác giả Tô Hoài
\`\`\``,
    starterCode: `class Book:
    # Ghi đè __str__
    pass

title = input().strip()
author = input().strip()
book = Book(title, author)
print(book)
`,
    solutionCode: `class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author
    def __str__(self):
        return f"{self.title} - tác giả {self.author}"

title = input().strip()
author = input().strip()
book = Book(title, author)
print(book)
`,
    testCases: [
      { input: "Dế Mèn Phiêu Lưu Ký\nTô Hoài\n", expectedOutput: "Dế Mèn Phiêu Lưu Ký - tác giả Tô Hoài\n", isHidden: false },
      { input: "Lão Hạc\nNam Cao\n", expectedOutput: "Lão Hạc - tác giả Nam Cao\n", isHidden: true },
      { input: "Clean Code\nRobert C. Martin\n", expectedOutput: "Clean Code - tác giả Robert C. Martin\n", isHidden: true }
    ]
  },

  // 25. Đọc tệp, lọc dữ liệu và xuất báo cáo
  {
    title: 'Đọc tệp, lọc dữ liệu và xuất báo cáo',
    solutionCode: `data = """An,8.5
Binh,6.0
Chi,9.0
Dung,7.5"""

with open("diem_sinh_vien.txt", "w", encoding="utf-8") as f:
    f.write(data)

with open("diem_sinh_vien.txt", "r", encoding="utf-8") as src, open("hoc_sinh_tot.txt", "w", encoding="utf-8") as dst:
    for line in src:
        parts = line.strip().split(",")
        name = parts[0]
        score = float(parts[1])
        if score >= 8.0:
            dst.write(f"{name}: {score}\\n")

with open("hoc_sinh_tot.txt", "r", encoding="utf-8") as f:
    print(f.read(), end="")
`,
    testCases: [
      { input: "", expectedOutput: "An: 8.5\nChi: 9.0\n", isHidden: false }
    ]
  }
];

async function updateModule8() {
  console.log(`🚀 Bắt đầu cập nhật Module 8 vào CSDL và Seed file...`);

  const mpLesson = await prisma.lesson.findFirst({
    where: { lessonId: 'LS-08.MP' },
    include: { codingExercises: true }
  });

  if (!mpLesson) {
    throw new Error('Không tìm thấy LS-08.MP');
  }

  for (const def of mpExercises) {
    const existing = mpLesson.codingExercises.find(
      (e) => e.title.trim().toLowerCase() === def.title.trim().toLowerCase()
    );

    if (!existing) {
      console.warn(`⚠️ Không tìm thấy bài tập: "${def.title}" trong LS-08.MP`);
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

    if (def.problemDescription) updateData.problemDescription = def.problemDescription;
    if (def.starterCode) updateData.starterCode = def.starterCode;

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
          if (lesson.lessonId === 'LS-08.MP') {
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

  console.log(`\n🎉 HOÀN TẤT CẬP NHẬT MODULE 8!`);
  await prisma.$disconnect();
}

updateModule8().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
