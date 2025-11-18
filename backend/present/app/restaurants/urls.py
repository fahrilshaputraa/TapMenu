from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import RestaurantViewSet, PublicRestaurantViewSet

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet, basename='restaurant')

public_router = DefaultRouter()
public_router.register(r'', PublicRestaurantViewSet, basename='public-restaurant')

urlpatterns = [
    path('', include(router.urls)),
]

public_urlpatterns = [
    path('', include(public_router.urls)),
]
