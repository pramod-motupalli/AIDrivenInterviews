import os
import sys
import django
from io import BytesIO

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
# Note: verify settings path, usually core.settings
# If settings is in backend/core/settings/base.py, then core.settings.base
django.setup()

from core.supabase_client import supabase_service

def test_upload():
    print("Testing Supabase Upload...")
    test_file = BytesIO(b"Hello Supabase!")
    test_filename = "test_file.txt"
    try:
        url = supabase_service.upload_file(test_file, "screening-documents", f"tests/{test_filename}")
        print(f"Upload successful! URL: {url}")
        return url
    except Exception as e:
        print(f"Upload failed: {e}")
        return None

def test_metadata(jd_url, resume_url):
    print("Testing Metadata Insertion...")
    data = {
        "candidate_name": "Test Candidate",
        "candidate_email": "test@example.com",
        "recruiter_email": "recruiter@example.com",
        "jd_url": jd_url,
        "resume_url": resume_url
    }
    try:
        result = supabase_service.save_screening_metadata(data)
        print(f"Metadata saved successfully! Result: {result}")
    except Exception as e:
        print(f"Metadata save failed: {e}")

if __name__ == "__main__":
    url = test_upload()
    if not url:
        print("Upload failed (probably bucket missing), testing metadata with dummy URLs...")
        test_metadata("https://example.com/jd.pdf", "https://example.com/resume.pdf")
    else:
        test_metadata(url, url)
