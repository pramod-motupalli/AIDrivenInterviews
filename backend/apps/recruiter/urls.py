from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='home'),
    path('login/', views.login_view, name='login'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('jobs/', views.jobs_view, name='jobs'),
    path('reports/', views.reports_view, name='reports'),
    path('report/<int:id>/', views.report_detail_view, name='report_detail'),
    path('logout/', views.logout_view, name='logout'),
]
