# Hệ Thống Bài Tập Thực Hành C++ Cơ Bản - Module 06 (Cấp Độ: Trung Bình / Medium)

---

### Bài 11: Đếm Số Lượng Từ Trong Chuỗi Văn Bản (countWordsInSentence)
* **Mục tiêu:** Rèn luyện kỹ thuật tách từ cơ bản bằng `std::stringstream` hoặc duyệt trạng thái ký tự khoảng trắng.
* **Mô tả:** Nhập vào một dòng văn bản S có thể chứa nhiều khoảng trắng thừa ở đầu, ở cuối hoặc giữa các từ liên tiếp nhau. Hãy đếm xem câu văn bản đó chứa bao nhiêu từ hợp lệ (mỗi từ là một chuỗi các ký tự liền nhau không chứa khoảng trắng).

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng văn bản S (độ dài không quá 1000 ký tự).
* **Đầu ra (Output):** In ra một số nguyên duy nhất là số lượng từ có trong câu văn bản S.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
   Hoc   lap  trinh    C++   nang cao   
```

**Khung Đầu ra (Output):**
```text
5
```

**Giải thích chi tiết:**
* Các từ tìm được lần lượt là: "Hoc", "lap", "trinh", "C++", "nang", "cao" (tổng cộng 5 từ). Khoảng trắng thừa ở hai đầu và giữa các từ không được tính là từ.

---

### Bài 12: Chuẩn Hóa Chuỗi Họ Tên Người Dùng (normalizePersonName)
* **Mục tiêu:** Kết hợp xử lý tách từ, biến đổi chữ hoa chữ thường và ghép chuỗi chuẩn định dạng.
* **Mô tả:** Nhập vào một chuỗi họ và tên bị gõ sai quy cách (chứa dấu cách thừa ở đầu, cuối, giữa các từ, chữ hoa chữ thường lộn xộn). Hãy chuẩn hóa chuỗi theo quy tắc:
  * Loại bỏ hoàn toàn khoảng trắng thừa ở đầu và cuối chuỗi.
  * Giữa mỗi từ chỉ cách nhau đúng một khoảng trắng.
  * Ký tự đầu tiên của mỗi từ phải viết in hoa, các ký tự còn lại của từ viết in thường.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng chứa chuỗi họ tên S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** Chuỗi họ tên sau khi đã chuẩn hóa.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
  ngUYEn   vAN   aN  
```

**Khung Đầu ra (Output):**
```text
Nguyen Van An
```

**Giải thích chi tiết:**
* Các từ "ngUYEn", "vAN", "aN" được chuẩn hóa thành "Nguyen", "Van", "An" và ghép lại cách nhau đúng 1 dấu cách.

---

### Bài 13: Đếm Tần Suất Ký Tự và In Theo Thứ Tự Xuất Hiện (charFrequencyInOrder)
* **Mục tiêu:** Nắm vững cấu trúc mảng đếm tần suất kết hợp chuỗi để theo dõi thứ tự xuất hiện đầu tiên của ký tự.
* **Mô tả:** Nhập vào một chuỗi ký tự S gồm các chữ cái và chữ số (không chứa dấu cách). Hãy đếm số lần xuất hiện của từng ký tự trong chuỗi S. In ra mỗi ký tự kèm theo số lần xuất hiện của nó (cách nhau bởi dấu hai chấm và khoảng trắng `: `), theo đúng thứ tự xuất hiện đầu tiên của ký tự đó trong chuỗi, mỗi ký tự trên một dòng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** Mỗi dòng in ra một ký tự kèm tần suất theo định dạng `Ký_tự: Số_lần`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
programming
```

**Khung Đầu ra (Output):**
```text
p: 1
r: 2
o: 1
g: 2
a: 1
m: 2
i: 1
n: 1
```

**Giải thích chi tiết:**
* Ký tự 'p' xuất hiện 1 lần, 'r' xuất hiện 2 lần, 'o' 1 lần, 'g' 2 lần, 'a' 1 lần, 'm' 2 lần, 'i' 1 lần, 'n' 1 lần. Thứ tự in ra hoàn toàn trùng khớp với thời điểm ký tự đó lần đầu tiên xuất hiện trong "programming".

---

### Bài 14: Tìm Từ Dài Nhất và Ngắn Nhất Trong Câu (findLongestShortestWord)
* **Mục tiêu:** Duyệt danh sách các từ trong chuỗi và so sánh độ dài `.length()` để tìm giá trị cực đại và cực tiểu.
* **Mô tả:** Nhập vào một dòng văn bản S gồm nhiều từ cách nhau bởi khoảng trắng. Hãy tìm và in ra từ có độ dài dài nhất và từ có độ dài ngắn nhất trong câu. Nếu có nhiều từ cùng độ dài dài nhất (hoặc ngắn nhất), hãy chọn từ xuất hiện đầu tiên trong câu.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng chứa chuỗi văn bản S (chứa ít nhất 1 từ, 1 <= độ dài S <= 1000).
* **Đầu ra (Output):** In ra 2 dòng:
  * Dòng 1: Từ dài nhất tìm được.
  * Dòng 2: Từ ngắn nhất tìm được.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
hoc lap trinh ngon ngu cplusplus
```

**Khung Đầu ra (Output):**
```text
cplusplus
hoc
```

**Giải thích chi tiết:**
* Từ dài nhất là "cplusplus" (10 ký tự). Từ ngắn nhất là "hoc" và "ngu" (3 ký tự), nhưng "hoc" xuất hiện trước nên được chọn.

---

### Bài 15: Tìm Kiếm Chuỗi Con và Vị Trí Xuất Hiện (subStringSearch)
* **Mục tiêu:** Sử dụng phương thức `s.find()` và xử lý trường hợp không tìm thấy bằng hằng số `std::string::npos`.
* **Mô tả:** Nhập vào hai chuỗi S1 và S2 (mỗi chuỗi trên một dòng). Hãy kiểm tra xem S2 có phải là chuỗi con xuất hiện liên tiếp trong S1 hay không. Nếu có, hãy in ra chỉ số (0-based index) của vị trí bắt đầu xuất hiện đầu tiên của S2 trong S1. Nếu không tìm thấy, in ra `-1`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Chuỗi mẹ S1 (1 <= độ dài S1 <= 1000).
  * Dòng 2: Chuỗi con S2 (1 <= độ dài S2 <= 1000).
* **Đầu ra (Output):** Chỉ số đầu tiên tìm thấy hoặc `-1` nếu không có.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
Chao mung ban den voi CodeHub
CodeHub
```

**Khung Đầu ra (Output):**
```text
23
```

**Giải thích chi tiết:**
* Từ "CodeHub" bắt đầu xuất hiện tại chỉ số vị trí thứ 23 trong chuỗi S1.

---

### Bài 16: Kiểm Tra Hai Chuỗi Đảo Chữ Anagram (checkValidAnagram)
* **Mục tiêu:** Áp dụng mảng đếm tần suất 26 chữ cái hoặc phương pháp sắp xếp chuỗi để kiểm tra tính toàn vẹn ký tự.
* **Mô tả:** Hai chuỗi được gọi là Anagram (đảo chữ của nhau) nếu chúng chứa các ký tự giống hệt nhau với cùng số lượng tần suất, chỉ khác nhau về thứ tự sắp xếp. Cho hai chuỗi S1 và S2 chỉ gồm các chữ cái in thường tiếng Anh. Hãy kiểm tra xem S1 và S2 có phải là Anagram của nhau không. In ra `YES` nếu phải, ngược lại in ra `NO`.

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Chuỗi ký tự S1.
  * Dòng 2: Chuỗi ký tự S2.
* **Đầu ra (Output):** In `YES` nếu hai chuỗi là Anagram của nhau, ngược lại in `NO`.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
listen
silent
```

**Khung Đầu ra (Output):**
```text
YES
```

**Giải thích chi tiết:**
* Cả hai từ "listen" và "silent" đều cấu tạo từ các chữ cái: 1 chữ 'e', 1 chữ 'i', 1 chữ 'l', 1 chữ 'n', 1 chữ 's', 1 chữ 't'. Số lượng và thành phần hoàn toàn giống nhau nên là Anagram.

---

### Bài 17: Đảo Ngược Thứ Tự Các Từ Trong Câu (reverseWordsInSentence)
* **Mục tiêu:** Tách chuỗi thành danh sách các từ (bằng `vector<string>`) và duyệt ngược để tái tạo câu.
* **Mô tả:** Nhập vào một câu văn bản S gồm các từ cách nhau bởi khoảng trắng. Hãy in ra một câu mới trong đó thứ tự các từ bị đảo ngược hoàn toàn (từ cuối cùng chuyển lên đầu tiên, từ kế cuối đứng thứ hai, ..., từ đầu tiên đứng cuối cùng). Giữa các từ trong câu mới chỉ cách nhau đúng một khoảng trắng.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng chứa câu văn bản S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** Câu văn bản sau khi đã đảo ngược thứ tự các từ.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
lap trinh c++ rat vui va thu vi
```

**Khung Đầu ra (Output):**
```text
vi thu va vui rat c++ trinh lap
```

**Giải thích chi tiết:**
* Thứ tự các từ: "lap", "trinh", "c++", "rat", "vui", "va", "thu", "vi" được đảo ngược từ cuối lên đầu.

---

### Bài 18: Tách Chuỗi Theo Ký Tự Phân Cách (splitStringByDelimiter)
* **Mục tiêu:** Tự cài đặt thuật toán tách chuỗi (Split) với ký tự phân cách bất kỳ bằng `std::string::substr` hoặc `std::stringstream`.
* **Mô tả:** Dòng 1 nhập chuỗi ký tự S. Dòng 2 nhập một ký tự D đóng vai trò là dấu phân cách (delimiter). Hãy tách chuỗi S thành các đoạn con ngăn cách bởi ký tự D và in mỗi đoạn con trên một dòng riêng biệt. (Nếu giữa hai dấu phân cách liên tiếp không có ký tự nào thì bỏ qua hoặc in dòng trống, thông thường chỉ in các đoạn con có dữ liệu).

### Quy cách dữ liệu:
* **Đầu vào (Input):**
  * Dòng 1: Chuỗi S (1 <= độ dài S <= 1000).
  * Dòng 2: Ký tự phân cách D (ví dụ: dấu phẩy `,`, dấu gạch ngang `-`, dấu chấm phẩy `;`).
* **Đầu ra (Output):** Các chuỗi con sau khi tách, mỗi chuỗi con in trên một dòng riêng biệt (không in các phần rỗng).

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
apple,orange,banana,grape,mango
,
```

**Khung Đầu ra (Output):**
```text
apple
orange
banana
grape
mango
```

**Giải thích chi tiết:**
* Chuỗi được bẻ tách tại mỗi dấu phẩy `,` thành 5 loại trái cây riêng biệt.

---

### Bài 19: Nén Chuỗi Run-Length Encoding (compressRunLengthEncoding)
* **Mục tiêu:** Rèn luyện kỹ thuật duyệt nhóm ký tự liên tiếp và đếm số lượng lặp lại (thuật toán nén dữ liệu RLE cổ điển).
* **Mô tả:** Nhập vào chuỗi ký tự S gồm các chữ cái in thường. Hãy nén chuỗi theo quy tắc: Với mỗi đoạn ký tự liên tiếp giống nhau, thay thế đoạn đó bằng ký tự đại diện kèm theo số lần xuất hiện của nó. In chuỗi đã nén ra màn hình.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi S (1 <= độ dài S <= 1000, không chứa dấu cách).
* **Đầu ra (Output):** Chuỗi sau khi được nén theo giải thuật Run-Length.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
aaabbcccccdeee
```

**Khung Đầu ra (Output):**
```text
a3b2c5d1e3
```

**Giải thích chi tiết:**
* Ký tự 'a' lặp 3 lần -> "a3".
* Ký tự 'b' lặp 2 lần -> "b2".
* Ký tự 'c' lặp 5 lần -> "c5".
* Ký tự 'd' xuất hiện 1 lần -> "d1".
* Ký tự 'e' lặp 3 lần -> "e3". Ghép lại ta được "a3b2c5d1e3".

---

### Bài 20: Giải Mã Chuỗi Run-Length (decompressRunLengthEncoding)
* **Mục tiêu:** Kỹ thuật phân tích cú pháp (parsing) chuỗi xen kẽ chữ cái và số lượng để khôi phục dữ liệu gốc.
* **Mô tả:** Nhập vào một chuỗi đã nén S có định dạng gồm từng chữ cái theo sau bởi một số nguyên dương biểu thị số lần lặp lại của chữ cái đó (ví dụ: `a3b2c1`). Hãy giải mã và in ra chuỗi nguyên bản ban đầu. Biết rằng số lần lặp lại của mỗi ký tự là một số nguyên từ 1 đến 100.

### Quy cách dữ liệu:
* **Đầu vào (Input):** Một dòng duy nhất chứa chuỗi đã nén S (1 <= độ dài S <= 1000).
* **Đầu ra (Output):** Chuỗi nguyên bản sau khi giải nén hoàn chỉnh.

### Ví dụ minh họa:
**Khung Đầu vào (Input):**
```text
a3b2c5d1
```

**Khung Đầu ra (Output):**
```text
aaabbcccccd
```

**Giải thích chi tiết:**
* 'a' nhân 3 lần thành "aaa".
* 'b' nhân 2 lần thành "bb".
* 'c' nhân 5 lần thành "ccccc".
* 'd' nhân 1 lần thành "d". Nối lại thành "aaabbcccccd".
