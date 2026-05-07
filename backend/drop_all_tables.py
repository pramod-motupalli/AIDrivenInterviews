import psycopg2
from decouple import AutoConfig
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
config = AutoConfig(search_path=str(BASE_DIR.parent))
DATABASE_URL = config('DATABASE_URL')

# Convert cockroach:// to postgresql:// for psycopg2
conn_url = DATABASE_URL.replace('cockroach://', 'postgresql://')

conn = psycopg2.connect(conn_url)
conn.autocommit = True
with conn.cursor() as cursor:
    cursor.execute("""
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public';
    """)
    rows = cursor.fetchall()
    for row in rows:
        table = row[0]
        print(f"Executing: DROP TABLE IF EXISTS \"{table}\" CASCADE;")
        cursor.execute(f"DROP TABLE IF EXISTS \"{table}\" CASCADE;")
    print("Dropped all tables.")
conn.close()
