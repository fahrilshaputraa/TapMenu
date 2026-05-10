from django.urls import path
from .views import CheckoutView, ConfirmPaymentView, WebhookView

app_name = 'payment'

urlpatterns = [
    path('<int:order_id>/checkout/', CheckoutView.as_view(), name='checkout'),
    path('<int:order_id>/confirm/', ConfirmPaymentView.as_view(), name='confirm'),
    path('webhook/', WebhookView.as_view(), name='webhook'),
]
