from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import AuthViewSet, StaffViewSet, UserProfileView

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]

# Staff URLs (nested under restaurant)
staff_router = DefaultRouter()
staff_router.register(r'staff', StaffViewSet, basename='staff')

staff_urlpatterns = [
    path('', include(staff_router.urls)),
]
