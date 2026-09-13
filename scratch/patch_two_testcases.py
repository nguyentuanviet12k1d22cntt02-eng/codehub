import psycopg2
import sys
sys.stdout.reconfigure(encoding='utf-8')

DATABASE_URL = "postgresql://postgres.jzipyxlyfmvltnspdarm:Viet.10092004%40@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

def main():
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cur = conn.cursor()

    # 1. Fix JS1-08.04 testcase
    cur.execute("""
        SELECT ce.id FROM coding_exercises ce
        JOIN lessons l ON l.id = ce.lesson_id
        WHERE l.lesson_id = 'JS1-08.04';
    """)
    ex_id_1 = cur.fetchone()[0]
    cur.execute("""
        UPDATE test_cases
        SET expected_output = 'Cau hoan chinh: lap trinh javascript co ban\nSo tu: 5\nNoi lai: lap-trinh-javascript-co-ban'
        WHERE exercise_id = %s AND input = 'lap_trinh_javascript_co_ban';
    """, (ex_id_1,))
    print("✅ Fixed JS1-08.04 testcase: So tu: 5")

    # 2. Fix JS2-13.04 testcase
    cur.execute("""
        SELECT ce.id FROM coding_exercises ce
        JOIN lessons l ON l.id = ce.lesson_id
        WHERE l.lesson_id = 'JS2-13.04';
    """)
    ex_id_2 = cur.fetchone()[0]
    cur.execute("""
        UPDATE test_cases
        SET input = 'developer test@test.com -5'
        WHERE exercise_id = %s AND input = 'dev test@test.com -5';
    """, (ex_id_2,))
    print("✅ Fixed JS2-13.04 testcase: input developer test@test.com -5")

    conn.close()

if __name__ == "__main__":
    main()
