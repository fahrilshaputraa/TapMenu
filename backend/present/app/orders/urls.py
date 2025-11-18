from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    OrderViewSet, KitchenOrderViewSet, CashierOrderViewSet, PublicOrderViewSet
)

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'kitchen', KitchenOrderViewSet, basename='kitchen-order')
router.register(r'cashier', CashierOrderViewSet, basename='cashier-order')

public_router = DefaultRouter()
public_router.register(r'', PublicOrderViewSet, basename='public-order')

urlpatterns = [
    path('', include(router.urls)),
]

public_urlpatterns = [
    path('', include(public_router.urls)),
]
