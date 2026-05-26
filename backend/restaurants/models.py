import uuid

from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Restaurant(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	owner = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='owned_restaurant',
	)
	name = models.CharField(max_length=255)
	slug = models.SlugField(max_length=255, unique=True)
	description = models.TextField(blank=True)
	email = models.EmailField(blank=True)
	phone_number = models.CharField(max_length=30, blank=True)
	address = models.TextField(blank=True)
	currency = models.CharField(max_length=10, default='IDR')
	tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=10)
	service_charge_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
	cash_enabled = models.BooleanField(default=True)
	qris_enabled = models.BooleanField(default=True)
	qris_label = models.CharField(max_length=100, blank=True)
	qris_image_url = models.URLField(blank=True)
	qris_static_payload = models.TextField(blank=True)
	is_open = models.BooleanField(
		default=True, help_text='Master switch to manually open/close the store'
	)
	opening_time = models.TimeField(default='08:00')
	closing_time = models.TimeField(default='22:00')
	operational_days = models.JSONField(
		default=dict,
		blank=True,
		help_text='Map of days to boolean status',
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['name']

	def __str__(self) -> str:
		return self.name

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = slugify(self.name)
		super().save(*args, **kwargs)


class RestaurantAppearance(models.Model):
	restaurant = models.OneToOneField(
		Restaurant,
		on_delete=models.CASCADE,
		related_name='appearance',
	)
	hero_title = models.CharField(max_length=255, default='Pesan langsung dari meja Anda')
	hero_subtitle = models.CharField(
		max_length=255,
		default='Scan QR, pilih menu, lalu bayar tanpa antre.',
	)
	primary_color = models.CharField(max_length=20, default='#1B4332')
	accent_color = models.CharField(max_length=20, default='#E07A5F')
	font_style = models.CharField(max_length=100, default='Plus Jakarta Sans')
	bg_pattern = models.CharField(max_length=50, default='pattern-none')
	bg_color = models.CharField(max_length=20, default='#F7F5F2')
	layout_style = models.CharField(max_length=20, default='list')
	header_style = models.CharField(max_length=20, default='standard')
	show_banner = models.BooleanField(default=True)
	show_profile = models.BooleanField(default=True)
	show_images = models.BooleanField(default=True)
	show_description = models.BooleanField(default=True)
	card_radius = models.PositiveSmallIntegerField(default=12)
	card_shadow = models.PositiveSmallIntegerField(default=1)
	button_style = models.CharField(max_length=20, default='circle')
	logo_url = models.TextField(blank=True)
	cover_image_url = models.TextField(blank=True)

	def __str__(self) -> str:
		return f'Appearance for {self.restaurant.name}'
