import psycopg2
import os
from decouple import config

def test_db():
    url = config('DATABASE_URL')
    print(f"Connecting to DB...")
    try:
        conn = psycopg2.connect(url)
        print("Success!")
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_db()
