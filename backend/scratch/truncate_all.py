import os
import sys
import requests
import psycopg2
from pathlib import Path
from decouple import AutoConfig

BASE_DIR = Path(__file__).resolve().parent.parent
config = AutoConfig(search_path=str(BASE_DIR.parent))

# Tables to truncate in CockroachDB
COCKROACH_TABLES_TO_TRUNCATE = [
    "django_session",
    "django_admin_log",
    "interviews_candidatereview",
    "interviews_anomalylog",
    "interviews_response",
    "interviews_interview",
    "reports_report",
    "jobs_job",
    "users_user_user_permissions",
    "users_user_groups",
    "users_user",
    "auth_group_permissions",
    "auth_group"
]

def print_row_counts(conn, supabase_url, supabase_key):
    print("--- Current Row Counts ---")
    
    # CockroachDB Counts
    with conn.cursor() as cursor:
        cursor.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public';
        """)
        tables = [row[0] for row in cursor.fetchall()]
        for table in sorted(tables):
            cursor.execute(f'SELECT COUNT(*) FROM "{table}";')
            count = cursor.fetchone()[0]
            print(f"  CockroachDB Table: {table:35} | Rows: {count}")
            
    # Supabase Counts
    url = f"{supabase_url}/rest/v1/screenings"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Prefer": "count=exact",
        "Range": "0-0"
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code in [200, 206]:
            content_range = response.headers.get("Content-Range", "")
            print(f"  Supabase Table: screenings | Info: {content_range}")
        else:
            print(f"  Supabase Table: screenings | Failed to get count: {response.status_code}")
    except Exception as e:
        print(f"  Supabase Table: screenings | Error getting count: {e}")

def truncate_cockroach(conn):
    print("\nTruncating CockroachDB tables...")
    with conn.cursor() as cursor:
        # Join tables with quotes to handle any special characters
        tables_str = ", ".join([f'"{t}"' for t in COCKROACH_TABLES_TO_TRUNCATE])
        query = f"TRUNCATE TABLE {tables_str} CASCADE;"
        print(f"Executing query: {query}")
        cursor.execute(query)
    print("CockroachDB tables truncated successfully.")

def truncate_supabase(supabase_url, supabase_key):
    print("\nTruncating Supabase table 'screenings'...")
    # Send a DELETE request with an always-true filter to delete all rows
    url = f"{supabase_url}/rest/v1/screenings?id=neq.00000000-0000-0000-0000-000000000000"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}"
    }
    try:
        response = requests.delete(url, headers=headers)
        if response.status_code in [200, 204]:
            print("Supabase screenings table truncated successfully.")
        else:
            print(f"Failed to truncate Supabase: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error truncating Supabase: {e}")

def main():
    database_url = config('DATABASE_URL', default='')
    supabase_url = config('SUPABASE_URL', default='')
    supabase_key = config('SUPABASE_KEY', default='')
    
    if not database_url:
        print("DATABASE_URL not found!")
        return
        
    conn_url = database_url.replace('cockroach://', 'postgresql://')
    try:
        conn = psycopg2.connect(conn_url)
        conn.autocommit = True
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return
        
    try:
        # 1. Print current counts
        print_row_counts(conn, supabase_url, supabase_key)
        
        # 2. Perform truncation
        truncate_cockroach(conn)
        if supabase_url and supabase_key:
            truncate_supabase(supabase_url, supabase_key)
            
        # 3. Print counts after truncation to verify
        print("\nVerification:")
        print_row_counts(conn, supabase_url, supabase_key)
    finally:
        conn.close()

if __name__ == "__main__":
    main()
