from django.contrib import admin
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('interview', 'overall_score', 'resume_mismatch_flag', 'is_visible_to_candidate', 'created_at')
    list_filter = ('is_visible_to_candidate', 'resume_mismatch_flag')
    search_fields = ('interview__candidate__email',)
    ordering = ('-created_at',)
