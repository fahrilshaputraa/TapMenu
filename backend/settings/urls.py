from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import TableViewSet, VoucherViewSet

app_name = 'restaurant_settings'

router = DefaultRouter()
router.register('tables', TableViewSet, basename='table')
router.register('vouchers', VoucherViewSet, basename='voucher')

urlpatterns = [
    path('', include(router.urls)),
]