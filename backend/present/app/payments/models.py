from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class PaymentTransaction(models.Model):
    """
    Payment transactions for orders.
    Supports multiple payment gateways (Midtrans, Xendit, etc.)
    """

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
        ('expired', 'Expired'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('qris', 'QRIS'),
        ('bank_transfer', 'Bank Transfer'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('e_wallet', 'E-Wallet'),
        ('va', 'Virtual Account'),
    ]

    GATEWAY_CHOICES = [
        ('manual', 'Manual'),
        ('midtrans', 'Midtrans'),
        ('xendit', 'Xendit'),
        ('doku', 'DOKU'),
    ]

    # Identifiers
    transaction_id = models.CharField(max_length=100, unique=True)
    uuid = models.UUIDField(default=uuid.uuid4, unique=True)

    # Relations
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.CASCADE,
        related_name='payment_transactions'
    )
    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='payment_transactions'
    )

    # Payment details
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)
    gateway = models.CharField(max_length=20, choices=GATEWAY_CHOICES, default='manual')

    # Gateway specific
    gateway_transaction_id = models.CharField(max_length=255, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Additional info
    paid_at = models.DateTimeField(blank=True, null=True)
    expired_at = models.DateTimeField(blank=True, null=True)
    refunded_at = models.DateTimeField(blank=True, null=True)
    refund_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Processed by (for manual payments)
    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_payments'
    )

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payment_transactions'
        verbose_name = 'Payment Transaction'
        verbose_name_plural = 'Payment Transactions'
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.amount} ({self.status})"

    def save(self, *args, **kwargs):
        if not self.transaction_id:
            # Generate transaction ID: PAY-YYYYMMDDHHMMSS-XXXX
            now = timezone.now()
            timestamp = now.strftime('%Y%m%d%H%M%S')
            random_suffix = str(uuid.uuid4())[:4].upper()
            self.transaction_id = f"PAY-{timestamp}-{random_suffix}"
        super().save(*args, **kwargs)


class PaymentMethod(models.Model):
    """
    Payment methods configured for a restaurant.
    """

    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='payment_methods'
    )

    method_type = models.CharField(max_length=50)  # cash, qris, bank_transfer, etc.
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    # Configuration
    gateway = models.CharField(max_length=20, default='manual')
    gateway_config = models.JSONField(default=dict, blank=True)  # API keys, etc.

    # Settings
    is_active = models.BooleanField(default=True)
    min_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    fee_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    fee_fixed = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payment_methods'
        verbose_name = 'Payment Method'
        verbose_name_plural = 'Payment Methods'
        unique_together = ['restaurant', 'method_type']

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"


class Refund(models.Model):
    """
    Refund records for payment transactions.
    """

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    transaction = models.ForeignKey(
        PaymentTransaction,
        on_delete=models.CASCADE,
        related_name='refunds'
    )

    refund_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Gateway response
    gateway_refund_id = models.CharField(max_length=255, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)

    # Processed by
    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='processed_refunds'
    )

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'refunds'
        verbose_name = 'Refund'
        verbose_name_plural = 'Refunds'
        ordering = ['-created_at']

    def __str__(self):
        return f"Refund {self.refund_id} - {self.amount}"
