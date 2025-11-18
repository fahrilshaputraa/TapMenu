from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom user manager for User model."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('user_type', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model supporting both staff and customer accounts.
    Based on PRD specifications for multi-role authentication.
    """

    USER_TYPE_CHOICES = [
        ('admin', 'Admin'),
        ('kasir', 'Kasir'),
        ('kitchen', 'Kitchen'),
        ('customer', 'Customer'),
    ]

    OAUTH_PROVIDER_CHOICES = [
        ('google', 'Google'),
        ('apple', 'Apple'),
        ('email', 'Email'),
    ]

    # Basic fields
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    # User type and authentication
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='customer')
    oauth_provider = models.CharField(
        max_length=20,
        choices=OAUTH_PROVIDER_CHOICES,
        default='email'
    )
    oauth_id = models.CharField(max_length=255, blank=True, null=True)

    # Status flags
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} ({self.get_user_type_display()})"

    @property
    def is_restaurant_staff(self):
        """Check if user is restaurant staff (admin, kasir, or kitchen)."""
        return self.user_type in ['admin', 'kasir', 'kitchen']


class StaffProfile(models.Model):
    """
    Extended profile for restaurant staff members.
    Links staff to specific restaurants with their roles.
    """

    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('kasir', 'Kasir'),
        ('kitchen', 'Kitchen'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('invited', 'Invited'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='staff_profiles'
    )
    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='staff_members'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='invited')

    # Invitation tracking
    invitation_token = models.CharField(max_length=255, blank=True, null=True)
    invitation_sent_at = models.DateTimeField(blank=True, null=True)
    invitation_accepted_at = models.DateTimeField(blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'staff_profiles'
        verbose_name = 'Staff Profile'
        verbose_name_plural = 'Staff Profiles'
        unique_together = ['user', 'restaurant']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.restaurant.name} ({self.get_role_display()})"


class CustomerProfile(models.Model):
    """
    Extended profile for customer accounts.
    Stores customer-specific data like preferences and loyalty info.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='customer_profile'
    )

    # Preferences
    preferred_language = models.CharField(max_length=10, default='id')
    dietary_preferences = models.JSONField(default=list, blank=True)

    # Loyalty
    total_orders = models.PositiveIntegerField(default=0)
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'customer_profiles'
        verbose_name = 'Customer Profile'
        verbose_name_plural = 'Customer Profiles'

    def __str__(self):
        return f"Customer: {self.user.email}"
