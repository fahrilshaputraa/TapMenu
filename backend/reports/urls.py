from django.urls import path

from .views import ReportSummaryView

app_name = 'reports'

urlpatterns = [
    path('summary/', ReportSummaryView.as_view(), name='summary'),
]