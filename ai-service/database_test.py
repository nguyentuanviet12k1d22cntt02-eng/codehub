import os
import psycopg2
from dotenv import load_dotenv

# Đọc cấu hình từ file .env của Express Backend
backend_env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))
print(f"Loading env from: {backend_env_path}")
load_dotenv(backend_env_path)

database_url = os.getenv("DATABASE_URL")
if not database_url:
    print("Error: DATABASE_URL not found in backend/.env file!")
    exit(1)

# Loại bỏ phần ?schema=public ở cuối nếu psycopg2 không hỗ trợ parse trực tiếp URL phức tạp
if "?schema=" in database_url:
    connection_url = database_url.split("?schema=")[0]
else:
    connection_url = database_url

print(f"Connecting to database...")

try:
    # Kết nối đến PostgreSQL
    conn = psycopg2.connect(connection_url)
    cursor = conn.cursor()
    
    # 1. Đếm số lượng Users
    cursor.execute("SELECT COUNT(*) FROM users;")
    user_count = cursor.fetchone()[0]
    
    # 2. Đếm số lượng Coding Exercises
    cursor.execute("SELECT COUNT(*) FROM coding_exercises;")
    exercise_count = cursor.fetchone()[0]
    
    # 3. Đếm số lượng Submissions
    cursor.execute("SELECT COUNT(*) FROM submissions;")
    submission_count = cursor.fetchone()[0]

    # 4. Đếm số lượng Practice Submissions
    cursor.execute("SELECT COUNT(*) FROM practice_submissions;")
    practice_sub_count = cursor.fetchone()[0]
    
    print("\n--- KẾT QUẢ KIỂM TRA DỮ LIỆU ---")
    print(f"1. Tổng số Học viên (users): {user_count}")
    print(f"2. Tổng số Bài tập bài học (coding_exercises): {exercise_count}")
    print(f"3. Tổng số Lượt nộp bài học (submissions): {submission_count}")
    print(f"4. Tổng số Lượt nộp thực hành (practice_submissions): {practice_sub_count}")
    print("--------------------------------\n")
    
    if submission_count + practice_sub_count < 100:
        print("Nhận xét: Lịch sử nộp bài (training data) còn khá ít. Chúng ta sẽ cần tạo thêm tập dữ liệu giả lập (mock data) để test thuật toán gợi ý.")
    else:
        print("Nhận xét: Dữ liệu đã tương đối đủ để chạy thử nghiệm các thuật toán ML đơn giản.")

    cursor.close()
    conn.close()

except Exception as e:
    print(f"Database Connection Error: {e}")
