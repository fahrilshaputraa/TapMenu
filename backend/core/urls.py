"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from core import views

urlpatterns = [
    path('health/', views.health, name='health'),
    path('api/v1/auth/', include('users.urls', namespace='users')),
    path('api/v1/restaurants/', include('restaurants.urls', namespace='restaurants')),
    path('api/v1/catalogs/', include('catalogs.urls', namespace='catalogs')),
    path('api/v1/settings/', include('settings.urls', namespace='restaurant_settings')),
    path('api/v1/orders/', include('orders.urls', namespace='orders')),
    path('api/v1/payments/', include('payment.urls', namespace='payments')),
    path('api/v1/reports/', include('reports.urls', namespace='reports')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('admin/', admin.site.urls),
]
