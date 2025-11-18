"""
URL configuration for TapMenu QR Restaurant Platform.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView
)

# Import app URL configurations
from app.account.urls import urlpatterns as account_urls, staff_urlpatterns
from app.restaurants.urls import urlpatterns as restaurant_urls, public_urlpatterns as public_restaurant_urls
from app.menu.urls import urlpatterns as menu_urls
from app.tables.urls import urlpatterns as table_urls, public_urlpatterns as public_table_urls
from app.orders.urls import urlpatterns as order_urls, public_urlpatterns as public_order_urls

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Authentication & Account
    path('api/', include(account_urls)),

    # Restaurant Management (Staff)
    path('api/', include(restaurant_urls)),

    # Restaurant-specific endpoints (nested under restaurant_id)
    path('api/restaurants/<int:restaurant_id>/', include(staff_urlpatterns)),
    path('api/restaurants/<int:restaurant_id>/', include(menu_urls)),
    path('api/restaurants/<int:restaurant_id>/', include(table_urls)),
    path('api/restaurants/<int:restaurant_id>/', include(order_urls)),

    # Public endpoints (customer-facing)
    path('api/public/restaurants/', include(public_restaurant_urls)),
    path('api/public/tables/', include(public_table_urls)),
    path('api/public/orders/', include(public_order_urls)),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
