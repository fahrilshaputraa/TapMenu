from django.db import models
from django.utils import timezone
import uuid


class Table(models.Model):
    """
    Restaurant tables that customers can order from.
    """

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('reserved', 'Reserved'),
        ('inactive', 'Inactive'),
    ]

    restaurant = models.ForeignKey(
        'restaurants.Restaurant',
        on_delete=models.CASCADE,
        related_name='tables'
    )
    table_number = models.CharField(max_length=50)
    name = models.CharField(max_length=100, blank=True)  # e.g., "Window Seat"
    capacity = models.PositiveIntegerField(default=4)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')

    # Location info
    floor = models.CharField(max_length=50, blank=True)  # e.g., "1st Floor"
    section = models.CharField(max_length=50, blank=True)  # e.g., "Outdoor"

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tables'
        verbose_name = 'Table'
        verbose_name_plural = 'Tables'
        unique_together = ['restaurant', 'table_number']
        ordering = ['table_number']

    def __str__(self):
        return f"{self.restaurant.name} - Table {self.table_number}"


class QRCode(models.Model):
    """
    QR codes for tables to enable customer ordering.
    """

    table = models.OneToOneField(
        Table,
        on_delete=models.CASCADE,
        related_name='qr_code'
    )
    code = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    # QR customization
    foreground_color = models.CharField(max_length=7, default='#000000')
    background_color = models.CharField(max_length=7, default='#ffffff')
    logo = models.ImageField(upload_to='qr_logos/', blank=True, null=True)

    # Generated QR image
    qr_image = models.ImageField(upload_to='qr_codes/', blank=True, null=True)

    # Stats
    scan_count = models.PositiveIntegerField(default=0)
    last_scanned_at = models.DateTimeField(blank=True, null=True)

    # Status
    is_active = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'qr_codes'
        verbose_name = 'QR Code'
        verbose_name_plural = 'QR Codes'

    def __str__(self):
        return f"QR for {self.table}"

    @property
    def url(self):
        """Generate the URL for this QR code."""
        return f"https://qr.store/{self.table.restaurant.slug}?table={self.table.table_number}&code={self.code}"


class TableSession(models.Model):
    """
    Track active sessions at tables for order management.
    """

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
    ]

    table = models.ForeignKey(
        Table,
        on_delete=models.CASCADE,
        related_name='sessions'
    )
    session_code = models.UUIDField(default=uuid.uuid4, unique=True)

    # Customer info (optional)
    customer = models.ForeignKey(
        'account.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='table_sessions'
    )
    guest_name = models.CharField(max_length=100, blank=True)
    guest_phone = models.CharField(max_length=20, blank=True)

    # Session details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    started_at = models.DateTimeField(default=timezone.now)
    ended_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'table_sessions'
        verbose_name = 'Table Session'
        verbose_name_plural = 'Table Sessions'
        ordering = ['-started_at']

    def __str__(self):
        return f"Session at {self.table} - {self.started_at.strftime('%Y-%m-%d %H:%M')}"
