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
        title: "Viết Hàm Tính Luỹ Thừa Bậc K (power)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Rèn luyện kỹ năng định nghĩa hàm có tham số và trả về giá trị kiểu `long long`.\n* **Mô tả:** Viết hàm `long long luyThua(long long a, int k)` nhận vào cơ số `a` và số mũ nguyên không âm `k`, tính và trả về giá trị a^k.\n  * Trong hàm `main()`, nhập hai số nguyên `a` và `k` (-10 <= a <= 10, 0 <= k <= 15), gọi hàm `luyThua` và in kết quả ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số nguyên a và k cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Một số nguyên duy nhất là kết quả a^k.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 4\n```\n\n**Khung Đầu ra (Output):**\n```text\n81\n```\n\n**Giải thích chi tiết:**\n* 3 lũy thừa 4: 3 * 3 * 3 * 3 = 81.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  long long luyThua(long long a, int k) {\n      long long res = 1;\n      for (int i = 0; i < k; ++i) {\n          res *= a;\n      }\n      return res;\n  }\n\n  int main() {\n      long long a = 0;\n      int k = 0;\n      std::cin >> a >> k;\n\n      std::cout << luyThua(a, k) << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "3 4\n",
                expectedOutput: "81\n",
                isHidden: false
            },
            {
                input: "2 0\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "5 3\n",
                expectedOutput: "125\n",
                isHidden: true
            },
            {
                input: "-2 5\n",
                expectedOutput: "-32\n",
                isHidden: true
            },
            {
                input: "-3 4\n",
                expectedOutput: "81\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Viết Hàm Kiểm Tra Số Chính Phương (isSquare)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Rèn luyện viết hàm trả về kiểu `bool` (`true`/`false`).\n* **Mô tả:** Số chính phương là số nguyên không âm có căn bậc hai là một số nguyên (ví dụ: 0, 1, 4, 9, 16...).\n  * Viết hàm `bool kiemTraChinhPhuong(long long n)` trả về `true` nếu `n` là số chính phương, ngược lại trả về `false`.\n  * Trong `main()`, nhập số nguyên `n` (-10^12 <= n <= 10^12). In ra `YES` nếu là số chính phương, ngược lại in `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên n (-10^12 <= n <= 10^12).\n* **Đầu ra (Output):** In ra `YES` hoặc `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n49\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* 49 = 7 * 7, là bình phương của số nguyên 7 nên là số chính phương.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <cmath>\n\n  bool kiemTraChinhPhuong(long long n) {\n      if (n < 0) return false;\n      long long can = static_cast<long long>(std::round(std::sqrt(n)));\n      return can * can == n;\n  }\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      if (kiemTraChinhPhuong(n)) {\n          std::cout << \"YES\\n\";\n      } else {\n          std::cout << \"NO\\n\";\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "49\n",
                expectedOutput: "YES\n",
                isHidden: false
            },
            {
                input: "0\n",
                expectedOutput: "YES\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
            {
                input: "50\n",
                expectedOutput: "NO\n",
                isHidden: true
            },
            {
                input: "-16\n",
                expectedOutput: "NO\n",
                isHidden: true
            },
            {
                input: "1000000000000\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Hoán Vị Hai Biến Bằng Tham Chiếu (swapByReference)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Hiểu rõ bản chất truyền tham chiếu `&` (Pass-by-reference) để làm thay đổi trực tiếp giá trị của đối số ngoài hàm.\n* **Mô tả:** Viết hàm `void hoanVi(long long &a, long long &b)` để đổi chỗ giá trị của hai biến `a` và `b`.\n  * Trong `main()`, nhập vào hai số nguyên `x` và `y`, gọi hàm `hoanVi(x, y)` rồi in ra hai số sau khi hoán vị cách nhau một dấu cách.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số nguyên x và y cách nhau một khoảng trắng (-10^18 <= x, y <= 10^18).\n* **Đầu ra (Output):** Hai số nguyên sau khi đổi chỗ cách nhau bởi dấu cách.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n15 99\n```\n\n**Khung Đầu ra (Output):**\n```text\n99 15\n```\n\n**Giải thích chi tiết:**\n* Sau khi qua hàm `hoanVi`, biến thứ nhất nhận giá trị 99 và biến thứ hai nhận giá trị 15.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  void hoanVi(long long &a, long long &b) {\n      long long temp = a;\n      a = b;\n      b = temp;\n  }\n\n  int main() {\n      long long x = 0, y = 0;\n      std::cin >> x >> y;\n\n      hoanVi(x, y);\n\n      std::cout << x << \" \" << y << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "15 99\n",
                expectedOutput: "99 15\n",
                isHidden: false
            },
            {
                input: "0 0\n",
                expectedOutput: "0 0\n",
                isHidden: false
            },
            {
                input: "-5 10\n",
                expectedOutput: "10 -5\n",
                isHidden: true
            },
            {
                input: "1000000000000 -999999999999\n",
                expectedOutput: "-999999999999 1000000000000\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Hàm Giải Phương Trình Bậc Nhất Với Tham Chiếu Nghiệm",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Áp dụng kết hợp kiểu trả về mã trạng thái (`int`) và truyền tham chiếu `double &` để trả về kết quả tính toán.\n* **Mô tả:** Viết hàm `int giaiBacNhat(double a, double b, double &nghiem)` giải phương trình a * x + b = 0:\n  * Nếu phương trình vô nghiệm: trả về `0`.\n  * Nếu phương trình vô số nghiệm: trả về `-1`.\n  * Nếu phương trình có nghiệm duy nhất: gán nghiệm vào tham chiếu `nghiem` và trả về `1`.\n  * Trong `main()`, nhập `a` và `b`. Dựa vào giá trị trả về của hàm, in ra:\n    * `VO NGHIEM` (nếu trả về 0)\n    * `VO SO NGHIEM` (nếu trả về -1)\n    * In giá trị nghiệm lấy chính xác 2 chữ số thập phân (nếu trả về 1).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số thực a và b cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Kết quả theo đúng quy ước.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 -5\n```\n\n**Khung Đầu ra (Output):**\n```text\n2.50\n```\n\n**Giải thích chi tiết:**\n* Phương trình 2 * x - 5 = 0 <=> x = 2.5. Hàm trả về 1 và gán nghiệm x = 2.50.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <iomanip>\n\n  int giaiBacNhat(double a, double b, double &nghiem) {\n      if (a == 0) {\n          if (b == 0) return -1; // V\u00f4 s\u1ed1 nghi\u1ec7m\n          return 0;              // V\u00f4 nghi\u1ec7m\n      }\n      nghiem = -b / a;\n      if (nghiem == 0.0) nghiem = 0.0; // Tr\u00e1nh -0.00\n      return 1;\n  }\n\n  int main() {\n      double a = 0, b = 0;\n      std::cin >> a >> b;\n\n      double x = 0;\n      int trangThai = giaiBacNhat(a, b, x);\n\n      if (trangThai == 0) {\n          std::cout << \"VO NGHIEM\\n\";\n      } else if (trangThai == -1) {\n          std::cout << \"VO SO NGHIEM\\n\";\n      } else {\n          std::cout << std::fixed << std::setprecision(2) << x << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "2 -5\n",
                expectedOutput: "2.50\n",
                isHidden: false
            },
            {
                input: "0 0\n",
                expectedOutput: "VO SO NGHIEM\n",
                isHidden: false
            },
            {
                input: "0 7\n",
                expectedOutput: "VO NGHIEM\n",
                isHidden: true
            },
            {
                input: "-4 8\n",
                expectedOutput: "2.00\n",
                isHidden: true
            },
            {
                input: "3 0\n",
                expectedOutput: "0.00\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Nạp Chồng Hàm Tìm Giá Trị Lớn Nhất (Function Overloading)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Rèn luyện kỹ năng nạp chồng hàm (Function Overloading) với số lượng và kiểu dữ liệu tham số khác nhau.\n* **Mô tả:** Viết các hàm nạp chồng có cùng tên `timMax`:\n  * `int timMax(int a, int b)`: Tìm max của 2 số nguyên.\n  * `double timMax(double a, double b)`: Tìm max của 2 số thực.\n  * `int timMax(int a, int b, int c)`: Tìm max của 3 số nguyên.\n  * Trong `main()`, đọc vào ký tự chế độ `mode`:\n    * Nếu `mode == 'A'`: Nhập tiếp 2 số nguyên a, b, gọi `timMax(a, b)` và in kết quả.\n    * Nếu `mode == 'B'`: Nhập tiếp 2 số thực a, b, gọi `timMax(a, b)` và in kết quả lấy 2 chữ số thập phân.\n    * Nếu `mode == 'C'`: Nhập tiếp 3 số nguyên a, b, c, gọi `timMax(a, b, c)` và in kết quả.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Ký tự mode ('A', 'B' hoặc 'C') và các số tương ứng.\n* **Đầu ra (Output):** Giá trị lớn nhất tìm được.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nC 12 45 30\n```\n\n**Khung Đầu ra (Output):**\n```text\n45\n```\n\n**Giải thích chi tiết:**\n* Chế độ 'C' gọi hàm `timMax(int, int, int)` với ba giá trị 12, 45, 30. Số lớn nhất là 45.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <iomanip>\n\n  int timMax(int a, int b) {\n      return (a > b) ? a : b;\n  }\n\n  double timMax(double a, double b) {\n      return (a > b) ? a : b;\n  }\n\n  int timMax(int a, int b, int c) {\n      int m = (a > b) ? a : b;\n      return (m > c) ? m : c;\n  }\n\n  int main() {\n      char mode;\n      std::cin >> mode;\n\n      if (mode == 'A') {\n          int a = 0, b = 0;\n          std::cin >> a >> b;\n          std::cout << timMax(a, b) << '\\n';\n      } else if (mode == 'B') {\n          double a = 0, b = 0;\n          std::cin >> a >> b;\n          std::cout << std::fixed << std::setprecision(2) << timMax(a, b) << '\\n';\n      } else if (mode == 'C') {\n          int a = 0, b = 0, c = 0;\n          std::cin >> a >> b >> c;\n          std::cout << timMax(a, b, c) << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "C 12 45 30\n",
                expectedOutput: "45\n",
                isHidden: false
            },
            {
                input: "A 10 20\n",
                expectedOutput: "20\n",
                isHidden: false
            },
            {
                input: "B 3.14 2.71\n",
                expectedOutput: "3.14\n",
                isHidden: true
            },
            {
                input: "A -5 -1\n",
                expectedOutput: "-1\n",
                isHidden: true
            },
            {
                input: "C 100 100 50\n",
                expectedOutput: "100\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Hàm Tính Chỉ Số Khối Cơ Thể BMI Với Tham Chiếu Hằng (const &)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Áp dụng tham chiếu hằng (`const double &`) để truyền dữ liệu an toàn và tối ưu bộ nhớ.\n* **Mô tả:** Viết hai hàm:\n  1. `double tinhBMI(const double &canNang, const double &chieuCao)`: Tính chỉ số BMI = canNang / (chieuCao * chieuCao) (cân nặng tính bằng kg, chiều cao tính bằng mét).\n  2. `std::string phanLoaiBMI(const double &bmi)`:\n     * BMI < 18.5: trả về \"GAY\"\n     * 18.5 <= BMI < 25.0: trả về \"BINH THUONG\"\n     * 25.0 <= BMI < 30.0: trả về \"TIEN BEO PHI\"\n     * BMI >= 30.0: trả về \"BEO PHI\"\n  * Trong `main()`, nhập cân nặng (kg) và chiều cao (m). In ra chỉ số BMI (lấy 2 chữ số thập phân) và phân loại, cách nhau bởi một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số thực cân nặng (kg) và chiều cao (m).\n* **Đầu ra (Output):** Chỉ số BMI và tên phân loại.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n65.0 1.70\n```\n\n**Khung Đầu ra (Output):**\n```text\n22.49 BINH THUONG\n```\n\n**Giải thích chi tiết:**\n* BMI = 65 / (1.70 * 1.70) = 22.49. Chỉ số nằm trong khoảng [18.5, 25.0) nên phân loại là BINH THUONG.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <iomanip>\n  #include <string>\n\n  double tinhBMI(const double &canNang, const double &chieuCao) {\n      return canNang / (chieuCao * chieuCao);\n  }\n\n  std::string phanLoaiBMI(const double &bmi) {\n      if (bmi < 18.5) return \"GAY\";\n      if (bmi < 25.0) return \"BINH THUONG\";\n      if (bmi < 30.0) return \"TIEN BEO PHI\";\n      return \"BEO PHI\";\n  }\n\n  int main() {\n      double canNang = 0, chieuCao = 0;\n      std::cin >> canNang >> chieuCao;\n\n      double bmi = tinhBMI(canNang, chieuCao);\n      std::string phanLoai = phanLoaiBMI(bmi);\n\n      std::cout << std::fixed << std::setprecision(2) << bmi << \" \" << phanLoai << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "65.0 1.70\n",
                expectedOutput: "22.49 BINH THUONG\n",
                isHidden: false
            },
            {
                input: "45.0 1.65\n",
                expectedOutput: "16.53 GAY\n",
                isHidden: false
            },
            {
                input: "75.0 1.65\n",
                expectedOutput: "27.55 TIEN BEO PHI\n",
                isHidden: true
            },
            {
                input: "95.0 1.70\n",
                expectedOutput: "32.87 BEO PHI\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Biến Tĩnh Trong Hàm Đếm Số Lần Gọi Hàm (static variable)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Hiểu rõ vòng đời (Lifetime) của biến cục bộ có từ khóa `static` (tồn tại suốt chương trình và giữ nguyên giá trị giữa các lần gọi).\n* **Mô tả:** Viết hàm `int demSoLanGoi()` bên trong có biến `static int count = 0;`. Mỗi lần gọi hàm, `count` tăng thêm 1 và hàm trả về giá trị `count`.\n  * Trong `main()`, nhập vào số nguyên dương N (1 <= N <= 100). Sử dụng vòng lặp để gọi hàm `demSoLanGoi()` N lần và in ra kết quả của từng lần gọi trên cùng một dòng, cách nhau bởi dấu cách.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 100).\n* **Đầu ra (Output):** Dãy số từ 1 đến N thể hiện số lần gọi hàm.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 2 3 4 5\n```\n\n**Giải thích chi tiết:**\n* Lần 1 gọi hàm: count = 1. Lần 2: count = 2... Biến `static` không bị khởi tạo lại mỗi khi hàm kết thúc.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int demSoLanGoi() {\n      static int count = 0;\n      count++;\n      return count;\n  }\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      for (int i = 1; i <= n; ++i) {\n          std::cout << demSoLanGoi() << (i == n ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n",
                expectedOutput: "1 2 3 4 5\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "10\n",
                expectedOutput: "1 2 3 4 5 6 7 8 9 10\n",
                isHidden: true
            },
            {
                input: "20\n",
                expectedOutput: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Hàm Tính Giai Thừa Bằng Đệ Quy Cơ Bản (factorialRecursion)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Làm quen với cơ chế đệ quy: điều kiện dừng (Base case) và bước đệ quy (Recursive step).\n* **Mô tả:** Viết hàm đệ quy `long long giaiThua(int n)` để tính N!:\n  * Điều kiện dừng: nếu n <= 1, trả về 1.\n  * Bước đệ quy: trả về n * giaiThua(n - 1).\n  * Trong `main()`, nhập số nguyên n (0 <= n <= 20). In ra giá trị của n!.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên n (0 <= n <= 20).\n* **Đầu ra (Output):** Giá trị của n! (kiểu `long long`).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6\n```\n\n**Khung Đầu ra (Output):**\n```text\n720\n```\n\n**Giải thích chi tiết:**\n* 6! = 6 * 5! = 6 * 120 = 720.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  long long giaiThua(int n) {\n      if (n <= 1) return 1;\n      return n * giaiThua(n - 1);\n  }\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      std::cout << giaiThua(n) << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6\n",
                expectedOutput: "720\n",
                isHidden: false
            },
            {
                input: "0\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "1\n",
                isHidden: true
            },
            {
                input: "10\n",
                expectedOutput: "3628800\n",
                isHidden: true
            },
            {
                input: "20\n",
                expectedOutput: "2432902008176640000\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Hàm Đệ Quy Tính Tổng Chữ Số của Số Nguyên (sumDigitsRecursion)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Vận dụng đệ quy bóc tách dữ liệu số học mà không cần vòng lặp.\n* **Mô tả:** Viết hàm đệ quy `long long tongChuSo(long long n)`:\n  * Nếu n < 10, trả về n.\n  * Ngược lại, trả về (n % 10) + tongChuSo(n / 10).\n  * Trong `main()`, nhập số nguyên dương n (1 <= n <= 10^18). In ra tổng các chữ số của n.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương n (1 <= n <= 10^18).\n* **Đầu ra (Output):** Tổng các chữ số của n.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n9875\n```\n\n**Khung Đầu ra (Output):**\n```text\n29\n```\n\n**Giải thích chi tiết:**\n* tongChuSo(9875) = 5 + tongChuSo(987) = 5 + 7 + tongChuSo(98) = 5 + 7 + 8 + 9 = 29.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  long long tongChuSo(long long n) {\n      if (n < 10) return n;\n      return (n % 10) + tongChuSo(n / 10);\n  }\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      std::cout << tongChuSo(n) << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "9875\n",
                expectedOutput: "29\n",
                isHidden: false
            },
            {
                input: "7\n",
                expectedOutput: "7\n",
                isHidden: false
            },
            {
                input: "100000\n",
                expectedOutput: "1\n",
                isHidden: true
            },
            {
                input: "999999999\n",
                expectedOutput: "81\n",
                isHidden: true
            },
            {
                input: "123456789012345\n",
                expectedOutput: "60\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Hàm Tách Giờ:Phút:Giây Qua Nhiều Tham Chiếu",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Sử dụng nhiều tham chiếu trong cùng một hàm `void` để trả về đồng thời nhiều kết quả.\n* **Mô tả:** Viết hàm `void chuyenDoiThoiGian(long long tongGiay, int &gio, int &phut, int &giay)`:\n  * Quy đổi tổng số giây thành: số giờ, số phút và số giây còn lại.\n  * Trong `main()`, nhập số nguyên không âm `tongGiay` (0 <= tongGiay <= 10^9).\n  * In ra định dạng chuẩn `HH:MM:SS` (nếu giá trị nhỏ hơn 10 thì đệm thêm số `0` ở đầu).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên không âm tongGiay (0 <= tongGiay <= 10^9).\n* **Đầu ra (Output):** Chuỗi thời gian định dạng `HH:MM:SS`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3665\n```\n\n**Khung Đầu ra (Output):**\n```text\n01:01:05\n```\n\n**Giải thích chi tiết:**\n* 3665 giây = 1 giờ (3600s) + 1 phút (60s) + 5 giây -> `01:01:05`.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <iomanip>\n\n  void chuyenDoiThoiGian(long long tongGiay, int &gio, int &phut, int &giay) {\n      gio = static_cast<int>(tongGiay / 3600);\n      long long du = tongGiay % 3600;\n      phut = static_cast<int>(du / 60);\n      giay = static_cast<int>(du % 60);\n  }\n\n  int main() {\n      long long tongGiay = 0;\n      std::cin >> tongGiay;\n\n      int h = 0, m = 0, s = 0;\n      chuyenDoiThoiGian(tongGiay, h, m, s);\n\n      std::cout << std::setfill('0') << std::setw(2) << h << \":\"\n                << std::setfill('0') << std::setw(2) << m << \":\"\n                << std::setfill('0') << std::setw(2) << s << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "3665\n",
                expectedOutput: "01:01:05\n",
                isHidden: false
            },
            {
                input: "0\n",
                expectedOutput: "00:00:00\n",
                isHidden: false
            },
            {
                input: "59\n",
                expectedOutput: "00:00:59\n",
                isHidden: true
            },
            {
                input: "3600\n",
                expectedOutput: "01:00:00\n",
                isHidden: true
            },
            {
                input: "86400\n",
                expectedOutput: "24:00:00\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Ước Chung Lớn Nhất (UCLN) Bằng Đệ Quy Euclid",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Cài đặt thuật toán Euclid kinh điển bằng tư duy đệ quy gọn gàng.\n* **Mô tả:** Viết hàm đệ quy `long long ucln(long long a, long long b)`:\n  * Nếu b == 0, trả về a.\n  * Ngược lại, trả về ucln(b, a % b).\n  * Viết hàm `long long bcnn(long long a, long long b)` tính bội chung nhỏ nhất dựa trên hàm ucln: (a / ucln(a, b)) * b.\n  * Trong `main()`, nhập hai số nguyên dương a và b (1 <= a, b <= 10^12). In ra UCLN và BCNN cách nhau bởi một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số nguyên dương a và b cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Hai số nguyên tương ứng là UCLN và BCNN.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n24 36\n```\n\n**Khung Đầu ra (Output):**\n```text\n12 72\n```\n\n**Giải thích chi tiết:**\n* UCLN(24, 36) = 12. BCNN(24, 36) = (24 / 12) * 36 = 72.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  long long ucln(long long a, long long b) {\n      if (b == 0) return a;\n      return ucln(b, a % b);\n  }\n\n  long long bcnn(long long a, long long b) {\n      return (a / ucln(a, b)) * b;\n  }\n\n  int main() {\n      long long a = 0, b = 0;\n      std::cin >> a >> b;\n\n      std::cout << ucln(a, b) << \" \" << bcnn(a, b) << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "24 36\n",
                expectedOutput: "12 72\n",
                isHidden: false
            },
            {
                input: "17 19\n",
                expectedOutput: "1 323\n",
                isHidden: false
            },
            {
                input: "100 100\n",
                expectedOutput: "100 100\n",
                isHidden: true
            },
            {
                input: "123456 654321\n",
                expectedOutput: "3 26926617792\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đệ Quy Fibonacci và Đếm Số Lời Gọi Hàm Kích Hoạt",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Trực quan hóa cây đệ quy và đo lường chi phí gọi hàm bằng tham chiếu đếm.\n* **Mô tả:** Viết hàm đệ quy `long long fibo(int n, int &soLoiGoi)` tính số Fibonacci:\n  * Mỗi khi hàm được gọi, tăng `soLoiGoi` lên 1 đơn vị.\n  * Nếu n == 0, trả về 0.\n  * Nếu n == 1, trả về 1.\n  * Ngược lại, trả về fibo(n - 1, soLoiGoi) + fibo(n - 2, soLoiGoi).\n  * Trong `main()`, nhập số nguyên n (0 <= n <= 25). In ra giá trị F(n) và tổng số lời gọi hàm đã kích hoạt, cách nhau bởi một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên n (0 <= n <= 25).\n* **Đầu ra (Output):** Hai số nguyên: giá trị F(n) và số lời gọi hàm.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n```\n\n**Khung Đầu ra (Output):**\n```text\n5 15\n```\n\n**Giải thích chi tiết:**\n* F(5) = 5. Để tính F(5) theo đệ quy thuần túy, hàm fibo được gọi tổng cộng 15 lần (cây đệ quy nhị phân).",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  long long fibo(int n, int &soLoiGoi) {\n      soLoiGoi++;\n      if (n == 0) return 0;\n      if (n == 1) return 1;\n      return fibo(n - 1, soLoiGoi) + fibo(n - 2, soLoiGoi);\n  }\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      int soLoiGoi = 0;\n      long long fn = fibo(n, soLoiGoi);\n\n      std::cout << fn << \" \" << soLoiGoi << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n",
                expectedOutput: "5 15\n",
                isHidden: false
            },
            {
                input: "0\n",
                expectedOutput: "0 1\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "1 1\n",
                isHidden: true
            },
            {
                input: "10\n",
                expectedOutput: "55 177\n",
                isHidden: true
            },
            {
                input: "15\n",
                expectedOutput: "610 1973\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đệ Quy Lũy Thừa Nhanh Chia Để Trị (Modular Exponentiation)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Nắm vững giải thuật chia để trị (Divide and Conquer) với độ phức tạp O(log b) bằng hàm đệ quy.\n* **Mô tả:** Viết hàm đệ quy `long long luyThuaNhanh(long long a, long long b, long long m)` tính (a^b) % m:\n  * Nếu b == 0, trả về 1 % m.\n  * Tính half = luyThuaNhanh(a, b / 2, m).\n  * Tính res = (half * half) % m.\n  * Nếu b lẻ, res = (res * (a % m)) % m. Trả về res.\n  * Trong `main()`, nhập a, b, m (1 <= a, b, m <= 10^9). In ra kết quả (a^b) % m.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Ba số nguyên a, b, m cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Một số nguyên duy nhất là kết quả (a^b) % m.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 10 1000\n```\n\n**Khung Đầu ra (Output):**\n```text\n24\n```\n\n**Giải thích chi tiết:**\n* 2^10 = 1024. 1024 % 1000 = 24.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  long long luyThuaNhanh(long long a, long long b, long long m) {\n      if (b == 0) return 1 % m;\n      long long half = luyThuaNhanh(a, b / 2, m);\n      long long res = (half * half) % m;\n      if (b % 2 == 1) {\n          res = (res * (a % m)) % m;\n      }\n      return res;\n  }\n\n  int main() {\n      long long a = 0, b = 0, m = 0;\n      std::cin >> a >> b >> m;\n\n      std::cout << luyThuaNhanh(a, b, m) << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "2 10 1000\n",
                expectedOutput: "24\n",
                isHidden: false
            },
            {
                input: "3 5 100\n",
                expectedOutput: "43\n",
                isHidden: false
            },
            {
                input: "5 0 13\n",
                expectedOutput: "1\n",
                isHidden: true
            },
            {
                input: "7 13 1000000007\n",
                expectedOutput: "889009735\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Kiểm Tra Số Siêu Nguyên Tố Bằng Kỹ Thuật Phân Rã Hàm",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Áp dụng kỹ thuật phân rã bài toán (Modular Programming): chia bài toán phức tạp thành các hàm con độc lập.\n* **Mô tả:** Một số nguyên dương được gọi là Số siêu nguyên tố nếu bản thân nó là số nguyên tố, và khi ta lần lượt xóa bỏ chữ số tận cùng bên phải thì các số thu được vẫn luôn là số nguyên tố (ví dụ: 2393 -> 239 -> 23 -> 2 đều là số nguyên tố).\n  * Viết hàm `bool laNguyenTo(long long n)`.\n  * Viết hàm `bool laSieuNguyenTo(long long n)` (liên tục kiểm tra laNguyenTo(n) và chia nguyên n /= 10 cho đến khi n == 0).\n  * Trong `main()`, nhập số nguyên dương n (1 <= n <= 10^9). In ra `YES` nếu là số siêu nguyên tố, ngược lại in `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương n (1 <= n <= 10^9).\n* **Đầu ra (Output):** In ra `YES` hoặc `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2393\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* 2393 là số nguyên tố.\n* Bỏ chữ số cuối: 239 là số nguyên tố.\n* Bỏ tiếp: 23 là số nguyên tố.\n* Bỏ tiếp: 2 là số nguyên tố.\n* Do đó 2393 là số siêu nguyên tố.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  bool laNguyenTo(long long n) {\n      if (n < 2) return false;\n      for (long long i = 2; i * i <= n; ++i) {\n          if (n % i == 0) return false;\n      }\n      return true;\n  }\n\n  bool laSieuNguyenTo(long long n) {\n      if (n < 2) return false;\n      while (n > 0) {\n          if (!laNguyenTo(n)) return false;\n          n /= 10;\n      }\n      return true;\n  }\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      if (laSieuNguyenTo(n)) {\n          std::cout << \"YES\\n\";\n      } else {\n          std::cout << \"NO\\n\";\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "2393\n",
                expectedOutput: "YES\n",
                isHidden: false
            },
            {
                input: "233\n",
                expectedOutput: "YES\n",
                isHidden: false
            },
            {
                input: "2\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
            {
                input: "19\n",
                expectedOutput: "NO\n",
                isHidden: true
            },
            {
                input: "25\n",
                expectedOutput: "NO\n",
                isHidden: true
            },
            {
                input: "7331\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Phân Rã Rút Gọn Phân Số Bằng Hàm Tham Chiếu (simplifyFraction)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Viết hàm nhận 2 tham chiếu biến đổi trực tiếp tử số và mẫu số của phân số về dạng tối giản.\n* **Mô tả:** Viết hàm `void rutGonPhanSo(long long &tu, long long &mau)`:\n  * Tìm UCLN(|tu|, |mau|).\n  * Chia cả `tu` và `mau` cho UCLN.\n  * Chuẩn hóa dấu: nếu mẫu số âm (mau < 0), đổi dấu cả tử và mẫu để mẫu luôn dương.\n  * Trong `main()`, nhập tử số và mẫu số (mau != 0, -10^12 <= tu, mau <= 10^12).\n  * In ra dạng tu/mau nếu mau > 1, hoặc chỉ in tu nếu phân số rút gọn thành số nguyên (mau == 1).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số nguyên tu và mau cách nhau một khoảng trắng (mau != 0).\n* **Đầu ra (Output):** Dạng rút gọn của phân số.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n-18 -24\n```\n\n**Khung Đầu ra (Output):**\n```text\n3/4\n```\n\n**Giải thích chi tiết:**\n* -18 / -24 = 18 / 24. UCLN(18, 24) = 6. Chia cho 6 được 3/4.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <cmath>\n\n  long long timUCLN(long long a, long long b) {\n      a = std::abs(a);\n      b = std::abs(b);\n      while (b != 0) {\n          long long r = a % b;\n          a = b;\n          b = r;\n      }\n      return a;\n  }\n\n  void rutGonPhanSo(long long &tu, long long &mau) {\n      if (tu == 0) {\n          mau = 1;\n          return;\n      }\n      long long uc = timUCLN(tu, mau);\n      tu /= uc;\n      mau /= uc;\n      if (mau < 0) {\n          tu = -tu;\n          mau = -mau;\n      }\n  }\n\n  int main() {\n      long long tu = 0, mau = 1;\n      std::cin >> tu >> mau;\n\n      rutGonPhanSo(tu, mau);\n\n      if (mau == 1) {\n          std::cout << tu << '\\n';\n      } else {\n          std::cout << tu << \"/\" << mau << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "-18 -24\n",
                expectedOutput: "3/4\n",
                isHidden: false
            },
            {
                input: "10 5\n",
                expectedOutput: "2\n",
                isHidden: false
            },
            {
                input: "0 15\n",
                expectedOutput: "0\n",
                isHidden: true
            },
            {
                input: "7 13\n",
                expectedOutput: "7/13\n",
                isHidden: true
            },
            {
                input: "12 -18\n",
                expectedOutput: "-2/3\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đệ Quy In Dãy Số Nhị Phân của N (Không dùng Mảng)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Áp dụng đệ quy để đảo ngược thứ tự in tự nhiên của ngăn xếp (Stack frame) mà không cần dùng cấu trúc dữ liệu lưu trữ.\n* **Mô tả:** Viết hàm đệ quy `void inNhiPhan(long long n)`:\n  * Nếu n == 0, dừng.\n  * Gọi đệ quy inNhiPhan(n / 2).\n  * In ra n % 2.\n  * Trong `main()`, nhập số nguyên không âm n (0 <= n <= 10^18). Nếu n == 0, in ra `0`. Ngược lại gọi inNhiPhan(n) và xuống dòng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên không âm n (0 <= n <= 10^18).\n* **Đầu ra (Output):** Chuỗi các bit nhị phân của n.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n29\n```\n\n**Khung Đầu ra (Output):**\n```text\n11101\n```\n\n**Giải thích chi tiết:**\n* 29 = 16 + 8 + 4 + 1 -> Nhị phân: `11101`. Lời gọi đệ quy giúp in bit có trọng số cao nhất trước.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  void inNhiPhan(long long n) {\n      if (n == 0) return;\n      inNhiPhan(n / 2);\n      std::cout << (n % 2);\n  }\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      if (n == 0) {\n          std::cout << 0 << '\\n';\n      } else {\n          inNhiPhan(n);\n          std::cout << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "29\n",
                expectedOutput: "11101\n",
                isHidden: false
            },
            {
                input: "0\n",
                expectedOutput: "0\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "1\n",
                isHidden: true
            },
            {
                input: "2\n",
                expectedOutput: "10\n",
                isHidden: true
            },
            {
                input: "1024\n",
                expectedOutput: "10000000000\n",
                isHidden: true
            },
            {
                input: "1000000\n",
                expectedOutput: "11110100001001000000\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Nạp Chồng Hàm Tính Diện Tích Hình Học Đa Dạng",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Nạp chồng hàm với số lượng tham số khác nhau để tính toán diện tích nhiều loại hình học khác nhau.\n* **Mô tả:** Viết 3 hàm nạp chồng `double tinhDienTich`:\n  1. `double tinhDienTich(double r)`: Diện tích hình tròn bán kính r (S = PI * r * r, dùng PI = 3.1415926535).\n  2. `double tinhDienTich(double dai, double rong)`: Diện tích hình chữ nhật (S = dai * rong).\n  3. `double tinhDienTich(double a, double b, double c)`: Diện tích tam giác theo công thức Heron với p = (a + b + c) / 2 và S = canBacHai(p * (p - a) * (p - b) * (p - c)).\n  * Trong `main()`, đọc ký tự `loaiHinh`:\n    * 'C' (Circle): đọc tiếp r, in diện tích hình tròn.\n    * 'R' (Rectangle): đọc tiếp dai, rong, in diện tích hình chữ nhật.\n    * 'T' (Triangle): đọc tiếp a, b, c, in diện tích tam giác.\n    * Kết quả in lấy chính xác 2 chữ số thập phân.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Ký tự đại diện cho loại hình và các tham số kích thước tương ứng.\n* **Đầu ra (Output):** Một số thực là diện tích với 2 chữ số thập phân.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nT 3 4 5\n```\n\n**Khung Đầu ra (Output):**\n```text\n6.00\n```\n\n**Giải thích chi tiết:**\n* Tam giác có 3 cạnh 3, 4, 5 có nửa chu vi p = 6. S = canBacHai(6 * 3 * 2 * 1) = 6.00.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <iomanip>\n  #include <cmath>\n\n  const double PI = 3.1415926535;\n\n  double tinhDienTich(double r) {\n      return PI * r * r;\n  }\n\n  double tinhDienTich(double dai, double rong) {\n      return dai * rong;\n  }\n\n  double tinhDienTich(double a, double b, double c) {\n      double p = (a + b + c) / 2.0;\n      return std::sqrt(p * (p - a) * (p - b) * (p - c));\n  }\n\n  int main() {\n      char loaiHinh;\n      std::cin >> loaiHinh;\n\n      if (loaiHinh == 'C') {\n          double r = 0;\n          std::cin >> r;\n          std::cout << std::fixed << std::setprecision(2) << tinhDienTich(r) << '\\n';\n      } else if (loaiHinh == 'R') {\n          double dai = 0, rong = 0;\n          std::cin >> dai >> rong;\n          std::cout << std::fixed << std::setprecision(2) << tinhDienTich(dai, rong) << '\\n';\n      } else if (loaiHinh == 'T') {\n          double a = 0, b = 0, c = 0;\n          std::cin >> a >> b >> c;\n          std::cout << std::fixed << std::setprecision(2) << tinhDienTich(a, b, c) << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "T 3 4 5\n",
                expectedOutput: "6.00\n",
                isHidden: false
            },
            {
                input: "C 5.0\n",
                expectedOutput: "78.54\n",
                isHidden: false
            },
            {
                input: "R 4.5 2.0\n",
                expectedOutput: "9.00\n",
                isHidden: true
            },
            {
                input: "T 6 8 10\n",
                expectedOutput: "24.00\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đệ Quy Đảo Ngược Số Nguyên (recursiveReverseNumber)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Áp dụng đệ quy đuôi (Tail Recursion) với tham số tích lũy có giá trị mặc định (default argument).\n* **Mô tả:** Viết hàm đệ quy `long long daoNguoc(long long n, long long res = 0)`:\n  * Nếu n == 0, trả về res.\n  * Ngược lại, gọi đệ quy daoNguoc(n / 10, res * 10 + (n % 10)).\n  * Trong `main()`, nhập số nguyên dương n (1 <= n <= 10^18). Gọi hàm và in số nguyên đảo ngược ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương n (1 <= n <= 10^18).\n* **Đầu ra (Output):** Số đảo ngược của n.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n123456789\n```\n\n**Khung Đầu ra (Output):**\n```text\n987654321\n```\n\n**Giải thích chi tiết:**\n* Qua các bước đệ quy, chữ số tận cùng được chuyển lên đầu của biến tích lũy res.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  long long daoNguoc(long long n, long long res = 0) {\n      if (n == 0) return res;\n      return daoNguoc(n / 10, res * 10 + (n % 10));\n  }\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      std::cout << daoNguoc(n) << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "123456789\n",
                expectedOutput: "987654321\n",
                isHidden: false
            },
            {
                input: "1000\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "5\n",
                expectedOutput: "5\n",
                isHidden: true
            },
            {
                input: "1204500\n",
                expectedOutput: "54021\n",
                isHidden: true
            },
            {
                input: "9876543210\n",
                expectedOutput: "123456789\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Hàm Giải Hệ Phương Trình Bậc Nhất 2 Ẩn Bằng Định Thức Cramer",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Tách bạch thuật toán giải hệ phương trình tuyến tính qua hàm chuyên dụng và trả về nghiệm qua 2 tham chiếu `double &x, double &y`.\n* **Mô tả:** Hệ phương trình bậc nhất 2 ẩn có dạng:\n  * Phương trình 1: a1 * x + b1 * y = c1\n  * Phương trình 2: a2 * x + b2 * y = c2\n  Định thức Cramer:\n  * D = a1 * b2 - a2 * b1\n  * Dx = c1 * b2 - c2 * b1\n  * Dy = a1 * c2 - a2 * c1\n  Viết hàm `int giaiHePhuongTrinh(double a1, double b1, double c1, double a2, double b2, double c2, double &x, double &y)`:\n    * Nếu D != 0: có nghiệm duy nhất x = Dx / D, y = Dy / D, trả về 1.\n    * Nếu D == 0:\n      * Nếu Dx == 0 và Dy == 0: trả về -1 (vô số nghiệm).\n      * Ngược lại: trả về 0 (vô nghiệm).\n  * Trong `main()`, nhập 6 hệ số a1, b1, c1, a2, b2, c2.\n    * Trả về 1: in `x y` với 2 chữ số thập phân.\n    * Trả về 0: in `VO NGHIEM`.\n    * Trả về -1: in `VO SO NGHIEM`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** 6 số thực a1, b1, c1, a2, b2, c2 cách nhau bởi dấu cách.\n* **Đầu ra (Output):** Nghiệm của hệ hoặc thông báo trạng thái.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 1 4 1 -1 1\n```\n\n**Khung Đầu ra (Output):**\n```text\n1.67 0.67\n```\n\n**Giải thích chi tiết:**\n* 2x + y = 4 và x - y = 1 => 3x = 5 => x = 5/3 = 1.67, y = 2/3 = 0.67.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <iomanip>\n  #include <cmath>\n\n  int giaiHePhuongTrinh(double a1, double b1, double c1,\n                         double a2, double b2, double c2,\n                         double &x, double &y) {\n      double D = a1 * b2 - a2 * b1;\n      double Dx = c1 * b2 - c2 * b1;\n      double Dy = a1 * c2 - a2 * c1;\n\n      if (std::abs(D) > 1e-9) {\n          x = Dx / D;\n          y = Dy / D;\n          if (std::abs(x) < 1e-9) x = 0.0;\n          if (std::abs(y) < 1e-9) y = 0.0;\n          return 1;\n      }\n\n      if (std::abs(Dx) < 1e-9 && std::abs(Dy) < 1e-9) {\n          return -1; // V\u00f4 s\u1ed1 nghi\u1ec7m\n      }\n      return 0; // V\u00f4 nghi\u1ec7m\n  }\n\n  int main() {\n      double a1, b1, c1, a2, b2, c2;\n      std::cin >> a1 >> b1 >> c1 >> a2 >> b2 >> c2;\n\n      double x = 0, y = 0;\n      int trangThai = giaiHePhuongTrinh(a1, b1, c1, a2, b2, c2, x, y);\n\n      if (trangThai == 1) {\n          std::cout << std::fixed << std::setprecision(2) << x << \" \" << y << '\\n';\n      } else if (trangThai == 0) {\n          std::cout << \"VO NGHIEM\\n\";\n      } else {\n          std::cout << \"VO SO NGHIEM\\n\";\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "2 1 4 1 -1 1\n",
                expectedOutput: "1.67 0.67\n",
                isHidden: false
            },
            {
                input: "1 1 5 2 2 10\n",
                expectedOutput: "VO SO NGHIEM\n",
                isHidden: false
            },
            {
                input: "1 1 5 1 1 7\n",
                expectedOutput: "VO NGHIEM\n",
                isHidden: true
            },
            {
                input: "3 2 12 1 -1 1\n",
                expectedOutput: "2.80 1.80\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đệ Quy Tính Tổ Hợp Chập K của N (Pascal Combination)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Cài đặt tính tổ hợp C(n, k) bằng hệ thức đệ quy Pascal C(n, k) = C(n - 1, k - 1) + C(n - 1, k).\n* **Mô tả:** Viết hàm đệ quy `long long toHop(int n, int k)`:\n  * Nếu k == 0 hoặc k == n, trả về 1.\n  * Nếu k > n, trả về 0.\n  * Ngược lại, trả về toHop(n - 1, k - 1) + toHop(n - 1, k).\n  * Trong `main()`, nhập hai số nguyên n và k (0 <= k <= n <= 25). In ra giá trị của C(n, k).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số nguyên n và k cách nhau một khoảng trắng (0 <= k <= n <= 25).\n* **Đầu ra (Output):** Giá trị tổ hợp C(n, k).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6 2\n```\n\n**Khung Đầu ra (Output):**\n```text\n15\n```\n\n**Giải thích chi tiết:**\n* C(6, 2) = 6! / (2! * 4!) = 30 / 2 = 15.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  long long toHop(int n, int k) {\n      if (k == 0 || k == n) return 1;\n      if (k > n) return 0;\n      return toHop(n - 1, k - 1) + toHop(n - 1, k);\n  }\n\n  int main() {\n      int n = 0, k = 0;\n      std::cin >> n >> k;\n\n      std::cout << toHop(n, k) << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6 2\n",
                expectedOutput: "15\n",
                isHidden: false
            },
            {
                input: "5 0\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "5 5\n",
                expectedOutput: "1\n",
                isHidden: true
            },
            {
                input: "10 4\n",
                expectedOutput: "210\n",
                isHidden: true
            },
            {
                input: "20 10\n",
                expectedOutput: "184756\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Bài Toán Tháp Hà Nội (Tower of Hanoi)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Nắm vững giải thuật đệ quy phân rã kinh điển của bài toán Tháp Hà Nội.\n* **Mô tả:** Có 3 cọc A, B, C và N chiếc đĩa kích thước khác nhau xếp chồng lên cọc A theo thứ tự nhỏ ở trên, lớn ở dưới. Cần chuyển toàn bộ đĩa sang cọc C với cọc B làm trung gian, tuân theo quy tắc: mỗi lần chỉ chuyển 1 đĩa và không bao giờ đặt đĩa lớn lên trên đĩa nhỏ.\n  * Viết hàm đệ quy `void thapHaNoi(int n, char nguon, char dich, char trungGian, int &soBuoc)`:\n    * Chuyển n - 1 đĩa từ nguon sang trungGian.\n    * Chuyển đĩa thứ n từ nguon sang dich: in ra dòng `nguon -> dich` và tăng soBuoc.\n    * Chuyển n - 1 đĩa từ trungGian sang dich.\n  * Trong `main()`, nhập N (1 <= N <= 10).\n    * In từng bước chuyển đĩa theo định dạng `A -> C` trên từng dòng.\n    * Dòng cuối cùng in tổng số bước đã thực hiện.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10).\n* **Đầu ra (Output):** Các bước chuyển đĩa và tổng số bước ở dòng cuối cùng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3\n```\n\n**Khung Đầu ra (Output):**\n```text\nA -> C\nA -> B\nC -> B\nA -> C\nB -> A\nB -> C\nA -> C\n7\n```\n\n**Giải thích chi tiết:**\n* Với 3 đĩa, số bước tối thiểu cần thực hiện là 2^3 - 1 = 7 bước.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  void thapHaNoi(int n, char nguon, char dich, char trungGian, int &soBuoc) {\n      if (n == 1) {\n          std::cout << nguon << \" -> \" << dich << '\\n';\n          soBuoc++;\n          return;\n      }\n      thapHaNoi(n - 1, nguon, trungGian, dich, soBuoc);\n      std::cout << nguon << \" -> \" << dich << '\\n';\n      soBuoc++;\n      thapHaNoi(n - 1, trungGian, dich, nguon, soBuoc);\n  }\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      int soBuoc = 0;\n      thapHaNoi(n, 'A', 'C', 'B', soBuoc);\n      std::cout << soBuoc << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "3\n",
                expectedOutput: "A -> C\nA -> B\nC -> B\nA -> C\nB -> A\nB -> C\nA -> C\n7\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "A -> C\n1\n",
                isHidden: false
            },
            {
                input: "2\n",
                expectedOutput: "A -> B\nA -> C\nB -> C\n3\n",
                isHidden: true
            },
            {
                input: "4\n",
                expectedOutput: "A -> B\nA -> C\nB -> C\nA -> B\nC -> A\nC -> B\nA -> B\nA -> C\nB -> C\nB -> A\nC -> A\nB -> C\nA -> B\nA -> C\nB -> C\n15\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Thuật Toán Euclid Mở Rộng Bằng Hàm Đệ Quy (Extended Euclidean)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Vận dụng đệ quy truy ngược tham chiếu để tìm hệ số Bezout (x, y) thỏa mãn đẳng thức a * x + b * y = UCLN(a, b).\n* **Mô tả:** Viết hàm đệ quy `long long euclidMoRong(long long a, long long b, long long &x, long long &y)`:\n  * Nếu b == 0, gán x = 1, y = 0 và trả về a.\n  * Ngược lại, gọi đệ quy `long long g = euclidMoRong(b, a % b, x1, y1)`.\n  * Cập nhật: x = y1, y = x1 - (a / b) * y1. Trả về g.\n  * Trong `main()`, nhập hai số nguyên dương a và b (1 <= a, b <= 10^9).\n  * In ra g, x, y cách nhau bởi dấu cách (với g là UCLN của a và b).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số nguyên dương a và b cách nhau một khoảng trắng (1 <= a, b <= 10^9).\n* **Đầu ra (Output):** Ba số nguyên g, x, y cách nhau bởi dấu cách.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n30 20\n```\n\n**Khung Đầu ra (Output):**\n```text\n10 1 -1\n```\n\n**Giải thích chi tiết:**\n* UCLN(30, 20) = 10. Hệ số x = 1, y = -1 vì 30 * 1 + 20 * (-1) = 10.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  long long euclidMoRong(long long a, long long b, long long &x, long long &y) {\n      if (b == 0) {\n          x = 1;\n          y = 0;\n          return a;\n      }\n      long long x1 = 0, y1 = 0;\n      long long g = euclidMoRong(b, a % b, x1, y1);\n      x = y1;\n      y = x1 - (a / b) * y1;\n      return g;\n  }\n\n  int main() {\n      long long a = 0, b = 0;\n      std::cin >> a >> b;\n\n      long long x = 0, y = 0;\n      long long g = euclidMoRong(a, b, x, y);\n\n      std::cout << g << \" \" << x << \" \" << y << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "30 20\n",
                expectedOutput: "10 1 -1\n",
                isHidden: false
            },
            {
                input: "15 35\n",
                expectedOutput: "5 -2 1\n",
                isHidden: false
            },
            {
                input: "17 19\n",
                expectedOutput: "1 9 -8\n",
                isHidden: true
            },
            {
                input: "100 25\n",
                expectedOutput: "25 0 1\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đếm Số Cách Bước Lên Cầu Thang (Staircase Problem)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Áp dụng tư duy chia bài toán thành các bài toán con và tối ưu đệ quy với biến trượt để tính toán trong O(N) mà không dùng mảng.\n* **Mô tả:** Một chiếc cầu thang có N bậc. Mỗi bước bạn có thể bước lên 1 bậc hoặc 2 bậc.\n  * Viết hàm `long long demCachBuoc(int n)`:\n    * Trả về số cách khác nhau để bước lên đỉnh của cầu thang gồm N bậc.\n    * Quy ước: với N = 1 có 1 cách, N = 2 có 2 cách (1+1 hoặc 2). Với N >= 3, số cách bằng tổng số cách của N - 1 và N - 2.\n    * Để hàm chạy nhanh với N <= 45 trong O(N), sử dụng kỹ thuật đệ quy có truyền tích lũy hoặc vòng lặp nội bộ trong hàm.\n  * Trong `main()`, nhập N (1 <= N <= 45). In ra số cách bước lên cầu thang.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 45).\n* **Đầu ra (Output):** Số cách bước lên cầu thang.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n4\n```\n\n**Khung Đầu ra (Output):**\n```text\n5\n```\n\n**Giải thích chi tiết:**\n* Với 4 bậc: (1+1+1+1), (1+1+2), (1+2+1), (2+1+1), (2+2) -> Tổng cộng 5 cách.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  long long demCachBuoc(int n, long long a = 1, long long b = 2) {\n      if (n == 1) return a;\n      if (n == 2) return b;\n      for (int i = 3; i <= n; ++i) {\n          long long c = a + b;\n          a = b;\n          b = c;\n      }\n      return b;\n  }\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      std::cout << demCachBuoc(n) << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "4\n",
                expectedOutput: "5\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "2\n",
                expectedOutput: "2\n",
                isHidden: true
            },
            {
                input: "10\n",
                expectedOutput: "89\n",
                isHidden: true
            },
            {
                input: "20\n",
                expectedOutput: "10946\n",
                isHidden: true
            },
            {
                input: "35\n",
                expectedOutput: "14930352\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Hàm Ackermann (Ackermann Function)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Trải nghiệm hàm đệ quy không sơ cấp (non-primitive recursive) nổi tiếng trong lý thuyết độ phức tạp tính toán.\n* **Mô tả:** Hàm Ackermann A(m, n) được định nghĩa đệ quy như sau:\n  * A(0, n) = n + 1\n  * A(m, 0) = A(m - 1, 1) với m > 0\n  * A(m, n) = A(m - 1, A(m, n - 1)) với m > 0 và n > 0.\n  * Viết hàm đệ quy `long long ackermann(long long m, long long n)`.\n  * Trong `main()`, nhập hai số nguyên m và n (0 <= m <= 3, 0 <= n <= 10). In ra giá trị của A(m, n).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số nguyên không âm m và n cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Giá trị A(m, n).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 3\n```\n\n**Khung Đầu ra (Output):**\n```text\n9\n```\n\n**Giải thích chi tiết:**\n* A(2, 3) = A(1, A(2, 2)) = ... = 2 * 3 + 3 = 9.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  long long ackermann(long long m, long long n) {\n      if (m == 0) return n + 1;\n      if (m > 0 && n == 0) return ackermann(m - 1, 1);\n      return ackermann(m - 1, ackermann(m, n - 1));\n  }\n\n  int main() {\n      long long m = 0, n = 0;\n      std::cin >> m >> n;\n\n      std::cout << ackermann(m, n) << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "2 3\n",
                expectedOutput: "9\n",
                isHidden: false
            },
            {
                input: "0 5\n",
                expectedOutput: "6\n",
                isHidden: false
            },
            {
                input: "1 4\n",
                expectedOutput: "6\n",
                isHidden: true
            },
            {
                input: "3 3\n",
                expectedOutput: "61\n",
                isHidden: true
            },
            {
                input: "3 4\n",
                expectedOutput: "125\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Phân Rã Kiểm Tra Số Thuần Nguyên Tố (Pure Prime)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Luyện tập thiết kế kiến trúc phân rã thành nhiều hàm con chuyên trách rõ ràng.\n* **Mô tả:** Một số nguyên dương được gọi là Số thuần nguyên tố nếu nó thỏa mãn đồng thời 3 điều kiện:\n  1. Bản thân nó là số nguyên tố.\n  2. Tất cả các chữ số của nó đều là số nguyên tố (chỉ chứa các chữ số: 2, 3, 5, 7).\n  3. Tổng tất cả các chữ số của nó cũng là một số nguyên tố.\n  * Hãy xây dựng các hàm độc lập:\n    * `bool laNguyenTo(long long n)`\n    * `bool cacChuSoLaNguyenTo(long long n)`\n    * `long long tinhTongChuSo(long long n)`\n    * `bool laThuanNguyenTo(long long n)`\n  * Trong `main()`, nhập hai số nguyên A và B (1 <= A <= B <= 10^5). Đếm xem có bao nhiêu số thuần nguyên tố trong đoạn [A, B].\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số nguyên A và B cách nhau bởi dấu cách.\n* **Đầu ra (Output):** Số lượng số thuần nguyên tố trong đoạn [A, B].\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n1 100\n```\n\n**Khung Đầu ra (Output):**\n```text\n4\n```\n\n**Giải thích chi tiết:**\n* Trong khoảng [1, 100], có 4 số thuần nguyên tố là: 23, 37, 53, 73.",
        starterCode: "#include <iostream>\n\n// \u0110\u1ecbnh ngh\u0129a h\u00e0m x\u1eed l\u00fd c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  bool laNguyenTo(long long n) {\n      if (n < 2) return false;\n      for (long long i = 2; i * i <= n; ++i) {\n          if (n % i == 0) return false;\n      }\n      return true;\n  }\n\n  bool cacChuSoLaNguyenTo(long long n) {\n      while (n > 0) {\n          int d = n % 10;\n          if (d != 2 && d != 3 && d != 5 && d != 7) return false;\n          n /= 10;\n      }\n      return true;\n  }\n\n  long long tinhTongChuSo(long long n) {\n      long long sum = 0;\n      while (n > 0) {\n          sum += (n % 10);\n          n /= 10;\n      }\n      return sum;\n  }\n\n  bool laThuanNguyenTo(long long n) {\n      return cacChuSoLaNguyenTo(n) && laNguyenTo(tinhTongChuSo(n)) && laNguyenTo(n);\n  }\n\n  int main() {\n      long long a = 0, b = 0;\n      std::cin >> a >> b;\n\n      int dem = 0;\n      for (long long i = a; i <= b; ++i) {\n          if (laThuanNguyenTo(i)) dem++;\n      }\n\n      std::cout << dem << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "1 100\n",
                expectedOutput: "5\n",
                isHidden: false
            },
            {
                input: "100 500\n",
                expectedOutput: "5\n",
                isHidden: false
            },
            {
                input: "20 80\n",
                expectedOutput: "1\n",
                isHidden: true
            },
            {
                input: "1 1000\n",
                expectedOutput: "15\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đệ Quy Mô Phỏng Dãy Collatz và Tìm Đỉnh Cực Đại",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Dùng hàm đệ quy để biến đổi trạng thái số học và truyền tham chiếu theo dõi biến số lớn nhất đạt được.\n* **Mô tả:** Viết hàm đệ quy `void collatz(long long n, long long &soBuoc, long long &maxVal)`:\n  * Cập nhật: nếu n > maxVal thì maxVal = n.\n  * Nếu n == 1, dừng đệ quy.\n  * Tăng soBuoc lên 1 đơn vị.\n  * Nếu n chẵn: gọi đệ quy collatz(n / 2, soBuoc, maxVal).\n  * Nếu n lẻ: gọi đệ quy collatz(3 * n + 1, soBuoc, maxVal).\n  * Trong `main()`, nhập số nguyên dương n (1 <= n <= 10^6). In ra số bước và giá trị cực đại đạt được, cách nhau một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương n (1 <= n <= 10^6).\n* **Đầu ra (Output):** Hai số nguyên: số bước biến đổi và giá trị cực đại.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n7\n```\n\n**Khung Đầu ra (Output):**\n```text\n16 52\n```\n\n**Giải thích chi tiết:**\n* Từ 7 mất 16 bước đệ quy để về 1, đỉnh lớn nhất đạt được trong dãy là 52.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  void collatz(long long n, long long &soBuoc, long long &maxVal) {\n      if (n > maxVal) maxVal = n;\n      if (n == 1) return;\n      soBuoc++;\n      if (n % 2 == 0) {\n          collatz(n / 2, soBuoc, maxVal);\n      } else {\n          collatz(3 * n + 1, soBuoc, maxVal);\n      }\n  }\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      long long soBuoc = 0;\n      long long maxVal = n;\n      collatz(n, soBuoc, maxVal);\n\n      std::cout << soBuoc << \" \" << maxVal << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "7\n",
                expectedOutput: "16 52\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "0 1\n",
                isHidden: false
            },
            {
                input: "6\n",
                expectedOutput: "8 16\n",
                isHidden: true
            },
            {
                input: "19\n",
                expectedOutput: "20 88\n",
                isHidden: true
            },
            {
                input: "27\n",
                expectedOutput: "111 9232\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đệ Quy Tính Căn Bậc Hai Bằng Phương Pháp Newton-Raphson",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Cài đặt phương pháp lặp xấp xỉ số học nổi tiếng bằng hàm đệ quy với điều kiện dừng theo sai số.\n* **Mô tả:** Phương pháp Newton-Raphson tìm căn bậc hai của số dương S:\n  * Bắt đầu với phỏng đoán ban đầu x_0 = S.\n  * Công thức lặp: nextX = (x + S / x) / 2.0.\n  * Quá trình dừng khi |nextX - x| < 1e-7.\n  * Viết hàm đệ quy `double canBacHaiNewton(double s, double x)`:\n    * Tính nextX = (x + s / x) / 2.0.\n    * Nếu |nextX - x| < 1e-7, trả về nextX.\n    * Ngược lại, gọi đệ quy canBacHaiNewton(s, nextX).\n  * Trong `main()`, nhập số thực dương S (0 < S <= 10^9). In kết quả căn bậc hai với 5 chữ số thập phân.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số thực dương S.\n* **Đầu ra (Output):** Giá trị căn bậc hai của S với 5 chữ số thập phân.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n10.0\n```\n\n**Khung Đầu ra (Output):**\n```text\n3.16228\n```\n\n**Giải thích chi tiết:**\n* canBacHai(10) xấp xỉ 3.16227766..., làm tròn 5 chữ số thập phân là 3.16228.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <iomanip>\n  #include <cmath>\n\n  double canBacHaiNewton(double s, double x) {\n      double nextX = (x + s / x) / 2.0;\n      if (std::abs(nextX - x) < 1e-7) {\n          return nextX;\n      }\n      return canBacHaiNewton(s, nextX);\n  }\n\n  int main() {\n      double s = 0;\n      std::cin >> s;\n\n      double kq = canBacHaiNewton(s, s);\n\n      std::cout << std::fixed << std::setprecision(5) << kq << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "10.0\n",
                expectedOutput: "3.16228\n",
                isHidden: false
            },
            {
                input: "2.0\n",
                expectedOutput: "1.41421\n",
                isHidden: false
            },
            {
                input: "25.0\n",
                expectedOutput: "5.00000\n",
                isHidden: true
            },
            {
                input: "100.0\n",
                expectedOutput: "10.00000\n",
                isHidden: true
            },
            {
                input: "0.5\n",
                expectedOutput: "0.70711\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đệ Quy Đếm Số Lượng Số Có Tổng Chữ Số Bằng S",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Kết hợp hàm tính tổng chữ số đệ quy với vòng lặp duyệt đoạn để giải quyết bài toán đếm số học.\n* **Mô tả:** Viết hàm đệ quy `int tongChuSo(long long n)`:\n  * Trả về tổng các chữ số của n.\n  * Trong `main()`, nhập ba số nguyên A, B và S (1 <= A <= B <= 10^6, 1 <= S <= 60).\n  * Hãy đếm xem có bao nhiêu số nguyên trong đoạn [A, B] có tổng các chữ số đúng bằng S.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Ba số nguyên A, B, S cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Số lượng số thỏa mãn điều kiện.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n1 100 10\n```\n\n**Khung Đầu ra (Output):**\n```text\n9\n```\n\n**Giải thích chi tiết:**\n* Các số <= 100 có tổng chữ số bằng 10 là: 19, 28, 37, 46, 55, 64, 73, 82, 91 (tổng cộng 9 số).",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int tongChuSo(long long n) {\n      if (n < 10) return static_cast<int>(n);\n      return static_cast<int>(n % 10) + tongChuSo(n / 10);\n  }\n\n  int main() {\n      long long a = 0, b = 0;\n      int s = 0;\n      std::cin >> a >> b >> s;\n\n      int dem = 0;\n      for (long long i = a; i <= b; ++i) {\n          if (tongChuSo(i) == s) dem++;\n      }\n\n      std::cout << dem << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "1 100 10\n",
                expectedOutput: "9\n",
                isHidden: false
            },
            {
                input: "1 50 5\n",
                expectedOutput: "6\n",
                isHidden: false
            },
            {
                input: "100 200 9\n",
                expectedOutput: "9\n",
                isHidden: true
            },
            {
                input: "1 1000 1\n",
                expectedOutput: "4\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đệ Quy Kiểm Tra Dãy Dấu Ngoặc Hợp Lệ Dạng Chuỗi (Không dùng Stack)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Vận dụng truyền tham chiếu hằng chuỗi ký tự (`const std::string &`) kết hợp con trỏ chỉ số đệ quy để giải quyết bài toán kiểm tra cú pháp.\n* **Mô tả:** Một chuỗi chỉ gồm các ký tự mở ngoặc '(' và đóng ngoặc ')' được gọi là hợp lệ nếu số dấu mở ngoặc luôn lớn hơn hoặc bằng số dấu đóng ngoặc tại mọi vị trí, và kết thúc chuỗi số mở ngoặc bằng số đóng ngoặc.\n  * Viết hàm đệ quy `bool kiemTraNgoac(const std::string &s, size_t index, int count)`:\n    * Nếu count < 0: trả về false (vi phạm cấu trúc đóng trước mở).\n    * Nếu index == s.length(): trả về count == 0.\n    * Nếu s[index] == '(': gọi đệ quy kiemTraNgoac(s, index + 1, count + 1).\n    * Nếu s[index] == ')': gọi đệ quy kiemTraNgoac(s, index + 1, count - 1).\n  * Trong `main()`, nhập chuỗi `s` độ dài từ 1 đến 100. In ra `YES` nếu chuỗi hợp lệ, ngược lại in `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một chuỗi ký tự s chỉ chứa '(' và ')'.\n* **Đầu ra (Output):** In ra `YES` hoặc `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n(())()\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* Dãy ngoặc đóng mở lồng nhau hoàn toàn hợp lệ.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <string>\n\n  bool kiemTraNgoac(const std::string &s, size_t index, int count) {\n      if (count < 0) return false;\n      if (index == s.length()) return count == 0;\n      if (s[index] == '(') {\n          return kiemTraNgoac(s, index + 1, count + 1);\n      } else if (s[index] == ')') {\n          return kiemTraNgoac(s, index + 1, count - 1);\n      }\n      return kiemTraNgoac(s, index + 1, count);\n  }\n\n  int main() {\n      std::string s;\n      std::cin >> s;\n\n      if (kiemTraNgoac(s, 0, 0)) {\n          std::cout << \"YES\\n\";\n      } else {\n          std::cout << \"NO\\n\";\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "(())()\n",
                expectedOutput: "YES\n",
                isHidden: false
            },
            {
                input: "(()\n",
                expectedOutput: "NO\n",
                isHidden: false
            },
            {
                input: ")(()\n",
                expectedOutput: "NO\n",
                isHidden: true
            },
            {
                input: "((()))\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
            {
                input: "()()()()\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đệ Quy Tìm Chữ Số Lớn Nhất Bằng Kỹ Thuật Chia Để Trị",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Áp dụng tư duy chia để trị (Divide and Conquer): phân rã số nguyên N và đệ quy tìm giá trị lớn nhất.\n* **Mô tả:** Viết hàm đệ quy `int chuSoLonNhat(long long n)`:\n  * Nếu n < 10, trả về n.\n  * Phân rã n: lấy chữ số cuối d = n % 10 và phần còn lại n / 10.\n  * Trả về giá trị lớn hơn giữa d và chuSoLonNhat(n / 10).\n  * Trong `main()`, nhập số nguyên dương N (1 <= N <= 10^18). In ra chữ số lớn nhất của N.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^18).\n* **Đầu ra (Output):** Một số nguyên từ 0 đến 9 là chữ số lớn nhất.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n382914\n```\n\n**Khung Đầu ra (Output):**\n```text\n9\n```\n\n**Giải thích chi tiết:**\n* Trong các chữ số {3, 8, 2, 9, 1, 4}, chữ số lớn nhất là 9.",
        starterCode: "#include <iostream>\n\n// Khai b\u00e1o ho\u1eb7c \u0111\u1ecbnh ngh\u0129a h\u00e0m \u0111\u1ec7 quy c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u, g\u1ecdi h\u00e0m v\u00e0 in k\u1ebft qu\u1ea3:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <algorithm>\n\n  int chuSoLonNhat(long long n) {\n      if (n < 10) return static_cast<int>(n);\n      int d = static_cast<int>(n % 10);\n      int maxTruoc = chuSoLonNhat(n / 10);\n      return (d > maxTruoc) ? d : maxTruoc;\n  }\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      std::cout << chuSoLonNhat(n) << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "382914\n",
                expectedOutput: "9\n",
                isHidden: false
            },
            {
                input: "5\n",
                expectedOutput: "5\n",
                isHidden: false
            },
            {
                input: "90\n",
                expectedOutput: "9\n",
                isHidden: true
            },
            {
                input: "100000\n",
                expectedOutput: "1\n",
                isHidden: true
            },
            {
                input: "987654321012345\n",
                expectedOutput: "9\n",
                isHidden: true
            },
        ]
    }

];

export async function seedCppModule4Practice() {
    console.log('🚀 Bắt đầu cập nhật toàn bộ 30 bài tập chuẩn hóa Module 4 C++ vào Database...');

    // 1. Tìm Module 4 của C++
    const module4 = await prisma.module.findUnique({
        where: { moduleId: 'CPP-MOD-04' }
    });

    if (!module4) {
        throw new Error('❌ Không tìm thấy Module 4 (CPP-MOD-04)!');
    }

    // 2. Tìm Chapter 4 của Module 4
    const chapter4 = await prisma.chapter.findFirst({
        where: {
            moduleId: module4.id,
            chapterId: 'CPP-CH-04'
        }
    });

    if (!chapter4) {
        throw new Error('❌ Không tìm thấy Chapter 4 của Module 4!');
    }

    // 3. Upsert bài học tổng hợp CPP-04.MP
    const lessonMp = await prisma.lesson.upsert({
        where: {
            id: 'c1b10000-0004-4000-8000-000000000001'
        },
        update: {
            lessonId: 'CPP-04.MP',
            title: 'Bài tập thực hành tổng hợp Module 4: Hàm và Kỹ thuật Phân rã Bài toán',
            objective: 'Hệ thống 30 bài tập rèn luyện chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức hàm (function), tham số, giá trị trả về, tham chiếu &, tham chiếu hằng const &, nạp chồng hàm, biến static và giải thuật đệ quy kinh điển của Module 4 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 90,
            isFree: true,
            orderIndex: 6,
            chapterId: chapter4.id,
            content: `# Bài tập thực hành tổng hợp Module 4: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 4: Hàm (Functions) và Kỹ thuật Phân rã Bài toán**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài làm chủ cú pháp khai báo, định nghĩa hàm, tham số, giá trị trả về, hoán vị tham chiếu &, tham chiếu hằng const &, nạp chồng hàm cơ bản, biến static và đệ quy khởi động.
* ⚔️ **Trung bình (Medium):** 10 bài phân rã bài toán đa hàm, Euclid đệ quy, Fibonacci và cây lời gọi đệ quy, lũy thừa nhanh chia để trị O(log B), rút gọn phân số tham chiếu, nạp chồng tính diện tích đa hình, giải hệ phương trình Cramer.
* 👑 **Khó / Thử thách (Hard):** 10 bài thuật toán đệ quy kinh điển: Tháp Hà Nội, Euclid mở rộng Bezout, bước cầu thang tối ưu O(N), hàm Ackermann, số thuần nguyên tố đa tầng, xấp xỉ Newton-Raphson và chia để trị.

Chúc bạn hoàn thành xuất sắc toàn bộ thử thách!`
        },
        create: {
            id: 'c1b10000-0004-4000-8000-000000000001',
            lessonId: 'CPP-04.MP',
            title: 'Bài tập thực hành tổng hợp Module 4: Hàm và Kỹ thuật Phân rã Bài toán',
            objective: 'Hệ thống 30 bài tập rèn luyện chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức hàm (function), tham số, giá trị trả về, tham chiếu &, tham chiếu hằng const &, nạp chồng hàm, biến static và giải thuật đệ quy kinh điển của Module 4 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 90,
            isFree: true,
            orderIndex: 6,
            chapterId: chapter4.id,
            content: `# Bài tập thực hành tổng hợp Module 4: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 4: Hàm (Functions) và Kỹ thuật Phân rã Bài toán**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài làm chủ cú pháp khai báo, định nghĩa hàm, tham số, giá trị trả về, hoán vị tham chiếu &, tham chiếu hằng const &, nạp chồng hàm cơ bản, biến static và đệ quy khởi động.
* ⚔️ **Trung bình (Medium):** 10 bài phân rã bài toán đa hàm, Euclid đệ quy, Fibonacci và cây lời gọi đệ quy, lũy thừa nhanh chia để trị O(log B), rút gọn phân số tham chiếu, nạp chồng tính diện tích đa hình, giải hệ phương trình Cramer.
* 👑 **Khó / Thử thách (Hard):** 10 bài thuật toán đệ quy kinh điển: Tháp Hà Nội, Euclid mở rộng Bezout, bước cầu thang tối ưu O(N), hàm Ackermann, số thuần nguyên tố đa tầng, xấp xỉ Newton-Raphson và chia để trị.

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

    console.log(`\n🎉 THÀNH CÔNG! Đã cập nhật xong ${successCount} bài tập thực hành Module 4 C++ lên Database!`);
}

seedCppModule4Practice()
    .catch((err) => {
        console.error('❌ Lỗi khi cập nhật bài tập Module 4 C++:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
