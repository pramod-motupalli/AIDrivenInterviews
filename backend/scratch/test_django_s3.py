import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

def test_s3_upload():
    print("Testing Django default storage with Supabase S3 endpoint loaded from settings...")
    try:
        content = ContentFile(b"Hello S3 Integration from Settings!")
        file_path = default_storage.save("tests/test_django_s3_integrated.txt", content)
        file_url = default_storage.url(file_path)
        print(f"Upload successful!")
        print(f"Path: {file_path}")
        print(f"URL: {file_url}")
    except Exception as e:
        print(f"Upload failed with error:")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_s3_upload()
