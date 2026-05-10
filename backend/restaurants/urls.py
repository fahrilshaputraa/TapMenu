from django.urls import path

from .views import DashboardOverviewView, RestaurantAppearanceView, RestaurantProfileView

app_name = 'restaurants'

urlpatterns = [
    path('me/', RestaurantProfileView.as_view(), name='me'),
    path('appearance/', RestaurantAppearanceView.as_view(), name='appearance'),
    path('overview/', DashboardOverviewView.as_view(), name='overview'),
]