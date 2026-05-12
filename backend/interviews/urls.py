from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InviteCandidateView, ValidateSessionView, InterviewViewSet

router = DefaultRouter()
router.register(r'interviews', InterviewViewSet, basename='interview')

urlpatterns = [
    path('', include(router.urls)),
    path('invite/', InviteCandidateView.as_view(), name='invite_candidate'),
    path('validate-session/<str:token>/', ValidateSessionView.as_view(), name='validate_session'),
]
