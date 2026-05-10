from django.db import models
from orders.models import Order


class PaymentStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    SETTLEMENT = 'settlement', 'Success / Settlement'
    CANCEL = 'cancel', 'Cancelled'
    EXPIRE = 'expire', 'Expired'
    DENY = 'deny', 'Denied'


class PaymentMethod(models.TextChoices):
    CASH = 'cash', 'Cash'
    QRIS = 'qris', 'QRIS'


class PaymentTransaction(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    transaction_id = models.CharField(max_length=255, blank=True, null=True, help_text='Midtrans Transaction ID')
    reference_id = models.CharField(max_length=255, unique=True, help_text='Unique ID sent to Midtrans')
    gross_amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.QRIS)
    provider = models.CharField(max_length=50, blank=True, default='manual')
    payment_type = models.CharField(max_length=50, blank=True, null=True, help_text='e.g. gopay, qris, bank_transfer')
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    payment_url = models.URLField(max_length=500, blank=True, null=True, help_text='Snap checkout URL')
    qr_string = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Payment {self.order_id} - {self.status}'
