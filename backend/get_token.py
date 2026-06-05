import os
import django
import sys

sys.path.append('c:/Users/vinay/OneDrive/Desktop/AI_Interview_App/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from interviews.models import Interview
interview = Interview.objects.first()
if interview:
    print(f"Token: {interview.session_token}")
else:
    print("No interview found")
