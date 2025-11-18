from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.text import slugify


class Restaurant(models.Model):
    """
    Main restaurant model representing a tenant in the multi-tenant system.
    Each restaurant has its own menu, tables, orders, and staff.
    """

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    ]

    CURRENCY_CHOICES = [
        ('IDR', 'Indonesian Rupiah'),
        ('USD', 'US Dollar'),
        ('SGD', 'Singapore Dollar'),
    ]

    # Basic info
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='restaurants/logos/', blank=True, null=True)
    banner = models.ImageField(upload_to='restaurants/banners/', blank=True, null=True)

    # Owner
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_restaurants'
    )

    # Contact info
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)

    # Address
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    province = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, blank=True, null=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)

    # Business settings
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='IDR')
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=11.00)  # PPN 11%
    service_charge = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_open = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'restaurants'
        verbose_name = 'Restaurant'
        verbose_name_plural = 'Restaurants'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Ensure unique slug
            original_slug = self.slug
            counter = 1
            while Restaurant.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)


class RestaurantTheme(models.Model):
    """
    Customizable theme settings for restaurant's customer-facing pages.
    """

    restaurant = models.OneToOneField(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='theme'
    )

    # Colors
    primary_color = models.CharField(max_length=7, default='#667eea')
    secondary_color = models.CharField(max_length=7, default='#764ba2')
    accent_color = models.CharField(max_length=7, default='#f093fb')
    background_color = models.CharField(max_length=7, default='#ffffff')
    text_color = models.CharField(max_length=7, default='#1a1a2e')

    # Typography
    font_family = models.CharField(max_length=100, default='Inter')

    # Layout
    menu_layout = models.CharField(
        max_length=20,
        choices=[('grid', 'Grid'), ('list', 'List')],
        default='grid'
    )

    # Custom CSS (optional)
    custom_css = models.TextField(blank=True)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'restaurant_themes'
        verbose_name = 'Restaurant Theme'
        verbose_name_plural = 'Restaurant Themes'

    def __str__(self):
        return f"Theme for {self.restaurant.name}"


class OperatingHours(models.Model):
    """
    Operating hours for each day of the week.
    """

    DAY_CHOICES = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='operating_hours'
    )
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    open_time = models.TimeField()
    close_time = models.TimeField()
    is_closed = models.BooleanField(default=False)

    class Meta:
        db_table = 'operating_hours'
        verbose_name = 'Operating Hours'
        verbose_name_plural = 'Operating Hours'
        unique_together = ['restaurant', 'day_of_week']
        ordering = ['day_of_week']

    def __str__(self):
        if self.is_closed:
            return f"{self.restaurant.name} - {self.get_day_of_week_display()}: Closed"
        return f"{self.restaurant.name} - {self.get_day_of_week_display()}: {self.open_time} - {self.close_time}"


class RestaurantSettings(models.Model):
    """
    Additional settings for restaurant operations.
    """

    restaurant = models.OneToOneField(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='settings'
    )

    # Order settings
    auto_accept_orders = models.BooleanField(default=False)
    require_table_number = models.BooleanField(default=True)
    allow_takeaway = models.BooleanField(default=True)
    allow_dine_in = models.BooleanField(default=True)

    # Payment settings
    payment_methods = models.JSONField(default=list)  # ['cash', 'qris', 'card']
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Notification settings
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)

    # Receipt settings
    receipt_header = models.TextField(blank=True)
    receipt_footer = models.TextField(blank=True)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'restaurant_settings'
        verbose_name = 'Restaurant Settings'
        verbose_name_plural = 'Restaurant Settings'

    def __str__(self):
        return f"Settings for {self.restaurant.name}"
