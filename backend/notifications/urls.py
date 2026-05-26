from django.urls import path
from .views import (
    NotificationListView,
    MarkAllReadView,
    MarkReadView,
    DeleteNotificationView,
    ClearAllNotificationsView
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('mark-all-read/', MarkAllReadView.as_view(), name='mark-all-read'),
    path('<int:pk>/read/', MarkReadView.as_view(), name='mark-read'),
    path('<int:pk>/', DeleteNotificationView.as_view(), name='delete-notification'),
    path('clear-all/', ClearAllNotificationsView.as_view(), name='clear-all'),
]
