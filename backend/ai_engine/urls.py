from django.urls import path
from .views import ScreeningProcessView

urlpatterns = [
    path('screening/process/', ScreeningProcessView.as_view(), name='screening_process'),
]
