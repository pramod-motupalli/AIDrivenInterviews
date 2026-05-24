from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InviteCandidateView, ValidateSessionView, InterviewViewSet, 
    StartInterviewView, SubmitAnswerView, GetResultsView, SubmitReviewView,
    DashboardStatsView, ReportsView, LiveMonitoringDetailView, CandidateDeleteView
)

router = DefaultRouter()
router.register(r'interviews', InterviewViewSet, basename='interview')

urlpatterns = [
    path('', include(router.urls)),
    path('candidate/', CandidateDeleteView.as_view(), name='delete_candidate'),
    path('invite/', InviteCandidateView.as_view(), name='invite_candidate'),
    path('validate-session/<str:token>/', ValidateSessionView.as_view(), name='validate_session'),
    path('start-interview/', StartInterviewView.as_view(), name='start_interview'),
    path('submit-answer/', SubmitAnswerView.as_view(), name='submit_answer'),
    path('get-results/', GetResultsView.as_view(), name='get_results'),
    path('submit-review/', SubmitReviewView.as_view(), name='submit_review'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('reports/', ReportsView.as_view(), name='reports_list'),
    path('reports/<str:pk>/', ReportsView.as_view(), name='reports_detail'),
    path('live-monitoring/<str:session_token>/', LiveMonitoringDetailView.as_view(), name='live_monitoring_detail'),
]
