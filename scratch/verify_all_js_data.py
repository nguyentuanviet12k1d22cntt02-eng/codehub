import psycopg2
import subprocess
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

DATABASE_URL = "postgresql://postgres.jzipyxlyfmvltnspdarm:Viet.10092004%40@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

def main():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # 1. Check DB lesson counts
    cur.execute("SELECT COUNT(*) FROM lessons WHERE lesson_id LIKE 'JS1%';")
    k1_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM lessons WHERE lesson_id LIKE 'JS2%';")
    k2_count = cur.fetchone()[0]
    total_lessons = k1_count + k2_count

    print(f"📊 [DATABASE] Khóa 1 (JS Foundations): {k1_count}/32 bài học")
    print(f"📊 [DATABASE] Khóa 2 (JS Advanced):    {k2_count}/28 bài học")
    print(f"📊 [DATABASE] Tổng cộng:               {total_lessons}/60 bài học")

    # 2. Check File counts on disk
    k1_dir = r"d:\Project\LearnPython\docs\Dữ liệu nội dung bài học\JS\Khóa 1 - JavaScript Cơ bản"
    k2_dir = r"d:\Project\LearnPython\docs\Dữ liệu nội dung bài học\JS\Khóa 2 - JavaScript Nâng cao"

    k1_files = []
    for root, _, files in os.walk(k1_dir):
        for f in files:
            if f.endswith(".md"):
                k1_files.append(f)

    k2_files = []
    for root, _, files in os.walk(k2_dir):
        for f in files:
            if f.endswith(".md"):
                k2_files.append(f)

    print(f"\n📁 [MARKDOWN FILES] Khóa 1: {len(k1_files)}/32 files trên đĩa")
    print(f"📁 [MARKDOWN FILES] Khóa 2: {len(k2_files)}/28 files trên đĩa")

    # 3. Check Coding Exercises & Test Cases
    cur.execute("""
        SELECT l.lesson_id, l.title, ce.id, ce.title, ce.solution_code
        FROM lessons l
        JOIN coding_exercises ce ON ce.lesson_id = l.id
        WHERE l.lesson_id LIKE 'JS%'
        ORDER BY l.lesson_id;
    """)
    exercises = cur.fetchall()
    print(f"\n💻 [EXERCISES] Tìm thấy {len(exercises)} bài tập code trong DB.")

    failed_cases = []
    passed_cases = 0

    print("\n⚡ [VERIFICATION SUITE] Đang chạy kiểm thử 100% solutionCode qua Node.js sandbox...")
    for idx, (lesson_id, lesson_title, ex_id, ex_title, solution_code) in enumerate(exercises, 1):
        cur.execute("SELECT input, expected_output, is_hidden FROM test_cases WHERE exercise_id = %s;", (ex_id,))
        test_cases = cur.fetchall()

        if not test_cases:
            failed_cases.append((lesson_id, ex_title, "Không có testcase"))
            continue

        ex_passed = True
        for tc_in, tc_exp, tc_hid in test_cases:
            try:
                proc = subprocess.run(
                    ["node", "-e", solution_code],
                    input=tc_in,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                    capture_output=True,
                    timeout=5
                )
                actual_out = proc.stdout.replace("\r\n", "\n").strip()
                expected_out = tc_exp.replace("\r\n", "\n").strip()

                if actual_out != expected_out:
                    ex_passed = False
                    failed_cases.append((lesson_id, ex_title, f"Mismatch!\nInput: {repr(tc_in)}\nExpected: {repr(expected_out)}\nActual:   {repr(actual_out)}\nStderr:   {proc.stderr}"))
                    break
            except Exception as e:
                ex_passed = False
                failed_cases.append((lesson_id, ex_title, str(e)))
                break

        if ex_passed:
            passed_cases += 1
            sys.stdout.write(f"\r  ✅ [{idx:02d}/60] {lesson_id} - {ex_title[:40]}... PASSED ({len(test_cases)} tests)")
            sys.stdout.flush()

    print("\n")
    if not failed_cases:
        print(f"🎉 TẤT CẢ {passed_cases}/60 BÀI TẬP ĐỀU VƯỢT QUA 100% TESTCASES (ZERO ERRORS)!")
    else:
        print(f"❌ Có {len(failed_cases)} bài tập bị lỗi:")
        for fid, ftitle, ferr in failed_cases:
            print(f"  - [{fid}] {ftitle}: {ferr}")

    conn.close()

if __name__ == "__main__":
    main()
