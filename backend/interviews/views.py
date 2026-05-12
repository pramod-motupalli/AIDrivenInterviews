from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from jobs.models import Job
from .models import Interview
from notifications.utils import send_html_email
import uuid
import secrets
import string
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class InviteCandidateView(APIView):
    permission_classes = [IsAuthenticated] # Assuming Recruiter

    def post(self, request):
        email = request.data.get('email')
        job_id = request.data.get('job_id')
        job_title = request.data.get('job_title') # Support for extracted jobs
        resume_text = request.data.get('resume_text', '') # Fetch resume text from request

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Handle job creation if job_id is not provided
        if not job_id:
            if not job_title:
                return Response({"error": "Job ID or Job Title is required"}, status=status.HTTP_400_BAD_REQUEST)
            job, _ = Job.objects.get_or_create(
                title=job_title, 
                recruiter=request.user,
                defaults={'description': f"Auto-generated job for {job_title}"}
            )
        else:
            try:
                job = Job.objects.get(id=job_id, recruiter=request.user)
            except Job.DoesNotExist:
                return Response({"error": "Job not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

        user, created = User.objects.get_or_create(email=email, defaults={'role': 'candidate'})

        # Always generate a fresh temp password on every invite
        # so the candidate always receives working credentials in their email
        alphabet = string.ascii_letters + string.digits
        temp_password = ''.join(secrets.choice(alphabet) for _ in range(12))
        user.set_password(temp_password)
        user.is_first_login = True
        user.role = 'candidate'
        user.is_active = True
        user.save()

        # Create Interview Session
        session_token = str(uuid.uuid4())
        # Link 1: time-bound candidate interview link
        invite_link = f"{settings.FRONTEND_URL}/interview/{session_token}"
        # Link 2: permanent recruiter tracking link
        tracking_link = f"{settings.FRONTEND_URL}/recruiter/interviews/{session_token}/track"

        interview = Interview.objects.create(
            job=job,
            candidate=user,
            session_token=session_token,
            link1=invite_link,
            link2=tracking_link,
            link1_expiry=timezone.now() + timedelta(hours=settings.SESSION_LINK_EXPIRY_HOURS),
            resume_text=resume_text
        )

        # Send Email with credentials and both links
        context = {
            'job_title': job.title,
            'email': user.email,
            'invite_link': invite_link,
            'tracking_link': tracking_link,
        }
        send_html_email("Interview Invitation", "emails/invite_email.html", context, [user.email])

        return Response({
            "message": "Candidate invited successfully",
            "interview_id": interview.id,
            "session_token": session_token,
            "invite_link": invite_link,
            "tracking_link": tracking_link,
        }, status=status.HTTP_201_CREATED)

class ValidateSessionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            interview = Interview.objects.get(session_token=token)
            
            # Check Expiry
            if interview.link1_expiry and interview.link1_expiry < timezone.now():
                return Response({"error": "Session link has expired"}, status=status.HTTP_403_FORBIDDEN)
            
            refresh = RefreshToken.for_user(interview.candidate)
            return Response({
                "valid": True,
                "candidate_name": interview.candidate.email,
                "job_title": interview.job.title,
                "status": interview.status,
                "access_token": str(refresh.access_token)
            }, status=status.HTTP_200_OK)
            
        except Interview.DoesNotExist:
            return Response({"error": "Invalid session token"}, status=status.HTTP_404_NOT_FOUND)

from rest_framework import viewsets, serializers

class InterviewSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    candidate_email = serializers.CharField(source='candidate.email', read_only=True)

    class Meta:
        model = Interview
        fields = ['id', 'job_title', 'candidate_email', 'status', 'ats_score', 'created_at', 'link1_expiry']
        read_only_fields = ['id', 'job_title', 'candidate_email', 'ats_score', 'created_at', 'link1_expiry']

class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'recruiter':
            return Interview.objects.filter(job__recruiter=user)
        elif user.role == 'candidate':
            return Interview.objects.filter(candidate=user)
        return Interview.objects.none()
