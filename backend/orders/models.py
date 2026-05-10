from django.db import models
from django.conf import settings
from django.utils import timezone

from catalogs.models import MenuItem


class OrderStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    PAID = 'PAID', 'Paid'
    PREPARING = 'PREPARING', 'Preparing'
    READY = 'READY', 'Ready to Serve'
    COMPLETED = 'COMPLETED', 'Completed'
    CANCELLED = 'CANCELLED', 'Cancelled'


class OrderChannel(models.TextChoices):
    CUSTOMER = 'customer', 'Customer'
    CASHIER = 'cashier', 'Cashier'


class OrderType(models.TextChoices):
    DINE_IN = 'dine_in', 'Dine in'
    TAKE_AWAY = 'take_away', 'Take away'


def generate_order_code():
    return f'ORD-{timezone.now().strftime("%Y%m%d%H%M%S%f")}'


class Order(models.Model):
    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='orders',
        null=True,
        blank=True,
    )
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    cashier = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='handled_orders',
    )
    table = models.ForeignKey(
        'settings.Table',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
    )
    voucher = models.ForeignKey(
        'settings.Voucher',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
    )
    order_code = models.CharField(max_length=32, unique=True, default=generate_order_code)
    customer_name = models.CharField(max_length=255, blank=True, null=True)
    customer_phone = models.CharField(max_length=30, blank=True, default='')
    table_number = models.CharField(max_length=50, blank=True, null=True)
    order_type = models.CharField(max_length=20, choices=OrderType.choices, default=OrderType.DINE_IN)
    channel = models.CharField(max_length=20, choices=OrderChannel.choices, default=OrderChannel.CUSTOMER)
    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    service_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_method = models.CharField(max_length=20, blank=True, default='')
    paid_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.order_code} - {self.status}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True)
    item_name = models.CharField(max_length=255, default='')
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f'{self.quantity}x {self.item_name}'

    @property
    def subtotal(self):
        return self.quantity * self.unit_price
