import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from django.db import connection

def fix_schema():
    print("Altering interviews_interview table to drop NOT NULL constraint on obsolete/extra columns...")
    columns_to_alter = ["config", "difficulty", "duration", "interview_type", "round_type"]
    
    with connection.cursor() as cursor:
        for col in columns_to_alter:
            try:
                print(f"Altering {col}...")
                cursor.execute(f"ALTER TABLE interviews_interview ALTER COLUMN {col} DROP NOT NULL")
                print(f"Successfully dropped NOT NULL constraint on {col}!")
            except Exception as e:
                print(f"Failed to alter column {col}: {e}")

if __name__ == "__main__":
    fix_schema()
