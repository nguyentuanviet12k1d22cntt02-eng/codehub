# Hệ Thống Bài Tập Thực Hành C++ Cơ Bản - Module 06 (Cấp Độ: Dễ / Easy)

---

### Bài 1: Đếm Số Lượng Ký Tự Phân Loại Trong Chuỗi (countCharacterTypes)
* **Mục tiêu:** Nắm vững cách duyệt chuỗi ký tự và sử dụng các hàm kiểm tra trong thư viện `<cctype>` (`isupper`, `islower`, `isdigit`).
* **Mô tả:** Nhập vào một dòng văn bản S (độ dài không quá 1000 ký tự, có thể chứa dấu cách). Hãy đếm và in ra số lượng chữ cái in hoa, số lượng chữ cái in thường, số lượng chữ số và số lượng ký tự khác (bao gồm khoảng trắng và ký tự đặc biệt) trên cùng một dòng, cách nhau bởi một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi ký tự S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** In ra 4 số nguyên cách nhau một khoảng trắng theo thứ tự: Số chữ in hoa, Số chữ in thường, Số chữ số, Số ký tự khác.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
Xin Chao 2026!
```

**Khung Đầu ra (Output):**
```text
2 5 4 3
```

**Giải thích chi tiết:**
* Chữ in hoa: 'X', 'C' (tổng cộng 2).
* Chữ in thường: 'i', 'n', 'h', 'a', 'o' (tổng cộng 5).
* Chữ số: '2', '0', '2', '6' (tổng cộng 4).
* Ký tự khác: 2 dấu cách và 1 dấu chấm than '!' (tổng cộng 3).

---

### Bài 2: Chuyển Đổi Toàn Bộ Chuỗi Sang Chữ In Hoa (toUpperString)
* **Mục tiêu:** Làm chủ kỹ thuật duyệt chuỗi bằng tham chiếu và hàm `toupper()`.
* **Mô tả:** Nhập vào một dòng văn bản S có thể chứa khoảng trắng. Hãy chuyển toàn bộ các chữ cái thường trong chuỗi S thành chữ cái in hoa, các ký tự số và ký tự đặc biệt giữ nguyên. In chuỗi kết quả ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** Chuỗi S sau khi đã được chuyển đổi toàn bộ sang chữ hoa.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
lap trinh c++ 2026
```

**Khung Đầu ra (Output):**
```text
LAP TRINH C++ 2026
```

**Giải thích chi tiết:**
* Tất cả các chữ cái 'l', 'a', 'p', 't', 'r', 'i', 'n', 'h', 'c' đều được biến đổi thành chữ in hoa tương ứng. Các ký tự '+', số và khoảng trắng giữ nguyên.

---

### Bài 3: Chuyển Đổi Toàn Bộ Chuỗi Sang Chữ In Thường (toLowerString)
* **Mục tiêu:** Làm chủ kỹ thuật duyệt chuỗi bằng tham chiếu và hàm `tolower()`.
* **Mô tả:** Nhập vào một dòng văn bản S có thể chứa khoảng trắng. Hãy chuyển toàn bộ các chữ cái in hoa trong chuỗi S thành chữ cái in thường, các ký tự khác giữ nguyên. In chuỗi kết quả ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** Chuỗi S sau khi đã được chuyển đổi toàn bộ sang chữ thường.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
HELLO World C++!
```

**Khung Đầu ra (Output):**
```text
hello world c++!
```

**Giải thích chi tiết:**
* Các chữ 'H', 'E', 'L', 'L', 'O', 'W', 'C' được chuyển thành 'h', 'e', 'l', 'l', 'o', 'w', 'c'.

---

### Bài 4: Đảo Ngược Chuỗi Ký Tự Bằng Hai Con Trỏ (reverseStringTwoPointers)
* **Mục tiêu:** Rèn luyện tư duy thao tác chỉ số chuỗi in-place và kỹ thuật hai con trỏ (Two Pointers) trên `std::string`.
* **Mô tả:** Nhập vào một dòng văn bản S. Hãy đảo ngược chuỗi S ngay tại chỗ bằng cách hoán đổi ký tự đối xứng ở hai đầu (dùng hai chỉ số trái và phải di chuyển dần vào giữa, không dùng hàm `std::reverse` có sẵn). In chuỗi sau khi đảo ngược.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** Chuỗi S sau khi đã được đảo ngược.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
Antigravity
```

**Khung Đầu ra (Output):**
```text
ytivargitnA
```

**Giải thích chi tiết:**
* Ký tự đầu 'A' đổi chỗ cho ký tự cuối 'y', 'n' đổi cho 't', tiếp tục cho đến khi hai chỉ số gặp nhau ở giữa.

---

### Bài 5: Kiểm Tra Chuỗi Đối Xứng Đơn Giản (isSimplePalindrome)
* **Mục tiêu:** Nắm vững khái niệm xâu đối xứng (Palindrome) và kiểm tra bằng vòng lặp so khớp đối xứng.
* **Mô tả:** Nhập vào một từ S không chứa dấu cách (chỉ gồm các ký tự liền nhau). Hãy kiểm tra xem S có phải là chuỗi đối xứng hay không (đọc xuôi hay đọc ngược đều giống hệt nhau). In ra `YES` nếu đúng, ngược lại in ra `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi ký tự S không có khoảng trắng (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** In `YES` nếu là chuỗi đối xứng, ngược lại in `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
radar
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* Chuỗi "radar" đọc xuôi hay ngược đều là "radar" nên in ra `YES`. Nếu chuỗi là "hello" thì in `NO`.

---

### Bài 6: Đếm Số Lượng Nguyên Âm và Phụ Âm (countVowelsAndConsonants)
* **Mục tiêu:** Kết hợp kiểm tra chữ cái `isalpha` và đối sánh tập hợp nguyên âm tiếng Anh ('a', 'e', 'i', 'o', 'u').
* **Mô tả:** Nhập vào một chuỗi ký tự S. Hãy đếm số lượng chữ cái nguyên âm và số lượng chữ cái phụ âm trong chuỗi S (không phân biệt chữ hoa hay chữ thường). Chú ý: Các ký tự không phải chữ cái (như số, khoảng trắng, dấu câu) thì bỏ qua không tính vào nguyên âm hay phụ âm.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** In ra 2 số nguyên cách nhau một khoảng trắng: Số lượng nguyên âm và Số lượng phụ âm.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
C++ Programming 2026
```

**Khung Đầu ra (Output):**
```text
3 11
```

**Giải thích chi tiết:**
* Các chữ cái trong "Programming": 'o', 'a', 'i' là 3 nguyên âm.
* Các phụ âm gồm: 'C', 'P', 'r', 'g', 'r', 'm', 'm', 'n', 'g' (tổng cộng 11 phụ âm).

---

### Bài 7: Tìm Vị Trí Xuất Hiện Đầu Tiên và Cuối Cùng Của Ký Tự (findFirstLastChar)
* **Mục tiêu:** Áp dụng phương thức `.find()` và `.rfind()` hoặc duyệt mảng tìm vị trí chỉ số (0-based index).
* **Mô tả:** Dòng thứ nhất nhập vào một chuỗi ký tự S. Dòng thứ hai nhập một ký tự C. Hãy tìm vị trí chỉ số (tính từ 0) xuất hiện lần đầu tiên và lần cuối cùng của ký tự C trong chuỗi S. Nếu ký tự C không xuất hiện trong chuỗi, in ra `-1`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Chuỗi S (1 <= độ dài S <= 1000).
  * Dòng 2: Ký tự C cần tìm kiếm.
* **Đầu ra (Output):** In ra 2 số nguyên cách nhau một khoảng trắng biểu diễn chỉ số đầu tiên và chỉ số cuối cùng. Nếu không tìm thấy, in ra một số duy nhất là `-1`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
lap trinh c++ ngon ngu lap trinh
l
```

**Khung Đầu ra (Output):**
```text
0 23
```

**Giải thích chi tiết:**
* Ký tự 'l' xuất hiện lần đầu tiên tại vị trí index 0 (từ "lap" đầu tiên).
* Ký tự 'l' xuất hiện lần cuối tại vị trí index 23 (từ "lap" thứ hai).

---

### Bài 8: Xóa Toàn Bộ Khoảng Trắng Trong Chuỗi (removeAllSpaces)
* **Mục tiêu:** Rèn luyện kỹ thuật tạo chuỗi kết quả mới hoặc xóa ký tự lọc điều kiện.
* **Mô tả:** Nhập vào một dòng văn bản S có chứa nhiều khoảng trắng (dấu cách). Hãy loại bỏ toàn bộ các dấu cách trong chuỗi và in ra chuỗi liền mạch kết quả.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** Chuỗi ký tự sau khi đã bỏ hết mọi dấu cách.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
 C o d e   H u b   2 0 2 6 
```

**Khung Đầu ra (Output):**
```text
CodeHub2026
```

**Giải thích chi tiết:**
* Tất cả các ký tự khoảng trắng ở đầu, giữa và cuối chuỗi đều bị loại bỏ, chỉ giữ lại các ký tự khác khoảng trắng theo đúng thứ tự.

---

### Bài 9: Thay Thế Ký Tự Trong Chuỗi (replaceCharacter)
* **Mục tiêu:** Thao tác sửa đổi trực tiếp ký tự chuỗi bằng toán tử chỉ số `s[i]` hoặc phương thức chuỗi.
* **Mô tả:** Dòng 1 nhập chuỗi ký tự S. Dòng 2 nhập hai ký tự c1 và c2 cách nhau một khoảng trắng. Hãy thay thế toàn bộ các ký tự c1 trong chuỗi S bằng ký tự c2 và in chuỗi sau khi thay thế ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Chuỗi S (1 <= độ dài S <= 1000).
  * Dòng 2: Hai ký tự c1 và c2 cách nhau một khoảng trắng.
* **Đầu ra (Output):** Chuỗi S sau khi đã thay thế mọi ký tự c1 thành c2.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
banana
a o
```

**Khung Đầu ra (Output):**
```text
bonono
```

**Giải thích chi tiết:**
* Tất cả các ký tự 'a' trong từ "banana" được thay thế bằng ký tự 'o', kết quả tạo thành "bonono".

---

### Bài 10: Ghép Đan Xen Ký Tự Hai Chuỗi (interleaveTwoStrings)
* **Mục tiêu:** Làm quen với việc xử lý đồng thời hai chuỗi bằng vòng lặp và phương thức `.push_back()`.
* **Mô tả:** Nhập vào hai chuỗi ký tự S1 và S2 trên hai dòng riêng biệt (không chứa dấu cách). Hãy tạo ra một chuỗi mới bằng cách ghép đan xen lần lượt một ký tự của S1 rồi đến một ký tự của S2. Nếu một trong hai chuỗi dài hơn chuỗi kia, phần ký tự dư thừa còn lại sẽ được nối toàn bộ vào phía sau chuỗi kết quả.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Chuỗi ký tự S1 (1 <= độ dài S1 <= 1000).
  * Dòng 2: Chuỗi ký tự S2 (1 <= độ dài S2 <= 1000).
* **Đầu ra (Output):** Chuỗi mới sau khi đã ghép đan xen.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
abc
12345
```

**Khung Đầu ra (Output):**
```text
a1b2c345
```

**Giải thích chi tiết:**
* Lần lượt lấy: S1[0] ('a'), S2[0] ('1'), S1[1] ('b'), S2[1] ('2'), S1[2] ('c'), S2[2] ('3'). Chuỗi S1 hết ký tự, chuỗi S2 còn lại "45" được nối tiếp vào cuối tạo thành "a1b2c345".
