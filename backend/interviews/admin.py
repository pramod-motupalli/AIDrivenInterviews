from django.contrib import admin
from .models import Interview, Response, AnomalyLog

class ResponseInline(admin.TabularInline):
    model = Response
    extra = 0
    readonly_fields = ('timestamp',)

class AnomalyLogInline(admin.TabularInline):
    model = AnomalyLog
    extra = 0
    readonly_fields = ('timestamp',)

@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'job', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('candidate__email', 'job__title')
    ordering = ('-created_at',)
    inlines = [ResponseInline, AnomalyLogInline]

@admin.register(AnomalyLog)
class AnomalyLogAdmin(admin.ModelAdmin):
    list_display = ('interview', 'event_type', 'severity', 'timestamp')
    list_filter = ('severity',)
