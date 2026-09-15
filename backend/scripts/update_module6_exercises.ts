import { prisma } from '../src/infrastructure/database/prisma';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

interface TestCaseDef {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface ExerciseUpdateDef {
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  problemDescription: string;
  starterCode: string;
  solutionCode: string;
  testCases: TestCaseDef[];
}

const exercisesData: ExerciseUpdateDef[] = [
  // 1. Tạo Dictionary và truy cập giá trị
  {
    title: 'Tạo Dictionary và truy cập giá trị',
    difficulty: 'EASY',
    problemDescription: `**Bài 1: Tạo Dictionary và truy cập giá trị**

- **Mô tả:** Tạo một dictionary \`thong_tin_nguoi\` lưu trữ thông tin của bạn An với các cặp key-value sau:
  - \`"ten"\`: \`"An"\`
  - \`"tuoi"\`: \`25\`
  - \`"thanh_pho"\`: \`"Hà Nội"\`
- **Yêu cầu:** Truy cập các key tương ứng của dictionary và in thông tin ra màn hình theo đúng 2 dòng:
\`\`\`text
Tên: An
Thành phố: Hà Nội
\`\`\`
- **Input:** Không có (khởi tạo dictionary cố định trong code).
- **Output:** Đúng 2 dòng như trên.`,
    starterCode: `# Khởi tạo dictionary thong_tin_nguoi
thong_tin_nguoi = {"ten": "An", "tuoi": 25, "thanh_pho": "Hà Nội"}

# Truy cập các key tương ứng và in ra màn hình
`,
    solutionCode: `thong_tin_nguoi = {"ten": "An", "tuoi": 25, "thanh_pho": "Hà Nội"}
print(f"Tên: {thong_tin_nguoi['ten']}")
print(f"Thành phố: {thong_tin_nguoi['thanh_pho']}")
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Tên: An\nThành phố: Hà Nội\n',
        isHidden: false
      }
    ]
  },

  // 2. Thêm cặp key-value mới
  {
    title: 'Thêm cặp key-value mới',
    difficulty: 'EASY',
    problemDescription: `**Bài 2: Thêm cặp key-value mới**

- **Mô tả:** Cho một dictionary \`sinh_vien = {"ma_sv": "SV001", "ten": "Bình"}\`.
- **Yêu cầu:**
  1. Thêm key \`"lop"\` với giá trị \`"K21"\`.
  2. Thêm key \`"diem_tb"\` với giá trị số thực \`8.8\`.
  3. In toàn bộ dictionary \`sinh_vien\` ra màn hình.
- **Input:** Không có.
- **Output:**
\`\`\`python
{'ma_sv': 'SV001', 'ten': 'Bình', 'lop': 'K21', 'diem_tb': 8.8}
\`\`\``,
    starterCode: `sinh_vien = {"ma_sv": "SV001", "ten": "Bình"}

# Thêm key "lop" và "diem_tb" vào sinh_vien và in kết quả
`,
    solutionCode: `sinh_vien = {"ma_sv": "SV001", "ten": "Bình"}
sinh_vien["lop"] = "K21"
sinh_vien["diem_tb"] = 8.8
print(sinh_vien)
`,
    testCases: [
      {
        input: '',
        expectedOutput: "{'ma_sv': 'SV001', 'ten': 'Bình', 'lop': 'K21', 'diem_tb': 8.8}\n",
        isHidden: false
      }
    ]
  },

  // 3. Sửa đổi giá trị
  {
    title: 'Sửa đổi giá trị',
    difficulty: 'EASY',
    problemDescription: `**Bài 3: Sửa đổi giá trị**

- **Mô tả:** Cho dictionary \`san_pham = {"ten": "Laptop", "gia": 15000000, "so_luong": 5}\`.
- **Yêu cầu:**
  1. Cập nhật key \`"gia"\` thành \`14500000\`.
  2. Cập nhật key \`"so_luong"\` thành \`7\`.
  3. In toàn bộ dictionary \`san_pham\` ra màn hình.
- **Input:** Không có.
- **Output:**
\`\`\`python
{'ten': 'Laptop', 'gia': 14500000, 'so_luong': 7}
\`\`\``,
    starterCode: `san_pham = {"ten": "Laptop", "gia": 15000000, "so_luong": 5}

# Cập nhật gia và so_luong rồi in kết quả
`,
    solutionCode: `san_pham = {"ten": "Laptop", "gia": 15000000, "so_luong": 5}
san_pham["gia"] = 14500000
san_pham["so_luong"] = 7
print(san_pham)
`,
    testCases: [
      {
        input: '',
        expectedOutput: "{'ten': 'Laptop', 'gia': 14500000, 'so_luong': 7}\n",
        isHidden: false
      }
    ]
  },

  // 4. Xóa cặp key-value
  {
    title: 'Xóa cặp key-value',
    difficulty: 'EASY',
    problemDescription: `**Bài 4: Xóa cặp key-value**

- **Mô tả:** Cho dictionary \`cau_hinh = {"CPU": "i7", "RAM": "16GB", "SSD": "512GB", "VGA": "RTX 3060"}\`.
- **Yêu cầu:**
  1. Xóa cặp key-value có key là \`"VGA"\` (dùng \`del\` hoặc \`.pop()\`).
  2. In toàn bộ dictionary \`cau_hinh\` ra màn hình.
- **Input:** Không có.
- **Output:**
\`\`\`python
{'CPU': 'i7', 'RAM': '16GB', 'SSD': '512GB'}
\`\`\``,
    starterCode: `cau_hinh = {"CPU": "i7", "RAM": "16GB", "SSD": "512GB", "VGA": "RTX 3060"}

# Xóa key "VGA" và in toàn bộ dictionary
`,
    solutionCode: `cau_hinh = {"CPU": "i7", "RAM": "16GB", "SSD": "512GB", "VGA": "RTX 3060"}
cau_hinh.pop("VGA", None)
print(cau_hinh)
`,
    testCases: [
      {
        input: '',
        expectedOutput: "{'CPU': 'i7', 'RAM': '16GB', 'SSD': '512GB'}\n",
        isHidden: false
      }
    ]
  },

  // 5. Kiểm tra sự tồn tại của key
  {
    title: 'Kiểm tra sự tồn tại của key',
    difficulty: 'EASY',
    problemDescription: `**Bài 5: Kiểm tra sự tồn tại của key**

- **Mô tả:** Cho dictionary \`thoi_tiet = {"Ha Noi": "Mưa", "Sai Gon": "Nắng"}\`.
- **Yêu cầu:**
  1. Dùng toán tử \`in\` kiểm tra xem key \`"Da Nang"\` có trong dictionary không.
  2. Nếu có, in: \`Có thông tin thời tiết của Da Nang.\`
  3. Nếu không có, in: \`Không có thông tin thời tiết của Da Nang.\`
- **Input:** Không có.
- **Output:**
\`\`\`text
Không có thông tin thời tiết của Da Nang.
\`\`\``,
    starterCode: `thoi_tiet = {"Ha Noi": "Mưa", "Sai Gon": "Nắng"}

# Kiểm tra key "Da Nang" có trong thoi_tiet không và in thông báo
`,
    solutionCode: `thoi_tiet = {"Ha Noi": "Mưa", "Sai Gon": "Nắng"}
if "Da Nang" in thoi_tiet:
    print("Có thông tin thời tiết của Da Nang.")
else:
    print("Không có thông tin thời tiết của Da Nang.")
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Không có thông tin thời tiết của Da Nang.\n',
        isHidden: false
      }
    ]
  },

  // 6. Lặp qua các key
  {
    title: 'Lặp qua các key',
    difficulty: 'EASY',
    problemDescription: `**Bài 6: Lặp qua các key**

- **Mô tả:** Cho dictionary \`khoa_hoc = {"Python": 10, "Java": 8, "C++": 7}\`.
- **Yêu cầu:** Dùng vòng lặp \`for\` duyệt qua các key của dictionary và in ra tất cả tên khóa học (mỗi tên trên 1 dòng).
- **Input:** Không có.
- **Output:**
\`\`\`text
Python
Java
C++
\`\`\``,
    starterCode: `khoa_hoc = {"Python": 10, "Java": 8, "C++": 7}

# Lặp qua các key và in tên từng khóa học
`,
    solutionCode: `khoa_hoc = {"Python": 10, "Java": 8, "C++": 7}
for ten in khoa_hoc:
    print(ten)
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Python\nJava\nC++\n',
        isHidden: false
      }
    ]
  },

  // 7. Lặp qua các value
  {
    title: 'Lặp qua các value',
    difficulty: 'EASY',
    problemDescription: `**Bài 7: Lặp qua các value**

- **Mô tả:** Cho dictionary \`khoa_hoc = {"Python": 10, "Java": 8, "C++": 7}\`.
- **Yêu cầu:** Dùng phương thức \`.values()\` kết hợp vòng lặp \`for\` để in ra số lượng học viên của từng khóa học (mỗi số lượng trên 1 dòng).
- **Input:** Không có.
- **Output:**
\`\`\`text
10
8
7
\`\`\``,
    starterCode: `khoa_hoc = {"Python": 10, "Java": 8, "C++": 7}

# Lặp qua các value và in số lượng học viên
`,
    solutionCode: `khoa_hoc = {"Python": 10, "Java": 8, "C++": 7}
for so_luong in khoa_hoc.values():
    print(so_luong)
`,
    testCases: [
      {
        input: '',
        expectedOutput: '10\n8\n7\n',
        isHidden: false
      }
    ]
  },

  // 8. Lặp qua cả key và value
  {
    title: 'Lặp qua cả key và value',
    difficulty: 'EASY',
    problemDescription: `**Bài 8: Lặp qua cả key và value**

- **Mô tả:** Cho dictionary \`khoa_hoc = {"Python": 10, "Java": 8, "C++": 7}\`.
- **Yêu cầu:** Dùng phương thức \`.items()\` để lặp qua từng cặp key-value và in ra màn hình theo định dạng \`Tên khóa học: Số lượng\`.
- **Input:** Không có.
- **Output:**
\`\`\`text
Python: 10
Java: 8
C++: 7
\`\`\``,
    starterCode: `khoa_hoc = {"Python": 10, "Java": 8, "C++": 7}

# Dùng .items() để lặp qua key, value và in định dạng 'Key: Value'
`,
    solutionCode: `khoa_hoc = {"Python": 10, "Java": 8, "C++": 7}
for ten, so_luong in khoa_hoc.items():
    print(f"{ten}: {so_luong}")
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Python: 10\nJava: 8\nC++: 7\n',
        isHidden: false
      }
    ]
  },

  // 9. Sử dụng .get() với giá trị mặc định
  {
    title: 'Sử dụng .get() với giá trị mặc định',
    difficulty: 'EASY',
    problemDescription: `**Bài 9: Sử dụng .get() với giá trị mặc định**

- **Mô tả:** Cho dictionary \`diem_thi = {"Toan": 9, "Ly": 8}\`.
- **Yêu cầu:** Dùng phương thức \`.get()\` để lấy điểm môn \`"Hoa"\`. Nếu môn \`"Hoa"\` không có trong dictionary, trả về giá trị mặc định là \`0\`. In kết quả theo định dạng:
\`\`\`text
Điểm môn Hoa: 0
\`\`\`
- **Input:** Không có.
- **Output:** Đúng dòng thông báo trên.`,
    starterCode: `diem_thi = {"Toan": 9, "Ly": 8}

# Dùng .get() lấy điểm môn "Hoa" với giá trị mặc định là 0
`,
    solutionCode: `diem_thi = {"Toan": 9, "Ly": 8}
diem_hoa = diem_thi.get("Hoa", 0)
print(f"Điểm môn Hoa: {diem_hoa}")
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Điểm môn Hoa: 0\n',
        isHidden: false
      }
    ]
  },

  // 10. Kích thước của Dictionary
  {
    title: 'Kích thước của Dictionary',
    difficulty: 'EASY',
    problemDescription: `**Bài 10: Kích thước của Dictionary**

- **Mô tả:** Cho dictionary danh bạ: \`danh_ba = {"An": "0912345678", "Binh": "0987654321", "Cuong": "0909090909"}\`.
- **Yêu cầu:** Dùng hàm \`len()\` để lấy tổng số liên lạc và in ra màn hình theo định dạng:
\`\`\`text
Tổng số liên lạc: 3
\`\`\`
- **Input:** Không có.
- **Output:** Đúng dòng thông báo trên.`,
    starterCode: `danh_ba = {"An": "0912345678", "Binh": "0987654321", "Cuong": "0909090909"}

# In ra tổng số liên lạc dùng hàm len()
`,
    solutionCode: `danh_ba = {"An": "0912345678", "Binh": "0987654321", "Cuong": "0909090909"}
print(f"Tổng số liên lạc: {len(danh_ba)}")
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Tổng số liên lạc: 3\n',
        isHidden: false
      }
    ]
  },

  // 11. Phân tích phần tử trùng và độc nhất giữa 2 danh sách khách hàng
  {
    title: 'Phân tích phần tử trùng và độc nhất giữa 2 danh sách khách hàng',
    difficulty: 'HARD',
    problemDescription: `**Bài 11: Phân tích phần tử trùng và độc nhất giữa 2 danh sách khách hàng**

- **Mô tả:** Cho hai danh sách email đăng ký sự kiện:
\`\`\`python
ngay1 = ["an@gmail.com", "binh@gmail.com", "cuong@gmail.com"]
ngay2 = ["binh@gmail.com", "duong@gmail.com", "an@gmail.com"]
\`\`\`
- **Yêu cầu:** Sử dụng cấu trúc **Set** (\`s1 = set(ngay1)\`, \`s2 = set(ngay2)\`) để tìm:
  1. Danh sách tất cả email (hợp: \`s1 | s2\`).
  2. Danh sách email tham gia cả 2 ngày (giao: \`s1 & s2\`).
  3. Danh sách email chỉ tham gia ngày 1 (hiệu: \`s1 - s2\`).
  4. Danh sách email chỉ tham gia đúng 1 trong 2 ngày (hiệu đối xứng: \`s1 ^ s2\`).
  
*(Lưu ý: Để đảm bảo thứ tự in ổn định khi chấm bài, hãy chuyển mỗi set kết quả thành list và sắp xếp tăng dần bằng \`sorted()\` trước khi in)*.

- **Output:**
\`\`\`text
Tất cả: ['an@gmail.com', 'binh@gmail.com', 'cuong@gmail.com', 'duong@gmail.com']
Cả hai ngày: ['an@gmail.com', 'binh@gmail.com']
Chỉ ngày 1: ['cuong@gmail.com']
Duy nhất một ngày: ['cuong@gmail.com', 'duong@gmail.com']
\`\`\``,
    starterCode: `ngay1 = ["an@gmail.com", "binh@gmail.com", "cuong@gmail.com"]
ngay2 = ["binh@gmail.com", "duong@gmail.com", "an@gmail.com"]

s1 = set(ngay1)
s2 = set(ngay2)

# In kết quả các phép toán tập hợp (sử dụng sorted(list(...)))
print(f"Tất cả: {sorted(list(s1 | s2))}")
print(f"Cả hai ngày: {sorted(list(s1 & s2))}")
print(f"Chỉ ngày 1: {sorted(list(s1 - s2))}")
print(f"Duy nhất một ngày: {sorted(list(s1 ^ s2))}")
`,
    solutionCode: `ngay1 = ["an@gmail.com", "binh@gmail.com", "cuong@gmail.com"]
ngay2 = ["binh@gmail.com", "duong@gmail.com", "an@gmail.com"]
s1 = set(ngay1)
s2 = set(ngay2)
print(f"Tất cả: {sorted(list(s1 | s2))}")
print(f"Cả hai ngày: {sorted(list(s1 & s2))}")
print(f"Chỉ ngày 1: {sorted(list(s1 - s2))}")
print(f"Duy nhất một ngày: {sorted(list(s1 ^ s2))}")
`,
    testCases: [
      {
        input: '',
        expectedOutput: `Tất cả: ['an@gmail.com', 'binh@gmail.com', 'cuong@gmail.com', 'duong@gmail.com']\nCả hai ngày: ['an@gmail.com', 'binh@gmail.com']\nChỉ ngày 1: ['cuong@gmail.com']\nDuy nhất một ngày: ['cuong@gmail.com', 'duong@gmail.com']\n`,
        isHidden: false
      }
    ]
  },

  // 12. Hệ thống quản lý Hashtags bài viết
  {
    title: 'Hệ thống quản lý Hashtags bài viết',
    difficulty: 'HARD',
    problemDescription: `**Bài 12: Hệ thống quản lý Hashtags bài viết**

- **Mô tả:** Cho một dictionary lưu các bài viết cùng tập hợp hashtags:
\`\`\`python
bai_viet = {
    "id1": {"python", "code", "dev"},
    "id2": {"code", "web", "learn"},
    "id3": {"python", "data", "code"}
}
tieu_chi = {"python", "code"}
\`\`\`
- **Yêu cầu:** Tìm tất cả mã \`id\` bài viết thỏa mãn tập hợp hashtag của bài viết đó **chứa toàn bộ** các thẻ trong \`tieu_chi\` (\`tieu_chi.issubset(tags)\`).
- **Output:** In danh sách các \`id\` tìm được dưới dạng list đã được sắp xếp tăng dần:
\`\`\`python
['id1', 'id3']
\`\`\``,
    starterCode: `bai_viet = {
    "id1": {"python", "code", "dev"},
    "id2": {"code", "web", "learn"},
    "id3": {"python", "data", "code"}
}
tieu_chi = {"python", "code"}

# Tìm các bài viết chứa toàn bộ tag trong tieu_chi và in kết quả đã sắp xếp
`,
    solutionCode: `bai_viet = {
    "id1": {"python", "code", "dev"},
    "id2": {"code", "web", "learn"},
    "id3": {"python", "data", "code"}
}
tieu_chi = {"python", "code"}
res = [k for k, tags in bai_viet.items() if tieu_chi.issubset(tags)]
print(sorted(res))
`,
    testCases: [
      {
        input: '',
        expectedOutput: "['id1', 'id3']\n",
        isHidden: false
      }
    ]
  },

  // 13. Loại bỏ từ trùng và hiển thị sắp xếp
  {
    title: 'Loại bỏ từ trùng và hiển thị sắp xếp',
    difficulty: 'HARD',
    problemDescription: `**Bài 13: Loại bỏ từ trùng và hiển thị sắp xếp**

- **Mô tả:** Nhập vào một dòng văn bản chứa các từ phân tách nhau bằng dấu cách (dùng hàm \`input()\`).
- **Yêu cầu:**
  1. Tách chuỗi thành các từ (\`.split()\`).
  2. Dùng \`set\` để loại bỏ các từ trùng lặp.
  3. Sắp xếp các từ theo thứ tự bảng chữ cái (A-Z).
  4. In các từ trên một dòng, phân tách nhau bằng dấu phẩy và khoảng trắng \`", "\`.
- **Ví dụ:**
  - Input: \`hoc python va hoc code va hoc lap trinh\`
  - Output: \`code, hoc, lap, python, trinh, va\``,
    starterCode: `van_ban = input().strip()

# Tách từ, loại bỏ trùng lặp bằng set, sắp xếp và in ra cách nhau bởi dấu phẩy
`,
    solutionCode: `van_ban = input().strip()
if van_ban:
    words = van_ban.split()
    unique_words = sorted(set(words))
    print(", ".join(unique_words))
`,
    testCases: [
      {
        input: 'hoc python va hoc code va hoc lap trinh\n',
        expectedOutput: 'code, hoc, lap, python, trinh, va\n',
        isHidden: false
      },
      {
        input: 'banana apple orange banana apple grape\n',
        expectedOutput: 'apple, banana, grape, orange\n',
        isHidden: true
      },
      {
        input: 'mot hai ba bon mot ba\n',
        expectedOutput: 'ba, bon, hai, mot\n',
        isHidden: true
      }
    ]
  },

  // 14. Phép toán hiệu đối xứng tùy biến
  {
    title: 'Phép toán hiệu đối xứng tùy biến',
    difficulty: 'HARD',
    problemDescription: `**Bài 14: Phép toán hiệu đối xứng tùy biến**

- **Mô tả:** Cho hai danh sách số nguyên:
\`\`\`python
listA = [1, 2, 3, 4, 4]
listB = [3, 4, 5, 6, 6]
\`\`\`
- **Yêu cầu:** Sử dụng \`set\` và phép hiệu đối xứng (toán tử \`^\`) để tìm các số nguyên chỉ xuất hiện ở \`listA\` hoặc \`listB\` nhưng không thuộc về cả hai. Sắp xếp kết quả tăng dần và in dưới dạng list.
- **Output:**
\`\`\`python
[1, 2, 5, 6]
\`\`\``,
    starterCode: `listA = [1, 2, 3, 4, 4]
listB = [3, 4, 5, 6, 6]

# Dùng set và phép hiệu đối xứng ^, sau đó sắp xếp và in kết quả dạng list
`,
    solutionCode: `listA = [1, 2, 3, 4, 4]
listB = [3, 4, 5, 6, 6]
res = sorted(list(set(listA) ^ set(listB)))
print(res)
`,
    testCases: [
      {
        input: '',
        expectedOutput: '[1, 2, 5, 6]\n',
        isHidden: false
      }
    ]
  },

  // 15. Tìm mối quan hệ bạn chung (Social Network)
  {
    title: 'Tìm mối quan hệ bạn chung (Social Network)',
    difficulty: 'HARD',
    problemDescription: `**Bài 15: Tìm mối quan hệ bạn chung (Social Network)**

- **Mô tả:** Cho mạng xã hội lưu danh sách bạn bè dạng dictionary các sets:
\`\`\`python
friends = {
    "An": {"Binh", "Cuong", "Dat"},
    "Binh": {"An", "Cuong", "Giang"},
    "Cuong": {"An", "Binh"}
}
\`\`\`
- **Yêu cầu:** Viết hàm \`ban_chung(person1, person2, network)\` trả về một \`set\` chứa danh sách bạn chung của \`person1\` và \`person2\` (dùng phép giao \`&\`).
- Sau đó, gọi hàm với \`ban_chung("An", "Binh", friends)\` và in kết quả ra màn hình.
- **Output:**
\`\`\`python
{'Cuong'}
\`\`\``,
    starterCode: `friends = {
    "An": {"Binh", "Cuong", "Dat"},
    "Binh": {"An", "Cuong", "Giang"},
    "Cuong": {"An", "Binh"}
}

def ban_chung(person1, person2, network):
    # Trả về set bạn chung của person1 và person2
    pass

# Gọi hàm và in kết quả
print(ban_chung("An", "Binh", friends))
`,
    solutionCode: `friends = {
    "An": {"Binh", "Cuong", "Dat"},
    "Binh": {"An", "Cuong", "Giang"},
    "Cuong": {"An", "Binh"}
}

def ban_chung(person1, person2, network):
    set1 = network.get(person1, set())
    set2 = network.get(person2, set())
    return set1 & set2

print(ban_chung("An", "Binh", friends))
`,
    testCases: [
      {
        input: '',
        expectedOutput: "{'Cuong'}\n",
        isHidden: false
      }
    ]
  },

  // 16. Đếm số lần xuất hiện của các từ
  {
    title: 'Đếm số lần xuất hiện của các từ',
    difficulty: 'MEDIUM',
    problemDescription: `**Bài 16: Đếm số lần xuất hiện của các từ**

- **Mô tả:** Viết hàm \`dem_tu(van_ban)\` nhận vào một chuỗi văn bản và trả về một dictionary, trong đó \`key\` là các từ (viết thường qua \`.lower()\`), và \`value\` là số lần xuất hiện của từ đó. Các từ phân tách nhau bằng dấu cách.
- Đọc một dòng văn bản từ bàn phím (\`input()\`), gọi hàm \`dem_tu()\` và in dictionary kết quả ra màn hình.
- **Ví dụ:**
  - Input: \`Python la mot ngon ngu lap trinh Python rat pho bien\`
  - Output: \`{'python': 2, 'la': 1, 'mot': 1, 'ngon': 1, 'ngu': 1, 'lap': 1, 'trinh': 1, 'rat': 1, 'pho': 1, 'bien': 1}\``,
    starterCode: `def dem_tu(van_ban):
    # Trả về dictionary đếm số lần xuất hiện của các từ
    pass

s = input()
print(dem_tu(s))
`,
    solutionCode: `def dem_tu(van_ban):
    words = van_ban.lower().split()
    freq = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1
    return freq

s = input()
print(dem_tu(s))
`,
    testCases: [
      {
        input: 'Python la mot ngon ngu lap trinh Python rat pho bien\n',
        expectedOutput: "{'python': 2, 'la': 1, 'mot': 1, 'ngon': 1, 'ngu': 1, 'lap': 1, 'trinh': 1, 'rat': 1, 'pho': 1, 'bien': 1}\n",
        isHidden: false
      },
      {
        input: 'apple banana apple orange banana apple\n',
        expectedOutput: "{'apple': 3, 'banana': 2, 'orange': 1}\n",
        isHidden: true
      },
      {
        input: 'mot mot hai hai ba\n',
        expectedOutput: "{'mot': 2, 'hai': 2, 'ba': 1}\n",
        isHidden: true
      }
    ]
  },

  // 17. Quản lý điểm học sinh
  {
    title: 'Quản lý điểm học sinh',
    difficulty: 'MEDIUM',
    problemDescription: `**Bài 17: Quản lý điểm học sinh**

- **Mô tả:** Viết hàm \`cap_nhat_diem(diem_hoc_sinh, ten_hoc_sinh, mon_hoc, diem)\` để cập nhật điểm cho học sinh:
  - \`diem_hoc_sinh\` có cấu trúc: \`{ten_hoc_sinh: {mon_hoc: diem, ...}}\`.
  - Nếu học sinh chưa có trong dictionary, thêm học sinh đó và điểm môn học.
  - Nếu học sinh đã có, cập nhật hoặc thêm điểm của môn học đó.
  - Hàm trả về dictionary sau khi cập nhật.
- Hãy gọi thử nghiệm với dữ liệu mẫu:
\`\`\`python
diem_goc = {"An": {"Toan": 8, "Van": 7}}
diem_goc = cap_nhat_diem(diem_goc, "An", "Ly", 9)
diem_goc = cap_nhat_diem(diem_goc, "Binh", "Toan", 7.5)
print(diem_goc)
\`\`\`
- **Output:**
\`\`\`python
{'An': {'Toan': 8, 'Van': 7, 'Ly': 9}, 'Binh': {'Toan': 7.5}}
\`\`\``,
    starterCode: `def cap_nhat_diem(diem_hoc_sinh, ten_hoc_sinh, mon_hoc, diem):
    # Cập nhật điểm và trả về dictionary
    pass

diem_goc = {"An": {"Toan": 8, "Van": 7}}
diem_goc = cap_nhat_diem(diem_goc, "An", "Ly", 9)
diem_goc = cap_nhat_diem(diem_goc, "Binh", "Toan", 7.5)
print(diem_goc)
`,
    solutionCode: `def cap_nhat_diem(diem_hoc_sinh, ten_hoc_sinh, mon_hoc, diem):
    if ten_hoc_sinh not in diem_hoc_sinh:
        diem_hoc_sinh[ten_hoc_sinh] = {}
    diem_hoc_sinh[ten_hoc_sinh][mon_hoc] = diem
    return diem_hoc_sinh

diem_goc = {"An": {"Toan": 8, "Van": 7}}
diem_goc = cap_nhat_diem(diem_goc, "An", "Ly", 9)
diem_goc = cap_nhat_diem(diem_goc, "Binh", "Toan", 7.5)
print(diem_goc)
`,
    testCases: [
      {
        input: '',
        expectedOutput: "{'An': {'Toan': 8, 'Van': 7, 'Ly': 9}, 'Binh': {'Toan': 7.5}}\n",
        isHidden: false
      }
    ]
  },

  // 18. Đếm số lượng phần tử duy nhất trong danh sách
  {
    title: 'Đếm số lượng phần tử duy nhất trong danh sách',
    difficulty: 'MEDIUM',
    problemDescription: `**Bài 18: Đếm số lượng phần tử duy nhất trong danh sách**

- **Mô tả:** Viết hàm \`dem_phan_tu_duy_nhat(danh_sach)\` nhận vào một list các phần tử. Hàm trả về một dictionary, trong đó key là phần tử và value là số lần xuất hiện của phần tử đó trong danh sách.
- Đọc một dòng các số nguyên từ bàn phím (nếu dòng trống thì dùng danh sách mặc định \`[1, 2, 2, 3, 1, 4, 2, 5]\`), gọi hàm và in kết quả ra màn hình.
- **Ví dụ:**
  - Input: \`1 2 2 3 1 4 2 5\`
  - Output: \`{1: 2, 2: 3, 3: 1, 4: 1, 5: 1}\``,
    starterCode: `def dem_phan_tu_duy_nhat(danh_sach):
    # Trả về dictionary {phần tử: số lần xuất hiện}
    pass

line = input().strip()
if line:
    lst = [int(x) for x in line.split()]
else:
    lst = [1, 2, 2, 3, 1, 4, 2, 5]

print(dem_phan_tu_duy_nhat(lst))
`,
    solutionCode: `def dem_phan_tu_duy_nhat(danh_sach):
    res = {}
    for x in danh_sach:
        res[x] = res.get(x, 0) + 1
    return res

line = input().strip()
if line:
    lst = [int(x) for x in line.split()]
else:
    lst = [1, 2, 2, 3, 1, 4, 2, 5]
print(dem_phan_tu_duy_nhat(lst))
`,
    testCases: [
      {
        input: '1 2 2 3 1 4 2 5\n',
        expectedOutput: '{1: 2, 2: 3, 3: 1, 4: 1, 5: 1}\n',
        isHidden: false
      },
      {
        input: '10 20 30 20 10\n',
        expectedOutput: '{10: 2, 20: 2, 30: 1}\n',
        isHidden: true
      },
      {
        input: '7 7 7 7\n',
        expectedOutput: '{7: 4}\n',
        isHidden: true
      }
    ]
  },

  // 19. Tìm giá trị lớn nhất/nhỏ nhất trong Dictionary
  {
    title: 'Tìm giá trị lớn nhất/nhỏ nhất trong Dictionary',
    difficulty: 'MEDIUM',
    problemDescription: `**Bài 19: Tìm giá trị lớn nhất/nhỏ nhất trong Dictionary**

- **Mô tả:** Cho dictionary kho hàng:
\`\`\`python
san_pham_kho = {
    "SP001": {"ten": "Chuột", "gia": 200000},
    "SP002": {"ten": "Bàn phím", "gia": 700000},
    "SP003": {"ten": "Màn hình", "gia": 2500000}
}
\`\`\`
- **Yêu cầu:** Viết hàm \`tim_san_pham_gia_cao_nhat(danh_sach_san_pham)\` trả về tên của sản phẩm có giá cao nhất trong kho.
- Gọi hàm với \`san_pham_kho\` và in ra tên sản phẩm tìm được.
- **Output:**
\`\`\`text
Màn hình
\`\`\``,
    starterCode: `san_pham_kho = {
    "SP001": {"ten": "Chuột", "gia": 200000},
    "SP002": {"ten": "Bàn phím", "gia": 700000},
    "SP003": {"ten": "Màn hình", "gia": 2500000}
}

def tim_san_pham_gia_cao_nhat(danh_sach_san_pham):
    # Tìm tên sản phẩm có giá cao nhất
    pass

print(tim_san_pham_gia_cao_nhat(san_pham_kho))
`,
    solutionCode: `san_pham_kho = {
    "SP001": {"ten": "Chuột", "gia": 200000},
    "SP002": {"ten": "Bàn phím", "gia": 700000},
    "SP003": {"ten": "Màn hình", "gia": 2500000}
}

def tim_san_pham_gia_cao_nhat(danh_sach_san_pham):
    max_gia = -1
    ten_max = ""
    for sp in danh_sach_san_pham.values():
        if sp["gia"] > max_gia:
            max_gia = sp["gia"]
            ten_max = sp["ten"]
    return ten_max

print(tim_san_pham_gia_cao_nhat(san_pham_kho))
`,
    testCases: [
      {
        input: '',
        expectedOutput: 'Màn hình\n',
        isHidden: false
      }
    ]
  },

  // 20. Chuyển đổi List of Dictionaries sang Dictionary
  {
    title: 'Chuyển đổi List of Dictionaries sang Dictionary',
    difficulty: 'MEDIUM',
    problemDescription: `**Bài 20: Chuyển đổi List of Dictionaries sang Dictionary**

- **Mô tả:** Viết hàm \`chuyen_doi_danh_sach(danh_sach_dict)\` nhận vào một list các dictionary. Mỗi dictionary có key \`"id"\` duy nhất. Hàm trả về một dictionary mới, trong đó \`key\` là giá trị của \`"id"\` và \`value\` là toàn bộ dictionary gốc đó.
- Cho dữ liệu mẫu:
\`\`\`python
users = [
    {"id": 101, "name": "Alice", "age": 30},
    {"id": 102, "name": "Bob", "age": 24},
    {"id": 103, "name": "Charlie", "age": 35}
]
\`\`\`
- Gọi hàm \`chuyen_doi_danh_sach(users)\` và in kết quả ra màn hình.
- **Output:**
\`\`\`python
{101: {'id': 101, 'name': 'Alice', 'age': 30}, 102: {'id': 102, 'name': 'Bob', 'age': 24}, 103: {'id': 103, 'name': 'Charlie', 'age': 35}}
\`\`\``,
    starterCode: `users = [
    {"id": 101, "name": "Alice", "age": 30},
    {"id": 102, "name": "Bob", "age": 24},
    {"id": 103, "name": "Charlie", "age": 35}
]

def chuyen_doi_danh_sach(danh_sach_dict):
    # Chuyển đổi list of dictionaries thành dictionary có key là id
    pass

print(chuyen_doi_danh_sach(users))
`,
    solutionCode: `users = [
    {"id": 101, "name": "Alice", "age": 30},
    {"id": 102, "name": "Bob", "age": 24},
    {"id": 103, "name": "Charlie", "age": 35}
]

def chuyen_doi_danh_sach(danh_sach_dict):
    return {item["id"]: item for item in danh_sach_dict}

print(chuyen_doi_danh_sach(users))
`,
    testCases: [
      {
        input: '',
        expectedOutput: "{101: {'id': 101, 'name': 'Alice', 'age': 30}, 102: {'id': 102, 'name': 'Bob', 'age': 24}, 103: {'id': 103, 'name': 'Charlie', 'age': 35}}\n",
        isHidden: false
      }
    ]
  },

  // 21. Đảo ngược dictionary (có trùng value)
  {
    title: 'Đảo ngược dictionary (có trùng value)',
    difficulty: 'MEDIUM',
    problemDescription: `**Bài 21: Đảo ngược dictionary (có trùng value)**

- **Mô tả:** Cho dictionary: \`d = {'a': 1, 'b': 2, 'c': 1}\`.
- **Yêu cầu:** Đảo ngược key ↔ value. Nếu nhiều key có cùng value, hãy gom các key đó thành một list theo thứ tự xuất hiện ban đầu.
- **Output:**
\`\`\`python
{1: ['a', 'c'], 2: ['b']}
\`\`\``,
    starterCode: `d = {'a': 1, 'b': 2, 'c': 1}

# Đảo key và value, gom các key có cùng value thành list
`,
    solutionCode: `d = {'a': 1, 'b': 2, 'c': 1}
res = {}
for k, v in d.items():
    if v not in res:
        res[v] = []
    res[v].append(k)
print(res)
`,
    testCases: [
      {
        input: '',
        expectedOutput: "{1: ['a', 'c'], 2: ['b']}\n",
        isHidden: false
      }
    ]
  }
];

async function updateAll() {
  console.log('🚀 Bắt đầu cập nhật 21 bài tập thực hành tổng hợp Module 6 vào CSDL và Seed file...');

  // 1. Tìm Lesson trong DB
  const lesson = await prisma.lesson.findFirst({
    where: { title: { contains: 'thực hành tổng hợp Module 6' } },
    include: { codingExercises: true }
  });

  if (!lesson) {
    throw new Error('Không tìm thấy lesson: Bài tập thực hành tổng hợp Module 6 trong CSDL!');
  }

  console.log(`Tìm thấy Lesson trong DB: ${lesson.title} (${lesson.id})`);

  // 2. Cập nhật từng exercise trong CSDL
  for (const item of exercisesData) {
    const dbEx = lesson.codingExercises.find(
      (e) => e.title.trim().toLowerCase() === item.title.trim().toLowerCase()
    );

    if (!dbEx) {
      console.warn(`⚠️ Không tìm thấy bài tập trong DB: "${item.title}"`);
      continue;
    }

    console.log(`\nĐang cập nhật bài: "${item.title}" (ID: ${dbEx.id})...`);

    // Cập nhật thông tin exercise
    await prisma.codingExercise.update({
      where: { id: dbEx.id },
      data: {
        difficulty: item.difficulty,
        problemDescription: item.problemDescription,
        starterCode: item.starterCode,
        solutionCode: item.solutionCode
      }
    });

    // Xóa test cases cũ
    await prisma.testCase.deleteMany({
      where: { exerciseId: dbEx.id }
    });

    // Tạo test cases mới
    for (const tc of item.testCases) {
      await prisma.testCase.create({
        data: {
          exerciseId: dbEx.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden
        }
      });
    }

    console.log(`  ✓ Đã cập nhật xong bài "${item.title}" với ${item.testCases.length} test cases.`);
  }

  // 3. Đồng bộ cập nhật vào file backend/prisma/seed/seed_course_data.json
  const seedFilePath = path.join(__dirname, '../prisma/seed/seed_course_data.json');
  console.log(`\nĐang cập nhật file seed: ${seedFilePath}...`);
  const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));

  const mod6 = seedData.find((m: any) => m.title.includes('Module 6'));
  if (mod6) {
    const chap = mod6.chapters.find((c: any) =>
      c.lessons.some((l: any) => l.title.includes('Bài tập thực hành tổng hợp Module 6'))
    );
    if (chap) {
      const seedLesson = chap.lessons.find((l: any) =>
        l.title.includes('Bài tập thực hành tổng hợp Module 6')
      );
      if (seedLesson && seedLesson.codingExercises) {
        for (const item of exercisesData) {
          const sEx = seedLesson.codingExercises.find(
            (e: any) => e.title.trim().toLowerCase() === item.title.trim().toLowerCase()
          );
          if (sEx) {
            sEx.difficulty = item.difficulty;
            sEx.problemDescription = item.problemDescription;
            sEx.starterCode = item.starterCode;
            sEx.solutionCode = item.solutionCode;
            sEx.testCases = item.testCases.map((tc) => ({
              id: randomUUID(),
              exerciseId: sEx.id,
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              isHidden: tc.isHidden,
              createdAt: new Date().toISOString()
            }));
          }
        }
      }
    }
  }

  fs.writeFileSync(seedFilePath, JSON.stringify(seedData, null, 2), 'utf8');
  console.log('✓ Đã đồng bộ thành công vào backend/prisma/seed/seed_course_data.json!');

  console.log('\n🎉 HOÀN TẤT CẬP NHẬT 21 BÀI TẬP VÀ TEST CASES CHO MODULE 6!');
}

updateAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
