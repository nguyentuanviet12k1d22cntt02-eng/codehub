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
        title: "In Dãy Số Tự Nhiên từ 1 đến N",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Sử dụng vòng lặp `for` cơ bản với bước tăng biến đếm `++i` để duyệt qua dãy số nguyên.\n* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 1000). Hãy in ra các số tự nhiên từ 1 đến N trên cùng một dòng, mỗi số cách nhau một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 1000).\n* **Đầu ra (Output):** Dãy số từ 1 đến N cách nhau bởi dấu cách, kết thúc bằng ký tự xuống dòng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 2 3 4 5 6\n```\n\n**Giải thích chi tiết:**\n* Vòng lặp `for (int i = 1; i <= 6; ++i)` in lần lượt: 1, 2, 3, 4, 5, 6.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      for (int i = 1; i <= n; ++i) {\n          std::cout << i << (i == n ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6\n",
                expectedOutput: "1 2 3 4 5 6\n",
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
                input: "25\n",
                expectedOutput: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25\n",
                isHidden: true
            },
        ]
    },
    {
        title: "In Dãy Số Giảm Dần từ N về 1",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Làm chủ vòng lặp `for` đếm lùi với bước giảm biến đếm `--i`.\n* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 1000). Hãy in ra dãy số giảm dần từ N về 1, mỗi số cách nhau bởi một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 1000).\n* **Đầu ra (Output):** Dãy số từ N giảm dần về 1 cách nhau bởi dấu cách.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n```\n\n**Khung Đầu ra (Output):**\n```text\n5 4 3 2 1\n```\n\n**Giải thích chi tiết:**\n* Vòng lặp bắt đầu từ `i = 5`, giảm dần mỗi bước 1 đơn vị cho đến khi `i = 1`.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      for (int i = n; i >= 1; --i) {\n          std::cout << i << (i == 1 ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n",
                expectedOutput: "5 4 3 2 1\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "10\n",
                expectedOutput: "10 9 8 7 6 5 4 3 2 1\n",
                isHidden: true
            },
            {
                input: "20\n",
                expectedOutput: "20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tính Tổng Dãy Số từ 1 đến N bằng Vòng Lặp",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Áp dụng biến tích lũy (accumulator) kiểu `long long` trong vòng lặp để tránh tràn số nguyên.\n* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 10^6). Sử dụng vòng lặp `for` để tính tổng: `S = 1 + 2 + 3 + ... + N`. In kết quả ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^6).\n* **Đầu ra (Output):** Một số nguyên duy nhất là tổng S.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n100\n```\n\n**Khung Đầu ra (Output):**\n```text\n5050\n```\n\n**Giải thích chi tiết:**\n* Tổng từ 1 đến 100 là 5050.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      long long tong = 0;\n      for (long long i = 1; i <= n; ++i) {\n          tong += i;\n      }\n\n      std::cout << tong << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "100\n",
                expectedOutput: "5050\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "10\n",
                expectedOutput: "55\n",
                isHidden: true
            },
            {
                input: "500\n",
                expectedOutput: "125250\n",
                isHidden: true
            },
            {
                input: "1000000\n",
                expectedOutput: "500000500000\n",
                isHidden: true
            },
        ]
    },
    {
        title: "In Bảng Cửu Chương của Số N",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** In bảng cửu chương theo định dạng chuẩn hóa bằng vòng lặp từ 1 đến 10.\n* **Mô tả:** Nhập vào một số nguyên N (1 <= N <= 9). Hãy in ra bảng nhân của số N từ 1 đến 10 theo định dạng: `N x i = Result` (mỗi phép nhân trên 1 dòng riêng biệt).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên N (1 <= N <= 9).\n* **Đầu ra (Output):** 10 dòng thể hiện bảng nhân từ 1 đến 10.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n7\n```\n\n**Khung Đầu ra (Output):**\n```text\n7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70\n```\n\n**Giải thích chi tiết:**\n* Lần lượt nhân 7 với các số từ 1 đến 10 và in ra đúng mẫu.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      for (int i = 1; i <= 10; ++i) {\n          std::cout << n << \" x \" << i << \" = \" << n * i << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "7\n",
                expectedOutput: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70\n",
                isHidden: false
            },
            {
                input: "2\n",
                expectedOutput: "2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20\n",
                isHidden: false
            },
            {
                input: "9\n",
                expectedOutput: "9 x 1 = 9\n9 x 2 = 18\n9 x 3 = 27\n9 x 4 = 36\n9 x 5 = 45\n9 x 6 = 54\n9 x 7 = 63\n9 x 8 = 72\n9 x 9 = 81\n9 x 10 = 90\n",
                isHidden: true
            },
            {
                input: "5\n",
                expectedOutput: "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đếm Số Chữ Số của Một Số Nguyên (while)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Áp dụng vòng lặp `while` để bóc tách liên tục các chữ số bằng phép chia nguyên `/= 10`.\n* **Mô tả:** Nhập vào một số nguyên không âm N (0 <= N <= 10^18). Hãy đếm và in ra số lượng chữ số của N.\n* Chú ý trường hợp biên đặc biệt: Khi N = 0 thì số chữ số là 1.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên không âm N (0 <= N <= 10^18).\n* **Đầu ra (Output):** Một số nguyên là số lượng chữ số của N.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n987654321\n```\n\n**Khung Đầu ra (Output):**\n```text\n9\n```\n\n**Giải thích chi tiết:**\n* Số 987654321 có 9 chữ số.",
        starterCode: "#include <iostream>\n\nint main() {\n    // \u00c1p d\u1ee5ng v\u00f2ng l\u1eb7p while/do-while c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      if (n == 0) {\n          std::cout << 1 << '\\n';\n          return 0;\n      }\n\n      int dem = 0;\n      while (n > 0) {\n          dem++;\n          n /= 10;\n      }\n\n      std::cout << dem << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "987654321\n",
                expectedOutput: "9\n",
                isHidden: false
            },
            {
                input: "0\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "5\n",
                expectedOutput: "1\n",
                isHidden: true
            },
            {
                input: "123456789012345\n",
                expectedOutput: "15\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tính Giai Thừa N!",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Áp dụng biến nhân tích lũy với vòng lặp `for` để tính giai thừa.\n* **Mô tả:** Nhập vào số nguyên N (0 <= N <= 20). Hãy tính và in ra giá trị của `N!` (giai thừa của N).\n* Quy ước: `0! = 1`, `N! = 1 * 2 * 3 * ... * N`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên N (0 <= N <= 20).\n* **Đầu ra (Output):** Giá trị của N! (kiểu `long long`).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n```\n\n**Khung Đầu ra (Output):**\n```text\n120\n```\n\n**Giải thích chi tiết:**\n* 5! = 1 * 2 * 3 * 4 * 5 = 120.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      long long giaiThua = 1;\n      for (int i = 1; i <= n; ++i) {\n          giaiThua *= i;\n      }\n\n      std::cout << giaiThua << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n",
                expectedOutput: "120\n",
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
        title: "In Các Số Chẵn Không Vượt Quá N (continue)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Luyện tập sử dụng từ khóa `continue` để bỏ qua các bước lặp không thỏa mãn điều kiện.\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 1000). Duyệt qua các số từ 1 đến N. Nếu gặp số lẻ, hãy dùng lệnh `continue` để bỏ qua; chỉ in ra các số chẵn trên cùng một dòng, cách nhau một dấu cách.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 1000).\n* **Đầu ra (Output):** Các số chẵn từ 1 đến N cách nhau bởi dấu cách.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n10\n```\n\n**Khung Đầu ra (Output):**\n```text\n2 4 6 8 10\n```\n\n**Giải thích chi tiết:**\n* Duyệt từ 1 đến 10, các số lẻ 1, 3, 5, 7, 9 bị bỏ qua, các số chẵn 2, 4, 6, 8, 10 được in ra.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      bool daInDauTien = false;\n      for (int i = 1; i <= n; ++i) {\n          if (i % 2 != 0) {\n              continue; // B\u1ecf qua s\u1ed1 l\u1ebb\n          }\n          if (daInDauTien) std::cout << \" \";\n          std::cout << i;\n          daInDauTien = true;\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "10\n",
                expectedOutput: "2 4 6 8 10\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "\n",
                isHidden: false
            },
            {
                input: "2\n",
                expectedOutput: "2\n",
                isHidden: true
            },
            {
                input: "15\n",
                expectedOutput: "2 4 6 8 10 12 14\n",
                isHidden: true
            },
            {
                input: "20\n",
                expectedOutput: "2 4 6 8 10 12 14 16 18 20\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Số Đầu Tiên Chia Hết Cho 7 Lớn Hơn N (break)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Luyện tập sử dụng từ khóa `break` để ngắt sớm vòng lặp ngay khi tìm được kết quả mong muốn.\n* **Mô tả:** Nhập vào số nguyên N. Hãy tìm số nguyên đầu tiên lớn hơn N mà chia hết cho 7. Ngay khi tìm thấy, in số đó ra màn hình và dùng câu lệnh `break` để kết thúc vòng lặp.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên N (-10^9 <= N <= 10^9).\n* **Đầu ra (Output):** Số nguyên đầu tiên > N chia hết cho 7.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n22\n```\n\n**Khung Đầu ra (Output):**\n```text\n28\n```\n\n**Giải thích chi tiết:**\n* Bắt đầu kiểm tra từ 23, 24, 25, 26, 27, 28. Số 28 chia hết cho 7 (28 % 7 == 0) nên in 28 và dừng.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      for (long long i = n + 1; ; ++i) {\n          if (i % 7 == 0) {\n              std::cout << i << '\\n';\n              break; // D\u1eebng ngay v\u00f2ng l\u1eb7p\n          }\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "22\n",
                expectedOutput: "28\n",
                isHidden: false
            },
            {
                input: "14\n",
                expectedOutput: "21\n",
                isHidden: false
            },
            {
                input: "0\n",
                expectedOutput: "7\n",
                isHidden: true
            },
            {
                input: "-10\n",
                expectedOutput: "-7\n",
                isHidden: true
            },
            {
                input: "70\n",
                expectedOutput: "77\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Vẽ Hình Chữ Nhật Đặc Dấu Sao Kích Thước H x W (Nested Loops)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Nắm vững tư duy không gian 2D với vòng lặp ngoài quản lý số hàng H và vòng lặp trong quản lý số cột W.\n* **Mô tả:** Nhập vào chiều cao H (số hàng) và chiều rộng W (số cột) của hình chữ nhật (1 <= H, W <= 50). Hãy in ra hình chữ nhật đặc bằng ký tự `*`, mỗi ký tự cách nhau 1 khoảng trắng. Hết mỗi hàng phải xuống dòng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số nguyên H và W cách nhau bởi dấu cách.\n* **Đầu ra (Output):** H hàng, mỗi hàng gồm W ký tự `*` cách nhau bởi dấu cách.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 4\n```\n\n**Khung Đầu ra (Output):**\n```text\n* * * *\n* * * *\n* * * *\n```\n\n**Giải thích chi tiết:**\n* Hình chữ nhật có 3 hàng, mỗi hàng có 4 dấu sao.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int h = 0, w = 0;\n      std::cin >> h >> w;\n\n      for (int i = 1; i <= h; ++i) {\n          for (int j = 1; j <= w; ++j) {\n              std::cout << \"*\" << (j == w ? \"\" : \" \");\n          }\n          std::cout << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "3 4\n",
                expectedOutput: "* * * *\n* * * *\n* * * *\n",
                isHidden: false
            },
            {
                input: "1 1\n",
                expectedOutput: "*\n",
                isHidden: false
            },
            {
                input: "4 2\n",
                expectedOutput: "* *\n* *\n* *\n* *\n",
                isHidden: true
            },
            {
                input: "2 5\n",
                expectedOutput: "* * * * *\n* * * * *\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Nhập và Tính Tổng Cho Đến Khi Gặp Số 0",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Áp dụng vòng lặp `while` hoặc `do-while` để nhận luồng dữ liệu liên tục cho đến khi gặp tín hiệu dừng (Sentinel Value).\n* **Mô tả:** Chương trình đọc liên tục các số nguyên từ bàn phím. Khi gặp số 0 thì quá trình nhập kết thúc. Hãy in ra tổng của tất cả các số đã nhập (không tính số 0).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Chuỗi các số nguyên kết thúc bằng số 0.\n* **Đầu ra (Output):** Một số nguyên duy nhất là tổng các số đã nhập.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5 12 -3 8 0\n```\n\n**Khung Đầu ra (Output):**\n```text\n22\n```\n\n**Giải thích chi tiết:**\n* Tổng = 5 + 12 + (-3) + 8 = 22. Khi gặp số 0 thì dừng lại.",
        starterCode: "#include <iostream>\n\nint main() {\n    // \u00c1p d\u1ee5ng v\u00f2ng l\u1eb7p while/do-while c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long x = 0;\n      long long tong = 0;\n\n      while (std::cin >> x && x != 0) {\n          tong += x;\n      }\n\n      std::cout << tong << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5 12 -3 8 0\n",
                expectedOutput: "22\n",
                isHidden: false
            },
            {
                input: "0\n",
                expectedOutput: "0\n",
                isHidden: false
            },
            {
                input: "10 -10 20 0\n",
                expectedOutput: "20\n",
                isHidden: true
            },
            {
                input: "100 200 -50 0\n",
                expectedOutput: "250\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đếm và Liệt Kê Các Ước Số của Số Nguyên N",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Áp dụng vòng lặp duyệt qua các ước số và tích lũy số lượng.\n* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 1: In ra số lượng ước số dương của N.\n  * Dòng 2: In lần lượt các ước số của N theo thứ tự tăng dần, mỗi số cách nhau một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^5).\n* **Đầu ra (Output):** Gồm 2 dòng: dòng 1 là số lượng ước, dòng 2 là danh sách các ước số.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n12\n```\n\n**Khung Đầu ra (Output):**\n```text\n6\n1 2 3 4 6 12\n```\n\n**Giải thích chi tiết:**\n* Số 12 có 6 ước số gồm: 1, 2, 3, 4, 6, 12.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      int dem = 0;\n      for (int i = 1; i <= n; ++i) {\n          if (n % i == 0) dem++;\n      }\n\n      std::cout << dem << '\\n';\n\n      bool daIn = false;\n      for (int i = 1; i <= n; ++i) {\n          if (n % i == 0) {\n              if (daIn) std::cout << \" \";\n              std::cout << i;\n              daIn = true;\n          }\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "12\n",
                expectedOutput: "6\n1 2 3 4 6 12\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "1\n1\n",
                isHidden: false
            },
            {
                input: "17\n",
                expectedOutput: "2\n1 17\n",
                isHidden: true
            },
            {
                input: "36\n",
                expectedOutput: "9\n1 2 3 4 6 9 12 18 36\n",
                isHidden: true
            },
            {
                input: "100\n",
                expectedOutput: "9\n1 2 4 5 10 20 25 50 100\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Kiểm Tra Số Nguyên Tố (Tối ưu O(sqrt(N)))",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Nắm vững thuật toán kiểm tra số nguyên tố tối ưu chạy đến căn bậc hai của N bằng điều kiện `i * i <= n`.\n* **Mô tả:** Nhập vào một số nguyên N (-10^9 <= N <= 10^9). Hãy kiểm tra xem N có phải là số nguyên tố hay không.\n  * Số nguyên tố là số nguyên lớn hơn 1 và chỉ có đúng 2 ước dương là 1 và chính nó.\n  * Nếu là số nguyên tố, in ra `YES`.\n  * Nếu không phải, in ra `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên N (-10^9 <= N <= 10^9).\n* **Đầu ra (Output):** In ra `YES` hoặc `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n29\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* 29 > 1 và không chia hết cho bất kỳ số nào từ 2 đến căn bậc hai của 29 (khoảng 5.38), nên 29 là số nguyên tố.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      if (n < 2) {\n          std::cout << \"NO\\n\";\n          return 0;\n      }\n\n      bool laNguyenTo = true;\n      for (long long i = 2; i * i <= n; ++i) {\n          if (n % i == 0) {\n              laNguyenTo = false;\n              break; // D\u1eebng s\u1edbm ngay khi th\u1ea5y \u01b0\u1edbc\n          }\n      }\n\n      std::cout << (laNguyenTo ? \"YES\" : \"NO\") << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "29\n",
                expectedOutput: "YES\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "NO\n",
                isHidden: false
            },
            {
                input: "4\n",
                expectedOutput: "NO\n",
                isHidden: true
            },
            {
                input: "2\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
            {
                input: "97\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
            {
                input: "1000000007\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đảo Ngược Một Số Nguyên (Reverse Number)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Áp dụng thuật toán xây dựng số đảo ngược theo công thức `dao = dao * 10 + chuSoCuoi` bằng vòng lặp `while`.\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^18). Hãy in ra số nguyên đảo ngược của N (bỏ qua các chữ số 0 vô nghĩa ở đầu kết quả nếu có).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^18).\n* **Đầu ra (Output):** Số đảo ngược của N (kiểu `long long`).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n1204500\n```\n\n**Khung Đầu ra (Output):**\n```text\n54021\n```\n\n**Giải thích chi tiết:**\n* Số 1204500 đảo ngược lại là 0054021, biểu diễn thành số nguyên hợp lệ là 54021.",
        starterCode: "#include <iostream>\n\nint main() {\n    // \u00c1p d\u1ee5ng v\u00f2ng l\u1eb7p while/do-while c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      long long daoNguoc = 0;\n      while (n > 0) {\n          long long chuSo = n % 10;\n          daoNguoc = daoNguoc * 10 + chuSo;\n          n /= 10;\n      }\n\n      std::cout << daoNguoc << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "1204500\n",
                expectedOutput: "54021\n",
                isHidden: false
            },
            {
                input: "12345\n",
                expectedOutput: "54321\n",
                isHidden: false
            },
            {
                input: "7\n",
                expectedOutput: "7\n",
                isHidden: true
            },
            {
                input: "1000\n",
                expectedOutput: "1\n",
                isHidden: true
            },
            {
                input: "987654321\n",
                expectedOutput: "123456789\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Kiểm Tra Số Đối Xứng (Palindrome Number)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Kết hợp thuật toán đảo ngược số với phép so sánh bằng `==` để kiểm tra tính đối xứng.\n* **Mô tả:** Một số nguyên dương được gọi là số đối xứng (Palindrome) nếu đọc từ trái sang phải hay từ phải sang trái đều thu được cùng một giá trị (ví dụ: 121, 1331, 7).\n* Nhập vào số nguyên dương N (1 <= N <= 10^18). Hãy in ra `YES` nếu N là số đối xứng, ngược lại in `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^18).\n* **Đầu ra (Output):** In ra `YES` hoặc `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n1234321\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* 1234321 khi đảo ngược lại vẫn là 1234321 nên là số đối xứng.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      long long goc = n;\n      long long daoNguoc = 0;\n\n      while (n > 0) {\n          daoNguoc = daoNguoc * 10 + (n % 10);\n          n /= 10;\n      }\n\n      if (daoNguoc == goc) {\n          std::cout << \"YES\\n\";\n      } else {\n          std::cout << \"NO\\n\";\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "1234321\n",
                expectedOutput: "YES\n",
                isHidden: false
            },
            {
                input: "12345\n",
                expectedOutput: "NO\n",
                isHidden: false
            },
            {
                input: "9\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
            {
                input: "1001\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
            {
                input: "123321\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Ước Chung Lớn Nhất (UCLN) bằng Thuật Toán Euclid",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Cài đặt thuật toán Euclid kinh điển bằng vòng lặp `while (b != 0)` với độ phức tạp logarit cực nhanh.\n* **Mô tả:** Nhập vào hai số nguyên dương a và b (1 <= a, b <= 10^12). Hãy tìm và in ra ước chung lớn nhất UCLN(a, b).\n* **Thuật toán Euclid:** Ở mỗi bước, thay `a = b` và `b = a % b` cho đến khi `b == 0` thì UCLN chính là `a`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số nguyên dương a và b cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Giá trị UCLN(a, b).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n48 18\n```\n\n**Khung Đầu ra (Output):**\n```text\n6\n```\n\n**Giải thích chi tiết:**\n* 48 % 18 = 12\n* 18 % 12 = 6\n* 12 % 6 = 0 -> UCLN là 6.",
        starterCode: "#include <iostream>\n\nint main() {\n    // \u00c1p d\u1ee5ng v\u00f2ng l\u1eb7p while/do-while c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long a = 0, b = 0;\n      std::cin >> a >> b;\n\n      while (b != 0) {\n          long long r = a % b;\n          a = b;\n          b = r;\n      }\n\n      std::cout << a << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "48 18\n",
                expectedOutput: "6\n",
                isHidden: false
            },
            {
                input: "10 5\n",
                expectedOutput: "5\n",
                isHidden: false
            },
            {
                input: "17 19\n",
                expectedOutput: "1\n",
                isHidden: true
            },
            {
                input: "100 100\n",
                expectedOutput: "100\n",
                isHidden: true
            },
            {
                input: "123456789 987654321\n",
                expectedOutput: "9\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Bội Chung Nhỏ Nhất (BCNN) của Hai Số Nguyên",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Áp dụng hệ quả `BCNN(a, b) = (a * b) / UCLN(a, b)` kết hợp thứ tự tính `(a / UCLN) * b` để triệt tiêu nguy cơ tràn số nguyên.\n* **Mô tả:** Nhập vào hai số nguyên dương a và b (1 <= a, b <= 10^9). Hãy tìm và in ra bội chung nhỏ nhất BCNN(a, b).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Hai số nguyên dương a và b.\n* **Đầu ra (Output):** Giá trị BCNN(a, b) (kiểu `long long`).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n12 18\n```\n\n**Khung Đầu ra (Output):**\n```text\n36\n```\n\n**Giải thích chi tiết:**\n* UCLN(12, 18) = 6. BCNN(12, 18) = (12 * 18) / 6 = 36.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long a = 0, b = 0;\n      std::cin >> a >> b;\n\n      long long x = a, y = b;\n      while (y != 0) {\n          long long r = x % y;\n          x = y;\n          y = r;\n      }\n\n      long long ucln = x;\n      long long bcnn = (a / ucln) * b;\n\n      std::cout << bcnn << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "12 18\n",
                expectedOutput: "36\n",
                isHidden: false
            },
            {
                input: "5 7\n",
                expectedOutput: "35\n",
                isHidden: false
            },
            {
                input: "15 20\n",
                expectedOutput: "60\n",
                isHidden: true
            },
            {
                input: "100 25\n",
                expectedOutput: "100\n",
                isHidden: true
            },
            {
                input: "1000 300\n",
                expectedOutput: "3000\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tính Số Fibonacci Thứ N bằng Vòng Lặp",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Tính số Fibonacci bằng kỹ thuật trượt 3 biến với vòng lặp `for` có độ phức tạp không gian O(1) (không dùng mảng hay đệ quy).\n* **Mô tả:** Dãy Fibonacci được định nghĩa:\n  * `F(0) = 0`, `F(1) = 1`\n  * `F(n) = F(n-1) + F(n-2)` với mọi n >= 2.\n  Nhập vào số nguyên n (0 <= n <= 80). Hãy tính và in ra giá trị của `F(n)`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên n (0 <= n <= 80).\n* **Đầu ra (Output):** Giá trị F(n) (kiểu `long long`).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n10\n```\n\n**Khung Đầu ra (Output):**\n```text\n55\n```\n\n**Giải thích chi tiết:**\n* Dãy số: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 -> F(10) = 55.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      if (n == 0) {\n          std::cout << 0 << '\\n';\n          return 0;\n      }\n      if (n == 1) {\n          std::cout << 1 << '\\n';\n          return 0;\n      }\n\n      long long f0 = 0, f1 = 1, fn = 0;\n      for (int i = 2; i <= n; ++i) {\n          fn = f0 + f1;\n          f0 = f1;\n          f1 = fn;\n      }\n\n      std::cout << fn << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "10\n",
                expectedOutput: "55\n",
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
                expectedOutput: "1\n",
                isHidden: true
            },
            {
                input: "20\n",
                expectedOutput: "6765\n",
                isHidden: true
            },
            {
                input: "50\n",
                expectedOutput: "12586269025\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Vẽ Tam Giác Vuông Cân Rỗng Dấu Sao (Nested Loops & if-else)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Kết hợp vòng lặp lồng nhau với điều kiện biên tọa độ để in hình rỗng.\n* **Mô tả:** Nhập vào chiều cao H (2 <= H <= 30). Hãy in ra một tam giác vuông cân rỗng kích thước H x H:\n  * Cạnh góc vuông dọc (cột đầu tiên `j == 1`): in `*`\n  * Cạnh góc vuông đáy (hàng cuối cùng `i == H`): in `*`\n  * Cạnh huyền (đường chéo chính `j == i`): in `*`\n  * Các vị trí bên trong: in dấu cách ` `\n  * Mỗi ký tự trên một dòng cách nhau 1 dấu cách.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Chiều cao H (2 <= H <= 30).\n* **Đầu ra (Output):** Tam giác vuông cân rỗng theo đúng mẫu.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n```\n\n**Khung Đầu ra (Output):**\n```text\n*\n* *\n*   *\n*     *\n* * * * *\n```\n\n**Giải thích chi tiết:**\n* Hàng 1 có 1 sao; hàng 2 có 2 sao; hàng 3, 4 có sao ở 2 đầu và rỗng ở giữa; hàng 5 có 5 sao đặc.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int h = 0;\n      std::cin >> h;\n\n      for (int i = 1; i <= h; ++i) {\n          for (int j = 1; j <= i; ++j) {\n              if (j == 1 || j == i || i == h) {\n                  std::cout << \"*\";\n              } else {\n                  std::cout << \" \";\n              }\n              if (j < i) std::cout << \" \";\n          }\n          std::cout << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n",
                expectedOutput: "*\n* *\n*   *\n*     *\n* * * * *\n",
                isHidden: false
            },
            {
                input: "2\n",
                expectedOutput: "*\n* *\n",
                isHidden: false
            },
            {
                input: "3\n",
                expectedOutput: "*\n* *\n* * *\n",
                isHidden: true
            },
            {
                input: "6\n",
                expectedOutput: "*\n* *\n*   *\n*     *\n*       *\n* * * * * *\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tính Tổng Các Chữ Số của Một Số Nguyên Lớn",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Áp dụng vòng lặp `while` để cộng dồn từng chữ số của một số nguyên 64-bit.\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^18). Hãy tính và in ra tổng các chữ số của N.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^18).\n* **Đầu ra (Output):** Một số nguyên là tổng các chữ số của N.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n4587\n```\n\n**Khung Đầu ra (Output):**\n```text\n24\n```\n\n**Giải thích chi tiết:**\n* 4 + 5 + 8 + 7 = 24.",
        starterCode: "#include <iostream>\n\nint main() {\n    // \u00c1p d\u1ee5ng v\u00f2ng l\u1eb7p while/do-while c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      long long tong = 0;\n      while (n > 0) {\n          tong += (n % 10);\n          n /= 10;\n      }\n\n      std::cout << tong << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "4587\n",
                expectedOutput: "24\n",
                isHidden: false
            },
            {
                input: "0\n",
                expectedOutput: "0\n",
                isHidden: false
            },
            {
                input: "99999\n",
                expectedOutput: "45\n",
                isHidden: true
            },
            {
                input: "123456789\n",
                expectedOutput: "45\n",
                isHidden: true
            },
            {
                input: "1000000000\n",
                expectedOutput: "1\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Phân Tích Thừa Số Nguyên Tố (Prime Factorization)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Vận dụng vòng lặp `while` lồng trong vòng lặp `for` để phân tích thừa số nguyên tố của một số.\n* **Mô tả:** Nhập vào một số nguyên dương N (2 <= N <= 10^9). Hãy phân tích N thành tích các thừa số nguyên tố và in ra các thừa số theo thứ tự tăng dần, mỗi số cách nhau bởi một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (2 <= N <= 10^9).\n* **Đầu ra (Output):** Dãy các thừa số nguyên tố tăng dần cách nhau một khoảng trắng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n60\n```\n\n**Khung Đầu ra (Output):**\n```text\n2 2 3 5\n```\n\n**Giải thích chi tiết:**\n* 60 = 2 * 2 * 3 * 5.",
        starterCode: "#include <iostream>\n\nint main() {\n    // \u00c1p d\u1ee5ng v\u00f2ng l\u1eb7p while/do-while c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      bool daIn = false;\n      for (long long i = 2; i * i <= n; ++i) {\n          while (n % i == 0) {\n              if (daIn) std::cout << \" \";\n              std::cout << i;\n              daIn = true;\n              n /= i;\n          }\n      }\n\n      if (n > 1) {\n          if (daIn) std::cout << \" \";\n          std::cout << n;\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "60\n",
                expectedOutput: "2 2 3 5\n",
                isHidden: false
            },
            {
                input: "2\n",
                expectedOutput: "2\n",
                isHidden: false
            },
            {
                input: "13\n",
                expectedOutput: "13\n",
                isHidden: true
            },
            {
                input: "100\n",
                expectedOutput: "2 2 5 5\n",
                isHidden: true
            },
            {
                input: "1024\n",
                expectedOutput: "2 2 2 2 2 2 2 2 2 2\n",
                isHidden: true
            },
            {
                input: "999999999\n",
                expectedOutput: "3 3 3 3 37 333667\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Kiểm Tra Số Hoàn Hảo (Perfect Number)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Áp dụng thuật toán duyệt ước tối ưu `O(sqrt(N))` bằng cách cộng cặp ước `(i, n / i)` để kiểm tra số hoàn hảo với N lớn đến 10^12.\n* **Mô tả:** Số hoàn hảo (Perfect Number) là số nguyên dương có tổng tất cả các ước số thực sự (các ước nhỏ hơn chính nó) bằng chính nó.\n  * Ví dụ: 6 có các ước thực sự là 1, 2, 3 và 1 + 2 + 3 = 6.\n  * 28 có các ước thực sự là 1, 2, 4, 7, 14 và 1 + 2 + 4 + 7 + 14 = 28.\n  Nhập vào số nguyên dương N (1 <= N <= 10^12). Hãy kiểm tra xem N có phải là số hoàn hảo hay không. In `YES` nếu đúng, ngược lại in `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^12).\n* **Đầu ra (Output):** In ra `YES` hoặc `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n28\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* Tổng ước nhỏ hơn 28: 1 + 2 + 4 + 7 + 14 = 28 -> Là số hoàn hảo.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      if (n <= 1) {\n          std::cout << \"NO\\n\";\n          return 0;\n      }\n\n      long long tongUoc = 1; // 1 lu\u00f4n l\u00e0 \u01b0\u1edbc c\u1ee7a m\u1ecdi s\u1ed1 > 1\n      for (long long i = 2; i * i <= n; ++i) {\n          if (n % i == 0) {\n              tongUoc += i;\n              if (i * i != n) {\n                  tongUoc += (n / i);\n              }\n          }\n      }\n\n      if (tongUoc == n) {\n          std::cout << \"YES\\n\";\n      } else {\n          std::cout << \"NO\\n\";\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "28\n",
                expectedOutput: "YES\n",
                isHidden: false
            },
            {
                input: "6\n",
                expectedOutput: "YES\n",
                isHidden: false
            },
            {
                input: "496\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
            {
                input: "12\n",
                expectedOutput: "NO\n",
                isHidden: true
            },
            {
                input: "1\n",
                expectedOutput: "NO\n",
                isHidden: true
            },
            {
                input: "8128\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Chữ Số Lớn Nhất và Nhỏ Nhất của Một Số Nguyên",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Áp dụng vòng lặp `while` bóc tách từng chữ số và cập nhật cực trị Min/Max đồng thời.\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^18). Hãy tìm chữ số nhỏ nhất (Min Digit) và chữ số lớn nhất (Max Digit) xuất hiện trong số N. In ra hai chữ số đó cách nhau bởi một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^18).\n* **Đầu ra (Output):** Hai số nguyên tương ứng là chữ số nhỏ nhất và chữ số lớn nhất.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n583912\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 9\n```\n\n**Giải thích chi tiết:**\n* Các chữ số của 583912 là {5, 8, 3, 9, 1, 2}. Nhỏ nhất là 1, lớn nhất là 9.",
        starterCode: "#include <iostream>\n\nint main() {\n    // \u00c1p d\u1ee5ng v\u00f2ng l\u1eb7p while/do-while c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      int minD = 9;\n      int maxD = 0;\n\n      while (n > 0) {\n          int d = n % 10;\n          if (d < minD) minD = d;\n          if (d > maxD) maxD = d;\n          n /= 10;\n      }\n\n      std::cout << minD << \" \" << maxD << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "583912\n",
                expectedOutput: "1 9\n",
                isHidden: false
            },
            {
                input: "7\n",
                expectedOutput: "7 7\n",
                isHidden: false
            },
            {
                input: "1111\n",
                expectedOutput: "1 1\n",
                isHidden: true
            },
            {
                input: "90\n",
                expectedOutput: "0 9\n",
                isHidden: true
            },
            {
                input: "1000\n",
                expectedOutput: "0 1\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Vẽ Hình Thoi (Diamond Pattern) Dấu Sao Đối Xứng",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Tư duy không gian tọa độ 2D đối xứng để tính số lượng dấu cách và dấu sao của từng hàng.\n* **Mô tả:** Nhập vào số nguyên N (1 <= N <= 25). Hãy vẽ một hình thoi bằng ký tự `*` có `2*N - 1` hàng:\n  * Phần nửa trên gồm N hàng (từ 1 sao tăng dần đến `2*N - 1` sao).\n  * Phần nửa dưới gồm N - 1 hàng giảm dần đối xứng.\n  * Các dấu sao in liền nhau, các dấu cách phía trước căn giữa hình thoi.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên N (1 <= N <= 25).\n* **Đầu ra (Output):** Hình thoi gồm `2*N - 1` dòng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3\n```\n\n**Khung Đầu ra (Output):**\n```text\n  *\n ***\n*****\n ***\n  *\n```\n\n**Giải thích chi tiết:**\n* N = 3: Tổng cộng 5 hàng. Hàng 1 có 2 space 1 sao; hàng 2 có 1 space 3 sao; hàng 3 có 0 space 5 sao; hàng 4 có 1 space 3 sao; hàng 5 có 2 space 1 sao.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      // N\u1eeda tr\u00ean (t\u1eeb h\u00e0ng 1 \u0111\u1ebfn h\u00e0ng n)\n      for (int i = 1; i <= n; ++i) {\n          for (int sp = 1; sp <= n - i; ++sp) std::cout << \" \";\n          for (int st = 1; st <= 2 * i - 1; ++st) std::cout << \"*\";\n          std::cout << '\\n';\n      }\n\n      // N\u1eeda d\u01b0\u1edbi (t\u1eeb h\u00e0ng n-1 v\u1ec1 1)\n      for (int i = n - 1; i >= 1; --i) {\n          for (int sp = 1; sp <= n - i; ++sp) std::cout << \" \";\n          for (int st = 1; st <= 2 * i - 1; ++st) std::cout << \"*\";\n          std::cout << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "3\n",
                expectedOutput: "  *\n ***\n*****\n ***\n  *\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "*\n",
                isHidden: false
            },
            {
                input: "4\n",
                expectedOutput: "   *\n  ***\n *****\n*******\n *****\n  ***\n   *\n",
                isHidden: true
            },
            {
                input: "5\n",
                expectedOutput: "    *\n   ***\n  *****\n *******\n*********\n *******\n  *****\n   ***\n    *\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đếm Số Lượng Chữ Số 0 Tận Cùng của N! (Công thức Legendre)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Vận dụng công thức Legendre tính số bội của 5 trong tích `1..N` bằng vòng lặp `while (n > 0)` với độ phức tạp `O(log5(N))`.\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^9). Hãy tính xem giai thừa `N!` có bao nhiêu chữ số 0 liên tiếp ở tận cùng mà không được tính trực tiếp giá trị của N! (vì N! sẽ tràn số ngay từ N = 21).\n* **Công thức Legendre:** Số chữ số 0 tận cùng bằng tổng số thừa số 5 trong phân tích: `Count = N/5 + N/25 + N/125 + ...`\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^9).\n* **Đầu ra (Output):** Số lượng chữ số 0 tận cùng của N!.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n100\n```\n\n**Khung Đầu ra (Output):**\n```text\n24\n```\n\n**Giải thích chi tiết:**\n* 100 / 5 = 20\n* 100 / 25 = 4\n* 100 / 125 = 0\n* Tổng số chữ số 0 tận cùng của 100! là 20 + 4 = 24.",
        starterCode: "#include <iostream>\n\nint main() {\n    // \u00c1p d\u1ee5ng v\u00f2ng l\u1eb7p while/do-while c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      long long count = 0;\n      while (n >= 5) {\n          count += (n / 5);\n          n /= 5;\n      }\n\n      std::cout << count << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "100\n",
                expectedOutput: "24\n",
                isHidden: false
            },
            {
                input: "5\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "20\n",
                expectedOutput: "4\n",
                isHidden: true
            },
            {
                input: "1000\n",
                expectedOutput: "249\n",
                isHidden: true
            },
            {
                input: "1000000\n",
                expectedOutput: "249998\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Chuyển Đổi Số Thập Phân sang Nhị Phân",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Chuyển đổi cơ số thập phân sang nhị phân mà không dùng mảng bằng cách sử dụng lũy thừa trọng số `weight *= 10` hoặc chuỗi ký tự.\n* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 10^9). Hãy in ra biểu diễn hệ nhị phân (gồm các bit 0 và 1) của N.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^9).\n* **Đầu ra (Output):** Chuỗi các bit nhị phân đại diện cho N.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n19\n```\n\n**Khung Đầu ra (Output):**\n```text\n10011\n```\n\n**Giải thích chi tiết:**\n* 19 = 16 + 2 + 1 = 2^4 + 2^1 + 2^0 -> Hệ nhị phân là 10011.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <string>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      std::string nhiPhan = \"\";\n      while (n > 0) {\n          nhiPhan = (n % 2 == 1 ? \"1\" : \"0\") + nhiPhan;\n          n /= 2;\n      }\n\n      std::cout << nhiPhan << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "19\n",
                expectedOutput: "10011\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "2\n",
                expectedOutput: "10\n",
                isHidden: true
            },
            {
                input: "100\n",
                expectedOutput: "1100100\n",
                isHidden: true
            },
            {
                input: "1024\n",
                expectedOutput: "10000000000\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Số Nguyên Tố Thứ K",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Kết hợp vòng lặp kiểm tra số nguyên tố lồng bên trong vòng lặp đếm để tìm số nguyên tố thứ K.\n* **Mô tả:** Nhập vào số nguyên dương K (1 <= K <= 1000). Hãy tìm và in ra số nguyên tố thứ K trong dãy số nguyên tố tăng dần:\n  * Số thứ 1 là 2\n  * Số thứ 2 là 3\n  * Số thứ 3 là 5\n  * Số thứ 4 là 7\n  * Số thứ 5 là 11...\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương K (1 <= K <= 1000).\n* **Đầu ra (Output):** Giá trị số nguyên tố thứ K.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n10\n```\n\n**Khung Đầu ra (Output):**\n```text\n29\n```\n\n**Giải thích chi tiết:**\n* 10 số nguyên tố đầu tiên: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Số thứ 10 là 29.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int k = 0;\n      std::cin >> k;\n\n      int dem = 0;\n      long long num = 2;\n\n      while (true) {\n          bool laNT = true;\n          for (long long i = 2; i * i <= num; ++i) {\n              if (num % i == 0) {\n                  laNT = false;\n                  break;\n              }\n          }\n\n          if (laNT) {\n              dem++;\n              if (dem == k) {\n                  std::cout << num << '\\n';\n                  break;\n              }\n          }\n          num++;\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "10\n",
                expectedOutput: "29\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "2\n",
                isHidden: false
            },
            {
                input: "5\n",
                expectedOutput: "11\n",
                isHidden: true
            },
            {
                input: "25\n",
                expectedOutput: "97\n",
                isHidden: true
            },
            {
                input: "100\n",
                expectedOutput: "541\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Bài Toán Bánh Xe Collatz (Giả thuyết 3n + 1)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Cài đặt thuật toán mô phỏng quá trình lặp theo trạng thái và theo dõi giá trị cực đại đạt được.\n* **Mô tả:** Với số nguyên dương n ban đầu:\n  * Nếu n là số chẵn: `n = n / 2`\n  * Nếu n là số lẻ: `n = 3 * n + 1`\n  Quá trình này lặp lại cho đến khi n đạt giá trị 1.\n  Nhập vào số nguyên n (1 <= n <= 10^6). Hãy in ra:\n  * Dòng 1: Số bước biến đổi để n trở về 1 (n = 1 ban đầu thì số bước là 0).\n  * Dòng 2: Giá trị lớn nhất mà n từng đạt được trong suốt quá trình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương n (1 <= n <= 10^6).\n* **Đầu ra (Output):** Hai dòng: dòng 1 là số bước, dòng 2 là giá trị cực đại.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6\n```\n\n**Khung Đầu ra (Output):**\n```text\n8\n16\n```\n\n**Giải thích chi tiết:**\n* Dãy biến đổi: 6 -> 3 -> 10 -> 5 -> 16 -> 8 -> 4 -> 2 -> 1.\n* Tổng cộng có 8 bước biến đổi và giá trị lớn nhất đạt được là 16.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      long long buoc = 0;\n      long long maxVal = n;\n\n      while (n > 1) {\n          if (n % 2 == 0) {\n              n /= 2;\n          } else {\n              n = 3 * n + 1;\n          }\n          if (n > maxVal) maxVal = n;\n          buoc++;\n      }\n\n      std::cout << buoc << '\\n';\n      std::cout << maxVal << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6\n",
                expectedOutput: "8\n16\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "0\n1\n",
                isHidden: false
            },
            {
                input: "19\n",
                expectedOutput: "20\n88\n",
                isHidden: true
            },
            {
                input: "27\n",
                expectedOutput: "111\n9232\n",
                isHidden: true
            },
            {
                input: "100\n",
                expectedOutput: "25\n100\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Vẽ Tam Giác Pascal Kích Thước N Hàng (Không dùng Mảng 2D)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Vận dụng công thức truy hồi tổ hợp `C(n, k) = C(n, k - 1) * (n - k + 1) / k` để in tam giác Pascal trực tiếp với bộ nhớ O(1).\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 20). Hãy in ra tam giác Pascal gồm N hàng:\n  * Hàng thứ i (tính từ 0 đến N-1) có `i + 1` phần tử, các phần tử cách nhau bởi dấu cách.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên N (1 <= N <= 20).\n* **Đầu ra (Output):** N hàng của tam giác Pascal.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n```\n\n**Khung Đầu ra (Output):**\n```text\n1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n```\n\n**Giải thích chi tiết:**\n* Tam giác Pascal 5 hàng tính từ hàng 0 đến hàng 4.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      for (int i = 0; i < n; ++i) {\n          long long c = 1;\n          for (int j = 0; j <= i; ++j) {\n              std::cout << c << (j == i ? \"\" : \" \");\n              c = c * (i - j) / (j + 1);\n          }\n          std::cout << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n",
                expectedOutput: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "3\n",
                expectedOutput: "1\n1 1\n1 2 1\n",
                isHidden: true
            },
            {
                input: "6\n",
                expectedOutput: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n1 5 10 10 5 1\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Cặp Ước Số (a, b) có a * b = N và Tổng (a + b) Nhỏ Nhất",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Duyệt lùi từ căn bậc hai của N (`floor(sqrt(N))`) về 1 để tìm ngay cặp thừa số gần nhau nhất chỉ trong O(sqrt(N)).\n* **Mô tả:** Cho số nguyên dương N (1 <= N <= 10^12). Hãy tìm hai số nguyên dương a và b sao cho:\n  * `a <= b`\n  * `a * b = N`\n  * Tổng `a + b` là nhỏ nhất có thể.\n  In ra hai số a và b cách nhau một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^12).\n* **Đầu ra (Output):** Hai số nguyên a và b cách nhau một khoảng trắng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n36\n```\n\n**Khung Đầu ra (Output):**\n```text\n6 6\n```\n\n**Giải thích chi tiết:**\n* Các cặp ước của 36: (1, 36) tổng 37; (2, 18) tổng 20; (3, 12) tổng 15; (4, 9) tổng 13; (6, 6) tổng 12. Cặp (6, 6) có tổng nhỏ nhất.",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <cmath>\n\n  int main() {\n      long long n = 0;\n      std::cin >> n;\n\n      long long canN = static_cast<long long>(std::sqrt(n));\n\n      // Duy\u1ec7t l\u00f9i t\u1eeb canN v\u1ec1 1, s\u1ed1 \u0111\u1ea7u ti\u00ean chia h\u1ebft ch\u1eafc ch\u1eafn cho t\u1ed5ng nh\u1ecf nh\u1ea5t\n      for (long long a = canN; a >= 1; --a) {\n          if (n % a == 0) {\n              long long b = n / a;\n              std::cout << a << \" \" << b << '\\n';\n              break;\n          }\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "36\n",
                expectedOutput: "6 6\n",
                isHidden: false
            },
            {
                input: "1\n",
                expectedOutput: "1 1\n",
                isHidden: false
            },
            {
                input: "17\n",
                expectedOutput: "1 17\n",
                isHidden: true
            },
            {
                input: "100\n",
                expectedOutput: "10 10\n",
                isHidden: true
            },
            {
                input: "24\n",
                expectedOutput: "4 6\n",
                isHidden: true
            },
            {
                input: "10000000000\n",
                expectedOutput: "100000 100000\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đếm Số Lượng Số May Mắn Chứa Toàn 6 và 8 trong Khoảng [1, N]",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Áp dụng vòng lặp kiểm tra từng chữ số của mỗi số nguyên trong khoảng `[1, N]`.\n* **Mô tả:** Một số nguyên dương được gọi là \"Số may mắn\" nếu trong biểu diễn thập phân của nó **chỉ chứa** các chữ số `6` hoặc `8` (ví dụ: 6, 8, 66, 68, 86, 88, 668, ...).\n  Nhập vào số nguyên dương N (1 <= N <= 10^5). Hãy đếm xem có bao nhiêu số may mắn trong đoạn từ 1 đến N.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 10^5).\n* **Đầu ra (Output):** Số lượng số may mắn trong đoạn [1, N].\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n100\n```\n\n**Khung Đầu ra (Output):**\n```text\n6\n```\n\n**Giải thích chi tiết:**\n* Các số may mắn <= 100 là: 6, 8, 66, 68, 86, 88 (tổng cộng 6 số).",
        starterCode: "#include <iostream>\n\nint main() {\n    // Nh\u1eadp d\u1eef li\u1ec7u v\u00e0 th\u1ef1c hi\u1ec7n v\u00f2ng l\u1eb7p c\u1ee7a b\u1ea1n \u1edf \u0111\u00e2y:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n\n  int main() {\n      int n = 0;\n      std::cin >> n;\n\n      int dem = 0;\n      for (int i = 1; i <= n; ++i) {\n          int x = i;\n          bool laMayMan = true;\n          while (x > 0) {\n              int d = x % 10;\n              if (d != 6 && d != 8) {\n                  laMayMan = false;\n                  break;\n              }\n              x /= 10;\n          }\n          if (laMayMan) dem++;\n      }\n\n      std::cout << dem << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "100\n",
                expectedOutput: "6\n",
                isHidden: false
            },
            {
                input: "10\n",
                expectedOutput: "2\n",
                isHidden: false
            },
            {
                input: "5\n",
                expectedOutput: "0\n",
                isHidden: true
            },
            {
                input: "1000\n",
                expectedOutput: "14\n",
                isHidden: true
            },
            {
                input: "10000\n",
                expectedOutput: "30\n",
                isHidden: true
            },
        ]
    }

];

export async function seedCppModule3Practice() {
    console.log('🚀 Bắt đầu cập nhật toàn bộ 30 bài tập chuẩn hóa Module 3 C++ vào Database...');

    // 1. Tìm Module 3 của C++
    const module3 = await prisma.module.findUnique({
        where: { moduleId: 'CPP-MOD-03' }
    });

    if (!module3) {
        throw new Error('❌ Không tìm thấy Module 3 (CPP-MOD-03)!');
    }

    // 2. Tìm Chapter 3 của Module 3
    const chapter3 = await prisma.chapter.findFirst({
        where: {
            moduleId: module3.id,
            chapterId: 'CPP-CH-03'
        }
    });

    if (!chapter3) {
        throw new Error('❌ Không tìm thấy Chapter 3 của Module 3!');
    }

    // 3. Upsert bài học tổng hợp CPP-03.MP
    const lessonMp = await prisma.lesson.upsert({
        where: {
            id: 'c1b10000-0003-4000-8000-000000000001'
        },
        update: {
            lessonId: 'CPP-03.MP',
            title: 'Bài tập thực hành tổng hợp Module 3: Vòng lặp và Các Bài toán Xử lý Lặp Kinh điển',
            objective: 'Hệ thống 30 bài tập rèn luyện chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức vòng lặp for, while, do-while, break, continue, lồng nhau và thuật toán số học kinh điển của Module 3 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 90,
            isFree: true,
            orderIndex: 6,
            chapterId: chapter3.id,
            content: `# Bài tập thực hành tổng hợp Module 3: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 3: Vòng lặp và Các Bài toán Xử lý Lặp Kinh điển**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài làm chủ vòng lặp for (tăng/giảm), while, do-while, break, continue, lưới ký tự 2D cơ bản.
* ⚔️ **Trung bình (Medium):** 10 bài tối ưu O(sqrt(N)), số nguyên tố, Palindrome, UCLN Euclid, BCNN, Fibonacci O(1), tam giác rỗng.
* 👑 **Khó / Thử thách (Hard):** 10 bài tối ưu không gian O(1), số hoàn hảo lớn, Legendre N!, nhị phân, Collatz, Pascal, hình thoi đối xứng.

Chúc bạn hoàn thành xuất sắc toàn bộ thử thách!`
        },
        create: {
            id: 'c1b10000-0003-4000-8000-000000000001',
            lessonId: 'CPP-03.MP',
            title: 'Bài tập thực hành tổng hợp Module 3: Vòng lặp và Các Bài toán Xử lý Lặp Kinh điển',
            objective: 'Hệ thống 30 bài tập rèn luyện chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức vòng lặp for, while, do-while, break, continue, lồng nhau và thuật toán số học kinh điển của Module 3 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 90,
            isFree: true,
            orderIndex: 6,
            chapterId: chapter3.id,
            content: `# Bài tập thực hành tổng hợp Module 3: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 3: Vòng lặp và Các Bài toán Xử lý Lặp Kinh điển**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài làm chủ vòng lặp for (tăng/giảm), while, do-while, break, continue, lưới ký tự 2D cơ bản.
* ⚔️ **Trung bình (Medium):** 10 bài tối ưu O(sqrt(N)), số nguyên tố, Palindrome, UCLN Euclid, BCNN, Fibonacci O(1), tam giác rỗng.
* 👑 **Khó / Thử thách (Hard):** 10 bài tối ưu không gian O(1), số hoàn hảo lớn, Legendre N!, nhị phân, Collatz, Pascal, hình thoi đối xứng.

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

    console.log(`\n🎉 THÀNH CÔNG! Đã cập nhật xong ${successCount} bài tập thực hành Module 3 C++ lên Database!`);
}

seedCppModule3Practice()
    .catch((err) => {
        console.error('❌ Lỗi khi cập nhật bài tập Module 3 C++:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
