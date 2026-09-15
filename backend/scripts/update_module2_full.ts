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
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  problemDescription: string;
  starterCode: string;
  solutionCode: string;
  testCases: TestCaseDef[];
}

const exercises: ExerciseDef[] = [
  // 1. Định vị điểm trong hệ tọa độ 2D
  {
    title: 'Định vị điểm trong hệ tọa độ 2D',
    difficulty: 'HARD',
    problemDescription: `### Bài 4: Định vị điểm trong hệ tọa độ 2D

- **Mô tả:** Cho tọa độ một điểm $(x, y)$ và một hình tròn có tâm $(x_0, y_0)$ bán kính $R$ (mỗi số trên 1 dòng, số thực).
- **Yêu cầu:** Xác định vị trí điểm so với hình tròn và in ra:
  - Nếu khoảng cách từ tâm hình tròn tới điểm nhỏ hơn bán kính $R$, in "Nằm trong hình tròn".
  - Nếu bằng $R$, in "Nằm trên biên hình tròn".
  - Nếu lớn hơn $R$, in "Nằm ngoài hình tròn".
- **Input:** 5 số thực lần lượt là \`x\`, \`y\`, \`x0\`, \`y0\`, \`R\`.
- **Output:** 1 dòng thông báo vị trí.
- **Ví dụ:**
\`\`\`text
Input:
3.0
4.0
0.0
0.0
5.0
Output:
Nằm trên biên hình tròn
\`\`\``,
    starterCode: `x = float(input())
y = float(input())
x0 = float(input())
y0 = float(input())
R = float(input())
# Xác định vị trí điểm so với hình tròn
`,
    solutionCode: `x = float(input())
y = float(input())
x0 = float(input())
y0 = float(input())
R = float(input())
d2 = (x - x0)**2 + (y - y0)**2
R2 = R**2
if abs(d2 - R2) < 1e-7:
    print("Nằm trên biên hình tròn")
elif d2 < R2:
    print("Nằm trong hình tròn")
else:
    print("Nằm ngoài hình tròn")
`,
    testCases: [
      { input: "3\n4\n0\n0\n5\n", expectedOutput: "Nằm trên biên hình tròn\n", isHidden: false },
      { input: "2\n2\n0\n0\n5\n", expectedOutput: "Nằm trong hình tròn\n", isHidden: true },
      { input: "6\n0\n0\n0\n5\n", expectedOutput: "Nằm ngoài hình tròn\n", isHidden: true },
      { input: "0\n0\n0\n0\n3\n", expectedOutput: "Nằm trong hình tròn\n", isHidden: true }
    ]
  },

  // 2. Giải phương trình bậc hai
  {
    title: 'Giải phương trình bậc hai',
    difficulty: 'HARD',
    problemDescription: `### Bài 3: Giải phương trình bậc hai

- **Mô tả:** Cho 3 hệ số \`a\`, \`b\`, \`c\` của phương trình $ax^2 + bx + c = 0$ (mỗi số trên 1 dòng).
- **Yêu cầu:** Xác định số nghiệm của phương trình và in ra:
  - Nếu \`a == 0\`:
    - Nếu \`b == 0\` và \`c == 0\`: in "Vô số nghiệm".
    - Nếu \`b == 0\` và \`c != 0\`: in "Vô nghiệm".
    - Nếu \`b != 0\`: in "Có 1 nghiệm".
  - Nếu \`a != 0\`:
    - Tính delta = $b^2 - 4ac$.
    - Nếu delta < 0: in "Vô nghiệm".
    - Nếu delta == 0: in "Có nghiệm kép".
    - Nếu delta > 0: in "Có 2 nghiệm phân biệt".
- **Input:** 3 số thực trên 3 dòng.
- **Output:** Thông báo số nghiệm.
- **Ví dụ:**
\`\`\`text
Input:
1
-3
2
Output:
Có 2 nghiệm phân biệt
\`\`\``,
    starterCode: `a = float(input())
b = float(input())
c = float(input())
# Giải phương trình bậc hai
`,
    solutionCode: `a = float(input())
b = float(input())
c = float(input())
if a == 0:
    if b == 0:
        if c == 0:
            print("Vô số nghiệm")
        else:
            print("Vô nghiệm")
    else:
        print("Có 1 nghiệm")
else:
    delta = b**2 - 4*a*c
    if delta < 0:
        print("Vô nghiệm")
    elif delta == 0:
        print("Có nghiệm kép")
    else:
        print("Có 2 nghiệm phân biệt")
`,
    testCases: [
      { input: "1\n-3\n2\n", expectedOutput: "Có 2 nghiệm phân biệt\n", isHidden: false },
      { input: "1\n-2\n1\n", expectedOutput: "Có nghiệm kép\n", isHidden: true },
      { input: "1\n2\n5\n", expectedOutput: "Vô nghiệm\n", isHidden: true },
      { input: "0\n2\n-4\n", expectedOutput: "Có 1 nghiệm\n", isHidden: true }
    ]
  },

  // 3. Hệ Thống Đánh Giá Học Sinh Toàn Diện
  {
    title: 'Hệ Thống Đánh Giá Học Sinh Toàn Diện',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 2: Hệ Thống Đánh Giá Học Sinh Toàn Diện

- **Mô tả bài toán:** Cho điểm môn Toán \`diem_toan\` (float), điểm môn Văn \`diem_van\` (float), và số buổi học vắng \`so_buoi_vang\` (int) trên 3 dòng.
- **Quy tắc xếp loại:**
  - **Xuất sắc:** Trung bình cộng >= 9.0 VÀ vắng < 3.
  - **Giỏi:** Trung bình cộng >= 8.0 VÀ toan >= 6.5 VÀ van >= 6.5 VÀ vắng < 5.
  - **Khá:** Trung bình cộng >= 6.5 VÀ toan >= 5.0 VÀ van >= 5.0 VÀ vắng < 7.
  - **Trung bình:** (Trung bình cộng >= 5.0 HOẶC chỉ 1 môn dưới 5.0) VÀ vắng < 10.
  - **Yếu:** Các trường hợp còn lại.
- **Output:** In ra "Học sinh [Xếp loại]" (Ví dụ: "Học sinh Giỏi").
- **Ví dụ:**
\`\`\`text
Input:
9.5
9.0
2
Output:
Học sinh Xuất sắc
\`\`\``,
    starterCode: `toan = float(input())
van = float(input())
vang = int(input())
# Xếp loại học sinh
`,
    solutionCode: `toan = float(input())
van = float(input())
vang = int(input())
tb = (toan + van) / 2
if tb >= 9.0 and vang < 3:
    print("Học sinh Xuất sắc")
elif tb >= 8.0 and toan >= 6.5 and van >= 6.5 and vang < 5:
    print("Học sinh Giỏi")
elif tb >= 6.5 and toan >= 5.0 and van >= 5.0 and vang < 7:
    print("Học sinh Khá")
elif (tb >= 5.0 or (toan >= 5.0 or van >= 5.0)) and vang < 10 and not (toan < 5.0 and van < 5.0):
    print("Học sinh Trung bình")
else:
    print("Học sinh Yếu")
`,
    testCases: [
      { input: "9.5\n9.0\n2\n", expectedOutput: "Học sinh Xuất sắc\n", isHidden: false },
      { input: "8.5\n8.0\n4\n", expectedOutput: "Học sinh Giỏi\n", isHidden: true },
      { input: "7.0\n6.5\n6\n", expectedOutput: "Học sinh Khá\n", isHidden: true },
      { input: "3.0\n4.0\n12\n", expectedOutput: "Học sinh Yếu\n", isHidden: true }
    ]
  },

  // 4. Hệ Thống Giá Cước Taxi
  {
    title: 'Hệ Thống Giá Cước Taxi',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 3: Hệ Thống Giá Cước Taxi

- **Mô tả:** Nhận vào khoảng cách di chuyển \`khoang_cach\` (km, float) và thời điểm \`thoi_gian\` (chuỗi "ngay" hoặc "dem") trên 2 dòng.
- **Bảng giá:**
  - **Ban ngày ("ngay"):**
    - 1 km đầu tiên: 15.000 VND (đồng giá nếu <= 1km)
    - Từ km thứ 2 đến km thứ 10: 12.000 VND/km
    - Từ km thứ 11 trở đi: 10.000 VND/km
  - **Ban đêm ("dem"):**
    - 1 km đầu tiên: 18.000 VND (đồng giá nếu <= 1km)
    - Từ km thứ 2 đến km thứ 10: 15.000 VND/km
    - Từ km thứ 11 trở đi: 13.000 VND/km
- **Output:** In ra "Tổng tiền cước: [số_tiền] VND" (số tiền làm tròn 1 chữ số thập phân).
- **Ví dụ:**
\`\`\`text
Input:
0.5
ngay
Output:
Tổng tiền cước: 15000.0 VND
\`\`\``,
    starterCode: `d = float(input())
tg = input().strip()
# Tính cước taxi
`,
    solutionCode: `d = float(input())
tg = input().strip()
if tg == "ngay":
    if d <= 1.0:
        cuoc = 15000.0
    elif d <= 10.0:
        cuoc = 15000.0 + (d - 1.0) * 12000.0
    else:
        cuoc = 15000.0 + 9.0 * 12000.0 + (d - 10.0) * 10000.0
else:
    if d <= 1.0:
        cuoc = 18000.0
    elif d <= 10.0:
        cuoc = 18000.0 + (d - 1.0) * 15000.0
    else:
        cuoc = 18000.0 + 9.0 * 15000.0 + (d - 10.0) * 13000.0
print(f"Tổng tiền cước: {cuoc} VND")
`,
    testCases: [
      { input: "0.5\nngay\n", expectedOutput: "Tổng tiền cước: 15000.0 VND\n", isHidden: false },
      { input: "7.0\nngay\n", expectedOutput: "Tổng tiền cước: 87000.0 VND\n", isHidden: true },
      { input: "15.0\ndem\n", expectedOutput: "Tổng tiền cước: 218000.0 VND\n", isHidden: true },
      { input: "1.0\ndem\n", expectedOutput: "Tổng tiền cước: 18000.0 VND\n", isHidden: true }
    ]
  },

  // 5. Hệ thống phát hiện giao dịch bất thường (Gian lận)
  {
    title: 'Hệ thống phát hiện giao dịch bất thường (Gian lận)',
    difficulty: 'HARD',
    problemDescription: `### Bài 2: Hệ thống phát hiện giao dịch bất thường (Gian lận)

- **Mô tả:** Cho số tiền giao dịch \`so_tien\`, khoảng cách địa lý \`khoang_cach\` (km), và cờ thiết bị lạ \`thiet_bi_la\` ("True" hoặc "False") trên 3 dòng.
- **Quy tắc phân loại:**
  - **Rủi ro Cao:**
    - Số tiền >= 50.000.000 VÀ thiết bị lạ là \`True\`.
    - HOẶC khoảng cách > 500 km VÀ thiết bị lạ là \`True\`.
  - **Rủi ro Trung bình:**
    - Số tiền từ 10.000.000 đến dưới 50.000.000 VÀ thiết bị lạ là \`True\`.
    - HOẶC khoảng cách > 100 km (nhưng <= 500 km) VÀ thiết bị lạ là \`True\`.
    - HOẶC số tiền >= 100.000.000 (bất kể thiết bị).
  - **Giao dịch An toàn:** Các trường hợp còn lại.
- **Output:** In ra "Rủi ro Cao", "Rủi ro Trung bình", hoặc "Giao dịch An toàn".
- **Ví dụ:**
\`\`\`text
Input:
20000000
150
True
Output:
Rủi ro Trung bình
\`\`\``,
    starterCode: `so_tien = float(input())
khoang_cach = float(input())
thiet_bi_la = input().strip().lower() == "true"
# Đánh giá rủi ro giao dịch
`,
    solutionCode: `so_tien = float(input())
khoang_cach = float(input())
thiet_bi_la = input().strip().lower() == "true"
if (so_tien >= 50000000 and thiet_bi_la) or (khoang_cach > 500 and thiet_bi_la):
    print("Rủi ro Cao")
elif (10000000 <= so_tien < 50000000 and thiet_bi_la) or (100 < khoang_cach <= 500 and thiet_bi_la) or (so_tien >= 100000000):
    print("Rủi ro Trung bình")
else:
    print("Giao dịch An toàn")
`,
    testCases: [
      { input: "20000000\n150\nTrue\n", expectedOutput: "Rủi ro Trung bình\n", isHidden: false },
      { input: "60000000\n10\nTrue\n", expectedOutput: "Rủi ro Cao\n", isHidden: true },
      { input: "5000000\n10\nFalse\n", expectedOutput: "Giao dịch An toàn\n", isHidden: true },
      { input: "5000000\n600\nTrue\n", expectedOutput: "Rủi ro Cao\n", isHidden: true }
    ]
  },

  // 6. Kiểm tra ký tự đầu tiên của chuỗi
  {
    title: 'Kiểm tra ký tự đầu tiên của chuỗi',
    difficulty: 'EASY',
    problemDescription: `### Bài 7: Kiểm tra ký tự đầu tiên của chuỗi

- **Mô tả:** Nhận vào một chuỗi \`ten\` từ bàn phím. Kiểm tra ký tự đầu tiên của chuỗi đó.
- **Yêu cầu:**
  - Nếu ký tự đầu tiên là 'A' hoặc 'a', in ra "Tên bắt đầu bằng chữ A".
  - Ngược lại, in ra "Tên KHÔNG bắt đầu bằng chữ A".
- **Ví dụ:**
\`\`\`text
Input:
An
Output:
Tên bắt đầu bằng chữ A
\`\`\``,
    starterCode: `ten = input().strip()
# Kiểm tra ký tự đầu tiên
`,
    solutionCode: `ten = input().strip()
if ten and (ten[0] == 'A' or ten[0] == 'a'):
    print("Tên bắt đầu bằng chữ A")
else:
    print("Tên KHÔNG bắt đầu bằng chữ A")
`,
    testCases: [
      { input: "An\n", expectedOutput: "Tên bắt đầu bằng chữ A\n", isHidden: false },
      { input: "Alice\n", expectedOutput: "Tên bắt đầu bằng chữ A\n", isHidden: true },
      { input: "Binh\n", expectedOutput: "Tên KHÔNG bắt đầu bằng chữ A\n", isHidden: true },
      { input: "apple\n", expectedOutput: "Tên bắt đầu bằng chữ A\n", isHidden: true }
    ]
  },

  // 7. Kiểm tra số có 2 chữ số
  {
    title: 'Kiểm tra số có 2 chữ số',
    difficulty: 'EASY',
    problemDescription: `### Bài 5: Kiểm tra số có 2 chữ số

- **Mô tả:** Nhận vào một số nguyên \`so\`. Kiểm tra xem số đó có phải là số có hai chữ số hay không (từ 10 đến 99 hoặc từ -99 đến -10).
- **Yêu cầu:** In ra "Đây là số có hai chữ số" nếu đúng. Ngược lại, in ra "Đây KHÔNG phải là số có hai chữ số".
- **Ví dụ:**
\`\`\`text
Input:
25
Output:
Đây là số có hai chữ số
\`\`\``,
    starterCode: `so = int(input())
# Kiểm tra số có 2 chữ số
`,
    solutionCode: `so = int(input())
if (10 <= so <= 99) or (-99 <= so <= -10):
    print("Đây là số có hai chữ số")
else:
    print("Đây KHÔNG phải là số có hai chữ số")
`,
    testCases: [
      { input: "25\n", expectedOutput: "Đây là số có hai chữ số\n", isHidden: false },
      { input: "7\n", expectedOutput: "Đây KHÔNG phải là số có hai chữ số\n", isHidden: true },
      { input: "100\n", expectedOutput: "Đây KHÔNG phải là số có hai chữ số\n", isHidden: true },
      { input: "-55\n", expectedOutput: "Đây là số có hai chữ số\n", isHidden: true }
    ]
  },

  // 8. Kiểm Tra Tính Hợp Lệ Của Ngày (Tháng có 30, 31, 28/29 ngày)
  {
    title: 'Kiểm Tra Tính Hợp Lệ Của Ngày (Tháng có 30, 31, 28/29 ngày)',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 11: Kiểm Tra Tính Hợp Lệ Của Ngày

- **Mô tả:** Nhận vào số nguyên \`ngay\` và \`thang\` trên 2 dòng. Kiểm tra ngày đó có hợp lệ trong năm thường (tháng 2 luôn có 28 ngày) hay không.
- **Quy tắc:**
  - Tháng có 31 ngày: 1, 3, 5, 7, 8, 10, 12.
  - Tháng có 30 ngày: 4, 6, 9, 11.
  - Tháng 2: 28 ngày.
- **Output:** In ra "Ngày hợp lệ." hoặc "Ngày KHÔNG hợp lệ."
- **Ví dụ:**
\`\`\`text
Input:
31
1
Output:
Ngày hợp lệ.
\`\`\``,
    starterCode: `ngay = int(input())
thang = int(input())
# Kiểm tra ngày hợp lệ
`,
    solutionCode: `ngay = int(input())
thang = int(input())
if thang in [1, 3, 5, 7, 8, 10, 12]:
    max_d = 31
elif thang in [4, 6, 9, 11]:
    max_d = 30
elif thang == 2:
    max_d = 28
else:
    max_d = 0

if 1 <= thang <= 12 and 1 <= ngay <= max_d:
    print("Ngày hợp lệ.")
else:
    print("Ngày KHÔNG hợp lệ.")
`,
    testCases: [
      { input: "31\n1\n", expectedOutput: "Ngày hợp lệ.\n", isHidden: false },
      { input: "31\n4\n", expectedOutput: "Ngày KHÔNG hợp lệ.\n", isHidden: true },
      { input: "29\n2\n", expectedOutput: "Ngày KHÔNG hợp lệ.\n", isHidden: true },
      { input: "15\n10\n", expectedOutput: "Ngày hợp lệ.\n", isHidden: true }
    ]
  },

  // 9. Kiểm tra tính hợp lệ của tuổi và điểm
  {
    title: 'Kiểm tra tính hợp lệ của tuổi và điểm',
    difficulty: 'EASY',
    problemDescription: `### Bài 1: Kiểm tra tính hợp lệ của tuổi và điểm

- **Mô tả:** Nhận vào tuổi \`tuoi\` (int) và điểm số \`diem\` (float) trên 2 dòng.
- **Yêu cầu:** In ra "Đủ điều kiện tham gia" nếu **tuổi từ 18 trở lên VÀ điểm từ 70 trở lên**. Ngược lại, in ra "Không đủ điều kiện tham gia".
- **Ví dụ:**
\`\`\`text
Input:
25
90
Output:
Đủ điều kiện tham gia
\`\`\``,
    starterCode: `tuoi = int(input())
diem = float(input())
# Kiểm tra điều kiện tham gia
`,
    solutionCode: `tuoi = int(input())
diem = float(input())
if tuoi >= 18 and diem >= 70:
    print("Đủ điều kiện tham gia")
else:
    print("Không đủ điều kiện tham gia")
`,
    testCases: [
      { input: "25\n90\n", expectedOutput: "Đủ điều kiện tham gia\n", isHidden: false },
      { input: "17\n80\n", expectedOutput: "Không đủ điều kiện tham gia\n", isHidden: true },
      { input: "18\n65\n", expectedOutput: "Không đủ điều kiện tham gia\n", isHidden: true },
      { input: "18\n70\n", expectedOutput: "Đủ điều kiện tham gia\n", isHidden: true }
    ]
  },

  // 10. Kiểm tra trạng thái nước
  {
    title: 'Kiểm tra trạng thái nước',
    difficulty: 'EASY',
    problemDescription: `### Bài 10: Kiểm tra trạng thái nước

- **Mô tả:** Nhận vào nhiệt độ của nước \`nhiet_do_nuoc\` (số thực hoặc nguyên).
- **Yêu cầu:**
  - Nếu <= 0: in "Nước ở thể rắn (đóng băng)".
  - Nếu > 0 và < 100: in "Nước ở thể lỏng".
  - Nếu >= 100: in "Nước ở thể khí (hơi nước)".
- **Ví dụ:**
\`\`\`text
Input:
25
Output:
Nước ở thể lỏng
\`\`\``,
    starterCode: `t = float(input())
# Phân loại trạng thái nước
`,
    solutionCode: `t = float(input())
if t <= 0:
    print("Nước ở thể rắn (đóng băng)")
elif t < 100:
    print("Nước ở thể lỏng")
else:
    print("Nước ở thể khí (hơi nước)")
`,
    testCases: [
      { input: "25\n", expectedOutput: "Nước ở thể lỏng\n", isHidden: false },
      { input: "-5\n", expectedOutput: "Nước ở thể rắn (đóng băng)\n", isHidden: true },
      { input: "0\n", expectedOutput: "Nước ở thể rắn (đóng băng)\n", isHidden: true },
      { input: "100\n", expectedOutput: "Nước ở thể khí (hơi nước)\n", isHidden: true }
    ]
  },

  // 11. Kiểm Tra và Đánh Giá Mật Khẩu Đơn Giản
  {
    title: 'Kiểm Tra và Đánh Giá Mật Khẩu Đơn Giản',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 8: Kiểm Tra và Đánh Giá Mật Khẩu Đơn Giản

- **Mô tả:** Nhận vào một chuỗi \`mat_khau\`. Đánh giá độ mạnh của mật khẩu theo các tiêu chí:
  - **Rất mạnh:** Độ dài >= 10 VÀ có ít nhất 1 chữ hoa VÀ có ít nhất 1 chữ số.
  - **Mạnh:** Độ dài >= 7 VÀ (có ít nhất 1 chữ hoa HOẶC có ít nhất 1 chữ số).
  - **Trung bình:** Độ dài >= 6.
  - **Yếu:** Các trường hợp còn lại.
- **Output:** In ra "Mật khẩu [Độ mạnh]." (Ví dụ: "Mật khẩu Rất mạnh.").
- **Ví dụ:**
\`\`\`text
Input:
Password123
Output:
Mật khẩu Rất mạnh.
\`\`\``,
    starterCode: `mk = input().strip()
# Đánh giá độ mạnh mật khẩu
`,
    solutionCode: `mk = input().strip()
has_upper = any(c.isupper() for c in mk)
has_digit = any(c.isdigit() for c in mk)
if len(mk) >= 10 and has_upper and has_digit:
    print("Mật khẩu Rất mạnh.")
elif len(mk) >= 7 and (has_upper or has_digit):
    print("Mật khẩu Mạnh.")
elif len(mk) >= 6:
    print("Mật khẩu Trung bình.")
else:
    print("Mật khẩu Yếu.")
`,
    testCases: [
      { input: "Password123\n", expectedOutput: "Mật khẩu Rất mạnh.\n", isHidden: false },
      { input: "short\n", expectedOutput: "Mật khẩu Yếu.\n", isHidden: true },
      { input: "MyPass1\n", expectedOutput: "Mật khẩu Mạnh.\n", isHidden: true },
      { input: "simple\n", expectedOutput: "Mật khẩu Trung bình.\n", isHidden: true }
    ]
  },

  // 12. Mô Phỏng Điều Khiển Đèn Giao Thông Đơn Giản
  {
    title: 'Mô Phỏng Điều Khiển Đèn Giao Thông Đơn Giản',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 15: Mô Phỏng Điều Khiển Đèn Giao Thông Đơn Giản

- **Mô tả:** Nhận vào \`mau_den\` ("do", "vang", "xanh") và \`co_xe_uu_tien\` ("True" hoặc "False") trên 2 dòng.
- **Quy tắc ưu tiên:**
  1. Nếu \`co_xe_uu_tien\` là \`True\`: "Đèn ưu tiên: Xe ưu tiên được đi."
  2. Nếu \`mau_den\` là "do": "Dừng lại."
  3. Nếu \`mau_den\` là "vang": "Chuẩn bị dừng hoặc tăng tốc cẩn thận."
  4. Nếu \`mau_den\` là "xanh": "Được phép đi."
  5. Các trường hợp khác: "Trạng thái đèn không xác định."
- **Ví dụ:**
\`\`\`text
Input:
do
True
Output:
Đèn ưu tiên: Xe ưu tiên được đi.
\`\`\``,
    starterCode: `mau = input().strip()
uu_tien = input().strip().lower() == "true"
# Xử lý đèn giao thông
`,
    solutionCode: `mau = input().strip()
uu_tien = input().strip().lower() == "true"
if uu_tien:
    print("Đèn ưu tiên: Xe ưu tiên được đi.")
elif mau == "do":
    print("Dừng lại.")
elif mau == "vang":
    print("Chuẩn bị dừng hoặc tăng tốc cẩn thận.")
elif mau == "xanh":
    print("Được phép đi.")
else:
    print("Trạng thái đèn không xác định.")
`,
    testCases: [
      { input: "do\nTrue\n", expectedOutput: "Đèn ưu tiên: Xe ưu tiên được đi.\n", isHidden: false },
      { input: "xanh\nFalse\n", expectedOutput: "Được phép đi.\n", isHidden: true },
      { input: "do\nFalse\n", expectedOutput: "Dừng lại.\n", isHidden: true },
      { input: "vang\nFalse\n", expectedOutput: "Chuẩn bị dừng hoặc tăng tốc cẩn thận.\n", isHidden: true }
    ]
  },

  // 13. Phân loại điểm số chi tiết
  {
    title: 'Phân loại điểm số chi tiết',
    difficulty: 'EASY',
    problemDescription: `### Bài 9: Phân loại điểm số chi tiết

- **Mô tả:** Nhận vào điểm số \`diem\` (thang 100, float hoặc int).
- **Yêu cầu:**
  - Điểm >= 90: "Xuất sắc"
  - Điểm 80 - 89: "Giỏi"
  - Điểm 70 - 79: "Khá"
  - Điểm 50 - 69: "Trung bình"
  - Điểm < 50: "Yếu"
- **Ví dụ:**
\`\`\`text
Input:
82
Output:
Giỏi
\`\`\``,
    starterCode: `diem = float(input())
# Phân loại học lực
`,
    solutionCode: `diem = float(input())
if diem >= 90:
    print("Xuất sắc")
elif diem >= 80:
    print("Giỏi")
elif diem >= 70:
    print("Khá")
elif diem >= 50:
    print("Trung bình")
else:
    print("Yếu")
`,
    testCases: [
      { input: "82\n", expectedOutput: "Giỏi\n", isHidden: false },
      { input: "95\n", expectedOutput: "Xuất sắc\n", isHidden: true },
      { input: "70\n", expectedOutput: "Khá\n", isHidden: true },
      { input: "45\n", expectedOutput: "Yếu\n", isHidden: true }
    ]
  },

  // 14. Phân Loại Phản Hồi Khách Hàng
  {
    title: 'Phân Loại Phản Hồi Khách Hàng',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 12: Phân Loại Phản Hồi Khách Hàng

- **Mô tả:** Nhận vào điểm hài lòng \`diem_hai_long\` (1-5) và cờ từ ngữ tiêu cực \`co_tu_ngu_tieu_cuc\` ("True" hoặc "False") trên 2 dòng.
- **Phân loại:**
  - Điểm 5:
    - Nếu \`co_tu_ngu_tieu_cuc\` là \`True\`: "Phản hồi mâu thuẫn (Điểm cao nhưng có từ ngữ tiêu cực)."
    - Ngược lại: "Phản hồi Rất tích cực."
  - Điểm 4: "Phản hồi Tích cực."
  - Điểm 3: "Phản hồi Trung lập."
  - Điểm 1 hoặc 2:
    - Nếu \`co_tu_ngu_tieu_cuc\` là \`True\`: "Phản hồi Rất tiêu cực, có chi tiết."
    - Ngược lại: "Phản hồi Tiêu cực (không có chi tiết)."
- **Ví dụ:**
\`\`\`text
Input:
5
False
Output:
Phản hồi Rất tích cực.
\`\`\``,
    starterCode: `diem = int(input())
tieu_cuc = input().strip().lower() == "true"
# Phân loại phản hồi
`,
    solutionCode: `diem = int(input())
tieu_cuc = input().strip().lower() == "true"
if diem == 5:
    if tieu_cuc:
        print("Phản hồi mâu thuẫn (Điểm cao nhưng có từ ngữ tiêu cực).")
    else:
        print("Phản hồi Rất tích cực.")
elif diem == 4:
    print("Phản hồi Tích cực.")
elif diem == 3:
    print("Phản hồi Trung lập.")
elif diem in [1, 2]:
    if tieu_cuc:
        print("Phản hồi Rất tiêu cực, có chi tiết.")
    else:
        print("Phản hồi Tiêu cực (không có chi tiết).")
`,
    testCases: [
      { input: "5\nFalse\n", expectedOutput: "Phản hồi Rất tích cực.\n", isHidden: false },
      { input: "5\nTrue\n", expectedOutput: "Phản hồi mâu thuẫn (Điểm cao nhưng có từ ngữ tiêu cực).\n", isHidden: true },
      { input: "3\nFalse\n", expectedOutput: "Phản hồi Trung lập.\n", isHidden: true },
      { input: "1\nTrue\n", expectedOutput: "Phản hồi Rất tiêu cực, có chi tiết.\n", isHidden: true }
    ]
  },

  // 15. Phân Loại Thời Tiết và Hoạt Động Gợi Ý
  {
    title: 'Phân Loại Thời Tiết và Hoạt Động Gợi Ý',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 4: Phân Loại Thời Tiết và Hoạt Động Gợi Ý

- **Mô tả:** Nhận vào nhiệt độ \`nhiet_do\` (số thực, độ C) và trạng thái trời \`trang_thai\` ("nang", "nhieu may", "mua", "tuyet") trên 2 dòng.
- **Phân loại nhiệt độ:**
  - >= 30: "Nóng"
  - 20 đến 29: "Ấm áp"
  - 10 đến 19: "Mát mẻ"
  - 0 đến 9: "Lạnh"
  - < 0: "Rất lạnh"
- **Gợi ý hoạt động:**
  - Trời "nang" và (Nóng hoặc Ấm áp): "Thích hợp đi chơi ngoài trời!"
  - Trời "mua": "Nên ở trong nhà, đọc sách hoặc xem phim."
  - Trời "tuyet" và Rất lạnh: "Cẩn thận trượt ngã, mặc ấm và ở trong nhà."
  - Còn lại: "Hoạt động bình thường."
- **Output:** In theo mẫu: "Thời tiết: [Phân loại]. Gợi ý: [Gợi ý]"
- **Ví dụ:**
\`\`\`text
Input:
32
nang
Output:
Thời tiết: Nóng. Gợi ý: Thích hợp đi chơi ngoài trời!
\`\`\``,
    starterCode: `nhiet_do = float(input())
troi = input().strip()
# Gợi ý thời tiết
`,
    solutionCode: `nhiet_do = float(input())
troi = input().strip()
if nhiet_do >= 30:
    tt = "Nóng"
elif nhiet_do >= 20:
    tt = "Ấm áp"
elif nhiet_do >= 10:
    tt = "Mát mẻ"
elif nhiet_do >= 0:
    tt = "Lạnh"
else:
    tt = "Rất lạnh"

if troi == "nang" and (tt in ["Nóng", "Ấm áp"]):
    gy = "Thích hợp đi chơi ngoài trời!"
elif troi == "mua":
    gy = "Nên ở trong nhà, đọc sách hoặc xem phim."
elif troi == "tuyet" and tt == "Rất lạnh":
    gy = "Cẩn thận trượt ngã, mặc ấm và ở trong nhà."
else:
    gy = "Hoạt động bình thường."

print(f"Thời tiết: {tt}. Gợi ý: {gy}")
`,
    testCases: [
      { input: "32\nnang\n", expectedOutput: "Thời tiết: Nóng. Gợi ý: Thích hợp đi chơi ngoài trời!\n", isHidden: false },
      { input: "15\nmua\n", expectedOutput: "Thời tiết: Mát mẻ. Gợi ý: Nên ở trong nhà, đọc sách hoặc xem phim.\n", isHidden: true },
      { input: "-5\ntuyet\n", expectedOutput: "Thời tiết: Rất lạnh. Gợi ý: Cẩn thận trượt ngã, mặc ấm và ở trong nhà.\n", isHidden: true },
      { input: "22\nnhieu may\n", expectedOutput: "Thời tiết: Ấm áp. Gợi ý: Hoạt động bình thường.\n", isHidden: true }
    ]
  },

  // 16. Quyết Định Giảm Giá Đơn Hàng (Nâng Cao)
  {
    title: 'Quyết Định Giảm Giá Đơn Hàng (Nâng Cao)',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 6: Quyết Định Giảm Giá Đơn Hàng (Nâng Cao)

- **Mô tả:** Nhận vào tổng giá trị đơn hàng \`tong_tien\` (float), số lượng mặt hàng \`so_luong\` (int), và cờ thành viên \`la_thanh_vien\` ("True" hoặc "False") trên 3 dòng.
- **Chính sách giảm giá (ưu tiên từ trên xuống):**
  1. **Siêu giảm giá:** Nếu \`tong_tien\` >= 5.000.000 HOẶC (\`so_luong\` >= 20 VÀ \`la_thanh_vien\` là \`True\`): Giảm 20%. In: "Tổng tiền sau giảm giá 20%: [tiền] VND (Siêu giảm giá)"
  2. **Giảm giá đặc biệt:** Nếu \`tong_tien\` >= 2.000.000 HOẶC \`so_luong\` >= 10: Giảm 10%. In: "Tổng tiền sau giảm giá 10%: [tiền] VND (Giảm giá đặc biệt)"
  3. **Giảm giá thành viên:** Nếu \`la_thanh_vien\` là \`True\`: Giảm 5%. In: "Tổng tiền sau giảm giá 5%: [tiền] VND (Giảm giá cho thành viên)"
  4. **Không giảm giá:** In: "Không có giảm giá. Tổng tiền: [tiền] VND"
- **Ví dụ:**
\`\`\`text
Input:
2500000
8
False
Output:
Tổng tiền sau giảm giá 10%: 2250000.0 VND (Giảm giá đặc biệt)
\`\`\``,
    starterCode: `tong_tien = float(input())
so_luong = int(input())
thanh_vien = input().strip().lower() == "true"
# Tính giảm giá
`,
    solutionCode: `tong_tien = float(input())
so_luong = int(input())
thanh_vien = input().strip().lower() == "true"
if tong_tien >= 5000000 or (so_luong >= 20 and thanh_vien):
    sau_giam = tong_tien * 0.8
    print(f"Tổng tiền sau giảm giá 20%: {sau_giam} VND (Siêu giảm giá)")
elif tong_tien >= 2000000 or so_luong >= 10:
    sau_giam = tong_tien * 0.9
    print(f"Tổng tiền sau giảm giá 10%: {sau_giam} VND (Giảm giá đặc biệt)")
elif thanh_vien:
    sau_giam = tong_tien * 0.95
    print(f"Tổng tiền sau giảm giá 5%: {sau_giam} VND (Giảm giá cho thành viên)")
else:
    print(f"Không có giảm giá. Tổng tiền: {tong_tien} VND")
`,
    testCases: [
      { input: "2500000\n8\nFalse\n", expectedOutput: "Tổng tiền sau giảm giá 10%: 2250000.0 VND (Giảm giá đặc biệt)\n", isHidden: false },
      { input: "500000\n3\nTrue\n", expectedOutput: "Tổng tiền sau giảm giá 5%: 475000.0 VND (Giảm giá cho thành viên)\n", isHidden: true },
      { input: "100000\n2\nFalse\n", expectedOutput: "Không có giảm giá. Tổng tiền: 100000.0 VND\n", isHidden: true },
      { input: "6000000\n5\nFalse\n", expectedOutput: "Tổng tiền sau giảm giá 20%: 4800000.0 VND (Siêu giảm giá)\n", isHidden: true }
    ]
  },

  // 17. Quyết định mở/đóng cửa hàng theo giờ và ngày
  {
    title: 'Quyết định mở/đóng cửa hàng theo giờ và ngày',
    difficulty: 'EASY',
    problemDescription: `### Bài 3: Quyết định mở/đóng cửa hàng theo giờ và ngày

- **Mô tả:** Nhận vào giờ hiện tại \`gio_hien_tai\` (0-23) và cờ cuối tuần \`la_cuoi_tuan\` ("True" hoặc "False") trên 2 dòng.
- **Quy định:** Cửa hàng mở cửa từ 9h đến 18h các ngày trong tuần (không phải cuối tuần). Đóng cửa vào cuối tuần hoặc ngoài khung giờ 9h-18h.
- **Output:** In ra "Cửa hàng đang mở" hoặc "Cửa hàng đang đóng".
- **Ví dụ:**
\`\`\`text
Input:
12
False
Output:
Cửa hàng đang mở
\`\`\``,
    starterCode: `gio = int(input())
cuoi_tuan = input().strip().lower() == "true"
# Kiểm tra mở đóng cửa hàng
`,
    solutionCode: `gio = int(input())
cuoi_tuan = input().strip().lower() == "true"
if not cuoi_tuan and 9 <= gio <= 18:
    print("Cửa hàng đang mở")
else:
    print("Cửa hàng đang đóng")
`,
    testCases: [
      { input: "12\nFalse\n", expectedOutput: "Cửa hàng đang mở\n", isHidden: false },
      { input: "8\nFalse\n", expectedOutput: "Cửa hàng đang đóng\n", isHidden: true },
      { input: "19\nFalse\n", expectedOutput: "Cửa hàng đang đóng\n", isHidden: true },
      { input: "12\nTrue\n", expectedOutput: "Cửa hàng đang đóng\n", isHidden: true }
    ]
  },

  // 18. Quyết Định Tuyển Dụng Nhân Sự
  {
    title: 'Quyết Định Tuyển Dụng Nhân Sự',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 13: Quyết Định Tuyển Dụng Nhân Sự

- **Mô tả:** Nhận vào điểm phỏng vấn \`diem\` (0.0-10.0), số năm kinh nghiệm \`kinh_nghiem\` (int), và có bằng cấp liên quan \`co_bang\` ("True"/"False") trên 3 dòng.
- **Tiêu chí:**
  - **Tuyển thẳng:** Điểm >= 9.0 VÀ kinh nghiệm >= 5. -> "Ứng viên Tuyển thẳng (Điểm cao và kinh nghiệm)."
  - **Xem xét thêm:** Điểm >= 7.0 HOẶC (kinh nghiệm >= 3 VÀ \`co_bang\` là True). -> "Ứng viên Xem xét thêm (Điểm tốt)."
  - **Từ chối:** Điểm < 5.0. -> "Ứng viên Từ chối (Không đủ điều kiện cơ bản)."
  - **Phỏng vấn lại:** Các trường hợp còn lại. -> "Ứng viên Phỏng vấn lại."
- **Ví dụ:**
\`\`\`text
Input:
9.5
6
True
Output:
Ứng viên Tuyển thẳng (Điểm cao và kinh nghiệm).
\`\`\``,
    starterCode: `diem = float(input())
exp = int(input())
bang = input().strip().lower() == "true"
# Quyết định tuyển dụng
`,
    solutionCode: `diem = float(input())
exp = int(input())
bang = input().strip().lower() == "true"
if diem >= 9.0 and exp >= 5:
    print("Ứng viên Tuyển thẳng (Điểm cao và kinh nghiệm).")
elif diem < 5.0:
    print("Ứng viên Từ chối (Không đủ điều kiện cơ bản).")
elif diem >= 7.0 or (exp >= 3 and bang):
    print("Ứng viên Xem xét thêm (Điểm tốt).")
else:
    print("Ứng viên Phỏng vấn lại.")
`,
    testCases: [
      { input: "9.5\n6\nTrue\n", expectedOutput: "Ứng viên Tuyển thẳng (Điểm cao và kinh nghiệm).\n", isHidden: false },
      { input: "7.5\n2\nTrue\n", expectedOutput: "Ứng viên Xem xét thêm (Điểm tốt).\n", isHidden: true },
      { input: "6.0\n4\nFalse\n", expectedOutput: "Ứng viên Phỏng vấn lại.\n", isHidden: true },
      { input: "4.0\n1\nTrue\n", expectedOutput: "Ứng viên Từ chối (Không đủ điều kiện cơ bản).\n", isHidden: true }
    ]
  },

  // 19. Quyết định xem phim theo tuổi và thể loại
  {
    title: 'Quyết định xem phim theo tuổi và thể loại',
    difficulty: 'EASY',
    problemDescription: `### Bài 8: Quyết định xem phim theo tuổi và thể loại

- **Mô tả:** Nhận vào tuổi người xem \`tuoi\` (int) và thể loại phim \`the_loai\` (chuỗi: "kinh dị", "hành động", "hài hước") trên 2 dòng.
- **Quy định:**
  - "kinh dị": Tuổi >= 18
  - "hành động": Tuổi >= 13
  - "hài hước": Mọi lứa tuổi
- **Output:** In ra "Có thể xem phim" hoặc "Không thể xem phim".
- **Ví dụ:**
\`\`\`text
Input:
20
kinh dị
Output:
Có thể xem phim
\`\`\``,
    starterCode: `tuoi = int(input())
the_loai = input().strip()
# Kiểm tra tuổi xem phim
`,
    solutionCode: `tuoi = int(input())
the_loai = input().strip()
if the_loai == "kinh dị":
    if tuoi >= 18:
        print("Có thể xem phim")
    else:
        print("Không thể xem phim")
elif the_loai == "hành động":
    if tuoi >= 13:
        print("Có thể xem phim")
    else:
        print("Không thể xem phim")
elif the_loai == "hài hước":
    print("Có thể xem phim")
else:
    print("Không thể xem phim")
`,
    testCases: [
      { input: "20\nkinh dị\n", expectedOutput: "Có thể xem phim\n", isHidden: false },
      { input: "15\nkinh dị\n", expectedOutput: "Không thể xem phim\n", isHidden: true },
      { input: "12\nhành động\n", expectedOutput: "Không thể xem phim\n", isHidden: true },
      { input: "10\nhài hước\n", expectedOutput: "Có thể xem phim\n", isHidden: true }
    ]
  },

  // 20. Tính hóa đơn tiền điện luỹ tiến và thuế suất
  {
    title: 'Tính hóa đơn tiền điện luỹ tiến và thuế suất',
    difficulty: 'HARD',
    problemDescription: `### Bài 1: Tính hóa đơn tiền điện luỹ tiến và thuế suất

- **Mô tả:** Nhận vào số điện tiêu thụ \`kwh\` (int) và cờ kinh doanh \`la_kinh_doanh\` ("True" hoặc "False") trên 2 dòng.
- **Quy tắc:**
  - Nếu là hộ kinh doanh (\`True\`): Giá 3.000 VND / kWh, thuế VAT 10%.
  - Nếu là hộ gia đình (\`False\`):
    - 50 kWh đầu: 1.678 VND / kWh
    - kWh 51 đến 100: 1.734 VND / kWh
    - kWh 101 đến 200: 2.014 VND / kWh
    - Từ kWh 201 trở đi: 2.536 VND / kWh
    - Thuế VAT là 8%.
- **Output:** In ra tổng số tiền sau thuế (làm tròn 1 chữ số thập phân).
- **Ví dụ:**
\`\`\`text
Input:
120
False
Output:
227750.4
\`\`\``,
    starterCode: `kwh = int(input())
kinh_doanh = input().strip().lower() == "true"
# Tính tiền điện
`,
    solutionCode: `kwh = int(input())
kinh_doanh = input().strip().lower() == "true"
if kinh_doanh:
    tien = kwh * 3000 * 1.1
else:
    if kwh <= 50:
        tien_truoc = kwh * 1678
    elif kwh <= 100:
        tien_truoc = 50 * 1678 + (kwh - 50) * 1734
    elif kwh <= 200:
        tien_truoc = 50 * 1678 + 50 * 1734 + (kwh - 100) * 2014
    else:
        tien_truoc = 50 * 1678 + 50 * 1734 + 100 * 2014 + (kwh - 200) * 2536
    tien = tien_truoc * 1.08
print(round(tien, 1))
`,
    testCases: [
      { input: "120\nFalse\n", expectedOutput: "227750.4\n", isHidden: false },
      { input: "150\nTrue\n", expectedOutput: "495000.0\n", isHidden: true },
      { input: "40\nFalse\n", expectedOutput: "72489.6\n", isHidden: true },
      { input: "80\nFalse\n", expectedOutput: "146793.6\n", isHidden: true }
    ]
  },

  // 21. Xác định Điểm Đến của Người Dùng (Theo Thời gian và Sở thích)
  {
    title: 'Xác định Điểm Đến của Người Dùng (Theo Thời gian và Sở thích)',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 14: Xác định Điểm Đến của Người Dùng (Theo Thời gian và Sở thích)

- **Mô tả:** Nhận vào giờ hiện tại \`gio\` (0-23) và sở thích \`so_thich\` ("am thuc", "thien nhien", "mua sam", "khac") trên 2 dòng.
- **Gợi ý theo khung giờ:**
  - **Sáng (6h-11h):**
    - "thien nhien": "Gợi ý: Công viên hoặc hồ."
    - "am thuc": "Gợi ý: Quán ăn sáng hoặc cafe."
    - Còn lại: "Gợi ý: Khu vực trung tâm thành phố."
  - **Trưa/Chiều (12h-17h):**
    - "mua sam": "Gợi ý: Trung tâm thương mại."
    - "am thuc": "Gợi ý: Nhà hàng ăn trưa."
    - Còn lại: "Gợi ý: Bảo tàng hoặc phòng trưng bày."
  - **Tối (18h-23h):**
    - "am thuc": "Gợi ý: Quán ăn tối hoặc bar/pub."
    - Còn lại: "Gợi ý: Rạp chiếu phim hoặc nhà hát."
  - **Đêm khuya (0h-5h):** "Gợi ý: Hãy nghỉ ngơi, trời đã muộn rồi."
- **Ví dụ:**
\`\`\`text
Input:
8
thien nhien
Output:
Gợi ý: Công viên hoặc hồ.
\`\`\``,
    starterCode: `gio = int(input())
so_thich = input().strip()
# Gợi ý điểm đến
`,
    solutionCode: `gio = int(input())
so_thich = input().strip()
if 6 <= gio <= 11:
    if so_thich == "thien nhien":
        print("Gợi ý: Công viên hoặc hồ.")
    elif so_thich == "am thuc":
        print("Gợi ý: Quán ăn sáng hoặc cafe.")
    else:
        print("Gợi ý: Khu vực trung tâm thành phố.")
elif 12 <= gio <= 17:
    if so_thich == "mua sam":
        print("Gợi ý: Trung tâm thương mại.")
    elif so_thich == "am thuc":
        print("Gợi ý: Nhà hàng ăn trưa.")
    else:
        print("Gợi ý: Bảo tàng hoặc phòng trưng bày.")
elif 18 <= gio <= 23:
    if so_thich == "am thuc":
        print("Gợi ý: Quán ăn tối hoặc bar/pub.")
    else:
        print("Gợi ý: Rạp chiếu phim hoặc nhà hát.")
else:
    print("Gợi ý: Hãy nghỉ ngơi, trời đã muộn rồi.")
`,
    testCases: [
      { input: "8\nthien nhien\n", expectedOutput: "Gợi ý: Công viên hoặc hồ.\n", isHidden: false },
      { input: "14\nmua sam\n", expectedOutput: "Gợi ý: Trung tâm thương mại.\n", isHidden: true },
      { input: "20\nam thuc\n", expectedOutput: "Gợi ý: Quán ăn tối hoặc bar/pub.\n", isHidden: true },
      { input: "3\nkhac\n", expectedOutput: "Gợi ý: Hãy nghỉ ngơi, trời đã muộn rồi.\n", isHidden: true }
    ]
  },

  // 22. Xác định loại hình học (Tam giác cân/đều)
  {
    title: 'Xác định loại hình học (Tam giác cân/đều)',
    difficulty: 'EASY',
    problemDescription: `### Bài 6: Xác định loại hình học (Tam giác cân/đều)

- **Mô tả:** Nhận vào độ dài 3 cạnh \`a\`, \`b\`, \`c\` của một tam giác trên 3 dòng (số thực hoặc nguyên).
- **Yêu cầu:**
  - Nếu ba cạnh bằng nhau: in "Tam giác đều".
  - Nếu có ít nhất 2 cạnh bằng nhau: in "Tam giác cân".
  - Ngược lại: in "Tam giác thường".
- **Ví dụ:**
\`\`\`text
Input:
4
4
5
Output:
Tam giác cân
\`\`\``,
    starterCode: `a = float(input())
b = float(input())
c = float(input())
# Phân loại tam giác
`,
    solutionCode: `a = float(input())
b = float(input())
c = float(input())
if a == b == c:
    print("Tam giác đều")
elif a == b or b == c or a == c:
    print("Tam giác cân")
else:
    print("Tam giác thường")
`,
    testCases: [
      { input: "4\n4\n5\n", expectedOutput: "Tam giác cân\n", isHidden: false },
      { input: "3\n3\n3\n", expectedOutput: "Tam giác đều\n", isHidden: true },
      { input: "6\n8\n10\n", expectedOutput: "Tam giác thường\n", isHidden: true },
      { input: "5\n3\n5\n", expectedOutput: "Tam giác cân\n", isHidden: true }
    ]
  },

  // 23. Xác định Loại Năm (Năm Nhuận Nâng Cao)
  {
    title: 'Xác định Loại Năm (Năm Nhuận Nâng Cao)',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 1: Xác định Loại Năm (Năm Nhuận Nâng Cao)

- **Mô tả:** Nhận vào một số nguyên \`nam\`. Xác định đó là năm nhuận hay năm thường.
- **Điều kiện năm nhuận:** Chia hết cho 400 HOẶC (chia hết cho 4 nhưng không chia hết cho 100).
- **Output:** In ra "Năm nhuận" hoặc "Năm thường".
- **Ví dụ:**
\`\`\`text
Input:
2024
Output:
Năm nhuận
\`\`\``,
    starterCode: `nam = int(input())
# Kiểm tra năm nhuận
`,
    solutionCode: `nam = int(input())
if (nam % 400 == 0) or (nam % 4 == 0 and nam % 100 != 0):
    print("Năm nhuận")
else:
    print("Năm thường")
`,
    testCases: [
      { input: "2024\n", expectedOutput: "Năm nhuận\n", isHidden: false },
      { input: "2023\n", expectedOutput: "Năm thường\n", isHidden: true },
      { input: "2000\n", expectedOutput: "Năm nhuận\n", isHidden: true },
      { input: "2100\n", expectedOutput: "Năm thường\n", isHidden: true }
    ]
  },

  // 24. Xác định loại nhiệt độ
  {
    title: 'Xác định loại nhiệt độ',
    difficulty: 'EASY',
    problemDescription: `### Bài 4: Xác định loại nhiệt độ

- **Mô tả:** Nhận vào số nguyên nhiệt độ \`temp\` (độ C).
- **Phân loại:**
  - >= 30: in "Rất nóng"
  - 20 đến 29: in "Ấm áp"
  - 10 đến 19: in "Mát mẻ"
  - < 10: in "Lạnh"
- **Ví dụ:**
\`\`\`text
Input:
25
Output:
Ấm áp
\`\`\``,
    starterCode: `temp = int(input())
# Phân loại nhiệt độ
`,
    solutionCode: `temp = int(input())
if temp >= 30:
    print("Rất nóng")
elif temp >= 20:
    print("Ấm áp")
elif temp >= 10:
    print("Mát mẻ")
else:
    print("Lạnh")
`,
    testCases: [
      { input: "25\n", expectedOutput: "Ấm áp\n", isHidden: false },
      { input: "35\n", expectedOutput: "Rất nóng\n", isHidden: true },
      { input: "10\n", expectedOutput: "Mát mẻ\n", isHidden: true },
      { input: "5\n", expectedOutput: "Lạnh\n", isHidden: true }
    ]
  },

  // 25. Xác định loại số phức tạp
  {
    title: 'Xác định loại số phức tạp',
    difficulty: 'EASY',
    problemDescription: `### Bài 2: Xác định loại số phức tạp

- **Mô tả:** Nhận vào một số nguyên \`num\`.
- **Yêu cầu:**
  - Nếu > 0 và chẵn: in "Số dương chẵn"
  - Nếu > 0 và lẻ: in "Số dương lẻ"
  - Nếu < 0: in "Số âm"
  - Nếu = 0: in "Số 0"
- **Ví dụ:**
\`\`\`text
Input:
4
Output:
Số dương chẵn
\`\`\``,
    starterCode: `num = int(input())
# Phân loại số
`,
    solutionCode: `num = int(input())
if num > 0:
    if num % 2 == 0:
        print("Số dương chẵn")
    else:
        print("Số dương lẻ")
elif num < 0:
    print("Số âm")
else:
    print("Số 0")
`,
    testCases: [
      { input: "4\n", expectedOutput: "Số dương chẵn\n", isHidden: false },
      { input: "7\n", expectedOutput: "Số dương lẻ\n", isHidden: true },
      { input: "-3\n", expectedOutput: "Số âm\n", isHidden: true },
      { input: "0\n", expectedOutput: "Số 0\n", isHidden: true }
    ]
  },

  // 26. Xác định ngày hôm sau (Next Day)
  {
    title: 'Xác định ngày hôm sau (Next Day)',
    difficulty: 'HARD',
    problemDescription: `### Bài 5: Xác định ngày hôm sau (Next Day)

- **Mô tả:** Nhận vào \`ngay\`, \`thang\`, \`nam\` hợp lệ trên 3 dòng (số nguyên).
- **Yêu cầu:** Xác định ngày tiếp theo và in ra: "Ngày mai: [ngày]/[tháng]/[năm]".
  - Năm nhuận: chia hết cho 400 hoặc (chia hết cho 4 và không chia hết cho 100) -> tháng 2 có 29 ngày.
  - Năm thường: tháng 2 có 28 ngày.
  - Tháng 1, 3, 5, 7, 8, 10, 12 có 31 ngày.
  - Tháng 4, 6, 9, 11 có 30 ngày.
- **Ví dụ:**
\`\`\`text
Input:
31
12
2023
Output:
Ngày mai: 1/1/2024
\`\`\``,
    starterCode: `ngay = int(input())
thang = int(input())
nam = int(input())
# Tính ngày tiếp theo
`,
    solutionCode: `ngay = int(input())
thang = int(input())
nam = int(input())

is_leap = (nam % 400 == 0) or (nam % 4 == 0 and nam % 100 != 0)
if thang in [1, 3, 5, 7, 8, 10, 12]:
    max_d = 31
elif thang in [4, 6, 9, 11]:
    max_d = 30
else:
    max_d = 29 if is_leap else 28

if ngay < max_d:
    next_d = ngay + 1
    next_m = thang
    next_y = nam
else:
    next_d = 1
    if thang < 12:
        next_m = thang + 1
        next_y = nam
    else:
        next_m = 1
        next_y = nam + 1

print(f"Ngày mai: {next_d}/{next_m}/{next_y}")
`,
    testCases: [
      { input: "31\n12\n2023\n", expectedOutput: "Ngày mai: 1/1/2024\n", isHidden: false },
      { input: "28\n2\n2024\n", expectedOutput: "Ngày mai: 29/2/2024\n", isHidden: true },
      { input: "28\n2\n2023\n", expectedOutput: "Ngày mai: 1/3/2023\n", isHidden: true },
      { input: "30\n4\n2023\n", expectedOutput: "Ngày mai: 1/5/2023\n", isHidden: true }
    ]
  },

  // 27. Xác định Phân Loại Số Học (Dương/Âm, Chẵn/Lẻ, Chia hết cho 3/5)
  {
    title: 'Xác định Phân Loại Số Học (Dương/Âm, Chẵn/Lẻ, Chia hết cho 3/5)',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 7: Xác định Phân Loại Số Học (Dương/Âm, Chẵn/Lẻ, Chia hết cho 3/5)

- **Mô tả:** Nhận vào một số nguyên \`so_nguyen\`.
- **Phân loại (ưu tiên từ trên xuống):**
  - Nếu bằng 0: "Số 0."
  - Nếu là số dương:
    - Chia hết cho cả 3 và 5: "Số dương, chia hết cho 3 và 5."
    - Chỉ chia hết cho 3: "Số dương, chỉ chia hết cho 3."
    - Chỉ chia hết cho 5: "Số dương, chỉ chia hết cho 5."
    - Số chẵn: "Số dương chẵn."
    - Số lẻ: "Số dương lẻ."
  - Nếu là số âm:
    - Chẵn: "Số âm chẵn."
    - Lẻ: "Số âm lẻ."
- **Ví dụ:**
\`\`\`text
Input:
15
Output:
Số dương, chia hết cho 3 và 5.
\`\`\``,
    starterCode: `n = int(input())
# Phân loại số học
`,
    solutionCode: `n = int(input())
if n == 0:
    print("Số 0.")
elif n > 0:
    if n % 3 == 0 and n % 5 == 0:
        print("Số dương, chia hết cho 3 và 5.")
    elif n % 3 == 0:
        print("Số dương, chỉ chia hết cho 3.")
    elif n % 5 == 0:
        print("Số dương, chỉ chia hết cho 5.")
    elif n % 2 == 0:
        print("Số dương chẵn.")
    else:
        print("Số dương lẻ.")
else:
    if n % 2 == 0:
        print("Số âm chẵn.")
    else:
        print("Số âm lẻ.")
`,
    testCases: [
      { input: "15\n", expectedOutput: "Số dương, chia hết cho 3 và 5.\n", isHidden: false },
      { input: "0\n", expectedOutput: "Số 0.\n", isHidden: true },
      { input: "6\n", expectedOutput: "Số dương, chỉ chia hết cho 3.\n", isHidden: true },
      { input: "10\n", expectedOutput: "Số dương, chỉ chia hết cho 5.\n", isHidden: true },
      { input: "4\n", expectedOutput: "Số dương chẵn.\n", isHidden: true },
      { input: "-7\n", expectedOutput: "Số âm lẻ.\n", isHidden: true }
    ]
  },

  // 28. Xác định Phân Loại Thu Nhập và Thuế
  {
    title: 'Xác định Phân Loại Thu Nhập và Thuế',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 5: Xác định Phân Loại Thu Nhập và Thuế

- **Mô tả:** Nhận vào tổng thu nhập hàng năm \`thu_nhap\` (float hoặc int, đơn vị VND).
- **Phân loại và thuế suất:**
  - Dưới 100 triệu (< 100.000.000): "Thấp", thuế 5%.
  - Từ 100 triệu đến dưới 300 triệu: "Trung bình", thuế 10%.
  - Từ 300 triệu đến dưới 500 triệu: "Khá", thuế 15%.
  - Từ 500 triệu trở lên: "Cao", thuế 20%.
- **Output:** In ra 2 dòng:
  - Dòng 1: "Phân loại thu nhập: [Phân loại]"
  - Dòng 2: "Thuế phải đóng: [Số tiền thuế] VND"
- **Ví dụ:**
\`\`\`text
Input:
75000000
Output:
Phân loại thu nhập: Thấp
Thuế phải đóng: 3750000.0 VND
\`\`\``,
    starterCode: `thu_nhap = float(input())
# Tính thuế và phân loại thu nhập
`,
    solutionCode: `thu_nhap = float(input())
if thu_nhap < 100000000:
    phan_loai = "Thấp"
    thue = thu_nhap * 0.05
elif thu_nhap < 300000000:
    phan_loai = "Trung bình"
    thue = thu_nhap * 0.10
elif thu_nhap < 500000000:
    phan_loai = "Khá"
    thue = thu_nhap * 0.15
else:
    phan_loai = "Cao"
    thue = thu_nhap * 0.20

print(f"Phân loại thu nhập: {phan_loai}")
print(f"Thuế phải đóng: {thue} VND")
`,
    testCases: [
      { input: "75000000\n", expectedOutput: "Phân loại thu nhập: Thấp\nThuế phải đóng: 3750000.0 VND\n", isHidden: false },
      { input: "200000000\n", expectedOutput: "Phân loại thu nhập: Trung bình\nThuế phải đóng: 20000000.0 VND\n", isHidden: true },
      { input: "400000000\n", expectedOutput: "Phân loại thu nhập: Khá\nThuế phải đóng: 60000000.0 VND\n", isHidden: true },
      { input: "600000000\n", expectedOutput: "Phân loại thu nhập: Cao\nThuế phải đóng: 120000000.0 VND\n", isHidden: true }
    ]
  },

  // 29. Xếp Loại Điểm Chuẩn cho Nhập Học
  {
    title: 'Xếp Loại Điểm Chuẩn cho Nhập Học',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 10: Xếp Loại Điểm Chuẩn cho Nhập Học

- **Mô tả:** Nhận vào điểm phỏng vấn \`diem\` (float, 0.0 - 10.0) và số giải thưởng \`giai\` (int) trên 2 dòng.
- **Tiêu chuẩn:**
  - Điểm >= 9.0: "Được chấp nhận (Điểm cao)."
  - HOẶC (Điểm >= 8.0 VÀ giải >= 3): "Được chấp nhận (Điểm tốt và nhiều giải thưởng)."
  - HOẶC (Điểm >= 7.0 VÀ giải >= 5): "Được chấp nhận (Điểm vừa và nhiều giải thưởng)."
  - Bị từ chối (các trường hợp còn lại): "Bị từ chối (Chưa đủ điều kiện)."
- **Ví dụ:**
\`\`\`text
Input:
9.2
1
Output:
Được chấp nhận (Điểm cao).
\`\`\``,
    starterCode: `diem = float(input())
giai = int(input())
# Xét tuyển nhập học
`,
    solutionCode: `diem = float(input())
giai = int(input())
if diem >= 9.0:
    print("Được chấp nhận (Điểm cao).")
elif diem >= 8.0 and giai >= 3:
    print("Được chấp nhận (Điểm tốt và nhiều giải thưởng).")
elif diem >= 7.0 and giai >= 5:
    print("Được chấp nhận (Điểm vừa và nhiều giải thưởng).")
else:
    print("Bị từ chối (Chưa đủ điều kiện).")
`,
    testCases: [
      { input: "9.2\n1\n", expectedOutput: "Được chấp nhận (Điểm cao).\n", isHidden: false },
      { input: "8.5\n4\n", expectedOutput: "Được chấp nhận (Điểm tốt và nhiều giải thưởng).\n", isHidden: true },
      { input: "7.5\n2\n", expectedOutput: "Bị từ chối (Chưa đủ điều kiện).\n", isHidden: true },
      { input: "7.0\n5\n", expectedOutput: "Được chấp nhận (Điểm vừa và nhiều giải thưởng).\n", isHidden: true }
    ]
  },

  // 30. Xử Lý Đơn Hàng Online (Trạng thái và Thông báo)
  {
    title: 'Xử Lý Đơn Hàng Online (Trạng thái và Thông báo)',
    difficulty: 'MEDIUM',
    problemDescription: `### Bài 9: Xử Lý Đơn Hàng Online (Trạng thái và Thông báo)

- **Mô tả:** Nhận vào trạng thái đơn hàng \`trang_thai\` ("cho xu ly", "dang van chuyen", "da giao", "da huy") và cờ có vấn đề \`co_van_de\` ("True" hoặc "False") trên 2 dòng.
- **Quy tắc ưu tiên:**
  1. Nếu \`trang_thai\` là "da huy": "Đơn hàng của bạn đã bị hủy."
  2. Nếu \`co_van_de\` là \`True\`: "Đơn hàng của bạn có vấn đề. Vui lòng liên hệ hỗ trợ."
  3. Nếu \`trang_thai\` là "da giao": "Đơn hàng của bạn đã được giao thành công!"
  4. Nếu \`trang_thai\` là "dang van chuyen": "Đơn hàng của bạn đang trên đường vận chuyển."
  5. Nếu \`trang_thai\` là "cho xu ly": "Đơn hàng của bạn đang chờ xử lý."
  6. Khác: "Trạng thái đơn hàng không xác định."
- **Ví dụ:**
\`\`\`text
Input:
da giao
False
Output:
Đơn hàng của bạn đã được giao thành công!
\`\`\``,
    starterCode: `trang_thai = input().strip()
co_van_de = input().strip().lower() == "true"
# Thông báo đơn hàng
`,
    solutionCode: `trang_thai = input().strip()
co_van_de = input().strip().lower() == "true"
if trang_thai == "da huy":
    print("Đơn hàng của bạn đã bị hủy.")
elif co_van_de:
    print("Đơn hàng của bạn có vấn đề. Vui lòng liên hệ hỗ trợ.")
elif trang_thai == "da giao":
    print("Đơn hàng của bạn đã được giao thành công!")
elif trang_thai == "dang van chuyen":
    print("Đơn hàng của bạn đang trên đường vận chuyển.")
elif trang_thai == "cho xu ly":
    print("Đơn hàng của bạn đang chờ xử lý.")
else:
    print("Trạng thái đơn hàng không xác định.")
`,
    testCases: [
      { input: "da giao\nFalse\n", expectedOutput: "Đơn hàng của bạn đã được giao thành công!\n", isHidden: false },
      { input: "da huy\nFalse\n", expectedOutput: "Đơn hàng của bạn đã bị hủy.\n", isHidden: true },
      { input: "dang van chuyen\nTrue\n", expectedOutput: "Đơn hàng của bạn có vấn đề. Vui lòng liên hệ hỗ trợ.\n", isHidden: true },
      { input: "cho xu ly\nFalse\n", expectedOutput: "Đơn hàng của bạn đang chờ xử lý.\n", isHidden: true }
    ]
  }
];

async function updateModule2() {
  console.log('🚀 Bắt đầu cập nhật các bài tập Module 2 (LS-02.MP) vào CSDL và Seed file...');

  const lesson = await prisma.lesson.findFirst({
    where: { lessonId: 'LS-02.MP' },
    include: { codingExercises: true }
  });

  if (!lesson) {
    throw new Error('Lesson LS-02.MP not found');
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

    // 1. Xóa testcases cũ
    await prisma.testCase.deleteMany({
      where: { exerciseId: existing.id }
    });

    // 2. Cập nhật bài tập
    await prisma.codingExercise.update({
      where: { id: existing.id },
      data: {
        problemDescription: exDef.problemDescription,
        starterCode: exDef.starterCode,
        solutionCode: exDef.solutionCode,
        difficulty: exDef.difficulty,
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

  // 3. Đồng bộ vào file seed
  const seedPath = path.resolve(__dirname, '../prisma/seed/seed_course_data.json');
  console.log(`\nĐang đồng bộ file seed: ${seedPath}...`);
  const rawSeed = fs.readFileSync(seedPath, 'utf-8');
  const seedData = JSON.parse(rawSeed);

  const mod2 = seedData.modules?.find((m: any) => m.title?.includes('Module 2') || m.moduleId === 'MOD-02');
  if (mod2) {
    const seedLesson = mod2.lessons?.find((l: any) => l.lessonId === 'LS-02.MP' || l.title?.includes('tổng hợp Module 2'));
    if (seedLesson && seedLesson.codingExercises) {
      for (const exDef of exercises) {
        const seedEx = seedLesson.codingExercises.find(
          (e: any) => e.title?.trim().toLowerCase() === exDef.title.trim().toLowerCase()
        );
        if (seedEx) {
          seedEx.problemDescription = exDef.problemDescription;
          seedEx.starterCode = exDef.starterCode;
          seedEx.solutionCode = exDef.solutionCode;
          seedEx.difficulty = exDef.difficulty;
          seedEx.testCases = exDef.testCases;
        }
      }
      fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2), 'utf-8');
      console.log('✓ Đã đồng bộ seed_course_data.json!');
    }
  }

  console.log('\n🎉 HOÀN TẤT CẬP NHẬT CÁC BÀI TẬP MODULE 2!');
}

updateModule2()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
