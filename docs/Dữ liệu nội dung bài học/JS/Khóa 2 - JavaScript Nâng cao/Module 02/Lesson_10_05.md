---
lessonId: JS2-10.05
title: "Cấu trúc dữ liệu Set và Map trong JavaScript ES6"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["Set", "Map", "Unique values", "Key-Value Collection", "ES6 Data Structures"]
prerequisites: ["JS2-10.04"]
---

# Cấu trúc dữ liệu Set và Map trong JavaScript ES6

## 1. Khái niệm & Vấn đề thực tế
Trước ES6, JavaScript chỉ có Array và Object.
- Nhược điểm của Object khi làm từ điển (dictionary): chỉ cho phép khóa (key) là `string` hoặc `symbol`.
- Nhược điểm của Array: cho phép trùng lặp, việc lọc các phần tử trùng tốn $O(N^2)$ nếu dùng lồng vòng lặp.

ES6 bổ sung hai cấu trúc dữ liệu chuẩn mực:
1. **`Set`**: Tập hợp các phần tử **duy nhất** (không bao giờ chứa giá trị trùng lặp).
2. **`Map`**: Cấu trúc cặp `[key, value]` cho phép **mọi kiểu dữ liệu** (kể cả object, hàm, số) làm key.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **Tập hợp `Set`**:
  ```javascript
  const uniqueNums = new Set([1, 2, 2, 3, 3, 4]); // Set(4) {1, 2, 3, 4}
  uniqueNums.add(5);
  uniqueNums.has(3); // true
  console.log(uniqueNums.size); // 5

  // Kỹ thuật kinh điển: Lọc trùng lặp mảng chỉ với 1 dòng mã
  const cleanArr = [...new Set(duplicatedArr)];
  ```
- **Từ điển `Map`**:
  ```javascript
  const map = new Map();
  map.set("name", "Nam");
  map.set(101, "Mã phòng thi"); // Số làm key!
  console.log(map.get(101));    // "Mã phòng thi"
  console.log(map.has("name")); // true
  ```

---

## 3. Ví dụ trực quan: Đếm tần suất xuất hiện với Map

```javascript
const words = ["js", "python", "js", "cpp", "js"];
const counter = new Map();

for (const w of words) {
    const currentCount = counter.get(w) ?? 0;
    counter.set(w, currentCount + 1);
}

console.log("Số lần xuất hiện của js:", counter.get("js")); // 3
```

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **So sánh object trong Set/Map**: Hai object độc lập `{ id: 1 }` và `{ id: 1 }` có địa chỉ tham chiếu khác nhau nên Set vẫn coi là 2 phần tử khác biệt.
- **Dùng thuộc tính `.size` thay vì `.length`**: Cả `Set` và `Map` đều sử dụng thuộc tính `.size` để đo số lượng phần tử.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. Dùng `new Set(arr)` để loại bỏ mọi phần tử trùng lặp.
2. Dùng `new Map()` khi cần lưu key-value có kiểu key đặc biệt hoặc cần bảo toàn thứ tự thêm vào.
3. Cả hai đều có phương thức `.add()` / `.set()`, `.has()`, `.delete()`, `.size`.
