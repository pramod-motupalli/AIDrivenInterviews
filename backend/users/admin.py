from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from notifications.utils import send_approval_email, send_rejection_email

def approve_recruiters(modeladmin, request, queryset):
    for user in queryset.filter(role='recruiter', is_approved=False):
        user.is_approved = True
        user.save()
        send_approval_email(user)
    modeladmin.message_user(request, f"Selected recruiters approved and notified by email.")
approve_recruiters.short_description = "✅ Approve selected recruiters & send email"

def reject_recruiters(modeladmin, request, queryset):
    for user in queryset.filter(role='recruiter', is_approved=False):
        user.is_active = False
        user.save()
        send_rejection_email(user)
    modeladmin.message_user(request, f"Selected recruiters rejected and notified by email.")
reject_recruiters.short_description = "❌ Reject selected recruiters & send email"

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'role', 'is_approved', 'is_active', 'is_staff', 'created_at')
    list_filter = ('role', 'is_approved', 'is_active', 'is_staff')
    search_fields = ('email',)
    ordering = ('-created_at',)
    actions = [approve_recruiters, reject_recruiters]

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
    filter_horizontal = ()
