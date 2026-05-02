from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets
from .serializers import CustomTokenObtainPairSerializer, RecruiterRegistrationSerializer, UserProfileSerializer
from django.contrib.auth import get_user_model
from notifications.utils import send_approval_email, send_rejection_email

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RecruiterRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RecruiterRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Registration successful. Your request has been sent to the admin for approval. You will receive an email once reviewed."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminApproveRecruiterView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk, role='recruiter')
            if user.is_approved:
                return Response({"message": "Recruiter is already approved."}, status=status.HTTP_200_OK)
            user.is_approved = True
            user.save()
            send_approval_email(user)
            return Response({"message": f"Recruiter {user.email} approved. Notification email sent."})
        except User.DoesNotExist:
            return Response({"error": "Recruiter not found."}, status=status.HTTP_404_NOT_FOUND)

class AdminRejectRecruiterView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk, role='recruiter')
            reason = request.data.get('reason', '')
            send_rejection_email(user, reason)
            user.is_active = False  # Deactivate the account on rejection
            user.save()
            return Response({"message": f"Recruiter {user.email} rejected. Notification email sent."})
        except User.DoesNotExist:
            return Response({"error": "Recruiter not found."}, status=status.HTTP_404_NOT_FOUND)

class PendingRecruitersView(APIView):
    """Returns list of recruiters awaiting approval — for admin dashboard."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        pending = User.objects.filter(role='recruiter', is_approved=False, is_active=True)
        serializer = UserProfileSerializer(pending, many=True)
        return Response(serializer.data)

class CandidateViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(role='candidate')

class RecruiterViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        return User.objects.filter(role='recruiter')
