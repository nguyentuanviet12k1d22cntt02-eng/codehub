import { prisma } from '../src/infrastructure/database/prisma';
import * as fs from 'fs';
import * as path from 'path';

interface TestCaseDef {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface ExerciseDef {
  id?: string;
  title: string;
  problemDescription: string;
  starterCode: string;
  solutionCode: string;
  testCases: TestCaseDef[];
}

// 16 BÀI LÝ THUYẾT (LS-05.01 -> LS-05.05)
const theoryExercises: Record<string, ExerciseDef[]> = {
  'LS-05.01': [
    {
      title: 'Tạo và in danh sách số nguyên',
      problemDescription: `### Bài tập: Tạo và in danh sách số nguyên

- **Mô tả:** Nhập một dòng chứa các số nguyên cách nhau bởi dấu cách. Hãy chuyển các số này thành một danh sách các số nguyên và in danh sách đó ra màn hình.
- **Input:** Một dòng chứa các số nguyên cách nhau bởi khoảng trắng.
- **Output:** Danh sách các số nguyên theo định dạng Python \`[x1, x2, ...]\`.
- **Ví dụ:**
\`\`\`text
Input:
1 2 3 4 5
Output:
[1, 2, 3, 4, 5]
\`\`\``,
      starterCode: `# Nhập và chuyển đổi thành danh sách số nguyên
nums = list(map(int, input().split()))
# In danh sách ra màn hình
`,
      solutionCode: `nums = list(map(int, input().split()))
print(nums)
`,
      testCases: [
        { input: "1 2 3 4 5\n", expectedOutput: "[1, 2, 3, 4, 5]\n", isHidden: false },
        { input: "10 20 30\n", expectedOutput: "[10, 20, 30]\n", isHidden: true },
        { input: "-5 0 5\n", expectedOutput: "[-5, 0, 5]\n", isHidden: true }
      ]
    },
    {
      title: 'Khởi tạo danh sách lặp phần tử',
      problemDescription: `### Bài tập: Khởi tạo danh sách lặp phần tử

- **Mô tả:** Nhập vào một số nguyên \`x\` ở dòng 1 và số nguyên \`n\` ở dòng 2. Sử dụng toán tử nhân \`*\` để tạo một danh sách chứa \`n\` phần tử có giá trị là \`x\`. In danh sách đó ra màn hình.
- **Input:**
  - Dòng 1: Số nguyên \`x\`.
  - Dòng 2: Số nguyên dương \`n\`.
- **Output:** Danh sách gồm \`n\` phần tử \`x\`.
- **Ví dụ:**
\`\`\`text
Input:
0
5
Output:
[0, 0, 0, 0, 0]
\`\`\``,
      starterCode: `x = int(input())
n = int(input())
# Tạo danh sách n phần tử x và in ra
`,
      solutionCode: `x = int(input())
n = int(input())
res = [x] * n
print(res)
`,
      testCases: [
        { input: "0\n5\n", expectedOutput: "[0, 0, 0, 0, 0]\n", isHidden: false },
        { input: "7\n3\n", expectedOutput: "[7, 7, 7]\n", isHidden: true },
        { input: "-1\n4\n", expectedOutput: "[-1, -1, -1, -1]\n", isHidden: true }
      ]
    }
  ],

  'LS-05.02': [
    {
      title: 'Thay thế phần tử theo chỉ số',
      problemDescription: `### Bài tập: Thay thế phần tử theo chỉ số

- **Mô tả:** Cho dòng 1 là danh sách các số nguyên (cách nhau bởi khoảng trắng). Dòng 2 là chỉ số \`i\` cần thay thế. Dòng 3 là giá trị mới \`val\`. Hãy thay thế phần tử tại chỉ số \`i\` bằng \`val\` và in danh sách sau khi cập nhật.
- **Input:**
  - Dòng 1: Danh sách các số nguyên.
  - Dòng 2: Chỉ số \`i\` (hợp lệ).
  - Dòng 3: Giá trị mới \`val\` (số nguyên).
- **Output:** Danh sách sau khi sửa đổi.
- **Ví dụ:**
\`\`\`text
Input:
10 20 30 40
1
99
Output:
[10, 99, 30, 40]
\`\`\``,
      starterCode: `nums = list(map(int, input().split()))
i = int(input())
val = int(input())
# Thay thế phần tử tại chỉ số i bằng val
`,
      solutionCode: `nums = list(map(int, input().split()))
i = int(input())
val = int(input())
nums[i] = val
print(nums)
`,
      testCases: [
        { input: "10 20 30 40\n1\n99\n", expectedOutput: "[10, 99, 30, 40]\n", isHidden: false },
        { input: "1 2 3\n0\n100\n", expectedOutput: "[100, 2, 3]\n", isHidden: true },
        { input: "5 6 7 8\n3\n0\n", expectedOutput: "[5, 6, 7, 0]\n", isHidden: true }
      ]
    },
    {
      title: 'Chèn phần tử với insert',
      problemDescription: `### Bài tập: Chèn phần tử với phương thức insert()

- **Mô tả:** Cho dòng 1 là danh sách các từ (cách nhau bởi khoảng trắng). Dòng 2 là chỉ số \`pos\`. Dòng 3 là từ \`item\` cần chèn. Hãy chèn \`item\` vào vị trí \`pos\` bằng phương thức \`insert()\` và in danh sách ra màn hình.
- **Input:**
  - Dòng 1: Danh sách các chuỗi.
  - Dòng 2: Chỉ số chèn \`pos\`.
  - Dòng 3: Chuỗi \`item\` cần chèn.
- **Output:** Danh sách kết quả.
- **Ví dụ:**
\`\`\`text
Input:
apple banana cherry
1
orange
Output:
['apple', 'orange', 'banana', 'cherry']
\`\`\``,
      starterCode: `lst = input().split()
pos = int(input())
item = input().strip()
# Chèn item vào vị trí pos và in danh sách
`,
      solutionCode: `lst = input().split()
pos = int(input())
item = input().strip()
lst.insert(pos, item)
print(lst)
`,
      testCases: [
        { input: "apple banana cherry\n1\norange\n", expectedOutput: "['apple', 'orange', 'banana', 'cherry']\n", isHidden: false },
        { input: "a b c\n0\nz\n", expectedOutput: "['z', 'a', 'b', 'c']\n", isHidden: true },
        { input: "x y\n2\nz\n", expectedOutput: "['x', 'y', 'z']\n", isHidden: true }
      ]
    }
  ],

  'LS-05.03': [
    {
      title: 'Duyệt mảng và in bình phương',
      problemDescription: `### Bài tập: Duyệt danh sách và in bình phương

- **Mô tả:** Nhập vào một danh sách các số nguyên cách nhau bởi khoảng trắng. Sử dụng vòng lặp \`for\` duyệt qua từng phần tử và in bình phương của mỗi số trên một dòng riêng biệt.
- **Input:** Một dòng chứa các số nguyên.
- **Output:** Mỗi dòng là bình phương của một phần tử theo thứ tự xuất hiện.
- **Ví dụ:**
\`\`\`text
Input:
1 2 3 4
Output:
1
4
9
16
\`\`\``,
      starterCode: `nums = list(map(int, input().split()))
# Duyệt và in bình phương từng phần tử
`,
      solutionCode: `nums = list(map(int, input().split()))
for x in nums:
    print(x ** 2)
`,
      testCases: [
        { input: "1 2 3 4\n", expectedOutput: "1\n4\n9\n16\n", isHidden: false },
        { input: "5 10\n", expectedOutput: "25\n100\n", isHidden: true },
        { input: "-2 0 3\n", expectedOutput: "4\n0\n9\n", isHidden: true }
      ]
    },
    {
      title: 'Đếm phần tử chia hết cho 3',
      problemDescription: `### Bài tập: Đếm các số chia hết cho 3

- **Mô tả:** Nhập vào một danh sách các số nguyên cách nhau bởi dấu cách. Hãy đếm xem có bao nhiêu phần tử trong danh sách chia hết cho 3 và in số lượng đó ra màn hình.
- **Input:** Danh sách các số nguyên trên 1 dòng.
- **Output:** Một số nguyên là số lượng phần tử chia hết cho 3.
- **Ví dụ:**
\`\`\`text
Input:
3 5 9 12 14
Output:
3
\`\`\``,
      starterCode: `nums = list(map(int, input().split()))
# Đếm số lượng phần tử chia hết cho 3
`,
      solutionCode: `nums = list(map(int, input().split()))
count = sum(1 for x in nums if x % 3 == 0)
print(count)
`,
      testCases: [
        { input: "3 5 9 12 14\n", expectedOutput: "3\n", isHidden: false },
        { input: "1 2 4 5 7\n", expectedOutput: "0\n", isHidden: true },
        { input: "6 18 27 30\n", expectedOutput: "4\n", isHidden: true }
      ]
    }
  ],

  'LS-05.04': [
    {
      title: 'Sắp xếp danh sách giảm dần',
      problemDescription: `### Bài tập: Sắp xếp danh sách giảm dần

- **Mô tả:** Nhập một dòng gồm các số nguyên cách nhau bởi dấu cách. Hãy sắp xếp danh sách theo thứ tự giảm dần và in ra màn hình.
- **Input:** Một dòng chứa các số nguyên.
- **Output:** Danh sách các số nguyên đã sắp xếp giảm dần.
- **Ví dụ:**
\`\`\`text
Input:
5 2 9 1 7
Output:
[9, 7, 5, 2, 1]
\`\`\``,
      starterCode: `nums = list(map(int, input().split()))
# Sắp xếp giảm dần và in ra
`,
      solutionCode: `nums = list(map(int, input().split()))
nums.sort(reverse=True)
print(nums)
`,
      testCases: [
        { input: "5 2 9 1 7\n", expectedOutput: "[9, 7, 5, 2, 1]\n", isHidden: false },
        { input: "10 20 30\n", expectedOutput: "[30, 20, 10]\n", isHidden: true },
        { input: "4 4 1 8\n", expectedOutput: "[8, 4, 4, 1]\n", isHidden: true }
      ]
    },
    {
      title: 'Tìm phần tử lớn thứ nhì',
      problemDescription: `### Bài tập: Tìm phần tử lớn thứ nhì

- **Mô tả:** Nhập vào một danh sách các số nguyên phân biệt cách nhau bởi khoảng trắng (ít nhất 2 phần tử). Hãy tìm và in ra số lớn thứ nhì trong danh sách.
- **Input:** Một dòng chứa các số nguyên phân biệt.
- **Output:** Số lớn thứ nhì.
- **Ví dụ:**
\`\`\`text
Input:
10 5 8 20 15
Output:
15
\`\`\``,
      starterCode: `nums = list(map(int, input().split()))
# Tìm số lớn thứ nhì
`,
      solutionCode: `nums = list(map(int, input().split()))
unique_sorted = sorted(list(set(nums)), reverse=True)
print(unique_sorted[1])
`,
      testCases: [
        { input: "10 5 8 20 15\n", expectedOutput: "15\n", isHidden: false },
        { input: "1 2\n", expectedOutput: "1\n", isHidden: true },
        { input: "100 45 80 95\n", expectedOutput: "95\n", isHidden: true }
      ]
    },
    {
      title: 'Kiểm tra phần tử thuộc danh sách',
      problemDescription: `### Bài tập: Kiểm tra phần tử thuộc danh sách

- **Mô tả:** Dòng 1 nhập vào danh sách các từ cách nhau bởi dấu cách. Dòng 2 nhập vào một từ \`target\`. Dùng toán tử \`in\` kiểm tra xem \`target\` có trong danh sách hay không và in ra \`True\` hoặc \`False\`.
- **Input:**
  - Dòng 1: Danh sách các từ.
  - Dòng 2: Từ cần kiểm tra.
- **Output:** \`True\` hoặc \`False\`.
- **Ví dụ:**
\`\`\`text
Input:
python java cpp ruby
python
Output:
True
\`\`\``,
      starterCode: `words = input().split()
target = input().strip()
# Kiểm tra target có trong words không
`,
      solutionCode: `words = input().split()
target = input().strip()
print(target in words)
`,
      testCases: [
        { input: "python java cpp ruby\npython\n", expectedOutput: "True\n", isHidden: false },
        { input: "apple banana orange\ngrape\n", expectedOutput: "False\n", isHidden: true },
        { input: "dog cat bird\ncat\n", expectedOutput: "True\n", isHidden: true }
      ]
    },
    {
      title: 'Tìm chỉ số đầu tiên của phần tử',
      problemDescription: `### Bài tập: Tìm chỉ số đầu tiên bằng index()

- **Mô tả:** Dòng 1 nhập vào danh sách các số nguyên. Dòng 2 nhập vào số nguyên \`x\` cần tìm (đảm bảo \`x\` luôn xuất hiện trong danh sách). Sử dụng phương thức \`index()\` để tìm và in chỉ số đầu tiên của \`x\`.
- **Input:**
  - Dòng 1: Danh sách số nguyên.
  - Dòng 2: Số nguyên \`x\`.
- **Output:** Chỉ số nguyên xuất hiện đầu tiên.
- **Ví dụ:**
\`\`\`text
Input:
10 20 30 20 50
20
Output:
1
\`\`\``,
      starterCode: `nums = list(map(int, input().split()))
x = int(input())
# In chỉ số đầu tiên của x
`,
      solutionCode: `nums = list(map(int, input().split()))
x = int(input())
print(nums.index(x))
`,
      testCases: [
        { input: "10 20 30 20 50\n20\n", expectedOutput: "1\n", isHidden: false },
        { input: "5 4 3 2 1\n5\n", expectedOutput: "0\n", isHidden: true },
        { input: "7 8 9 10\n10\n", expectedOutput: "3\n", isHidden: true }
      ]
    },
    {
      title: 'Đếm tần suất xuất hiện với count()',
      problemDescription: `### Bài tập: Đếm tần suất xuất hiện với count()

- **Mô tả:** Dòng 1 nhập vào danh sách các từ. Dòng 2 nhập vào từ \`w\` cần đếm. Dùng phương thức \`count()\` để đếm số lần xuất hiện của \`w\` trong danh sách và in ra màn hình.
- **Input:**
  - Dòng 1: Danh sách từ cách nhau bởi khoảng trắng.
  - Dòng 2: Từ cần đếm.
- **Output:** Số lần xuất hiện.
- **Ví dụ:**
\`\`\`text
Input:
hello world hello python hello
hello
Output:
3
\`\`\``,
      starterCode: `words = input().split()
w = input().strip()
# Đếm số lần xuất hiện của w
`,
      solutionCode: `words = input().split()
w = input().strip()
print(words.count(w))
`,
      testCases: [
        { input: "hello world hello python hello\nhello\n", expectedOutput: "3\n", isHidden: false },
        { input: "a b c d\nz\n", expectedOutput: "0\n", isHidden: true },
        { input: "ai ai ml ai dl\nai\n", expectedOutput: "3\n", isHidden: true }
      ]
    }
  ],

  'LS-05.05': [
    {
      title: 'Tạo Tuple và truy cập phần tử đầu cuối',
      problemDescription: `### Bài tập: Tạo Tuple và truy cập phần tử đầu cuối

- **Mô tả:** Nhập vào một dòng các số nguyên cách nhau bởi khoảng trắng. Chuyển chúng thành một tuple. In phần tử đầu tiên trên dòng 1 và phần tử cuối cùng trên dòng 2.
- **Input:** Một dòng các số nguyên.
- **Output:** 2 dòng: dòng 1 là phần tử đầu tiên, dòng 2 là phần tử cuối cùng.
- **Ví dụ:**
\`\`\`text
Input:
10 20 30 40
Output:
10
40
\`\`\``,
      starterCode: `t = tuple(map(int, input().split()))
# In phần tử đầu và cuối của tuple
`,
      solutionCode: `t = tuple(map(int, input().split()))
print(t[0])
print(t[-1])
`,
      testCases: [
        { input: "10 20 30 40\n", expectedOutput: "10\n40\n", isHidden: false },
        { input: "5 15\n", expectedOutput: "5\n15\n", isHidden: true },
        { input: "100 200 300 400 500\n", expectedOutput: "100\n500\n", isHidden: true }
      ]
    },
    {
      title: 'Mở gói Tuple (Tuple Unpacking)',
      problemDescription: `### Bài tập: Mở gói Tuple (Tuple Unpacking)

- **Mô tả:** Nhập 3 từ cách nhau bởi khoảng trắng, chuyển thành tuple gồm 3 phần tử. Sử dụng kỹ thuật unpacking gán vào 3 biến \`a\`, \`b\`, \`c\`. In ra theo định dạng: \`a = {a}, b = {b}, c = {c}\`.
- **Input:** Một dòng chứa đúng 3 từ cách nhau bởi khoảng trắng.
- **Output:** Dòng chữ định dạng unpack.
- **Ví dụ:**
\`\`\`text
Input:
red green blue
Output:
a = red, b = green, c = blue
\`\`\``,
      starterCode: `t = tuple(input().split())
# Unpack và in kết quả
`,
      solutionCode: `t = tuple(input().split())
a, b, c = t
print(f"a = {a}, b = {b}, c = {c}")
`,
      testCases: [
        { input: "red green blue\n", expectedOutput: "a = red, b = green, c = blue\n", isHidden: false },
        { input: "1 2 3\n", expectedOutput: "a = 1, b = 2, c = 3\n", isHidden: true },
        { input: "x y z\n", expectedOutput: "a = x, b = y, c = z\n", isHidden: true }
      ]
    },
    {
      title: 'Ghép nối hai Tuple',
      problemDescription: `### Bài tập: Ghép nối hai Tuple

- **Mô tả:** Nhập dòng 1 là các số nguyên cho tuple thứ nhất. Dòng 2 là các số nguyên cho tuple thứ hai. Ghép nối hai tuple lại với toán tử \`+\` và in tuple kết quả ra màn hình.
- **Input:**
  - Dòng 1: Các số nguyên cách nhau bởi dấu cách.
  - Dòng 2: Các số nguyên cách nhau bởi dấu cách.
- **Output:** Tuple kết quả sau khi ghép.
- **Ví dụ:**
\`\`\`text
Input:
1 2 3
4 5 6
Output:
(1, 2, 3, 4, 5, 6)
\`\`\``,
      starterCode: `t1 = tuple(map(int, input().split()))
t2 = tuple(map(int, input().split()))
# Ghép 2 tuple và in ra
`,
      solutionCode: `t1 = tuple(map(int, input().split()))
t2 = tuple(map(int, input().split()))
print(t1 + t2)
`,
      testCases: [
        { input: "1 2 3\n4 5 6\n", expectedOutput: "(1, 2, 3, 4, 5, 6)\n", isHidden: false },
        { input: "10\n20 30\n", expectedOutput: "(10, 20, 30)\n", isHidden: true },
        { input: "7 8\n9\n", expectedOutput: "(7, 8, 9)\n", isHidden: true }
      ]
    },
    {
      title: 'Đếm phần tử trong Tuple',
      problemDescription: `### Bài tập: Đếm phần tử trong Tuple

- **Mô tả:** Dòng 1 nhập các số nguyên tạo thành một tuple. Dòng 2 nhập số nguyên \`k\` cần đếm. Hãy sử dụng phương thức \`count()\` của tuple để đếm số lần xuất hiện của \`k\` và in kết quả.
- **Input:**
  - Dòng 1: Các số nguyên cách nhau bởi dấu cách.
  - Dòng 2: Số nguyên \`k\`.
- **Output:** Số lần xuất hiện của \`k\`.
- **Ví dụ:**
\`\`\`text
Input:
1 2 2 3 2 4
2
Output:
3
\`\`\``,
      starterCode: `t = tuple(map(int, input().split()))
k = int(input())
# Đếm số lần xuất hiện của k trong t
`,
      solutionCode: `t = tuple(map(int, input().split()))
k = int(input())
print(t.count(k))
`,
      testCases: [
        { input: "1 2 2 3 2 4\n2\n", expectedOutput: "3\n", isHidden: false },
        { input: "5 5 5 5\n5\n", expectedOutput: "4\n", isHidden: true },
        { input: "1 2 3\n9\n", expectedOutput: "0\n", isHidden: true }
      ]
    },
    {
      title: 'Tìm vị trí phần tử trong Tuple',
      problemDescription: `### Bài tập: Tìm vị trí phần tử trong Tuple

- **Mô tả:** Dòng 1 nhập các số nguyên tạo thành một tuple. Dòng 2 nhập số nguyên \`k\` cần tìm (đảm bảo \`k\` có mặt trong tuple). Dùng phương thức \`index()\` của tuple để in ra vị trí xuất hiện đầu tiên của \`k\`.
- **Input:**
  - Dòng 1: Các số nguyên cách nhau bởi dấu cách.
  - Dòng 2: Số nguyên \`k\`.
- **Output:** Vị trí (chỉ số) đầu tiên của \`k\`.
- **Ví dụ:**
\`\`\`text
Input:
10 20 30 40 50
30
Output:
2
\`\`\``,
      starterCode: `t = tuple(map(int, input().split()))
k = int(input())
# In chỉ số đầu tiên của k trong t
`,
      solutionCode: `t = tuple(map(int, input().split()))
k = int(input())
print(t.index(k))
`,
      testCases: [
        { input: "10 20 30 40 50\n30\n", expectedOutput: "2\n", isHidden: false },
        { input: "1 2 3 4 5\n1\n", expectedOutput: "0\n", isHidden: true },
        { input: "9 8 7 6\n6\n", expectedOutput: "3\n", isHidden: true }
      ]
    }
  ]
};

// 35 BÀI THỰC HÀNH TỔNG HỢP (LS-05.MP)
const mpExercises: ExerciseDef[] = [
  // 1. Khai báo và In Danh sách Đơn giản
  {
    title: 'Khai báo và In Danh sách Đơn giản',
    problemDescription: `### Bài tập 1: Khai báo và In Danh sách Đơn giản

- **Mô tả bài toán:** Nhập 3 số nguyên lần lượt trên 3 dòng từ bàn phím. Tạo một danh sách chứa 3 số nguyên đó và in danh sách ra màn hình.
- **Input:** 3 dòng, mỗi dòng là một số nguyên.
- **Output:** Danh sách chứa 3 số nguyên đó.
- **Ví dụ:**
\`\`\`text
Input:
1
2
3
Output:
[1, 2, 3]
\`\`\``,
    starterCode: `# Nhập 3 số nguyên và tạo danh sách
a = int(input())
b = int(input())
c = int(input())
# In danh sách
`,
    solutionCode: `a = int(input())
b = int(input())
c = int(input())
print([a, b, c])
`,
    testCases: [
      { input: "1\n2\n3\n", expectedOutput: "[1, 2, 3]\n", isHidden: false },
      { input: "10\n20\n30\n", expectedOutput: "[10, 20, 30]\n", isHidden: true },
      { input: "-5\n0\n5\n", expectedOutput: "[-5, 0, 5]\n", isHidden: true }
    ]
  },

  // 2. Lấy một Phần tử theo Vị trí
  {
    title: 'Lấy một Phần tử theo Vị trí',
    problemDescription: `### Bài tập 2: Lấy một Phần tử theo Vị trí

- **Mô tả bài toán:** Nhập vào một danh sách các chuỗi cách nhau bởi khoảng trắng (ít nhất 2 phần tử). Hãy in ra phần tử thứ hai trong danh sách (chỉ số 1).
- **Input:** Một dòng chứa các chuỗi cách nhau bởi khoảng trắng.
- **Output:** Phần tử thứ hai.
- **Ví dụ:**
\`\`\`text
Input:
red green blue
Output:
green
\`\`\``,
    starterCode: `items = input().split()
# In phần tử thứ hai
`,
    solutionCode: `items = input().split()
print(items[1])
`,
    testCases: [
      { input: "red green blue\n", expectedOutput: "green\n", isHidden: false },
      { input: "apple banana orange grape\n", expectedOutput: "banana\n", isHidden: true },
      { input: "cat dog\n", expectedOutput: "dog\n", isHidden: true }
    ]
  },

  // 3. Thay đổi Giá trị của một Phần tử
  {
    title: 'Thay đổi Giá trị của một Phần tử',
    problemDescription: `### Bài tập 3: Thay đổi Giá trị của một Phần tử

- **Mô tả bài toán:** Nhập một dòng các số nguyên cách nhau bởi dấu cách. Hãy thay đổi giá trị của phần tử đầu tiên (chỉ số 0) thành 10, sau đó in danh sách đã cập nhật ra màn hình.
- **Input:** Một dòng chứa các số nguyên cách nhau bởi khoảng trắng.
- **Output:** Danh sách sau khi đã gán phần tử đầu tiên thành 10.
- **Ví dụ:**
\`\`\`text
Input:
7 8 9
Output:
[10, 8, 9]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
# Thay đổi phần tử đầu tiên thành 10 và in ra
`,
    solutionCode: `nums = list(map(int, input().split()))
nums[0] = 10
print(nums)
`,
    testCases: [
      { input: "7 8 9\n", expectedOutput: "[10, 8, 9]\n", isHidden: false },
      { input: "1 2 3 4\n", expectedOutput: "[10, 2, 3, 4]\n", isHidden: true },
      { input: "99 0\n", expectedOutput: "[10, 0]\n", isHidden: true }
    ]
  },

  // 4. Thêm Phần tử vào Cuối Danh sách
  {
    title: 'Thêm Phần tử vào Cuối Danh sách',
    problemDescription: `### Bài tập 4: Thêm Phần tử vào Cuối Danh sách

- **Mô tả bài toán:** Dòng 1 là danh sách các phần tử cách nhau bởi dấu cách. Dòng 2 là một phần tử mới cần thêm vào cuối. Sử dụng phương thức \`append()\` để thêm và in danh sách kết quả.
- **Input:**
  - Dòng 1: Danh sách các chuỗi.
  - Dòng 2: Chuỗi cần thêm.
- **Output:** Danh sách sau khi thêm.
- **Ví dụ:**
\`\`\`text
Input:
apple banana
orange
Output:
['apple', 'banana', 'orange']
\`\`\``,
    starterCode: `items = input().split()
new_item = input().strip()
# Thêm new_item vào cuối danh sách items
`,
    solutionCode: `items = input().split()
new_item = input().strip()
items.append(new_item)
print(items)
`,
    testCases: [
      { input: "apple banana\norange\n", expectedOutput: "['apple', 'banana', 'orange']\n", isHidden: false },
      { input: "cat dog\nfish\n", expectedOutput: "['cat', 'dog', 'fish']\n", isHidden: true },
      { input: "1 2 3\n4\n", expectedOutput: "['1', '2', '3', '4']\n", isHidden: true }
    ]
  },

  // 5. Xóa một Phần tử cụ thể (theo giá trị)
  {
    title: 'Xóa một Phần tử cụ thể (theo giá trị)',
    problemDescription: `### Bài tập 5: Xóa một Phần tử cụ thể (theo giá trị)

- **Mô tả bài toán:** Dòng 1 là danh sách các từ cách nhau bởi khoảng trắng. Dòng 2 là từ cần xóa (đảm bảo từ này tồn tại trong danh sách). Sử dụng phương thức \`remove()\` để xóa lần xuất hiện đầu tiên của từ đó và in danh sách sau khi xóa.
- **Input:**
  - Dòng 1: Danh sách các chuỗi.
  - Dòng 2: Chuỗi cần xóa.
- **Output:** Danh sách sau khi xóa.
- **Ví dụ:**
\`\`\`text
Input:
cat dog fish
dog
Output:
['cat', 'fish']
\`\`\``,
    starterCode: `items = input().split()
target = input().strip()
# Xóa target khỏi danh sách items và in ra
`,
    solutionCode: `items = input().split()
target = input().strip()
items.remove(target)
print(items)
`,
    testCases: [
      { input: "cat dog fish\ndog\n", expectedOutput: "['cat', 'fish']\n", isHidden: false },
      { input: "a b c d\nb\n", expectedOutput: "['a', 'c', 'd']\n", isHidden: true },
      { input: "x y z\nz\n", expectedOutput: "['x', 'y']\n", isHidden: true }
    ]
  },

  // 6. Xóa Phần tử theo Vị trí
  {
    title: 'Xóa Phần tử theo Vị trí',
    problemDescription: `### Bài tập 6: Xóa Phần tử theo Vị trí

- **Mô tả bài toán:** Dòng 1 là danh sách các số nguyên cách nhau bởi dấu cách. Dòng 2 là chỉ số \`pos\` cần xóa (hợp lệ). Hãy xóa phần tử tại vị trí đó bằng \`pop()\` hoặc \`del\` và in danh sách sau khi xóa.
- **Input:**
  - Dòng 1: Danh sách các số nguyên.
  - Dòng 2: Chỉ số nguyên \`pos\`.
- **Output:** Danh sách sau khi xóa.
- **Ví dụ:**
\`\`\`text
Input:
10 20 30 40
2
Output:
[10, 20, 40]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
pos = int(input())
# Xóa phần tử tại pos và in danh sách
`,
    solutionCode: `nums = list(map(int, input().split()))
pos = int(input())
nums.pop(pos)
print(nums)
`,
    testCases: [
      { input: "10 20 30 40\n2\n", expectedOutput: "[10, 20, 40]\n", isHidden: false },
      { input: "1 2 3 4 5\n0\n", expectedOutput: "[2, 3, 4, 5]\n", isHidden: true },
      { input: "9 8 7\n2\n", expectedOutput: "[9, 8]\n", isHidden: true }
    ]
  },

  // 7. Kiểm tra Độ dài Danh sách
  {
    title: 'Kiểm tra Độ dài Danh sách',
    problemDescription: `### Bài tập 7: Kiểm tra Độ dài Danh sách

- **Mô tả bài toán:** Nhập một dòng gồm các phần tử cách nhau bởi khoảng trắng. Dùng hàm \`len()\` để đếm số lượng phần tử và in kết quả ra màn hình.
- **Input:** Một dòng chứa các chuỗi cách nhau bởi khoảng trắng.
- **Output:** Một số nguyên là số lượng phần tử.
- **Ví dụ:**
\`\`\`text
Input:
laptop mouse keyboard monitor
Output:
4
\`\`\``,
    starterCode: `items = input().split()
# In độ dài danh sách
`,
    solutionCode: `items = input().split()
print(len(items))
`,
    testCases: [
      { input: "laptop mouse keyboard monitor\n", expectedOutput: "4\n", isHidden: false },
      { input: "apple\n", expectedOutput: "1\n", isHidden: true },
      { input: "1 2 3 4 5 6 7\n", expectedOutput: "7\n", isHidden: true }
    ]
  },

  // 8. Kiểm tra Phần tử có Tồn tại không
  {
    title: 'Kiểm tra Phần tử có Tồn tại không',
    problemDescription: `### Bài tập 8: Kiểm tra Phần tử có Tồn tại không

- **Mô tả bài toán:** Dòng 1 là danh sách các từ. Dòng 2 là từ cần kiểm tra \`val\`. Hãy kiểm tra xem \`val\` có nằm trong danh sách không bằng toán tử \`in\` và in ra \`True\` hoặc \`False\`.
- **Input:**
  - Dòng 1: Danh sách các từ cách nhau bởi khoảng trắng.
  - Dòng 2: Từ cần kiểm tra.
- **Output:** \`True\` hoặc \`False\`.
- **Ví dụ:**
\`\`\`text
Input:
apple banana cherry
banana
Output:
True
\`\`\``,
    starterCode: `fruits = input().split()
target = input().strip()
# Kiểm tra target có trong fruits không
`,
    solutionCode: `fruits = input().split()
target = input().strip()
print(target in fruits)
`,
    testCases: [
      { input: "apple banana cherry\nbanana\n", expectedOutput: "True\n", isHidden: false },
      { input: "cat dog bird\nfish\n", expectedOutput: "False\n", isHidden: true },
      { input: "hanoi saigon danang\ndanang\n", expectedOutput: "True\n", isHidden: true }
    ]
  },

  // 9. In từng Phần tử của Danh sách
  {
    title: 'In từng Phần tử của Danh sách',
    problemDescription: `### Bài tập 9: In từng Phần tử của Danh sách

- **Mô tả bài toán:** Nhập một danh sách các chuỗi cách nhau bởi khoảng trắng. Sử dụng vòng lặp \`for\` duyệt qua danh sách và in mỗi phần tử trên một dòng riêng biệt.
- **Input:** Một dòng chứa các chuỗi.
- **Output:** Các phần tử, mỗi phần tử trên một dòng.
- **Ví dụ:**
\`\`\`text
Input:
Hanoi Saigon Danang
Output:
Hanoi
Saigon
Danang
\`\`\``,
    starterCode: `cities = input().split()
# Duyệt và in mỗi thành phố trên một dòng
`,
    solutionCode: `cities = input().split()
for city in cities:
    print(city)
`,
    testCases: [
      { input: "Hanoi Saigon Danang\n", expectedOutput: "Hanoi\nSaigon\nDanang\n", isHidden: false },
      { input: "Python Java C++\n", expectedOutput: "Python\nJava\nC++\n", isHidden: true },
      { input: "One\n", expectedOutput: "One\n", isHidden: true }
    ]
  },

  // 10. Tính Tổng các số trong Danh sách
  {
    title: 'Tính Tổng các số trong Danh sách',
    problemDescription: `### Bài tập 10: Tính Tổng các số trong Danh sách

- **Mô tả bài toán:** Nhập một dòng gồm các số nguyên cách nhau bởi dấu cách. Dùng hàm \`sum()\` để tính tổng tất cả các số và in kết quả ra màn hình.
- **Input:** Một dòng chứa các số nguyên.
- **Output:** Một số nguyên là tổng các số.
- **Ví dụ:**
\`\`\`text
Input:
5 10 15 20
Output:
50
\`\`\``,
    starterCode: `numbers = list(map(int, input().split()))
# Tính tổng và in ra
`,
    solutionCode: `numbers = list(map(int, input().split()))
print(sum(numbers))
`,
    testCases: [
      { input: "5 10 15 20\n", expectedOutput: "50\n", isHidden: false },
      { input: "1 2 3 4 5\n", expectedOutput: "15\n", isHidden: true },
      { input: "-10 10 0\n", expectedOutput: "0\n", isHidden: true }
    ]
  },

  // 11. Tìm số Lớn nhất trong Danh sách
  {
    title: 'Tìm số Lớn nhất trong Danh sách',
    problemDescription: `### Bài tập 11: Tìm số Lớn nhất trong Danh sách

- **Mô tả bài toán:** Nhập một dòng gồm các số nguyên cách nhau bởi dấu cách. Dùng hàm \`max()\` để tìm và in số lớn nhất trong danh sách.
- **Input:** Một dòng chứa các số nguyên.
- **Output:** Số nguyên lớn nhất.
- **Ví dụ:**
\`\`\`text
Input:
100 75 120 90
Output:
120
\`\`\``,
    starterCode: `points = list(map(int, input().split()))
# Tìm và in số lớn nhất
`,
    solutionCode: `points = list(map(int, input().split()))
print(max(points))
`,
    testCases: [
      { input: "100 75 120 90\n", expectedOutput: "120\n", isHidden: false },
      { input: "-5 -10 -2 -8\n", expectedOutput: "-2\n", isHidden: true },
      { input: "42\n", expectedOutput: "42\n", isHidden: true }
    ]
  },

  // 12. Tìm số Nhỏ nhất trong Danh sách
  {
    title: 'Tìm số Nhỏ nhất trong Danh sách',
    problemDescription: `### Bài tập 12: Tìm số Nhỏ nhất trong Danh sách

- **Mô tả bài toán:** Nhập một dòng gồm các số nguyên cách nhau bởi dấu cách. Dùng hàm \`min()\` để tìm và in số nhỏ nhất trong danh sách.
- **Input:** Một dòng chứa các số nguyên.
- **Output:** Số nguyên nhỏ nhất.
- **Ví dụ:**
\`\`\`text
Input:
25 18 30 22
Output:
18
\`\`\``,
    starterCode: `temps = list(map(int, input().split()))
# Tìm và in số nhỏ nhất
`,
    solutionCode: `temps = list(map(int, input().split()))
print(min(temps))
`,
    testCases: [
      { input: "25 18 30 22\n", expectedOutput: "18\n", isHidden: false },
      { input: "5 1 9 3\n", expectedOutput: "1\n", isHidden: true },
      { input: "-15 -3 -20 0\n", expectedOutput: "-20\n", isHidden: true }
    ]
  },

  // 13. Sắp xếp Danh sách Tăng dần
  {
    title: 'Sắp xếp Danh sách Tăng dần',
    problemDescription: `### Bài tập 13: Sắp xếp Danh sách Tăng dần

- **Mô tả bài toán:** Nhập một dòng gồm các số nguyên cách nhau bởi dấu cách. Sắp xếp danh sách theo thứ tự tăng dần bằng phương thức \`.sort()\` và in danh sách kết quả.
- **Input:** Một dòng chứa các số nguyên.
- **Output:** Danh sách đã sắp xếp tăng dần.
- **Ví dụ:**
\`\`\`text
Input:
5 2 8 1
Output:
[1, 2, 5, 8]
\`\`\``,
    starterCode: `data = list(map(int, input().split()))
# Sắp xếp tăng dần và in ra
`,
    solutionCode: `data = list(map(int, input().split()))
data.sort()
print(data)
`,
    testCases: [
      { input: "5 2 8 1\n", expectedOutput: "[1, 2, 5, 8]\n", isHidden: false },
      { input: "9 7 5 3 1\n", expectedOutput: "[1, 3, 5, 7, 9]\n", isHidden: true },
      { input: "4 2 4 1\n", expectedOutput: "[1, 2, 4, 4]\n", isHidden: true }
    ]
  },

  // 14. Lấy một Phần của Danh sách (Slicing cơ bản)
  {
    title: 'Lấy một Phần của Danh sách (Slicing cơ bản)',
    problemDescription: `### Bài tập 14: Lấy một Phần của Danh sách (Slicing cơ bản)

- **Mô tả bài toán:** Nhập một dòng gồm các từ/ký tự (ít nhất 5 phần tử). Trích xuất và in danh sách con từ chỉ số 1 đến chỉ số 4 (không bao gồm 4, tức là \`lst[1:4]\`).
- **Input:** Một dòng gồm các phần tử cách nhau bởi khoảng trắng.
- **Output:** Danh sách con trích xuất được.
- **Ví dụ:**
\`\`\`text
Input:
a b c d e f
Output:
['b', 'c', 'd']
\`\`\``,
    starterCode: `items = input().split()
# Trích xuất từ chỉ số 1 đến 4
`,
    solutionCode: `items = input().split()
print(items[1:4])
`,
    testCases: [
      { input: "a b c d e f\n", expectedOutput: "['b', 'c', 'd']\n", isHidden: false },
      { input: "10 20 30 40 50 60\n", expectedOutput: "['20', '30', '40']\n", isHidden: true },
      { input: "apple banana cherry date elder\n", expectedOutput: "['banana', 'cherry', 'date']\n", isHidden: true }
    ]
  },

  // 15. Tạo danh sách từ Dữ liệu người dùng nhập
  {
    title: 'Tạo danh sách từ Dữ liệu người dùng nhập',
    problemDescription: `### Bài tập 15: Tạo danh sách từ Dữ liệu người dùng nhập

- **Mô tả bài toán:** Nhập 3 số nguyên lần lượt từ người dùng trên 3 dòng riêng biệt. Tạo danh sách từ 3 số đó và in danh sách ra màn hình.
- **Input:** 3 dòng, mỗi dòng là một số nguyên.
- **Output:** Danh sách 3 số nguyên.
- **Ví dụ:**
\`\`\`text
Input:
10
20
30
Output:
[10, 20, 30]
\`\`\``,
    starterCode: `n1 = int(input())
n2 = int(input())
n3 = int(input())
# Tạo danh sách và in ra
`,
    solutionCode: `n1 = int(input())
n2 = int(input())
n3 = int(input())
print([n1, n2, n3])
`,
    testCases: [
      { input: "10\n20\n30\n", expectedOutput: "[10, 20, 30]\n", isHidden: false },
      { input: "5\n15\n25\n", expectedOutput: "[5, 15, 25]\n", isHidden: true },
      { input: "0\n0\n0\n", expectedOutput: "[0, 0, 0]\n", isHidden: true }
    ]
  },

  // 16. Đếm số lần xuất hiện của một phần tử
  {
    title: 'Đếm số lần xuất hiện của một phần tử',
    problemDescription: `### Bài tập 16: Đếm số lần xuất hiện của một phần tử

- **Mô tả bài toán:** Dòng 1 là danh sách các số nguyên. Dòng 2 là số nguyên \`k\` cần tìm. Hãy đếm số lần số \`k\` xuất hiện trong danh sách và in ra màn hình.
- **Input:**
  - Dòng 1: Các số nguyên cách nhau bởi dấu cách.
  - Dòng 2: Số nguyên \`k\`.
- **Output:** Số lần xuất hiện của \`k\`.
- **Ví dụ:**
\`\`\`text
Input:
1 2 2 3 2 4
2
Output:
3
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
k = int(input())
# Đếm số lần k xuất hiện trong nums
`,
    solutionCode: `nums = list(map(int, input().split()))
k = int(input())
print(nums.count(k))
`,
    testCases: [
      { input: "1 2 2 3 2 4\n2\n", expectedOutput: "3\n", isHidden: false },
      { input: "1 3 5 7\n2\n", expectedOutput: "0\n", isHidden: true },
      { input: "9 9 9 9\n9\n", expectedOutput: "4\n", isHidden: true }
    ]
  },

  // 17. Tạo danh sách số chẵn/lẻ từ danh sách khác
  {
    title: 'Tạo danh sách số chẵn/lẻ từ danh sách khác',
    problemDescription: `### Bài tập 17: Tạo danh sách số chẵn/lẻ từ danh sách khác

- **Mô tả bài toán:** Nhập một danh sách các số nguyên trên 1 dòng. Hãy tách thành 2 danh sách: danh sách các số chẵn và danh sách các số lẻ. In ra theo định dạng:
\`Chẵn: [các số chẵn]\`
\`Lẻ: [các số lẻ]\`
- **Input:** Một dòng chứa các số nguyên.
- **Output:** 2 dòng tương ứng.
- **Ví dụ:**
\`\`\`text
Input:
1 2 3 4 5 6
Output:
Chẵn: [2, 4, 6]
Lẻ: [1, 3, 5]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
# Tách chẵn lẻ và in ra
`,
    solutionCode: `nums = list(map(int, input().split()))
even = [x for x in nums if x % 2 == 0]
odd = [x for x in nums if x % 2 != 0]
print(f"Chẵn: {even}")
print(f"Lẻ: {odd}")
`,
    testCases: [
      { input: "1 2 3 4 5 6\n", expectedOutput: "Chẵn: [2, 4, 6]\nLẻ: [1, 3, 5]\n", isHidden: false },
      { input: "2 4 6\n", expectedOutput: "Chẵn: [2, 4, 6]\nLẻ: []\n", isHidden: true },
      { input: "1 3 5\n", expectedOutput: "Chẵn: []\nLẻ: [1, 3, 5]\n", isHidden: true }
    ]
  },

  // 18. Xóa tất cả các lần xuất hiện của một phần tử
  {
    title: 'Xóa tất cả các lần xuất hiện của một phần tử',
    problemDescription: `### Bài tập 18: Xóa tất cả các lần xuất hiện của một phần tử

- **Mô tả bài toán:** Dòng 1 là danh sách các số nguyên. Dòng 2 là số nguyên \`k\` cần xóa. Hãy xóa **tất cả** các lần \`k\` xuất hiện trong danh sách và in danh sách sau khi lọc bỏ.
- **Input:**
  - Dòng 1: Các số nguyên cách nhau bởi dấu cách.
  - Dòng 2: Số nguyên \`k\`.
- **Output:** Danh sách sau khi đã loại bỏ toàn bộ phần tử có giá trị \`k\`.
- **Ví dụ:**
\`\`\`text
Input:
1 2 2 3 2 4
2
Output:
[1, 3, 4]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
k = int(input())
# Xóa tất cả các phần tử có giá trị k
`,
    solutionCode: `nums = list(map(int, input().split()))
k = int(input())
res = [x for x in nums if x != k]
print(res)
`,
    testCases: [
      { input: "1 2 2 3 2 4\n2\n", expectedOutput: "[1, 3, 4]\n", isHidden: false },
      { input: "5 5 5\n5\n", expectedOutput: "[]\n", isHidden: true },
      { input: "1 2 3\n4\n", expectedOutput: "[1, 2, 3]\n", isHidden: true }
    ]
  },

  // 19. Đảo ngược thứ tự danh sách (không dùng slicing [-1])
  {
    title: 'Đảo ngược thứ tự danh sách (không dùng slicing [-1])',
    problemDescription: `### Bài tập 19: Đảo ngược thứ tự danh sách (không dùng slicing [::-1])

- **Mô tả bài toán:** Nhập một dòng các số nguyên. Hãy đảo ngược thứ tự các phần tử trong danh sách bằng phương thức \`reverse()\` hoặc vòng lặp (không dùng \`[::-1]\`) và in danh sách ra màn hình.
- **Input:** Một dòng chứa các số nguyên.
- **Output:** Danh sách đã đảo ngược.
- **Ví dụ:**
\`\`\`text
Input:
1 2 3 4 5
Output:
[5, 4, 3, 2, 1]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
# Đảo ngược danh sách bằng reverse()
`,
    solutionCode: `nums = list(map(int, input().split()))
nums.reverse()
print(nums)
`,
    testCases: [
      { input: "1 2 3 4 5\n", expectedOutput: "[5, 4, 3, 2, 1]\n", isHidden: false },
      { input: "10 20\n", expectedOutput: "[20, 10]\n", isHidden: true },
      { input: "7\n", expectedOutput: "[7]\n", isHidden: true }
    ]
  },

  // 20. Kiểm tra danh sách có chứa phần tử trùng lặp không
  {
    title: 'Kiểm tra danh sách có chứa phần tử trùng lặp không',
    problemDescription: `### Bài tập 20: Kiểm tra danh sách có chứa phần tử trùng lặp không

- **Mô tả bài toán:** Nhập một danh sách các số nguyên. Kiểm tra xem danh sách có chứa phần tử nào bị trùng lặp hay không. In ra \`True\` nếu có trùng lặp, ngược lại in \`False\`.
- **Input:** Một dòng chứa các số nguyên.
- **Output:** \`True\` hoặc \`False\`.
- **Ví dụ:**
\`\`\`text
Input:
1 2 3 2
Output:
True
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
# Kiểm tra trùng lặp
`,
    solutionCode: `nums = list(map(int, input().split()))
print(len(nums) != len(set(nums)))
`,
    testCases: [
      { input: "1 2 3 2\n", expectedOutput: "True\n", isHidden: false },
      { input: "1 2 3 4 5\n", expectedOutput: "False\n", isHidden: true },
      { input: "10 10\n", expectedOutput: "True\n", isHidden: true }
    ]
  },

  // 21. Nối hai danh sách
  {
    title: 'Nối hai danh sách',
    problemDescription: `### Bài tập 21: Nối hai danh sách

- **Mô tả bài toán:** Dòng 1 nhập danh sách số thứ nhất. Dòng 2 nhập danh sách số thứ hai. Hãy nối hai danh sách này lại thành một danh sách duy nhất bằng toán tử \`+\` hoặc \`extend()\` và in ra màn hình.
- **Input:**
  - Dòng 1: Các số nguyên của danh sách 1.
  - Dòng 2: Các số nguyên của danh sách 2.
- **Output:** Danh sách kết quả sau khi nối.
- **Ví dụ:**
\`\`\`text
Input:
1 2
3 4
Output:
[1, 2, 3, 4]
\`\`\``,
    starterCode: `l1 = list(map(int, input().split()))
l2 = list(map(int, input().split()))
# Nối hai danh sách và in ra
`,
    solutionCode: `l1 = list(map(int, input().split()))
l2 = list(map(int, input().split()))
print(l1 + l2)
`,
    testCases: [
      { input: "1 2\n3 4\n", expectedOutput: "[1, 2, 3, 4]\n", isHidden: false },
      { input: "10 20\n30 40 50\n", expectedOutput: "[10, 20, 30, 40, 50]\n", isHidden: true },
      { input: "5\n6\n", expectedOutput: "[5, 6]\n", isHidden: true }
    ]
  },

  // 22. Lọc các số dương từ danh sách
  {
    title: 'Lọc các số dương từ danh sách',
    problemDescription: `### Bài tập 22: Lọc các số dương từ danh sách

- **Mô tả bài toán:** Nhập một dòng các số nguyên (bao gồm số âm, số dương và số 0). Hãy tạo và in một danh sách mới chỉ chứa các số dương (\`> 0\`).
- **Input:** Một dòng chứa các số nguyên.
- **Output:** Danh sách các số dương.
- **Ví dụ:**
\`\`\`text
Input:
-1 5 -3 8 0
Output:
[5, 8]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
# Lọc các số dương (> 0)
`,
    solutionCode: `nums = list(map(int, input().split()))
pos = [x for x in nums if x > 0]
print(pos)
`,
    testCases: [
      { input: "-1 5 -3 8 0\n", expectedOutput: "[5, 8]\n", isHidden: false },
      { input: "-5 -4 -3\n", expectedOutput: "[]\n", isHidden: true },
      { input: "10 20 30\n", expectedOutput: "[10, 20, 30]\n", isHidden: true }
    ]
  },

  // 23. Tính trung bình cộng của các số trong danh sách
  {
    title: 'Tính trung bình cộng của các số trong danh sách',
    problemDescription: `### Bài tập 23: Tính trung bình cộng của các số trong danh sách

- **Mô tả bài toán:** Nhập một dòng gồm các số nguyên (danh sách không rỗng). Tính trung bình cộng của các số đó và in kết quả làm tròn đến 1 chữ số thập phân bằng hàm \`round(val, 1)\`.
- **Input:** Một dòng chứa các số nguyên cách nhau bởi khoảng trắng.
- **Output:** Trung bình cộng dạng số thực làm tròn 1 chữ số thập phân.
- **Ví dụ:**
\`\`\`text
Input:
10 20 30
Output:
20.0
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
# Tính trung bình cộng và làm tròn 1 chữ số thập phân
`,
    solutionCode: `nums = list(map(int, input().split()))
avg = sum(nums) / len(nums)
print(round(avg, 1))
`,
    testCases: [
      { input: "10 20 30\n", expectedOutput: "20.0\n", isHidden: false },
      { input: "1 2 4\n", expectedOutput: "2.3\n", isHidden: true },
      { input: "5 5 5 5\n", expectedOutput: "5.0\n", isHidden: true }
    ]
  },

  // 24. Tìm vị trí (chỉ số) của một phần tử
  {
    title: 'Tìm vị trí (chỉ số) của một phần tử',
    problemDescription: `### Bài tập 24: Tìm vị trí (chỉ số) của một phần tử

- **Mô tả bài toán:** Dòng 1 là danh sách các số nguyên. Dòng 2 là số nguyên \`k\` cần tìm. Hãy tìm chỉ số của lần xuất hiện **thứ 2** của số \`k\` trong danh sách. Nếu số đó không xuất hiện đủ 2 lần, in ra \`Không tìm thấy\`.
- **Input:**
  - Dòng 1: Danh sách các số nguyên.
  - Dòng 2: Số nguyên \`k\`.
- **Output:** Chỉ số của lần xuất hiện thứ 2, hoặc \`Không tìm thấy\`.
- **Ví dụ:**
\`\`\`text
Input:
10 20 30 20
20
Output:
3
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
k = int(input())
# Tìm chỉ số lần xuất hiện thứ 2 của k
`,
    solutionCode: `nums = list(map(int, input().split()))
k = int(input())
indices = [i for i, x in enumerate(nums) if x == k]
if len(indices) >= 2:
    print(indices[1])
else:
    print("Không tìm thấy")
`,
    testCases: [
      { input: "10 20 30 20\n20\n", expectedOutput: "3\n", isHidden: false },
      { input: "10 20 30\n40\n", expectedOutput: "Không tìm thấy\n", isHidden: true },
      { input: "5 5 5 5\n5\n", expectedOutput: "1\n", isHidden: true },
      { input: "1 2 3 1\n1\n", expectedOutput: "3\n", isHidden: true }
    ]
  },

  // 25. Lấy N phần tử đầu tiên
  {
    title: 'Lấy N phần tử đầu tiên',
    problemDescription: `### Bài tập 25: Lấy N phần tử đầu tiên

- **Mô tả bài toán:** Dòng 1 là danh sách các số nguyên. Dòng 2 là số nguyên \`N\`. Hãy tạo và in một danh sách con chứa \`N\` phần tử đầu tiên của danh sách ban đầu bằng slicing \`[:N]\`.
- **Input:**
  - Dòng 1: Các số nguyên.
  - Dòng 2: Số nguyên \`N\`.
- **Output:** Danh sách chứa \`N\` phần tử đầu tiên.
- **Ví dụ:**
\`\`\`text
Input:
1 2 3 4 5
3
Output:
[1, 2, 3]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
n = int(input())
# Lấy n phần tử đầu tiên
`,
    solutionCode: `nums = list(map(int, input().split()))
n = int(input())
print(nums[:n])
`,
    testCases: [
      { input: "1 2 3 4 5\n3\n", expectedOutput: "[1, 2, 3]\n", isHidden: false },
      { input: "10 20 30 40\n2\n", expectedOutput: "[10, 20]\n", isHidden: true },
      { input: "7 8 9\n1\n", expectedOutput: "[7]\n", isHidden: true }
    ]
  },

  // 26. Xóa các phần tử tại các chỉ số cụ thể
  {
    title: 'Xóa các phần tử tại các chỉ số cụ thể',
    problemDescription: `### Bài tập 26: Xóa các phần tử tại các chỉ số cụ thể

- **Mô tả bài toán:** Dòng 1 là danh sách các số nguyên gốc. Dòng 2 là danh sách các chỉ số cần xóa (cách nhau bởi khoảng trắng). Hãy tạo và in ra danh sách mới sau khi loại bỏ các phần tử nằm ở các chỉ số đó.
- **Input:**
  - Dòng 1: Danh sách các số nguyên.
  - Dòng 2: Danh sách các chỉ số cần xóa.
- **Output:** Danh sách sau khi xóa.
- **Ví dụ:**
\`\`\`text
Input:
10 20 30 40 50
1 3
Output:
[10, 30, 50]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
remove_idx = set(map(int, input().split()))
# Tạo danh sách sau khi bỏ các phần tử ở remove_idx
`,
    solutionCode: `nums = list(map(int, input().split()))
remove_idx = set(map(int, input().split()))
res = [val for i, val in enumerate(nums) if i not in remove_idx]
print(res)
`,
    testCases: [
      { input: "10 20 30 40 50\n1 3\n", expectedOutput: "[10, 30, 50]\n", isHidden: false },
      { input: "1 2 3 4 5\n0 4\n", expectedOutput: "[2, 3, 4]\n", isHidden: true },
      { input: "7 8 9\n1\n", expectedOutput: "[7, 9]\n", isHidden: true }
    ]
  },

  // 27. Nhân đôi các phần tử trong danh sách (tạo danh sách mới)
  {
    title: 'Nhân đôi các phần tử trong danh sách (tạo danh sách mới)',
    problemDescription: `### Bài tập 27: Nhân đôi các phần tử trong danh sách

- **Mô tả bài toán:** Nhập một danh sách các số nguyên. Hãy tạo ra một danh sách mới trong đó mỗi phần tử của danh sách gốc được lặp lại 2 lần liên tiếp và in danh sách đó ra.
- **Input:** Một dòng chứa các số nguyên.
- **Output:** Danh sách mới có mỗi phần tử nhân đôi.
- **Ví dụ:**
\`\`\`text
Input:
1 2 3
Output:
[1, 1, 2, 2, 3, 3]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
# Lặp lại mỗi phần tử 2 lần
`,
    solutionCode: `nums = list(map(int, input().split()))
res = []
for x in nums:
    res.extend([x, x])
print(res)
`,
    testCases: [
      { input: "1 2 3\n", expectedOutput: "[1, 1, 2, 2, 3, 3]\n", isHidden: false },
      { input: "5\n", expectedOutput: "[5, 5]\n", isHidden: true },
      { input: "10 20\n", expectedOutput: "[10, 10, 20, 20]\n", isHidden: true }
    ]
  },

  // 28. Kiểm tra danh sách rỗng
  {
    title: 'Kiểm tra danh sách rỗng',
    problemDescription: `### Bài tập 28: Kiểm tra danh sách rỗng

- **Mô tả bài toán:** Nhập vào một dòng dữ liệu từ bàn phím. Hãy tách chuỗi thành danh sách bằng \`.split()\`. Nếu danh sách không có phần tử nào (độ dài bằng 0), in ra \`True\`, ngược lại in \`False\`.
- **Input:** Một dòng chuỗi (có thể trống hoặc chứa các từ).
- **Output:** \`True\` nếu danh sách rỗng, \`False\` nếu có phần tử.
- **Ví dụ:**
\`\`\`text
Input:
(dòng trống)
Output:
True
\`\`\``,
    starterCode: `items = input().split()
# Kiểm tra items có rỗng không
`,
    solutionCode: `items = input().split()
print(len(items) == 0)
`,
    testCases: [
      { input: "\n", expectedOutput: "True\n", isHidden: false },
      { input: "1 2\n", expectedOutput: "False\n", isHidden: true },
      { input: "hello\n", expectedOutput: "False\n", isHidden: true }
    ]
  },

  // 29. Tính tổng các phần tử chẵn/lẻ trong danh sách
  {
    title: 'Tính tổng các phần tử chẵn/lẻ trong danh sách',
    problemDescription: `### Bài tập 29: Tính tổng các phần tử chẵn/lẻ trong danh sách

- **Mô tả bài toán:** Nhập một dòng gồm các số nguyên. Tính riêng tổng các số chẵn và tổng các số lẻ trong danh sách. In ra theo định dạng:
\`Tổng chẵn: {tong_chan}\`
\`Tổng lẻ: {tong_le}\`
- **Input:** Một dòng chứa các số nguyên.
- **Output:** 2 dòng tương ứng.
- **Ví dụ:**
\`\`\`text
Input:
1 2 3 4 5
Output:
Tổng chẵn: 6
Tổng lẻ: 9
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
# Tính tổng chẵn và tổng lẻ
`,
    solutionCode: `nums = list(map(int, input().split()))
even_sum = sum(x for x in nums if x % 2 == 0)
odd_sum = sum(x for x in nums if x % 2 != 0)
print(f"Tổng chẵn: {even_sum}")
print(f"Tổng lẻ: {odd_sum}")
`,
    testCases: [
      { input: "1 2 3 4 5\n", expectedOutput: "Tổng chẵn: 6\nTổng lẻ: 9\n", isHidden: false },
      { input: "2 4 6\n", expectedOutput: "Tổng chẵn: 12\nTổng lẻ: 0\n", isHidden: true },
      { input: "1 3 5 7\n", expectedOutput: "Tổng chẵn: 0\nTổng lẻ: 16\n", isHidden: true }
    ]
  },

  // 30. Đếm các số lớn hơn một ngưỡng cho trước
  {
    title: 'Đếm các số lớn hơn một ngưỡng cho trước',
    problemDescription: `### Bài tập 30: Đếm các số lớn hơn một ngưỡng cho trước

- **Mô tả bài toán:** Dòng 1 là danh sách các số nguyên. Dòng 2 là ngưỡng số nguyên \`X\`. Hãy đếm xem có bao nhiêu phần tử trong danh sách lớn hơn \`X\` (\`> X\`) và in kết quả ra màn hình.
- **Input:**
  - Dòng 1: Danh sách các số nguyên.
  - Dòng 2: Số nguyên \`X\`.
- **Output:** Số lượng phần tử lớn hơn \`X\`.
- **Ví dụ:**
\`\`\`text
Input:
10 20 5 30 15
15
Output:
2
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
x = int(input())
# Đếm các số > x
`,
    solutionCode: `nums = list(map(int, input().split()))
x = int(input())
count = sum(1 for n in nums if n > x)
print(count)
`,
    testCases: [
      { input: "10 20 5 30 15\n15\n", expectedOutput: "2\n", isHidden: false },
      { input: "1 2 3 4\n5\n", expectedOutput: "0\n", isHidden: true },
      { input: "10 20 30\n5\n", expectedOutput: "3\n", isHidden: true }
    ]
  },

  // 31. Tìm phần tử xuất hiện nhiều nhất (Mode)
  {
    title: 'Tìm phần tử xuất hiện nhiều nhất (Mode)',
    problemDescription: `### Bài tập 31: Tìm phần tử xuất hiện nhiều nhất (Mode)

- **Mô tả bài toán:** Nhập một dòng các số nguyên. Tìm và in ra danh sách các phần tử xuất hiện nhiều nhất (được sắp xếp theo thứ tự xuất hiện lần đầu trong danh sách gốc).
- **Input:** Một dòng chứa các số nguyên.
- **Output:** Danh sách các phần tử xuất hiện nhiều nhất.
- **Ví dụ:**
\`\`\`text
Input:
1 2 2 3 3 3 4
Output:
[3]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
# Tìm các phần tử xuất hiện nhiều nhất
`,
    solutionCode: `nums = list(map(int, input().split()))
from collections import Counter
counts = Counter(nums)
max_freq = max(counts.values())
modes = []
for x in nums:
    if counts[x] == max_freq and x not in modes:
        modes.append(x)
print(modes)
`,
    testCases: [
      { input: "1 2 2 3 3 3 4\n", expectedOutput: "[3]\n", isHidden: false },
      { input: "1 2 2 3 3\n", expectedOutput: "[2, 3]\n", isHidden: true },
      { input: "7 7 7\n", expectedOutput: "[7]\n", isHidden: true }
    ]
  },

  // 32. Xóa các phần tử trùng lặp và giữ thứ tự (Unique and Ordered)
  {
    title: 'Xóa các phần tử trùng lặp và giữ thứ tự (Unique and Ordered)',
    problemDescription: `### Bài tập 32: Xóa các phần tử trùng lặp và giữ thứ tự (Unique and Ordered)

- **Mô tả bài toán:** Nhập một danh sách các số nguyên. Tạo và in ra danh sách mới chỉ chứa các phần tử duy nhất (loại bỏ phần tử trùng), đồng thời giữ nguyên thứ tự xuất hiện lần đầu của chúng.
- **Input:** Một dòng chứa các số nguyên.
- **Output:** Danh sách các phần tử duy nhất theo đúng thứ tự lần đầu.
- **Ví dụ:**
\`\`\`text
Input:
1 2 2 3 1 4
Output:
[1, 2, 3, 4]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
# Loại bỏ trùng lặp giữ nguyên thứ tự
`,
    solutionCode: `nums = list(map(int, input().split()))
seen = set()
res = []
for x in nums:
    if x not in seen:
        seen.add(x)
        res.append(x)
print(res)
`,
    testCases: [
      { input: "1 2 2 3 1 4\n", expectedOutput: "[1, 2, 3, 4]\n", isHidden: false },
      { input: "5 5 5 5\n", expectedOutput: "[5]\n", isHidden: true },
      { input: "3 1 2 3 2 1\n", expectedOutput: "[3, 1, 2]\n", isHidden: true }
    ]
  },

  // 33. Kiểm tra và sửa lỗi Danh sách đã sắp xếp (Gần đúng)
  {
    title: 'Kiểm tra và sửa lỗi Danh sách đã sắp xếp (Gần đúng)',
    problemDescription: `### Bài tập 33: Kiểm tra danh sách đã sắp xếp tăng dần

- **Mô tả bài toán:** Nhập một danh sách các số nguyên. Kiểm tra xem danh sách có được sắp xếp tăng dần không. Nếu có, in ra \`True\`. Nếu không, in ra \`Lỗi tại vị trí: {i}\` với \`i\` là chỉ số của phần tử đầu tiên vi phạm thứ tự tăng dần (tức \`nums[i] < nums[i-1]\`).
- **Input:** Một dòng chứa các số nguyên.
- **Output:** \`True\` hoặc \`Lỗi tại vị trí: {i}\`.
- **Ví dụ:**
\`\`\`text
Input:
1 3 5 2 8
Output:
Lỗi tại vị trí: 3
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
# Kiểm tra thứ tự tăng dần
`,
    solutionCode: `nums = list(map(int, input().split()))
is_sorted = True
for i in range(1, len(nums)):
    if nums[i] < nums[i - 1]:
        print(f"Lỗi tại vị trí: {i}")
        is_sorted = False
        break
if is_sorted:
    print("True")
`,
    testCases: [
      { input: "1 3 5 2 8\n", expectedOutput: "Lỗi tại vị trí: 3\n", isHidden: false },
      { input: "1 2 3 4 5\n", expectedOutput: "True\n", isHidden: false },
      { input: "5 1 2\n", expectedOutput: "Lỗi tại vị trí: 1\n", isHidden: true },
      { input: "10 20 30\n", expectedOutput: "True\n", isHidden: true }
    ]
  },

  // 34. Tìm cặp số có tổng bằng K
  {
    title: 'Tìm cặp số có tổng bằng K',
    problemDescription: `### Bài tập 34: Tìm cặp số có tổng bằng K

- **Mô tả bài toán:** Dòng 1 là danh sách các số nguyên phân biệt. Dòng 2 là số nguyên \`K\`. Tìm và in ra các cặp số \`(a, b)\` có tổng bằng \`K\` (với \`a < b\`, mỗi cặp trên một dòng theo thứ tự xuất hiện của \`a\`). Nếu không có cặp nào, in ra \`Không tìm thấy cặp nào\`.
- **Input:**
  - Dòng 1: Danh sách các số nguyên cách nhau bởi dấu cách.
  - Dòng 2: Số nguyên \`K\`.
- **Output:** Các cặp số dạng \`(a, b)\` hoặc \`Không tìm thấy cặp nào\`.
- **Ví dụ:**
\`\`\`text
Input:
1 5 2 8 3
10
Output:
(2, 8)
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
k = int(input())
# Tìm các cặp số có tổng bằng k
`,
    solutionCode: `nums = list(map(int, input().split()))
k = int(input())
found = []
seen = set(nums)
used = set()
for a in nums:
    b = k - a
    if b in seen and a != b:
        pair = (min(a, b), max(a, b))
        if pair not in used:
            used.add(pair)
            found.append(pair)
if found:
    for p in found:
        print(f"({p[0]}, {p[1]})")
else:
    print("Không tìm thấy cặp nào")
`,
    testCases: [
      { input: "1 5 2 8 3\n10\n", expectedOutput: "(2, 8)\n", isHidden: false },
      { input: "4 2 6 7\n10\n", expectedOutput: "(4, 6)\n", isHidden: true },
      { input: "1 2 3\n10\n", expectedOutput: "Không tìm thấy cặp nào\n", isHidden: true }
    ]
  },

  // 35. Xoay vòng danh sách (Rotate List)
  {
    title: 'Xoay vòng danh sách (Rotate List)',
    problemDescription: `### Bài tập 35: Xoay vòng danh sách (Rotate List)

- **Mô tả bài toán:** Dòng 1 là danh sách các số nguyên. Dòng 2 là số bước xoay \`k\` (nguyên không âm). Hãy xoay danh sách sang phải \`k\` bước (các phần tử cuối dịch chuyển về đầu) và in danh sách sau khi xoay.
- **Input:**
  - Dòng 1: Các số nguyên.
  - Dòng 2: Số bước xoay \`k\`.
- **Output:** Danh sách sau khi xoay.
- **Ví dụ:**
\`\`\`text
Input:
1 2 3 4 5
2
Output:
[4, 5, 1, 2, 3]
\`\`\``,
    starterCode: `nums = list(map(int, input().split()))
k = int(input())
# Xoay danh sách sang phải k bước
`,
    solutionCode: `nums = list(map(int, input().split()))
k = int(input())
if len(nums) > 0:
    k = k % len(nums)
    res = nums[-k:] + nums[:-k] if k > 0 else nums
    print(res)
else:
    print(nums)
`,
    testCases: [
      { input: "1 2 3 4 5\n2\n", expectedOutput: "[4, 5, 1, 2, 3]\n", isHidden: false },
      { input: "1 2 3\n1\n", expectedOutput: "[3, 1, 2]\n", isHidden: true },
      { input: "10 20 30\n0\n", expectedOutput: "[10, 20, 30]\n", isHidden: true }
    ]
  }
];

async function updateModule5() {
  console.log(`🚀 Bắt đầu cập nhật toàn diện Module 5 vào CSDL và Seed file...`);

  // 1. Cập nhật 16 bài lý thuyết (LS-05.01 -> LS-05.05)
  for (const [lessonId, exList] of Object.entries(theoryExercises)) {
    const lesson = await prisma.lesson.findFirst({
      where: { lessonId },
      include: {
        codingExercises: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!lesson) {
      console.error(`❌ Không tìm thấy lesson ${lessonId}`);
      continue;
    }

    console.log(`\nCập nhật lý thuyết [${lessonId}]: ${lesson.title} (${lesson.codingExercises.length} bài)...`);

    for (let i = 0; i < lesson.codingExercises.length; i++) {
      const existing = lesson.codingExercises[i];
      const def = exList[i];
      if (!def) continue;

      console.log(`  - Cập nhật bài: "${def.title}" (ID: ${existing.id})...`);

      await prisma.testCase.deleteMany({
        where: { exerciseId: existing.id }
      });

      await prisma.codingExercise.update({
        where: { id: existing.id },
        data: {
          title: def.title,
          problemDescription: def.problemDescription,
          starterCode: def.starterCode,
          solutionCode: def.solutionCode,
          testCases: {
            create: def.testCases.map((tc) => ({
              input: tc.input,
              expectedOutput: tc.expectedOutput,
              isHidden: tc.isHidden
            }))
          }
        }
      });
      console.log(`    ✓ Xong (${def.testCases.length} TCs).`);
    }
  }

  // 2. Cập nhật 35 bài thực hành tổng hợp (LS-05.MP)
  const mpLesson = await prisma.lesson.findFirst({
    where: { lessonId: 'LS-05.MP' },
    include: {
      codingExercises: {
        orderBy: { title: 'asc' }
      }
    }
  });

  if (!mpLesson) {
    throw new Error('Không tìm thấy LS-05.MP');
  }

  console.log(`\nCập nhật LS-05.MP: 35 bài thực hành tổng hợp...`);

  for (const def of mpExercises) {
    const existing = mpLesson.codingExercises.find(
      (e) => e.title.trim().toLowerCase() === def.title.trim().toLowerCase()
    );

    if (!existing) {
      console.warn(`  ⚠️ Không tìm thấy bài tập: "${def.title}" trong LS-05.MP`);
      continue;
    }

    console.log(`  - Cập nhật bài: "${def.title}" (ID: ${existing.id})...`);

    await prisma.testCase.deleteMany({
      where: { exerciseId: existing.id }
    });

    await prisma.codingExercise.update({
      where: { id: existing.id },
      data: {
        problemDescription: def.problemDescription,
        starterCode: def.starterCode,
        solutionCode: def.solutionCode,
        testCases: {
          create: def.testCases.map((tc) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden
          }))
        }
      }
    });

    console.log(`    ✓ Xong (${def.testCases.length} TCs).`);
  }

  // 3. Đồng bộ vào file seed_course_data.json
  const seedPath = path.resolve(__dirname, '../prisma/seed/seed_course_data.json');
  console.log(`\nĐang đồng bộ file seed: ${seedPath}...`);
  const seedContent = fs.readFileSync(seedPath, 'utf-8');
  const seedData = JSON.parse(seedContent);

  // Tìm Python course
  const pythonCourse = seedData.find((c: any) =>
    c.title?.includes('Python') || c.slug?.includes('python')
  );

  if (pythonCourse) {
    for (const module of pythonCourse.modules || []) {
      for (const chapter of module.chapters || []) {
        for (const lesson of chapter.lessons || []) {
          // Sync theory
          if (theoryExercises[lesson.lessonId]) {
            const defs = theoryExercises[lesson.lessonId];
            for (let i = 0; i < (lesson.codingExercises || []).length; i++) {
              const def = defs[i];
              if (def) {
                const ex = lesson.codingExercises[i];
                ex.title = def.title;
                ex.problemDescription = def.problemDescription;
                ex.starterCode = def.starterCode;
                ex.solutionCode = def.solutionCode;
                ex.testCases = def.testCases.map((tc) => ({
                  input: tc.input,
                  expectedOutput: tc.expectedOutput,
                  isHidden: tc.isHidden
                }));
              }
            }
          }

          // Sync MP
          if (lesson.lessonId === 'LS-05.MP') {
            for (const def of mpExercises) {
              const ex = (lesson.codingExercises || []).find(
                (e: any) => e.title?.trim().toLowerCase() === def.title.trim().toLowerCase()
              );
              if (ex) {
                ex.problemDescription = def.problemDescription;
                ex.starterCode = def.starterCode;
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

  console.log(`\n🎉 HOÀN TẤT CẬP NHẬT MODULE 5!`);
  await prisma.$disconnect();
}

updateModule5().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
