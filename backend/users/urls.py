from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework.routers import DefaultRouter

from .views import (
    CashierLoginView,
    EmployeeViewSet,
    LoginView,
    LogoutView,
    MeView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    RefreshTokenView,
    RegisterView,
)

app_name = 'users'

router = DefaultRouter()
router.register('employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('cashier-login/', CashierLoginView.as_view(), name='cashier_login'),
    path('me/', MeView.as_view(), name='me'),
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('forgot-password/', PasswordResetRequestView.as_view(), name='forgot_password'),
    path('reset-password/', PasswordResetConfirmView.as_view(), name='reset_password'),
]

urlpatterns += router.urls
