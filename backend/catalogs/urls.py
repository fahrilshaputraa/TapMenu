from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, MenuItemViewSet, PublicMenuView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'items', MenuItemViewSet, basename='menuitem')

app_name = 'catalogs'

urlpatterns = [
    path('public/menu/', PublicMenuView.as_view(), name='public-menu'),
    path('', include(router.urls)),
]
