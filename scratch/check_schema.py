import psycopg2

conn = psycopg2.connect('postgresql://postgres.jzipyxlyfmvltnspdarm:Viet.10092004%40@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres')
cur = conn.cursor()

tables = ['courses', 'modules', 'chapters', 'lessons', 'coding_exercises', 'test_cases', 'lesson_quiz_questions', 'lesson_quiz_options']
for tbl in tables:
    cur.execute(f"""
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = '{tbl}'
        ORDER BY ordinal_position;
    """)
    cols = cur.fetchall()
    print(f'=== {tbl} ===')
    for c in cols:
        print(f'  {c[0]} ({c[1]}, nullable: {c[2]})')

conn.close()
