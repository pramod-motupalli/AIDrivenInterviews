from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'recruiter', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('title', 'recruiter__email')
    ordering = ('-created_at',)
