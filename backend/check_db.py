import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.base')
django.setup()

from django.db import connection
cursor = connection.cursor()
cursor.execute("DELETE FROM django_migrations WHERE app='admin'")
print('Deleted admin migrations')
