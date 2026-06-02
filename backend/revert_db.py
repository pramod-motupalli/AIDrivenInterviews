import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from django.db import connection

tables_to_rename_back = {
    'ai_engine_user': 'users_user',
    'ai_engine_user_groups': 'users_user_groups',
    'ai_engine_user_user_permissions': 'users_user_user_permissions',
    'ai_engine_adminprofile': 'users_adminprofile',
    'ai_engine_candidateprofile': 'users_candidateprofile',
    'ai_engine_recruiterprofile': 'users_recruiterprofile',
    'ai_engine_job': 'jobs_job',
    'ai_engine_anomalylog': 'interviews_anomalylog',
    'ai_engine_candidatereview': 'interviews_candidatereview',
    'ai_engine_interview': 'interviews_interview',
    'ai_engine_response': 'interviews_response',
    'ai_engine_report': 'reports_report',
    'ai_engine_notification': 'notifications_notification',
}

with connection.cursor() as cursor:
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    existing_tables = [row[0] for row in cursor.fetchall()]

    for old_name, new_name in tables_to_rename_back.items():
        if old_name in existing_tables and new_name not in existing_tables:
            print(f"Reverting {old_name} back to {new_name}")
            cursor.execute(f"ALTER TABLE {old_name} RENAME TO {new_name}")

    cursor.execute("DELETE FROM django_migrations WHERE app = 'ai_engine'")
    # We will re-insert the admin migration to mimic what we deleted
    cursor.execute("INSERT INTO django_migrations (app, name, applied) VALUES ('admin', '0001_initial', NOW()) ON CONFLICT DO NOTHING")
    cursor.execute("INSERT INTO django_migrations (app, name, applied) VALUES ('admin', '0002_logentry_remove_auto_add', NOW()) ON CONFLICT DO NOTHING")
    cursor.execute("INSERT INTO django_migrations (app, name, applied) VALUES ('admin', '0003_logentry_add_action_flag_choices', NOW()) ON CONFLICT DO NOTHING")

print("Database reverted to pre-fix state.")
