from django.urls import path
from .views import InviteCandidateView

urlpatterns = [
    path('invite/', InviteCandidateView.as_view(), name='invite_candidate'),
]
