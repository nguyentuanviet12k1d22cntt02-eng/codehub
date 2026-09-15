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
  problemDescription: string;
  starterCode: string;
  solutionCode: string;
  testCases: TestCaseDef[];
}

const exercises: ExerciseDef[] = [
  // 1. Tạo và in chuỗi
  {
    title: 'Tạo và in chuỗi',
    problemDescription: `### Bài tập 1: Tạo và in chuỗi

- **Mô tả:** Nhập một chuỗi \`s\` từ bàn phím và in nó ra màn hình.
- **Input:** Một dòng chứa chuỗi \`s\`.
- **Output:** In lại chuỗi \`s\`.
- **Ví dụ:**
\`\`\`text
Input:
Hello, Python!
Output:
Hello, Python!
\`\`\``,
    starterCode: `s = input()
# In chuỗi ra màn hình
`,
    solutionCode: `s = input()
print(s)
`,
    testCases: [
      { input: "Hello, Python!\n", expectedOutput: "Hello, Python!\n", isHidden: false },
      { input: "VibeCode AI\n", expectedOutput: "VibeCode AI\n", isHidden: true },
      { input: "12345\n", expectedOutput: "12345\n", isHidden: true }
    ]
  },

  // 2. Nối chuỗi
  {
    title: 'Nối chuỗi',
    problemDescription: `### Bài tập 2: Nối chuỗi

- **Mô tả:** Nhận vào hai chuỗi \`s1\` và \`s2\` trên 2 dòng. Nối chúng lại với một khoảng trắng ở giữa và in kết quả.
- **Input:** 2 dòng chứa 2 chuỗi \`s1\`, \`s2\`.
- **Output:** Chuỗi kết quả sau khi nối.
- **Ví dụ:**
\`\`\`text
Input:
Hello
World
Output:
Hello World
\`\`\``,
    starterCode: `s1 = input()
s2 = input()
# Nối hai chuỗi với khoảng trắng ở giữa
`,
    solutionCode: `s1 = input()
s2 = input()
print(s1 + " " + s2)
`,
    testCases: [
      { input: "Hello\nWorld\n", expectedOutput: "Hello World\n", isHidden: false },
      { input: "Python\nProgramming\n", expectedOutput: "Python Programming\n", isHidden: true },
      { input: "Good\nMorning\n", expectedOutput: "Good Morning\n", isHidden: true }
    ]
  },

  // 3. Lặp chuỗi
  {
    title: 'Lặp chuỗi',
    problemDescription: `### Bài tập 3: Lặp chuỗi

- **Mô tả:** Nhận vào một chuỗi \`s\`. Lặp lại chuỗi đó 4 lần bằng toán tử \`*\` và in kết quả ra màn hình.
- **Input:** Một chuỗi \`s\`.
- **Output:** Chuỗi lặp lại 4 lần.
- **Ví dụ:**
\`\`\`text
Input:
Ha
Output:
HaHaHaHa
\`\`\``,
    starterCode: `s = input().strip()
# Lặp lại chuỗi 4 lần và in ra
`,
    solutionCode: `s = input().strip()
print(s * 4)
`,
    testCases: [
      { input: "Ha\n", expectedOutput: "HaHaHaHa\n", isHidden: false },
      { input: "Yo\n", expectedOutput: "YoYoYoYo\n", isHidden: true },
      { input: "*\n", expectedOutput: "****\n", isHidden: true }
    ]
  },

  // 4. Truy cập ký tự
  {
    title: 'Truy cập ký tự',
    problemDescription: `### Bài tập 4: Truy cập ký tự

- **Mô tả:** Nhận vào một chuỗi \`s\` có ít nhất 3 ký tự. In ra ký tự thứ ba (tương ứng chỉ số index 2) của chuỗi.
- **Input:** Một chuỗi \`s\`.
- **Output:** Ký tự tại chỉ số 2.
- **Ví dụ:**
\`\`\`text
Input:
Python
Output:
t
\`\`\``,
    starterCode: `s = input().strip()
# In ký tự tại chỉ số 2
`,
    solutionCode: `s = input().strip()
print(s[2])
`,
    testCases: [
      { input: "Python\n", expectedOutput: "t\n", isHidden: false },
      { input: "Hello\n", expectedOutput: "l\n", isHidden: true },
      { input: "Coding\n", expectedOutput: "d\n", isHidden: true }
    ]
  },

  // 5. Độ dài chuỗi
  {
    title: 'Độ dài chuỗi',
    problemDescription: `### Bài tập 5: Độ dài chuỗi

- **Mô tả:** Nhận vào một chuỗi \`s\`. Tính và in ra độ dài của chuỗi theo mẫu: \`Độ dài chuỗi: [độ_dài]\`.
- **Input:** Một chuỗi \`s\`.
- **Output:** Dòng chữ thông báo độ dài chuỗi.
- **Ví dụ:**
\`\`\`text
Input:
Python
Output:
Độ dài chuỗi: 6
\`\`\``,
    starterCode: `s = input()
# In độ dài chuỗi theo định dạng yêu cầu
`,
    solutionCode: `s = input()
print(f"Độ dài chuỗi: {len(s)}")
`,
    testCases: [
      { input: "Python\n", expectedOutput: "Độ dài chuỗi: 6\n", isHidden: false },
      { input: "Hello World\n", expectedOutput: "Độ dài chuỗi: 11\n", isHidden: true },
      { input: "AI\n", expectedOutput: "Độ dài chuỗi: 2\n", isHidden: true }
    ]
  },

  // 6. Chuyển đổi chữ hoa, chữ thường
  {
    title: 'Chuyển đổi chữ hoa, chữ thường',
    problemDescription: `### Bài tập 6: Chuyển đổi chữ hoa, chữ thường

- **Mô tả:** Nhận vào một chuỗi \`s\`. In chuỗi đó thành chữ in hoa trên dòng 1, và chữ in thường trên dòng 2.
- **Input:** Một chuỗi \`s\`.
- **Output:**
  - Dòng 1: Chuỗi in hoa (\`upper()\`)
  - Dòng 2: Chuỗi in thường (\`lower()\`)
- **Ví dụ:**
\`\`\`text
Input:
Hello World
Output:
HELLO WORLD
hello world
\`\`\``,
    starterCode: `s = input()
# In chuỗi in hoa và in thường
`,
    solutionCode: `s = input()
print(s.upper())
print(s.lower())
`,
    testCases: [
      { input: "Hello World\n", expectedOutput: "HELLO WORLD\nhello world\n", isHidden: false },
      { input: "Python\n", expectedOutput: "PYTHON\npython\n", isHidden: true },
      { input: "Learn Code\n", expectedOutput: "LEARN CODE\nlearn code\n", isHidden: true }
    ]
  },

  // 7. Loại bỏ khoảng trắng
  {
    title: 'Loại bỏ khoảng trắng',
    problemDescription: `### Bài tập 7: Loại bỏ khoảng trắng

- **Mô tả:** Nhận vào một chuỗi có thể chứa khoảng trắng thừa ở đầu và cuối. Sử dụng phương thức \`strip()\` để loại bỏ khoảng trắng thừa ở hai đầu và in kết quả.
- **Input:** Một chuỗi \`s\`.
- **Output:** Chuỗi sau khi đã cắt bỏ khoảng trắng ở hai đầu.
- **Ví dụ:**
\`\`\`text
Input:
     Hello     
Output:
Hello
\`\`\``,
    starterCode: `s = input()
# Cắt khoảng trắng ở 2 đầu
`,
    solutionCode: `s = input()
print(s.strip())
`,
    testCases: [
      { input: "     Hello     \n", expectedOutput: "Hello\n", isHidden: false },
      { input: "  Python  \n", expectedOutput: "Python\n", isHidden: true },
      { input: "   AI Assistant   \n", expectedOutput: "AI Assistant\n", isHidden: true }
    ]
  },

  // 8. Thay thế chuỗi con
  {
    title: 'Thay thế chuỗi con',
    problemDescription: `### Bài tập 8: Thay thế chuỗi con

- **Mô tả:** Nhận vào một câu \`s\`. Sử dụng phương thức \`replace()\` để thay thế từ "apples" thành "oranges" và in kết quả ra màn hình.
- **Input:** Chuỗi \`s\`.
- **Output:** Chuỗi sau khi thay thế.
- **Ví dụ:**
\`\`\`text
Input:
I like apples
Output:
I like oranges
\`\`\``,
    starterCode: `s = input()
# Thay thế apples bằng oranges
`,
    solutionCode: `s = input()
print(s.replace("apples", "oranges"))
`,
    testCases: [
      { input: "I like apples\n", expectedOutput: "I like oranges\n", isHidden: false },
      { input: "apples are fresh\n", expectedOutput: "oranges are fresh\n", isHidden: true },
      { input: "we bought red apples\n", expectedOutput: "we bought red oranges\n", isHidden: true }
    ]
  },

  // 9. Định dạng chuỗi với f-string
  {
    title: 'Định dạng chuỗi với f-string',
    problemDescription: `### Bài tập 9: Định dạng chuỗi với f-string

- **Mô tả:** Nhận vào tên \`ten\` (chuỗi) và tuổi \`tuoi\` (số nguyên) trên 2 dòng. Sử dụng f-string để in ra câu theo mẫu: \`Tôi tên là {ten}, {tuoi} tuổi.\`.
- **Input:**
  - Dòng 1: Tên \`ten\`
  - Dòng 2: Tuổi \`tuoi\`
- **Output:** Chuỗi định dạng hoàn chỉnh.
- **Ví dụ:**
\`\`\`text
Input:
Minh
20
Output:
Tôi tên là Minh, 20 tuổi.
\`\`\``,
    starterCode: `ten = input().strip()
tuoi = int(input())
# In chuỗi với f-string
`,
    solutionCode: `ten = input().strip()
tuoi = int(input())
print(f"Tôi tên là {ten}, {tuoi} tuổi.")
`,
    testCases: [
      { input: "Minh\n20\n", expectedOutput: "Tôi tên là Minh, 20 tuổi.\n", isHidden: false },
      { input: "Lan\n18\n", expectedOutput: "Tôi tên là Lan, 18 tuổi.\n", isHidden: true },
      { input: "Nam\n25\n", expectedOutput: "Tôi tên là Nam, 25 tuổi.\n", isHidden: true }
    ]
  },

  // 10. Tìm và đếm chuỗi con
  {
    title: 'Tìm và đếm chuỗi con',
    problemDescription: `### Bài tập 10: Tìm và đếm chuỗi con

- **Mô tả:** Nhận vào chuỗi \`s\` trên dòng 1 và chuỗi con \`sub\` trên dòng 2.
- **Yêu cầu:** In ra vị trí đầu tiên của \`sub\` trong \`s\` (sử dụng \`find()\`) và số lần xuất hiện của \`sub\` trong \`s\` (sử dụng \`count()\`) theo mẫu:
  - Dòng 1: \`Vị trí đầu tiên của '{sub}': [vị_trí]\`
  - Dòng 2: \`Số lần xuất hiện của '{sub}': [số_lần]\`
- **Ví dụ:**
\`\`\`text
Input:
banana
a
Output:
Vị trí đầu tiên của 'a': 1
Số lần xuất hiện của 'a': 3
\`\`\``,
    starterCode: `s = input().strip()
sub = input().strip()
# Tìm và đếm chuỗi con
`,
    solutionCode: `s = input().strip()
sub = input().strip()
print(f"Vị trí đầu tiên của '{sub}': {s.find(sub)}")
print(f"Số lần xuất hiện của '{sub}': {s.count(sub)}")
`,
    testCases: [
      { input: "banana\na\n", expectedOutput: "Vị trí đầu tiên của 'a': 1\nSố lần xuất hiện của 'a': 3\n", isHidden: false },
      { input: "hello world\nl\n", expectedOutput: "Vị trí đầu tiên của 'l': 2\nSố lần xuất hiện của 'l': 3\n", isHidden: true },
      { input: "python\nx\n", expectedOutput: "Vị trí đầu tiên của 'x': -1\nSố lần xuất hiện của 'x': 0\n", isHidden: true }
    ]
  },

  // 11. Trích xuất một phần của chuỗi
  {
    title: 'Trích xuất một phần của chuỗi',
    problemDescription: `### Bài tập 11: Trích xuất một phần của chuỗi

- **Mô tả:** Nhận vào một chuỗi \`s\` có ít nhất 12 ký tự. Sử dụng slicing để trích xuất 5 ký tự từ chỉ số 7 đến 12 (\`s[7:12]\`) và in ra màn hình.
- **Input:** Chuỗi \`s\`.
- **Output:** Chuỗi con trích xuất được.
- **Ví dụ:**
\`\`\`text
Input:
Hello, World!
Output:
World
\`\`\``,
    starterCode: `s = input()
# Trích xuất chuỗi con từ chỉ số 7 đến 12
`,
    solutionCode: `s = input()
print(s[7:12])
`,
    testCases: [
      { input: "Hello, World!\n", expectedOutput: "World\n", isHidden: false },
      { input: "Python Developer\n", expectedOutput: "Devel\n", isHidden: true },
      { input: "Chao ban than yeu\n", expectedOutput: "n tha\n", isHidden: true }
    ]
  },

  // 12. Lấy ký tự ở vị trí cụ thể
  {
    title: 'Lấy ký tự ở vị trí cụ thể',
    problemDescription: `### Bài tập 12: Lấy ký tự ở vị trí cụ thể

- **Mô tả:** Nhận vào một chuỗi \`s\` có ít nhất 4 ký tự. In ra ký tự ở vị trí thứ hai (chỉ số 1) trên dòng 1, và ký tự ở vị trí thứ tư (chỉ số 3) trên dòng 2.
- **Input:** Chuỗi \`s\`.
- **Output:** 2 dòng ký tự.
- **Ví dụ:**
\`\`\`text
Input:
Python
Output:
y
h
\`\`\``,
    starterCode: `s = input().strip()
# In ký tự tại chỉ số 1 và 3
`,
    solutionCode: `s = input().strip()
print(s[1])
print(s[3])
`,
    testCases: [
      { input: "Python\n", expectedOutput: "y\nh\n", isHidden: false },
      { input: "Computer\n", expectedOutput: "o\np\n", isHidden: true },
      { input: "Coding\n", expectedOutput: "o\ni\n", isHidden: true }
    ]
  },

  // 13. Đảo ngược chuỗi
  {
    title: 'Đảo ngược chuỗi',
    problemDescription: `### Bài tập 13: Đảo ngược chuỗi

- **Mô tả:** Nhận vào một chuỗi \`s\`. Sử dụng slicing \`[::-1]\` để đảo ngược chuỗi và in ra màn hình.
- **Input:** Chuỗi \`s\`.
- **Output:** Chuỗi sau khi đảo ngược.
- **Ví dụ:**
\`\`\`text
Input:
Python
Output:
nohtyP
\`\`\``,
    starterCode: `s = input().strip()
# Đảo ngược chuỗi
`,
    solutionCode: `s = input().strip()
print(s[::-1])
`,
    testCases: [
      { input: "Python\n", expectedOutput: "nohtyP\n", isHidden: false },
      { input: "Hello\n", expectedOutput: "olleH\n", isHidden: true },
      { input: "12345\n", expectedOutput: "54321\n", isHidden: true },
      { input: "racecar\n", expectedOutput: "racecar\n", isHidden: true }
    ]
  },

  // 14. Trích xuất các ký tự với bước nhảy
  {
    title: 'Trích xuất các ký tự với bước nhảy',
    problemDescription: `### Bài tập 14: Trích xuất các ký tự với bước nhảy

- **Mô tả:** Nhận vào chuỗi \`s\`. Sử dụng slicing với bước nhảy 2 (\`s[::2]\`) để trích xuất các ký tự ở vị trí chẵn và in ra màn hình.
- **Input:** Chuỗi \`s\`.
- **Output:** Chuỗi sau khi trích xuất.
- **Ví dụ:**
\`\`\`text
Input:
123456789
Output:
13579
\`\`\``,
    starterCode: `s = input().strip()
# Slicing với bước nhảy 2
`,
    solutionCode: `s = input().strip()
print(s[::2])
`,
    testCases: [
      { input: "123456789\n", expectedOutput: "13579\n", isHidden: false },
      { input: "abcdefgh\n", expectedOutput: "aceg\n", isHidden: true },
      { input: "Python\n", expectedOutput: "Pto\n", isHidden: true }
    ]
  },

  // 15. Slicing với chỉ số âm
  {
    title: 'Slicing với chỉ số âm',
    problemDescription: `### Bài tập 15: Slicing với chỉ số âm

- **Mô tả:** Nhận vào một chuỗi \`s\` có ít nhất 5 ký tự. Sử dụng slicing với chỉ số âm để trích xuất 5 ký tự cuối cùng (\`s[-5:]\`) và in ra màn hình.
- **Input:** Chuỗi \`s\`.
- **Output:** 5 ký tự cuối cùng.
- **Ví dụ:**
\`\`\`text
Input:
Hello, World!
Output:
orld!
\`\`\``,
    starterCode: `s = input()
# Lấy 5 ký tự cuối cùng
`,
    solutionCode: `s = input()
print(s[-5:])
`,
    testCases: [
      { input: "Hello, World!\n", expectedOutput: "orld!\n", isHidden: false },
      { input: "Programming\n", expectedOutput: "mming\n", isHidden: true },
      { input: "Welcome\n", expectedOutput: "lcome\n", isHidden: true }
    ]
  },

  // 16. Trích xuất một phần chuỗi từ đầu
  {
    title: 'Trích xuất một phần chuỗi từ đầu',
    problemDescription: `### Bài tập 16: Trích xuất một phần chuỗi từ đầu

- **Mô tả:** Nhận vào một chuỗi \`s\` có ít nhất 6 ký tự. Sử dụng slicing để trích xuất 6 ký tự đầu tiên (\`s[:6]\`) và in ra màn hình.
- **Input:** Chuỗi \`s\`.
- **Output:** 6 ký tự đầu tiên.
- **Ví dụ:**
\`\`\`text
Input:
Programming
Output:
Progra
\`\`\``,
    starterCode: `s = input()
# Lấy 6 ký tự đầu tiên
`,
    solutionCode: `s = input()
print(s[:6])
`,
    testCases: [
      { input: "Programming\n", expectedOutput: "Progra\n", isHidden: false },
      { input: "Python Course\n", expectedOutput: "Python\n", isHidden: true },
      { input: "Hello World\n", expectedOutput: "Hello \n", isHidden: true }
    ]
  },

  // 17. Trích xuất một phần chuỗi từ cuối
  {
    title: 'Trích xuất một phần chuỗi từ cuối',
    problemDescription: `### Bài tập 17: Trích xuất một phần chuỗi từ cuối

- **Mô tả:** Nhận vào chuỗi \`s\` có ít nhất 6 ký tự. Sử dụng slicing để trích xuất 6 ký tự cuối cùng (\`s[-6:]\`) và in ra màn hình.
- **Input:** Chuỗi \`s\`.
- **Output:** 6 ký tự cuối.
- **Ví dụ:**
\`\`\`text
Input:
Programming
Output:
amming
\`\`\``,
    starterCode: `s = input()
# Lấy 6 ký tự cuối cùng
`,
    solutionCode: `s = input()
print(s[-6:])
`,
    testCases: [
      { input: "Programming\n", expectedOutput: "amming\n", isHidden: false },
      { input: "Python Course\n", expectedOutput: "Course\n", isHidden: true },
      { input: "Great Python\n", expectedOutput: "Python\n", isHidden: true }
    ]
  },

  // 18. Slicing để loại bỏ ký tự đầu và cuối
  {
    title: 'Slicing để loại bỏ ký tự đầu và cuối',
    problemDescription: `### Bài tập 18: Slicing để loại bỏ ký tự đầu và cuối

- **Mô tả:** Nhận vào một chuỗi \`s\` có ít nhất 3 ký tự. Sử dụng slicing để loại bỏ ký tự đầu tiên và ký tự cuối cùng (\`s[1:-1]\`) và in ra màn hình.
- **Input:** Chuỗi \`s\`.
- **Output:** Chuỗi sau khi cắt bỏ ký tự đầu và cuối.
- **Ví dụ:**
\`\`\`text
Input:
[Python]
Output:
Python
\`\`\``,
    starterCode: `s = input().strip()
# Cắt bỏ ký tự đầu và cuối
`,
    solutionCode: `s = input().strip()
print(s[1:-1])
`,
    testCases: [
      { input: "[Python]\n", expectedOutput: "Python\n", isHidden: false },
      { input: "\"Hello\"\n", expectedOutput: "Hello\n", isHidden: true },
      { input: "<VibeCode>\n", expectedOutput: "VibeCode\n", isHidden: true }
    ]
  },

  // 19. Slicing với bước nhảy lớn
  {
    title: 'Slicing với bước nhảy lớn',
    problemDescription: `### Bài tập 19: Slicing với bước nhảy lớn

- **Mô tả:** Nhận vào một chuỗi \`s\`. Sử dụng slicing với bước nhảy 3 (\`s[::3]\`) và in ra kết quả.
- **Input:** Chuỗi \`s\`.
- **Output:** Chuỗi sau khi trích xuất với bước nhảy 3.
- **Ví dụ:**
\`\`\`text
Input:
0123456789
Output:
0369
\`\`\``,
    starterCode: `s = input().strip()
# Slicing với bước nhảy 3
`,
    solutionCode: `s = input().strip()
print(s[::3])
`,
    testCases: [
      { input: "0123456789\n", expectedOutput: "0369\n", isHidden: false },
      { input: "abcdefghij\n", expectedOutput: "adgj\n", isHidden: true },
      { input: "Programming\n", expectedOutput: "Pgmn\n", isHidden: true }
    ]
  },

  // 20. Trích xuất xen kẽ và đảo ngược
  {
    title: 'Trích xuất xen kẽ và đảo ngược',
    problemDescription: `### Bài tập 20: Trích xuất xen kẽ và đảo ngược

- **Mô tả:** Nhận vào một chuỗi \`s\`. Sử dụng slicing để trích xuất các ký tự ở vị trí chỉ số lẻ (\`s[1::2]\`), sau đó đảo ngược chuỗi kết quả (\`[::-1]\`) và in ra màn hình.
- **Input:** Chuỗi \`s\`.
- **Output:** Chuỗi sau khi trích xuất và đảo ngược.
- **Ví dụ:**
\`\`\`text
Input:
abcdefghij
Output:
jhfdb
\`\`\``,
    starterCode: `s = input().strip()
# Trích xuất vị trí lẻ và đảo ngược
`,
    solutionCode: `s = input().strip()
print(s[1::2][::-1])
`,
    testCases: [
      { input: "abcdefghij\n", expectedOutput: "jhfdb\n", isHidden: false },
      { input: "0123456789\n", expectedOutput: "97531\n", isHidden: true },
      { input: "123456\n", expectedOutput: "642\n", isHidden: true }
    ]
  }
];

async function updateModule4() {
  console.log('🚀 Bắt đầu cập nhật Module 4 (LS-04.MP) vào CSDL và Seed file...');

  const lesson = await prisma.lesson.findFirst({
    where: { lessonId: 'LS-04.MP' },
    include: { codingExercises: true }
  });

  if (!lesson) {
    throw new Error('Lesson LS-04.MP not found');
  }

  for (const exDef of exercises) {
    const existing = lesson.codingExercises.find(
      (e) => e.title.trim().toLowerCase() === exDef.title.trim().toLowerCase()
    );

    if (!existing) {
      console.warn(`⚠️ Không tìm thấy bài tập: "${exDef.title}"`);
      continue;
    }

    console.log(`Đang cập nhật bài: "${exDef.title}" (ID: ${existing.id})...`);

    // Xóa testcases cũ
    await prisma.testCase.deleteMany({
      where: { exerciseId: existing.id }
    });

    // Cập nhật bài tập và tạo testcases mới
    await prisma.codingExercise.update({
      where: { id: existing.id },
      data: {
        problemDescription: exDef.problemDescription,
        starterCode: exDef.starterCode,
        solutionCode: exDef.solutionCode,
        testCases: {
          create: exDef.testCases.map((tc) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden
          }))
        }
      }
    });

    console.log(`  ✓ Xong (${exDef.testCases.length} TCs).`);
  }

  // Đồng bộ vào seed file
  const seedPath = path.resolve(__dirname, '../prisma/seed/seed_course_data.json');
  console.log(`\nĐang đồng bộ file seed: ${seedPath}...`);
  const rawSeed = fs.readFileSync(seedPath, 'utf-8');
  const seedData = JSON.parse(rawSeed);

  const mod4 = seedData.modules?.find((m: any) => m.title?.includes('Module 4') || m.moduleId === 'MOD-04');
  if (mod4 && mod4.lessons) {
    const seedLesson = mod4.lessons.find((l: any) => l.lessonId === 'LS-04.MP');
    if (seedLesson && seedLesson.codingExercises) {
      for (const exDef of exercises) {
        const seedEx = seedLesson.codingExercises.find(
          (e: any) => e.title?.trim().toLowerCase() === exDef.title.trim().toLowerCase()
        );
        if (seedEx) {
          seedEx.problemDescription = exDef.problemDescription;
          seedEx.starterCode = exDef.starterCode;
          seedEx.solutionCode = exDef.solutionCode;
          seedEx.testCases = exDef.testCases;
        }
      }
      fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2), 'utf-8');
      console.log('✓ Đã đồng bộ seed_course_data.json!');
    }
  }

  console.log('\n🎉 HOÀN TẤT CẬP NHẬT CÁC BÀI TẬP MODULE 4!');
}

updateModule4()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
