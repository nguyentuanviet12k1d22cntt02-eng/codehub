import os
import json
import random
import csv
import argparse
import uuid
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Determine paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILL_GRAPH_PATH = os.path.join(BASE_DIR, "data", "skill_graph.json")
MOCK_CSV_PATH = os.path.join(BASE_DIR, "data", "mock_user_history.csv")
BACKEND_ENV_PATH = os.path.join(os.path.dirname(BASE_DIR), "backend", ".env")

def get_db_connection():
    if not os.path.exists(BACKEND_ENV_PATH):
        print(f"Backend .env not found at root: {BACKEND_ENV_PATH}")
        return None
    load_dotenv(BACKEND_ENV_PATH)
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found in backend/.env")
        return None
    if "?schema=" in db_url:
        connection_url = db_url.split("?schema=")[0]
    else:
        connection_url = db_url
    try:
        conn = psycopg2.connect(connection_url)
        return conn
    except Exception as e:
        print(f"Could not connect to database: {e}")
        return None

def load_skill_graph():
    try:
        with open(SKILL_GRAPH_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: skill_graph.json was not found at {SKILL_GRAPH_PATH}!")
        return None

def fetch_db_metadata(conn, skill_graph):
    if not conn:
        return {}, {}, {}

    cursor = conn.cursor()
    
    # 1. Fetch lessons helper for mapping UUID -> lesson_id (e.g. LS-01.01)
    cursor.execute("SELECT id, lesson_id, title FROM lessons;")
    lessons_rows = cursor.fetchall()
    lessons_map = {row[0]: row[1] for row in lessons_rows} # UUID -> Lesson Code
    
    # 2. Fetch coding exercises
    cursor.execute("SELECT id, lesson_id, title FROM coding_exercises;")
    exercises_rows = cursor.fetchall()
    
    coding_exercises_metadata = []
    lesson_mappings = skill_graph.get("lesson_mappings", {})
    
    for row in exercises_rows:
        ex_id, lesson_uuid, title = row
        lesson_code = lessons_map.get(lesson_uuid)
        if lesson_code:
            kc_id = lesson_mappings.get(lesson_code)
            if kc_id:
                coding_exercises_metadata.append({
                    "id": ex_id,
                    "lesson_code": lesson_code,
                    "title": title,
                    "kc_id": kc_id
                })
    
    # 3. Fetch practice problems
    cursor.execute("SELECT id, title, slug FROM practice_problems;")
    problems_rows = cursor.fetchall()
    
    practice_problems_metadata = []
    practice_mappings = skill_graph.get("practice_problem_mappings", {})
    
    for row in problems_rows:
        p_id, title, slug = row
        kc_id = practice_mappings.get(slug)
        if kc_id:
            practice_problems_metadata.append({
                "id": p_id,
                "slug": slug,
                "title": title,
                "kc_id": kc_id
            })
            
    cursor.close()
    print(f"Loaded from DB: {len(coding_exercises_metadata)} Coding Exercises, {len(practice_problems_metadata)} Practice Problems.")
    return coding_exercises_metadata, practice_problems_metadata, lessons_map

def generate_mock_data_fallback():
    # If no DB connection, generate placeholder structural items
    print("Falling back to generating stub metadata...")
    coding_exercises = []
    # 10 lessons each with 2 exercises
    for i in range(1, 11):
        lesson_code = f"LS-01.{i:02d}"
        for j in range(1, 3):
            coding_exercises.append({
                "id": f"exercise-uuid-{lesson_code}-{j}",
                "lesson_code": lesson_code,
                "title": f"Exercise {j} of {lesson_code}",
                "kc_id": "KC_VAR" if i <= 10 else "KC_COND" # Simplified
            })
            
    # Mock some loops lessons
    for i in range(1, 9):
        lesson_code = f"LS-02.{i:02d}"
        kc_id = "KC_COND" if i <= 4 else "KC_LOOP"
        for j in range(1, 3):
            coding_exercises.append({
                "id": f"exercise-uuid-{lesson_code}-{j}",
                "lesson_code": lesson_code,
                "title": f"Exercise {j} of {lesson_code}",
                "kc_id": kc_id
            })

    practice_problems = [
        {"id": "problem-uuid-two-sum", "slug": "two-sum", "title": "Two Sum", "kc_id": "KC_DICT"},
        {"id": "problem-uuid-add-two-numbers", "slug": "add-two-numbers", "title": "Add Two Numbers", "kc_id": "KC_LIST"},
        {"id": "problem-uuid-longest-substring", "slug": "longest-substring-without-repeating-characters", "title": "Longest Substring Without Repeating", "kc_id": "KC_LOOP"}
    ]
    return coding_exercises, practice_problems

def simulate_student_history(coding_exercises, practice_problems, num_students=120):
    # Student groups baseline parameter profiles (BKT params)
    student_profiles = {
        "EXCELLENT": {"P_L0": 0.80, "P_T": 0.30, "P_S": 0.05, "P_G": 0.35, "weight": 0.20},
        "AVERAGE": {"P_L0": 0.45, "P_T": 0.18, "P_S": 0.08, "P_G": 0.20, "weight": 0.60},
        "STRUGGLING": {"P_L0": 0.15, "P_T": 0.08, "P_S": 0.15, "P_G": 0.12, "weight": 0.20}
    }
    
    # KCs order to simulate logical learning paths (topological order)
    kc_ordered_list = ["KC_VAR", "KC_COND", "KC_LOOP", "KC_LIST", "KC_DICT", "KC_FUNC", "KC_OOP"]
    
    # Group items by KC
    items_by_kc = {kc: [] for kc in kc_ordered_list}
    for ex in coding_exercises:
        if ex["kc_id"] in items_by_kc:
            items_by_kc[ex["kc_id"]].append({"id": ex["id"], "type": "LESSON", "title": ex["title"]})
            
    for pr in practice_problems:
        if pr["kc_id"] in items_by_kc:
            items_by_kc[pr["kc_id"]].append({"id": pr["id"], "type": "PRACTICE", "title": pr["title"]})
            
    history_records = []
    
    start_date = datetime.now() - timedelta(days=15)
    
    for student_idx in range(1, num_students + 1):
        # Determine student profile
        rand_val = random.random()
        if rand_val < student_profiles["EXCELLENT"]["weight"]:
            profile_name = "EXCELLENT"
        elif rand_val < student_profiles["EXCELLENT"]["weight"] + student_profiles["AVERAGE"]["weight"]:
            profile_name = "AVERAGE"
        else:
            profile_name = "STRUGGLING"
            
        params = student_profiles[profile_name]
        
        student_id = f"student_{student_idx:03d}"
        student_email = f"mock_student_{student_idx:03d}@learnpython.edu"
        student_username = f"Học viên Mô phỏng {student_idx:03d}"
        
        # Track mastery for each KC
        masteries = {kc: params["P_L0"] for kc in kc_ordered_list}
        
        student_time = start_date + timedelta(
            hours=random.randint(0, 48), 
            minutes=random.randint(0, 59)
        )
        
        # Simulate KC-by-KC learning path
        for kc in kc_ordered_list:
            kc_items = items_by_kc[kc]
            if not kc_items:
                continue
            
            # Shuffle items within KC slightly to simulate variety, but keep some structure
            random.sample_list = list(kc_items)
            random.shuffle(random.sample_list)
            
            # Beginner/Struggling students might not complete OOP/Functions in 15 days
            if profile_name == "STRUGGLING" and kc in ["KC_FUNC", "KC_OOP"] and random.random() < 0.5:
                continue
            if profile_name == "AVERAGE" and kc == "KC_OOP" and random.random() < 0.3:
                continue

            for item in random.sample_list:
                # Up to 3 attempts per item
                attempts = 0
                max_attempts = 1 if profile_name == "EXCELLENT" else (2 if profile_name == "AVERAGE" else 3)
                
                while attempts < max_attempts:
                    attempts += 1
                    student_time += timedelta(minutes=random.randint(5, 30))
                    
                    mastery = masteries[kc]
                    p_correct = mastery * (1.0 - params["P_S"]) + (1.0 - mastery) * params["P_G"]
                    
                    correct = 1 if random.random() < p_correct else 0
                    
                    # Store record
                    history_records.append({
                        "user_id": student_id,
                        "email": student_email,
                        "username": student_username,
                        "profile": profile_name,
                        "kc_id": kc,
                        "item_id": item["id"],
                        "item_type": item["type"],
                        "item_title": item["title"],
                        "correct": correct,
                        "attempt_num": attempts,
                        "timestamp": student_time.isoformat()
                    })
                    
                    # Update mastery using BKT formulation
                    if correct == 1:
                        # Bayes Update after Success
                        temp_mastery = (mastery * (1.0 - params["P_S"])) / p_correct
                        # Transition/Learning
                        masteries[kc] = temp_mastery + (1.0 - temp_mastery) * params["P_T"]
                        break # Done with this item!
                    else:
                        # Bayes Update after Failure
                        temp_mastery = (mastery * params["P_S"]) / (1.0 - p_correct)
                        masteries[kc] = temp_mastery + (1.0 - temp_mastery) * params["P_T"]
                        
                        # Retries have a small spacing
                        student_time += timedelta(minutes=random.randint(2, 10))
                        
    print(f"Generated {len(history_records)} submission actions for {num_students} students.")
    return history_records

def save_to_csv(history_records):
    os.makedirs(os.path.dirname(MOCK_CSV_PATH), exist_ok=True)
    with open(MOCK_CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "user_id", "email", "username", "profile", "kc_id", 
            "item_id", "item_type", "item_title", "correct", "attempt_num", "timestamp"
        ])
        writer.writeheader()
        writer.writerows(history_records)
    print(f"Saved simulated learning data successfully to {MOCK_CSV_PATH}")

def seed_database(conn, history_records):
    if not conn:
        print("Cannot seed database: Connection is None.")
        return
        
    try:
        cursor = conn.cursor()
        
        # 1. Deduplicate users and structure them
        unique_users = {}
        for r in history_records:
            if r["user_id"] not in unique_users:
                unique_users[r["user_id"]] = {
                    "email": r["email"],
                    "username": r["username"],
                    "profile": r["profile"]
                }
                
        print(f"Checking existing users in database...")
        
        # Precomputed bcrypt hash for password "123456" (generated using node bcryptjs)
        p_hash = "$2b$10$kOh2Lu3mK6.Z8X1HovbZAOkpmHMiaSuS5.jp/ya0U.VNsAmmLf1x6" 
        
        user_uuid_map = {} # client student_id -> DB User UUID
        
        # Update existing mock users to make sure their password hash is correct
        cursor.execute("UPDATE users SET password = %s WHERE email LIKE 'mock_student_%%@learnpython.edu';", (p_hash,))
        conn.commit()
        print("Updated mock users' password hash in database.")
        
        # Resolve which mock users already exist
        cursor.execute("SELECT id, email FROM users WHERE email LIKE 'mock_student_%%@learnpython.edu';")
        db_users = cursor.fetchall()
        existing_emails = {row[1]: row[0] for row in db_users}
        
        users_to_insert = []
        for client_id, info in unique_users.items():
            if info["email"] in existing_emails:
                user_uuid_map[client_id] = existing_emails[info["email"]]
            else:
                user_uuid = str(uuid.uuid4())
                user_uuid_map[client_id] = user_uuid
                users_to_insert.append((
                    user_uuid, 
                    info["username"], 
                    info["email"], 
                    p_hash, 
                    'STUDENT', 
                    'OTHER', 
                    datetime.now(), 
                    datetime.now()
                ))
                
        if users_to_insert:
            print(f"Bulk inserting {len(users_to_insert)} new mock users into database...")
            execute_values(cursor, """
                INSERT INTO users (id, username, email, password, role, gender, created_at, updated_at)
                VALUES %s
            """, users_to_insert)
            conn.commit()
            print("Users seeded.")
        else:
            print("All mock users already exist in database.")
        
        # 2. Clear old mock submissions
        mock_user_uuids = list(user_uuid_map.values())
        if mock_user_uuids:
            print("Clearing older simulated submissions from mock users...")
            cursor.execute("DELETE FROM submissions WHERE user_id = ANY(%s::uuid[]);", (mock_user_uuids,))
            cursor.execute("DELETE FROM practice_submissions WHERE user_id = ANY(%s::uuid[]);", (mock_user_uuids,))
            conn.commit()
            print("Cleared old records.")
            
        # 3. Add submissions and practice submissions in bulk
        print("Formatting simulated submissions for bulk seeding...")
        
        # Programming code generator stubs
        python_correct_code = "print('Simulated correct solution')"
        python_error_code = "print('Simulated compilation/logic error')\nexit(1)"
        
        sub_records = []
        pr_records = []
        
        for r in history_records:
            user_uuid = user_uuid_map.get(r["user_id"])
            if not user_uuid:
                continue
                
            code = python_correct_code if r["correct"] == 1 else python_error_code
            status = "PASSED" if r["correct"] == 1 else "FAILED"
            runtime = float(random.randint(2, 50))
            sub_time = datetime.fromisoformat(r["timestamp"])
            sub_id = str(uuid.uuid4())
            
            if r["item_type"] == "LESSON":
                sub_records.append((
                    sub_id,
                    user_uuid,
                    r["item_id"],
                    'PYTHON',
                    code,
                    status,
                    runtime,
                    sub_time
                ))
            else:
                pr_records.append((
                    sub_id,
                    user_uuid,
                    r["item_id"],
                    'PYTHON',
                    code,
                    status,
                    runtime,
                    sub_time
                ))
                
        if sub_records:
            print(f"Bulk inserting {len(sub_records)} lesson submissions...")
            execute_values(cursor, """
                INSERT INTO submissions (id, user_id, exercise_id, language, code, status, runtime, submitted_at)
                VALUES %s
            """, sub_records)
            
        if pr_records:
            print(f"Bulk inserting {len(pr_records)} practice submissions...")
            execute_values(cursor, """
                INSERT INTO practice_submissions (id, user_id, problem_id, language, code, status, runtime, submitted_at)
                VALUES %s
            """, pr_records)
            
        conn.commit()
        cursor.close()
        print(f"Seeding completed successfully! (Lesson submissions: {len(sub_records)}, Practice: {len(pr_records)})")
        
    except Exception as e:
        conn.rollback()
        print(f"Error during seeding: {e}")

def main():
    parser = argparse.ArgumentParser(description="Simulate student interaction data.")
    parser.add_argument("--students", type=int, default=120, help="Number of students to simulate")
    parser.add_argument("--seed-db", action="store_true", help="Seed results to PostgreSQL database")
    args = parser.parse_args()
    
    print("Loading skill graph...")
    skill_graph = load_skill_graph()
    if not skill_graph:
        print("Cannot proceed without skill_graph.json!")
        return
        
    print("Connecting to DB (if possible)...")
    conn = get_db_connection()
    
    if conn:
        print("DB connected. Fetching exercise resources...")
        coding_exercises, practice_problems, _ = fetch_db_metadata(conn, skill_graph)
        # If DB is empty, use fallback stubs
        if not coding_exercises:
            print("DB metadata empty. Simulating with fallback stubs.")
            coding_exercises, practice_problems = generate_mock_data_fallback()
    else:
        print("No active DB connection. Simulating using fallback placeholders.")
        coding_exercises, practice_problems = generate_mock_data_fallback()
        
    print("Simulating learning interactions...")
    records = simulate_student_history(coding_exercises, practice_problems, args.students)
    
    print("Saving logs to CSV...")
    save_to_csv(records)
    
    if args.seed_db and conn:
        print("Writing simulations to live PostgreSQL in bulk chunks...")
        seed_database(conn, records)
        conn.close()
        
    print("Interaction simulation complete.")

if __name__ == "__main__":
    main()
