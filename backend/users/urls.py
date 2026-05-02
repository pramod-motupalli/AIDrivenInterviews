from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import (
    CustomTokenObtainPairView, RecruiterRegisterView,
    AdminApproveRecruiterView, AdminRejectRecruiterView,
    PendingRecruitersView, CandidateViewSet, RecruiterViewSet
)

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/recruiter/', RecruiterRegisterView.as_view(), name='register_recruiter'),
    path('admin/pending/', PendingRecruitersView.as_view(), name='pending_recruiters'),
    path('admin/approve/<int:pk>/', AdminApproveRecruiterView.as_view(), name='approve_recruiter'),
    path('admin/reject/<int:pk>/', AdminRejectRecruiterView.as_view(), name='reject_recruiter'),
]

router = DefaultRouter()
router.register(r'candidates', CandidateViewSet, basename='candidate')
router.register(r'recruiters', RecruiterViewSet, basename='recruiter')

urlpatterns += router.urls
