---
lessonId: JS2-14.03
title: "Dự án Mini Console: Hệ thống quản lý thực thể sinh viên"
difficulty: "Khó"
estimatedDuration: "25 phút"
keywords: ["Mini Project", "CRUD in memory", "StudentManager", "OOP Integration"]
prerequisites: ["JS2-14.02"]
---

# Dự án Mini Console: Hệ thống quản lý thực thể sinh viên

## 1. Khái niệm & Vấn đề thực tế
Trong bài toán thực tế của các ứng dụng quản lý dữ liệu trong bộ nhớ (In-memory Store / Repository Pattern), ta cần xây dựng một lớp chuyên trách chịu trách nhiệm toàn bộ các thao tác:
- **C (Create)**: Thêm sinh viên mới.
- **R (Read)**: Tìm kiếm sinh viên theo mã định danh hoặc tính điểm trung bình toàn khóa.
- **U (Update)**: Cập nhật thông tin điểm.
- **D (Delete)**: Xóa sinh viên khỏi hệ thống.

---

## 2. Cấu trúc thiết kế hệ thống
- Lớp `Student`: Đại diện cho một đối tượng sinh viên đơn lẻ.
- Lớp `StudentManager`: Quản lý danh sách sinh viên nội bộ và cung cấp các phương thức nghiệp vụ.

---

## 3. Ví dụ trực quan

```javascript
class StudentManager {
    constructor() {
        this.students = [];
    }
    addStudent(id, name, score) {
        this.students.push({ id, name, score });
    }
    findStudent(id) {
        return this.students.find(s => s.id === id);
    }
    getAverageScore() {
        if (this.students.length === 0) return 0;
        const total = this.students.reduce((sum, s) => sum + s.score, 0);
        return total / this.students.length;
    }
}
```

---

## 4. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Đóng gói danh sách thực thể bên trong lớp quản lý.
2. Vận dụng `find()`, `filter()`, `reduce()` để xử lý nghiệp vụ nhanh chóng.
