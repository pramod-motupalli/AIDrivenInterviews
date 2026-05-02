from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from jobs.models import Job
from .models import Interview
from notifications.utils import send_html_email
import uuid
from django.conf import settings

User = get_user_model()

class InviteCandidateView(APIView):
    permission_classes = [IsAuthenticated] # Assuming Recruiter

    def post(self, request):
        email = request.data.get('email')
        job_id = request.data.get('job_id')

        if not email or not job_id:
            return Response({"error": "Email and Job ID are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            job = Job.objects.get(id=job_id, recruiter=request.user)
        except Job.DoesNotExist:
            return Response({"error": "Job not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

        user, created = User.objects.get_or_create(email=email, defaults={'role': 'candidate'})
        
        password_sent = None
        if created:
            password_sent = User.objects.make_random_password()
            user.set_password(password_sent)
            user.save()
        else:
            # If user already exists, they use their existing password. We won't send it.
            password_sent = "Your existing password"

        # Create Interview Session
        session_token = str(uuid.uuid4())
        invite_link = f"{settings.FRONTEND_URL}/interview/{session_token}"
        
        interview = Interview.objects.create(
            job=job,
            candidate=user,
            session_token=session_token,
            link1=invite_link
        )

        # Send Email
        context = {
            'job_title': job.title,
            'email': user.email,
            'password': password_sent,
            'invite_link': invite_link
        }
        send_html_email("Interview Invitation", "emails/invite_email.html", context, [user.email])

        return Response({"message": "Candidate invited successfully", "interview_id": interview.id}, status=status.HTTP_201_CREATED)
