from django.contrib import admin
from .models import JobApplication

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'recruiter', 'job_title', 'created_at')
    list_filter = ('recruiter', 'created_at')
    search_fields = ('job_title', 'recruiter__email')
