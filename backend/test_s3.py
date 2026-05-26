import os
import django
import sys

# Setup django
sys.path.append('c:/Users/Abhishek/AI_Interview_App/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import traceback

try:
    path = default_storage.save('test.txt', ContentFile(b'test'))
    print("Saved successfully at:", path)
    print("URL:", default_storage.url(path))
except Exception as e:
    print("FAILED TO SAVE!")
    traceback.print_exc()
