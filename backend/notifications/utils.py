import threading
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

def send_html_email(subject, template_name, context, recipient_list):
    html_content = render_to_string(template_name, context)
    email = EmailMultiAlternatives(
        subject=subject,
        body="Please view this email in an HTML compatible client.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=recipient_list
    )
    email.attach_alternative(html_content, "text/html")
    
    # Synchronous MVP as requested (using a simple thread to avoid blocking response)
    class EmailThread(threading.Thread):
        def run(self):
            try:
                email.send()
            except Exception as e:
                print(f"Failed to send email: {e}")
                
    EmailThread().start()

def send_approval_email(user):
    """Send approval email to a recruiter whose account has been approved."""
    send_html_email(
        subject="✅ Your recruiter account has been approved!",
        template_name="emails/approval_email.html",
        context={
            'login_url': f"{settings.FRONTEND_URL}/login",
            'email': user.email,
        },
        recipient_list=[user.email]
    )

def send_rejection_email(user, reason=''):
    """Send rejection email to a recruiter whose account was rejected."""
    send_html_email(
        subject="❌ Your recruiter account request was not approved",
        template_name="emails/rejection_email.html",
        context={
            'email': user.email,
            'reason': reason or 'Your account did not meet our approval criteria.',
        },
        recipient_list=[user.email]
    )
