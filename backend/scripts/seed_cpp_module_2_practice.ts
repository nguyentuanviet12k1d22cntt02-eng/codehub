import { prisma } from '../src/infrastructure/database/prisma';

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
    {
        title: "Kiểm tra Số Chẵn hay Lẻ (Toán tử 3 ngôi)",
        difficulty: "EASY",
        problemDescription: `Kiểm tra Số Chẵn hay Lẻ (Toán tử 3 ngôi)
* **Mục tiêu:** Áp dụng toán tử chia lấy dư \`%\` và biểu thức điều kiện 3 ngôi \`? :\` để xác định tính chẵn lẻ của một số nguyên.
* **Mô tả:** Nhập vào một số nguyên N từ bàn phím. Hãy in ra \`CHAN\` nếu N là số chẵn, hoặc in ra \`LE\` nếu N là số lẻ.
* **Ràng buộc:** Bắt buộc sử dụng toán tử 3 ngôi để chọn chuỗi kết quả.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (-10^9 <= N <= 10^9).
* **Đầu ra (Output):** In ra \`CHAN\` hoặc \`LE\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
8
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
CHAN
\`\`\`

**Giải thích chi tiết:**
* Số 8 chia hết cho 2 (8 % 2 == 0) nên là số chẵn.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      std::cout << ((n % 2 == 0) ? "CHAN" : "LE") << '\n';
      return 0;
  }
`,
        testCases: [
            {
                        "input": "8\n",
                        "expectedOutput": "CHAN\n",
                        "isHidden": false
            },
            {
                        "input": "15\n",
                        "expectedOutput": "LE\n",
                        "isHidden": false
            },
            {
                        "input": "-4\n",
                        "expectedOutput": "CHAN\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Tìm Số Lớn Nhất trong 2 số",
        difficulty: "EASY",
        problemDescription: `Tìm Số Lớn Nhất trong 2 số
* **Mục tiêu:** Sử dụng cấu trúc \`if-else if-else\` cơ bản để so sánh hai số nguyên.
* **Mô tả:** Nhập vào hai số nguyên a và b từ bàn phím. Hãy in ra số có giá trị lớn hơn. Nếu hai số bằng nhau, in ra dòng chữ \`BANG NHAU\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên a và b cách nhau một khoảng trắng (-10^9 <= a, b <= 10^9).
* **Đầu ra (Output):** Số lớn hơn hoặc chuỗi \`BANG NHAU\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
15 42
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
42
\`\`\`

**Giải thích chi tiết:**
* So sánh 15 và 42, ta thấy 42 > 15 nên in ra 42.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long a = 0, b = 0;
      std::cin >> a >> b;

      if (a > b) {
          std::cout << a << '\n';
      } else if (b > a) {
          std::cout << b << '\n';
      } else {
          std::cout << "BANG NHAU\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "15 42\n",
                        "expectedOutput": "42\n",
                        "isHidden": false
            },
            {
                        "input": "100 100\n",
                        "expectedOutput": "BANG NHAU\n",
                        "isHidden": false
            },
            {
                        "input": "-5 -10\n",
                        "expectedOutput": "-5\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Phân loại Số Dương, Âm hay Bằng Không",
        difficulty: "EASY",
        problemDescription: `Phân loại Số Dương, Âm hay Bằng Không
* **Mục tiêu:** Rèn luyện phản xạ xây dựng chuỗi điều kiện 3 nhánh hoàn chỉnh.
* **Mô tả:** Nhập vào một số nguyên N. Hãy in ra:
  * \`DUONG\` nếu N > 0.
  * \`AM\` nếu N < 0.
  * \`KHONG\` nếu N == 0.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (-10^9 <= N <= 10^9).
* **Đầu ra (Output):** Chuỗi ký tự tương ứng: \`DUONG\`, \`AM\` hoặc \`KHONG\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
-75
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
AM
\`\`\`

**Giải thích chi tiết:**
* Số -75 nhỏ hơn 0 nên in ra \`AM\`.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      if (n > 0) {
          std::cout << "DUONG\n";
      } else if (n < 0) {
          std::cout << "AM\n";
      } else {
          std::cout << "KHONG\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "-75\n",
                        "expectedOutput": "AM\n",
                        "isHidden": false
            },
            {
                        "input": "0\n",
                        "expectedOutput": "KHONG\n",
                        "isHidden": false
            },
            {
                        "input": "123\n",
                        "expectedOutput": "DUONG\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Kiểm tra Tuổi Bầu Cử (Kỹ thuật Early Return)",
        difficulty: "EASY",
        problemDescription: `Kiểm tra Tuổi Bầu Cử (Kỹ thuật Early Return)
* **Mục tiêu:** Áp dụng kỹ thuật Early Return để xử lý và kết thúc luồng chương trình nhanh chóng, giữ cấu trúc code mạch lạc.
* **Mô tả:** Nhập vào tuổi của một công dân. Theo quy định pháp luật:
  * Nếu tuổi hợp lệ và từ 18 tuổi trở lên, in: \`DU TUOI\`.
  * Nếu tuổi hợp lệ nhưng dưới 18 tuổi, in: \`CHUA DU TUOI\`.
  * Nếu tuổi < 0 hoặc tuổi > 150 (dữ liệu không hợp lý), in: \`KHONG HOP LE\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên Tuoi (-1000 <= Tuoi <= 1000).
* **Đầu ra (Output):** \`DU TUOI\`, \`CHUA DU TUOI\` hoặc \`KHONG HOP LE\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
19
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
DU TUOI
\`\`\`

**Giải thích chi tiết:**
* 19 nằm trong khoảng hợp lệ và >= 18 nên đủ tuổi tham gia bầu cử.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      int tuoi = 0;
      std::cin >> tuoi;

      if (tuoi < 0 || tuoi > 150) {
          std::cout << "KHONG HOP LE\n";
          return 0; // Early Return thoát sớm
      }

      if (tuoi >= 18) {
          std::cout << "DU TUOI\n";
      } else {
          std::cout << "CHUA DU TUOI\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "19\n",
                        "expectedOutput": "DU TUOI\n",
                        "isHidden": false
            },
            {
                        "input": "15\n",
                        "expectedOutput": "CHUA DU TUOI\n",
                        "isHidden": false
            },
            {
                        "input": "-5\n",
                        "expectedOutput": "KHONG HOP LE\n",
                        "isHidden": true
            },
            {
                        "input": "200\n",
                        "expectedOutput": "KHONG HOP LE\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Tra cứu Thứ trong Tuần (switch-case)",
        difficulty: "EASY",
        problemDescription: `Tra cứu Thứ trong Tuần (switch-case)
* **Mục tiêu:** Sử dụng cấu trúc rẽ nhánh \`switch-case\` với từ khóa \`break\` và nhánh \`default\` an toàn.
* **Mô tả:** Nhập vào một số nguyên từ 2 đến 8 đại diện cho ngày trong tuần. Hãy in ra tên thứ tương ứng bằng tiếng Việt không dấu:
  * 2: \`Thu Hai\`
  * 3: \`Thu Ba\`
  * 4: \`Thu Tu\`
  * 5: \`Thu Nam\`
  * 6: \`Thu Sau\`
  * 7: \`Thu Bay\`
  * 8: \`Chu Nhat\`
  * Các số còn lại: In \`KHONG HOP LE\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N.
* **Đầu ra (Output):** Tên thứ tương ứng hoặc \`KHONG HOP LE\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
8
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
Chu Nhat
\`\`\`

**Giải thích chi tiết:**
* Số 8 ứng với Chủ Nhật theo quy ước lịch Việt Nam.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      int n = 0;
      std::cin >> n;

      switch (n) {
          case 2: std::cout << "Thu Hai\n"; break;
          case 3: std::cout << "Thu Ba\n"; break;
          case 4: std::cout << "Thu Tu\n"; break;
          case 5: std::cout << "Thu Nam\n"; break;
          case 6: std::cout << "Thu Sau\n"; break;
          case 7: std::cout << "Thu Bay\n"; break;
          case 8: std::cout << "Chu Nhat\n"; break;
          default: std::cout << "KHONG HOP LE\n"; break;
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "8\n",
                        "expectedOutput": "Chu Nhat\n",
                        "isHidden": false
            },
            {
                        "input": "2\n",
                        "expectedOutput": "Thu Hai\n",
                        "isHidden": false
            },
            {
                        "input": "5\n",
                        "expectedOutput": "Thu Nam\n",
                        "isHidden": true
            },
            {
                        "input": "10\n",
                        "expectedOutput": "KHONG HOP LE\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Đánh giá Điểm Học Phần (if-else if)",
        difficulty: "EASY",
        problemDescription: `Đánh giá Điểm Học Phần (if-else if)
* **Mục tiêu:** Xếp loại học lực sinh viên dựa trên thang điểm 10 theo thứ tự điều kiện giảm dần.
* **Mô tả:** Nhập vào điểm tổng kết học phần D (số thực, 0 <= D <= 10). Phân loại theo quy định sau:
  * D >= 8.5: \`Xuat sac\`
  * 7.0 <= D < 8.5: \`Gioi\`
  * 5.5 <= D < 7.0: \`Kha\`
  * 4.0 <= D < 5.5: \`Trung binh\`
  * D < 4.0: \`Yeu\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số thực D (0 <= D <= 10).
* **Đầu ra (Output):** Chuỗi xếp loại học lực tương ứng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
7.8
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
Gioi
\`\`\`

**Giải thích chi tiết:**
* Điểm 7.8 thỏa mãn 7.0 <= D < 8.5 nên được xếp loại \`Gioi\`.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      double d = 0.0;
      std::cin >> d;

      if (d >= 8.5) {
          std::cout << "Xuat sac\n";
      } else if (d >= 7.0) {
          std::cout << "Gioi\n";
      } else if (d >= 5.5) {
          std::cout << "Kha\n";
      } else if (d >= 4.0) {
          std::cout << "Trung binh\n";
      } else {
          std::cout << "Yeu\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "7.8\n",
                        "expectedOutput": "Gioi\n",
                        "isHidden": false
            },
            {
                        "input": "9.2\n",
                        "expectedOutput": "Xuat sac\n",
                        "isHidden": false
            },
            {
                        "input": "6.0\n",
                        "expectedOutput": "Kha\n",
                        "isHidden": true
            },
            {
                        "input": "3.5\n",
                        "expectedOutput": "Yeu\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Kiểm tra Ký tự Chữ Hoa, Chữ Thường hay Chữ Số",
        difficulty: "EASY",
        problemDescription: `Kiểm tra Ký tự Chữ Hoa, Chữ Thường hay Chữ Số
* **Mục tiêu:** Vận dụng so sánh mã ký tự trong bảng mã ASCII kết hợp toán tử logic \`&&\`.
* **Mô tả:** Nhập vào một ký tự C bất kỳ từ bàn phím. Xác định ký tự đó thuộc nhóm nào:
  * Nếu C là chữ cái in hoa ('A' đến 'Z'): In \`HOA\`
  * Nếu C là chữ cái in thường ('a' đến 'z'): In \`THUONG\`
  * Nếu C là chữ số ('0' đến '9'): In \`SO\`
  * Ký tự khác: In \`KHAC\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một ký tự C.
* **Đầu ra (Output):** Chuỗi tương ứng (\`HOA\`, \`THUONG\`, \`SO\`, hoặc \`KHAC\`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
G
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
HOA
\`\`\`

**Giải thích chi tiết:**
* 'G' nằm trong khoảng 'A' đến 'Z' nên là chữ cái in hoa.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      char c = ' ';
      std::cin >> c;

      if (c >= 'A' && c <= 'Z') {
          std::cout << "HOA\n";
      } else if (c >= 'a' && c <= 'z') {
          std::cout << "THUONG\n";
      } else if (c >= '0' && c <= '9') {
          std::cout << "SO\n";
      } else {
          std::cout << "KHAC\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "G\n",
                        "expectedOutput": "HOA\n",
                        "isHidden": false
            },
            {
                        "input": "k\n",
                        "expectedOutput": "THUONG\n",
                        "isHidden": false
            },
            {
                        "input": "5\n",
                        "expectedOutput": "SO\n",
                        "isHidden": true
            },
            {
                        "input": "@\n",
                        "expectedOutput": "KHAC\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Máy tính Bỏ túi 4 Phép tính Cơ bản",
        difficulty: "EASY",
        problemDescription: `Máy tính Bỏ túi 4 Phép tính Cơ bản
* **Mục tiêu:** Sử dụng \`switch-case\` để phân nhánh thao tác toán học dựa trên ký tự toán tử và phòng ngừa lỗi chia cho 0.
* **Mô tả:** Nhập vào hai số nguyên a, b và một ký tự toán tử op (\`+\`, \`-\`, \`*\`, \`/\`). Hãy tính và in ra kết quả của phép tính \`a op b\`.
* Nếu op là \`/\` mà b == 0, in ra thông báo: \`Loi chia cho 0\`.
* Với phép chia \`/\`, kết quả lấy phần nguyên (chia nguyên).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Gồm số a, ký tự op và số b trên cùng một dòng cách nhau bởi dấu cách.
* **Đầu ra (Output):** Giá trị kết quả hoặc thông báo lỗi.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
20 / 4
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
5
\`\`\`

**Giải thích chi tiết:**
* 20 chia 4 được kết quả là 5.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long a = 0, b = 0;
      char op = ' ';
      std::cin >> a >> op >> b;

      switch (op) {
          case '+':
              std::cout << a + b << '\n';
              break;
          case '-':
              std::cout << a - b << '\n';
              break;
          case '*':
              std::cout << a * b << '\n';
              break;
          case '/':
              if (b == 0) {
                  std::cout << "Loi chia cho 0\n";
              } else {
                  std::cout << a / b << '\n';
              }
              break;
          default:
              std::cout << "Toan tu khong hop le\n";
              break;
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "20 / 4\n",
                        "expectedOutput": "5\n",
                        "isHidden": false
            },
            {
                        "input": "10 / 0\n",
                        "expectedOutput": "Loi chia cho 0\n",
                        "isHidden": false
            },
            {
                        "input": "7 * 8\n",
                        "expectedOutput": "56\n",
                        "isHidden": true
            },
            {
                        "input": "15 - 9\n",
                        "expectedOutput": "6\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Kiểm tra Bội số Đồng thời (Toán tử &&)",
        difficulty: "EASY",
        problemDescription: `Kiểm tra Bội số Đồng thời (Toán tử &&)
* **Mục tiêu:** Luyện tập sử dụng toán tử logic VÀ \`&&\` để kiểm tra nhiều điều kiện chia hết cùng lúc.
* **Mô tả:** Nhập vào số nguyên dương N. Kiểm tra xem N có đồng thời chia hết cho cả 3 VÀ 5 hay không.
* Nếu thỏa mãn, in ra \`YES\`. Ngược lại in ra \`NO\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^9).
* **Đầu ra (Output):** In ra \`YES\` hoặc \`NO\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
30
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
YES
\`\`\`

**Giải thích chi tiết:**
* 30 % 3 == 0 (đúng) và 30 % 5 == 0 (đúng) -> Cả hai điều kiện đều đúng nên in \`YES\`.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      if (n % 3 == 0 && n % 5 == 0) {
          std::cout << "YES\n";
      } else {
          std::cout << "NO\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "30\n",
                        "expectedOutput": "YES\n",
                        "isHidden": false
            },
            {
                        "input": "15\n",
                        "expectedOutput": "NO\n",
                        "isHidden": false
            },
            {
                        "input": "90\n",
                        "expectedOutput": "YES\n",
                        "isHidden": true
            },
            {
                        "input": "7\n",
                        "expectedOutput": "NO\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Trị tuyệt đối không dùng thư viện cmath (Toán tử 3 ngôi)",
        difficulty: "EASY",
        problemDescription: `Trị tuyệt đối không dùng thư viện cmath (Toán tử 3 ngôi)
* **Mục tiêu:** Tự cài đặt hàm trị tuyệt đối dựa trên định nghĩa toán học thuần túy bằng toán tử 3 ngôi.
* **Mô tả:** Nhập vào một số nguyên N bất kỳ. Hãy in ra giá trị tuyệt đối |N| của số đó mà không dùng hàm \`abs()\` hay \`std::abs()\` của thư viện \`<cmath>\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (-10^9 <= N <= 10^9).
* **Đầu ra (Output):** Giá trị tuyệt đối của N.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
-987654
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
987654
\`\`\`

**Giải thích chi tiết:**
* Vì N < 0 nên |N| = -N = -(-987654) = 987654.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long n = 0;
      std::cin >> n;

      long long triTuyetDoi = (n >= 0) ? n : -n;

      std::cout << triTuyetDoi << '\n';
      return 0;
  }
`,
        testCases: [
            {
                        "input": "-987654\n",
                        "expectedOutput": "987654\n",
                        "isHidden": false
            },
            {
                        "input": "12345\n",
                        "expectedOutput": "12345\n",
                        "isHidden": false
            },
            {
                        "input": "0\n",
                        "expectedOutput": "0\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Tìm Số Lớn Nhất và Nhỏ Nhất trong 3 số",
        difficulty: "MEDIUM",
        problemDescription: `Tìm Số Lớn Nhất và Nhỏ Nhất trong 3 số
* **Mục tiêu:** Rèn luyện kỹ năng lồng ghép điều kiện hoặc dùng biến gán cực trị để tìm Max và Min trong 3 số.
* **Mô tả:** Nhập vào 3 số nguyên a, b, c từ bàn phím. Hãy tìm và in ra giá trị nhỏ nhất (Min) và giá trị lớn nhất (Max) trong 3 số đó, cách nhau bởi một dấu cách.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên a, b, c (-10^9 <= a, b, c <= 10^9).
* **Đầu ra (Output):** Hai số nguyên tương ứng là Min và Max, cách nhau một khoảng trắng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
14 -5 29
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
-5 29
\`\`\`

**Giải thích chi tiết:**
* Trong 3 số 14, -5, 29 thì -5 là số nhỏ nhất, 29 là số lớn nhất.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long a = 0, b = 0, c = 0;
      std::cin >> a >> b >> c;

      long long minVal = a;
      if (b < minVal) minVal = b;
      if (c < minVal) minVal = c;

      long long maxVal = a;
      if (b > maxVal) maxVal = b;
      if (c > maxVal) maxVal = c;

      std::cout << minVal << " " << maxVal << '\n';
      return 0;
  }
`,
        testCases: [
            {
                        "input": "14 -5 29\n",
                        "expectedOutput": "-5 29\n",
                        "isHidden": false
            },
            {
                        "input": "10 10 10\n",
                        "expectedOutput": "10 10\n",
                        "isHidden": false
            },
            {
                        "input": "-1 -2 -3\n",
                        "expectedOutput": "-3 -1\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Kiểm tra Điều kiện Tam giác và Phân loại",
        difficulty: "MEDIUM",
        problemDescription: `Kiểm tra Điều kiện Tam giác và Phân loại
* **Mục tiêu:** Vận dụng bất đẳng thức tam giác và định lý Pytago để phân loại tam giác.
* **Mô tả:** Nhập vào 3 số nguyên dương a, b, c đại diện cho độ dài 3 cạnh.
  1. Kiểm tra 3 cạnh có tạo thành tam giác hợp lệ hay không (tổng 2 cạnh bất kỳ phải lớn hơn cạnh còn lại: a + b > c && a + c > b && b + c > a).
  2. Nếu không tạo thành tam giác, in ra: \`Khong phai tam giac\`.
  3. Nếu tạo thành tam giác, phân loại theo thứ tự ưu tiên:
     * Tam giác đều (a == b && b == c): in \`Deu\`
     * Tam giác vuông (thỏa mãn định lý Pytago a^2 + b^2 == c^2 hoặc b^2 + c^2 == a^2 hoặc a^2 + c^2 == b^2): in \`Vuong\`
     * Tam giác cân (có ít nhất 2 cạnh bằng nhau): in \`Can\`
     * Tam giác thường: in \`Thuong\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên dương a, b, c (1 <= a, b, c <= 10^4).
* **Đầu ra (Output):** Chuỗi phân loại tam giác tương ứng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
3 4 5
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
Vuong
\`\`\`

**Giải thích chi tiết:**
* 3 + 4 > 5, 3 + 5 > 4, 4 + 5 > 3 -> Tạo thành tam giác.
* 3^2 + 4^2 = 9 + 16 = 25 = 5^2 -> Thỏa mãn Pytago nên là tam giác vuông.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long a = 0, b = 0, c = 0;
      std::cin >> a >> b >> c;

      // 1. Kiểm tra điều kiện tam giác
      if (a + b <= c || a + c <= b || b + c <= a) {
          std::cout << "Khong phai tam giac\n";
          return 0;
      }

      // 2. Phân loại theo thứ tự ưu tiên
      if (a == b && b == c) {
          std::cout << "Deu\n";
      } else if (a * a + b * b == c * c || a * a + c * c == b * b || b * b + c * c == a * a) {
          std::cout << "Vuong\n";
      } else if (a == b || b == c || a == c) {
          std::cout << "Can\n";
      } else {
          std::cout << "Thuong\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "3 4 5\n",
                        "expectedOutput": "Vuong\n",
                        "isHidden": false
            },
            {
                        "input": "5 5 5\n",
                        "expectedOutput": "Deu\n",
                        "isHidden": false
            },
            {
                        "input": "5 5 8\n",
                        "expectedOutput": "Can\n",
                        "isHidden": true
            },
            {
                        "input": "1 2 5\n",
                        "expectedOutput": "Khong phai tam giac\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Xác định Quý trong Năm (switch gộp case)",
        difficulty: "MEDIUM",
        problemDescription: `Xác định Quý trong Năm (switch gộp case)
* **Mục tiêu:** Áp dụng kỹ thuật gộp nhiều case liên tiếp trong \`switch-case\` (tận dụng Fall-through có chủ đích).
* **Mô tả:** Nhập vào tháng M trong năm (1 <= M <= 12). Hãy in ra quý tương ứng:
  * Tháng 1, 2, 3: in \`Quy 1\`
  * Tháng 4, 5, 6: in \`Quy 2\`
  * Tháng 7, 8, 9: in \`Quy 3\`
  * Tháng 10, 11, 12: in \`Quy 4\`
  * Nếu tháng không hợp lệ (ngoài khoảng 1-12): in \`Loi\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên M.
* **Đầu ra (Output):** Chuỗi quý tương ứng hoặc \`Loi\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
8
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
Quy 3
\`\`\`

**Giải thích chi tiết:**
* Tháng 8 thuộc Quý 3 (gồm tháng 7, 8, 9).`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      int m = 0;
      std::cin >> m;

      switch (m) {
          case 1:
          case 2:
          case 3:
              std::cout << "Quy 1\n";
              break;
          case 4:
          case 5:
          case 6:
              std::cout << "Quy 2\n";
              break;
          case 7:
          case 8:
          case 9:
              std::cout << "Quy 3\n";
              break;
          case 10:
          case 11:
          case 12:
              std::cout << "Quy 4\n";
              break;
          default:
              std::cout << "Loi\n";
              break;
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "8\n",
                        "expectedOutput": "Quy 3\n",
                        "isHidden": false
            },
            {
                        "input": "2\n",
                        "expectedOutput": "Quy 1\n",
                        "isHidden": false
            },
            {
                        "input": "11\n",
                        "expectedOutput": "Quy 4\n",
                        "isHidden": true
            },
            {
                        "input": "15\n",
                        "expectedOutput": "Loi\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Tính Tiền Điện Bậc Thang Sinh Hoạt",
        difficulty: "MEDIUM",
        problemDescription: `Tính Tiền Điện Bậc Thang Sinh Hoạt
* **Mục tiêu:** Rèn luyện tư duy tính toán theo khoảng giá bậc thang bằng các khối lệnh rẽ nhánh không lặp.
* **Mô tả:** Biểu giá điện sinh hoạt được tính lũy tiến theo các bậc như sau:
  * Bậc 1: Cho 50 kWh đầu tiên, giá 1,678 đồng/kWh.
  * Bậc 2: Từ kWh thứ 51 đến 100, giá 1,734 đồng/kWh.
  * Bậc 3: Từ kWh thứ 101 trở lên, giá 2,014 đồng/kWh.
  Nhập vào số kWh điện tiêu thụ (số nguyên K >= 0). Hãy tính tổng tiền điện phải trả (đồng).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên K (0 <= K <= 10^6).
* **Đầu ra (Output):** Một số nguyên là tổng số tiền điện phải trả.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
75
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
127250
\`\`\`

**Giải thích chi tiết:**
* Tiêu thụ 75 kWh:
  * 50 kWh đầu: 50 * 1678 = 83,900 đồng.
  * 25 kWh tiếp theo (ở Bậc 2): 25 * 1734 = 43,350 đồng.
  * Tổng tiền = 83,900 + 43,350 = 127,250 đồng.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long k = 0;
      std::cin >> k;

      long long tongTien = 0;

      if (k <= 50) {
          tongTien = k * 1678;
      } else if (k <= 100) {
          tongTien = 50 * 1678 + (k - 50) * 1734;
      } else {
          tongTien = 50 * 1678 + 50 * 1734 + (k - 100) * 2014;
      }

      std::cout << tongTien << '\n';
      return 0;
  }
`,
        testCases: [
            {
                        "input": "75\n",
                        "expectedOutput": "127250\n",
                        "isHidden": false
            },
            {
                        "input": "40\n",
                        "expectedOutput": "67120\n",
                        "isHidden": false
            },
            {
                        "input": "150\n",
                        "expectedOutput": "271300\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Kiểm tra Điểm thuộc Góc Phần Tư Tọa độ Oxy",
        difficulty: "MEDIUM",
        problemDescription: `Kiểm tra Điểm thuộc Góc Phần Tư Tọa độ Oxy
* **Mục tiêu:** Kết hợp dấu của tọa độ x, y để xác định vị trí của một điểm trên mặt phẳng tọa độ Decartes.
* **Mô tả:** Nhập vào tọa độ (x, y) của điểm M (với x, y là số thực khác 0). Xác định điểm M nằm ở góc phần tư nào:
  * Góc I: x > 0 và y > 0
  * Góc II: x < 0 và y > 0
  * Góc III: x < 0 và y < 0
  * Góc IV: x > 0 và y < 0

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số thực x và y cách nhau một khoảng trắng.
* **Đầu ra (Output):** In ra \`Goc I\`, \`Goc II\`, \`Goc III\` hoặc \`Goc IV\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
-4.5 8.2
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
Goc II
\`\`\`

**Giải thích chi tiết:**
* Điểm có hoành độ x = -4.5 < 0 và tung độ y = 8.2 > 0 thuộc góc phần tư thứ II.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      double x = 0.0, y = 0.0;
      std::cin >> x >> y;

      if (x > 0 && y > 0) {
          std::cout << "Goc I\n";
      } else if (x < 0 && y > 0) {
          std::cout << "Goc II\n";
      } else if (x < 0 && y < 0) {
          std::cout << "Goc III\n";
      } else if (x > 0 && y < 0) {
          std::cout << "Goc IV\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "-4.5 8.2\n",
                        "expectedOutput": "Goc II\n",
                        "isHidden": false
            },
            {
                        "input": "3.0 4.0\n",
                        "expectedOutput": "Goc I\n",
                        "isHidden": false
            },
            {
                        "input": "-1.0 -2.0\n",
                        "expectedOutput": "Goc III\n",
                        "isHidden": true
            },
            {
                        "input": "5.0 -6.0\n",
                        "expectedOutput": "Goc IV\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Kiểm tra Năm Nhuận (Leap Year)",
        difficulty: "MEDIUM",
        problemDescription: `Kiểm tra Năm Nhuận (Leap Year)
* **Mục tiêu:** Nắm vững quy tắc thiên văn lịch Gregory về năm nhuận bằng toán tử logic kết hợp \`&&\` và \`||\`.
* **Mô tả:** Năm Y (số nguyên dương) là năm nhuận nếu:
  * Năm đó chia hết cho 400, HOẶC
  * Năm đó chia hết cho 4 nhưng KHÔNG chia hết cho 100.
  Ngược lại là năm thường.
  Hãy nhập năm Y và in ra \`NAM NHUAN\` hoặc \`NAM THUONG\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên dương Y (1 <= Y <= 10^5).
* **Đầu ra (Output):** \`NAM NHUAN\` hoặc \`NAM THUONG\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
2000
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
NAM NHUAN
\`\`\`

**Giải thích chi tiết:**
* 2000 chia hết cho 400 nên là năm nhuận thế kỷ.
* Trong khi đó năm 1900 chia hết cho 100 nhưng không chia hết cho 400 nên là năm thường.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      int y = 0;
      std::cin >> y;

      if ((y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)) {
          std::cout << "NAM NHUAN\n";
      } else {
          std::cout << "NAM THUONG\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "2000\n",
                        "expectedOutput": "NAM NHUAN\n",
                        "isHidden": false
            },
            {
                        "input": "1900\n",
                        "expectedOutput": "NAM THUONG\n",
                        "isHidden": false
            },
            {
                        "input": "2024\n",
                        "expectedOutput": "NAM NHUAN\n",
                        "isHidden": true
            },
            {
                        "input": "2023\n",
                        "expectedOutput": "NAM THUONG\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Tính Số Ngày trong Tháng của Năm Bất Kỳ",
        difficulty: "MEDIUM",
        problemDescription: `Tính Số Ngày trong Tháng của Năm Bất Kỳ
* **Mục tiêu:** Kết hợp thuật toán năm nhuận với cấu trúc \`switch-case\` để xác định chính xác số ngày của một tháng.
* **Mô tả:** Nhập vào tháng M (1 <= M <= 12) và năm Y (1 <= Y <= 10^5). Hãy in ra số ngày của tháng đó.
  * Các tháng có 31 ngày: 1, 3, 5, 7, 8, 10, 12.
  * Các tháng có 30 ngày: 4, 6, 9, 11.
  * Tháng 2: Nếu là năm nhuận có 29 ngày; nếu năm thường có 28 ngày.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số nguyên M và Y cách nhau bởi dấu cách.
* **Đầu ra (Output):** Một số nguyên là số ngày của tháng M trong năm Y.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
2 2024
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
29
\`\`\`

**Giải thích chi tiết:**
* Năm 2024 là năm nhuận (chia hết cho 4 và không chia hết cho 100), do đó tháng 2 có 29 ngày.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      int m = 0, y = 0;
      std::cin >> m >> y;

      switch (m) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
              std::cout << 31 << '\n';
              break;
          case 4:
          case 6:
          case 9:
          case 11:
              std::cout << 30 << '\n';
              break;
          case 2: {
              bool laNamNhuan = (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);
              std::cout << (laNamNhuan ? 29 : 28) << '\n';
              break;
          }
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "2 2024\n",
                        "expectedOutput": "29\n",
                        "isHidden": false
            },
            {
                        "input": "2 2023\n",
                        "expectedOutput": "28\n",
                        "isHidden": false
            },
            {
                        "input": "4 2025\n",
                        "expectedOutput": "30\n",
                        "isHidden": true
            },
            {
                        "input": "12 2025\n",
                        "expectedOutput": "31\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Giải và Biện luận Phương trình Bậc Nhất ax + b = 0",
        difficulty: "MEDIUM",
        problemDescription: `Giải và Biện luận Phương trình Bậc Nhất ax + b = 0
* **Mục tiêu:** Rèn luyện tư duy toán học logic biện luận đầy đủ mọi trường hợp của hệ số a và b.
* **Mô tả:** Nhập vào hai hệ số thực a và b của phương trình bậc nhất \`ax + b = 0\`. Biện luận nghiệm:
  * Nếu a == 0 và b == 0: in \`Vo so nghiem\`
  * Nếu a == 0 và b != 0: in \`Vo nghiem\`
  * Nếu a != 0: Phương trình có nghiệm duy nhất \`x = -b / a\`. In kết quả làm tròn đúng 2 chữ số sau dấu phẩy.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai số thực a và b.
* **Đầu ra (Output):** Chuỗi biện luận hoặc giá trị nghiệm duy nhất.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
2 -5
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
2.50
\`\`\`

**Giải thích chi tiết:**
* 2x - 5 = 0 <=> 2x = 5 <=> x = 2.50.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>
  #include <iomanip>

  int main() {
      double a = 0.0, b = 0.0;
      std::cin >> a >> b;

      if (a == 0.0) {
          if (b == 0.0) {
              std::cout << "Vo so nghiem\n";
          } else {
              std::cout << "Vo nghiem\n";
          }
      } else {
          double x = -b / a;
          // Tránh in -0.00
          if (x == -0.0) x = 0.0;
          std::cout << std::fixed << std::setprecision(2) << x << '\n';
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "2 -5\n",
                        "expectedOutput": "2.50\n",
                        "isHidden": false
            },
            {
                        "input": "0 0\n",
                        "expectedOutput": "Vo so nghiem\n",
                        "isHidden": false
            },
            {
                        "input": "0 4\n",
                        "expectedOutput": "Vo nghiem\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Tính Cước Taxi theo Cự ly di chuyển",
        difficulty: "MEDIUM",
        problemDescription: `Tính Cước Taxi theo Cự ly di chuyển
* **Mục tiêu:** Áp dụng cấu trúc rẽ nhánh để tính cước phí dịch vụ theo từng dặm đường thực tế.
* **Mô tả:** Cước phí đi taxi được tính như sau:
  * Km đầu tiên (0 < d <= 1): Giá mở cửa là 15,000 đồng.
  * Từ km thứ 2 đến km thứ 30 (1 < d <= 30): Giá 13,000 đồng/km.
  * Từ km thứ 31 trở lên (d > 30): Giá 11,000 đồng/km.
  Nhập vào quãng đường d (km, số thực dương). Hãy in ra tổng tiền cước (lấy phần nguyên).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số thực dương d (0 < d <= 1000).
* **Đầu ra (Output):** Số tiền nguyên (đồng).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
35
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
447000
\`\`\`

**Giải thích chi tiết:**
* 1 km đầu: 15,000 đồng.
* 29 km tiếp theo (từ km 2 đến km 30): 29 * 13,000 = 377,000 đồng.
* 5 km còn lại (từ km 31 đến km 35): 5 * 11,000 = 55,000 đồng.
* Tổng tiền = 15,000 + 377,000 + 55,000 = 447,000 đồng.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      double d = 0.0;
      std::cin >> d;

      double tongTien = 0.0;

      if (d <= 1.0) {
          tongTien = d * 15000.0;
      } else if (d <= 30.0) {
          tongTien = 1.0 * 15000.0 + (d - 1.0) * 13000.0;
      } else {
          tongTien = 1.0 * 15000.0 + 29.0 * 13000.0 + (d - 30.0) * 11000.0;
      }

      long long ketQua = static_cast<long long>(tongTien);
      std::cout << ketQua << '\n';
      return 0;
  }
`,
        testCases: [
            {
                        "input": "35\n",
                        "expectedOutput": "447000\n",
                        "isHidden": false
            },
            {
                        "input": "0.8\n",
                        "expectedOutput": "12000\n",
                        "isHidden": false
            },
            {
                        "input": "15\n",
                        "expectedOutput": "197000\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Chuyển đổi Ký tự Hoa - Thường (Kỹ thuật mã ASCII)",
        difficulty: "MEDIUM",
        problemDescription: `Chuyển đổi Ký tự Hoa - Thường (Kỹ thuật mã ASCII)
* **Mục tiêu:** Thao tác chuyển đổi chữ cái hoa/thường bằng phép dịch chuyển độ lệch \`('a' - 'A') = 32\` kết hợp \`if-else\`.
* **Mô tả:** Nhập vào một ký tự C bất kỳ:
  * Nếu C là chữ cái in thường: chuyển thành chữ cái in hoa tương ứng.
  * Nếu C là chữ cái in hoa: chuyển thành chữ cái in thường tương ứng.
  * Nếu C không phải chữ cái: giữ nguyên ký tự đó.
  In ký tự kết quả ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một ký tự C.
* **Đầu ra (Output):** Ký tự sau khi chuyển đổi.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
m
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
M
\`\`\`

**Giải thích chi tiết:**
* 'm' là chữ cái in thường, chuyển thành chữ cái in hoa tương ứng là 'M'.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      char c = ' ';
      std::cin >> c;

      if (c >= 'a' && c <= 'z') {
          c = static_cast<char>(c - ('a' - 'A'));
      } else if (c >= 'A' && c <= 'Z') {
          c = static_cast<char>(c + ('a' - 'A'));
      }

      std::cout << c << '\n';
      return 0;
  }
`,
        testCases: [
            {
                        "input": "m\n",
                        "expectedOutput": "M\n",
                        "isHidden": false
            },
            {
                        "input": "A\n",
                        "expectedOutput": "a\n",
                        "isHidden": false
            },
            {
                        "input": "9\n",
                        "expectedOutput": "9\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Tìm Ngày Kế Tiếp trong Lịch (Next Day)",
        difficulty: "HARD",
        problemDescription: `Tìm Ngày Kế Tiếp trong Lịch (Next Day)
* **Mục tiêu:** Rèn luyện tư duy xử lý chuyển ngày, chuyển tháng, chuyển năm và năm nhuận bằng chuỗi điều kiện logic chặt chẽ.
* **Mô tả:** Nhập vào ngày D, tháng M và năm Y (với dữ liệu ngày tháng năm luôn đảm bảo hợp lệ). Hãy tính và in ra ngày, tháng, năm của **ngày kế tiếp** ngay sau đó (D_next M_next Y_next), cách nhau bởi một khoảng trắng.
* **Chú ý các trường hợp biên:**
  * Ngày cuối tháng chuyển sang ngày 1 của tháng tiếp theo.
  * Ngày cuối năm (31/12) chuyển sang ngày 1/1 của năm mới.
  * Tháng 2 của năm nhuận (29 ngày) và năm thường (28 ngày).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số nguyên D, M, Y (1 <= D <= 31, 1 <= M <= 12, 1 <= Y <= 10^5).
* **Đầu ra (Output):** Ba số nguyên D_next M_next Y_next cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
28 2 2024
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
29 2 2024
\`\`\`

**Giải thích chi tiết:**
* Năm 2024 là năm nhuận nên tháng 2 có 29 ngày. Sau ngày 28/2 sẽ là ngày 29/2/2024.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      int d = 0, m = 0, y = 0;
      std::cin >> d >> m >> y;

      // Xác định số ngày tối đa của tháng m
      int maxNgay = 31;
      if (m == 4 || m == 6 || m == 9 || m == 11) {
          maxNgay = 30;
      } else if (m == 2) {
          bool laNamNhuan = (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);
          maxNgay = laNamNhuan ? 29 : 28;
      }

      if (d < maxNgay) {
          d++;
      } else {
          d = 1;
          if (m < 12) {
              m++;
          } else {
              m = 1;
              y++;
          }
      }

      std::cout << d << " " << m << " " << y << '\n';
      return 0;
  }
`,
        testCases: [
            {
                        "input": "28 2 2024\n",
                        "expectedOutput": "29 2 2024\n",
                        "isHidden": false
            },
            {
                        "input": "28 2 2023\n",
                        "expectedOutput": "1 3 2023\n",
                        "isHidden": false
            },
            {
                        "input": "31 12 2025\n",
                        "expectedOutput": "1 1 2026\n",
                        "isHidden": true
            },
            {
                        "input": "30 4 2025\n",
                        "expectedOutput": "1 5 2025\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Giải và Biện luận Phương trình Bậc Hai ax^2 + bx + c = 0",
        difficulty: "HARD",
        problemDescription: `Giải và Biện luận Phương trình Bậc Hai ax^2 + bx + c = 0
* **Mục tiêu:** Xử lý toàn diện các trường hợp suy biến khi a = 0 (phương trình bậc nhất) và biệt thức Delta (\`b^2 - 4ac\`) khi a != 0.
* **Mô tả:** Nhập vào 3 hệ số thực a, b, c. Biện luận số nghiệm:
  * Nếu a == 0: Trở thành \`bx + c = 0\`:
    * b == 0, c == 0: in \`Vo so nghiem\`
    * b == 0, c != 0: in \`Vo nghiem\`
    * b != 0: in 1 nghiệm duy nhất \`x = -c / b\`
  * Nếu a != 0: Tính delta = b^2 - 4ac:
    * delta < 0: in \`Vo nghiem\`
    * delta == 0: in 1 nghiệm kép \`x = -b / (2*a)\`
    * delta > 0: in 2 nghiệm phân biệt \`x1 x2\` (với x1 <= x2) cách nhau một khoảng trắng.
  * Các nghiệm in làm tròn đúng 2 chữ số thập phân.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Ba số thực a, b, c trên cùng một dòng.
* **Đầu ra (Output):** Chuỗi biện luận hoặc các nghiệm cách nhau bởi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
1 -5 6
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
2.00 3.00
\`\`\`

**Giải thích chi tiết:**
* Delta = (-5)^2 - 4*1*6 = 25 - 24 = 1 > 0.
* Căn delta = 1. Nghiệm x1 = (5 - 1)/2 = 2.00, x2 = (5 + 1)/2 = 3.00.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>
  #include <iomanip>
  #include <cmath>

  int main() {
      double a = 0.0, b = 0.0, c = 0.0;
      std::cin >> a >> b >> c;

      std::cout << std::fixed << std::setprecision(2);

      if (a == 0.0) {
          if (b == 0.0) {
              if (c == 0.0) std::cout << "Vo so nghiem\n";
              else std::cout << "Vo nghiem\n";
          } else {
              double x = -c / b;
              if (x == -0.0) x = 0.0;
              std::cout << x << '\n';
          }
          return 0;
      }

      double delta = b * b - 4 * a * c;

      if (delta < 0.0) {
          std::cout << "Vo nghiem\n";
      } else if (delta == 0.0) {
          double x = -b / (2 * a);
          if (x == -0.0) x = 0.0;
          std::cout << x << '\n';
      } else {
          double canDelta = std::sqrt(delta);
          double x1 = (-b - canDelta) / (2 * a);
          double x2 = (-b + canDelta) / (2 * a);
          if (x1 > x2) {
              double tmp = x1; x1 = x2; x2 = tmp;
          }
          if (x1 == -0.0) x1 = 0.0;
          if (x2 == -0.0) x2 = 0.0;
          std::cout << x1 << " " << x2 << '\n';
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "1 -5 6\n",
                        "expectedOutput": "2.00 3.00\n",
                        "isHidden": false
            },
            {
                        "input": "1 -4 4\n",
                        "expectedOutput": "2.00\n",
                        "isHidden": false
            },
            {
                        "input": "1 2 5\n",
                        "expectedOutput": "Vo nghiem\n",
                        "isHidden": true
            },
            {
                        "input": "0 2 -6\n",
                        "expectedOutput": "3.00\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Trò chơi Kéo - Búa - Bao (Oẳn tù tì)",
        difficulty: "HARD",
        problemDescription: `Trò chơi Kéo - Búa - Bao (Oẳn tù tì)
* **Mục tiêu:** Rèn luyện kỹ năng kết hợp toán tử logic để xử lý quan hệ vòng tròn (Kéo thắng Bao, Bao thắng Búa, Búa thắng Kéo).
* **Mô tả:** Hai người chơi cùng ra một trong 3 nước:
  * \`K\`: Kéo
  * \`B\`: Búa
  * \`G\`: Giấy (Bao)
  Nhập vào 2 ký tự c1 và c2 lần lượt là lựa chọn của Người 1 và Người 2.
  Hãy in ra:
  * \`Nguoi 1 thang\` nếu Người 1 thắng.
  * \`Nguoi 2 thang\` nếu Người 2 thắng.
  * \`Hoa\` nếu hai người chọn giống nhau.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Hai ký tự c1 và c2 cách nhau bởi dấu cách ('K', 'B', hoặc 'G').
* **Đầu ra (Output):** Kết quả ván đấu (\`Nguoi 1 thang\`, \`Nguoi 2 thang\`, hoặc \`Hoa\`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
B K
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
Nguoi 1 thang
\`\`\`

**Giải thích chi tiết:**
* Người 1 ra Búa ('B'), Người 2 ra Kéo ('K'). Búa đập vỡ Kéo nên Người 1 thắng.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      char c1 = ' ', c2 = ' ';
      std::cin >> c1 >> c2;

      if (c1 == c2) {
          std::cout << "Hoa\n";
      } else if ((c1 == 'K' && c2 == 'G') ||
                 (c1 == 'B' && c2 == 'K') ||
                 (c1 == 'G' && c2 == 'B')) {
          std::cout << "Nguoi 1 thang\n";
      } else {
          std::cout << "Nguoi 2 thang\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "B K\n",
                        "expectedOutput": "Nguoi 1 thang\n",
                        "isHidden": false
            },
            {
                        "input": "K K\n",
                        "expectedOutput": "Hoa\n",
                        "isHidden": false
            },
            {
                        "input": "K B\n",
                        "expectedOutput": "Nguoi 2 thang\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Sắp xếp 4 Số Nguyên Tăng Dần không dùng Mảng và Vòng lặp",
        difficulty: "HARD",
        problemDescription: `Sắp xếp 4 Số Nguyên Tăng Dần không dùng Mảng và Vòng lặp
* **Mục tiêu:** Làm chủ kỹ thuật hoán vị (swap) giá trị của 2 biến bằng biến tạm thời, sắp xếp 4 phần tử bằng mạng so sánh trực tiếp.
* **Mô tả:** Nhập vào 4 số nguyên a, b, c, d từ bàn phím. Hãy in ra 4 số này theo thứ tự tăng dần (không giảm) trên cùng một dòng, cách nhau bởi một khoảng trắng.
* **Ràng buộc:** Tuyệt đối không sử dụng mảng, \`std::vector\` hay vòng lặp \`for\`/\`while\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Bốn số nguyên a, b, c, d (-10^9 <= a, b, c, d <= 10^9).
* **Đầu ra (Output):** Bốn số đã được sắp xếp tăng dần, cách nhau bởi một dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
9 -2 5 0
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
-2 0 5 9
\`\`\`

**Giải thích chi tiết:**
* Sắp xếp từ nhỏ đến lớn: -2 <= 0 <= 5 <= 9.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long a = 0, b = 0, c = 0, d = 0;
      std::cin >> a >> b >> c >> d;

      // Mạng so sánh hoán đổi (Sorting Network cho 4 phần tử)
      long long t = 0;
      if (a > b) { t = a; a = b; b = t; }
      if (c > d) { t = c; c = d; d = t; }
      if (a > c) { t = a; a = c; c = t; }
      if (b > d) { t = b; b = d; d = t; }
      if (b > c) { t = b; b = c; c = t; }

      std::cout << a << " " << b << " " << c << " " << d << '\n';
      return 0;
  }
`,
        testCases: [
            {
                        "input": "9 -2 5 0\n",
                        "expectedOutput": "-2 0 5 9\n",
                        "isHidden": false
            },
            {
                        "input": "4 3 2 1\n",
                        "expectedOutput": "1 2 3 4\n",
                        "isHidden": false
            },
            {
                        "input": "5 5 1 2\n",
                        "expectedOutput": "1 2 5 5\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Tính Khoảng Cách Thời Gian giữa 2 Thời điểm trong Ngày",
        difficulty: "HARD",
        problemDescription: `Tính Khoảng Cách Thời Gian giữa 2 Thời điểm trong Ngày
* **Mục tiêu:** Quy đổi đơn vị thời gian sang số giây để so sánh, sau đó dùng phép chia nguyên và chia dư để khôi phục lại Giờ - Phút - Giây.
* **Mô tả:** Nhập vào hai thời điểm trong cùng một ngày:
  * Thời điểm 1: h1, m1, s1 (0 <= h1 <= 23, 0 <= m1, s1 <= 59)
  * Thời điểm 2: h2, m2, s2 (0 <= h2 <= 23, 0 <= m2, s2 <= 59)
  Đảm bảo thời điểm 2 luôn diễn ra sau hoặc trùng thời điểm 1 trong ngày.
  Hãy tính khoảng cách thời gian giữa hai thời điểm và in theo định dạng: \`H gio M phut S giay\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** 6 số nguyên h1 m1 s1 h2 m2 s2 cách nhau bởi khoảng trắng.
* **Đầu ra (Output):** Chuỗi định dạng khoảng cách thời gian \`H gio M phut S giay\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
9 15 30 11 10 20
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
1 gio 54 phut 50 giay
\`\`\`

**Giải thích chi tiết:**
* Thời điểm 1: 9 * 3600 + 15 * 60 + 30 = 33,330 giây.
* Thời điểm 2: 11 * 3600 + 10 * 60 + 20 = 40,220 giây.
* Chênh lệch = 40,220 - 33,330 = 6,890 giây.
* 6,890 / 3600 = 1 giờ; phần dư 6,890 % 3600 = 1,690 giây.
* 1,690 / 60 = 54 phút; phần dư 1,690 % 60 = 50 giây.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long h1 = 0, m1 = 0, s1 = 0;
      long long h2 = 0, m2 = 0, s2 = 0;
      std::cin >> h1 >> m1 >> s1 >> h2 >> m2 >> s2;

      long long sec1 = h1 * 3600 + m1 * 60 + s1;
      long long sec2 = h2 * 3600 + m2 * 60 + s2;

      long long diff = sec2 - sec1;

      long long h = diff / 3600;
      diff %= 3600;
      long long m = diff / 60;
      long long s = diff % 60;

      std::cout << h << " gio " << m << " phut " << s << " giay\n";
      return 0;
  }
`,
        testCases: [
            {
                        "input": "9 15 30 11 10 20\n",
                        "expectedOutput": "1 gio 54 phut 50 giay\n",
                        "isHidden": false
            },
            {
                        "input": "8 0 0 8 0 0\n",
                        "expectedOutput": "0 gio 0 phut 0 giay\n",
                        "isHidden": false
            },
            {
                        "input": "10 30 0 12 0 0\n",
                        "expectedOutput": "1 gio 30 phut 0 giay\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Xác định Vị trí Tương đối của 2 Đoạn Thẳng [a, b] và [c, d] trên Trục Số",
        difficulty: "HARD",
        problemDescription: `Xác định Vị trí Tương đối của 2 Đoạn Thẳng [a, b] và [c, d] trên Trục Số
* **Mục tiêu:** Áp dụng công thức giao hai đoạn thẳng \`[max(a, c), min(b, d)]\` để tính độ dài phần giao nhau.
* **Mô tả:** Cho hai đoạn thẳng trên trục số thực: đoạn 1 là \`[a, b]\` (a <= b) và đoạn 2 là \`[c, d]\` (c <= d).
  * Nếu hai đoạn thẳng giao nhau (có phần chung), in ra độ dài của phần chung đó.
  * Nếu không giao nhau (rời nhau hoàn toàn), in ra \`0\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Bốn số thực a, b, c, d (a <= b, c <= d).
* **Đầu ra (Output):** Độ dài phần giao nhau (làm tròn 2 chữ số thập phân).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
1.5 7.0 4.0 9.5
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
3.00
\`\`\`

**Giải thích chi tiết:**
* Phần giao nhau của [1.5, 7.0] và [4.0, 9.5] là đoạn [4.0, 7.0].
* Độ dài = 7.0 - 4.0 = 3.00.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>
  #include <iomanip>

  int main() {
      double a = 0.0, b = 0.0, c = 0.0, d = 0.0;
      std::cin >> a >> b >> c >> d;

      double left = (a > c) ? a : c;
      double right = (b < d) ? b : d;

      std::cout << std::fixed << std::setprecision(2);
      if (left <= right) {
          std::cout << (right - left) << '\n';
      } else {
          std::cout << 0.00 << '\n';
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "1.5 7.0 4.0 9.5\n",
                        "expectedOutput": "3.00\n",
                        "isHidden": false
            },
            {
                        "input": "1.0 3.0 5.0 8.0\n",
                        "expectedOutput": "0.00\n",
                        "isHidden": false
            },
            {
                        "input": "2.0 5.0 1.0 6.0\n",
                        "expectedOutput": "3.00\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Xác định Điểm M có Nằm Trong Hình Chữ Nhật",
        difficulty: "HARD",
        problemDescription: `Xác định Điểm M có Nằm Trong Hình Chữ Nhật
* **Mục tiêu:** Vận dụng hệ bất phương trình tọa độ để xác định vị trí tương đối giữa một điểm và một hình chữ nhật song song trục tọa độ.
* **Mô tả:** Cho một hình chữ nhật có các cạnh song song với hai trục tọa độ:
  * Góc trái-dưới có tọa độ \`(x1, y1)\`.
  * Góc phải-trên có tọa độ \`(x2, y2)\` (đảm bảo x1 < x2 và y1 < y2).
  Nhập tọa độ điểm M \`(x, y)\`. Hãy xác định:
  * Điểm M nằm strictly bên trong hình chữ nhật: in \`BEN TRONG\`
  * Điểm M nằm trên một trong các cạnh của hình chữ nhật: in \`TREN BIEN\`
  * Điểm M nằm ngoài hình chữ nhật: in \`BEN NGOAI\`

### Quy cách dữ liệu:
* **Đầu vào (Input):** 6 số thực: x1 y1 x2 y2 x y.
* **Đầu ra (Output):** \`BEN TRONG\`, \`TREN BIEN\`, hoặc \`BEN NGOAI\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
0 0 10 10 5 10
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
TREN BIEN
\`\`\`

**Giải thích chi tiết:**
* Điểm M(5, 10) có hoành độ 0 < 5 < 10 và tung độ y = 10 đúng bằng cạnh trên của hình chữ nhật, nên nằm \`TREN BIEN\`.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      double x1 = 0.0, y1 = 0.0, x2 = 0.0, y2 = 0.0, x = 0.0, y = 0.0;
      std::cin >> x1 >> y1 >> x2 >> y2 >> x >> y;

      if (x < x1 || x > x2 || y < y1 || y > y2) {
          std::cout << "BEN NGOAI\n";
      } else if (x > x1 && x < x2 && y > y1 && y < y2) {
          std::cout << "BEN TRONG\n";
      } else {
          std::cout << "TREN BIEN\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "0 0 10 10 5 10\n",
                        "expectedOutput": "TREN BIEN\n",
                        "isHidden": false
            },
            {
                        "input": "0 0 10 10 5 5\n",
                        "expectedOutput": "BEN TRONG\n",
                        "isHidden": false
            },
            {
                        "input": "0 0 10 10 12 5\n",
                        "expectedOutput": "BEN NGOAI\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Đọc Số Có 2 Chữ Số thành Chữ Tiếng Việt",
        difficulty: "HARD",
        problemDescription: `Đọc Số Có 2 Chữ Số thành Chữ Tiếng Việt
* **Mục tiêu:** Kết hợp tách chữ số hàng chục, hàng đơn vị và cấu trúc \`switch-case\` để giải quyết bài toán đọc số với các trường hợp đặc biệt (\`mười\`, \`mười lăm\`, \`hai mươi mốt\`, \`ba mươi lăm\`).
* **Mô tả:** Nhập vào một số nguyên N có đúng 2 chữ số (10 <= N <= 99). Hãy in ra cách đọc số đó bằng tiếng Việt không dấu:
  * Hàng chục: 1 in \`Muoi\`, 2 in \`Hai muoi\`, 3 in \`Ba muoi\`, ..., 9 in \`Chin muoi\`.
  * Hàng đơn vị (khi hàng đơn vị != 0):
    * Đuôi 1: Nếu hàng chục là 1 đọc là \`mot\` (viết: \`Muoi mot\`); nếu hàng chục >= 2 đọc là \`mot\` theo âm điệu tiếng Việt: \`Hai muoi mot\`.
    * Đuôi 5: Nếu hàng chục là 1 đọc là \`lam\` (viết: \`Muoi lam\`); nếu hàng chục >= 2 đọc là \`lam\` (viết: \`Hai muoi lam\`).
    * Các số khác: \`hai\`, \`ba\`, \`bon\`, \`sau\`, \`bay\`, \`tam\`, \`chin\`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên N (10 <= N <= 99).
* **Đầu ra (Output):** Cách đọc tiếng Việt tương ứng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
35
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
Ba muoi lam
\`\`\`

**Giải thích chi tiết:**
* Số 35 gồm hàng chục là 3 ("Ba muoi") và hàng đơn vị là 5 ("lam") -> Kết quả: "Ba muoi lam".`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>
  #include <string>

  int main() {
      int n = 0;
      std::cin >> n;

      int chuc = n / 10;
      int donVi = n % 10;

      std::string sChuc = "";
      switch (chuc) {
          case 1: sChuc = "Muoi"; break;
          case 2: sChuc = "Hai muoi"; break;
          case 3: sChuc = "Ba muoi"; break;
          case 4: sChuc = "Bon muoi"; break;
          case 5: sChuc = "Nam muoi"; break;
          case 6: sChuc = "Sau muoi"; break;
          case 7: sChuc = "Bay muoi"; break;
          case 8: sChuc = "Tam muoi"; break;
          case 9: sChuc = "Chin muoi"; break;
      }

      if (donVi == 0) {
          std::cout << sChuc << '\n';
          return 0;
      }

      std::string sDonVi = "";
      switch (donVi) {
          case 1: sDonVi = (chuc == 1) ? "mot" : "mot"; break;
          case 2: sDonVi = "hai"; break;
          case 3: sDonVi = "ba"; break;
          case 4: sDonVi = "bon"; break;
          case 5: sDonVi = "lam"; break;
          case 6: sDonVi = "sau"; break;
          case 7: sDonVi = "bay"; break;
          case 8: sDonVi = "tam"; break;
          case 9: sDonVi = "chin"; break;
      }

      std::cout << sChuc << " " << sDonVi << '\n';
      return 0;
  }
`,
        testCases: [
            {
                        "input": "35\n",
                        "expectedOutput": "Ba muoi lam\n",
                        "isHidden": false
            },
            {
                        "input": "15\n",
                        "expectedOutput": "Muoi lam\n",
                        "isHidden": false
            },
            {
                        "input": "21\n",
                        "expectedOutput": "Hai muoi mot\n",
                        "isHidden": true
            },
            {
                        "input": "50\n",
                        "expectedOutput": "Nam muoi\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Kiểm tra Tam Giác Có Chứa Điểm Gốc Tọa Độ (0, 0)",
        difficulty: "HARD",
        problemDescription: `Kiểm tra Tam Giác Có Chứa Điểm Gốc Tọa Độ (0, 0)
* **Mục tiêu:** Áp dụng phương pháp tích có hướng 2D (Cross Product) để kiểm tra điểm nằm trong đa giác lồi mà không dùng vòng lặp.
* **Mô tả:** Cho 3 điểm không thẳng hàng A(x1, y1), B(x2, y2), C(x3, y3) tạo thành tam giác ABC.
  Kiểm tra xem gốc tọa độ O(0, 0) có nằm trong tam giác ABC (bao gồm cả trường hợp nằm trên cạnh tam giác) hay không.
  * Nếu có: in ra \`YES\`
  * Nếu không: in ra \`NO\`
* **Công thức gợi ý:** Tích có hướng của hai vector OA x OB = x1 * y2 - x2 * y1.
  Điểm O nằm trong tam giác nếu dấu của cả 3 tích có hướng (OA x OB), (OB x OC), (OC x OA) cùng >= 0 hoặc cùng <= 0.

### Quy cách dữ liệu:
* **Đầu vào (Input):** 6 số nguyên: x1 y1 x2 y2 x3 y3 (-10^4 <= xi, yi <= 10^4).
* **Đầu ra (Output):** \`YES\` hoặc \`NO\`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
-2 -2 4 -2 0 4
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
YES
\`\`\`

**Giải thích chi tiết:**
* Tam giác tạo bởi (-2,-2), (4,-2), (0,4) bao quanh điểm O(0,0), nên kết quả là \`YES\`.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long x1 = 0, y1 = 0, x2 = 0, y2 = 0, x3 = 0, y3 = 0;
      std::cin >> x1 >> y1 >> x2 >> y2 >> x3 >> y3;

      // cp1 = OA x OB = x1 * y2 - x2 * y1
      long long cp1 = x1 * y2 - x2 * y1;
      // cp2 = OB x OC = x2 * y3 - x3 * y2
      long long cp2 = x2 * y3 - x3 * y2;
      // cp3 = OC x OA = x3 * y1 - x1 * y3
      long long cp3 = x3 * y1 - x1 * y3;

      bool cungDuong = (cp1 >= 0 && cp2 >= 0 && cp3 >= 0);
      bool cungAm = (cp1 <= 0 && cp2 <= 0 && cp3 <= 0);

      if (cungDuong || cungAm) {
          std::cout << "YES\n";
      } else {
          std::cout << "NO\n";
      }

      return 0;
  }
`,
        testCases: [
            {
                        "input": "-2 -2 4 -2 0 4\n",
                        "expectedOutput": "YES\n",
                        "isHidden": false
            },
            {
                        "input": "2 2 5 2 3 6\n",
                        "expectedOutput": "NO\n",
                        "isHidden": false
            },
            {
                        "input": "0 0 5 0 0 5\n",
                        "expectedOutput": "YES\n",
                        "isHidden": true
            }
]
    },
    {
        title: "Tính Thuế Thu Nhập Cá Nhân Lũy Tiến Từng Phần",
        difficulty: "HARD",
        problemDescription: `Tính Thuế Thu Nhập Cá Nhân Lũy Tiến Từng Phần
* **Mục tiêu:** Quản lý dữ liệu lớn \`long long\` và áp dụng biểu thức tính thuế lũy tiến từng phần thực tế.
* **Mô tả:** Biểu thuế thu nhập cá nhân lũy tiến đối với thu nhập chịu thuế T (đồng/tháng) được quy định như sau:
  * Bậc 1: Đến 5 triệu đồng (T <= 5,000,000): Thuế suất 5%.
  * Bậc 2: Trên 5 triệu đến 10 triệu đồng: Thuế suất 10%.
  * Bậc 3: Trên 10 triệu đến 18 triệu đồng: Thuế suất 15%.
  * Bậc 4: Trên 18 triệu đến 32 triệu đồng: Thuế suất 20%.
  * Bậc 5: Trên 32 triệu đồng: Thuế suất 25%.
  Nhập vào thu nhập chịu thuế T (T >= 0). Hãy tính chính xác số tiền thuế phải nộp (đồng, làm tròn đến hàng đơn vị).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một số nguyên T (0 <= T <= 10^12).
* **Đầu ra (Output):** Số tiền thuế phải nộp (số nguyên \`long long\`).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
\`\`\`text
15000000
\`\`\`

**Khung Đầu ra (Output):**
\`\`\`text
1500000
\`\`\`

**Giải thích chi tiết:**
* Thu nhập chịu thuế: 15,000,000 đồng:
  * 5,000,000 đầu (Bậc 1): 5,000,000 * 5% = 250,000 đồng.
  * 5,000,000 tiếp theo (Bậc 2, từ 5tr đến 10tr): 5,000,000 * 10% = 500,000 đồng.
  * 5,000,000 còn lại (Bậc 3, từ 10tr đến 15tr): 5,000,000 * 15% = 750,000 đồng.
  * Tổng tiền thuế = 250,000 + 500,000 + 750,000 = 1,500,000 đồng.`,
        starterCode: `#include <iostream>

int main() {
    // Viết giải thuật rẽ nhánh của bạn ở đây:
    
    return 0;
}
`,
        solutionCode: `#include <iostream>

  int main() {
      long long t = 0;
      std::cin >> t;

      double thue = 0.0;

      if (t <= 5000000) {
          thue = t * 0.05;
      } else if (t <= 10000000) {
          thue = 5000000 * 0.05 + (t - 5000000) * 0.10;
      } else if (t <= 18000000) {
          thue = 5000000 * 0.05 + 5000000 * 0.10 + (t - 10000000) * 0.15;
      } else if (t <= 32000000) {
          thue = 5000000 * 0.05 + 5000000 * 0.10 + 8000000 * 0.15 + (t - 18000000) * 0.20;
      } else {
          thue = 5000000 * 0.05 + 5000000 * 0.10 + 8000000 * 0.15 + 14000000 * 0.20 + (t - 32000000) * 0.25;
      }

      long long tienThue = static_cast<long long>(thue + 0.5); // Làm tròn
      std::cout << tienThue << '\n';
      return 0;
  }
`,
        testCases: [
            {
                        "input": "15000000\n",
                        "expectedOutput": "1500000\n",
                        "isHidden": false
            },
            {
                        "input": "4000000\n",
                        "expectedOutput": "200000\n",
                        "isHidden": false
            },
            {
                        "input": "25000000\n",
                        "expectedOutput": "3350000\n",
                        "isHidden": true
            }
]
    },

];

async function seedCppModule2Practice() {
    console.log('🚀 Bắt đầu cập nhật toàn bộ 30 bài tập chuẩn hóa Module 2 C++ vào Database...');

    // 1. Tìm Module 2 của C++
    const module2 = await prisma.module.findUnique({
        where: { moduleId: 'CPP-MOD-02' }
    });

    if (!module2) {
        throw new Error('❌ Không tìm thấy Module 2 (CPP-MOD-02)!');
    }

    // 2. Tìm Chapter 2
    const chapter2 = await prisma.chapter.findFirst({
        where: {
            moduleId: module2.id,
            chapterId: 'CPP-CH-02'
        }
    });

    if (!chapter2) {
        throw new Error('❌ Không tìm thấy Chapter 2 của Module 2!');
    }

    // 3. Upsert bài học tổng hợp CPP-02.MP
    const lessonMp = await prisma.lesson.upsert({
        where: {
            id: 'c1b10000-0002-4000-8000-000000000001'
        },
        update: {
            lessonId: 'CPP-02.MP',
            title: 'Bài tập thực hành tổng hợp Module 2: Rẽ nhánh và Tư duy Logic Điều kiện',
            objective: 'Hệ thống 30 bài tập ôn tập chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức if-else, switch-case, toán tử logic và toán tử 3 ngôi của Module 2 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 60,
            isFree: true,
            orderIndex: 5,
            chapterId: chapter2.id,
            content: `# Bài tập thực hành tổng hợp Module 2: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 2: Cấu trúc Rẽ nhánh và Tư duy Logic Điều kiện**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài rèn luyện cú pháp if/else, switch-case, toán tử 3 ngôi cơ bản.
* ⚔️ **Trung bình (Medium):** 10 bài vận dụng điều kiện phức hợp, phân loại tam giác, tính tiền điện, năm nhuận.
* 👑 **Khó / Thử thách (Hard):** 10 bài thuật toán phân nhánh chuyên sâu, hình học tọa độ, phương trình bậc hai, và thuế thu nhập.

Chúc bạn hoàn thành xuất sắc toàn bộ thử thách!`
        },
        create: {
            id: 'c1b10000-0002-4000-8000-000000000001',
            lessonId: 'CPP-02.MP',
            title: 'Bài tập thực hành tổng hợp Module 2: Rẽ nhánh và Tư duy Logic Điều kiện',
            objective: 'Hệ thống 30 bài tập ôn tập chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức if-else, switch-case, toán tử logic và toán tử 3 ngôi của Module 2 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 60,
            isFree: true,
            orderIndex: 5,
            chapterId: chapter2.id,
            content: `# Bài tập thực hành tổng hợp Module 2: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 2: Cấu trúc Rẽ nhánh và Tư duy Logic Điều kiện**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài rèn luyện cú pháp if/else, switch-case, toán tử 3 ngôi cơ bản.
* ⚔️ **Trung bình (Medium):** 10 bài vận dụng điều kiện phức hợp, phân loại tam giác, tính tiền điện, năm nhuận.
* 👑 **Khó / Thử thách (Hard):** 10 bài thuật toán phân nhánh chuyên sâu, hình học tọa độ, phương trình bậc hai, và thuế thu nhập.

Chúc bạn hoàn thành xuất sắc toàn bộ thử thách!`
        }
    });

    console.log(`✅ Đã đồng bộ Bài học tổng hợp: [${lessonMp.lessonId}] ${lessonMp.title} (ID: ${lessonMp.id})`);

    // 4. Cập nhật lần lượt 30 Coding Exercises và Test Cases
    let successCount = 0;
    for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];

        let dbExercise = await prisma.codingExercise.findFirst({
            where: {
                lessonId: lessonMp.id,
                title: ex.title
            }
        });

        const exPayload = {
            lessonId: lessonMp.id,
            title: ex.title,
            difficulty: ex.difficulty as any,
            problemDescription: ex.problemDescription,
            starterCode: ex.starterCode,
            solutionCode: ex.solutionCode
        };

        if (dbExercise) {
            dbExercise = await prisma.codingExercise.update({
                where: { id: dbExercise.id },
                data: exPayload
            });
        } else {
            dbExercise = await prisma.codingExercise.create({
                data: exPayload
            });
        }

        await prisma.testCase.deleteMany({
            where: { exerciseId: dbExercise.id }
        });

        for (const tc of ex.testCases) {
            await prisma.testCase.create({
                data: {
                    exerciseId: dbExercise.id,
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                    isHidden: tc.isHidden
                }
            });
        }

        successCount++;
        console.log(`   [${i + 1}/30] [${ex.difficulty}] Đã cập nhật chuẩn hóa: "${ex.title}" (${ex.testCases.length} testcases)`);
    }

    console.log(`\n🎉 THÀNH CÔNG! Đã cập nhật xong ${successCount} bài tập thực hành Module 2 C++ lên Database!`);
}

seedCppModule2Practice()
    .catch((err) => {
        console.error('❌ Lỗi khi cập nhật bài tập Module 2 C++:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
