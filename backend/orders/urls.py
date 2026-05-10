from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, PublicCreateOrderView, PublicOrderStatusView

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')

app_name = 'orders'

urlpatterns = [
    path('public/', PublicCreateOrderView.as_view(), name='public-create'),
    path('track/<str:order_code>/', PublicOrderStatusView.as_view(), name='track'),
    path('', include(router.urls)),
]
