---
lessonId: JS2-14.01
title: "Hệ thống mô-đun: CommonJS (require) vs ES Modules (import/export)"
difficulty: "Trung bình"
estimatedDuration: "25 phút"
keywords: ["CommonJS", "ES Modules", "require", "module.exports", "import", "export"]
prerequisites: ["JS2-13.04"]
---

# Hệ thống mô-đun: CommonJS (require) vs ES Modules (import/export)

## 1. Khái niệm & Vấn đề thực tế
Khi dự án phát triển từ vài chục dòng lên hàng nghìn dòng, việc nhồi nhét tất cả mã nguồn vào một file duy nhất sẽ dẫn đến thảm họa bảo trì. **Module hóa (Modularization)** là kỹ thuật chia nhỏ chương trình thành các file độc lập, mỗi file đảm nhận một chức năng duy nhất.

Hai hệ thống mô-đun chủ đạo:
1. **CommonJS (CJS)**: Chuẩn truyền thống của Node.js, sử dụng `require()` và `module.exports`.
2. **ES Modules (ESM)**: Chuẩn chính thức của ECMAScript từ ES6, sử dụng cú pháp `import` và `export`.

---

## 2. Cú pháp & Quy tắc cốt lõi
- **CommonJS (CJS)**:
  ```javascript
  // mathUtils.js
  const add = (a, b) => a + b;
  module.exports = { add };

  // main.js
  const { add } = require('./mathUtils');
  ```
- **ES Modules (ESM)**:
  ```javascript
  // mathUtils.mjs
  export const add = (a, b) => a + b;

  // main.mjs
  import { add } from './mathUtils.mjs';
  ```

---

## 3. So sánh đối chiếu kỹ thuật
| Tiêu chí | CommonJS (CJS) | ES Modules (ESM) |
| :--- | :--- | :--- |
| **Cú pháp** | `require()` / `module.exports` | `import` / `export` |
| **Thời điểm tải** | Động tại Runtime (Synchronous) | Tĩnh tại Compile time (Static/Async) |
| **Tree Shaking** | Khó tối ưu hóa | Hỗ trợ loại bỏ mã chết tuyệt vời |
| **Môi trường** | Mặc định Node.js cổ điển | Chuẩn Modern JS, Browser & Node hiện đại |

---

## 4. Cạm bẫy thường gặp & Thực hành tốt nhất
- **Trộn lẫn CJS và ESM**: Không thể dùng `import` bên trong file CommonJS mà chưa cấu hình `"type": "module"` trong `package.json`.

---

## 5. Tóm tắt ghi nhớ & Checklist tự đánh giá
1. CJS dùng `require` / `module.exports`.
2. ESM dùng `import` / `export` - là tiêu chuẩn cho tương lai.
