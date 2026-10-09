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
        "title": "Đếm Số Lượng Ký Tự Phân Loại Trong Chuỗi (countCharacterTypes)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Nắm vững cách duyệt chuỗi ký tự và sử dụng các hàm kiểm tra trong thư viện `<cctype>` (`isupper`, `islower`, `isdigit`).\n* **Mô tả:** Nhập vào một dòng văn bản S (độ dài không quá 1000 ký tự, có thể chứa dấu cách). Hãy đếm và in ra số lượng chữ cái in hoa, số lượng chữ cái in thường, số lượng chữ số và số lượng ký tự khác (bao gồm khoảng trắng và ký tự đặc biệt) trên cùng một dòng, cách nhau bởi một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi ký tự S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** In ra 4 số nguyên cách nhau một khoảng trắng theo thứ tự: Số chữ in hoa, Số chữ in thường, Số chữ số, Số ký tự khác.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nXin Chao 2026!\n```\n\n**Khung Đầu ra (Output):**\n```text\n2 5 4 3\n```\n\n**Giải thích chi tiết:**\n* Chữ in hoa: 'X', 'C' (tổng cộng 2).\n* Chữ in thường: 'i', 'n', 'h', 'a', 'o' (tổng cộng 5).\n* Chữ số: '2', '0', '2', '6' (tổng cộng 4).\n* Ký tự khác: 2 dấu cách và 1 dấu chấm than '!' (tổng cộng 3).\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <cctype>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    int up = 0, low = 0, digit = 0, other = 0;\n    for (char c : s) {\n        if (std::isupper(static_cast<unsigned char>(c))) up++;\n        else if (std::islower(static_cast<unsigned char>(c))) low++;\n        else if (std::isdigit(static_cast<unsigned char>(c))) digit++;\n        else other++;\n    }\n\n    std::cout << up << \" \" << low << \" \" << digit << \" \" << other << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "Xin Chao 2026!\n",
                "expectedOutput": "2 5 4 3\n",
                "isHidden": false
            },
            {
                "input": "Hello World\n",
                "expectedOutput": "2 8 0 1\n",
                "isHidden": false
            },
            {
                "input": "123456\n",
                "expectedOutput": "0 0 6 0\n",
                "isHidden": true
            },
            {
                "input": "!@#$%^&*()\n",
                "expectedOutput": "0 0 0 10\n",
                "isHidden": true
            },
            {
                "input": "AbCd 12 #$\n",
                "expectedOutput": "2 2 2 4\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Chuyển Đổi Toàn Bộ Chuỗi Sang Chữ In Hoa (toUpperString)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Làm chủ kỹ thuật duyệt chuỗi bằng tham chiếu và hàm `toupper()`.\n* **Mô tả:** Nhập vào một dòng văn bản S có thể chứa khoảng trắng. Hãy chuyển toàn bộ các chữ cái thường trong chuỗi S thành chữ cái in hoa, các ký tự số và ký tự đặc biệt giữ nguyên. In chuỗi kết quả ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** Chuỗi S sau khi đã được chuyển đổi toàn bộ sang chữ hoa.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nlap trinh c++ 2026\n```\n\n**Khung Đầu ra (Output):**\n```text\nLAP TRINH C++ 2026\n```\n\n**Giải thích chi tiết:**\n* Tất cả các chữ cái 'l', 'a', 'p', 't', 'r', 'i', 'n', 'h', 'c' đều được biến đổi thành chữ in hoa tương ứng. Các ký tự '+', số và khoảng trắng giữ nguyên.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <cctype>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    for (char& c : s) {\n        c = static_cast<char>(std::toupper(static_cast<unsigned char>(c)));\n    }\n    std::cout << s << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "lap trinh c++ 2026\n",
                "expectedOutput": "LAP TRINH C++ 2026\n",
                "isHidden": false
            },
            {
                "input": "Hello World\n",
                "expectedOutput": "HELLO WORLD\n",
                "isHidden": false
            },
            {
                "input": "already UPPER 123\n",
                "expectedOutput": "ALREADY UPPER 123\n",
                "isHidden": true
            },
            {
                "input": "a\n",
                "expectedOutput": "A\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Chuyển Đổi Toàn Bộ Chuỗi Sang Chữ In Thường (toLowerString)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Làm chủ kỹ thuật duyệt chuỗi bằng tham chiếu và hàm `tolower()`.\n* **Mô tả:** Nhập vào một dòng văn bản S có thể chứa khoảng trắng. Hãy chuyển toàn bộ các chữ cái in hoa trong chuỗi S thành chữ cái in thường, các ký tự khác giữ nguyên. In chuỗi kết quả ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** Chuỗi S sau khi đã được chuyển đổi toàn bộ sang chữ thường.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nHELLO World C++!\n```\n\n**Khung Đầu ra (Output):**\n```text\nhello world c++!\n```\n\n**Giải thích chi tiết:**\n* Các chữ 'H', 'E', 'L', 'L', 'O', 'W', 'C' được chuyển thành 'h', 'e', 'l', 'l', 'o', 'w', 'c'.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <cctype>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    for (char& c : s) {\n        c = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));\n    }\n    std::cout << s << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "HELLO World C++!\n",
                "expectedOutput": "hello world c++!\n",
                "isHidden": false
            },
            {
                "input": "ALL UPPERCASE\n",
                "expectedOutput": "all uppercase\n",
                "isHidden": false
            },
            {
                "input": "already lowercase 99\n",
                "expectedOutput": "already lowercase 99\n",
                "isHidden": true
            },
            {
                "input": "Z\n",
                "expectedOutput": "z\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Đảo Ngược Chuỗi Ký Tự Bằng Hai Con Trỏ (reverseStringTwoPointers)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Rèn luyện tư duy thao tác chỉ số chuỗi in-place và kỹ thuật hai con trỏ (Two Pointers) trên `std::string`.\n* **Mô tả:** Nhập vào một dòng văn bản S. Hãy đảo ngược chuỗi S ngay tại chỗ bằng cách hoán đổi ký tự đối xứng ở hai đầu (dùng hai chỉ số trái và phải di chuyển dần vào giữa, không dùng hàm `std::reverse` có sẵn). In chuỗi sau khi đảo ngược.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** Chuỗi S sau khi đã được đảo ngược.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nAntigravity\n```\n\n**Khung Đầu ra (Output):**\n```text\nytivargitnA\n```\n\n**Giải thích chi tiết:**\n* Ký tự đầu 'A' đổi chỗ cho ký tự cuối 'y', 'n' đổi cho 't', tiếp tục cho đến khi hai chỉ số gặp nhau ở giữa.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <utility>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    int left = 0, right = static_cast<int>(s.length()) - 1;\n    while (left < right) {\n        std::swap(s[left], s[right]);\n        left++;\n        right--;\n    }\n    std::cout << s << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "Antigravity\n",
                "expectedOutput": "ytivargitnA\n",
                "isHidden": false
            },
            {
                "input": "racecar\n",
                "expectedOutput": "racecar\n",
                "isHidden": false
            },
            {
                "input": "Hello World\n",
                "expectedOutput": "dlroW olleH\n",
                "isHidden": true
            },
            {
                "input": "A\n",
                "expectedOutput": "A\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Kiểm Tra Chuỗi Đối Xứng Đơn Giản (isSimplePalindrome)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Nắm vững khái niệm xâu đối xứng (Palindrome) và kiểm tra bằng vòng lặp so khớp đối xứng.\n* **Mô tả:** Nhập vào một từ S không chứa dấu cách (chỉ gồm các ký tự liền nhau). Hãy kiểm tra xem S có phải là chuỗi đối xứng hay không (đọc xuôi hay đọc ngược đều giống hệt nhau). In ra `YES` nếu đúng, ngược lại in ra `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi ký tự S không có khoảng trắng (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** In `YES` nếu là chuỗi đối xứng, ngược lại in `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nradar\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* Chuỗi \"radar\" đọc xuôi hay ngược đều là \"radar\" nên in ra `YES`. Nếu chuỗi là \"hello\" thì in `NO`.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s;\n    if (!(std::cin >> s)) return 0;\n\n    int left = 0, right = static_cast<int>(s.length()) - 1;\n    bool isPal = true;\n    while (left < right) {\n        if (s[left] != s[right]) {\n            isPal = false;\n            break;\n        }\n        left++;\n        right--;\n    }\n\n    std::cout << (isPal ? \"YES\" : \"NO\") << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "radar\n",
                "expectedOutput": "YES\n",
                "isHidden": false
            },
            {
                "input": "hello\n",
                "expectedOutput": "NO\n",
                "isHidden": false
            },
            {
                "input": "a\n",
                "expectedOutput": "YES\n",
                "isHidden": true
            },
            {
                "input": "noon\n",
                "expectedOutput": "YES\n",
                "isHidden": true
            },
            {
                "input": "abccba\n",
                "expectedOutput": "YES\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Đếm Số Lượng Nguyên Âm và Phụ Âm (countVowelsAndConsonants)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Kết hợp kiểm tra chữ cái `isalpha` và đối sánh tập hợp nguyên âm tiếng Anh ('a', 'e', 'i', 'o', 'u').\n* **Mô tả:** Nhập vào một chuỗi ký tự S. Hãy đếm số lượng chữ cái nguyên âm và số lượng chữ cái phụ âm trong chuỗi S (không phân biệt chữ hoa hay chữ thường). Chú ý: Các ký tự không phải chữ cái (như số, khoảng trắng, dấu câu) thì bỏ qua không tính vào nguyên âm hay phụ âm.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** In ra 2 số nguyên cách nhau một khoảng trắng: Số lượng nguyên âm và Số lượng phụ âm.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nC++ Programming 2026\n```\n\n**Khung Đầu ra (Output):**\n```text\n3 11\n```\n\n**Giải thích chi tiết:**\n* Các chữ cái trong \"Programming\": 'o', 'a', 'i' là 3 nguyên âm.\n* Các phụ âm gồm: 'C', 'P', 'r', 'g', 'r', 'm', 'm', 'n', 'g' (tổng cộng 11 phụ âm).\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <cctype>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    int vowels = 0, consonants = 0;\n    for (char c : s) {\n        if (std::isalpha(static_cast<unsigned char>(c))) {\n            char lower = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));\n            if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u') {\n                vowels++;\n            } else {\n                consonants++;\n            }\n        }\n    }\n\n    std::cout << vowels << \" \" << consonants << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "C++ Programming 2026\n",
                "expectedOutput": "3 9\n",
                "isHidden": false
            },
            {
                "input": "aeiou\n",
                "expectedOutput": "5 0\n",
                "isHidden": false
            },
            {
                "input": "xyz\n",
                "expectedOutput": "0 3\n",
                "isHidden": true
            },
            {
                "input": "Antigravity Coding IDE\n",
                "expectedOutput": "8 12\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tìm Vị Trí Xuất Hiện Đầu Tiên và Cuối Cùng Của Ký Tự (findFirstLastChar)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Áp dụng phương thức `.find()` và `.rfind()` hoặc duyệt mảng tìm vị trí chỉ số (0-based index).\n* **Mô tả:** Dòng thứ nhất nhập vào một chuỗi ký tự S. Dòng thứ hai nhập một ký tự C. Hãy tìm vị trí chỉ số (tính từ 0) xuất hiện lần đầu tiên và lần cuối cùng của ký tự C trong chuỗi S. Nếu ký tự C không xuất hiện trong chuỗi, in ra `-1`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Chuỗi S (1 <= độ dài S <= 1000).\n  * Dòng 2: Ký tự C cần tìm kiếm.\n* **Đầu ra (Output):** In ra 2 số nguyên cách nhau một khoảng trắng biểu diễn chỉ số đầu tiên và chỉ số cuối cùng. Nếu không tìm thấy, in ra một số duy nhất là `-1`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nlap trinh c++ ngon ngu lap trinh\nl\n```\n\n**Khung Đầu ra (Output):**\n```text\n0 23\n```\n\n**Giải thích chi tiết:**\n* Ký tự 'l' xuất hiện lần đầu tiên tại vị trí index 0 (từ \"lap\" đầu tiên).\n* Ký tự 'l' xuất hiện lần cuối tại vị trí index 23 (từ \"lap\" thứ hai).\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n    char c;\n    if (!(std::cin >> c)) return 0;\n\n    int first = -1, last = -1;\n    for (int i = 0; i < static_cast<int>(s.length()); ++i) {\n        if (s[i] == c) {\n            if (first == -1) first = i;\n            last = i;\n        }\n    }\n\n    if (first == -1) {\n        std::cout << -1 << \"\\n\";\n    } else {\n        std::cout << first << \" \" << last << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "lap trinh c++ ngon ngu lap trinh\nl\n",
                "expectedOutput": "0 23\n",
                "isHidden": false
            },
            {
                "input": "banana\na\n",
                "expectedOutput": "1 5\n",
                "isHidden": false
            },
            {
                "input": "hello world\nz\n",
                "expectedOutput": "-1\n",
                "isHidden": true
            },
            {
                "input": "aaaaa\na\n",
                "expectedOutput": "0 4\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Xóa Toàn Bộ Khoảng Trắng Trong Chuỗi (removeAllSpaces)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Rèn luyện kỹ thuật tạo chuỗi kết quả mới hoặc xóa ký tự lọc điều kiện.\n* **Mô tả:** Nhập vào một dòng văn bản S có chứa nhiều khoảng trắng (dấu cách). Hãy loại bỏ toàn bộ các dấu cách trong chuỗi và in ra chuỗi liền mạch kết quả.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** Chuỗi ký tự sau khi đã bỏ hết mọi dấu cách.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n C o d e   H u b   2 0 2 6 \n```\n\n**Khung Đầu ra (Output):**\n```text\nCodeHub2026\n```\n\n**Giải thích chi tiết:**\n* Tất cả các ký tự khoảng trắng ở đầu, giữa và cuối chuỗi đều bị loại bỏ, chỉ giữ lại các ký tự khác khoảng trắng theo đúng thứ tự.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    std::string res = \"\";\n    for (char c : s) {\n        if (c != ' ') {\n            res.push_back(c);\n        }\n    }\n    std::cout << res << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": " C o d e   H u b   2 0 2 6 \n",
                "expectedOutput": "CodeHub2026\n",
                "isHidden": false
            },
            {
                "input": "Hello World\n",
                "expectedOutput": "HelloWorld\n",
                "isHidden": false
            },
            {
                "input": "NoSpaces\n",
                "expectedOutput": "NoSpaces\n",
                "isHidden": true
            },
            {
                "input": "   \n",
                "expectedOutput": "\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Thay Thế Ký Tự Trong Chuỗi (replaceCharacter)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Thao tác sửa đổi trực tiếp ký tự chuỗi bằng toán tử chỉ số `s[i]` hoặc phương thức chuỗi.\n* **Mô tả:** Dòng 1 nhập chuỗi ký tự S. Dòng 2 nhập hai ký tự c1 và c2 cách nhau một khoảng trắng. Hãy thay thế toàn bộ các ký tự c1 trong chuỗi S bằng ký tự c2 và in chuỗi sau khi thay thế ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Chuỗi S (1 <= độ dài S <= 1000).\n  * Dòng 2: Hai ký tự c1 và c2 cách nhau một khoảng trắng.\n* **Đầu ra (Output):** Chuỗi S sau khi đã thay thế mọi ký tự c1 thành c2.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nbanana\na o\n```\n\n**Khung Đầu ra (Output):**\n```text\nbonono\n```\n\n**Giải thích chi tiết:**\n* Tất cả các ký tự 'a' trong từ \"banana\" được thay thế bằng ký tự 'o', kết quả tạo thành \"bonono\".\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n    char c1, c2;\n    if (!(std::cin >> c1 >> c2)) return 0;\n\n    for (char& c : s) {\n        if (c == c1) c = c2;\n    }\n    std::cout << s << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "banana\na o\n",
                "expectedOutput": "bonono\n",
                "isHidden": false
            },
            {
                "input": "hello world\nl x\n",
                "expectedOutput": "hexxo worxd\n",
                "isHidden": false
            },
            {
                "input": "cpp programming\np +\n",
                "expectedOutput": "c++ +rogramming\n",
                "isHidden": true
            },
            {
                "input": "test\nz a\n",
                "expectedOutput": "test\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Ghép Đan Xen Ký Tự Hai Chuỗi (interleaveTwoStrings)",
        "difficulty": "EASY",
        "problemDescription": "* **Mục tiêu:** Làm quen với việc xử lý đồng thời hai chuỗi bằng vòng lặp và phương thức `.push_back()`.\n* **Mô tả:** Nhập vào hai chuỗi ký tự S1 và S2 trên hai dòng riêng biệt (không chứa dấu cách). Hãy tạo ra một chuỗi mới bằng cách ghép đan xen lần lượt một ký tự của S1 rồi đến một ký tự của S2. Nếu một trong hai chuỗi dài hơn chuỗi kia, phần ký tự dư thừa còn lại sẽ được nối toàn bộ vào phía sau chuỗi kết quả.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Chuỗi ký tự S1 (1 <= độ dài S1 <= 1000).\n  * Dòng 2: Chuỗi ký tự S2 (1 <= độ dài S2 <= 1000).\n* **Đầu ra (Output):** Chuỗi mới sau khi đã ghép đan xen.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nabc\n12345\n```\n\n**Khung Đầu ra (Output):**\n```text\na1b2c345\n```\n\n**Giải thích chi tiết:**\n* Lần lượt lấy: S1[0] ('a'), S2[0] ('1'), S1[1] ('b'), S2[1] ('2'), S1[2] ('c'), S2[2] ('3'). Chuỗi S1 hết ký tự, chuỗi S2 còn lại \"45\" được nối tiếp vào cuối tạo thành \"a1b2c345\".",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s1, s2;\n    if (!(std::cin >> s1 >> s2)) return 0;\n\n    std::string res = \"\";\n    int i = 0, j = 0;\n    while (i < static_cast<int>(s1.length()) || j < static_cast<int>(s2.length())) {\n        if (i < static_cast<int>(s1.length())) res.push_back(s1[i++]);\n        if (j < static_cast<int>(s2.length())) res.push_back(s2[j++]);\n    }\n\n    std::cout << res << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "abc\n12345\n",
                "expectedOutput": "a1b2c345\n",
                "isHidden": false
            },
            {
                "input": "hello\nworld\n",
                "expectedOutput": "hweolrllod\n",
                "isHidden": false
            },
            {
                "input": "short\nL\n",
                "expectedOutput": "sLhort\n",
                "isHidden": true
            },
            {
                "input": "X\nlongstring\n",
                "expectedOutput": "Xlongstring\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Đếm Số Lượng Từ Trong Chuỗi Văn Bản (countWordsInSentence)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Rèn luyện kỹ thuật tách từ cơ bản bằng `std::stringstream` hoặc duyệt trạng thái ký tự khoảng trắng.\n* **Mô tả:** Nhập vào một dòng văn bản S có thể chứa nhiều khoảng trắng thừa ở đầu, ở cuối hoặc giữa các từ liên tiếp nhau. Hãy đếm xem câu văn bản đó chứa bao nhiêu từ hợp lệ (mỗi từ là một chuỗi các ký tự liền nhau không chứa khoảng trắng).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng văn bản S (độ dài không quá 1000 ký tự).\n* **Đầu ra (Output):** In ra một số nguyên duy nhất là số lượng từ có trong câu văn bản S.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n   Hoc   lap  trinh    C++   nang cao   \n```\n\n**Khung Đầu ra (Output):**\n```text\n5\n```\n\n**Giải thích chi tiết:**\n* Các từ tìm được lần lượt là: \"Hoc\", \"lap\", \"trinh\", \"C++\", \"nang\", \"cao\" (tổng cộng 5 từ). Khoảng trắng thừa ở hai đầu và giữa các từ không được tính là từ.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <sstream>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    std::stringstream ss(s);\n    std::string word;\n    int count = 0;\n    while (ss >> word) {\n        count++;\n    }\n\n    std::cout << count << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "   Hoc   lap  trinh    C++   nang cao   \n",
                "expectedOutput": "6\n",
                "isHidden": false
            },
            {
                "input": "OneWord\n",
                "expectedOutput": "1\n",
                "isHidden": false
            },
            {
                "input": "a b c d e\n",
                "expectedOutput": "5\n",
                "isHidden": true
            },
            {
                "input": "     leading and trailing     \n",
                "expectedOutput": "3\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Chuẩn Hóa Chuỗi Họ Tên Người Dùng (normalizePersonName)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Kết hợp xử lý tách từ, biến đổi chữ hoa chữ thường và ghép chuỗi chuẩn định dạng.\n* **Mô tả:** Nhập vào một chuỗi họ và tên bị gõ sai quy cách (chứa dấu cách thừa ở đầu, cuối, giữa các từ, chữ hoa chữ thường lộn xộn). Hãy chuẩn hóa chuỗi theo quy tắc:\n  * Loại bỏ hoàn toàn khoảng trắng thừa ở đầu và cuối chuỗi.\n  * Giữa mỗi từ chỉ cách nhau đúng một khoảng trắng.\n  * Ký tự đầu tiên của mỗi từ phải viết in hoa, các ký tự còn lại của từ viết in thường.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng chứa chuỗi họ tên S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** Chuỗi họ tên sau khi đã chuẩn hóa.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n  ngUYEn   vAN   aN  \n```\n\n**Khung Đầu ra (Output):**\n```text\nNguyen Van An\n```\n\n**Giải thích chi tiết:**\n* Các từ \"ngUYEn\", \"vAN\", \"aN\" được chuẩn hóa thành \"Nguyen\", \"Van\", \"An\" và ghép lại cách nhau đúng 1 dấu cách.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <sstream>\n#include <vector>\n#include <cctype>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    std::stringstream ss(s);\n    std::string word;\n    std::vector<std::string> words;\n\n    while (ss >> word) {\n        for (char& c : word) {\n            c = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));\n        }\n        if (!word.empty()) {\n            word[0] = static_cast<char>(std::toupper(static_cast<unsigned char>(word[0])));\n        }\n        words.push_back(word);\n    }\n\n    for (size_t i = 0; i < words.size(); ++i) {\n        std::cout << words[i] << (i + 1 == words.size() ? \"\" : \" \");\n    }\n    std::cout << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "  ngUYEn   vAN   aN  \n",
                "expectedOutput": "Nguyen Van An\n",
                "isHidden": false
            },
            {
                "input": "TRAN THI MAI\n",
                "expectedOutput": "Tran Thi Mai\n",
                "isHidden": false
            },
            {
                "input": "   le    \n",
                "expectedOutput": "Le\n",
                "isHidden": true
            },
            {
                "input": "dO     HOANG     nam\n",
                "expectedOutput": "Do Hoang Nam\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Đếm Tần Suất Ký Tự và In Theo Thứ Tự Xuất Hiện (charFrequencyInOrder)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Nắm vững cấu trúc mảng đếm tần suất kết hợp chuỗi để theo dõi thứ tự xuất hiện đầu tiên của ký tự.\n* **Mô tả:** Nhập vào một chuỗi ký tự S gồm các chữ cái và chữ số (không chứa dấu cách). Hãy đếm số lần xuất hiện của từng ký tự trong chuỗi S. In ra mỗi ký tự kèm theo số lần xuất hiện của nó (cách nhau bởi dấu hai chấm và khoảng trắng `: `), theo đúng thứ tự xuất hiện đầu tiên của ký tự đó trong chuỗi, mỗi ký tự trên một dòng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** Mỗi dòng in ra một ký tự kèm tần suất theo định dạng `Ký_tự: Số_lần`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nprogramming\n```\n\n**Khung Đầu ra (Output):**\n```text\np: 1\nr: 2\no: 1\ng: 2\na: 1\nm: 2\ni: 1\nn: 1\n```\n\n**Giải thích chi tiết:**\n* Ký tự 'p' xuất hiện 1 lần, 'r' xuất hiện 2 lần, 'o' 1 lần, 'g' 2 lần, 'a' 1 lần, 'm' 2 lần, 'i' 1 lần, 'n' 1 lần. Thứ tự in ra hoàn toàn trùng khớp với thời điểm ký tự đó lần đầu tiên xuất hiện trong \"programming\".\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <vector>\n\nint main() {\n    std::string s;\n    if (!(std::cin >> s)) return 0;\n\n    std::vector<int> freq(256, 0);\n    std::vector<char> order;\n\n    for (char c : s) {\n        unsigned char uc = static_cast<unsigned char>(c);\n        if (freq[uc] == 0) {\n            order.push_back(c);\n        }\n        freq[uc]++;\n    }\n\n    for (char c : order) {\n        unsigned char uc = static_cast<unsigned char>(c);\n        std::cout << c << \": \" << freq[uc] << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "programming\n",
                "expectedOutput": "p: 1\nr: 2\no: 1\ng: 2\na: 1\nm: 2\ni: 1\nn: 1\n",
                "isHidden": false
            },
            {
                "input": "banana\n",
                "expectedOutput": "b: 1\na: 3\nn: 2\n",
                "isHidden": false
            },
            {
                "input": "aaaaa\n",
                "expectedOutput": "a: 5\n",
                "isHidden": true
            },
            {
                "input": "codehub\n",
                "expectedOutput": "c: 1\no: 1\nd: 1\ne: 1\nh: 1\nu: 1\nb: 1\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tìm Từ Dài Nhất và Ngắn Nhất Trong Câu (findLongestShortestWord)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Duyệt danh sách các từ trong chuỗi và so sánh độ dài `.length()` để tìm giá trị cực đại và cực tiểu.\n* **Mô tả:** Nhập vào một dòng văn bản S gồm nhiều từ cách nhau bởi khoảng trắng. Hãy tìm và in ra từ có độ dài dài nhất và từ có độ dài ngắn nhất trong câu. Nếu có nhiều từ cùng độ dài dài nhất (hoặc ngắn nhất), hãy chọn từ xuất hiện đầu tiên trong câu.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng chứa chuỗi văn bản S (chứa ít nhất 1 từ, 1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** In ra 2 dòng:\n  * Dòng 1: Từ dài nhất tìm được.\n  * Dòng 2: Từ ngắn nhất tìm được.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nhoc lap trinh ngon ngu cplusplus\n```\n\n**Khung Đầu ra (Output):**\n```text\ncplusplus\nhoc\n```\n\n**Giải thích chi tiết:**\n* Từ dài nhất là \"cplusplus\" (10 ký tự). Từ ngắn nhất là \"hoc\" và \"ngu\" (3 ký tự), nhưng \"hoc\" xuất hiện trước nên được chọn.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <sstream>\n#include <vector>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    std::stringstream ss(s);\n    std::string word;\n    std::vector<std::string> words;\n    while (ss >> word) {\n        words.push_back(word);\n    }\n\n    if (words.empty()) return 0;\n\n    std::string longest = words[0];\n    std::string shortest = words[0];\n\n    for (const auto& w : words) {\n        if (w.length() > longest.length()) {\n            longest = w;\n        }\n        if (w.length() < shortest.length()) {\n            shortest = w;\n        }\n    }\n\n    std::cout << longest << \"\\n\";\n    std::cout << shortest << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "hoc lap trinh ngon ngu cplusplus\n",
                "expectedOutput": "cplusplus\nhoc\n",
                "isHidden": false
            },
            {
                "input": "a bb ccc dddd\n",
                "expectedOutput": "dddd\na\n",
                "isHidden": false
            },
            {
                "input": "single\n",
                "expectedOutput": "single\nsingle\n",
                "isHidden": true
            },
            {
                "input": "tie longest word here\n",
                "expectedOutput": "longest\ntie\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tìm Kiếm Chuỗi Con và Vị Trí Xuất Hiện (subStringSearch)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Sử dụng phương thức `s.find()` và xử lý trường hợp không tìm thấy bằng hằng số `std::string::npos`.\n* **Mô tả:** Nhập vào hai chuỗi S1 và S2 (mỗi chuỗi trên một dòng). Hãy kiểm tra xem S2 có phải là chuỗi con xuất hiện liên tiếp trong S1 hay không. Nếu có, hãy in ra chỉ số (0-based index) của vị trí bắt đầu xuất hiện đầu tiên của S2 trong S1. Nếu không tìm thấy, in ra `-1`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Chuỗi mẹ S1 (1 <= độ dài S1 <= 1000).\n  * Dòng 2: Chuỗi con S2 (1 <= độ dài S2 <= 1000).\n* **Đầu ra (Output):** Chỉ số đầu tiên tìm thấy hoặc `-1` nếu không có.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nChao mung ban den voi CodeHub\nCodeHub\n```\n\n**Khung Đầu ra (Output):**\n```text\n23\n```\n\n**Giải thích chi tiết:**\n* Từ \"CodeHub\" bắt đầu xuất hiện tại chỉ số vị trí thứ 23 trong chuỗi S1.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s1, s2;\n    if (!std::getline(std::cin, s1)) return 0;\n    if (!std::getline(std::cin, s2)) return 0;\n\n    size_t pos = s1.find(s2);\n    if (pos != std::string::npos) {\n        std::cout << pos << \"\\n\";\n    } else {\n        std::cout << -1 << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "Chao mung ban den voi CodeHub\nCodeHub\n",
                "expectedOutput": "22\n",
                "isHidden": false
            },
            {
                "input": "lap trinh c++ rat hay\npython\n",
                "expectedOutput": "-1\n",
                "isHidden": false
            },
            {
                "input": "aaaaa\naa\n",
                "expectedOutput": "0\n",
                "isHidden": true
            },
            {
                "input": "hello\nhello\n",
                "expectedOutput": "0\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Kiểm Tra Hai Chuỗi Đảo Chữ Anagram (checkValidAnagram)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Áp dụng mảng đếm tần suất 26 chữ cái hoặc phương pháp sắp xếp chuỗi để kiểm tra tính toàn vẹn ký tự.\n* **Mô tả:** Hai chuỗi được gọi là Anagram (đảo chữ của nhau) nếu chúng chứa các ký tự giống hệt nhau với cùng số lượng tần suất, chỉ khác nhau về thứ tự sắp xếp. Cho hai chuỗi S1 và S2 chỉ gồm các chữ cái in thường tiếng Anh. Hãy kiểm tra xem S1 và S2 có phải là Anagram của nhau không. In ra `YES` nếu phải, ngược lại in ra `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Chuỗi ký tự S1.\n  * Dòng 2: Chuỗi ký tự S2.\n* **Đầu ra (Output):** In `YES` nếu hai chuỗi là Anagram của nhau, ngược lại in `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nlisten\nsilent\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* Cả hai từ \"listen\" và \"silent\" đều cấu tạo từ các chữ cái: 1 chữ 'e', 1 chữ 'i', 1 chữ 'l', 1 chữ 'n', 1 chữ 's', 1 chữ 't'. Số lượng và thành phần hoàn toàn giống nhau nên là Anagram.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <vector>\n\nint main() {\n    std::string s1, s2;\n    if (!(std::cin >> s1 >> s2)) return 0;\n\n    if (s1.length() != s2.length()) {\n        std::cout << \"NO\\n\";\n        return 0;\n    }\n\n    std::vector<int> count(26, 0);\n    for (char c : s1) count[c - 'a']++;\n    for (char c : s2) count[c - 'a']--;\n\n    bool isAnagram = true;\n    for (int x : count) {\n        if (x != 0) {\n            isAnagram = false;\n            break;\n        }\n    }\n\n    std::cout << (isAnagram ? \"YES\" : \"NO\") << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "listen\nsilent\n",
                "expectedOutput": "YES\n",
                "isHidden": false
            },
            {
                "input": "triangle\nintegral\n",
                "expectedOutput": "YES\n",
                "isHidden": false
            },
            {
                "input": "apple\npaple\n",
                "expectedOutput": "YES\n",
                "isHidden": true
            },
            {
                "input": "rat\ncar\n",
                "expectedOutput": "NO\n",
                "isHidden": true
            },
            {
                "input": "hello\nworld\n",
                "expectedOutput": "NO\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Đảo Ngược Thứ Tự Các Từ Trong Câu (reverseWordsInSentence)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Tách chuỗi thành danh sách các từ (bằng `vector<string>`) và duyệt ngược để tái tạo câu.\n* **Mô tả:** Nhập vào một câu văn bản S gồm các từ cách nhau bởi khoảng trắng. Hãy in ra một câu mới trong đó thứ tự các từ bị đảo ngược hoàn toàn (từ cuối cùng chuyển lên đầu tiên, từ kế cuối đứng thứ hai, ..., từ đầu tiên đứng cuối cùng). Giữa các từ trong câu mới chỉ cách nhau đúng một khoảng trắng.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng chứa câu văn bản S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** Câu văn bản sau khi đã đảo ngược thứ tự các từ.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nlap trinh c++ rat vui va thu vi\n```\n\n**Khung Đầu ra (Output):**\n```text\nvi thu va vui rat c++ trinh lap\n```\n\n**Giải thích chi tiết:**\n* Thứ tự các từ: \"lap\", \"trinh\", \"c++\", \"rat\", \"vui\", \"va\", \"thu\", \"vi\" được đảo ngược từ cuối lên đầu.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <sstream>\n#include <vector>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    std::stringstream ss(s);\n    std::string word;\n    std::vector<std::string> words;\n    while (ss >> word) {\n        words.push_back(word);\n    }\n\n    for (int i = static_cast<int>(words.size()) - 1; i >= 0; --i) {\n        std::cout << words[i] << (i == 0 ? \"\" : \" \");\n    }\n    std::cout << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "lap trinh c++ rat vui va thu vi\n",
                "expectedOutput": "vi thu va vui rat c++ trinh lap\n",
                "isHidden": false
            },
            {
                "input": "one two three\n",
                "expectedOutput": "three two one\n",
                "isHidden": false
            },
            {
                "input": "Hello\n",
                "expectedOutput": "Hello\n",
                "isHidden": true
            },
            {
                "input": "keep   clean   spaces\n",
                "expectedOutput": "spaces clean keep\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tách Chuỗi Theo Ký Tự Phân Cách (splitStringByDelimiter)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Tự cài đặt thuật toán tách chuỗi (Split) với ký tự phân cách bất kỳ bằng `std::string::substr` hoặc `std::stringstream`.\n* **Mô tả:** Dòng 1 nhập chuỗi ký tự S. Dòng 2 nhập một ký tự D đóng vai trò là dấu phân cách (delimiter). Hãy tách chuỗi S thành các đoạn con ngăn cách bởi ký tự D và in mỗi đoạn con trên một dòng riêng biệt. (Nếu giữa hai dấu phân cách liên tiếp không có ký tự nào thì bỏ qua hoặc in dòng trống, thông thường chỉ in các đoạn con có dữ liệu).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Chuỗi S (1 <= độ dài S <= 1000).\n  * Dòng 2: Ký tự phân cách D (ví dụ: dấu phẩy `,`, dấu gạch ngang `-`, dấu chấm phẩy `;`).\n* **Đầu ra (Output):** Các chuỗi con sau khi tách, mỗi chuỗi con in trên một dòng riêng biệt (không in các phần rỗng).\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\napple,orange,banana,grape,mango\n,\n```\n\n**Khung Đầu ra (Output):**\n```text\napple\norange\nbanana\ngrape\nmango\n```\n\n**Giải thích chi tiết:**\n* Chuỗi được bẻ tách tại mỗi dấu phẩy `,` thành 5 loại trái cây riêng biệt.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n    char delimiter;\n    if (!(std::cin >> delimiter)) return 0;\n\n    std::string cur = \"\";\n    for (char c : s) {\n        if (c == delimiter) {\n            if (!cur.empty()) {\n                std::cout << cur << \"\\n\";\n                cur = \"\";\n            }\n        } else {\n            cur.push_back(c);\n        }\n    }\n    if (!cur.empty()) {\n        std::cout << cur << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "apple,orange,banana,grape,mango\n,\n",
                "expectedOutput": "apple\norange\nbanana\ngrape\nmango\n",
                "isHidden": false
            },
            {
                "input": "10-20-30-40-50\n-\n",
                "expectedOutput": "10\n20\n30\n40\n50\n",
                "isHidden": false
            },
            {
                "input": "onlyone\n;\n",
                "expectedOutput": "onlyone\n",
                "isHidden": true
            },
            {
                "input": "a:b:c:d\n:\n",
                "expectedOutput": "a\nb\nc\nd\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Nén Chuỗi Run-Length Encoding (compressRunLengthEncoding)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Rèn luyện kỹ thuật duyệt nhóm ký tự liên tiếp và đếm số lượng lặp lại (thuật toán nén dữ liệu RLE cổ điển).\n* **Mô tả:** Nhập vào chuỗi ký tự S gồm các chữ cái in thường. Hãy nén chuỗi theo quy tắc: Với mỗi đoạn ký tự liên tiếp giống nhau, thay thế đoạn đó bằng ký tự đại diện kèm theo số lần xuất hiện của nó. In chuỗi đã nén ra màn hình.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000, không chứa dấu cách).\n* **Đầu ra (Output):** Chuỗi sau khi được nén theo giải thuật Run-Length.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\naaabbcccccdeee\n```\n\n**Khung Đầu ra (Output):**\n```text\na3b2c5d1e3\n```\n\n**Giải thích chi tiết:**\n* Ký tự 'a' lặp 3 lần -> \"a3\".\n* Ký tự 'b' lặp 2 lần -> \"b2\".\n* Ký tự 'c' lặp 5 lần -> \"c5\".\n* Ký tự 'd' xuất hiện 1 lần -> \"d1\".\n* Ký tự 'e' lặp 3 lần -> \"e3\". Ghép lại ta được \"a3b2c5d1e3\".\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s;\n    if (!(std::cin >> s)) return 0;\n    if (s.empty()) return 0;\n\n    std::string res = \"\";\n    int count = 1;\n    for (size_t i = 1; i <= s.length(); ++i) {\n        if (i < s.length() && s[i] == s[i - 1]) {\n            count++;\n        } else {\n            res.push_back(s[i - 1]);\n            res += std::to_string(count);\n            count = 1;\n        }\n    }\n\n    std::cout << res << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "aaabbcccccdeee\n",
                "expectedOutput": "a3b2c5d1e3\n",
                "isHidden": false
            },
            {
                "input": "a\n",
                "expectedOutput": "a1\n",
                "isHidden": false
            },
            {
                "input": "abcdef\n",
                "expectedOutput": "a1b1c1d1e1f1\n",
                "isHidden": true
            },
            {
                "input": "aaaaaaaaaa\n",
                "expectedOutput": "a10\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Giải Mã Chuỗi Run-Length (decompressRunLengthEncoding)",
        "difficulty": "MEDIUM",
        "problemDescription": "* **Mục tiêu:** Kỹ thuật phân tích cú pháp (parsing) chuỗi xen kẽ chữ cái và số lượng để khôi phục dữ liệu gốc.\n* **Mô tả:** Nhập vào một chuỗi đã nén S có định dạng gồm từng chữ cái theo sau bởi một số nguyên dương biểu thị số lần lặp lại của chữ cái đó (ví dụ: `a3b2c1`). Hãy giải mã và in ra chuỗi nguyên bản ban đầu. Biết rằng số lần lặp lại của mỗi ký tự là một số nguyên từ 1 đến 100.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi đã nén S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** Chuỗi nguyên bản sau khi giải nén hoàn chỉnh.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\na3b2c5d1\n```\n\n**Khung Đầu ra (Output):**\n```text\naaabbcccccd\n```\n\n**Giải thích chi tiết:**\n* 'a' nhân 3 lần thành \"aaa\".\n* 'b' nhân 2 lần thành \"bb\".\n* 'c' nhân 5 lần thành \"ccccc\".\n* 'd' nhân 1 lần thành \"d\". Nối lại thành \"aaabbcccccd\".",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <cctype>\n\nint main() {\n    std::string s;\n    if (!(std::cin >> s)) return 0;\n\n    std::string res = \"\";\n    char curChar = ' ';\n    std::string numStr = \"\";\n\n    for (char c : s) {\n        if (std::isalpha(static_cast<unsigned char>(c))) {\n            if (!numStr.empty()) {\n                int repeat = std::stoi(numStr);\n                res.append(repeat, curChar);\n                numStr = \"\";\n            }\n            curChar = c;\n        } else if (std::isdigit(static_cast<unsigned char>(c))) {\n            numStr.push_back(c);\n        }\n    }\n\n    if (!numStr.empty()) {\n        int repeat = std::stoi(numStr);\n        res.append(repeat, curChar);\n    }\n\n    std::cout << res << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "a3b2c5d1\n",
                "expectedOutput": "aaabbcccccd\n",
                "isHidden": false
            },
            {
                "input": "a1\n",
                "expectedOutput": "a\n",
                "isHidden": false
            },
            {
                "input": "a1b1c1d1e1\n",
                "expectedOutput": "abcde\n",
                "isHidden": true
            },
            {
                "input": "x10y2\n",
                "expectedOutput": "xxxxxxxxxxyy\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Kiểm Tra Chuỗi Đối Xứng Palindrome Mở Rộng (isAdvancedPalindrome)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Sử dụng kỹ thuật hai con trỏ (Two Pointers) kết hợp lọc ký tự chữ và số (`isalnum`) và chuyển chữ thường (`tolower`).\n* **Mô tả:** Nhập vào một dòng văn bản S có thể chứa khoảng trắng, chữ hoa, chữ thường và các dấu câu (như dấu phẩy, chấm, chấm than...). Hãy kiểm tra xem S có phải là một chuỗi đối xứng hay không, biết rằng khi kiểm tra ta chỉ quan tâm đến các chữ cái và chữ số (bỏ qua toàn bộ khoảng trắng và dấu câu) và không phân biệt chữ hoa hay chữ thường. In ra `YES` nếu đúng, ngược lại in ra `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** In `YES` nếu là chuỗi đối xứng mở rộng, ngược lại in `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nA man, a plan, a canal: Panama!\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* Sau khi loại bỏ khoảng trắng và dấu câu, chuyển toàn bộ về chữ thường, chuỗi trở thành: \"amanaplanacanalpanama\". Chuỗi này đọc xuôi và đọc ngược hoàn toàn giống nhau nên in ra `YES`.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <cctype>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    std::string filtered = \"\";\n    for (char c : s) {\n        if (std::isalnum(static_cast<unsigned char>(c))) {\n            filtered.push_back(static_cast<char>(std::tolower(static_cast<unsigned char>(c))));\n        }\n    }\n\n    int left = 0, right = static_cast<int>(filtered.length()) - 1;\n    bool isPal = true;\n    while (left < right) {\n        if (filtered[left] != filtered[right]) {\n            isPal = false;\n            break;\n        }\n        left++;\n        right--;\n    }\n\n    std::cout << (isPal ? \"YES\" : \"NO\") << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "A man, a plan, a canal: Panama!\n",
                "expectedOutput": "YES\n",
                "isHidden": false
            },
            {
                "input": "race a car\n",
                "expectedOutput": "NO\n",
                "isHidden": false
            },
            {
                "input": "Was it a car or a cat I saw?\n",
                "expectedOutput": "YES\n",
                "isHidden": true
            },
            {
                "input": "No 'x' in Nixon\n",
                "expectedOutput": "YES\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Mã Hóa Mật Mã Caesar Dịch Chuyển K Ký Tự (caesarCipherEncoding)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Vận dụng phép toán đồng dư bảng mã ASCII (`(c - 'a' + k) % 26 + 'a'`) để mã hóa chuỗi an toàn.\n* **Mô tả:** Mật mã Caesar là một trong những kỹ thuật mã hóa cổ điển đơn giản nhất, trong đó mỗi chữ cái trong văn bản gốc được thay thế bằng một chữ cái cách nó K vị trí trong bảng chữ cái tiếng Anh (vòng tròn từ 'z' quay lại 'a', hoặc 'Z' quay lại 'A'). Các ký tự không phải chữ cái (khoảng trắng, số, dấu câu) được giữ nguyên không thay đổi. Hãy viết chương trình nhập chuỗi S và số nguyên K (0 <= K <= 100), in ra chuỗi sau khi đã được mã hóa.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Chuỗi S cần mã hóa (1 <= độ dài S <= 1000).\n  * Dòng 2: Số nguyên K (0 <= K <= 100).\n* **Đầu ra (Output):** Chuỗi S sau khi mã hóa Caesar.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nHello, World 2026!\n3\n```\n\n**Khung Đầu ra (Output):**\n```text\nKhoor, Zruog 2026!\n```\n\n**Giải thích chi tiết:**\n* Chữ 'H' dịch 3 vị trí thành 'K', 'e' thành 'h', 'l' thành 'o', 'o' thành 'r'. Chữ 'W' thành 'Z', v.v. Dấu phẩy, khoảng trắng, số và dấu chấm than được giữ nguyên.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <cctype>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n    int k = 0;\n    if (!(std::cin >> k)) return 0;\n    k = (k % 26 + 26) % 26;\n\n    for (char& c : s) {\n        if (std::isupper(static_cast<unsigned char>(c))) {\n            c = static_cast<char>((c - 'A' + k) % 26 + 'A');\n        } else if (std::islower(static_cast<unsigned char>(c))) {\n            c = static_cast<char>((c - 'a' + k) % 26 + 'a');\n        }\n    }\n\n    std::cout << s << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "Hello, World 2026!\n3\n",
                "expectedOutput": "Khoor, Zruog 2026!\n",
                "isHidden": false
            },
            {
                "input": "abc XYZ\n1\n",
                "expectedOutput": "bcd YZA\n",
                "isHidden": false
            },
            {
                "input": "Python & C++\n0\n",
                "expectedOutput": "Python & C++\n",
                "isHidden": true
            },
            {
                "input": "Zebra-2026\n26\n",
                "expectedOutput": "Zebra-2026\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Cộng Hai Số Nguyên Lớn Bằng Chuỗi (bigIntegerAddition)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Cài đặt thuật toán cộng số học từng chữ số kèm biến nhớ (carry) từ phải sang trái bằng `std::string` để giải quyết giới hạn kiểu `long long`.\n* **Mô tả:** Nhập vào hai số nguyên dương lớn A và B dưới dạng chuỗi (mỗi số có thể dài tới 1000 chữ số, không thể chứa vừa trong các kiểu số nguyên thông thường của C++). Hãy tính và in ra chuỗi biểu diễn tổng của A và B.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Chuỗi A gồm các chữ số (1 <= độ dài A <= 1000).\n  * Dòng 2: Chuỗi B gồm các chữ số (1 <= độ dài B <= 1000).\n* **Đầu ra (Output):** Chuỗi biểu diễn tổng của A và B.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n99999999999999999999\n1\n```\n\n**Khung Đầu ra (Output):**\n```text\n100000000000000000000\n```\n\n**Giải thích chi tiết:**\n* Số thứ nhất có 20 chữ số 9, khi cộng thêm 1 ta được số 1 kèm 20 chữ số 0.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <algorithm>\n\nint main() {\n    std::string a, b;\n    if (!(std::cin >> a >> b)) return 0;\n\n    std::string res = \"\";\n    int i = static_cast<int>(a.length()) - 1;\n    int j = static_cast<int>(b.length()) - 1;\n    int carry = 0;\n\n    while (i >= 0 || j >= 0 || carry) {\n        int sum = carry;\n        if (i >= 0) sum += (a[i--] - '0');\n        if (j >= 0) sum += (b[j--] - '0');\n        carry = sum / 10;\n        res.push_back(static_cast<char>((sum % 10) + '0'));\n    }\n\n    std::reverse(res.begin(), res.end());\n    std::cout << res << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "99999999999999999999\n1\n",
                "expectedOutput": "100000000000000000000\n",
                "isHidden": false
            },
            {
                "input": "12345678901234567890\n98765432109876543210\n",
                "expectedOutput": "111111111011111111100\n",
                "isHidden": false
            },
            {
                "input": "0\n0\n",
                "expectedOutput": "0\n",
                "isHidden": true
            },
            {
                "input": "999\n111\n",
                "expectedOutput": "1110\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Trừ Hai Số Nguyên Lớn Không Âm (bigIntegerSubtraction)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Cài đặt thuật toán trừ hai số nguyên lớn từng chữ số kèm mượn (borrow) từ phải sang trái và xóa số 0 vô nghĩa ở đầu.\n* **Mô tả:** Nhập vào hai số nguyên không âm A và B dưới dạng chuỗi (độ dài mỗi số tới 1000 chữ số), đảm bảo A >= B. Hãy tính và in ra hiệu A - B. Chuỗi kết quả không được chứa các số 0 thừa ở đầu (ngoại trừ trường hợp kết quả bằng đúng số 0).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Chuỗi số A (1 <= độ dài A <= 1000).\n  * Dòng 2: Chuỗi số B (1 <= độ dài B <= 1000, A >= B).\n* **Đầu ra (Output):** Chuỗi biểu diễn hiệu A - B.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n100000000000000000000\n1\n```\n\n**Khung Đầu ra (Output):**\n```text\n99999999999999999999\n```\n\n**Giải thích chi tiết:**\n* Thực hiện phép trừ từng cột chữ số từ hàng đơn vị sang trái, mượn 1 khi chữ số của A nhỏ hơn chữ số tương ứng của B.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <algorithm>\n\nint main() {\n    std::string a, b;\n    if (!(std::cin >> a >> b)) return 0;\n\n    std::string res = \"\";\n    int i = static_cast<int>(a.length()) - 1;\n    int j = static_cast<int>(b.length()) - 1;\n    int borrow = 0;\n\n    while (i >= 0) {\n        int sub = (a[i--] - '0') - borrow;\n        if (j >= 0) sub -= (b[j--] - '0');\n        if (sub < 0) {\n            sub += 10;\n            borrow = 1;\n        } else {\n            borrow = 0;\n        }\n        res.push_back(static_cast<char>(sub + '0'));\n    }\n\n    while (res.length() > 1 && res.back() == '0') {\n        res.pop_back();\n    }\n\n    std::reverse(res.begin(), res.end());\n    std::cout << res << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "100000000000000000000\n1\n",
                "expectedOutput": "99999999999999999999\n",
                "isHidden": false
            },
            {
                "input": "98765432109876543210\n12345678901234567890\n",
                "expectedOutput": "86419753208641975320\n",
                "isHidden": false
            },
            {
                "input": "500\n500\n",
                "expectedOutput": "0\n",
                "isHidden": true
            },
            {
                "input": "100\n99\n",
                "expectedOutput": "1\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Độ Dài Chuỗi Con Dài Nhất Không Chứa Ký Tự Trùng Lặp (lengthOfLongestUniqueSubstring)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Áp dụng kỹ thuật Cửa sổ trượt (Sliding Window) kết hợp mảng lưu vị trí xuất hiện gần nhất của ký tự.\n* **Mô tả:** Nhập vào một chuỗi ký tự S. Hãy tìm độ dài của chuỗi con liên tiếp dài nhất trong S sao cho không có bất kỳ ký tự nào bị lặp lại nhiều lần.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 10^5, chỉ gồm các ký tự in được trong bảng mã ASCII).\n* **Đầu ra (Output):** Một số nguyên duy nhất là độ dài lớn nhất tìm được.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nabcabcbb\n```\n\n**Khung Đầu ra (Output):**\n```text\n3\n```\n\n**Giải thích chi tiết:**\n* Các chuỗi con không lặp hợp lệ gồm \"abc\", \"bca\", \"cab\", tất cả đều có độ dài lớn nhất là 3.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::string s;\n    if (!std::getline(std::cin, s)) return 0;\n\n    std::vector<int> lastPos(256, -1);\n    int maxLen = 0;\n    int left = 0;\n\n    for (int right = 0; right < static_cast<int>(s.length()); ++right) {\n        unsigned char uc = static_cast<unsigned char>(s[right]);\n        if (lastPos[uc] >= left) {\n            left = lastPos[uc] + 1;\n        }\n        lastPos[uc] = right;\n        maxLen = std::max(maxLen, right - left + 1);\n    }\n\n    std::cout << maxLen << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "abcabcbb\n",
                "expectedOutput": "3\n",
                "isHidden": false
            },
            {
                "input": "bbbbb\n",
                "expectedOutput": "1\n",
                "isHidden": false
            },
            {
                "input": "pwwkew\n",
                "expectedOutput": "3\n",
                "isHidden": true
            },
            {
                "input": "abcdefg\n",
                "expectedOutput": "7\n",
                "isHidden": true
            },
            {
                "input": " \n",
                "expectedOutput": "1\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Tìm Độ Dài Xâu Con Đối Xứng Dài Nhất (longestPalindromicSubstringLength)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Nắm vững giải thuật mở rộng từ tâm (Expand Around Center) để tìm chuỗi Palindrome có độ phức tạp thời gian O(N^2) và bộ nhớ O(1).\n* **Mô tả:** Nhập vào một chuỗi ký tự S. Hãy tìm và in ra độ dài lớn nhất của một xâu con liên tiếp đối xứng (Palindromic Substring) có trong chuỗi S.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000, không chứa khoảng trắng).\n* **Đầu ra (Output):** Một số nguyên là độ dài của xâu con đối xứng dài nhất.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nbabad\n```\n\n**Khung Đầu ra (Output):**\n```text\n3\n```\n\n**Giải thích chi tiết:**\n* Trong chuỗi \"babad\", xâu con đối xứng dài nhất là \"bab\" hoặc \"aba\", cả hai đều có độ dài bằng 3.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <algorithm>\n\nint main() {\n    std::string s;\n    if (!(std::cin >> s)) return 0;\n\n    int n = static_cast<int>(s.length());\n    if (n == 0) {\n        std::cout << 0 << \"\\n\";\n        return 0;\n    }\n\n    int maxLen = 1;\n\n    for (int i = 0; i < n; ++i) {\n        // Lẻ\n        int l = i, r = i;\n        while (l >= 0 && r < n && s[l] == s[r]) {\n            maxLen = std::max(maxLen, r - l + 1);\n            l--;\n            r++;\n        }\n        // Chẵn\n        l = i;\n        r = i + 1;\n        while (l >= 0 && r < n && s[l] == s[r]) {\n            maxLen = std::max(maxLen, r - l + 1);\n            l--;\n            r++;\n        }\n    }\n\n    std::cout << maxLen << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "babad\n",
                "expectedOutput": "3\n",
                "isHidden": false
            },
            {
                "input": "cbbd\n",
                "expectedOutput": "2\n",
                "isHidden": false
            },
            {
                "input": "a\n",
                "expectedOutput": "1\n",
                "isHidden": true
            },
            {
                "input": "racecar\n",
                "expectedOutput": "7\n",
                "isHidden": true
            },
            {
                "input": "abacdfgdcaba\n",
                "expectedOutput": "3\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Nhân Số Nguyên Lớn Với Số Nguyên Nhỏ (bigIntegerMultiplyByInt)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Cài đặt thuật toán nhân chuỗi số lớn với một số nguyên nhỏ k (0 <= k <= 1000) với độ phức tạp tuyến tính O(N).\n* **Mô tả:** Cho một số nguyên lớn A được biểu diễn bằng chuỗi (độ dài lên tới 1000 chữ số) và một số nguyên dương k (0 <= k <= 1000). Hãy tính và in ra chuỗi biểu diễn tích của A * k.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Chuỗi số lớn A.\n  * Dòng 2: Số nguyên k (0 <= k <= 1000).\n* **Đầu ra (Output):** Chuỗi kết quả biểu diễn tích A * k.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n123456789123456789\n9\n```\n\n**Khung Đầu ra (Output):**\n```text\n1111111102111111101\n```\n\n**Giải thích chi tiết:**\n* Nhân từng chữ số của A với 9 từ phải sang trái kèm biến nhớ `carry`.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n#include <algorithm>\n\nint main() {\n    std::string a;\n    long long k;\n    if (!(std::cin >> a >> k)) return 0;\n\n    if (a == \"0\" || k == 0) {\n        std::cout << 0 << \"\\n\";\n        return 0;\n    }\n\n    std::string res = \"\";\n    long long carry = 0;\n\n    for (int i = static_cast<int>(a.length()) - 1; i >= 0; --i) {\n        long long prod = static_cast<long long>(a[i] - '0') * k + carry;\n        res.push_back(static_cast<char>((prod % 10) + '0'));\n        carry = prod / 10;\n    }\n\n    while (carry > 0) {\n        res.push_back(static_cast<char>((carry % 10) + '0'));\n        carry /= 10;\n    }\n\n    std::reverse(res.begin(), res.end());\n    std::cout << res << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "123456789123456789\n9\n",
                "expectedOutput": "1111111102111111101\n",
                "isHidden": false
            },
            {
                "input": "999999999999\n0\n",
                "expectedOutput": "0\n",
                "isHidden": false
            },
            {
                "input": "555555555555\n2\n",
                "expectedOutput": "1111111111110\n",
                "isHidden": true
            },
            {
                "input": "99999999999999999999\n5\n",
                "expectedOutput": "499999999999999999995\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Đếm Số Lần Xuất Hiện Không Chồng Chéo Của Chuỗi Con (countNonOverlappingOccurrences)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Rèn luyện việc ứng dụng phương thức `s.find(pat, start_pos)` với bước nhảy vị trí con trỏ tìm kiếm.\n* **Mô tả:** Nhập vào hai chuỗi S và P trên hai dòng riêng biệt. Hãy đếm xem chuỗi mẫu P xuất hiện bao nhiêu lần trong chuỗi văn bản S theo quy tắc không chồng chéo (khi một mẫu P được tìm thấy, lần tìm kiếm tiếp theo sẽ bắt đầu ngay sau ký tự cuối cùng của mẫu vừa tìm được).\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):**\n  * Dòng 1: Chuỗi văn bản S (1 <= độ dài S <= 1000).\n  * Dòng 2: Chuỗi mẫu P (1 <= độ dài P <= độ dài S).\n* **Đầu ra (Output):** Một số nguyên duy nhất là số lần xuất hiện không chồng chéo của P trong S.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\naaaaaa\naa\n```\n\n**Khung Đầu ra (Output):**\n```text\n3\n```\n\n**Giải thích chi tiết:**\n* Chuỗi S có 6 chữ 'a'. Với mẫu P = \"aa\", ta ghép được 3 cặp \"aa\" không đè lên nhau (vị trí 0..1, 2..3, 4..5). Nếu tính chồng chéo sẽ là 5, nhưng theo quy tắc không chồng chéo kết quả là 3.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s, p;\n    if (!std::getline(std::cin, s)) return 0;\n    if (!std::getline(std::cin, p)) return 0;\n\n    if (p.empty() || s.length() < p.length()) {\n        std::cout << 0 << \"\\n\";\n        return 0;\n    }\n\n    int count = 0;\n    size_t pos = 0;\n    while ((pos = s.find(p, pos)) != std::string::npos) {\n        count++;\n        pos += p.length();\n    }\n\n    std::cout << count << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "aaaaaa\naa\n",
                "expectedOutput": "3\n",
                "isHidden": false
            },
            {
                "input": "the quick brown fox jumps over the lazy dog\nthe\n",
                "expectedOutput": "2\n",
                "isHidden": false
            },
            {
                "input": "ababa\naba\n",
                "expectedOutput": "1\n",
                "isHidden": true
            },
            {
                "input": "hello\nz\n",
                "expectedOutput": "0\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Xóa Các Kặp Ký Tự Liền Kề Giống Nhau Đến Khi Tối Giản (removeAdjacentDuplicates)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Mô phỏng ngăn xếp (Stack) bằng một đối tượng `std::string` kết hợp `.push_back()` và `.pop_back()` để tối ưu hóa bộ nhớ và thời gian O(N).\n* **Mô tả:** Cho chuỗi ký tự S gồm các chữ cái in thường. Hãy liên tục xóa đi hai ký tự liền kề giống nhau cho đến khi không còn bất kỳ cặp ký tự liền kề nào giống nhau nữa. In ra chuỗi kết quả sau cùng. Nếu chuỗi bị xóa hết hoàn toàn, in ra `Empty`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 10^5).\n* **Đầu ra (Output):** Chuỗi ký tự sau khi tối giản hoặc chữ `Empty` nếu chuỗi rỗng.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\nabbaca\n```\n\n**Khung Đầu ra (Output):**\n```text\nca\n```\n\n**Giải thích chi tiết:**\n* Trong \"abbaca\", cặp \"bb\" bị xóa trước -> chuỗi còn \"aaca\".\n* Trong \"aaca\", cặp \"aa\" liền kề tiếp tục bị xóa -> chuỗi còn lại \"ca\". Không còn cặp nào liền nhau giống nhau nữa, kết thúc.\n\n---",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s;\n    if (!(std::cin >> s)) return 0;\n\n    std::string st = \"\";\n    for (char c : s) {\n        if (!st.empty() && st.back() == c) {\n            st.pop_back();\n        } else {\n            st.push_back(c);\n        }\n    }\n\n    if (st.empty()) {\n        std::cout << \"Empty\\n\";\n    } else {\n        std::cout << st << \"\\n\";\n    }\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "abbaca\n",
                "expectedOutput": "ca\n",
                "isHidden": false
            },
            {
                "input": "azxxzy\n",
                "expectedOutput": "ay\n",
                "isHidden": false
            },
            {
                "input": "aaaa\n",
                "expectedOutput": "Empty\n",
                "isHidden": true
            },
            {
                "input": "abcdef\n",
                "expectedOutput": "abcdef\n",
                "isHidden": true
            }
        ]
    },
    {
        "title": "Kiểm Tra Tính Hợp Lệ Của Dãy Dấu Ngoặc (isValidParenthesesString)",
        "difficulty": "HARD",
        "problemDescription": "* **Mục tiêu:** Áp dụng mô phỏng ngăn xếp bằng chuỗi `std::string` để giải quyết bài toán kinh điển về cấu trúc ngoặc lồng nhau `()`, `[]`, `{}`.\n* **Mô tả:** Cho một chuỗi S chỉ gồm các ký tự mở ngoặc và đóng ngoặc: `(`, `)`, `[`, `]`, `{`, `}`. Một chuỗi ngoặc được gọi là hợp lệ nếu:\n  1. Các dấu mở ngoặc phải được đóng bởi các dấu đóng ngoặc cùng loại.\n  2. Các dấu mở ngoặc phải được đóng theo đúng thứ tự lồng nhau.\n  Hãy in ra `YES` nếu chuỗi hợp lệ, ngược lại in ra `NO`.\n\n### Quy cách dữ liệu:\n* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi các dấu ngoặc S (1 <= độ dài S <= 1000).\n* **Đầu ra (Output):** In `YES` nếu chuỗi ngoặc hợp lệ, ngược lại in `NO`.\n\n### Ví dụ minh họa:\n**Khung Đầu vào (Input):**\n```text\n{[()]}\n```\n\n**Khung Đầu ra (Output):**\n```text\nYES\n```\n\n**Giải thích chi tiết:**\n* Dấu ngoặc tròn `()` nằm trọn trong ngoặc vuông `[]`, và cả cụm nằm trong ngoặc nhọn `{}` nên hợp lệ. Nếu chuỗi là `([)]` thì in `NO` vì thứ tự đóng mở bị đan chéo sai quy cách.",
        "starterCode": "#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n\nint main() {\n    // Cai dat thuat toan xu ly chuoi cua ban tai day:\n    \n    return 0;\n}\n",
        "solutionCode": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s;\n    if (!(std::cin >> s)) return 0;\n\n    std::string st = \"\";\n    bool isValid = true;\n\n    for (char c : s) {\n        if (c == '(' || c == '[' || c == '{') {\n            st.push_back(c);\n        } else {\n            if (st.empty()) {\n                isValid = false;\n                break;\n            }\n            char top = st.back();\n            if ((c == ')' && top == '(') ||\n                (c == ']' && top == '[') ||\n                (c == '}' && top == '{')) {\n                st.pop_back();\n            } else {\n                isValid = false;\n                break;\n            }\n        }\n    }\n\n    if (!st.empty()) {\n        isValid = false;\n    }\n\n    std::cout << (isValid ? \"YES\" : \"NO\") << \"\\n\";\n    return 0;\n}\n",
        "testCases": [
            {
                "input": "{[()]}\n",
                "expectedOutput": "YES\n",
                "isHidden": false
            },
            {
                "input": "()[]{}\n",
                "expectedOutput": "YES\n",
                "isHidden": false
            },
            {
                "input": "(]\n",
                "expectedOutput": "NO\n",
                "isHidden": true
            },
            {
                "input": "([)]\n",
                "expectedOutput": "NO\n",
                "isHidden": true
            },
            {
                "input": "{[]}\n",
                "expectedOutput": "YES\n",
                "isHidden": true
            }
        ]
    }
];

export async function seedCppModule6Practice() {
    console.log('🚀 Bắt đầu cập nhật toàn bộ 30 bài tập chuẩn hóa Module 6 C++ vào Database...');

    // 1. Tìm Module 6 của C++
    const module6 = await prisma.module.findUnique({
        where: { moduleId: 'CPP-MOD-06' }
    });

    if (!module6) {
        throw new Error('❌ Không tìm thấy Module 6 (CPP-MOD-06)!');
    }

    // 2. Tìm Chapter 6 của Module 6
    const chapter6 = await prisma.chapter.findFirst({
        where: {
            moduleId: module6.id,
            chapterId: 'CPP-CH-06'
        }
    });

    if (!chapter6) {
        throw new Error('❌ Không tìm thấy Chapter 6 của Module 6!');
    }

    // 3. Upsert bài học tổng hợp CPP-06.MP
    const lessonMp = await prisma.lesson.upsert({
        where: {
            id: 'c1b10000-0006-4000-8000-000000000001'
        },
        update: {
            lessonId: 'CPP-06.MP',
            title: 'Bài tập thực hành tổng hợp Module 6: Xử lý Chuỗi Ký tự (std::string) và Văn bản',
            objective: 'Hệ thống 30 bài tập rèn luyện chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức xử lý chuỗi ký tự std::string, thư viện cctype, thao tác cắt ghép, chuẩn hóa văn bản, mật mã Caesar và số nguyên lớn của Module 6 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 90,
            isFree: true,
            orderIndex: 4,
            chapterId: chapter6.id,
            content: `# Bài tập thực hành tổng hợp Module 6: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 6: Xử lý Chuỗi Ký tự (std::string) và Văn bản**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài làm chủ thao tác duyệt chuỗi, phân loại ký tự (cctype), biến đổi hoa thường, đảo ngược chuỗi hai con trỏ, tìm kiếm và thay thế ký tự.
* ⚔️ **Trung bình (Medium):** 10 bài đếm từ, chuẩn hóa họ tên, đếm tần suất theo thứ tự xuất hiện, tìm chuỗi con, đảo từ, tách chuỗi theo delimiter và nén/giải nén Run-Length Encoding.
* 👑 **Khó / Thử thách (Hard):** 10 bài giải thuật chuỗi nâng cao: Palindrome mở rộng, Mật mã Caesar, Cộng & Trừ số nguyên lớn (BigInt), Cửa sổ trượt chuỗi con không lặp, Xâu con đối xứng dài nhất, xóa cặp ký tự liền kề và kiểm tra dãy ngoặc hợp lệ.

Chúc bạn hoàn thành xuất sắc toàn bộ thử thách!`
        },
        create: {
            id: 'c1b10000-0006-4000-8000-000000000001',
            lessonId: 'CPP-06.MP',
            title: 'Bài tập thực hành tổng hợp Module 6: Xử lý Chuỗi Ký tự (std::string) và Văn bản',
            objective: 'Hệ thống 30 bài tập rèn luyện chuyên sâu (Dễ, Trung bình, Khó) bao quát toàn bộ kiến thức xử lý chuỗi ký tự std::string, thư viện cctype, thao tác cắt ghép, chuẩn hóa văn bản, mật mã Caesar và số nguyên lớn của Module 6 C++.',
            difficulty: 'MEDIUM',
            durationMinutes: 90,
            isFree: true,
            orderIndex: 4,
            chapterId: chapter6.id,
            content: `# Bài tập thực hành tổng hợp Module 6: C++ Cơ bản

Chào mừng bạn đến với phòng thực hành tổng hợp của **Module 6: Xử lý Chuỗi Ký tự (std::string) và Văn bản**.

Bộ bài tập gồm **30 bài toán thực tế** được phân bổ theo 3 cấp độ:
* 🛡️ **Dễ (Easy):** 10 bài làm chủ thao tác duyệt chuỗi, phân loại ký tự (cctype), biến đổi hoa thường, đảo ngược chuỗi hai con trỏ, tìm kiếm và thay thế ký tự.
* ⚔️ **Trung bình (Medium):** 10 bài đếm từ, chuẩn hóa họ tên, đếm tần suất theo thứ tự xuất hiện, tìm chuỗi con, đảo từ, tách chuỗi theo delimiter và nén/giải nén Run-Length Encoding.
* 👑 **Khó / Thử thách (Hard):** 10 bài giải thuật chuỗi nâng cao: Palindrome mở rộng, Mật mã Caesar, Cộng & Trừ số nguyên lớn (BigInt), Cửa sổ trượt chuỗi con không lặp, Xâu con đối xứng dài nhất, xóa cặp ký tự liền kề và kiểm tra dãy ngoặc hợp lệ.

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

    console.log(`\n🎉 THÀNH CÔNG! Đã cập nhật xong ${successCount} bài tập thực hành Module 6 C++ lên Database!`);
}

seedCppModule6Practice()
    .catch((err) => {
        console.error('❌ Lỗi khi cập nhật bài tập Module 6 C++:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
