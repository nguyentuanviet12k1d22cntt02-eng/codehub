---
lessonId: "CPP-04.01"
title: "Cấu trúc Hàm (Function), Tham số và Giá trị trả về"
difficulty: "EASY"
estimatedDuration: 20
keywords: ["function", "parameters", "return type", "modular programming"]
prerequisites: ["CPP-03.01"]
---

# Cấu trúc Hàm (Function), Tham số và Giá trị trả về

## 1. Khái niệm cốt lõi

Khi một chương trình ngày càng lớn, nếu viết toàn bộ code vào trong hàm `main()`, mã nguồn sẽ trở nên lộn xộn, khó hiểu và khó sửa lỗi.

**Hàm (Function)** là một khối lệnh được đặt tên độc lập để thực hiện một nhiệm vụ chuyên biệt. Thay vì viết lại cùng một đoạn code nhiều lần, ta chỉ cần gọi tên hàm bất cứ khi nào cần tái sử dụng.

| Thành phần của Hàm | Ý nghĩa thực tế |
| :--- | :--- |
| **Kiểu trả về (Return Type)** | Loại dữ liệu hàm trả về sau khi tính xong (`int`, `double`, `bool`... hoặc `void` nếu không trả về gì). |
| **Tên hàm (Function Name)** | Tên gọi đại diện cho hành động (thường là động từ, ví dụ: `tinhTong`, `kiemTraNguyenTo`). |
| **Tham số (Parameters)** | Dữ liệu đầu vào cần cung cấp để hàm làm việc. |
| **Từ khóa `return`** | Kết thúc hàm và mang kết quả trả về cho nơi đã gọi nó. |

## 2. Cú pháp & Quy tắc hoạt động

### Cú pháp định nghĩa hàm:
```cpp
kiểu_trả_về tên_hàm(tham_số_1, tham_số_2) {
    // Thân hàm: các câu lệnh xử lý
    return giá_trị; // (nếu kiểu trả về khác void)
}
```

### Sơ đồ hoạt động của lời gọi hàm:
```text
[ Hàm main() đang chạy ]
           │
           ▼ (Gặp lời gọi: tinhTong(3, 5))
[ Tạm dừng main ──► Nhảy sang thực thi hàm tinhTong ]
                             │
                             ▼
                     [ Tính toán: 3 + 5 = 8 ]
                             │
                             ▼ (return 8)
[ Quay trở về main ──► Nhận giá trị 8 tiếp tục chạy ]
```

## 3. Ví dụ minh họa tinh gọn

### Ví dụ 1: Hàm có giá trị trả về
```cpp
int tinhTong(int a, int b) {
    return a + b; // Trả về tổng hai số
}

// Cách gọi hàm:
int ketQua = tinhTong(5, 7); // ketQua nhận giá trị 12
```

### Ví dụ 2: Hàm kiểu `void` (chỉ thực hiện hành động, không trả về giá trị)
```cpp
void inLoiChao(std::string ten) {
    std::cout << "Xin chao ban: " << ten << '
';
}

// Cách gọi hàm:
inLoiChao("Nam");
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Quên từ khóa `return` ở hàm có kiểu trả về khác `void`**
> * *Hậu quả:* Trình biên dịch cảnh báo lỗi, hàm trả về một giá trị rác ngẫu nhiên.
> * *Quy tắc:* Nếu hàm khai báo kiểu `int`, `double`, `bool`... thì ở mọi nhánh rẽ nhánh trong thân hàm đều bắt buộc phải có lệnh `return`.

> [!WARNING]
> **2. Định nghĩa hàm phía dưới `main()` mà không khai báo nguyên mẫu (Prototype)**
> * *Nguyên nhân:* Trình biên dịch C++ đọc từ trên xuống dưới. Nếu gọi một hàm trước khi định nghĩa nó, trình biên dịch sẽ báo lỗi hàm chưa được khai báo.
> * *Cách sửa:* Luôn viết định nghĩa hàm ở **phía trên** hàm `main()`.

## 5. Ghi nhớ trọng tâm

- Hàm giúp chia nhỏ chương trình thành các khối chức năng độc lập, dễ quản lý và tái sử dụng.
- Dùng `void` khi hàm chỉ in ấn hoặc thực hiện hành động mà không cần trả về kết quả tính toán.
- Lệnh `return` sẽ lập tức kết thúc hàm và trả quyền điều khiển về nơi gọi nó.
