import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from django.contrib.auth import get_user_model
from jobs.models import Job

def test_db_connection():
    print("Testing Django DB Connection (CockroachDB)...")
    User = get_user_model()
    try:
        user_count = User.objects.count()
        job_count = Job.objects.count()
        print(f"Connection successful!")
        print(f"Total Users in DB: {user_count}")
        print(f"Total Jobs in DB: {job_count}")
        
        # Print first few users
        print("Existing Users:")
        for user in User.objects.all()[:5]:
            print(f"- {user.email} (Role: {user.role})")
            
    except Exception as e:
        print(f"DB Query failed: {e}")

if __name__ == "__main__":
    test_db_connection()
