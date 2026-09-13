import psycopg2
import uuid
import sys
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

DATABASE_URL = "postgresql://postgres.jzipyxlyfmvltnspdarm:Viet.10092004%40@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

def main():
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cur = conn.cursor()

    # 1. Get Admin User ID
    cur.execute("SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1;")
    admin_row = cur.fetchone()
    if not admin_row:
        cur.execute("SELECT id FROM users LIMIT 1;")
        admin_row = cur.fetchone()
    admin_id = admin_row[0]
    print(f"👤 Using Admin ID: {admin_id}")

    # 2. Define Courses
    courses = [
        {
            "id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
            "title": "Lập trình JavaScript Nền tảng & Cấu trúc Dữ liệu (JavaScript Foundations)",
            "description": "Khóa học nhập môn lập trình JavaScript thuần chuẩn ES6+. Tập trung sâu vào bản chất ngôn ngữ, kiểu dữ liệu, toán tử, cấu trúc điều khiển, vòng lặp, hàm, kỹ thuật xử lý mảng và chuỗi chuyên sâu.",
            "level": "BASIC",
            "thumbnail_url": "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80",
            "status": "PUBLISHED",
            "created_by": admin_id
        },
        {
            "id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
            "title": "Lập trình JavaScript Nâng cao & Lập trình Hướng đối tượng (JavaScript Advanced & OOP)",
            "description": "Khóa học nâng cao về cơ chế lõi của JavaScript: Execution Context, Scope Chain, Closure, Prototype, con trỏ 'this', lập trình hướng đối tượng OOP với ES6 Classes, xử lý lỗi và thiết kế mô-đun sạch.",
            "level": "ADVANCED",
            "thumbnail_url": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80",
            "status": "PUBLISHED",
            "created_by": admin_id
        }
    ]

    for c in courses:
        cur.execute("""
            INSERT INTO courses (id, title, description, level, thumbnail_url, status, created_by, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                level = EXCLUDED.level,
                thumbnail_url = EXCLUDED.thumbnail_url,
                status = EXCLUDED.status,
                updated_at = NOW();
        """, (c["id"], c["title"], c["description"], c["level"], c["thumbnail_url"], c["status"], c["created_by"]))
        print(f"✅ Upserted Course: {c['title']} ({c['id']})")

    # 3. Define Modules & Chapters
    # Khóa 1: Modules 1 to 8
    # Khóa 2: Modules 9 to 14
    modules_data = [
        # KHÓA 1
        {
            "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
            "module_id": "JS1-MOD-01",
            "title": "Module 1: Làm quen với JavaScript & Khai báo biến",
            "objective": "Hiểu lịch sử ECMAScript, thiết lập tư duy ngôn ngữ, quy tắc câu lệnh, comment và làm chủ let, const, var.",
            "duration": "10 giờ",
            "order_index": 1,
            "chapter_id": "JS1-CH-01",
            "chapter_title": "Chương 1: Làm quen với JavaScript & Khai báo biến",
            "chapter_objective": "Nắm vững cú pháp cơ bản, môi trường chạy và khai báo biến an toàn trong JavaScript."
        },
        {
            "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
            "module_id": "JS1-MOD-02",
            "title": "Module 2: Kiểu dữ liệu nguyên thủy & Toán tử",
            "objective": "Làm chủ 7 kiểu dữ liệu nguyên thủy, toán tử số học, so sánh lỏng lẻo vs nghiêm ngặt và toán tử logic ngắn mạch.",
            "duration": "12 giờ",
            "order_index": 2,
            "chapter_id": "JS1-CH-02",
            "chapter_title": "Chương 2: Kiểu dữ liệu nguyên thủy & Toán tử",
            "chapter_objective": "Phân biệt các kiểu dữ liệu và vận dụng thành thạo các phép toán so sánh, logic."
        },
        {
            "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
            "module_id": "JS1-MOD-03",
            "title": "Module 3: Nhập dữ liệu, Ép kiểu & Khái niệm Truthy/Falsy",
            "objective": "Thành thạo cơ chế đọc input trong JS thuần, ép kiểu tường minh, hiểu ép kiểu ngầm định và giá trị Truthy/Falsy.",
            "duration": "10 giờ",
            "order_index": 3,
            "chapter_id": "JS1-CH-03",
            "chapter_title": "Chương 3: Nhập dữ liệu, Ép kiểu & Khái niệm Truthy/Falsy",
            "chapter_objective": "Nắm vững luồng dữ liệu I/O và chuyển đổi kiểu dữ liệu an toàn tránh lỗi NaN."
        },
        {
            "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
            "module_id": "JS1-MOD-04",
            "title": "Module 4: Cấu trúc điều khiển & Rẽ nhánh",
            "objective": "Xây dựng tư duy thuật toán rẽ nhánh với if/else, switch/case, ternary operator và điều kiện lồng nhau.",
            "duration": "12 giờ",
            "order_index": 4,
            "chapter_id": "JS1-CH-04",
            "chapter_title": "Chương 4: Cấu trúc điều khiển & Rẽ nhánh",
            "chapter_objective": "Làm chủ các cấu trúc quyết định logic trong lập trình JavaScript."
        },
        {
            "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
            "module_id": "JS1-MOD-05",
            "title": "Module 5: Vòng lặp & Thuật toán lặp",
            "objective": "Làm chủ for, while, do...while, for...of, kiểm soát bước nhảy với break/continue và thuật toán lặp mảng/chuỗi.",
            "duration": "14 giờ",
            "order_index": 5,
            "chapter_id": "JS1-CH-05",
            "chapter_title": "Chương 5: Vòng lặp & Thuật toán lặp",
            "chapter_objective": "Giải quyết các bài toán tích lũy, đếm, tìm kiếm và thuật toán lặp lồng nhau."
        },
        {
            "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
            "module_id": "JS1-MOD-06",
            "title": "Module 6: Hàm (Function) & Phạm vi biến cơ bản",
            "objective": "Hiểu bản chất hàm trong JS, phân biệt declaration vs expression, arrow function, tham số mặc định và phạm vi hàm.",
            "duration": "14 giờ",
            "order_index": 6,
            "chapter_id": "JS1-CH-06",
            "chapter_title": "Chương 6: Hàm (Function) & Phạm vi biến cơ bản",
            "chapter_objective": "Xây dựng hàm tái sử dụng, thiết kế code theo mô-đun nhỏ và kiểm soát giá trị trả về."
        },
        {
            "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
            "module_id": "JS1-MOD-07",
            "title": "Module 7: Mảng (Array) & Các phương thức xử lý mảng",
            "objective": "Làm chủ cấu trúc mảng, các thao tác biến đổi mảng và các Higher-Order Array Methods (map, filter, reduce, sort).",
            "duration": "16 giờ",
            "order_index": 7,
            "chapter_id": "JS1-CH-07",
            "chapter_title": "Chương 7: Mảng (Array) & Các phương thức xử lý mảng",
            "chapter_objective": "Thành thạo xử lý tập hợp dữ liệu bằng các phương thức mảng hiện đại."
        },
        {
            "course_id": "a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c81",
            "module_id": "JS1-MOD-08",
            "title": "Module 8: Chuỗi (String) & Kỹ thuật xử lý văn bản",
            "objective": "Nắm vững tính bất biến của String, các phương thức tìm kiếm, cắt ghép, thay thế và chuẩn hóa văn bản.",
            "duration": "12 giờ",
            "order_index": 8,
            "chapter_id": "JS1-CH-08",
            "chapter_title": "Chương 8: Chuỗi (String) & Kỹ thuật xử lý văn bản",
            "chapter_objective": "Xử lý văn bản, tách từ, định dạng dữ liệu đầu ra và làm sạch chuỗi."
        },

        # KHÓA 2
        {
            "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
            "module_id": "JS2-MOD-09",
            "title": "Module 9: Đối tượng (Object) & Cấu trúc dữ liệu nâng cao",
            "objective": "Làm việc chuyên sâu với Object, tham chiếu bộ nhớ, deep clone, Object methods, Optional Chaining và Nullish Coalescing.",
            "duration": "14 giờ",
            "order_index": 1,
            "chapter_id": "JS2-CH-09",
            "chapter_title": "Chương 9: Đối tượng (Object) & Cấu trúc dữ liệu nâng cao",
            "chapter_objective": "Làm chủ cấu trúc cặp key-value và kỹ thuật thao tác dữ liệu phức hợp."
        },
        {
            "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
            "module_id": "JS2-MOD-10",
            "title": "Module 10: Modern JavaScript (ES6+) & Kỹ thuật viết code sạch",
            "objective": "Làm chủ Destructuring nâng cao, Spread/Rest Operator, Shorthand properties và cấu trúc dữ liệu Set, Map.",
            "duration": "14 giờ",
            "order_index": 2,
            "chapter_id": "JS2-CH-10",
            "chapter_title": "Chương 10: Modern JavaScript (ES6+) & Kỹ thuật viết code sạch",
            "chapter_objective": "Viết mã nguồn ngắn gọn, tường minh và chuẩn mực theo tiêu chuẩn ES6+ hiện đại."
        },
        {
            "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
            "module_id": "JS2-MOD-11",
            "title": "Module 11: Cơ chế cốt lõi: Scope, Hoisting, Closure & 'this'",
            "objective": "Hiểu tường tận Execution Context, Call Stack, Temporal Dead Zone, Closure và cách hoạt động của từ khóa 'this'.",
            "duration": "16 giờ",
            "order_index": 3,
            "chapter_id": "JS2-CH-11",
            "chapter_title": "Chương 11: Cơ chế cốt lõi: Scope, Hoisting, Closure & 'this'",
            "chapter_objective": "Làm chủ bản chất thực thi ngầm định của JavaScript Engine và kiểm soát ngữ cảnh this."
        },
        {
            "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
            "module_id": "JS2-MOD-12",
            "title": "Module 12: Prototype, OOP & ES6 Classes",
            "objective": "Nắm vững chuỗi Prototype Chain, Constructor functions, cú pháp ES6 class, tính kế thừa và đóng gói hướng đối tượng.",
            "duration": "18 giờ",
            "order_index": 4,
            "chapter_id": "JS2-CH-12",
            "chapter_title": "Chương 12: Prototype, OOP & ES6 Classes",
            "chapter_objective": "Thiết kế hệ thống hướng đối tượng chuyên nghiệp với ES6 Classes và Prototype."
        },
        {
            "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
            "module_id": "JS2-MOD-13",
            "title": "Module 13: Xử lý lỗi (Error Handling), Debugging & Data Validation",
            "objective": "Làm chủ try...catch...finally, cơ chế ném lỗi throw, tạo Custom Error và phương pháp debug, validation dữ liệu an toàn.",
            "duration": "12 giờ",
            "order_index": 5,
            "chapter_id": "JS2-CH-13",
            "chapter_title": "Chương 13: Xử lý lỗi (Error Handling), Debugging & Data Validation",
            "chapter_objective": "Xây dựng chương trình có khả năng chịu lỗi cao và phương pháp kiểm thử dữ liệu nghiêm ngặt."
        },
        {
            "course_id": "b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d92",
            "module_id": "JS2-MOD-14",
            "title": "Module 14: Module hóa mã nguồn & Dự án thuần JavaScript",
            "objective": "Tổ chức kiến trúc dự án với ES Modules, CommonJS, áp dụng Single Responsibility Principle và hoàn thiện Core Project.",
            "duration": "14 giờ",
            "order_index": 6,
            "chapter_id": "JS2-CH-14",
            "chapter_title": "Chương 14: Module hóa mã nguồn & Dự án thuần JavaScript",
            "chapter_objective": "Mô-đun hóa chương trình lớn và tích hợp toàn bộ kiến thức vào dự án JavaScript thuần."
        }
    ]

    for m in modules_data:
        # Check or insert module
        cur.execute("SELECT id FROM modules WHERE module_id = %s;", (m["module_id"],))
        mod_row = cur.fetchone()
        if mod_row:
            mod_id = mod_row[0]
            cur.execute("""
                UPDATE modules SET
                    course_id = %s,
                    title = %s,
                    objective = %s,
                    duration = %s,
                    order_index = %s,
                    updated_at = NOW()
                WHERE id = %s;
            """, (m["course_id"], m["title"], m["objective"], m["duration"], m["order_index"], mod_id))
        else:
            mod_id = str(uuid.uuid4())
            cur.execute("""
                INSERT INTO modules (id, module_id, course_id, title, objective, duration, order_index, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW());
            """, (mod_id, m["module_id"], m["course_id"], m["title"], m["objective"], m["duration"], m["order_index"]))
        print(f"  📦 Module: {m['module_id']} -> {m['title']}")

        # Check or insert chapter
        cur.execute("SELECT id FROM chapters WHERE module_id = %s AND chapter_id = %s;", (mod_id, m["chapter_id"]))
        chap_row = cur.fetchone()
        if chap_row:
            chap_id = chap_row[0]
            cur.execute("""
                UPDATE chapters SET
                    title = %s,
                    objective = %s,
                    order_index = 1,
                    updated_at = NOW()
                WHERE id = %s;
            """, (m["chapter_title"], m["chapter_objective"], chap_id))
        else:
            chap_id = str(uuid.uuid4())
            cur.execute("""
                INSERT INTO chapters (id, chapter_id, module_id, title, objective, order_index, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, 1, NOW(), NOW());
            """, (chap_id, m["chapter_id"], mod_id, m["chapter_title"], m["chapter_objective"]))
        print(f"     📂 Chapter: {m['chapter_id']} -> {m['chapter_title']}")

    conn.close()
    print("\n🎉 Course Metadata Seed Completed Successfully!")

if __name__ == "__main__":
    main()
