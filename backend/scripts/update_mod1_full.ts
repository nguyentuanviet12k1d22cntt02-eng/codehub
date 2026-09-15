import { prisma } from '../src/infrastructure/database/prisma';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

interface TestCaseDef {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface ExerciseDef {
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  problemDescription: string;
  starterCode: string;
  solutionCode: string;
  testCases: TestCaseDef[];
}

const mod1Exercises: ExerciseDef[] = [
  // 1. Tính tổng hai số
  {
    title: 'Tính tổng hai số',
    difficulty: 'EASY',
    problemDescription: `### Bài 1: Tính tổng hai số

- **Mô tả:** Viết chương trình nhận vào hai số nguyên \`a\` và \`b\` (mỗi số trên một dòng). Tính và in ra tổng của chúng.
- **Input:**
  - Dòng 1: Số nguyên \`a\`
  - Dòng 2: Số nguyên \`b\`
- **Output:**
  - Một số nguyên duy nhất là tổng của \`a\` và \`b\`.
- **Ràng buộc (Constraints):**
  - \`-10^9 <= a, b <= 10^9\`
- **Ví dụ:**
\`\`\`text
Input:
5
3
Output:
8
\`\`\``,
    starterCode: `a = int(input())
b = int(input())
# Tính và in tổng của a và b
`,
    solutionCode: `a = int(input())
b = int(input())
print(a + b)
`,
    testCases: [
      { input: "5\n3\n", expectedOutput: "8\n", isHidden: false },
      { input: "-10\n15\n", expectedOutput: "5\n", isHidden: true },
      { input: "0\n0\n", expectedOutput: "0\n", isHidden: true },
      { input: "-20\n-30\n", expectedOutput: "-50\n", isHidden: true }
    ]
  },

  // 2. Tính hiệu hai số
  {
    title: 'Tính hiệu hai số',
    difficulty: 'EASY',
    problemDescription: `### Bài 2: Tính hiệu hai số

- **Mô tả:** Viết chương trình nhận vào hai số nguyên \`a\` và \`b\` (mỗi số trên một dòng). Tính và in ra hiệu của \`a - b\`.
- **Input:**
  - Dòng 1: Số nguyên \`a\`
  - Dòng 2: Số nguyên \`b\`
- **Output:**
  - Một số nguyên duy nhất là hiệu của \`a - b\`.
- **Ràng buộc (Constraints):**
  - \`-10^9 <= a, b <= 10^9\`
- **Ví dụ:**
\`\`\`text
Input:
10
4
Output:
6
\`\`\``,
    starterCode: `a = int(input())
b = int(input())
# Tính và in hiệu a - b
`,
    solutionCode: `a = int(input())
b = int(input())
print(a - b)
`,
    testCases: [
      { input: "10\n4\n", expectedOutput: "6\n", isHidden: false },
      { input: "5\n12\n", expectedOutput: "-7\n", isHidden: true },
      { input: "-5\n-8\n", expectedOutput: "3\n", isHidden: true },
      { input: "100\n100\n", expectedOutput: "0\n", isHidden: true }
    ]
  },

  // 3. Tính tích ba số
  {
    title: 'Tính tích ba số',
    difficulty: 'EASY',
    problemDescription: `### Bài 3: Tính tích ba số

- **Mô tả:** Viết chương trình nhận vào ba số nguyên \`x\`, \`y\`, và \`z\` (mỗi số trên một dòng). Tính và in ra tích của chúng.
- **Input:**
  - Dòng 1: Số nguyên \`x\`
  - Dòng 2: Số nguyên \`y\`
  - Dòng 3: Số nguyên \`z\`
- **Output:**
  - Một số nguyên duy nhất là tích của 3 số.
- **Ràng buộc (Constraints):**
  - \`-10^6 <= x, y, z <= 10^6\`
- **Ví dụ:**
\`\`\`text
Input:
2
3
4
Output:
24
\`\`\``,
    starterCode: `x = int(input())
y = int(input())
z = int(input())
# Tính và in tích x * y * z
`,
    solutionCode: `x = int(input())
y = int(input())
z = int(input())
print(x * y * z)
`,
    testCases: [
      { input: "2\n3\n4\n", expectedOutput: "24\n", isHidden: false },
      { input: "-2\n5\n3\n", expectedOutput: "-30\n", isHidden: true },
      { input: "0\n99\n100\n", expectedOutput: "0\n", isHidden: true },
      { input: "-3\n-4\n-5\n", expectedOutput: "-60\n", isHidden: true }
    ]
  },

  // 4. Tính thương nguyên và phần dư
  {
    title: 'Tính thương nguyên và phần dư',
    difficulty: 'EASY',
    problemDescription: `### Bài 4: Tính thương nguyên và phần dư

- **Mô tả:** Viết chương trình nhận vào hai số nguyên dương \`so_bi_chia\` và \`so_chia\` (mỗi số trên một dòng). Tính và in ra thương nguyên và phần dư của phép chia.
- **Input:**
  - Dòng 1: \`so_bi_chia\`
  - Dòng 2: \`so_chia\` (\`so_chia != 0\`)
- **Output:**
  - Dòng 1: Thương nguyên (\`//\`)
  - Dòng 2: Phần dư (\`%\`)
- **Ràng buộc (Constraints):**
  - \`1 <= so_bi_chia, so_chia <= 10^9\`
- **Ví dụ:**
\`\`\`text
Input:
17
5
Output:
3
2
\`\`\``,
    starterCode: `so_bi_chia = int(input())
so_chia = int(input())
# In thương nguyên ở dòng 1, phần dư ở dòng 2
`,
    solutionCode: `so_bi_chia = int(input())
so_chia = int(input())
print(so_bi_chia // so_chia)
print(so_bi_chia % so_chia)
`,
    testCases: [
      { input: "17\n5\n", expectedOutput: "3\n2\n", isHidden: false },
      { input: "20\n4\n", expectedOutput: "5\n0\n", isHidden: true },
      { input: "7\n10\n", expectedOutput: "0\n7\n", isHidden: true },
      { input: "100\n3\n", expectedOutput: "33\n1\n", isHidden: true }
    ]
  },

  // 5. Tính chu vi và diện tích hình chữ nhật
  {
    title: 'Tính chu vi và diện tích hình chữ nhật',
    difficulty: 'EASY',
    problemDescription: `### Bài 5: Tính chu vi và diện tích hình chữ nhật

- **Mô tả:** Viết chương trình nhận vào chiều dài \`dai\` và chiều rộng \`rong\` của một hình chữ nhật (mỗi số trên một dòng, số thực). Tính và in ra chu vi và diện tích của nó.
- **Input:**
  - Dòng 1: Chiều dài \`dai\` (float)
  - Dòng 2: Chiều rộng \`rong\` (float)
- **Output:**
  - Dòng 1: Chu vi (float)
  - Dòng 2: Diện tích (float)
- **Ràng buộc (Constraints):**
  - \`0 < dai, rong <= 10^6\`
- **Ví dụ:**
\`\`\`text
Input:
5.0
3.0
Output:
16.0
15.0
\`\`\``,
    starterCode: `dai = float(input())
rong = float(input())
# Tính và in chu vi, diện tích
`,
    solutionCode: `dai = float(input())
rong = float(input())
print((dai + rong) * 2)
print(dai * rong)
`,
    testCases: [
      { input: "5.0\n3.0\n", expectedOutput: "16.0\n15.0\n", isHidden: false },
      { input: "10.0\n4.5\n", expectedOutput: "29.0\n45.0\n", isHidden: true },
      { input: "2.5\n2.5\n", expectedOutput: "10.0\n6.25\n", isHidden: true },
      { input: "100.0\n50.0\n", expectedOutput: "300.0\n5000.0\n", isHidden: true }
    ]
  },

  // 6. Chuyển đổi nhiệt độ từ Celsius sang Fahrenheit
  {
    title: 'Chuyển đổi nhiệt độ từ Celsius sang Fahrenheit',
    difficulty: 'EASY',
    problemDescription: `### Bài 6: Chuyển đổi nhiệt độ từ Celsius sang Fahrenheit

- **Mô tả:** Viết chương trình nhận vào nhiệt độ \`C\` theo độ Celsius (số thực). Chuyển đổi và in ra nhiệt độ đó sang độ Fahrenheit.
- **Công thức:** \`F = C * 9 / 5 + 32\`
- **Input:** Một số thực \`C\`
- **Output:** Một số thực \`F\`
- **Ràng buộc (Constraints):**
  - \`-273.15 <= C <= 10^6\`
- **Ví dụ:**
\`\`\`text
Input:
25.0
Output:
77.0
\`\`\``,
    starterCode: `c = float(input())
# Chuyển đổi sang F và in kết quả
`,
    solutionCode: `c = float(input())
f = c * 9 / 5 + 32
print(f)
`,
    testCases: [
      { input: "25.0\n", expectedOutput: "77.0\n", isHidden: false },
      { input: "0.0\n", expectedOutput: "32.0\n", isHidden: true },
      { input: "100.0\n", expectedOutput: "212.0\n", isHidden: true },
      { input: "-40.0\n", expectedOutput: "-40.0\n", isHidden: true }
    ]
  },

  // 7. Tính tổng tiền mua hàng
  {
    title: 'Tính tổng tiền mua hàng',
    difficulty: 'EASY',
    problemDescription: `### Bài 7: Tính tổng tiền mua hàng

- **Mô tả:** Một người mua 3 loại mặt hàng A, B, C. Nhận vào số lượng và đơn giá của từng loại (mỗi giá trị trên 1 dòng). Tính và in ra tổng số tiền phải trả.
- **Input:**
  - Dòng 1, 2: \`so_luong_A\`, \`don_gia_A\` (số nguyên)
  - Dòng 3, 4: \`so_luong_B\`, \`don_gia_B\` (số nguyên)
  - Dòng 5, 6: \`so_luong_C\`, \`don_gia_C\` (số nguyên)
- **Output:** Một số nguyên duy nhất là tổng số tiền.
- **Ví dụ:**
\`\`\`text
Input:
2
10000
1
50000
3
5000
Output:
85000
\`\`\``,
    starterCode: `sl_a = int(input())
dg_a = int(input())
sl_b = int(input())
dg_b = int(input())
sl_c = int(input())
dg_c = int(input())
# Tính và in tổng tiền
`,
    solutionCode: `sl_a = int(input())
dg_a = int(input())
sl_b = int(input())
dg_b = int(input())
sl_c = int(input())
dg_c = int(input())
tong = sl_a * dg_a + sl_b * dg_b + sl_c * dg_c
print(tong)
`,
    testCases: [
      { input: "2\n10000\n1\n50000\n3\n5000\n", expectedOutput: "85000\n", isHidden: false },
      { input: "5\n20000\n2\n15000\n0\n10000\n", expectedOutput: "130000\n", isHidden: true },
      { input: "1\n1000\n1\n2000\n1\n3000\n", expectedOutput: "6000\n", isHidden: true },
      { input: "10\n5000\n5\n12000\n2\n25000\n", expectedOutput: "160000\n", isHidden: true }
    ]
  },

  // 8. Tính điểm trung bình của ba môn
  {
    title: 'Tính điểm trung bình của ba môn',
    difficulty: 'EASY',
    problemDescription: `### Bài 8: Tính điểm trung bình của ba môn

- **Mô tả:** Viết chương trình nhận vào điểm ba môn học: \`diem_toan\`, \`diem_ly\`, \`diem_hoa\` (mỗi điểm trên một dòng, số thực). Tính và in ra điểm trung bình cộng của ba môn này.
- **Input:** 3 số thực trên 3 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
8.5
7.0
9.0
Output:
8.166666666666666
\`\`\``,
    starterCode: `t = float(input())
l = float(input())
h = float(input())
# Tính và in điểm trung bình
`,
    solutionCode: `t = float(input())
l = float(input())
h = float(input())
print((t + l + h) / 3)
`,
    testCases: [
      { input: "8.5\n7.0\n9.0\n", expectedOutput: "8.166666666666666\n", isHidden: false },
      { input: "10.0\n10.0\n10.0\n", expectedOutput: "10.0\n", isHidden: true },
      { input: "6.0\n8.0\n7.0\n", expectedOutput: "7.0\n", isHidden: true },
      { input: "5.0\n5.5\n6.0\n", expectedOutput: "5.5\n", isHidden: true }
    ]
  },

  // 9. Hoán đổi giá trị hai biến
  {
    title: 'Hoán đổi giá trị hai biến',
    difficulty: 'EASY',
    problemDescription: `### Bài 9: Hoán đổi giá trị hai biến

- **Mô tả:** Viết chương trình nhận vào hai số nguyên \`x\` và \`y\` (mỗi số trên 1 dòng). Hoán đổi giá trị của chúng (dùng biến tạm hoặc cú pháp unpacking của Python) và in ra giá trị mới của \`x\` và \`y\` trên 2 dòng.
- **Input:**
  - Dòng 1: \`x\`
  - Dòng 2: \`y\`
- **Output:**
  - Dòng 1: Giá trị mới của \`x\`
  - Dòng 2: Giá trị mới của \`y\`
- **Ví dụ:**
\`\`\`text
Input:
10
20
Output:
20
10
\`\`\``,
    starterCode: `x = int(input())
y = int(input())
# Hoán đổi x và y rồi in ra
`,
    solutionCode: `x = int(input())
y = int(input())
x, y = y, x
print(x)
print(y)
`,
    testCases: [
      { input: "10\n20\n", expectedOutput: "20\n10\n", isHidden: false },
      { input: "5\n-5\n", expectedOutput: "-5\n5\n", isHidden: true },
      { input: "0\n100\n", expectedOutput: "100\n0\n", isHidden: true },
      { input: "7\n7\n", expectedOutput: "7\n7\n", isHidden: true }
    ]
  },

  // 10. Tính giá trị biểu thức số học
  {
    title: 'Tính giá trị biểu thức số học',
    difficulty: 'EASY',
    problemDescription: `### Bài 10: Tính giá trị biểu thức số học

- **Mô tả:** Viết chương trình nhận vào ba số thực \`a\`, \`b\`, \`c\` (mỗi số trên một dòng, \`b != 0\`). Tính và in ra giá trị của biểu thức: \`(a + b) * c - (a / b)\`.
- **Input:** 3 số thực trên 3 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
6.0
2.0
3.0
Output:
21.0
\`\`\``,
    starterCode: `a = float(input())
b = float(input())
c = float(input())
# Tính và in kết quả biểu thức (a + b) * c - (a / b)
`,
    solutionCode: `a = float(input())
b = float(input())
c = float(input())
print((a + b) * c - (a / b))
`,
    testCases: [
      { input: "6.0\n2.0\n3.0\n", expectedOutput: "21.0\n", isHidden: false },
      { input: "10.0\n5.0\n2.0\n", expectedOutput: "28.0\n", isHidden: true },
      { input: "4.0\n2.0\n1.0\n", expectedOutput: "4.0\n", isHidden: true },
      { input: "8.0\n4.0\n0.0\n", expectedOutput: "-2.0\n", isHidden: true }
    ]
  },

  // 11. Tính diện tích hình tam giác (khi biết đáy và chiều cao)
  {
    title: 'Tính diện tích hình tam giác (khi biết đáy và chiều cao)',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 11: Tính diện tích hình tam giác

- **Mô tả:** Viết chương trình nhận vào độ dài cạnh đáy \`day\` và chiều cao \`chieu_cao\` tương ứng của một hình tam giác (mỗi số trên 1 dòng, số thực). Tính và in ra diện tích của tam giác đó.
- **Công thức:** \`Diện tích = (đáy * chiều_cao) / 2\`
- **Input:** 2 số thực trên 2 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
10.0
5.0
Output:
25.0
\`\`\``,
    starterCode: `day = float(input())
chieu_cao = float(input())
# Tính và in diện tích tam giác
`,
    solutionCode: `day = float(input())
chieu_cao = float(input())
print((day * chieu_cao) / 2)
`,
    testCases: [
      { input: "10.0\n5.0\n", expectedOutput: "25.0\n", isHidden: false },
      { input: "8.0\n4.5\n", expectedOutput: "18.0\n", isHidden: true },
      { input: "3.0\n7.0\n", expectedOutput: "10.5\n", isHidden: true },
      { input: "20.0\n15.0\n", expectedOutput: "150.0\n", isHidden: true }
    ]
  },

  // 12. Tính chu vi và diện tích hình tròn
  {
    title: 'Tính chu vi và diện tích hình tròn',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 12: Tính chu vi và diện tích hình tròn

- **Mô tả:** Viết chương trình nhận vào bán kính \`ban_kinh\` của một hình tròn (số thực). Sử dụng hằng số \`PI = 3.1415926535\` để tính và in ra chu vi và diện tích của hình tròn đó.
- **Công thức:**
  - Chu vi = \`2 * PI * bán_kính\`
  - Diện tích = \`PI * bán_kính * bán_kính\`
- **Input:** Một số thực \`ban_kinh\`.
- **Output:**
  - Dòng 1: Chu vi
  - Dòng 2: Diện tích
- **Ví dụ:**
\`\`\`text
Input:
3.0
Output:
18.849555921
28.2743338815
\`\`\``,
    starterCode: `ban_kinh = float(input())
PI = 3.1415926535
# Tính và in chu vi, diện tích
`,
    solutionCode: `ban_kinh = float(input())
PI = 3.1415926535
print(2 * PI * ban_kinh)
print(PI * ban_kinh * ban_kinh)
`,
    testCases: [
      { input: "3.0\n", expectedOutput: "18.849555921\n28.2743338815\n", isHidden: false },
      { input: "1.0\n", expectedOutput: "6.283185307\n3.1415926535\n", isHidden: true },
      { input: "5.0\n", expectedOutput: "31.415926535\n78.5398163375\n", isHidden: true },
      { input: "10.0\n", expectedOutput: "62.83185307\n314.15926535\n", isHidden: true }
    ]
  },

  // 13. Tính diện tích hình thang
  {
    title: 'Tính diện tích hình thang',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 13: Tính diện tích hình thang

- **Mô tả:** Viết chương trình nhận vào độ dài hai đáy \`day_lon\`, \`day_be\` và chiều cao \`chieu_cao\` của một hình thang (mỗi số trên 1 dòng, số thực). Tính và in ra diện tích của hình thang đó.
- **Công thức:** \`Diện tích = ((đáy_lớn + đáy_bé) * chiều_cao) / 2\`
- **Input:** 3 số thực trên 3 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
8.0
4.0
6.0
Output:
36.0
\`\`\``,
    starterCode: `day_lon = float(input())
day_be = float(input())
chieu_cao = float(input())
# Tính và in diện tích hình thang
`,
    solutionCode: `day_lon = float(input())
day_be = float(input())
chieu_cao = float(input())
print(((day_lon + day_be) * chieu_cao) / 2)
`,
    testCases: [
      { input: "8.0\n4.0\n6.0\n", expectedOutput: "36.0\n", isHidden: false },
      { input: "10.0\n5.0\n4.0\n", expectedOutput: "30.0\n", isHidden: true },
      { input: "6.5\n3.5\n2.0\n", expectedOutput: "10.0\n", isHidden: true },
      { input: "12.0\n8.0\n5.0\n", expectedOutput: "50.0\n", isHidden: true }
    ]
  },

  // 14. Tính thể tích hình hộp chữ nhật
  {
    title: 'Tính thể tích hình hộp chữ nhật',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 14: Tính thể tích hình hộp chữ nhật

- **Mô tả:** Viết chương trình nhận vào chiều dài \`dai\`, chiều rộng \`rong\` và chiều cao \`cao\` của một hình hộp chữ nhật (số thực trên 3 dòng). Tính và in ra thể tích của nó.
- **Công thức:** \`Thể tích = dài * rộng * cao\`
- **Input:** 3 số thực trên 3 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
4.0
2.0
3.0
Output:
24.0
\`\`\``,
    starterCode: `dai = float(input())
rong = float(input())
cao = float(input())
# Tính và in thể tích
`,
    solutionCode: `dai = float(input())
rong = float(input())
cao = float(input())
print(dai * rong * cao)
`,
    testCases: [
      { input: "4.0\n2.0\n3.0\n", expectedOutput: "24.0\n", isHidden: false },
      { input: "5.0\n5.0\n5.0\n", expectedOutput: "125.0\n", isHidden: true },
      { input: "10.0\n2.5\n4.0\n", expectedOutput: "100.0\n", isHidden: true },
      { input: "1.5\n2.0\n3.0\n", expectedOutput: "9.0\n", isHidden: true }
    ]
  },

  // 15. Tính diện tích bề mặt và thể tích hình cầu
  {
    title: 'Tính diện tích bề mặt và thể tích hình cầu',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 15: Tính diện tích bề mặt và thể tích hình cầu

- **Mô tả:** Viết chương trình nhận vào bán kính \`ban_kinh\` của một hình cầu (số thực). Sử dụng \`PI = 3.1415926535\` để tính và in ra diện tích bề mặt và thể tích của hình cầu đó.
- **Công thức:**
  - Diện tích bề mặt = \`4 * PI * bán_kính^2\`
  - Thể tích = \`(4/3) * PI * bán_kính^3\`
- **Input:** Một số thực \`ban_kinh\`.
- **Output:**
  - Dòng 1: Diện tích bề mặt
  - Dòng 2: Thể tích
- **Ví dụ:**
\`\`\`text
Input:
2.0
Output:
50.265482456
33.510321637333334
\`\`\``,
    starterCode: `ban_kinh = float(input())
PI = 3.1415926535
# Tính và in diện tích bề mặt và thể tích hình cầu
`,
    solutionCode: `ban_kinh = float(input())
PI = 3.1415926535
print(4 * PI * ban_kinh ** 2)
print((4 / 3) * PI * ban_kinh ** 3)
`,
    testCases: [
      { input: "2.0\n", expectedOutput: "50.265482456\n33.510321637333334\n", isHidden: false },
      { input: "1.0\n", expectedOutput: "12.566370614\n4.188790204666667\n", isHidden: true },
      { input: "3.0\n", expectedOutput: "113.097335526\n113.097335526\n", isHidden: true },
      { input: "0.5\n", expectedOutput: "3.1415926535\n0.5235987755833333\n", isHidden: true }
    ]
  },

  // 16. Tính độ dài cạnh huyền của tam giác vuông
  {
    title: 'Tính độ dài cạnh huyền của tam giác vuông',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 16: Tính độ dài cạnh huyền của tam giác vuông

- **Mô tả:** Viết chương trình nhận vào độ dài hai cạnh góc vuông \`canh_a\` và \`canh_b\` của một tam giác vuông (mỗi số trên 1 dòng, số thực). Tính và in ra độ dài cạnh huyền (sử dụng định lý Pitago: \`canh_huyen = (a^2 + b^2) ** 0.5\`).
- **Input:** 2 số thực trên 2 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
3.0
4.0
Output:
5.0
\`\`\``,
    starterCode: `a = float(input())
b = float(input())
# Tính và in cạnh huyền
`,
    solutionCode: `a = float(input())
b = float(input())
print((a ** 2 + b ** 2) ** 0.5)
`,
    testCases: [
      { input: "3.0\n4.0\n", expectedOutput: "5.0\n", isHidden: false },
      { input: "6.0\n8.0\n", expectedOutput: "10.0\n", isHidden: true },
      { input: "5.0\n12.0\n", expectedOutput: "13.0\n", isHidden: true },
      { input: "9.0\n12.0\n", expectedOutput: "15.0\n", isHidden: true }
    ]
  },

  // 17. Tính diện tích hình vành khăn (hình tròn đồng tâm)
  {
    title: 'Tính diện tích hình vành khăn (hình tròn đồng tâm)',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 17: Tính diện tích hình vành khăn

- **Mô tả:** Viết chương trình nhận vào bán kính của hai hình tròn đồng tâm: \`ban_kinh_lon\` và \`ban_kinh_be\` (\`ban_kinh_lon > ban_kinh_be\`). Sử dụng \`PI = 3.1415926535\` để tính và in ra diện tích của hình vành khăn (\`PI * (R^2 - r^2)\`).
- **Input:** 2 số thực trên 2 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
5.0
3.0
Output:
50.265482456
\`\`\``,
    starterCode: `r_lon = float(input())
r_be = float(input())
PI = 3.1415926535
# Tính và in diện tích hình vành khăn
`,
    solutionCode: `r_lon = float(input())
r_be = float(input())
PI = 3.1415926535
print(PI * (r_lon ** 2 - r_be ** 2))
`,
    testCases: [
      { input: "5.0\n3.0\n", expectedOutput: "50.265482456\n", isHidden: false },
      { input: "4.0\n2.0\n", expectedOutput: "37.699111842\n", isHidden: true },
      { input: "10.0\n6.0\n", expectedOutput: "201.061929824\n", isHidden: true },
      { input: "2.0\n1.0\n", expectedOutput: "9.4247779605\n", isHidden: true }
    ]
  },

  // 18. Tính thể tích hình trụ
  {
    title: 'Tính thể tích hình trụ',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 18: Tính thể tích hình trụ

- **Mô tả:** Viết chương trình nhận vào bán kính đáy \`ban_kinh_day\` và chiều cao \`chieu_cao\` của một hình trụ (số thực trên 2 dòng). Sử dụng \`PI = 3.1415926535\` để tính và in ra thể tích của hình trụ đó (\`V = PI * r^2 * h\`).
- **Input:** 2 số thực trên 2 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
2.0
5.0
Output:
62.83185307
\`\`\``,
    starterCode: `r = float(input())
h = float(input())
PI = 3.1415926535
# Tính và in thể tích hình trụ
`,
    solutionCode: `r = float(input())
h = float(input())
PI = 3.1415926535
print(PI * r ** 2 * h)
`,
    testCases: [
      { input: "2.0\n5.0\n", expectedOutput: "62.83185307\n", isHidden: false },
      { input: "1.0\n10.0\n", expectedOutput: "31.415926535\n", isHidden: true },
      { input: "3.0\n4.0\n", expectedOutput: "113.097335526\n", isHidden: true },
      { input: "5.0\n2.0\n", expectedOutput: "157.079632675\n", isHidden: true }
    ]
  },

  // 19. Tính tọa độ trung điểm của đoạn thẳng trong mặt phẳng 2D
  {
    title: 'Tính tọa độ trung điểm của đoạn thẳng trong mặt phẳng 2D',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 19: Tính tọa độ trung điểm của đoạn thẳng 2D

- **Mô tả:** Viết chương trình nhận vào tọa độ hai điểm A(\`x1\`, \`y1\`) và B(\`x2\`, \`y2\`) trên 4 dòng (số thực). Tính và in ra tọa độ trung điểm M(\`xm\`, \`ym\`) của đoạn thẳng AB.
- **Công thức:** \`xm = (x1 + x2) / 2\`, \`ym = (y1 + y2) / 2\`
- **Input:** 4 số thực trên 4 dòng.
- **Output:**
  - Dòng 1: \`xm\`
  - Dòng 2: \`ym\`
- **Ví dụ:**
\`\`\`text
Input:
1.0
1.0
5.0
5.0
Output:
3.0
3.0
\`\`\``,
    starterCode: `x1 = float(input())
y1 = float(input())
x2 = float(input())
y2 = float(input())
# Tính và in xm, ym
`,
    solutionCode: `x1 = float(input())
y1 = float(input())
x2 = float(input())
y2 = float(input())
print((x1 + x2) / 2)
print((y1 + y2) / 2)
`,
    testCases: [
      { input: "1.0\n1.0\n5.0\n5.0\n", expectedOutput: "3.0\n3.0\n", isHidden: false },
      { input: "0.0\n0.0\n4.0\n6.0\n", expectedOutput: "2.0\n3.0\n", isHidden: true },
      { input: "-2.0\n3.0\n2.0\n-3.0\n", expectedOutput: "0.0\n0.0\n", isHidden: true },
      { input: "1.5\n2.5\n3.5\n4.5\n", expectedOutput: "2.5\n3.5\n", isHidden: true }
    ]
  },

  // 20. Tính khoảng cách giữa hai điểm trong mặt phẳng 2D
  {
    title: 'Tính khoảng cách giữa hai điểm trong mặt phẳng 2D',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 20: Tính khoảng cách giữa hai điểm 2D

- **Mô tả:** Viết chương trình nhận vào tọa độ hai điểm A(\`x1\`, \`y1\`) và B(\`x2\`, \`y2\`) trên 4 dòng (số thực). Tính và in ra khoảng cách giữa hai điểm này (\`d = ((x2 - x1)^2 + (y2 - y1)^2) ** 0.5\`).
- **Input:** 4 số thực trên 4 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
1.0
1.0
4.0
5.0
Output:
5.0
\`\`\``,
    starterCode: `x1 = float(input())
y1 = float(input())
x2 = float(input())
y2 = float(input())
# Tính và in khoảng cách giữa 2 điểm
`,
    solutionCode: `x1 = float(input())
y1 = float(input())
x2 = float(input())
y2 = float(input())
print(((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5)
`,
    testCases: [
      { input: "1.0\n1.0\n4.0\n5.0\n", expectedOutput: "5.0\n", isHidden: false },
      { input: "0.0\n0.0\n3.0\n4.0\n", expectedOutput: "5.0\n", isHidden: true },
      { input: "0.0\n0.0\n6.0\n8.0\n", expectedOutput: "10.0\n", isHidden: true },
      { input: "2.0\n2.0\n2.0\n5.0\n", expectedOutput: "3.0\n", isHidden: true }
    ]
  },

  // 21. Tính toán chi phí xây dựng hàng rào
  {
    title: 'Tính toán chi phí xây dựng hàng rào',
    difficulty: 'HARD',
    problemDescription: `### Bài 21: Tính toán chi phí xây dựng hàng rào

- **Mô tả:** Nhận vào chiều dài \`dai\` và chiều rộng \`rong\` của khu vườn (số thực), cùng chi phí vật liệu \`gia_vat_lieu\` và nhân công \`gia_nhan_cong\` trên mỗi mét (số nguyên). Tính và in ra tổng chi phí xây dựng hàng rào.
- **Công thức:** \`Chu vi = 2 * (dai + rong)\`, \`Tổng chi phí = Chu vi * (gia_vat_lieu + gia_nhan_cong)\`.
- **Input:**
  - Dòng 1: \`dai\` (float)
  - Dòng 2: \`rong\` (float)
  - Dòng 3: \`gia_vat_lieu\` (int)
  - Dòng 4: \`gia_nhan_cong\` (int)
- **Output:** 1 số nguyên (hoặc float tương ứng).
- **Ví dụ:**
\`\`\`text
Input:
10.0
5.0
50000
20000
Output:
2100000
\`\`\``,
    starterCode: `dai = float(input())
rong = float(input())
vl = int(input())
nc = int(input())
# Tính và in tổng chi phí
`,
    solutionCode: `dai = float(input())
rong = float(input())
vl = int(input())
nc = int(input())
chu_vi = 2 * (dai + rong)
tong = int(chu_vi * (vl + nc))
print(tong)
`,
    testCases: [
      { input: "10.0\n5.0\n50000\n20000\n", expectedOutput: "2100000\n", isHidden: false },
      { input: "20.0\n10.0\n30000\n15000\n", expectedOutput: "2700000\n", isHidden: true },
      { input: "15.0\n8.0\n40000\n25000\n", expectedOutput: "2990000\n", isHidden: true },
      { input: "5.0\n5.0\n100000\n50000\n", expectedOutput: "3000000\n", isHidden: true }
    ]
  },

  // 22. Tính thể tích hình nón
  {
    title: 'Tính thể tích hình nón',
    difficulty: 'HARD',
    problemDescription: `### Bài 22: Tính thể tích hình nón

- **Mô tả:** Viết chương trình nhận vào bán kính đáy \`ban_kinh_day\` và chiều cao \`chieu_cao\` của một hình nón (số thực trên 2 dòng). Sử dụng \`PI = 3.1415926535\` để tính và in ra thể tích hình nón (\`V = (1/3) * PI * r^2 * h\`).
- **Input:** 2 số thực trên 2 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
3.0
4.0
Output:
37.699111842
\`\`\``,
    starterCode: `r = float(input())
h = float(input())
PI = 3.1415926535
# Tính và in thể tích hình nón
`,
    solutionCode: `r = float(input())
h = float(input())
PI = 3.1415926535
print((1 / 3) * PI * r ** 2 * h)
`,
    testCases: [
      { input: "3.0\n4.0\n", expectedOutput: "37.699111842\n", isHidden: false },
      { input: "6.0\n5.0\n", expectedOutput: "188.49555921\n", isHidden: true },
      { input: "1.0\n3.0\n", expectedOutput: "3.1415926535\n", isHidden: true },
      { input: "4.5\n2.0\n", expectedOutput: "42.41150082225\n", isHidden: true }
    ]
  },

  // 23. Tính diện tích toàn phần của hình trụ
  {
    title: 'Tính diện tích toàn phần của hình trụ',
    difficulty: 'HARD',
    problemDescription: `### Bài 23: Tính diện tích toàn phần của hình trụ

- **Mô tả:** Viết chương trình nhận vào bán kính đáy \`ban_kinh_day\` và chiều cao \`chieu_cao\` của một hình trụ (số thực trên 2 dòng). Sử dụng \`PI = 3.1415926535\` để tính và in ra diện tích toàn phần của nó (\`Stp = 2 * PI * r^2 + 2 * PI * r * h\`).
- **Input:** 2 số thực trên 2 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
2.0
5.0
Output:
87.96459429800001
\`\`\``,
    starterCode: `r = float(input())
h = float(input())
PI = 3.1415926535
# Tính và in diện tích toàn phần
`,
    solutionCode: `r = float(input())
h = float(input())
PI = 3.1415926535
print(2 * PI * r ** 2 + 2 * PI * r * h)
`,
    testCases: [
      { input: "2.0\n5.0\n", expectedOutput: "87.96459429800001\n", isHidden: false },
      { input: "1.0\n4.0\n", expectedOutput: "31.415926535\n", isHidden: true },
      { input: "3.0\n7.0\n", expectedOutput: "188.49555921\n", isHidden: true },
      { input: "5.0\n10.0\n", expectedOutput: "471.238898025\n", isHidden: true }
    ]
  },

  // 24. Tính diện tích hình bình hành
  {
    title: 'Tính diện tích hình bình hành',
    difficulty: 'HARD',
    problemDescription: `### Bài 24: Tính diện tích hình bình hành

- **Mô tả:** Viết chương trình nhận vào độ dài đáy \`day\` và chiều cao tương ứng \`chieu_cao\` của hình bình hành (số thực trên 2 dòng). Tính và in ra diện tích của nó (\`dien_tich = day * chieu_cao\`).
- **Input:** 2 số thực trên 2 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
8.0
5.5
Output:
44.0
\`\`\``,
    starterCode: `day = float(input())
h = float(input())
# Tính và in diện tích hình bình hành
`,
    solutionCode: `day = float(input())
h = float(input())
print(day * h)
`,
    testCases: [
      { input: "8.0\n5.5\n", expectedOutput: "44.0\n", isHidden: false },
      { input: "10.0\n4.0\n", expectedOutput: "40.0\n", isHidden: true },
      { input: "7.5\n6.0\n", expectedOutput: "45.0\n", isHidden: true },
      { input: "12.0\n3.5\n", expectedOutput: "42.0\n", isHidden: true }
    ]
  },

  // 25. Tính toán chi phí sơn nhà
  {
    title: 'Tính toán chi phí sơn nhà',
    difficulty: 'HARD',
    problemDescription: `### Bài 25: Tính toán chi phí sơn nhà

- **Mô tả:** Nhận vào chiều dài, chiều rộng, chiều cao của phòng (số thực) và giá sơn trên 1 mét vuông (số nguyên). Tính và in ra tổng chi phí sơn 4 bức tường xung quanh phòng (\`S = 2 * (dai + rong) * cao\`, \`Chi phí = S * gia_son\`).
- **Input:** 3 số thực trên 3 dòng đầu, dòng thứ 4 là số nguyên giá sơn.
- **Output:** 1 số nguyên tổng chi phí.
- **Ví dụ:**
\`\`\`text
Input:
5.0
4.0
3.0
25000
Output:
1350000
\`\`\``,
    starterCode: `dai = float(input())
rong = float(input())
cao = float(input())
gia = int(input())
# Tính và in tổng chi phí sơn phòng
`,
    solutionCode: `dai = float(input())
rong = float(input())
cao = float(input())
gia = int(input())
dien_tich = 2 * (dai + rong) * cao
print(int(dien_tich * gia))
`,
    testCases: [
      { input: "5.0\n4.0\n3.0\n25000\n", expectedOutput: "1350000\n", isHidden: false },
      { input: "6.0\n4.0\n2.8\n30000\n", expectedOutput: "1680000\n", isHidden: true },
      { input: "4.0\n3.0\n2.5\n20000\n", expectedOutput: "700000\n", isHidden: true },
      { input: "8.0\n5.0\n3.5\n40000\n", expectedOutput: "3640000\n", isHidden: true }
    ]
  },

  // 26. Chuyển đổi đơn vị tiền tệ
  {
    title: 'Chuyển đổi đơn vị tiền tệ',
    difficulty: 'HARD',
    problemDescription: `### Bài 26: Chuyển đổi đơn vị tiền tệ

- **Mô tả:** Nhận vào số tiền USD (số thực). Chuyển đổi và in ra số tiền này sang VNĐ, Euro và Yên Nhật trên 3 dòng riêng biệt theo tỷ giá:
  - \`1 USD = 25000 VNĐ\`
  - \`1 USD = 0.92 Euro\`
  - \`1 USD = 155.0 Yên Nhật\`
- **Input:** Một số thực \`so_tien_USD\`.
- **Output:**
  - Dòng 1: Số tiền VNĐ (float)
  - Dòng 2: Số tiền Euro (float)
  - Dòng 3: Số tiền Yên Nhật (float)
- **Ví dụ:**
\`\`\`text
Input:
100.0
Output:
2500000.0
92.0
15500.0
\`\`\``,
    starterCode: `usd = float(input())
# Chuyển đổi và in lần lượt VNĐ, Euro, Yên Nhật
`,
    solutionCode: `usd = float(input())
print(usd * 25000)
print(usd * 0.92)
print(usd * 155.0)
`,
    testCases: [
      { input: "100.0\n", expectedOutput: "2500000.0\n92.0\n15500.0\n", isHidden: false },
      { input: "50.0\n", expectedOutput: "1250000.0\n46.0\n7750.0\n", isHidden: true },
      { input: "200.0\n", expectedOutput: "5000000.0\n184.0\n31000.0\n", isHidden: true },
      { input: "25.0\n", expectedOutput: "625000.0\n23.0\n3875.0\n", isHidden: true }
    ]
  },

  // 27. Tính toán lợi nhuận và phần trăm lợi nhuận
  {
    title: 'Tính toán lợi nhuận và phần trăm lợi nhuận',
    difficulty: 'HARD',
    problemDescription: `### Bài 27: Tính toán lợi nhuận và phần trăm lợi nhuận

- **Mô tả:** Nhận vào giá mua \`gia_mua\` và giá bán \`gia_ban\` của một sản phẩm (số thực trên 2 dòng). Tính và in ra lợi nhuận và phần trăm lợi nhuận (so với giá mua).
- **Công thức:**
  - \`Lợi nhuận = gia_ban - gia_mua\`
  - \`Phần trăm lợi nhuận = (Lợi nhuận / gia_mua) * 100\`
- **Input:** 2 số thực trên 2 dòng.
- **Output:**
  - Dòng 1: Lợi nhuận (float)
  - Dòng 2: Phần trăm lợi nhuận (float)
- **Ví dụ:**
\`\`\`text
Input:
80.0
100.0
Output:
20.0
25.0
\`\`\``,
    starterCode: `gia_mua = float(input())
gia_ban = float(input())
# Tính và in lợi nhuận, phần trăm lợi nhuận
`,
    solutionCode: `gia_mua = float(input())
gia_ban = float(input())
loi_nhuan = gia_ban - gia_mua
phan_tram = (loi_nhuan / gia_mua) * 100
print(loi_nhuan)
print(phan_tram)
`,
    testCases: [
      { input: "80.0\n100.0\n", expectedOutput: "20.0\n25.0\n", isHidden: false },
      { input: "50.0\n75.0\n", expectedOutput: "25.0\n50.0\n", isHidden: true },
      { input: "100.0\n100.0\n", expectedOutput: "0.0\n0.0\n", isHidden: true },
      { input: "200.0\n220.0\n", expectedOutput: "20.0\n10.0\n", isHidden: true }
    ]
  },

  // 28. Tính điểm thi cuối kỳ (có trọng số)
  {
    title: 'Tính điểm thi cuối kỳ (có trọng số)',
    difficulty: 'HARD',
    problemDescription: `### Bài 28: Tính điểm thi cuối kỳ (có trọng số)

- **Mô tả:** Nhận vào điểm bài tập \`diem_bai_tap\`, điểm giữa kỳ \`diem_giua_ky\` và điểm cuối kỳ \`diem_cuoi_ky\` (số thực trên 3 dòng). Tính và in ra điểm tổng kết: \`Tổng kết = diem_bt * 0.2 + diem_gk * 0.3 + diem_ck * 0.5\`.
- **Input:** 3 số thực trên 3 dòng.
- **Output:** 1 số thực duy nhất.
- **Ví dụ:**
\`\`\`text
Input:
9.0
7.0
8.0
Output:
7.9
\`\`\``,
    starterCode: `bt = float(input())
gk = float(input())
ck = float(input())
# Tính và in điểm tổng kết
`,
    solutionCode: `bt = float(input())
gk = float(input())
ck = float(input())
print(bt * 0.2 + gk * 0.3 + ck * 0.5)
`,
    testCases: [
      { input: "9.0\n7.0\n8.0\n", expectedOutput: "7.9\n", isHidden: false },
      { input: "10.0\n10.0\n10.0\n", expectedOutput: "10.0\n", isHidden: true },
      { input: "8.0\n8.0\n8.0\n", expectedOutput: "8.0\n", isHidden: true },
      { input: "5.0\n6.0\n7.0\n", expectedOutput: "6.3\n", isHidden: true }
    ]
  },

  // 29. Tính thời gian di chuyển
  {
    title: 'Tính thời gian di chuyển',
    difficulty: 'HARD',
    problemDescription: `### Bài 29: Tính thời gian di chuyển

- **Mô tả:** Nhận vào quãng đường \`khoang_cach_km\` (km) và vận tốc \`van_toc_km_h\` (km/h) trên 2 dòng (số thực). Tính và in ra thời gian di chuyển tính bằng: giờ nguyên, phút nguyên và giây nguyên (lấy phần nguyên).
- **Input:** 2 số thực trên 2 dòng.
- **Output:**
  - Dòng 1: Giờ
  - Dòng 2: Phút
  - Dòng 3: Giây
- **Ví dụ:**
\`\`\`text
Input:
100.0
40.0
Output:
2
30
0
\`\`\``,
    starterCode: `s = float(input())
v = float(input())
# Tính và in giờ, phút, giây
`,
    solutionCode: `s = float(input())
v = float(input())
tong_giay = int((s / v) * 3600)
gio = tong_giay // 3600
phut = (tong_giay % 3600) // 60
giay = tong_giay % 60
print(gio)
print(phut)
print(giay)
`,
    testCases: [
      { input: "100.0\n40.0\n", expectedOutput: "2\n30\n0\n", isHidden: false },
      { input: "120.0\n60.0\n", expectedOutput: "2\n0\n0\n", isHidden: true },
      { input: "15.0\n60.0\n", expectedOutput: "0\n15\n0\n", isHidden: true },
      { input: "75.0\n50.0\n", expectedOutput: "1\n30\n0\n", isHidden: true }
    ]
  },

  // 30. Chuyển đổi giây thành giờ, phút, giây
  {
    title: 'Chuyển đổi giây thành giờ, phút, giây',
    difficulty: 'HARD',
    problemDescription: `### Bài 30: Chuyển đổi giây thành giờ, phút, giây

- **Mô tả:** Nhận vào tổng số giây \`tong_so_giay\` (số nguyên không âm). Chuyển đổi và in ra số giờ, số phút và số giây còn lại trên 3 dòng riêng biệt.
- **Input:** Một số nguyên duy nhất.
- **Output:**
  - Dòng 1: Giờ
  - Dòng 2: Phút
  - Dòng 3: Giây
- **Ví dụ:**
\`\`\`text
Input:
3665
Output:
1
1
5
\`\`\``,
    starterCode: `tong_giay = int(input())
# Tính và in giờ, phút, giây
`,
    solutionCode: `tong_giay = int(input())
gio = tong_giay // 3600
phut = (tong_giay % 3600) // 60
giay = tong_giay % 60
print(gio)
print(phut)
print(giay)
`,
    testCases: [
      { input: "3665\n", expectedOutput: "1\n1\n5\n", isHidden: false },
      { input: "7200\n", expectedOutput: "2\n0\n0\n", isHidden: true },
      { input: "59\n", expectedOutput: "0\n0\n59\n", isHidden: true },
      { input: "86400\n", expectedOutput: "24\n0\n0\n", isHidden: true }
    ]
  },

  // Bài học lý thuyết: Chào hỏi người dùng (LS-01.09)
  {
    title: 'Chào hỏi người dùng',
    difficulty: 'EASY',
    problemDescription: `### Chào hỏi người dùng

- **Mô tả:** Viết chương trình nhận tên của người dùng từ bàn phím bằng hàm \`input()\`. In ra màn hình câu chào có dạng \`"Xin chào, [tên]!"\`.
- **Input:** Một dòng chứa chuỗi tên người dùng.
- **Output:** Câu chào theo đúng định dạng \`Xin chào, [tên]!\`.
- **Ví dụ:**
\`\`\`text
Input:
Nam
Output:
Xin chào, Nam!
\`\`\``,
    starterCode: `ten = input()
# In câu chào ra màn hình
`,
    solutionCode: `ten = input()
print(f"Xin chào, {ten}!")
`,
    testCases: [
      { input: "Nam\n", expectedOutput: "Xin chào, Nam!\n", isHidden: false },
      { input: "Minh Tuấn\n", expectedOutput: "Xin chào, Minh Tuấn!\n", isHidden: true },
      { input: "Alice\n", expectedOutput: "Xin chào, Alice!\n", isHidden: true }
    ]
  },

  // Bài học lý thuyết: Tính tuổi của người dùng (LS-01.10)
  {
    title: 'Tính tuổi của người dùng',
    difficulty: 'EASY',
    problemDescription: `### Tính tuổi của người dùng

- **Mô tả:** Viết chương trình nhận vào năm sinh của người dùng từ bàn phím (số nguyên). Lấy năm hiện tại là \`2026\`, tính và in ra số tuổi hiện tại của người dùng.
- **Input:** Một số nguyên là năm sinh.
- **Output:** Một số nguyên duy nhất là số tuổi.
- **Ví dụ:**
\`\`\`text
Input:
2000
Output:
26
\`\`\``,
    starterCode: `nam_sinh = int(input())
# Tính và in tuổi trong năm 2026
`,
    solutionCode: `nam_sinh = int(input())
print(2026 - nam_sinh)
`,
    testCases: [
      { input: "2000\n", expectedOutput: "26\n", isHidden: false },
      { input: "2005\n", expectedOutput: "21\n", isHidden: true },
      { input: "1995\n", expectedOutput: "31\n", isHidden: true },
      { input: "2020\n", expectedOutput: "6\n", isHidden: true }
    ]
  }
];

async function updateMod1() {
  console.log('🚀 Bắt đầu cập nhật các bài tập Module 1 vào CSDL và Seed file...');

  for (const item of mod1Exercises) {
    const ex = await prisma.codingExercise.findFirst({
      where: {
        title: { equals: item.title, mode: 'insensitive' },
        lesson: {
          chapter: {
            module: { moduleId: 'MOD-01' }
          }
        }
      }
    });

    if (!ex) {
      console.warn(`⚠️ Không tìm thấy bài tập: "${item.title}"`);
      continue;
    }

    console.log(`Đang cập nhật bài: "${item.title}" (ID: ${ex.id})...`);

    await prisma.codingExercise.update({
      where: { id: ex.id },
      data: {
        difficulty: item.difficulty,
        problemDescription: item.problemDescription,
        starterCode: item.starterCode,
        solutionCode: item.solutionCode
      }
    });

    await prisma.testCase.deleteMany({
      where: { exerciseId: ex.id }
    });

    for (const tc of item.testCases) {
      await prisma.testCase.create({
        data: {
          exerciseId: ex.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden
        }
      });
    }

    console.log(`  ✓ Xong (${item.testCases.length} TCs).`);
  }

  // Cập nhật seed_course_data.json
  const seedPath = path.join(__dirname, '../prisma/seed/seed_course_data.json');
  console.log(`\nĐang đồng bộ file seed: ${seedPath}...`);
  const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const mod1 = seed.find((m: any) => m.title.includes('Module 1'));

  if (mod1) {
    for (const chap of mod1.chapters) {
      for (const les of chap.lessons) {
        if (!les.codingExercises) continue;
        for (const item of mod1Exercises) {
          const sEx = les.codingExercises.find(
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

  fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf8');
  console.log('✓ Đã đồng bộ seed_course_data.json!');
  console.log('\n🎉 HOÀN TẤT CẬP NHẬT CÁC BÀI TẬP MODULE 1!');
}

updateMod1()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
