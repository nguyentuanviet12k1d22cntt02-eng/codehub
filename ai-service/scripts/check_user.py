import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../backend/.env"))
db_url = os.getenv("DATABASE_URL")
if "?schema=" in db_url:
    connection_url = db_url.split("?schema=")[0]
else:
    connection_url = db_url

conn = psycopg2.connect(connection_url)
cursor = conn.cursor()
cursor.execute("SELECT id, email, password FROM users WHERE email='mock_student_001@learnpython.edu';")
row = cursor.fetchone()
print(f"Fetched mock student: {row}")
cursor.close()
conn.close()
