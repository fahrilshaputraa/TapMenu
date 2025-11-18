from django.db import models
from django.conf import settings
from django.utils import timezone


class LoyaltyProgram(models.Model):
    """
    Loyalty program configuration for a restaurant.
    """

    restaurant = models.OneToOneField(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='loyalty_program'
    )

    # Program settings
    name = models.CharField(max_length=100, default='Loyalty Points')
    is_active = models.BooleanField(default=True)

    # Points configuration
    points_per_currency = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=1,
        help_text='Points earned per currency unit spent'
    )
    currency_per_point = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=100,
        help_text='Currency value of each point when redeemed'
    )
    min_points_redeem = models.PositiveIntegerField(
        default=100,
        help_text='Minimum points required for redemption'
    )
    max_points_per_order = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text='Maximum points that can be redeemed per order'
    )

    # Expiry settings
    points_expire_days = models.PositiveIntegerField(
        default=365,
        help_text='Days until points expire (0 = never)'
    )

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'loyalty_programs'
        verbose_name = 'Loyalty Program'
        verbose_name_plural = 'Loyalty Programs'

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}"


class CustomerLoyalty(models.Model):
    """
    Customer's loyalty points balance for a specific restaurant.
    """

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='loyalty_accounts'
    )
    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='customer_loyalty'
    )

    # Points balance
    total_points = models.PositiveIntegerField(default=0)
    available_points = models.PositiveIntegerField(default=0)
    redeemed_points = models.PositiveIntegerField(default=0)

    # Membership tier (optional)
    tier = models.CharField(max_length=50, default='bronze')

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'customer_loyalty'
        verbose_name = 'Customer Loyalty'
        verbose_name_plural = 'Customer Loyalty Accounts'
        unique_together = ['customer', 'restaurant']

    def __str__(self):
        return f"{self.customer.email} - {self.restaurant.name} ({self.available_points} pts)"


class PointTransaction(models.Model):
    """
    Record of all point transactions (earned, redeemed, expired).
    """

    TRANSACTION_TYPE_CHOICES = [
        ('earned', 'Earned'),
        ('redeemed', 'Redeemed'),
        ('expired', 'Expired'),
        ('adjusted', 'Adjusted'),
        ('bonus', 'Bonus'),
    ]

    customer_loyalty = models.ForeignKey(
        CustomerLoyalty,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='point_transactions'
    )

    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    points = models.IntegerField()  # Positive for earned/bonus, negative for redeemed/expired
    balance_after = models.PositiveIntegerField()

    description = models.CharField(max_length=255)
    expires_at = models.DateTimeField(blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'point_transactions'
        verbose_name = 'Point Transaction'
        verbose_name_plural = 'Point Transactions'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_type} {abs(self.points)} pts - {self.customer_loyalty.customer.email}"


class LoyaltyTier(models.Model):
    """
    Membership tiers for loyalty program.
    """

    loyalty_program = models.ForeignKey(
        LoyaltyProgram,
        on_delete=models.CASCADE,
        related_name='tiers'
    )

    name = models.CharField(max_length=50)  # Bronze, Silver, Gold, Platinum
    min_points = models.PositiveIntegerField(default=0)
    multiplier = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=1.0,
        help_text='Points multiplier for this tier'
    )
    benefits = models.JSONField(default=list, blank=True)  # List of benefits

    # Visual
    color = models.CharField(max_length=7, default='#CD7F32')
    icon = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = 'loyalty_tiers'
        verbose_name = 'Loyalty Tier'
        verbose_name_plural = 'Loyalty Tiers'
        ordering = ['min_points']
        unique_together = ['loyalty_program', 'name']

    def __str__(self):
        return f"{self.loyalty_program.restaurant.name} - {self.name}"
