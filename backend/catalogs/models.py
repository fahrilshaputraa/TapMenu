from decimal import Decimal

from django.db import models


class Category(models.Model):
    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='categories',
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'name']
        constraints = [
            models.UniqueConstraint(fields=['restaurant', 'name'], name='unique_category_name_per_restaurant'),
        ]

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='menu_items',
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=50, blank=True, default='')
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.PositiveSmallIntegerField(default=0)
    tax_percentage = models.PositiveSmallIntegerField(default=10)
    image_url = models.URLField(blank=True, default='')
    track_stock = models.BooleanField(default=False)
    stock_quantity = models.PositiveIntegerField(default=0)
    preparation_time_minutes = models.PositiveSmallIntegerField(default=10)
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    variants = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(fields=['restaurant', 'name'], name='unique_menu_name_per_restaurant'),
        ]

    def __str__(self):
        return self.name

    @property
    def in_stock(self):
        if not self.is_available:
            return False
        if not self.track_stock:
            return True
        return self.stock_quantity > 0

    @property
    def effective_price(self):
        discount_multiplier = Decimal('1') - (Decimal(self.discount_percentage) / Decimal('100'))
        return self.price * discount_multiplier
