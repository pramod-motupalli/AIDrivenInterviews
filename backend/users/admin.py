from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.admin.models import LogEntry
from .models import User, AdminProxy, RecruiterProxy, CandidateProxy
from notifications.utils import send_approval_email, send_rejection_email

# --- Actions ---

def approve_recruiters(modeladmin, request, queryset):
    count = 0
    for user in queryset.filter(role='recruiter', is_approved=False):
        user.is_approved = True
        user.save()
        send_approval_email(user)
        count += 1
    modeladmin.message_user(request, f"{count} recruiters approved and notified.")
approve_recruiters.short_description = "✅ Approve selected recruiters"

def reject_recruiters(modeladmin, request, queryset):
    count = 0
    for user in queryset.filter(role='recruiter'):
        user.is_active = False
        user.save()
        send_rejection_email(user)
        count += 1
    modeladmin.message_user(request, f"{count} recruiters rejected and notified.")
reject_recruiters.short_description = "❌ Reject selected recruiters"

# --- Base Admin ---

class CommonUserAdmin(BaseUserAdmin):
    list_display = ('email', 'role', 'is_approved', 'is_active', 'is_staff', 'created_at')
    list_filter = ('is_approved', 'is_active', 'is_staff')
    search_fields = ('email',)
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Role & Status', {'fields': ('role', 'is_approved', 'is_first_login')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role', 'is_approved', 'is_staff'),
        }),
    )

# --- Role Specific Admins ---

@admin.register(AdminProxy)
class AdminProxyAdmin(CommonUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(is_staff=True)

@admin.register(RecruiterProxy)
class RecruiterProxyAdmin(CommonUserAdmin):
    actions = [approve_recruiters, reject_recruiters]
    
    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='recruiter')

    def save_model(self, request, obj, form, change):
        if change:
            # Check if the user is being approved for the first time via the edit form
            if not form.initial.get('is_approved') and obj.is_approved:
                send_approval_email(obj)
        super().save_model(request, obj, form, change)

@admin.register(CandidateProxy)
class CandidateProxyAdmin(CommonUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='candidate')

# --- Cleanup ---

# Unregister the original User model to keep sidebar clean
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

# Remove unnecessary activity logs as requested
try:
    admin.site.unregister(LogEntry)
except admin.sites.NotRegistered:
    pass
