from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'notification_type', 'unread', 'created_at')
    list_filter = ('notification_type', 'unread', 'created_at')
    search_fields = ('title', 'detail', 'user__email')
