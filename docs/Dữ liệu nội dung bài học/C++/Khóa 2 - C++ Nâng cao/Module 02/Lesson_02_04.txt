---
lessonId: "CPP2-02.04"
title: "Cấu trúc Danh sách Liên kết Tự cài đặt và std::forward_list"
difficulty: "HARD"
estimatedDuration: 25
keywords: ["linked list", "forward_list", "node", "pointer", "dynamic allocation"]
prerequisites: ["CPP2-01.02"]
---

# Cấu trúc Danh sách Liên kết Tự cài đặt và std::forward_list

## 1. Khái niệm cốt lõi

Trong khi mảng xếp các phần tử liên tiếp nhau trong RAM, **Danh sách liên kết (Linked List)** lưu các phần tử tại **các ô nhớ rời rạc bất kỳ**. 

Mỗi phần tử được gọi là một **Nút (Node)**, chứa 2 thông tin:
1. **Dữ liệu (Data):** Giá trị cần lưu.
2. **Con trỏ liên kết (Next):** Địa chỉ ô nhớ dẫn đến nút tiếp theo.

| Tiêu chí | Mảng (`vector`) | Danh sách liên kết (`list`) |
| :--- | :--- | :--- |
| **Bố trí RAM** | Liên tiếp nhau | Nằm rải rác |
| **Truy xuất theo chỉ số `a[i]`** | Tức thì $O(1)$ | Phải duyệt từ đầu $O(N)$ |
| **Chèn/Xóa tại đầu danh sách** | Chậm (phải dồn mảng) | **Tức thì $O(1)$** |

## 2. Cú pháp & Quy tắc hoạt động

### Minh họa chuỗi các nút (Nodes):
```text
[ Head ] ──► [ Data: 10 | Next ] ──► [ Data: 20 | Next ] ──► [ Data: 30 | nullptr ]
```

## 3. Ví dụ minh họa tinh gọn

### Cấu trúc một Node tự cài đặt:
```cpp
struct Node {
    int data;
    Node* next; // Con trỏ trỏ tới Node tiếp theo

    Node(int val) : data(val), next(nullptr) {}
};

// Tạo 2 Node nối với nhau
Node* head = new Node(10);
head->next = new Node(20);

// In dữ liệu Node thứ hai
std::cout << head->next->data; // In ra: 20
```

## 4. Lỗi học sinh hay gặp & Cách phòng tránh

> [!WARNING]
> **1. Mất dấu con trỏ đầu danh sách (Lost Head Pointer)**
> * *Hậu quả:* Nếu vô tình thay đổi `head = head->next` mà không lưu lại địa chỉ gốc, toàn bộ các node phía trước sẽ bị thất lạc trong bộ nhớ và gây rò rỉ bộ nhớ (Memory Leak).

## 5. Ghi nhớ trọng tâm

- Danh sách liên kết là tập hợp các nút rời rạc liên kết với nhau qua con trỏ.
- Ưu thế vượt trội khi chèn và xóa phần tử ở đầu danh sách ($O(1)$).
- Luôn giữ gìn con trỏ `head` cẩn thận để không bị mất kết nối danh sách.
