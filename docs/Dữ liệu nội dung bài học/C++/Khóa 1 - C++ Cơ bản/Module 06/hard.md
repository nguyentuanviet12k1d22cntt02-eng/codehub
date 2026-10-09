# Hệ Thống Bài Tập Thực Hành C++ Cơ Bản - Module 06 (Cấp Độ: Khó / Hard)

---

### Bài 21: Kiểm Tra Chuỗi Đối Xứng Palindrome Mở Rộng (isAdvancedPalindrome)
* **Mục tiêu:** Sử dụng kỹ thuật hai con trỏ (Two Pointers) kết hợp lọc ký tự chữ và số (`isalnum`) và chuyển chữ thường (`tolower`).
* **Mô tả:** Nhập vào một dòng văn bản S có thể chứa khoảng trắng, chữ hoa, chữ thường và các dấu câu (như dấu phẩy, chấm, chấm than...). Hãy kiểm tra xem S có phải là một chuỗi đối xứng hay không, biết rằng khi kiểm tra ta chỉ quan tâm đến các chữ cái và chữ số (bỏ qua toàn bộ khoảng trắng và dấu câu) và không phân biệt chữ hoa hay chữ thường. In ra `YES` nếu đúng, ngược lại in ra `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** In `YES` nếu là chuỗi đối xứng mở rộng, ngược lại in `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
A man, a plan, a canal: Panama!
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* Sau khi loại bỏ khoảng trắng và dấu câu, chuyển toàn bộ về chữ thường, chuỗi trở thành: "amanaplanacanalpanama". Chuỗi này đọc xuôi và đọc ngược hoàn toàn giống nhau nên in ra `YES`.

---

### Bài 22: Mã Hóa Mật Mã Caesar Dịch Chuyển K Ký Tự (caesarCipherEncoding)
* **Mục tiêu:** Vận dụng phép toán đồng dư bảng mã ASCII (`(c - 'a' + k) % 26 + 'a'`) để mã hóa chuỗi an toàn.
* **Mô tả:** Mật mã Caesar là một trong những kỹ thuật mã hóa cổ điển đơn giản nhất, trong đó mỗi chữ cái trong văn bản gốc được thay thế bằng một chữ cái cách nó K vị trí trong bảng chữ cái tiếng Anh (vòng tròn từ 'z' quay lại 'a', hoặc 'Z' quay lại 'A'). Các ký tự không phải chữ cái (khoảng trắng, số, dấu câu) được giữ nguyên không thay đổi. Hãy viết chương trình nhập chuỗi S và số nguyên K (0 <= K <= 100), in ra chuỗi sau khi đã được mã hóa.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Chuỗi S cần mã hóa (1 <= độ dài S <= 1000).
  * Dòng 2: Số nguyên K (0 <= K <= 100).
* **Đầu ra (Output):** Chuỗi S sau khi mã hóa Caesar.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
Hello, World 2026!
3
```

**Khung Đầu ra (Output):**
```text
Khoor, Zruog 2026!
```

**Giải thích chi tiết:**
* Chữ 'H' dịch 3 vị trí thành 'K', 'e' thành 'h', 'l' thành 'o', 'o' thành 'r'. Chữ 'W' thành 'Z', v.v. Dấu phẩy, khoảng trắng, số và dấu chấm than được giữ nguyên.

---

### Bài 23: Cộng Hai Số Nguyên Lớn Bằng Chuỗi (bigIntegerAddition)
* **Mục tiêu:** Cài đặt thuật toán cộng số học từng chữ số kèm biến nhớ (carry) từ phải sang trái bằng `std::string` để giải quyết giới hạn kiểu `long long`.
* **Mô tả:** Nhập vào hai số nguyên dương lớn A và B dưới dạng chuỗi (mỗi số có thể dài tới 1000 chữ số, không thể chứa vừa trong các kiểu số nguyên thông thường của C++). Hãy tính và in ra chuỗi biểu diễn tổng của A và B.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Chuỗi A gồm các chữ số (1 <= độ dài A <= 1000).
  * Dòng 2: Chuỗi B gồm các chữ số (1 <= độ dài B <= 1000).
* **Đầu ra (Output):** Chuỗi biểu diễn tổng của A và B.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
99999999999999999999
1
```

**Khung Đầu ra (Output):**
```text
100000000000000000000
```

**Giải thích chi tiết:**
* Số thứ nhất có 20 chữ số 9, khi cộng thêm 1 ta được số 1 kèm 20 chữ số 0.

---

### Bài 24: Trừ Hai Số Nguyên Lớn Không Âm (bigIntegerSubtraction)
* **Mục tiêu:** Cài đặt thuật toán trừ hai số nguyên lớn từng chữ số kèm mượn (borrow) từ phải sang trái và xóa số 0 vô nghĩa ở đầu.
* **Mô tả:** Nhập vào hai số nguyên không âm A và B dưới dạng chuỗi (độ dài mỗi số tới 1000 chữ số), đảm bảo A >= B. Hãy tính và in ra hiệu A - B. Chuỗi kết quả không được chứa các số 0 thừa ở đầu (ngoại trừ trường hợp kết quả bằng đúng số 0).

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Chuỗi số A (1 <= độ dài A <= 1000).
  * Dòng 2: Chuỗi số B (1 <= độ dài B <= 1000, A >= B).
* **Đầu ra (Output):** Chuỗi biểu diễn hiệu A - B.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
100000000000000000000
1
```

**Khung Đầu ra (Output):**
```text
99999999999999999999
```

**Giải thích chi tiết:**
* Thực hiện phép trừ từng cột chữ số từ hàng đơn vị sang trái, mượn 1 khi chữ số của A nhỏ hơn chữ số tương ứng của B.

---

### Bài 25: Độ Dài Chuỗi Con Dài Nhất Không Chứa Ký Tự Trùng Lặp (lengthOfLongestUniqueSubstring)
* **Mục tiêu:** Áp dụng kỹ thuật Cửa sổ trượt (Sliding Window) kết hợp mảng lưu vị trí xuất hiện gần nhất của ký tự.
* **Mô tả:** Nhập vào một chuỗi ký tự S. Hãy tìm độ dài của chuỗi con liên tiếp dài nhất trong S sao cho không có bất kỳ ký tự nào bị lặp lại nhiều lần.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 10^5, chỉ gồm các ký tự in được trong bảng mã ASCII).
* **Đầu ra (Output):** Một số nguyên duy nhất là độ dài lớn nhất tìm được.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
abcabcbb
```

**Khung Đầu ra (Output):**
```text
3
```

**Giải thích chi tiết:**
* Các chuỗi con không lặp hợp lệ gồm "abc", "bca", "cab", tất cả đều có độ dài lớn nhất là 3.

---

### Bài 26: Tìm Độ Dài Xâu Con Đối Xứng Dài Nhất (longestPalindromicSubstringLength)
* **Mục tiêu:** Nắm vững giải thuật mở rộng từ tâm (Expand Around Center) để tìm chuỗi Palindrome có độ phức tạp thời gian O(N^2) và bộ nhớ O(1).
* **Mô tả:** Nhập vào một chuỗi ký tự S. Hãy tìm và in ra độ dài lớn nhất của một xâu con liên tiếp đối xứng (Palindromic Substring) có trong chuỗi S.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000, không chứa khoảng trắng).
* **Đầu ra (Output):** Một số nguyên là độ dài của xâu con đối xứng dài nhất.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
babad
```

**Khung Đầu ra (Output):**
```text
3
```

**Giải thích chi tiết:**
* Trong chuỗi "babad", xâu con đối xứng dài nhất là "bab" hoặc "aba", cả hai đều có độ dài bằng 3.

---

### Bài 27: Nhân Số Nguyên Lớn Với Số Nguyên Nhỏ (bigIntegerMultiplyByInt)
* **Mục tiêu:** Cài đặt thuật toán nhân chuỗi số lớn với một số nguyên nhỏ k (0 <= k <= 1000) với độ phức tạp tuyến tính O(N).
* **Mô tả:** Cho một số nguyên lớn A được biểu diễn bằng chuỗi (độ dài lên tới 1000 chữ số) và một số nguyên dương k (0 <= k <= 1000). Hãy tính và in ra chuỗi biểu diễn tích của A * k.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Chuỗi số lớn A.
  * Dòng 2: Số nguyên k (0 <= k <= 1000).
* **Đầu ra (Output):** Chuỗi kết quả biểu diễn tích A * k.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
123456789123456789
9
```

**Khung Đầu ra (Output):**
```text
1111111102111111101
```

**Giải thích chi tiết:**
* Nhân từng chữ số của A với 9 từ phải sang trái kèm biến nhớ `carry`.

---

### Bài 28: Đếm Số Lần Xuất Hiện Không Chồng Chéo Của Chuỗi Con (countNonOverlappingOccurrences)
* **Mục tiêu:** Rèn luyện việc ứng dụng phương thức `s.find(pat, start_pos)` với bước nhảy vị trí con trỏ tìm kiếm.
* **Mô tả:** Nhập vào hai chuỗi S và P trên hai dòng riêng biệt. Hãy đếm xem chuỗi mẫu P xuất hiện bao nhiêu lần trong chuỗi văn bản S theo quy tắc không chồng chéo (khi một mẫu P được tìm thấy, lần tìm kiếm tiếp theo sẽ bắt đầu ngay sau ký tự cuối cùng của mẫu vừa tìm được).

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Chuỗi văn bản S (1 <= độ dài S <= 1000).
  * Dòng 2: Chuỗi mẫu P (1 <= độ dài P <= độ dài S).
* **Đầu ra (Output):** Một số nguyên duy nhất là số lần xuất hiện không chồng chéo của P trong S.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
aaaaaa
aa
```

**Khung Đầu ra (Output):**
```text
3
```

**Giải thích chi tiết:**
* Chuỗi S có 6 chữ 'a'. Với mẫu P = "aa", ta ghép được 3 cặp "aa" không đè lên nhau (vị trí 0..1, 2..3, 4..5). Nếu tính chồng chéo sẽ là 5, nhưng theo quy tắc không chồng chéo kết quả là 3.

---

### Bài 29: Xóa Các Kặp Ký Tự Liền Kề Giống Nhau Đến Khi Tối Giản (removeAdjacentDuplicates)
* **Mục tiêu:** Mô phỏng ngăn xếp (Stack) bằng một đối tượng `std::string` kết hợp `.push_back()` và `.pop_back()` để tối ưu hóa bộ nhớ và thời gian O(N).
* **Mô tả:** Cho chuỗi ký tự S gồm các chữ cái in thường. Hãy liên tục xóa đi hai ký tự liền kề giống nhau cho đến khi không còn bất kỳ cặp ký tự liền kề nào giống nhau nữa. In ra chuỗi kết quả sau cùng. Nếu chuỗi bị xóa hết hoàn toàn, in ra `Empty`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 10^5).
* **Đầu ra (Output):** Chuỗi ký tự sau khi tối giản hoặc chữ `Empty` nếu chuỗi rỗng.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
abbaca
```

**Khung Đầu ra (Output):**
```text
ca
```

**Giải thích chi tiết:**
* Trong "abbaca", cặp "bb" bị xóa trước -> chuỗi còn "aaca".
* Trong "aaca", cặp "aa" liền kề tiếp tục bị xóa -> chuỗi còn lại "ca". Không còn cặp nào liền nhau giống nhau nữa, kết thúc.

---

### Bài 30: Kiểm Tra Tính Hợp Lệ Của Dãy Dấu Ngoặc (isValidParenthesesString)
* **Mục tiêu:** Áp dụng mô phỏng ngăn xếp bằng chuỗi `std::string` để giải quyết bài toán kinh điển về cấu trúc ngoặc lồng nhau `()`, `[]`, `{}`.
* **Mô tả:** Cho một chuỗi S chỉ gồm các ký tự mở ngoặc và đóng ngoặc: `(`, `)`, `[`, `]`, `{`, `}`. Một chuỗi ngoặc được gọi là hợp lệ nếu:
  1. Các dấu mở ngoặc phải được đóng bởi các dấu đóng ngoặc cùng loại.
  2. Các dấu mở ngoặc phải được đóng theo đúng thứ tự lồng nhau.
  Hãy in ra `YES` nếu chuỗi hợp lệ, ngược lại in ra `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi các dấu ngoặc S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** In `YES` nếu chuỗi ngoặc hợp lệ, ngược lại in `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
{[()]}
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* Dấu ngoặc tròn `()` nằm trọn trong ngoặc vuông `[]`, và cả cụm nằm trong ngoặc nhọn `{}` nên hợp lệ. Nếu chuỗi là `([)]` thì in `NO` vì thứ tự đóng mở bị đan chéo sai quy cách.
