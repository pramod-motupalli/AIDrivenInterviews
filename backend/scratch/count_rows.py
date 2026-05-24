import os
import sys
import requests
import psycopg2
from pathlib import Path
from decouple import AutoConfig

BASE_DIR = Path(__file__).resolve().parent.parent
config = AutoConfig(search_path=str(BASE_DIR.parent))

def count_cockroach_rows():
    print("--- CockroachDB Table Row Counts ---")
    database_url = config('DATABASE_URL', default='')
    if not database_url:
        print("DATABASE_URL not found in .env")
        return
    
    conn_url = database_url.replace('cockroach://', 'postgresql://')
    try:
        conn = psycopg2.connect(conn_url)
        conn.autocommit = True
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT tablename 
                FROM pg_tables 
                WHERE schemaname = 'public';
            """)
            tables = [row[0] for row in cursor.fetchall()]
            for table in tables:
                cursor.execute(f'SELECT COUNT(*) FROM "{table}";')
                count = cursor.fetchone()[0]
                print(f"Table: {table:35} | Rows: {count}")
    except Exception as e:
        print(f"Error connecting to CockroachDB: {e}")

def count_supabase_rows():
    print("\n--- Supabase Table Row Counts ---")
    supabase_url = config('SUPABASE_URL', default='')
    supabase_key = config('SUPABASE_KEY', default='')
    if not supabase_url or not supabase_key:
        print("SUPABASE_URL or SUPABASE_KEY not found in .env")
        return
    
    url = f"{supabase_url}/rest/v1/screenings"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Prefer": "count=exact"
    }
    try:
        # Fetching with range 0-0 just to get headers
        headers["Range"] = "0-0"
        response = requests.get(url, headers=headers)
        if response.status_code in [200, 206]:
            content_range = response.headers.get("Content-Range", "")
            print(f"Table: screenings | Info: {content_range}")
        else:
            print(f"Failed to fetch screenings count: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error fetching Supabase count: {e}")

if __name__ == "__main__":
    count_cockroach_rows()
    count_supabase_rows()
