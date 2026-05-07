from django.urls import path
from .views import InviteCandidateView, ValidateSessionView

urlpatterns = [
    path('invite/', InviteCandidateView.as_view(), name='invite_candidate'),
    path('validate-session/<str:token>/', ValidateSessionView.as_view(), name='validate_session'),
]
