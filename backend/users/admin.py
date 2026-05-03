from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from notifications.utils import send_approval_email, send_rejection_email

def approve_recruiters(modeladmin, request, queryset):
    count = 0
    for user in queryset.filter(role='recruiter', is_approved=False):
        user.is_approved = True
        user.save()
        # Email is now handled by save_model override below
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

    def save_model(self, request, obj, form, change):
        """Trigger emails when status changes in the admin detail view."""
        if change: # If this is an update
            old_user = User.objects.get(pk=obj.pk)
            # If was NOT approved and now IS approved
            if not old_user.is_approved and obj.is_approved and obj.role == 'recruiter':
                send_approval_email(obj)
        
        super().save_model(request, obj, form, change)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role', 'is_approved', 'is_staff'),
        }),
    )
    filter_horizontal = ()
