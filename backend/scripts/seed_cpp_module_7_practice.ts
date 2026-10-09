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
        "title": "Nhập và In Ma Trận Số Nguyên Kích Thước R x C (printMatrix)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Làm quen với cú pháp khai báo, nhập và xuất ma trận hai chiều bằng hai vòng lặp lồng nhau trong C++.\n* **Mô tả:** Nhập vào hai số nguyên dương R và C lần lượt là số hàng và số cột của ma trận (1 <= R, C <= 100). Tiếp theo là các phần tử của ma trận số nguyên A. Hãy in ma trận A ra màn hình theo đúng dạng bảng: gồm R dòng, mỗi dòng chứa C số nguyên cách nhau một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C cách nhau một khoảng trắng (1 <= R, C <= 100).\n  * R dòng tiếp theo: Mỗi dòng chứa C số nguyên A[i][j] (-10^4 <= A[i][j] <= 10^4).\n* **Đầu ra (Output):** R dòng biểu diễn ma trận theo đúng cấu trúc hàng và cột.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 3\n1 2 3\n4 5 6\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 2 3\n4 5 6\n```\n\n**Giải thích chi tiết:**\n* Ma trận gồm 2 hàng và 3 cột được in ra chính xác theo định dạng lưới 2 chiều.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cout << a[i][j] << (j + 1 == c ? \"\" : \" \");\n        }\n        std::cout << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "2 3\n1 2 3\n4 5 6\n",
                "expectedOutput": "1 2 3\n4 5 6\n",
                "isHidden": false
            },
            {
                "input": "1 1\n99\n",
                "expectedOutput": "99\n",
                "isHidden": false
            },
            {
                "input": "3 2\n-1 -2\n0 5\n10 20\n",
                "expectedOutput": "-1 -2\n0 5\n10 20\n",
                "isHidden": true
            },
            {
                "input": "4 4\n1 0 0 0\n0 1 0 0\n0 0 1 0\n0 0 0 1\n",
                "expectedOutput": "1 0 0 0\n0 1 0 0\n0 0 1 0\n0 0 0 1\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tính Tổng và Giá Trị Trung Bình Của Ma Trận (sumAndAverageMatrix)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Nắm vững thao tác tích lũy giá trị trên toàn bộ lưới 2D và ép kiểu số thực khi tính trung bình cộng.\n* **Mô tả:** Nhập vào ma trận số nguyên kích thước R x C. Hãy tính tổng tất cả các phần tử trong ma trận và giá trị trung bình cộng của chúng. In ra tổng và giá trị trung bình cộng (lấy 2 chữ số thập phân sau dấu phẩy) cách nhau một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: Mỗi dòng chứa C số nguyên A[i][j] (-10^4 <= A[i][j] <= 10^4).\n* **Đầu ra (Output):** Hai giá trị: Tổng (số nguyên) và Giá trị trung bình (làm tròn 2 chữ số thập phân).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 2\n10 20\n30 40\n```\n\n**Khung Đầu ra (Output):**\n```text\n100 25.00\n```\n\n**Giải thích chi tiết:**\n* Tổng = 10 + 20 + 30 + 40 = 100.\n* Số phần tử = 2 * 2 = 4.\n* Trung bình cộng = 100 / 4 = 25.00.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n#include <iomanip>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c) || r <= 0 || c <= 0) return 0;\n\n    long long sum = 0;\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            int val = 0;\n            std::cin >> val;\n            sum += val;\n        }\n    }\n\n    double avg = static_cast<double>(sum) / (r * c);\n    std::cout << sum << \" \" << std::fixed << std::setprecision(2) << avg << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "2 2\n10 20\n30 40\n",
                "expectedOutput": "100 25.00\n",
                "isHidden": false
            },
            {
                "input": "1 3\n5 10 15\n",
                "expectedOutput": "30 10.00\n",
                "isHidden": false
            },
            {
                "input": "3 1\n-5\n0\n5\n",
                "expectedOutput": "0 0.00\n",
                "isHidden": true
            },
            {
                "input": "2 3\n1 2 3\n4 5 6\n",
                "expectedOutput": "21 3.50\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tìm Phần Tử Lớn Nhất và Tọa Độ Trong Ma Trận (findMaxAndPosition)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Duyệt lưới tìm giá trị cực đại đồng thời lưu lại vị trí hàng và cột `(r, c)`.\n* **Mô tả:** Nhập vào ma trận số nguyên A kích thước R x C. Hãy tìm giá trị lớn nhất trong ma trận và in ra giá trị đó cùng với chỉ số hàng và chỉ số cột đầu tiên xuất hiện giá trị lớn nhất đó (theo thứ tự ưu tiên duyệt từ hàng trên xuống dưới, từ cột trái sang phải, chỉ số tính từ 0).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên A[i][j].\n* **Đầu ra (Output):** In ra 3 số nguyên cách nhau một khoảng trắng: Giá trị lớn nhất, Chỉ số hàng, Chỉ số cột.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 3\n1 5 9\n8 9 2\n3 7 4\n```\n\n**Khung Đầu ra (Output):**\n```text\n9 0 2\n```\n\n**Giải thích chi tiết:**\n* Giá trị lớn nhất là 9, xuất hiện ở ô (0, 2) và ô (1, 1). Vị trí đầu tiên tìm thấy theo thứ tự duyệt hàng-cột là hàng 0, cột 2.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    int maxVal = -1e9;\n    int maxR = 0, maxC = 0;\n    bool first = true;\n\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            int val = 0;\n            std::cin >> val;\n            if (first || val > maxVal) {\n                maxVal = val;\n                maxR = i;\n                maxC = j;\n                first = false;\n            }\n        }\n    }\n\n    std::cout << maxVal << \" \" << maxR << \" \" << maxC << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3 3\n1 5 9\n8 9 2\n3 7 4\n",
                "expectedOutput": "9 0 2\n",
                "isHidden": false
            },
            {
                "input": "1 1\n42\n",
                "expectedOutput": "42 0 0\n",
                "isHidden": false
            },
            {
                "input": "2 2\n-10 -5\n-2 -8\n",
                "expectedOutput": "-2 1 0\n",
                "isHidden": true
            },
            {
                "input": "2 3\n10 20 30\n40 50 60\n",
                "expectedOutput": "60 1 2\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tính Tổng Từng Hàng Của Ma Trận (sumOfEachRow)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Rèn luyện kỹ thuật gom nhóm dữ liệu theo hàng (vòng lặp ngoài duyệt hàng, reset biến tổng cho mỗi hàng).\n* **Mô tả:** Cho ma trận kích thước R x C. Hãy tính tổng các phần tử của từng hàng từ hàng 0 đến hàng R - 1 và in kết quả mỗi hàng trên một dòng riêng biệt.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: Mỗi dòng chứa C số nguyên.\n* **Đầu ra (Output):** R dòng, dòng thứ i chứa tổng các phần tử của hàng thứ i.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 3\n1 2 3\n4 5 6\n7 8 9\n```\n\n**Khung Đầu ra (Output):**\n```text\n6\n15\n24\n```\n\n**Giải thích chi tiết:**\n* Hàng 0: 1 + 2 + 3 = 6.\n* Hàng 1: 4 + 5 + 6 = 15.\n* Hàng 2: 7 + 8 + 9 = 24.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    for (int i = 0; i < r; ++i) {\n        long long rowSum = 0;\n        for (int j = 0; j < c; ++j) {\n            int val = 0;\n            std::cin >> val;\n            rowSum += val;\n        }\n        std::cout << rowSum << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3 3\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "6\n15\n24\n",
                "isHidden": false
            },
            {
                "input": "2 2\n-5 5\n10 -10\n",
                "expectedOutput": "0\n0\n",
                "isHidden": false
            },
            {
                "input": "1 4\n1 2 3 4\n",
                "expectedOutput": "10\n",
                "isHidden": true
            },
            {
                "input": "4 1\n10\n20\n30\n40\n",
                "expectedOutput": "10\n20\n30\n40\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tính Tổng Từng Cột Của Ma Trận (sumOfEachColumn)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Thay đổi thứ tự vòng lặp (vòng lặp ngoài duyệt cột, vòng lặp trong duyệt hàng) để xử lý dữ liệu theo cột.\n* **Mô tả:** Cho ma trận số nguyên A kích thước R x C. Hãy tính tổng các phần tử trên từng cột từ cột 0 đến cột C - 1. In ra các tổng trên cùng một dòng, cách nhau bởi một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên.\n* **Đầu ra (Output):** Một dòng gồm C số nguyên cách nhau một khoảng trắng biểu diễn tổng của từng cột.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 3\n1 2 3\n4 5 6\n```\n\n**Khung Đầu ra (Output):**\n```text\n5 7 9\n```\n\n**Giải thích chi tiết:**\n* Cột 0: 1 + 4 = 5.\n* Cột 1: 2 + 5 = 7.\n* Cột 2: 3 + 6 = 9.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<long long> colSum(c, 0);\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            int val = 0;\n            std::cin >> val;\n            colSum[j] += val;\n        }\n    }\n\n    for (int j = 0; j < c; ++j) {\n        std::cout << colSum[j] << (j + 1 == c ? \"\" : \" \");\n    }\n    std::cout << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "2 3\n1 2 3\n4 5 6\n",
                "expectedOutput": "5 7 9\n",
                "isHidden": false
            },
            {
                "input": "3 2\n1 10\n2 20\n3 30\n",
                "expectedOutput": "6 60\n",
                "isHidden": false
            },
            {
                "input": "1 1\n100\n",
                "expectedOutput": "100\n",
                "isHidden": true
            },
            {
                "input": "3 3\n-1 0 1\n-2 0 2\n-3 0 3\n",
                "expectedOutput": "-6 0 6\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Đếm Số Lượng Chẵn Lẻ và Số Âm Trong Ma Trận (countEvenOddNegative)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Áp dụng câu lệnh rẽ nhánh điều kiện lồng trong duyệt mảng 2 chiều.\n* **Mô tả:** Nhập vào ma trận số nguyên A kích thước R x C. Hãy đếm và in ra 3 số nguyên cách nhau một khoảng trắng: Số lượng số chẵn, Số lượng số lẻ, Số lượng số âm (< 0). (Lưu ý: Số 0 được tính là số chẵn và không phải số âm).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: C số nguyên mỗi dòng.\n* **Đầu ra (Output):** 3 số nguyên cách nhau một khoảng trắng: Số chẵn, Số lẻ, Số âm.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 3\n-2 0 3\n-5 4 -1\n```\n\n**Khung Đầu ra (Output):**\n```text\n3 3 3\n```\n\n**Giải thích chi tiết:**\n* Số chẵn: -2, 0, 4 (3 số).\n* Số lẻ: 3, -5, -1 (3 số).\n* Số âm: -2, -5, -1 (3 số).\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    int evenCount = 0, oddCount = 0, negCount = 0;\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            int val = 0;\n            std::cin >> val;\n            if (val % 2 == 0) evenCount++;\n            else oddCount++;\n            if (val < 0) negCount++;\n        }\n    }\n\n    std::cout << evenCount << \" \" << oddCount << \" \" << negCount << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "2 3\n-2 0 3\n-5 4 -1\n",
                "expectedOutput": "3 3 3\n",
                "isHidden": false
            },
            {
                "input": "2 2\n0 2\n4 6\n",
                "expectedOutput": "4 0 0\n",
                "isHidden": false
            },
            {
                "input": "1 4\n-1 -3 -5 -7\n",
                "expectedOutput": "0 4 4\n",
                "isHidden": true
            },
            {
                "input": "3 2\n-10 15\n0 -4\n7 8\n",
                "expectedOutput": "4 2 2\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tính Tổng Đường Chéo Chính Ma Trận Vuông (sumMainDiagonal)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Nắm vững quy luật đường chéo chính của ma trận vuông (chỉ số hàng bằng chỉ số cột `i == j`) và tối ưu độ phức tạp về O(N).\n* **Mô tả:** Nhập vào một số nguyên dương N là kích thước của ma trận vuông N x N (1 <= N <= 100) và các phần tử của ma trận. Hãy tính và in ra tổng các phần tử nằm trên đường chéo chính (từ góc trên trái xuống góc dưới phải).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 100).\n  * N dòng tiếp theo: Mỗi dòng chứa N số nguyên A[i][j].\n* **Đầu ra (Output):** Một số nguyên duy nhất là tổng đường chéo chính.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3\n1 2 3\n4 5 6\n7 8 9\n```\n\n**Khung Đầu ra (Output):**\n```text\n15\n```\n\n**Giải thích chi tiết:**\n* Các phần tử trên đường chéo chính là A[0][0] = 1, A[1][1] = 5, A[2][2] = 9. Tổng = 1 + 5 + 9 = 15.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n)) return 0;\n\n    long long sum = 0;\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < n; ++j) {\n            int val = 0;\n            std::cin >> val;\n            if (i == j) sum += val;\n        }\n    }\n\n    std::cout << sum << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "15\n",
                "isHidden": false
            },
            {
                "input": "1\n99\n",
                "expectedOutput": "99\n",
                "isHidden": false
            },
            {
                "input": "4\n1 0 0 0\n0 2 0 0\n0 0 3 0\n0 0 0 4\n",
                "expectedOutput": "10\n",
                "isHidden": true
            },
            {
                "input": "2\n-5 10\n20 -15\n",
                "expectedOutput": "-20\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tính Tổng Đường Chéo Phụ Ma Trận Vuông (sumAntiDiagonal)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Nắm vững quy luật đường chéo phụ của ma trận vuông (tổng chỉ số hàng và cột `i + j == N - 1` hay `j = N - 1 - i`).\n* **Mô tả:** Cho ma trận vuông cấp N (1 <= N <= 100). Hãy tính và in ra tổng của các phần tử nằm trên đường chéo phụ (từ góc trên phải xuống góc dưới trái).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 100).\n  * N dòng tiếp theo: Mỗi dòng chứa N số nguyên.\n* **Đầu ra (Output):** Một số nguyên duy nhất là tổng đường chéo phụ.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3\n1 2 3\n4 5 6\n7 8 9\n```\n\n**Khung Đầu ra (Output):**\n```text\n15\n```\n\n**Giải thích chi tiết:**\n* Các phần tử trên đường chéo phụ là A[0][2] = 3, A[1][1] = 5, A[2][0] = 7. Tổng = 3 + 5 + 7 = 15.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n)) return 0;\n\n    long long sum = 0;\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < n; ++j) {\n            int val = 0;\n            std::cin >> val;\n            if (i + j == n - 1) sum += val;\n        }\n    }\n\n    std::cout << sum << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "15\n",
                "isHidden": false
            },
            {
                "input": "1\n50\n",
                "expectedOutput": "50\n",
                "isHidden": false
            },
            {
                "input": "2\n1 2\n3 4\n",
                "expectedOutput": "5\n",
                "isHidden": true
            },
            {
                "input": "4\n0 0 0 5\n0 0 6 0\n0 7 0 0\n8 0 0 0\n",
                "expectedOutput": "26\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tìm Ma Trận Chuyển Vị (transposeMatrix)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Hiểu bản chất phép chuyển vị ma trận (biến hàng i thành cột i: `T[j][i] = A[i][j]`).\n* **Mô tả:** Nhập vào ma trận A kích thước R x C. Hãy tạo và in ra ma trận chuyển vị T của A (có kích thước C x R).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên.\n* **Đầu ra (Output):** C dòng, mỗi dòng gồm R số nguyên cách nhau một khoảng trắng biểu diễn ma trận chuyển vị.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 3\n1 2 3\n4 5 6\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 4\n2 5\n3 6\n```\n\n**Giải thích chi tiết:**\n* Ma trận ban đầu kích thước 2 x 3 được chuyển thành ma trận mới kích thước 3 x 2, trong đó hàng 1 `[1, 2, 3]` biến thành cột 1, hàng 2 `[4, 5, 6]` biến thành cột 2.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    for (int j = 0; j < c; ++j) {\n        for (int i = 0; i < r; ++i) {\n            std::cout << a[i][j] << (i + 1 == r ? \"\" : \" \");\n        }\n        std::cout << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "2 3\n1 2 3\n4 5 6\n",
                "expectedOutput": "1 4\n2 5\n3 6\n",
                "isHidden": false
            },
            {
                "input": "3 2\n1 4\n2 5\n3 6\n",
                "expectedOutput": "1 2 3\n4 5 6\n",
                "isHidden": false
            },
            {
                "input": "1 1\n7\n",
                "expectedOutput": "7\n",
                "isHidden": true
            },
            {
                "input": "3 3\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "1 4 7\n2 5 8\n3 6 9\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Nhân Ma Trận Với Số Vô Hướng (scalarMultiplyMatrix)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Thao tác biến đổi trực tiếp trên từng phần tử ma trận bằng phép nhân vô hướng.\n* **Mô tả:** Cho ma trận A kích thước R x C và một số nguyên K. Hãy nhân mọi phần tử của ma trận A với số nguyên K và in ma trận kết quả ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên A[i][j].\n  * Dòng cuối: Số nguyên K (-1000 <= K <= 1000).\n* **Đầu ra (Output):** R dòng biểu diễn ma trận sau khi đã nhân với K.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 2\n1 2\n3 4\n3\n```\n\n**Khung Đầu ra (Output):**\n```text\n3 6\n9 12\n```\n\n**Giải thích chi tiết:**\n* Mọi phần tử đều được nhân với K = 3: 1*3=3, 2*3=6, 3*3=9, 4*3=12.",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    int k = 0;\n    std::cin >> k;\n\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cout << a[i][j] * k << (j + 1 == c ? \"\" : \" \");\n        }\n        std::cout << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "2 2\n1 2\n3 4\n3\n",
                "expectedOutput": "3 6\n9 12\n",
                "isHidden": false
            },
            {
                "input": "1 3\n10 -20 30\n-2\n",
                "expectedOutput": "-20 40 -60\n",
                "isHidden": false
            },
            {
                "input": "2 2\n5 5\n5 5\n0\n",
                "expectedOutput": "0 0\n0 0\n",
                "isHidden": true
            },
            {
                "input": "3 1\n1\n2\n3\n5\n",
                "expectedOutput": "5\n10\n15\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Cộng Hai Ma Trận Cùng Kích Thước (addTwoMatrices)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Áp dụng phép toán đại số cộng hai ma trận cùng kích thước `C[i][j] = A[i][j] + B[i][j]`.\n* **Mô tả:** Nhập vào hai số nguyên R và C (1 <= R, C <= 100). Tiếp theo là hai ma trận số nguyên A và B đều có kích thước R x C. Hãy tính và in ra ma trận tổng C = A + B.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C cách nhau một khoảng trắng.\n  * R dòng tiếp theo: Ma trận A.\n  * R dòng tiếp theo: Ma trận B.\n* **Đầu ra (Output):** R dòng biểu diễn ma trận tổng C, mỗi hàng gồm C số nguyên cách nhau một khoảng trắng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 2\n1 2\n3 4\n5 6\n7 8\n```\n\n**Khung Đầu ra (Output):**\n```text\n6 8\n10 12\n```\n\n**Giải thích chi tiết:**\n* C[0][0] = 1 + 5 = 6.\n* C[0][1] = 2 + 6 = 8.\n* C[1][0] = 3 + 7 = 10.\n* C[1][1] = 4 + 8 = 12.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    std::vector<std::vector<int>> b(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> b[i][j];\n        }\n    }\n\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cout << (a[i][j] + b[i][j]) << (j + 1 == c ? \"\" : \" \");\n        }\n        std::cout << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "2 2\n1 2\n3 4\n5 6\n7 8\n",
                "expectedOutput": "6 8\n10 12\n",
                "isHidden": false
            },
            {
                "input": "1 3\n1 2 3\n4 5 6\n",
                "expectedOutput": "5 7 9\n",
                "isHidden": false
            },
            {
                "input": "3 1\n-1\n-2\n-3\n1\n2\n3\n",
                "expectedOutput": "0\n0\n0\n",
                "isHidden": true
            },
            {
                "input": "2 3\n0 0 0\n0 0 0\n1 2 3\n4 5 6\n",
                "expectedOutput": "1 2 3\n4 5 6\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Kiểm Tra Ma Trận Đối Xứng Qua Đường Chéo Chính (isSymmetricMatrix)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Nắm vững tính chất đối xứng hình học của ma trận vuông (`A[i][j] == A[j][i]` với mọi i, j).\n* **Mô tả:** Nhập vào một số nguyên dương N và ma trận vuông cấp N x N. Hãy kiểm tra xem ma trận này có phải là ma trận đối xứng qua đường chéo chính hay không (nghĩa là ma trận ban đầu trùng khớp hoàn toàn với ma trận chuyển vị của nó). In ra `YES` nếu đối xứng, ngược lại in ra `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 100).\n  * N dòng tiếp theo: Mỗi dòng gồm N số nguyên biểu diễn ma trận.\n* **Đầu ra (Output):** In `YES` nếu đối xứng, ngược lại in `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3\n1 2 3\n2 4 5\n3 5 6\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* A[0][1] == A[1][0] == 2, A[0][2] == A[2][0] == 3, A[1][2] == A[2][1] == 5. Ma trận hoàn toàn đối xứng qua đường chéo chính nên in `YES`.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n)) return 0;\n\n    std::vector<std::vector<int>> a(n, std::vector<int>(n));\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < n; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    bool sym = true;\n    for (int i = 0; i < n; ++i) {\n        for (int j = i + 1; j < n; ++j) {\n            if (a[i][j] != a[j][i]) {\n                sym = false;\n                break;\n            }\n        }\n        if (!sym) break;\n    }\n\n    std::cout << (sym ? \"YES\" : \"NO\") << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3\n1 2 3\n2 4 5\n3 5 6\n",
                "expectedOutput": "YES\n",
                "isHidden": false
            },
            {
                "input": "3\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "NO\n",
                "isHidden": false
            },
            {
                "input": "1\n100\n",
                "expectedOutput": "YES\n",
                "isHidden": true
            },
            {
                "input": "2\n1 5\n5 1\n",
                "expectedOutput": "YES\n",
                "isHidden": true
            },
            {
                "input": "2\n1 2\n3 4\n",
                "expectedOutput": "NO\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tính Tổng Các Phần Tử Thuộc Tam Giác Trên (sumUpperTriangle)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Luyện tập duyệt nửa ma trận vuông với điều kiện chỉ số hàng và cột `i <= j`.\n* **Mô tả:** Cho ma trận vuông cấp N (1 <= N <= 100). Nửa tam giác trên của ma trận bao gồm các phần tử nằm trên đường chéo chính và toàn bộ các phần tử nằm ở phía trên đường chéo chính (tương ứng với các ô có `i <= j`). Hãy tính và in ra tổng của tất cả các phần tử thuộc nửa tam giác trên này.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 100).\n  * N dòng tiếp theo: Mỗi dòng gồm N số nguyên.\n* **Đầu ra (Output):** Một số nguyên duy nhất là tổng tam giác trên.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3\n1 2 3\n4 5 6\n7 8 9\n```\n\n**Khung Đầu ra (Output):**\n```text\n26\n```\n\n**Giải thích chi tiết:**\n* Các phần tử thuộc tam giác trên gồm:\n  * Hàng 0: A[0][0] = 1, A[0][1] = 2, A[0][2] = 3.\n  * Hàng 1: A[1][1] = 5, A[1][2] = 6.\n  * Hàng 2: A[2][2] = 9.\n* Tổng = 1 + 2 + 3 + 5 + 6 + 9 = 26.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n)) return 0;\n\n    long long sum = 0;\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < n; ++j) {\n            int val = 0;\n            std::cin >> val;\n            if (i <= j) sum += val;\n        }\n    }\n\n    std::cout << sum << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "26\n",
                "isHidden": false
            },
            {
                "input": "1\n10\n",
                "expectedOutput": "10\n",
                "isHidden": false
            },
            {
                "input": "2\n1 2\n3 4\n",
                "expectedOutput": "7\n",
                "isHidden": true
            },
            {
                "input": "4\n1 1 1 1\n0 1 1 1\n0 0 1 1\n0 0 0 1\n",
                "expectedOutput": "10\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tính Tổng Các Phần Tử Thuộc Tam Giác Dưới (sumLowerTriangle)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Luyện tập duyệt nửa ma trận vuông với điều kiện chỉ số hàng và cột `i >= j`.\n* **Mô tả:** Cho ma trận vuông cấp N (1 <= N <= 100). Nửa tam giác dưới của ma trận bao gồm các phần tử nằm trên đường chéo chính và toàn bộ các phần tử nằm ở phía dưới đường chéo chính (tương ứng với các ô có `i >= j`). Hãy tính và in ra tổng của tất cả các phần tử thuộc nửa tam giác dưới.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 100).\n  * N dòng tiếp theo: Mỗi dòng gồm N số nguyên.\n* **Đầu ra (Output):** Một số nguyên duy nhất là tổng tam giác dưới.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3\n1 2 3\n4 5 6\n7 8 9\n```\n\n**Khung Đầu ra (Output):**\n```text\n34\n```\n\n**Giải thích chi tiết:**\n* Các phần tử tam giác dưới:\n  * Hàng 0: A[0][0] = 1.\n  * Hàng 1: A[1][0] = 4, A[1][1] = 5.\n  * Hàng 2: A[2][0] = 7, A[2][1] = 8, A[2][2] = 9.\n* Tổng = 1 + 4 + 5 + 7 + 8 + 9 = 34.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n)) return 0;\n\n    long long sum = 0;\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < n; ++j) {\n            int val = 0;\n            std::cin >> val;\n            if (i >= j) sum += val;\n        }\n    }\n\n    std::cout << sum << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "34\n",
                "isHidden": false
            },
            {
                "input": "1\n10\n",
                "expectedOutput": "10\n",
                "isHidden": false
            },
            {
                "input": "2\n1 2\n3 4\n",
                "expectedOutput": "8\n",
                "isHidden": true
            },
            {
                "input": "4\n1 0 0 0\n1 1 0 0\n1 1 1 0\n1 1 1 1\n",
                "expectedOutput": "10\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Hoán Đổi Hai Hàng Trong Ma Trận (swapTwoRows)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Rèn luyện kỹ thuật hoán đổi dữ liệu hàng loạt trong mảng 2 chiều bằng hàm `std::swap`.\n* **Mô tả:** Cho ma trận A kích thước R x C. Nhập hai chỉ số hàng u và v (0 <= u, v < R). Hãy hoán đổi toàn bộ các phần tử của hàng u với hàng v và in ma trận kết quả sau khi hoán đổi ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: Mỗi dòng chứa C số nguyên của ma trận A.\n  * Dòng cuối: Hai số nguyên u và v (0 <= u, v < R).\n* **Đầu ra (Output):** R dòng biểu diễn ma trận sau khi đổi chỗ hàng u và hàng v.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 3\n1 1 1\n2 2 2\n3 3 3\n0 2\n```\n\n**Khung Đầu ra (Output):**\n```text\n3 3 3\n2 2 2\n1 1 1\n```\n\n**Giải thích chi tiết:**\n* Hàng 0 `[1, 1, 1]` được hoán đổi vị trí cho hàng 2 `[3, 3, 3]`. Hàng 1 giữ nguyên.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n#include <utility>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    int u = 0, v = 0;\n    std::cin >> u >> v;\n\n    if (u >= 0 && u < r && v >= 0 && v < r) {\n        std::swap(a[u], a[v]);\n    }\n\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cout << a[i][j] << (j + 1 == c ? \"\" : \" \");\n        }\n        std::cout << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3 3\n1 1 1\n2 2 2\n3 3 3\n0 2\n",
                "expectedOutput": "3 3 3\n2 2 2\n1 1 1\n",
                "isHidden": false
            },
            {
                "input": "2 2\n10 20\n30 40\n0 1\n",
                "expectedOutput": "30 40\n10 20\n",
                "isHidden": false
            },
            {
                "input": "3 2\n1 2\n3 4\n5 6\n1 1\n",
                "expectedOutput": "1 2\n3 4\n5 6\n",
                "isHidden": true
            },
            {
                "input": "4 1\n1\n2\n3\n4\n0 3\n",
                "expectedOutput": "4\n2\n3\n1\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Hoán Đổi Hai Cột Trong Ma Trận (swapTwoColumns)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Thao tác hoán đổi phần tử trên từng hàng tại hai vị trí cột u và v.\n* **Mô tả:** Cho ma trận A kích thước R x C. Nhập hai chỉ số cột u và v (0 <= u, v < C). Hãy hoán đổi toàn bộ các phần tử thuộc cột u với cột v và in ma trận kết quả ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên của ma trận A.\n  * Dòng cuối: Hai chỉ số cột u và v (0 <= u, v < C).\n* **Đầu ra (Output):** R dòng biểu diễn ma trận sau khi hoán đổi cột u và cột v.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 3\n1 2 3\n4 5 6\n0 2\n```\n\n**Khung Đầu ra (Output):**\n```text\n3 2 1\n6 5 4\n```\n\n**Giải thích chi tiết:**\n* Cột 0 và cột 2 đổi chỗ cho nhau, cột 1 ở giữa giữ nguyên.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n#include <utility>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    int u = 0, v = 0;\n    std::cin >> u >> v;\n\n    if (u >= 0 && u < c && v >= 0 && v < c) {\n        for (int i = 0; i < r; ++i) {\n            std::swap(a[i][u], a[i][v]);\n        }\n    }\n\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cout << a[i][j] << (j + 1 == c ? \"\" : \" \");\n        }\n        std::cout << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "2 3\n1 2 3\n4 5 6\n0 2\n",
                "expectedOutput": "3 2 1\n6 5 4\n",
                "isHidden": false
            },
            {
                "input": "3 2\n10 20\n30 40\n50 60\n0 1\n",
                "expectedOutput": "20 10\n40 30\n60 50\n",
                "isHidden": false
            },
            {
                "input": "2 2\n1 2\n3 4\n0 0\n",
                "expectedOutput": "1 2\n3 4\n",
                "isHidden": true
            },
            {
                "input": "1 4\n1 2 3 4\n1 2\n",
                "expectedOutput": "1 3 2 4\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Sắp Xếp Từng Hàng Của Ma Trận Tăng Dần (sortEachRowAscending)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Áp dụng thuật toán sắp xếp (`std::sort` hoặc giải thuật sắp xếp thủ công) trên từng lát cắt hàng 1 chiều của ma trận.\n* **Mô tả:** Cho ma trận số nguyên A kích thước R x C. Hãy sắp xếp các phần tử trên mỗi hàng theo thứ tự tăng dần từ trái sang phải, các hàng độc lập với nhau. In ma trận sau khi đã sắp xếp.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: C số nguyên mỗi dòng.\n* **Đầu ra (Output):** R dòng biểu diễn ma trận sau khi từng hàng đã được sắp xếp tăng dần.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 3\n9 1 5\n8 3 7\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 5 9\n3 7 8\n```\n\n**Giải thích chi tiết:**\n* Hàng 1 sắp xếp `[9, 1, 5]` thành `[1, 5, 9]`.\n* Hàng 2 sắp xếp `[8, 3, 7]` thành `[3, 7, 8]`.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n        std::sort(a[i].begin(), a[i].end());\n    }\n\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cout << a[i][j] << (j + 1 == c ? \"\" : \" \");\n        }\n        std::cout << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "2 3\n9 1 5\n8 3 7\n",
                "expectedOutput": "1 5 9\n3 7 8\n",
                "isHidden": false
            },
            {
                "input": "3 2\n2 1\n4 3\n6 5\n",
                "expectedOutput": "1 2\n3 4\n5 6\n",
                "isHidden": false
            },
            {
                "input": "1 4\n4 3 2 1\n",
                "expectedOutput": "1 2 3 4\n",
                "isHidden": true
            },
            {
                "input": "3 3\n1 2 3\n6 5 4\n9 7 8\n",
                "expectedOutput": "1 2 3\n4 5 6\n7 8 9\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Đếm Số Lượng Phần Tử Cực Đại Địa Phương (countLocalMaxima)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Làm chủ kỹ thuật duyệt 4 hướng lân cận chung cạnh (Trên, Dưới, Trái, Phải) kèm kiểm tra điều kiện biên ma trận.\n* **Mô tả:** Cho ma trận số nguyên A kích thước R x C. Một phần tử `A[i][j]` được gọi là **cực đại địa phương** nếu giá trị của nó lớn hơn nghiêm ngặt tất cả các phần tử lân cận chung cạnh hợp lệ xung quanh nó (tối đa 4 ô lân cận: `(i-1, j)`, `(i+1, j)`, `(i, j-1)`, `(i, j+1)` nằm trong biên của ma trận). Hãy đếm xem ma trận có bao nhiêu phần tử cực đại địa phương.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: C số nguyên mỗi dòng.\n* **Đầu ra (Output):** Một số nguyên duy nhất là số lượng phần tử cực đại địa phương.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 3\n1 2 1\n2 5 2\n1 2 1\n```\n\n**Khung Đầu ra (Output):**\n```text\n1\n```\n\n**Giải thích chi tiết:**\n* Phần tử `A[1][1] = 5` có 4 ô lân cận là 2, 2, 2, 2. Vì 5 > 2 nên ô (1, 1) là cực đại địa phương. Các ô khác không thỏa mãn. Tổng cộng có 1 ô.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    int dr[4] = {-1, 1, 0, 0};\n    int dc[4] = {0, 0, -1, 1};\n    int localMaxCount = 0;\n\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            bool isMax = true;\n            for (int k = 0; k < 4; ++k) {\n                int ni = i + dr[k];\n                int nj = j + dc[k];\n                if (ni >= 0 && ni < r && nj >= 0 && nj < c) {\n                    if (a[i][j] <= a[ni][nj]) {\n                        isMax = false;\n                        break;\n                    }\n                }\n            }\n            if (isMax) localMaxCount++;\n        }\n    }\n\n    std::cout << localMaxCount << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3 3\n1 2 1\n2 5 2\n1 2 1\n",
                "expectedOutput": "1\n",
                "isHidden": false
            },
            {
                "input": "3 3\n1 1 1\n1 1 1\n1 1 1\n",
                "expectedOutput": "0\n",
                "isHidden": false
            },
            {
                "input": "1 3\n1 5 2\n",
                "expectedOutput": "1\n",
                "isHidden": true
            },
            {
                "input": "3 1\n2\n5\n3\n",
                "expectedOutput": "1\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tính Tổng Các Phần Tử Trên Đường Viền Ma Trận (sumBoundaryElements)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Nhận diện các phần tử biên của ma trận (`i == 0` hoặc `i == R - 1` hoặc `j == 0` hoặc `j == C - 1`) tránh cộng trùng lặp 4 góc.\n* **Mô tả:** Cho ma trận số nguyên A kích thước R x C. Đường viền của ma trận gồm toàn bộ các phần tử thuộc hàng đầu tiên, hàng cuối cùng, cột đầu tiên và cột cuối cùng. Hãy tính và in ra tổng của tất cả các phần tử nằm trên đường viền này.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: C số nguyên mỗi dòng.\n* **Đầu ra (Output):** Một số nguyên duy nhất là tổng các phần tử biên.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 3\n1 2 3\n4 9 5\n6 7 8\n```\n\n**Khung Đầu ra (Output):**\n```text\n36\n```\n\n**Giải thích chi tiết:**\n* Phần tử bên trong duy nhất là 9 (tại ô 1, 1). Tổng toàn bộ ma trận là 45. Tổng đường viền = 45 - 9 = 36.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    long long boundarySum = 0;\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            int val = 0;\n            std::cin >> val;\n            if (i == 0 || i == r - 1 || j == 0 || j == c - 1) {\n                boundarySum += val;\n            }\n        }\n    }\n\n    std::cout << boundarySum << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3 3\n1 2 3\n4 9 5\n6 7 8\n",
                "expectedOutput": "36\n",
                "isHidden": false
            },
            {
                "input": "2 2\n1 2\n3 4\n",
                "expectedOutput": "10\n",
                "isHidden": false
            },
            {
                "input": "1 4\n1 2 3 4\n",
                "expectedOutput": "10\n",
                "isHidden": true
            },
            {
                "input": "4 1\n1\n2\n3\n4\n",
                "expectedOutput": "10\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Nhân Hai Ma Trận Kích Thước M x N và N x P (matrixMultiplication)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Cài đặt thuật toán nhân hai ma trận kinh điển bằng 3 vòng lặp lồng nhau với độ phức tạp thời gian O(M * N * P).\n* **Mô tả:** Nhập vào ba số nguyên dương M, N, P (1 <= M, N, P <= 50). Tiếp theo là ma trận A kích thước M x N và ma trận B kích thước N x P. Hãy tính ma trận tích C = A * B (có kích thước M x P) theo công thức tích vô hướng: `C[i][j] = Tổng (A[i][k] * B[k][j])` với k chạy từ 0 đến N - 1. In ma trận tích C ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Ba số nguyên M, N, P cách nhau một khoảng trắng.\n  * M dòng tiếp theo: Ma trận A (M hàng, mỗi hàng N số).\n  * N dòng tiếp theo: Ma trận B (N hàng, mỗi hàng P số).\n* **Đầu ra (Output):** M dòng, mỗi dòng chứa P số nguyên cách nhau một khoảng trắng biểu diễn ma trận tích C.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n2 3 2\n1 2 3\n4 5 6\n7 8\n9 1\n2 3\n```\n\n**Khung Đầu ra (Output):**\n```text\n31 19\n85 55\n```\n\n**Giải thích chi tiết:**\n* C[0][0] = 1*7 + 2*9 + 3*2 = 7 + 18 + 6 = 31.\n* C[0][1] = 1*8 + 2*1 + 3*3 = 8 + 2 + 9 = 19.\n* C[1][0] = 4*7 + 5*9 + 6*2 = 28 + 45 + 12 = 85.\n* C[1][1] = 4*8 + 5*1 + 6*3 = 32 + 5 + 18 = 55.",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int m = 0, n = 0, p = 0;\n    if (!(std::cin >> m >> n >> p)) return 0;\n\n    std::vector<std::vector<int>> a(m, std::vector<int>(n));\n    for (int i = 0; i < m; ++i) {\n        for (int j = 0; j < n; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    std::vector<std::vector<int>> b(n, std::vector<int>(p));\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < p; ++j) {\n            std::cin >> b[i][j];\n        }\n    }\n\n    std::vector<std::vector<long long>> res(m, std::vector<long long>(p, 0));\n    for (int i = 0; i < m; ++i) {\n        for (int j = 0; j < p; ++j) {\n            long long sum = 0;\n            for (int k = 0; k < n; ++k) {\n                sum += static_cast<long long>(a[i][k]) * b[k][j];\n            }\n            res[i][j] = sum;\n        }\n    }\n\n    for (int i = 0; i < m; ++i) {\n        for (int j = 0; j < p; ++j) {\n            std::cout << res[i][j] << (j + 1 == p ? \"\" : \" \");\n        }\n        std::cout << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "2 3 2\n1 2 3\n4 5 6\n7 8\n9 1\n2 3\n",
                "expectedOutput": "31 19\n85 55\n",
                "isHidden": false
            },
            {
                "input": "1 2 1\n3 4\n5\n6\n",
                "expectedOutput": "39\n",
                "isHidden": false
            },
            {
                "input": "2 2 2\n1 0\n0 1\n5 6\n7 8\n",
                "expectedOutput": "5 6\n7 8\n",
                "isHidden": true
            },
            {
                "input": "2 2 2\n1 2\n3 4\n2 0\n1 2\n",
                "expectedOutput": "4 4\n10 8\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Xoay Ma Trận Vuông 90 Độ Theo Chiều Kim Đồng Hồ (rotateMatrix90Degrees)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Vận dụng kết hợp phép chuyển vị ma trận (Transpose) và đảo ngược từng hàng (Reverse Rows) để xoay ma trận vuông góc 90 độ theo chiều kim đồng hồ in-place với bộ nhớ phụ O(1).\n* **Mô tả:** Cho ma trận vuông A kích thước N x N (1 <= N <= 100). Hãy xoay ma trận A một góc 90 độ theo chiều kim đồng hồ và in ma trận sau khi xoay ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Số nguyên dương N (1 <= N <= 100).\n  * N dòng tiếp theo: Mỗi dòng gồm N số nguyên biểu diễn ma trận ban đầu.\n* **Đầu ra (Output):** N dòng biểu diễn ma trận sau khi đã xoay 90 độ theo chiều kim đồng hồ.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3\n1 2 3\n4 5 6\n7 8 9\n```\n\n**Khung Đầu ra (Output):**\n```text\n7 4 1\n8 5 2\n9 6 3\n```\n\n**Giải thích chi tiết:**\n* Cột đầu tiên [1, 4, 7] xoay thành hàng đầu tiên theo chiều ngược [7, 4, 1]. Cột 2 biến thành hàng 2, cột 3 biến thành hàng 3.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n)) return 0;\n\n    std::vector<std::vector<int>> a(n, std::vector<int>(n));\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < n; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    // 1. Chuyển vị ma trận: a[i][j] <-> a[j][i]\n    for (int i = 0; i < n; ++i) {\n        for (int j = i + 1; j < n; ++j) {\n            std::swap(a[i][j], a[j][i]);\n        }\n    }\n\n    // 2. Đảo ngược từng hàng\n    for (int i = 0; i < n; ++i) {\n        std::reverse(a[i].begin(), a[i].end());\n    }\n\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < n; ++j) {\n            std::cout << a[i][j] << (j + 1 == n ? \"\" : \" \");\n        }\n        std::cout << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "7 4 1\n8 5 2\n9 6 3\n",
                "isHidden": false
            },
            {
                "input": "2\n1 2\n3 4\n",
                "expectedOutput": "3 1\n4 2\n",
                "isHidden": false
            },
            {
                "input": "1\n99\n",
                "expectedOutput": "99\n",
                "isHidden": true
            },
            {
                "input": "4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16\n",
                "expectedOutput": "13 9 5 1\n14 10 6 2\n15 11 7 3\n16 12 8 4\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Duyệt Ma Trận Theo Hình Xoắn Ốc (spiralMatrixTraversal)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Quản lý 4 con trỏ biên ma trận (top, bottom, left, right) để duyệt các cạnh theo thứ tự xoắn ốc từ ngoài vào trong.\n* **Mô tả:** Cho ma trận số nguyên A kích thước R x C. Hãy in các phần tử của ma trận theo thứ tự xoắn ốc theo chiều kim đồng hồ, bắt đầu từ góc trên bên trái (ô 0, 0), đi sang phải, xuống dưới, sang trái, lên trên rồi lặp lại cho các vòng bên trong. Tất cả phần tử in trên một dòng cách nhau bởi một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: Mỗi dòng chứa C số nguyên.\n* **Đầu ra (Output):** Dãy số gồm R * C phần tử theo thứ tự duyệt xoắn ốc trên cùng một dòng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 3\n1 2 3\n4 5 6\n7 8 9\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 2 3 6 9 8 7 4 5\n```\n\n**Giải thích chi tiết:**\n* Đi từ trái sang phải trên hàng đầu: 1 2 3.\n* Đi từ trên xuống dưới trên cột cuối: 6 9.\n* Đi từ phải sang trái trên hàng cuối: 8 7.\n* Đi từ dưới lên trên trên cột đầu: 4.\n* Đi vào tâm ma trận: 5.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    int top = 0, bottom = r - 1;\n    int left = 0, right = c - 1;\n    std::vector<int> res;\n\n    while (top <= bottom && left <= right) {\n        // Sang phải\n        for (int j = left; j <= right; ++j) res.push_back(a[top][j]);\n        top++;\n\n        // Xuống dưới\n        for (int i = top; i <= bottom; ++i) res.push_back(a[i][right]);\n        right--;\n\n        // Sang trái\n        if (top <= bottom) {\n            for (int j = right; j >= left; --j) res.push_back(a[bottom][j]);\n            bottom--;\n        }\n\n        // Lên trên\n        if (left <= right) {\n            for (int i = bottom; i >= top; --i) res.push_back(a[i][left]);\n            left++;\n        }\n    }\n\n    for (size_t i = 0; i < res.size(); ++i) {\n        std::cout << res[i] << (i + 1 == res.size() ? \"\" : \" \");\n    }\n    std::cout << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3 3\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "1 2 3 6 9 8 7 4 5\n",
                "isHidden": false
            },
            {
                "input": "1 4\n1 2 3 4\n",
                "expectedOutput": "1 2 3 4\n",
                "isHidden": false
            },
            {
                "input": "4 1\n1\n2\n3\n4\n",
                "expectedOutput": "1 2 3 4\n",
                "isHidden": true
            },
            {
                "input": "2 3\n1 2 3\n4 5 6\n",
                "expectedOutput": "1 2 3 6 5 4\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Sinh Ma Trận Xoắn Ốc Vuông Cấp N (generateSpiralMatrix)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Điền các giá trị tăng dần từ 1 đến N^2 vào ma trận vuông theo đúng quy luật xoắn ốc.\n* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 50). Hãy tạo và in ra một ma trận vuông kích thước N x N gồm các số nguyên từ 1 đến N*N được sắp xếp theo hình xoắn ốc theo chiều kim đồng hồ bắt đầu từ ô (0, 0).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa số nguyên dương N (1 <= N <= 50).\n* **Đầu ra (Output):** N dòng, mỗi dòng chứa N số nguyên cách nhau một khoảng trắng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 2 3\n8 9 4\n7 6 5\n```\n\n**Giải thích chi tiết:**\n* Các số từ 1 đến 9 được điền lần lượt theo thứ tự xoắn ốc vào ma trận 3 x 3.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n)) return 0;\n\n    std::vector<std::vector<int>> a(n, std::vector<int>(n, 0));\n    int top = 0, bottom = n - 1;\n    int left = 0, right = n - 1;\n    int val = 1;\n\n    while (top <= bottom && left <= right) {\n        for (int j = left; j <= right; ++j) a[top][j] = val++;\n        top++;\n\n        for (int i = top; i <= bottom; ++i) a[i][right] = val++;\n        right--;\n\n        if (top <= bottom) {\n            for (int j = right; j >= left; --j) a[bottom][j] = val++;\n            bottom--;\n        }\n\n        if (left <= right) {\n            for (int i = bottom; i >= top; --i) a[i][left] = val++;\n            left++;\n        }\n    }\n\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < n; ++j) {\n            std::cout << a[i][j] << (j + 1 == n ? \"\" : \" \");\n        }\n        std::cout << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3\n",
                "expectedOutput": "1 2 3\n8 9 4\n7 6 5\n",
                "isHidden": false
            },
            {
                "input": "1\n",
                "expectedOutput": "1\n",
                "isHidden": false
            },
            {
                "input": "2\n",
                "expectedOutput": "1 2\n4 3\n",
                "isHidden": true
            },
            {
                "input": "4\n",
                "expectedOutput": "1 2 3 4\n12 13 14 5\n11 16 15 6\n10 9 8 7\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tìm Điểm Yên Ngựa Trong Ma Trận (findSaddlePoint)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Kết hợp tìm giá trị nhỏ nhất trên hàng và kiểm tra giá trị lớn nhất trên cột tương ứng.\n* **Mô tả:** Trong một ma trận số nguyên, một phần tử được gọi là **Điểm yên ngựa (Saddle Point)** nếu nó đồng thời là:\n  * Phần tử có giá trị nhỏ nhất trên hàng của nó.\n  * Phần tử có giá trị lớn nhất trên cột của nó.\n  Hãy tìm giá trị của điểm yên ngựa trong ma trận. Nếu ma trận có điểm yên ngựa, in ra giá trị đó cùng chỉ số hàng và cột của nó. Nếu ma trận không tồn tại điểm yên ngựa nào, in ra `-1`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: C số nguyên mỗi dòng.\n* **Đầu ra (Output):** In ra 3 số: Giá_trị Hàng Cột nếu tìm thấy, ngược lại in `-1`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 3\n1 2 3\n4 5 6\n7 8 9\n```\n\n**Khung Đầu ra (Output):**\n```text\n7 2 0\n```\n\n**Giải thích chi tiết:**\n* Xét hàng 2: giá trị nhỏ nhất là 7 (tại cột 0). Xét cột 0 gồm [1, 4, 7]: giá trị lớn nhất là 7. Do đó phần tử tại (2, 0) với giá trị 7 là điểm yên ngựa.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    for (int i = 0; i < r; ++i) {\n        // Tìm min của hàng i\n        int minRowVal = a[i][0];\n        int minColIdx = 0;\n        for (int j = 1; j < c; ++j) {\n            if (a[i][j] < minRowVal) {\n                minRowVal = a[i][j];\n                minColIdx = j;\n            }\n        }\n\n        // Kiểm tra xem a[i][minColIdx] có phải max của cột minColIdx không\n        bool isSaddle = true;\n        for (int k = 0; k < r; ++k) {\n            if (a[k][minColIdx] > minRowVal) {\n                isSaddle = false;\n                break;\n            }\n        }\n\n        if (isSaddle) {\n            std::cout << minRowVal << \" \" << i << \" \" << minColIdx << \"\\n\";\n            return 0;\n        }\n    }\n\n    std::cout << -1 << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3 3\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "7 2 0\n",
                "isHidden": false
            },
            {
                "input": "2 2\n1 2\n3 4\n",
                "expectedOutput": "3 1 0\n",
                "isHidden": false
            },
            {
                "input": "3 3\n1 5 3\n4 2 6\n7 8 9\n",
                "expectedOutput": "7 2 0\n",
                "isHidden": true
            },
            {
                "input": "1 1\n42\n",
                "expectedOutput": "42 0 0\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Mảng Cộng Dồn 2 Chiều và Truy Vấn Hình Chữ Nhật Con (prefixSum2DMatrix)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Xây dựng mảng cộng dồn 2 chiều `pref[i][j]` theo công thức bao hàm loại trừ để trả lời các truy vấn tính tổng hình chữ nhật con trong thời gian O(1).\n* **Mô tả:** Cho ma trận số nguyên A kích thước R x C (1 <= R, C <= 100) và Q truy vấn. Mỗi truy vấn gồm 4 số nguyên `(r1, c1, r2, c2)` với `0 <= r1 <= r2 < R` và `0 <= c1 <= c2 < C`. Hãy tính tổng các phần tử của hình chữ nhật con có góc trên bên trái là `(r1, c1)` và góc dưới bên phải là `(r2, c2)`. In kết quả mỗi truy vấn trên một dòng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 100).\n  * R dòng tiếp theo: Ma trận A.\n  * Dòng tiếp theo: Số nguyên Q (1 <= Q <= 1000).\n  * Q dòng tiếp theo: Mỗi dòng gồm 4 số nguyên r1, c1, r2, c2.\n* **Đầu ra (Output):** Q dòng, mỗi dòng là tổng hình chữ nhật con của truy vấn tương ứng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 3\n1 2 3\n4 5 6\n7 8 9\n2\n0 0 1 1\n1 1 2 2\n```\n\n**Khung Đầu ra (Output):**\n```text\n12\n28\n```\n\n**Giải thích chi tiết:**\n* Truy vấn 1: Hình chữ nhật từ (0, 0) đến (1, 1) gồm: 1, 2, 4, 5. Tổng = 1 + 2 + 4 + 5 = 12.\n* Truy vấn 2: Hình chữ nhật từ (1, 1) đến (2, 2) gồm: 5, 6, 8, 9. Tổng = 5 + 6 + 8 + 9 = 28.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    std::vector<std::vector<long long>> pref(r + 1, std::vector<long long>(c + 1, 0));\n    for (int i = 1; i <= r; ++i) {\n        for (int j = 1; j <= c; ++j) {\n            pref[i][j] = a[i - 1][j - 1] + pref[i - 1][j] + pref[i][j - 1] - pref[i - 1][j - 1];\n        }\n    }\n\n    int q = 0;\n    if (!(std::cin >> q)) return 0;\n\n    while (q--) {\n        int r1 = 0, c1 = 0, r2 = 0, c2 = 0;\n        std::cin >> r1 >> c1 >> r2 >> c2;\n        long long ans = pref[r2 + 1][c2 + 1] - pref[r1][c2 + 1] - pref[r2 + 1][c1] + pref[r1][c1];\n        std::cout << ans << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3 3\n1 2 3\n4 5 6\n7 8 9\n2\n0 0 1 1\n1 1 2 2\n",
                "expectedOutput": "12\n28\n",
                "isHidden": false
            },
            {
                "input": "2 2\n5 5\n5 5\n1\n0 0 1 1\n",
                "expectedOutput": "20\n",
                "isHidden": false
            },
            {
                "input": "3 3\n1 1 1\n1 1 1\n1 1 1\n2\n0 0 2 2\n1 1 1 1\n",
                "expectedOutput": "9\n1\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tìm Hình Vuông Con K x K Có Tổng Lớn Nhất (maxSumSubSquare)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Áp dụng kỹ thuật cửa sổ trượt 2D hoặc mảng cộng dồn 2 chiều để tối ưu hóa thời gian tìm kiếm cực trị vùng con.\n* **Mô tả:** Cho ma trận số nguyên A kích thước R x C và một số nguyên dương K (1 <= K <= min(R, C)). Hãy tìm và in ra tổng lớn nhất của một hình vuông con kích thước K x K nằm trọn bên trong ma trận A.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Ba số nguyên R, C, K (1 <= K <= min(R, C) <= 100).\n  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên của ma trận A.\n* **Đầu ra (Output):** Một số nguyên duy nhất là tổng lớn nhất của hình vuông con K x K.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 3 2\n1 2 3\n4 5 6\n7 8 9\n```\n\n**Khung Đầu ra (Output):**\n```text\n28\n```\n\n**Giải thích chi tiết:**\n* Các hình vuông con 2 x 2:\n  * Góc trên trái: 1+2+4+5 = 12\n  * Góc trên phải: 2+3+5+6 = 16\n  * Góc dưới trái: 4+5+7+8 = 24\n  * Góc dưới phải: 5+6+8+9 = 28. Tổng lớn nhất là 28.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    int r = 0, c = 0, k = 0;\n    if (!(std::cin >> r >> c >> k)) return 0;\n\n    std::vector<std::vector<int>> a(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> a[i][j];\n        }\n    }\n\n    std::vector<std::vector<long long>> pref(r + 1, std::vector<long long>(c + 1, 0));\n    for (int i = 1; i <= r; ++i) {\n        for (int j = 1; j <= c; ++j) {\n            pref[i][j] = a[i - 1][j - 1] + pref[i - 1][j] + pref[i][j - 1] - pref[i - 1][j - 1];\n        }\n    }\n\n    long long maxSum = -1e18;\n    for (int i = 0; i + k <= r; ++i) {\n        for (int j = 0; j + k <= c; ++j) {\n            int r2 = i + k - 1;\n            int c2 = j + k - 1;\n            long long cur = pref[r2 + 1][c2 + 1] - pref[i][c2 + 1] - pref[r2 + 1][j] + pref[i][j];\n            maxSum = std::max(maxSum, cur);\n        }\n    }\n\n    std::cout << maxSum << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3 3 2\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "28\n",
                "isHidden": false
            },
            {
                "input": "4 4 3\n1 1 1 1\n1 5 5 1\n1 5 5 1\n1 1 1 1\n",
                "expectedOutput": "25\n",
                "isHidden": false
            },
            {
                "input": "2 2 1\n10 20\n30 40\n",
                "expectedOutput": "40\n",
                "isHidden": true
            },
            {
                "input": "3 3 3\n1 2 3\n4 5 6\n7 8 9\n",
                "expectedOutput": "45\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tam Giác Pascal 2D Bằng Quy Nạp (pascalTriangleMatrix)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Rèn luyện quy tắc chuyển trạng thái quy hoạch động dạng lưới: `P[i][j] = P[i-1][j] + P[i][j-1]` hoặc tạo tam giác Pascal kinh điển.\n* **Mô tả:** Nhập vào một số nguyên dương N (1 <= N <= 20). Hãy xây dựng và in ra ma trận kích thước N x N trong đó:\n  * Mọi phần tử ở hàng 0 đều có giá trị bằng 1 (`A[0][j] = 1`).\n  * Mọi phần tử ở cột 0 đều có giá trị bằng 1 (`A[i][0] = 1`).\n  * Với mọi ô còn lại, giá trị của ô bằng tổng của ô nằm ngay phía trên và ô nằm ngay bên trái: `A[i][j] = A[i-1][j] + A[i][j-1]`.\n  In ma trận kết quả gồm N dòng, mỗi dòng N số nguyên.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một số nguyên dương N (1 <= N <= 20).\n* **Đầu ra (Output):** N dòng biểu diễn ma trận Pascal 2D.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3\n```\n\n**Khung Đầu ra (Output):**\n```text\n1 1 1\n1 2 3\n1 3 6\n```\n\n**Giải thích chi tiết:**\n* Ô (1, 1) = A[0][1] + A[1][0] = 1 + 1 = 2.\n* Ô (1, 2) = A[0][2] + A[1][1] = 1 + 2 = 3.\n* Ô (2, 1) = A[1][1] + A[2][0] = 2 + 1 = 3.\n* Ô (2, 2) = A[1][2] + A[2][1] = 3 + 3 = 6.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    int n = 0;\n    if (!(std::cin >> n)) return 0;\n\n    std::vector<std::vector<long long>> a(n, std::vector<long long>(n, 1));\n    for (int i = 1; i < n; ++i) {\n        for (int j = 1; j < n; ++j) {\n            a[i][j] = a[i - 1][j] + a[i][j - 1];\n        }\n    }\n\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < n; ++j) {\n            std::cout << a[i][j] << (j + 1 == n ? \"\" : \" \");\n        }\n        std::cout << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3\n",
                "expectedOutput": "1 1 1\n1 2 3\n1 3 6\n",
                "isHidden": false
            },
            {
                "input": "1\n",
                "expectedOutput": "1\n",
                "isHidden": false
            },
            {
                "input": "2\n",
                "expectedOutput": "1 1\n1 2\n",
                "isHidden": true
            },
            {
                "input": "5\n",
                "expectedOutput": "1 1 1 1 1\n1 2 3 4 5\n1 3 6 10 15\n1 4 10 20 35\n1 5 15 35 70\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Đếm Số Lượng Vùng Đảo Trên Ma Trận Nhị Phân (countIslandsBinaryMatrix)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Ứng dụng thuật toán loang (Flood Fill / DFS cơ bản) bằng mảng đánh dấu hoặc biến đổi trực tiếp trên lưới 2D 4 hướng.\n* **Mô tả:** Cho một bản đồ dạng ma trận nhị phân kích thước R x C gồm các số `0` (nước) và `1` (đất liền). Một \"hòn đảo\" là một vùng các ô đất liền (`1`) kết nối với nhau theo 4 hướng chung cạnh (trên, dưới, trái, phải). Hãy đếm số lượng hòn đảo độc lập có trên bản đồ.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 50).\n  * R dòng tiếp theo: Mỗi dòng gồm C số nguyên (chỉ gồm 0 hoặc 1).\n* **Đầu ra (Output):** Một số nguyên duy nhất là số lượng hòn đảo tìm được.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n4 4\n1 1 0 0\n1 0 0 1\n0 0 1 1\n0 0 0 0\n```\n\n**Khung Đầu ra (Output):**\n```text\n2\n```\n\n**Giải thích chi tiết:**\n* Đảo thứ nhất ở góc trên bên trái gồm các ô (0,0), (0,1), (1,0).\n* Đảo thứ hai gồm các ô (1,3), (2,2), (2,3). Tổng cộng có 2 hòn đảo riêng biệt.\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n\nvoid dfs(int r, int c, std::vector<std::vector<int>>& grid) {\n    grid[r][c] = 0;\n    int dr[4] = {-1, 1, 0, 0};\n    int dc[4] = {0, 0, -1, 1};\n    int R = grid.size();\n    int C = grid[0].size();\n\n    for (int k = 0; k < 4; ++k) {\n        int nr = r + dr[k];\n        int nc = c + dc[k];\n        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 1) {\n            dfs(nr, nc, grid);\n        }\n    }\n}\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::vector<int>> grid(r, std::vector<int>(c));\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            std::cin >> grid[i][j];\n        }\n    }\n\n    int islands = 0;\n    for (int i = 0; i < r; ++i) {\n        for (int j = 0; j < c; ++j) {\n            if (grid[i][j] == 1) {\n                islands++;\n                dfs(i, j, grid);\n            }\n        }\n    }\n\n    std::cout << islands << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "4 4\n1 1 0 0\n1 0 0 1\n0 0 1 1\n0 0 0 0\n",
                "expectedOutput": "2\n",
                "isHidden": false
            },
            {
                "input": "3 3\n1 1 1\n1 1 1\n1 1 1\n",
                "expectedOutput": "1\n",
                "isHidden": false
            },
            {
                "input": "3 3\n0 0 0\n0 0 0\n0 0 0\n",
                "expectedOutput": "0\n",
                "isHidden": true
            },
            {
                "input": "3 3\n1 0 1\n0 1 0\n1 0 1\n",
                "expectedOutput": "5\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Kiểm Tra Trạng Thái Bàn Cờ Tic-Tac-Toe (checkTicTacToeState)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Kiểm tra điều kiện thắng (3 ký tự liên tiếp trên cùng một hàng, một cột hoặc trên một đường chéo) của trò chơi Cờ Caro 3x3.\n* **Mô tả:** Cho một bàn cờ Tic-Tac-Toe kích thước 3 x 3 gồm các ký tự: `'X'`, `'O'` hoặc `'.'` (ô trống). Hãy xác định kết quả của ván cờ:\n  * In ra `X_WIN` nếu người chơi X đã tạo được 3 ký tự 'X' liên tiếp trên cùng 1 hàng, 1 cột hoặc 1 đường chéo.\n  * In ra `O_WIN` nếu người chơi O đã tạo được 3 ký tự 'O' liên tiếp.\n  * In ra `DRAW` nếu bàn cờ đã kín (không còn ô trống `'.'`) và không ai thắng.\n  * In ra `ONGOING` nếu chưa ai thắng và bàn cờ vẫn còn ô trống.\n  (Dữ liệu đảm bảo không xảy ra trường hợp cả X và O cùng đồng thời thắng).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** 3 dòng, mỗi dòng chứa một chuỗi gồm 3 ký tự đại diện cho hàng tương ứng của bàn cờ.\n* **Đầu ra (Output):** Một trong 4 trạng thái: `X_WIN`, `O_WIN`, `DRAW`, `ONGOING`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nXOX\nOXO\nO.X\n```\n\n**Khung Đầu ra (Output):**\n```text\nX_WIN\n```\n\n**Giải thích chi tiết:**\n* Các ô trên đường chéo chính gồm: (0,0)='X', (1,1)='X', (2,2)='X' tạo thành 3 ký tự X thẳng hàng nên người chơi X chiến thắng (`X_WIN`).\n\n---",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n#include <string>\n\nint main() {\n    std::vector<std::string> b(3);\n    for (int i = 0; i < 3; ++i) {\n        if (!(std::cin >> b[i])) return 0;\n    }\n\n    auto checkWin = [&](char p) {\n        for (int i = 0; i < 3; ++i) {\n            if (b[i][0] == p && b[i][1] == p && b[i][2] == p) return true;\n            if (b[0][i] == p && b[1][i] == p && b[2][i] == p) return true;\n        }\n        if (b[0][0] == p && b[1][1] == p && b[2][2] == p) return true;\n        if (b[0][2] == p && b[1][1] == p && b[2][0] == p) return true;\n        return false;\n    };\n\n    if (checkWin('X')) {\n        std::cout << \"X_WIN\\n\";\n        return 0;\n    }\n    if (checkWin('O')) {\n        std::cout << \"O_WIN\\n\";\n        return 0;\n    }\n\n    bool hasEmpty = false;\n    for (int i = 0; i < 3; ++i) {\n        for (int j = 0; j < 3; ++j) {\n            if (b[i][j] == '.') hasEmpty = true;\n        }\n    }\n\n    if (hasEmpty) {\n        std::cout << \"ONGOING\\n\";\n    } else {\n        std::cout << \"DRAW\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "XOX\nOXO\nO.X\n",
                "expectedOutput": "X_WIN\n",
                "isHidden": false
            },
            {
                "input": "XOX\nOXX\nOOO\n",
                "expectedOutput": "O_WIN\n",
                "isHidden": false
            },
            {
                "input": "XOX\nXXO\nOXO\n",
                "expectedOutput": "DRAW\n",
                "isHidden": true
            },
            {
                "input": "X..\n.O.\n...\n",
                "expectedOutput": "ONGOING\n",
                "isHidden": true
            },
            {
                "input": "XXX\nOO.\n...\n",
                "expectedOutput": "X_WIN\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Trò Chơi Dò Mìn Tạo Bản Đồ Số Lân Cận (minesweeperBoardGenerator)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Áp dụng duyệt 8 hướng lân cận xung quanh mỗi ô (Trên, Dưới, Trái, Phải và 4 đường chéo) để tái tạo bảng số trò chơi Dò mìn kinh điển.\n* **Mô tả:** Cho một bảng trò chơi Dò mìn kích thước R x C gồm các ký tự: `'*'` biểu thị vị trí có quả bom, và `'.'` biểu thị vị trí ô đất an toàn. Hãy tạo ra bảng hiển thị kết quả trong đó:\n  * Các ô chứa bom giữ nguyên ký tự `'*'`.\n  * Mỗi ô an toàn được thay thế bằng một chữ số từ `'0'` đến `'8'` biểu thị số lượng quả bom nằm ở 8 ô xung quanh nó.\n  In bảng kết quả ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Hai số nguyên R và C (1 <= R, C <= 50).\n  * R dòng tiếp theo: Mỗi dòng gồm C ký tự (chỉ gồm `*` hoặc `.`).\n* **Đầu ra (Output):** R dòng biểu diễn bảng trò chơi dò mìn hoàn chỉnh.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n3 3\n*..\n...\n..*\n```\n\n**Khung Đầu ra (Output):**\n```text\n*10\n121\n01*\n```\n\n**Giải thích chi tiết:**\n* Ô (0, 0) là bom `*`.\n* Ô (0, 1) tiếp giáp 1 quả bom ở (0, 0) -> hiển thị 1.\n* Ô (1, 1) tiếp giáp 2 quả bom ở (0, 0) và (2, 2) -> hiển thị 2.\n* Ô (2, 2) là bom `*`.",
        "starterCode": "#include <iostream>\n#include <vector>\n\nint main() {\n    // Cai dat thuat toan thao tac ma tran / mang 2 chieu cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <vector>\n#include <string>\n\nint main() {\n    int r = 0, c = 0;\n    if (!(std::cin >> r >> c)) return 0;\n\n    std::vector<std::string> b(r);\n    for (int i = 0; i < r; ++i) {\n        std::cin >> b[i];\n    }\n\n    int dr[8] = {-1, -1, -1, 0, 0, 1, 1, 1};\n    int dc[8] = {-1, 0, 1, -1, 1, -1, 0, 1};\n\n    for (int i = 0; i < r; ++i) {\n        std::string line = \"\";\n        for (int j = 0; j < c; ++j) {\n            if (b[i][j] == '*') {\n                line.push_back('*');\n            } else {\n                int mineCount = 0;\n                for (int k = 0; k < 8; ++k) {\n                    int ni = i + dr[k];\n                    int nj = j + dc[k];\n                    if (ni >= 0 && ni < r && nj >= 0 && nj < c && b[ni][nj] == '*') {\n                        mineCount++;\n                    }\n                }\n                line.push_back(static_cast<char>(mineCount + '0'));\n            }\n        }\n        std::cout << line << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "3 3\n*..\n...\n..*\n",
                "expectedOutput": "*10\n121\n01*\n",
                "isHidden": false
            },
            {
                "input": "2 2\n**\n**\n",
                "expectedOutput": "**\n**\n",
                "isHidden": false
            },
            {
                "input": "1 4\n.*..\n",
                "expectedOutput": "1*10\n",
                "isHidden": true
            },
            {
                "input": "4 4\n*.*.\n.*.*\n*.*.\n.*.*\n",
                "expectedOutput": "*3*2\n3*4*\n*4*3\n2*3*\n",
                "isHidden": true
            }
        ]
    }
];

export async function seedCppModule7Practice() {
    console.log('🚀 Bắt đầu cập nhật toàn bộ 30 bài tập chuẩn hóa Module 7 C++ vào Database...');

    // 1. Tìm Module 7 của C++
    const module7 = await prisma.module.findUnique({
        where: { moduleId: 'CPP-MOD-07' }
    });

    if (!module7) {
        throw new Error('❌ Không tìm thấy Module 7 (CPP-MOD-07)!');
    }

    // 2. Tìm Chapter 7 của Module 7
    const chapter7 = await prisma.chapter.findFirst({
        where: {
            moduleId: module7.id,
            chapterId: 'CPP-CH-07'
        }
    });

    if (!chapter7) {
        throw new Error('❌ Không tìm thấy Chapter 7 của Module 7!');
    }

    // 3. Upsert bài học tổng hợp CPP-07.MP
    const lessonMp = await prisma.lesson.upsert({
        where: {
            id: 'c1b10000-0007-4000-8000-000000000001'
        },
        update: {
            lessonId: 'CPP-07.MP',
            title: 'Bài tập thực hành tổng hợp Module 7: Mảng 2 Chiều và Bài toán Ma trận Thực tế',
            objective: 'Hệ thống 30 bài tập rèn luyện chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức mảng 2 chiều, ma trận vuông, đường chéo, chuyển vị, phép nhân ma trận, duyệt lân cận lưới và dự án cờ Caro/Tic-Tac-Toe của Module 7 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 90,
            isFree: true,
            orderIndex: 4,
            chapterId: chapter7.id,
            content: `# Bài tập thực hành tổng hợp Module 7: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 7: Mảng 2 Chiều và Bài toán Ma trận Thực tế**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài làm chủ thao tác nhập/xuất lưới 2D, tính tổng/TBC, tìm Max và tọa độ, tổng hàng, tổng cột, đếm chẵn/lẻ/âm, đường chéo chính/phụ, chuyển vị ma trận và nhân số vô hướng.
* ⚔️ **Trung bình (Medium):** 10 bài cộng hai ma trận, ma trận đối xứng, tổng tam giác trên/dưới, hoán đổi hàng/cột, sắp xếp từng hàng, tìm cực đại địa phương 4 hướng, tổng đường viền và nhân hai ma trận.
* 👑 **Khó / Thử thách (Hard):** 10 bài giải thuật ma trận nâng cao: Xoay ma trận 90 độ in-place, duyệt ma trận xoắn ốc, sinh ma trận xoắn ốc cấp N, điểm yên ngựa (Saddle Point), mảng cộng dồn 2D (2D Prefix Sum), hình vuông con cực đại, tam giác Pascal 2D, đếm đảo DFS trên lưới nhị phân, thẩm định ván cờ Tic-Tac-Toe và trò chơi Dò mìn (Minesweeper).

Chúc bạn hoàn thành xuất sắc toàn bộ thử thách!`
        },
        create: {
            id: 'c1b10000-0007-4000-8000-000000000001',
            lessonId: 'CPP-07.MP',
            title: 'Bài tập thực hành tổng hợp Module 7: Mảng 2 Chiều và Bài toán Ma trận Thực tế',
            objective: 'Hệ thống 30 bài tập rèn luyện chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức mảng 2 chiều, ma trận vuông, đường chéo, chuyển vị, phép nhân ma trận, duyệt lân cận lưới và dự án cờ Caro/Tic-Tac-Toe của Module 7 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 90,
            isFree: true,
            orderIndex: 4,
            chapterId: chapter7.id,
            content: `# Bài tập thực hành tổng hợp Module 7: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 7: Mảng 2 Chiều và Bài toán Ma trận Thực tế**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài làm chủ thao tác nhập/xuất lưới 2D, tính tổng/TBC, tìm Max và tọa độ, tổng hàng, tổng cột, đếm chẵn/lẻ/âm, đường chéo chính/phụ, chuyển vị ma trận và nhân số vô hướng.
* ⚔️ **Trung bình (Medium):** 10 bài cộng hai ma trận, ma trận đối xứng, tổng tam giác trên/dưới, hoán đổi hàng/cột, sắp xếp từng hàng, tìm cực đại địa phương 4 hướng, tổng đường viền và nhân hai ma trận.
* 👑 **Khó / Thử thách (Hard):** 10 bài giải thuật ma trận nâng cao: Xoay ma trận 90 độ in-place, duyệt ma trận xoắn ốc, sinh ma trận xoắn ốc cấp N, điểm yên ngựa (Saddle Point), mảng cộng dồn 2D (2D Prefix Sum), hình vuông con cực đại, tam giác Pascal 2D, đếm đảo DFS trên lưới nhị phân, thẩm định ván cờ Tic-Tac-Toe và trò chơi Dò mìn (Minesweeper).

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

    console.log(`\n🎉 THÀNH CÔNG! Đã cập nhật xong ${successCount} bài tập thực hành Module 7 C++ lên Database!`);
}

seedCppModule7Practice()
    .catch((err) => {
        console.error('❌ Lỗi khi cập nhật bài tập Module 7 C++:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
