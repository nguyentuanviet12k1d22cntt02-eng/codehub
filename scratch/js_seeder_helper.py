import psycopg2
import uuid
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

DATABASE_URL = "postgresql://postgres.jzipyxlyfmvltnspdarm:Viet.10092004%40@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

def save_and_seed_lessons(course_folder_name, lessons):
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cur = conn.cursor()

    base_docs_dir = os.path.join(
        r"d:\Project\LearnPython\docs\Dữ liệu nội dung bài học\JS",
        course_folder_name
    )

    for item in lessons:
        # 1. Save Markdown File
        mod_dir = os.path.join(base_docs_dir, item["module_folder"])
        os.makedirs(mod_dir, exist_ok=True)
        md_path = os.path.join(mod_dir, item["filename"])
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(item["content"])
        print(f"  📄 Saved MD: {item['filename']} -> {item['module_folder']}")

        # 2. Lookup Chapter ID from DB
        cur.execute("SELECT id FROM chapters WHERE chapter_id = %s LIMIT 1;", (item["chapter_id"],))
        chap_row = cur.fetchone()
        if not chap_row:
            raise Exception(f"Chapter ID {item['chapter_id']} not found in DB!")
        chapter_db_id = chap_row[0]

        # 3. Upsert Lesson
        cur.execute("SELECT id FROM lessons WHERE lesson_id = %s;", (item["lesson_id"],))
        les_row = cur.fetchone()
        if les_row:
            lesson_db_id = les_row[0]
            cur.execute("""
                UPDATE lessons SET
                    chapter_id = %s,
                    title = %s,
                    objective = %s,
                    content = %s,
                    difficulty = %s,
                    duration_minutes = %s,
                    order_index = %s,
                    is_free = true,
                    updated_at = NOW()
                WHERE id = %s;
            """, (chapter_db_id, item["title"], item["objective"], item["content"],
                  item["difficulty"], item["duration_minutes"], item["order_index"], lesson_db_id))
        else:
            lesson_db_id = str(uuid.uuid4())
            cur.execute("""
                INSERT INTO lessons (id, lesson_id, chapter_id, title, objective, content, difficulty, duration_minutes, order_index, is_free, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, true, NOW(), NOW());
            """, (lesson_db_id, item["lesson_id"], chapter_db_id, item["title"], item["objective"],
                  item["content"], item["difficulty"], item["duration_minutes"], item["order_index"]))
        print(f"     📖 [Lesson {item['lesson_id']}]: {item['title']}")

        # 4. Upsert Coding Exercise
        ex = item["exercise"]
        ex_title = ex.get("title", "")
        ex_diff = ex.get("difficulty", "EASY")
        ex_prob = ex.get("problem_description") or ex.get("problemDescription", "")
        ex_starter = ex.get("starter_code") or ex.get("starterCode", "")
        ex_sol = ex.get("solution_code") or ex.get("solutionCode", "")
        ex_testcases = ex.get("test_cases") or ex.get("testCases", [])

        cur.execute("SELECT id FROM coding_exercises WHERE lesson_id = %s;", (lesson_db_id,))
        ex_row = cur.fetchone()
        if ex_row:
            exercise_db_id = ex_row[0]
            cur.execute("""
                UPDATE coding_exercises SET
                    title = %s,
                    difficulty = %s,
                    problem_description = %s,
                    starter_code = %s,
                    solution_code = %s,
                    updated_at = NOW()
                WHERE id = %s;
            """, (ex_title, ex_diff, ex_prob, ex_starter, ex_sol, exercise_db_id))
        else:
            exercise_db_id = str(uuid.uuid4())
            cur.execute("""
                INSERT INTO coding_exercises (id, lesson_id, title, difficulty, problem_description, starter_code, solution_code, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW());
            """, (exercise_db_id, lesson_db_id, ex_title, ex_diff, ex_prob, ex_starter, ex_sol))
        print(f"        💻 Exercise: {ex_title}")

        # 5. Refresh Test Cases
        cur.execute("DELETE FROM test_cases WHERE exercise_id = %s;", (exercise_db_id,))
        for tc in ex_testcases:
            tc_id = str(uuid.uuid4())
            tc_in = tc.get("input", "")
            tc_out = tc.get("expected_output") if "expected_output" in tc else tc.get("expectedOutput", "")
            tc_hid = tc.get("is_hidden") if "is_hidden" in tc else tc.get("isHidden", False)
            cur.execute("""
                INSERT INTO test_cases (id, exercise_id, input, expected_output, is_hidden, created_at)
                VALUES (%s, %s, %s, %s, %s, NOW());
            """, (tc_id, exercise_db_id, tc_in, tc_out, tc_hid))
        print(f"        🧪 Seeded {len(ex_testcases)} TestCases")

        # 6. Refresh Quiz Question & Options
        qz = item["quiz"]
        # Delete old questions for this lesson
        cur.execute("SELECT id FROM lesson_quiz_questions WHERE lesson_id = %s;", (lesson_db_id,))
        old_q_rows = cur.fetchall()
        for oq in old_q_rows:
            cur.execute("DELETE FROM lesson_quiz_options WHERE question_id = %s;", (oq[0],))
        cur.execute("DELETE FROM lesson_quiz_questions WHERE lesson_id = %s;", (lesson_db_id,))

        quiz_q_id = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO lesson_quiz_questions (id, lesson_id, question, level, explanation, order_index, created_at, updated_at)
            VALUES (%s, %s, %s, 'MEDIUM', %s, 1, NOW(), NOW());
        """, (quiz_q_id, lesson_db_id, qz["question"], qz["explanation"]))

        for opt in qz["options"]:
            opt_id = str(uuid.uuid4())
            opt_key = opt.get("key", "")
            opt_text = opt.get("text", "")
            opt_correct = opt.get("is_correct") if "is_correct" in opt else opt.get("isCorrect", False)
            cur.execute("""
                INSERT INTO lesson_quiz_options (id, question_id, key, text, is_correct)
                VALUES (%s, %s, %s, %s, %s);
            """, (opt_id, quiz_q_id, opt_key, opt_text, opt_correct))
        print(f"        ❓ Seeded Quiz with {len(qz['options'])} options")

    conn.close()
    print(f"\n🎉 Successfully saved and seeded {len(lessons)} lessons!")
