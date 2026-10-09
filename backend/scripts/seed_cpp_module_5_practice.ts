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
        title: "Nhập và In Mảng Số Nguyên Ngược Chiều (reversePrintArray)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Nắm vững cấu trúc mảng 1 chiều, truy xuất phần tử theo chỉ số và duyệt mảng từ cuối về đầu.\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 1000) và mảng gồm N số nguyên. Hãy in các phần tử của mảng theo thứ tự đảo ngược từ phần tử cuối cùng về phần tử đầu tiên, mỗi số cách nhau một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Một số nguyên dương N (1 <= N <= 1000).\n  * Dòng 2: N số nguyên A[0], A[1], ..., A[N-1] cách nhau một khoảng trắng (-10^9 <= A[i] <= 10^9).\n* **Đầu ra (Output):** Dãy số gồm N phần tử theo thứ tự ngược lại trên cùng một dòng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n10 20 30 40 50\n```\n\n**Khung Đầu ra (Output):**\n```text\n50 40 30 20 10\n```\n\n**Giải thích chi tiết:**\n* Phần tử cuối cùng là 50 được in đầu tiên, tiếp theo là 40, 30, 20 và phần tử đầu tiên là 10 được in cuối cùng.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      for (int i = n - 1; i >= 0; --i) {\n          std::cout << a[i] << (i == 0 ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n10 20 30 40 50\n",
                expectedOutput: "50 40 30 20 10\n",
                isHidden: false
            },
            {
                input: "1\n99\n",
                expectedOutput: "99\n",
                isHidden: false
            },
            {
                input: "4\n-5 0 5 10\n",
                expectedOutput: "10 5 0 -5\n",
                isHidden: true
            },
            {
                input: "6\n1 2 3 4 5 6\n",
                expectedOutput: "6 5 4 3 2 1\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tính Tổng và Trung Bình Cộng Các Phần Tử Mảng (sumAverageArray)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Duyệt mảng để tích lũy tổng vào biến `long long` tránh tràn số và ép kiểu tính trung bình cộng chính xác.\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^5) và mảng N số nguyên.\n  * Dòng 1: In tổng của tất cả các phần tử trong mảng.\n  * Dòng 2: In giá trị trung bình cộng của mảng lấy chính xác 2 chữ số thập phân.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên cách nhau bởi dấu cách (-10^9 <= A[i] <= 10^9).\n* **Đầu ra (Output):** Gồm 2 dòng: dòng 1 là tổng, dòng 2 là trung bình cộng với 2 chữ số thập phân.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n4\n5 12 7 9\n```\n\n**Khung Đầu ra (Output):**\n```text\n33\n8.25\n```\n\n**Giải thích chi tiết:**\n* Tổng = 5 + 12 + 7 + 9 = 33.\n* Trung bình cộng = 33 / 4 = 8.25.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n  #include <iomanip>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      long long tong = 0;\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n          tong += a[i];\n      }\n\n      double tbc = static_cast<double>(tong) / n;\n\n      std::cout << tong << '\\n';\n      std::cout << std::fixed << std::setprecision(2) << tbc << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "4\n5 12 7 9\n",
                expectedOutput: "33\n8.25\n",
                isHidden: false
            },
            {
                input: "1\n10\n",
                expectedOutput: "10\n10.00\n",
                isHidden: false
            },
            {
                input: "5\n-10 -20 30 40 0\n",
                expectedOutput: "40\n8.00\n",
                isHidden: true
            },
            {
                input: "3\n1 2 4\n",
                expectedOutput: "7\n2.33\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Phần Tử Lớn Nhất và Vị Trí Đầu Tiên Xuất Hiện (findMaxIndex)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Áp dụng thuật toán tìm kiếm cực trị trên mảng và ghi nhớ chỉ số (Index).\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^5) và mảng N số nguyên. Hãy tìm giá trị lớn nhất trong mảng và chỉ số đầu tiên (0-indexed) đạt giá trị đó. In ra giá trị lớn nhất và chỉ số cách nhau một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng (-10^18 <= A[i] <= 10^18).\n* **Đầu ra (Output):** Giá trị lớn nhất và chỉ số đầu tiên của nó (0-indexed).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6\n3 9 1 9 4 2\n```\n\n**Khung Đầu ra (Output):**\n```text\n9 1\n```\n\n**Giải thích chi tiết:**\n* Giá trị lớn nhất trong mảng là 9, xuất hiện lần đầu tiên tại vị trí chỉ số 1.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      long long maxVal = a[0];\n      int maxIdx = 0;\n\n      for (int i = 1; i < n; ++i) {\n          if (a[i] > maxVal) {\n              maxVal = a[i];\n              maxIdx = i;\n          }\n      }\n\n      std::cout << maxVal << \" \" << maxIdx << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6\n3 9 1 9 4 2\n",
                expectedOutput: "9 1\n",
                isHidden: false
            },
            {
                input: "1\n-5\n",
                expectedOutput: "-5 0\n",
                isHidden: false
            },
            {
                input: "5\n-10 -5 -2 -20 -1\n",
                expectedOutput: "-1 4\n",
                isHidden: true
            },
            {
                input: "4\n7 7 7 7\n",
                expectedOutput: "7 0\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đếm Số Lượng Số Chẵn và Số Lẻ trong Mảng (countEvenOdd)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Luyện tập duyệt mảng kết hợp điều kiện phân nhánh toán tử chia dư `%`.\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^5) và mảng N số nguyên. Hãy đếm xem trong mảng có bao nhiêu số chẵn và bao nhiêu số lẻ. In hai kết quả cách nhau một khoảng trắng (số chẵn trước, số lẻ sau).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên (-10^9 <= A[i] <= 10^9).\n* **Đầu ra (Output):** Hai số nguyên tương ứng là số lượng số chẵn và số lượng số lẻ.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n2 7 4 9 6\n```\n\n**Khung Đầu ra (Output):**\n```text\n3 2\n```\n\n**Giải thích chi tiết:**\n* Các số chẵn: {2, 4, 6} (3 số).\n* Các số lẻ: {7, 9} (2 số).",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      int demChan = 0, demLe = 0;\n      for (int i = 0; i < n; ++i) {\n          long long x = 0;\n          std::cin >> x;\n          if (x % 2 == 0) demChan++;\n          else demLe++;\n      }\n\n      std::cout << demChan << \" \" << demLe << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n2 7 4 9 6\n",
                expectedOutput: "3 2\n",
                isHidden: false
            },
            {
                input: "4\n1 3 5 7\n",
                expectedOutput: "0 4\n",
                isHidden: false
            },
            {
                input: "4\n2 4 6 8\n",
                expectedOutput: "4 0\n",
                isHidden: true
            },
            {
                input: "3\n0 -2 3\n",
                expectedOutput: "2 1\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Kiếm Tuyến Tính Phần Tử X (linearSearch)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Cài đặt thuật toán tìm kiếm tuần tự (Linear Search) cơ bản với độ phức tạp thời gian O(N).\n* **Mô tả:** Cho mảng gồm N số nguyên và một giá trị cần tìm X. Hãy tìm vị trí xuất hiện đầu tiên của X trong mảng (tính theo chỉ số từ 0). Nếu tìm thấy, in ra chỉ số đó; nếu X không tồn tại trong mảng, in ra `-1`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên N và X (1 <= N <= 10^5, -10^9 <= X <= 10^9).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Chỉ số đầu tiên tìm thấy X (0-indexed) hoặc -1.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6 25\n10 15 20 25 30 25\n```\n\n**Khung Đầu ra (Output):**\n```text\n3\n```\n\n**Giải thích chi tiết:**\n* Số 25 xuất hiện lần đầu tiên tại vị trí chỉ số 3 (A[3] = 25).",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      long long x = 0;\n      if (!(std::cin >> n >> x) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      int viTri = -1;\n\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n          if (a[i] == x && viTri == -1) {\n              viTri = i;\n          }\n      }\n\n      std::cout << viTri << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6 25\n10 15 20 25 30 25\n",
                expectedOutput: "3\n",
                isHidden: false
            },
            {
                input: "5 100\n1 2 3 4 5\n",
                expectedOutput: "-1\n",
                isHidden: false
            },
            {
                input: "1 7\n7\n",
                expectedOutput: "0\n",
                isHidden: true
            },
            {
                input: "4 -3\n5 -3 2 -3\n",
                expectedOutput: "1\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đảo Ngược Mảng Tại Chỗ Bằng Hai Con Trỏ (reverseArrayInplace)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Áp dụng kỹ thuật hai con trỏ (Two Pointers) từ hai đầu mảng `left = 0, right = N - 1` để đảo ngược mảng tại chỗ với O(1) bộ nhớ phụ.\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 1000) và mảng N số nguyên. Hãy thực hiện đảo ngược mảng trực tiếp trên bộ nhớ (in-place) bằng cách hoán vị `std::swap(A[left], A[right])`. In mảng sau khi đảo ngược ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 1000).\n  * Dòng 2: N số nguyên cách nhau bởi dấu cách.\n* **Đầu ra (Output):** Dãy số sau khi đảo ngược.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6\n1 2 3 4 5 6\n```\n\n**Khung Đầu ra (Output):**\n```text\n6 5 4 3 2 1\n```\n\n**Giải thích chi tiết:**\n* Các cặp (1, 6), (2, 5), (3, 4) được hoán vị lần lượt để thu được mảng đảo ngược hoàn chỉnh.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n  #include <utility>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      int left = 0, right = n - 1;\n      while (left < right) {\n          std::swap(a[left], a[right]);\n          left++;\n          right--;\n      }\n\n      for (int i = 0; i < n; ++i) {\n          std::cout << a[i] << (i == n - 1 ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6\n1 2 3 4 5 6\n",
                expectedOutput: "6 5 4 3 2 1\n",
                isHidden: false
            },
            {
                input: "5\n10 20 30 40 50\n",
                expectedOutput: "50 40 30 20 10\n",
                isHidden: false
            },
            {
                input: "1\n42\n",
                expectedOutput: "42\n",
                isHidden: true
            },
            {
                input: "2\n9 1\n",
                expectedOutput: "1 9\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Lọc Các Số Nguyên Tố Trong Mảng (filterPrimeNumbers)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Kết hợp hàm kiểm tra số nguyên tố với thao tác duyệt lọc phần tử mảng.\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 1000) và mảng N số nguyên. Hãy in ra tất cả các số nguyên tố có trong mảng theo đúng thứ tự xuất hiện ban đầu, mỗi số cách nhau một khoảng trắng. Nếu mảng không có số nguyên tố nào, in ra chuỗi `NONE`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 1000).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng (-10^9 <= A[i] <= 10^9).\n* **Đầu ra (Output):** Các số nguyên tố tìm được cách nhau bởi dấu cách, hoặc NONE.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n7\n4 7 12 13 1 2 15\n```\n\n**Khung Đầu ra (Output):**\n```text\n7 13 2\n```\n\n**Giải thích chi tiết:**\n* Các số 7, 13, 2 là số nguyên tố và được in ra theo đúng thứ tự. Số 1 và các hợp số 4, 12, 15 bị loại bỏ.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  bool laNguyenTo(long long n) {\n      if (n < 2) return false;\n      for (long long i = 2; i * i <= n; ++i) {\n          if (n % i == 0) return false;\n      }\n      return true;\n  }\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> primes;\n      for (int i = 0; i < n; ++i) {\n          long long x = 0;\n          std::cin >> x;\n          if (laNguyenTo(x)) {\n              primes.push_back(x);\n          }\n      }\n\n      if (primes.empty()) {\n          std::cout << \"NONE\\n\";\n      } else {\n          for (size_t i = 0; i < primes.size(); ++i) {\n              std::cout << primes[i] << (i + 1 == primes.size() ? \"\" : \" \");\n          }\n          std::cout << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "7\n4 7 12 13 1 2 15\n",
                expectedOutput: "7 13 2\n",
                isHidden: false
            },
            {
                input: "4\n1 4 6 8\n",
                expectedOutput: "NONE\n",
                isHidden: false
            },
            {
                input: "3\n2 3 5\n",
                expectedOutput: "2 3 5\n",
                isHidden: true
            },
            {
                input: "5\n0 -5 11 17 20\n",
                expectedOutput: "11 17\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Kiểm Tra Mảng Đã Được Sắp Xếp Tăng Dần Chưa (isSortedAscending)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Rèn luyện kỹ năng so sánh hai phần tử liền kề `A[i]` và `A[i + 1]` trong vòng lặp kiểm tra.\n* **Mô tả:** Nhập vào số nguyên dương N (1 <= N <= 10^5) và mảng N số nguyên. Hãy kiểm tra xem mảng đã được sắp xếp theo thứ tự không giảm (tăng dần hoặc bằng nhau: A[0] <= A[1] <= ... <= A[N-1]) hay chưa. In ra `YES` nếu đúng, ngược lại in `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng.\n* **Đầu ra (Output):** In ra `YES` hoặc `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n2 4 4 7 10\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* 2 <= 4 <= 4 <= 7 <= 10, các phần tử luôn không giảm nên mảng đã được sắp xếp tăng dần.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      bool daSapXep = true;\n      for (int i = 0; i < n - 1; ++i) {\n          if (a[i] > a[i + 1]) {\n              daSapXep = false;\n              break;\n          }\n      }\n\n      std::cout << (daSapXep ? \"YES\" : \"NO\") << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n2 4 4 7 10\n",
                expectedOutput: "YES\n",
                isHidden: false
            },
            {
                input: "4\n5 3 2 1\n",
                expectedOutput: "NO\n",
                isHidden: false
            },
            {
                input: "1\n100\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
            {
                input: "3\n1 1 1\n",
                expectedOutput: "YES\n",
                isHidden: true
            },
            {
                input: "4\n1 2 4 3\n",
                expectedOutput: "NO\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Xóa Phần Tử Tại Vị Trí K Trong Mảng (deleteElementAtK)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Nắm vững thao tác dịch chuyển các phần tử mảng sang trái từ vị trí chỉ số K để xóa một phần tử.\n* **Mô tả:** Cho mảng gồm N số nguyên và chỉ số K cần xóa (0 <= K < N). Hãy xóa phần tử tại chỉ số K và in ra mảng gồm N - 1 phần tử còn lại, mỗi số cách nhau một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên N và K (1 <= N <= 1000, 0 <= K < N).\n  * Dòng 2: N số nguyên cách nhau bởi dấu cách.\n* **Đầu ra (Output):** N - 1 số nguyên sau khi xóa phần tử tại chỉ số K.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5 2\n10 20 30 40 50\n```\n\n**Khung Đầu ra (Output):**\n```text\n10 20 40 50\n```\n\n**Giải thích chi tiết:**\n* Phần tử tại chỉ số 2 là 30 bị xóa bỏ. Các phần tử còn lại là {10, 20, 40, 50}.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0, k = 0;\n      if (!(std::cin >> n >> k) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      // X\u00f3a ph\u1ea7n t\u1eed t\u1ea1i ch\u1ec9 s\u1ed1 k b\u1eb1ng std::vector::erase ho\u1eb7c d\u1ed3n m\u1ea3ng\n      if (k >= 0 && k < n) {\n          a.erase(a.begin() + k);\n      }\n\n      for (size_t i = 0; i < a.size(); ++i) {\n          std::cout << a[i] << (i + 1 == a.size() ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5 2\n10 20 30 40 50\n",
                expectedOutput: "10 20 40 50\n",
                isHidden: false
            },
            {
                input: "4 0\n1 2 3 4\n",
                expectedOutput: "2 3 4\n",
                isHidden: false
            },
            {
                input: "4 3\n1 2 3 4\n",
                expectedOutput: "1 2 3\n",
                isHidden: true
            },
            {
                input: "2 1\n99 100\n",
                expectedOutput: "99\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Chèn Phần Tử X Vào Vị Trí K Trong Mảng (insertElementAtK)",
        difficulty: "EASY",
        problemDescription: "* **Mục tiêu:** Nắm vững thao tác mở rộng mảng và chèn phần tử mới vào vị trí chỉ số K bất kỳ.\n* **Mô tả:** Cho mảng gồm N số nguyên. Nhập vị trí chỉ số K (0 <= K <= N) và giá trị X cần chèn. Hãy chèn giá trị X vào vị trí chỉ số K và in ra mảng mới gồm N + 1 phần tử.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 1000).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng.\n  * Dòng 3: Hai số nguyên K và X (0 <= K <= N, -10^9 <= X <= 10^9).\n* **Đầu ra (Output):** N + 1 số nguyên của mảng sau khi chèn.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n4\n1 2 4 5\n2 99\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 2 99 4 5\n```\n\n**Giải thích chi tiết:**\n* Chèn số 99 vào vị trí chỉ số 2. Các phần tử từ vị trí 2 cũ bị đẩy lùi sang phải 1 bước: kết quả là {1, 2, 99, 4, 5}.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      int k = 0;\n      long long x = 0;\n      std::cin >> k >> x;\n\n      if (k >= 0 && k <= static_cast<int>(a.size())) {\n          a.insert(a.begin() + k, x);\n      }\n\n      for (size_t i = 0; i < a.size(); ++i) {\n          std::cout << a[i] << (i + 1 == a.size() ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "4\n1 2 4 5\n2 99\n",
                expectedOutput: "1 2 99 4 5\n",
                isHidden: false
            },
            {
                input: "3\n10 20 30\n0 5\n",
                expectedOutput: "5 10 20 30\n",
                isHidden: false
            },
            {
                input: "3\n10 20 30\n3 40\n",
                expectedOutput: "10 20 30 40\n",
                isHidden: true
            },
            {
                input: "1\n7\n1 8\n",
                expectedOutput: "7 8\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Phần Tử Lớn Thứ Nhì Trong Mảng (secondLargest)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Nắm vững thuật toán theo dõi đồng thời 2 giá trị cực trị Max1 và Max2 trong 1 lượt duyệt O(N).\n* **Mô tả:** Nhập vào số nguyên dương N (2 <= N <= 10^5) và mảng N số nguyên. Hãy tìm phần tử có giá trị lớn thứ nhì (nghiêm ngặt nhỏ hơn giá trị lớn nhất) trong mảng. Nếu tất cả các phần tử trong mảng đều bằng nhau (không tồn tại phần tử lớn thứ nhì), in ra `-1`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (2 <= N <= 10^5).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng (-10^9 <= A[i] <= 10^9).\n* **Đầu ra (Output):** Giá trị lớn thứ nhì hoặc -1.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n12 35 1 10 34\n```\n\n**Khung Đầu ra (Output):**\n```text\n34\n```\n\n**Giải thích chi tiết:**\n* Phần tử lớn nhất là 35. Phần tử lớn thứ nhì nghiêm ngặt là 34.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n < 2) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      long long max1 = a[0];\n      for (int i = 1; i < n; ++i) {\n          if (a[i] > max1) max1 = a[i];\n      }\n\n      bool timThay = false;\n      long long max2 = -1;\n\n      for (int i = 0; i < n; ++i) {\n          if (a[i] < max1) {\n              if (!timThay || a[i] > max2) {\n                  max2 = a[i];\n                  timThay = true;\n              }\n          }\n      }\n\n      if (timThay) {\n          std::cout << max2 << '\\n';\n      } else {\n          std::cout << -1 << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n12 35 1 10 34\n",
                expectedOutput: "34\n",
                isHidden: false
            },
            {
                input: "4\n5 5 5 5\n",
                expectedOutput: "-1\n",
                isHidden: false
            },
            {
                input: "3\n10 20 30\n",
                expectedOutput: "20\n",
                isHidden: true
            },
            {
                input: "4\n-10 -5 -2 -1\n",
                expectedOutput: "-2\n",
                isHidden: true
            },
            {
                input: "4\n100 100 90 80\n",
                expectedOutput: "90\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đếm Tần Suất Xuất Hiện Bằng Mảng Đếm (frequencyArray)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Áp dụng kỹ thuật mảng đếm tần suất (Frequency Array) với chỉ số là giá trị phần tử để đạt độ phức tạp O(N).\n* **Mô tả:** Cho mảng gồm N số nguyên không âm có giá trị trong khoảng từ 0 đến 1000. Hãy thống kê tần suất xuất hiện của mỗi giá trị trong mảng và in ra theo thứ tự tăng dần của các giá trị theo định dạng: `GiaTri: TanSuat` (mỗi giá trị trên một dòng riêng biệt).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên không âm (0 <= A[i] <= 1000).\n* **Đầu ra (Output):** Mỗi dòng gồm giá trị và số lần xuất hiện theo định dạng `GiaTri: TanSuat`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6\n5 2 5 8 2 2\n```\n\n**Khung Đầu ra (Output):**\n```text\n2: 3\n5: 2\n8: 1\n```\n\n**Giải thích chi tiết:**\n* Số 2 xuất hiện 3 lần, số 5 xuất hiện 2 lần, số 8 xuất hiện 1 lần. Các giá trị được sắp xếp tăng dần.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<int> cnt(1001, 0);\n      for (int i = 0; i < n; ++i) {\n          int x = 0;\n          std::cin >> x;\n          if (x >= 0 && x <= 1000) {\n              cnt[x]++;\n          }\n      }\n\n      for (int val = 0; val <= 1000; ++val) {\n          if (cnt[val] > 0) {\n              std::cout << val << \": \" << cnt[val] << '\\n';\n          }\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6\n5 2 5 8 2 2\n",
                expectedOutput: "2: 3\n5: 2\n8: 1\n",
                isHidden: false
            },
            {
                input: "4\n10 10 10 10\n",
                expectedOutput: "10: 4\n",
                isHidden: false
            },
            {
                input: "5\n1 2 3 4 5\n",
                expectedOutput: "1: 1\n2: 1\n3: 1\n4: 1\n5: 1\n",
                isHidden: true
            },
            {
                input: "7\n0 500 1000 0 500 0 1000\n",
                expectedOutput: "0: 3\n500: 2\n1000: 2\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Phần Tử Xuất Hiện Nhiều Nhất Trong Mảng (mostFrequentElement)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Tìm cực trị tần suất kết hợp quy tắc giải quyết hòa (Tie-breaking) ưu tiên giá trị nhỏ hơn.\n* **Mô tả:** Cho mảng gồm N số nguyên không âm (0 <= A[i] <= 1000). Hãy tìm phần tử có tần suất xuất hiện nhiều nhất trong mảng. Nếu có nhiều phần tử cùng có tần suất xuất hiện lớn nhất, hãy in ra phần tử có giá trị nhỏ nhất.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên không âm cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Giá trị phần tử xuất hiện nhiều nhất.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n7\n4 7 2 4 7 1 9\n```\n\n**Khung Đầu ra (Output):**\n```text\n4\n```\n\n**Giải thích chi tiết:**\n* Cả 4 và 7 đều xuất hiện 2 lần (nhiều nhất). Theo quy tắc ưu tiên giá trị nhỏ hơn, kết quả in ra là 4.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<int> cnt(1001, 0);\n      for (int i = 0; i < n; ++i) {\n          int x = 0;\n          std::cin >> x;\n          if (x >= 0 && x <= 1000) {\n              cnt[x]++;\n          }\n      }\n\n      int maxFreq = 0;\n      int bestVal = 0;\n\n      for (int val = 0; val <= 1000; ++val) {\n          if (cnt[val] > maxFreq) {\n              maxFreq = cnt[val];\n              bestVal = val;\n          }\n      }\n\n      std::cout << bestVal << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "7\n4 7 2 4 7 1 9\n",
                expectedOutput: "4\n",
                isHidden: false
            },
            {
                input: "5\n3 3 3 2 2\n",
                expectedOutput: "3\n",
                isHidden: false
            },
            {
                input: "4\n10 20 30 40\n",
                expectedOutput: "10\n",
                isHidden: true
            },
            {
                input: "6\n5 1 5 1 2 3\n",
                expectedOutput: "1\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Sắp Xếp Nổi Bọt và Đếm Số Lần Hoán Vị (Bubble Sort)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Cài đặt thuật toán Bubble Sort và đo lường độ nghịch thế qua số lần hoán vị (swaps).\n* **Mô tả:** Nhập vào mảng gồm N số nguyên (1 <= N <= 1000). Hãy cài đặt thuật toán sắp xếp nổi bọt (Bubble Sort) để sắp xếp mảng theo thứ tự tăng dần.\n  * Dòng 1: In mảng sau khi đã sắp xếp tăng dần, mỗi số cách nhau một khoảng trắng.\n  * Dòng 2: In tổng số lần hoán vị phần tử (swap) đã diễn ra.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 1000).\n  * Dòng 2: N số nguyên (-10^9 <= A[i] <= 10^9).\n* **Đầu ra (Output):** Gồm 2 dòng: mảng sau khi sắp xếp và số lần hoán vị.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n4\n4 3 2 1\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 2 3 4\n6\n```\n\n**Giải thích chi tiết:**\n* Mảng nghịch đảo hoàn toàn {4, 3, 2, 1} cần đúng 6 lần hoán vị để đưa về thứ tự tăng dần {1, 2, 3, 4}.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n  #include <utility>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      long long soLanSwap = 0;\n      for (int i = 0; i < n - 1; ++i) {\n          for (int j = 0; j < n - 1 - i; ++j) {\n              if (a[j] > a[j + 1]) {\n                  std::swap(a[j], a[j + 1]);\n                  soLanSwap++;\n              }\n          }\n      }\n\n      for (int i = 0; i < n; ++i) {\n          std::cout << a[i] << (i == n - 1 ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n      std::cout << soLanSwap << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "4\n4 3 2 1\n",
                expectedOutput: "1 2 3 4\n6\n",
                isHidden: false
            },
            {
                input: "4\n1 2 3 4\n",
                expectedOutput: "1 2 3 4\n0\n",
                isHidden: false
            },
            {
                input: "5\n5 1 4 2 8\n",
                expectedOutput: "1 2 4 5 8\n4\n",
                isHidden: true
            },
            {
                input: "3\n3 1 2\n",
                expectedOutput: "1 2 3\n2\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Sắp Xếp Chọn và In Trạng Thái Mảng Từng Bước (Selection Sort)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Hiểu rõ cơ chế tìm phần tử nhỏ nhất và đưa về đầu mảng ở từng vòng lặp của Selection Sort.\n* **Mô tả:** Cho mảng gồm N số nguyên (1 <= N <= 50). Hãy cài đặt thuật toán sắp xếp chọn (Selection Sort).\n  * Ở mỗi bước lặp `i` từ 0 đến N - 2: tìm phần tử nhỏ nhất trong đoạn từ chỉ số `i` đến `N - 1`, hoán vị nó với phần tử tại chỉ số `i`.\n  * Sau mỗi bước hoán vị đó, hãy in ra toàn bộ trạng thái mảng hiện tại trên một dòng riêng biệt.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 50).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng.\n* **Đầu ra (Output):** N - 1 dòng, mỗi dòng thể hiện trạng thái mảng sau bước lặp tương ứng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n4\n5 3 1 2\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 3 5 2\n1 2 5 3\n1 2 3 5\n```\n\n**Giải thích chi tiết:**\n* Bước 1 (i=0): Số 1 nhỏ nhất hoán vị với 5 -> {1, 3, 5, 2}.\n* Bước 2 (i=1): Số 2 nhỏ nhất trong {3, 5, 2} hoán vị với 3 -> {1, 2, 5, 3}.\n* Bước 3 (i=2): Số 3 nhỏ nhất trong {5, 3} hoán vị với 5 -> {1, 2, 3, 5}.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n  #include <utility>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      for (int i = 0; i < n - 1; ++i) {\n          int minIdx = i;\n          for (int j = i + 1; j < n; ++j) {\n              if (a[j] < a[minIdx]) {\n                  minIdx = j;\n              }\n          }\n          std::swap(a[i], a[minIdx]);\n\n          for (int k = 0; k < n; ++k) {\n              std::cout << a[k] << (k == n - 1 ? \"\" : \" \");\n          }\n          std::cout << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "4\n5 3 1 2\n",
                expectedOutput: "1 3 5 2\n1 2 5 3\n1 2 3 5\n",
                isHidden: false
            },
            {
                input: "3\n3 2 1\n",
                expectedOutput: "1 2 3\n1 2 3\n",
                isHidden: false
            },
            {
                input: "4\n1 2 3 4\n",
                expectedOutput: "1 2 3 4\n1 2 3 4\n1 2 3 4\n",
                isHidden: true
            },
            {
                input: "5\n9 7 5 3 1\n",
                expectedOutput: "1 7 5 3 9\n1 3 5 7 9\n1 3 5 7 9\n1 3 5 7 9\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Mảng Cộng Dồn và Truy Vấn Tổng Đoạn [L, R] (Prefix Sum)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Áp dụng mảng tiền tố (Prefix Sum) để trả lời truy vấn tổng đoạn trong O(1) thời gian.\n* **Mô tả:** Cho mảng A gồm N số nguyên và Q truy vấn. Mỗi truy vấn gồm hai chỉ số L và R (1-indexed với 1 <= L <= R <= N). Hãy tính và in ra tổng các phần tử từ vị trí L đến vị trí R: `A[L] + A[L+1] + ... + A[R]`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên N và Q (1 <= N, Q <= 10^5).\n  * Dòng 2: N số nguyên cách nhau bởi dấu cách (-10^9 <= A[i] <= 10^9).\n  * Q dòng tiếp theo: mỗi dòng gồm hai số nguyên L và R cách nhau bởi dấu cách.\n* **Đầu ra (Output):** Q dòng, mỗi dòng là kết quả tổng đoạn tương ứng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5 3\n2 4 6 8 10\n1 3\n2 4\n1 5\n```\n\n**Khung Đầu ra (Output):**\n```text\n12\n18\n30\n```\n\n**Giải thích chi tiết:**\n* Tổng từ 1 đến 3: 2 + 4 + 6 = 12.\n* Tổng từ 2 đến 4: 4 + 6 + 8 = 18.\n* Tổng từ 1 đến 5: 2 + 4 + 6 + 8 + 10 = 30.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      std::ios_base::sync_with_stdio(false);\n      std::cin.tie(NULL);\n\n      int n = 0, q = 0;\n      if (!(std::cin >> n >> q) || n <= 0) return 0;\n\n      std::vector<long long> pref(n + 1, 0);\n      for (int i = 1; i <= n; ++i) {\n          long long x = 0;\n          std::cin >> x;\n          pref[i] = pref[i - 1] + x;\n      }\n\n      for (int k = 0; k < q; ++k) {\n          int l = 0, r = 0;\n          std::cin >> l >> r;\n          std::cout << pref[r] - pref[l - 1] << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5 3\n2 4 6 8 10\n1 3\n2 4\n1 5\n",
                expectedOutput: "12\n18\n30\n",
                isHidden: false
            },
            {
                input: "4 2\n1 2 3 4\n1 1\n4 4\n",
                expectedOutput: "1\n4\n",
                isHidden: false
            },
            {
                input: "3 1\n-5 10 -2\n1 3\n",
                expectedOutput: "3\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Kiếm Nhị Phân (Binary Search)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Cài đặt thuật toán tìm kiếm nhị phân với độ phức tạp O(log N) trên mảng đã sắp xếp.\n* **Mô tả:** Cho mảng gồm N số nguyên đã được sắp xếp theo thứ tự tăng dần và một giá trị X cần tìm. Hãy áp dụng thuật toán tìm kiếm nhị phân để xác định xem X có trong mảng hay không. Nếu có, in ra chỉ số (0-indexed) của X; nếu không có, in ra `-1`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên N và X (1 <= N <= 10^5, -10^9 <= X <= 10^9).\n  * Dòng 2: N số nguyên đã sắp xếp tăng dần.\n* **Đầu ra (Output):** Chỉ số tìm thấy X (0-indexed) hoặc -1.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6 15\n3 7 10 15 22 30\n```\n\n**Khung Đầu ra (Output):**\n```text\n3\n```\n\n**Giải thích chi tiết:**\n* Số 15 nằm tại vị trí chỉ số 3 (A[3] = 15).",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      long long x = 0;\n      if (!(std::cin >> n >> x) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      int left = 0, right = n - 1;\n      int res = -1;\n\n      while (left <= right) {\n          int mid = left + (right - left) / 2;\n          if (a[mid] == x) {\n              res = mid;\n              break;\n          } else if (a[mid] < x) {\n              left = mid + 1;\n          } else {\n              right = mid - 1;\n          }\n      }\n\n      std::cout << res << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6 15\n3 7 10 15 22 30\n",
                expectedOutput: "3\n",
                isHidden: false
            },
            {
                input: "5 100\n2 4 6 8 10\n",
                expectedOutput: "-1\n",
                isHidden: false
            },
            {
                input: "4 2\n2 4 6 8\n",
                expectedOutput: "0\n",
                isHidden: true
            },
            {
                input: "4 8\n2 4 6 8\n",
                expectedOutput: "3\n",
                isHidden: true
            },
            {
                input: "1 5\n5\n",
                expectedOutput: "0\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Gộp Hai Mảng Đã Sắp Xếp Bằng Hai Con Trỏ (mergeTwoSortedArrays)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Áp dụng kỹ thuật hai con trỏ để gộp 2 mảng tăng dần thành 1 mảng tăng dần trong thời gian O(N + M) (nền tảng của Merge Sort).\n* **Mô tả:** Cho hai mảng số nguyên A (gồm N phần tử) và B (gồm M phần tử) đều đã được sắp xếp tăng dần. Hãy gộp hai mảng thành một mảng duy nhất gồm N + M phần tử theo thứ tự tăng dần mà không dùng hàm `std::sort`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên N và M (1 <= N, M <= 10^5).\n  * Dòng 2: N số nguyên của mảng A đã sắp xếp.\n  * Dòng 3: M số nguyên của mảng B đã sắp xếp.\n* **Đầu ra (Output):** N + M số nguyên của mảng sau khi gộp theo thứ tự tăng dần.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 4\n1 5 9\n2 4 6 8\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 2 4 5 6 8 9\n```\n\n**Giải thích chi tiết:**\n* So sánh từng cặp phần tử đầu của 2 mảng, chọn phần tử nhỏ hơn đưa vào mảng kết quả: {1, 2, 4, 5, 6, 8, 9}.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0, m = 0;\n      if (!(std::cin >> n >> m) || n <= 0 || m <= 0) return 0;\n\n      std::vector<long long> a(n), b(m);\n      for (int i = 0; i < n; ++i) std::cin >> a[i];\n      for (int j = 0; j < m; ++j) std::cin >> b[j];\n\n      std::vector<long long> c;\n      c.reserve(n + m);\n\n      int i = 0, j = 0;\n      while (i < n && j < m) {\n          if (a[i] <= b[j]) {\n              c.push_back(a[i++]);\n          } else {\n              c.push_back(b[j++]);\n          }\n      }\n\n      while (i < n) c.push_back(a[i++]);\n      while (j < m) c.push_back(b[j++]);\n\n      for (size_t k = 0; k < c.size(); ++k) {\n          std::cout << c[k] << (k + 1 == c.size() ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "3 4\n1 5 9\n2 4 6 8\n",
                expectedOutput: "1 2 4 5 6 8 9\n",
                isHidden: false
            },
            {
                input: "2 2\n1 3\n2 4\n",
                expectedOutput: "1 2 3 4\n",
                isHidden: false
            },
            {
                input: "1 3\n10\n1 5 20\n",
                expectedOutput: "1 5 10 20\n",
                isHidden: true
            },
            {
                input: "3 2\n1 2 3\n4 5\n",
                expectedOutput: "1 2 3 4 5\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Dịch Vòng Mảng Sang Phải K Vị Trí (rotateArrayRight)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Áp dụng phép chia dư `(i + K) % N` hoặc kỹ thuật 3 lần đảo ngược mảng để dịch chuyển vòng tuần hoàn.\n* **Mô tả:** Cho mảng gồm N số nguyên và số bước dịch K (K >= 0). Hãy dịch chuyển xoay vòng các phần tử của mảng sang phải K vị trí (mỗi lần dịch sang phải 1 vị trí thì phần tử cuối cùng chuyển lên vị trí đầu tiên). In mảng kết quả ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên N và K (1 <= N <= 10^5, 0 <= K <= 10^9).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Mảng sau khi dịch vòng sang phải K bước.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5 2\n1 2 3 4 5\n```\n\n**Khung Đầu ra (Output):**\n```text\n4 5 1 2 3\n```\n\n**Giải thích chi tiết:**\n* Dịch phải 1 bước: {5, 1, 2, 3, 4}.\n* Dịch phải 2 bước: {4, 5, 1, 2, 3}.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      long long k = 0;\n      if (!(std::cin >> n >> k) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      int kReal = static_cast<int>(k % n);\n      std::vector<long long> res(n);\n\n      for (int i = 0; i < n; ++i) {\n          res[(i + kReal) % n] = a[i];\n      }\n\n      for (int i = 0; i < n; ++i) {\n          std::cout << res[i] << (i == n - 1 ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5 2\n1 2 3 4 5\n",
                expectedOutput: "4 5 1 2 3\n",
                isHidden: false
            },
            {
                input: "4 0\n10 20 30 40\n",
                expectedOutput: "10 20 30 40\n",
                isHidden: false
            },
            {
                input: "3 3\n1 2 3\n",
                expectedOutput: "1 2 3\n",
                isHidden: true
            },
            {
                input: "5 7\n1 2 3 4 5\n",
                expectedOutput: "4 5 1 2 3\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Liệt Kê Các Phần Tử Xuất Hiện Đúng Một Lần (uniqueElements)",
        difficulty: "MEDIUM",
        problemDescription: "* **Mục tiêu:** Kết hợp mảng đếm tần suất với thứ tự xuất hiện ban đầu để lọc ra các phần tử độc nhất (Unique).\n* **Mô tả:** Cho mảng gồm N số nguyên không âm (0 <= A[i] <= 1000). Hãy liệt kê các phần tử xuất hiện đúng 1 lần (tần suất bằng 1) theo đúng thứ tự xuất hiện ban đầu trong mảng. Nếu không có phần tử nào thỏa mãn, in ra `NONE`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên không âm cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Các phần tử độc nhất cách nhau một khoảng trắng, hoặc NONE.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n7\n12 5 8 12 7 5 3\n```\n\n**Khung Đầu ra (Output):**\n```text\n8 7 3\n```\n\n**Giải thích chi tiết:**\n* Số 12 xuất hiện 2 lần, số 5 xuất hiện 2 lần. Các số chỉ xuất hiện đúng 1 lần theo thứ tự ban đầu là: 8, 7, 3.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<int> a(n);\n      std::vector<int> cnt(1001, 0);\n\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n          if (a[i] >= 0 && a[i] <= 1000) {\n              cnt[a[i]]++;\n          }\n      }\n\n      bool coIn = false;\n      for (int i = 0; i < n; ++i) {\n          if (cnt[a[i]] == 1) {\n              if (coIn) std::cout << \" \";\n              std::cout << a[i];\n              coIn = true;\n          }\n      }\n\n      if (!coIn) {\n          std::cout << \"NONE\";\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "7\n12 5 8 12 7 5 3\n",
                expectedOutput: "8 7 3\n",
                isHidden: false
            },
            {
                input: "4\n2 2 4 4\n",
                expectedOutput: "NONE\n",
                isHidden: false
            },
            {
                input: "5\n1 2 3 4 5\n",
                expectedOutput: "1 2 3 4 5\n",
                isHidden: true
            },
            {
                input: "6\n10 20 10 30 20 40\n",
                expectedOutput: "30 40\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Đoạn Con Liên Tiếp Có Tổng Lớn Nhất (Thuật toán Kadane)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Cài đặt thuật toán Kadane tối ưu tìm dãy con liên tiếp có tổng cực đại trong O(N) thời gian và O(1) bộ nhớ phụ.\n* **Mô tả:** Cho mảng gồm N số nguyên (có thể có cả số âm). Hãy tìm một đoạn con liên tiếp gồm ít nhất một phần tử sao cho tổng các phần tử trong đoạn con đó là lớn nhất có thể. In ra giá trị tổng lớn nhất đó.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng (-10^9 <= A[i] <= 10^9).\n* **Đầu ra (Output):** Một số nguyên duy nhất là tổng đoạn con lớn nhất.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n8\n-2 -3 4 -1 -2 1 5 -3\n```\n\n**Khung Đầu ra (Output):**\n```text\n7\n```\n\n**Giải thích chi tiết:**\n* Đoạn con liên tiếp có tổng lớn nhất là {4, -1, -2, 1, 5} với tổng bằng 4 + (-1) + (-2) + 1 + 5 = 7.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n  #include <algorithm>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      long long currentSum = a[0];\n      long long maxSum = a[0];\n\n      for (int i = 1; i < n; ++i) {\n          currentSum = std::max(a[i], currentSum + a[i]);\n          maxSum = std::max(maxSum, currentSum);\n      }\n\n      std::cout << maxSum << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "8\n-2 -3 4 -1 -2 1 5 -3\n",
                expectedOutput: "7\n",
                isHidden: false
            },
            {
                input: "4\n-5 -2 -8 -1\n",
                expectedOutput: "-1\n",
                isHidden: false
            },
            {
                input: "5\n1 2 3 4 5\n",
                expectedOutput: "15\n",
                isHidden: true
            },
            {
                input: "6\n-1 2 3 -4 5 1\n",
                expectedOutput: "7\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Cặp Phần Tử Có Tổng Bằng K Bằng Hai Con Trỏ (twoSumSorted)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Áp dụng kỹ thuật hai con trỏ trên mảng đã sắp xếp để tìm cặp số có tổng bằng K trong O(N).\n* **Mô tả:** Cho mảng gồm N số nguyên đã được sắp xếp tăng dần và một số nguyên K. Hãy tìm một cặp chỉ số i < j (1-indexed) sao cho `A[i] + A[j] == K`. Nếu có nhiều cặp thỏa mãn, hãy in ra cặp có chỉ số `i` nhỏ nhất; nếu không tồn tại cặp nào, in ra `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên N và K (2 <= N <= 10^5, -10^9 <= K <= 10^9).\n  * Dòng 2: N số nguyên đã sắp xếp tăng dần.\n* **Đầu ra (Output):** Hai chỉ số i và j (1-indexed) cách nhau bởi dấu cách, hoặc NO.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5 9\n1 2 4 5 7\n```\n\n**Khung Đầu ra (Output):**\n```text\n2 5\n```\n\n**Giải thích chi tiết:**\n* A[2] = 2 và A[5] = 7, tổng 2 + 7 = 9.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      long long k = 0;\n      if (!(std::cin >> n >> k) || n < 2) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      int left = 0, right = n - 1;\n      bool timThay = false;\n\n      while (left < right) {\n          long long sum = a[left] + a[right];\n          if (sum == k) {\n              std::cout << (left + 1) << \" \" << (right + 1) << '\\n';\n              timThay = true;\n              break;\n          } else if (sum < k) {\n              left++;\n          } else {\n              right--;\n          }\n      }\n\n      if (!timThay) {\n          std::cout << \"NO\\n\";\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5 9\n1 2 4 5 7\n",
                expectedOutput: "2 5\n",
                isHidden: false
            },
            {
                input: "4 10\n1 2 3 4\n",
                expectedOutput: "NO\n",
                isHidden: false
            },
            {
                input: "4 6\n1 2 4 5\n",
                expectedOutput: "1 4\n",
                isHidden: true
            },
            {
                input: "5 10\n2 3 5 7 8\n",
                expectedOutput: "1 5\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Sàng Số Nguyên Tố Eratosthenes Bằng Mảng Đánh Dấu (sieveOfEratosthenes)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Cài đặt thuật toán Sàng Eratosthenes kinh điển bằng mảng đánh dấu `bool` để tìm tất cả các số nguyên tố trong O(N log log N).\n* **Mô tả:** Nhập vào một số nguyên dương N (2 <= N <= 10^6). Hãy sử dụng thuật toán Sàng Eratosthenes để:\n  * Dòng 1: In số lượng số nguyên tố không vượt quá N.\n  * Dòng 2: In danh sách tất cả các số nguyên tố đó theo thứ tự tăng dần, mỗi số cách nhau một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (2 <= N <= 10^6).\n* **Đầu ra (Output):** Dòng 1 là số lượng, dòng 2 là danh sách các số nguyên tố.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n20\n```\n\n**Khung Đầu ra (Output):**\n```text\n8\n2 3 5 7 11 13 17 19\n```\n\n**Giải thích chi tiết:**\n* Có 8 số nguyên tố <= 20: 2, 3, 5, 7, 11, 13, 17, 19.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n < 2) return 0;\n\n      std::vector<bool> isPrime(n + 1, true);\n      isPrime[0] = isPrime[1] = false;\n\n      for (int i = 2; 1LL * i * i <= n; ++i) {\n          if (isPrime[i]) {\n              for (int j = i * i; j <= n; j += i) {\n                  isPrime[j] = false;\n              }\n          }\n      }\n\n      std::vector<int> primes;\n      for (int i = 2; i <= n; ++i) {\n          if (isPrime[i]) {\n              primes.push_back(i);\n          }\n      }\n\n      std::cout << primes.size() << '\\n';\n      for (size_t i = 0; i < primes.size(); ++i) {\n          std::cout << primes[i] << (i + 1 == primes.size() ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "20\n",
                expectedOutput: "8\n2 3 5 7 11 13 17 19\n",
                isHidden: false
            },
            {
                input: "2\n",
                expectedOutput: "1\n2\n",
                isHidden: false
            },
            {
                input: "10\n",
                expectedOutput: "4\n2 3 5 7\n",
                isHidden: true
            },
            {
                input: "50\n",
                expectedOutput: "15\n2 3 5 7 11 13 17 19 23 29 31 37 41 43 47\n",
                isHidden: true
            },
            {
                input: "100\n",
                expectedOutput: "25\n2 3 5 7 11 13 17 19 23 29 31 37 41 43 47 53 59 61 67 71 73 79 83 89 97\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Thuật Toán Bầu Phiếu Boyer-Moore Tìm Phần Tử Đa Số (majorityElement)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Cài đặt thuật toán Boyer-Moore Majority Vote Algorithm tìm phần tử chiếm đa số (> N / 2) với O(N) thời gian và O(1) bộ nhớ phụ.\n* **Mô tả:** Cho mảng gồm N số nguyên. Phần tử đa số (Majority Element) là phần tử xuất hiện nhiều hơn N / 2 lần trong mảng. Hãy tìm và in ra phần tử đa số đó. Nếu không tồn tại phần tử nào xuất hiện quá N / 2 lần, in ra `-1`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên cách nhau bởi dấu cách (-10^9 <= A[i] <= 10^9).\n* **Đầu ra (Output):** Giá trị của phần tử đa số hoặc -1.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n7\n2 2 1 1 1 2 2\n```\n\n**Khung Đầu ra (Output):**\n```text\n2\n```\n\n**Giải thích chi tiết:**\n* Số 2 xuất hiện 4 lần trong mảng 7 phần tử (4 > 7 / 2 = 3.5), nên 2 là phần tử đa số.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      // Pha 1: T\u00ecm \u1ee9ng vi\u00ean b\u1eb1ng thu\u1eadt to\u00e1n Boyer-Moore\n      long long ungVien = a[0];\n      int count = 1;\n      for (int i = 1; i < n; ++i) {\n          if (count == 0) {\n              ungVien = a[i];\n              count = 1;\n          } else if (a[i] == ungVien) {\n              count++;\n          } else {\n              count--;\n          }\n      }\n\n      // Pha 2: Ki\u1ec3m tra l\u1ea1i t\u1ea7n su\u1ea5t th\u1ef1c t\u1ebf c\u1ee7a \u1ee9ng vi\u00ean\n      int demThucTe = 0;\n      for (int i = 0; i < n; ++i) {\n          if (a[i] == ungVien) demThucTe++;\n      }\n\n      if (demThucTe > n / 2) {\n          std::cout << ungVien << '\\n';\n      } else {\n          std::cout << -1 << '\\n';\n      }\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "7\n2 2 1 1 1 2 2\n",
                expectedOutput: "2\n",
                isHidden: false
            },
            {
                input: "6\n1 2 3 1 2 3\n",
                expectedOutput: "-1\n",
                isHidden: false
            },
            {
                input: "5\n3 3 4 2 3\n",
                expectedOutput: "3\n",
                isHidden: true
            },
            {
                input: "1\n99\n",
                expectedOutput: "99\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Dồn Toàn Bộ Số 0 Về Cuối Mảng Giữ Nguyên Thứ Tự Inplace (moveZeroes)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Kỹ thuật con trỏ ghi đè tại chỗ (In-place) không tốn bộ nhớ phụ O(1) để dồn các phần tử đặc biệt.\n* **Mô tả:** Cho mảng gồm N số nguyên. Hãy di chuyển tất cả các số 0 về cuối mảng, đồng thời phải giữ nguyên thứ tự tương đối của tất cả các phần tử khác 0 ban đầu. Thao tác phải được thực hiện trực tiếp trên mảng hiện tại mà không tạo thêm mảng phụ thứ hai.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Mảng sau khi đã dồn tất cả các số 0 về cuối.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6\n0 1 0 3 12 0\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 3 12 0 0 0\n```\n\n**Giải thích chi tiết:**\n* Các số khác 0 giữ nguyên thứ tự {1, 3, 12}, ba số 0 được dồn về cuối cùng.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n  #include <utility>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      int viTriKhacKhong = 0;\n      for (int i = 0; i < n; ++i) {\n          if (a[i] != 0) {\n              std::swap(a[viTriKhacKhong], a[i]);\n              viTriKhacKhong++;\n          }\n      }\n\n      for (int i = 0; i < n; ++i) {\n          std::cout << a[i] << (i == n - 1 ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6\n0 1 0 3 12 0\n",
                expectedOutput: "1 3 12 0 0 0\n",
                isHidden: false
            },
            {
                input: "4\n0 0 0 0\n",
                expectedOutput: "0 0 0 0\n",
                isHidden: false
            },
            {
                input: "4\n1 2 3 4\n",
                expectedOutput: "1 2 3 4\n",
                isHidden: true
            },
            {
                input: "5\n0 0 1 2 0\n",
                expectedOutput: "1 2 0 0 0\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Xóa Phần Tử Trùng Lặp Trên Mảng Đã Sắp Xếp (removeDuplicatesSorted)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Áp dụng kỹ thuật hai con trỏ Slow-Fast để loại bỏ các phần tử trùng lặp tại chỗ.\n* **Mô tả:** Cho mảng gồm N số nguyên đã được sắp xếp tăng dần. Hãy loại bỏ các phần tử bị trùng lặp sao cho mỗi phần tử duy nhất chỉ xuất hiện đúng một lần.\n  * Dòng 1: In số lượng phần tử duy nhất còn lại K.\n  * Dòng 2: In K phần tử duy nhất đó theo thứ tự tăng dần.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên đã sắp xếp tăng dần.\n* **Đầu ra (Output):** Gồm 2 dòng: dòng 1 là số lượng K, dòng 2 là K phần tử duy nhất.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6\n1 1 2 2 3 4\n```\n\n**Khung Đầu ra (Output):**\n```text\n4\n1 2 3 4\n```\n\n**Giải thích chi tiết:**\n* Các phần tử duy nhất là {1, 2, 3, 4} (tổng cộng 4 phần tử).",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      int slow = 0;\n      for (int fast = 1; fast < n; ++fast) {\n          if (a[fast] != a[slow]) {\n              slow++;\n              a[slow] = a[fast];\n          }\n      }\n\n      int k = slow + 1;\n      std::cout << k << '\\n';\n      for (int i = 0; i < k; ++i) {\n          std::cout << a[i] << (i == k - 1 ? \"\" : \" \");\n      }\n      std::cout << '\\n';\n\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6\n1 1 2 2 3 4\n",
                expectedOutput: "4\n1 2 3 4\n",
                isHidden: false
            },
            {
                input: "4\n5 5 5 5\n",
                expectedOutput: "1\n5\n",
                isHidden: false
            },
            {
                input: "4\n1 2 3 4\n",
                expectedOutput: "4\n1 2 3 4\n",
                isHidden: true
            },
            {
                input: "7\n0 0 1 1 1 2 2\n",
                expectedOutput: "3\n0 1 2\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Độ Dài Đoạn Con Dài Nhất Có Tổng Bằng 0 (longestSubarrayZeroSum)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Kết hợp mảng tiền tố (Prefix Sum) để nhận diện hai vị trí có cùng giá trị tổng tiền tố `Pref[i] == Pref[j]` thì đoạn giữa có tổng bằng 0.\n* **Mô tả:** Cho mảng gồm N số nguyên (1 <= N <= 1000). Hãy tìm độ dài của đoạn con liên tiếp dài nhất có tổng các phần tử đúng bằng 0. Nếu không có đoạn con nào có tổng bằng 0, in ra `0`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 1000).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng (-10^9 <= A[i] <= 10^9).\n* **Đầu ra (Output):** Một số nguyên duy nhất là độ dài đoạn con dài nhất có tổng bằng 0.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6\n1 2 -3 3 1 -4\n```\n\n**Khung Đầu ra (Output):**\n```text\n6\n```\n\n**Giải thích chi tiết:**\n* Toàn bộ mảng: 1 + 2 + (-3) + 3 + 1 + (-4) = 0. Độ dài lớn nhất là 6.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n  #include <algorithm>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      int maxLen = 0;\n      for (int i = 0; i < n; ++i) {\n          long long sum = 0;\n          for (int j = i; j < n; ++j) {\n              sum += a[j];\n              if (sum == 0) {\n                  maxLen = std::max(maxLen, j - i + 1);\n              }\n          }\n      }\n\n      std::cout << maxLen << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6\n1 2 -3 3 1 -4\n",
                expectedOutput: "6\n",
                isHidden: false
            },
            {
                input: "4\n1 2 3 4\n",
                expectedOutput: "0\n",
                isHidden: false
            },
            {
                input: "5\n2 8 -3 -5 2\n",
                expectedOutput: "3\n",
                isHidden: true
            },
            {
                input: "4\n0 0 0 0\n",
                expectedOutput: "4\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Đếm Số Lượng Cặp Nghịch Thế Trong Mảng (countInversions)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Hiểu rõ khái niệm cặp nghịch thế (Inversion Pair) đo độ mất trật tự của mảng.\n* **Mô tả:** Cho mảng gồm N số nguyên. Một cặp chỉ số (i, j) được gọi là một cặp nghịch thế nếu:\n  * `0 <= i < j < N`\n  * `A[i] > A[j]`\n  Hãy đếm và in ra tổng số lượng cặp nghịch thế trong mảng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 2000).\n  * Dòng 2: N số nguyên cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Một số nguyên duy nhất là số cặp nghịch thế.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n2 4 1 3 5\n```\n\n**Khung Đầu ra (Output):**\n```text\n3\n```\n\n**Giải thích chi tiết:**\n* Các cặp nghịch thế là: (2, 1) vì A[0] > A[2], (4, 1) vì A[1] > A[2], và (4, 3) vì A[1] > A[3]. Tổng cộng 3 cặp.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      long long count = 0;\n      for (int i = 0; i < n - 1; ++i) {\n          for (int j = i + 1; j < n; ++j) {\n              if (a[i] > a[j]) {\n                  count++;\n              }\n          }\n      }\n\n      std::cout << count << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n2 4 1 3 5\n",
                expectedOutput: "3\n",
                isHidden: false
            },
            {
                input: "4\n1 2 3 4\n",
                expectedOutput: "0\n",
                isHidden: false
            },
            {
                input: "4\n4 3 2 1\n",
                expectedOutput: "6\n",
                isHidden: true
            },
            {
                input: "5\n5 2 3 4 1\n",
                expectedOutput: "7\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Tìm Số Còn Thiếu Trong Dãy Số Từ 1 Đến N+1 (findMissingNumber)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Áp dụng kỹ thuật tổng Gauss hoặc toán tử XOR để tìm phần tử duy nhất bị thiếu trong O(N) thời gian và O(1) bộ nhớ phụ.\n* **Mô tả:** Cho mảng gồm N số nguyên phân biệt đôi một, tất cả các số đều nằm trong khoảng từ 1 đến N + 1. Điều này có nghĩa là có đúng 1 số nguyên trong khoảng [1, N + 1] bị thiếu. Hãy tìm số nguyên bị thiếu đó.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên phân biệt trong khoảng [1, N + 1].\n* **Đầu ra (Output):** Một số nguyên duy nhất là số bị thiếu.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n5\n1 2 4 6 3\n```\n\n**Khung Đầu ra (Output):**\n```text\n5\n```\n\n**Giải thích chi tiết:**\n* Dãy số đầy đủ từ 1 đến 6 là {1, 2, 3, 4, 5, 6}. Mảng gồm {1, 2, 4, 6, 3} nên số bị thiếu là 5.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 0) return 0;\n\n      long long xorAll = 0;\n      for (int i = 1; i <= n + 1; ++i) {\n          xorAll ^= i;\n      }\n\n      for (int i = 0; i < n; ++i) {\n          long long x = 0;\n          std::cin >> x;\n          xorAll ^= x;\n      }\n\n      std::cout << xorAll << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "5\n1 2 4 6 3\n",
                expectedOutput: "5\n",
                isHidden: false
            },
            {
                input: "1\n2\n",
                expectedOutput: "1\n",
                isHidden: false
            },
            {
                input: "1\n1\n",
                expectedOutput: "2\n",
                isHidden: true
            },
            {
                input: "4\n5 3 2 1\n",
                expectedOutput: "4\n",
                isHidden: true
            },
            {
                input: "6\n2 4 1 7 5 3\n",
                expectedOutput: "6\n",
                isHidden: true
            },
        ]
    },
    {
        title: "Bài Toán Hứng Nước Mưa Tuyến Tính (Trapping Rain Water Cơ Bản)",
        difficulty: "HARD",
        problemDescription: "* **Mục tiêu:** Áp dụng mảng tiền tố và mảng hậu tố cực đại `maxLeft[i]` và `maxRight[i]` để giải quyết bài toán hứng nước mưa kinh điển trong O(N) thời gian.\n* **Mô tả:** Cho mảng gồm N số nguyên không âm đại diện cho bản đồ độ cao của các cột có độ rộng bằng 1. Hãy tính xem sau một cơn mưa, có thể giữ lại được tổng cộng bao nhiêu đơn vị nước mưa giữa các cột.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 10^5).\n  * Dòng 2: N số nguyên không âm đại diện cho độ cao (0 <= A[i] <= 10^5).\n* **Đầu ra (Output):** Tổng lượng nước mưa giữ lại được (kiểu `long long`).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n6\n3 0 0 2 0 4\n```\n\n**Khung Đầu ra (Output):**\n```text\n10\n```\n\n**Giải thích chi tiết:**\n* Cột 1 (cao 0): giữ min(3, 4) - 0 = 3 đơn vị nước.\n* Cột 2 (cao 0): giữ min(3, 4) - 0 = 3 đơn vị nước.\n* Cột 3 (cao 2): giữ min(3, 4) - 2 = 1 đơn vị nước.\n* Cột 4 (cao 0): giữ min(3, 4) - 0 = 3 đơn vị nước.\n* Tổng cộng lượng nước mưa giữ lại = 3 + 3 + 1 + 3 = 10.",
        starterCode: "#include <iostream>\n#include <vector>\n\nint main() {\n    // Khai b\u00e1o m\u1ea3ng / vector v\u00e0 c\u00e0i \u0111\u1eb7t thu\u1eadt to\u00e1n x\u1eed l\u00fd c\u1ee7a b\u1ea1n:\n    \n    return 0;\n}\n",
        solutionCode: "#include <iostream>\n  #include <vector>\n  #include <algorithm>\n\n  int main() {\n      int n = 0;\n      if (!(std::cin >> n) || n <= 2) {\n          std::cout << 0 << '\\n';\n          return 0;\n      }\n\n      std::vector<long long> a(n);\n      for (int i = 0; i < n; ++i) {\n          std::cin >> a[i];\n      }\n\n      std::vector<long long> maxLeft(n, 0);\n      std::vector<long long> maxRight(n, 0);\n\n      maxLeft[0] = a[0];\n      for (int i = 1; i < n; ++i) {\n          maxLeft[i] = std::max(maxLeft[i - 1], a[i]);\n      }\n\n      maxRight[n - 1] = a[n - 1];\n      for (int i = n - 2; i >= 0; --i) {\n          maxRight[i] = std::max(maxRight[i + 1], a[i]);\n      }\n\n      long long tongNuoc = 0;\n      for (int i = 0; i < n; ++i) {\n          long long mucNuoc = std::min(maxLeft[i], maxRight[i]);\n          if (mucNuoc > a[i]) {\n              tongNuoc += (mucNuoc - a[i]);\n          }\n      }\n\n      std::cout << tongNuoc << '\\n';\n      return 0;\n  }\n",
        testCases: [
            {
                input: "6\n3 0 0 2 0 4\n",
                expectedOutput: "10\n",
                isHidden: false
            },
            {
                input: "5\n1 2 3 4 5\n",
                expectedOutput: "0\n",
                isHidden: false
            },
            {
                input: "5\n5 4 3 2 1\n",
                expectedOutput: "0\n",
                isHidden: true
            },
            {
                input: "7\n4 2 0 3 2 5 1\n",
                expectedOutput: "9\n",
                isHidden: true
            },
            {
                input: "3\n2 0 2\n",
                expectedOutput: "2\n",
                isHidden: true
            },
        ]
    }

];

export async function seedCppModule5Practice() {
    console.log('🚀 Bắt đầu cập nhật toàn bộ 30 bài tập chuẩn hóa Module 5 C++ vào Database...');

    // 1. Tìm Module 5 của C++
    const module5 = await prisma.module.findUnique({
        where: { moduleId: 'CPP-MOD-05' }
    });

    if (!module5) {
        throw new Error('❌ Không tìm thấy Module 5 (CPP-MOD-05)!');
    }

    // 2. Tìm Chapter 5 của Module 5
    const chapter5 = await prisma.chapter.findFirst({
        where: {
            moduleId: module5.id,
            chapterId: 'CPP-CH-05'
        }
    });

    if (!chapter5) {
        throw new Error('❌ Không tìm thấy Chapter 5 của Module 5!');
    }

    // 3. Upsert bài học tổng hợp CPP-05.MP
    const lessonMp = await prisma.lesson.upsert({
        where: {
            id: 'c1b10000-0005-4000-8000-000000000001'
        },
        update: {
            lessonId: 'CPP-05.MP',
            title: 'Bài tập thực hành tổng hợp Module 5: Mảng 1 Chiều và std::vector Động',
            objective: 'Hệ thống 30 bài tập rèn luyện chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức mảng tĩnh 1 chiều, mảng động std::vector, các thuật toán duyệt, tìm kiếm, sắp xếp và giải thuật mảng kinh điển của Module 5 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 90,
            isFree: true,
            orderIndex: 5,
            chapterId: chapter5.id,
            content: `# Bài tập thực hành tổng hợp Module 5: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 5: Mảng 1 Chiều và std::vector Động**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài làm chủ thao tác duyệt mảng, tìm Min/Max, đếm chẵn lẻ, tìm kiếm tuyến tính, đảo mảng và chèn/xóa phần tử.
* ⚔️ **Trung bình (Medium):** 10 bài mảng đếm tần suất, sắp xếp nổi bọt (Bubble Sort), sắp xếp chọn (Selection Sort), tìm kiếm nhị phân (Binary Search), mảng cộng dồn Prefix Sum, gộp mảng và dịch vòng.
* 👑 **Khó / Thử thách (Hard):** 10 bài giải thuật mảng nâng cao: Thuật toán Kadane, Hai con trỏ Two Pointers, Sàng Eratosthenes, Boyer-Moore Majority Vote, đếm cặp nghịch thế và bài toán hứng nước mưa.

Chúc bạn hoàn thành xuất sắc toàn bộ thử thách!`
        },
        create: {
            id: 'c1b10000-0005-4000-8000-000000000001',
            lessonId: 'CPP-05.MP',
            title: 'Bài tập thực hành tổng hợp Module 5: Mảng 1 Chiều và std::vector Động',
            objective: 'Hệ thống 30 bài tập rèn luyện chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức mảng tĩnh 1 chiều, mảng động std::vector, các thuật toán duyệt, tìm kiếm, sắp xếp và giải thuật mảng kinh điển của Module 5 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 90,
            isFree: true,
            orderIndex: 5,
            chapterId: chapter5.id,
            content: `# Bài tập thực hành tổng hợp Module 5: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 5: Mảng 1 Chiều và std::vector Động**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài làm chủ thao tác duyệt mảng, tìm Min/Max, đếm chẵn lẻ, tìm kiếm tuyến tính, đảo mảng và chèn/xóa phần tử.
* ⚔️ **Trung bình (Medium):** 10 bài mảng đếm tần suất, sắp xếp nổi bọt (Bubble Sort), sắp xếp chọn (Selection Sort), tìm kiếm nhị phân (Binary Search), mảng cộng dồn Prefix Sum, gộp mảng và dịch vòng.
* 👑 **Khó / Thử thách (Hard):** 10 bài giải thuật mảng nâng cao: Thuật toán Kadane, Hai con trỏ Two Pointers, Sàng Eratosthenes, Boyer-Moore Majority Vote, đếm cặp nghịch thế và bài toán hứng nước mưa.

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

    console.log(`\n🎉 THÀNH CÔNG! Đã cập nhật xong ${successCount} bài tập thực hành Module 5 C++ lên Database!`);
}

seedCppModule5Practice()
    .catch((err) => {
        console.error('❌ Lỗi khi cập nhật bài tập Module 5 C++:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
