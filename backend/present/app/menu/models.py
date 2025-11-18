from django.db import models
from django.utils import timezone


class Category(models.Model):
    """
    Menu categories for organizing products.
    """

    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='categories'
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['sort_order', 'name']
        unique_together = ['restaurant', 'name']

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"


class Product(models.Model):
    """
    Menu products/items that customers can order.
    """

    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='products'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products'
    )

    # Basic info
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)

    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    # Stock management
    is_available = models.BooleanField(default=True)
    stock_quantity = models.PositiveIntegerField(blank=True, null=True)  # None = unlimited
    track_stock = models.BooleanField(default=False)

    # Additional info
    preparation_time = models.PositiveIntegerField(default=15, help_text='Preparation time in minutes')
    calories = models.PositiveIntegerField(blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)  # ['spicy', 'vegetarian', 'halal']

    # Sorting and visibility
    sort_order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['sort_order', 'name']

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"

    @property
    def current_price(self):
        """Return the current selling price (discount if available)."""
        if self.discount_price:
            return self.discount_price
        return self.price


class ProductVariant(models.Model):
    """
    Product variants (e.g., size, flavor).
    """

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )
    name = models.CharField(max_length=100)  # e.g., "Large", "Medium"
    price_adjustment = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_available = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'product_variants'
        verbose_name = 'Product Variant'
        verbose_name_plural = 'Product Variants'
        ordering = ['sort_order']

    def __str__(self):
        return f"{self.product.name} - {self.name}"


class ProductAddon(models.Model):
    """
    Optional add-ons for products (e.g., extra cheese, toppings).
    """

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='addons'
    )
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'product_addons'
        verbose_name = 'Product Addon'
        verbose_name_plural = 'Product Addons'
        ordering = ['sort_order']

    def __str__(self):
        return f"{self.product.name} - {self.name} (+{self.price})"


class Tax(models.Model):
    """
    Tax configurations for restaurants.
    """

    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='taxes'
    )
    name = models.CharField(max_length=100)  # e.g., "PPN", "Service Charge"
    rate = models.DecimalField(max_digits=5, decimal_places=2)  # Percentage
    is_active = models.BooleanField(default=True)
    is_inclusive = models.BooleanField(default=False)  # Tax already included in price

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'taxes'
        verbose_name = 'Tax'
        verbose_name_plural = 'Taxes'

    def __str__(self):
        return f"{self.restaurant.name} - {self.name} ({self.rate}%)"


class Discount(models.Model):
    """
    Discount/promo codes for restaurants.
    """

    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]

    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='discounts'
    )
    code = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # Discount details
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    # Usage limits
    usage_limit = models.PositiveIntegerField(blank=True, null=True)  # None = unlimited
    usage_count = models.PositiveIntegerField(default=0)
    per_user_limit = models.PositiveIntegerField(default=1)

    # Validity
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'discounts'
        verbose_name = 'Discount'
        verbose_name_plural = 'Discounts'
        unique_together = ['restaurant', 'code']

    def __str__(self):
        return f"{self.restaurant.name} - {self.code}"

    @property
    def is_valid(self):
        """Check if discount is currently valid."""
        now = timezone.now()
        if not self.is_active:
            return False
        if self.start_date > now or self.end_date < now:
            return False
        if self.usage_limit and self.usage_count >= self.usage_limit:
            return False
        return True
