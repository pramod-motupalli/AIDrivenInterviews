import os
import django
import sys

sys.path.append('c:/Users/vinay/OneDrive/Desktop/AI_Interview_App/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from interviews.models import AnomalyLog
logs = AnomalyLog.objects.all().order_by('-timestamp')[:5]
for log in logs:
    print(log.event_type, "->", log.snapshot_url)
