import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from django.db import connection

def check_table_columns():
    table_name = "interviews_interview"
    print(f"Inspecting table: {table_name}...")
    with connection.cursor() as cursor:
        try:
            # Get columns from table
            cursor.execute(f"SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = %s", [table_name])
            columns = cursor.fetchall()
            print("Columns in database:")
            for col in columns:
                print(f"- {col[0]} ({col[1]}), Nullable: {col[2]}")
        except Exception as e:
            print(f"Failed to inspect columns: {e}")

if __name__ == "__main__":
    check_table_columns()
