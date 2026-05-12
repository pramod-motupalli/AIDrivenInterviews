from django.urls import path
from interviews.consumers import InterviewConsumer

websocket_urlpatterns = [
    path('ws/interview/<str:session_token>/', InterviewConsumer.as_asgi()),
]
