import os
import sys

# Setup Django path first
sys.path.insert(0, 'c:\\Users\\vinay\\OneDrive\\Desktop\\AI_Interview_App\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')

import django
django.setup()

from core.supabase_client import SupabaseService
supabase = SupabaseService().client
res = supabase.table('screenings').select('*').execute()
print("Screenings:", res.data)
