import uuid

from django.db import models
from django.utils import timezone


class Table(models.Model):
	restaurant = models.ForeignKey(
		'restaurants.Restaurant',
		on_delete=models.CASCADE,
		related_name='tables',
	)
	name = models.CharField(max_length=100)
	code = models.CharField(max_length=50)
	area = models.CharField(max_length=100, blank=True)
	seats = models.PositiveIntegerField(default=4)
	public_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['code']
		constraints = [
			models.UniqueConstraint(fields=['restaurant', 'code'], name='unique_table_code_per_restaurant'),
		]

	def __str__(self) -> str:
		return f'{self.restaurant.name} - {self.code}'


class VoucherType(models.TextChoices):
	PERCENTAGE = 'percentage', 'Percentage'
	FIXED = 'fixed', 'Fixed amount'


class Voucher(models.Model):
	restaurant = models.ForeignKey(
		'restaurants.Restaurant',
		on_delete=models.CASCADE,
		related_name='vouchers',
	)
	code = models.CharField(max_length=50)
	name = models.CharField(max_length=100)
	discount_type = models.CharField(max_length=20, choices=VoucherType.choices)
	amount = models.DecimalField(max_digits=10, decimal_places=2)
	minimum_spend = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	is_active = models.BooleanField(default=True)
	valid_from = models.DateTimeField(null=True, blank=True)
	valid_until = models.DateTimeField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['code']
		constraints = [
			models.UniqueConstraint(fields=['restaurant', 'code'], name='unique_voucher_code_per_restaurant'),
		]

	def __str__(self) -> str:
		return self.code

	def is_valid_for_amount(self, amount):
		now = timezone.now()
		if not self.is_active:
			return False
		if self.valid_from and now < self.valid_from:
			return False
		if self.valid_until and now > self.valid_until:
			return False
		return amount >= self.minimum_spend

	def calculate_discount(self, amount):
		if self.discount_type == VoucherType.PERCENTAGE:
			discount = amount * (self.amount / 100)
			if self.max_discount is not None:
				return min(discount, self.max_discount)
			return discount
		return min(amount, self.amount)
