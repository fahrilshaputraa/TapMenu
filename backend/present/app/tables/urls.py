from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import TableViewSet, TableSessionViewSet, PublicTableViewSet

router = DefaultRouter()
router.register(r'tables', TableViewSet, basename='table')
router.register(r'sessions', TableSessionViewSet, basename='table-session')

public_router = DefaultRouter()
public_router.register(r'', PublicTableViewSet, basename='public-table')

urlpatterns = [
    path('', include(router.urls)),
]

public_urlpatterns = [
    path('', include(public_router.urls)),
]
