import os
import sys
import requests
import psycopg2
from pathlib import Path
from decouple import AutoConfig

BASE_DIR = Path(__file__).resolve().parent.parent
config = AutoConfig(search_path=str(BASE_DIR.parent))

def get_cockroach_tables():
    print("--- CockroachDB Tables ---")
    database_url = config('DATABASE_URL', default='')
    if not database_url:
        print("DATABASE_URL not found in .env")
        return []
    
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
            for idx, table in enumerate(tables, 1):
                print(f"{idx}. {table}")
            return tables
    except Exception as e:
        print(f"Error connecting to CockroachDB: {e}")
        return []

def get_supabase_tables():
    print("\n--- Supabase Tables ---")
    supabase_url = config('SUPABASE_URL', default='')
    supabase_key = config('SUPABASE_KEY', default='')
    if not supabase_url or not supabase_key:
        print("SUPABASE_URL or SUPABASE_KEY not found in .env")
        return []
    
    # Supabase exposes OpenAPI spec at /rest/v1/?apikey=KEY
    url = f"{supabase_url}/rest/v1/"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}"
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            spec = response.json()
            definitions = spec.get('definitions', {})
            tables = list(definitions.keys())
            for idx, table in enumerate(tables, 1):
                print(f"{idx}. {table}")
            return tables
        else:
            print(f"Failed to fetch Supabase OpenAPI spec: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        print(f"Error fetching Supabase tables: {e}")
        return []

if __name__ == "__main__":
    get_cockroach_tables()
    get_supabase_tables()
