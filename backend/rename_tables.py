import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from django.db import connection

tables_to_rename = {
    'users_user': 'ai_engine_user',
    'users_user_groups': 'ai_engine_user_groups',
    'users_user_user_permissions': 'ai_engine_user_user_permissions',
    'users_adminprofile': 'ai_engine_adminprofile',
    'users_candidateprofile': 'ai_engine_candidateprofile',
    'users_recruiterprofile': 'ai_engine_recruiterprofile',
    'jobs_job': 'ai_engine_job',
    'interviews_anomalylog': 'ai_engine_anomalylog',
    'interviews_candidatereview': 'ai_engine_candidatereview',
    'interviews_interview': 'ai_engine_interview',
    'interviews_response': 'ai_engine_response',
    'reports_report': 'ai_engine_report',
    'notifications_notification': 'ai_engine_notification',
}

apps_to_clear_migrations = ['users', 'jobs', 'interviews', 'reports', 'notifications', 'ai_engine']

with connection.cursor() as cursor:
    # Get existing tables
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    existing_tables = [row[0] for row in cursor.fetchall()]

    # Rename tables
    for old_name, new_name in tables_to_rename.items():
        if old_name in existing_tables and new_name not in existing_tables:
            print(f"Renaming {old_name} to {new_name}")
            cursor.execute(f"ALTER TABLE {old_name} RENAME TO {new_name}")
        elif new_name in existing_tables:
            print(f"Table {new_name} already exists, skipping rename of {old_name}.")
    
    # Clear old migrations
    for app in apps_to_clear_migrations:
        print(f"Clearing migration history for app: {app}")
        cursor.execute("DELETE FROM django_migrations WHERE app = %s", [app])

print("Database tables renamed and old migration history cleared. Run 'python manage.py migrate ai_engine --fake' next.")
